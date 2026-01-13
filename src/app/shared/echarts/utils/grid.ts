import { GridComponentOption } from 'echarts';

export const useStandardGrid = (
  rate: number,
  omitTopLegendHeight: number | boolean = false
) => {
  return {
    top:
      typeof omitTopLegendHeight == 'number'
        ? omitTopLegendHeight * rate
        : (omitTopLegendHeight ? 15 : 80) * rate,
    left: 10 * rate,
    bottom: 10 * rate,
    right: 10 * rate,
  } as GridComponentOption;
};
