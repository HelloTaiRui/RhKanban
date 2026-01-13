import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'rh-ruler',
  templateUrl: './ruler.component.html',
  styleUrls: ['./ruler.component.less'],
})
export class RhRulerComponent implements OnInit, OnChanges {
  /** tick项目 */
  @Input() rhTicks: number | string[] = 12;
  /** tick项目是否包含尾部项目 */
  //@Input() rhIncludeTail: boolean = false;

  /** 刻度 */
  ticks: string[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.init(changes.rhTicks?.currentValue);
  }

  init(
    ticks: number | string[] = this
      .rhTicks /* includeTail:boolean=this.rhIncludeTail */
  ) {
    const result = [];
    if (typeof ticks === 'number') {
      result.push(...Array(ticks).fill(''));
    } else {
      result.push(...ticks);
    }
    this.ticks = result;
  }

  trackByIndex(i) {
    return i;
  }
}
