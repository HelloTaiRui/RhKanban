import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { lark } from '../../../../../../assets/meixiang/lark-iframe-poster.js';
import { RhSafeAny } from '@model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'rh-meixiang-digital-twin',
  templateUrl: './meixiang-digital-twin.component.html',
  styleUrls: ['./meixiang-digital-twin.component.less'],
})
export class RhMeixiangDigitalTwinComponent implements OnInit, AfterViewInit {
  @Input() rhUrl: string;
  @ViewChild('iframe') iframe: ElementRef<HTMLIFrameElement>;
  @Input() rhInteraction = false;
  @Input() rhPlaceholderImg: string;
  @Input() rhUseImg = false;

  poster: RhSafeAny;

  isFullscreen = false;

  isDevMode = location.hostname == 'localhost';

  targetUrl: RhSafeAny;

  constructor(private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer) {
    //console.log(lark);
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const { rhUrl } = changes;
    if (rhUrl && rhUrl.currentValue) {
      this.targetUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        rhUrl.currentValue
      );
    }
  }
  ngAfterViewInit(): void {
    //console.log(this.iframe);
    if (this.iframe?.nativeElement && !this.rhUseImg) {
      this.poster = new lark.iframePoster(this.iframe.nativeElement, {
        onMessage: this.websocketonmessage,
        listenKeyboard: true,
      });
    }
    window['test'] = this;
  }

  // 数据接收
  websocketonmessage = (e) => {
    this.poster.setShowRtt(false);
    this.poster.setShowPcAppliQuit(false);
    //console.log(e);
    switch (e.data.type) {
      case 20200:
        console.log('通道开启', e.data.data);
        break;
      case 20201:
        console.log('通道关闭', e.data.data);
        break;
      // 接收到字节消息
      case 20202:
        console.log('接收到字节消息', e.data.data);
        break;
      // 接收到文本消息
      case 20203:
        console.log('接收到文本消息', e.data.data);
        this.global_callback(e.data.data);
        break;
      case 10010:
        console.log('键盘', e.data.data);
        break;
      default:
        // console.log("receive message." + e.data.prex, e.data.type, e.data.message, e.data.data);
        break;
    }
  };
  global_callback(msg: string) {
    console.log('收到：', msg);
    if (msg.includes('需要进入模块') && this.rhInteraction) {
      this.sendSock('进入智慧物流');
    }
    /*     try {
      console.log(msg);
    } catch (err) {
      console.log(err);
    } */
  }
  // 数据发送
  sendSock(agentData) {
    this.poster.sendTextToRenderSererAppDataChannel(agentData);
    console.log('发送：', agentData);
  }

  /** 进入全屏 */
  enterFullScreen() {
    this.isFullscreen = true;
    this.cdr.detectChanges();
  }
  /** 退出全屏 */
  exitFullScreen() {
    this.isFullscreen = false;
    this.cdr.detectChanges();
  }
}
