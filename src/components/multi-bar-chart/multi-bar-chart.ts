import { UtilServiceProvider } from './../../providers/util-service/util-service';
import { Component, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { ScreenOrientation } from '@ionic-native/screen-orientation';


/**
 * This will make the multi bar chart 
 * @author Harsh Pratyush (harsh@sdrc.co.in)
 * @export
 * @class MultiBarChartComponent
 * 
 */
@Component({
  selector: 'multi-bar-chart',
  templateUrl: 'multi-bar-chart.html'
})
export class MultiBarChartComponent implements OnDestroy{

  @Input() MultiLineChartData: MultiLineChart[];

  data: any[];
  datas: Set<String>;
  areaSet:Set<String>
  areas: any;
  svg: any;
  xAxisSvg: any;
  xAxisDom: any;
  margin = {top: 20, right: 80, bottom: 30, left: 50};
  g: any;
  width: number;
  height: number;
  x;
  y;
  z;
  x1;
  line;
  color;
  legendSvg: any;
  screenOrientationChange:any;


  /**
   *
   * This method will be called when a bar will be cliked
   * @private
   * @param {*} d => contains data of clicked bar
   * @memberof MultiBarChartComponent
   */
  private barClick(d): void {
    let alert = this.alertController.create({
      title: d.zaxis,
      enableBackdropDismiss: false,
      buttons: ['OK'],
      message: "Timeperiod : " + d.axis + " <br>Value : " + d.value
    });

    alert.present();
  }

  constructor(private platform: Platform, private alertController: AlertController,private screenOrientation: ScreenOrientation
  ,private utilServiceProvider:UtilServiceProvider) {
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

  ngOnDestroy()
  {
    this.screenOrientationChange.unsubscribe();
  }

  /**
   *
   * This method will be called when there is any changes in @Input feilds to redraw the bars
   * @param {SimpleChanges} changes
   * @memberof MultiBarChartComponent
   */
  ngOnChanges(changes: SimpleChanges)
  {
    this.datas = new Set();

    this.MultiLineChartData.map((v) => v.values.map((v) => this.datas.add(v.axis)));
    this.data = Array.from(this.datas)
    this.data.sort(this.utilServiceProvider.sortMonthlyArray)
    this.areaSet = new Set();

    this.MultiLineChartData.map((v) => v.values.map((v) => this.areaSet.add(v.class)));

    this.areas = Array.from(this.areaSet);
    this.initChart();
    this.drawAxis();
    this.drawPath();
  }

  

  /**
   *  Will be called when the bar-chart will intialized
   * @memberof MultiBarChartComponent
   */
  ngOnInit() {
    this.datas = new Set();

    this.MultiLineChartData.map((v) => v.values.map((v) => this.datas.add(v.axis)));
    this.data = Array.from(this.datas)
    this.data.sort(this.utilServiceProvider.sortMonthlyArray)
    this.areaSet = new Set();

    this.MultiLineChartData.map((v) => v.values.map((v) => this.areaSet.add(v.class)));

    this.areas = Array.from(this.areaSet);
    this.initChart();
    this.drawAxis();
    this.drawPath();
  }


  /**
   *this method will create the svg root element of bar and set the height and width of svg element and 
   * define the x-axis and y-axis
   * @private
   * @memberof MultiBarChartComponent
   */
  private initChart(): void {
    d3.selectAll('#MulbarChart svg').remove();
    d3.selectAll('#xaxis svg').remove();
    this.svg = d3.select("#MulbarChart").append("svg")
      .attr("width", this.platform.width() - this.margin.left)
      .attr("height",this.data.length>1? (this.platform.height() ): 350);

    this.xAxisSvg = d3.select('#xaxis').append('svg')
      .attr("width", this.platform.width() - this.margin.left)
      .attr("height", 20)


    this.width = this.svg.attr("width") - this.margin.right
    this.height = this.svg.attr("height");

    this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + 5 + ")");

    this.xAxisDom = this.xAxisSvg.append("g").attr("transform", "translate(" + (this.margin.left) + "," + 1 + ")");

    this.x = d3Scale.scaleLinear().range([0, this.width])
    this.x1 = d3Scale.scalePoint().range([1, this.MultiLineChartData.length]);
    this.y = d3Scale.scaleBand().range([this.height, 0]);
    this.color = d3Scale.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888"]);

    this.y.domain(this.data);
    this.x1.domain(this.areas);
    this.x.domain([0,
      5+d3Array.max(this.MultiLineChartData, function (c) { return d3Array.max(c.values, function (d) { return parseFloat(d.value.toString()); }); })
    ]);
  }

  /**
   *
   * This method will draw the axis of chart
   * @private
   * @memberof MultiBarChartComponent
   */
  private drawAxis(): void {

    this.xAxisDom.append("g")
      .attr("class", "axis axis--x")
      .call(d3Axis.axisBottom(this.x))
      .attr('style', 'overflow:auto;')
      .selectAll("text")
      .attr("font-size", "10px")



    this.g.append("g")
      .attr("class", "axis axis--y")
      .call(d3Axis.axisLeft(this.y))
      .selectAll("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -16)
      .attr("x", 23)
      .attr("dy", "0em")
      .attr("font-size", "10px")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("dx", this.width + 3)
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")


  }

  /**
   * This method will draw the chart and add the colors to it
   *
   * @private
   * @memberof MultiBarChartComponent
   */
  private drawPath(): void {


    let bar = this.g.selectAll(".area")
      .data(this.MultiLineChartData)
      .enter().append("g")
      .attr("class", "g");


    bar.selectAll("rect")
      .data(function (d, i) { return d.values; })
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 1)
      .attr("height", this.y.bandwidth() / (this.MultiLineChartData.length + 2))
      .attr("y", (d) => (this.y(d.axis) + (this.x1(d.class) * (this.y.bandwidth() / (this.MultiLineChartData.length + 2)))))
      .attr("width", (d) => this.data.indexOf(d.axis) > -1 ? this.x(d.value) : 0)
      .attr("class", function (d) { return d.class })
      .on("click", (d) =>
        this.barClick(d)
      )


  }



}
