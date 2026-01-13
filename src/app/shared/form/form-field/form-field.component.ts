import { Component, OnInit } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'rhv-formly-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.less']
})
export class RhvFormlyFormFieldComponent extends FieldWrapper<FormlyFieldConfig> {

  get errorState() {
    return this.showError ? 'error' : '';
  }

}
