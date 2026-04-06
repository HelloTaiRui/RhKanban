import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssemblyWorkshopRoutingModule } from './assembly-workshop-routing.module';
import { SharedModule } from '@shared';
import { ProductLineBoardComponent } from './product-line-board/product-line-board.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@NgModule({
  declarations: [ProductLineBoardComponent],
  imports: [
    CommonModule,
    SharedModule,
    NzSpinModule,
    NzModalModule,
    NzIconModule,
    AssemblyWorkshopRoutingModule,
    NzTableModule,
    NzDatePickerModule,
    NzTabsModule,
  ],
})
export class AssemblyWorkshopModule {}
