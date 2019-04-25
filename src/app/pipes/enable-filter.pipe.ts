import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enableFilter'
})
export class EnableFilterPipe implements PipeTransform {
  transform(datas: any[], isBoolen: boolean = true): any {
    if (!datas || !isBoolen) { return datas; }
    return datas.filter(d => d.isEnabled === isBoolen);
  }
}