import * as d3 from "d3";



export class Scatterplot {
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
    this.data = _data;
    this.initVis();
  }

  /**
     * Initialize scales/axes and append static chart elements
     */
  initVis() {
    const vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleLinear()
      .range([0, vis.width]).nice();

    vis.yScale = d3.scaleLinear()
      .range([vis.height, 0])
      .nice();

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
      .ticks(6)
      .tickSizeOuter(0)
      .tickPadding(10);
    //.tickFormat(d => d + ' km');

    vis.yAxis = d3.axisLeft(vis.yScale)
      .ticks(6)
      .tickSizeOuter(0)
      .tickPadding(10);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append("g")
      .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0,${vis.height})`);

    // Append y-axis group
    vis.yAxisG = vis.chart.append("g")
      .attr("class", "axis y-axis");
  }

  /**
     * Prepare the data and scales before we render it.
     */
  updateVis(xAttribute, yAttribute) {
    const vis = this;

    // Set the scale input domains
    vis.xScale.domain(d3.extent(vis.data, d => parseFloat(d[xAttribute])));
    vis.yScale.domain(d3.extent(vis.data, d => parseFloat(d[yAttribute])));

    vis.renderVis();
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
