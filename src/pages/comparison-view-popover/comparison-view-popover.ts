import { Component } from '@angular/core';
import { IonicPage, ViewController,NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-comparison-view-popover',
  templateUrl: 'comparison-view-popover.html',
})
export class ComparisonViewPopoverPage {

  comparisionViewSelection:ComparisionViewSelection;

  constructor(public viewCtrl: ViewController, private params: NavParams) {
    this.comparisionViewSelection = this.params.get('data')

  }

  ionViewDidLoad() {
  }

  close(selectedPop: number){
    this.viewCtrl.dismiss(selectedPop)
  }

}
