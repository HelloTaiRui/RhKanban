import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { RhSafeAny } from './base';
import { map } from 'rxjs/operators';
//import { v4 as uuidV4 } from 'uuid';
import { RhBoardBase } from './board-base';
import { isInteger, isNumber } from 'lodash';

/** 创建占位文本 */
export const createPlaceholderLabel = (
  length: number = 3,
  char: string = '-'
) => (char + '\u200B').repeat(length);

/** 分片配置 */
export interface FragmentRegisterConfig<T> {
  /** key值 */
  poolKey?: string;
  /** 分片大小。为正数时开启分片，其余情况不启用分片，直接使用所有数据，且不进行填充 */
  fragmentSize?: number;
  /** 初始数据。 */
  dataset?: T[];
  /** 分片切换间隔。为正数时表示使用分片轮播功能。 */
  interval?: number;
  /** 填充方法。用于对数据量不足的分片进行数据填充 */
  fill?: (index?: number) => T;
  /** 滚动播放的步长 */
  step?: number;
  /** 订阅时，是否重置分片状态数据 */
  useNewFragmentDataWhenSubscribe?: boolean;
  /** 从传入的数据中提取出待分片轮播的数据。默认直接使用传入的数据作为待分片轮播的数据 */
  takeToDisplayData?: (data: RhSafeAny) => T[];
  /** 当吐出分片结果时。此钩子的执行早于value$发布新值 */
  onValue?: (value: T[]) => RhSafeAny;
}

/** 数据源订阅配置 */
export class DataSubscribeConfig<T> {
  /** 初始空白数据。注意，这个值作为data的初始值，也就是已经是经过转换处理后的值，不是转换前的值！ */
  emptyData?: () => RhSafeAny;
  /** 数据源接口 */
  data$: Observable<RhSafeAny> | (() => Observable<RhSafeAny>);
  /** 调用间隔 */
  interval: number;
  /** 数据转换器 */
  convertor?: (data: RhSafeAny) => T;
  /** 当拿到数据时。此钩子的执行早于data$发布新值。 */
  onData?: (data: T) => RhSafeAny;
  /** 忽略空白数据。当拿到新一批数据的时候，如果新的数据是空的，或者经过转换后的数据是空的话，就不应用本次数据。反之，会正常走下去。 */
  ignoreEmptyData?: boolean = false;
}

/** 高级配置 */
export interface AdvancedConfig {
  /** 不推送初始数据 */
  noInitialData: boolean;
  /** 取消订阅后，清除当前分片注册的数据 */
  clearFragmentDataWhenUnsubscribe: boolean;
}

/** 分片轮播进度状态数据 */
export class RhvDisplayFragment<T> {
  /** 是否为配置过的原始状态 */
  public initial = true;
  /** 对外提供的分片后的数据 */
  value$: BehaviorSubject<T[]>;

  /** 当吐出分片结果时。此钩子的执行早于value$发布新值 */
  private onValue?: (value: T[]) => RhSafeAny;

  constructor(
    /** 起始数据项的索引（包含在当前分片内） */
    public StartIndex: number = -1,
    /** 截止数据项的索引（不包含在当前分片内） */
    public EndIndex: number = 0,
    /** 每片的（最大）数据项个数 */
    public FragmentSize: number = 0,
    /** 标记当前是第几片。从1开始标号。不断递增。每分一次片就+1 */
    public CurFragmentNo: number = 0,
    /** 数据填充方法 */
    public fill?: (index?: number) => T,
    /** 步长模式下的步长值 */
    public Step?: number
  ) {}
  /** 是否是轮播数据新的一圈的开始。 */
  get isBeginOfNewRound() {
    return this.StartIndex == 0 && this.CurFragmentNo != 1;
  }
  /** 设置分片 */
  setup(config: FragmentRegisterConfig<T>) {
    if (typeof config === 'object' && config) {
      this.StartIndex = config.step
        ? -1 * config.step
        : -1 * config.fragmentSize;
      this.EndIndex = 0;
      this.FragmentSize = config.fragmentSize;
      this.CurFragmentNo = 0;
      this.fill = config.fill;
      this.Step = config.step;
      this.initial = false;
      this.onValue = config.onValue;
    }
  }
  /** 播放下一片 */
  next(data: RhSafeAny) {
    if (this.initial) return;
    const value = this.nextFragment(data);
    if (this.onValue) {
      this.onValue(value);
    }
    this.value$.next(value);
    return value;
  }

  /**
   * 分片的下一组数据
   * 如果传入数据为空，或数组大小为0，则直接返回空数组。
   * 新的分片如果长度不足设定的大小，则根据填充方法进行填充。
   * 最后，返回分片数据。
   */
  private nextFragment(data: T[]) {
    const config = this;
    if (isInteger(config.Step) && config.Step > 0) {
      //步进模式
      if (!data || !Array.isArray(data)) data = []; //重置无效数据为空数组
      if (data.length <= config.FragmentSize) {
        //如果数据长度不足，不执行步进
        if (!config.fill) return [...data]; //不填充，直接返回数据
        const curResult = [...data]; //注意，此处直接在原始数据上做填充，避免反复填充
        for (let i = data.length; i < config.FragmentSize; i++) {
          curResult.push(config.fill(i));
        }
        return curResult; //返回填充后的数据
      }
      config.StartIndex += config.Step; //步进
      if (config.StartIndex >= data.length) {
        //从头开始
        config.StartIndex = config.StartIndex - data.length; //步进到下一个节点
      }
      config.EndIndex = config.StartIndex + config.FragmentSize; //计算截止点
      config.CurFragmentNo += 1; //记录分片迭代
      //console.log(config.StartIndex, config.EndIndex, data);
      return [...data, ...data].slice(config.StartIndex, config.EndIndex); //截取分片数据
    } else if (isInteger(config.FragmentSize) && config.FragmentSize > 0) {
      if (!data || !Array.isArray(data)) data = []; //重置无效数据为空数组
      //普通的切片模式
      config.StartIndex += config.FragmentSize; //切下一片
      if (config.StartIndex >= data.length) {
        //从头开始
        config.StartIndex = 0;
      }
      config.EndIndex = config.StartIndex + config.FragmentSize; //计算截止点
      config.CurFragmentNo += 1; //记录分片迭代
      const curResult = data.slice(config.StartIndex, config.EndIndex); //截取分片数据
      if (!config.fill) return curResult; //不填充数据，直接返回
      for (let i = curResult.length; i < config.FragmentSize; i++) {
        //执行数据填充
        curResult.push(config.fill(i));
      }
      return curResult;
    } else {
      return data; //原样返回
    }
  }
}

/** 分片助手配置管理 */
export class RhvDisplayInstance<FragmentValueType, DataType, Dataset> {
  /** 数据源数据订阅（注意，是经过转换器转换后的数据） */
  get data$() {
    return this.dataSubscriber.data$;
  }
  /** 对外提供数据源当前数据的访问 */
  get data() {
    return this.dataSubscriber.data;
  }
  /** 对外提供分片后的值的订阅 */
  get value$() {
    return this.dataDisplayManager.value$;
  }
  /** 对外提供分片后的值的访问 */
  get value() {
    return this.dataDisplayManager.value;
  }
  /** 挂载到宿主看板上，用于在组件销毁时销毁内部订阅 */
  private instance$ = new Observable((subscriber) => {
    subscriber.next(this);
    return () => {
      //console.log('实例销毁！');
      this.dataSubscriber.destroy();
      this.data$.complete();
      this.dataDisplayManager.destroy();
    };
  });
  /** 总体订阅 */
  private entrySubscription: Subscription = this.instance$.subscribe(() => {});
  /** 数据订阅 */
  private dataSubscriber: RhvDataSubscriber<DataType>;

  /** 数据轮播实例 */
  private dataDisplayManager: RhvDataDisplay<FragmentValueType>;

  constructor(
    /** 宿主看板节点 */
    public host: RhBoardBase | null,
    /** 分片轮播配置 */
    public _config?: FragmentRegisterConfig<FragmentValueType>,
    /** 数据订阅配置 */
    public _dataSubscribeConfig?: DataSubscribeConfig<DataType>,
    /** 局部数据集空间。可以按需存放数据 */
    public dataset?: Dataset
  ) {
    host?.addSubscription(this.entrySubscription);
    this.init();
  }
  /** 重载数据。重新进行数据订阅以重新获取数据。 */
  public reloadData() {
    this.dataSubscriber.reload();
  }

  private init() {
    this.setupDataSubscribe();
    this.setupDataDisplay();
  }

  /** 初始化数据订阅 */
  private setupDataSubscribe() {
    this.dataSubscriber = new RhvDataSubscriber(this._dataSubscribeConfig);
  }
  /** 初始化数据轮播 */
  private setupDataDisplay() {
    if (!this._config) return;
    this.dataDisplayManager = new RhvDataDisplay(
      this._config,
      this.dataSubscriber.data$ as RhSafeAny
    );
  }

  /**
   * 结合分片大小和填充方法，填充指定数据源数组。
   * @param data 已有数据源
   * @param blockSize 分片大小
   * @param fill 填充空白数据的方法
   */
  static fillData<Data>(
    data: Data[],
    blockSize: number,
    fill: (index?: number) => Data
  ) {
    if (typeof fill !== 'function' || !fill) return data;
    let det = 0;
    if (data.length > 0) {
      det = blockSize - (data.length % blockSize);
      if (det == blockSize) return data;
    } else {
      det = blockSize;
    }
    const startIndex = data.length;
    for (let i = startIndex; i < startIndex + det; i++) {
      data.push(fill(i));
    }
    return data;
  }
}

/** 数据订阅 */
export class RhvDataSubscriber<DataType> {
  /** 数据源数据订阅（注意，是经过转换器转换后的数据） */
  public data$?: BehaviorSubject<DataType>;
  /** 对外提供数据定位 */
  public data: DataType;
  /** 轮询定时器 */
  private dataTimerSubscription?: Subscription;
  /** 数据源订阅 */
  private dataSubscription?: Subscription;
  constructor(public config: DataSubscribeConfig<DataType>) {
    this.setupDataSubscribe();
  }

  /** 初始化数据订阅 */
  private setupDataSubscribe() {
    const config = this.config;
    if (!config) return;
    if (!this.data$) {
      this.data$ = new BehaviorSubject<DataType>(
        config.emptyData ? config.emptyData() : []
      );
    }
    this.data = this.data$.value;
    this.dataTimerSubscription?.unsubscribe();
    this.dataSubscription?.unsubscribe();
    if (isNumber(config.interval) && config.interval > 0) {
      this.dataTimerSubscription = timer(0, config.interval).subscribe(() => {
        this.dataSubscription = (
          typeof config.data$ == 'function' ? config.data$() : config.data$
        ).subscribe((data) => this.emitData(data));
      });
    } else {
      this.dataSubscription = (
        typeof config.data$ == 'function' ? config.data$() : config.data$
      ).subscribe((data) => this.emitData(data));
    }
  }
  /** 手动重新获取数据 */
  public reload() {
    this.setupDataSubscribe();
  }

  /**
   * 触发数据
   * emit的是未经处理的接口数据，内部会走转换、分片的处理逻辑。此方法为public，也就是说，特定需求时，可以外部手动emitData
   */
  public emitData(data: RhSafeAny) {
    const config = this.config;
    if (config.convertor && typeof config.convertor == 'function') {
      data = config.convertor(data);
    }
    if (config.onData && typeof config.onData === 'function') {
      config.onData(data);
    }
    this.data = data;
    this.data$.next(data);
  }
  public destroy() {
    this.dataTimerSubscription?.unsubscribe();
    this.dataSubscription?.unsubscribe();
    this.data$?.complete();
    this.data$?.unsubscribe();
  }
}

/** 数据轮播 */
export class RhvDataDisplay<FragmentValueType> {
  /** 是否为配置过的原始状态 */
  public initial = true;
  /** 对外提供的分片后的数据 */
  value$ = new BehaviorSubject<FragmentValueType[]>([]);
  /** 对外提供的分片轮播的数据 */
  public value: FragmentValueType[] = [];

  /** 当吐出分片结果时。此钩子的执行早于value$发布新值 */
  private onValue?: (value: FragmentValueType[]) => RhSafeAny;

  /** 起始数据项的索引（包含在当前分片内） */
  public StartIndex: number = -1;
  /** 截止数据项的索引（不包含在当前分片内） */
  public EndIndex: number = 0;
  /** 每片的（最大）数据项个数 */
  public FragmentSize: number = 0;
  /** 标记当前是第几片。从1开始标号。不断递增。每分一次片就+1 */
  public CurFragmentNo: number = 0;
  /** 数据填充方法 */
  public fill?: (index?: number) => FragmentValueType;
  /** 步长模式下的步长值 */
  public Step?: number;

  /** 轮播订阅 */
  private displayTimerSubscription?: Subscription;
  /** 数据订阅 */
  private dataSubscription?: Subscription;

  /** 订阅到的原始数据 */
  private rawData: RhSafeAny;
  /** 处理后的待分片的原始数据 */
  private data: FragmentValueType[];

  constructor(
    /** 分片轮播配置 */
    public config: FragmentRegisterConfig<FragmentValueType>,
    /** 数据源 */
    public data$: Observable<FragmentValueType[]>
  ) {
    this.dataSubscription = this.data$.subscribe((data) => {
      this.rawData = data;
      this.data = this.takeToDisplayData(data);
      this.setupDataDisplay(config);
    });
  }

  /** 设置分片 */
  setup(config: FragmentRegisterConfig<FragmentValueType> = this.config) {
    if (typeof config === 'object' && config) {
      this.StartIndex = config.step
        ? -1 * config.step
        : -1 * config.fragmentSize;
      this.EndIndex = 0;
      this.FragmentSize = config.fragmentSize;
      this.CurFragmentNo = 0;
      this.fill = config.fill;
      this.Step = config.step;
      this.initial = false;
      this.onValue = config.onValue;
    }
  }

  /**
   * 轮播数据
   * 每次拿到新数据后，都要重新开定时器，因为正常效果下，没拿到首次的数据前，轮播是不会跑的，因为只有初始的空白占位数据，这段时间相当于是等待期，直到拿到首次数据后，轮播定时器才有从此刻启动的意义。
   *
   */
  public setupDataDisplay(
    config: FragmentRegisterConfig<FragmentValueType> = this.config
  ) {
    if (!config) return;
    if (this.initial) {
      this.setup(config);
    }
    if (isNumber(config.interval) && config.interval > 0) {
      this.displayTimerSubscription?.unsubscribe();
      this.displayTimerSubscription = timer(0, config.interval).subscribe(
        () => {
          this.nextData(this.data);
        }
      );
    } else {
      this.setup(config); //重置，并推送第一片数据
      let value = this.data;
      if (config.fragmentSize > 0 && Array.isArray(value)) {
        if (value.length < config.fragmentSize) {
          RhvDisplayInstance.fillData(value, config.fragmentSize, config.fill);
        } else {
          value = value.slice(value.length - config.fragmentSize);
        }
        this.FragmentSize = 0;
        this.Step = 0;
      }
      this.nextData(value);
    }
  }

  /** 吐出分片数据 */
  private nextData(value: RhSafeAny) {
    const result = this.next(value);
    this.value = result;
  }

  /** 取出待分片轮播的数据 */
  private takeToDisplayData(data: RhSafeAny) {
    return this.config.takeToDisplayData
      ? this.config.takeToDisplayData(data)
      : data;
  }

  /** 播放下一片 */
  next(data: RhSafeAny) {
    if (this.initial) return this.value$.value;
    const value = this.nextFragment(data);
    if (this.onValue) {
      this.onValue(value);
    }
    this.value$.next(value);
    return value;
  }

  /**
   * 分片的下一组数据
   * 如果传入数据为空，或数组大小为0，则直接返回空数组。
   * 新的分片如果长度不足设定的大小，则根据填充方法进行填充。
   * 最后，返回分片数据。
   */
  private nextFragment(data: FragmentValueType[]) {
    const config = this;
    if (isInteger(config.Step) && config.Step > 0) {
      //步进模式
      if (!data || !Array.isArray(data)) data = []; //重置无效数据为空数组
      if (data.length <= config.FragmentSize) {
        //如果数据长度不足，不执行步进
        if (!config.fill) return [...data]; //不填充，直接返回数据
        const curResult = [...data]; //注意，此处直接在原始数据上做填充，避免反复填充
        for (let i = data.length; i < config.FragmentSize; i++) {
          curResult.push(config.fill(i));
        }
        return curResult; //返回填充后的数据
      }
      config.StartIndex += config.Step; //步进
      if (config.StartIndex >= data.length) {
        //从头开始
        config.StartIndex = config.StartIndex - data.length; //步进到下一个节点
      }
      config.EndIndex = config.StartIndex + config.FragmentSize; //计算截止点
      config.CurFragmentNo += 1; //记录分片迭代
      //console.log(config.StartIndex, config.EndIndex, data);
      return [...data, ...data].slice(config.StartIndex, config.EndIndex); //截取分片数据
    } else if (isInteger(config.FragmentSize) && config.FragmentSize > 0) {
      if (!data || !Array.isArray(data)) data = []; //重置无效数据为空数组
      //普通的切片模式
      config.StartIndex += config.FragmentSize; //切下一片
      if (config.StartIndex >= data.length) {
        //从头开始
        config.StartIndex = 0;
      }
      config.EndIndex = config.StartIndex + config.FragmentSize; //计算截止点
      config.CurFragmentNo += 1; //记录分片迭代
      const curResult = data.slice(config.StartIndex, config.EndIndex); //截取分片数据
      if (!config.fill) return curResult; //不填充数据，直接返回
      for (let i = curResult.length; i < config.FragmentSize; i++) {
        //执行数据填充
        curResult.push(config.fill(i));
      }
      return curResult;
    } else {
      return data; //原样返回
    }
  }
  /** 销毁 */
  destroy() {
    this.displayTimerSubscription?.unsubscribe();
    this.value$?.complete();
    this.dataSubscription?.unsubscribe();
  }
}
