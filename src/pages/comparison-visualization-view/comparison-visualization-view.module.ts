import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComparisonVisualizationViewPage } from './comparison-visualization-view';
import {ComparisonServiceProvider} from '../../providers/comparison-service/comparison-service'
import {PipesModule} from '../../pipes/pipes.module'
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ComparisonVisualizationViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ComparisonVisualizationViewPage),PipesModule,ComponentsModule
  ],
  providers: [ComparisonServiceProvider]
})
export class ComparisonVisualizationViewPageModule {}
