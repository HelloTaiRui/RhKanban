import { Component, ViewEncapsulation } from '@angular/core';
import {
  convertToStandardDatasetWithNumberFill,
  RhBarLineWithGradientChart,
  RhBarWithLineChart,
  RhBasicGaugeChart,
  RhBasicPictorialBarChart,
  RhBubbleChart,
  RhColor,
  RhHorizontalPercentBarChart,
  RhHorizontalPieChart,
  RhMultiBarChart,
  RhMultiLineChart,
  RhMultiLiquidFillChart,
  RhTopRankBarChart,
  symbolResources,
  useStandardDisplayConfig,
  useStandardValueMin,
  useTenThousandValueFormatter,
} from '@shared';
import { RhmNumberHelper } from '@core';
import { RhvBoardBase } from '@shared';
import {
  useWorkEndTime,
  useWorkStartTime,
  workTimelineTicks,
  equipmentStatusNameMap,
  monitorData,
  RhEquipmentStatus,
  enableMock,
} from '../data';
import {
  createPlaceholderLabel,
  RhBoardData,
  RhEchartsChartRequiredDataFormat,
  RhRankTable,
  RhSafeAny,
  RhvDisplayInstance,
} from '@model';
import { flatten, last, sum, sumBy } from 'lodash';
import { of } from 'rxjs';

@Component({
  selector: 'rh-smart-operation',
  templateUrl: './smart-operation.component.html',
  styleUrls: ['./smart-operation.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class SmartOperationComponent extends RhvBoardBase {
  public enableMock: boolean = enableMock;

  scale = 0.8;

  /** 年度生产量汇总统计图 */
  yearProductionSummary = new RhMultiBarChart(
    {
      dimensions: ['产品名称', '2024', '2025'],
      yAxisName: '(万件)',
      xAXixEnableRotate: true,
      mediaQueryBaseValue: {
        minWidth: 400,
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
          'YunYing',
          'YunyingGraph1',
          {},
          'assets/mock/biyi/YunYing/YunyingGraph1.json',
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
  /** 年度运营指标达成情况数据 */
  yearlyRateData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(null, null, null, null),
    {
      interval: 60000,
      data$: this.apiSer.getOuter(
        'YunYing',
        'YunyingGraph2',
        {},
        'assets/mock/biyi/YunYing/YunyingGraph2.json',
        this.enableMock
      ),
      emptyData: () => ({
        title: '',
        sumValue: 0,
        rate: 0,
        sumData: {
          result: '',
          segments: 0,
          unit: '',
        },
      }),
      convertor: (data: RhBoardData) => {
        const sumData = this.convertNumber(
          data.children[0].value1 || 0,
          4,
          '件',
          false
        );
        const resultValue = Math.round(sumData.result as RhSafeAny)
          .toString()
          .padStart(6, '0')
          .split('');
        sumData.result = resultValue;
        const result = {
          title: data.item,
          sumValue: data.children[0]?.value1 || 0,
          rate: data.children[1]?.value1,
          sumData: sumData,
        };
        //console.log(result);
        return result;
      },
    }
  );

  /** 年度指标达成率 */
  yearlyRate = new RhHorizontalPercentBarChart(
    { dataset: [['达成率', 0]] },
    {
      host: this,
      config: useStandardDisplayConfig(1, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 0,
        data$: this.yearlyRateData.data$,
        emptyData: () => [['达成率', 0]],
      },
      convertor: (data) => {
        return {
          dimensions: ['名称', '值'],
          dataset: [['达成率', data?.rate]],
        };
      },
    }
  );
  /** 近7天生产指标达成情况 */
  /*   last7daysProductionRate = new RhMultiBarChart(
    {
      dimensions: ['日期', '泰国', '本厂', '中意'],
      yAxisName: '(%)',
      colors: [RhColor.Primary, RhColor.Secondary, RhColor.Success],
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(
        RhBasicFragmentSize.LastSevenDay,
        3,
        0,
        0
      ),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'YunYing',
          'YunyingGraph3'
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  ); */

  /** 近7日计划达成率统计 */
  planCompleteRate = new RhBarWithLineChart(
    {
      dimensions: ['日期', '装配数', '达成率'],
      barAxisName: '(件)',
      barItemNumber: 1,
      lineItemNumber: 1,
      colors: [RhColor.Primary, RhColor.Success],
      mediaQueryBaseValue: {
        minWidth: 400,
        minHeight: 240,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 2, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'ZhiZao',
          'ZhizaoGraph1',
          {},
          'assets/mock/biyi/ZhiZao/ZhizaoGraph1.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
  /** 近7日车间能耗情况 */
  last7daysWorkshopEnergyConsumption = new RhMultiLineChart(
    {
      dimensions: ['日期', '总装', '注塑', '冲压', '喷涂'],
      yAxisName: '(度)',
      colors: [
        RhColor.Primary,
        RhColor.Secondary,
        RhColor.Success,
        RhColor.Warning,
      ],
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 3, 0, 0),
      dataSubscribeConfig: {
        interval: 60000 * 30,
        data$: this.apiSer.getOuter(
          'YunYing',
          'YunyingGraph7',
          {},
          'assets/mock/biyi/YunYing/YunyingGraph7.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
  /** 能源汇总数据 */
  energySummaryData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'YunYing',
        'YunyingGraph8',
        {},
        'assets/mock/biyi/YunYing/YunyingGraph8.json',
        this.enableMock
      ),
      interval: 60000 * 5,
      emptyData: () => [
        ['本年度', 0],
        ['本月度', 0],
      ],
      convertor: (data: RhBoardData) => {
        return [
          [data.children[0].item, data.children[0].children[0].value1],
          [data.children[1].item, data.children[1].children[0].value1],
        ];
      },
    }
  );

  /** 总装产线上日批次计划达成率 */
  /*   lotNumPlanRate = new RhMarkedBarChart(
    {
      dimensions: ['产线', '达成率'],
      yAxisName: '(%)',
    },
    {
      host: this,
      config: useStandardDisplayConfig(5, 1),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'YunYing',
          'YunyingGraph4'
        ),
      },
      convertor: (data) => {
        const result = convertToStandardDatasetWithNumberFill(data);
        return result;
      },
    }
  ); */
  /** 今日计划达成数据 */
  todayCompleteRateData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'ZhiZao',
        'ZhizaoGraph2',
        {},
        'assets/mock/biyi/ZhiZao/ZhizaoGraph2.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => [0, 0, 0],
      convertor: (data: RhBoardData) => {
        return [
          data.children[0].children[1].value1,
          data.children[0].children[0].value1,
          data.children[0].children[2].value1,
        ];
      },
    }
  );
  /** 今日装配计划达成情况 */
  todayPlanCompleteRate = new RhBasicGaugeChart(
    {
      dimensions: ['名称', '数值'],
      colorStops: [0, 30, 70],
    },
    {
      host: this,
      config: useStandardDisplayConfig(1, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 0,
        data$: this.todayCompleteRateData.data$,
        emptyData: () => [['达成率', 0]],
      },
      convertor: (data: number[]) => {
        return {
          dimensions: ['名称', '数值'],
          dataset: [['达成率', data[2]]],
        };
      },
    }
  );
  /** 月度产品直通率统计 */
  productGoodRate = new RhBarWithLineChart(
    {
      dimensions: ['产品名称', '生产批次数', '不良批次数', '直通率'],
      barAxisName: '(批)',
      gridTop: 100,
      colors: [RhColor.Primary, RhColor.Warning, RhColor.Success],
      scale: this.scale,
      lineValueMin: useStandardValueMin(1, 2),
      xAXixEnableRotate: true,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 3, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'YunYing',
          'YunyingGraph5',
          {},
          'assets/mock/biyi/YunYing/YunyingGraph5.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
  /** 产品不良分布图 */
  badDistribution = new RhHorizontalPieChart(
    {
      unit: '',
      centerUnit: '',
      centerValue: '' as RhSafeAny,
      title: '',
      center: ['72%', '50%'],
      radius: ['50%', '65%'],
      formatter: (name: string, value: number, percent: number) => {
        return [
          `{a|${name}}`,
          `{b|${RhmNumberHelper.unifyNumber(percent, 1)}%}`,
        ].join('');
      },
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 300,
      },
      scale: 1,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        data$: this.apiSer.getOuter(
          'YunYing',
          'YunyingGraph6',
          {},
          'assets/mock/biyi/YunYing/YunyingGraph6.json',
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
        //this.badDistribution.centerValue = summary;
        return {
          dimensions: ['不良类型', '数量'],
          dataset: details,
        };
      },
    }
  );

  /** 各车间计划数量 */
  workshopPlanData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, () => ['---', 0, ''], 0, 0),
    {
      data$: this.apiSer.getOuter(
        'YunYing',
        'YunyingGraph18',
        {},
        'assets/mock/biyi/YunYing/YunyingGraph18.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => [
        ['---', 0],
        ['---', 0],
        ['---', 0],
        ['---', 0],
      ],
      convertor: (data: RhBoardData) => {
        return data.children.map((item) => {
          const toLarge = item.children[0].value1 > 1000000;
          return toLarge
            ? [
                item.item,
                RhmNumberHelper.unifyNumber(
                  item.children[0].value1 / 10000,
                  0
                ).toLocaleString(),
                '万',
              ]
            : [item.item, item.children[0].value1, ''];
        });
      },
    }
  );
  /** 监控点数据 */
  monitorData = monitorData;
  stateNameMap = {
    [RhEquipmentStatus.Rest]: '休息',
    [RhEquipmentStatus.Running]: '运行',
    [RhEquipmentStatus.Unknown]: '未知',
    [RhEquipmentStatus.Down]: '停线',
    [RhEquipmentStatus.StandBy]: '空闲',
    [RhEquipmentStatus.Error]: '异常',
  };
  stateColorMap = {
    [RhEquipmentStatus.Rest]: '#aaf775', //'rgb(198, 224, 180)',
    [RhEquipmentStatus.Running]: RhColor.Success,
    [RhEquipmentStatus.Unknown]: RhColor.Gray,
    [RhEquipmentStatus.Down]: RhColor.Danger,
    [RhEquipmentStatus.StandBy]: 'rgb(211, 211, 211)',
    [RhEquipmentStatus.Error]: RhColor.Warning,
  };

  /** 当日产线异常分布图 */
  errorDistributionRankTable = RhRankTable.create({
    columns: [
      /*       {
        key:"name",
        name:"",
        width:"4rem"
      }, */
      {
        key: 'timeline',
        name: '时间线',
        width: '100%',
        custom: true,
        templateKey: 'timeline',
      },
    ],
    showHeader: false,
    showRank: false,
    pageSize: 5,
    data: [
      /*       { timeline: testTimelineData, name: 'G2产线' },
      { timeline: testTimelineData, name: 'G3产线' },
      { timeline: testTimelineData, name: 'G4产线' },
      { timeline: testTimelineData, name: 'G1产线' }, */
    ],
  });

  /** 页码列表 */
  pageList = [];
  curPageIndex = 0;
  /** 完整列表 */
  fullList: RhSafeAny[] = [];
  pageSize = 7;
  visibleList: RhSafeAny[] = [];
  updateVisibleList(goToNextIndex: boolean = true) {
    if (this.fullList.length == 0) return;
    if (goToNextIndex) {
      this.curPageIndex = (this.curPageIndex + 1) % this.pageList.length;
    }

    const visibleList = this.fullList.slice(
      this.curPageIndex * this.pageSize,
      (this.curPageIndex + 1) * this.pageSize
    );
    RhvDisplayInstance.fillData(visibleList, this.pageSize, () => ({
      name: '---',
      timeline: new RhBoardData('---', null, [
        new RhBoardData('--', 0, null, 0, 0),
      ]),
    }));
    this.visibleList = visibleList;
  }

  jumpTo(pageIndex: number) {
    this.curPageIndex = pageIndex;
    this.updateVisibleList(false);
  }

  /** 当日产线异常数据 */
  errorDistributionData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'ZhiZao',
        'ZhizaoGraph9',
        {},
        'assets/mock/biyi/ZhiZao/ZhizaoGraph9.json',
        this.enableMock
      ),
      interval: 60000,
      convertor: (data: RhBoardData) => {
        const lines = data?.children || [];
        if (this.enableMock) {
          const dataDate = new Date(last(lines[0].children).value3);
          const curTime = new Date();
          dataDate.setHours(21, 30, 0);
          this.errorDistributionData.dataset.curTime = dataDate;
        }
        return lines.map((item) => {
          return {
            name: item.item,
            timeline: new RhBoardData(item.item, null, item.children.slice(1)),
          };
        });
      },
      onData: (data) => {
        //console.log(data);
        const pages = Math.ceil(data.length / this.pageSize);
        const pageList = [];
        for (let i = 0; i < pages; i++) {
          pageList[i] = i;
        }
        this.pageList = pageList;
        this.fullList = data;
        this.updateVisibleList(false);
      },
    },
    {
      curTime: null,
      timelineTicks: workTimelineTicks,
      createStartTime: useWorkStartTime,
      createEndTime: useWorkEndTime,
    }
  );

  /** 可见的产线数据 */
  visibleErrorDistributionData = new RhvDisplayInstance(
    this,
    {
      fragmentSize: 0,
      fill: null,
      step: 0,
      interval: 3 * 60 * 1000,
      onValue: () => {
        this.updateVisibleList();
      },
    },
    {
      data$: of(null),
      interval: null,
    }
  );

  /** 月度来料合格率统计 */
  materialGoodRate = new RhBarWithLineChart(
    {
      dimensions: ['月份', '来料数', '合格率'],
      barAxisName: '(万件)',
      barItemNumber: 1,
      lineUseDataMin: true,
      lineValueMin: useStandardValueMin(1, 1),
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 250,
      },
      scale: this.scale,
      colors: [RhColor.Primary, RhColor.Success],
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 2, 0, 0),
      dataSubscribeConfig: {
        interval: 60000 * 2,
        data$: this.apiSer.getOuter(
          'YunYing',
          'YunyingGraph10',
          {},
          'assets/mock/biyi/YunYing/YunyingGraph10.json',
          this.enableMock
        ),
      },
      convertor: (data: RhBoardData) => {
        const dimensions = ['月份', '来料数', '合格率'];
        const rows = data.children;
        const result: RhSafeAny[] = [];
        result.push(
          ...rows.map((row) => {
            const item = row.children[0];
            return [
              item.item,
              this.unifyNumber(item.value1 / 10000, 1),
              this.unifyNumber(
                ((item.value1 - item.value2) * 100) / item.value1
              ),
            ];
          })
        );
        return RhEchartsChartRequiredDataFormat.standardValue(
          dimensions,
          result
        );
      },
    }
  );
  /** 本月供应商供料不良Top5 */
  top5suppliers = new RhTopRankBarChart(
    {
      dimensions: ['排名', '供应商', '比值', '数值', '最大值', '占位'],
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 250,
      },
      scale: this.scale,
      labelWidth: 280,
    },
    {
      host: this,
      config: useStandardDisplayConfig(
        0,
        (i) => [
          createPlaceholderLabel(1),
          createPlaceholderLabel(3),
          0,
          0,
          0,
          0,
        ],
        0,
        0
      ),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'YunYing',
          'YunyingGraph11',
          {},
          'assets/mock/biyi/YunYing/YunyingGraph11.json',
          this.enableMock
        ),
      },
      convertor: (data: RhBoardData) => {
        const dimensions = ['排名', '供应商', '比值', '数值', '最大值', '占位'];
        const rows = data.children;
        const result = [];
        result.push(
          ...rows.map((item, index) => {
            return [
              index + 1,
              item.item,
              item.children[2].value1,
              item.children[0].value1,
              item.children[1].value1,
              100,
            ];
          })
        );
        return RhEchartsChartRequiredDataFormat.standardValue(
          dimensions,
          result
        );
      },
    }
  );

  /** 成品库存占比统计 */
  productCategory = new RhHorizontalPieChart(
    {
      unit: '件',
      centerUnit: '件',
      title: '库存总量',
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

  /** 近7日成品库存数量趋势 */
  productInventoryTendency = new RhBasicPictorialBarChart(
    {
      dimensions: ['日期', '数量'],
      yAxisName: '(件)',
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'YunYing',
          'YunyingGraph13',
          {},
          'assets/mock/biyi/YunYing/YunyingGraph13.json',
          this.enableMock
        ),
      },
      convertor: convertToStandardDatasetWithNumberFill,
    }
  );
  /** 月度装配车间设备停机情况 */
  equipmentDownSummary = new RhBarWithLineChart(
    {
      dimensions: ['日期', '安灯呼叫数', '已关闭数', '停线时长'],
      barAxisName: '(个)',
      lineAxisName: '',
      barItemNumber: 2,
      lineItemNumber: 1,
      lineLabelFormatter: null,
      lineAxisLabelFormatter: null,
      colors: [RhColor.Primary, RhColor.Success, RhColor.Warning],
      lineItemSymbol: symbolResources.Warning(),
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 2),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'YunYing',
          'YunyingGraph14',
          {},
          'assets/mock/biyi/YunYing/YunyingGraph14.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
  /** 当月安灯异常类型占比 */
  equipmentDownReason = new RhHorizontalPieChart(
    {
      unit: '次',
      centerUnit: '次',
      title: '完成总数',
      radius: ['50%', '60%'],
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 250,
      },
      scale: 1,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'YunYing',
          'YunyingGraph15',
          {},
          'assets/mock/biyi/YunYing/YunyingGraph15.json',
          this.enableMock
        ),
      },
      convertor: (data: RhBoardData) => {
        const details = data.children.map((item) => [
          item.item,
          item.children[0].value1,
        ]);
        const summary = sum(details.map((item) => item[1]));
        this.equipmentDownReason.centerValue = summary;
        return {
          dimensions: ['安灯类型', '数量'],
          dataset: details,
        };
      },
    }
  );
  /** 本月装配车间设备开动率 */
  //equipmentStartRate = new RhEquipmentStatusPieChart({ title: '开机率' });
  /** 产线员工地区分布 */
  employeeDistribution = new RhBubbleChart(
    {
      dimensions: ['地区', '数值', '大小', '颜色'],
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(null, null, null, null),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'ZhiZao',
          'ZhizaoGraph10',
          {},
          'assets/mock/biyi/ZhiZao/ZhizaoGraph10.json',
          this.enableMock
        ),
      },
      convertor: (data: RhBoardData) => {
        const dimensions = ['地区', '数值', '大小', '颜色'];
        const rows = data.children; //.slice(0, 10);
        const result = rows.map((item) => [
          item.item,
          item.children[0].value1,
          0,
          1,
        ]);
        const values = result.map((item) => item[1]);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const avg = sum(values) / values.length;
        const minSize = 50;
        const maxSize = 120;
        result.forEach((item) => {
          if (item[1] >= avg) item[3] = 0;
          item[2] = Math.round(
            ((item[1] - min) / (max - min)) * (maxSize - minSize) + minSize
          );
        });
        result.unshift();
        //console.log(result);
        return RhEchartsChartRequiredDataFormat.standardValue(
          dimensions,
          result
        );
      },
    }
  );
  /** 本月总装检验合格率 */
  inspectGoodRate = new RhMultiLiquidFillChart(
    {},
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        data$: this.apiSer.getOuter(
          'YunYing',
          'YunyingGraph17',
          {},
          'assets/mock/biyi/YunYing/YunyingGraph17.json',
          this.enableMock
        ),
        interval: 60000,
      },
      convertor: (data: RhBoardData) => {
        const tableData = [];
        const result = data.children.map((item) => {
          tableData.push({
            Factory: item.item,
            Qty: item.children[1].value1.toLocaleString() + '批',
            Percent: item.children[2].value1 + '%',
          });
          return [item.item, item.children[2].value1 / 100];
        });
        this.inspectGoodRankTable.data = tableData;
        return RhEchartsChartRequiredDataFormat.standardValue(
          ['工厂', '合格率'],
          result
        );
      },
    }
  );
  /** 本月总装检验合格率表格 */
  inspectGoodRankTable = RhRankTable.create({
    columns: [
      {
        key: 'Factory',
        name: '工厂',
      },
      {
        key: 'Qty',
        name: '数量',
      },
      {
        key: 'Percent',
        name: '合格率',
      },
    ],
    showHeader: false,
    pageSize: 3,
    data: [
      /*       { Factory: '泰国', Qty: `${(12780).toLocaleString()}件`, Percent: '85%' },
      { Factory: '本厂', Qty: `${(12780).toLocaleString()}件`, Percent: '85%' }, */
      //{ Factory: '中意', Qty: `${(12780).toLocaleString()}件`, Percent: '85%' },
    ],
  });
}
