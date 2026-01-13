import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RhvFormlyCodeComponent } from './code.component';
import { RhvFormlyFormFieldModule } from '../form-field/form-field.module';
import { FormlyModule } from '@ngx-formly/core';
import { NzButtonModule } from 'ng-zorro-antd/button';



@NgModule({
  declarations: [RhvFormlyCodeComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    RhvFormlyFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'js',
          component: RhvFormlyCodeComponent,
          wrappers: ['form-field'],
          defaultOptions: {
            templateOptions: {
              type: "javascript"
            }
          }
        },
        {
          name: 'json',
          extends: 'js',
          defaultOptions: {
            templateOptions: {
              type: "json"
            }
          }
        },
        {
          name: 'css',
          extends: 'js',
          defaultOptions: {
            templateOptions: {
              type: 'css'
            }
          },
        }
      ],
    })
  ]
})
export class RhvFormlyCodeModule { }
