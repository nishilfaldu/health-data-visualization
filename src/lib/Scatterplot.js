/* eslint-disable @typescript-eslint/no-this-alias */
import * as d3 from "d3";

import { attributesInfo } from "./data";



export class Scatterplot {
  /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
  constructor(_config, _data, _xAttribute, _yAttribute, _dataStore) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 450,
      containerHeight: _config.containerHeight || 200,
      margin: _config.margin || { top: 20, right: 50, bottom: 50, left: 65 },
    };
    this.data = _data;
    this.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "svg-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    this.brushedCounties = [];
    this.xAttribute = _xAttribute;
    this.yAttribute = _yAttribute;

    this.dataStore = _dataStore;
    this.dataStore.subscribe(this);

    this.initVis();
  }

  /**
     * Initialize scales/axes and append static chart elements
     */
  initVis() {
    const vis = this;

    // vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    // vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
      .append("svg")
      .attr("width", vis.config.containerWidth + vis.config.margin.left + vis.config.margin.right)
      .attr("height", vis.config.containerHeight + vis.config.margin.top + vis.config.margin.bottom);

    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append("g")
      .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.xScale = d3.scaleLinear()
      .range([0, vis.config.containerWidth]);

    vis.yScale = d3.scaleLinear()
      .range([vis.config.containerHeight, 0]);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append("g")
      .attr("transform", `translate(0,${vis.config.containerHeight})`);

    // Append y-axis group
    vis.yAxisG = vis.chart.append("g");

    vis.brushG = vis.chart.append("g").attr("class", "brush");

    vis.brush = d3
      .brush()
      .extent([
        [0, 0],
        [vis.config.containerWidth, vis.config.containerHeight],
      ])
      // Reset the filtered counties
      .on("start", () => (vis.brushedCounties = []))
      .on("end", result => vis.brushed(result, vis));
  }

  /**
     * Prepare the data and scales before we render it.
     */
  updateVis(xAttribute, yAttribute) {
    const vis = this;

    // Set the scale input domains
    vis.xScale.domain([0, d3.max(vis.data, d => d[xAttribute])]);
    vis.yScale.domain([0, d3.max(vis.data, d => d[yAttribute])]);

    // Append y-axis label
    vis.chart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - vis.config.margin.left)
      .attr("x", 0 - vis.config.containerHeight / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(attributesInfo[yAttribute].label);

    // Set a label for x-axis
    vis.chart
      .selectAll("text.xLabel")
      .data([vis.attributeName])
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
      .text(attributesInfo[xAttribute].label);

    vis.renderVis(xAttribute, yAttribute);
  }

  /**
     * This function contains the D3 code for binding data to visual elements
     * Important: the chart is not interactive yet and renderVis() is intended
     * to be called only once; otherwise new paths would be added on top
     */
  renderVis(xAttribute, yAttribute) {
    const vis = this;

    vis.chart
      .selectAll("circle.pt")
      .data(vis.data)
      .join("circle")
      .attr("class", "pt")
      .attr("cx", d => vis.xScale(d[xAttribute]))
      .attr("cy", d => vis.yScale(d[yAttribute]))
      .attr("r", 3)
      .style("fill", `color-mix(in srgb, ${attributesInfo[xAttribute].color}, ${attributesInfo[yAttribute].color}`)
      .style("fill-opacity", d =>
        (
          vis.brushedCounties.length !== 0 ?
            (vis.brushedCounties.find(
              county => county == d.cnty_fips
            ) ? 1 : 0.1) : 1
        )
      );


    // tooltip functionality
    d3.selectAll("circle.pt")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration("50")
          .attr("r", 6)
          .style("fill", "black");
        vis.tooltip
          .style("visibility", "visible")
          .html(
            `<div>County: ${d["display_name"]}</div>
                 <span>${attributesInfo[xAttribute].label}: ${d[xAttribute]}</span>
                 <span>${attributesInfo[yAttribute].label}: ${d[yAttribute]}</span>`
          )
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mousemove", function() {
        vis.tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration("50")
          .attr("r", 3)
          .style("fill", `color-mix(in srgb, ${attributesInfo[xAttribute].color}, ${attributesInfo[yAttribute].color}`);
        vis.tooltip.style("visibility", "hidden");
      }).on("mousedown", function (event) {
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


    // Update the axes
    vis.xAxisG.call(d3.axisBottom(vis.xScale));
    vis.yAxisG.call(d3.axisLeft(vis.yScale));

    vis.brushG.call(vis.brush);
  }

  brushed(_res, _vis) {
    if (!_res.sourceEvent) { return; } // Only transition after input

    const extent = _res.selection;

    if (!extent) {
      // Reset the counties filter (include them all)
      this.brushedCounties = [];
    } else {
      // Filter the counties
      const xRange = [_vis.xScale.invert(extent[0][0]), _vis.xScale.invert(extent[1][0])];
      const yRange = [_vis.yScale.invert(extent[1][1]), _vis.yScale.invert(extent[0][1])];

      this.brushedCounties = this.data
        .filter(d => {
          const attribute1 = d[this.xAttribute];
          const attribute2 = d[this.yAttribute];

          return (
            attribute2 >= yRange[0] &&
            attribute2 <= yRange[1] &&
            attribute1 >= xRange[0] &&
            attribute1 <= xRange[1]
          );
        })
        .map(d => d.cnty_fips);

      // update data in datastore
      this.dataStore.updateData(this.brushedCounties);

      this.updateVis(this.xAttribute, this.yAttribute);
    }
    _vis.brushG.call(_vis.brush.move, null);
  }

  update(data) {
    this.brushedCounties = data;
    this.updateVis(this.xAttribute, this.yAttribute);
  }
}
