/* eslint-disable @typescript-eslint/no-this-alias */
import * as d3 from "d3";
import * as topojson from "topojson-client";

import { attributesInfo } from "./data";



export class ChoroplethMap {
//   /**
//      * Class constructor with basic chart configuration
//      * @param {Object}
//      * @param {Array}
//      */
  constructor(_config, _geoData, _attribute, _num) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 800,
      containerHeight: _config.containerHeight || 475,
      margin: _config.margin || { top: 5, right: 5, bottom: 10, left: 5 },
      //   tooltipPadding: 10,
      legendBottom: 20,
      legendLeft: 50,
      legendRectHeight: 12,
      legendRectWidth: 300,
    };

    this.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "svg-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    this.data = _geoData;

    this.num = _num;

    this.attribute = _attribute;

    // this.active = d3.select(null);
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
    vis.svg = d3.select(vis.config.parentElement)
      .append("svg")
      .attr("class", "center-container")
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    vis.projection = d3.geoAlbersUsa()
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
      .datum(topojson.mesh(vis.data, vis.data.objects.states, (a, b) => a !== b))
      .style("fill", "none").style("stroke", "white").style("stroke-width", "2")
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
      .attr("id", `legend-gradient-${vis.num}`);

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

    vis.countiesGroup = vis.g.append("g").attr("id", "counties");

    // this.updateVis();
  }

  /**
     * Prepare the data and scales before we render it.
     */
  updateVis(attribute) {
    const vis = this;

    const filteredData = vis.data.objects.counties.geometries.filter(
      d => d.properties[attribute] != -1
    );

    vis.legendTitle = vis.legend
      .selectAll(".legend-title")
      .data([attribute])
      .join("text")
      .attr("class", "legend-title")
      .attr("dy", ".35em")
      .attr("y", -10)
      .text(attributesInfo[attribute].label);
    //   .style(
    //     "display",
    //     vis.attributeName === "urban_rural_status" ? "none" : "block"
    //   );
    vis.colorScale = d3
      .scaleLinear()
      .domain(
        d3.extent(filteredData, d => d.properties[attribute])
      )
      .range(["#ffffff", attributesInfo[attribute].color]) // ?
      .interpolate(d3.interpolateHcl);

    vis.counties = vis.countiesGroup
      .selectAll("path")
      .data(topojson.feature(vis.data, vis.data.objects.counties).features)
      .join("path")
      .attr("d", vis.path)
      .style("fill", d => {
        const coloredOrStripe =
          d.properties[attribute] != -1
            ? vis.colorScale(d.properties[attribute])
            : "#ff0000";

        return coloredOrStripe;
      });

    vis.legendStops = [
      {
        color: "#ffffff",
        value: d3.extent(filteredData, d => d.properties[attribute])[0],
        offset: 0,
      },
      {
        color: attributesInfo[attribute].color,
        value: d3.extent(filteredData, d => d.properties[attribute])[1],
        offset: 100,
      },
    ];

    // Add legend labels
    vis.legend
      .selectAll(".legend-label")
      .data(vis.legendStops)
      .join("text")
      .attr("class", "legend-label")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("y", 20)
      .attr("x", (d, index) => {
        return index == 0 ? 0 : vis.config.legendRectWidth;
      })
      .text(d => d.value);
    //   .text(d => Math.round(d.value * 10) / 10);
    //   .style(
    //     "display",
    //     vis.attributeName === "urban_rural_status" ? "none" : "block"
    //   );

    // Update gradient for legend
    vis.linearGradient
      .selectAll("stop")
      .data(vis.legendStops)
      .join("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);
    //   .style(
    //     "display",
    //     vis.attributeName === "urban_rural_status" ? "none" : "block"
    //   );

    vis.legendRect
      .attr("fill", `url(#legend-gradient-${vis.num})`);
    //   .style(
    //     "display",
    //     vis.attributeName === "urban_rural_status" ? "none" : "block"
    //   );

    this.renderVis(attribute);
  }

  /**
     * This function contains the D3 code for binding data to visual elements
     * Important: the chart is not interactive yet and renderVis() is intended
     * to be called only once; otherwise new paths would be added on top
     */
  renderVis(attribute) {
    const vis = this;

    vis.counties
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke-width", "2").attr("stroke", "black");
        vis.tooltip.style("visibility", "visible")
          .html(
            `<strong>${d.properties["display_name"]} </strong>` +
              "<br>" +
              `<strong>Value: ${d.properties[attribute]}</strong>`
          )
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke-width", "0");
        vis.tooltip.style("visibility", "hidden");
      })
      .on("mousemove", function (event) {
        vis.tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      });
  }
}
