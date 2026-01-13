import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, Provider } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HttpClientModule,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

import { NgxEchartsModule } from 'ngx-echarts';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { RhStartupService } from '@core';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { FORM_MODULE_REQUIRED } from '@shared/form';
import * as echarts from 'echarts';
import { RhSafeAny } from '@model';
registerLocaleData(zh);

(window as RhSafeAny).echarts = echarts;

/** 语言提供商 */
const LANG_PROVIDES = [{ provide: NZ_I18N, useValue: zh_CN }];

/** 程序初始化前获取配置信息等工作 */
const APPINIT_PROVIDES: Provider[] = [];

/** 路由复用提供商 */
const APP_ROUTEREUSE_PROVIDERS: Provider[] = [];


function appStartupFactory(startupSer: RhStartupService) {
  return () => {
    return startupSer.run();
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxEchartsModule.forRoot({
      echarts: echarts,
    }),
    NzModalModule,
    NzMessageModule,
    NzDrawerModule,
    NzSkeletonModule,
    //RuntimeModule,
    ...FORM_MODULE_REQUIRED,
    MonacoEditorModule.forRoot({}),
    AppRoutingModule,
  ],
  providers: [
    ...LANG_PROVIDES,
    ...APPINIT_PROVIDES,
    ...APP_ROUTEREUSE_PROVIDERS,
    { provide: NZ_I18N, useValue: zh_CN },
    {
      provide: APP_INITIALIZER,
      useFactory: appStartupFactory,
      deps: [RhStartupService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
}
