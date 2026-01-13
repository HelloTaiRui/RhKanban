import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RhvBoardBase, useStandardValueMin } from '@shared';
import {
  convertToStandardDatasetWithNumberFill,
  RhBarWithLineChart,
  RhBasicLineChart,
  RhBasicPictorialBarChart,
  RhColor,
  RhHorizontalPieChart,
  RhMarkedBarChart,
  RhMultiBarChart,
  RhMultiLiquidFillChart,
  RhTopRankBarChart,
  symbolResources,
  useStandardDisplayConfig,
} from '@shared';
import { graphic } from 'echarts';
import {
  createPlaceholderLabel,
  RhBoardData,
  RhEchartsChartRequiredDataFormat,
  RhSafeAny,
  RhvDisplayInstance,
} from '@model';
import { RhmNumberHelper } from '@core';
import { enableMock } from '../../data';

@Component({
  selector: 'rhv-workshop-operating-board',
  templateUrl: './workshop-operating-board.component.html',
  styleUrls: ['./workshop-operating-board.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class WorkshopOperatingBoardComponent extends RhvBoardBase {
  public enableMock: boolean = enableMock;

  scale = 0.75;
  /** 当日生产数据 */
  productionRateData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'ZhuSuCheJian',
        'ZhusuGraph1',
        {},
        'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph1.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => [0, 0, 0, 0],
      convertor: (data: RhBoardData) => {
        return (
          data.children[0]?.children.map((item) => item.value1) || [0, 0, 0, 0]
        );
      },
    }
  );

  /** 达成率 */
  productionRate = new RhMultiLiquidFillChart(
    {
      dataset: [['达成率', 0]],
      centers: ['50%'],
      radius: '82%',
      titleBottom: '0%',
      mediaQueryBaseValue: {
        minWidth: 150,
        minHeight: 150,
      },
      scale: 0.9,
    },
    {
      host: this,
      config: useStandardDisplayConfig(1, () => ['达成率', 0], 0, 0),
      dataSubscribeConfig: {
        data$: this.productionRateData.data$,
        interval: 0,
        emptyData: () => [['达成率', 0]],
      },
      convertor: (data: number[]) => {
        //console.log(data);
        return {
          dimensions: ['名称', '数值'],
          dataset: [['达成率', data[3] / 100]],
        };
      },
    }
  );

  /** 本月生产计划达成率统计 */
  planArchiveRate = new RhBarWithLineChart(
    {
      dimensions: ['日期', '生产数', '达成率'],
      barAxisName: '(件)',
      barAxisSplitNumber: 3,
      colors: [RhColor.Primary, RhColor.Success],
      barItemNumber: 1,
      lineItemNumber: 1,
      lineItemSymbol: symbolResources.Success(),
      lineValueMin: useStandardValueMin(1, 19, 0),
      lineItemSymbolSize: 24,
      labelSizeScale: 1,
      gridTop: 90,
      xLabelGap: 16,
      xAXixEnableRotate: true,
      mediaQueryBaseValue: {
        minWidth: 500,
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
          'ZhusuGraph2',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph2.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );

  /** 生产产量汇总统计 */
  productionSummary = new RhBasicPictorialBarChart(
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
      labelSizeScale: 1,
      mediaQueryBaseValue: {
        minWidth: 500,
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
          'ZhusuGraph3',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph3.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );

  /** 月度人员数量 */
  quitRate = new RhMultiBarChart(
    {
      yAxisName: '(人)',
      colors: [RhColor.Primary, RhColor.Success],
      labelSizeScale: 1,
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
          'ZhusuGraph4',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph4.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );

  /** 生产设备开机率统计 */
  equipmentStartRate = new RhBasicLineChart(
    {
      dimensions: ['日期', '开机率'],
      yAxisName: '(%)',
      labelSizeScale: 1,
      mediaQueryBaseValue: {
        minWidth: 500,
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
          'ZhusuGraph5',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph5.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );

  /** 本月机台开机率最高Top5 */
  top5equipments = new RhTopRankBarChart(
    {
      dimensions: ['排名', '产品', '开机时长', '开机次数', '最大值'],
      valueBarEncoding: 2,
      bgBarEncoding: 4,
      rightLabelFormatter: '{@[3]}次({@[2]}h)',
      mediaQueryBaseValue: {
        minWidth: 300,
        minHeight: 200,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(5, null, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'ZhuSuCheJian',
          'ZhusuGraph6',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph6.json',
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
        //console.log(max);
        if (max == 0) max = 10;
        result.forEach((item) => (item[4] = max));
        while (result.length < 5) {
          result.push([
            result.length + 1,
            createPlaceholderLabel(3),
            0,
            0,
            max,
          ]);
        }
        //console.log(result);
        return {
          dimensions: ['排名', '产品', '开机时长', '开机次数', '最大值'],
          dataset: result,
        };
      },
    }
  );

  /** 本月机台停机Top5 */
  top5downEquipments = new RhMarkedBarChart(
    {
      dimensions: ['机台', '停机时长'],
      yAxisName: '(h)',
      labelSizeScale: 1,
      mediaQueryBaseValue: {
        minWidth: 300,
        minHeight: 200,
      },
    },
    {
      host: this,
      config: useStandardDisplayConfig(5, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        emptyData: () => [],
        data$: this.apiSer.getOuter(
          'ZhuSuCheJian',
          'ZhusuGraph7',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph7.json',
          this.enableMock
        ),
      },
      convertor: (data) => {
        const result = convertToStandardDatasetWithNumberFill(data);
        return result;
      },
    }
  );

  /** 生产设备使用能耗情况 */
  equipmentEnergyConsumption = new RhBasicLineChart(
    {
      dimensions: ['日期', '白班', '晚班'],
      yAxisName: '(度)',
      colors: [RhColor.Primary, RhColor.Secondary],
      labelSizeScale: 1,
      mediaQueryBaseValue: {
        minWidth: 500,
        minHeight: 200,
      },
      xAXixEnableRotate: true,
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 3, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        emptyData: () => [],
        data$: this.apiSer.getOuter(
          'ZhuSuCheJian',
          'ZhusuGraph8',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph8.json',
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

  /** 注塑车间退料原因分析 */
  badTop5 = new RhHorizontalPieChart(
    {
      unit: '件',
      centerUnit: '',
      centerValue: '' as RhSafeAny,
      title: '',
      radius: ['65%', '80%'],
      formatter: (name: string, value: number, percent: number) => {
        return [
          `{a|${name}}`,
          `{b|${RhmNumberHelper.unifyNumber(percent, 1)}%}`,
        ].join('');
      },
      mediaQueryBaseValue: {
        minWidth: 350,
        minHeight: 200,
      },
      scale: this.scale,
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        data$: this.apiSer.getOuter(
          'ZhuSuCheJian',
          'ZhusuReturnReason',
          {},
          'assets/mock/biyi/ZhuSuCheJian/ZhusuReturnReason.json',
          this.enableMock
        ),
        interval: 60000,
        emptyData: () => [],
      },
      convertor: (data) => {
        const details = data.children;
        //this.badTop5.centerValue = sumBy(details, 'children[0].value1');
        return {
          dimensions: ['退料原因', '数量'],
          dataset: details.map((item) => [item.item, item.children[0].value1]),
        };
      },
    }
  );
  /** 表格数据 */
  tableData = RhEchartsChartRequiredDataFormat.standardValue([], []);
  /** 近3日工单完工情况 */
  ordersData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(3, null, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'ZhuSuCheJian',
        'ZhusuGraph11',
        {},
        'assets/mock/biyi/ZhuSuCheJian/ZhusuGraph11.json',
        this.enableMock
      ),
      emptyData: () => RhEchartsChartRequiredDataFormat.standardValue([], []),
      interval: 60000 * 5,
      convertor: convertToStandardDatasetWithNumberFill,
      onData: (data: RhEchartsChartRequiredDataFormat) => {
        //console.log(data);
        if (data.dimensions.length > 0 && data.dataset.length > 0) {
          this.tableData = data;
        }
      },
    }
  );
}
