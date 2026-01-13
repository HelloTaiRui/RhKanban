import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RhvFormlySelectComponent } from './select.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { RhvFormlyFormFieldModule } from '../form-field/form-field.module';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { FormlyModule } from '@ngx-formly/core';



@NgModule({
  declarations: [RhvFormlySelectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzSelectModule,

    RhvFormlyFormFieldModule,
    FormlySelectModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'select',
          component: RhvFormlySelectComponent,
          wrappers: ['form-field'],
        },
        { name: 'enum', extends: 'select' },
      ],
    }),
  ]
})
export class RhvFormlySelectModule { }
