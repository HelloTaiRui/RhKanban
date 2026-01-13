import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption, graphic } from 'echarts';
import 'echarts-wordcloud';

export class RhBubbleChart<Dataset> extends RhEchartsChart<
  RhBubbleChart<Dataset>
> {
  colors = [
    new graphic.RadialGradient(0.5, 0.5, 0.5, [
      {
        offset: 0,
        color: 'rgba(7, 131, 250, 0.2)',
      },
      {
        offset: 0.8,
        color: 'rgba(7, 131, 250, 0.4)',
      },
      {
        offset: 1,
        color: 'rgba(7, 131, 250, 0.6)',
      },
    ]),
    new graphic.RadialGradient(0.5, 0.5, 0.5, [
      {
        offset: 0.2,
        color: 'rgba(7, 209, 250, 0.2)',
      },
      {
        offset: 0.8,
        color: 'rgba(7, 209, 250, 0.4)',
      },
      {
        offset: 1,
        color: 'rgba(7, 209, 250, 0.6)',
      },
    ]),
  ];

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 250,
  };

  protected createBaseOption(
    c: Partial<RhBubbleChart<Dataset>>,
    rate: number
  ): EChartsOption {
    return {
      animationDurationUpdate: function (idx) {
        return idx * 100;
      },
      animationEasingUpdate: 'bounceIn',
      series: [
        {
          type: 'graph',
          layout: 'force',
          cursor: 'pointer',
          force: {
            repulsion: 120 * rate,
            edgeLength: 30 * rate,
          },
          roam: true,
          label: {
            show: true,
          },
          data: c.dataset.map((item) => {
            return {
              name: item[0],
              value: item[1],
              symbolSize: ((item[2] as RhSafeAny) * rate) as RhSafeAny,
              draggable: true,
              label: {
                fontSize: 18 * rate,
                color: '#fff',
                fontWeight: 400,
              },
              category: item[3],
              itemStyle: {
                color: this.getColor(item[3]),
                opacity: 1,
                borderWidth: 1,
                //borderColor: color[index],
                //shadowBlur: 7,
                //symbolOffset: 0.6,
                ///shadowColor: color[index],
              },
            };
          }),
        },
      ],
    };
  }
}
