/**
 * @ Author: zhoujs
 * @ Create Time: 2024-07-18 11:10:40
 * @ Modified by: zhoujs
 * @ Modified time: 2024-11-27 15:14:30
 * @ Description:
 */

/** 项目配置 */
export class ProjectConfig {

    constructor(
        /** 程序id */
        public id: string = "",
        /** 程序名称。会提现到诸如浏览器标题、登录页标题等地方 */
        public name: string = "",
        /** 根节点菜单idKey */
        public productId: string = "",
        /** 产品编码，用于产品版本更新时获取最新版本信息 */
        public productCode: string = "",
        /** 源码版本 */
        public codeVersion: string = "",
        /** 远程配置文件url地址清单 */
        public multiAppConfigSource: Array<AppConfigSource> = [],
        /** 管理员密码 */
        public adminPassword: string = "Rh888888"
    ) { }

    public overviewStaticItems: any[];
}

export interface AppConfigSource {
    /** 地址url */
    Value: string;
    /** 显示名称 */
    Text: string,
    /** 是否禁用 */
    Disabled?: boolean;
    /** 是否隐藏 */
    Hidden?: boolean;
}