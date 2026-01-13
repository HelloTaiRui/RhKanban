import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmartManufacturingComponent } from './smart-manufacturing.component';

const routes: Routes = [
  {
    path: '**',
    component: SmartManufacturingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmartManufacturingRoutingModule {}
