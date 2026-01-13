import { RhSafeAny } from '@model';

// 类型判断
export const RhIsType = (type: string) => (object: RhSafeAny) =>
  Object.prototype.toString.call(object) === `[object ${type}]`;

export class TypeHelper {
  static isArray(value: RhSafeAny) {
    return RhIsType('Array')(value);
  }
  static isString(value: RhSafeAny) {
    return RhIsType('String')(value);
  }
  static isNumber(value: RhSafeAny) {
    return RhIsType('Number')(value);
  }
  static isBoolean(value: RhSafeAny) {
    return RhIsType('Boolean')(value);
  }

  static isObject(value: RhSafeAny) {
    return RhIsType('Object')(value);
  }

  static isNull(value: RhSafeAny) {
    return RhIsType('Null')(value);
  }

  static isFunction(value: RhSafeAny) {
    return RhIsType('Function')(value);
  }
  static isDate(value: RhSafeAny) {
    return RhIsType('Date')(value);
  }
  static isRegExp(value: RhSafeAny) {
    return RhIsType('RegExp')(value);
  }

  static isEmpty(object: RhSafeAny) {
    return this.isUndefined(object) || this.isNull(object) || object === '' || object.length === 0;
  }

  static isUndefined(value: RhSafeAny) {
    return typeof value === 'undefined';
  }
}
