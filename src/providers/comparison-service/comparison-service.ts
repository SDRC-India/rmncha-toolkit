import { HttpClient } from "@angular/common/http";

import { Injectable } from "@angular/core";
import { PouchdbServiceProvider } from "../pouchdb-service/pouchdb-service";
import { ConstantServiceProvider } from "../constant-service/constant-service";
import { UtilServiceProvider } from "../util-service/util-service";
import { AreaLevel } from "../../enums/areaLevel";

/**
 *
 * @author Harsh Pratyush
 * @export
 * @class ComparisonServiceProvider
 */
@Injectable()
export class ComparisonServiceProvider {
  //this loadingStatus variable is taken to check the loading status
  loadingStatus: boolean = false;

  constructor(
    public pouchdbService: PouchdbServiceProvider,
    private constantServiceProvider: ConstantServiceProvider,
    private utilServiceProvider: UtilServiceProvider,
    private constantService: ConstantServiceProvider,
    private http: HttpClient
  ) {}

  /**
   *
   *
   * @returns Area List
   * @memberof ComparisonServiceProvider
   */
  async getArea() {
    let db = this.pouchdbService.getDB();
    let doc = await db.get(
      this.constantServiceProvider.getConstantObject().docName_area
    );
    let areas: Area[] = [];
    for (let i = 0; i < doc.data.length; i++) {
      let level = [];
      for (let j = 0; j < doc.data[i].areaLevel.length; j++)
        level.push(doc.data[i].areaLevel[j].level);
      let area: Area = {
        areaname: doc.data[i].areaname,
        parentAreaCode: doc.data[i].parentAreaCode,
        code: doc.data[i].code,
        levels: level,
        id: doc.data[i].id,
        actAreaLevel: doc.data[i].actAreaLevel,
        slugidarea: doc.data[i].slugidarea
      };
      areas.push(area);
    }

    areas.sort((a: Area, b: Area) => {
      if (a.areaname < b.areaname) {
        return -1;
      } else if (a.areaname > b.areaname) {
        return 1;
      } else {
        return 0;
      }
    });

    return areas;
  }

  /**
   *
   *
   * @returns Returns the Area levels except niti ayog
   * @memberof ComparisonServiceProvider
   */
  async getAreaLevel() {
    let db = this.pouchdbService.getDB();
    let doc = await db.get(
      this.constantServiceProvider.getConstantObject().docName_areaLevel
    );
    let areaLevels: IAreaLevel[] = doc.data;
    areaLevels.sort((a: IAreaLevel, b: IAreaLevel) => {
      if (a.level < b.level) {
        return -1;
      } else if (a.level > b.level) {
        return 1;
      } else {
        return 0;
      }
    });
    areaLevels.shift();
    return areaLevels;
  }

  /**
   * Will return the area Comparision for selected areaIds for the KPIs of RMNCH+A Snapshot
   *
   * @param {string[]} areaIds
   * @returns
   * @memberof ComparisonServiceProvider
   */
  async getAreaComparision(areaIds: string[]) {
    this.utilServiceProvider.showLoader(
      this.constantService.getConstantObject().loadingData
    );
    this.loadingStatus = false;

    let data: IDBData[] = [];
    try {
      data = (await this.http
        .get("assets/data/" + areaIds[0] + ".json")
        .toPromise()) as IDBData[];
    } catch (e) {
      data = [];
    }
    let array: IDBData[] = data.filter(d => d.dKPIRSrs == true);
    array.sort(this.utilServiceProvider.sortMonthlyArray);
    let dataMap = new Map();
    let totalDataMap: Map<String, IDBData[]> = new Map();

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
        if (totalDataMap.has(element.ius)) {
          totalDataMap.get(element.ius).push(element);
        } else {
          totalDataMap.set(element.ius, [element]);
        }
        let areaData = {
          _id: element.indicator.slugidindicator,
          indicator: element.indicator.iName,
          unit: element.indicator.unit.unitName,
          area1: element.value,
          timeperiod1: element.tp,
          source1: element.src.sourceName,
          theme: element.indicator.recSector.sectorName,
          area1Data: totalDataMap.get(element.ius)
        };

        dataMap.set(element.ius, areaData);
      }
    });

    try {
      data = (await this.http
        .get("assets/data/" + areaIds[1] + ".json")
        .toPromise()) as IDBData[];
    } catch (e) {
      data = [];
    }
    array = data.filter(d => d.dKPIRSrs == true);
    array.sort(this.utilServiceProvider.sortMonthlyArray);

    totalDataMap = new Map();
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
        if (totalDataMap.has(element.ius)) {
          totalDataMap.get(element.ius).push(element);
        } else {
          totalDataMap.set(element.ius, [element]);
        }

        if (dataMap.has(element.ius)) {
          let areaData = dataMap.get(element.ius);

          (areaData.area2 = element.value),
            (areaData.timeperiod2 = element.tp),
            (areaData.source2 = element.src.sourceName);
          areaData.area2Data = totalDataMap.get(element.ius);
          dataMap.set(element.ius, areaData);
        } else {
          let areaData = {
            _id: element.indicator.slugidindicator,
            indicator: element.indicator.iName,
            unit: element.indicator.unit.unitName,
            area2: element.value,
            timeperiod2: element.tp,
            source2: element.src.sourceName,
            theme: element.indicator.recSector.sectorName,
            area2Data: totalDataMap.get(element.ius)
          };
          dataMap.set(element.ius, areaData);
        }
      }
    });

    // when three areas are selected
    if (areaIds.length == 3) {
      try {
        data = (await this.http
          .get("assets/data/" + areaIds[2] + ".json")
          .toPromise()) as IDBData[];
      } catch (e) {
        data = [];
      }
      array = data.filter(d => d.dKPIRSrs == true);
      array.sort(this.utilServiceProvider.sortMonthlyArray);
      totalDataMap = new Map();

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
          if (totalDataMap.has(element.ius)) {
            totalDataMap.get(element.ius).push(element);
          } else {
            totalDataMap.set(element.ius, [element]);
          }

          if (dataMap.has(element.ius)) {
            let areaData = dataMap.get(element.ius);

            (areaData.area3 = element.value),
              (areaData.timeperiod3 = element.tp),
              (areaData.source3 = element.src.sourceName);
            areaData.area3Data = totalDataMap.get(element.ius);
            dataMap.set(element.ius, areaData);
          } else {
            let areaData = {
              _id: element.indicator.slugidindicator,
              indicator: element.indicator.iName,
              unit: element.indicator.unit.unitName,
              area3: element.value,
              timeperiod3: element.tp,
              source3: element.src.sourceName,
              theme: element.indicator.recSector.sectorName,
              area3Data: totalDataMap.get(element.ius)
            };
            dataMap.set(element.ius, areaData);
          }
        }
      });
    }

    let areaComparisonData: any[] = [];

    dataMap.forEach(element => {
      areaComparisonData.push(element);
    });
    this.utilServiceProvider.stopLoader();

    areaComparisonData = this.orderByTheme(areaComparisonData);
    this.loadingStatus = true;
    return areaComparisonData;
  }

  /**
   * This method will be called in comparision visualization page when user will click on any one Indicator in comparison indicator view page
   *
   * @param {string[]} areaIds
   * @param {Number} indicatorId
   * @param {boolean} sameSource
   * @param {*} area1Data
   * @param {*} area2Data
   * @param {*} area3Data
   * @returns
   * @memberof ComparisonServiceProvider
   */
  async getTabularComparisionData(
    areaIds: string[],
    indicatorId: Number,
    sameSource: boolean,
    area1Data,
    area2Data,
    area3Data
  ) {
    if (!sameSource)
      this.utilServiceProvider.showLoader(
        this.constantService.getConstantObject().loadingData
      );

    let array: IDBData[] = area1Data;

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

    array = [];
    array = area2Data;
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

    if (areaIds.length == 3) {
      array = [];
      array = area3Data;
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

  /**
   * This method will be called in comparision visualization page when user will click on any one Indicator in comparison indicator view page
   *
   * @param {string[]} areaIds
   * @param {Number} indicatorId
   * @param {string} parentArea1
   * @param {string} parentArea2
   * @param {string} parentArea3
   * @param {*} area1Data
   * @param {*} area2Data
   * @param {*} area3Data
   * @returns Line chart and the multi bar chart data
   * @memberof ComparisonServiceProvider
   */
  async getLineChartData(
    areaIds: string[],
    indicatorId: Number,
    parentArea1: string,
    parentArea2: string,
    parentArea3: string,
    area1Data,
    area2Data,
    area3Data
  ) {
    this.utilServiceProvider.showLoader(
      this.constantService.getConstantObject().loadingData
    );
    let dataDB = this.pouchdbService.getDataDB();

    let array: IDBData[] = area1Data;

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
      lineChartData1 = {
        id: array[0].area.areaname,
        values: linecharts,
        parentAreaName: parentArea1
      };
      lineChartDatas.push(lineChartData1);
    }

    array = [];
    array = area2Data;
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
      lineChartData2 = {
        id: array[0].area.areaname,
        values: linecharts,
        parentAreaName: parentArea2
      };
      lineChartDatas.push(lineChartData2);
    }

    if (areaIds.length == 3) {
      array = [];
      array = area3Data;
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
        lineChartData2 = {
          id: array[0].area.areaname,
          values: linecharts,
          parentAreaName: parentArea3
        };
        lineChartDatas.push(lineChartData2);
      }
    }
    this.utilServiceProvider.stopLoader();
    return lineChartDatas;
  }

  /**
   * Order the table of KPI indicator according to the themes
   *
   * @private
   * @param {any[]} comparisionIndicatorList
   * @returns {any[]}
   * @memberof ComparisonServiceProvider
   */
  private orderByTheme(comparisionIndicatorList: any[]): any[] {
    let maternal: any[] = comparisionIndicatorList
      .filter(
        d =>
          d.theme ===
          this.constantServiceProvider.getConstantObject().themeName_maternal
      )
      .sort((a: any, b: any) => {
        if (a.indicator > b.indicator) {
          return 1;
        } else if (a.indicator < b.indicator) {
          return -1;
        } else {
          return 0;
        }
      });
    let reproductive: any[] = comparisionIndicatorList
      .filter(
        d =>
          d.theme ===
          this.constantServiceProvider.getConstantObject()
            .themeName_reproductive
      )
      .sort((a: any, b: any) => {
        if (a.indicator > b.indicator) {
          return 1;
        } else if (a.indicator < b.indicator) {
          return -1;
        } else {
          return 0;
        }
      });
    let childcare: any[] = comparisionIndicatorList
      .filter(
        d =>
          d.theme ===
          this.constantServiceProvider.getConstantObject().themeName_childcare
      )
      .sort((a: any, b: any) => {
        if (a.indicator > b.indicator) {
          return 1;
        } else if (a.indicator < b.indicator) {
          return -1;
        } else {
          return 0;
        }
      });
    let neonatal: any[] = comparisionIndicatorList
      .filter(
        d =>
          d.theme ===
          this.constantServiceProvider.getConstantObject().themeName_neonatal
      )
      .sort((a: any, b: any) => {
        if (a.indicator > b.indicator) {
          return 1;
        } else if (a.indicator < b.indicator) {
          return -1;
        } else {
          return 0;
        }
      });

    comparisionIndicatorList = [];

    Array.prototype.push.apply(comparisionIndicatorList, reproductive);
    Array.prototype.push.apply(comparisionIndicatorList, maternal);
    Array.prototype.push.apply(comparisionIndicatorList, neonatal);
    Array.prototype.push.apply(comparisionIndicatorList, childcare);

    return comparisionIndicatorList;
  }
}
