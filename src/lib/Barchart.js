/* eslint-disable @typescript-eslint/no-this-alias */
import * as d3 from "d3";



export class Barchart {
  /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 300,
      containerHeight: _config.containerHeight || 200,
      margin: _config.margin || { top: 20, right: 30, bottom: 50, left: 50 },
    };
    this.data = _data;
    this.urbanRuralStatuses = ["Urban", "Rural", "Small City", "Suburban"];
    this.counts = [0, 0, 0, 0];
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
      .range([0, vis.config.containerWidth]);

    vis.yScale = d3.scaleLinear()
      .range([vis.config.containerHeight, 0]);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth + vis.config.margin.left + vis.config.margin.right)
      .attr("height", vis.config.containerHeight + vis.config.margin.top + vis.config.margin.bottom);

    // Append group element that will contain our actual chart (see margin convention) - ?
    vis.chart = vis.svg.append("g")
      .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append("g")
      .attr("transform", `translate(0,${vis.config.containerHeight})`);

    // Append y-axis group
    vis.yAxisG = vis.chart.append("g");

    // Append y-axis label
    vis.svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - vis.config.margin.left)
      .attr("x", 0 - vis.config.containerHeight / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Counties");

    // Append x-axis label
    vis.svg
      .append("text")
      .attr("transform",
        `translate(${vis.config.containerWidth / 2},${vis.config.containerHeight + 35})`)
      .style("text-anchor", "middle")
      .text("something"); // edit this
  }

  /**
     * Prepare the data and scales before we render it.
     */
  updateVis(xAttribute, yAttribute) {
    const vis = this;


    vis.data.forEach(d => {
      if (d[xAttribute] === "Urban") {
        vis.counts[0] += parseInt(d[yAttribute]);
      } else if (d[xAttribute] === "Rural") {
        vis.counts[1] += parseInt(d[yAttribute]);
      } else if (d[xAttribute] === "Small City") {
        vis.counts[2] += parseInt(d[yAttribute]);
      } else if (d[xAttribute] === "Suburban") {
        vis.counts[3] += parseInt(d[yAttribute]);
      }
    });

    // Set the scale input domains
    vis.yScale.domain([0, d3.max(vis.counts)]);
    vis.xScale.domain(vis.urbanRuralStatuses);


    vis.renderVis(xAttribute, yAttribute);
  }

  /**
     * This function contains the D3 code for binding data to visual elements
     * Important: the chart is not interactive yet and renderVis() is intended
     * to be called only once; otherwise new paths would be added on top
     */
  renderVis(xAttribute, yAttribute) {
    const vis = this;

    vis.svg.selectAll("rect.bar")
      .data(vis.counts)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d, idx) => vis.xScale(vis.urbanRuralStatuses[idx]))
      .attr("y", d => vis.yScale(d))
      .attr("width", vis.xScale.bandwidth())
      .attr("height", function(d) { return vis.config.containerHeight - vis.yScale(d); })
      .attr("fill", "steelblue");



    // Update the axes
    vis.xAxisG.call(d3.axisBottom(vis.xScale));
    vis.yAxisG.call(d3.axisLeft(vis.yScale));
  }
}
