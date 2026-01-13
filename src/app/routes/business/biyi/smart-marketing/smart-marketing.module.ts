import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartMarketingRoutingModule } from './smart-marketing-routing.module';
import { SmartMarketingComponent } from './smart-marketing.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [SmartMarketingComponent],
  imports: [
    CommonModule,
    SharedModule,
    SmartMarketingRoutingModule
  ]
})
export class SmartMarketingModule { }
