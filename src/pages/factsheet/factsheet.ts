import { FactsheetServiceProvider } from '../../providers/factsheet/factsheet-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, IonicApp } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-factsheet',
  templateUrl: 'factsheet.html',
})
export class FactsheetPage {

  factsheetData : FactsheetData[]=[];
  selectedSource:FactsheetData;
  open:boolean=false;

  unregisterBackButtonAction:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private platform:Platform,
  private app:IonicApp,private factsheetProvider:FactsheetServiceProvider) {
  }

  ionViewDidLoad() {
  }

  ngOnInit()
  {
    this.getFactsheetData();
        
  }

  async getFactsheetData()
  {
   this.factsheetData=await this.factsheetProvider.getFactSheetData();
  }

  selectSource(source)
  {
    if(this.selectedSource!=source)
    {
    this.selectedSource=source;
    this.open=true;
    }
    else
    this.open=!this.open;
  }

  openFactsheet(round:SourceFactSheet)
  {
    window.open(round.url, '_system');
  }

    /**
   * Fired when entering a page, after it becomes the active page.
   * Register the hardware backbutton
   *
   * @author harsh Pratyush
   * @since 1.0.0
   */
  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
  }

  /**
   * This method will initialize the hardware backbutton
   *
   * @author harsh Pratyush
   * @since 1.0.0
   */
  public initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
        this.customHandleBackButton();
    }, 10);
  }

  /**
   * This method will show a confirmation popup to exit the app, when user click on the hardware back button
   * in the home page
   *
   * @author harsh Pratyush
   * @since 1.0.0
   */
  private customHandleBackButton(): void {
    const overlayView = this.app._overlayPortal._views[0];
      if (overlayView && overlayView.dismiss) {
        overlayView.dismiss();
      } else {
        this.navCtrl.setRoot('HomePage');
      }
  }

  /**
   * Fired when you leave a page, before it stops being the active one
   * Unregister the hardware backbutton
   *
   * @author harsh Pratyush
   * @since 1.0.0
   */
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }
}
