import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the NitiAyogDataSearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'nitiAyogDataSearch',
})
export class NitiAyogDataSearchPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(nitiAyogData:NitiAyogData[],query:string) {
 
    if(query!=null && query!='')
    return nitiAyogData.filter(data=>(data.indicator.iName.toLowerCase().includes(query.toLowerCase()) 
    || (data.district?data.districtSource.toLowerCase().includes(query.toLowerCase()):false)
    || (data.state?data.stateSource.toLowerCase().includes(query.toLowerCase()):false)
    || (data.country?data.countrySource.toLowerCase().includes(query.toLowerCase()):false)));

    else 
    
    return nitiAyogData;

  }
}
