/* eslint-disable @typescript-eslint/no-this-alias */
import * as d3 from "d3";
import * as topojson from "topojson-client";



export class ChoroplethMap {
//   /**
//      * Class constructor with basic chart configuration
//      * @param {Object}
//      * @param {Array}
//      */
  constructor(_config, _geoData, _num, _attribute) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 1000,
      containerHeight: _config.containerHeight || 1000,
      margin: _config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
    };

    this.us = _geoData;

    this.number = _num;
    this.attribute = _attribute;

    this.active = d3.select(null);
    this.initVis();
  }

  /**
     * Initialize scales/axes and append static chart elements
     */
  initVis() {
    const vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement).append("svg")
      .attr("class", "center-container")
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    vis.projection = d3
      .geoAlbersUsa()
      .translate([vis.width / 2, vis.height / 2])
      .scale(vis.width);

    vis.path = d3.geoPath().projection(vis.projection);

    vis.g = vis.svg
      .append("g")
      .attr(
        "transform",
        "translate(" +
          vis.config.margin.left +
          "," +
          vis.config.margin.top +
          ")"
      )
      .attr(
        "width",
        vis.width + vis.config.margin.left + vis.config.margin.right
      )
      .attr(
        "height",
        vis.height + vis.config.margin.top + vis.config.margin.bottom
      );

    vis.svg
      .append("path")
      .datum(topojson.mesh(vis.us, vis.us.objects.states, (a, b) => a !== b))
      .attr("id", "state-borders")
      .attr("d", vis.path)
      .attr(
        "transform",
        "translate(" +
          vis.config.margin.left +
          "," +
          vis.config.margin.top +
          ")"
      );

    vis.linearGradient = vis.svg
      .append("defs")
      .append("linearGradient")
      .attr("id", `legend-gradient-${vis.number}`);

    // Append legend
    vis.legend = vis.chart
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.legendLeft},${
          vis.height - vis.config.legendBottom
        })`
      );

    vis.legendRect = vis.legend
      .append("rect")
      .attr("width", vis.config.legendRectWidth)
      .attr("height", vis.config.legendRectHeight);


    //   vis.brushG = vis.g.append("g").attr("class", "brush");

    // vis.brush = d3
    //   .brush()
    //   .extent([
    //     [0, 0],
    //     [vis.config.containerWidth, vis.config.containerHeight],
    //   ])
    //   // Reset the filtered counties
    //   .on("start", () => (filteredCounties = []))
    //   .on("end", (result) => vis.filterBySelection(result, vis));

    // vis.countiesGroup = vis.g.append("g").attr("id", "counties");

    this.updateVis();
  }

  /**
     * Prepare the data and scales before we render it.
     */
  updateVis() {
    // const vis = this;
  }

  /**
     * This function contains the D3 code for binding data to visual elements
     * Important: the chart is not interactive yet and renderVis() is intended
     * to be called only once; otherwise new paths would be added on top
     */
  renderVis() {
    const vis = this;

    vis.svg
      .selectAll("dot")
      .data(vis.data)
      .enter()
      .append("circle")
      .attr("cx", d => vis.xScale(d.median_household_income))
      .attr("cy", d => vis.yScale(d.education_less_than_high_school_percent))
      .attr("r", 1.5)
      .style("fill", "#69b3a2");

    // Update the axes
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
}
