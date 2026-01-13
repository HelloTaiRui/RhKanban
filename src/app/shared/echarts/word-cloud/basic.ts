import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption } from 'echarts';
import 'echarts-wordcloud';
import { RhColor } from '../utils';

export class RhBasicWordCloudChart<Dataset> extends RhEchartsChart<
  RhBasicWordCloudChart<Dataset>
> {
  dimensions = ['原因', '数值', '颜色'];

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 300,
  };

  protected createBaseOption(
    c: Partial<RhBasicWordCloudChart<Dataset>>,
    rate: number
  ): EChartsOption {
    return {
      series: [
        {
          type: 'wordCloud',
          // 网格大小，各项之间间距
          gridSize: 35 * rate,
          // 形状 circle 圆，cardioid  心， diamond 菱形，
          // triangle-forward 、triangle 三角，star五角星
          shape: 'circle',
          // 字体大小范围
          sizeRange: [14 * rate, 24 * rate],
          // 文字旋转角度范围
          rotationRange: [0, 0],
          // 旋转步值
          rotationStep: 90,
          // 自定义图形
          // maskImage: maskImage,
          left: 'center',
          top: 'center',
          right: null,
          bottom: null,
          // 画布宽
          width: '100%',
          // 画布高
          height: '100%',
          // 是否渲染超出画布的文字
          drawOutOfBound: false,
          textStyle: {
            color: function (params) {
              return params.data.color || RhColor.Warning;
            },
          },
          data: c.dataset.map((item) => {
            return {
              name: item[0],
              value: item[1] as RhSafeAny,
              color: item[2],
            };
          }),
        },
      ],
    };
  }
}
