import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormlyModule } from '@ngx-formly/core';
import { RhvFormlyVerificationCodeComponent } from './verification-code.component';



@NgModule({
  declarations: [
    RhvFormlyVerificationCodeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzInputModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'verification-code',
          component: RhvFormlyVerificationCodeComponent,
          wrappers: ['form-field'],
        },
      ],
    }),
  ]
})
export class RhvFormlyVerificationCodeModule { }
