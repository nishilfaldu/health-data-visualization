/* eslint-disable @typescript-eslint/no-this-alias */
import * as d3 from "d3";

import { attributesInfo } from "./data";



export class Scatterplot {
  /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 450,
      containerHeight: _config.containerHeight || 200,
      margin: _config.margin || { top: 20, right: 50, bottom: 50, left: 65 },
    };
    this.data = _data;
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
      .style("fill", "#69b3a2");

    // Update the axes
    vis.xAxisG.call(d3.axisBottom(vis.xScale));
    vis.yAxisG.call(d3.axisLeft(vis.yScale));
  }
}
