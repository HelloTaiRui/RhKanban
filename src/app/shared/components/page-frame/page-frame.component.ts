import { Component, Input, OnInit } from '@angular/core';
import format from 'date-fns/format';
import { Observable, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { zhCN } from 'date-fns/locale';

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

  leftTimeSubscription: Subscription;
  rightTimeSubscription: Subscription;

  leftTitle$: Observable<string>;
  rightTitle$: Observable<string>;

  time = 0;
  date = '';
  weekday = '';

  ngOnInit() {
    this.leftTitle$ = this.useTime('rhLeftTitle');
    this.rightTitle$ = this.useTime('rhRightTitle');
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
      })
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
