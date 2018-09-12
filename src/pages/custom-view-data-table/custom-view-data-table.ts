import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, Select } from 'ionic-angular';
import { CustomViewServiceProvider } from '../../providers/custom-view-service/custom-view-service';
import { ConstantServiceProvider } from '../../providers/constant-service/constant-service';
import { UtilServiceProvider } from '../../providers/util-service/util-service';
import { MessageServiceProvider } from '../../providers/message-service/message-service';



@IonicPage()
@Component({
  selector: 'page-custom-view-data-table',
  templateUrl: 'custom-view-data-table.html',
})
export class CustomViewDataTablePage {

  selectionNumber:number;
  public unregisterBackButtonAction: any;
  constructor(public navCtrl: NavController, public navParams: NavParams ,
     private customViewServiceProvider : CustomViewServiceProvider,private platform:Platform
    ,private constantService:ConstantServiceProvider,private utilService: UtilServiceProvider,
    private messageService: MessageServiceProvider,private alertController:AlertController) {
  }

  searchQuery:string='';

  selectedArea: IArea

  selctedAreas : IArea[];

  selectedIndicator : IIndicator;

  customViewTypeSelection: CustomViewTypeSelection;

  indicatorList: IIndicator[];

   geographyWiseComparision :CustomViewTableData;

   height: any;

   selectedSource : String;

   selectedSourceObject:ISource

   @ViewChild('sourceSelect') sourceSelect: Select;


   sectors:ISector[]=[];

   sectorsMap:Map<number,ISector>=new Map();

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad CustomViewDataTablePage');
  // }

  ngOnInit() {
    

    this.height = this.platform.height() - 120;
    this.customViewTypeSelection = this.navParams.get("customViewTypeSelection")
    if (this.customViewTypeSelection.areaWise)
    {
      this.selectedArea = this.navParams.get("area");
      this.indicatorList=this.navParams.get("indicators");
      let indicators:Number[]=[];

    let maternal: IIndicator[] = this.indicatorList.filter(d => d.recSector.sectorName === this.constantService.getConstantObject().themeName_maternal).sort((a: IIndicator, b: IIndicator) => {
      if (a.iName > b.iName) {
        return 1
      } else if (a.iName < b.iName) {
        return -1
      } else {
        return 0;
      }

    })

    let reproductive: IIndicator[] = this.indicatorList.filter(d => d.recSector.sectorName === this.constantService.getConstantObject().themeName_reproductive).sort((a: IIndicator, b: IIndicator) => {
      if (a.iName > b.iName) {
        return 1
      } else if (a.iName < b.iName) {
        return -1
      } else {
        return 0;
      }

    })
    let childcare: IIndicator[] = this.indicatorList.filter(d => d.recSector.sectorName === this.constantService.getConstantObject().themeName_childcare).sort((a: IIndicator, b: IIndicator) => {
      if (a.iName > b.iName) {
        return 1
      } else if (a.iName < b.iName) {
        return -1
      } else {
        return 0;
      }

    })
    let neonatal: IIndicator[] = this.indicatorList.filter(d => d.recSector.sectorName === this.constantService.getConstantObject().themeName_neonatal).sort((a: IIndicator, b: IIndicator) => {
      if (a.iName > b.iName) {
        return 1
      } else if (a.iName < b.iName) {
        return -1
      } else {
        return 0;
      }

    })

    let infra: IIndicator[] = this.indicatorList.filter(d => d.recSector.sectorName === this.constantService.getConstantObject().health_infrastructure).sort((a: IIndicator, b: IIndicator) => {
      if (a.iName > b.iName) {
        return 1
      } else if (a.iName < b.iName) {
        return -1
      } else {
        return 0;
      }

    })

    let hr: IIndicator[] = this.indicatorList.filter(d => d.recSector.sectorName === this.constantService.getConstantObject().human_resource).sort((a: IIndicator, b: IIndicator) => {
      if (a.iName > b.iName) {
        return 1
      } else if (a.iName < b.iName) {
        return -1
      } else {
        return 0;
      }

    })

    let adlosecent: IIndicator[] = this.indicatorList.filter(d => d.recSector.sectorName === this.constantService.getConstantObject().adolescent).sort((a: IIndicator, b: IIndicator) => {
      if (a.iName > b.iName) {
        return 1
      } else if (a.iName < b.iName) {
        return -1
      } else {
        return 0;
      }

    })

    let demography: IIndicator[] = this.indicatorList.filter(d => d.recSector.sectorName === this.constantService.getConstantObject().demography).sort((a: IIndicator, b: IIndicator) => {
      if (a.iName > b.iName) {
        return 1
      } else if (a.iName < b.iName) {
        return -1
      } else {
        return 0;
      }

    })



    this.indicatorList = []

    Array.prototype.push.apply(this.indicatorList, reproductive);
    Array.prototype.push.apply(this.indicatorList, maternal);
    Array.prototype.push.apply(this.indicatorList, neonatal);
    Array.prototype.push.apply(this.indicatorList, childcare);
    Array.prototype.push.apply(this.indicatorList, adlosecent);
    Array.prototype.push.apply(this.indicatorList, demography);
    Array.prototype.push.apply(this.indicatorList, hr);
    Array.prototype.push.apply(this.indicatorList, infra);




    let nonKPIIndicator :IIndicator[]=this.indicatorList.filter(d=>!(d.kpi||d.nitiaayog||d.thematicKpi||d.hmis||d.ssv))
    let kPIIndicator :IIndicator[]=this.indicatorList.filter(d=>(d.kpi||d.nitiaayog||d.thematicKpi||d.hmis||d.ssv))

  kPIIndicator.forEach(element=>{
      indicators.push(element.slugidindicator);
        this.sectorsMap.set(element.recSector.slugidsector,element.recSector);
    });

   

    let nonKPIIndicators:Number[]=[];
    nonKPIIndicator.forEach(element=>{
      nonKPIIndicators.push(element.slugidindicator);
      this.sectorsMap.set(element.recSector.slugidsector,element.recSector);
    });

    this.sectors=Array.from(this.sectorsMap.values());
    this.sectors.sort((a: ISector, b: ISector) => {
      if (a.slugidsector > b.slugidsector) {
        return 1
      } else if (a.slugidsector < b.slugidsector) {
        return -1
      } else {
        return 0;
      }

    });

    this.getAreaWiseComparisionData(this.selectedArea.code,indicators,nonKPIIndicators)


    }

    else if (this.customViewTypeSelection.indicatorWise){

      this.selctedAreas=this.navParams.get("area");
      this.selectedIndicator=this.navParams.get("indicators");
      let areas=[];
      this.selctedAreas.forEach(element=>{
        areas.push(element.code);
      });
      this.sectors.push(this.selectedIndicator.recSector);
      let isOffline:boolean=this.selectedIndicator.kpi||this.selectedIndicator.nitiaayog||this.selectedIndicator.thematicKpi||this.selectedIndicator.hmis||this.selectedIndicator.ssv;
      this.getIndicatorWiseComparision(areas,this.selectedIndicator.slugidindicator,isOffline);
    }

    else
    {
      this.selctedAreas=this.navParams.get("area");
      this.selectedIndicator=this.navParams.get("indicators");
      this.selectedSourceObject=this.navParams.get("source");
      let areas=[];
      this.selctedAreas.forEach(element=>{
        areas.push(element.code);
      });
      this.sectors.push(this.selectedIndicator.recSector);
      let isOffline:boolean=this.selectedIndicator.kpi||this.selectedIndicator.nitiaayog||this.selectedIndicator.thematicKpi||this.selectedIndicator.hmis||this.selectedIndicator.ssv;;
      this.getSourceWiseComparision(areas,this.selectedIndicator.slugidindicator,isOffline,this.selectedSourceObject.slugidsource);
    }

  }

  async getAreaWiseComparisionData(areaCode:string,indicator:Number[],nonKPIIndicator:Number[])
  {
    this.geographyWiseComparision=await this.customViewServiceProvider.getGeographyWiseComparision(areaCode,indicator,nonKPIIndicator);
  }

  async getIndicatorWiseComparision(areas:string[],indcatorId:Number,isOffline:boolean)
  {
    this.geographyWiseComparision=await this.customViewServiceProvider.getIndicatorWiseComparision(areas,indcatorId,isOffline);
  }

  async getSourceWiseComparision(areas:string[],indcatorId:Number,isOffline:boolean,source :number)
  {
    this.geographyWiseComparision=await this.customViewServiceProvider.getSourceWiseComparision(areas,indcatorId,isOffline,source);
    this.selectedSource=this.selectedSourceObject.sourceName;
  }
      /**
   * This method will help in sharing the screenshot
   * @since 1.0.0
   * @author Harsh Pratyush
   *
   * @memberof CustomViewDataTablePage
   */
  share(){
    if(this.customViewTypeSelection.indicatorWise)
    {
    this.utilService.share(this.messageService.messages.thematicProfileSubject, this.messageService.messages.thematicProfileMessage
    ,this.constantService.getConstantObject().domIdComparisionVisulaization)
    }

    else if(this.customViewTypeSelection.areaWise) 
    {
      this.utilService.share(this.messageService.messages.geographicalProfileSubject, this.messageService.messages.geographicalProfileMessage
        ,this.constantService.getConstantObject().domIdComparisionVisulaization)
    }

    else
    {
      this.utilService.share(this.messageService.messages.dataRepositorySubjecr, this.messageService.messages.dataRepositoryMessage
        ,this.constantService.getConstantObject().domIdComparisionVisulaization)
    }
  }

  viewIndicatorData(indicator:IIndicator)
  {
    if(this.geographyWiseComparision.values.has(indicator.iName))
    this.navCtrl.push("CustomViewVisualizationViewPage",{
      "area":this.selectedArea,"customViewTypeSelection":
      this.customViewTypeSelection,"indicator":indicator,"data":this.geographyWiseComparision.indicatorData.get(indicator.iName),"source":this.selectedSource})
    else
    {
      this.customViewServiceProvider.loadingStatus = false;
      let alert = this.alertController.create({
        title: 'Error!',
        enableBackdropDismiss:false,
        buttons: [
          {
            text: 'OK',
            role: 'ok',
            handler: () => {
              this.customViewServiceProvider.loadingStatus = true;
            }
          }],
        subTitle:"Data not reported for this indicator"
      });

      alert.present();
    }

  }

  viewAreaData(area:Area)
  {
    if(this.geographyWiseComparision.values.has(area.areaname)&&(this.customViewTypeSelection.indicatorWise||(this.customViewTypeSelection.sourceWise&&this.geographyWiseComparision.values.get(area.areaname).has(this.selectedSource))))
    this.navCtrl.push("CustomViewVisualizationViewPage",{"area":area,"customViewTypeSelection":this.customViewTypeSelection,
    "indicator":this.selectedIndicator,"data":this.geographyWiseComparision.indicatorData.get(area.areaname),"source":this.selectedSource})
    else
    {
      this.customViewServiceProvider.loadingStatus = false;
      let alert = this.alertController.create({
        title: 'Error!',
        enableBackdropDismiss:false,
        buttons: [
          {
            text: 'OK',
            role: 'ok',
            handler: () => {
              this.customViewServiceProvider.loadingStatus = true;
            }
          }],
        subTitle:"Data not reported for this area"
      });

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
      if(this.customViewServiceProvider.loadingStatus)
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
