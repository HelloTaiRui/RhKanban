import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'rhv-formly-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.less']
})
export class RhvFormlyInputComponent extends FieldType<FieldTypeConfig> {

}
