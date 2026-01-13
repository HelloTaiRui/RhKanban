import { RhmNumberHelper } from '@core';
import { RhEchartsChart } from '@model';
import { EChartsOption, graphic } from 'echarts';
import 'echarts-liquidfill';

export class RhMultiLiquidFillChart<DataRow> extends RhEchartsChart<
  RhMultiLiquidFillChart<DataRow>
> {
  dimensions: string[] = ['工厂', '比率'];
  dataset = [];

  centers = ['18%', '50%', '82%'];
  radius = '62%';
  top = '48%';
  titleBottom = '0%';
  colors = [
    new graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: '#0783FA',
      },
      {
        offset: 1,
        color: 'rgba(7, 131, 250, 0.2)',
      },
    ]),
    new graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: '#07D1FA',
      },
      {
        offset: 1,
        color: 'rgba(7, 209, 250, 0.2)',
      },
    ]),
    new graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: '#20E6A4',
      },
      {
        offset: 1,
        color: 'rgba(32, 230, 164, 0.2)',
      },
    ]),
  ];

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 170,
  };

  protected createBaseOption(
    c: Partial<RhMultiLiquidFillChart<DataRow>>,
    rate: number
  ): EChartsOption {
    const series = [];
    const rows = c.dataset;
    for (let i = 0; i < rows.length; i++) {
      const item = {
        type: 'liquidFill',
        radius: c.radius,
        center: [c.centers[i], c.top],
        amplitude: '4%',
        //  shape: 'roundRect',
        data: [
          {
            name: rows[i][0],
            value: rows[i][1],
          },
        ],
        backgroundStyle: {
          color: 'rgba(13, 54, 93, 1)',
        },
        outline: {
          borderDistance: 5 * rate,
          itemStyle: {
            borderWidth: 1 * rate,
            borderColor: 'rgba(158, 191, 219, 0.4)',
          },
        },
        color: [c.colors[i]],
        label: {
          normal: {
            //此处没有生效，本地生效
            textStyle: {
              fontSize: 22 * rate,
              color: '#fff',
              fontWeight: 400,
            },
            formatter: function (params) {
              //console.log(params);
              return RhmNumberHelper.unifyNumber(params.value * 100, 1) + '%';
            },
          },
        },
      };
      series.push(item);
    }

    return {
      graphic: [],
      title: rows.map((item, i) => {
        return {
          text: item[0] as string,
          left: c.centers[i],
          bottom: c.titleBottom,
          textStyle: {
            fontSize: 18 * rate,
            color: 'rgba(158, 191, 219, 1)',
          },
          padding: 0,
          textAlign: 'center',
        };
      }),
      series: series,
    };
  }
}
