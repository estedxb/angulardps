import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'archiveFilter'
})
export class ArchiveFilterPipe implements PipeTransform {
  transform(datas: any[], isBoolen: boolean = false): any {
    if (!datas || !isBoolen) { return datas; }
    return datas.filter(d => d.isArchived === isBoolen);
  }
}
