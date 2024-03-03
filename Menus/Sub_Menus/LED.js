
class LED extends SubMenu {

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
}