import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeSpliter'
})
export class TimeSpliterPipe implements PipeTransform {
  transform(value: string, mode: number): any {
    let returnval = '';
    if (value !== undefined && value !== null && value !== '') {
      if (mode === 1) {
        returnval = value.split(':')[0];
      } else {
        returnval = value.split(':')[1];
      }
    } else {
      returnval = '00';
    }
    if (returnval.length < 2) { returnval = '0' + returnval; }
    // console.log('mode :: ' + mode + ' :: ' + returnval);
    return returnval;
  }
}
