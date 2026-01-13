import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "statusBackground",
})
export class StatusBackgroundPipe implements PipeTransform {
  transform(value: any, status?: any[]): any {
    //console.log(value,status);
    if (!status) {
      status = ["未受理", "处理中", "已完成"];
    }
    switch (value) {
      case status[2]:
        return "rhv-completed";
      case status[1]:
        return "rhv-handling";
      case status[0]:
        return "rhv-unhandled";
      default:
        return value;
    }
  }
}
