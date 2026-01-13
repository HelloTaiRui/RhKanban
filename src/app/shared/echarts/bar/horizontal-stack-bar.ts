import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';
import {
  useStandardBarLabel,
  useStandardBarWidth,
  useStandardCategoryYAXis,
  useStandardGrid,
  useStandardHorizontalLegend,
  useStandardTooltip,
  useStandardValueXAXis,
} from '../utils';
import { sumBy } from 'lodash';

export class RhHorizontalStackBarChart<DataRow> extends RhEchartsChart<
  RhHorizontalStackBarChart<DataRow>
> {
  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 400,
    minHeight: 250,
  };

  protected createBaseOption(
    c: Partial<RhHorizontalStackBarChart<DataRow>>,
    rate: number
  ): EChartsOption {
    const rows = c.dataset;
    const max = Math.max(
      ...c.dataset.map((item) => sumBy(item.slice(1), 'value'))
    );
    return {
      grid: useStandardGrid(rate, true),
      dataset: {
        source: c.datasetSource,
      },
      tooltip: useStandardTooltip(rate),
      color: c.colors,
      legend: useStandardHorizontalLegend(rate),
      xAxis: useStandardValueXAXis(
        rate,
        undefined,
        true,
        '{value}',
        c.splitNumber,
       // max
      ),
      yAxis: this.merge(useStandardCategoryYAXis(rate, c.yAxisName, false), {
        data: rows.map((row) => row[0]),
      }),
      series: c.series.map((row, index) => {
        return {
          type: 'bar',
          stack: 'data',
          barWidth: useStandardBarWidth(rate),
          barGap: 0.5 * rate,
          data: rows.map((row) => row[index + 1]),
          label: useStandardBarLabel(rate),
        };
      }),
    };
  }
}
