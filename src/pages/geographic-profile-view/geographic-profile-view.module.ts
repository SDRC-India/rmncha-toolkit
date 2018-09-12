import { PipesModule } from './../../pipes/pipes.module';
import { CustomViewServiceProvider } from './../../providers/custom-view-service/custom-view-service';
import { ComparisonServiceProvider } from './../../providers/comparison-service/comparison-service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeographicProfileViewPage } from './geographic-profile-view';

@NgModule({
  declarations: [
    GeographicProfileViewPage,
  ],
  imports: [
    IonicPageModule.forChild(GeographicProfileViewPage),PipesModule
  ], providers:[ 
    ComparisonServiceProvider,CustomViewServiceProvider]
})
export class GeographicProfileViewPageModule {}
