import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';
import {
  defaultColorList,
  useStandardCategoryXAXis,
  useStandardGrid,
  useStandardHorizontalLegend,
  useStandardLinearGradientAreaColor,
  useStandardLineLabel,
  useStandardTooltip,
  useStandardValueYAXis,
} from '../utils';

export class RhMultiWithGradientLineChart<DataRow> extends RhEchartsChart<
  RhMultiWithGradientLineChart<DataRow>
> {
  colors = defaultColorList;

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 250,
  };

  protected createBaseOption(
    c: Partial<RhMultiWithGradientLineChart<DataRow>>,
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
      series: c.series.map((row, index) => {
        return {
          type: 'line',
          smooth: true,
          //symbol: 'none',
          symbolSize: 8 * rate,
          areaStyle: {
            color: useStandardLinearGradientAreaColor(c.colors[index]),
          },
          label: useStandardLineLabel(rate),
        };
      }),
    };
  }
}
