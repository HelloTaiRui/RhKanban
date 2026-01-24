import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { configinfo } from '@configs';
import { DataResultT } from '@model';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RhBusinessApiService {
  constructor(public http: HttpClient) {}

  get webAddress() {
    return configinfo.mesServerAddress;
  }

  public getOuter<T>(
    controller: string,
    api: string,
    params?: any,
    mockData?: T | string,
    enableMock?: boolean
  ) {
    return this.get(
      controller,
      api,
      params,
      configinfo.outerAddr,
      mockData,
      enableMock
    );
  }

  public postOuter<T>(
    controller: string,
    api: string,
    body: any,
    mockData?: T | string,
    enableMock?: boolean
  ) {
    return this.post(
      controller,
      api,
      body,
      configinfo.outerAddr,
      mockData,
      enableMock
    );
  }

  public getIot<T>(
    controller: string,
    api: string,
    params?: any,
    mockData?: T | string,
    enableMock?: boolean
  ) {
    return this.get(
      controller,
      api,
      params,
      configinfo.iotAddr,
      mockData,
      enableMock
    );
  }

  public postIot<T>(
    controller: string,
    api: string,
    body: any,
    mockData?: T | string,
    enableMock?: boolean
  ) {
    return this.post(
      controller,
      api,
      body,
      configinfo.iotAddr,
      mockData,
      enableMock
    );
  }

  public getMes<T>(
    controller: string,
    api: string,
    params?: any,
    mockData?: T | string,
    enableMock?: boolean
  ) {
    return this.get(
      controller,
      api,
      params,
      configinfo.rhpMesAddr + '/selfhost/api',
      mockData,
      enableMock
    );
  }

  public postMes<T>(
    controller: string,
    api: string,
    body: any,
    mockData?: T | string,
    enableMock?: boolean
  ) {
    return this.post(
      controller,
      api,
      body,
      configinfo.rhpMesAddr + '/selfhost/api',
      mockData,
      enableMock
    );
  }

  private addTimeTick(url: string) {
    return url + '?t=' + new Date().getTime();
  }

  public post<T>(
    controller: string,
    api: string,
    body: any,
    address: string,
    mockData?: T | string,
    enableMock?: boolean
  ) {
    return mockData && enableMock
      ? typeof mockData == 'string'
        ? this.http.get<T>(this.addTimeTick(mockData))
        : of(mockData)
      : this.http
          .post<DataResultT<T>>(`${address}/${controller}/${api}`, body)
          .pipe(map((res) => (res.Attach || res.attach || []) as T));
  }
  public get<T>(
    controller: string,
    api: string,
    params: any,
    address: string,
    mockData?: T | string,
    enableMock?: boolean
  ) {
    return mockData && enableMock
      ? typeof mockData == 'string'
        ? this.http.get<T>(this.addTimeTick(mockData))
        : of(mockData)
      : this.http
          .get<DataResultT<T>>(`${address}/${controller}/${api}`, {
            params: params,
          })
          .pipe(map((res) => (res.Attach || res.attach || []) as T));
  }

  public postMom<T>(
    controller: string,
    api: string,
    body: any,
    mockData?: T | string,
    enableMock?: boolean
  ) {
    return this.post(
      controller,
      api,
      body,
      configinfo.MomAddr,
      mockData,
      enableMock
    );
  }

  public postPlatform<T>(
    controller: string,
    api: string,
    body: any,
    mockData?: T | string,
    enableMock?: boolean
  ) {
    return this.post(
      controller,
      api,
      body,
      configinfo.PlatformV2addr,
      mockData,
      enableMock
    );
  }
}
