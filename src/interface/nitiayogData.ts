interface NitiAyogData{
     indicator:IIndicator;
     district:number,
     state:number,
     country:number,
     districtSource:string,
     stateSource:string,
     countrySource:string,
     districtTimePeriod:string,
     stateTimePeriod:string,
     countryTimePeriod:string,
     districtData:IDBData[],
     stateData:IDBData[],
     countryData:IDBData[]
}