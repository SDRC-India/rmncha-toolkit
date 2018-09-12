import { HttpClient } from "@angular/common/http";
import { AreaLevel } from "./../../enums/areaLevel";
import { ConstantServiceProvider } from "./../constant-service/constant-service";
import { UtilServiceProvider } from "./../util-service/util-service";
import { PouchdbServiceProvider } from "./../pouchdb-service/pouchdb-service";

import { Injectable } from "@angular/core";

/*
  Generated class for the NitiAyogServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NitiAyogServiceProvider {
  //this loadingStatus variable is taken to check the loading status
  loadingStatus: boolean = true;

  constructor(
    public pouchdbService: PouchdbServiceProvider,
    private constantServiceProvider: ConstantServiceProvider,
    private utilServiceProvider: UtilServiceProvider,
    private http: HttpClient
  ) {}

  async getNitiAyogDistrictData(selectedArea: Area) {
    this.utilServiceProvider.showLoader(
      this.constantServiceProvider.getConstantObject().loadingData
    );
    this.loadingStatus = false;
    // let dataDB = this.pouchdbService.getDataDB();

    // let data = await dataDB.find({
    //   selector: {
    //     "area.code": selectedArea.code,
    //     "dKPIRSrs":{ $ne: null },
    //     'dNITIRSrs':true
    //   },use_index:"area-kpi-index"
    // });

    // let array: IDBData[] = data.docs
    let data: IDBData[] = [];
    try {
      data = (await this.http
        .get("assets/data/" + selectedArea.code + ".json")
        .toPromise()) as IDBData[];
    } catch (e) {
      data = [];
    }
    let array: IDBData[] = data.filter(d => d.dNITIRSrs == true);

    let dataMap: Map<String, NitiAyogData> = new Map();

    let totalDataMap: Map<String, IDBData[]> = new Map();

    array.sort((a: IDBData, b: IDBData) => {
      if (a.tp < b.tp) {
        return -1;
      } else if (a.tp > b.tp) {
        return 1;
      } else {
        return 0;
      }
    });

    array.forEach(e => {
      let recSource: ISource;
      switch (e.area.actAreaLevel.level) {
        case AreaLevel.NATIONAL:
          recSource = e.indicator.national[0];
          break;
        case AreaLevel.STATE:
          recSource = e.indicator.state[0];
          break;

        case AreaLevel.DISTRICT:
          recSource = e.indicator.district[0];
          break;
      }
      if (recSource.slugidsource == e.src.slugidsource) {
        if (totalDataMap.has(e.ius)) {
          totalDataMap.get(e.ius).push(e);
        } else {
          totalDataMap.set(e.ius, [e]);
        }
        let nitiAyogData: NitiAyogData = {
          indicator: e.indicator,
          district: e.value,
          state: null,
          country: null,
          districtSource: e.src.sourceName,
          districtTimePeriod: e.tp,
          stateSource: null,
          stateTimePeriod: null,
          countrySource: null,
          countryTimePeriod: null,
          districtData: totalDataMap.get(e.ius),
          stateData: [],
          countryData: []
        };
        dataMap.set(e.ius, nitiAyogData);
      }
    });

    //  data = await dataDB.find({
    //   selector: {
    //     "area.code": selectedArea.parentAreaCode,
    //     "dKPIRSrs":{ $ne: null },
    //     'dNITIRSrs':true
    //   },use_index:"area-kpi-index"
    // });

    // array = data.docs

    try {
      data = (await this.http
        .get("assets/data/" + selectedArea.parentAreaCode + ".json")
        .toPromise()) as IDBData[];
    } catch (e) {
      data = [];
    }
    array = data.filter(d => d.dNITIRSrs == true);

    totalDataMap = new Map();
    array.sort((a: IDBData, b: IDBData) => {
      if (a.tp < b.tp) {
        return -1;
      } else if (a.tp > b.tp) {
        return 1;
      } else {
        return 0;
      }
    });

    array.forEach(e => {
      let recSource: ISource;
      switch (e.area.actAreaLevel.level) {
        case AreaLevel.NATIONAL:
          recSource = e.indicator.national[0];
          break;
        case AreaLevel.STATE:
          recSource = e.indicator.state[0];
          break;

        case AreaLevel.DISTRICT:
          recSource = e.indicator.district[0];
          break;
      }
      if (recSource.slugidsource == e.src.slugidsource) {
        if (totalDataMap.has(e.ius)) {
          totalDataMap.get(e.ius).push(e);
        } else {
          totalDataMap.set(e.ius, [e]);
        }

        if (dataMap.has(e.ius)) {
          dataMap.get(e.ius).state = e.value;
          dataMap.get(e.ius).stateSource = e.src.sourceName;
          dataMap.get(e.ius).stateTimePeriod = e.tp;
          dataMap.get(e.ius).stateData = totalDataMap.get(e.ius);
        } else {
          let nitiAyogData: NitiAyogData = {
            indicator: e.indicator,
            district: null,
            districtTimePeriod: null,
            state: e.value,
            country: null,
            countrySource: null,
            stateSource: e.src.sourceName,
            stateTimePeriod: e.tp,
            districtSource: null,
            countryTimePeriod: null,
            districtData: [],
            stateData: totalDataMap.get(e.ius),
            countryData: []
          };
          dataMap.set(e.ius, nitiAyogData);
        }
      }
    });

    // data = await dataDB.find({
    //   selector: {
    //     "area.code": 'IND',
    //     "dKPIRSrs":{ $ne: null },
    //     'dNITIRSrs':true
    //   },use_index:"area-kpi-index"
    // });

    // array = data.docs

    try {
      data = (await this.http
        .get("assets/data/IND.json")
        .toPromise()) as IDBData[];
    } catch (e) {
      data = [];
    }
    array = data.filter(d => d.dNITIRSrs == true);
    array.sort((a: IDBData, b: IDBData) => {
      if (a.tp < b.tp) {
        return -1;
      } else if (a.tp > b.tp) {
        return 1;
      } else {
        return 0;
      }
    });

    totalDataMap = new Map();
    array.forEach(e => {
      let recSource: ISource;

      switch (e.area.actAreaLevel.level) {
        case AreaLevel.NATIONAL:
          recSource = e.indicator.national[0];
          break;
        case AreaLevel.STATE:
          recSource = e.indicator.state[0];
          break;

        case AreaLevel.DISTRICT:
          recSource = e.indicator.district[0];
          break;
      }
      if (recSource.slugidsource == e.src.slugidsource) {
        if (totalDataMap.has(e.ius)) {
          totalDataMap.get(e.ius).push(e);
        } else {
          totalDataMap.set(e.ius, [e]);
        }

        if (dataMap.has(e.ius)) {
          dataMap.get(e.ius).country = e.value;
          dataMap.get(e.ius).countrySource = e.src.sourceName;
          dataMap.get(e.ius).countryTimePeriod = e.tp;
          dataMap.get(e.ius).countryData = totalDataMap.get(e.ius);
        } else {
          let nitiAyogData: NitiAyogData = {
            indicator: e.indicator,
            district: null,
            state: null,
            country: e.value,
            districtSource: null,
            districtTimePeriod: null,
            stateSource: null,
            stateTimePeriod: null,
            countrySource: e.src.sourceName,
            countryTimePeriod: e.tp,
            countryData: totalDataMap.get(e.ius),
            stateData: [],
            districtData: []
          };
          dataMap.set(e.ius, nitiAyogData);
        }
      }
    });

    let nitiayogCompareData: NitiAyogData[] = [];

    dataMap.forEach(element => {
      nitiayogCompareData.push(element);
    });

    nitiayogCompareData = this.orderByTheme(nitiayogCompareData);
    this.utilServiceProvider.stopLoader();
    this.loadingStatus = true;
    return nitiayogCompareData;
  }

  private orderByTheme(nitiayogCompareData: NitiAyogData[]): NitiAyogData[] {
    let maternal: NitiAyogData[] = nitiayogCompareData
      .filter(
        d =>
          d.indicator.recSector.sectorName ===
          this.constantServiceProvider.getConstantObject().themeName_maternal
      )
      .sort((a: NitiAyogData, b: NitiAyogData) => {
        if (a.indicator.iName > b.indicator.iName) {
          return 1;
        } else if (a.indicator.iName < b.indicator.iName) {
          return -1;
        } else {
          return 0;
        }
      });
    let reproductive: NitiAyogData[] = nitiayogCompareData
      .filter(
        d =>
          d.indicator.recSector.sectorName ===
          this.constantServiceProvider.getConstantObject()
            .themeName_reproductive
      )
      .sort((a: NitiAyogData, b: NitiAyogData) => {
        if (a.indicator.iName > b.indicator.iName) {
          return 1;
        } else if (a.indicator.iName < b.indicator.iName) {
          return -1;
        } else {
          return 0;
        }
      });
    let childcare: NitiAyogData[] = nitiayogCompareData
      .filter(
        d =>
          d.indicator.recSector.sectorName ===
          this.constantServiceProvider.getConstantObject().themeName_childcare
      )
      .sort((a: NitiAyogData, b: NitiAyogData) => {
        if (a.indicator.iName > b.indicator.iName) {
          return 1;
        } else if (a.indicator.iName < b.indicator.iName) {
          return -1;
        } else {
          return 0;
        }
      });
    let neonatal: NitiAyogData[] = nitiayogCompareData
      .filter(
        d =>
          d.indicator.recSector.sectorName ===
          this.constantServiceProvider.getConstantObject().themeName_neonatal
      )
      .sort((a: NitiAyogData, b: NitiAyogData) => {
        if (a.indicator.iName > b.indicator.iName) {
          return 1;
        } else if (a.indicator.iName < b.indicator.iName) {
          return -1;
        } else {
          return 0;
        }
      });

    nitiayogCompareData = [];

    Array.prototype.push.apply(nitiayogCompareData, reproductive);
    Array.prototype.push.apply(nitiayogCompareData, maternal);
    Array.prototype.push.apply(nitiayogCompareData, neonatal);
    Array.prototype.push.apply(nitiayogCompareData, childcare);

    return nitiayogCompareData;
  }

  async getTabularComparisionData(
    areaIds: string[],
    indicatorId: Number,
    sameSource: boolean,
    districtData,
    stateData,
    countryData
  ) {
    if (!sameSource)
      this.utilServiceProvider.showLoader(
        this.constantServiceProvider.getConstantObject().loadingData
      );

    let dataDB = this.pouchdbService.getDataDB();
    // let data = await dataDB.find({
    //   selector: {
    //     "area.code": areaIds[0],
    //     "indicator.slugidindicator": indicatorId,
    //     "tp":{$ne:null}
    //   }, use_index: "area-indicator-time-index"
    // });

    // let array: IDBData[] = data.docs
    let array = districtData;
    array.reverse();

    let dataMap = new Map();

    let i = 0;
    array.forEach(element => {
      let recSource: ISource;
      switch (element.area.actAreaLevel.level) {
        case AreaLevel.NATIONAL:
          recSource = element.indicator.national[0];
          break;
        case AreaLevel.STATE:
          recSource = element.indicator.state[0];
          break;

        case AreaLevel.DISTRICT:
          recSource = element.indicator.district[0];
          break;
      }
      if (recSource.slugidsource == element.src.slugidsource) {
        let areaData = {
          area1: element.value,
          timeperiod1: element.tp,
          Source: element.src.sourceName,
          Timeperiod: element.tp,
          source1: element.src.sourceName
        };
        if (sameSource) dataMap.set(element.tp, areaData);
        else dataMap.set(i, areaData);

        i++;
      }
    });

    // data = await dataDB.find({
    //   selector: {
    //     "area.code": areaIds[1],
    //     "indicator.slugidindicator": indicatorId,
    //     "tp":{$ne:null}
    //   }, use_index: "area-indicator-time-index"
    // });

    // array=[];
    // array=data.docs;

    array = [];
    array = stateData;
    array.reverse();

    i = 0;
    array.forEach(element => {
      let recSource: ISource;
      switch (element.area.actAreaLevel.level) {
        case AreaLevel.NATIONAL:
          recSource = element.indicator.national[0];
          break;
        case AreaLevel.STATE:
          recSource = element.indicator.state[0];
          break;

        case AreaLevel.DISTRICT:
          recSource = element.indicator.district[0];
          break;
      }
      if (recSource.slugidsource == element.src.slugidsource) {
        let areaData;
        if (sameSource) {
          if (dataMap.has(element.tp)) {
            areaData = dataMap.get(element.tp);
            (areaData.area2 = element.value),
              (areaData.timeperiod2 = element.tp),
              (areaData.source2 = element.src.sourceName);
          } else
            areaData = {
              area2: element.value,
              timeperiod2: element.tp,
              Source: element.src.sourceName,
              Timeperiod: element.tp,
              source2: element.src.sourceName
            };

          dataMap.set(element.tp, areaData);
        } else {
          if (dataMap.has(i)) {
            areaData = dataMap.get(i);
            (areaData.area2 = element.value),
              (areaData.timeperiod2 = element.tp),
              (areaData.source2 = element.src.sourceName);
          } else
            areaData = {
              area2: element.value,
              timeperiod2: element.tp,
              Source: element.src.sourceName,
              Timeperiod: element.tp,
              source2: element.src.sourceName
            };
          dataMap.set(i, areaData);
          i++;
        }
      }
    });

    // if(areaIds.length==3)
    {
      //   data = await dataDB.find({
      //     selector: {
      //       "area.code": areaIds[2],
      //       "indicator.slugidindicator": indicatorId,
      //       "tp":{$ne:null}
      // }, use_index: "area-indicator-time-index"
      //   });

      //   array=[];
      //   array=data.docs;
      array = [];
      array = countryData;
      array.reverse();

      i = 0;
      array.forEach(element => {
        let recSource: ISource;
        switch (element.area.actAreaLevel.level) {
          case AreaLevel.NATIONAL:
            recSource = element.indicator.national[0];
            break;
          case AreaLevel.STATE:
            recSource = element.indicator.state[0];
            break;

          case AreaLevel.DISTRICT:
            recSource = element.indicator.district[0];
            break;
        }
        if (recSource.slugidsource == element.src.slugidsource) {
          let areaData;
          if (sameSource) {
            if (dataMap.has(element.tp)) {
              areaData = dataMap.get(element.tp);
              (areaData.area3 = element.value),
                (areaData.timeperiod3 = element.tp),
                (areaData.source3 = element.src.sourceName);
            } else
              areaData = {
                area3: element.value,
                timeperiod3: element.tp,
                Source: element.src.sourceName,
                Timeperiod: element.tp,
                source3: element.src.sourceName
              };

            dataMap.set(element.tp, areaData);
          } else {
            if (dataMap.has(i)) {
              areaData = dataMap.get(i);
              (areaData.area3 = element.value),
                (areaData.timeperiod3 = element.tp),
                (areaData.source3 = element.src.sourceName);
            } else
              areaData = {
                area3: element.value,
                timeperiod3: element.tp,
                Source: element.src.sourceName,
                Timeperiod: element.tp,
                source3: element.src.sourceName
              };

            dataMap.set(i, areaData);
            i++;
          }
        }
      });
    }

    let tabularData: any[] = [];

    dataMap.forEach(element => {
      tabularData.push(element);
    });
    if (!sameSource) this.utilServiceProvider.stopLoader();
    else {
      tabularData.sort((a: any, b: any) => {
        if (a.Timeperiod < b.Timeperiod) {
          return -1;
        } else if (a.Timeperiod > b.Timeperiod) {
          return 1;
        } else {
          return 0;
        }
      });
      tabularData.reverse();
    }

    return tabularData;
  }

  async getLineChartData(
    areaIds: string[],
    indicatorId: Number,
    districtData,
    stateData,
    countryData
  ) {
    this.utilServiceProvider.showLoader(
      this.constantServiceProvider.getConstantObject().loadingData
    );
    let dataDB = this.pouchdbService.getDataDB();
    // let data = await dataDB.find({
    //   selector: {
    //     "area.code": areaIds[0],
    //     "indicator.slugidindicator": indicatorId,
    //     "tp":{$ne:null}
    //   }, use_index: "area-indicator-time-index"
    // });

    // let array: IDBData[] = data.docs

    let array = districtData;

    array.reverse();

    let lineChartDatas: MultiLineChart[] = [];
    let lineChartData1: MultiLineChart;
    let linecharts: LineChart[] = [];
    array.forEach(element => {
      let recSource: ISource;
      switch (element.area.actAreaLevel.level) {
        case AreaLevel.NATIONAL:
          recSource = element.indicator.national[0];
          break;
        case AreaLevel.STATE:
          recSource = element.indicator.state[0];
          break;

        case AreaLevel.DISTRICT:
          recSource = element.indicator.district[0];
          break;
      }
      if (recSource.slugidsource == element.src.slugidsource) {
        let linechart: LineChart = {
          axis: element.tp,
          value: element.value,
          zaxis: element.area.areaname,
          class: "area1"
        };
        if (linecharts.length < 6) {
          linecharts.push(linechart);
        }
      }
    });
    if (linecharts.length) {
      linecharts.reverse();
      lineChartData1 = { id: array[0].area.areaname, values: linecharts };
      lineChartDatas.push(lineChartData1);
    }

    // data = await dataDB.find({
    //   selector: {
    //     "area.code": areaIds[1],
    //     "indicator.slugidindicator": indicatorId,
    //     "tp":{$ne:null}
    //   }, use_index: "area-indicator-time-index"
    // });

    // array=[];
    // array=data.docs;

    array = [];
    array = stateData;
    array.reverse();

    let lineChartData2: MultiLineChart;
    linecharts = [];
    array.forEach(element => {
      let recSource: ISource;
      switch (element.area.actAreaLevel.level) {
        case AreaLevel.NATIONAL:
          recSource = element.indicator.national[0];
          break;
        case AreaLevel.STATE:
          recSource = element.indicator.state[0];
          break;

        case AreaLevel.DISTRICT:
          recSource = element.indicator.district[0];
          break;
      }
      if (recSource.slugidsource == element.src.slugidsource) {
        let linechart: LineChart = {
          axis: element.tp,
          value: element.value,
          zaxis: element.area.areaname,
          class: "area2"
        };

        if (linecharts.length < 6) {
          linecharts.push(linechart);
        }
      }
    });
    if (linecharts.length) {
      linecharts.reverse();
      lineChartData2 = { id: array[0].area.areaname, values: linecharts };
      lineChartDatas.push(lineChartData2);
    }

    if (areaIds.length == 3) {
      //   data = await dataDB.find({
      //     selector: {
      //       "area.code": areaIds[2],
      //       "indicator.slugidindicator": indicatorId,
      //       "tp":{$ne:null}
      // }, use_index: "area-indicator-time-index"
      //   });

      //   array=[];
      //   array=data.docs;

      array = [];
      array = countryData;
      array.reverse();

      let lineChartData2: MultiLineChart;
      linecharts = [];
      array.forEach(element => {
        let recSource: ISource;
        switch (element.area.actAreaLevel.level) {
          case AreaLevel.NATIONAL:
            recSource = element.indicator.national[0];
            break;
          case AreaLevel.STATE:
            recSource = element.indicator.state[0];
            break;

          case AreaLevel.DISTRICT:
            recSource = element.indicator.district[0];
            break;
        }
        if (recSource.slugidsource == element.src.slugidsource) {
          let linechart: LineChart = {
            axis: element.tp,
            value: element.value,
            zaxis: element.area.areaname,
            class: "area3"
          };
          if (linecharts.length < 6) {
            linecharts.push(linechart);
          }
        }
      });
      if (linecharts.length) {
        linecharts.reverse();
        lineChartData2 = { id: array[0].area.areaname, values: linecharts };
        lineChartDatas.push(lineChartData2);
      }
    }
    this.utilServiceProvider.stopLoader();
    return lineChartDatas;
  }
}
