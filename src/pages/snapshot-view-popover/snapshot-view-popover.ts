import { Component } from '@angular/core';
import { ViewController, IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({  
  templateUrl: 'snapshot-view-popover.html',
})
export class SnapshotViewPopoverPage {

  disabledView:string[]
  isMapDisabled: boolean = false
  isBarDisabled: boolean = false
  isTableDisabled: boolean = false
  isLineDisabled: boolean = false
  constructor(public viewCtrl: ViewController, private params: NavParams) {

    this.disabledView = this.params.get('data')

    this.disabledView.forEach(view=>{
      if(view === 'map'){
        this.isMapDisabled = true
      }else if(view === 'bar'){
        this.isBarDisabled = true
      }else if(view === 'table'){
        this.isTableDisabled = true
      }else if(view === 'line'){
        this.isLineDisabled = true
      }

    })

  }

  close(map: number){
    this.viewCtrl.dismiss(map)
  }


}
