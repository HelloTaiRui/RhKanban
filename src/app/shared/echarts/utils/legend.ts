import { LegendComponentOption } from 'echarts';

export const useStandardHorizontalLegend = (
  rate: number,
  legendFontSize: number = 18
) => {
  return {
    show: true,
    top: 18 * rate,
    right: 5 * rate,
    itemWidth: 12 * rate,
    itemHeight: 12 * rate,
    padding: 2 * rate,
    itemGap: (legendFontSize + 2) * rate,
    textStyle: {
      fontSize: legendFontSize * rate,
      lineHeight: legendFontSize * rate,
      padding: 0,
    },
    icon: 'rect',
  } as LegendComponentOption;
};
