import { Injectable } from '@angular/core';
import { configinfo } from '@configs';
import { RhSafeAny } from '@model';
import { BehaviorSubject } from 'rxjs';
import { MsgHelper } from './msg-helper';
import { DataResultT } from '@model';

export interface MonitorItem {
  indexCode: string;
  name: string;
  regionName: string;
  regionPathName: string;
}

// 海康威视AK/SK签名类
@Injectable()
export class HikvisionHelper {
  /** 设备列表 */
  deviceList$ = new BehaviorSubject([]);

  constructor() {
    this.loadMonitorList();
  }
  /** 加载监控列表 */
  async loadMonitorList() {
    try {
      const result = await this.request<{
        list: MonitorItem[];
      }>('POST', '/api/resource/v2/camera/search', {
        pageNo: 1,
        pageSize: 1000,
      });
      console.log(result);
      this.deviceList$.next(result.list);
    } catch (error) {
      MsgHelper.ShowErrorMessage('获取监控点列表数据失败！' + error);
    }
  }

  getDeviceList(
    body = {
      pageNo: 1,
      pageSize: 1000,
    }
  ) {
    return this.request('POST', '/api/resource/v2/camera/search', body);
  }

  getPreviewUrl(cameraIndexCode: string) {
    return this.request<{
      url: string;
    }>('POST', '/api/video/v2/cameras/previewURLs', {
      cameraIndexCode,
      protocol: 'ws',
    });
  }

  async request<T>(method: 'POST' | 'GET', path: string, body: RhSafeAny) {
    try {
      const headers = {
        Accept: '*/*',
        'Content-Type': 'application/json',
      };
      // 3. 发送请求
      const url = `${configinfo.webAddress}:5002/invoke`; // 替换为实际域名
      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify({
          method: method,
          path: '/artemis' + path,
          body: body,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = (await response.json()) as DataResultT<T>;
      if (!result.Success) throw result.Message;
      return result.Attach;
    } catch (error) {
      console.error('请求失败:', error);
      throw error;
    }
  }
}
