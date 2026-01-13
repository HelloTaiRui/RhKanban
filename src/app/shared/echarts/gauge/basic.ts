import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';
import { RhColor } from '../utils';
import { findLastIndex } from 'lodash';

export class RhBasicGaugeChart<Dataset> extends RhEchartsChart<
  RhBasicGaugeChart<Dataset>
> {
  dimensions: string[] = ['名称', '数值'];

  dataset: any[] = [['达成率', 0]];

  colorStops = [0, 60, 90];

  colors: any[] = [RhColor.Danger, RhColor.Warning, RhColor.Success];

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 200,
  };

  /** y轴名称 */
  yAxisName: string = '';
  protected createBaseOption(
    c: Partial<RhBasicGaugeChart<Dataset>>,
    rate: number
  ): EChartsOption {
    const width = 24 * rate;
    const data = c.dataset[0];
    const color = this.getColor(
      findLastIndex(this.colorStops, (item) => data[1] > item)
    );
    //console.log(c.dataset);
    return {
      series: [
        {
          type: 'gauge',
          name: '达成率',
          radius: '100%',
          center: ['50%', '52%'],
          anchor: {
            show: true,
            showAbove: true,
            size: 6 * rate,
            itemStyle: {
              color: '#fff', //'#FAC858',
            },
          },
          pointer: {
            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
            width: 2 * rate,
            itemStyle: {
              color: '#B4E5FF',
            },
            length: '80%',
            offsetCenter: [0, 0],
          },
          progress: {
            show: true,
            overlap: true,
            roundCap: false,
            width: width,
            itemStyle: {
              color: '#0783FACC',
            },
          },
          splitLine: {
            show: true,
            length: width / 3,
            distance: -0.64 * width,
            lineStyle: {
              color: 'rgb(121,162,192)',
              width: 2 * rate,
            },
          },
          axisTick: {
            show: false, //刻度压在轴刻度线上了，导致显示颜色异常
            splitNumber: 3,
            length: width / 3,
            distance: -0.64 * width,
            lineStyle: {
              color: 'rgb(47,79,112)',
              width: 2 * rate,
            },
          },
          axisLine: {
            roundCap: false,
            lineStyle: {
              width: width,
              color: [[1, 'rgb(32,60,94)']],
            },
          },
          axisLabel: {
            show: false,
          },
          splitNumber: 8,
          data: c.dataset.map((item) => ({ name: item[0], value: item[1] })),
          title: {
            fontSize: 18 * rate,
            color: '#9EBFDB',
            offsetCenter: [0, '28%'],
          },
          detail: {
            width: 70 * rate,
            height: 32 * rate,
            fontSize: 24 * rate,
            lineHeight: 32 * rate,
            padding: [0 * rate, 5 * rate, 0, 5 * rate],
            color: '#fff',
            backgroundColor: color, //'inherit',
            borderRadius: 8 * rate,
            formatter: '{value}%',
            offsetCenter: [0, '72%'],
          },
        },
      ],
    };
  }
}
