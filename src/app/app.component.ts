import { Component, Inject, OnInit } from '@angular/core';
import { configinfo } from '@configs';
import { RhEchartsHelper, RhStartupService } from '@core';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { NgxEchartsConfig } from 'ngx-echarts/lib/ngx-echarts.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  constructor(
    public startupSer: RhStartupService,
    private echartsHelper: RhEchartsHelper,
    @Inject(NGX_ECHARTS_CONFIG) private echarts: NgxEchartsConfig
  ) {
    this.startupSer.closeBootstrapLoading();
    this.setupMitvStartup();
  }

  ngOnInit(): void {
    this.echartsHelper.setup(this.echarts.echarts);
    this.echartsHelper.loadMap('world', 'assets/echarts/map/world.json');
    this.echartsHelper.loadTheme('biyi', 'assets/echarts/theme/biyi.json');
  }

  /** 设置小米电视自启相关交互代码 */
  async setupMitvStartup() {
    const isInMitv = navigator.userAgent.toLowerCase().includes('mitv');
    if (isInMitv) {
      const tickUrl = `${configinfo.outerServerAddress}:5002/tick`;
      this.tick(tickUrl);
    }
  }
  /** 心跳 */
  tick = async (tickUrl: string) => {
    try {
      await fetch(tickUrl);
    } catch (error) {
      //
    }
    setTimeout(() => {
      this.tick(tickUrl);
    }, 5000);
  };
}
