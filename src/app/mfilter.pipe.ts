import { PipeTransform, Pipe } from '@angular/core';
@Pipe({
    name:'mfilter'
})
export class MfilterPipe implements PipeTransform{
    transform(value, term) {
        if(!term) {
            return value;
        }
        else{
            var value1 =  value.filter(item => item.toLowerCase().indexOf(term.toLowerCase()) > -1);
            return value1
        }
      }
}