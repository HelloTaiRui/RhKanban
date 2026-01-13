import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  convertToStandardDatasetWithNumberFill,
  RhBarLineWithGradientChart,
  RhBasicFunnelChart,
  RhBasicLineChart,
  RhBasicLiquidFillChart,
  RhBasicRadarChart,
  RhBasicWordCloudChart,
  RhBubbleChart,
  RhColor,
  RhHorizontalBarChart,
  RhHorizontalStackBarChart,
  RhLeftRightComparisonBarChart,
  RhMultiBarChart,
  RhTopRankBarChart,
  useMonthFormatter,
  useStandardDisplayConfig,
} from '@shared';
import { RhvBoardBase } from '@shared';
import { RhSafeAny } from '@model';
import { graphic } from 'echarts';
import {
  RhBoardData,
  RhEchartsChartRequiredDataFormat,
  RhRankTable,
  RhvDisplayInstance,
  SelectItem,
} from '@model';
import { RhmNumberHelper } from '@core';
import { sum, sumBy } from 'lodash';
import { enableMock } from '../data';

@Component({
  selector: 'rh-smart-marketing',
  templateUrl: './smart-marketing.component.html',
  styleUrls: ['./smart-marketing.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class SmartMarketingComponent extends RhvBoardBase {
  public enableMock: boolean = enableMock;

  /** 全球客户国别分布 */
  countriesDistribution = new RhBubbleChart(
    {
      colors: [
        new graphic.RadialGradient(0.5, 0.5, 0.5, [
          {
            offset: 0,
            color: 'rgba(7, 131, 250, 0.2)',
          },
          {
            offset: 0.8,
            color: 'rgba(7, 131, 250, 0.4)',
          },
          {
            offset: 1,
            color: 'rgba(7, 131, 250, 0.6)',
          },
        ]),
        new graphic.RadialGradient(0.5, 0.5, 0.5, [
          {
            offset: 0.2,
            color: 'rgba(7, 209, 250, 0.2)',
          },
          {
            offset: 0.8,
            color: 'rgba(7, 209, 250, 0.4)',
          },
          {
            offset: 1,
            color: 'rgba(7, 209, 250, 0.6)',
          },
        ]),
      ],
      dimensions: ['国家', '数值', '大小', '颜色'],
    },
    {
      host: this,
      config: useStandardDisplayConfig(null, null, null, null),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'YingXiao',
          'YingxiaoGraph1',
          {},
          'assets/mock/biyi/YingXiao/YingxiaoGraph1.json',
          this.enableMock
        ),
      },
      convertor: (data: RhBoardData) => {
        //console.log(data);
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

  /** 洲际年度出货数量统计 */
  continentSaleSummary = new RhHorizontalBarChart(
    {
      dimensions: ['洲', '数量'],
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 250,
      },
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'YingXiao',
          'YingxiaoGraph2',
          {},
          'assets/mock/biyi/YingXiao/YingxiaoGraph2.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
  /** 洲际年度出货变化统计 */
  continentSaleChange = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'YingXiao',
        'YingxiaoGraph3',
        {},
        'assets/mock/biyi/YingXiao/YingxiaoGraph3.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => ({ segmentsData: [], items: [] }),
      convertor: (data: RhBoardData) => {
        const items = data.children;
        const segmentsData = items.map(
          (item, index) => new SelectItem(item.item, index as RhSafeAny)
        );
        return {
          segmentsData: segmentsData,
          items: items.map((item) => [
            this.unifyNumber(item.children[0].value1 / 10000, 2),
            this.unifyNumber(item.children[1].value1 / 10000, 2),
          ]),
        };
      },
    },
    {
      curSelectedItem: null,
      curItem: [0, 0],
      primary_dash: [0, 602],
      secondary_dash: [0, 521],
      updateCurItem: (item: string) => {
        //console.log(item);
        const value = this.continentSaleChange.data.items[item] || [0, 0];
        this.continentSaleChange.dataset.curItem = value;
        const max = RhmNumberHelper.findM(Math.max(...value), 8);
        this.continentSaleChange.dataset.primary_dash = [
          602 * (max == 0 ? 0 : value[0] / max),
          Math.ceil(((max - value[0]) * 602) / max),
        ];
        this.continentSaleChange.dataset.secondary_dash = [
          521 * (max == 0 ? 0 : value[1] / max),
          Math.ceil(((max - value[1]) * 521) / max),
        ];
      },
    }
  );
  /** 生产销售架构图数据 */
  productSaleStructData = new RhvDisplayInstance(
    this,
    null,
    {
      data$: this.apiSer.getOuter(
        'YingXiao',
        'YingxiaoGraph4',
        {},
        'assets/mock/biyi/YingXiao/YingxiaoGraph4.json',
        true //this.enableMock
      ),
      interval: 60000,
      convertor: (data: RhBoardData) => {
        const items = data.children;
        const segmentsData = items.map(
          (item, index) => new SelectItem(item.item, index as RhSafeAny)
        );
        return {
          segmentsData: segmentsData,
          items: items.map((item) =>
            RhEchartsChartRequiredDataFormat.standardValue(
              ['项目', '值'],
              item.children.map((item) => [item.item, item.value1])
            )
          ),
        };
      },
    },
    {
      curSelectedItem: null,
      curItem: RhEchartsChartRequiredDataFormat.standardValue([], []),
      updateCurItem: (item: string) => {
        const value: RhEchartsChartRequiredDataFormat =
          this.productSaleStructData.data.items[item] ||
          RhEchartsChartRequiredDataFormat.standardValue([], []);
        this.productSaleStruct.updateDataset(value.dataset);
      },
    }
  );

  /** 生产销售架构图 */
  productSaleStruct = new RhBasicFunnelChart({
    colors: [RhColor.Primary, RhColor.Secondary, RhColor.Success],
  });

  /** 产品销量同比图 */
  productSaleCompare = new RhMultiBarChart(
    {
      dimensions: ['产品', '2024', '2025'],
      yAxisName: '(万件)',
      colors: [RhColor.Secondary, RhColor.Primary],
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 320,
      },
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 2, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'YingXiao',
          'YingxiaoGraph5',
          {},
          'assets/mock/biyi/YingXiao/YingxiaoGraph5.json',
          true //this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
  /** 产品年度投诉量统计图 */
  yearlyComplaint = new RhBasicLineChart(
    {
      dimensions: ['月份', '投诉量'],
      yAxisName: '(起)',
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 320,
      },
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'YingXiao',
          'YingxiaoGraph7',
          {},
          'assets/mock/biyi/YingXiao/YingxiaoGraph7.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
  /** 产品月度结构分析图数据 */
  monthlyProductStructureData = new RhvDisplayInstance(
    this,
    null,
    {
      data$: this.apiSer.getOuter(
        'YingXiao',
        'YingxiaoGraph6',
        {},
        'assets/mock/biyi/YingXiao/YingxiaoGraph6.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => ({
        segmentsData: [],
        items: [],
      }),
      convertor: (data: RhBoardData) => {
        const result = convertToStandardDatasetWithNumberFill(data);
        //console.log(result);
        return {
          segmentsData: result.dimensions
            .slice(1)
            .map((item, index) => new SelectItem(item, index as RhSafeAny)),
          items: result.dimensions.slice(1).map((item, index) => {
            return RhEchartsChartRequiredDataFormat.standardValue(
              ['产品', '数量'],
              result.dataset.map((row) => [row[0], row[index + 1]])
            );
          }),
        };
      },
    },
    {
      curSelectedItem: null,
      curItem: RhEchartsChartRequiredDataFormat.standardValue([], []),
      updateCurItem: (item: string) => {
        const value: RhEchartsChartRequiredDataFormat =
          this.monthlyProductStructureData.data.items[item] ||
          RhEchartsChartRequiredDataFormat.standardValue([], []);
        this.monthlyProductStructure.updateDataset(value.dataset);
      },
    }
  );

  /** 产品月度结构分析图 */
  monthlyProductStructure = new RhHorizontalStackBarChart(
    {
      dimensions: ['产品', '数量' /* 'Top1', 'Top2', 'Top3', 'Top4' */],
      colors: [
        RhColor.Primary,
        RhColor.Secondary,
        RhColor.Success,
        RhColor.Gray,
      ],
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 250,
      },
    }
    /*     {
      host: this,
      config: useStandardDisplayConfig(5, (i) => [
        createPlaceholderLabel(3),
        { name: createPlaceholderLabel(3), value: 0 },
        { name: createPlaceholderLabel(3), value: 0 },
        { name: createPlaceholderLabel(3), value: 0 },
        { name: createPlaceholderLabel(3), value: 0 },
      ]),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter('YunYing', '', {}, [
          ['产品', 'Top1', 'Top2', 'Top3', 'Top4'],
          [
            '空气炸锅',
            { name: 'ZG-408A', value: 2500 },
            { name: 'ZG-508A', value: 2000 },
            { name: 'ZG-510A', value: 1100 },
            { name: '其他系列', value: 1800 },
          ],
          [
            '咖啡机',
            { name: 'DF-408A', value: 2200 },
            { name: 'DF-508A', value: 1000 },
            { name: 'DF-510A', value: 700 },
            { name: '其他系列', value: 1900 },
          ],
          [
            '油炸锅',
            { name: 'YG-408A', value: 1700 },
            { name: 'YG-508A', value: 1300 },
            { name: 'YG-510A', value: 800 },
            { name: '其他系列', value: 1100 },
          ],
          [
            '饮水机',
            { name: 'YS-408A', value: 1700 },
            { name: 'YS-508A', value: 1000 },
            { name: 'YS-510A', value: 800 },
            { name: '其他系列', value: 1000 },
          ],
          [
            '电饭煲',
            { name: 'FB-408A', value: 1300 },
            { name: 'FB-508A', value: 1000 },
            { name: 'FB-510A', value: 800 },
            { name: '其他系列', value: 900 },
          ],
        ]),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    } */
  );

  /** 产品投诉原因分析图 */
  productComplaintReason = new RhBasicWordCloudChart(
    {
      dimensions: ['原因', '数量', '颜色'],
      dataset: [['暂无数据', 10, RhColor.Warning]] as RhSafeAny,
    },
    {
      host: this,
      config: useStandardDisplayConfig(null, null, null, null),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'YingXiao',
          'YingxiaoGraph8',
          {},
          'assets/mock/biyi/YingXiao/YingxiaoGraph8.json',
          true //this.enableMock
        ),
      },
      convertor: (data: RhBoardData) => {
        //console.log(data);
        const colors = [RhColor.Primary, RhColor.Warning, RhColor.Success];
        const dimensions = ['原因', '数量', '颜色'];
        const rows = data.children; //.slice(0, 10);
        const result = rows.map((item) => [
          item.item,
          item.children[0].value1,
          colors[item.children[0].value2],
        ]);
        return RhEchartsChartRequiredDataFormat.standardValue(
          dimensions,
          result
        );
      },
    }
  );
  /** 销售客户数据 */
  customerData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'YingXiao',
        'YingxiaoGraph17',
        {},
        'assets/mock/biyi/YingXiao/YingxiaoGraph17.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => ({
        values: {},
        size: {},
        percents: {},
      }),
      convertor: (data: RhBoardData) => {
        const values: Record<string, number> = {};
        const size = {};
        const percents: Record<string, number> = {};
        let max = 0;
        let sum = 0;
        const minSize = 40;
        const maxSize = 100;
        const det = maxSize - minSize;
        data.children.forEach((item) => {
          values[item.item] = item.value1;
          size[item.item] = 0;
          max = Math.max(max, item.value1);
          sum += item.value1;
        });
        Object.entries(values).forEach(([item, value]) => {
          const percent = value / sum;
          size[item] = Math.round(percent * det + minSize);
          percents[item] = RhmNumberHelper.unifyNumber(percent * 100, 1);
        });
        //console.log(values, size);
        return {
          values,
          size,
          percents,
        };
      },
    }
  );
  /** 当前的明细数据 */
  curDetailsData: RhSafeAny[] = [];
  /** 成品库龄分布数据 */
  productAgeData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'YingXiao',
        'YingxiaoGraph9',
        {},
        'assets/mock/biyi/YingXiao/YingxiaoGraph9.json',
        true //this.enableMock
      ),
      emptyData: () => ({ segmentsData: [], items: [] }),
      interval: 60000,
      convertor: (data: RhBoardData) => {
        const items = data.children;
        const segmentsData = [];
        const details = [];
        let tmp;
        items.forEach((item, index) => {
          segmentsData.push(new SelectItem(item.item, index as RhSafeAny));
          tmp = [];
          const total = sumBy(item.children, 'value1');
          let left = 0;
          let percent = 0;
          item.children.forEach((el) => {
            percent = RhmNumberHelper.unifyNumber((el.value1 * 100) / total, 1);
            tmp.push({
              name: el.item,
              left: left + '%',
              percent: percent,
              width: Math.min(percent, 100) + '%',
              value: el.value1,
            });
            left += percent;
          });
          details[index] = tmp;
        });
        return {
          segmentsData,
          items: details,
        };
      },
      onData: (data) => {
        //console.log(data);
      },
    },
    {
      curSelectedItem: null,
      curItem: [],
      updateCurItem: (item: string) => {
        const value = this.productAgeData.data.items[item] || [];
        //console.log(value);
        this.productAgeData.dataset.curItem = value;
      },
    }
  );

  //worldMap = new RhWorldMapChart({});
  /** 产量销售总量统计数据 */
  salesSummaryData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(null, null, null, null),
    {
      interval: 60000,
      data$: this.apiSer.getOuter(
        'YingXiao',
        'YingxiaoGraph10',
        {},
        'assets/mock/biyi/YingXiao/YingxiaoGraph10.json',
        this.enableMock
      ),
      emptyData: () => ({
        title: '',
        sumValue: 0,
        sumData: {
          result: '',
          segments: 0,
          unit: '',
        },
      }),
      convertor: (data: RhBoardData) => {
        const item = data.children[0];
        const sumData = this.convertNumber(
          item.children[0].value1 || 0,
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
          title: item.item,
          sumValue: item.children[0]?.value1 || 0,
          sumData: sumData,
        };
        //console.log(result);
        return result;
      },
    }
  );

  /** 产品销量Top5 */
  top5products = new RhTopRankBarChart(
    {
      dimensions: ['排名', '产品', '比值', '数值', '最大值'],
      valueBarEncoding: 3,
      bgBarEncoding: 4,
      rightLabelFormatter: '{@[3]}件({@[2]}%)',
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 300,
      },
    },
    {
      host: this,
      config: useStandardDisplayConfig(
        5,
        (i) => ['-', '---', 0, 0, 1800],
        0,
        0
      ),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'YingXiao',
          'YingxiaoGraph11',
          {},
          'assets/mock/biyi/YingXiao/YingxiaoGraph11.json',
          this.enableMock
        ),
      },
      convertor: (data: RhBoardData) => {
        const items = data.children;
        let max = 0;
        const result = [];
        items.forEach((item, index) => {
          max = Math.max(max, item.children[0].value1);
          result.push([
            index + 1,
            `${item.item}(${item.children[0].item})`,
            item.children[0].value2,
            item.children[0].value1,
          ]);
        });
        max = RhmNumberHelper.findM(max, 10);
        result.forEach((item) => {
          item[4] = max;
        });
        return {
          dimensions: ['排名', '产品', '比值', '数值', '最大值'],
          dataset: result,
        };
      },
    }
  );
  /** 销售数量统计的选项组数据 */
  salesSegmentsData = [
    { Value: 'Year', Text: '各年' },
    { Value: 'Season', Text: '各季' },
    { Value: 'Month', Text: '各月' },
  ];
  /** 销售数量统计 */
  salesSummary = new RhBarLineWithGradientChart(
    {
      dimensions: ['年份', '销量', '增长率'],
      barAxisName: '(万件)',
      barItemNumber: 1,
      lineItemNumber: 1,
      colors: [RhColor.Primary, RhColor.Success],
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 2, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        data$: this.apiSer.getOuter(
          'YingXiao',
          'YingxiaoGraph13',
          {},
          'assets/mock/biyi/YingXiao/YingxiaoGraph13.json',
          true //this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );

  /** 销售人员龙虎榜 */
  salesmanRankTable = RhRankTable.create({
    columns: [
      {
        key: 'Name',
        name: '姓名',
        width: '6.2rem',
      },
      {
        key: 'Value',
        name: '金额',
        width: '6.8rem',
      },
      {
        key: 'Rate',
        name: '占比',
        width: '6rem',
      },
    ],
    showHeader: false,
    pageSize: 6,
    data: [],
  });

  /** 销售人员top10数据 */
  salesmanData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(10, () => ['---', 0, 0], 0, 0),
    {
      data$: this.apiSer.getOuter(
        'YingXiao',
        'YingxiaoGraph12',
        {},
        'assets/mock/biyi/YingXiao/YingxiaoGraph12.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => ({
        first: {},
        second: {},
        total: [],
      }),
      convertor: (data: RhBoardData) => {
        const rows = data.children;
        const result = [];
        const sum = sumBy(rows, 'children[0].value1');
        rows.forEach((item, index) => {
          const value = item.children[0].value1 as number;
          result.push({
            Name: item.item,
            Value: `￥${value.toLocaleString()}`,
            Rate: `${RhmNumberHelper.unifyNumber((value * 100) / sum, 1)}%`,
            _rank_: index + 1,
          });
        });
        return {
          first: result[0],
          second: result[1],
          total: result,
        };
      },
      onData: (data) => {
        this.salesmanRankTable.data = data.total.slice(2);
      },
    }
  );

  /** 成品检验合格率统计的选项组数据 */
  productGoodRateSegmentsData: SelectItem[] = [];
  /** 当前选中的合格率产品 */
  curProductGoodRateItem: string = '';
  /**  成品检验合格率统计 */
  productGoodRate = new RhBasicLiquidFillChart({
    dataset: [['检验合格率', 0]],
  });
  /** 成品检验合格率数据 */
  productGoodRateData = new RhvDisplayInstance(
    this,
    useStandardDisplayConfig(0, 0, 0, 0),
    {
      data$: this.apiSer.getOuter(
        'YingXiao',
        'YingxiaoGraph15',
        {},
        'assets/mock/biyi/YingXiao/YingxiaoGraph15.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => ({
        segmentsData: [],
      }),
      convertor: (data: RhBoardData) => {
        const segmentsData = [];
        data.children.forEach((item) => {
          segmentsData.push({
            Value: item.item,
            Text: item.item,
            _value: item.children[0].value1 / 100,
          });
        });
        return {
          segmentsData: segmentsData,
        };
      },
      onData: (data) => {
        this.productGoodRateSegmentsData = data.segmentsData;
      },
    }
  );
  /** 切到下一个合格率 */
  nextProductGoodRate(item: string) {
    const target = this.productGoodRateData.data?.segmentsData.find(
      (el) => el.Value === item
    );
    if (target) {
      //console.log(target);
      this.productGoodRate?.updateDataset([['检验合格率', target._value]]);
    }
  }

  /** 成品收发月度统计图 */
  productInOutSummary = new RhLeftRightComparisonBarChart(
    {
      dimensions: ['月份', '入库', '出库'],
      mediaQueryBaseValue: {
        minWidth: 420,
        minHeight: 400,
      },
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

  /** 成品检验不良原因分析 */
  productBadReason = new RhBasicRadarChart(
    {
      dimensions: ['原因', '值'],
      dataset: [['--', 0]],
      axisNameFormatter: function (value: string) {
        return value.split('-').reverse()[0].replace('（', '\n（');
      },
    },
    {
      host: this,
      config: useStandardDisplayConfig(0, 1, 0, 0),
      dataSubscribeConfig: {
        interval: 60000,
        emptyData: () => [['--', 0]],
        data$: this.apiSer.getOuter(
          'YingXiao',
          'YingXiaoGraph16',
          {},
          'assets/mock/biyi/YingXiao/YingxiaoGraph16.json',
          this.enableMock
        ),
      },
      convertor: (data) => convertToStandardDatasetWithNumberFill(data),
    }
  );
}
