class ModalSVG extends Modal {

      #ID = "ModalSVG " + generateUniqueID();
      #dragZoomSVG;
      #borrowedFields = [];


      #textSize = 15;
      #lineWidth = 1;
      #crossScale = 0.2;
      #offsetFromShape = 15;

      /** @info Draw Each Sheet from matrixSizes, per parent */
      #distanceBetweenParentDraws = 1000;

      #gapBetweenX = 0;
      #gapBetweenXField;
      #gapBetweenY = 0;
      #gapBetweenYField;

      #containerBeforeCanvas;

      #statsContainer;
      #totalPathLength;
      #totalShapeAreas;
      #viewSettingsContainer;
      #showIndividualMeasures;
      #showOverallMeasures;
      #showIndividualAreas;
      #showShapeAreas;
      #controlsContainer;

      get getTotalPathLengths() {return this.#dragZoomSVG.getTotalPathLengths();}

      constructor(headerText, incrementAmount, callback, svgText) {
            super(headerText, incrementAmount, callback);

            this.#containerBeforeCanvas = createDivStyle5(null, "Borrowed Fields", this.getBodyElement())[1];

            this.#dragZoomSVG = new DragZoomSVG(this.container.getBoundingClientRect().width, 500, svgText, this.getBodyElement());

            this.#statsContainer = createDivStyle5(null, "Stats", this.getBodyElement())[1];
            this.#totalPathLength = createInput_Infield("Total Paths Length", this.#dragZoomSVG.totalPathLengths, null, () => { }, this.#statsContainer, false, 1, {postfix: "mm"});
            this.#totalShapeAreas = createInput_Infield("Total Shape Areas", null, null, () => { }, this.#statsContainer, false, 1, {postfix: "m2"});

            this.#viewSettingsContainer = createDivStyle5(null, "View Settings", this.getBodyElement())[1];

            let overallMeasureToggle = new Toggle(() => {this.#dragZoomSVG.showOverallMeasures();}, () => {this.#dragZoomSVG.hideOverallMeasures();});
            this.#showOverallMeasures = createCheckbox_Infield("Show Overall Measures", true, "width:250px;", () => {
                  overallMeasureToggle.toggle();
            }, this.#viewSettingsContainer);

            let measureToggle = new Toggle(() => {this.#dragZoomSVG.hideElementMeasures();}, () => {this.#dragZoomSVG.showElementMeasures();});
            this.#showIndividualMeasures = createCheckbox_Infield("Show Individual Measures", false, "width:250px;", () => {
                  measureToggle.toggle();
            }, this.#viewSettingsContainer);

            let areaToggle = new Toggle(() => {this.#dragZoomSVG.hidePartAreas();}, () => {this.#dragZoomSVG.showPartAreas();});
            this.#showIndividualAreas = createCheckbox_Infield("Show Individual Areas", false, "width:250px;", () => {
                  areaToggle.toggle();
            }, this.#viewSettingsContainer);

            let shapeAreaToggle = new Toggle(() => {this.#dragZoomSVG.hideShapeAreas();}, () => {this.#dragZoomSVG.showShapeAreas();});
            this.#showShapeAreas = createCheckbox_Infield("Show Shape Areas", false, "width:250px;", () => {
                  shapeAreaToggle.toggle();
            }, this.#viewSettingsContainer);

            this.#controlsContainer = createDivStyle5(null, "Controls", this.getBodyElement())[1];

            let selectionTool = createIconButton(GM_getResourceURL("Icon_Select"), null, "width:50px;height:50px;background-color:" + COLOUR.DarkGrey, () => {
                  IFELSEF(this.#dragZoomSVG.getCurrentTool() != "Selection Tool", () => {this.#dragZoomSVG.setCurrentTool("Selection Tool");}, () => {this.#dragZoomSVG.setCurrentTool("null");});
                  IFELSEF(selectionTool.style.borderColor != "red", () => {selectionTool.style.borderColor = "red";}, () => {selectionTool.style.borderColor = COLOUR.DarkGrey;});
            }, this.#controlsContainer, true);

            this.loadPathArea();
      }

      async loadPathArea() {
            let loader = new Loader(this.#totalShapeAreas[0]);
            let totalArea = await this.#dragZoomSVG.getTotalPathArea_m2();
            $(this.#totalShapeAreas[1]).val(totalArea).change();
            loader.Delete();
      }

      updateFromFields() {
            this.#dragZoomSVG.updateFromFields();
      }

      Close() {
            this.returnAllBorrowedFields();
            this.#dragZoomSVG.Close();
      }

      draw() {

      }

      returnAllBorrowedFields() {
            for(let i = this.#borrowedFields.length - 1; i >= 0; i--) {
                  insertAfter(this.#borrowedFields[i].elementToBorrow, this.#borrowedFields[i].placeholderBefore);
                  deleteElement(this.#borrowedFields[i].placeholderBefore);
                  deleteElement(this.#borrowedFields[i].placeholderAfter);
            }
      }

      hide() {
            this.returnAllBorrowedFields();
            super.hide();
      }

      onWindowResize(event) {
            super.onWindowResize(event);
            this.#dragZoomSVG.svgWidth = this.container.getBoundingClientRect().width;
            this.updateFromFields();
      }
}
