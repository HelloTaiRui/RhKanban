import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

@Pipe({
    name: 'rhmFormatDistanceToNow'
})
export class FormatDistanceToNowPipe implements PipeTransform {

    transform(date: any): string {
        return formatDistanceToNow(new Date(date), {
            includeSeconds: true,
            locale: zhCN,
            addSuffix: true
        });
    }

}
