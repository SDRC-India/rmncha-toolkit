import { CustomViewServiceProvider } from './../../providers/custom-view-service/custom-view-service';
import { ComparisonServiceProvider } from './../../providers/comparison-service/comparison-service';
import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataRepositoryPage } from './data-repository';

@NgModule({
  declarations: [
    DataRepositoryPage,
  ],
  imports: [
    IonicPageModule.forChild(DataRepositoryPage),PipesModule
  ], providers:[ 
    ComparisonServiceProvider,CustomViewServiceProvider]
})
export class DataRepositoryPageModule {}
