import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmartOperationComponent } from './smart-operation.component';

const routes: Routes = [
  {
    path: '**',
    component: SmartOperationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmartOperationRoutingModule {}
