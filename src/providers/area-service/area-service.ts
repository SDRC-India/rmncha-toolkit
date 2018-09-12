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
 * This service will deal with area related work
 * @since 1.0.0
 * @author Subhadarshani
 */
@Injectable()
export class AreaServiceProvider {

  constructor(private pouchdbService: PouchdbServiceProvider, private constantService: ConstantServiceProvider) {

  }

  /**
   * This method will return the maximum slug Id
   * @since 1.0.0
   * @author Subhadarshani
   */
  async getMaxSlugId() {
    let db = this.pouchdbService.getDB()
    let areas: IArea[] = (await db.get(this.constantService.getConstantObject().docName_area)).data
    areas.sort((a: IArea, b: IArea) => {
      if (a.slugidarea > b.slugidarea) {
        return -1
      } else if (a.slugidarea < b.slugidarea) {
        return 1
      } else {
        return 0;
      }

    })

    return areas[0].slugidarea;

  }
  /**
   * This method will save area data in local storage
   * @since 1.0.0
   * @author Subhadarshani
   * @param areas list of area to be added
   */
  async saveArea(response: ISyncResponse) {

    try {
      let db = this.pouchdbService.getDB()
      let doc = await db.get(this.constantService.getConstantObject().docName_area)
      return await db.put({
        _id: this.constantService.getConstantObject().docName_area,
        _rev: doc._rev,
        data: response.data
      });
    } catch (err) {
      // console.log(err);
    }


  }


}
