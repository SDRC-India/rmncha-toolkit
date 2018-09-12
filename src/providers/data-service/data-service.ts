import {
  HttpClient
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  PouchdbServiceProvider
} from '../pouchdb-service/pouchdb-service';
import {
  ConstantServiceProvider
} from '../constant-service/constant-service';

/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {

  constructor(private pouchdbService: PouchdbServiceProvider, private constantService: ConstantServiceProvider) {

  }
  /**
   * This method will return the maximum slugiddata
   * @since 1.0.0
   * @author Subhadarshani
   */
  async getMaxSlugId() {
    let db = this.pouchdbService.getDataDB()

    let data = await db.find({
      selector: {
        "slugiddata": {
          $ne: null
        }
      }
    });
    // console.log(data.docs[data.docs.length - 1]);
    return data.docs[data.docs.length - 1]
  }
  /**
   * This method will save latest updated and new data in local storage
   * @since 1.0.0
   * @author Subhadarshani
   */
  async saveData(response: ISyncResponse) {
    try {
      let db = this.pouchdbService.getDataDB()  
     // comparing coming slugid with the slugid'd i.e exits in the database.
      for(let i=0;i<response.data.length;i++){
        try{
          let result = await db.get(response.data[i].slugiddata.toString())
          if(result){
            // if data matches then  delete that recode and insert it again  
           await db.remove(result)
            // insert the record again in data-si-rmncha
            let dbData: IDBData = {
              _id: response.data[i].slugiddata.toString(),
              area: response.data[i].area,
              below: response.data[i].below,
              indicator: response.data[i].indicator,
              ius: response.data[i].ius,
              rank: response.data[i].rank,
              src: response.data[i].src,
              subgrp: response.data[i].subgrp,
              top: response.data[i].top,
              tp: response.data[i].tp,
              trend: response.data[i].trend,
              value: (response.data[i].value),
              slugiddata: response.data[i].slugiddata,
              createdDate:response.data[i].createdDate,
              lastModified:response.data[i].lastModified,
              dKPIRSrs:response.data[i].dKPIRSrs,
              dNITIRSrs:response.data[i].dNITIRSrs,
              dTHEMATICRSrs:response.data[i].dTHEMATICRSrs,
              tps:response.data[i].tps
            }
            await db.put(dbData)
          }
        }catch(err){
          // console.log(err);
          if(err.status == 404){
            let dbData: IDBData = {
              _id: response.data[i].slugiddata.toString(),
              area: response.data[i].area,
              below: response.data[i].below,
              indicator: response.data[i].indicator,
              ius: response.data[i].ius,
              rank: response.data[i].rank,
              src: response.data[i].src,
              subgrp: response.data[i].subgrp,
              top: response.data[i].top,
              tp: response.data[i].tp,
              trend: response.data[i].trend,
              value: (response.data[i].value),
              slugiddata: response.data[i].slugiddata,
              createdDate:response.data[i].createdDate,
              lastModified:response.data[i].lastModified,
              dKPIRSrs:response.data[i].dKPIRSrs,
              dNITIRSrs:response.data[i].dNITIRSrs,
              dTHEMATICRSrs:response.data[i].dTHEMATICRSrs,
              tps:response.data[i].tps
            }
            await db.put(dbData)
          }
        
        }
      }
     
    } catch (err) {
      // console.log(err);
    }
  }
 
}
