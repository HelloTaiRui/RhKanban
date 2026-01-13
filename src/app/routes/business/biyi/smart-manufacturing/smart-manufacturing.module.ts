import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartManufacturingRoutingModule } from './smart-manufacturing-routing.module';
import { SmartManufacturingComponent } from './smart-manufacturing.component';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [SmartManufacturingComponent],
  imports: [CommonModule, SharedModule, SmartManufacturingRoutingModule],
})
export class SmartManufacturingModule {}
