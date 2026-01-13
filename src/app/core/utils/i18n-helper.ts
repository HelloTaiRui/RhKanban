import { RhSafeAny } from '@model';
export class I18nHelper {
  /**
   * 翻译方法
   * @param path 翻译键值
   * @param data 翻译辅助数据，用来做替换操作
   * @returns 翻译后的文本呢
   */
  static translate(path: string, data?: Record<string, RhSafeAny> | string | number): string {
    return data as string;//移除实现代码
  }

}
