import { Inter } from "next/font/google";

import { BarChart } from "@/components/Charts/BarChart";
import { Navbar } from "@/components/Navbar";



const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`container flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Navbar />
      <BarChart dataUrl={"/data/national_health_data.csv"} />

    </main>
  );
}
