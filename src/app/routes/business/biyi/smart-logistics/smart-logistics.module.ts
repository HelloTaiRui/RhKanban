import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartLogisticsRoutingModule } from './smart-logistics-routing.module';
import { SmartLogisticsComponent } from './smart-logistics.component';
import { SharedModule } from '@shared';
import { FormsModule } from '@angular/forms';
import { RhBiYiSnippetsModule } from '../snippets';

@NgModule({
  declarations: [SmartLogisticsComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RhBiYiSnippetsModule,
    SmartLogisticsRoutingModule,
  ],
})
export class SmartLogisticsModule {}
