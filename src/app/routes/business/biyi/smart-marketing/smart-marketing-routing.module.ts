import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmartMarketingComponent } from './smart-marketing.component';

const routes: Routes = [
  {
    path: '**',
    component: SmartMarketingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmartMarketingRoutingModule {}
