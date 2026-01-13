import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductLineBoardComponent } from './product-line-board/product-line-board.component';

const routes: Routes = [
  {
    path: 'ProductLineBoard',
    component: ProductLineBoardComponent,
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
export class AssemblyWorkshopRoutingModule {}
