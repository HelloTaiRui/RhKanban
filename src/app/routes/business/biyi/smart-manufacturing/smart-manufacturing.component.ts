import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { RhvBoardBase } from '@shared';
import {
  convertToStandardDatasetWithNumberFill,
  RhAreaRosePieChart,
  RhBarLineWithGradientChart,
  RhBarWithLineChart,
  RhBasicBarChart,
  RhBasicGaugeChart,
  RhBasicLineChart,
  RhBasicPictorialBarChart,
  RhBubbleChart,
  RhColor,
  RhEquipmentStatusPieChart,
  RhHorizontalPieChart,
  RhHorizontalStackBarChart,
  RhMultiLiquidFillChart,
  RhMultiWithGradientLineChart,
  RhStackBarWithLineChart,
  RhTopRankBarChart,
  symbolResources,
  useStandardDisplayConfig,
  useTenThousandValueFormatter,
} from '@shared';
import {
  enableMock,
  equipmentStatusNameMap,
  RhEquipmentStatus,
  useWorkEndTime,
  useWorkStartTime,
  workTimelineTicks,
} from '../data';
import {
  createPlaceholderLabel,
  RhBoardData,
  RhEchartsChartRequiredDataFormat,
  RhRankTable,
  RhSafeAny,
  RhvDisplayInstance,
  SelectItem,
} from '@model';
import { flatten, last, sum, sumBy } from 'lodash';
import { graphic } from 'echarts';
import { RhmNumberHelper } from '@core';

@Component({
  selector: 'rh-smart-manufacturing',
  templateUrl: './smart-manufacturing.component.html',
  styleUrls: ['./smart-manufacturing.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class SmartManufacturingComponent extends RhvBoardBase {
  public enableMock: boolean = enableMock;

  scale = 0.8;

  @ViewChild('#timelineTpl', { static: true })
  timelineTpl: TemplateRef<RhSafeAny>;

  /** 近7日计划达成率统计 */
  planCompleteRate = new RhBarLineWithGradientChart(
    {
      dimensions: ['日期', '装配数', '达成率'],
      barAxisName: '(件)',
      barItemNumber: 1,
      lineItemNumber: 1,
      colors: [RhColor.Primary, RhColor.Success],
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 280,
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
        emptyData: () => [],
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
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
  /** 本月品质直通率统计 */
  productGoodRate = new RhBarWithLineChart(
    {
      dimensions: ['产品名称', '生产批次数', '不良批次数', '直通率'],
      barAxisName: '(批)',
      colors: [RhColor.Primary, RhColor.Warning, RhColor.Success],
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 250,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 3),
      dataSubscribeConfig: {
        interval: 60000,
        emptyData: () => [],
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
  /** 本月生产成品不良项Top5 */
  productTop5Reason = new RhAreaRosePieChart(
    {
      dataset: [['---', 0]],
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        data$: this.apiSer.getOuter(
          'ZhiZao',
          'ZhizaoGraph4',
          {},
          'assets/mock/biyi/ZhiZao/ZhizaoGraph4.json',
          this.enableMock
        ),
        interval: 60000,
        emptyData: () => [['---', 0]],
      },
      convertor: convertToStandardDatasetWithNumberFill,
    }
  );
  /** 月度生产产量汇总 */
  monthlyProduction = new RhBasicLineChart(
    {
      dimensions: ['月份', '产量'],
      yAxisName: '(万件)',
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 300,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'ZhiZao',
          'ZhizaoGraph5',
          {},
          'assets/mock/biyi/ZhiZao/ZhizaoGraph5.json',
          this.enableMock
        ),
        emptyData: () => [],
      },
      convertor: (data) =>
        convertToStandardDatasetWithNumberFill(
          data,
          useTenThousandValueFormatter
        ),
    }
  );
  /** 近7日生产产量汇总 */
  weeklyProduction = new RhBasicPictorialBarChart(
    {
      dimensions: ['日期', '产量'],
      yAxisName: '(件)',
      colors: [
        new graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: 'rgba(171, 214, 255, 0.04)',
          },
          {
            offset: 1,
            color: 'rgba(7, 131, 250, 0.2)',
          },
        ]),
      ],
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 300,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'ZhiZao',
          'ZhizaoGraph6',
          {},
          'assets/mock/biyi/ZhiZao/ZhizaoGraph6.json',
          this.enableMock
        ),
        emptyData: () => [],
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
  /** 月度退料数量统计 */
  /*   monthlyReturnSummary = new RhHorizontalStackBarChart(
    {
      dimensions: ['月份', 'Top1', 'Top2', 'Top3', 'Top4'],
      mediaQueryBaseValue: {
        minWidth: 400,
        minHeight: 260,
      },
      colors: [
        RhColor.Primary,
        RhColor.Secondary,
        RhColor.Success,
        RhColor.Gray,
      ],
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(
        0,
        (i) => [
          createPlaceholderLabel(3),
          { name: createPlaceholderLabel(3), value: 0 },
          { name: createPlaceholderLabel(3), value: 0 },
          { name: createPlaceholderLabel(3), value: 0 },
          { name: createPlaceholderLabel(3), value: 0 },
        ],
        0,
        0
      ),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'ZhiZao',
          'ZhizaoGraph7',
          {},
          'assets/mock/biyi/ZhiZao/ZhizaoGraph7.json',
          this.enableMock
        ),
        emptyData: () => [],
      },
      convertor: (data: RhBoardData) => {
        const result = [];
        const rows = data.children;
        rows.forEach((row) => {
          result.push([
            row.item,
            ...row.children
              .sort((a, b) => (a.value1 > b.value1 ? -1 : 1))
              .slice(0, 4)
              .map((item) => {
                return {
                  name: item.item,
                  value: item.value1,
                };
              }),
          ]);
        });
        //console.log(result);
        return {
          dimensions: ['月份', 'Top1', 'Top2', 'Top3', 'Top4'],
          dataset: result,
        };
      },
    }
  ); */

  /** 月度退料月份数据 */
  monthlyReturnList: SelectItem[] = [];
  curReturnMonth: string = '';

  /** 月度退料数据 */
  monthlyReturnData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(
      4,
      () => new RhBoardData('--', '', [new RhBoardData('-', 0)]),
      0,
      0
    ),
    {
      data$: this.apiSer.getOuter(
        'ZhiZao',
        'ZhizaoGraph7',
        {},
        'assets/mock/biyi/ZhiZao/ZhizaoGraph7.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => [],
      convertor: (data: RhBoardData) => {
        return data.children;
      },
      onData: (data) => {
        this.monthlyReturnList = data.map((item, index) => {
          return new SelectItem(item.item, index + '');
        });
      },
    }
  );

  /** 月度退料数量统计 */
  monthlyReturn = new RhHorizontalPieChart({
    unit: '件',
    centerUnit: '',
    centerValue: '' as RhSafeAny,
    title: '',
    dimensions: ['退料车间', '数值'],
    legendLabelWidth: 200,
    formatter: (name: string, value: number, percent: number) => {
      return [
        `{a|${name}}`,
        `{b|${RhmNumberHelper.unifyNumber(percent, 1)}%}`,
      ].join('');
    },
    mediaQueryBaseValue: {
      minWidth: 400,
      minHeight: 200,
    },
    scale: this.scale,
  });
  /** 更新月度退料数量显示 */
  updateMonthlyReturnData(curItem: string) {
    //console.log(curItem);
    const data = this.monthlyReturnData.data?.[parseInt(curItem)];
    //console.log(data);
    if (data) {
      const details = data?.children || [];
      const summary = sumBy(details, 'value1');
      //this.monthlyReturn.centerValue = RhmNumberHelper.unifyNumber(summary, 2);
      this.monthlyReturn.updateDataset(
        details.map((item) => [item.item, item.value1])
      );
    }
  }

  /** 本月退料原因统计 */
  returnReasonSummary = new RhBasicBarChart(
    {
      dimensions: ['原因', '数量'],
      yAxisName: '(件)',
      mediaQueryBaseValue: {
        minWidth: 400,
        minHeight: 260,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'ZhiZao',
          'ZhizaoGraph8',
          {},
          'assets/mock/biyi/ZhiZao/ZhizaoGraph8.json',
          this.enableMock
        ),
        emptyData: () => [],
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
  /** 出勤信息 */
  attendanceData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(3, () => 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'ZhiZao',
        'ZhizaoGraph18',
        {},
        'assets/mock/biyi/ZhiZao/ZhizaoGraph18.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => [
        new SelectItem('', '0'),
        new SelectItem('', '0'),
        new SelectItem('', '0'),
      ],
      convertor: (data: RhBoardData) => {
        return data.children.map(
          (item) => new SelectItem(item.item, item.value1)
        );
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

  /** 当日产线异常分布图 */
  errorDistributionRankTable = RhRankTable.create({
    columns: [
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
    data: [],
  });

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
      emptyData: () => [],
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
        this.errorDistributionRankTable.data = data;
      },
    },
    {
      curTime: null,
      timelineTicks: workTimelineTicks,
      createStartTime: useWorkStartTime,
      createEndTime: useWorkEndTime,
    }
  );

  /** 产线员工地区分布 */
  employeeDistribution = new RhBubbleChart(
    {
      dimensions: ['地区', '数值', '大小', '颜色'],
    },
    {
      host: this,
      config: useStandardDisplayConfig(null, null, null, null),
      dataSubscribeConfig: {
        interval: 60000,
        emptyData: () => [],
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
  /** 本月设备点检及时率 */
  equipmentSpotInspect = new RhMultiWithGradientLineChart(
    {
      dimensions: ['日期', '白班', '夜班'],
      yAxisName: '(%)',
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
        emptyData: () => [],
        data$: this.apiSer.getOuter(
          'ZhiZao',
          'ZhizaoGraph12',
          {},
          'assets/mock/biyi/ZhiZao/ZhizaoGraph12.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );

  /** 本月新厂区设备运行整体情况 */
  equipmentStatus = new RhEquipmentStatusPieChart(
    {
      dimensions: ['状态', '台数'],
      dataset: [
        ['运行设备', 0],
        ['待机设备', 0],
        ['停机设备', 0],
      ],
      title: '设备总数',
      centerUnit: '台',
      valueUnit: '台',
      centerValue: 0,
      scale: 0.9,
    },
    {
      host: this,
      config: useStandardDisplayConfig(3, 1, 0, 0),
      dataSubscribeConfig: {
        data$: this.apiSer.getOuter(
          'ZhiZao',
          'ZhizaoGraph14',
          {},
          'assets/mock/biyi/ZhiZao/ZhizaoGraph14.json',
          this.enableMock
        ),
        emptyData: () => [
          ['运行设备', 0],
          ['待机设备', 0],
          ['停机设备', 0],
        ],
        interval: 60000,
        onData: (data) => {
          this.equipmentStatus.centerValue = sumBy(data, (item) => item[1]);
        },
      },
      convertor: (data: RhBoardData) => {
        const rows = data.children[0].children;
        return {
          dimensions: ['状态', '台数'],
          dataset: rows.map((item) => [item.item, item.value1]),
        };
      },
    }
  );
  /** 月度装配车间设备运行分析 */
  equipmentRunAnalysis = new RhStackBarWithLineChart(
    {
      dimensions: ['月份', '运行', '待机', '停机', '开机率'],
      barItemNumber: 3,
      lineItemNumber: 1,
      lineAxisSplitNumber: 5,
      barAxisName: '(次)',
      lineItemSymbol: symbolResources.Primary(),
      lineItemSymbolSize: 24,
      colors: [
        RhColor.Success,
        RhColor.Warning,
        RhColor.Danger,
        RhColor.Secondary,
      ],
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
        emptyData: () => [],
        data$: this.apiSer.getOuter(
          'ZhiZao',
          'ZhizaoGraph16',
          {},
          'assets/mock/biyi/ZhiZao/ZhizaoGraph16.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );

  /** 人员变动情况分析 */
  employeeInfo = new RhBasicBarChart(
    {
      dimensions: ['日期', '在职数', '离职数', '离职率'],
      yAxisName: '(人)',
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 280,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 3, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        emptyData: () => [],
        data$: this.apiSer.getOuter(
          'ZhiZao',
          'ZhizaoGraph11',
          {},
          'assets/mock/biyi/ZhiZao/ZhizaoGraph11.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
  /** 点检数据 */
  equipmentSpotCheckData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, null, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'ZhiZao',
        'ZhizaoGraph13',
        {},
        'assets/mock/biyi/ZhiZao/ZhizaoGraph13.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => [],
      convertor: (data: RhBoardData) => {
        return flatten(
          data.children.map((equipment) => {
            return equipment.children.map((item) => {
              return {
                Equipment: equipment.item,
                Item: item.item,
                Result: this.resultValueMap[item.value1],
              };
            });
          })
        );
      },
      onData: (data) => {
        //console.log(data);
        this.equipmentSpotCheckRankTable.data = data;
      },
    }
  );

  readonly resultValueMap = {
    0: '未执行',
    1: '已执行',
    2: '超时',
  };

  readonly resultMap = {
    已执行: 'running',
    未执行: 'error',
    超时: 'down',
  };

  /** 设备点检进度统计 */
  equipmentSpotCheckRankTable = RhRankTable.create({
    columns: [
      {
        key: 'Equipment',
        name: '点检设备',
        width: '6rem',
      },
      {
        key: 'Item',
        name: '检验项目',
        width: '6rem',
      },
      {
        key: 'Result',
        name: '检验进度',
        custom: true,
        templateKey: 'result',
      },
    ],
    showHeader: true,
    pageSize: 3,
    moveSpeed: 2000,
    data: [
      /*       { Equipment: '注塑机A01', Item: `监控情况检查`, Result: '正常' },
      { Equipment: '注塑机A12', Item: `目视定性检查`, Result: '运行中' },
      { Equipment: '压铸机G2', Item: `润滑油液位检查`, Result: '异常' }, */
    ],
  });
  /** 月度总装车间设备停机Top5 */
  monthlyDownTop5Equipments = new RhTopRankBarChart(
    {
      dimensions: ['排名', '设备', '时长', '次数', '最大值'],
      valueBarEncoding: 2,
      bgBarEncoding: 4,
      rightLabelFormatter: '{@[3]}次({@[2]}h)',
    },
    {
      host: this,
      config: useStandardDisplayConfig(5, (i) => [
        createPlaceholderLabel(1),
        createPlaceholderLabel(3),
        0,
        0,
        0,
      ]),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'ZhiZao',
          'ZhizaoGraph15',
          {},
          'assets/mock/biyi/ZhiZao/ZhizaoGraph15.json',
          this.enableMock
        ),
        emptyData: () => [],
      },
      convertor: (data: RhBoardData) => {
        const result = [];
        let max = 0;
        data.children.forEach((item, index) => {
          result.push([
            index + 1,
            item.item,
            item.children[1].value1,
            item.children[0].value1,
          ]);
          max = Math.max(max, item.children[1].value1);
        });
        max = RhmNumberHelper.findM(max, 8);
        if (max == 0) max = 10;
        result.forEach((item) => (item[4] = max));
        return {
          dimensions: ['排名', '设备', '停机时长', '停机次数', '最大值'],
          dataset: result,
        };
      },
    }
  );

  /** 本月各车间设备开机状况 */
  equipmentStartRate = new RhMultiLiquidFillChart(
    {
      dimensions: ['车间', '开机率'],
      dataset: [
        ['注塑车间', 0],
        ['冲压车间', 0],
        ['喷涂车间', 0],
      ],
    },
    {
      host: this,
      config: useStandardDisplayConfig(3, 1, 0, 0),
      dataSubscribeConfig: {
        data$: this.apiSer.getOuter(
          'ZhiZao',
          'ZhizaoGraph17',
          {},
          'assets/mock/biyi/ZhiZao/ZhizaoGraph17.json',
          this.enableMock
        ),
        interval: 60000,
        emptyData: () => [
          ['注塑车间', 0],
          ['冲压车间', 0],
          ['喷涂车间', 0],
        ],
      },
      convertor: (data: RhBoardData) => {
        const tableData = [];
        const result = [];
        data.children.forEach((item) => {
          tableData.push({
            Workshop: item.item,
            Qty: `运行${item.children[0].value1}次`,
            Percent: `${item.children[1].value1}%`,
          });
          result.push([item.item, item.children[1].value1 / 100]);
        });
        this.equipmentStartRankTable.data = tableData;
        return {
          dimensions: ['车间', '开机率'],
          dataset: result,
        };
      },
    }
  );

  /** 本月各车间设备开机状况表格 */
  equipmentStartRankTable = RhRankTable.create({
    columns: [
      {
        key: 'Workshop',
        name: '车间',
      },
      {
        key: 'Qty',
        name: '开机设备数',
      },
      {
        key: 'Percent',
        name: '开机率',
      },
    ],
    showHeader: false,
    pageSize: 2,
    data: [
      /*       { Workshop: '注塑车间', Qty: `运行42次`, Percent: '85%' },
      { Workshop: '冲压车间', Qty: `运行23次`, Percent: '85%' }, */
      //{ Factory: '中意', Qty: `${(12780).toLocaleString()}件`, Percent: '85%' },
    ],
  });
}
