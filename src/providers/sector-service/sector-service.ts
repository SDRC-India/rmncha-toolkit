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
  Generated class for the SectorServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SectorServiceProvider {

  constructor(private pouchdbService: PouchdbServiceProvider, private constantService: ConstantServiceProvider) {

  }
  /**
   * This method will return the maximum slugidsubgroup
   * @since 1.0.0
   * @author Subhadarshani
   */
  async getMaxSlugIdSector() {
    let db = this.pouchdbService.getDB()
    let sectors: ISector[] = (await db.get(this.constantService.getConstantObject().docName_sector)).data
    sectors.sort((a: ISector, b: ISector) => {
      if (a.slugidsector > b.slugidsector) {
        return -1
      } else if (a.slugidsector < b.slugidsector) {
        return 1
      } else {
        return 0;
      }

    })

    return sectors[0].slugidsector;

  }
  /**
   * This method will save subgroup data in local storage
   * @since 1.0.0
   * @author Subhadarshani
   */
  async saveSector(response: ISyncResponse) {
    try {
      let db = this.pouchdbService.getDB()
      let doc = await db.get(this.constantService.getConstantObject().docName_sector)     
      return await db.put({
        _id: this.constantService.getConstantObject().docName_sector,
        _rev: doc._rev,
        data: response.data

      });
    } catch (err) {
      console.log(err);
    }
  }
}
