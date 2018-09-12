import { FileOpener } from '@ionic-native/file-opener';
import { ConstantServiceProvider } from './../../providers/constant-service/constant-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { File} from '@ionic-native/file';

/**
 * This page is used for Home page
 *
 * @export
 * @class HomePage
 * @author Jagat Bandhu
 * @since 1.0.0
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  customViewTypeSelection: CustomViewTypeSelection;



  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertController :AlertController,
    public fileOpener:FileOpener
    ,private constantServiceProvider:ConstantServiceProvider,
  private file:File,private platform:Platform) {
  }

  /**
   * This method will navigate the user to the selected page.
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  goToSelectedView(viewName: string) {
    this.navCtrl.setRoot(viewName)
  }

  /**
   * This method will navigate the user to AboutUsPage
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  goToAboutUs() {
    this.navCtrl.setRoot('AboutUsPage')
  }

  private customTypeSelection(areaWise, indicatorWise) {

    this.customViewTypeSelection = {
      areaWise: areaWise, indicatorWise: indicatorWise
    }

    if(this.customViewTypeSelection.areaWise)
    {
      this.navCtrl.setRoot("GeographicProfileViewPage");
    }
    else
    {
      this.navCtrl.setRoot("ThematicProfileViewPage")
    }
  }

  underConstruction()
  {
   let  alert = this.alertController.create({
      enableBackdropDismiss:false,
      buttons: ['OK']
    });
    alert.setMessage("Work in progress");
   alert.present();
  }

  open()
  {
    if(this.platform.is('cordova'))
    {  
    
      this.fileOpener.open(this.file.dataDirectory+this.constantServiceProvider.getConstantObject().userGuidePath, 'application/pdf')
  .then(() => console.log('File is opened'))
  .catch(e => console.log('Error opening file', e));
        }
        else
        {
          window.open('assets/doc/'+this.constantServiceProvider.getConstantObject().userGuidePath)

        } 

  }
}
