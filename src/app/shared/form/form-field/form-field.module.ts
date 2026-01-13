import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RhvFormlyFormFieldComponent } from './form-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormlyModule } from '@ngx-formly/core';



@NgModule({
  declarations: [RhvFormlyFormFieldComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    FormlyModule.forChild({
      wrappers: [
        {
          name: 'form-field',
          component: RhvFormlyFormFieldComponent,
        },
      ],
    }),
  ]
})
export class RhvFormlyFormFieldModule { }
