import { ComparisonServiceProvider } from './../../providers/comparison-service/comparison-service';
import { PipesModule } from './../../pipes/pipes.module';
import { NitiAyogServiceProvider } from './../../providers/niti-ayog-service/niti-ayog-service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NitiAyogIndicatorViewPage } from './niti-ayog-indicator-view';

@NgModule({
  declarations: [
    NitiAyogIndicatorViewPage,
  ],
  imports: [
    IonicPageModule.forChild(NitiAyogIndicatorViewPage),PipesModule
  ],
  providers: [NitiAyogServiceProvider,ComparisonServiceProvider]
})
export class NitiAyogIndicatorViewPageModule {}
