import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rh-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss'],
})
export class EmptyComponent implements OnInit {

  @Input() rhText: string = "暂无数据";
  @Input() rhImgSrc: string = "assets/svg/empty.svg";

  constructor() { }

  ngOnInit() { }

}
