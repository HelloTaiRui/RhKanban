import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption, graphic } from 'echarts';
import {
  useStandardBarLabel,
  useStandardBarWidth,
  useStandardCategoryXAXis,
  useStandardGrid,
  useStandardTooltip,
  useStandardValueYAXis,
} from '../utils';

export class RhGradientBarWithTopMarkChart<Dataset> extends RhEchartsChart<
  RhGradientBarWithTopMarkChart<Dataset>
> {
  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 250,
  };

  protected createBaseOption(
    c: Partial<RhGradientBarWithTopMarkChart<Dataset>>,
    rate: number
  ): EChartsOption {
    const yAxis = useStandardValueYAXis(
      rate,
      c.yAxisName,
      true,
      c.yAxisNameFormatter,
      c.splitNumber,
      c.maxValue
    );
    const max = yAxis.max as number;
    return {
      grid: [useStandardGrid(rate)],
      dataset: {
        source: c.datasetSource,
      },
      tooltip: this.merge(
        useStandardTooltip(rate, (params: RhSafeAny) => {
          //console.log(params);
          const items = params.slice(0, 1) as RhSafeAny[];
          return `${items[0].axisValue}<br/><br/>${items
            .map((item) => {
              return `${item.marker}${item.seriesName} ${item.value[1]}`;
            })
            .join('<br/><br/>')}`;
        }),
        {}
      ),
      xAxis: [
        this.merge(useStandardCategoryXAXis(rate), {
          splitLine: {
            show: false,
          },
        }),
        this.merge(useStandardCategoryXAXis(rate), {
          position: 'bottom',
          gridIndex: 0,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        }),
      ],
      yAxis: [yAxis],
      series: [
        {
          type: 'bar',
          barWidth: useStandardBarWidth(rate),
          z: 2,
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            color: new graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: 'rgba(7, 131, 250, 1)',
              },
              {
                offset: 1,
                color: 'rgba(7, 131, 250, 0)',
              },
            ]),
          },
          label: {
            show: true,
            position: 'top',
            distance: 0,
            fontSize: 14 * rate,
            backgroundColor: 'transparent',
            color: '#fff',
            width: useStandardBarWidth(rate),
            formatter: `{@1}\n{bg|\u200B}`,
            rich: {
              bg: {
                width: useStandardBarWidth(rate),
                backgroundColor: 'rgba(7, 209, 250, 1)',
                height: 3 * rate,
              },
            },
          },
        },
        {
          type: 'bar',
          barWidth: useStandardBarWidth(rate) * 3,
          data: c.dataset.map(() => max),
          itemStyle: {
            color: 'rgba(7, 131, 250, 0.05)',
          },
          silent: true,
          z: 1,
          xAxisIndex: 1,
          yAxisIndex: 0,
        },
      ],
    };
  }
}
