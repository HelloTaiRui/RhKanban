import { NgModule } from '@angular/core';

import { Exception500Component } from './500.component';
import { Exception404Component } from './404.component';
import { ExceptionRoutingModule } from './exception-routing.module';
import { Exception403Component } from './403.component';

const COMPONENTS=[
  Exception403Component, 
  Exception404Component, 
  Exception500Component
]

@NgModule({
  imports: [ExceptionRoutingModule],
  declarations: [...COMPONENTS],
  providers: [],
  exports: [...COMPONENTS]
})
export class ExceptionModule {}
