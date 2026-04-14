import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesTargetBoardComponent } from './sales-target-board.component';

const routes: Routes = [
  {
    path: '',
    component: SalesTargetBoardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesTargetBoardRoutingModule {}