import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'business',
    loadChildren: () =>
      import('./routes/business/business.module').then((m) => m.BusinessModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./routes/exception/exception.module').then(
        (m) => m.ExceptionModule
      ),
  },
  {
    path: 'overview',
    loadChildren: () =>
      import('./routes/overview/overview.module').then((m) => m.OverviewModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./routes/overview/overview.module').then((m) => m.OverviewModule),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true, // 添加锚点
      // enableTracing: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
