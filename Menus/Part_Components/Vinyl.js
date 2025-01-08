class Vinyl extends Material {      /*
                        
      Variables         */
      static DISPLAY_NAME = "VINYL";
      #dataForSubscribers = [{
            QWHD: new QWHD(),
            finalRollSize: new QWHD()
      }];

      #finalRollSize = new QWHD();
      /*
                        
      Fields            */
      #f_production;
      #f_materialUsageArea;
      #f_material;
      #f_inheritedSizeTable;
      #f_outputSizeTable;
      #f_outputSizeTable2;

      /*
      Machine*/
      #f_machineSetupTime;
      #f_machineRunSpeed;
      #f_machineLengthToRun;
      #f_machineRunTime;
      #f_machineTotalTime;
      /*
      JoinsOverlap*/
      #f_joinOverlap;
      #f_joinHelperBtn;
      #f_visualiser;
      #f_joinOrientation;
      /*
      RollUsage*/
      #f_rollWidth;
      #f_rollWastage;
      #f_rollLengthUsed;
      /*
      Bleed*/
      #f_bleedDropdown;
      #f_bleedTop;
      #f_bleedBottom;
      #f_bleedLeft;
      #f_bleedRight;
      /*
                        
      Getter            */
      get machineSetupTime() {return zeroIfNaNNullBlank(this.#f_machineSetupTime[1].value);}
      get machineRunTime() {return zeroIfNaNNullBlank(this.#f_machineRunTime[1].value);}
      get machineTotalTime() {return zeroIfNaNNullBlank(this.#f_machineTotalTime[1].value);}
      get backgroundColor() {return COLOUR.Yellow;}
      get textColor() {return COLOUR.Black;}
      get materialUsageArea() {return zeroIfNaNNullBlank(this.#f_materialUsageArea[1].value);};
      get isJoinHorizontal() {return this.#f_joinOrientation[1].checked;};
      get joinOverlap() {return zeroIfNaNNullBlank(this.#f_joinOverlap[1].value);};
      get rollLengthUsed() {return zeroIfNaNNullBlank(this.#f_rollLengthUsed[1].value);};
      get rollWastage() {return zeroIfNaNNullBlank(this.#f_rollWastage[1].value);};
      get rollWidth() {return zeroIfNaNNullBlank(this.#f_rollWidth[1].value);};
      /*override*/get Type() {return "VINYL";}
      /*
                        
      Setter            */
      set material(value) {$(this.#f_material[1]).val(value).change();}
      set bleedDropdown(stringValue = "") {
            for(let i = 0; i < this.#f_bleedDropdown[1].options.length; i++) {
                  if(this.#f_bleedDropdown[1].options[i].text == stringValue) {
                        this.#f_bleedDropdown[1].selectedIndex = i;
                        $(this.#f_bleedDropdown[1]).change();
                        break;
                  }
                  if(i == this.#f_bleedDropdown[1].options.length - 1) alert("could not find bleed type");
            }
      }
      set bleedTop(value) {$(this.#f_bleedTop[1]).val(value).change();}
      set bleedBottom(value) {$(this.#f_bleedBottom[1]).val(value).change();}
      set isJoinHorizontal(value) {this.#f_joinOrientation[1].checked = value; $(this.#f_joinOrientation[1]).change();}
      set bleedLeft(value) {$(this.#f_bleedLeft[1]).val(value).change();}
      set bleedRight(value) {$(this.#f_bleedRight[1]).val(value).change();}

      /*
                        
      Start             */
      constructor(parentObject, sizeClass, type) {
            super(parentObject, sizeClass, type);

            /*
            InheritedParentSizeSplits*/
            let f_container_inheritedParentSizeSplits = createDivStyle5(null, "Inherited Parent Size Splits", this.container)[1];
            this.#f_inheritedSizeTable = new Table(f_container_inheritedParentSizeSplits, "100%", 20, 250);
            this.#f_inheritedSizeTable.setHeading("Qty", "Width", "Height", "Needs Joins");
            this.#f_inheritedSizeTable.addRow("-", "-", "-", "-");
            this.#f_inheritedSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Bleeds*/
            let f_container_bleeds = createDivStyle5(null, "Bleeds", this.container)[1];
            this.#f_bleedDropdown = createDropdown_Infield("Standard Bleeds", 0, "width:40%",
                  [createDropdownOption("ACM", [20, 20, 20, 20]),
                  createDropdownOption("Windows", [0, 20, 0, 20]),
                  createDropdownOption("Lightbox Faces", [0, 0, 0, 0]),
                  createDropdownOption("Wall Graphics", [20, 50, 0, 10]),
                  createDropdownOption("Reverse Acrylics", [10, 10, 10, 10]),
                  createDropdownOption("Aframes", [10, 10, 10, 10]),
                  createDropdownOption("Corflutes", [10, 10, 10, 10]),
                  createDropdownOption("Car Magnets", [0, 0, 0, 0])], () => {
                        let selectedOption = this.#f_bleedDropdown[1].value;
                        selectedOption = selectedOption.split(",");
                        $(this.#f_bleedTop[1]).val(selectedOption[0]).change();
                        $(this.#f_bleedBottom[1]).val(selectedOption[1]).change();
                        $(this.#f_bleedLeft[1]).val(selectedOption[2]).change();
                        $(this.#f_bleedRight[1]).val(selectedOption[3]).change();
                  }, f_container_bleeds);
            this.#f_bleedTop = createInput_Infield("Top", 20, "width:100px;", () => {this.UpdateFromChange();}, f_container_bleeds, false, 10, {postfix: "mm"});
            this.#f_bleedBottom = createInput_Infield("Bottom", 20, "width:100px;", () => {this.UpdateFromChange();}, f_container_bleeds, false, 10, {postfix: "mm"});
            this.#f_bleedLeft = createInput_Infield("Left", 20, "width:100px;", () => {this.UpdateFromChange();}, f_container_bleeds, false, 10, {postfix: "mm"});
            this.#f_bleedRight = createInput_Infield("Right", 20, "width:100px;", () => {this.UpdateFromChange();}, f_container_bleeds, false, 10, {postfix: "mm"});

            /*
            JoinOverlap*/
            let f_container_joins = createDivStyle5(null, "Joins", this.container)[1];

            this.#f_joinHelperBtn = createIconButton("https://cdn.gorilladash.com/images/media/6195615/signarama-australia-searching-63ad3d8672602.png", "Visualiser", "width:calc(100% - 20px);height:40px;background-color:" + COLOUR.Orange + ";", () => {
                  this.#f_visualiser = new ModalVinylJoins("Join Helper", 100, () => {
                        this.UpdateFromChange();
                  }, this);

                  this.#f_visualiser.borrowFields(this.#f_joinOverlap[0], this.#f_joinOrientation[0], this.#f_rollWidth[0], this.#f_material[0], this.#f_bleedDropdown[0], this.#f_bleedTop[0], this.#f_bleedBottom[0], this.#f_bleedLeft[0], this.#f_bleedRight[0]);
                  //this.#f_visualiser.borrowFields(...this.#filterContainersOrdered, this.#flip[0], methodContainer);
                  this.#f_visualiser.setBleedFields(this.#f_bleedTop[1], this.#f_bleedBottom[1], this.#f_bleedLeft[1], this.#f_bleedRight[1]);
                  this.#f_visualiser.setJoinOrientationField(this.#f_joinOrientation[1]);
                  this.#f_visualiser.setRollWidthField(this.#f_rollWidth[1]);
                  this.#f_visualiser.setJoinOverlapField(this.#f_joinOverlap[1]);
                  this.#f_visualiser.width = this.getQWH().width;
                  this.#f_visualiser.height = this.getQWH().height;

                  let matrixSizeArrays = [];
                  this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                        subscription.data.forEach((dataEntry/**{QWHD: QWHD, matrixSizes: [...]}*/) => {

                              if(dataEntry.matrixSizes) matrixSizeArrays.push(dataEntry.matrixSizes);
                        });
                  });
                  this.#f_visualiser.setSizeArrays(...matrixSizeArrays);
            }, f_container_joins, true);
            this.#f_joinOverlap = createInput_Infield("Join Overlap", 10, "width:30%;", () => {this.UpdateFromChange();}, f_container_joins, false, 5, {postfix: "mm"});
            this.#f_joinOrientation = createCheckbox_Infield("Join Horizontal", true, "width:30%", () => {this.UpdateFromChange();}, f_container_joins, () => {this.UpdateFromChange();});

            /*
            RollUsage*/
            let f_container_rollUsage = createDivStyle5(null, "Roll Usage", this.container)[1];

            this.#f_rollWidth = createInput_Infield("Roll Width", 1370, "width:30%;", () => {this.UpdateFromChange();}, f_container_rollUsage, false, 10, {postfix: "mm"});
            this.#f_rollWastage = createInput_Infield("Roll Wastage *Approx", 20, "width:30%;", () => {this.UpdateFromChange();}, f_container_rollUsage, false, 10, {postfix: "%"});
            this.#f_rollLengthUsed = createInput_Infield("Roll Length Used *Approx", 0, "width:30%;", () => {this.UpdateFromChange();}, f_container_rollUsage, false, 10, {postfix: "m"});
            setFieldDisabled(true, this.#f_rollLengthUsed[1], this.#f_rollLengthUsed[0]);

            /*
            Material*/
            let f_container_material = createDivStyle5(null, "Material", this.container)[1];

            this.#f_materialUsageArea = createInput_Infield("Total Area", 0, "30%;", () => {this.UpdateFromChange();}, f_container_material, false, 1, {postfix: "m2"});
            setFieldDisabled(true, this.#f_materialUsageArea[1], this.#f_materialUsageArea[0]);

            let vinylParts = getPredefinedParts("Vinyl - ");
            let vinylDropdownElements = [];
            vinylParts.forEach(element => vinylDropdownElements.push([element.Name, "white"]));
            this.#f_material = createDropdown_Infield_Icons_Search("Vinyl", 0, "width:60%;", 10, true, vinylDropdownElements, () => {this.UpdateFromChange();}, f_container_material);
            $(this.#f_material).val(VinylLookup["Air Release"]).change();


            /*
            Machine*/
            let f_container_machine = createDivStyle5(null, "HP Printer", this.container)[1];

            createText("Setup", "width:100%;height:20px", f_container_machine);
            this.#f_machineSetupTime = createInput_Infield("Setup Time", 2, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 0.1, {postfix: "min"});

            createText("Run", "width:100%;height:20px", f_container_machine);
            this.#f_machineLengthToRun = createInput_Infield("Length to Run", -1, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 1, {postfix: "m"});
            setFieldDisabled(true, this.#f_machineLengthToRun[1], this.#f_machineLengthToRun[0]);
            this.#f_machineRunSpeed = createInput_Infield("Run Speed", 0.3, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 0.1, {postfix: "m/min"});
            this.#f_machineRunTime = createInput_Infield("Total Run Time", -1, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 1, {postfix: "mins"});
            setFieldDisabled(true, this.#f_machineRunTime[1], this.#f_machineRunTime[0]);

            createText("Total", "width:100%;height:20px", f_container_machine);
            this.#f_machineTotalTime = createInput_Infield("Total Time", -1, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 1, {postfix: "mins"});
            setFieldDisabled(true, this.#f_machineTotalTime[1], this.#f_machineTotalTime[0]);

            /*
            Production*/
            let f_container_production = createDivStyle5(null, "HP Printer Production", this.container)[1];

            this.#f_production = new Production(f_container_production, null, function() { }, this.sizeClass);
            this.#f_production.showContainerDiv = true;
            this.#f_production.productionTime = 20;
            this.#f_production.headerName = "Printer Production";
            this.#f_production.required = true;
            this.#f_production.showRequiredCkb = false;
            this.#f_production.requiredName = "Required";
            /*
            OutputSizes*/
            let f_container_outputSizes = createDivStyle5(null, "Output Sizes", this.container)[1];

            createText("Individual Pieces", "width:100%;height:20px", f_container_outputSizes);
            this.#f_outputSizeTable = new Table(f_container_outputSizes, "100%", 20, 250);
            this.#f_outputSizeTable.setHeading("Qty", "Width", "Height");
            this.#f_outputSizeTable.addRow("-", "-", "-");
            this.#f_outputSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            createText("Roll Usage", "width:100%;height:20px", f_container_outputSizes);
            this.#f_outputSizeTable2 = new Table(f_container_outputSizes, "100%", 20, 250);
            this.#f_outputSizeTable2.setHeading("Qty", "Width", "Length");
            this.#f_outputSizeTable2.addRow("-", "-", "-");
            this.#f_outputSizeTable2.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Update*/
            this.UpdateFromChange();
      }

      /*
      Inherited*/
      UpdateFromChange() {
            super.UpdateFromChange();

            this.UpdateFromInheritedData();

            this.UpdateRollOptions();
            this.UpdateVisualizer();
            this.UpdateMachineTimes();
            this.UpdateProductionTimes();

            this.UpdateDataForSubscribers();
            this.UpdateOutput();
            this.PushToSubscribers();
      }

      UpdateDataForSubscribers() {
            this.DATA_FOR_SUBSCRIBERS = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
      }

      UpdateVisualizer() {
            if(this.#f_visualiser) this.#f_visualiser.updateFromFields();
      }

      UpdateFromInheritedData = () => {
            this.#f_inheritedSizeTable.deleteAllRows();

            let rowNumber = 1;

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{QWHD: QWHD}*/) => {

                        if(!dataEntry.QWHD) return/**Only this iteration*/;

                        let needsJoins = Vinyl.isSizeBiggerThanRoll(dataEntry.QWHD.width, dataEntry.QWHD.height, this.rollWidth);

                        this.#f_inheritedSizeTable.addRow(dataEntry.QWHD.qty, dataEntry.QWHD.width, dataEntry.QWHD.height, "" + (needsJoins ? "yes" : "no"));

                        if(needsJoins) {
                              this.#f_inheritedSizeTable.getCell(rowNumber, 4).style.backgroundColor = "red";
                              this.#f_inheritedSizeTable.getCell(rowNumber, 4).style.color = "white";
                        } else {
                              this.#f_inheritedSizeTable.getCell(rowNumber, 4).style.backgroundColor = "white";
                              this.#f_inheritedSizeTable.getCell(rowNumber, 4).style.color = "black";
                        }
                        rowNumber++;
                  });
            });
      };

      UpdateMachineTimes() {
            this.#f_machineLengthToRun[1].value = roundNumber(this.rollLengthUsed, 2);
            this.#f_machineRunTime[1].value = roundNumber(this.rollLengthUsed / zeroIfNaNNullBlank(this.#f_machineRunSpeed[1].value), 2);
            this.#f_machineTotalTime[1].value = this.machineSetupTime + this.machineRunTime;
      }

      UpdateProductionTimes() {
            this.#f_production.productionTime = this.machineTotalTime;
      }

      UpdateRollOptions() {
            let rollWidth_M = mmToM(this.rollWidth);
            let rollWastage_Percentage = this.rollWastage;
            let rollWastage_Decimal = rollWastage_Percentage / 100;
            let materialUsageArea = this.materialUsageArea;

            let rollLengthUsed = (materialUsageArea) / (rollWidth_M - (rollWidth_M * rollWastage_Decimal));
            this.#f_rollLengthUsed[1].value = roundNumber(rollLengthUsed, 2);

            if(rollLengthUsed > 50) {
                  console.log("%cNeed to implement multiple roll quantities for rollLengthUsed > 50, Vinyl.js", "background-color:red;color:white;font-weight:bold");
            }

            this.#finalRollSize = new QWHD(1, this.rollWidth, mToMM(rollLengthUsed));

            this.#f_outputSizeTable2.deleteAllRows();
            this.#f_outputSizeTable2.addRow(this.#finalRollSize.qty, roundNumber(this.#finalRollSize.width, 2), roundNumber(this.#finalRollSize.height, 2));

      }

      static isSizeBiggerThanRoll(width, height, rollWidth) {
            if(width > rollWidth && height > rollWidth) return true;
            return false;
      }

      /**
       * @param {*} width 
       * @param {*} height 
       * @param {*} horizontal 
       * @returns Array of Objects
       * @example [{qty: qty, width: width, height: height},
       *           {qty: qty, width: width, height: height}...]
       */
      static createJoins(qty = 1, width, height, horizontal = true, evenlyDistributed = true, rollWidth, joinOverlap) {
            let vertical = !horizontal;
            if(rollWidth < joinOverlap) return new Error("rollWidth < joinOverlap");
            if(evenlyDistributed) {
                  if(horizontal) {
                        let numberOfPieces = Math.ceil(height / (rollWidth - joinOverlap));
                        let numberOfJoins = numberOfPieces - 1;
                        let extraWidthDueToJoins = numberOfJoins * joinOverlap;
                        let extraEach = extraWidthDueToJoins / numberOfPieces;
                        let newHeight2 = (height / numberOfPieces) + extraEach;

                        return [{qty: numberOfPieces * qty, width: width, height: newHeight2}];
                  } else if(vertical) {
                        let numberOfPieces = Math.ceil(width / (rollWidth - joinOverlap));
                        let numberOfJoins = numberOfPieces - 1;
                        let extraWidthDueToJoins = numberOfJoins * joinOverlap;
                        let extraEach = extraWidthDueToJoins / numberOfPieces;
                        let newWidth2 = (width / numberOfPieces) + extraEach;

                        return [{qty: numberOfPieces * qty, width: newWidth2, height: height}];
                  }
            } else {
                  return new Error("Not yet implemented");
            }
      }

      UpdateOutput() {
            this.#dataForSubscribers = [];
            this.#f_outputSizeTable.deleteAllRows();

            let sizeArray = [];

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{QWHD: QWHD, matrixSizes: [...]}*/) => {

                        let qtyVal = dataEntry.QWHD.qty;
                        let widthVal = dataEntry.QWHD.width + zeroIfNaNNullBlank(this.#f_bleedLeft[1].value) + zeroIfNaNNullBlank(this.#f_bleedRight[1].value);
                        let heightVal = dataEntry.QWHD.height + zeroIfNaNNullBlank(this.#f_bleedTop[1].value) + zeroIfNaNNullBlank(this.#f_bleedBottom[1].value);

                        if(Vinyl.isSizeBiggerThanRoll(widthVal, heightVal, this.rollWidth)) {
                              let sizes = Vinyl.createJoins(qtyVal, widthVal, heightVal, this.isJoinHorizontal, true, this.rollWidth, this.joinOverlap);
                              for(let j = 0; j < sizes.length; j++) {
                                    this.#dataForSubscribers.push({QWHD: new QWHD(sizes[j].qty * this.qty, sizes[j].width, sizes[j].height), finalRollSize: this.#finalRollSize});
                                    this.#f_outputSizeTable.addRow(sizes[j].qty * this.qty, sizes[j].width, sizes[j].height);
                                    sizeArray.push(new QWHD(sizes[j].qty * this.qty, sizes[j].width, sizes[j].height));
                              }
                        } else {
                              this.#dataForSubscribers.push({QWHD: new QWHD(qtyVal * this.qty, widthVal, heightVal), finalRollSize: this.#finalRollSize});
                              this.#f_outputSizeTable.addRow(qtyVal * this.qty, widthVal, heightVal);
                              sizeArray.push(new QWHD(qtyVal * this.qty, widthVal, heightVal));
                        }

                  });
            });

            $(this.#f_materialUsageArea[1]).val(combinedSqm(sizeArray));

      }

      async Create(productNo, partIndex) {
            partIndex = await super.Create(productNo, partIndex);
            var name = this.#f_material[1].value;
            var partFullName = getPredefinedParts_Name_FromLimitedName(name);

            let dataEntries = [];

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{QWHD: QWHD, matrixSizes: [...]}*/) => {

                        dataEntries.push(dataEntry);
                  });
            });

            for(let i = 0; i < dataEntries.length; i++) {
                  partIndex = await q_AddPart_DimensionWH(productNo, partIndex, true, partFullName, dataEntries[i].QWHD.qty, dataEntries[i].QWHD.width, dataEntries[i].QWHD.height, partFullName, "", false);
            }

            partIndex = await this.#f_production.Create(productNo, partIndex);

            return partIndex;
      }
}