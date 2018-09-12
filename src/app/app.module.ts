import { FileOpener } from '@ionic-native/file-opener';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SyncServiceProvider } from '../providers/sync-service/sync-service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UtilServiceProvider } from '../providers/util-service/util-service';
import { Screenshot } from '@ionic-native/screenshot';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MessageServiceProvider } from '../providers/message-service/message-service';
import { PouchdbServiceProvider } from '../providers/pouchdb-service/pouchdb-service';
import { ConstantServiceProvider } from '../providers/constant-service/constant-service';
import { File } from '@ionic-native/file'
import { DatePipe } from '@angular/common';
import { AreaServiceProvider } from '../providers/area-service/area-service';
import { AreaLevelServiceProvider } from '../providers/area-level-service/area-level-service';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { IndicatorServiceProvider } from '../providers/indicator-service/indicator-service';
import { SourceServiceProvider } from '../providers/source-service/source-service';
import { SubgroupServiceProvider } from '../providers/subgroup-service/subgroup-service';
import { UnitServiceProvider } from '../providers/unit-service/unit-service';
import { SectorServiceProvider } from '../providers/sector-service/sector-service';
import { CustomViewServiceProvider } from '../providers/custom-view-service/custom-view-service';
import { HeaderColor } from '@ionic-native/header-color';
import { NitiAyogServiceProvider } from '../providers/niti-ayog-service/niti-ayog-service';
import { Network } from '@ionic-native/network';
import { FactsheetServiceProvider } from '../providers/factsheet/factsheet-service';
import { HttpInterceptorProvider } from '../providers/http-interceptor/http-interceptor';
import { ScreenOrientation } from '@ionic-native/screen-orientation';




@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SyncServiceProvider,PouchdbServiceProvider, 
    UtilServiceProvider, Screenshot, SocialSharing,
    MessageServiceProvider,    
    ConstantServiceProvider,
    File,
    DatePipe,
    AreaServiceProvider,    
    AreaLevelServiceProvider,
    DataServiceProvider,
    IndicatorServiceProvider,
    SourceServiceProvider,
    SubgroupServiceProvider,
    UnitServiceProvider,
    SectorServiceProvider,
    CustomViewServiceProvider
    ,HeaderColor,
    NitiAyogServiceProvider,
    Network,
    FactsheetServiceProvider,
    HttpInterceptorProvider,
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorProvider, multi: true },
    ScreenOrientation,
    FileOpener

  ]
})
export class AppModule {}
