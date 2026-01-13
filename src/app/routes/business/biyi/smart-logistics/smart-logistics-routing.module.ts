import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmartLogisticsComponent } from './smart-logistics.component';

const routes: Routes = [
  {
    path: '**',
    component: SmartLogisticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmartLogisticsRoutingModule {}
