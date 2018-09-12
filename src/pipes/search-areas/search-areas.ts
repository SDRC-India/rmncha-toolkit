import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchAreasPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'searchAreas',
})
export class SearchAreasPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(areas:IArea[],search) {
    if(search && search!=null && search!='')
      return areas.filter(d=>d.areaname.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    else
      return  areas
}

}
