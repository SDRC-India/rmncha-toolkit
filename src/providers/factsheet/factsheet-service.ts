import { ConstantServiceProvider } from "../constant-service/constant-service";
import { PouchdbServiceProvider } from "../pouchdb-service/pouchdb-service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

/**
 *
 * @author Harsh Pratyush
 * @export
 * @class FactsheetProvider
 * @classdesc This class acts as a service layer for factsheet page
 */
@Injectable()
export class FactsheetServiceProvider {
  constructor(
    public pouchdbService: PouchdbServiceProvider,
    private constantServiceProvider: ConstantServiceProvider,
    public http: HttpClient
  ) {}

  /**
   *
   * @method This method will intialize the factsheet databse.Needs to be called while creating si-rmncha databse
   * @memberof FactsheetProvider
   */
  async intializeFactsheetDatabase() {
    let db = this.pouchdbService.getDB();
    let factsheetDatas: FactsheetData[] = [];

    let nfhsData: FactsheetData = {
      source: "NFHS",
      round: [
        {
          sourceName: "NFHS-4",
          url: "http://rchiips.org/nfhs/factsheet_NFHS-4.shtml"
        },
        {
          sourceName: "NFHS-3",
          url: "http://rchiips.org/nfhs/factsheet.shtml"
        },
        {
          sourceName: "NFHS-2",
          url: "http://rchiips.org/nfhs/pub_nfhs-2.shtml"
        },
        {
          sourceName: "NFHS-1",
          url: "http://rchiips.org/nfhs/pub_nfhs-1.shtml"
        }
      ]
    };

    factsheetDatas.push(nfhsData);
    let dlhsData: FactsheetData = {
      source: "DLHS",
      round: [
        { sourceName: "DLHS-4", url: "http://rchiips.org/DLHS-4.html" },
        { sourceName: "DLHS-3", url: "http://rchiips.org/PRCH-3.html" },
        { sourceName: "DLHS-2", url: "http://rchiips.org/PRCH-2.html" },
        { sourceName: "DLHS-1", url: "http://rchiips.org/PRCH-1.html" }
      ]
    };

    factsheetDatas.push(dlhsData);

    let rsocData: FactsheetData = {
      source: "RSOC",
      round: [
        {
          sourceName: "RSOC",
          url: "http://wcd.nic.in/acts/rapid-survey-children-rsoc-2013-14"
        }
      ]
    };

    factsheetDatas.push(rsocData);

    let srsData: FactsheetData = {
      source: "SRS",
      round: [
        {
          sourceName: "SRS 2016",
          url:
            "http://www.censusindia.gov.in/vital_statistics/SRS_Report_2016/8.Chap%204-Mortality%20Indicators-2016.pdf"
        },
        {
          sourceName: "SRS 2014",
          url:
            "http://www.censusindia.gov.in/vital_statistics/SRS_Report_2014/8.%20Chap%204-Mortality%20Indicators-2014-U.pdf"
        }
      ]
    };

    factsheetDatas.push(srsData);

    let data = await db.put({
      _id: this.constantServiceProvider.getConstantObject().docName_factsheet,
      data: factsheetDatas
    });
    // console.log(data);
  }

  /**
   *
   *
   * @returns This method will get the facsheet data for factsheet page
   * @memberof FactsheetProvider
   */
  async getFactSheetData() {
    let db = this.pouchdbService.getDB();
    let doc = await db.get(
      this.constantServiceProvider.getConstantObject().docName_factsheet
    );
    let factsheetDatas: FactsheetData[] = doc.data;
    return factsheetDatas;
  }

  /**
   * This method will order the source indicator document in pouch-db.Needs to be called after calling the @method getDataFromServer() @memberof PouchdbServiceProvider
   *
   * @memberof FactsheetProvider
   */
  async updateSource() {
    let db = this.pouchdbService.getDB();
    let doc = await db.get(
      this.constantServiceProvider.getConstantObject()
        .docName_sourceIndicatorData
    );
    let sourceIndicatorDatas: SourceIndicatorData[] = doc.data;

    for (let i = 0; i < sourceIndicatorDatas.length; i++) {
      switch (sourceIndicatorDatas[i].src.sourceName) {
        case "NFHS":
          sourceIndicatorDatas[i].order = 1;
          break;

        case "SRS":
          sourceIndicatorDatas[i].order = 2;
          break;

        case "Census":
          sourceIndicatorDatas[i].order = 3;
          break;

        case "DLHS":
          sourceIndicatorDatas[i].order = 4;
          break;

        case "AHS":
          sourceIndicatorDatas[i].order = 5;
          break;

        case "RSOC":
          sourceIndicatorDatas[i].order = 6;
          break;

        case "HMIS":
          sourceIndicatorDatas[i].order = 7;
          break;

        case "SSV":
          sourceIndicatorDatas[i].order = 8;
          break;
      }
    }

    let save = await db.put({
      _id: this.constantServiceProvider.getConstantObject()
        .docName_sourceIndicatorData,
      data: sourceIndicatorDatas,
      _rev: doc._rev
    });

    console.log(save);
  }
}
