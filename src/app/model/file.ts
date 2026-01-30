import { RhSelectItem, WithNil } from './base';

/** 动态table导出时的中英文映射表 */
export class ExportFileHeaderInfo {
  constructor(
    /** 字段名称 */
    public FieldName: WithNil<string>,
    /** 字段中文名称 */
    public FieldDisplayName: WithNil<string>,
    /** `s`表示string类型，`n`表示number类型，`b`表示boolean类型，`d`表示date类型 */
    public FieldValueType: string = 's',
    /** table管道数据 */
    public PipeDatas?: RhSelectItem[] | null,
    /** 日期格式 */
    public DateFormat?: WithNil<string>
  ) {}
}

/**
 * 导出文件样式
 */
export class ExportFileStyle {
  constructor(
    /** 列对齐方式，默认居中对齐 */
    public ColumnAlignment = 'Center'
  ) {}

  static create() {
    return new ExportFileStyle();
  }
}
