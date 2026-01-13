
//import { Injectable } from '@angular/core';

import { NzMessageService } from "ng-zorro-antd/message";

//声明$
declare var $: any;
//@Injectable()
//signalR实时数据交互
export class RhvSignalrService {
  private retryTime = 5;

  // tslint:disable-next-line: variable-name
  private _connection: any;
  // tslint:disable-next-line: variable-name
  private _proxy: any;

  get connection() {
    return this._connection;
  }

  get proxy() {
    return this._proxy;
  }

  constructor(
    private toastCtrl: NzMessageService
  ) { }

  /** 初始化并启动signalr连接
   * @description 初始化并启动连接，失败后，进行5次重试.
   * @param ipAddress ip地址，形式:`192.168.0.121:8020`
   * @param hubProxyName hub代理名称，由后端提供，注意首字母小写(不管后端首字母是否小写，前端必须要小写，下同)
   * @param method 需要订阅的方法，由后端提供，注意首字母小写
   * @param fn 后端推送数据时的回调
   */
  initConnection(
    ipAddress: string,
    hubProxyName: string,
    method: string,
    fn: (data: any) => void
  ) {
    //指定SignalR服务器地址，创建连接
    const url = `http://${ipAddress}`;
    this._connection = $.hubConnection(url);
    //hub代理名称，注明首字母小写
    this._proxy = this._connection.createHubProxy(hubProxyName);
    if (this._proxy) {
      console.log(`signalr初始化成功！！`);

      //绑定客户端方法，这里注意名称首字母小写
      this._proxy.on(method, (data: any) => {
        fn(data);
      });
    }
    this.startConnection();
  }

  /** 断开signalr连接 */
  stopConenction() {
    // TODO:断开连接，功能未测试
    if (this.connection) {
      this.connection.stop(false, true);
      console.log(this.connection, this.connection.logging);
      console.log(`signalr已断开！！`);
      this.toastCtrl.error(`SignalR已断开！！`);
    }
  }

  isDisconnect = false;
  // 启动(非代理模式)
  private startConnection() {
    if (this.retryTime > 0) {
      this.retryTime--;

      //连接signalR服务端
      // 启动(非代理模式)
      this.connection
        .start()
        .done(() => {
          console.log('SignalR服务启动成功');
          this.toastCtrl.success('SignalR服务启动成功');
          this.isDisconnect = false;
          this.retryTime = 5;
          if (this.connection) {
            //signalR断连后触发该方法
            this.connection.disconnected(() => {
              // this.retryTime--;
              if (this.retryTime > 0) {
                this.isDisconnect = true;
                console.log(`SignalR重启失败!!!五秒钟后尝试重新连接...`);
                setTimeout(() => {
                  this.startConnection();
                }, 5000);
              }
            });
          }
        })
        .catch((error: any) => {
          console.log(`SignalR启动失败!!!->${error}!!!五秒钟后尝试重新连接...`);
          setTimeout(() => {
            this.startConnection();
          }, 5000);
        });
    } else {
      // MsgHelper.ShowErrorModal(`SignalR启动失败!!! 请刷新页面重新启动!`);
      if (this.isDisconnect) {
        if (this.retryTime === 0) {
          this.retryTime = -1;
          setTimeout(() => {
            console.log(
              `SignalR连接断开!!! 系统已尝试自动重启5次，仍未连接到SignalR，请刷新页面或联系管理员`
            );
            this.toastCtrl.error(
              `SignalR连接断开!!! 系统已尝试自动重启5次，仍未连接到SignalR，请刷新页面或联系管理员`
            );
          }, 5000);
        }
      } else {
        setTimeout(() => {
          this.retryTime = 5;
          this.toastCtrl.error(
            'SignalR服务启动失败!!!五次尝试均无法启动signalr服务，请检查网络或联系管理员!'
          );
          console.error('五次尝试均无法启动signalr服务，方法已终止!');
        }, 5000);
      }
    }
  }

  /** 前端发送消息到后台
   * @description 前端发送消息给后端
   * @param method 后端接收消息的方法，由后端提供，注意首字母小写
   * @param message 前端要发送给后端的内容
   */
  send(method, message1, message2) {
    setTimeout(() => {
      this._proxy.invoke(method, message1, message2).done(function () {
        console.log('消息发送成功');
      });
    }, 200);
  }
}
