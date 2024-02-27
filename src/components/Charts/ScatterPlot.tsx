/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from "d3";
import React, { useEffect } from "react";

import type { CentralDataStore } from "@/lib/CentralDataStore";
import { processCountiesData } from "@/lib/data";
import { Scatterplot } from "@/lib/Scatterplot";



interface ScatterPlotProps {
  dataUrl: string;
  xAttribute: string;
  yAttribute: string;
  dataStore: CentralDataStore;
}


export function ScatterPlot({ dataUrl, xAttribute, yAttribute, dataStore } : ScatterPlotProps) {
  useEffect(() => {
    d3.csv("data/national_health_data.csv")
      .then(data => {
        const processedData = processCountiesData(data);
        const filteredData = processedData.filter(d => d[xAttribute] !== -1);
        const _filteredData = filteredData.filter(d => d[yAttribute] !== -1);

        console.log(_filteredData);

        // Remove the previous chart
        const chartContainer = document.getElementById("scatter-chart-container");
        if (chartContainer && chartContainer.firstChild) {
          chartContainer.removeChild(chartContainer.firstChild);
        }

        // Initialize and render chart
        const scatterplot = new Scatterplot({ parentElement: "#scatter-chart-container" }, _filteredData, xAttribute, yAttribute, dataStore);
        scatterplot.updateVis(xAttribute, yAttribute);
      })
      .catch(error => console.error(error));
  }, [dataUrl, xAttribute, yAttribute, dataStore]);

  return <div id="scatter-chart-container"></div>;
};

