import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssemblyWorkshopRoutingModule } from './assembly-workshop-routing.module';
import { SharedModule } from '@shared';
import { ProductLineBoardComponent } from './product-line-board/product-line-board.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [ProductLineBoardComponent],
  imports: [
    CommonModule,
    SharedModule,
    NzSpinModule,
    NzModalModule,
    AssemblyWorkshopRoutingModule,
    NzTableModule,
  ],
})
export class AssemblyWorkshopModule {}
