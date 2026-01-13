import { RhEchartsChart, RhSafeAny } from '@model';
import {
  BarSeriesOption,
  EChartsOption,
  graphic,
  LineSeriesOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts';
import {
  useStandardBarLabel,
  useStandardBarWidth,
  useStandardCategoryXAXis,
  useStandardGrid,
  useStandardHorizontalLegend,
  useStandardLineLabel,
  useStandardTooltip,
  useStandardValueYAXis,
} from '../utils';

export class RhBottomBarWithTopLineChart<Dataset> extends RhEchartsChart<
  RhBottomBarWithTopLineChart<Dataset>
> {
  /** 柱状图的Y轴名称 */
  barAxisName: string = '';
  /** 折线图的Y轴名称 */
  lineAxisName: string = '';
  /** 柱状图的Y轴标签格式化 */
  barAxisLabelFormatter?: string;
  /** 折线图的Y轴标签格式化 */
  lineAxisLabelFormatter?: string;
  /** 柱状图Y轴的分割数 */
  barAxisSplitNumber = 4;
  /** 折线图Y轴的分割数 */
  lineAxisSplitNumber = 4;
  /** 柱状图的数据项个数 */
  barItemNumber = 2;
  /** 折线图的数据项个数 */
  lineItemNumber = 1;
  /** 折线图图形符号 */
  lineItemSymbol = 'rect';
  /** 折线图图形符号基准大小 */
  lineItemSymbolSize = 4;
  /** 折线图启用dataMin */
  lineUseDataMin = false;

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 300,
  };

  protected createBaseOption(
    c: Partial<RhBottomBarWithTopLineChart<Dataset>>,
    rate: number
  ): EChartsOption {
    const series = c.series;
    const barSeries = series.slice(0, c.barItemNumber);
    const lineSeries = series.slice(c.barItemNumber).slice(0, c.lineItemNumber);
    const barMax = Math.max(
      ...c.dataset.map((row) =>
        Math.max(...barSeries.map((item, i) => row[i + 1]))
      )
    );
    const lineMax = Math.max(
      ...c.dataset.map((row) =>
        Math.max(...lineSeries.map((item, i) => row[i + 1 + barSeries.length]))
      )
    );
    const categories = c.categories;
    return {
      tooltip: useStandardTooltip(rate),
      dataset: {
        source: c.datasetSource,
      },
      color: c.colors,
      grid: this.merge(useStandardGrid(rate), {
        bottom: (10 + 35 * lineSeries.length) * rate,
      }),
      legend: useStandardHorizontalLegend(rate),
      xAxis: [
        this.merge(useStandardCategoryXAXis(rate), {
          offset: 0,
        }),
        ...lineSeries.map((item, index) => {
          console.log(item, index);
          return {
            type: 'category',
            axisLabel: {
              fontSize: 14 * rate,
              margin: 12 * rate,
              interval: 0,
              color: '#fff',
              formatter: (params) => {
                console.log(params);
                return params.split(',')[1];
              },
            },
            //name: item,
            nameLocation: 'start',
            nameGap: 10 * rate,
            nameTextStyle: {
              fontSize: 14 * rate,
              color: '#fff',
            },
            data: categories.map((item, i) => {
              return {
                value: [
                  item,
                  c.dataset[i][index + 1 + barSeries.length],
                ] as RhSafeAny,
              };
            }),
            offset: 35 * (index + 1),
            position: 'bottom',
          } as XAXisComponentOption;
        }),
      ],
      yAxis: [
        useStandardValueYAXis(
          rate,
          c.barAxisName,
          true,
          c.barAxisLabelFormatter,
          c.barAxisSplitNumber,
          barMax
        ),
        this.merge(
          useStandardValueYAXis(
            rate,
            c.lineAxisName,
            false,
            c.lineAxisLabelFormatter,
            c.lineAxisSplitNumber,
            c.lineUseDataMin ? undefined : lineMax
          ),
          {}
        ),
      ],
      series: [
        ...barSeries.map((item) => {
          return {
            name: item,
            type: 'bar',
            barWidth: useStandardBarWidth(rate),
            barGap: '0%',
            label: useStandardBarLabel(rate),
            xAxisIndex: 0,
            yAxisIndex: 0,
          } as BarSeriesOption;
        }),
        ...lineSeries.map((item) => {
          return {
            name: item,
            type: 'line',
            symbolSize: c.lineItemSymbolSize * rate,
            symbol: c.lineItemSymbol,
            showSymbol: true,
            xAxisIndex: 0,
            yAxisIndex: 1,
            label: {
              show: false,
            },
          } as LineSeriesOption;
        }),
      ],
    };
  }
}
