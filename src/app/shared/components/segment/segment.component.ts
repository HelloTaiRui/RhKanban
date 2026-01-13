import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { provideValueAccessor, RhControlValueAccessor } from '@core';
import { RhSafeAny, SelectItem } from '@model';
import { interval, Subscription, timer } from 'rxjs';

@Component({
  selector: 'rh-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.less'],
  providers: [provideValueAccessor(RhSegmentComponent)],
})
export class RhSegmentComponent
  extends RhControlValueAccessor
  implements OnChanges, OnDestroy
{
  /** 展现形式。每种对应一种UI */
  @Input() rhMode: 'borderedSegment' | 'segment' = 'segment';
  /** 选项列表 */
  @Input() rhOptions: SelectItem[] = [];
  /** 最大显示个数 */
  @Input() rhMaxVisibleNumber: number = 0;
  /** 自动播放的时间间隔。单位毫秒。为0时不自动播放。 */
  @Input() rhAutoPlayInterval: number = 0;
  /** 显示指引标 */
  @Input() rhShowAnchor = false;
  /** 名称列表 */
  @Input() rhNameList: string[] = [];

  /** 完整的选项列表 */
  fullOptions: SelectItem[] = [];
  /** 当前可见的项目 */
  visibleOptions: SelectItem[] = [];
  /** 定时器 */
  private timerSubscription?: Subscription;

  constructor(public cdr: ChangeDetectorRef) {
    super(cdr);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.rhOptions ||
      changes.rhMaxVisibleNumber ||
      changes.rhAutoPlayInterval
    ) {
      this.init(
        changes.rhOptions?.currentValue,
        changes.rhMaxVisibleNumber?.currentValue,
        changes.rhAutoPlayInterval?.currentValue
      );
    }
  }

  init(
    options: SelectItem[] = this.rhOptions,
    maxVisibleNumber: number = this.rhMaxVisibleNumber,
    autoPlayInterval: number = this.rhAutoPlayInterval
  ) {
    //console.log(options, maxVisibleNumber, autoPlayInterval);
    this.fullOptions = options;
    this.timerSubscription?.unsubscribe();

    if (autoPlayInterval) {
      this.timerSubscription = interval(autoPlayInterval).subscribe(() => {
        this.gotoNextItem(this.value, maxVisibleNumber);
      });
    }
    setTimeout(() => {
      this.gotoNextItem(this.value, maxVisibleNumber);
    }, 10);
  }

  gotoNextItem(curValue: RhSafeAny, maxVisibleNumber: number) {
    const fullOptions = this.fullOptions;
    if (!fullOptions) return;
    const curItemIndex = fullOptions.findIndex(
      (item) => item.Value === curValue
    );
    let nextIndex = 0;
    if (curItemIndex == -1) {
      nextIndex = 0;
    } else {
      nextIndex = (curItemIndex + 1) % fullOptions.length;
    }
    this.value = fullOptions[nextIndex]?.Value;
    if (maxVisibleNumber && fullOptions.length > maxVisibleNumber) {
      const startIndex = Math.floor(nextIndex / maxVisibleNumber);
      this.visibleOptions = fullOptions.slice(
        startIndex * maxVisibleNumber,
        (startIndex + 1) * maxVisibleNumber
      );
    } else {
      this.visibleOptions = fullOptions;
    }
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  trackByIndex(i) {
    return i;
  }
}
