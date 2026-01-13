import { Component, Inject, OnInit } from '@angular/core';
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
  }

  ngOnInit(): void {
    this.echartsHelper.setup(this.echarts.echarts);
    this.echartsHelper.loadMap('world', 'assets/echarts/map/world.json');
    this.echartsHelper.loadTheme('biyi', 'assets/echarts/theme/biyi.json');
  }
}
