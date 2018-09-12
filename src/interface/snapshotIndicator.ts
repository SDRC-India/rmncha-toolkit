interface ISnapshotIndicator{
  indicator: IIndicator;
  area:IArea;
  value: number;
  source: ISource;
  timePeriod: string;
  trend: string;
  theme:string;
  unit: string,
  rank: number,
  top: any[],
  below: any[] 
  indicatorData:IDBData[]
}
