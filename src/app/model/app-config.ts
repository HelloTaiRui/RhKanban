/**
 * @ Author: zhoujs
 * @ Create Time: 2024-07-18 10:23:22
 * @ Modified by: zhoujs
 * @ Modified time: 2024-08-15 09:25:09
 * @ Description:
 */

/** 应用配置 */
export class AppConfig {

    constructor(
        /** MES微服务 */
        public MesWebApiPort: number = 8016,
        /** WMS微服务 */
        public WmsWebApiPort: number = 8086,
        /** AAC微服务 */
        public PlatformWebApiPort: number = 8018,
        /** Iot微服务(v4) */
        public IotWebApiPort: number = 8020,
        /** WF微服务 */
        public WfApiPort: number = 8028,
        /** Mdm微服务 */
        public MdmWebApiPort: number = 20086,
        /** RH-WMS微服务 */
        public RhWmsWebApiPort: number = 20085,
        /** RH-MES微服务 */
        public RhMesApiPort: number = 20028,
        /** RH-MDP微服务 */
        public MdpApiPort: number = 52880,
        /** RH-RDP微服务 */
        public RdpApiPort: number = 52881,
        /** RHP-MES微服务 */
        public RhpMesApiPort: number = 52882,
        /** RH-ME消息引擎微服务 */
        public MsgApiPort: number = 20068,
        /** RHP-WMS微服务 */
        public RhpWmsApiPort: number = 52883,
        /** IoTV5-WebAPI */
        public IotV5ApiPort: number = 7281,
        /** （2024年新）产品平台V2 */
        public PlatformV2Port: number = 8288,
        /** （2024年新）MOM微服务 */
        public MomApiPort: number = 8282,
        /** （2024年新）WmsV2微服务 */
        public WmsV2Port: number = 8283,
        /** 前端Web站点部署端口 */
        public WebsitePort: number = 8088,
        /** 标签打印平台所在端口 */
        public LabelPrintPlatformWebsitePort: number = 6021,
        /** 打印插件本地打印所在端口 */
        public LabelLocalPrintApiPort: number = 3003,
        /** 标签打印平台后端服务所在端口 */
        public LabelPrintApiPort: number = 3002,
        /** 低代码平台后端端口 */
        public LcdpApiPort: number = 3004,
        /** Rhm后端服务端口 */
        public RhmServerPort: number = 6188,
        /** 外部服务端口 */
        public OuterApiPort: number = 0,
        /** Web系统nginx服务器地址 */
        public WebAddress: string = "",
        /** Rhm移动端后端服务器地址。为空时，使用和主站一样的地址 */
        public RhmServerAddress: string = "",
        /** MOM系统后端服务器地址。为空时，使用和主站一样的地址*/
        public MomServerAddress: string = "",
        /** MES系统后端服务器地址。为空时，使用和主站一样的地址*/
        public MesServerAddress: string = "",
        /** WMS系统后端服务器地址。为空时，使用和主站一样的地址*/
        public WmsServerAddress: string = "",
        /** IOT系统后端服务器地址。为空时，使用和主站一样的地址*/
        public IotServerAddress: string = "",
        /** 看板接口后端服务器地址。为空时，使用和主站一样的地址*/
        public BoardServerAddress: string = "",
        /** lcdp低代码平台后端服务器地址。为空时，使用和主站一样的地址 */
        public LcdpPlatformServerAddress: string = "",
        /** 标签打印平台后端服务器地址。为空时，使用和主站一样的地址 */
        public LabelPrintPlatformServerAddress: string = "",
        /** 外部服务的服务器地址，与外部服务的端口一起使用。为空时，使用和主站一样的地址 */
        public OuterServerAddress: string = "",
        /** 产品版本管理 */
        public ProductVersions: Record<string, ProductVersion> = {}
    ) { }

}

export class ProductVersion {

    constructor(
        /** 产品名称 */
        public Name: string,
        /** 当前版本 */
        public CurrentVersion: string,
        /** 相对路径 */
        public ApkDownloadPath: ApkDownloadPath[]
    ) { }

}

export class ApkDownloadPath {
    constructor(
        /** 值 */
        public Value: string,
        /** 文本 */
        public Text: string
    ) { }
}