import { RhmNumberHelper } from '@core';
import { XAXisComponentOption } from 'echarts';

export const useStandardCategoryXAXis = (
  rate: number,
  enableRotate = false,
  rotate = 45
) => {
  return {
    type: 'category',
    axisLabel: {
      fontSize: 14 * rate,
      margin: 12 * rate,
      interval: 0,
      rotate: enableRotate ? rotate : 0,
    },
  } as XAXisComponentOption;
};

export const useStandardValueXAXis = (
  rate: number,
  axisName?: string,
  showSplitLine: boolean = true,
  formatter: string = '{value}',
  splitNumber = 4,
  max?: number
) => {
  const real_min = 0;
  const real_max = RhmNumberHelper.findM(max, splitNumber);
  return {
    type: 'value',
    name: axisName,
    nameTextStyle: {
      fontSize: 14 * rate,
      align: 'right',
      color: '#9EBFDB',
      padding: 0,
      //padding: [0, 20, 5, 0],
    },
    axisLabel: {
      fontSize: 14 * rate,
      margin: 12 * rate,
      formatter: formatter,
    },
    ...(max
      ? {
          min: real_min,
          max: real_max,
          interval: (real_max - real_min) / splitNumber,
        }
      : {
          splitNumber: splitNumber,
        }),
    splitLine: {
      show: showSplitLine,
      lineStyle: {
        type: 'dotted',
        //color: 'rgba(158,191,219,0.4)',
      },
    },
  } as XAXisComponentOption;
};
