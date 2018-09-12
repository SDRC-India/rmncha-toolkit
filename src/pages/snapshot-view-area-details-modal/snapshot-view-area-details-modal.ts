import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SnapshotViewAreaDetailsModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-snapshot-view-area-details-modal',
  templateUrl: 'snapshot-view-area-details-modal.html',
})
export class SnapshotViewAreaDetailsModalPage {

  areaList: IDBData[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.areaList = <IDBData[]>this.navParams.get('data');
    this.areaList.sort((a: IDBData, b: IDBData) => {
      if (a.value > b.value) {
        return -1
      } else if (a.value < b.value) {
        return 1
      } else {
        return 0;
      }
  
    })

  }

  close(){
    this.viewCtrl.dismiss()
  }

}
