import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { ComparisonServiceProvider } from '../../providers/comparison-service/comparison-service'
import { UtilServiceProvider } from '../../providers/util-service/util-service';
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { ConstantServiceProvider } from '../../providers/constant-service/constant-service';

/**
 * Generated class for the ComparisonIndicatorViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comparison-indicator-view',
  templateUrl: 'comparison-indicator-view.html',
})
export class ComparisonIndicatorViewPage {

  selectedArea1: Area;
  selectedArea2: Area;
  selectedArea3: Area;

  selectedParentArea1: Area;
  selectedParentArea2: Area;
  selectedParentArea3: Area;

  selectedAreas: string[] = [];
  areasArray: string[] = [];
  height: any;

  area1Same: boolean = false;
  area2Same: boolean = false;
  area3Same: boolean = false;


  comparisionData: any[];

  searchQuery:string='';
  public unregisterBackButtonAction: any;

  sectors:String[]=[]

  sectorsSet:Set<String> = new Set();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public comparsionServiceProvider: ComparisonServiceProvider,
    private utilService: UtilServiceProvider,
    private messageService: MessageServiceProvider,
    public alertCtrl: AlertController, private constantService: ConstantServiceProvider,
     private platform: Platform,private screenOrientation:ScreenOrientation) {
      this.screenOrientation.onChange().subscribe(
        () => {
          setTimeout(() => {
            this.height=this.platform.height()-120;
          },150);
        }
     );
      }

        /**
   *
   *
   * @memberof MapViewChartComponent
   */
  ngOnDestroy()
  {
    this.screenOrientation.onChange().subscribe().unsubscribe();
  }

  ngOnInit() {
    this.height = this.platform.height() - 120;
    this.selectedArea1 = this.navParams.get('area1');
    this.selectedArea2 = this.navParams.get('area2');
    this.selectedArea3 = this.navParams.get('area3');
    this.selectedParentArea1 = this.navParams.get('pareantArea1');
    this.selectedParentArea2 = this.navParams.get('pareantArea2');
    this.selectedParentArea3 = this.navParams.get('pareantArea3');

    if (this.selectedArea1 && this.selectedParentArea1 &&
      ((this.selectedArea2 && (this.selectedArea2.areaname === this.selectedArea1.areaname)) ||
        (this.selectedArea3 && (this.selectedArea3.areaname === this.selectedArea1.areaname)))) {
      this.area1Same = true;
    }


    if (this.selectedArea2 && this.selectedParentArea2 &&
      ((this.selectedArea3 && (this.selectedArea3.areaname === this.selectedArea2.areaname)) ||
        (this.selectedArea1 && (this.selectedArea2.areaname === this.selectedArea1.areaname)))) {
      this.area2Same = true;
    }


    if (this.selectedArea3 && this.selectedParentArea3 &&
      ((this.selectedArea2 && (this.selectedArea3.areaname === this.selectedArea2.areaname)) ||
        (this.selectedArea1 && (this.selectedArea3.areaname === this.selectedArea1.areaname)))) {
      this.area3Same = true;
    }




    this.selectedArea1 ? (this.selectedAreas.push(this.selectedArea1.code), this.areasArray.push(this.selectedArea1.code)) : this.selectedAreas.push('')
    this.selectedArea2 ? (this.selectedAreas.push(this.selectedArea2.code), this.areasArray.push(this.selectedArea2.code)) : this.selectedAreas.push('')
    this.selectedArea3 ? (this.selectedAreas.push(this.selectedArea3.code), this.areasArray.push(this.selectedArea3.code)) : this.selectedAreas.push('')

    this.getComparisionData(this.selectedAreas);
  }
  ionViewDidLoad() {
  }

  async getComparisionData(selectedAreas: string[]) {

    this.comparisionData = await this.comparsionServiceProvider.getAreaComparision(selectedAreas);
    this.comparisionData.forEach(element => {
      this.sectorsSet.add(element.theme)
    });
    this.sectors=Array.from(this.sectorsSet);

  }

  /**
   * This method will help in sharing the screenshot
   * @since 1.0.0
   * @author Harsh Pratyush
   * 
   * @memberof ComparisonIndicatorViewPage
   */
  share() {
    //alert("Under construction")
    this.utilService.share(this.messageService.messages.comparsionViewSharingSubject, this.messageService.messages.comparsionViewSharingMessage, this.constantService.getConstantObject().domIdComparisionIndicatorView)
  }


  viewIndicatorData(data: any) {
    let sources: Set<String>;

    sources = new Set();
    this.selectedArea1 ? sources.add(data.source1) : '';
    this.selectedArea2 ? sources.add(data.source2) : '';
    this.selectedArea3 ? sources.add(data.source3) : '';

    // to be modified
    if (sources.size == 1) {
      this.navCtrl.push("ComparisonVisualizationViewPage",
        {
          'area1': this.selectedArea1, 'area2': this.selectedArea2,
          'area3': this.selectedArea3, 'indicator': data._id, 'sameSource': true,
          'indicatorName': data.indicator, 'unit': data.unit,
          "pareantArea1": this.selectedParentArea1, "pareantArea2": this.selectedParentArea2,
          "pareantArea3": this.selectedParentArea3, "area1Same": this.area1Same
          , "area2Same": this.area2Same
          , "area3Same": this.area3Same,
          "area1Data":data.area1Data,"area2Data":data.area2Data,"area3Data":data.area3Data
        });
    }
    else {
      let alert = this.alertCtrl.create({
        message: 'Data are from various sources, Click "Ok" for the tabular representation of the data.',
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'Cancel',
            handler: () => { }
          },
          {
            text: 'Ok',
            handler: () => {
              this.navCtrl.push("ComparisonVisualizationViewPage",
                {
                  'area1': this.selectedArea1, 'area2': this.selectedArea2, 'area3': this.selectedArea3, 'indicator': data._id,
                  'sameSource': false, 'indicatorName': data.indicator, 'unit': data.unit
                  , "pareantArea1": this.selectedParentArea1, "pareantArea2": this.selectedParentArea2,
                  "pareantArea3": this.selectedParentArea3, "area1Same": this.area1Same
                  , "area2Same": this.area2Same
                  , "area3Same": this.area3Same,
                  "area1Data":data.area1Data,"area2Data":data.area2Data,"area3Data":data.area3Data
                });
            }
          },
        ]
      }
      )
      alert.present();
    }
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
   * It will check the status of loadingStatus variable
   * if it is true then customHandleBackButton() will call
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  public initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
      if(this.comparsionServiceProvider.loadingStatus)
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
      this.navCtrl.pop()
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

}
