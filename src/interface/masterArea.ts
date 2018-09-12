interface Area
{
    areaname: string;
    id: string;
    code: string;
    levels: number[];
    parentAreaCode: string;
    actAreaLevel : IAreaLevel;
    concatenedName?:string;
    checked?:boolean;
    slugidarea:number;
}