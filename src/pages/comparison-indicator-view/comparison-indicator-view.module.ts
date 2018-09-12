import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComparisonIndicatorViewPage } from './comparison-indicator-view';
import {ComparisonServiceProvider} from '../../providers/comparison-service/comparison-service'
import {PipesModule} from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    ComparisonIndicatorViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ComparisonIndicatorViewPage),PipesModule
  ],
  providers: [ComparisonServiceProvider]
})
export class ComparisonIndicatorViewPageModule {}
