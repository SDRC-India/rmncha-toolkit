import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomViewDataTablePage } from './custom-view-data-table';
import { CustomViewServiceProvider } from '../../providers/custom-view-service/custom-view-service';
import {PipesModule} from '../../pipes/pipes.module'
import { ConstantServiceProvider } from '../../providers/constant-service/constant-service';

@NgModule({
  declarations: [
    CustomViewDataTablePage,
  ],
  imports: [
    IonicPageModule.forChild(CustomViewDataTablePage),PipesModule
  ], providers:[ 
    CustomViewServiceProvider,ConstantServiceProvider]
})
export class CustomViewDataTablePageModule {}
