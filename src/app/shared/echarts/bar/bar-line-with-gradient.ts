import { RhEchartsChart, RhSafeAny } from '@model';
import {
  BarSeriesOption,
  EChartsOption,
  graphic,
  LineSeriesOption,
} from 'echarts';
import {
  symbolResources,
  useStandardBarWidth,
  useStandardCategoryXAXis,
  useStandardGrid,
  useStandardHorizontalLegend,
  useStandardLineLabel,
  useStandardMultiHorizontalBarWithLinesLabelLayout,
  useStandardTooltip,
  useStandardValueMin,
  useStandardValueYAXis,
} from '../utils';
import tinycolor from 'tinycolor2';
import { RhmNumberHelper } from '@core';

export class RhBarLineWithGradientChart<Dataset> extends RhEchartsChart<
  RhBarLineWithGradientChart<Dataset>
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
  lineLabelFormatter: RhSafeAny = (params) => {
    //console.log(params);
    return params.value[params.encode.y[0]] + '%';
  };
  /** 柱状图Y轴的分割数 */
  barAxisSplitNumber = 5;
  /** 折线图Y轴的分割数 */
  lineAxisSplitNumber = 5;
  /** 柱状图的数据项个数 */
  barItemNumber = 1;
  /** 折线图的数据项个数 */
  lineItemNumber = 1;
  /** 折线图图形符号 */
  lineItemSymbol = symbolResources.Success();
  /** 折线图图形符号基准大小 */
  lineItemSymbolSize = 24;
  /** 折线图最小值 */
  lineValueMin: RhSafeAny = useStandardValueMin(1, 1);
  /** 柱子宽度 */
  barWidth: number = 16;

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 300,
  };

  protected createBaseOption(
    c: Partial<RhBarLineWithGradientChart<Dataset>>,
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
    const barYAxis = useStandardValueYAXis(
      rate,
      c.barAxisName,
      true,
      c.barAxisLabelFormatter,
      c.barAxisSplitNumber,
      barMax
    );
    const infos = [];
    return {
      tooltip: this.merge(
        useStandardTooltip(rate, (params: RhSafeAny) => {
          //console.log(params);
          const items = params.slice(
            0,
            c.barItemNumber + c.lineItemNumber
          ) as RhSafeAny[];
          return `<span  style="font-size:${14 * rate}px;">${
            items[0].axisValue
          }</span><br/><br/>${items
            .map((item, index) => {
              return `${item.marker}<span style="font-size:${
                14 * rate
              }px;margin-right:${14 * rate}px">${
                item.seriesName
              }</span> <span style="font-size:${
                14 * rate
              }px;text-align:right">${item.value?.[1 + index]}</span>`;
            })
            .join('<br/><br/>')}`;
        }),
        {}
      ),
      dataset: {
        source: c.dataset,
      },
      color: c.colors,
      legend: useStandardHorizontalLegend(rate),
      grid: useStandardGrid(rate),
      xAxis: [
        useStandardCategoryXAXis(rate),
        this.merge(useStandardCategoryXAXis(rate), {
          position: 'bottom',
          gridIndex: 0,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        }),
      ],
      yAxis: [
        barYAxis,
        useStandardValueYAXis(
          rate,
          c.lineAxisName,
          false,
          c.lineAxisLabelFormatter,
          c.lineAxisSplitNumber,
          lineMax,
          c.lineValueMin
        ),
      ],
      series: [
        ...barSeries.map((item, index) => {
          return {
            name: item,
            type: 'bar',
            barWidth: c.barWidth * rate,
            barGap: '0%',
            xAxisIndex: 0,
            yAxisIndex: 0,
            itemStyle: {
              color: new graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: this.getColor(c.colors[index]),
                },
                {
                  offset: 1,
                  color: tinycolor(this.getColor(c.colors[index]))
                    .setAlpha(0)
                    .toRgbString(),
                },
              ]),
            },
            label: {
              show: true,
              position: 'top',
              distance: 0,
              fontSize: 14 * rate,
              backgroundColor: 'transparent',
              color: '#fff',
              width: c.barWidth * rate,
              formatter: `{@${index + 1}}\n{bg|\u200B}`,
              rich: {
                bg: {
                  width: c.barWidth * rate,
                  backgroundColor: 'rgba(7, 209, 250, 1)',
                  height: 3 * rate,
                },
              },
            },
            labelLayout: useStandardMultiHorizontalBarWithLinesLabelLayout(
              infos,
              c.barItemNumber,
              rate
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
            itemStyle: {
              color: this.getColor(c.colors[barSeries.length + index]),
            },
            label: useStandardLineLabel(rate, c.lineLabelFormatter),
            labelLayout: useStandardMultiHorizontalBarWithLinesLabelLayout(
              infos,
              c.barItemNumber,
              rate
            ),
          } as LineSeriesOption;
        }),
        {
          type: 'bar',
          barWidth: useStandardBarWidth(rate) * 3,
          data: c.dataset.map(() => barYAxis.max as number),
          itemStyle: {
            color: 'rgba(7, 131, 250, 0.05)',
          },
          silent: true,
          z: 1,
          xAxisIndex: 1,
          yAxisIndex: 0,
        },
      ],
    };
  }
}
