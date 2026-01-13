import { RhEchartsChart } from '@model';
import { EChartsOption } from 'echarts';
import {
  useStandardBarLabel,
  useStandardBarWidth,
  useStandardCategoryXAXis,
  useStandardGrid,
  useStandardHorizontalLegend,
  useStandardMultiHorizontalLabelLayout,
  useStandardTooltip,
  useStandardValueYAXis,
} from '../utils';

export class RhMultiBarChart extends RhEchartsChart<RhMultiBarChart> {
  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 400,
    minHeight: 250,
  };

  protected createBaseOption(
    c: Partial<RhMultiBarChart>,
    rate: number
  ): EChartsOption {
    const barMax = Math.max(
      ...c.dataset.map((row) =>
        Math.max(...c.series.map((item, i) => row[i + 1]))
      )
    );
    const infos = [];
    return {
      grid: useStandardGrid(rate),
      dataset: {
        source: c.datasetSource,
      },
      color: c.colors,
      tooltip: useStandardTooltip(rate),
      legend: useStandardHorizontalLegend(rate),
      xAxis: useStandardCategoryXAXis(rate, c.xAXixEnableRotate),
      yAxis: useStandardValueYAXis(
        rate,
        c.yAxisName,
        true,
        c.yAxisNameFormatter,
        c.splitNumber,
        barMax
      ),
      series: c.series.map((row) => {
        return {
          type: 'bar',
          barWidth: useStandardBarWidth(rate),
          barGap: 0.5 * rate,
          label: useStandardBarLabel(rate * c.labelSizeScale),
          labelLayout: useStandardMultiHorizontalLabelLayout(infos, rate),
        };
      }),
    };
  }
}
