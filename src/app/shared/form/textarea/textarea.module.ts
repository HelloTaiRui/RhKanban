import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { RhvFormlyTextareaComponent } from './textarea.component';
import { FormlyModule } from '@ngx-formly/core';



@NgModule({
  declarations: [
    RhvFormlyTextareaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzInputModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'textarea',
          component: RhvFormlyTextareaComponent,
          wrappers: ['form-field'],
        },
      ],
    }),
  ]
})
export class RhvFormlyTextareaModule { }
