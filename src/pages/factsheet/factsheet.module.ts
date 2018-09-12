import { FactsheetServiceProvider } from '../../providers/factsheet/factsheet-service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FactsheetPage } from './factsheet';

@NgModule({
  declarations: [
    FactsheetPage,
  ],
  imports: [
    IonicPageModule.forChild(FactsheetPage),
  ],providers:[ 
    FactsheetServiceProvider]
})
export class FactsheetPageModule {}
