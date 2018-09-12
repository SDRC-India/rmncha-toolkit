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
 * This service will deal with subgroup related work
 * @since 1.0.0
 * @author Subhadarshani
 */
@Injectable()
export class SubgroupServiceProvider {

  constructor(private pouchdbService: PouchdbServiceProvider, private constantService: ConstantServiceProvider) {

  }
  /**
   * This method will return the maximum slugidsubgroup
   * @since 1.0.0
   * @author Subhadarshani
   */
  async getMaxSlugIdSubGroup() {
    let db = this.pouchdbService.getDB()
    let subgroups: ISubgroup[] = (await db.get(this.constantService.getConstantObject().docName_subgroup)).data
    subgroups.sort((a: ISubgroup, b: ISubgroup) => {
      if (a.slugidsubgroup > b.slugidsubgroup) {
        return -1
      } else if (a.slugidsubgroup < b.slugidsubgroup) {
        return 1
      } else {
        return 0;
      }

    })

    return subgroups[0].slugidsubgroup;

  }
  /**
   * This method will save subgroup data in local storage
   * @since 1.0.0
   * @author Subhadarshani
   */
  async saveSubgroup(subgroups: ISyncResponse) {
    try {
      let db = this.pouchdbService.getDB()
      let doc = await db.get(this.constantService.getConstantObject().docName_subgroup)     
      return await db.put({
        _id: this.constantService.getConstantObject().docName_subgroup,
        _rev: doc._rev,
        data: subgroups.data

      });
    } catch (err) {
      console.log(err);
    }
  }
}
