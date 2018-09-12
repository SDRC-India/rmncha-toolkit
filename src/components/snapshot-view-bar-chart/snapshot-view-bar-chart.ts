import { UtilServiceProvider } from './../../providers/util-service/util-service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Component, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";


@Component({
  selector: 'snapshot-view-bar-chart',
  templateUrl: 'snapshot-view-bar-chart.html'
})
export class SnapshotViewBarChartComponent implements OnDestroy {

  @Input()
  barChartData: LineChart[]

  @Input()
  indicatorType: String

  title = 'D3.js with Ionic 2!';

  width: number;
  height: number;
  margin = { top: 40, right: 50, bottom: 60, left: 80 };

  x: any;
  y: any;
  svg: any;
  g: any;

  data: any;

  screenOrientationChange:any 

  constructor(private alertController: AlertController,
    private platform: Platform,private screenOrientation: ScreenOrientation,private utilServiceProvider:UtilServiceProvider) {

    this.screenOrientationChange=this.screenOrientation.onChange().subscribe(
      () => {
        setTimeout(() => {
          this.initSvg()
          this.initAxis();
          this.drawAxis();
          this.drawBars();
        },200);
      }
   );
  }

  ngOnDestroy()
  {
    this.screenOrientationChange.unsubscribe();
  }

  ngOnInit() {
    this.initSvg()
    this.initAxis();
    this.drawAxis();
    this.drawBars();
  }

  ngOnChanges(changes: SimpleChanges)
  {
    this.initSvg()
    this.initAxis();
    this.drawAxis();
    this.drawBars();
  }

  initSvg() {
    this.width = this.platform.width() - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;

    d3.selectAll('#barChart svg').remove();
    this.svg = d3.select("#barChart")
      .append("svg")
      .attr("width", this.platform.width())
      .attr("height", '400')

    this.data = this.barChartData.map((d) => d.axis);
    this.data.sort(this.utilServiceProvider.sortMonthlyArray);
    this.g = this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  initAxis() {
    this.x = d3Scale.scaleBand().range([0, this.width]).padding(0.6);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(this.data);
    this.y.domain([0, d3Array.max(this.barChartData, (d) => parseFloat(d.value.toString()))]);

  }

  drawAxis() {
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
      .call(d3Axis.axisLeft(this.y).ticks(10))
      .append("text").text("Value")
      .attr("font-size", "9px")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Value");
  }

  drawBars() {
    this.g.selectAll(".bar")
      .data(this.barChartData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d) => this.x(d.axis))
      .attr("y", (d) => this.y(d.value))
      .attr("width", this.x.bandwidth())
      .attr("class", this.indicatorType)
      .attr("opacity", 0.7)
      .attr("height", (d) => this.height - this.y(d.value))
      .on("click", (d) =>
        this.barClick(d)
      );
  }

  private barClick(d): void {
    let alert = this.alertController.create({
      title: d.zaxis,
      enableBackdropDismiss: false,
      buttons: ['OK'],
      message: "Timeperiod : " + d.axis + " <br>Value : " + d.value
    });

    alert.present();
  }

}
