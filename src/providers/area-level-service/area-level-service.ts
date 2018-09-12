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


/**
 * This service will deal with area level related work
 * @since 1.0.0
 * @author Subhadarshani
 */
@Injectable()
export class AreaLevelServiceProvider {

  constructor(private pouchdbService: PouchdbServiceProvider, private constantService: ConstantServiceProvider) {

  }

  /**
   * This method will return the maximum slug Id area level
   * @since 1.0.0
   * @author Subhadarshani
   */
  async getMaxSlugIdAreaLevel() {
    let db = this.pouchdbService.getDB()
    let arealevels: IAreaLevel[] = (await db.get(this.constantService.getConstantObject().docName_areaLevel)).data
    arealevels.sort((a: IAreaLevel, b: IAreaLevel) => {
      if (a.slugidarealevel > b.slugidarealevel) {
        return -1
      } else if (a.slugidarealevel < b.slugidarealevel) {
        return 1
      } else {
        return 0;
      }

    })

    return arealevels[0].slugidarealevel;

  }
  /**
   * This method will save arealevel data in local storage
   * @since 1.0.0
   * @author Subhadarshani
   */
  async saveAreaLevel(response: ISyncResponse) {
    try {
      let db = this.pouchdbService.getDB()
      let doc = await db.get(this.constantService.getConstantObject().docName_areaLevel)     
      return await db.put({
        _id: this.constantService.getConstantObject().docName_areaLevel,
        _rev: doc._rev,
        data: response.data

      });
    } catch (err) {
      // console.log(err);
    }
  }
}
