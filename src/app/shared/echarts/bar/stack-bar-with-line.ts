import { RhEchartsChart, RhSafeAny } from '@model';
import {
  BarSeriesOption,
  EChartsOption,
  graphic,
  LineSeriesOption,
} from 'echarts';
import {
  symbolResources,
  useStandardBarLabel,
  useStandardBarWidth,
  useStandardCategoryXAXis,
  useStandardGrid,
  useStandardHorizontalLegend,
  useStandardLineLabel,
  useStandardMultiVerticalLabelLayout,
  useStandardTooltip,
  useStandardValueYAXis,
} from '../utils';
import { sum } from 'lodash';
import { RhmNumberHelper } from '@core';

export class RhStackBarWithLineChart<Dataset> extends RhEchartsChart<
  RhStackBarWithLineChart<Dataset>
> {
  /** 柱状图的Y轴名称 */
  barAxisName: string = '';
  /** 折线图的Y轴名称 */
  lineAxisName: string = '';
  /** 柱状图的Y轴标签格式化 */
  barAxisLabelFormatter?: string;
  /** 折线图的Y轴标签格式化 */
  lineAxisLabelFormatter?: RhSafeAny = (value) =>
    RhmNumberHelper.unifyNumber(value, 1) + '%';
  /** 折线图的标签格式化 */
  lineLabelFormatter: RhSafeAny = '{c}%';
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
  /** 图例字体大小 */
  legendFontSize: number = 18;
  /** 网格距顶部的距离 */
  gridTop: number = 80;

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 300,
  };

  protected createBaseOption(
    c: Partial<RhStackBarWithLineChart<Dataset>>,
    rate: number
  ): EChartsOption {
    const series = c.series;
    const barSeries = series.slice(0, c.barItemNumber);
    const lineSeries = series.slice(c.barItemNumber).slice(0, c.lineItemNumber);
    const barMax = Math.max(
      ...c.dataset.map((row) => sum(barSeries.map((item, i) => row[i + 1])))
    );
    //console.log(barMax);
    const lineMax = Math.max(
      ...c.dataset.map((row) =>
        sum(lineSeries.map((item, i) => row[i + 1 + barSeries.length]))
      )
    );
    const infos = [];
    const option = {
      tooltip: useStandardTooltip(rate),
      dataset: {
        source: c.datasetSource,
      },
      color: c.colors,
      grid: this.merge(useStandardGrid(rate), {
        top: c.gridTop * rate,
      }),
      legend: useStandardHorizontalLegend(rate, c.legendFontSize),
      xAxis: this.merge(useStandardCategoryXAXis(rate), {
        data: c.dataset.map((item) => item[0]),
      }),
      yAxis: [
        useStandardValueYAXis(
          rate,
          c.barAxisName,
          true,
          c.barAxisLabelFormatter,
          c.barAxisSplitNumber,
          barMax
        ),
        useStandardValueYAXis(
          rate,
          c.lineAxisName,
          false,
          c.lineAxisLabelFormatter,
          c.lineAxisSplitNumber,
          lineMax
        ),
      ],
      series: [
        ...barSeries.map((item, index) => {
          return {
            name: item,
            type: 'bar',
            stack: 'data',
            barWidth: useStandardBarWidth(rate),
            data: c.dataset.map((item) => item[index + 1]),
            //barGap: '0%',
            label: useStandardBarLabel(rate * 1, true /* , 'right' */),
            labelLayout: useStandardMultiVerticalLabelLayout(infos, rate),
          } as BarSeriesOption;
        }),
        ...lineSeries.map((item, index) => {
          return {
            name: item,
            type: 'line',
            symbolSize: c.lineItemSymbolSize * rate,
            symbol: c.lineItemSymbol,
            showSymbol: true,
            yAxisIndex: 1,
            data: c.dataset.map((item) => item[index + barSeries.length + 1]),
            label: useStandardLineLabel(rate, c.lineLabelFormatter),
            labelLayout: useStandardMultiVerticalLabelLayout(infos, rate),
          } as LineSeriesOption;
        }),
      ],
    };
    //console.log(option);
    return option as RhSafeAny;
  }
}
