import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  AfterViewInit,
} from '@angular/core';
import { HikvisionHelper, MonitorItem, MsgHelper, uuid } from '@core';
import { RhSafeAny, SelectItem } from '@model';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';

declare const JSPlugin;

@Component({
  selector: 'rh-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css'],
})
export class RhMonitorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() rhTitle: string = '';
  @Input() rhList: MonitorItem[];
  @Input() rhStorageKey: string;
  @Input() rhMaxSize: number = 3;
  @Input() rhDisplayInterval: number = 4 * 60 * 1000;
  @Input() rhNameList: string[] = [];
  @Input() rhHidSegment = true;

  iWndType = 1; // 窗口分割数
  selectDisabled = false;
  fullscreen = false;
  /** 完整的列表 */
  fullList: MonitorItem[] = [];
  /** 搜索值 */
  searchValue: string = '';
  /** 过滤后可见的项目 */
  list: MonitorItem[] = [];
  /** 已选中的项 */
  selectedList: MonitorItem[] = [];
  /** 选项数据 */
  segmentsData: SelectItem[] = [];
  /** 当前选中项 */
  curSelectItem: string;

  showModal = false;

  private subscription: Subscription;
  /** 已选中的项目 */
  selected = new Map<string, MonitorItem>();

  id: string = uuid();

  player: RhSafeAny;

  isDevMode = location.hostname == 'localhost';

  constructor(
    private msgService: NzMessageService,
    private hkHelper: HikvisionHelper
  ) {}

  ngOnInit() {
    this.subscription = this.hkHelper.deviceList$.subscribe((list) => {
      //console.log(list);
      this.fullList = list || [];
      this.filter(this.searchValue);
    });
    this.init();
  }

  ngAfterViewInit(): void {
    this.initPlayer();
  }

  init(
    inputList: MonitorItem[] = this.rhList,
    storageKey: string = this.rhStorageKey
  ) {
    const list = (inputList ||
      JSON.parse(localStorage.getItem(storageKey)) ||
      []) as MonitorItem[];
    if (list && list.length > 0) {
      this.selected.clear();
      this.segmentsData = list.map((item) => {
        this.selected.set(item.indexCode, item);
        return new SelectItem(item.name, item.indexCode);
      });
      //console.log(list);
      this.selectedList = Array.from(this.selected.values());
    } else {
      this.player?.JS_StopRealPlayAll();
      this.selected.clear();
      this.segmentsData = [];
      this.selectedList = [];
    }
  }

  initPlayer() {
    this.player = new JSPlugin({
      szId: this.id, //父窗口id，需要英文字母开头 必填
      szBasePath: './', // 必填,与h5player.min.js的引用路径一致
      iMaxSplit: 4,
      iCurrentSplit: 1,
      openDebug: false,
      mseWorkerEnable: false, //是否开启多线程解码，分辨率大于1080P建议开启，否则可能卡顿
      bSupporDoubleClickFull: true, //是否支持双击全屏，true-双击是全屏；false-双击无响应
      oStyle: {
        borderSelect: '#000', //IS_MOVE_DEVICE ? '#000' : '#FFCC00',
      },
    });
  }

  async play(indexCode: string = this.curSelectItem) {
    try {
      if (!indexCode || this.isDevMode) return;
      const result = await this.hkHelper.getPreviewUrl(indexCode);
      const url = result.url;
      await this.player?.JS_StopRealPlayAll();
      await this.player.JS_Play(
        url,
        { playURL: url, mode: 0, keepDecoder: 0 },
        0
      );
    } catch (error) {
      MsgHelper.ShowErrorMessage(error);
    }
  }

  onClickItem(item: MonitorItem) {
    if (this.selected.has(item.indexCode)) {
      this.selected.delete(item.indexCode);
    } else {
      this.selected.set(item.indexCode, item);
    }
    this.selectedList = Array.from(this.selected.values());
  }

  onOk() {
    const list = this.selectedList;
    if (this.rhStorageKey) {
      localStorage.setItem(this.rhStorageKey, JSON.stringify(list));
    }
    this.init();
    this.showModal = false;
  }

  filter(value: string) {
    this.list = value
      ? this.fullList.filter(
          (item) =>
            item.name.includes(value) ||
            item.regionPathName.includes(value) ||
            item.indexCode.includes(value)
        )
      : [...this.fullList];
    //console.log(this.list, this.fullList);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  trackByIndex(i) {
    return i;
  }
}
