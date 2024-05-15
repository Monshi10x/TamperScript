class Chart {
      #xArray = [/*0, 0, 0, 0,...*/];
      #yArray = [/*0, 0, 0, 0,...*/];
      #xAxisTitle;
      #yAxisTitle;
      #title = "";

      #wrapperContainer;

      /**
       * @override
       */
      mode;

      /**
       * @override
       */
      type;

      /**
       * @override
       */
      dataOptions = {};

      /**
       * @override
       */
      layoutOptions = {};

      /**
       * @override
       */
      settingOptions = {scrollZoom: true};

      #data = [{
            x: this.#xArray,
            y: this.#yArray,
            mode: this.mode,
            type: this.type
      }];
      #layout = {
            xaxis: {range: [0, 100], title: this.#xAxisTitle},
            yaxis: {range: [0, 100], title: this.#yAxisTitle},
            title: this.#title
      };

      constructor(points = [{x: 0, y: 0}], xAxisTitle = "", yAxisTitle = "", title = "", parentToAppendTo, overrideCssStyle = "") {
            this.#xArray = points.map((element) => element.x);
            this.#yArray = points.map((element) => element.y);
            this.#xAxisTitle = xAxisTitle;
            this.#yAxisTitle = yAxisTitle;
            this.#title = title;

            this.#wrapperContainer = document.createElement("div");
            this.#wrapperContainer.style = STYLE.Div3;
            this.#wrapperContainer.style.cssText += "width:calc(100% - " + getSideMargins(this.#wrapperContainer) + "px);box-sizing:border-box;height:300px;float:right:display:block;";
            if(overrideCssStyle) this.#wrapperContainer.style.cssText += overrideCssStyle;
            parentToAppendTo.appendChild(this.#wrapperContainer);
      }

      Create() {
            this.#data = [{
                  x: this.#xArray,
                  y: this.#yArray,
                  mode: this.mode,
                  type: this.type
            }];
            this.#data = Object.assign(this.#data, this.dataOptions);

            this.#layout = {
                  xaxis: {range: [Math.min(...this.#xArray) - 10, Math.max(...this.#xArray) + 10], title: this.#xAxisTitle},
                  yaxis: {range: [Math.min(...this.#yArray) - 10, Math.max(...this.#yArray) + 10], title: this.#yAxisTitle},
                  title: this.#title
            };
            this.#layout = Object.assign(this.#layout, this.layoutOptions);

            Plotly.newPlot(this.#wrapperContainer, this.#data, this.#layout, this.settingOptions);
      }
}

class ScatterPlot extends Chart {
      mode = "markers";

      constructor(points = [{x: 0, y: 0}], xAxisTitle = "", yAxisTitle = "", title = "", parentToAppendTo, overrideCssStyle = "") {
            super(...arguments);

            this.Create();
      }
}

class BarGraph extends Chart {
      type = "bar";
      layoutOptions = {
            bargap: 0.05
      };
      constructor(points = [{x: 0, y: 0}], xAxisTitle = "", yAxisTitle = "", title = "", parentToAppendTo, overrideCssStyle = "") {
            super(...arguments);

            this.Create();
      }
}