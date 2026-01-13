import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption, graphic } from 'echarts';

export class RhHorizontalPercentBarChart<Dataset> extends RhEchartsChart<
  RhHorizontalPercentBarChart<Dataset>
> {
  symbolWidth = 15;
  symbolHeight = 15;

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 50,
  };

  protected createBaseOption(
    c: Partial<RhHorizontalPercentBarChart<Dataset>>,
    rate: number
  ): EChartsOption {
    const data = c.dataset[0] || [];
    const value = Math.min(data[1], 100);

    return {
      grid: {
        left: c.symbolWidth * rate,
        top: '5%',
        right: c.symbolWidth * rate,
        bottom: '0%',
        containLabel: false,
      },
      xAxis: {
        show: false,
        type: 'value',
      },
      yAxis: {
        type: 'category',
        inverse: true,

        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        data: [data[0]],
      },
      series: [
        {
          name: data[0],
          type: 'bar',
          z: 10,
          itemStyle: {
            color: '#07D1FA',
          },
          barWidth: 15 * rate,
          data: [value],
        },
        {
          name: '背景',
          type: 'bar',
          barWidth: 15 * rate,
          z: 1,
          barGap: '-100%',
          data: [100],
          itemStyle: {
            color: 'transparent',
          },
        },
        {
          //分隔
          type: 'pictorialBar',
          z: 100,
          itemStyle: {
            color: '#0D365D',
          },
          symbolRepeat: 'fixed',
          symbolMargin: 2.5 * rate,
          symbol: 'rect',
          symbolClip: true,
          symbolSize: [4 * rate, 15 * rate],
          symbolPosition: 'start',
          symbolOffset: [0, 0],
          data: [100],
          animationEasing: 'elasticOut',
        },
        {
          //上箭头
          type: 'pictorialBar',
          z: 100,
          itemStyle: {
            color: '#07D1FA',
          },
          symbolRepeat: false,
          symbolMargin: 0,
          symbol: 'triangle',
          symbolClip: false,
          symbolSize: [c.symbolWidth * rate, c.symbolHeight * rate],
          symbolRotate: 180,
          symbolPosition: 'end',
          symbolOffset: [
            (c.symbolWidth / 2) * rate,
            -1 * (c.symbolHeight * 1.5) * rate,
          ],
          data: [value],
          animationEasing: 'elasticOut',
        },
        {
          //下箭头
          type: 'pictorialBar',
          z: 100,
          itemStyle: {
            color: '#07D1FA',
          },
          symbolMargin: 0,
          symbol: 'triangle',
          symbolClip: false,
          symbolRepeat: false,
          symbolSize: [c.symbolWidth * rate, c.symbolHeight * rate],
          symbolPosition: 'end',
          symbolOffset: [
            (c.symbolWidth / 2) * rate,
            c.symbolHeight * 1.5 * rate,
          ],
          data: [value],
          animationEasing: 'elasticOut',
        },
      ],
    };
  }
}
