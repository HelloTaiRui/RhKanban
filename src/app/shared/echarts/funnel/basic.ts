import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption, graphic } from 'echarts';
import { RhmNumberHelper } from '@core';
import tinycolor from 'tinycolor2';

export class RhBasicFunnelChart<Dataset> extends RhEchartsChart<
  RhBasicFunnelChart<Dataset>
> {
  public unit: string = '件';

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 180,
  };

  protected createBaseOption(
    c: Partial<RhBasicFunnelChart<Dataset>>,
    rate: number
  ): EChartsOption {
    const max = RhmNumberHelper.findM(
      Math.max(...c.dataset.map((item) => item[1])),
      8
    );
    return {
      dataset: {
        source: c.datasetSource,
      },
      color: c.colors,
      series: [
        {
          name: '数据',
          type: 'funnel',
          left: '5%',
          top: '10%',
          bottom: '5%',
          right: '45%',
          min: 0,
          max: max,
          minSize: '0%',
          maxSize: '60%',
          sort: 'descending',
          gap: 10 * rate,
          label: {
            show: true,
            position: 'right',
            fontSize: 20 * rate,
            lineHeight: 26 * rate,
            fontFamily: 'PingFang SC',
            fontWeight: 400,
            borderWidth: 0,
            backgroundColor: 'transparent',
            color: '#fff',
            rich: {
              label: {
                color: '#9EBFDB',
              },
            },
            formatter: (params) => {
              //console.log(params);
              return `{label|${params.name}}  ${params.value.toLocaleString()}${
                c.unit
              }`;
            },
          },
          labelLine: {
            show: false,
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 0,
          },
          data: c.dataset.map((item, index) => {
            return {
              name: item[0],
              value: item[1],
              itemStyle: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    color: tinycolor(this.getColor(index))
                      .setAlpha(0.6)
                      .toRgbString(),
                    offset: 0,
                  },
                  {
                    color: tinycolor(this.getColor(index))
                      .setAlpha(0.2)
                      .toRgbString(),
                    offset: 1,
                  },
                ]),
                borderColor: this.getColor(index),
                borderWidth: 3 * rate,
              },
            };
          }),
        },
      ],
    };
  }
}
