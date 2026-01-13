import { Component, ViewEncapsulation } from '@angular/core';
import { RhvBoardBase } from '@shared';
import {
  convertToStandardDatasetWithNumberFill,
  RhAreaRosePieChart,
  RhBasicGaugeChart,
  RhBasicLiquidFillChart,
  RhColor,
  RhEquipmentStatusPieChart,
  RhGradientBarWithTopMarkChart,
  RhHorizontalBarChart,
  RhHorizontalPieChart,
  RhLeftRightComparisonBarChart,
  RhMultiBarChart,
  RhStackBarChart,
  useMonthFormatter,
  useStandardDisplayConfig,
  useTenThousandValueFormatter,
} from '@shared';
import {
  RhBoardData,
  RhRankTable,
  RhSafeAny,
  RhvDisplayInstance,
  SelectItem,
} from '@model';
import { sum, sumBy } from 'lodash';
import { RhmNumberHelper } from '@core';
import { enableMock } from '../data';

enum logisticsChannelState {
  Running = 1,
  StandBy = 0,
}

@Component({
  selector: 'rh-smart-logistics',
  templateUrl: './smart-logistics.component.html',
  styleUrls: ['./smart-logistics.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class SmartLogisticsComponent extends RhvBoardBase {
  public enableMock: boolean = enableMock;
  scale = 0.8;
  /** 当日立库环境状况 */
  environmentStatus = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(4, () => 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'WuLiu',
        'WuliuGraph1',
        {},
        'assets/mock/biyi/WuLiu/WuliuGraph1.json',
        this.enableMock
      ),
      interval: 60000,
      convertor: (data: RhBoardData) => {
        return data.children?.map(
          (item) => (item.children?.[0]?.value1 as number) || 0
        );
      },
    }
  );

  /** 库存结构分析 */
  inventoryStructure = new RhAreaRosePieChart(
    {
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 250,
      },
      scale: 2,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        data$: this.apiSer.getOuter(
          'WuLiu',
          'WuliuGraph3',
          {},
          'assets/mock/biyi/WuLiu/WuliuGraph3.json',
          this.enableMock
        ),
        interval: 60000,
      },
      convertor: (data: RhBoardData) => {
        //console.log(data);
        const items = data.children.slice(1);
        return {
          dimensions: ['库存类型', '数值'],
          dataset: items.map((item) => [item.item, item.children[0].value1]),
        };
      },
    }
  );
  /** 账龄选项数据 */
  accountAgeList: SelectItem[] = [];
  curAccountAge: string = '';

  /** 账龄分析 */
  accountAgeData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, null, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'WuLiu',
        'WuliuGraph5',
        {},
        'assets/mock/biyi/WuLiu/WuliuGraph5.json',
        this.enableMock
      ),
      interval: 60000,
      convertor: (data: RhBoardData) => {
        return data.children;
      },
      onData: (data) => {
        this.accountAgeList = data.map((item, index) => {
          return new SelectItem(item.item, index + '');
        });
      },
    }
  );

  /** 账龄分析图 */
  accountAgeAnalysis = new RhHorizontalPieChart({
    unit: '',
    centerUnit: '万件',
    title: '总量',
    radius: ['70%', '85%'],
    center: ['70%', '50%'],
    dimensions: ['账龄类别', '数值'],
    legendLabelWidth: 100,
    formatter: (name: string, value: number, percent: number) => {
      return [
        `{a|${name}}`,
        `{b|${RhmNumberHelper.unifyNumber(percent, 1)}%}`,
      ].join('');
    },
    mediaQueryBaseValue: {
      minWidth: 420,
      minHeight: 250,
    },
    scale: this.scale,
  });
  /** 更新账龄显示 */
  updateAccountAgeData(curItem: string) {
    //console.log(curItem);
    const data = this.accountAgeData.data?.[parseInt(curItem)];
    //console.log(data);
    if (data) {
      const details = data?.children || [];
      const summary = sumBy(details, 'value1');
      this.accountAgeAnalysis.centerValue = RhmNumberHelper.unifyNumber(
        summary / 10000,
        2
      );
      this.accountAgeAnalysis.updateDataset(
        details.map((item) => [item.item, item.value1])
      );
    }
  }

  /** 月度库存类别分布 */
  monthlyInventoryCategory = new RhStackBarChart(
    {
      //dimensions: ['月份', '原材料', '半成品', '产成品', '采购件'],
      colors: [
        RhColor.Primary,
        RhColor.Secondary,
        RhColor.Success,
        RhColor.Warning,
        RhColor.Other1,
      ],
      yAxisName: '(件)',
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 300,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 4, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'WuLiu',
          'WuliuGraph7',
          {},
          'assets/mock/biyi/WuLiu/WuliuGraph7.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
  /** 立库容积率统计 */
  volStatistic = new RhBasicLiquidFillChart(
    {
      dataset: [['立库容积率', 0]],
    },
    {
      host: this,
      config: useStandardDisplayConfig(1, () => ['立库容积率', 0], 0, 0),
      dataSubscribeConfig: {
        data$: this.apiSer.getOuter(
          'WuLiu',
          'WuliuGraph2',
          {},
          'assets/mock/biyi/WuLiu/WuliuGraph2.json',
          this.enableMock
        ),
        interval: 60000,
        emptyData: () => [['立库容积率', 0]],
      },
      convertor: (data: RhBoardData) => {
        return {
          dimensions: ['名称', '数值'],
          dataset: [['立库容积率', data.children[0].children[0].value1 / 100]],
        };
      },
    }
  );
  /** 成品库存占比统计 */
  productCategory = new RhHorizontalPieChart(
    {
      unit: '件',
      centerUnit: '件',
      title: '库存总量',
      legendLabelWidth: 100,
      center: ['70%', '50%'],
      formatter: (name: string, value: number, percent: number) => {
        return [
          `{a|${name}}`,
          `{b|${RhmNumberHelper.unifyNumber(percent, 1)}%}`,
        ].join('');
      },
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 250,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        data$: this.apiSer.getOuter(
          'YunYing',
          'YunyingGraph12',
          {},
          'assets/mock/biyi/YunYing/YunyingGraph12.json',
          this.enableMock
        ),
        interval: 60000,
      },
      convertor: (data: RhBoardData) => {
        const details = data.children.map((item) => [
          item.item,
          item.children[0].value1,
        ]);
        const summary = sum(details.map((item) => item[1]));
        this.productCategory.centerValue = summary;
        return {
          dimensions: ['成品类别', '数量'],
          dataset: details,
        };
      },
    }
  );
  /** 呆滞物料Top5 */
  stagnantTop5Materials = new RhHorizontalBarChart(
    { yAxisName: undefined, labelFormatter: '{@[1]}%' },
    {
      host: this,
      config: useStandardDisplayConfig(5, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'WuLiu',
          'WuliuGraph6',
          {},
          'assets/mock/biyi/WuLiu/WuliuGraph6.json',
          this.enableMock
        ),
      },
      convertor: (data) => {
        const result = convertToStandardDatasetWithNumberFill(data);
        result.dimensions[1] = '数量占比';
        const sumValue = sum(result.dataset.map((row) => row[1]));
        result.dataset.forEach(
          (row) =>
            (row[1] =
              sumValue === 0
                ? 0
                : this.unifyNumber((row[1] * 100) / sumValue, 2))
        );
        return result;
      },
    }
  );
  /** 月度库存区域对比 */
  monthlyInventoryArea = new RhMultiBarChart(
    {
      dimensions: ['月份', '泰国', '本厂', '中意'],
      yAxisName: '(件)',
      colors: [RhColor.Primary, RhColor.Secondary, RhColor.Success],
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 300,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 3, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'WuLiu',
          'WuliuGraph8',
          {},
          'assets/mock/biyi/WuLiu/WuliuGraph8.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
  /** 总览数据 */
  statusOverview = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(3, () => 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'WuLiu',
        'WuliuGraph18',
        {},
        'assets/mock/biyi/WuLiu/WuliuGraph18.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => [0, 0, 0],
      convertor: (data: RhBoardData) => {
        return data.children[0].children.map((item) => item.value1 as number);
      },
    }
  );
  /** 当前轮播到的立库单位 */
  curSelectedStorageItem: string = '';
  /** 库位列表 */
  storageList = [
    [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21,
    ],
    [
      22, 23, 24, 25, 26, 27, 28, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
      40, 41, 42, 43,
    ],
    [
      44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
      62, 63, 64, 65,
    ],
    [
      66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
      84, 85, 86, 87,
    ],
  ];
  /** 当前的明细数据 */
  curDetailsData: RhSafeAny[] = [];
  /** 存储单元 */
  storageTicks = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  /** 立库存储分析数据 */
  storageAnalysisData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'WuLiu',
        'WuliuGraph9',
        {},
        'assets/mock/biyi/WuLiu/WuliuGraph9.json',
        this.enableMock
      ),
      interval: 240000,
      emptyData: () => ({
        details: [],
      }),
      convertor: (data: RhBoardData) => {
        const items = data.children;
        const details = [];
        const maxTicks = this.storageTicks.length;
        const tickValue = 100 / maxTicks;
        items.forEach((item) => {
          const summaryValue = sumBy(item.children, 'value2');
          const total = sumBy(item.children, 'value3');
          const rate = this.unifyNumber((summaryValue * 100) / total, 1);

          const ticksValue = this.storageTicks
            .map((item, index) => {
              return (rate >= tickValue * index ? 100 : 0) + '%';
            })
            .reverse();
          //console.log(ticksValue);
          details.push({
            name: item.item,
            percent: rate,
            height: Math.min(rate, 100) + '%',
            value: summaryValue,
            value2: total,
            ticksFill: ticksValue,
          });
        });
        return {
          details,
        };
      },
    }
  );

  /** 近一年库存变化趋势 */
  inventoryChange = new RhGradientBarWithTopMarkChart(
    {
      dimensions: ['月份', '数量'],
      yAxisName: '(万件)',
      mediaQueryBaseValue: {
        minWidth: 400,
        minHeight: 260,
      },
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'WuLiu',
          'WuliuGraph10',
          {},
          'assets/mock/biyi/WuLiu/WuliuGraph10.json',
          this.enableMock
        ),
      },
      convertor: (data) =>
        convertToStandardDatasetWithNumberFill(
          data,
          useTenThousandValueFormatter
        ),
    }
  );
  /** 当日AGV运行状态总览 */
  agvRunStatus = new RhEquipmentStatusPieChart(
    {
      title: '任务总数',
      valueUnit: '个',
      centerUnit: '',
      centerValue: 0,
      dimensions: ['状态', '数量'],
      dataset: [
        ['运行中', 0],
        ['已取消', 0],
        ['已完成', 0],
      ],
      colors: [RhColor.Warning, RhColor.Danger, RhColor.Success],
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 250,
      },
    },
    {
      host: this,
      config: useStandardDisplayConfig(3, 1, 0, 0),
      dataSubscribeConfig: {
        data$: this.apiSer.getOuter(
          'WuLiu',
          'WuliuGraph12',
          {},
          'assets/mock/biyi/WuLiu/WuliuGraph12.json',
          this.enableMock
        ),
        interval: 60000,
      },
      convertor: (data: RhBoardData) => {
        this.agvRunStatus.centerValue = sumBy(
          data.children?.[0]?.children || [],
          'value1'
        );
        return {
          dimensions: ['状态', '数据'],
          dataset: data.children[0].children.map((item) => [
            item.item,
            item.value1,
          ]),
        };
      },
    }
  );
  /** 仓库物流通道使用情况 */
  logisticsChannelUseInfoRankTable = RhRankTable.create({
    columns: [
      {
        key: 'Channel',
        name: '通道号',
        width: '4rem',
      },
      {
        key: 'State',
        name: '状态',
        width: '4rem',
        custom: true,
        templateKey: 'state',
      },
    ],
    data: [],
    showHeader: false,
    showRank: false,
    enableDisplay: false,
  });
  /** 物流通道状态名称映射 */
  logisticsChannelStateNameMap = {
    [logisticsChannelState.Running]: '使用中',
    [logisticsChannelState.StandBy]: '空闲中',
  };
  /** 物流通道状态图标 */
  logisticsChannelStateIconMap = {
    [logisticsChannelState.Running]: 'running',
    [logisticsChannelState.StandBy]: 'error',
  };

  /** 仓库物流通道使用情况数据 */
  logisticsChannelUseInfoData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, null, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'WuLiu',
        'WuliuGraph14',
        {},
        'assets/mock/biyi/WuLiu/WuliuGraph14.json',
        this.enableMock
      ),
      interval: 60000,
      convertor: (data: RhBoardData) => {
        return data.children.map((item) => {
          return {
            Channel: item.item,
            State: item.children[0].value1,
          };
        });
      },
      onData: (data) => {
        this.logisticsChannelUseInfoRankTable.data = data;
      },
    }
  );

  /** 近7日立库成品出入库数量统计 */
  productInOutSummary = new RhLeftRightComparisonBarChart(
    {
      dimensions: ['日期', '出库量', '入库量'],
      xAXisName: '(件)',
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 2, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'WuLiu',
          'WuliuGraph16',
          {},
          'assets/mock/biyi/WuLiu/WuliuGraph16.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
  /** 月度库存周转率分析 */
  /*   monthlyInventoryRate = new RhBasicLineChart(
    { yAxisName: '(次)', dimensions: ['月份', '周转次数'], splitNumber: 4 },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter('WuLiu', 'WuliuGraph11'),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  ); */
  /** 成品收发月度统计图 */
  productInOutMonthlySummary = new RhLeftRightComparisonBarChart(
    {
      dimensions: ['月份', '入库', '出库'],
      splitNumber: 3,
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 250,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 2, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'YingXiao',
          'YingxiaoGraph14',
          {},
          'assets/mock/biyi/YingXiao/YingxiaoGraph14.json',
          this.enableMock
        ),
      },
      convertor: (data) =>
        convertToStandardDatasetWithNumberFill(data, useMonthFormatter),
    }
  );
  /** AGV工作频率情况 */
  agvWorkRankTable = RhRankTable.create({
    columns: [
      {
        key: 'Code',
        name: 'AGV编号',
      },
      {
        key: 'TaskNum',
        name: '任务数',
        width: '4rem',
      },
      {
        key: 'Power',
        name: '电量',
        width: '4rem',
      },
      {
        key: 'Speed',
        name: '速度',
        width: '3.5rem',
      },
    ],
    showHeader: true,
    pageSize: 3,
    data: [
      /*       { Code: 'AGV001', Qty: 120, Status: '执行', Power: '70%' },
      { Code: 'AGV002', Qty: 119, Status: '执行', Power: '12%' },
      { Code: 'AGV003', Qty: 112, Status: '待机', Power: '26%' }, */
    ],
  });
  /** agv工作数据 */
  agvWorkData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(3, null, 0, 0, (value) => {
      this.agvWorkRankTable.data = value;
    }),
    {
      data$: this.apiSer.getOuter(
        'WuLiu',
        'WuliuGraph13',
        {},
        'assets/mock/biyi/WuLiu/WuliuGraph13.json',
        this.enableMock
      ),
      interval: 60000,
      convertor: (data: RhBoardData) => {
        return data.children.map((item) => {
          return {
            Code: item.item,
            TaskNum: item.children[0].value1,
            Power: item.children[1].value1 + '%',
            Speed: item.children[2].value1,
          };
        });
      },
    }
  );

  /** 运行中车辆数量 */
  workingCarNum = 0;
  /** 作业车辆实时容积率情况 */
  carRate = new RhBasicGaugeChart(
    {
      colors: [RhColor.Success, RhColor.Warning, RhColor.Danger],
      colorStops: [0, 70, 90],
    },
    {
      host: this,
      config: useStandardDisplayConfig(1, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'WuLiu',
          'WuliuGraph15',
          {},
          'assets/mock/biyi/WuLiu/WuliuGraph15.json',
          this.enableMock
        ),
        emptyData: () => [['容积率', 0]],
      },
      convertor: (data: RhBoardData) => {
        this.workingCarNum = data.children[0].children[0].value1;
        return {
          dimensions: ['名称', '值'],
          dataset: [['容积率', data.children[0].children[1].value1]],
        };
      },
    }
  );
  /** 本月立库成品出入库总量统计 */
  curMonthProductInOut = new RhMultiBarChart(
    {
      dimensions: ['Date', '出库量', '入库量'],
      yAxisName: '(万件)',
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 300,
      },
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 2, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'WuLiu',
          'WuliuGraph17',
          {},
          'assets/mock/biyi/WuLiu/WuliuGraph17.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
}
