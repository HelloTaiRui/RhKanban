import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RhvFormlyInputComponent } from './input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormlyModule } from '@ngx-formly/core';
import { RhvFormlyFormFieldModule } from '../form-field/form-field.module';



@NgModule({
  declarations: [
    RhvFormlyInputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzInputModule,
    NzInputNumberModule,
    RhvFormlyFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'input',
          component: RhvFormlyInputComponent,
          wrappers: ['form-field'],
        },
        { name: 'string', extends: 'input' },
        {
          name: 'number',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number'
            }
          },
        },
        {
          name: 'integer',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number'
            }
          },
        },
      ],
    })
  ]
})
export class RhvFormlyInputModule { }
