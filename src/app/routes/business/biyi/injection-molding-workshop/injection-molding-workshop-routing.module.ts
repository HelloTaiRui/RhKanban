import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipmentOverviewBoardComponent } from './equipment-overview-board/equipment-overview-board.component';
import { MachineOverviewBoardComponent } from './machine-overview-board/machine-overview-board.component';
import { WorkshopOperatingBoardComponent } from './workshop-operating-board/workshop-operating-board.component';
import { WorkshopStatusBoardComponent } from './workshop-status-board/workshop-status-board.component';

const routes: Routes = [
  {
    path: 'WorkshopStatusBoard',
    component: WorkshopStatusBoardComponent,
  },
  {
    path: 'EquipmentOverviewBoard',
    component: EquipmentOverviewBoardComponent,
  },
  {
    path: 'MachineOverviewBoard',
    component: MachineOverviewBoardComponent,
  },
  {
    path: 'WorkshopOperatingBoard',
    component: WorkshopOperatingBoardComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InjectionMoldingWorkshopRoutingModule {}
