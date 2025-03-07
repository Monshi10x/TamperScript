class Painting extends Material {
      /*
                        
      Variables         */
      static DISPLAY_NAME = "PAINTING";

      #dataForSubscribers = [{qty: 0, totalLength: 0}];

      #defaultSetupTime = new UOM(60, "minutes");
      #defaultFlashTime = new UOM(20, "minutes");
      #defaultCoatTime = new UOM(10, "minutes");
      #defaultColourMatchTime = new UOM(0, "minutes");
      #defaultLitres = new UOM(0.5, "litres");
      #defaultUseLitresFormula = true;
      #defaultLitresPerSquareMetrePerCoat = 0.3;
      /*
                        
      Fields            */
      #f_inheritedSizeTable;
      #f_outputSizeTable;
      #f_setupTime;

      #f_numberCoats;
      #f_flashTime;
      #f_perCoatTime;
      #f_colourMatchTime;
      #f_litres;
      #f_litresFormulas;
      #f_useLitresFormula;
      #f_areaToPaint;
      #f_litresPerSquareMetrePerCoat;
      /*
                        
      Getter            */
      /*override*/get Type() {return "PAINTING";}
      get backgroundColor() {return "grey";}
      get textColor() {return COLOUR.Black;}
      get DEBUG_SHOW() {return true;}
      /*
                        
      Setter            */
      set formula(value) {
            $(this.#f_litresFormulas[1]).val(value).change();
      }
      set numberOfCoats(value) {
            dropdownSetSelectedText(this.#f_numberCoats[1], value);
      }
      /*
                        
      Start             */
      constructor(parentObject, sizeClass, type) {
            super(parentObject, sizeClass, type);
            /*
            InheritedParentSizeSplits*/
            let f_container_inheritedParentSizeSplits = createDivStyle5(null, "Inherited Parent Size Splits", this.container)[1];

            this.#f_inheritedSizeTable = new Table(f_container_inheritedParentSizeSplits, "100%", 20, 250);
            this.#f_inheritedSizeTable.setHeading("Qty", "Square Metres", "From");
            this.#f_inheritedSizeTable.addRow("-", "-", "-");
            this.#f_inheritedSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Machine*/
            let f_timeContainer = createDivStyle5(null, "Time", this.container)[1];

            let f_setupContainer = createDivStyle5(null, "Setup", f_timeContainer)[1];
            this.#f_setupTime = createInput_Infield("Setup Time", this.#defaultSetupTime.as("minutes"), "width:30%;", () => {this.UpdateFromChange();}, f_setupContainer, false, 0.1, {postfix: "min"});

            let f_colourMatchContainer = createDivStyle5(null, "Colour Match", f_timeContainer)[1];
            this.#f_colourMatchTime = createInput_Infield("Colour Match Time", this.#defaultColourMatchTime.as("minutes"), "width:30%;margin-right:60%;", () => {this.UpdateFromChange();}, f_colourMatchContainer, false, 5, {postfix: "min"});

            let f_runContainer = createDivStyle5(null, "Run", f_timeContainer)[1];
            this.#f_numberCoats = createDropdown_Infield("Number of Coats", 0, "width:50%;", [createDropdownOption("x2 (2K for Acrylic/ACM)", 2), createDropdownOption("x3 (2K for Raw Metals Alum/Steel/Stainless...)", 3)], () => {this.UpdateFromChange();}, f_runContainer);
            this.#f_perCoatTime = createInput_Infield("Per Coat Time", this.#defaultCoatTime.as("minutes"), "width:20%;", () => {this.UpdateFromChange();}, f_runContainer, false, 1, {postfix: "min"});
            this.#f_flashTime = createInput_Infield("Flash Time", this.#defaultFlashTime.as("minutes"), "width:20%;", () => {this.UpdateFromChange();}, f_runContainer, false, 5, {postfix: "min"});

            let f_litresContainer = createDivStyle5(null, "Litres", this.container)[1];
            let f_formulaContainer = createDivStyle5(null, "Formula", f_litresContainer)[1];
            this.#f_useLitresFormula = createCheckbox_Infield("Use Formula", this.#defaultUseLitresFormula, "width:30%;", () => {
                  if(!this.#f_useLitresFormula[1].checked) $(this.#f_litres[0]).show();
                  this.UpdateFromChange();
            }, f_formulaContainer);
            this.#f_litresFormulas = createDropdown_Infield_Icons_Search("Use Formula", 2, "width:30%;margin-right:30%;", 200, false, [
                  ["Flat Panels", GM_getResourceURL("Image_PaintedPanel")],
                  ["10-20mmD Letters", GM_getResourceURL("Image_PaintedPanelWithLetters")],
                  ["Fabricated FRONT-LIT Letters", GM_getResourceURL("Image_FrontLitLettersPainted")],
                  ["Fabricated BACK-LIT Letters", GM_getResourceURL("Image_FabLettersPainted")],
                  ["Fabricated NON-LIT Letters", GM_getResourceURL("Image_FabLettersPainted")]
            ], () => {this.UpdateFromChange();}, f_formulaContainer, false);

            let f_totalContainer = createDivStyle5(null, "Total", f_litresContainer)[1];
            this.#f_areaToPaint = createInput_Infield("Area To Paint", 0, "width:25%;", () => {this.UpdateFromChange();}, f_totalContainer, false, 0.1, {postfix: "m2"});
            createText("X", "width:30px;height:50px;font-size:32px;color:blue;", f_totalContainer);
            setFieldDisabled(true, this.#f_areaToPaint[1], this.#f_areaToPaint[0]);
            this.#f_litresPerSquareMetrePerCoat = createInput_Infield("Litres Per m2 Per Coat", this.#defaultLitresPerSquareMetrePerCoat, "width:25%;", () => {this.UpdateFromChange();}, f_totalContainer, false, 0.1, {postfix: "L/m2"});
            createText("=", "width:30px;height:50px;font-size:32px;color:blue;", f_totalContainer);
            setFieldDisabled(true, this.#f_litresPerSquareMetrePerCoat[1], this.#f_litresPerSquareMetrePerCoat[0]);

            this.#f_litres = createInput_Infield("Litres", this.#defaultLitres.as("litres"), "width:25%;", () => {this.UpdateFromChange();}, f_totalContainer, false, 0.1, {postfix: "L"});

            makeFieldGroup("Checkbox", this.#f_useLitresFormula[1], true, this.#f_litresFormulas[0]);
            /*
            OutputSizes*/
            let f_container_outputSizes = createDivStyle5(null, "Output Sizes", this.container)[1];

            this.#f_outputSizeTable = new Table(f_container_outputSizes, "100%", 20, 250);
            this.#f_outputSizeTable.setHeading("Litres");
            this.#f_outputSizeTable.addRow("-");
            this.#f_outputSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Update*/
            this.UpdateFromChange();
      }

      /*
      Inherited*/
      UpdateFromChange() {
            super.UpdateFromChange();

            this.UpdateFromInheritedData();

            this.UpdateLitres();

            this.UpdateOutput();
            this.UpdateDataForSubscribers();
            this.PushToSubscribers();
      }

      UpdateDataForSubscribers() {
            this.DATA_FOR_SUBSCRIBERS = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
      }

      UpdateFromInheritedData = () => {
            this.#f_inheritedSizeTable.deleteAllRows();

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{pathLength: 0, shapeAreas: 0, boundingRectAreas: 0, QWHD: QWHD}*/) => {

                        if(!dataEntry.paintedArea) return /**only this entry */;
                        let qty = 1; if(dataEntry.QWHD) qty = dataEntry.QWHD.qty;

                        this.#f_inheritedSizeTable.addRow(qty, roundNumber(dataEntry.paintedArea, 2), subscription.parent.constructor.name);
                  });
            });
      };

      UpdateLitres() {
            if(!this.#f_useLitresFormula[1].checked) return;

            let calculatedArea = 0;

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{paintedArea: 0}*/) => {

                        if(!dataEntry.paintedArea) return/**just this entry*/;

                        switch(this.#f_litresFormulas[1].value) {
                              case "Flat Panels":
                                    if(subscription.parent.constructor.name != "Coil") calculatedArea += dataEntry.paintedArea; /**exclude backs from painting, only Coil returns */
                                    break;
                              case "10-20mmD Letters":
                                    if(subscription.parent.constructor.name != "Coil") calculatedArea += dataEntry.paintedArea; /**exclude backs from painting, only Coil returns */
                                    break;
                              case "Fabricated FRONT-LIT Letters":
                                    if(!["Sheet", "SVGCutfile"].includes(subscription.parent.constructor.name)) calculatedArea += dataEntry.paintedArea; /**exclude backs from painting, only use Coil returns */
                                    break;
                              case "Fabricated BACK-LIT Letters":
                                    calculatedArea += dataEntry.paintedArea;
                                    break;
                              case "Fabricated NON-LIT Letters":
                                    calculatedArea += dataEntry.paintedArea;
                                    break;
                              default: break;
                        }
                  });
            });

            $(this.#f_areaToPaint[1]).val(calculatedArea);
            $(this.#f_litres[1]).val(zeroIfNaNNullBlank(this.#f_litresPerSquareMetrePerCoat[1].value) * zeroIfNaNNullBlank(this.#f_numberCoats[1].value) * calculatedArea);
      }

      UpdateOutput() {
            this.#dataForSubscribers = [];
            this.#f_outputSizeTable.deleteAllRows();

            this.#f_outputSizeTable.addRow(this.#f_litres[1].value);
            this.#dataForSubscribers = [{litres: this.#f_litres[1].value}];
      };

      async Create(productNo, partIndex) {
            console.log(productNo, partIndex, true, false, this.qty, this.#f_litres[1].value, this.#f_colourMatchTime[1].value, this.#f_numberCoats[1].value, this.#f_setupTime[1].value, this.#f_flashTime[1].value, this.#f_perCoatTime[1].value, "2Pac Painting");
            partIndex = await q_AddPart_Painting(productNo, partIndex, true, false, this.qty,
                  zeroIfNaNNullBlank(this.#f_litres[1].value),
                  zeroIfNaNNullBlank(this.#f_colourMatchTime[1].value),
                  zeroIfNaNNullBlank(this.#f_numberCoats[1].value),
                  zeroIfNaNNullBlank(this.#f_setupTime[1].value),
                  zeroIfNaNNullBlank(this.#f_flashTime[1].value),
                  zeroIfNaNNullBlank(this.#f_perCoatTime[1].value),
                  "2Pac Painting");
            return partIndex;
      }

      Description() {
            super.Description();

            return "";
      }
}