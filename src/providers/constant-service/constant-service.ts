import { Injectable } from "@angular/core";

@Injectable()
export class ConstantServiceProvider {
  /**
   * This method is going to give us all the constants of the application
   * @author Ratikanta
   * @since 1.0.0
   *
   * @memberof ConstantServiceProvider
   */
  getConstantObject() {
    const obj: IConstant = {
      err_settingUpData: "Setting up data, please try after few minutes",
      creatingIndexes: "Creating indexes, please wait...",
      databaseNotReady: "Database not ready, please try again later",
      databaseName: "si-rmncha",
      dataDatabaseName: "data-si-rmncha",
      docName_data: "data",
      docName_indicator: "indicator",
      docName_unit: "unit",
      docName_subgroup: "subgroup",
      docName_area: "area",
      docName_sector: "sector",
      docName_source: "source",
      docName_areaLevel: "areaLevel",
      docName_config: "config",
      dbErrorWhileFetchingDoc: "Database error while fetching document: ",
      dbErrorWhilePuttingDoc: "Database error while putting document: ",
      dbErrorWhileCreatingIndex: "Database error while creating index: ",
      dbErrorWhileCheckingDBSetup:
        "Database error while checking database setup: ",
      dbErrorWhileSettingDBSetup:
        "Database error while setting database setup: ",
      query_indicators_kpiIndicators:
        "function(doc) {for (let element of doc.data) {emit(element.id, element); }}",
      indexes: {
        indicator_kpiIndicators: "kpi_true"
      },

      event_databaseReady: "dbready",
      domIdSnapshotView: "screen-snapshot-id",
      domIdSnapshotIndicatorView: "screen-snapshot-indicator-id",
      themeName_maternal: "Maternal",
      themeName_reproductive: "Reproductive",
      themeName_childcare: "Child",
      themeName_neonatal: "Newborn",
      domIdComparisionIndicatorView: "comparison-indicator-view",
      domIdComparisionVisulaization: "copmarision-visualization",
      message_settingUpDatabase: "Setting up database, please wait...",
      err_databaseFileNotPresentInWWW:
        "Database file not present in WWW folder",
      rootFolderName: "si-rmncha",
      logFileName: "log",
      underConstruction: "Under construction",
      loadingData: "Loading data, please wait...",
      processingImage: "Processing image, please wait...",
      dbzippedName: "data.zip",
      demography: "Demography",
      health_infrastructure: "Health infrastructure",
      human_resource: "Human Resource",
      adolescent: "Adolescent",
      noInternetMsg: "Please check your internet connection.",
      serverUrl: "http://prod1.sdrc.co.in/rmnchawapp/api/v1/",
      // serverUrl:'http://192.168.1.197:8081/rmnchawapp/api/v1/',
      customViewUrl: "fetch/customview/",
      memoryFull:
        "Looks like your phone is running out of memory.Please make sure you have 50MB of free space",
      docName_sourceIndicatorData: "sourceIndicatorMap",
      docName_factsheet: "factsheet",
      hmisSlugId: 6,
      userGuidePath: "SIRMNCH+A_user_guide.pdf"
    };

    return obj;
  }
}
