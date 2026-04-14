import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesTargetBoardRoutingModule } from './sales-target-board-routing.module';
import { SalesTargetBoardComponent } from './sales-target-board.component';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [SalesTargetBoardComponent],
  imports: [
    CommonModule,
    SharedModule,
    SalesTargetBoardRoutingModule,
  ],
})
export class SalesTargetBoardModule {}