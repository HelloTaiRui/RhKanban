import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rh-item-container',
  templateUrl: './item-container.component.html',
  styleUrls: ['./item-container.component.less']
})
export class RhItemContainerComponent implements OnInit {

  @Input() rhTitle:string;

  constructor() { }

  ngOnInit(): void {
  }

}
