import { Component, Input, OnInit } from '@angular/core';
import format from 'date-fns/format';
import { Observable, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { zhCN } from 'date-fns/locale';
import { RhBusinessApiService } from '@core';

@Component({
  selector: 'rh-page-frame',
  templateUrl: './page-frame.component.html',
  styleUrls: ['./page-frame.component.less'],
  host: {
    '[style.width]': "rhWidth||'100%'",
    '[style.height]': "rhHeight||'100%'",
  },
})
export class RhPageFrameComponent implements OnInit {
  constructor(public apiSer: RhBusinessApiService) {}
  @Input() rhWidth: string;
  @Input() rhHeight: string;

  /** 中央标题 */
  @Input() rhTitle: string;
  /** 左标题 */
  @Input() rhLeftTitle: string;
  /** 左侧logo图片地址 */
  @Input() rhLeftImg: string = 'assets/rhv/favicon.png';
  /** 左侧logo宽度 */
  @Input() rhLeftImgWidth: number;
  /** 左侧logo高度 */
  @Input() rhLeftImgHeight: number;
  /** 右标题 */
  @Input() rhRightTitle: string;
  /** 顶部区域最外层容器的自定义class */
  @Input() rhHeaderNgClass: any;
  /** 内容区域最外层容器的自定义class */
  @Input() rhBodyNgClass: any;
  /** 是否使用本地时间 */
  @Input() rhUseLocalTime: boolean = true;
  /** 背景图URL */
  @Input() rhBgImg: string = 'assets/images/v2025/bg.png';
  /** 顶部图URL */
  @Input() rhHeaderImg: string = 'assets/images/v2025/bg_top.png';
  /** 中央标题被点击事件 */
  @Input() rhCenterTitleClicked: () => any;

  leftTimeSubscription: Subscription;
  rightTimeSubscription: Subscription;

  leftTitle$: Observable<string>;
  rightTitle$: Observable<string>;

  time = 0;
  date = '';
  weekday = '';
  weatherData: any;
  ngOnInit() {
    this.leftTitle$ = this.useTime('rhLeftTitle');
    this.rightTitle$ = this.useTime('rhRightTitle');
    this.getWeatherData();
  }
  // 获取天气数据
  getWeatherData() {
    this.apiSer
      .getOuter('Weather', 'GetWeatherEnvironmentData', {}, '', false)
      .subscribe({
        next: (res) => {
          this.weatherData = res;
          console.log('天气数据:', res);
        },
        error: (err) => {
          console.error('获取天气数据失败:', err);
        },
      });
  }
  getWeatherIconSimple(weatherText: string): string {
    const map: { [key: string]: string } = {
      // 晴
      晴: 'qing',

      // 多云
      多云: 'duoyun',
      少云: 'duoyun',
      晴间多云: 'qingjianduoyun',

      // 阴
      阴: 'yin',

      // 阵雨
      阵雨: 'zhenyu',
      强阵雨: 'zhenyu',

      // 雷阵雨
      雷阵雨: 'leizhenyu',
      强雷阵雨: 'leizhenyu',
      雷阵雨伴有冰雹: 'leizhenyubanyoubingbao',

      // 雨
      小雨: 'xiaoyu',
      中雨: 'zhongyu',
      大雨: 'dayu',
      极端降雨: 'jiduanjiangyu',
      '毛毛雨/细雨': 'xiaoyu',
      暴雨: 'dayu',
      大暴雨: 'dayu',
      特大暴雨: 'jiduanjiangyu',
      冻雨: 'dongyu',
      小到中雨: 'zhongyu',
      中到大雨: 'zhongyu',
      大到暴雨: 'dayu',
      暴雨到大暴雨: 'dayu',
      大暴雨到特大暴雨: 'jiduanjiangyu',
      雨: 'zhongyu',

      // 雪
      小雪: 'xiaoxue',
      中雪: 'zhongxue',
      大雪: 'daxue',
      暴雪: 'daxue',
      雨夹雪: 'yujiaxue',
      雨雪天气: 'yujiaxue',
      阵雨夹雪: 'yujiaxue',
      阵雪: 'zhenxue',
      小到中雪: 'xiaoxue',
      中到大雪: 'zhongxue',
      大到暴雪: 'daxue',
      雪: 'zhongxue',

      // 雾/霾/沙尘
      薄雾: 'wu',
      雾: 'wu',
      浓雾: 'wu',
      强浓雾: 'wu',
      大雾: 'wu',
      特强浓雾: 'wu',
      霾: 'mai',
      中度霾: 'mai',
      重度霾: 'mai',
      严重霾: 'mai',
      扬沙: 'yangsha',
      浮尘: 'fuchen',
      沙尘暴: 'shachenbao',
      强沙尘暴: 'shachenbao',

      // 特殊
      热: 're',
      冷: 'leng',
      未知: 'weizhi',
    };

    // 尝试直接匹配，或包含匹配
    for (const key in map) {
      if (weatherText?.includes(key)) {
        return `assets/img/weather/${map[key]}.png`;
      }
    }

    return 'assets/img/weather/weizhi.png';
  }
  useTime(key: 'rhLeftTitle' | 'rhRightTitle') {
    return timer(0, 1000).pipe(
      map(() => {
        const curTime = this.rhUseLocalTime
          ? new Date()
          : new Date(this.getServerDate().getTime());
        this.date = format(curTime, 'yyyy.MM.dd');
        this.weekday = format(curTime, 'EEEE', { locale: zhCN });
        const time = format(curTime, 'HH:mm:ss');
        return this[key] || time;
      }),
    );
  }

  getServerDate() {
    let xhr = new window.XMLHttpRequest();
    xhr.open('GET', '/?=' + new Date().getTime(), false);
    xhr.send(null);

    var date = xhr.getResponseHeader('Date');
    return new Date(date);
  }
}
