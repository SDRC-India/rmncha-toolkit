/**
 * This is Snapshot indicator view page object interface
 * @author Ratikanta
 * @since 1.0.0
 * @interface ISIV
 */
interface ISIV{
    headerText: string;
    indicatorName: string;
    indicatorValue: number;
    rankingText:string;
    ranking: number;
    aboveAreaLevelLeft: string;
    belowAreaLevelLeft: string;
    aboveAreaLevelRight: string;
    belowAreaLevelRight: string;
    aboveAreaLevelNumber: number;
    belowAreaLevelNumber: number;
    barChartData: ISnapshotViewBarChartData[]

}