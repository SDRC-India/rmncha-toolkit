import { UtilServiceProvider } from './../../providers/util-service/util-service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Component, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { Platform, Alert, AlertController } from 'ionic-angular';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';


/**
 *
 * @author Harsh Pratyush (harsh@sdrc.co.in)
 * @export
 * @class SnapshotViewLineChartComponent
 */
@Component({
  selector: 'snapshot-view-line-chart',
  templateUrl: 'snapshot-view-line-chart.html'
})
export class SnapshotViewLineChartComponent implements OnDestroy{

  @Input() MultiLineChartData: MultiLineChart[];

  title: string = 'D3.js with Angular 2!';
  subtitle: string = 'Multi-Series Line Chart';

  data: any[];
  datas: Set<String>

  svg: any;
  margin = { top: 40, right: 80, bottom: 60, left: 80 };
  g: any;
  width: number;
  height: number;
  x;
  y;
  z;
  line;
  screenOrientationChange:any;

  constructor(private platform: Platform, 
    private alertController: AlertController,private screenOrientation:ScreenOrientation,private utilServiceProvider:UtilServiceProvider) {
    this.screenOrientationChange=this.screenOrientation.onChange().subscribe(
      () => {
        setTimeout(() => {
        this.initChart();
        this.drawAxis();
        this.drawPath();
  
        },200);
      }
   );
  }

      /**
   *
   *
   * @memberof MapViewChartComponent
   */
  ngOnDestroy()
  {

    this.screenOrientationChange.unsubscribe();
  
  }
  
  ngOnInit() {

    this.datas = new Set();

    this.MultiLineChartData.map((v) => v.values.map((v) => this.datas.add(v.axis)));
    this.data = Array.from(this.datas)
    this.data.sort(this.utilServiceProvider.sortMonthlyArray);
    this.initChart();
    this.drawAxis();
    this.drawPath();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.datas = new Set();

    this.MultiLineChartData.map((v) => v.values.map((v) => this.datas.add(v.axis)));
    this.data = Array.from(this.datas)

    this.data.sort(this.utilServiceProvider.sortMonthlyArray)

    // this.data.reverse();
    // this.data=this.data.splice(0,6);
    // this.data.reverse();




    //.reduce((a, b) => a.concat(b), []);
    this.initChart();
    this.drawAxis();
    this.drawPath();
  }

  private initChart(): void {
    d3.selectAll('#lineChart svg').remove();
    this.svg = d3.select("#lineChart").append("svg")
      .attr("width", this.platform.width())
      .attr("height", "400");

    this.width = this.svg.attr("width") - this.margin.left - this.margin.right;
    this.height = this.svg.attr("height") - this.margin.top - this.margin.bottom;

    this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.x = d3Scale.scaleBand().range([0, this.width]).padding(1.2);
    this.y = d3Scale.scaleLinear().range([this.height, 0])
    this.z = d3Scale.scaleOrdinal(['#717171']);

    this.line = d3Shape.line()
      .x((d: any) => this.data.indexOf(d.axis) > -1 ? this.x(d.axis) : null)
      .y((d: any) => this.data.indexOf(d.axis) > -1 ? this.y(d.value) : null)


    this.x.domain(this.data);

    this.y.domain([
      0,
      5 + d3Array.max(this.MultiLineChartData, function (c) { return d3Array.max(c.values, function (d) { return parseFloat(d.value.toString()); }); })
    ]);

    this.z.domain(this.MultiLineChartData.map(function (c) { return c.id; }));
  }

  private drawAxis(): void {
    this.g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3Axis.axisBottom(this.x))
      .selectAll("text")
      .attr("font-size", "9px")
      .attr("transform", "rotate(-35)")
      .attr("dx", "-1.0em")
      .attr("dy", "9")
      .append("text")
      .attr("transform", "rotate(0)")
      .attr("x", this.width)
      .attr("dx", "2.0em")
      .attr("dy", "1.5em")
      .attr("fill", "#000")
      .text("Timperiod");;

    this.g.append("g")
      .attr("class", "axis axis--y")
      .call(d3Axis.axisLeft(this.y))
      .selectAll("text")
      .attr("font-size", "10px")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Value");
  }

  private drawPath(): void {
    // add the X gridlines
    this.g.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.make_x_gridlines()
        .tickSize(-this.height).tickFormat(null)
      ).selectAll("text").remove();

    // add the Y gridlines
    this.g.append("g")
      .attr("class", "grid")
      .call(this.make_y_gridlines()
        .tickSize(-this.width).tickFormat(null)
      ).selectAll("text").remove();

    let area = this.g.selectAll(".area")
      .data(this.MultiLineChartData)
      .enter().append("g")
      .attr("class", "area");

    area.append("path")
      .attr("class", "line")
      .attr("d", (d) => this.line(d.values))
      .attr("class", (d) => d.values[0].class)


    area.selectAll("g.dot")
      .data(this.MultiLineChartData)
      .enter().append("g")
      .attr("class", "dot")
      .selectAll("circle")
      .data(function (d) { return d.values; })
      .enter().append("circle")
      .attr("r", (d, i) => this.data.indexOf(d.axis) > -1 ? 4 : 0)
      .attr('class', function (d) { return d.class + "_dot" })
      .attr("cx", (d, i) => this.data.indexOf(d.axis) > -1 ? this.x(d.axis) : null)
      .attr("cy", (d, i) => this.data.indexOf(d.axis) > -1 ? this.y(d.value) : null)
      .on("click", (d) =>
        this.dotClick(d)
      );




    if (this.MultiLineChartData.length == 1) {
      area.selectAll("g.value")
        .data(this.MultiLineChartData)
        .enter().append("g")
        .attr("class", "value")
        .selectAll("circle")
        .data(function (d) { return d.values; })
        .enter().append("text")
        .attr("x", (d) => this.x(d.axis))
        .attr("y", (d) => this.y(d.value))
        .attr("dx", "0.3em")
        .attr("dy", "1.35em")
        .attr("font-size", "8px")
        .text(function (d) { return d.value; });
    }


  }

  defined(): boolean {
    return true;
  }

  // gridlines in x axis function
  make_x_gridlines() {
    return d3Axis.axisBottom(this.x)
      .ticks(5)
  }

  // gridlines in y axis function
  make_y_gridlines() {
    return d3Axis.axisLeft(this.y)
      .ticks(5)
  }

  private dotClick(d): void {
    let alert = this.alertController.create({
      title: d.zaxis,
      enableBackdropDismiss: false,
      buttons: ['OK'],
      message: "Timeperiod : " + d.axis + " <br>Value : " + d.value
    });

    alert.present();
  }


}
