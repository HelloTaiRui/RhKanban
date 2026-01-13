import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RhvFormlyRadioComponent } from './radio.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { RhvFormlyFormFieldModule } from '../form-field/form-field.module';



@NgModule({
  declarations: [RhvFormlyRadioComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzRadioModule,

    FormlySelectModule,
    RhvFormlyFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'radio',
          component: RhvFormlyRadioComponent,
          wrappers: ['form-field'],
        },
      ],
    }),
  ]
})
export class RhvFormlyRadioModule { }
