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
 * This service will deal with source related work
 * @since 1.0.0
 * @author Subhadarshani
 */
@Injectable()
export class SourceServiceProvider {

  constructor(private pouchdbService: PouchdbServiceProvider, private constantService: ConstantServiceProvider) {

  }
  /**
   * This method will return the maximum slugidsource
   * @since 1.0.0
   * @author Subhadarshani
   */
  async getMaxSlugIdSource() {
    let db = this.pouchdbService.getDB()
    let source: ISource[] = (await db.get(this.constantService.getConstantObject().docName_source)).data
    source.sort((a: ISource, b: ISource) => {
      if (a.slugidsource > b.slugidsource) {
        return -1
      } else if (a.slugidsource < b.slugidsource) {
        return 1
      } else {
        return 0;
      }

    })

    return source[0].slugidsource;

  }
  /**
   * This method will save source data in local storage
   * @since 1.0.0
   * @author Subhadarshani
   */
  async saveSource(source: ISyncResponse) {
    try {
      let db = this.pouchdbService.getDB()
      let doc = await db.get(this.constantService.getConstantObject().docName_source)
      //    let oldsourceData: ISource[] = doc.data
      //  Array.prototype.push.apply(oldsourceData, source)
      
      return await db.put({
        _id: this.constantService.getConstantObject().docName_source,
        _rev: doc._rev,
        data: source.data
      });
    } catch (err) {
      console.log(err);
    }
  }
}
