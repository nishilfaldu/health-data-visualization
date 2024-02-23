/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

import { Histogram } from "@/lib/Histogram";



interface BarChartProps {
  dataUrl: string;
  xAttribute?: string;
  yAttribute?: string;
}


export function BarChart({ dataUrl, xAttribute="display_name", yAttribute="median_household_income" } : BarChartProps) {
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
        const areaChart = new Histogram({ parentElement: "#bar-chart-container" }, data);
        areaChart.updateVis(xAttribute, yAttribute);
      })
      .catch(error => console.error(error));

    return () => {
      // Cleanup
      chartRef.current = null;
    };
  }, [dataUrl, xAttribute, yAttribute]);

  return <svg id="bar-chart-container" className="fill-none"></svg>;
};

