import { RhmNumberHelper } from '@core';
import {
  FragmentRegisterConfig,
  RhBoardData,
  RhEchartsChartRequiredDataFormat,
  RhSafeAny,
} from '@model';
import { format } from 'date-fns';
import { isNil } from 'lodash';

export type RhBoardDataFiller = (
  dimensionIndex: number,
  rowIndex: number,
  dimension: string,
  row: RhBoardData,
  fullData: RhBoardData[]
) => RhSafeAny;

export type RhBoardDataFormatter = (
  value: RhSafeAny,
  dimensionIndex: number,
  rowIndex: number,
  dimension: string,
  row: RhBoardData,
  fullData: RhBoardData[]
) => RhSafeAny;

/** 将通用看板数据结构转换成echarts典型二维数据表的dataset结构 */
export const convertToStandardDataset = (
  data: RhBoardData,
  fill?: RhBoardDataFiller,
  valueFormatter?: RhBoardDataFormatter
) => {
  if (typeof data != 'object')
    return RhEchartsChartRequiredDataFormat.onlyData(data);
  if (
    Array.isArray(data) &&
    Array.isArray(data[0]) &&
    data[0].every((item) => typeof item == 'string')
  ) {
    //特殊处理，识别echarts二维表结构数据
    return RhEchartsChartRequiredDataFormat.standardValue(
      data[0],
      data.slice(1)
    );
  }
  const rows = data.children;
  /** 解析出维度信息， */
  const dimensions = parseDimensionsInfo(rows);
  if (!dimensions) {
    console.warn('数据不符合规范，无法解析出数据的维度信息！', data);
    return RhEchartsChartRequiredDataFormat.onlyData(rows);
  }
  const result = [];
  const items = dimensions.slice(1);
  let tmp: RhBoardData;
  let value: RhSafeAny;
  rows.forEach((row, rowIndex) => {
    const _row = [
      valueFormatter
        ? valueFormatter(row.item, 0, rowIndex, '', row, rows)
        : row.item,
    ];
    items.forEach((dimension, dimensionIndex) => {
      tmp = row.children.find((item) => item.item == dimension);
      if (tmp) {
        value = tmp.value1;
      } else {
        if (fill) {
          value = fill(dimensionIndex + 1, rowIndex, dimension, row, rows);
        }
      }
      _row[dimensionIndex + 1] = valueFormatter
        ? valueFormatter(
            value,
            dimensionIndex + 1,
            rowIndex,
            dimension,
            row,
            rows
          )
        : value;
    });
    result.push(_row);
  });
  return RhEchartsChartRequiredDataFormat.standardValue(dimensions, result);
};

/** 将通用看板数据结构转换成echarts典型二维数据表的dataset结构，并对数据填充指定数值 */
export const convertToStandardDatasetWithNumberFill = (
  data: RhBoardData,
  valueFormatter?: RhBoardDataFormatter,
  fill: number = 0
) => convertToStandardDataset(data, () => fill, valueFormatter);

/** 数值进万 */
export const useTenThousandValueFormatter: RhBoardDataFormatter = (
  value,
  dimensionIndex
) => (dimensionIndex > 0 ? RhmNumberHelper.unifyNumber(value / 10000) : value);

/** 月份格式化 */
export const useMonthFormatter: RhBoardDataFormatter = (
  value,
  dimensionIndex
) => (dimensionIndex === 0 ? format(new Date(value), 'M月') : value);

/** 解析维度信息 */
const parseDimensionsInfo = (data: RhBoardData[]) => {
  let index = -1;
  let size = 0;
  data.forEach((item, i) => {
    if (item.children.length > size) {
      index = i;
      size = item.children.length;
    }
  });
  if (index >= 0 && size > 0) {
    const target = data[index];
    return ['', ...target.children.map((item) => item.item)];
  }
  return null;
};

/** 使用标准填充方法 */
export const useStandardDisplayFill = (
  index: number,
  values: number | RhSafeAny[],
  label: string = '---'
) => [
  label + '\u200B'.repeat(index),
  ...(typeof values === 'number' ? Array(values).fill(0) : values),
];

/** 使用标准的分片配置 */
export const useStandardDisplayConfig = (
  fragmentSize: number,
  fill: number | RhSafeAny[] | ((i: number) => RhSafeAny),
  step: number = 0,
  interval: number = 0,
  onValue?: (value) => RhSafeAny
) =>
  ({
    fragmentSize: fragmentSize,
    step: step,
    interval: interval,
    fill:
      typeof fill == 'function' || isNil(fill)
        ? fill
        : (i: number) => useStandardDisplayFill(i, fill),
    onValue: onValue,
  } as FragmentRegisterConfig<RhSafeAny>);
