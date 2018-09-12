import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomViewVisualizationViewPage } from './custom-view-visualization-view';
import { CustomViewServiceProvider } from '../../providers/custom-view-service/custom-view-service';
import { ConstantServiceProvider } from '../../providers/constant-service/constant-service';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CustomViewVisualizationViewPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomViewVisualizationViewPage),ComponentsModule
  ],providers:[ 
    CustomViewServiceProvider,ConstantServiceProvider]
})
export class CustomViewVisualizationViewPageModule {

}
