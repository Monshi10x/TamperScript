/**
 * @see https://plotly.com/javascript/
 */
class Chart {
      #xArray = [/*0, 0, 0, 0,...*/];
      #yArray = [/*0, 0, 0, 0,...*/];
      #xAxisTitle;
      #yAxisTitle;
      #title = "";
      #defaultWidth = "100%";
      #defaultHeight = "500px";

      #wrapperContainer;

      //@override
      mode;

      //@override
      type;

      //@override
      dataOptions = {};

      //@override
      layoutOptions = {};

      //@override
      settingOptions = {};

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
      #settings = {scrollZoom: true};

      constructor(points = [{x: 0, y: 0}], xAxisTitle = "", yAxisTitle = "", title = "", width = "100%", height = "500px", parentToAppendTo, overrideCssStyle = "") {
            this.#xArray = points.map((element) => element.x);
            this.#yArray = points.map((element) => element.y);
            this.#xAxisTitle = xAxisTitle;
            this.#yAxisTitle = yAxisTitle;
            this.#title = title;
            if(!width) width = this.#defaultWidth;
            if(!height) height = this.#defaultHeight;

            this.#wrapperContainer = document.createElement("div");
            this.#wrapperContainer.style = STYLE.Div3;
            this.#wrapperContainer.style.cssText += "width:calc(" + width + " - " + getSideMargins(this.#wrapperContainer) + "px);box-sizing:border-box;" +
                  "height:calc(" + height + " - " + getTopBottomMargins(this.#wrapperContainer) + "px);float:right:display:block;";
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
                  title: this.#title,
                  dragmode: "pan"
            };

            this.#layout = Object.assign(this.#layout, this.layoutOptions);

            this.#settings = Object.assign(this.#settings, this.settingOptions);

            Plotly.newPlot(this.#wrapperContainer, this.#data, this.#layout, this.#settings);
      }
}

class ScatterPlot extends Chart {
      mode = "markers";

      constructor(points = [{x: 0, y: 0}], xAxisTitle = "", yAxisTitle = "", title = "", width = "100%", height = "500px", parentToAppendTo, overrideCssStyle = "") {
            super(...arguments);

            this.Create();
      }
}

class BarGraph extends Chart {
      type = "bar";
      layoutOptions = {
            bargap: 0.05
      };
      constructor(points = [{x: 0, y: 0}], xAxisTitle = "", yAxisTitle = "", title = "", width = "100%", height = "500px", parentToAppendTo, overrideCssStyle = "") {
            super(...arguments);

            this.Create();
      }
}