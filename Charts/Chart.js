class Chart {
      xArray = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
      yArray = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15];

      constructor() {
            this.data = [{
                  x: this.xArray,
                  y: this.yArray,
                  mode: "markers"
            }];

            this.layout = {
                  xaxis: {range: [40, 160], title: "Square Meters"},
                  yaxis: {range: [5, 16], title: "Price in Millions"},
                  title: "House Prices vs. Size"
            };

            Plotly.newPlot(document.querySelector("#orderSummaryBody"), this.data, this.layout);
      }
}