import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';
import {
  RhColor,
  useStandardCategoryXAXis,
  useStandardGrid,
  useStandardLineLabel,
  useStandardSingleSeriesLabelLayout,
  useStandardTooltip,
  useStandardValueYAXis,
} from '../utils';
import { useStandardLinearGradientAreaColor } from '../utils/color';

export class RhBasicLineChart<Dataset> extends RhEchartsChart<
  RhBasicLineChart<Dataset>
> {
  /** 自定义区域颜色 */
  areaColor: RhSafeAny = RhColor.Primary;
  valueMin: RhSafeAny = 'dataMin';

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 250,
  };

  /** y轴名称 */
  yAxisName: string = '';
  protected createBaseOption(
    c: Partial<RhBasicLineChart<Dataset>>,
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
        '{value}',
        c.splitNumber,
        undefined,
        c.valueMin
      ),
      series: [
        {
          type: 'line',
          smooth: true,
          showSymbol: true,
          symbolSize: 8 * rate,
          areaStyle: {
            color: useStandardLinearGradientAreaColor(c.areaColor),
          },
          label: useStandardLineLabel(rate * c.labelSizeScale),
          labelLayout: useStandardSingleSeriesLabelLayout(rate),
        },
      ],
    };
  }
}
