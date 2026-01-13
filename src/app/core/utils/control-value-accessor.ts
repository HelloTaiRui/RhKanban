import { ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

type RhSafeAny=any;
type WithNil<T> = T | null | undefined;

/**
 * formcontrol表单控件的基类
 * @description 继承此类的组件，需要注册自身为提供商，形如：
 * `providers:[provideValueAccessor(XXXComponent)]`
 * 子类处理数据时需要继承`AfterViewInit`而不是`OnInit`
 */
export class RhControlValueAccessor implements ControlValueAccessor {
  rhDisabled!: boolean;
  protected _value: string | number | RhSafeAny;
  private _oldValue: string | number | RhSafeAny;
  get value() {
    return this._value;
  }
  set value(value: WithNil<string | number | RhSafeAny>) {
    this._oldValue = this._value;
    this._value = value;
    if (this._oldValue !== this._value) {
      // 当旧的值不等于新值时才触发onchange方法；
      this.onChange ? this.onChange(value) : null;
    }
    if (this.valueHandler) {
      this.valueHandler.call(this, this.value);
    }
  }
  /** value赋值之后的处理函数 */
  valueHandler: (value: WithNil<string | number | RhSafeAny>) => void = () => {
    //
  };

  onChange: (value: WithNil<string | number | RhSafeAny>) => void = () => {
    //
  };
  onTouched: (value: WithNil<string | number | RhSafeAny>) => void = () => {
    //
  };
  constructor(public cdr: ChangeDetectorRef) {
    //
  }

  // onModelChange(value: string) {
  //   this.value = value;
  // }

  clearValue() {
    this.value = null;
  }

  //#region control value accessor区域
  writeValue(obj: string | number): void {
    this.value = obj;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: RhSafeAny): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: RhSafeAny): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.rhDisabled = isDisabled;
    this.cdr.markForCheck();
  }
  //#endregion control value accessor区域结束
}
