/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from "d3";
import React, { useEffect } from "react";

import type { CentralDataStore } from "@/lib/CentralDataStore";
import { ChoroplethMapCopy } from "@/lib/ChoroplethMapCopy";
import { attributesAvailable, processCountiesData } from "@/lib/data";



interface ChoroplethCopyProps {
  dataUrl: string;
  attribute: string;
  num: number;
  dataStore: CentralDataStore;
}


export function ChoroplethCopy({ dataUrl, attribute, num, dataStore } : ChoroplethCopyProps) {
  useEffect(() => {
    Promise.all([
      d3.json("data/counties-10m.json"),
      d3.csv("data/national_health_data.csv"),
    ]).then(data => {
      const geoData: any = data[0];
      const countiesData = data[1];
      const filteredData = processCountiesData(countiesData);
      //   const filteredData = processedData.filter(d => d[attribute] !== -1);
      //   console.log(filteredData, "filteredData");
      //   console.log(geoData, "geoData");
      //   Process the countiesData
      // Combine the datasets
      geoData.objects.counties.geometries.forEach((geo: any) => {
        filteredData.forEach(county => {
          // If the IDs match, add all of the attributes data
          if (geo.id == county.cnty_fips) {
            attributesAvailable.forEach(attr => {
              geo.properties[attr] = county[attr];
            });
          }
        });
      });


      // Remove the previous chart
      const chartContainer = document.getElementById(`choropleth-chart-container-${num}`);
      if (chartContainer && chartContainer.firstChild) {
        chartContainer.removeChild(chartContainer.firstChild);
      }

      const choropleth = new ChoroplethMapCopy({ parentElement: `#choropleth-chart-container-${num}` }, geoData, attribute, num, dataStore);
      choropleth.updateVis(attribute);
    });
  }, [dataUrl, attribute, num, dataStore]);

  return <div id={`choropleth-chart-container-${num}`}></div>;
};

