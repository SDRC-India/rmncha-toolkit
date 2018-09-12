import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { ConstantServiceProvider } from '../../providers/constant-service/constant-service';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  providers:[ConstantServiceProvider]
})
export class HomePageModule {}
