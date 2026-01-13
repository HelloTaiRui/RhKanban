import { isEqual } from 'lodash';
import { RhSafeAny } from '@model';
import { v4 as uuidV4 } from 'uuid';
/**
 * 基于v4(随机数)生成的uuid
 * @param len 截断长度，请谨慎使用，截断后无法保证唯一性
 * @returns uuid
 */
export function uuid(len?: number): string {
  if (len && len > 0 && len <= 36) {
    return uuidV4().replace(/-/g, '').substring(0, len);
  }
  return uuidV4();
  const bit = len || 16;
  const target = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (c) => {
      // tslint:disable-next-line: no-bitwise
      const rand = (Math.random() * bit) | 0;
      // tslint:disable-next-line: no-bitwise
      const v = c === 'x' ? rand : (rand & 0x3) | 0x8;
      return v.toString(bit);
    }
  );
  return target;
}

/**
 * 判断给定的值是不是`null`或`undefined`
 * @param value 给定的值
 * @returns
 */
export function isNil(value: unknown): value is null | undefined {
  return typeof value === 'undefined' || value === null;
}

/** 是否为null/undefined/''(空字符串) */
export function isNilOrEmptyString(
  value: null | undefined | RhSafeAny
): boolean {
  if (value === void 0 || value === null || value === '') {
    return true;
  } else {
    return false;
  }
}
/** 是否非null/undefined/''(空字符串) */
export function isNotNilAndEmptyString(
  value: null | undefined | RhSafeAny
): boolean {
  if (value !== void 0 && value !== null && value !== '') {
    return true;
  } else {
    return false;
  }
}

/**
 * 判定给定的对象是不是空对象`{}`
 * @param obj 需要判定的对象
 * @returns
 */
export function isEmptyObject(obj: Record<string, RhSafeAny>) {
  if (!obj) {
    return false;
  }
  return isEqual(obj, {});
}

/**
 * 是否广泛意义下的空对象，包括null/undefined/''/0/{}
 * @param value
 * @returns
 */
export function isWideEmpty(value: null | undefined | RhSafeAny) {
  return isNilOrEmptyString(value) || isEmptyObject(value);
}
