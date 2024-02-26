/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

import { ChoroplethMap } from "@/lib/ChoroplethMap";
import { attributesAvailable, processCountiesData } from "@/lib/data";



interface ChoroplethProps {
  dataUrl: string;
  attribute?: string;
}


export function Choropleth({ dataUrl, attribute="education_less_than_high_school_percent" } : ChoroplethProps) {
  const chartRef = useRef<null | HTMLOrSVGElement>(null);

  useEffect(() => {
    Promise.all([
      d3.json("data/counties-10m.json"),
      d3.csv("data/national_health_data.csv"),
    ]).then(data => {
      const geoData: any = data[0];
      const countiesData = data[1];
      console.log(geoData);
      //   Process the countiesData
      const processedData = processCountiesData(countiesData);
      console.log(processedData);
      // Combine the datasets
      geoData.objects.counties.geometries.forEach(geo => {
        processedData.forEach(county => {
          // If the IDs match, add all of the attributes data
          if (geo.id == county.cnty_fips) {
            attributesAvailable.forEach(attribute => {
              geo.properties[attribute] = county[attribute];
            });
          }
        });
      });

      const _choroplethMap = new ChoroplethMap({ parentElement: "#choropleth-chart-container" }, geoData, 1, attribute);
      _choroplethMap.updateVis();
    }).catch(error => console.error(error));

    return () => {
      // Cleanup
      chartRef.current = null;
    };
  }, [dataUrl, attribute]);

  return <svg id="choropleth-chart-container" className="fill-none"></svg>;
};

