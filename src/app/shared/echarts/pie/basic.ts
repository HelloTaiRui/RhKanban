import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';
import { RhColor } from '../utils';

export class RhBasicPieChart<Dataset> extends RhEchartsChart<
  RhBasicPieChart<Dataset>
> {
  dimensions: string[] = ['不良项', '数值'];
  dataset = [];

  colors = [
    RhColor.Primary,
    RhColor.Secondary,
    RhColor.Warning,
    RhColor.Success,
    RhColor.Other2,
    RhColor.Gray,
    RhColor.Other1,
    RhColor.Danger,
  ];

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 250,
  };

  protected createBaseOption(
    c: Partial<RhBasicPieChart<Dataset>>,
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
          radius: ['40%', '50%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          percentPrecision: 0,
          label: {
            show: true,
            position: 'outside',
            color: '#fff',
            borderWidth: 0,
            formatter: '{title|{b}} {value|{d}}{unit|%}',
            rich: {
              value: {
                fontSize: 14 * rate,
                lineHeight: 14 * rate,
              },
              unit: {
                fontSize: 14 * rate,
                lineHeight: 14 * rate,
                padding: [0, 0, 0, 0 * rate],
              },
              title: {
                color: 'rgba(158, 191, 219, 1)',
                fontSize: 14 * rate,
                lineHeight: 14 * rate,
                padding: [0 * rate, 0, 0, 0],
              },
            },
            alignTo: 'labelLine',
          },
          labelLine: {
            show: true,
            //length: 40 * rate,
            length2: 20 * rate,
          },
        },
      ],
    };
  }
}
