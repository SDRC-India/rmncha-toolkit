import { ComparisonServiceProvider } from './../../providers/comparison-service/comparison-service';
import { CustomViewServiceProvider } from './../../providers/custom-view-service/custom-view-service';
import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ThematicProfileViewPage } from './thematic-profile-view';

@NgModule({
  declarations: [
    ThematicProfileViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ThematicProfileViewPage),PipesModule
  ], providers:[ 
    ComparisonServiceProvider,CustomViewServiceProvider]
})
export class ThematicProfileViewPageModule {}
