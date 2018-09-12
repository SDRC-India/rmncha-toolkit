import { CustomViewServiceProvider } from './../../providers/custom-view-service/custom-view-service';
import { ComparisonServiceProvider } from './../../providers/comparison-service/comparison-service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SnapshotViewPage } from './snapshot-view';
import { SnapshotServiceProvider } from '../../providers/snapshot-service/snapshot-service';
import {PipesModule} from '../../pipes/pipes.module'



@NgModule({
  declarations: [
    SnapshotViewPage,
  ],
  imports: [
    IonicPageModule.forChild(SnapshotViewPage),PipesModule
  ],
  providers: [
    SnapshotServiceProvider,ComparisonServiceProvider,CustomViewServiceProvider
  ]
})
export class SnapshotViewPageModule {}
