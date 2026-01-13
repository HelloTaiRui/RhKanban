/**
 * @ Author: zhoujs
 * @ Create Time: 2024-07-18 09:20:37
 * @ Modified by: zhoujs
 * @ Modified time: 2024-11-30 14:00:01
 * @ Description:
 */

import { environment } from 'src/environments/environment';
import { AppConfig, ProjectConfig } from '@model';

export class configinfo {
  /** 强制使用本地配置。通常此项为关闭，适用于需要强制使用本地的app-config和project-json的场景。 */
  public static forceUseLocalConfig: boolean = false;

  /** 用户设定的远程配置文件拉取地址的存储key */
  public static get _userSetAppConfigRemoteUrlStorageKey() {
    return 'APP_CONFIG_REMOTE_URL_OF_' + configinfo.projectConfig.productCode;
  }
  /** 通用情况下的应用远程配置文件地址片段 */
  public static _appConfigRemotePath: string =
    'WebAppConfiguration/MobileAppConfig.json';
  /** 本地的app配置url地址 */
  public static _appConfigLocalUrl = 'assets/temp/MobileAppConfig.json';
  /** 项目配置url地址 */
  public static _projectConfigLocalUrl = 'assets/pages/entry.json';
  /** 远程nginx服务端的app配置url地址 */
  public static get _appConfigRemoteUrl() {
    //启用了强制使用本地配置后，忽略所有逻辑，直接全盘使用本地的MobileAppConfig.json作为远程配置。
    if (configinfo.forceUseLocalConfig) return configinfo._appConfigLocalUrl;
    //初始情况下，使用本地配置的地址和端口。
    let address = configinfo.localAppConfig?.WebAddress;
    let port = configinfo.localAppConfig?.WebsitePort;
    //如果当前是生产环境的web网页下，使用当前浏览器的地址和端口以拉取远程配置文件。
    if (configinfo.isBrowserProductionEnvironment) {
      address = configinfo.browserSideServerAddress;
      port = location.port as any;
    } else {
      if (!address)
        throw `本地应用配置中未配置WebAddress，请联系开发人员处理！`;
      configinfo.calculatedRemoteAddress = address;
    }
    //处理特殊情况。针对用户手动设置的值，或者address在设定的列表内的值，直接使用对应的地址，并更新calculatedRemoteAddress
    const matchedUrl =
      configinfo.userSetAppConfigRemoteUrl ||
      (configinfo.projectConfig.multiAppConfigSource || []).find(
        (item) => item.Value.includes(address) && !item.Hidden && !item.Disabled
      )?.Value;
    if (matchedUrl) {
      if (matchedUrl.startsWith('http')) {
        const tmp = matchedUrl.split('://');
        if (tmp.length >= 2) {
          const ip = tmp[1].split(':')[0];
          if (ip && tmp[0]) {
            configinfo.calculatedRemoteAddress = `${tmp[0]}://${ip}`;
          }
        }
      }
      return matchedUrl;
    }
    //最后，进行常规拼接，拼接成常规格式的远程配置文件地址
    return `${address}${port ? ':' + port : ''}/${
      configinfo._appConfigRemotePath
    }`;
  }

  /** 是否是生产环境的浏览器端 */
  public static get isBrowserProductionEnvironment() {
    return environment.production && !this.isAppEnvironment();
  }
  /** 是否是app环境 */
  public static isAppEnvironment() {
    //基于cordova的app，运行在无端口的localhost上(部分运行在file协议上的老项目除外，需手动安装依赖)，且window上会挂载cordova对象。
    return Boolean(
      location.hostname == 'localhost' &&
        location.port == '' &&
        window['cordova']
    );
  }

  /** 浏览器端地址 */
  public static browserSideServerAddress = `${location.protocol}//${location.hostname}`;
  /** 浏览器端当前站点地址 */
  public static get browserSideWebsiteAddress() {
    return location.href.split('#')[0];
  }
  /** 用户设置的地址 */
  public static get userSetAppConfigRemoteUrl() {
    return localStorage.getItem(
      configinfo._userSetAppConfigRemoteUrlStorageKey
    );
  }
  public static set userSetAppConfigRemoteUrl(url: string) {
    if (!url)
      localStorage.removeItem(configinfo._userSetAppConfigRemoteUrlStorageKey);
    else
      localStorage.setItem(
        configinfo._userSetAppConfigRemoteUrlStorageKey,
        url
      );
  }
  /** 计算出来的远程服务器地址。 */
  static calculatedRemoteAddress: string = '';

  /** 应用配置 */
  public static appConfig: AppConfig;
  /** 项目配置 */
  public static projectConfig: ProjectConfig;
  /** 本地的应用配置（读取自本地assets下） */
  public static localAppConfig: AppConfig;

  /** 应用版本。用于标记当前程序源码的版本。不是app应用程序的版本！ */
  public static get appVersion() {
    return this.projectConfig.codeVersion;
  }
  /** 应用名称。这个名称表现在登录页、网页标题等地方。不是app应用的名称！ */
  public static get appName() {
    return this.projectConfig.name;
  }
  /** 菜单根id */
  public static get productId() {
    return this.projectConfig.productId;
  }
  /** 产品编码，适用于自动更新时查询对应版本 */
  public static get productCode() {
    return this.projectConfig.productCode;
  }

  /** Web站点nginx服务器地址 */
  public static get webAddress() {
    return (
      this.appConfig.WebAddress ||
      this.calculatedRemoteAddress ||
      this.browserSideServerAddress
    );
  }
  /** MOM系统后端服务器地址 */
  public static get momServerAddress() {
    return this.appConfig.MomServerAddress || this.webAddress;
  }
  /** rhm移动端后端服务器地址 */
  public static get rhmServerAddress() {
    return this.appConfig.RhmServerAddress || this.momServerAddress;
  }
  /** MES系统后端服务器地址 */
  public static get mesServerAddress() {
    return this.appConfig.MesServerAddress || this.momServerAddress;
  }
  /** WMS系统后端服务器地址 */
  public static get wmsServerAddress() {
    return this.appConfig.WmsServerAddress || this.momServerAddress;
  }
  /** IOT系统后端服务器地址 */
  public static get iotServerAddress() {
    return this.appConfig.IotServerAddress || this.momServerAddress;
  }
  /** 看板接口后端服务器地址 */
  public static get boardServerAddress() {
    return this.appConfig.BoardServerAddress || this.momServerAddress;
  }
  /** 标签打印平台后端服务器地址 */
  public static get labelPrintPlatformServerAddress() {
    return (
      this.appConfig.LabelPrintPlatformServerAddress || this.momServerAddress
    );
  }
  /** 低代码平台后端服务器地址 */
  public static get lcdpPlatformServerAddress() {
    return this.appConfig.LcdpPlatformServerAddress || this.momServerAddress;
  }
  /** 外部服务的服务器地址 */
  public static get outerServerAddress() {
    return this.appConfig.OuterServerAddress || this.momServerAddress;
  }

  /** 获取当前Web站点服务器的ip地址 */
  public static get ip() {
    return this.webAddress.split('//').pop();
  }

  /** 升级包所在的服务器地址 */
  public static get upGradeAddr() {
    return configinfo.webAddress + ':' + configinfo.appConfig.WebsitePort;
  }

  public static get mesAddr() {
    return (
      configinfo.mesServerAddress + ':' + configinfo.appConfig.MesWebApiPort
    );
  }
  public static get mdmAddr() {
    return (
      configinfo.mesServerAddress + ':' + configinfo.appConfig.MdmWebApiPort
    );
  }
  public static get rhWmsAddr() {
    return (
      configinfo.wmsServerAddress + ':' + configinfo.appConfig.RhWmsWebApiPort
    );
  }
  public static get rhpMesAddr() {
    return (
      configinfo.mesServerAddress + ':' + configinfo.appConfig.RhpMesApiPort
    );
  }
  public static get rdpAddr() {
    return configinfo.mesServerAddress + ':' + configinfo.appConfig.RdpApiPort;
  }
  public static get mdpAddr() {
    return configinfo.mesServerAddress + ':' + configinfo.appConfig.MdpApiPort;
  }
  public static get wmsAddr() {
    return (
      configinfo.wmsServerAddress + ':' + configinfo.appConfig.RhpWmsApiPort
    );
  }
  public static get MomAddr() {
    return configinfo.momServerAddress + ':' + configinfo.appConfig.MomApiPort;
  }
  public static get PlatformV2addr() {
    return (
      configinfo.momServerAddress + ':' + configinfo.appConfig.PlatformV2Port
    );
  }
  public static get WmsV2addr() {
    return configinfo.wmsServerAddress + ':' + configinfo.appConfig.WmsV2Port;
  }
  public static get iotAddr() {
    return (
      configinfo.iotServerAddress + ':' + configinfo.appConfig.IotV5ApiPort
    );
  }
  public static get rhmAddr() {
    return (
      configinfo.rhmServerAddress + ':' + configinfo.appConfig.RhmServerPort
    );
  }
  public static get outerAddr() {
    return (
      configinfo.outerServerAddress + ':' + configinfo.appConfig.OuterApiPort
    );
  }
}
