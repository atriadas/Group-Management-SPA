import { PipeTransform, Pipe } from '@angular/core';
@Pipe({
    name: 'mfilter'
})
export class MfilterPipe implements PipeTransform {
    transform(value, term) {
        if (!term) {
            return value;
        }
        else {
           // var value1 = value.filter(item => (item[0].toLowerCase().indexOf(term.toLowerCase()) ) > -1);
            var value2 = value.filter(item => ((item[0] + item[1]).toString().toLowerCase().indexOf(term.toLowerCase()) ) > -1);
            return  value2
            // (value1 ||
        }
    }
}