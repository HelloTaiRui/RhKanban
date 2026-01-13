/**
 * @ Author: zhoujs
 * @ Create Time: 2022-07-29 13:49:16
 * @ Modified by: zhoujs
 * @ Modified time: 2025-10-15 17:05:23
 * @ Description: {@link http://192.168.0.14/rh-goldencarp/rh-base-core/-/blob/master/projects/rh/base/core/utils/number-helper.ts}
 */

import { last } from 'lodash';

type OperationType = 'add' | 'subtract' | 'multiply' | 'divide';

/**
 * NumberHelper 包含加减乘除四个方法，能确保浮点数运算不丢失精度
 *
 * 我们知道计算机编程语言里浮点数计算会存在精度丢失问题（或称舍入误差），其根本原因是二进制和实现位数限制有些数无法有限表示
 * 以下是十进制小数对应的二进制表示
 *      0.1 >> 0.0001 1001 1001 1001…（1001无限循环）
 *      0.2 >> 0.0011 0011 0011 0011…（0011无限循环）
 * 计算机里每种数据类型的存储是一个有限宽度，比如 JavaScript 使用 64 位存储数字类型，因此超出的会舍去。舍去的部分就是精度丢失的部分。
 *
 * ** method **
 *  add / subtract / multiply /divide
 *
 * ** explame **
 *  0.1 + 0.2 == 0.30000000000000004 （多了 0.00000000000004）
 *  0.2 + 0.4 == 0.6000000000000001  （多了 0.0000000000001）
 *  19.9 * 100 == 1989.9999999999998 （少了 0.0000000000002）
 *
 * NumberHelper.add(0.1, 0.2) output: 0.3
 * NumberHelper.multiply(19.9, 100) output: 1990
 *
 */
export class RhmNumberHelper {
  /** 判断是否是整数 */
  static isInteger(num: number) {
    return num === Math.floor(num);
  }

  /*
   * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, num: 314}
   */
  static toInteger(floatNum: number) {
    const ret = { times: 1, num: 0 };
    const isNegative = floatNum < 0;
    if (this.isInteger(floatNum)) {
      ret.num = floatNum;
      return ret;
    }
    const strfi = floatNum + '';
    const dotPos = strfi.indexOf('.');
    const len = strfi.substr(dotPos + 1).length;
    const times = Math.pow(10, len);
    let intNum = parseInt((Math.abs(floatNum) * times + 0.5) as any, 10);
    ret.times = times;
    if (isNegative) {
      intNum = -intNum;
    }
    ret.num = intNum;
    return ret;
  }

  /*
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   * @param a {number} 运算数1
   * @param b {number} 运算数2
   * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
   * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
   *
   */
  static operation(a: number, b: number, digits: number, op: OperationType) {
    const o1 = this.toInteger(a);
    const o2 = this.toInteger(b);
    const n1 = o1.num;
    const n2 = o2.num;
    const t1 = o1.times;
    const t2 = o2.times;
    const max = t1 > t2 ? t1 : t2;
    let result = null;
    switch (op) {
      case 'add':
        if (t1 === t2) {
          // 两个小数位数相同
          result = n1 + n2;
        } else if (t1 > t2) {
          // o1 小数位 大于 o2
          result = n1 + n2 * (t1 / t2);
        } else {
          // o1 小数位 小于 o2
          result = n1 * (t2 / t1) + n2;
        }
        return result / max;
      case 'subtract':
        if (t1 === t2) {
          result = n1 - n2;
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2);
        } else {
          result = n1 * (t2 / t1) - n2;
        }
        return result / max;
      case 'multiply':
        result = (n1 * n2) / (t1 * t2);
        return result;
      case 'divide':
        result = (n1 / n2) * (t2 / t1);
        return result;
    }
  }

  // 加减乘除的四个接口
  static add(a: number, b: number, digits = 2) {
    return this.operation(a, b, digits, 'add');
  }
  static subtract(a: number, b: number, digits = 2) {
    return this.operation(a, b, digits, 'subtract');
  }
  static multiply(a: number, b: number, digits = 2) {
    return this.operation(a, b, digits, 'multiply');
  }
  static divide(a: number, b: number, digits = 2) {
    return this.operation(a, b, digits, 'divide');
  }

  /** 设置小数位数。默认最大保留两位。比如，25.233=>25.23，16.8=>16.8 */
  static unifyNumber(num: number | string, precision: number = 2) {
    if (num === '') {
      return 0;
    } else {
      let handleNum = parseFloat(num as any);
      let isToFixed =
        handleNum.toString().includes('.') &&
        handleNum.toString().split('.')[1].length > precision;
      if (isToFixed) {
        return (handleNum.toFixed(precision) as any) * 1;
      } else {
        return handleNum;
      }
    }
  }

  /** 确定数据轴的最大值。S为当前的最大值。N为轴的分段数。
   * 返回计算结果。如S为1431，轴的分段数是5段，那么结果就是1500，对应[0,300,600,900,1200,1500]
   * */
  static findM(S: number, N: number) {
    if (S <= 0) {
      //throw new Error('S must be positive');
      return 0;
    }

    const intPart = Math.floor(S);
    let L = intPart === 0 ? 1 : Math.floor(Math.log10(intPart)) + 1;

    // 计算基础步长
    const baseStep = N * Math.pow(10, L - 2);

    // 计算需要的段数（向上取整）
    const segments = Math.ceil(S / baseStep);

    // 计算原始的目标值
    const rawTarget = segments * baseStep;

    // 智能美化：找到既美观又能被baseStep整除的最小值
    const M = findBeautifulMultiple(rawTarget, baseStep, N);
    return RhmNumberHelper.unifyNumber(M, 1);
  }
}

function findBeautifulMultiple(minValue: number, baseStep: number, N: number) {
  const intPart = Math.floor(minValue);
  let L = intPart === 0 ? 1 : Math.floor(Math.log10(intPart)) + 1;
  const rate = Math.pow(10, L >= 3 ? L - 2 : 0);

  // 尝试各种美化策略
  const strategies = [
    (n) => Math.ceil(n / (100 * rate)) * 100 * rate, // 整百
    (n) => Math.ceil(n / (50 * rate)) * 50 * rate, // 整五十
    (n) => Math.ceil(n / (20 * rate)) * 20 * rate, // 整二十
    (n) => Math.ceil(n / (10 * rate)) * 10 * rate, // 整十
    (n) => Math.ceil(n / (5 * rate)) * 5 * rate, // 整五
    (n) => n, // 保持原样
  ];

  for (const strategy of strategies) {
    const candidate = strategy(minValue);
    // 检查候选值是否能被baseStep整除
    if (candidate % baseStep === 0 && candidate - minValue < candidate / N) {
      return candidate;
    }
  }

  return minValue;
}

/* function splitIntoSegments(M: number, segments: number) {
  const step = M / segments;
  const result = [];

  for (let i = 1; i <= segments; i++) {
    const value = step * i;
    // 对每个分段点也进行美化
    result.push(findBeautifulMultiple(value, step));
  }

  return result;
}
 */
