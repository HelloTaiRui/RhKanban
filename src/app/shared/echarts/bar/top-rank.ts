import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';
import { useStandardGrid } from '../utils';

export class RhTopRankBarChart<Dataset> extends RhEchartsChart<
  RhTopRankBarChart<Dataset>
> {
  bgBarEncoding = 5;
  valueBarEncoding = 2;
  leftLabelFormatter = '{@[1]}';
  rightLabelFormatter = '{@[3]}/{@[4]}({@[2]}%)';
  labelWidth = 220;

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 250,
  };

  protected createBaseOption(
    c: Partial<RhTopRankBarChart<Dataset>>,
    rate: number
  ): EChartsOption {
    const rows = c.dataset;
    const xMax = rows[0]?.[c.bgBarEncoding] || 100;
    return {
      grid: this.merge(useStandardGrid(rate), {
        left: 20 * rate,
        top: 25 * rate,
        bottom: 0 * rate,
      }),
      dataset: {
        source: c.datasetSource,
      },
      xAxis: {
        show: false,
        axisLabel: {
          show: false,
        },
        type: 'value',
        min: 0,
        max: xMax,
        interval: (xMax - 0) / 8,
      },
      yAxis: [
        {
          type: 'category',
          inverse: true,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#fff',
            fontSize: 18 * rate,
            margin: 12 * rate,
            verticalAlign: 'bottom',
            fontWeight: 400,
          },
        },
      ],
      series: [
        {
          type: 'bar',
          z: 3,
          barWidth: 6 * rate,
          itemStyle: {
            borderRadius: [6 * rate],
          },
          label: {
            show: false,
          },
          encode: {
            x: c.valueBarEncoding,
          },
        },
        {
          z: 1,
          name: '名称',
          type: 'bar',
          barWidth: 6 * rate,
          barGap: '-100%',
          itemStyle: {
            color: 'rgba(255,255,255,0)',
            borderRadius: [6 * rate],
          },
          encode: {
            x: c.bgBarEncoding,
          },
          label: {
            show: true, // 开启显示
            offset: [0 * rate, -20 * rate],
            padding: 0,
            formatter: c.leftLabelFormatter,
            color: '#9EBFDB',
            position: 'insideLeft', // 在左侧显示
            fontSize: 18 * rate,
            fontWeight: 400,
            lineHeight: 18 * rate,
            width: c.labelWidth * rate,
            overflow: 'truncate',
          },
        },
        {
          z: 2,
          name: '背景',
          type: 'bar',
          barWidth: 6 * rate,
          barGap: '-100%',
          itemStyle: {
            color: '#0D365D',
            borderRadius: [6 * rate],
          },
          encode: {
            x: c.bgBarEncoding,
          },
          label: {
            show: true, // 开启显示
            offset: [10 * rate, -20 * rate],
            formatter: c.rightLabelFormatter,
            color: '#fff',
            position: 'insideRight', // 在上方显示
            fontSize: 18 * rate,
            fontWeight: 400,
            lineHeight: 18 * rate,
          },
        },
      ],
    };
  }
}
