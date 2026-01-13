/**
 * @ Author: zhoujs
 * @ Create Time: 2021-06-08 13:36:09
 * @ Modified by: zhoujs
 * @ Modified time: 2026-01-13 10:15:52
 * @ Description:
 */

export interface RhvOverviewItemConfig {
    /** 标题标注 */
    title?: string,
    /** 是否显示标题。默认否 */
    showTitle?: boolean,
    /** 图片地址 */
    src?: string,
    /** 路由 */
    route: string,
    /** 是否在当前页面使用路由跳转来展示。默认为否，打开新的标签页来展示。 */
    isOpenInCurPage?: boolean,
    /** flex值 */
    //flex: number,
    /** 子项排版方向 */
    direction: "row" | "col",
    /** 子项列表 */
    children: RhvOverviewItemConfig[],
    /** 边框。默认2px solid red */
    border?: string
}


/** 对外开放出静态的页面导航 */
export const staticPreviewItems: RhvOverviewItemConfig[] = [];
