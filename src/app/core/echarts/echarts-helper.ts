import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RhEchartsHelper {
  echarts: any;

  constructor(private http: HttpClient) {}

  setup(echarts: any) {
    this.echarts = echarts;
  }

  async loadMap(mapName: string, geojsonFilePath: string) {
    if (!this.echarts) return;
    if (this.echarts.getMap(mapName)) return;
    if (geojsonFilePath.endsWith('.svg')) {
      const map = await this.http
        .get(geojsonFilePath, { responseType: 'text' })
        .toPromise();
      this.echarts.registerMap(mapName, { svg: map });
    } else {
      const map = await this.http.get(geojsonFilePath).toPromise();
      this.echarts.registerMap(mapName, map);
    }
  }

  async loadTheme(themeName: string, themeJsonFilePath: string) {
    if (!this.echarts) return;
    const theme = await this.http.get(themeJsonFilePath).toPromise();
    this.echarts.registerTheme(themeName, theme);
  }
}
