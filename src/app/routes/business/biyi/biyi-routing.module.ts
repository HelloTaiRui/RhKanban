import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'SmartOperationBoard',
    loadChildren: () =>
      import('./smart-operation/smart-operation.module').then(
        (m) => m.SmartOperationModule
      ),
  },
  {
    path: 'SmartMarketingBoard',
    loadChildren: () =>
      import('./smart-marketing/smart-marketing.module').then(
        (m) => m.SmartMarketingModule
      ),
  },
  {
    path: 'SmartManufacturingBoard',
    loadChildren: () =>
      import('./smart-manufacturing/smart-manufacturing.module').then(
        (m) => m.SmartManufacturingModule
      ),
  },
  {
    path: 'SmartLogisticsBoard',
    loadChildren: () =>
      import('./smart-logistics/smart-logistics.module').then(
        (m) => m.SmartLogisticsModule
      ),
  },
  {
    path: 'InjectionMoldingWorkshop',
    loadChildren: () =>
      import(
        './injection-molding-workshop/injection-molding-workshop.module'
      ).then((m) => m.InjectionMoldingWorkshopModule),
  },
  {
    path: 'AssemblyWorkshop',
    loadChildren: () =>
      import('./assembly-workshop/assembly-workshop.module').then(
        (m) => m.AssemblyWorkshopModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RhBiyiBoardRoutingModule {}
