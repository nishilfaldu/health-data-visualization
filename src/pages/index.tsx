import { Select } from "antd";
import { Inter } from "next/font/google";
import { useState } from "react";

import { BarChart } from "@/components/Charts/BarChart";
import { Choropleth } from "@/components/Charts/ChoroplethMap";
import { ScatterPlot } from "@/components/Charts/ScatterPlot";
import { Navbar } from "@/components/Navbar";
import { CentralDataStore } from "@/lib/CentralDataStore";
import { attributesInfoArray } from "@/lib/data";



const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [selectedFirst, setSelectedFirst] = useState<string>(attributesInfoArray[0].value);
  const [selectedSecond, setSelectedSecond] = useState<string>(attributesInfoArray[0].value);

  const centralDataStore = new CentralDataStore();

  const handleChangeFirst = (value: string) => {
    console.log(`selected ${value}`);
    setSelectedFirst(value);
  };

  const handleChangeSecond = (value: string) => {
    console.log(`selected ${value}`);
    setSelectedSecond(value);
  };

  return (
    <main
      className={`container flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Navbar />

      <div className="flex gap-x-4">
        <span className="flex flex-col">
          <span>Change X-Attribute</span>
          <Select
            defaultValue={attributesInfoArray[0].value}
            style={{ width: 300 }}
            onChange={handleChangeFirst}
            options={
              attributesInfoArray.map(d => {
                return { value: d.value, label: d.label };
              })
            }
            size="large"
          />
        </span>
        <span className="flex flex-col">
          <span>Change Y-Attribute</span>
          <Select
            defaultValue={attributesInfoArray[0].value}
            style={{ width: 300 }}
            onChange={handleChangeSecond}
            options={
              attributesInfoArray.map(d => {
                return { value: d.value, label: d.label };
              })
            }
            size="large"
          />
        </span>

      </div>
      <div className="flex flex-row">
        <BarChart dataUrl={"/data/national_health_data.csv"} attribute={selectedFirst} dataStore={centralDataStore}/>
        <ScatterPlot dataUrl={"/data/national_health_data.csv"} xAttribute={selectedFirst} yAttribute={selectedSecond} dataStore={centralDataStore}/>
      </div>
      <div className="flex flex-row">
        <Choropleth dataUrl={"/data/national_health_data.csv"} attribute={selectedFirst} num={1} dataStore={centralDataStore}/>
        <Choropleth dataUrl={"/data/national_health_data.csv"} attribute={selectedSecond} num={2} dataStore={centralDataStore}/>
      </div>
    </main>
  );
}
