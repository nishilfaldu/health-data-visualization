/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select } from "antd";
import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";

import { attributesInfoArray, processCountiesData } from "@/lib/data";
import { Histogram } from "@/lib/Histogram";



interface BarChartProps {
  dataUrl: string;
  attribute?: string;
}


export function BarChart({ dataUrl, attribute="median_household_income" } : BarChartProps) {
  const chartRef = useRef<null | HTMLDivElement>(null);
  const [selected, setSelected] = useState<string>(attribute);

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setSelected(value);
  };

  useEffect(() => {
    d3.csv("data/national_health_data.csv")
      .then(data => {
        const processedData = processCountiesData(data);
        const filteredData = processedData.filter(d => d[selected] !== -1);
        console.log(filteredData);

        // Remove the previous chart
        const chartContainer = document.getElementById("bar-chart-container");
        if (chartContainer && chartContainer.firstChild) {
          chartContainer.removeChild(chartContainer.firstChild);
        }

        // Initialize and render chart
        const barchart = new Histogram({ parentElement: "#bar-chart-container" }, filteredData);
        barchart.updateVis(selected);
      })
      .catch(error => console.error(error));
  }, [dataUrl, selected]);

  return <>
    <Select
      defaultValue={attribute}
      style={{ width: 300 }}
      onChange={handleChange}
      options={
        attributesInfoArray.map(d => {
          return { value: d.value, label: d.label };
        })
      }
      size="large"
    />
    <div id="bar-chart-container" ref={chartRef}></div>;
  </>;
};

