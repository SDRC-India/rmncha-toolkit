import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Legend } from './../../interface/legend';
import { Component, Input, OnDestroy } from '@angular/core';
import { LoadingController,Platform, AlertController } from 'ionic-angular';
import * as d3 from 'd3v4';
import * as topojson from 'topojson'



/**
 * Generated class for the MapViewChartComponent component.
 * This component will make the map view. 
 *
 */
@Component({
  selector: 'map-view-chart',
  templateUrl: 'map-view-chart.html'
})
export class MapViewChartComponent implements OnDestroy {

  @Input()
  mapJson: any;;

  @Input()
  areaCode:any;

  svg: any;
  projection: any;
  path: any;
  margin = { top: 40, right: 80, bottom: 60, left: 50 };
  gHeight=720;
  g: any;
  width: number;
  height: number;
  legends:Set<Legend>
  screenOrientationChange:any;


  constructor(private platform: Platform, private alertController: AlertController,
    private loadingController:LoadingController,private screenOrientation: ScreenOrientation) {
     this.screenOrientationChange= this.screenOrientation.onChange().subscribe(
        () => {
          setTimeout(() => {
            this.intializeMap();
            },200);
        }
     );
  }


  ngOnDestroy()
  {
    this.screenOrientationChange.unsubscribe();
  }

  ngOnInit()
  {
    this.intializeMap()
  }
  /**
   *  Will be called when the map will intialized
   * this method will create the svg root element of map and set the height and width of svg element
   * @memberof MapViewChartComponent
   */
  intializeMap() 
  {

    if(this.getKeys(this.mapJson).length)
    {
    this.legends=this.mapJson.get("legend");
      d3.selectAll('#map svg').remove();

   let loader= this.loadingController.create({spinner: 'hide',
   content: "Map loading is in progress please wait a while"});
   loader.present()
   .then(()=>
    {

      
      this.width = this.platform.width();
      this.height = this.platform.height();
      this.gHeight=720;
      this.gHeight=this.height>this.gHeight?this.gHeight:this.height;
      
      this.projection = d3.geoMercator();

      this.path = d3.geoPath()
        .projection(this.projection)

      this.svg = d3.select("#map").append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
    
      this.g = this.svg.append("g");

        // this.centerZoom(this.mapJson.get("mapJson"));
       this.drawMap(this.mapJson.get("mapJson"));
        // this.colorSubunits(subunits);
        loader.dismiss();
    });

    }
  }

  /**
   * This method will called when user will click on a particular area of map
   *
   * @private
   * @param {*} d => this will contain the slected area areaCode as ID_ and name as Name1_
   * @memberof MapViewChartComponent
   */
  private mapClick(d): void {
    let data: MapData = this.mapJson.get(d.properties.ID_);
    let message :string;
    let titles:string;
    if(data)
    {
      titles=data.area.areaname;
      message="Source  : " + data.src.sourceName +"<br>Timeperiod : " + data.tp + " <br>Value : " + data.value ;
    }

    else
    {
      titles=d.properties.NAME1_
      message="Data is not reported"
    }

    let alert = this.alertController.create({
      title: titles,
      enableBackdropDismiss: false,
      buttons: ['OK'],
      message: message
    });

    alert.present();
  }


  /**
   * This method will set the projection of map,draw the oaths and color the areas according to the score
   *
   * @param {*} data => selected area topojson for map draw
   * @returns
   * @memberof MapViewChartComponent
   */
  drawMap(data) {

    let o = topojson.mesh(data, data.objects[this.areaCode], (a, b) => {
      return a === b;
    });


    this.projection
      .scale(1)
      .translate([0, 0]);

    let b = this.path.bounds(o),
      s = 1 / Math.max((b[1][0] - b[0][0]) / this.width, (b[1][1] - b[0][1]) / this.gHeight),
      t = [(this.width - s * (b[1][0] + b[0][0])) / 2, ( this.gHeight - s * (b[1][1] + b[0][1])) / 2];

    this.projection
      .scale(s)
      .translate(t);


    let subunits = this.g.selectAll(".path")
      .data(topojson.feature(data, data.objects[this.areaCode]).features)
      .enter().append("path")
      .attr("d", this.path)
      .style("stroke", "#fff")
      .style("stroke-width", "0.5px") .attr("class", (d,) => {
        if(this.mapJson.has(d.properties.ID_))
         return this.mapJson.get(d.properties.ID_).cssClass

        else 
        return 'data-not-available';
      })
      .on("click", (d) =>
        this.mapClick(d)
      );
;

    return subunits;

  }

  getKeys(map){
    return Array.from(map.keys());
  }

}
