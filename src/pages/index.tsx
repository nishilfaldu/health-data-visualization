import { Select } from "antd";
import { Inter } from "next/font/google";
import { useState } from "react";

import { BarChart } from "@/components/Charts/BarChart";
import { Navbar } from "@/components/Navbar";
import { attributesInfoArray } from "@/lib/data";



const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [selectedFirst, setSelectedFirst] = useState<string>(attributesInfoArray[0].value);
  const [selectedSecond, setSelectedSecond] = useState<string>(attributesInfoArray[0].value);

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setSelectedFirst(value);
  };

  return (
    <main
      className={`container flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Select
        defaultValue={attributesInfoArray[0].value}
        style={{ width: 300 }}
        onChange={handleChange}
        options={
          attributesInfoArray.map(d => {
            return { value: d.value, label: d.label };
          })
        }
        size="large"
      />
      <Navbar />
      <BarChart dataUrl={"/data/national_health_data.csv"} attribute={selectedFirst}/>
      {/* <ScatterPlot dataUrl={"/data/national_health_data.csv"} /> */}
      {/* <Choropleth dataUrl={"/data/national_health_data.csv"} /> */}
    </main>
  );
}
