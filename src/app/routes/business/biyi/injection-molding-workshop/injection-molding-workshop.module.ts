import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkshopStatusBoardComponent } from './workshop-status-board/workshop-status-board.component';
import { EquipmentOverviewBoardComponent } from './equipment-overview-board/equipment-overview-board.component';
import { MachineOverviewBoardComponent } from './machine-overview-board/machine-overview-board.component';
import { WorkshopOperatingBoardComponent } from './workshop-operating-board/workshop-operating-board.component';

import { InjectionMoldingWorkshopRoutingModule } from './injection-molding-workshop-routing.module';
import { SharedModule } from '@shared';
import { NzProgressModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [
    WorkshopStatusBoardComponent,
    EquipmentOverviewBoardComponent,
    MachineOverviewBoardComponent,
    WorkshopOperatingBoardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NzProgressModule,
    InjectionMoldingWorkshopRoutingModule,
  ],
})
export class InjectionMoldingWorkshopModule {}
