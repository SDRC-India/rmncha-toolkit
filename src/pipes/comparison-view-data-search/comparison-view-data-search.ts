import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ComparisonViewDataSearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 * @author Harsh Pratyush
 */
@Pipe({
  name: 'comparisonViewDataSearch',
})
export class ComparisonViewDataSearchPipe implements PipeTransform {
  /**
   * Filter the data according to source/indicator
   */
  transform(comparisionData : any[],search:string,area1:string,area2:string,area3:string) {

    if(search!=null && search!='')
   return comparisionData.filter(data=>(data['indicator'].toLowerCase().includes(search.toLowerCase()) 
   || (data['area1']?data['source1'].toLowerCase().includes(search.toLowerCase()):false)
   || (data['area2']?data['source2'].toLowerCase().includes(search.toLowerCase()):false)
   || (data['area3']?data['source3'].toLowerCase().includes(search.toLowerCase()):false)));
   else 
   return comparisionData;
  }
}
