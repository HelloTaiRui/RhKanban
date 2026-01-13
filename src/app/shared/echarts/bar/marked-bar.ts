import { RhEchartsChart } from '@model';
import { EChartsOption } from 'echarts';
import {
  useStandardBarWidth,
  useStandardCategoryXAXis,
  useStandardGrid,
  useStandardValueYAXis,
} from '../utils';

export class RhMarkedBarChart extends RhEchartsChart<RhMarkedBarChart> {
  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 250,
  };

  protected createBaseOption(
    c: Partial<RhMarkedBarChart>,
    rate: number
  ): EChartsOption {
    return {
      grid: useStandardGrid(rate),
      dataset: {
        source: c.datasetSource,
      },
      xAxis: useStandardCategoryXAXis(rate, c.xAXixEnableRotate),
      yAxis: useStandardValueYAXis(rate, c.yAxisName),
      series: [
        {
          type: 'bar',
          barWidth: useStandardBarWidth(rate),
          label: {
            show: true,
            position: 'top',
            fontSize: 14 * rate * c.labelSizeScale,
            fontWeight: 'normal',
            backgroundColor: 'transparent',
            color: '#fff',
            distance: 24 * rate,
            formatter: function (params) {
              //console.log(params.value);
              return `No.${params.dataIndex + 1}`;
            },
          },
        },
        {
          type: 'pictorialBar',
          //barCategoryGap: '0%',
          symbol:
            'path://M36 18C36 27.9411 20.5 40 18 40C15.5 40 0 27.9411 0 18C0 8.05887 8.05887 0 18 0C27.9411 0 36 8.05887 36 18Z',
          symbolSize: [40 * rate, 44 * rate],
          symbolPosition: 'end',
          symbolOffset: [0, -52 * rate],
          itemStyle: {
            color: '#238ccf', //'#67C5F9',
          },
          label: {
            show: true,
            position: 'outside',
            fontSize: 12 * rate * c.labelSizeScale,
            backgroundColor: 'transparent',
            color: '#fff',
          },
          encode: {
            y: 1,
          },
        },
      ],
    };
  }
}
