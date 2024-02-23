/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

import { Scatterplot } from "@/lib/Scatterplot";



interface ScatterPlotProps {
  dataUrl: string;
  xAttribute?: string;
  yAttribute?: string;
}


export function ScatterPlot({ dataUrl, xAttribute="median_household_income", yAttribute="education_less_than_high_school_percent" } : ScatterPlotProps) {
  const chartRef = useRef<null | HTMLOrSVGElement>(null);

  useEffect(() => {
    d3.csv("data/national_health_data.csv")
      .then(data => {
        // console.log(data);
        // data.forEach(d => {
        //   d.close = parseFloat(d.close);  // Convert string to float
        //   d.date = parseTime(d.date);     // Convert string to date object
        // });
        console.log(data);
        // Initialize and render chart
        const areaChart = new Scatterplot({ parentElement: "#chart-container" }, data);
        areaChart.updateVis(xAttribute, yAttribute);
      })
      .catch(error => console.error(error));

    return () => {
      // Cleanup
      chartRef.current = null;
    };
  }, [dataUrl, xAttribute, yAttribute]);

  return <svg id="chart-container" className="fill-none"></svg>;
};

