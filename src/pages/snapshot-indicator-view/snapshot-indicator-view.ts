import { AreaLevel } from './../../enums/areaLevel';
import { Component } from '@angular/core';
import { IonicPage, PopoverController, NavParams, ModalController, NavController, Platform, IonicApp } from 'ionic-angular';
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { UtilServiceProvider } from '../../providers/util-service/util-service';
import { SnapshotServiceProvider } from '../../providers/snapshot-service/snapshot-service';
import { ConstantServiceProvider } from '../../providers/constant-service/constant-service';


@IonicPage()
@Component({
  selector: 'page-snapshot-indicator-view',
  templateUrl: 'snapshot-indicator-view.html',
})
export class SnapshotIndicatorViewPage {


  tableData: ITableData[];
  showAverageView: boolean =  false
  data: IIndicatorNavParamData;
  showChart: string;
  arrow:string='arrow-back';
  public unregisterBackButtonAction: any;

  constructor(private popoverCtrl: PopoverController,
    private utilService: UtilServiceProvider,
    private messageService: MessageServiceProvider,
    public snapshotService: SnapshotServiceProvider, private constantService: ConstantServiceProvider,
    private navParams: NavParams, private modalCtrl: ModalController, private navCtrl: NavController,
    private platform: Platform,private app:IonicApp){}


  siv: ISIV;
  lineChartData:MultiLineChart[];
  mapJson:any;

  top:IDBData[]=[];

  bottom:IDBData[]=[];

  ngOnInit(){








    this.siv = {

      indicatorName: null,
      indicatorValue: null,
      rankingText: null,
      ranking: null,
      headerText: null,
      aboveAreaLevelLeft: null,
      belowAreaLevelLeft: null,
      aboveAreaLevelRight: null,
      belowAreaLevelRight: null,
      aboveAreaLevelNumber: null,
      belowAreaLevelNumber: null,
      barChartData: [
      ]

    }

    this.setData()
  }

  setData(){
    this.data = <IIndicatorNavParamData>this.navParams.get('data');
    this.siv.headerText = this.data.headerText
    this.siv.indicatorName = this.data.snapshotIndicator.indicator.iName
    this.siv.indicatorValue = this.data.snapshotIndicator.value
    this.siv.ranking = this.data.snapshotIndicator.rank
    // this.showChart = this.data.showChart



    switch(this.data.snapshotIndicator.area.actAreaLevel.level){
      case AreaLevel.NATIONAL:
      this.siv.rankingText='';
      // this.siv.rankingText = `Global ranking (${this.data.snapshotIndicator.source.sourceName}-${this.data.snapshotIndicator.timePeriod})`
      this.showAverageView = true

      this.siv.aboveAreaLevelLeft = `national`
      this.siv.aboveAreaLevelNumber = this.data.snapshotIndicator.top.length
      this.siv.aboveAreaLevelRight = `states`


      this.siv.belowAreaLevelLeft = `national`
      this.siv.belowAreaLevelNumber = this.data.snapshotIndicator.below.length
      this.siv.belowAreaLevelRight = `states`

      break;
      case AreaLevel.STATE:
      this.siv.rankingText = `National ranking (${this.data.snapshotIndicator.source.sourceName}-${this.data.snapshotIndicator.timePeriod})`
      this.showAverageView = true

      this.siv.aboveAreaLevelLeft = `state`
      this.siv.aboveAreaLevelNumber = this.data.snapshotIndicator.top.length
      this.siv.aboveAreaLevelRight = `districts`


      this.siv.belowAreaLevelLeft = `state`
      this.siv.belowAreaLevelNumber = this.data.snapshotIndicator.below.length
      this.siv.belowAreaLevelRight = `districts`
      // this.data.disableView.push("map");
      break;
      case AreaLevel.DISTRICT:
      this.showAverageView = false
      this.siv.rankingText = `State ranking (${this.data.snapshotIndicator.source.sourceName}-${this.data.snapshotIndicator.timePeriod})`
      this.data.disableView.push("map");
      break;
    }

    if(this.data.snapshotIndicator.area.actAreaLevel.level!=AreaLevel.DISTRICT)
    this.getMapViewData();
    

    else
    {
    this.getLineChartData();
    this.getTableData();
    }
    



  }

  presentPopover($event){
    const overlayModal = this.app._modalPortal._views[0];

    if(overlayModal&&overlayModal.dismiss)
    { return;}
    let popover = this.popoverCtrl.create('SnapshotViewPopoverPage', {"data": this.data.disableView});
    this.arrow='arrow-forward';
    popover.present({
      ev: $event
    });


    popover.onWillDismiss((data: any) => {
      this.arrow='arrow-back';
      if(data != null){
        switch(data){
          case 1:
          this.showChart = 'line'
          break;
          case 2:
          this.showChart = 'table'
          break;
          case 3:
          this.showChart = 'map'
          break;
          case 4:
          this.showChart = 'bar'
          break;
        }
      }
    });
  }


  async getTableData(){
    this.tableData = await this.snapshotService.getTableData(this.data.snapshotIndicator.area,
      this.data.snapshotIndicator.indicatorData)
  }

  async getLineChartData(){
    this.lineChartData=await this.snapshotService.getLineChartData(this.data.snapshotIndicator.area,
      this.data.snapshotIndicator.indicatorData);

      if(this.lineChartData[0].values.length<=1)
      {
      this.data.disableView.push("line");
      if(this.data.snapshotIndicator.area.actAreaLevel.level==AreaLevel.DISTRICT)
      this.showChart = 'bar'
      // else
      // this.showChart='map';
    }
    else
    {
          if(this.data.snapshotIndicator.area.actAreaLevel.level==AreaLevel.DISTRICT)
          this.showChart = 'line'
          // else
          // this.showChart='map';
    }
  }

  /**
   * This method will help in sharing the screenshot
   * @since 1.0.0
   * @author Ratikanta
   *
   * @memberof SnapshotViewPage
   */
  share(){
    this.utilService.share(this.messageService.messages.snapshotViewSharingMessage, this.messageService.messages.snapshotViewSharingMessage,
      this.constantService.getConstantObject().domIdSnapshotIndicatorView)
  }


  async getMapViewData()
  {
    this.mapJson=null;
   this.mapJson= await this.snapshotService.getMapViewData(this.data.snapshotIndicator.indicator.slugidindicator,this.data.snapshotIndicator.area.code,this.data.snapshotIndicator.timePeriod,this.data.snapshotIndicator.source.slugidsource,this.data.type);
   this.getLineChartData();
   this.getTableData();

   this.data.snapshotIndicator.top.forEach(element=>{
     let childData:IDBData=this.mapJson.get(element.code);
     if(this.data.snapshotIndicator.timePeriod==childData.tp&&this.data.snapshotIndicator.source.slugidsource==childData.src.slugidsource)
     {
       this.top.push(childData);
     }
     
   })




   this.data.snapshotIndicator.below.forEach(element=>{
    let childData:IDBData=this.mapJson.get(element.code);
    if(this.data.snapshotIndicator.timePeriod==childData.tp&&this.data.snapshotIndicator.source.slugidsource==childData.src.slugidsource)
    {
      this.bottom.push(childData);
    }
    
  })

  if(this.getKeys(this.mapJson).length>2)
  this.showChart='map';
  else
  {
    this.data.disableView.push("map")
    if(this.data.snapshotIndicator.indicatorData.length<=1)
      {
      this.data.disableView.push("line");  
      this.showChart = 'bar'
    }
    else
    {
      this.showChart="line";
    }
  }

  }


  areaDetails(isTop:boolean){
    let areas=isTop?this.top:this.bottom
    let modal = this.modalCtrl.create('SnapshotViewAreaDetailsModalPage',{'data':areas});
    modal.present();
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
      if(this.snapshotService.loadingStatus)
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
    const overlayModal = this.app._modalPortal._views[0];
    if (overlayView && overlayView.dismiss) {
      overlayView.dismiss();
    } 
   else if (overlayModal && overlayModal.dismiss) {
    overlayModal.dismiss();
    } 
    else {
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

  getKeys(map){
    return Array.from(map.keys());
  }

}
