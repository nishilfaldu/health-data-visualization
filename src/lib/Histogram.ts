/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from "d3";



export class Histogram {
  private config: {
    parentElement: string;
    containerWidth: number;
    containerHeight: number;
    margin: { top: number; bottom: number; right: number; left: number };
  };
  private svg: any;
  private xScale: any;
  private yScale: any;
  private data: any;
  //   private yScaleIncome: d3.ScaleLinear<number, number, never>;
  //   private yScaleEducation: d3.ScaleLinear<number, number, never>;

  constructor(_config: { parentElement: string; containerWidth?: number;
    containerHeight?: number; url: string; xAttribute: string; yAttribute: string;}) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 10, bottom: 30, right: 10, left: 30 },
    };

    // Call a class function
    this.loadData(_config.url).then(data => this.initVis(data, _config.xAttribute, _config.yAttribute));
  }

  initVis(data: any, xAttribute: string, yAttribute: string) {
    // Define the dimensions and margins for the SVG
    const width = this.config.containerWidth - this.config.margin.left - this.config.margin.right;
    const height = this.config.containerHeight - this.config.margin.top - this.config.margin.bottom;

    // Create the SVG container
    this.svg = d3.select(this.config.parentElement)
      .append("svg")
      .attr("width", this.config.containerWidth)
      .attr("height", this.config.containerHeight)
      .append("g")
      .attr("transform", `translate(${this.config.margin.left},${this.config.margin.top})`);

    // Define scales
    this.xScale = d3.scaleBand()
      .domain(data.map(d => d[xAttribute][0]))
      .range([0, width])
      .padding(0.4);

    this.yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => +d[yAttribute])])
      .range([height, 0]);

    // Create the axes
    const xAxis = d3.axisBottom(this.xScale);
    const yAxis = d3.axisLeft(this.yScale);

    this.svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    this.svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis);

    // Add labels
    this.svg.append("text")
      .attr("class", "x-axis-label")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width / 2}, ${height + this.config.margin.top + 20})`)
      .text("State");

    this.svg.append("text")
      .attr("class", "y-axis-label")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(-20, ${height / 2}) rotate(-90)`)
      .text("Median Household Income");
  }

  updateVis(data: any, xAttribute: string, yAttribute: string) {
    if(!data) { throw new Error("No data provided"); }
    // // Update domain of scales
    // console.log("here");
    this.xScale.domain(data.map(d => d[xAttribute]));
    this.yScale.domain([0, d3.max(data, d => +d[yAttribute])]);


    // // Initialize axes
    // const xAxis = d3.axisBottom(this.xScale);
    // const yAxis = d3.axisLeft(this.yScale);


    // // Draw axes
    // const xAxisGroup = this.svg.append("g")
    //   .attr("class", "x-axis")
    // //   .attr("transform", `translate(0, ${this.config.containerHeight - this.config.margin.bottom})`)
    //   .call(xAxis);

    // const yAxisGroup = this.svg.append("g")
    //   .attr("class", "axis y-axis")
    // //   .attr("transform", "translate(0, 0)")
    //   .call(yAxis);

    // // Add rectangles
    // const bars = this.svg.selectAll("rect")
    //   .data(data)
    //   .enter()
    //   .append("rect")
    //   .attr("class", "bar")
    //   .attr("fill", "steelblue");
  }

  loadData(url: string) {
    if(!url) { throw new Error("No data url provided"); }

    d3.csv(url).then(data => { this.data = data; });

    return d3.csv(url);
  }
}
