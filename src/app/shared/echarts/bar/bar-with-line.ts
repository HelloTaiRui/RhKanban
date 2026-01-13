import { RhEchartsChart, RhSafeAny } from '@model';
import {
  BarSeriesOption,
  EChartsOption,
  graphic,
  LineSeriesOption,
} from 'echarts';
import {
  useStandardBarLabel,
  useStandardBarWidth,
  useStandardCategoryXAXis,
  useStandardGrid,
  useStandardHorizontalLegend,
  useStandardLineLabel,
  useStandardMultiHorizontalBarWithLinesLabelLayout,
  useStandardTooltip,
  useStandardValueYAXis,
} from '../utils';
import { RhmNumberHelper } from '@core';

export class RhBarWithLineChart<Dataset> extends RhEchartsChart<
  RhBarWithLineChart<Dataset>
> {
  /** 柱状图的Y轴名称 */
  barAxisName: string = '';
  /** 折线图的Y轴名称 */
  lineAxisName: string = '';
  /** 柱状图的Y轴标签格式化 */
  barAxisLabelFormatter?: string;
  /** 折线图的Y轴标签格式化 */
  lineAxisLabelFormatter: RhSafeAny = (value) =>
    RhmNumberHelper.unifyNumber(value, 1) + '%';
  /** 折线图的标签格式化 */
  lineLabelFormatter: RhSafeAny = (params) => {
    //console.log(params);
    return params.value[params.encode.y[0]] + '%';
  };
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
  /** 折线图值 */
  lineValueMin: RhSafeAny = 0;

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 300,
  };

  protected createBaseOption(
    c: Partial<RhBarWithLineChart<Dataset>>,
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
    const infos = [];
    return {
      tooltip: useStandardTooltip(rate),
      dataset: {
        source: c.datasetSource,
      },
      color: c.colors,
      grid: useStandardGrid(rate, c.gridTop),
      legend: useStandardHorizontalLegend(rate),
      xAxis: useStandardCategoryXAXis(rate, c.xAXixEnableRotate),
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
          undefined,
          c.lineValueMin
        ),
      ],
      series: [
        ...barSeries.map((item) => {
          return {
            name: item,
            type: 'bar',
            barWidth: useStandardBarWidth(rate),
            barGap: '0%',
            label: useStandardBarLabel(rate * c.labelSizeScale),
            labelLayout: useStandardMultiHorizontalBarWithLinesLabelLayout(
              infos,
              c.barItemNumber,
              rate,
              c.xLabelGap,
              c.yLabelGap
            ),
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
            label: useStandardLineLabel(
              rate * c.labelSizeScale,
              c.lineLabelFormatter
            ),
            labelLayout: useStandardMultiHorizontalBarWithLinesLabelLayout(
              infos,
              c.barItemNumber,
              rate,
              c.xLabelGap,
              c.yLabelGap
            ),
          } as LineSeriesOption;
        }),
      ],
    };
  }
}
