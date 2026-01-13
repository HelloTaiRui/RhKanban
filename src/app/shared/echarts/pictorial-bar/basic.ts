import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';
import {
  RhColor,
  useStandardCategoryXAXis,
  useStandardGrid,
  useStandardTooltip,
  useStandardValueYAXis,
} from '../utils';

export class RhBasicPictorialBarChart<Dataset> extends RhEchartsChart<
  RhBasicPictorialBarChart<Dataset>
> {
  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 250,
  };

  protected createBaseOption(
    c: Partial<RhBasicPictorialBarChart<Dataset>>,
    rate: number
  ): EChartsOption {
    return {
      color: c.colors,
      grid: useStandardGrid(rate),
      dataset: {
        source: c.datasetSource as RhSafeAny,
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
          type: 'pictorialBar',
          //barCategoryGap: '0%',
          symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
          itemStyle: {
            borderWidth: 3 * rate,
            borderColor: RhColor.Primary,
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 14 * rate * c.labelSizeScale,
            fontWeight: 'normal',
            backgroundColor: 'transparent',
            color: '#fff',
            distance: 3 * rate,
          },
        },
      ],
    };
  }
}
