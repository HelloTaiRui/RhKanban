import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectItem'
})
export class SelectItemPipe implements PipeTransform {
  transform(value: string, dataSource: { Value: string, Text: string }[]): any {
    const target = dataSource.find((ele) => ele.Value === value);
    return target ? target.Text : value;
  }
}
