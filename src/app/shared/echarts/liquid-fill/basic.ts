import { RhmNumberHelper } from '@core';
import { RhEchartsChart } from '@model';
import { EChartsOption, graphic } from 'echarts';
import 'echarts-liquidfill';

export class RhBasicLiquidFillChart<DataRow> extends RhEchartsChart<
  RhBasicLiquidFillChart<DataRow>
> {
  dimensions: string[] = ['名称', '数值'];
  dataset = [['比率', 0]];

  radius = '85%';

  color = new graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: '#0783FA',
    },
    {
      offset: 1,
      color: 'rgba(7, 131, 250, 0.2)',
    },
  ]);

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 270,
    minHeight: 270,
  };

  protected createBaseOption(
    c: Partial<RhBasicLiquidFillChart<DataRow>>,
    rate: number
  ): EChartsOption {
    var series = [];
    var item = {
      type: 'liquidFill',
      radius: c.radius,
      center: ['50%', '53%'],
      amplitude: '4%',
      //  shape: 'roundRect',
      data: [
        {
          name: c.dataset[0][0],
          value: c.dataset[0][1],
        },
      ],
      backgroundStyle: {
        color: 'rgba(13, 54, 93, 1)',
      },
      outline: {
        borderDistance: 10 * rate,
        itemStyle: {
          borderWidth: 1 * rate,
          borderColor: 'rgba(158, 191, 219, 0.4)',
        },
      },
      color: [c.color],
      label: {
        normal: {
          textStyle: {
            fontSize: 40 * rate,
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
    return {
      graphic: [],
      series: series,
    };
  }
}
