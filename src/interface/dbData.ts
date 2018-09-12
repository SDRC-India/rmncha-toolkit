/**
 * This interface is going to deal with pouchdb data document 
 * @author Ratikanta
 * @since 1.0.0
 * @interface IData
 */

interface IDBData{
    _id: string,
    area: IArea,
    below: any,
    indicator: IIndicator,
    ius: string,
    rank: number,
    src: ISource,
    subgrp: any,
    top: any,
    tp: string,
    trend: string,
    value: number,
    slugiddata: number,
    createdDate:string,
    lastModified:string,
    dKPIRSrs:boolean,
    dNITIRSrs:boolean,
    tps:string,
    dTHEMATICRSrs:boolean
}