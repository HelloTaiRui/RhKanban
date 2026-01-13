import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { RhRankTableColumn } from '@model';
import { RhSafeAny } from '@model';
import { Subscription, timer } from 'rxjs';

class RhRankTableRow {
  constructor(
    public rank: number,
    public rawData: RhSafeAny,
    public id: string
  ) {}
}

@Component({
  selector: 'rh-rank-table',
  templateUrl: './rank-table.component.html',
  styleUrls: ['./rank-table.component.less'],
})
export class RhRankTableComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  /** 表格数据 */
  @Input() rhData: RhSafeAny[] = [];
  /** 显示表头 */
  @Input() rhShowHeader: boolean = true;
  /** 显示排名列 */
  @Input() rhShowRank: boolean = true;
  /** 表格列 */
  @Input() rhColumns: RhRankTableColumn[] = [];
  /** 每页显示的数量 */
  @Input() rhPageSize: number = 3;
  /** 可见的总数占每页显示数量的比率。 */
  @Input() rhVisibleRate: number = 1.5;
  /** 移动速度 */
  @Input() rhMoveTime: number = 3000;
  /** 模板列表 */
  @Input() rhTemplates: Record<string, TemplateRef<RhSafeAny>> = {};
  /** 启用轮播 */
  @Input() rhEnableDisplay: boolean = false;
  /** 表格数据 */
  tableData: RhRankTableRow[] = [];
  /** 实际渲染的可见的表格数据 */
  visibleData: RhRankTableRow[] = [];

  /** 当前顶部播放到的排名 */
  curRank: number = 0;
  /** 循环圈数 */
  loopNum: number = 0;
  /** 定时器 */
  private timerSubscription: Subscription;

  private enableDisplay = false;

  get pageSize() {
    return Math.floor(
      this.rhPageSize * Math.min(Math.max(this.rhVisibleRate, 1), 2)
    );
  }

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rhData || changes.rhColumns || changes.rhPageSize) {
      this.init(
        changes.rhData?.currentValue,
        changes.rhColumns?.currentValue,
        changes.rhPageSize?.currentValue
      );
    }
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  init(
    data: RhSafeAny[] = this.rhData,
    columns: RhRankTableColumn[] = this.rhColumns,
    pageSize: number = this.rhPageSize
  ) {
    if (!data || !columns) return;
    if (this.rhShowRank) {
      //开启了排名展示的情况下，必须从头开始播
      this.curRank = 0;
    } else {
      //反之，延续当前进度继续播。
      //
    }
    let tmp: number;
    this.tableData = data.map((d, index) => {
      tmp = d._rank_ || index + 1;
      return {
        rank: tmp,
        rawData: d,
        id: tmp + '',
      };
    });

    //console.log(this.tableData.length, pageSize);
    if (this.tableData.length < pageSize || !this.rhEnableDisplay) {
      this.visibleData = [...this.tableData];
      this.enableDisplay = false;
    } else {
      this.enableDisplay = true;
      if (this.tableData.length < this.pageSize) {
        this.tableData.push(
          ...this.tableData.map((item) => {
            return {
              ...item,
              id: item.id + '_2',
            };
          })
        );
      }
      this.nextFragment();
    }
  }

  nextFragment(pageSize: number = this.pageSize) {
    if (this.curRank + 1 > this.tableData.length) {
      this.curRank = 1;
    } else {
      this.curRank += 1;
    }
    const result = [];
    let tmp;
    let rankIndex;
    /*     if (this.tableData.length >= pageSize) {
      for (let i = this.curRank - 1; i < this.curRank + pageSize; i++) {
        rankIndex = i % this.tableData.length;
        tmp = this.tableData[rankIndex];
        result.push(tmp);
      }
    } */ /*  else {
      for (let i = this.curRank - 1; i < this.curRank + pageSize; i++) {
        rankIndex = i % this.tableData.length;
        tmp = this.tableData[rankIndex];
        result.push({
          ...tmp,
          id:
            tmp.rank + '_' + ((Math.floor(i / this.tableData.length) % 2) + 1),
        });
      }
    } */
    for (let i = this.curRank - 1; i < this.curRank - 1 + pageSize; i++) {
      rankIndex = i % this.tableData.length;
      tmp = this.tableData[rankIndex];
      result.push(tmp);
    }
    this.visibleData = result;
    //console.log(this.curRank, this.visibleData, pageSize);
  }

  ngAfterViewInit(): void {
    const table = (this.el.nativeElement as HTMLElement).querySelector(
      '.rank-table table'
    ) as HTMLTableElement;
    const body = table.querySelector('tbody');
    //console.log(table);
    let row: HTMLTableRowElement;
    let moveLength = 0;
    const moveTime = this.rhMoveTime; //移动一行的用时
    const aniInterval = 50; //移动的单位间隔
    const moveNum = Math.round(moveTime / aniInterval); //移动一行需要移动多少次
    if (moveNum <= 0) return;
    let curNum: number = 0; //当前已移动的次数
    let offset: number = 0;
    if (!this.rhEnableDisplay) return;
    this.timerSubscription = timer(aniInterval, aniInterval).subscribe(() => {
      if (!this.enableDisplay) return;
      if (!row) {
        row = table.querySelector('tbody tr');
      }
      if (!row) return;
      if (curNum >= moveNum) {
        offset = row.offsetTop;
        body.appendChild(row);
        table.style.translate = `0px 0px`;
        curNum = 0;
        row = null;
        this.nextFragment();
        return;
      }
      curNum += 1;
      moveLength = row.offsetHeight + row.offsetTop;
      table.style.translate = `0px ${-1 * ((curNum * moveLength) / moveNum)}px`;
    });
  }

  trackBy(i: number, d) {
    return d.id;
  }

  headTrackBy(i: number, d) {
    return d.rhvKey;
  }
}
