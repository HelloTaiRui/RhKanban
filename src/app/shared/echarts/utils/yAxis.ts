import { RhmNumberHelper } from '@core';
import { RhSafeAny } from '@model';
import { YAXisComponentOption } from 'echarts';

export const useStandardValueYAXis = (
  rate: number,
  axisName?: string,
  showSplitLine: boolean = true,
  formatter: RhSafeAny = (value) => RhmNumberHelper.unifyNumber(value, 1),
  splitNumber = 4,
  max?: number,
  min?: RhSafeAny
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
    nameGap: 25 * rate,
    ...(max && !min
      ? {
          min: real_min,
          max: real_max,
          interval: (real_max - real_min) / splitNumber,
        }
      : {
          min: min,
          splitNumber: splitNumber,
        }),
    axisLabel: {
      fontSize: 14 * rate,
      formatter: formatter,
    },
    splitLine: {
      show: showSplitLine,
      lineStyle: {
        type: 'dotted',
      },
    },
  } as YAXisComponentOption;
};

export const useStandardCategoryYAXis = (
  rate: number,
  axisName?: string,
  showSplitLine: boolean = true
) => {
  return {
    type: 'category',
    inverse: true,
    name: axisName,
    nameTextStyle: {
      fontSize: 14 * rate,
      align: 'right',
      color: '#9EBFDB',
      //padding: [0, 20, 5, 0],
    },
    nameGap: 25 * rate,
    axisLabel: {
      fontSize: 14 * rate,
    },
    splitNumber: 5,
    splitLine: {
      show: showSplitLine,
      lineStyle: {
        type: 'dotted',
      },
    },
  } as YAXisComponentOption;
};

/** 底部空余比例。小数点比值 */
export const useStandardValueMin = (
  lowerPercent: number,
  upperPercent: number,
  limitMin = 0
) => {
  return (value: { max: number; min: number }) => {
    const det = value.max - value.min;
    const toDet = (lowerPercent / upperPercent) * det;
    if (value.min > toDet) return value.min - toDet;
    else return limitMin;
  };
};
