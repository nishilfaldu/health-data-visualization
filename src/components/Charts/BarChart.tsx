// BarChartComponent.tsx

import React, { useEffect, useRef } from "react";

import { Histogram } from "../../lib/Histogram";



interface BarChartProps {
  dataUrl: string;
}

export function BarChart({ dataUrl } : BarChartProps) {
  const chartRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const chart = new Histogram({
      parentElement: "#chart-container",
      containerWidth: 600,
      containerHeight: 400,
    });
    // chartRef.current = chart;

    chart.loadData(dataUrl).then(data => {
      console.log(data);
    //   chart.updateVis(data);
    });

    return () => {
      // Cleanup
      chartRef.current = null;
    };
  }, [dataUrl]);

  return <div id="chart-container" ref={chartRef}></div>;
};

