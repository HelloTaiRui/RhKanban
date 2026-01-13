import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { configinfo } from '@configs';
import { MsgHelper } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class RhStartupService {
  constructor(public http: HttpClient) {}

  /**
   * 加载程序配置
   */
  async run() {
    try {
      try {
        const localAppData = await this.getJson(configinfo._appConfigLocalUrl);
        configinfo.localAppConfig = localAppData;
      } catch (error) {
        throw `拉取应用本地配置文件【${
          configinfo._appConfigLocalUrl
        }】失败，请联系开发人员处理！详情：${this.httpErrorFormatter(error)}`;
      }
      try {
        const projectData = await this.getJson(
          configinfo._projectConfigLocalUrl
        );
        configinfo.projectConfig = projectData;
      } catch (error) {
        throw `拉取项目本地配置文件【${
          configinfo._projectConfigLocalUrl
        }】失败，请联系开发人员处理！详情：${this.httpErrorFormatter(error)}`;
      }
      try {
        const appData = await this.getJson(configinfo._appConfigRemoteUrl);
        configinfo.appConfig = appData;
      } catch (error) {
        throw `拉取应用远程配置文件【${
          configinfo._appConfigRemoteUrl
        }】失败，请联系开发人员处理或者手动切换至可用的远程配置文件地址！详情：${this.httpErrorFormatter(
          error
        )}`;
      }
      this.setExtraLibs();
    } catch (error) {
      this.showError(error);
    }
  }

  /** 关闭启动时的loading */
  public closeBootstrapLoading() {
    // 加载成功之后关闭load页面
    if ((window as any).appBootstrap) {
      (window as any).appBootstrap();
    }
  }

  public showError(error: any) {
    MsgHelper.ShowErrorModal(error);
  }

  public httpErrorFormatter(err: HttpErrorResponse | string | Object) {
    if (err instanceof HttpErrorResponse) {
      if (err.status == 404)
        return `接口【${err.url}】不存在！（HTTP状态码：${err.status}）`;
      if (err.status == 500)
        return `接口【${err.url}】异常，可能为提交数据异常或者服务端内部异常！（HTTP状态码：${err.status}）`;
      if (err.status == 401)
        return `调用接口【${err.url}】出现身份认证异常，请退出重新登录！（HTTP状态码：${err.status}）`;
      if (err.status == 0)
        return `调用接口【${err.url}】失败，可能为网络异常或服务端程序未启动！（HTTP状态码：${err.status}）`;
      return `调用接口【${err.url}】失败！相关提示信息：${err.statusText}（HTTP状态码：${err.status}）`;
    } else if (err instanceof Error) {
      return err.message;
    }
    return typeof err == 'string' ? err : JSON.stringify(err);
  }

  async getJson(url: string) {
    return (await fetch(url + '?t=' + new Date().getTime())).json();
  }

  private setExtraLibs() {
    // 设置pdf预览需要的js路径，防止请求外网
    (window as any).pdfWorkerSrc = 'assets/js/pdf.worker.min.js';
  }
}
