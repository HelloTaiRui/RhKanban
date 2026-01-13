import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { RhmNumberHelper } from '@core';
import { RhBoardData } from '@model';
import { addDays, format } from 'date-fns';
import { isNil, last } from 'lodash';

/** 时间线刻度 */
class RhTimelineTick {
  constructor(
    public state: string,
    public left: string,
    public width: string,
    public startTime: string,
    public endTime: string
  ) {}
}

@Component({
  selector: 'rh-status-timeline',
  templateUrl: './status-timeline.component.html',
  styleUrls: ['./status-timeline.component.less'],
})
export class RhStatusTimelineComponent implements OnInit, OnChanges {
  /** 看板数据 */
  @Input() rhData: RhBoardData;
  /** 状态名称映射 */
  @Input() rhStateNameMap: Record<string, string> = {};
  /** 背景色映射 */
  @Input() rhBgColorMap: Record<string, string> = {};
  /** 当前时间 */
  @Input() rhCurTime: Date;
  /** 开始时间 */
  @Input() rhStartTime: (curTime: Date) => number = (curTime) =>
    new Date(format(new Date(curTime), 'yyyy/MM/dd 00:00:00')).getTime();
  /** 结束时间 */
  @Input() rhEndTime: (curTime: Date) => number = (curTime) =>
    new Date(
      format(addDays(new Date(curTime), 1), 'yyyy/MM/dd 00:00:00')
    ).getTime();

  /** 时间线刻度 */
  ticks: RhTimelineTick[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.init(changes.rhData?.currentValue);
  }

  init(data: RhBoardData = this.rhData) {
    if (!data || !data.children?.length) return;
    const curTime = this.rhCurTime || new Date();
    const min = this.rhStartTime(curTime);
    const max = this.rhEndTime(curTime);
    const cur = curTime.getTime();
    if (isNil(min) || isNil(max) || max <= min) return;
    const length = max - min;
    const result = [];
    let tmp_start = 0;
    let tmp_end = 0;
    let det = 0;
    let offset = 0;
    let width = 0;
    data.children.forEach((item) => {
      //console.log(item,data,item.value1);
      //console.log(item.value2, item.value3, min, max);
      if (item.value2 > max || item.value3 < min) return;
      tmp_start = Math.max(min, item.value2);
      tmp_end = Math.min(cur, item.value3);
      item.value2 = tmp_start;
      item.value3 = tmp_end;
      det = tmp_end - tmp_start;
      offset = RhmNumberHelper.unifyNumber(((tmp_start - min) * 100) / length);
      width = RhmNumberHelper.unifyNumber((det * 100) / length);
      result.push(
        new RhTimelineTick(
          item.value1,
          offset + '%',
          width + '%',
          format(new Date(tmp_start), 'yyyy/MM/dd HH:mm:ss'),
          format(new Date(tmp_end), 'yyyy/MM/dd HH:mm:ss')
        )
      );
      //console.log(item.value1);
    });
    this.ticks = result;
    //console.log(result);
  }

  trackByIndex(i) {
    return i;
  }
}
