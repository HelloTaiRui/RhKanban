import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';
import {
  useStandardBarLabel,
  useStandardBarWidth,
  useStandardCategoryYAXis,
  useStandardGrid,
  useStandardTooltip,
  useStandardValueXAXis,
} from '../utils';

export class RhHorizontalBarChart<Dataset> extends RhEchartsChart<
  RhHorizontalBarChart<Dataset>
> {
  labelFormatter: RhSafeAny;

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 300,
  };

  protected createBaseOption(
    c: Partial<RhHorizontalBarChart<Dataset>>,
    rate: number
  ): EChartsOption {
    return {
      grid: this.merge(
        useStandardGrid(rate),
        c.yAxisName ? {} : { top: 10 * rate }
      ),
      dataset: {
        source: c.datasetSource,
      },
      tooltip: useStandardTooltip(rate),
      xAxis: useStandardValueXAXis(
        rate,
        c.xAXisName,
        true,
        '{value}',
        c.splitNumber,
        c.maxValue
      ),
      yAxis: useStandardCategoryYAXis(rate, c.yAxisName, false),
      series: [
        {
          type: 'bar',
          barWidth: useStandardBarWidth(rate),
          label: this.merge(
            useStandardBarLabel(rate),
            c.labelFormatter
              ? ({
                  formatter: c.labelFormatter,
                } as RhSafeAny)
              : {}
          ),
        },
      ],
    };
  }
}
