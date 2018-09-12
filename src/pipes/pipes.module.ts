import { NgModule } from '@angular/core';
import { ComparisonViewAreaFilterPipe } from './comparison-view-area-filter/comparison-view-area-filter';
import { ComparisonViewDataSearchPipe } from './comparison-view-data-search/comparison-view-data-search';
import { SnapshotViewDataSearchPipe } from './snapshot-view-data-search/snapshot-view-data-search';
import { IndicatorSectorWiseFilterPipe } from './indicator-sector-wise-filter/indicator-sector-wise-filter';
import { SearchIndicatorPipe } from './search-indicator/search-indicator';
import { SearchAreasPipe } from './search-areas/search-areas';
import { NitiAyogDataSearchPipe } from './niti-ayog-data-search/niti-ayog-data-search';
@NgModule({
	declarations: [ComparisonViewAreaFilterPipe,
    ComparisonViewDataSearchPipe,
    SnapshotViewDataSearchPipe,
    IndicatorSectorWiseFilterPipe,
    SearchIndicatorPipe,
    SearchAreasPipe,
    NitiAyogDataSearchPipe],
	imports: [],
	exports: [ComparisonViewAreaFilterPipe,
    ComparisonViewDataSearchPipe,
    SnapshotViewDataSearchPipe,
    IndicatorSectorWiseFilterPipe,
    SearchIndicatorPipe,
    SearchAreasPipe,
    NitiAyogDataSearchPipe]
})
export class PipesModule {}
