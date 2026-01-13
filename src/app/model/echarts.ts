import { RhSafeAny } from '@model';
import { ECharts, EChartsOption } from 'echarts';
import { merge } from 'lodash';
import {
  DataSubscribeConfig,
  FragmentRegisterConfig,
  RhvDisplayInstance,
} from './display-helper';
import { RhBoardBase } from './board-base';

/** echarts图表基类 */
export class RhEchartsChart<T extends RhEchartsChart<any>> {
  /** echarts图表实例 */
  public ec!: ECharts;
  /** 当前最新生成的一份option */
  public option: EChartsOption;
  /** 媒体查询的断点 */
  public mediaQueryPoints: number[] = [
    0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.7, 1.8, 2,
  ];
  /** 缩放系数 */
  public scale: number = 1;
  /** 媒体查询基准值 */
  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 100,
    minHeight: 100,
  };
  /** 颜色列表 */
  colors: RhSafeAny[];
  /** 维度信息 */
  dimensions: string[] = [];
  /** 数据集 */
  dataset: RhSafeAny[] = [];

  /** x轴名称 */
  xAXisName: string = '';
  /** 分割数 */
  splitNumber = 4;
  /** x轴开启旋转 */
  xAXixEnableRotate = false;
  /** y轴名称 */
  yAxisName: string = '';
  /** y轴名称格式化 */
  yAxisNameFormatter: RhSafeAny = '{value}';

  /** 横向标签防重叠间隔 */
  xLabelGap: number;
  /** 纵向标签防重叠间隔 */
  yLabelGap: number;
  /** 网格顶部 */
  gridTop: number;

  /** 图形上的标签字体缩放大小 */
  labelSizeScale: number = 1;
  /** 供option使用的dataset */
  get datasetSource() {
    return [this.dimensions, ...this.dataset];
  }
  /** 从维度信息里解析出来的系列列表 */
  get series() {
    return this.dimensions.slice(1);
  }

  get maxValue() {
    return Math.max(...this.dataset.map((item) => item[1]));
  }
  /** 类目数据 */
  get categories() {
    return this.dataset.map((item) => item[0]);
  }

  /** 分片助手实例 */
  get displayInstance() {
    return this._displayInstance;
  }
  private _displayInstance?: RhvDisplayInstance<
    RhSafeAny,
    RhSafeAny,
    RhSafeAny
  >;

  constructor(
    /** 覆写默认参数 */
    config: Partial<T>,
    /** 分片助手配置 */
    displayConfig?: {
      host: RhBoardBase | null;
      config: FragmentRegisterConfig<RhSafeAny>;
      dataSubscribeConfig: DataSubscribeConfig<RhSafeAny[]>;
      /** echarts图类的特色配置，将接口的数据转换成echarts典型二维表dataset的结构，此转换器的执行早于分片助手的转换器执行，且会自动截取完第一行的维度信息后，将后面的数据体部分传递给分片助手的转换器 */
      convertor: (data: RhSafeAny) => {
        /** 维度信息 */
        dimensions: string[];
        /** 数据集 */
        dataset: RhSafeAny[][];
      };
    }
  ) {
    setTimeout(() => {
      this.option = this.create(config);
      if (displayConfig) {
        this._displayInstance = new RhvDisplayInstance(
          displayConfig.host,
          {
            ...displayConfig.config,
            onValue: (value) => {
              if (
                displayConfig.config.onValue &&
                typeof displayConfig.config.onValue === 'function'
              ) {
                displayConfig.config.onValue(value);
              }
              //console.log(value);
              this.updateDataset(value);
            },
          },
          {
            ...displayConfig.dataSubscribeConfig,
            convertor: (data) => {
              const result = displayConfig.convertor(data);
              this.dimensions = result.dimensions;
              const dataset = displayConfig.dataSubscribeConfig.convertor
                ? displayConfig.dataSubscribeConfig.convertor(result.dataset)
                : result.dataset;
              return dataset;
            },
          }
        );
      }
    });
  }

  setup(ec: ECharts) {
    this.ec = ec;
  }

  /** 通用更新数据集的方法 */
  updateDataset(data: RhSafeAny[]) {
    this.update({
      dataset: data,
    } as RhSafeAny);
  }

  /** 创建option */
  public create(params: Partial<T>) {
    if (typeof params == 'object') {
      for (const key in params) {
        (this as any)[key] = (params as any)[key];
      }
    }
    return this.createOption(this as RhSafeAny);
  }

  /** 更新图表 */
  public update(params: Partial<T>) {
    let option = this.create(params);
    this.option = option;
    if (this.ec) {
      this.ec.setOption(option, true);
    }
  }

  /** 构造基础option */
  protected createBaseOption(c: Partial<T>, rate: number) {
    return {} as EChartsOption;
  }

  /** 生成最终的带媒体查询的option */
  protected createOption(c: Partial<T>) {
    return {
      baseOption: this.createBaseOption(c, 1 * c.scale),
      media: this.mediaQueryPoints.map((rate) => {
        return {
          query: {
            minWidth: this.mediaQueryBaseValue.minWidth * rate,
            minHeight: this.mediaQueryBaseValue.minHeight * rate,
          },
          option: this.createBaseOption(c, rate * c.scale),
        };
      }),
    } as EChartsOption;
  }

  getColor(color: RhSafeAny) {
    return typeof color == 'number' ? this.colors[color] : color;
  }

  merge<P>(p1: P, p2: P) {
    return merge(p1, p2);
  }
}

/** echarts图表需要的数据格式 */
export class RhEchartsChartRequiredDataFormat {
  constructor(
    /** 维度信息 */
    public dimensions: string[],
    /** 数据集 */
    public dataset: RhSafeAny[][]
  ) {}

  static create(obj: Partial<RhEchartsChartRequiredDataFormat>) {
    return Object.assign(new RhEchartsChartRequiredDataFormat([], []), obj);
  }

  static standardValue(dimensions: string[], dataset: RhSafeAny[][]) {
    return RhEchartsChartRequiredDataFormat.create({
      dimensions: dimensions,
      dataset: dataset,
    });
  }

  static onlyData(dataset: RhSafeAny) {
    return RhEchartsChartRequiredDataFormat.create({
      dimensions: [],
      dataset: dataset,
    });
  }
}
