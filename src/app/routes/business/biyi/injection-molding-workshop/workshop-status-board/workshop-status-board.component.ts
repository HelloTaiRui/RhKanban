import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RhvBoardBase, useStandardValueMin } from '@shared';
import {
  convertToStandardDatasetWithNumberFill,
  RhBarWithLineChart,
  RhBasicLineChart,
  RhColor,
  RhGradientBarWithTopMarkChart,
  RhMultiLiquidFillChart,
  symbolResources,
  useStandardDisplayConfig,
} from '@shared';
import { RhBoardData, RhRankTable, RhvDisplayInstance } from '@model';
import { chunk } from 'lodash';
import { of } from 'rxjs';
import {
  enableMock,
  equipmentStatusIconMap,
  RhEquipmentStatus,
} from '../../data';
import { RhmNumberHelper } from '@core';

@Component({
  selector: 'rhv-workshop-status-board',
  templateUrl: './workshop-status-board.component.html',
  styleUrls: ['./workshop-status-board.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class WorkshopStatusBoardComponent extends RhvBoardBase {
  public enableMock: boolean = enableMock;

  private scale = 0.75;

  /** 当前车间运行情况 */
  runningStatus = new RhMultiLiquidFillChart(
    {
      dataset: [
        ['计划达成率', 0],
        ['设备开机率', 0],
      ],
      centers: ['30%', '70%'],
      radius: '42%',
      titleBottom: '14%',
      mediaQueryBaseValue: {
        minWidth: 320,
        minHeight: 200,
      },
    },
    {
      host: this,
      config: useStandardDisplayConfig(2, 1, 0, 0),
      dataSubscribeConfig: {
        data$: this.apiSer.getOuter(
          'ZhuSuCheJian',
          'ZhusuGraph12',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph12.json',
          this.enableMock
        ),
        interval: 60000,
        emptyData: () => [
          ['计划达成率', 0],
          ['设备开机率', 0],
        ],
      },
      convertor: (data: RhBoardData) => {
        //console.log(data);
        return {
          dimensions: ['指标', '数值'],
          dataset: [
            ['计划达成率', data.children[0].children[0].value1 / 100],
            ['设备开机率', data.children[1].children[0].value1 / 100],
          ],
        };
      },
    }
  );

  /** 近7日开机率统计 */
  startRate = new RhBarWithLineChart(
    {
      dimensions: ['日期', '开机时长', '开机率'],
      barAxisName: '(h)',
      colors: [RhColor.Primary, RhColor.Success],
      barItemNumber: 1,
      lineItemNumber: 1,
      lineItemSymbol: symbolResources.Success(),
      lineItemSymbolSize: 24,
      lineValueMin: useStandardValueMin(1, 9, 0),
      mediaQueryBaseValue: {
        minWidth: 320,
        minHeight: 200,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 2, 0, 0),
      dataSubscribeConfig: {
        emptyData: () => [],
        interval: 60000,
        data$: this.apiSer.getOuter(
          'ZhuSuCheJian',
          'ZhusuGraph13',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph13.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );

  /** 近7日设备能耗使用统计 */
  energyConsumption = new RhBasicLineChart(
    {
      dimensions: ['日期', '度数'],
      yAxisName: '(度)',
      mediaQueryBaseValue: {
        minWidth: 320,
        minHeight: 200,
      },
      scale: this.scale,
      /*       mediaQueryPoints: [
        0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.75, 1, 1.25, 1.5, 1.7, 1.8, 2,
      ], */
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        emptyData: () => [],
        data$: this.apiSer.getOuter(
          'ZhuSuCheJian',
          'ZhusuGraph14',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph14.json',
          this.enableMock
        ),
      },
      convertor: (data: RhBoardData) => {
        const rows = data.children;
        return {
          dimensions: ['日期', '度数'],
          dataset: rows.map((item) => [item.item, item.value1]),
        };
      },
    }
  );

  readonly statusIconMap = equipmentStatusIconMap;
  /** 点位数据 */
  readonly pointsData = [
    [
      ['-', '10%'],
      ['-', '18.5%'],
      ['-', '27.8%'],
      ['-', '37%'],
      ['-', '45.8%'],
      ['-', '54.8%'],
      ['-', '64.1%'],
      ['-', '73.5%'],
      ['-', '83%'],
      ['-', '92.1%'],
    ],
    [
      ['-', '10%'],
      ['-', '18.5%'],
      ['-', '27.8%'],
      ['-', '37%'],
      ['-', '45.8%'],
      ['-', '54.8%'],
      ['-', '64.1%'],
      ['-', '73.5%'],
      ['-', '83%'],
      ['-', '92.1%'],
    ],
    [
      ['-', '10%'],
      ['-', '18.5%'],
      ['-', '27.8%'],
      ['-', '37%'],
      ['-', '45.8%'],
      ['-', '54.8%'],
      ['-', '64.1%'],
      ['-', '73.5%'],
      ['-', '83%'],
      ['-', '92.1%'],
    ],
    [
      ['-', '10%'],
      ['-', '18.5%'],
      ['-', '27.8%'],
      ['-', '37%'],
      ['-', '45.8%'],
      ['-', '54.8%'],
      ['-', '64.1%'],
      ['-', '73.5%'],
      ['-', '83%'],
      ['-', '92.1%'],
    ],
  ];
  /** 页面列表 */
  pageList = [];
  /** 当前页码 */
  curPageIndex = 0;
  /** 完整列表 */
  fullList: [string, number, number][] = [];
  /** 设备状态数据 */
  equipmentsStatus = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'ZhuSuCheJian',
        'ZhusuGraph15',
        {},
        'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph15.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => {
        return {
          summary: {
            [RhEquipmentStatus.Running]: 0,
            [RhEquipmentStatus.StandBy]: 0,
            [RhEquipmentStatus.Down]: 0,
            [RhEquipmentStatus.Unknown]: 0,
          },
          items: {},
          list: [],
        };
      },
      convertor: (data: RhBoardData) => {
        const result = {};
        const list = [];
        const stateSummary = {
          [RhEquipmentStatus.Running]: 0,
          [RhEquipmentStatus.StandBy]: 0,
          [RhEquipmentStatus.Down]: 0,
          [RhEquipmentStatus.Unknown]: 0,
        };
        data.children.forEach((item) => {
          result[item.item] = [
            item.item,
            item.children[0].value1,
            item.children[1].value1,
          ];
          list.push([
            item.item,
            item.children[0].value1,
            item.children[1].value1,
          ]);
          if (!stateSummary[item.children[0].value1])
            stateSummary[item.children[0].value1] = 0;
          stateSummary[item.children[0].value1] += 1;
        });
        const pages = Math.ceil(list.length / 40);
        const pageList = [];
        for (let i = 0; i < pages; i++) {
          pageList[i] = i;
        }
        this.pageList = pageList;
        this.fullList = list;
        this.updateVisibleList(false);
        return {
          summary: stateSummary,
          items: result,
          list: list,
        };
      },
      onData: (data) => {},
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
    RhvDisplayInstance.fillData(visibleList, 40, () => ['-', 0, 0]);
    const rows = chunk(visibleList, 10);
    rows.forEach((row, rowIndex) => {
      row.forEach((item, index) => {
        this.pointsData[rowIndex][index][0] = item[0] as string;
      });
    });
  }

  jumpTo(pageIndex: number) {
    this.curPageIndex = pageIndex;
    this.updateVisibleList(false);
  }

  /** 当前人员到岗数据 */
  personData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'ZhuSuCheJian',
        'ZhusuGraph16',
        {},
        'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph16.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => [],
      convertor: (data: RhBoardData) => {
        /*         const list = ['班长', '操作工', '品质员', '加料员'];
        let tmp;
        return list.map((item) => {
          tmp = data.children.find((d) => d.item === item);
          console.log(tmp);
          return {
            Person: `所需人员：${item}`,
            Qty: (tmp ? tmp.children[0].value1 : 0) + '人',
          };
        }); */
        return data.children.map((item) => {
          return {
            Person: `所需人员：${item.item}`,
            Qty: `到岗人员：${item.children[0].value1}人`,
          };
        });
      },
      onData: (data) => {
        this.personRankTable.data = data;
      },
    }
  );

  /** 当前人员到岗情况 */
  personRankTable = RhRankTable.create({
    columns: [
      {
        key: 'Person',
        name: '人员',
        width: '50%',
      },
      {
        key: 'Qty',
        name: '人数',
        width: '50%',
      },
    ],
    showHeader: false,
    showRank: false,
    pageSize: 4,
    data: [],
  });

  /** 近7日生产计划达成率 */
  planArchiveRate = new RhBarWithLineChart(
    {
      dimensions: ['日期', '生产数量', '达成率'],
      barAxisName: '(件)',
      colors: [RhColor.Primary, RhColor.Success],
      barItemNumber: 1,
      lineItemNumber: 1,
      lineValueMin: useStandardValueMin(1, 9, 0),
      mediaQueryBaseValue: {
        minWidth: 320,
        minHeight: 200,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 2, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        emptyData: () => [],
        data$: this.apiSer.getOuter(
          'ZhuSuCheJian',
          'ZhusuGraph17',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph17.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );

  /** 近7日产量统计 */
  productionSummary = new RhGradientBarWithTopMarkChart(
    {
      dimensions: ['日期', '数量'],
      yAxisName: '(件)',
      mediaQueryBaseValue: {
        minWidth: 320,
        minHeight: 200,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        emptyData: () => [],
        data$: this.apiSer.getOuter(
          'ZhuSuCheJian',
          'ZhusuGraph18',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph18.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
}
