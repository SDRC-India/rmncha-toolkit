import { SnpashotProfile } from './../../enums/SnaphshotProfile';
import { HttpClient } from '@angular/common/http';
import { Legend } from './../../interface/legend';
import { Injectable } from '@angular/core';
import { PouchdbServiceProvider } from '../pouchdb-service/pouchdb-service';
import { ConstantServiceProvider } from '../constant-service/constant-service';
import { UtilServiceProvider } from '../util-service/util-service';
import { AreaLevel } from '../../enums/areaLevel';

@Injectable()
export class SnapshotServiceProvider {

  //this loadingStatus variable is taken to check the loading status
  loadingStatus: boolean = false;
  minValue:number
  maxValue:number
  valDiff:number
  listSize:number
  distanceValue:number;
  highisgood:boolean;
  public legends:Set<Legend>;

  dataDB : any;
  constructor(private pouchdbService: PouchdbServiceProvider,
    private constantService: ConstantServiceProvider,
    private utilService: UtilServiceProvider,private http:HttpClient) { 
    
    }

  async getIndicators(areaCode: string,type:number,sector:ISector,showLoader,hideLoader) {


    try {

      

      if(showLoader)
      {
      this.utilService.showLoader(this.constantService.getConstantObject().loadingData)
      this.loadingStatus = false;
      }
      let dataMap = new Map();


        let data: IDBData[]=[];
try{
  data=((await this.http.get('assets/data/'+areaCode+'.json').toPromise()) as IDBData[])
      }
      catch(e)
      {
        data=[];
      }

      let array: IDBData[]=[];

      if(type==SnpashotProfile.RMNCHA)
        array = data.filter(d=>d.dKPIRSrs==true);

        else if(type==SnpashotProfile.ThemeWise)
        {
          // needs to be changed
        array = data.filter(d=>d.dTHEMATICRSrs==true && d.indicator.recSector.slugidsector==sector.slugidsector);
        }

        else if(type==SnpashotProfile.SSV)
        {
           // needs to be changed
          array = data.filter(d=>d.indicator.ssv==true);
        }

        else if(type==SnpashotProfile.HMMIS)
        {
           // needs to be changed
          array = data.filter(d=>d.indicator.hmis==true && d.src.slugidsource==this.constantService.getConstantObject().hmisSlugId);
        }

        array.sort(this.utilService.sortMonthlyArray);
  


        let snapshotIndicatorlist: ISnapshotIndicator[] = []

        array.forEach(element => {

          {
          if(dataMap.has(element.indicator.slugidindicator))
          {
            let snapshotIndicator: ISnapshotIndicator= dataMap.get(element.indicator.slugidindicator)
            snapshotIndicator.trend=element.trend;
            snapshotIndicator.value= element.value;
            snapshotIndicator.source= element.src;
            snapshotIndicator.rank= element.rank
            snapshotIndicator.top=element.top
            snapshotIndicator.below=element.below
            snapshotIndicator.timePeriod=element.tp
            snapshotIndicator.indicatorData.push(element)
            dataMap.set(element.indicator.slugidindicator,snapshotIndicator);
          }
          else
          {
            let snapshotIndicatorData: ISnapshotIndicator = {
              area:element.area,
              indicator: element.indicator,
              value: element.value,
              source: element.src,
              trend: element.trend,
              theme: element.indicator.recSector.sectorName,
              timePeriod: element.tp,
              unit: element.ius.split(':')[1],
              rank: element.rank,
              top: element.top,
              below: element.below,
              indicatorData:[element]
            }
            dataMap.set(element.indicator.slugidindicator,snapshotIndicatorData);
          }

        }

        });
        dataMap.forEach(element => {
          snapshotIndicatorlist.push(element)
        });
        snapshotIndicatorlist = this.orderByTheme(snapshotIndicatorlist)

        if(hideLoader)
        {
        this.utilService.stopLoader()
        this.loadingStatus = true;
        }
        return snapshotIndicatorlist;

    } catch (err) {
      this.utilService.stopLoader()
      this.loadingStatus = true;
      this.utilService.showErrorToast(err.message)
    }
  }



  async getLineChartData(area: IArea,data:IDBData[]) {



    let array: IDBData[] = data
    array.reverse();
    let lineCharts: LineChart[] = []

    let count = 0
    array.forEach(data => {


      if (count < 6) {
        let lineChart: LineChart = {
          axis: data.tp,
          value: data.value,
          zaxis: area.areaname,
          class: data.indicator.recSector.sectorName
        }
        lineCharts.push(lineChart)


        count++;
      }


    })

    let lineChartData: MultiLineChart[] = [
      {
        id: area.areaname,
        values: lineCharts,
        parentAreaName : area.parentAreaCode
      }]
      console.log(lineChartData)
    // this.utilService.stopLoader()
    this.loadingStatus = true;
    return lineChartData;
  }

  async getTableData(area: IArea,data:IDBData[]) {

 

    let array: IDBData[] = data
    let tableDataList: ITableData[] = []

    array.forEach(data => {
      let tableData: ITableData = {
        tp: data.tp,
        value: data.value
      }
      tableDataList.push(tableData)
    });
    // this.utilService.stopLoader()
    this.loadingStatus = true;
    return tableDataList;
  }




  private orderByTheme(snapshotIndicatorList: ISnapshotIndicator[]): ISnapshotIndicator[] {


    let maternal: ISnapshotIndicator[] = snapshotIndicatorList.filter(d => d.indicator.recSector.sectorName === this.constantService.getConstantObject().themeName_maternal).sort((a: ISnapshotIndicator, b: ISnapshotIndicator) => {
      if (a.indicator.iName > b.indicator.iName) {
        return 1
      } else if (a.indicator.iName < b.indicator.iName) {
        return -1
      } else {
        return 0;
      }

    })

    let reproductive: ISnapshotIndicator[] = snapshotIndicatorList.filter(d => d.indicator.recSector.sectorName === this.constantService.getConstantObject().themeName_reproductive).sort((a: ISnapshotIndicator, b: ISnapshotIndicator) => {
      if (a.indicator.iName > b.indicator.iName) {
        return 1
      } else if (a.indicator.iName < b.indicator.iName) {
        return -1
      } else {
        return 0;
      }

    })
    let childcare: ISnapshotIndicator[] = snapshotIndicatorList.filter(d => d.indicator.recSector.sectorName === this.constantService.getConstantObject().themeName_childcare).sort((a: ISnapshotIndicator, b: ISnapshotIndicator) => {
      if (a.indicator.iName > b.indicator.iName) {
        return 1
      } else if (a.indicator.iName < b.indicator.iName) {
        return -1
      } else {
        return 0;
      }

    })
    let neonatal: ISnapshotIndicator[] = snapshotIndicatorList.filter(d => d.indicator.recSector.sectorName === this.constantService.getConstantObject().themeName_neonatal).sort((a: ISnapshotIndicator, b: ISnapshotIndicator) => {
      if (a.indicator.iName > b.indicator.iName) {
        return 1
      } else if (a.indicator.iName < b.indicator.iName) {
        return -1
      } else {
        return 0;
      }

    })

    
    let infra: ISnapshotIndicator[] =snapshotIndicatorList.filter(d => d.indicator.recSector.sectorName === this.constantService.getConstantObject().health_infrastructure).sort((a: ISnapshotIndicator, b: ISnapshotIndicator) => {
      if (a.indicator.iName > b.indicator.iName) {
        return 1
      } else if (a.indicator.iName < b.indicator.iName) {
        return -1
      } else {
        return 0;
      }

    })

    let hr: ISnapshotIndicator[] = snapshotIndicatorList.filter(d => d.indicator.recSector.sectorName === this.constantService.getConstantObject().human_resource).sort((a: ISnapshotIndicator, b: ISnapshotIndicator) => {
      if (a.indicator.iName > b.indicator.iName) {
        return 1
      } else if (a.indicator.iName < b.indicator.iName) {
        return -1
      } else {
        return 0;
      }

    })

    let adlosecent: ISnapshotIndicator[] = snapshotIndicatorList.filter(d => d.indicator.recSector.sectorName === this.constantService.getConstantObject().adolescent).sort((a: ISnapshotIndicator, b: ISnapshotIndicator) => {
      if (a.indicator.iName > b.indicator.iName) {
        return 1
      } else if (a.indicator.iName < b.indicator.iName) {
        return -1
      } else {
        return 0;
      }

    })

    let demography: ISnapshotIndicator[] = snapshotIndicatorList.filter(d => d.indicator.recSector.sectorName === this.constantService.getConstantObject().demography).sort((a: ISnapshotIndicator, b: ISnapshotIndicator) => {
      if (a.indicator.iName > b.indicator.iName) {
        return 1
      } else if (a.indicator.iName < b.indicator.iName) {
        return -1
      } else {
        return 0;
      }

    })

    snapshotIndicatorList = []

    Array.prototype.push.apply(snapshotIndicatorList, reproductive)
    Array.prototype.push.apply(snapshotIndicatorList, maternal)
    Array.prototype.push.apply(snapshotIndicatorList, neonatal)
    Array.prototype.push.apply(snapshotIndicatorList, childcare)
    Array.prototype.push.apply(snapshotIndicatorList, adlosecent);
    Array.prototype.push.apply(snapshotIndicatorList, demography);
    Array.prototype.push.apply(snapshotIndicatorList, hr);
    Array.prototype.push.apply(snapshotIndicatorList, infra);


    return snapshotIndicatorList

  }

  getAreaText() {

    let selectedArea: IArea = this.utilService.selectedArea
    switch (selectedArea.actAreaLevel.level) {
      case AreaLevel.NATIONAL:
        return selectedArea.areaname
      case AreaLevel.STATE:
        let parentArea: IArea = this.utilService.getParentArea(selectedArea.parentAreaCode)
        return parentArea.areaname + " >> " + selectedArea.areaname
      case AreaLevel.DISTRICT:
        parentArea = this.utilService.getParentArea(selectedArea.parentAreaCode)
        let parentParentArea: IArea = this.utilService.getParentArea(parentArea.parentAreaCode)
        return (parentParentArea.areaname + " >> " + parentArea.areaname + " >> " + selectedArea.areaname)
    }

  }

  setDefaultArea()
  {
     this.pouchdbService.setDefaultArea()
  }

  async getMapViewData (indicatorId:Number,parentAreaCode:String,timePeriod:String,source,type)
  {
    
    this.utilService.showLoader(this.constantService.getConstantObject().loadingData);
    this.loadingStatus = false;

    let mapJson:any;
    let dbdata: IDBData[]=[]
    let tempData:IDBData[]=[]
    let data: IDBData[] = [];
    // let childAreas=this.utilService.areas.filter(area=>area.parentAreaCode==parentAreaCode)
//     for(let i=0;i<childAreas.length;i++)
//     {
// try{
   
//   dbdata=  ((await this.http.get('assets/data/'+childAreas[i].code+'.json').toPromise()) as IDBData[])

//   if(type==SnpashotProfile.RMNCHA)
//   {
//     tempData = dbdata.filter(d=>d.dKPIRSrs==true && d.indicator.slugidindicator==indicatorId && (d.tp==timePeriod||d.src.slugidsource!=source));
//    }
//   else if(type==SnpashotProfile.ThemeWise)
//   {
  
//     tempData = dbdata.filter(d=>d.dTHEMATICRSrs==true && d.indicator.slugidindicator==indicatorId&& (d.tp==timePeriod||d.src.slugidsource!=source));
//   }

//   else if(type==SnpashotProfile.SSV)
//   {
    
//      tempData = dbdata.filter(d=>d.indicator.ssv==true && d.indicator.slugidindicator==indicatorId && d.tp==timePeriod);
//   }

//   else if(type==SnpashotProfile.HMMIS)
//   {
    
//      tempData = dbdata.filter(d=>d.indicator.hmis==true && d.src.slugidsource==source && d.indicator.slugidindicator==indicatorId && d.tp==timePeriod);
//   }
//   Array.prototype.push.apply(data,tempData);
//   }
//   catch(e)
//   {
//     dbdata=[];
//     tempData=[];
//     Array.prototype.push.apply(data,tempData);
//   }
//     }



try{
   
    dbdata=  ((await this.http.get('assets/data/'+indicatorId+'.json').toPromise()) as IDBData[])
  
    if(type==SnpashotProfile.RMNCHA)
    {
      tempData = dbdata.filter(d=>d.dKPIRSrs==true && d.area.parentAreaCode==parentAreaCode && (d.tp==timePeriod||d.src.slugidsource!=source));
     }
    else if(type==SnpashotProfile.ThemeWise)
    {
    
      tempData = dbdata.filter(d=>d.dTHEMATICRSrs==true && d.area.parentAreaCode==parentAreaCode&& (d.tp==timePeriod||d.src.slugidsource!=source));
    }
  
    else if(type==SnpashotProfile.SSV)
    {
      
       tempData = dbdata.filter(d=>d.indicator.ssv==true && d.area.parentAreaCode==parentAreaCode && d.tp==timePeriod);
    }
  
    else if(type==SnpashotProfile.HMMIS)
    {
      
       tempData = dbdata.filter(d=>d.indicator.hmis==true && d.src.slugidsource==source && d.area.parentAreaCode==parentAreaCode && d.tp==timePeriod);
    }
    Array.prototype.push.apply(data,tempData);
    }
    catch(e)
    {
      dbdata=[];
      tempData=[];
      Array.prototype.push.apply(data,tempData);
    }

  try{
    mapJson=  (await this.http.get('assets/areaJson/'+parentAreaCode+'.json').toPromise())
  }
  catch(e)
  {

  }


   

    data.sort((a:IData,b:IData)=>{
      if(a.indicator.highisgood){
        if(Number(a.value) < Number(b.value)){
          return -1
        }
        else if(Number(a.value) > Number(b.value)){
          return 1;
        }
        else return 0
      }else{
        if(Number(a.value) < Number(b.value)){
          return 1;
        }
        else if(Number(a.value) > Number(b.value)){
          return -1;
        }
        else return 0
      }
        
    })

    if(data.length > 0 ){
      if(data[0].indicator.highisgood){
        this.minValue = Number(data[0].value);
        this.maxValue = Number(data[data.length-1].value)
      }else{
        this.maxValue = Number(data[0].value);
        this.minValue = Number(data[data.length-1].value)
      }
      this.valDiff = Number(this.maxValue) - Number(this.minValue);
    }

    this.distanceValue = this.valDiff/ 3 ;
    
    if(data.length>0)
    this.highisgood= data[0].indicator.highisgood||data[0].indicator.nucolor;

    let cssClass;
    this.legends=new Set();
    for(let looper:number=0;looper<3;looper++){
        if(this.highisgood){
          switch(looper){
            case 0:
              cssClass = "range1"
              break;
            case 1:
              cssClass="range2"
              break;
            case 2:
              cssClass="range3"
            break;
          }
        }else{
          switch(looper){
            case 0:
              cssClass = "range3"
              break;
            case 1:
              cssClass="range2"
              break;
            case 2:
              cssClass="range1"
            break;
          }
        }
        if(looper==0){

          if(this.highisgood){
            this.legends.add(new Legend(cssClass,
              Number((Number(this.minValue)  + (this.distanceValue * looper) + (0.0)).toFixed(1)),
              Number((Number(this.minValue)  + (this.distanceValue * (looper+1))).toFixed(1))
            ))
          }else{
            this.legends.add(new Legend(cssClass,
              Number((Number(this.minValue)  + (this.distanceValue * looper) + (0.0)).toFixed(1)),
              Number((Number(this.minValue)  + (this.distanceValue * (looper+1))).toFixed(1))
            ))
          }
        }else{
          if(this.highisgood){
            this.legends.add(new Legend(cssClass,
              Number((Number(this.minValue) + (this.distanceValue * looper) + (0.0)).toFixed(1)),
              Number((Number(this.minValue)  + (this.distanceValue * (looper+1))).toFixed(1))
            ))
          }else{
            this.legends.add(new Legend(cssClass,
              Number((Number(this.minValue)  + (this.distanceValue * looper) + (0.1)).toFixed(1)),
              Number((Number(this.minValue)  + (this.distanceValue * (looper+1))).toFixed(1))
            ))
          }
        }
        
    }

    data.sort(this.utilService.sortMonthlyArray)
        let dataMap=new Map();
        data.forEach(data => {
          let mapData : MapData=data;
          this.legends.forEach(l=>{
      
            if(((mapData.value) >= l.startInterval) && ((mapData.value)  <= l.stopInterval)){
              mapData.cssClass=l.cssClass
             
            }
          })
          dataMap.set(data.area.code,mapData);
        });

        // if(data.length>0)
        {
        dataMap.set("legend",this.legends);
        dataMap.set("mapJson",mapJson);
        }
        this.utilService.stopLoader()
        this.loadingStatus = true;

        return dataMap;
  }
  


}


