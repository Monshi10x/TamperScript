class LED extends Material {
      /*
                        
      Variables         */
      static DISPLAY_NAME = "LED";
      /**
      /**
       * @Inherited*/
      #dataForSubscribers = [{qty: 0, totalWattage: 0, voltage: 12}];
      #defaultUseFormula = true;
      #defaultLEDPerHour = 50;

      UPDATES_PAUSED = false;
      /*
                        
      Fields            */
      #f_production;
      #f_material;
      #f_inheritedSizeTable;
      #f_outputSizeTable;
      #f_useQtyFormula;
      #f_LEDPerHour;

      #f_area;
      #f_formula;
      /*
                        
      Getter            */
      /*override*/get Type() {return "LED";}
      get backgroundColor() {return COLOUR.Yellow;}
      get textColor() {return COLOUR.Black;}

      get DEBUG_SHOW() {return true;}
      get wattage() {
            let material = this.#f_material[1].value;
            let ledPart = null;
            for(let i = 0; i < predefinedParts_obj.length; i++) {
                  if(predefinedParts_obj[i].Name == material) {
                        ledPart = predefinedParts_obj[i];
                        break;
                  }
            }
            if(!ledPart) return false;

            return JSON.parse(ledPart.Weight).wattage;
      }
      get voltage() {
            let material = this.#f_material[1].value;
            let ledPart = null;
            for(let i = 0; i < predefinedParts_obj.length; i++) {
                  if(predefinedParts_obj[i].Name == material) {
                        ledPart = predefinedParts_obj[i];
                        break;
                  }
            }
            if(!ledPart) return false;

            return JSON.parse(ledPart.Weight).voltage;
      }

      //return (qty * (wattage / (loadingPercentage / 100))) / voltage;
      /*
                        
      Setter            */
      set material(value) {$(this.#f_material[1]).val(value).change();}
      set formula(value) {
            dropdownSetSelectedText(this.#f_formula[1], value);
      }
      set material(value) {
            dropdownInfieldIconsSearchSetSelected(this.#f_material, value, false, true);
      }
      /*
                        
      Start             */
      constructor(parentObject, sizeClass, type) {
            super(parentObject, sizeClass, type);

            /*
            InheritedParentSizeSplits*/
            let f_container_inheritedParentSizeSplits = createDivStyle5(null, "Inherited Parent Size Splits", this.container)[1];

            this.#f_inheritedSizeTable = new Table(f_container_inheritedParentSizeSplits, "100%", 20, 250);
            this.#f_inheritedSizeTable.setHeading("Qty", "Width (mm)", "Height (mm)");
            this.#f_inheritedSizeTable.addRow("-", "-", "-");
            this.#f_inheritedSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Area*/
            let f_container_area = createDivStyle5(null, "Area", this.container)[1];
            this.#f_area = createInput_Infield("Total Area", 0, null, () => { }, f_container_area, false, 1, {postfix: "m2"});
            setFieldDisabled(true, this.#f_area[1], this.#f_area[0]);

            /*
            Formula*/
            let f_formula = createDivStyle5(null, "Formula", this.container)[1];
            this.#f_useQtyFormula = createCheckbox_Infield("Use Formula", this.#defaultUseFormula, "width:30%;", () => {
                  if(!this.#f_useQtyFormula[1].checked) $(this.#f_formula[0]).hide();
                  else $(this.#f_formula[0]).show();

                  this.UpdateFromFields();
            }, f_formula);
            this.#f_formula = createDropdown_Infield("Formula", 0, "", [
                  createDropdownOption("Lightbox 150D - 50 per m2", "50"/**per square meter*/),
                  createDropdownOption("Lightbox 100D - 100 per m2", "100"/**per square meter*/),
                  createDropdownOption("Lightbox 50D - 380 per m2", "380"/**per square meter*/),
                  createDropdownOption("3D Letters 100D - 200 per m2", "200"/**per square meter*/),
                  createDropdownOption("3D Letters 80D - 250 per m2", "250"/**per square meter*/),
                  createDropdownOption("3D Letters 50D - 380 per m2", "380"/**per square meter*/)
            ], () => {this.UpdateFromFields();}, f_formula);

            /*
            Material*/
            let f_container_material = createDivStyle5(null, "LEDs", this.container)[1]; 2;

            var parts = getPredefinedParts("LED Module - ");
            var dropdownElements = [];
            parts.forEach(element => dropdownElements.push([element.Name, "https://sa-led.com/wp-content/uploads/2021/06/1541_123456.jpg"]));

            this.#f_material = createDropdown_Infield_Icons_Search("LED", 0, "width:60%;", 50, false, dropdownElements, () => {this.UpdateFromFields();}, f_container_material);

            /*
            Production*/
            let f_container_production = createDivStyle5(null, "LED Production", this.container)[1];

            this.#f_LEDPerHour = createInput_Infield("LEDs per Hour", this.#defaultLEDPerHour, null, () => {this.UpdateFromFields();}, f_container_production, false, 1, {postfix: "LED/h"});

            this.#f_production = new Production(f_container_production, null, function() { }, this.sizeClass);
            this.#f_production.showContainerDiv = true;
            this.#f_production.productionTime = 20;
            this.#f_production.headerName = "LED Production";
            this.#f_production.required = true;
            this.#f_production.showRequiredCkb = false;
            this.#f_production.requiredName = "Required";

            /*
            OutputSizes*/
            let f_container_outputSizes = createDivStyle5(null, "Output Sizes", this.container)[1];

            this.#f_outputSizeTable = new Table(f_container_outputSizes, "100%", 20, 250);
            this.#f_outputSizeTable.setHeading("Qty", "Wattage (W)", "Voltage (V)");
            this.#f_outputSizeTable.addRow("-", "-", "-");
            this.#f_outputSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Update*/
            this.UpdateFromFields();
      }

      /*
      Inherited*/
      UpdateFromFields() {
            if(this.UPDATES_PAUSED) return;

            super.UpdateFromFields();

            this.UpdateFromInheritedData();

            this.UpdateArea();
            this.UpdateQty();
            this.UpdateProductionTimes();

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

                        if(!dataEntry.QWHD || !dataEntry.shapeAreas) return/**just this entry*/;

                        if(dataEntry.shapeAreas) {
                              this.#f_inheritedSizeTable.addRow(1, roundNumber(Math.sqrt(dataEntry.shapeAreas * 1000000), 3), roundNumber(Math.sqrt(dataEntry.shapeAreas * 1000000), 3));
                        } else if(dataEntry.QWHD) {
                              this.#f_inheritedSizeTable.addRow(dataEntry.QWHD.qty, roundNumber(dataEntry.QWHD.width, 3), roundNumber(dataEntry.QWHD.height, 3));
                        }
                  });
            });
      };

      UpdateArea() {
            let area = 0;

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{pathLength: 0, shapeAreas: 0, boundingRectAreas: 0, QWHD: QWHD}*/) => {

                        if(!dataEntry.QWHD || !dataEntry.shapeAreas) return/**just this entry*/;

                        if(dataEntry.shapeAreas) {
                              area += dataEntry.shapeAreas;
                        } else if(dataEntry.QWHD) {
                              area += dataEntry.QWHD.qty * dataEntry.QWHD.width * dataEntry.QWHD.height;
                        }
                  });
            });

            $(this.#f_area[1]).val(area);
      }

      UpdateQty() {
            if(!this.#f_useQtyFormula[1].checked) return;

            let area = 0;

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{pathLength: 0, shapeAreas: 0, boundingRectAreas: 0, QWHD: QWHD}*/) => {

                        if(!dataEntry.QWHD || !dataEntry.shapeAreas) return/**just this entry*/;

                        if(dataEntry.shapeAreas) {
                              area += dataEntry.shapeAreas;
                        } else if(dataEntry.QWHD) {
                              area += dataEntry.QWHD.qty * dataEntry.QWHD.width * dataEntry.QWHD.height;
                        }
                  });
            });

            $(this.qtyField).val(roundNumberUp(area * zeroIfNaNNullBlank(parseFloat(this.#f_formula[1].selectedOptions[0].value))));
      }

      UpdateProductionTimes() {
            this.#f_production.productionTime = this.qty / zeroIfNaNNullBlank(this.#f_LEDPerHour[1].value) * 60;
      }

      UpdateOutput() {
            this.#dataForSubscribers = [];
            this.#f_outputSizeTable.deleteAllRows();

            this.#dataForSubscribers.push({qty: this.qty, wattage: this.wattage, voltage: this.voltage});
            this.#f_outputSizeTable.addRow(this.qty, this.wattage, this.voltage);

      };

      async Create(productNo, partIndex) {
            partIndex = await super.Create(productNo, partIndex);
            var name = this.#f_material[1].value;

            for(let i = 0; i < this.#dataForSubscribers.length; i++) {
                  let partQty = this.#dataForSubscribers[i].qty;
                  partIndex = await q_AddPart_Dimensionless(productNo, partIndex, true, name, partQty, "LED", "");
            }
            partIndex = await this.#f_production.Create(productNo, partIndex);

            return partIndex;
      }

      Description() {
            super.Description();

            return "";
      }
}




/*class LED extends SubMenu {

      LEDParts = [];
      partSearchTerm = "LED";
      l_filters = [];
      #qty;
      #LEDType;
      #filterLabel;
      #LEDColour;
      #LEDWatt;
      #LEDVoltage;
      #LEDLongevity;
      #LEDSize;
      #customLED_Cost;
      #customLED_UnitType;
      #customLED_UnitRestriction;
      #customLED_Markup;
      #LUTContainer;
      #LUT;
      constructor(parentObject, ctx, updateFunction, title) {
            super(parentObject, ctx, updateFunction, title);

            for(var l = 0; l < predefinedParts_obj.length; l++) {
                  if(predefinedParts_obj[l].Name.includes(this.partSearchTerm)) {
                        this.LEDParts.push(predefinedParts_obj[l]);
                  }
            }
            console.log("%cPREDEFINED LED PARTS", 'background: blue; color: white');
            console.log(this.LEDParts);
            this.#qty = createInput_Infield("Qty", 1, "width:80px", this.updateLUT, this.contentContainer, true, 1);

            this.#LEDType = createDropdown_Infield_Icons_Search("LED Type", 0, "width:70%", 80, false,
                  [["select", ""],
                  ["Module", "https://sa-led.com/wp-content/uploads/2021/06/1541_123456.jpg"],
                  ["ZigZag", "https://sa-led.com/wp-content/uploads/catalog/product/4570.jpg"],
                  ["COB Strip", "https://sa-led.com/wp-content/uploads/2022/02/94UB1_COLOUR-600x600.jpg"],
                  ["Straight Strip", "https://sa-led.com/wp-content/uploads/catalog/product/3157.jpg"],
                  ["Neon", "https://5.imimg.com/data5/SELLER/Default/2021/5/BV/CQ/XT/72695664/led-neon-light-500x500.png"],
                  ["Custom", ""]],
                  this.updateLUT,
                  this.contentContainer);

            this.#filterLabel = createLabel("FILTERS", "width:90%", this.contentContainer);

            this.#LEDColour = createDropdown_Infield_Icons_Search("Colour", 0, "width:30%", 30, true,
                  [["select", "#000"],
                  ["3000K", "#f1ff94"],
                  ["6500K", "white"],
                  ["10000K", "rgb(200 243 255)"],
                  ["Red", "Red"],
                  ["Green", "Green"],
                  ["Blue", "Blue"],
                  ["RGB", "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(255,0,0,1) 15%, rgba(255,248,0,1) 29%, rgba(0,255,29,1) 44%, rgba(0,231,240,1) 59%, rgba(0,13,245,1) 74%, rgba(248,0,242,1) 87%, rgba(0,212,255,1) 100%)"]],
                  this.updateLUT,
                  this.contentContainer);

            this.#LEDWatt = createDropdown_Infield("Brightness", 0, "width:15%",
                  [createDropdownOption("select", "select"),
                  createDropdownOption("1.08w (Standard Brightness)", "1.08"),
                  createDropdownOption("1.50w (Premium Brightness)", "1.50")], this.updateLUT, this.contentContainer);

            this.#LEDVoltage = createDropdown_Infield("Voltage", 0, "width:15%",
                  [createDropdownOption("select", "select"),
                  createDropdownOption("12V", "12V"),
                  createDropdownOption("24V", "24V")], this.updateLUT, this.contentContainer);

            this.#LEDLongevity = createDropdown_Infield("Longevity", 0, "width:15%",
                  [createDropdownOption("select", "select"),
                  createDropdownOption("3 yrs", "3yr"),
                  createDropdownOption("5 yrs", "5yr")], this.updateLUT, this.contentContainer);

            this.#LEDSize = createDropdown_Infield("Dimensions", 0, "width:15%",
                  [createDropdownOption("select", "select"),
                  createDropdownOption("Test x Test", "3")], this.updateLUT, this.contentContainer);

            this.#customLED_Cost = createInput_Infield("Cost", null, "width:80px", this.updateLUT, this.contentContainer, true, 100);
            setFieldHidden(true, this.#customLED_Cost[1], this.#customLED_Cost[0]);

            this.#customLED_UnitType = createDropdown_Infield("Unit Type", 0, "width:30%",
                  [createDropdownOption("select", "select"),
                  createDropdownOption("Per Module", "Per Module"),
                  createDropdownOption("Per Bag", "Per Bag"),
                  createDropdownOption("Per Meter", "Per Meter"),
                  createDropdownOption("Per Roll", "Per Roll")], this.updateLUT, this.contentContainer);
            setFieldHidden(true, this.#customLED_UnitType[1], this.#customLED_UnitType[0]);

            this.#customLED_UnitRestriction = createInput_Infield("Qty in Unit", null, "width:80px", this.updateLUT, this.contentContainer, true, 1);
            setFieldHidden(true, this.#customLED_UnitRestriction[1], this.#customLED_UnitRestriction[0]);

            this.#customLED_Markup = createInput_Infield("Markup", 3, "width:80px", this.updateLUT, this.contentContainer, true, 0.1);
            setFieldHidden(true, this.#customLED_Markup[1], this.#customLED_Markup[0]);

            this.#LUTContainer = createDiv("LUTContainer", null, this.contentContainer);

            this.#LUT = this.createLUT();
            console.log("this create lut");
            makeFieldGroup("Checkbox", this.requiredField[1], false,
                  this.#qty[0],
                  this.#LEDType[0],
                  this.#filterLabel,
                  this.#LEDColour[0],
                  this.#LEDWatt[0],
                  this.#LEDVoltage[0],
                  this.#LEDLongevity[0],
                  this.#LEDSize[0],
                  this.#customLED_Cost[0],
                  this.#customLED_UnitType[0],
                  this.#customLED_UnitRestriction[0],
                  this.#customLED_Markup[0],
                  this.#LUTContainer
            );
      }

      get filters() {
            this.l_filters = [];
            if(this.#LEDType[1].value !== "select") this.l_filters.push(this.#LEDType[1].value);
            if(this.#LEDColour[1].value !== "select") this.l_filters.push(this.#LEDColour[1].value);
            if(this.#LEDWatt[1].value !== "select") this.l_filters.push(this.#LEDWatt[1].value);
            if(this.#LEDVoltage[1].value !== "select") this.l_filters.push(this.#LEDVoltage[1].value);
            if(this.#LEDLongevity[1].value !== "select") this.l_filters.push(this.#LEDLongevity[1].value);
            if(this.#LEDSize[1].value !== "select") this.l_filters.push(this.#LEDSize[1].value);
            return this.l_filters;
      }

      createLUT(...filters) {
            while(this.#LUTContainer.hasChildNodes()) {this.#LUTContainer.removeChild(this.#LUTContainer.lastChild);}
            let lut = new Table(this.#LUTContainer, 600, 20, 300);
            lut.setHeading("Part", "Using");
            var partsUse = [];
            topLoop:
            for(var l = 0; l < this.LEDParts.length; l++) {
                  for(var f = 0; f < filters.length; f++) {
                        if(!this.LEDParts[l].Name.includes(filters[f])) {
                              continue topLoop;
                        }
                  }
                  var usingCkb = createCheckbox_Infield("", false, "width:30px;height:30px;", () => { }, null, true);
                  partsUse.push(usingCkb);
                  lut.addRow(this.LEDParts[l].Name, usingCkb[0]);
            }
            checkboxesAddToSelectionGroup(true, ...partsUse);
            this.#LUT = lut;
            return lut;
      }

      updateLUT = () => {
            if(this.#LEDType[1].value === "Custom") {
                  this.closeLUT();
                  this.closeFilters();
                  setFieldHidden(false, this.#customLED_Cost[1], this.#customLED_Cost[0]);
                  setFieldHidden(false, this.#customLED_UnitType[1], this.#customLED_UnitType[0]);
                  setFieldHidden(false, this.#customLED_UnitRestriction[1], this.#customLED_UnitRestriction[0]);
                  setFieldHidden(false, this.#customLED_Markup[1], this.#customLED_Markup[0]);
            } else {
                  setFieldHidden(true, this.#customLED_Cost[1], this.#customLED_Cost[0]);
                  setFieldHidden(true, this.#customLED_UnitType[1], this.#customLED_UnitType[0]);
                  setFieldHidden(true, this.#customLED_UnitRestriction[1], this.#customLED_UnitRestriction[0]);
                  setFieldHidden(true, this.#customLED_Markup[1], this.#customLED_Markup[0]);

                  this.showLUT();
                  this.showFilters();
                  this.createLUT(...this.filters);
            }
      };

      closeLUT = () => {
            setFieldHidden(true, this.#LUT.container);
      };

      showLUT = () => {
            setFieldHidden(false, this.#LUT.container);
      };

      closeFilters = () => {
            setFieldHidden(true, this.#filterLabel, this.#filterLabel);
            setFieldHidden(true, this.#LEDColour[1], this.#LEDColour[0]);
            setFieldHidden(true, this.#LEDWatt[1], this.#LEDWatt[0]);
            setFieldHidden(true, this.#LEDVoltage[1], this.#LEDVoltage[0]);
            setFieldHidden(true, this.#LEDLongevity[1], this.#LEDLongevity[0]);
            setFieldHidden(true, this.#LEDSize[1], this.#LEDSize[0]);
      };

      showFilters = () => {
            setFieldHidden(false, this.#filterLabel, this.#filterLabel);
            setFieldHidden(false, this.#LEDColour[1], this.#LEDColour[0]);
            setFieldHidden(false, this.#LEDWatt[1], this.#LEDWatt[0]);
            setFieldHidden(false, this.#LEDVoltage[1], this.#LEDVoltage[0]);
            setFieldHidden(false, this.#LEDLongevity[1], this.#LEDLongevity[0]);
            setFieldHidden(false, this.#LEDSize[1], this.#LEDSize[0]);
      };
}*/