import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SnapshotIndicatorViewPage } from './snapshot-indicator-view';
import { ComponentsModule } from '../../components/components.module';
import { SnapshotServiceProvider } from '../../providers/snapshot-service/snapshot-service';


@NgModule({
  declarations: [
    SnapshotIndicatorViewPage    
  ],
  imports: [
    IonicPageModule.forChild(SnapshotIndicatorViewPage),
    ComponentsModule
  ],
  providers:[SnapshotServiceProvider]
})
export class SnapshotIndicatorViewPageModule {}
