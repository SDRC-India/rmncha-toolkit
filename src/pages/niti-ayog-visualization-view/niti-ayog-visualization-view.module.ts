import { ComponentsModule } from './../../components/components.module';
import { NitiAyogServiceProvider } from './../../providers/niti-ayog-service/niti-ayog-service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NitiAyogVisualizationViewPage } from './niti-ayog-visualization-view';

@NgModule({
  declarations: [
    NitiAyogVisualizationViewPage,
  ],
  imports: [
    IonicPageModule.forChild(NitiAyogVisualizationViewPage),ComponentsModule
  ],
  providers: [NitiAyogServiceProvider]
})
export class NitiAyogVisualizationViewPageModule {}
