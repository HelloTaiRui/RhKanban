import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { RhvFormlyInputModule } from './input/input.module';
import { RhvFormlyTextareaModule } from './textarea/textarea.module';
import { RhvFormlyFormFieldModule } from './form-field/form-field.module';
import { RhvFormlyRadioModule } from './radio/radio.module';
import { RhvFormlyCheckboxModule } from './checkbox/checkbox.module';
import { RhvFormlySelectModule } from './select/select.module';
import { RhvFormlyCodeModule } from './code/code.module';
import { RhvFormlyVerificationCodeModule } from './verification-code/verification-code.module';

const MODULES = [
  CommonModule,
  FormsModule,
  FormlyModule,
  ReactiveFormsModule,
  RhvFormlyFormFieldModule,
  RhvFormlyInputModule,
  RhvFormlyTextareaModule,
  RhvFormlyRadioModule,
  RhvFormlyCheckboxModule,
  RhvFormlySelectModule,
  RhvFormlyVerificationCodeModule,
  RhvFormlyCodeModule
];

@NgModule({
  declarations: [],
  imports: [
    ...MODULES
  ],
  exports: [
    ...MODULES
  ]
})
export class RhvFormlyFormModule { }

export const FORM_MODULE_REQUIRED = [
  FormlyModule.forRoot({
    validationMessages: [
      { name: 'required', message: 'This field is required' },
    ]
  })
];