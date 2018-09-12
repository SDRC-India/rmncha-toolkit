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
 * This service will deal with indicator related work
 * @since 1.0.0
 * @author Subhadarshani
 */
@Injectable()
export class IndicatorServiceProvider {

  constructor(private pouchdbService: PouchdbServiceProvider, private constantService: ConstantServiceProvider) {

  }
  /**
   * This method will return the maximum slug indicator
   * @since 1.0.0
   * @author Subhadarshani
   */
  async getMaxSlugIndicator() {
    let db = this.pouchdbService.getDB()
    let indicators: IIndicator[] = (await db.get(this.constantService.getConstantObject().docName_indicator)).data
    indicators.sort((a: IIndicator, b: IIndicator) => {
      if (a.slugidindicator > b.slugidindicator) {
        return -1
      } else if (a.slugidindicator < b.slugidindicator) {
        return 1
      } else {
        return 0;
      }

    })

    return indicators[0].slugidindicator;

  }
  /**
   * This method will save indicator data in local storage
   * @since 1.0.0
   * @author Subhadarshani
   */
  async saveIndicator(response : ISyncResponse) {
    try {
      let db = this.pouchdbService.getDB()
      let doc = await db.get(this.constantService.getConstantObject().docName_indicator)    
      return await db.put({
        _id: this.constantService.getConstantObject().docName_indicator,
        _rev: doc._rev,
        data: response.data

      });
    } catch (err) {
      // console.log(err);
    }
  }
}
