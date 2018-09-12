import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchIndicatorPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'searchIndicator',
})
export class SearchIndicatorPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(indicators:IIndicator[],search) {
    if(search &&search!=null && search!='')
      return indicators.filter(d=>d.iName.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    else
      return  indicators
  
  }
}
