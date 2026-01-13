import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartOperationRoutingModule } from './smart-operation-routing.module';
import { SmartOperationComponent } from './smart-operation.component';
import { SharedModule } from '@shared';
import { RhBiYiSnippetsModule } from '../snippets';
import { HikvisionHelper } from '@core';

@NgModule({
  declarations: [SmartOperationComponent],
  imports: [
    CommonModule,
    SharedModule,
    RhBiYiSnippetsModule,
    SmartOperationRoutingModule,
  ],
  providers: [HikvisionHelper],
})
export class SmartOperationModule {}
