import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RhvBoardBase } from '@shared';
import {
  convertToStandardDatasetWithNumberFill,
  RhBasicLineChart,
  RhColor,
  RhMultiLiquidFillChart,
  RhStackBarWithLineChart,
  symbolResources,
  useStandardDisplayConfig,
  useStandardValueMin,
} from '@shared';
import { RhBoardData, RhRankTable, RhvDisplayInstance } from '@model';
import { format } from 'date-fns';
import {
  enableMock,
  equipmentStatusNameMap,
  RhEquipmentStatus,
} from '../../data';
import { last } from 'lodash';
import { RhmNumberHelper } from '@core';

@Component({
  selector: 'rhv-machine-overview-board',
  templateUrl: './machine-overview-board.component.html',
  styleUrls: ['./machine-overview-board.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class MachineOverviewBoardComponent extends RhvBoardBase {
  public enableMock: boolean = enableMock;

  scale = 0.75;

  /** 当前机台运行情况 */
  runningStatus = new RhMultiLiquidFillChart(
    {
      dataset: [
        ['计划达成率', 0],
        ['设备开机率', 0],
      ],
      centers: ['30%', '70%'],
      radius: '42%',
      titleBottom: '18%',
      mediaQueryBaseValue: {
        minWidth: 320,
        minHeight: 200,
      },
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        data$: this.apiSer.getOuter(
          'ZhuSuCheJian',
          'ZhusuGraph20',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph20.json',
          this.enableMock
        ),
        interval: 60000,
        emptyData: () => [
          ['计划达成率', 0],
          ['设备开机率', 0],
        ],
      },
      convertor: (data: RhBoardData) => {
        return {
          dimensions: ['名称', '数值'],
          dataset: [
            ['计划达成率', (data.children[0]?.children[0]?.value1 || 0) / 100],
            ['设备开机率', (data.children[1]?.children[0]?.value1 || 0) / 100],
          ],
        };
      },
    }
  );

  /** 近7日设备开机率分析 */
  equipmentRunAnalysis = new RhStackBarWithLineChart(
    {
      dimensions: ['月份', '运行', '待机', '停机', '空闲', '开机率'],
      barItemNumber: 4,
      lineItemNumber: 1,
      lineAxisSplitNumber: 4,
      lineItemSymbol: symbolResources.Primary(),
      lineItemSymbolSize: 24,
      legendFontSize: 13,
      barAxisName: '(h)',
      gridTop: 90,
      colors: [
        RhColor.Success,
        RhColor.Warning,
        RhColor.Danger,
        RhColor.Gray,
        RhColor.Secondary,
      ],
      mediaQueryBaseValue: {
        minWidth: 340,
        minHeight: 220,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(7, 4, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        emptyData: () => [],
        data$: this.apiSer.getOuter(
          'ZhuSuCheJian',
          'ZhusuGraph21',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph21.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );

  /** 当日设备生产时段达成分析 */
  productionRankTable = RhRankTable.create({
    columns: [
      {
        key: 'Time',
        name: '时段',
      },
      {
        key: 'PlanQty',
        name: '计划数',
        width: '4.2rem',
        color: RhColor.Primary,
      },
      {
        key: 'ProductQty',
        name: '生产数',
        width: '4.2rem',
        color: RhColor.Success,
      },
      {
        key: 'BadQty',
        name: '不良数',
        width: '4.2rem',
        color: RhColor.Warning,
      },
      {
        key: 'Rate',
        name: '达成率',
        width: '4.2rem',
      },
    ],
    showHeader: true,
    showRank: false,
    pageSize: 4,
    data: [],
  });

  /** 生产数据 */
  productionData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'ZhuSuCheJian',
        'ZhusuGraph22',
        {},
        'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph22.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => [],
      convertor: (data: RhBoardData) => {
        return data.children.map((item) => {
          return {
            Time: item.item,
            PlanQty: item.children[0]?.value1,
            ProductQty: item.children[1]?.value1,
            BadQty: item.children[2]?.value1,
            Rate: item.children[3]?.value1 + '%',
          };
        });
      },
      onData: (data) => {
        this.productionRankTable.data = data;
      },
    }
  );

  stateNameMap = equipmentStatusNameMap;
  stateColorMap = {
    [RhEquipmentStatus.Running]: RhColor.Success,
    [RhEquipmentStatus.Unknown]: RhColor.Gray,
    [RhEquipmentStatus.Down]: RhColor.Danger,
    [RhEquipmentStatus.StandBy]: RhColor.Warning,
  };
  timelineTicks = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];

  /** 机台状态数据 */
  machineStatusData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'ZhuSuCheJian',
        'ZhusuGraph23',
        {},
        'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph23.json',
        this.enableMock
      ),
      emptyData: () => {
        return {
          states: [0, 0, 0, 0],
          info: ['---', '---', '---', 0],
          timelineData: new RhBoardData('', '', []),
        };
      },
      convertor: (data: RhBoardData) => {
        const info = data.children[0];
        const timelineData = data.children[1];
        if (this.enableMock) {
          const dataDate = new Date(last(timelineData.children).value3);
          const curTime = new Date();
          dataDate.setHours(21, 30, 0);
          this.machineStatusData.dataset.curTime = dataDate;
        }
        return {
          states: [
            info.children[0]?.value1,
            info.children[1]?.value1,
            info.children[2]?.value1,
            info.children[3]?.value1,
          ],
          info: [
            info.children[4]?.item,
            info.children[5]?.item,
            info.children[6]?.item,
            info.children[7]?.value1,
          ],
          timelineData: timelineData,
        };
      },
      interval: 60000,
    },
    {
      curTime: null,
    }
  );
  /** 工单状态名称映射 */
  orderStatusNameMap = {
    0: '发放',
    1: '生产中',
    2: '完工',
    3: '关闭',
    4: '取消发放',
    5: '暂停生产',
  };

  /** 今日生产工单信息 */
  ordersRankTable = RhRankTable.create({
    columns: [
      {
        key: 'OrderCode',
        name: '工单编号',
        width: '12rem',
      },
      {
        key: 'ProductCode',
        name: '生产产品',
      },
      {
        key: 'PlanQty',
        name: '计划数量',
        width: '8rem',
      },
      {
        key: 'CompleteQty',
        name: '完工数量',
        width: '8rem',
      },
      {
        key: 'CompleteDate',
        name: '交货日期',
        width: '8rem',
      },
      {
        key: 'State',
        name: '生产状态',
        custom: true,
        templateKey: 'state',
        width: '8rem',
      },
    ],
    showHeader: true,
    showRank: false,
    pageSize: 4,
    data: [],
  });
  /** 工单数据 */
  ordersData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, null, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'ZhuSuCheJian',
        'ZhusuGraph24',
        {},
        'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph24.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => [],
      convertor: (data: RhBoardData) => {
        return data.children.map((item) => {
          return {
            OrderCode: item.item,
            ProductCode: item.children[1]?.item,
            PlanQty: item.children[2]?.value1,
            CompleteQty: item.children[3]?.value1,
            CompleteDate: item.children[4]?.value1,
            State: item.children[5]?.value1,
          };
        });
      },
      onData: (data) => (this.ordersRankTable.data = data),
    }
  );
  /** 当日设备速度分析 */
  flowAnalysis = new RhBasicLineChart(
    {
      dimensions: ['日期', '数值'],
      yAxisName: '(mm/s)',
      mediaQueryBaseValue: {
        minWidth: 320,
        minHeight: 200,
      },
      valueMin: useStandardValueMin(1, 1),
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(10, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        emptyData: () => [],
        data$: this.apiSer.getOuter(
          'ZhuSuCheJian',
          'ZhusuGraph25',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph25.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );

  /** 当日设备压力分析 */
  pressureAnalysis = new RhBasicLineChart(
    {
      dimensions: ['日期', '数值'],
      yAxisName: '(Mpa)',
      mediaQueryBaseValue: {
        minWidth: 320,
        minHeight: 200,
      },
      valueMin: useStandardValueMin(1, 1),
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(10, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        emptyData: () => [],
        data$: this.apiSer.getOuter(
          'ZhuSuCheJian',
          'ZhusuGraph26',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph26.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );

  /** 当日设备温度分析 */
  temperatureAnalysis = new RhBasicLineChart(
    {
      dimensions: ['日期', '数值'],
      yAxisName: '(℃)',
      mediaQueryBaseValue: {
        minWidth: 320,
        minHeight: 200,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(10, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        emptyData: () => [],
        data$: this.apiSer.getOuter(
          'ZhuSuCheJian',
          'ZhusuGraph27',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph27.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
}
