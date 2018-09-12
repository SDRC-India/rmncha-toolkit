/**
 * This is area interface
 * @author Ratikanta
 * @since 1.0.0
 * @interface IArea
 */
interface IArea{
    id: string,
    areaname: string
    code : string,
    ccode : string,
    actAreaLevel : IAreaLevel,
    parentAreaCode: string,
    slugidarea: number
    levels: number[];
    createdDate:string;
    lastModified:string;
    concatenedName?:string;
    checked?:boolean;
}