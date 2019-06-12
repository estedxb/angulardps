import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'archiveFilter',
  pure: true
})
export class ArchiveFilterPipe implements PipeTransform {
  transform(datas: any[], isBoolen: boolean = false): any {
    // console.log('archiveFilter datas :: ' , datas);
    if (!datas) { return datas; }
    let returnData: any = datas.filter(d => d.isArchived === isBoolen);
    console.log('archiveFilter datas after:: ', returnData);
    return returnData;
    // return datas;
  }
}
