import { PipeTransform, Pipe } from '@angular/core';
@Pipe({
    name: 'mfilter'
})
export class MfilterPipe implements PipeTransform {
    transform(value, term) { //term is a input
    
        if (!term) {
            return value;// original array
        }
        else {
      
            value = value.filter(item => ((item[0] + item[1]).toString().toLowerCase().indexOf(term.toLowerCase()) ) > -1);
          
            return  value
        }
    }
}