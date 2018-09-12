import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SnapshotViewDataSearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'snapshotViewDataSearch',
})
export class SnapshotViewDataSearchPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(comparisionData : ISnapshotIndicator[],search:string) {
    if(search!=null && search!='')

    return comparisionData.filter(data=>(data.source.sourceName.toLowerCase().includes(search.toLowerCase())||
                                   data.indicator.iName.toLowerCase().includes(search.toLowerCase())))  
    else
    return comparisionData
  }
}
