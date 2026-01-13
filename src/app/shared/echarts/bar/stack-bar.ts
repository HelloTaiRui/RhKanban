import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';
import {
  useStandardBarLabel,
  useStandardBarWidth,
  useStandardCategoryXAXis,
  useStandardGrid,
  useStandardHorizontalLegend,
  useStandardMultiVerticalLabelLayout,
  useStandardTooltip,
  useStandardValueYAXis,
} from '../utils';
import { sum } from 'lodash';

export class RhStackBarChart<DataRow> extends RhEchartsChart<
  RhStackBarChart<DataRow>
> {
  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 400,
    minHeight: 250,
  };

  protected createBaseOption(
    c: Partial<RhStackBarChart<DataRow>>,
    rate: number
  ): EChartsOption {
    const max = Math.max(...c.dataset.map((item) => sum(item.slice(1))));
    //console.log(c.datasetSource);
    const infos = [];
    return {
      grid: useStandardGrid(rate),
      dataset: {
        source: c.datasetSource,
      },
      color: c.colors,
      tooltip: useStandardTooltip(rate),
      legend: this.merge(useStandardHorizontalLegend(rate), {
        data: c.dimensions.slice(1),
      }),
      xAxis: this.merge(useStandardCategoryXAXis(rate), {
        data: c.categories,
      }),
      yAxis: useStandardValueYAXis(
        rate,
        c.yAxisName,
        true,
        c.yAxisNameFormatter,
        c.splitNumber,
        max
      ),
      series: c.series.map((row, index) => {
        return {
          name: c.dimensions[index + 1],
          type: 'bar',
          stack: 'data',
          barWidth: useStandardBarWidth(rate),
          barGap: 0.5 * rate,
          label: useStandardBarLabel(rate, true, 'top'),
          labelLayout: useStandardMultiVerticalLabelLayout(infos, rate),
          data: c.dataset.map((item) => item[index + 1]),
        };
      }),
    };
  }
}
