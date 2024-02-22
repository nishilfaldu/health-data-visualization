import * as d3 from "d3";



export class Histogram {
  private config: {
    parentElement: string;
    containerWidth: number;
    containerHeight: number;
    margin: { top: number; bottom: number; right: number; left: number };
  };

  constructor(_config: { parentElement: string; containerWidth?: number; containerHeight?: number }) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 10, bottom: 30, right: 10, left: 30 },
    };

    // Call a class function
    // this.initVis();
  }

  loadData(url: string) {
    if(!url) { throw new Error("No data url provided"); }

    return d3.csv(url);
  }
}
