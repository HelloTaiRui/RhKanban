import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RhvBoardBase, useStandardDisplayConfig } from '@shared';
import {
  createPlaceholderLabel,
  RhBoardData,
  RhSafeAny,
  RhvDisplayInstance,
} from '@model';
import {
  enableMock,
  equipmentStatusIconMap,
  equipmentStatusNameMap,
  RhEquipmentStatus,
} from '../../data';
import { of } from 'rxjs';

export enum EquipmentState {
  Run = 'Run',
  Error = 'Error',
  Down = 'Down',
  StandBy = 'StandBy',
  Empty = '--',
}

@Component({
  selector: 'rhv-equipment-overview-board',
  templateUrl: './equipment-overview-board.component.html',
  styleUrls: ['./equipment-overview-board.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class EquipmentOverviewBoardComponent extends RhvBoardBase {
  public enableMock: boolean = enableMock;

  public statusIconMap = equipmentStatusIconMap;
  public statusNameMap = equipmentStatusNameMap;

  /** 页面列表 */
  pageList = [];
  curPageIndex = 0;
  /** 完整列表 */
  fullList: [string, number, number][] = [];
  sumQty: number = 0;
  summaryData = {
    [RhEquipmentStatus.Running]: 0,
    [RhEquipmentStatus.StandBy]: 0,
    [RhEquipmentStatus.Down]: 0,
    [RhEquipmentStatus.Unknown]: 0,
  };
  /** 可见列表 */
  visibleList = [];

  equipmentsData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'ZhuSuCheJian',
        'ZhusuGraph19',
        {},
        'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph19.json',
        this.enableMock
      ),
      emptyData: () => [],
      interval: 60000,
      /*       emptyData: () => {
        return new RhBoardData('', '', []);
      }, */
      convertor: (data: RhBoardData) => {
        const stateSummary = {
          [RhEquipmentStatus.Running]: 0,
          [RhEquipmentStatus.StandBy]: 0,
          [RhEquipmentStatus.Down]: 0,
          [RhEquipmentStatus.Unknown]: 0,
        };
        const result = [];
        data.children.forEach((item) => {
          if (!stateSummary[item.children[1].value1])
            stateSummary[item.children[1].value1] = 0;
          stateSummary[item.children[1].value1] += 1;
          result.push([
            item.item,
            item.children[0]?.item,
            item.children[1]?.value1,
            item.children[2]?.value1,
            item.children[3]?.value1,
            item.children[4]?.value1,
            item.children[5]?.value1,
            item.children[6]?.value1 || item.children[3].value1,
          ]);
        });
        this.sumQty = data.children.length;
        this.summaryData = stateSummary;
        const pages = Math.ceil(data.children.length / 40);
        const pageList = [];
        for (let i = 0; i < pages; i++) {
          pageList[i] = i;
        }
        this.pageList = pageList;
        this.fullList = result;
        this.updateVisibleList(false);
        return result;
      },
    }
  );

  /** 可见的设备数据 */
  visibleEquipmentsData = new RhvDisplayInstance(
    this,
    {
      fragmentSize: 0,
      fill: null,
      step: 0,
      interval: 60000,
      onValue: () => {
        this.updateVisibleList();
      },
    },
    {
      data$: of(null),
      interval: null,
    }
  );

  updateVisibleList(goToNextIndex: boolean = true) {
    if (this.fullList.length == 0) return;
    if (goToNextIndex) {
      this.curPageIndex = (this.curPageIndex + 1) % this.pageList.length;
    }

    const visibleList = this.fullList.slice(
      this.curPageIndex * 40,
      (this.curPageIndex + 1) * 40
    );
    RhvDisplayInstance.fillData(visibleList, 40, () => [
      createPlaceholderLabel(3), //设备编码
      '', //设备型号
      '', //设备状态,
      0, //当日达成率
      0, //生产数量
      0, //计划数量
      0, //开机率
      0, //本月产量
    ]);
    this.visibleList = visibleList;
  }

  jumpTo(pageIndex: number) {
    this.curPageIndex = pageIndex;
    this.updateVisibleList(false);
  }
}
