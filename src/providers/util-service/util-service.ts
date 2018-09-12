import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MessageServiceProvider } from '../message-service/message-service';
import { LoadingController, ToastController, Platform } from 'ionic-angular';
import 'rxjs/add/operator/toPromise'
import { File } from '@ionic-native/file'
import { DatePipe } from '@angular/common';
import { ConstantServiceProvider } from '../constant-service/constant-service';
import { Screenshot } from '@ionic-native/screenshot';
import {
  Network
} from '@ionic-native/network';


@Injectable()
export class UtilServiceProvider {

  private _selectedArea: IArea;
  private _areas: IArea[] = [];
  private _defaultAreaCode: string;

   

  loading;
  platform: IPlatform = {
    android: null,
    ios: null,
    mobileBrowser: null,
    webBrowser: null
  }
  
  

  constructor( private socialSharing: SocialSharing,
  private messageService: MessageServiceProvider,
  private toastCtrl: ToastController,
  private loadingCtrl: LoadingController, 
  private platformObject: Platform,
  private file: File,
  private datePipe: DatePipe,
  private constantService: ConstantServiceProvider,
  private screenshot: Screenshot,
  private network: Network


){}

  /**
   * This method will help in sharing the screenshot
   * @since 1.0.0
   * @author Ratikanta
   * 
   * @memberof UtilServiceProvider
   */
  async share(message: string, subject: string, domId: string){    
    try{
      if(this.getPlatform().webBrowser||this.getPlatform().mobileBrowser)
      return;

      this.showLoader(this.constantService.getConstantObject().processingImage)
   
      let image = await this.screenshot.URI(100)
      this.stopLoader()
      this.socialSharing.share(message, subject, image.URI, null)
    }catch(err){
       this.stopLoader()
      throw new Error(this.messageService.messages.errorInSharingScreen)
    }

  }



    /**
   * This method will display loader above the page which is being rendered
   * @author Naseem Akhtar (naseem@sdrc.co.in)
   * @author Ratikanta
   * @param message The message which we want to show the user
   * @since 1.0.0
   */
  showLoader(message: string) {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: message,
    });

    this.loading.present();
  }

  /**
   * This method will display loader above the page which is being rendered
   * @author Naseem Akhtar (naseem@sdrc.co.in)
   * @author Ratikanta
   * @param message The message which we want to show the user
   * @since 1.0.0
   */
  stopLoader(){
    this.loading.dismiss();
  }

  /**
   * This method will be used to show success toast to user
   * @author Ratikanta
   * @param message The message we want to show the user
   * @since 1.0.0
   */
  showSuccessToast(message: string){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


    /**
   * This method will be used to show error toast to user
   * @author Ratikanta
   * @param message The message we want to show the user
   * @since 1.0.0
   */
  showErrorToast(message: string){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 5000
    });
    toast.present();
  }

  /**
   * This method is going to set all default value or initial codes
   * @author Ratikanta
   * @since 1.0.0 
   * @memberof UtilServiceProvider
   */
  setDefaults(){
    this._defaultAreaCode = 'IND'    
    this.setPlatform()
  }

  /**
   * This method is going to set the platform
   * @author Ratikanta
   * @since 1.0.0
   * @memberof UtilServiceProvider
   */
  setPlatform(){
    if(this.platformObject.is('mobileweb')){
      this.platform.mobileBrowser = true
    }else if(this.platformObject.is('ios')){
      this.platform.ios = true
    }else if(this.platformObject.is('core')){
        this.platform.webBrowser = true
    }else if(this.platformObject.is('android') && this.platformObject.is('cordova')){
      this.platform.android = true
    }
  }

  /**
   * This method will give us the platform name
   * @author Ratikanta
   * @since 1.0.0
   * 
   * @memberof UtilServiceProvider
   */
  getPlatform(){
    return this.platform
  }

  get defaultAreaCode(): string{
    return this._defaultAreaCode;
  }

  set defaultAreaCode(defaultAreaId: string){
    this._defaultAreaCode = defaultAreaId
  }




  set selectedArea(area: IArea){
    this._selectedArea = area
  }

  get selectedArea(){
    return this._selectedArea
  }

  getParentArea(areaCode): IArea{
    return this.areas.filter(area=>area.code === areaCode)[0]
  }

  set areas(areas: IArea[]){
    this._areas = areas
  }

  get areas(){
    return this._areas
  }
  getAreaByAreaCode(areaCode: string): IArea{
    return this.areas.filter(area=>area.code === areaCode)[0]
  }

  async log(message: string, location?:string, className?: string, methodName?:string){
    
    let dateAndTime: string = this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss:sss')
    let locationString = location?location:''
    let classNameString = className? className: ''
    let methodNameString = methodName? methodName: ''
    let wholeMessage: string = dateAndTime + '>>' + 'Location : ' + locationString + '>>' + 
      'Class : ' + classNameString + '>>' + 'Method : ' + methodNameString + '/n'


    // console.log(wholeMessage)


    await this.file.writeFile(this.file.externalRootDirectory + this.constantService.getConstantObject().rootFolderName, "data.json", wholeMessage,
          { replace: false, append: true })

        
  }
  /**
   * This method will check the internet connection
   * @author Subhadarshani
   * @since 1.0.0
   * 
   * @memberof UtilServiceProvider
   */
  checkInternet(){ 
    if(this.network.type == "none"){
      return false
    }else{
      return true
    }    
    
  }

  sortMonthlyArray(a:any,b:any) 
  {
   let  _monthsArray : string[] =["Jan","Feb","Mar",
  "Apr","May","Jun","Jul","July","Aug","Sep","Oct",
  "Nov","Dec"];

    if(a.tp)
    {


        if(a.tp.indexOf("_")<0||b.tp.indexOf("_")<0)
       {
        if (a.tp > b.tp) {
          return 1
        } else if (a.tp < b.tp) {
          return -1
        } else {
          return 0;
        }
       }

       else
       {

        let monthStart1=a.tp.split("_")[0].split("-")[0].trim()
        let year1=a.tp.split("_")[1].trim()


        let monthStart2=b.tp.split("_")[0].split("-")[0].trim()
        let year2=b.tp.split("_")[1].trim()


        if ((_monthsArray.indexOf(monthStart1)<_monthsArray.indexOf(monthStart2) && year1 <=year2 ) 
      ||(_monthsArray.indexOf(monthStart1)>=_monthsArray.indexOf(monthStart2) && year1 < year2)
      ) 
        {
          return -1
        } else if (((_monthsArray.indexOf(monthStart1) >= _monthsArray.indexOf(monthStart2))&& year1 >= year2
      )||((_monthsArray.indexOf(monthStart1) <= _monthsArray.indexOf(monthStart2)) && year1 >= year2))
      {
          return 1
        } 
     

        else {
          return 0;
        }
      }
    }
    else if(a.axis){

      

      if(a.axis.indexOf("_")<0||b.axis.indexOf("_")<0)
      {
       if (a.axis > b.axis) {
         return 1
       } else if (a.axis < b.axis) {
         return -1
       } else {
         return 0;
       }
      }

      else
      {

       let monthStart1=a.axis.split("_")[0].split("-")[0].trim()
       let year1=a.axis.split("_")[1].trim()


       let monthStart2=b.axis.split("_")[0].split("-")[0].trim()
       let year2=b.axis.split("_")[1].trim()


  
       if ((_monthsArray.indexOf(monthStart1)<_monthsArray.indexOf(monthStart2) && year1 <=year2 ) 
       ||(_monthsArray.indexOf(monthStart1)>=_monthsArray.indexOf(monthStart2) && year1 < year2)
       ) 
         {
           return -1
         } else if (((_monthsArray.indexOf(monthStart1) >= _monthsArray.indexOf(monthStart2))&& year1 >= year2
       )||((_monthsArray.indexOf(monthStart1) <= _monthsArray.indexOf(monthStart2)) && year1 >= year2))
       {
           return 1
         } 
      
 
         else {
           return 0;
         }
     }

    }
    else
    {


      if(a.indexOf("_")<0||b.indexOf("_")<0)
      {
       if (a > b) {
         return 1
       } else if (a < b) {
         return -1
       } else {
         return 0;
       }
      }

      else
      {

       let monthStart1=a.split("_")[0].split("-")[0].trim()
       let year1=a.split("_")[1].trim()


       let monthStart2=b.split("_")[0].split("-")[0].trim()
       let year2=b.split("_")[1].trim()


   
       if ((_monthsArray.indexOf(monthStart1)<_monthsArray.indexOf(monthStart2) && year1 <=year2 ) 
       ||(_monthsArray.indexOf(monthStart1)>=_monthsArray.indexOf(monthStart2) && year1 < year2)
       ) 
         {
           return -1
         } else if (((_monthsArray.indexOf(monthStart1) >= _monthsArray.indexOf(monthStart2))&& year1 >= year2
       )||((_monthsArray.indexOf(monthStart1) <= _monthsArray.indexOf(monthStart2)) && year1 >= year2))
       {
           return 1
         } 
      
 
         else {
           return 0;
         }
     }
    }



  }

}
