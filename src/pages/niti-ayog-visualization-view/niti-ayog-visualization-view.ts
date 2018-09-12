import { ConstantServiceProvider } from './../../providers/constant-service/constant-service';
import { MessageServiceProvider } from './../../providers/message-service/message-service';
import { UtilServiceProvider } from './../../providers/util-service/util-service';
import { NitiAyogServiceProvider } from './../../providers/niti-ayog-service/niti-ayog-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Platform, IonicApp } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-niti-ayog-visualization-view',
  templateUrl: 'niti-ayog-visualization-view.html',
})
export class NitiAyogVisualizationViewPage {

  selectedArea : Area;
  selectedIndicator:IIndicator;
  isSameSource:boolean;
  arrow:string='arrow-back';
  lineChartData:MultiLineChart[];
  selectedAreas : string []=[];
  tableData:any;
  selectedView:number;
  comparisionViewSelection:ComparisionViewSelection;

   nitiAyogData:NitiAyogData;
   unregisterBackButtonAction:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private nitiAyogServiceProvider:NitiAyogServiceProvider,
    private utilService: UtilServiceProvider,
   private messageService: MessageServiceProvider,
    private constantService: ConstantServiceProvider,private popoverCtrl: PopoverController,
    public platform:Platform,private app:IonicApp) {
  }

  ionViewDidLoad() {
  }

  ngOnInit()
  {
    this.selectedArea=this.navParams.get("selectedArea");
    this.selectedIndicator=this.navParams.get("selectedIndicator");
    this.isSameSource=this.navParams.get("isSameSource");
    this.nitiAyogData=this.navParams.get("nitiAyogData");

    this.comparisionViewSelection={isTableAvailable:true,isBarAvailable:false,isLineAvailable:false}
    if(this.isSameSource)
    {
    this.comparisionViewSelection.isBarAvailable=true
    this.getLineChartData();
    }
    else
    this.selectedView=3

    this.getTabularData();
  }

  homePage()
  {
    this.navCtrl.setRoot('HomePage');
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
        this.selectedView=data        
          }
      
    });
  }

  async getLineChartData()
  {
    let selectedAreas :string []=[];
    selectedAreas.push(this.selectedArea.code);
    selectedAreas.push(this.selectedArea.parentAreaCode);
    selectedAreas.push('IND');
    this.lineChartData=await this.nitiAyogServiceProvider.getLineChartData(selectedAreas,this.selectedIndicator.slugidindicator,this.nitiAyogData.districtData,this.nitiAyogData.stateData,this.nitiAyogData.countryData)
    if(this.lineChartData && 
      (this.lineChartData[0].values.length>1 || this.lineChartData[1].values.length>1 
        ||(this.lineChartData.length>3 && this.lineChartData[2].values.length>1)))
    {
    this.selectedView=1; 
    this.comparisionViewSelection.isLineAvailable=true
    }
    else
    this.selectedView=2
  }

  async getTabularData()
  {
    let selectedAreas :string []=[];
    selectedAreas.push(this.selectedArea.code);
    selectedAreas.push(this.selectedArea.parentAreaCode);
    selectedAreas.push('IND');

    this.tableData=await this.nitiAyogServiceProvider.getTabularComparisionData(selectedAreas,this.selectedIndicator.slugidindicator,this.isSameSource,this.nitiAyogData.districtData,this.nitiAyogData.stateData,this.nitiAyogData.countryData);
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
