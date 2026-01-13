import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';
import { useStandardTooltip } from '../utils';

export class RhEquipmentStatusPieChart<Dataset> extends RhEchartsChart<
  RhEquipmentStatusPieChart<Dataset>
> {
  dimensions: string[] = ['状态', '时长'];
  dataset = [
    ['运行时长', 34],
    ['待机时长', 26],
    ['停机时长', 7],
  ];
  centerValue: number = 51;
  centerUnit: string = '%';

  valueUnit: string = 'h';
  //colors = ['#20E6A4', '#FFD15C', '#FF2E2E'];
  colors = ['#20E6A4', '#FFD15C', '#EE6F7C'];

  title: string = '';

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 300,
  };

  protected createBaseOption(
    c: Partial<RhEquipmentStatusPieChart<Dataset>>,
    rate: number
  ): EChartsOption {
    let total = 0;
    const map = c.dataset.reduce((obj, cur) => {
      obj[cur[0]] = cur[1];
      total += cur[1] as number;
      return obj;
    }, {});

    return {
      color: c.colors,
      tooltip: this.merge(useStandardTooltip(rate), {
        trigger: 'item',
      }),
      dataset: {
        source: c.datasetSource,
      },
      legend: [
        {
          top: 'bottom',
          left: 'center',
          //orient: 'vertical',
          icon: 'circle',
          itemGap: 40 * rate,
          itemWidth: 12 * rate,
          itemHeight: 12 * rate,
          formatter: (name) => {
            return [
              `{a|${name}}`,
              `{b|${map[name]}${c.valueUnit}(${(
                (map[name] / total) *
                100
              ).toFixed(0)}%)}`,
            ].join('\n');
          },
          textStyle: {
            rich: {
              a: {
                color: '#9EBFDB',
                fontSize: 18 * rate,
                lineHeight: 40 * rate,
                padding: [20 * rate, 0, 0, 5 * rate],
              },
              b: {
                color: '#fff',
                fontSize: 18 * rate,
                lineHeight: 25 * rate,
                padding: [30 * rate, 0, 0, 5 * rate],
              },
            },
          },
        },
      ],
      title: {
        show: true,
        top: '30%',
        left: '50%',
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
          radius: ['50%', '60%'],
          center: ['50%', '40%'],
          left: 0,
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
