import { ComparisonViewAreaFilterPipe } from './../../pipes/comparison-view-area-filter/comparison-view-area-filter';
import { AreaLevel } from './../../enums/areaLevel';
import { CustomViewServiceProvider } from './../../providers/custom-view-service/custom-view-service';
import { ComparisonServiceProvider } from './../../providers/comparison-service/comparison-service';
import { MessageServiceProvider } from './../../providers/message-service/message-service';
import { UtilServiceProvider } from './../../providers/util-service/util-service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, IonicApp, Platform, Slides } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-geographic-profile-view',
  templateUrl: 'geographic-profile-view.html',
})
export class GeographicProfileViewPage {


  @ViewChild('pageSlider') pageSlider: Slides;
  
  area: Area[] = [];
  areaLevels: IAreaLevel[] = [];

  areaLevel: IAreaLevel;
  state: Area;
  district: Area;

  selectedArea: IArea

  customViewTypeSelection : CustomViewTypeSelection ;

  public unregisterBackButtonAction: any;

  indicatorList: any[];

  themeList: ISector[];

  selectedIndicators:Set<IIndicator>=new Set();;

  selectOptions: IIndicator[];

  selectedTheme: ISector;

  totalSelectedIndicators: IIndicator[] = [];

  selectedThemeIndicator : Map<String,Set<String>> =new Map();

  index: any = 0;

  searchIndicators:String='';

  constructor(public navCtrl: NavController, public navParams: NavParams ,  private comparsionServiceProvider: ComparisonServiceProvider,
    public alertCtrl: AlertController, private app: IonicApp, private platform: Platform
    ,private utilService:UtilServiceProvider,
    private messageService: MessageServiceProvider,public customViewServiceProvider: CustomViewServiceProvider) {
  }

  ionViewDidLoad() {
  }

  selectTab(index) {
    this.pageSlider.slideTo(index);
    this.state=null;
    this.district=null;
     }

     changeWillSlide($event) {
      this.index = $event._snapIndex;
      this.areaLevel=this.areaLevels[this.index];
      this.state=null;
      this.district=null;
     }

  ngOnInit()
  {
    this.customViewTypeSelection = {
      areaWise: true, indicatorWise: false
    }

    this.getAreaLevel();
    this.getArea();
    this.getSector();
    this.getIndicators();
  }

  
     /**
  *  This method will return all the area level
  */
 async getAreaLevel() {
  let areaLevelData = await this.comparsionServiceProvider.getAreaLevel();
  areaLevelData.forEach(element => {
    if(element.slugidarealevel!=AreaLevel.NITIAYOG)
    {
      this.areaLevels.push(element);
    }
  });

  this.areaLevel=this.areaLevels[0];
}

/**
*  This method will return all the area
*/
async getArea() {
  this.area = await this.comparsionServiceProvider.getArea();
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

  async getSector() {
    this.themeList = await this.customViewServiceProvider.getSector();
  }


  async getIndicators() {
    this.indicatorList = await this.customViewServiceProvider.getIndicators();
  }

  selectAreaLevel(level)
  {
    this.areaLevel=level
    this.state=null;
    this.district=null;
  }

  selectSector(theme)
  {
    if(this.selectedTheme!=theme)
    this.selectedTheme=theme;
    else
    this.selectedTheme=null;
  }

  selectIndicators()
  {
    this.indicatorList.forEach(element => {
      if(element.checked)
      {
        if(!this.selectedIndicators.has(element))
          this.selectedIndicators.add(element)
      }
      else{
        if(this.selectedIndicators.has(element))
        {
          this.selectedIndicators.delete(element);
        }
      }
    });

    this.selectedThemeIndicator = new Map();
    this.selectedIndicators.forEach(element =>{
      if(this.selectedThemeIndicator.has(element.sc[0].sectorName))
      {
        this.selectedThemeIndicator.get(element.sc[0].sectorName).add(element.iName);
      }
      else
      {
        let indicators :Set<String> =new Set();
        indicators.add(element.iName);
        this.selectedThemeIndicator.set(element.sc[0].sectorName,indicators);
      }
    });
  }


  getKeys(map){
    return Array.from(map.keys());
  }

  getValues(key)
  {
    return Array.from(this.selectedThemeIndicator.get(key));
  }

  trackByFn(index, indicator:IIndicator) {
    return indicator.slugidindicator;
  }


  maximumSelectionWarning(indicator)
  {
    if(this.selectedIndicators.has(indicator))
    {
      return;
    }
    for(let i=0;i<this.indicatorList.length;i++)
    {
      if(indicator.slugidindicator==this.indicatorList[i].slugidindicator)
      {
        this.indicatorList[i].checked=false;
      }
    }

    let alertCtrl =this.alertCtrl.create({
      title: 'Error!',
     message: 'Maximum 10 Indicators can be selected',
     enableBackdropDismiss: false,
     buttons: [
       {
         text: 'Ok'
       }]
     })
     alertCtrl.present();
  }

  reset()
  {
    let alert = this.alertCtrl.create({
      title: 'Warning',
      message: 'This will discard all changes made. Do you want to continue ?',
      enableBackdropDismiss:false,
      buttons: [
        {
          text: 'No',
          handler: () => { }
        },
        {
          text: 'Yes',
          handler: () => {
            this.selectedTheme=null;
            this.selectedIndicators=new Set();
            this.selectedThemeIndicator = new Map();
             this.state=null;
             this.district=null;
            this.selectedArea=null;
            for(let i=0;i<this.indicatorList.length;i++)
            {
                this.indicatorList[i].checked=false;
            }
          }
        },
      ]
    }
    )
    if(this.selectedIndicators.size||this.state) alert.present();

  }

  next()
  {
    let alert = this.alertCtrl.create({
      title: 'Error!',
      enableBackdropDismiss:false,
      buttons: ['OK']
    });

    this.selectedArea= <IArea>(this.areaLevel?(this.areaLevel.isStateAvailable?
      (this.areaLevel.isDistrictAvailable?this.district:
     this.state):ComparisonViewAreaFilterPipe.prototype.transform(this.area,this.areaLevel,"GLO")[0]):null);

     if(this.areaLevel.isStateAvailable&&!this.state){
      alert.setSubTitle("Select State");
      alert.present();
    }
    else if(this.areaLevel.isDistrictAvailable&&!this.district)
    {
      alert.setSubTitle("Select District");
      alert.present();
    }
    else if(this.selectedIndicators.size<1)
    {
      alert.setSubTitle("Select atleast one indicator");
      alert.present();
    }

    else{

      let nonKPIIndicator :IIndicator[]=Array.from(this.selectedIndicators).filter(d=>!(d.kpi||d.nitiaayog||d.thematicKpi||d.hmis||d.ssv))

      let kPIIndicator :IIndicator[]=Array.from(this.selectedIndicators).filter(d=>(d.kpi||d.nitiaayog||d.thematicKpi||d.hmis||d.ssv))

        if(((this.utilService.checkInternet()&&nonKPIIndicator.length)||nonKPIIndicator.length==0))
        this.navCtrl.push("CustomViewDataTablePage",{"area":this.selectedArea,"customViewTypeSelection":this.customViewTypeSelection,"indicators":Array.from(this.selectedIndicators)});
        else{

          if(nonKPIIndicator.length<this.selectedIndicators.size)
          {

            let warningAlert = this.alertCtrl.create({
              title: 'Warning',
              enableBackdropDismiss:false,
              message:this.messageService.messages.someOfflineIndicator,
              buttons: [
                {
                  text: 'No',
                  handler: () => { }
                },
                {
                  text: 'Yes',
                  handler: () => {
                    this.navCtrl.push("CustomViewDataTablePage",{"area":this.selectedArea,"customViewTypeSelection":this.customViewTypeSelection,"indicators":kPIIndicator});
                  }
                },
              ]
            });
            warningAlert.present();
          }
          else{
            alert.setSubTitle(this.messageService.messages.noDataConnectionForIndicator);
            alert.present();
          }
        }
      }
  }
}
