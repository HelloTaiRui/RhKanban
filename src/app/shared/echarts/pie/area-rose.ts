import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';
import { RhColor } from '../utils';

export class RhAreaRosePieChart<Dataset> extends RhEchartsChart<
  RhAreaRosePieChart<Dataset>
> {
  dimensions: string[] = ['不良项', '数值'];
  percentPrecision: number = 1;
  colors = [
    RhColor.Primary,
    RhColor.Secondary,
    RhColor.Warning,
    RhColor.Success,
    RhColor.Other2,
  ];

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 250,
  };

  protected createBaseOption(
    c: Partial<RhAreaRosePieChart<Dataset>>,
    rate: number
  ): EChartsOption {
    return {
      color: c.colors,
      dataset: {
        source: c.datasetSource,
      },
      series: [
        {
          //name: c.title,
          type: 'pie',
          radius: ['25%', '58%'],
          center: ['50%', '50%'],
          roseType: 'area',
          avoidLabelOverlap: false,
          percentPrecision: c.percentPrecision,
          label: {
            show: true,
            position: 'outside',
            color: '#fff',
            backgroundColor: 'transparent',
            fontSize: 14 * rate,
            borderWidth: 0,
            formatter: '{value|{d}}{unit|%}\n{title|{b}}',
            rich: {
              value: {
                fontSize: 14 * rate,
              },
              unit: {
                fontSize: 14 * rate,
                padding: [0, 0, 0, 0 * rate],
              },
              title: {
                color: 'rgba(158, 191, 219, 1)',
                fontSize: 12 * rate,
                padding: [2 * rate, 0, 0, 0],
              },
            },
          },
          labelLine: {
            show: true,
          },
          /*           emphasis: {
            label: {
              show: true,
            },
          }, */
        },
      ],
    };
  }
}
