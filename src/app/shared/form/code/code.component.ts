import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditorComponent } from 'ngx-monaco-editor';

@Component({
  selector: 'rhv-formly-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.less']
})
export class RhvFormlyCodeComponent extends FieldType<FieldTypeConfig> {

  constructor(
    private modalCtrl: NzModalService
  ) {
    super();
  }

  handleOpenCodeEditor() {
    const modal = this.modalCtrl.create({
      nzTitle: `${this.to.label}`,
      nzContent: EditorComponent,
      nzComponentParams: {
        options: {
          language: this.to.type,
          theme: "vs-dark",
          readOnly: this.to.disabled
        }
      },
      nzWidth: "60rem",
      nzOnOk: (editor) => {
        this.formControl.setValue(editor['_value']);
      }
    });
    modal.afterOpen.subscribe(() => {
      const editor = modal.getContentComponent();
      editor.writeValue(this.formControl.value);
      if (this.to.type == "js") {

      }
    })
  }
}
