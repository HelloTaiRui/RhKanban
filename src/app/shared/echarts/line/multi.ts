import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';
import {
  useStandardCategoryXAXis,
  useStandardGrid,
  useStandardHorizontalLegend,
  useStandardLineLabel,
  useStandardTooltip,
  useStandardValueYAXis,
} from '../utils';

export class RhMultiLineChart<DataRow> extends RhEchartsChart<
  RhMultiLineChart<DataRow>
> {
  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 300,
  };

  get maxValue() {
    return Math.max(...this.dataset.map((item) => Math.max(...item.slice(1))));
  }

  protected createBaseOption(
    c: Partial<RhMultiLineChart<DataRow>>,
    rate: number
  ): EChartsOption {
    return {
      grid: useStandardGrid(rate),
      dataset: {
        source: c.datasetSource,
      },
      tooltip: useStandardTooltip(rate),
      color: c.colors,
      legend: useStandardHorizontalLegend(rate),
      xAxis: useStandardCategoryXAXis(rate, c.xAXixEnableRotate),
      yAxis: useStandardValueYAXis(
        rate,
        c.yAxisName,
        true,
        c.yAxisNameFormatter,
        c.splitNumber,
        c.maxValue
      ),
      series: c.series.map((row) => {
        return {
          type: 'line',
          smooth: true,
          //symbol: 'none',
          symbolSize: 8 * rate,
          label: useStandardLineLabel(rate),
        };
      }),
    };
  }
}
