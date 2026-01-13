import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'rhv-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.less']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @Input() rhWsUrl!: string;
  // 实时识别画面
  @ViewChild('canvas', { static: false }) liveCanvas!: ElementRef<HTMLCanvasElement>;
  ws!: WebSocket;
  // 3秒后重连
  wsReconnectTimeoutId!: any;
  wsReconnectDelay = 3000;
  // 当前识别图片
  liveImageBlob!: Blob;
  isDrawing = false;
  constructor() { }

  ngOnInit(): void {
    if (this.rhWsUrl) {
      this.initWebSocketConnect();
    }
  }

  ngOnDestroy(): void {
    // 断开websocket连接
    if (this.ws) {
      // 取消事件监听
      this.ws.removeEventListener('close', () => { });
      this.ws.onclose = () => { };
      this.ws.close();
    }
  }

  // 初始化websocket连接
  initWebSocketConnect() {
    // 断开websocket连接
    if (this.ws) {
      // 取消事件监听
      this.ws.removeEventListener('close', () => { });
      this.ws.close();
    }

    this.ws = new WebSocket(this.rhWsUrl);

    this.ws.onopen = () => {
      console.log('client: connected!');
    };

    this.ws.onmessage = (evt) => {
      const data = evt.data;
      if (data instanceof Blob) {
        this.liveImageBlob = data;
        if (!this.isDrawing) {
          this.reDrawLiveCanvas();
        }
      }
    };

    this.ws.onclose = () => {
      console.log('client: disconnected!');
      if (this.wsReconnectTimeoutId) {
        clearTimeout(this.wsReconnectTimeoutId);
      }
      this.wsReconnectTimeoutId = setTimeout(() => this.initWebSocketConnect(), this.wsReconnectDelay);
    };

    this.ws.onerror = (err) => {
      console.log('client error: ', err);
      this.ws.close();
    };
  }

  // 处理视频帧：python识别结果图片
  async reDrawLiveCanvas() {
    if (!this.liveImageBlob) return;
    this.isDrawing = true;
    try {
      const canvas = this.liveCanvas.nativeElement;
      const ctx = canvas.getContext('2d')!;
      // 绘制视频帧
      const temp = await createImageBitmap(this.liveImageBlob);
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = temp.width;
      canvas.height = temp.height;
      ctx.drawImage(temp, 0, 0, temp.width, temp.height);
      temp.close();
    } catch (error) {
      console.error('Error creating ImageBitmap:', error);
    } finally {
      this.isDrawing = false;
    }
  }

}
