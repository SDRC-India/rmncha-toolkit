import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Slides, Platform, IonicApp } from 'ionic-angular';
import { UtilServiceProvider } from '../../providers/util-service/util-service';
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { ConstantServiceProvider } from '../../providers/constant-service/constant-service';
import { CustomViewServiceProvider } from '../../providers/custom-view-service/custom-view-service';
import { AreaLevel } from '../../enums/areaLevel';



@IonicPage()
@Component({
  selector: 'page-custom-view-visualization-view',
  templateUrl: 'custom-view-visualization-view.html',
})
export class CustomViewVisualizationViewPage {

  constructor(public navCtrl: NavController, public navParams: NavParams
  ,private utilService: UtilServiceProvider,
  private messageService: MessageServiceProvider,private constantService:ConstantServiceProvider
  , private customViewServiceProvider : CustomViewServiceProvider
  ,private popoverCtrl: PopoverController,public platform:Platform,private app:IonicApp) {
  }

  @ViewChild('pageSlider') pageSlider: Slides;

  selectedArea: IArea

  customViewTypeSelection: CustomViewTypeSelection;

  indicator: IIndicator;

  arrow:string='arrow-back';

  selectedView:number;

  comparisionViewSelection:ComparisionViewSelection={isTableAvailable:true,isBarAvailable:true,isLineAvailable:true};

  customViewVisualizationData : Map<String,MultiLineChart>=new Map();

  selectedSource:string;
  
  lineChartData : MultiLineChart[];

  tableData: LineChart[];

  dbData:IDBData[];

  index: any = 0;

  visualizations:String[]=["Line Chart","Bar chart","Tabular view"]

  selectSourceData:string

  unregisterBackButtonAction:any;

  ngOnInit()
  {
    this.customViewTypeSelection = this.navParams.get("customViewTypeSelection")
    this.selectedArea=this.navParams.get("area")
    this.indicator=this.navParams.get("indicator");
    this.selectedView=1; 
    this.dbData=this.navParams.get("data");
    this.selectSourceData=this.navParams.get("source");
    this.getCustomViewVisualizationData();
 
    

  }

  selectTab(index) {
    this.pageSlider.slideTo(index);
    this.lineChartData=[];
    this.selectedView=index+1;
    this.selectSource();  
     }

     changeWillSlide($event) {
      this.index = $event._snapIndex;
      this.lineChartData=[];
      this.selectedView=this.index+1;
      this.selectSource(); 
     }

  ionViewDidLoad() {
  }


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


  presentPopover($event){
    let popover = this.popoverCtrl.create('ComparisonViewPopoverPage',{"data": this.comparisionViewSelection});
    this.arrow='arrow-forward';
    popover.present({
      ev: $event
    });

    popover.onDidDismiss(data=>{
      
      if(data != null){
    this.selectedView=data 
      }
    })
    popover.onWillDismiss((data: any) => {
      this.arrow='arrow-back';
      if(data != null){
        this.lineChartData=[];
        this.selectedView=data
        this.selectSource();        
          }
      
    });
  }

  async getCustomViewVisualizationData()
  {
      this.customViewVisualizationData= await this.customViewServiceProvider.getCustomViewVisualizationData(this.selectedArea,this.indicator,this.dbData);
     
    this.customViewVisualizationData.forEach(element => {
      element.values.reverse();
    });

    if(!this.customViewTypeSelection.sourceWise)
    {
      switch(this.selectedArea.actAreaLevel.level)
      {
        case AreaLevel.NATIONAL:
        this.selectedSource=this.customViewVisualizationData.has(this.indicator.national.sourceName)
                            ?this.indicator.national.sourceName:this.getKeys(this.customViewVisualizationData)[0]

            break;
        case AreaLevel.STATE:
        this.selectedSource=this.customViewVisualizationData.has(this.indicator.state.sourceName)
        ?this.indicator.state.sourceName:this.getKeys(this.customViewVisualizationData)[0]

            break;

        case AreaLevel.DISTRICT:
        this.selectedSource=this.customViewVisualizationData.has(this.indicator.district.sourceName)
        ?this.indicator.district.sourceName:this.getKeys(this.customViewVisualizationData)[0]

          break;
      }
    }
    else
    {
      this.selectedSource=this.selectSourceData;
    }
      this.selectSource();

      // console.log(this.customViewVisualizationData);
    }

    getKeys(map){
      return Array.from(map.keys());
    }
  
    selectSource()
    {
      this.lineChartData=[];
      if(this.selectedView!=3)
      {
        let visualizationData = this.customViewVisualizationData.get(this.selectedSource);
        let visualizationLine:MultiLineChart={id:visualizationData.id,parentAreaName:visualizationData.parentAreaName,values:visualizationData.values};
        // visualizationData.values.reverse();
        let data= visualizationData.values.slice(0,6);
         visualizationLine.values=data;
        this.lineChartData.push(visualizationLine);
      }
      else 
      {

        let visualizationData = this.customViewVisualizationData.get(this.selectedSource);
        let data= visualizationData.values.slice(0,10);
        data.sort(this.utilService.sortMonthlyArray)
        data.reverse();
        this.tableData=[];
        this.tableData=data;
      }
    }
    getValues(key)
    {
      return this.customViewVisualizationData.get(key);
    }


    homePage()
    {
      this.navCtrl.setRoot('HomePage');
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
        this.navCtrl.pop()
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

}
