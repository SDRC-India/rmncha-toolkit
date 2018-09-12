import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComparisonViewPopoverPage } from './comparison-view-popover';

@NgModule({
  declarations: [
    ComparisonViewPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(ComparisonViewPopoverPage),
  ],
})
export class ComparisonViewPopoverPageModule {}
