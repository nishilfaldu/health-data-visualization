/* eslint-disable @typescript-eslint/no-this-alias */
import * as d3 from "d3";

import { attributesInfo } from "./data";



export class Histogram {
  /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
  constructor(_config, _data, _attribute, _dataStore) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 300,
      containerHeight: _config.containerHeight || 200,
      margin: _config.margin || { top: 20, right: 30, bottom: 50, left: 50 },
    };
    this.data = _data;
    this.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "svg-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    this.brushedCounties = [];
    this.attribute = _attribute;

    this.dataStore = _dataStore;
    this.dataStore.subscribe(this);

    this.initVis();
  }

  /**
     * Initialize scales/axes and append static chart elements
     */
  initVis() {
    const vis = this;

    // Define size of SVG drawing area
    // vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    // vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
      .append("svg")
      .attr("width", vis.config.containerWidth + vis.config.margin.left + vis.config.margin.right)
      .attr("height", vis.config.containerHeight + vis.config.margin.top + vis.config.margin.bottom);

    // Append group element that will contain our actual chart (see margin convention) - ?
    vis.chart = vis.svg.append("g")
      .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Setup the scales with ranges
    vis.xScale = d3.scaleLinear()
      .range([0, vis.config.containerWidth]);

    vis.yScale = d3.scaleLinear()
      .range([vis.config.containerHeight, 0]);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append("g")
      .attr("transform", `translate(0,${vis.config.containerHeight})`);

    // Append y-axis group
    vis.yAxisG = vis.chart.append("g");

    // Append y-axis label
    vis.chart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - vis.config.margin.left)
      .attr("x", 0 - vis.config.containerHeight / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Counties");

    //   brush element
    vis.brushG = vis.chart.append("g").attr("class", "brush");

    //   brush
    vis.brush = d3
      .brushX()
      .extent([
        [0, 0],
        [vis.config.containerWidth, vis.config.containerHeight],
      ])
      .on("start", () => (vis.brushedCounties = []))
      .on("end", result => vis.brushed(result, vis));
  }

  /**
     * Prepare the data and scales before we render it.
     */
  updateVis(attribute) {
    const vis = this;

    vis.brushedData = this.data.filter(
      d =>
        d[this.attribute] != -1 &&
          (vis.brushedCounties.length == 0 ||
            (vis.brushedCounties.length != 0 &&
              vis.brushedCounties.find(
                country => country == d.cnty_fips
              )))
    );

    console.log(vis.brushedData, "brushedData");
    // Set the scale input domains
    vis.xScale.domain([0, d3.max(vis.brushedData, d => d[attribute])]);

    // console.log(vis.xScale.domain(), "domain");

    vis.histogram = d3.histogram()
      .value(d => d[attribute])
      .domain(vis.xScale.domain())
      .thresholds(vis.xScale.ticks(50));

    // console.log(vis.histogram);
    vis.bins = vis.histogram(vis.brushedData);

    vis.yScale.domain([0, d3.max(vis.bins, d => d.length)]);

    vis.renderVis(attribute);
  }

  /**
     * This function contains the D3 code for binding data to visual elements
     * Important: the chart is not interactive yet and renderVis() is intended
     * to be called only once; otherwise new paths would be added on top
     */
  renderVis(attribute) {
    const vis = this;

    // Set a label for x-axis
    vis.chart
      .selectAll("text.xLabel")
      .data([vis.attribute])
      .join("text")
      .attr("class", "xLabel")
      .attr(
        "transform",
        "translate(" +
          vis.config.containerWidth / 2 +
          " ," +
          (vis.config.containerHeight + 35) +
          ")"
      )
      .style("text-anchor", "middle")
      .text(attributesInfo[attribute].label);

    // console.log(vis.xScale(8));

    // Bind data to visual elements
    vis.chart
      .selectAll("rect.bar")
      .data(vis.bins)
      .join("rect")
      .attr("class", "bar")
      .attr("x", 1)
      .attr("transform", d => `translate(${vis.xScale(d.x0)}, ${vis.yScale(d.length)})`)
      .attr("width", d => vis.xScale(d.x1) - vis.xScale(d.x0))
      .attr("height", d => vis.config.containerHeight - vis.yScale(d.length))
      .style("fill", attributesInfo[attribute].color);

    //   tooltip functionality
    d3.selectAll("rect.bar")
      .on("mouseover", function (event, d) {
        d3.select(this).style("fill", "black");

        vis.tooltip.style("visibility", "visible")
          .html(
            "<strong>Number of Counties: </strong>" +
              d.length +
              "<br>" +
              "<strong>Range: </strong>" +
              d.x0 +
              " - " +
              d.x1
          )
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function() {
        d3.select(this).style("fill", attributesInfo[attribute].color);

        vis.tooltip.style("visibility", "hidden");
      })
      .on("mousemove", function() {
        vis.tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mousedown", function (event) {
        vis.chart
          .select(".overlay")
          .node()
          .dispatchEvent(
            new MouseEvent("mousedown", {
              bubbles: true,
              clientX: event.clientX,
              clientY: event.clientY,
              pageX: event.pageX,
              pageY: event.pageY,
              view: window,
              layerX: event.layerX,
              layerY: event.layerY,
              cancelable: true,
            })
          );
      });

    vis.brushG.call(vis.brush);

    // Update the axes
    vis.xAxisG.call(d3.axisBottom(vis.xScale));
    vis.yAxisG.call(d3.axisLeft(vis.yScale));
  }

  brushed(_res, _vis) {
    if (!_res.sourceEvent) { return; }

    const extent = _res.selection;

    if (!extent) {
      this.brushedCounties = [];
    } else {
      const range = [_vis.xScale.invert(extent[0]), _vis.xScale.invert(extent[1])];

      this.brushedCounties = this.data
        .filter(d => {
          const attrVal = d[this.attribute];

          return attrVal >= range[0] && attrVal <= range[1];
        })
        .map(d => d.cnty_fips);

      this.updateVis(this.attribute);
    }
    _vis.brushG.call(_vis.brush.move, null);
    // call update function here to change all visualizations
  }

  update(data) {
    this.data = data;
    this.updateVis(this.attribute);
  }
}
