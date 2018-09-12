import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComparisonViewPage } from './comparison-view';
import {ComparisonServiceProvider} from '../../providers/comparison-service/comparison-service'
import {PipesModule} from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    ComparisonViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ComparisonViewPage),PipesModule
  ],
 
  providers: [ComparisonServiceProvider]
})
export class ComparisonViewPageModule {}
