import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'rhv-formly-verification-code',
  templateUrl: './verification-code.component.html',
})
export class RhvFormlyVerificationCodeComponent extends FieldType<FieldTypeConfig> implements OnInit {
  nums: Array<number | string> = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  // 验证码base64图片
  verifySrc = '';
  // 验证码
  verifyStr = '';
  @Output() verifyStrChange = new EventEmitter<string>();

  ngOnInit(): void {
    this.verify();
  }

  verify() {
    this.createCode();
  }

  createCode($event?: any) {
    let canvas = document.createElement('canvas') as any;
    let context = canvas.getContext('2d'); //获取画布2D上下文
    canvas.width = 100;
    canvas.height = 30;
    context.fillStyle = 'cornflowerblue'; //画布填充色
    context.fillRect(0, 0, 100, 30);
    // 创建渐变
    let gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop('0', 'magenta');
    gradient.addColorStop('0.5', 'blue');
    gradient.addColorStop('1.0', 'red');
    //清空画布
    context.fillStyle = gradient; //设置字体颜色
    context.font = '25px Arial'; //设置字体
    let rand = new Array();
    let x = new Array();
    let y = new Array();
    for (let i = 0; i < 4; i++) {
      rand[i] = this.nums[Math.floor(Math.random() * this.nums.length)];
      x[i] = i * 17 + 10;
      y[i] = 23;
      context.fillText(rand[i], x[i], y[i]);
    }
    // console.log(rand);
    //画3条随机线
    for (let i = 0; i < 3; i++) {
      this.drawline(canvas, context);
    }

    // 画30个随机点
    for (let i = 0; i < 30; i++) {
      this.drawDot(canvas, context);
    }
    this.verifyStr = rand.join('');
    this.convertCanvasToImage(canvas);
    // console.log('验证码');
    // 清空
    canvas = null;
    context = null;
  }

  // 随机线
  drawline(canvas, context) {
    context.moveTo(
      Math.floor(Math.random() * canvas.width),
      Math.floor(Math.random() * canvas.height)
    ); //随机线的起点x坐标是画布x坐标0位置，y坐标是画布高度的随机数
    context.lineTo(
      Math.floor(Math.random() * canvas.width),
      Math.floor(Math.random() * canvas.height)
    ); //随机线的终点x坐标是画布宽度，y坐标是画布高度的随机数
    context.lineWidth = 0.5; //随机线宽
    context.strokeStyle = 'rgba(50,50,50,0.3)'; //随机线描边属性
    context.stroke(); //描边，即起点描到终点
  }

  // 随机点(所谓画点其实就是画1px像素的线，方法不再赘述)
  drawDot(canvas, context) {
    let px = Math.floor(Math.random() * canvas.width);
    let py = Math.floor(Math.random() * canvas.height);
    context.moveTo(px, py);
    context.lineTo(px + 1, py + 1);
    context.lineWidth = 0.2;
    context.stroke();
  }

  // 绘制图片
  convertCanvasToImage(canvas) {
    this.verifySrc = canvas.toDataURL('image/png');
    this.verifyStrChange.emit(this.verifyStr);
  }
}
