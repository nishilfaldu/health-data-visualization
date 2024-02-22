/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";

import { Histogram } from "../../lib/Histogram";



interface BarChartProps {
  dataUrl: string;
  xAttribute?: string;
  yAttribute?: string;
}

export function BarChart({ dataUrl, xAttribute="display_name", yAttribute="median_household_income" } : BarChartProps) {
  const chartRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const chart = new Histogram({
      parentElement: `#${chartRef.current?.id}` ?? "#chart-container",
      containerWidth: 1000,
      containerHeight: 400,
      url: dataUrl,
      xAttribute: xAttribute,
      yAttribute: yAttribute,
    });
    // chartRef.current = chart;

    // chart.loadData(dataUrl).then((data: any) => {
    //   console.log("data", data);
    //   chart.updateVis(data, xAttribute, yAttribute);
    //   chart.updateVis(data);
    // });

    return () => {
      // Cleanup
      chartRef.current = null;
    };
  }, [dataUrl, xAttribute, yAttribute]);

  return <div id="chart-container" ref={chartRef}></div>;
};

