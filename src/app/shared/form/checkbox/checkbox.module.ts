import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RhvFormlyCheckboxComponent } from './checkbox.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { RhvFormlyFormFieldModule } from '../form-field/form-field.module';
import { FormlyModule } from '@ngx-formly/core';

@NgModule({
  declarations: [RhvFormlyCheckboxComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCheckboxModule,
    RhvFormlyFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'checkbox',
          component: RhvFormlyCheckboxComponent,
          wrappers: ['form-field'],
        },
        {
          name: 'boolean',
          extends: 'checkbox',
        },
      ],
    }),
  ]
})
export class RhvFormlyCheckboxModule { }
