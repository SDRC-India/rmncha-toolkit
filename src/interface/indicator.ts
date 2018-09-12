interface IIndicator{
    id: string,
    iName: string,
    sc: any,
    kpi: boolean,
    national: any,
    state: any,
    district: any,
    unit: any,
    highisgood: any,
    recSector: ISector,
    subgroup: any,
    slugidindicator: number,
    createdDate:string,
    lastModified:string
    nucolor:boolean,
    nitiaayog:boolean,
    checked?:boolean,
    thematicKpi:boolean,
    ssv:boolean,
    hmis:boolean,
    thematicNational:any,
    thematicState:any,
    thematicDistrict:any

}