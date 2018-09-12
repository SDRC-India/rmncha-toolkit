import { NgModule } from '@angular/core';
import { SnapshotViewBarChartComponent } from './snapshot-view-bar-chart/snapshot-view-bar-chart';
import { SnapshotViewLineChartComponent } from './snapshot-view-line-chart/snapshot-view-line-chart';
import { SnapshotViewTabularViewComponent } from './snapshot-view-tabular-view/snapshot-view-tabular-view';
import { SnapshotViewMapViewComponent } from './snapshot-view-map-view/snapshot-view-map-view';
import { MultiBarChartComponent } from './multi-bar-chart/multi-bar-chart';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { MapViewChartComponent } from './map-view-chart/map-view-chart';

@NgModule({
	declarations: [SnapshotViewBarChartComponent,
    SnapshotViewLineChartComponent,
    SnapshotViewTabularViewComponent,
    SnapshotViewMapViewComponent,
    MultiBarChartComponent,
    MapViewChartComponent],
	imports: [CommonModule,
        IonicModule],
	exports: [SnapshotViewBarChartComponent,
    SnapshotViewLineChartComponent,
    SnapshotViewTabularViewComponent,
    SnapshotViewMapViewComponent,
    MultiBarChartComponent,
    MapViewChartComponent]
})
export class ComponentsModule {}
