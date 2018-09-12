import { Component, Input } from '@angular/core';

/**
 * Generated class for the SnapshotViewTabularViewComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'snapshot-view-tabular-view',
  templateUrl: 'snapshot-view-tabular-view.html'
})
export class SnapshotViewTabularViewComponent {

  @Input() tableData: ITableData[]

  text: string;

  constructor() {
    console.log('Hello SnapshotViewTabularViewComponent Component');
    this.text = 'Hello World';
  }

}
