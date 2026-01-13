import { RhmNumberHelper } from '@core';
import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';

export class RhBasicRadarChart<Dataset> extends RhEchartsChart<
  RhBasicRadarChart<Dataset>
> {
  dataset: any[] = [['--', 0]];
  /** 指示轴的显示标签 */
  axisNameFormatter: RhSafeAny = '{value}';

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 300,
  };

  protected createBaseOption(
    c: Partial<RhBasicRadarChart<Dataset>>,
    rate: number
  ): EChartsOption {
    const values = c.dataset.map((item) => item[1]);
    const max =
      RhmNumberHelper.findM(Math.max(...values), c.dataset.length) || 100;
    return {
      radar: {
        center: ['50%', '50%'],
        radius: '70%',
        splitNumber: 5,
        indicator: c.dataset.map((item) => {
          return {
            name: item[0] as string,
            max: max,
          };
        }),
        // 圈圈网颜色
        splitLine: {
          show: true,
          lineStyle: {
            // color:'rgba(115, 126, 135, 1)',
            color: [
              'rgba(115, 126, 135, 1)',
              'rgba(115, 126, 135, 0.8)',
              'rgba(115, 126, 135, 0.6)',
              'rgba(115, 126, 135, 0.6)',
              'rgba(115, 126, 135, 0.8)',
            ],
            width: 0.5,
          },
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(119, 140, 162, 0.1)'],
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(7, 131, 250, 1)', //'#9EBFDB',
          },
        },
        axisName: {
          color: '#9EBFDB',
          fontSize: 18 * rate,
          overflow: 'truncate',
          formatter: c.axisNameFormatter,
        },
        axisNameGap: 10 * rate,
      },
      series: [
        {
          name: '',
          type: 'radar',
          symbol: 'circle',
          symbolSize: 8 * rate,
          data: [
            {
              value: values,
              lineStyle: {
                //网调线
                width: 1,
                color: 'rgba(32, 152, 232, 1)',
              },
              symbolSize: 8 * rate, //圆圈大小
              itemStyle: {
                //调点的样式
                color: '#fff',
                shadowColor: 'rgba(32, 189, 232, 1)',
                shadowBlur: 10,
              },
              areaStyle: {
                // 内网颜色
                color: {
                  type: 'linear',
                  x: 1,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(7, 131, 250, 0.1)',
                    },
                    {
                      offset: 0.2,
                      color: 'rgba(7, 131, 250, 0.3)',
                    },
                    {
                      offset: 0.5,
                      color: 'rgba(7, 131, 250, 0.6)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(7, 131, 250, 0.8)',
                    },
                  ],
                  global: false, // 缺省为 false
                },
                opacity: 1,
              },
            },
          ],
        },
      ],
    };
  }
}
