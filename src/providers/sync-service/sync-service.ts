import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  UtilServiceProvider
} from '../util-service/util-service';
import {
  MessageServiceProvider
} from '../message-service/message-service';
import 'rxjs/add/operator/toPromise';
import {
  AlertController
} from 'ionic-angular';
import {
  ConstantServiceProvider
} from '../constant-service/constant-service';
import {
  PouchdbServiceProvider
} from '../pouchdb-service/pouchdb-service';
import {
  AreaServiceProvider
} from '../area-service/area-service';

import {
  AreaLevelServiceProvider
} from '../area-level-service/area-level-service';
import {
  DataServiceProvider
} from '../data-service/data-service';
import {
  IndicatorServiceProvider
} from '../indicator-service/indicator-service';
import {
  SourceServiceProvider
} from '../source-service/source-service';
import {
  SubgroupServiceProvider
} from '../subgroup-service/subgroup-service';
import {
  UnitServiceProvider
} from '../unit-service/unit-service';
import {
  SectorServiceProvider
} from '../sector-service/sector-service';

/**
 * This service will deal with sync codes
 * @since 1.0.0
 * @author Ratikanta 
 * @export
 * @class SyncServiceProvider
 */
@Injectable()
export class SyncServiceProvider {
  count: number = 0;
  errorMsg: string = ''
  config: IConfig
  constructor(
    public http: HttpClient,
    private utilService: UtilServiceProvider,
    private messageService: MessageServiceProvider,
    private alertController: AlertController,
    private pouchdbService: PouchdbServiceProvider,
    private constantServiceProvider: ConstantServiceProvider,
    private areaService: AreaServiceProvider,
    private areaLevelService: AreaLevelServiceProvider,
    private dataService: DataServiceProvider,
    private indicatorService: IndicatorServiceProvider,
    private sourceService: SourceServiceProvider,
    private subgroupService: SubgroupServiceProvider,
    private unitservice: UnitServiceProvider,
    private sectorService: SectorServiceProvider,
    private constantService: ConstantServiceProvider
  ) {}

  /**
   * This method will sync data with the server
   * @since 1.0.0
   * @author Ratikanta
   * @author Subhadarshani
   * @memberof SyncServiceProvider
   */
  async sync() {
    //check intenet connetion
    if (this.utilService.checkInternet()) {
      this.utilService.showLoader(this.messageService.messages.syncing)
      setTimeout(() => {
        //some task to complete
        this.utilService.stopLoader()
        this.errorMsg = this.messageService.messages.noDataToSync 
        this.showSyncReport()

      }, 2000);

    } else {
      //show no internet message
      this.utilService.showErrorToast(this.constantService.getConstantObject().noInternetMsg)
    }
    //   let db = await this.pouchdbService.getDB();
    //   //setting existing config value to config property
    //   let doc = await db.get(this.constantService.getConstantObject().docName_config)
    //   this.config = doc.data
    //   //api/sync logic goes here
    //   //area work
    //   let latestAreaSyncDate = doc.data.latestAreaSyncDate;
    //   let area_url = "/api/sync/area"
    //   let param = new HttpParams().set('timestamp', '' + latestAreaSyncDate);
    //   try {
    //     let areaTxn: ISyncResponse = < ISyncResponse > await this.http.get(area_url, {
    //       params: param
    //     }).toPromise();
    //     if (areaTxn.data.length > 0) {
    //       this.config.latestAreaSyncDate = areaTxn.lastModified
    //       await this.areaService.saveArea(areaTxn)
    //     }
    //     this.count++;
    //     this.checkSynCount();
    //   } catch (err) {
    //     this.count++;
    //     this.errorMsg = this.errorMsg + "Area sync failed"
    //     this.checkSynCount();
    //   }

    //   //arealevel work
    //   let latestAraeLevelSyncDate = doc.data.latestAreaLevelSyncData
    //   let arealevel_url = "/api/sync/arealevel"
    //   let arealevel_param = new HttpParams().set('timestamp', '' + latestAraeLevelSyncDate);
    //   try {
    //     let aeraLevelTxn = < ISyncResponse > await this.http.get(arealevel_url, {
    //       params: arealevel_param
    //     }).toPromise()
    //     if (aeraLevelTxn.data.length > 0) {
    //       this.config.latestAreaLevelSyncData = aeraLevelTxn.lastModified
    //       await this.areaLevelService.saveAreaLevel(aeraLevelTxn)
    //     }
    //     this.count++;
    //     this.checkSynCount();
    //   } catch (err) {
    //     this.count++;
    //     this.errorMsg = this.errorMsg + "Area level sync failed"
    //     this.checkSynCount();
    //   }

    //   //data work
    //   let latestDataSyncDate = doc.data.latestDataSyncDate
    //   let data_url = "/api/sync/data"
    //   let data_param = new HttpParams().set('timestamp', '' + latestDataSyncDate);
    //   try {
    //     let dataTxn: ISyncResponse = <ISyncResponse> await this.http.get(data_url, {
    //       params: data_param
    //     }).toPromise()

    //     //save data in local storage      
    //     if (dataTxn.data.length > 0) {
    //       this.config.latestDataSyncDate = dataTxn.lastModified
    //       await this.dataService.saveData(dataTxn);
    //     }
    //     this.count++;
    //     this.checkSynCount();
    //   } catch (err) {
    //     this.count++;
    //     this.errorMsg = this.errorMsg + "data sync failed"
    //     this.checkSynCount();
    //   }

    //  //Indicator work
    //   let latestIndicatorSyncDate = doc.data.latestIndicatorSyncDate
    //   let indicator_url = "/api/sync/indicator"
    //   let indicator_param = new HttpParams().set('timestamp', '' + latestIndicatorSyncDate);
    //   try {
    //     let indicatorTxn: ISyncResponse = <ISyncResponse> await this.http.get(indicator_url, {
    //       params: indicator_param
    //     }).toPromise()
    //     //save data in local storage    
    //     if (indicatorTxn.data.length > 0) {
    //       this.config.latestIndicatorSyncDate = indicatorTxn.lastModified
    //       await this.indicatorService.saveIndicator(indicatorTxn);       
    //     }
    //     this.count++;
    //     this.checkSynCount();
    //   } catch (err) {
    //     this.count++;
    //     this.errorMsg = this.errorMsg + "Indicator sync failed"
    //     this.checkSynCount();
    //   }

    //   //sector work
    //   let latestSectorSyncDate = doc.data.latestSectorSyncDate
    //   let sector_url = "/api/sync/sector"
    //   let sector_param = new HttpParams().set('timestamp', '' + latestSectorSyncDate);
    //   try {
    //     let sectorTxn: ISyncResponse = <ISyncResponse> await this.http.get(sector_url, {
    //       params: sector_param
    //     }).toPromise()
    //     if (sectorTxn.data.length > 0) {
    //       this.config.latestSectorSyncDate = sectorTxn.lastModified
    //       await this.sectorService.saveSector(sectorTxn);
    //     }
    //     this.count++;
    //     this.checkSynCount();
    //   } catch (err) {
    //     this.count++;
    //     this.errorMsg = this.errorMsg + "Sector sync failed"
    //     this.checkSynCount();
    //   }


    //   //source work
    //   let latestSourceSyncDate = doc.data.latestSourceSyncDate
    //   let source_url = "/api/sync/source"
    //   let source_param = new HttpParams().set('timestamp', '' + latestSourceSyncDate);
    //   try {
    //     let sourceTxn: ISyncResponse = < ISyncResponse > await this.http.get(source_url, {
    //       params: source_param
    //     }).toPromise()
    //     if (sourceTxn.data.length > 0) {
    //       this.config.latestSourceSyncDate = sourceTxn.lastModified
    //       await this.sourceService.saveSource(sourceTxn);
    //     }
    //     this.count++;
    //     this.checkSynCount();

    //   } catch (err) {
    //     this.count++;
    //     this.errorMsg = this.errorMsg + "Source sync failed"
    //     this.checkSynCount();
    //   }

    //    //subgroup work
    //   let latestSubgroupSyncDate = doc.data.latestSubgroupSyncDate
    //   let subgropu_url = "/api/sync/subgroup"
    //   let subgroup_param = new HttpParams().set('timestamp', '' + latestSubgroupSyncDate);
    //   try {
    //     let subgroupTxn: ISyncResponse = < ISyncResponse > await this.http.get(subgropu_url, {
    //       params: subgroup_param
    //     }).toPromise()
    //     if (subgroupTxn.data.length > 0) {
    //       this.config.latestSubgroupSyncDate = subgroupTxn.lastModified
    //       await this.subgroupService.saveSubgroup(subgroupTxn);
    //     }
    //     this.count++;
    //     this.checkSynCount();
    //   } catch (err) {
    //     this.count++;
    //     this.errorMsg = this.errorMsg + "Subgroup sync failed"
    //     this.checkSynCount();
    //   }


    //   //unit work
    //   let latestUnitSyncDate = doc.data.latestUnitSyncDate
    //   let unit_url = "/api/sync/unit"
    //   let unit_param = new HttpParams().set('timestamp', '' + latestUnitSyncDate);
    //   try {
    //     let unitTxn: ISyncResponse = < ISyncResponse > await this.http.get(unit_url, {
    //       params: unit_param
    //     }).toPromise()
    //     if (unitTxn.data.length > 0) {
    //       this.config.latestUnitSyncDate = unitTxn.lastModified
    //       await this.unitservice.saveUnit(unitTxn);
    //     }
    //     this.count++;
    //     this.checkSynCount();

    //   } catch (err) {
    //     this.count++;
    //     this.errorMsg = this.errorMsg + "Unit sync failed"
    //     this.checkSynCount();
    //   }

  }

  /**
   * This method will check thevsync count
   * @since 1.0.0
   * @author Subhadarshani
   * @memberof SyncServiceProvider
   */
  checkSynCount() {
    if (this.count == 8) {
      this.count = 0

      this.savelatestSyncDate();
      this.utilService.stopLoader()
      this.showSyncReport();
    }
  }
  /**
   * This method is going to save the latest sync date in config doc.
   * @author Subhadarshani
   * @since 0.0.1 * 
   * @private
   * @memberof SyncServiceProvider
   */
  async savelatestSyncDate() {
    //putting latest  source sync  date in config.
    //code start
    let db = this.pouchdbService.getDB()
    let doc = await db.get(this.constantService.getConstantObject().docName_config)
    await db.put({
      _id: this.constantService.getConstantObject().docName_config,
      _rev: doc._rev,
      data: this.config

    });
    //code end
  }
  /**
   * This method is going to show the sync report
   * @author Subhadarshani
   * @since 0.0.1 * 
   * @private
   * @memberof SyncServiceProvider
   */
  private showSyncReport() {
    if (this.errorMsg.length == 0) {
      this.errorMsg = this.messageService.messages.syncSyccess
    }
    let alert = this.alertController.create({
      title: 'Sync report',
      cssClass: 'syncModal',
      message: this.errorMsg,
      buttons: [{
        text: 'OK',
        handler: () => {

        }
      }]
    });
    alert.present();


  }


}
