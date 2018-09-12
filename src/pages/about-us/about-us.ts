import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, IonicApp } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {

  unregisterBackButtonAction:any;

  constructor(public navCtrl: NavController,private platform:Platform , private app: IonicApp)
  {

  }

  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
  }

    /**
   * This method will initialize the hardware backbutton
   * It will check the status of loadingStatus variable
   * if it is true then customHandleBackButton() will call
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  public initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
      // if(this.comparsionServiceProvider)
        this.customHandleBackButton();
    }, 10);
  }

  /**
   * This method will show a confirmation popup to exit the app, when user click on the hardware back button
   * in the home page
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  private customHandleBackButton(): void {
     

      const overlayView = this.app._overlayPortal._views[0];
      if (overlayView && overlayView.dismiss) {
        overlayView.dismiss();
      } else {
        this.navCtrl.setRoot('HomePage');
      }
  }  /**
  * Fired when you leave a page, before it stops being the active one
  * Unregister the hardware backbutton
  *
  * @author Jagat Bandhu
  * @since 1.0.0
  */
 ionViewWillLeave() {
   // Unregister the custom back button action for this page
   this.unregisterBackButtonAction && this.unregisterBackButtonAction();
 }


}
