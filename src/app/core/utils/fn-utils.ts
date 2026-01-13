import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { RhSafeAny } from '@model';
//import Clipboard from 'clipboard';

/**
 * 使用组件本身作为提供商
 * @param component 组件
 */
export function provideValueAccessor(component: RhSafeAny) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => component),
    multi: true,
  };
}

/** 什么也不干 */
export function noop(): void {
  //
}

/** 根据选中的菜单节点，返回完整的路由地址
 * @description 通过选中`RhMenuNodeDto`获取完整路由地址，用于主界面左侧菜单Menu组件
 */
/* export function getFullRouteUrl(item: RhMenuNodeDto): string {
  const url = '/main' + (getMenuNodeAddr(item) || '/home');
  return url;
} */

/** 通过递归获取菜单名称,去除路由地址上的`@uuid`参数 */
/* export function getMenuNodeAddr(item: RhMenuNodeDto): string {
  // 对lcdp页面增加支持，去除地址栏上的`@uuid`部分
  let url = item.enable ? (item.route || '').replace(/@\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/gm, '') : '';
  if (item.parent) {
    url = getMenuNodeAddr(item.parent) + `${url ? '/' + url : url}`;
  }
  return url as string;
}
 */
/**
 * 复制指定文本
 * @param text 要复制的文本
 * @param element 触发的元素
 * @returns
 */
/* export function copyText(text: string, element?: HTMLElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const dummyElement = element || document.createElement('button'); // 创建虚拟元素
    const clipboard = new Clipboard(dummyElement, {
      text: () => text,
    });
    dummyElement.click(); // 触发复制
    // FIXME:这个Promise没啥用
    clipboard.on('success', () => {
      console.log('复制成功');
      resolve('复制成功');
      clipboard.destroy();
    });

    clipboard.on('error', (err: RhSafeAny) => {
      console.log('复制失败:', err);
      reject('复制失败:' + err);
      clipboard.destroy();
    });
  });
}
 */