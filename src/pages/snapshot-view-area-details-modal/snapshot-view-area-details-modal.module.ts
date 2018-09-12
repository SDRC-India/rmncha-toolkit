import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SnapshotViewAreaDetailsModalPage } from './snapshot-view-area-details-modal';

@NgModule({
  declarations: [
    SnapshotViewAreaDetailsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(SnapshotViewAreaDetailsModalPage),
  ],
})
export class SnapshotViewAreaDetailsModalPageModule {}
