import { AreaLevel } from './../../enums/areaLevel';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ComparisonViewAreaFilterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 * 
 * @author Harsh Pratyush
 */
@Pipe({
  name: 'comparisonViewAreaFilter',
})
export class ComparisonViewAreaFilterPipe implements PipeTransform {

  /**
   * Filter area according to arealevel and parentAreaId
   * @param allAreas 
   * @param areaLevel 
   * @param pareantAreaId 
   */
  transform(allAreas: Area[],areaLevel : IAreaLevel,pareantAreaId:string) {

     if(!areaLevel.isDistrictAvailable)
     {
      return allAreas.filter(area=>(area.parentAreaCode===pareantAreaId && area.levels.indexOf(areaLevel.level)>-1)  );
     }
     else 
     {
       if(pareantAreaId=='IND')
       {
        if(AreaLevel.NITIAYOG==areaLevel.level)
        {
        let district=allAreas.filter(d=>d.levels.indexOf(AreaLevel.NITIAYOG)>-1);

       let parentIds:Set<string>=new Set(); 
        district.forEach(element => {
         parentIds.add(element.parentAreaCode);
        });
    
    
       return allAreas.filter(d=>parentIds.has(d.code));
       }
     
       else
       {
        return allAreas.filter(area=>area.parentAreaCode===pareantAreaId);
       }

       }
        else
        return allAreas.filter(area=>(area.parentAreaCode===pareantAreaId && area.levels.indexOf(areaLevel.level)>-1 && area.areaname!='NA' ) );
     }
    }

}
