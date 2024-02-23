/* eslint-disable @typescript-eslint/no-this-alias */
import * as d3 from "d3";



export class Histogram {
  /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 1000,
      containerHeight: _config.containerHeight || 1000,
      margin: _config.margin || { top: 25, right: 20, bottom: 30, left: 50 },
    };
    this.data = _data.splice(0, 10);
    this.initVis();
  }

  /**
     * Initialize scales/axes and append static chart elements
     */
  initVis() {
    const vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleBand()
      .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
      .range([vis.height, 0]);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    // Append group element that will contain our actual chart (see margin convention) - ?
    vis.chart = vis.svg.append("g")
      .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append("g")
      .attr("transform", `translate(0,${vis.height})`);

    // Append y-axis group
    vis.yAxisG = vis.chart.append("g");
  }

  /**
     * Prepare the data and scales before we render it.
     */
  updateVis(xAttribute, yAttribute) {
    const vis = this;

    // Set the scale input domains
    vis.xScale.domain(vis.data.map(d => d[xAttribute]));
    vis.yScale.domain([0, d3.max(vis.data, d => parseFloat(d[yAttribute]))]);


    vis.renderVis(xAttribute, yAttribute);
  }

  /**
     * This function contains the D3 code for binding data to visual elements
     * Important: the chart is not interactive yet and renderVis() is intended
     * to be called only once; otherwise new paths would be added on top
     */
  renderVis(xAttribute, yAttribute) {
    const vis = this;

    vis.svg.selectAll(".bar")
      .data(vis.data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => vis.xScale(d[xAttribute]))
      .attr("y", d => vis.yScale(parseFloat(d[yAttribute])))
      .attr("width", vis.xScale.bandwidth())
      .attr("height", function(d) { return vis.height - vis.yScale(parseFloat(d[yAttribute])); });



    // Update the axes
    vis.xAxisG.call(d3.axisBottom(vis.xScale));
    vis.yAxisG.call(d3.axisLeft(vis.yScale));
  }
}
