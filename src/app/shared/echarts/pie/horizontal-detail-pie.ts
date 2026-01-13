import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';
import { useStandardTooltip } from '../utils';

export class RhHorizontalPieChart<Dataset> extends RhEchartsChart<
  RhHorizontalPieChart<Dataset>
> {
  unit: string = '';
  centerValue: number = 0;
  centerUnit: string = '';
  center = ['75%', '50%'];
  title: string = '';
  radius = ['65%', '80%'];
  legendLabelWidth = 80;
  baseItemNum = 5;
  formatter = (name: string, value: number, percent: number) => {
    return [
      `{a|${name}}`,
      `{b|${value || 0}${this.unit}(${percent.toFixed(0)}%)}`,
    ].join('');
  };

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 250,
  };

  protected createBaseOption(
    c: Partial<RhHorizontalPieChart<Dataset>>,
    rate: number
  ): EChartsOption {
    let total = 0;
    const map = c.dataset.reduce((obj, cur) => {
      if (!Reflect.has(obj, cur[0])) {
        obj[cur[0]] = cur[1];
      } else {
        obj[cur[0]] += cur[1];
      }
      total += cur[1] as number;
      return obj;
    }, {});
    const itemGap = 30 / ((c.dataset.length || c.baseItemNum) / c.baseItemNum);
    return {
      color: c.colors,
      tooltip: this.merge(useStandardTooltip(rate), { trigger: 'item' }),
      dataset: {
        source: c.datasetSource,
      },
      legend: [
        {
          top: 'center',
          left: '0%',
          orient: 'vertical',
          icon: 'circle',
          itemGap: itemGap * rate,
          itemWidth: 10 * rate,
          itemHeight: 10 * rate,
          formatter: (name) => {
            return c.formatter(
              name,
              map[name],
              (total == 0 ? 0 : map[name] / total) * 100
            );
            return [
              `{a|${name}}`,
              `{b|${map[name] || 0}${c.unit}(${(
                (total == 0 ? 0 : map[name] / total) * 100
              ).toFixed(0)}%)}`,
            ].join('');
          },
          textStyle: {
            rich: {
              a: {
                color: '#9EBFDB',
                fontSize: 18 * rate,
                lineHeight: 18 * rate,
                width: c.legendLabelWidth * rate,
                padding: [0, 5 * rate, 0, 5 * rate],
              },
              b: {
                color: '#fff',
                fontSize: 18 * rate,
                lineHeight: 18 * rate,
              },
            },
          },
        },
      ],
      title: {
        show: true,
        top: 'center',
        left: c.center[0],
        text: `{value|${c.centerValue}}{unit|${c.centerUnit}}\n{title|${c.title}}`,
        textVerticalAlign: 'top',
        textAlign: 'center',
        padding: 0,
        textStyle: {
          color: '#fff',
          fontWeight: 500,
          width: 100 * rate,
          rich: {
            value: {
              fontSize: 32 * rate,
            },
            unit: {
              fontSize: 16 * rate,
              padding: [0, 0, 0, 2 * rate],
            },
            title: {
              color: 'rgba(158, 191, 219, 1)',
              fontSize: 18 * rate,
              padding: [12 * rate, 0, 0, 0],
            },
          },
        },
      },
      series: [
        {
          //name: c.title,
          type: 'pie',
          radius: c.radius,
          center: c.center,
          avoidLabelOverlap: false,
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
        },
      ],
    };
  }
}
