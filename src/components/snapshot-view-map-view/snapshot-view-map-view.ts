import { Component } from '@angular/core';

/**
 * Generated class for the SnapshotViewMapViewComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'snapshot-view-map-view',
  templateUrl: 'snapshot-view-map-view.html'
})
export class SnapshotViewMapViewComponent {

  text: string;

  constructor() {
    console.log('Hello SnapshotViewMapViewComponent Component');
    this.text = 'Hello World';
  }

}
