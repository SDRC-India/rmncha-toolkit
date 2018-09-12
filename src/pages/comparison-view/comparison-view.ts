import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, Content } from 'ionic-angular';
import { ComparisonServiceProvider } from '../../providers/comparison-service/comparison-service'
import { ComparisonViewAreaFilterPipe } from '../../pipes/comparison-view-area-filter/comparison-view-area-filter'
import { IonicApp } from 'ionic-angular';

/**
 * 
 * @author Harsh Pratyush (harsh@sdrc.co.in)

 */

@IonicPage()
@Component({
  selector: 'page-comparison-view',
  templateUrl: 'comparison-view.html',

})
export class ComparisonViewPage {
  area: Area[] = [];
  areaLevel: IAreaLevel[] = [];

  area1Click = false;
  area2Click = false;
  area3Click = false;
  areaLevel1: IAreaLevel;
  areaLevel2: IAreaLevel;
  areaLevel3: IAreaLevel;
  state1: Area;
  state2: Area;
  state3: Area;
  district1: Area;
  district2: Area;
  district3: Area;
  country:Area;

  public unregisterBackButtonAction: any;
  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public comparisonServiceProvider: ComparisonServiceProvider, public alertCtrl: AlertController,
    private platform:Platform, private app: IonicApp) {
  }

  /**
   *  This method will be called when Area 1 button gets clicked
   */
  button1Click() {
    this.area1Click = !this.area1Click;
    this.area2Click = false;
    this.area3Click = false;
  }

  /**
  *  This method will be called when Area 2 button gets clicked
  */
  button2Click() {
    this.area1Click = false;
    this.area2Click = !this.area2Click;
    this.area3Click = false;
  }

  /**
  *  This method will be called when Area 3 button gets clicked
  */
  button3Click() {
    this.area1Click = false;
    this.area2Click = false
    this.area3Click = !this.area3Click;;
    setTimeout(() => {
      this.content.scrollToBottom(300);
    },300)
  }

  /**
  *  This method will be called when page gets loaded
  */
  ionViewDidLoad() {
  }

  ngOnInit() {
    this.getAreaLevel();
    this.getArea();
  }

  /**
  *  This method will return all the area level
  */
  async getAreaLevel() {
    this.areaLevel = await this.comparisonServiceProvider.getAreaLevel();
  }

  /**
  *  This method will return all the area
  */
  async getArea() {
    this.area = await this.comparisonServiceProvider.getArea();

  }

  /**
  *  This method will be called when user will click compare button
  */
  comapreArea() {
    let alert = this.alertCtrl.create({
      title: 'Error!',
      enableBackdropDismiss:false,
      buttons: [{
        text: 'Ok',
        handler: () => {
          // console.log('Ok clicked');
        }
      },
    ]
    });

   let selectedArea1:Area;
   let selectedArea2:Area;
   let selectedArea3:Area;

   selectedArea1= this.areaLevel1?(this.areaLevel1.isStateAvailable?
    (this.areaLevel1.isDistrictAvailable?this.district1:
   this.state1):ComparisonViewAreaFilterPipe.prototype.transform(this.area,this.areaLevel1,"GLO")[0]):null;

   selectedArea2= this.areaLevel2?(this.areaLevel2.isStateAvailable?
    (this.areaLevel2.isDistrictAvailable?this.district2:
   this.state2):ComparisonViewAreaFilterPipe.prototype.transform(this.area,this.areaLevel2,"GLO")[0]):null;

   selectedArea3= this.areaLevel3?(this.areaLevel3.isStateAvailable?
    (this.areaLevel3.isDistrictAvailable?this.district3:
   this.state3):ComparisonViewAreaFilterPipe.prototype.transform(this.area,this.areaLevel3,"GLO")[0]):null;

    if (this.areaLevel1 != null && this.areaLevel1.isStateAvailable && this.state1 == null) {
      alert.setSubTitle("Select Area 1 - State");
      alert.present();
    }
    else if (this.areaLevel1 != null && this.areaLevel1.isDistrictAvailable && this.district1 == null) {
      alert.setSubTitle("Select Area 1 - District");
      alert.present();
    }
    else if (this.areaLevel2 != null && this.areaLevel2.isStateAvailable && this.state2 == null) {
      alert.setSubTitle("Select Area 2 - State");
      alert.present();
    }

    else if (this.areaLevel2 != null && this.areaLevel2.isDistrictAvailable && this.district2 == null) {
      alert.setSubTitle("Select Area 2 - District");
      alert.present();
    }
    else if (this.areaLevel3 != null && this.areaLevel3.isStateAvailable && this.state3 == null) {
      alert.setSubTitle("Select Area 3 - State");
      alert.present();
    }

    else if (this.areaLevel3 != null && this.areaLevel3.isDistrictAvailable && this.district3 == null) {
      alert.setSubTitle("Select Area 3 - District");
      alert.present();
    }
    else if (this.calculate(this.areaLevel1, this.areaLevel2, this.areaLevel3) < 2) {
      alert.setSubTitle("Please select atleast two areas for comparison");
      alert.present();
    }

    else if(selectedArea1===selectedArea2 || selectedArea2===selectedArea3 || selectedArea1===selectedArea3)
    {
      alert.setSubTitle("Please select distinct areas for comparision");
      alert.present();
    }
    else {
      let selectedParentArea1;
      let selectedParentArea2;
      let selectedParentArea3;
      if(selectedArea1 && (selectedArea1.actAreaLevel.isDistrictAvailable || selectedArea1.actAreaLevel.isStateAvailable))
      {
        selectedParentArea1=this.area.filter(d=>d.code===selectedArea1.parentAreaCode)[0]
      }

      if(selectedArea2 &&( selectedArea2.actAreaLevel.isDistrictAvailable || selectedArea2.actAreaLevel.isStateAvailable))
      {
        selectedParentArea2=this.area.filter(d=>d.code===selectedArea2.parentAreaCode)[0]
      }


      if(selectedArea3 && (selectedArea3.actAreaLevel.isDistrictAvailable || selectedArea3.actAreaLevel.isStateAvailable))
      {
        selectedParentArea3=this.area.filter(d=>d.code===selectedArea3.parentAreaCode)[0]
      }

      this.navCtrl.push("ComparisonIndicatorViewPage",
      {'area1':selectedArea1,'area2':selectedArea2,'area3':selectedArea3,
      "pareantArea1":selectedParentArea1,"pareantArea2":selectedParentArea2,"pareantArea3":selectedParentArea3});
    }
  }

/**
 * This method will return the number of areas selected
 * @param object1
 * @param object2
 * @param object3
 */
  calculate(object1: any, object2: any, object3: any) {
    let count: number = 0;

    if (object1 != null) count++;
    if (object2 != null) count++;
    if (object3 != null) count++;

    return count;
  }

  /**
  *  This method will called when user will click reset button
  */
  reset() {
    let alert = this.alertCtrl.create({
      title: 'Reset',
      message: 'Are you sure you want to clear all the selections ?',
      enableBackdropDismiss:false,
      buttons: [
        {
          text: 'Cancel',
          handler: () => { }
        },
        {
          text: 'Ok',
          handler: () => {
            this.areaLevel1 = null;
            this.areaLevel2 = null;
            this.areaLevel3 = null;
            this.state1 = null;
            this.state2 = null;
            this.state3 = null;
            this.district1 = null;
            this.district2 = null;
            this.district3 = null;
          }
        },
      ]
    }
    )
    alert.present();
  }

  /**
   * Fired when entering a page, after it becomes the active page.
   * Register the hardware backbutton
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
  }

  /**
   * This method will initialize the hardware backbutton
   *
   * @author Jagat Bandhu
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
  }

  /**
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

  /**
   * This method will scroll down the content
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  scrollDown(){
    setTimeout(() => {
      this.content.scrollToBottom(300);
    },300)
  }
}
