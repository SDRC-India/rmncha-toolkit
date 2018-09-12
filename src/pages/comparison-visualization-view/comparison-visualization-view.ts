import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, Platform, IonicApp } from 'ionic-angular';
import { ComparisonServiceProvider } from '../../providers/comparison-service/comparison-service'
import { UtilServiceProvider } from '../../providers/util-service/util-service';
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { ConstantServiceProvider } from '../../providers/constant-service/constant-service';

  /**
   * 
   * @since 1.0.0
   * @author Harsh Pratyush
   * 
   */
@IonicPage()
@Component({
  selector: 'page-comparison-visualization-view',
  templateUrl: 'comparison-visualization-view.html',
})
export class ComparisonVisualizationViewPage {

  selectedArea1:Area;
  selectedArea2:Area;
  selectedArea3:Area;
  selecedIndicator:Number;
  isSameSource:boolean;
  selectedIndicatorName:string;
  arrow:string='arrow-back';
  lineChartData:MultiLineChart[];
  selectedAreas : string []=[];
  tableData:any;
  selectedView:number;
  unit : string;
  comparisionViewSelection:ComparisionViewSelection;
  areasArray : string []=[];

  selectedParentArea1: Area;
  selectedParentArea2: Area;
  selectedParentArea3: Area;

  area1Same: boolean = false;
  area2Same: boolean = false;
  area3Same: boolean = false;


  area1Data:IDBData[]=[];
  area2Data:IDBData[]=[];
  area3Data:IDBData[]=[];

  public unregisterBackButtonAction: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public comparsionServiceProvider: ComparisonServiceProvider,
     private utilService: UtilServiceProvider,
    private messageService: MessageServiceProvider,
    public alertCtrl: AlertController,private popoverCtrl: PopoverController
    , private constantService: ConstantServiceProvider,private platform:Platform,private app:IonicApp) {
  }

  ngOnInit() {
    this.selectedArea1=this.navParams.get('area1');
    this.selectedArea2=this.navParams.get('area2');
    this.selectedArea3=this.navParams.get('area3');
    this.selecedIndicator=this.navParams.get('indicator');
    this.isSameSource=this.navParams.get('sameSource');
    this.selectedIndicatorName=this.navParams.get('indicatorName');
    this.unit=this.navParams.get("unit");
    this.selectedParentArea1 = this.navParams.get('pareantArea1');
    this.selectedParentArea2 = this.navParams.get('pareantArea2');
    this.selectedParentArea3 = this.navParams.get('pareantArea3');
    this.area1Same=this.navParams.get("area1Same");
    this.area2Same=this.navParams.get("area2Same");
    this.area3Same=this.navParams.get("area3Same");
    this.area1Data=this.navParams.get("area1Data");
    this.area2Data=this.navParams.get("area2Data");
    this.area3Data=this.navParams.get("area3Data");

    

    
    this.selectedArea1?(this.selectedAreas.push(this.selectedArea1.code),this.areasArray.push(this.selectedArea1.code)):this.selectedAreas.push('')
    this.selectedArea2?(this.selectedAreas.push(this.selectedArea2.code),this.areasArray.push(this.selectedArea2.code)):this.selectedAreas.push('')
    this.selectedArea3?(this.selectedAreas.push(this.selectedArea3.code),this.areasArray.push(this.selectedArea3.code)):this.selectedAreas.push('')
   
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

    /**
   * This method will help in sharing the screenshot
   * @since 1.0.0
   * @author Harsh Pratyush
   * 
   * @memberof ComparisonIndicatorViewPage
   */
  share(){
    //alert("under construction")
    this.utilService.share(this.messageService.messages.comparsionViewSharingSubject, this.messageService.messages.comparsionViewSharingMessage
    ,this.constantService.getConstantObject().domIdComparisionVisulaization)
  }

  homePage()
  {
    this.navCtrl.setRoot('HomePage');
  }

  async getLineChartData()
  {
    this.lineChartData=await this.comparsionServiceProvider.getLineChartData(this.selectedAreas,this.selecedIndicator,
      this.area1Same?this.selectedParentArea1.areaname:'',
      this.area2Same?this.selectedParentArea2.areaname:'',
      this.area3Same?this.selectedParentArea3.areaname:'',this.area1Data?this.area1Data:[],
      this.area2Data?this.area2Data:[],this.area3Data?this.area3Data:[]);
  
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
    this.tableData=await this.comparsionServiceProvider.getTabularComparisionData(this.selectedAreas,
      this.selecedIndicator,this.isSameSource,
      this.area1Data?this.area1Data:[],
      this.area2Data?this.area2Data:[],this.area3Data?this.area3Data:[]);
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
