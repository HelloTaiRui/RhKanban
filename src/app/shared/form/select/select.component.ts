import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'rhv-formly-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less']
})
export class RhvFormlySelectComponent extends FieldType<FieldTypeConfig> {

}
