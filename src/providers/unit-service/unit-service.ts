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


@Injectable()
export class UnitServiceProvider {

  constructor(private pouchdbService: PouchdbServiceProvider, private constantService: ConstantServiceProvider) {

  }
  /**
   * This method will return the maximum slugidunit
   * @since 1.0.0
   * @author Subhadarshani
   */
  async getMaxSlugIdUnit() {
    let db = this.pouchdbService.getDB()
    let units: IUnit[] = (await db.get(this.constantService.getConstantObject().docName_unit)).data
    units.sort((a: IUnit, b: IUnit) => {
      if (a.slugidunit > b.slugidunit) {
        return -1
      } else if (a.slugidunit < b.slugidunit) {
        return 1
      } else {
        return 0;
      }

    })

    return units[0].slugidunit;

  }
  /**
   * This method will save unit data in local storage
   * @since 1.0.0
   * @author Subhadarshani
   */
  async saveUnit(units: ISyncResponse) {
    try {
      let db = this.pouchdbService.getDB()
      let doc = await db.get(this.constantService.getConstantObject().docName_unit)     
      return await db.put({
        _id: this.constantService.getConstantObject().docName_unit,
        _rev: doc._rev,
        data: units.data

      });
    } catch (err) {
      console.log(err);
    }
  }
}
