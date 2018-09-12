import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AreaLevel } from './../../enums/areaLevel';
import { ComparisonServiceProvider } from './../../providers/comparison-service/comparison-service';
import { ConstantServiceProvider } from './../../providers/constant-service/constant-service';
import { MessageServiceProvider } from './../../providers/message-service/message-service';
import { UtilServiceProvider } from './../../providers/util-service/util-service';
import { NitiAyogServiceProvider } from './../../providers/niti-ayog-service/niti-ayog-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, IonicApp } from 'ionic-angular';
import { NgIf } from '../../../node_modules/@angular/common';



@IonicPage()
@Component({
  selector: 'page-niti-ayog-indicator-view',
  templateUrl: 'niti-ayog-indicator-view.html',
})
export class NitiAyogIndicatorViewPage {

  selectedArea : Area;
  nitiAyogData : NitiAyogData[];
  height:any
  unregisterBackButtonAction:any;
  searchQuery:String=''

  sectors:String[]=[]

  sectorsSet:Set<String> = new Set();

  completeAreaList : Area[] = []

  areaList :Area[]=[]

  parentIds:Set<string> =new Set();

  state :Area;
  
  district : Area;


  areaLevel : IAreaLevel;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private nitiAyogServiceProvider:NitiAyogServiceProvider,private platform:Platform,
    private alertCtrl: AlertController,
    private utilService: UtilServiceProvider,
   private messageService: MessageServiceProvider,
    private constantService: ConstantServiceProvider,public comparisonServiceProvider: ComparisonServiceProvider
    ,private app:IonicApp,private screenOrientation:ScreenOrientation) {
      this.screenOrientation.onChange().subscribe(
        () => {
          setTimeout(() => {
            this.height=this.platform.height()-120;
          },150);
        }
     );
      }

  ionViewDidLoad() {
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

  ngOnInit()
  {

    this.getAreaLevel();
    this.getArea();
    this.height=this.platform.height()-120;
  }

  async getNitiAyogData()
  {
    this.nitiAyogData=await this.nitiAyogServiceProvider.getNitiAyogDistrictData(this.selectedArea);
    this.nitiAyogData.forEach(element => {
      this.sectorsSet.add(element.indicator.recSector.sectorName)
    });
    this.sectors=Array.from(this.sectorsSet);

  }

  async getArea() {
    this.completeAreaList = await this.comparisonServiceProvider.getArea()

    this.areaList=this.completeAreaList.filter(d=>d.levels.indexOf(AreaLevel.NITIAYOG)>-1);

    this.areaList.forEach(element => {
      this.parentIds.add(element.parentAreaCode);
    });


    let states=this.completeAreaList.filter(d=>this.parentIds.has(d.code));

    states.forEach(e=>{this.areaList.push(e)})

    this.areaList.sort((a: Area, b: Area) => {
      if (a.areaname < b.areaname) {
        return -1
      } else if (a.areaname > b.areaname) {
        return 1
      } else {
        return 0;
      }

    })
  }

  async getAreaLevel()
  {
      let areaLevels=await this.comparisonServiceProvider.getAreaLevel();

      this.areaLevel=areaLevels.filter(d=>d.level==AreaLevel.NITIAYOG)[0];
   
     
    }

    districtSelect()
    {

    if(this.district)
    {
      this.selectedArea=this.district;
      this.selectedArea.concatenedName=this.state.areaname;
      this.nitiAyogData=null;
      this.getNitiAyogData();
    }
    }


  getNitiAyogVisualizationData(nitiAyogData:NitiAyogData)
  {
    let alert = this.alertCtrl.create({
      enableBackdropDismiss:false,
    });

    if(nitiAyogData.district)
    {
   
        this.navCtrl.push("NitiAyogVisualizationViewPage",{"selectedArea":this.selectedArea,
        "selectedIndicator":nitiAyogData.indicator,"isSameSource":true,"nitiAyogData":nitiAyogData})

    }

    else{
      alert.setTitle('Error');
      alert.setMessage('Data not reported for this indicator');
      alert.addButton('OK');
      alert.present();
    }
  }

      /**
   * This method will help in sharing the screenshot
   * @since 1.0.0
   * @author Harsh Pratyush
   * 
   */
  share(){
    this.utilService.share(this.messageService.messages.nitiAyogSharingSubject,
       this.messageService.messages.nitiAyogSharingMessage
    ,this.constantService.getConstantObject().domIdComparisionVisulaization)
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
      if(this.nitiAyogServiceProvider.loadingStatus)
{
      const overlayView = this.app._overlayPortal._views[0];
      if (overlayView && overlayView.dismiss) {
        overlayView.dismiss();
      } 
      else
        this.customHandleBackButton();
    }
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
    this.navCtrl.setRoot('HomePage');
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
