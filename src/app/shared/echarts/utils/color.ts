import { RhSafeAny } from '@model';
import { graphic } from 'echarts';
import tinycolor from 'tinycolor2';

export const useStandardLinearGradientAreaColor = (color: RhSafeAny) => {
  if (typeof color == 'object') return color;
  return new graphic.LinearGradient(0, 1, 0, 0, [
    {
      offset: 0,
      color: tinycolor(color).setAlpha(0.1).toRgbString(),
    },
    {
      offset: 0.5,
      color: tinycolor(color).setAlpha(0.25).toRgbString(),
    },
    {
      offset: 1,
      color: tinycolor(color).setAlpha(0.6).toRgbString(),
    },
  ]);
};
