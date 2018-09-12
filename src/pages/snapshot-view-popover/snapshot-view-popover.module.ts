import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SnapshotViewPopoverPage } from './snapshot-view-popover';

@NgModule({
  declarations: [
    SnapshotViewPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(SnapshotViewPopoverPage),
  ],
})
export class SnapshotViewPopoverPageModule {}
