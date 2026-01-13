import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';
import {
  useStandardBarLabel,
  useStandardBarWidth,
  useStandardCategoryXAXis,
  useStandardGrid,
  useStandardSingleSeriesLabelLayout,
  useStandardTooltip,
  useStandardValueYAXis,
} from '../utils';

export class RhBasicBarChart<Dataset> extends RhEchartsChart<
  RhBasicBarChart<Dataset>
> {
  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 250,
  };

  protected createBaseOption(
    c: Partial<RhBasicBarChart<Dataset>>,
    rate: number
  ): EChartsOption {
    return {
      grid: useStandardGrid(rate),
      dataset: {
        source: c.datasetSource,
      },
      tooltip: useStandardTooltip(rate),
      xAxis: useStandardCategoryXAXis(rate, c.xAXixEnableRotate),
      yAxis: useStandardValueYAXis(
        rate,
        c.yAxisName,
        true,
        c.yAxisNameFormatter,
        c.splitNumber,
        c.maxValue
      ),
      series: [
        {
          type: 'bar',
          barWidth: useStandardBarWidth(rate),
          label: useStandardBarLabel(rate),
          labelLayout: useStandardSingleSeriesLabelLayout(rate),
        },
      ],
    };
  }
}
