class Vinyl extends Material {
      static DISPLAY_NAME = "VINYL";

      #materialHeader;
      #production;
      #addVinylBtn;
      #productionHeader;
      #sheetSplitSizes;
      #materialUsageArea;
      get materialUsageArea() {return zeroIfNaNNullBlank(this.#materialUsageArea[1].value);};
      #materialContainer;
      #material;
      set material(value) {$(this.#material[1]).val(value).change();}

      /**
       * @Inherited
       * @example
       * [{parent: 'SHEET-1699952073332-95570559', data: []},
       * {parent: 'SHEET-1699952073332-95574529', data: []}]
       */
      #inheritedData = [];
      #inheritedSizes = [];
      #inheritedSizeTable;

      /**
      * @Subscribers
      * @Updated on table changes
      * @example 
      *          [{qty: 4, width: '2440', height: '1220'},
      *           {qty: 4, width: '2440', height: '580'},
       *           {qty: 1, width: '240', height: '1220'},
      *           {qty: 1, width: '240', height: '580'}]
      */
      #dataForSubscribers = [];

      /**
       * @Bleed
       */
      #bleedDropdown;
      #bleedTop;
      #bleedBottom;
      #bleedLeft;
      #bleedRight;

      /** @RollUsage */
      #rollWidth;
      get rollWidth() {return zeroIfNaNNullBlank(this.#rollWidth[1].value);};
      #rollWastage;
      get rollWastage() {return zeroIfNaNNullBlank(this.#rollWastage[1].value);};
      #rollLengthUsed;
      get rollLengthUsed() {return zeroIfNaNNullBlank(this.#rollLengthUsed[1].value);};


      /** @JoinsOverlap */
      #joinOverlap;
      get joinOverlap() {return zeroIfNaNNullBlank(this.#joinOverlap[1].value);};
      #joinHelperBtn;
      #visualiser;
      #joinOrientation;
      get isJoinHorizontal() {return this.#joinOrientation[1].checked;};

      /**
       * @Output
       */
      #outputSizeTable;
      #outputSizeTable2;
      #outputSizes = [];
      /** @Example [{qty: 1, width: 1370, height: 25000}] as in 1370 being roll width, 25000 being roll length */
      #finalRollSize = [];

      /** @Machine */
      #machineSetupTime;
      get machineSetupTime() {return zeroIfNaNNullBlank(this.#machineSetupTime[1].value);}
      #machineRunSpeed;
      #machineLengthToRun;
      #machineRunTime;
      get machineRunTime() {return zeroIfNaNNullBlank(this.#machineRunTime[1].value);}

      get backgroundColor() {return COLOUR.Yellow;}
      get textColor() {return COLOUR.Black;}

      constructor(parentObject, sizeClass, type) {
            super(parentObject, sizeClass, type);

            /** @InheritedParentSizeSplits */
            createHeadingStyle1("Inherited Parent Size Splits", null, this.container);
            this.#inheritedSizeTable = new Table(this.container, "100%", 20, 250);
            this.#inheritedSizeTable.setHeading("Qty", "Width", "Height", "Needs Joins");
            this.#inheritedSizeTable.addRow("-", "-", "-", "-");

            /** @Bleeds */
            createHeadingStyle1("Bleeds", null, this.container);
            this.#bleedDropdown = createDropdown_Infield("Standard Bleeds", 0, "width:40%",
                  [createDropdownOption("ACM", [20, 20, 20, 20]),
                  createDropdownOption("Windows", [0, 20, 0, 20]),
                  createDropdownOption("Lightbox Faces", [0, 0, 0, 0]),
                  createDropdownOption("Wall Graphics", [20, 50, 0, 10]),
                  createDropdownOption("Reverse Acrylics", [10, 10, 10, 10]),
                  createDropdownOption("Aframes", [10, 10, 10, 10]),
                  createDropdownOption("Corflutes", [10, 10, 10, 10]),
                  createDropdownOption("Car Magnets", [0, 0, 0, 0])], () => {
                        let selectedOption = this.#bleedDropdown[1].value;
                        selectedOption = selectedOption.split(",");
                        $(this.#bleedTop[1]).val(selectedOption[0]).change();
                        $(this.#bleedBottom[1]).val(selectedOption[1]).change();
                        $(this.#bleedLeft[1]).val(selectedOption[2]).change();
                        $(this.#bleedRight[1]).val(selectedOption[3]).change();
                  }, this.container);
            this.#bleedTop = createInput_Infield("Top", 20, "width:100px;", () => {this.UpdateFromChange();}, this.container, false, 10);
            this.#bleedBottom = createInput_Infield("Bottom", 20, "width:100px;", () => {this.UpdateFromChange();}, this.container, false, 10);
            this.#bleedLeft = createInput_Infield("Left", 20, "width:100px;", () => {this.UpdateFromChange();}, this.container, false, 10);
            this.#bleedRight = createInput_Infield("Right", 20, "width:100px;", () => {this.UpdateFromChange();}, this.container, false, 10);

            /** @Material */
            this.#materialHeader = createHeadingStyle1("Material", null, this.container);
            this.#materialUsageArea = createInput_Infield("Total Area", 0, null, () => {this.UpdateFromChange();}, this.container, false, 1);
            setFieldDisabled(true, this.#materialUsageArea[1], this.#materialUsageArea[0]);

            let vinylParts = getPredefinedParts("Vinyl - ");
            let vinylDropdownElements = [];
            vinylParts.forEach(element => vinylDropdownElements.push([element.Name, "white"]));
            this.#material = createDropdown_Infield_Icons_Search("Vinyl", 0, "width:60%;", 10, true, vinylDropdownElements, () => {this.UpdateFromChange();}, this.container);
            $(this.#material).val(VinylLookup["Air Release"]).change();

            /** @RollUsage */
            createHeadingStyle1("Roll Usage", null, this.container);
            this.#rollWidth = createInput_Infield("Roll Width", 1370, "width:100px;", () => {this.UpdateFromChange();}, this.container, false, 10);
            this.#rollWastage = createInput_Infield("Roll Wastage % *Approx", 25, "width:200px;", () => {this.UpdateFromChange();}, this.container, false, 10);
            this.#rollLengthUsed = createInput_Infield("Roll Length (m) Used *Approx", 0, "width:200px;", () => {this.UpdateFromChange();}, this.container, false, 10);
            setFieldDisabled(true, this.#rollLengthUsed[1], this.#rollLengthUsed[0]);

            /**@JoinOverlap */
            createHeadingStyle1("Joins", null, this.container);
            this.#joinHelperBtn = createIconButton("https://cdn.gorilladash.com/images/media/6195615/signarama-australia-searching-63ad3d8672602.png", "Visualiser", "width:200px;height:40px;", () => {
                  this.#visualiser = new ModalVinylJoins("Join Helper", 100, () => {
                        this.#visualiser.Close();
                        this.UpdateFromChange();
                  }, this);

                  this.#visualiser.borrowFields(this.#joinOverlap[0], this.#joinOrientation[0], this.#rollWidth[0], this.#material[0], this.#bleedDropdown[0], this.#bleedTop[0], this.#bleedBottom[0], this.#bleedLeft[0], this.#bleedRight[0]);
                  this.#visualiser.setBleedFields(this.#bleedTop[1], this.#bleedBottom[1], this.#bleedLeft[1], this.#bleedRight[1]);
                  this.#visualiser.setJoinOrientationField(this.#joinOrientation[1]);
                  this.#visualiser.setRollWidthField(this.#rollWidth[1]);
                  this.#visualiser.setJoinOverlapField(this.#joinOverlap[1]);
                  this.#visualiser.width = this.getQWH().width;
                  this.#visualiser.height = this.getQWH().height;

                  let matrixSizeArrays = [];
                  for(let i = 0; i < this.#inheritedData.length; i++) {
                        matrixSizeArrays.push(this.#inheritedData[i].matrixSizes);
                  }
                  this.#visualiser.setSizeArrays(...matrixSizeArrays);
            }, this.container, true);
            this.#joinOverlap = createInput_Infield("Join Overlap", 10, "width:100px;", () => {this.UpdateFromChange();}, this.container, false, 5);
            this.#joinOrientation = createCheckbox_Infield("Join Horizontal", true, "width:150px", () => {this.UpdateFromChange();}, this.container, () => {this.UpdateFromChange();});

            /** @OutputSizes */
            createHeadingStyle1("Output Sizes", null, this.container);
            createText("Individual Pieces", "width:100%;height:20px", this.container);
            this.#outputSizeTable = new Table(this.container, "100%", 20, 250);
            this.#outputSizeTable.setHeading("Qty", "Width", "Height");
            this.#outputSizeTable.addRow("-", "-", "-");

            createText("Roll Usage", "width:100%;height:20px", this.container);
            this.#outputSizeTable2 = new Table(this.container, "100%", 20, 250);
            this.#outputSizeTable2.setHeading("Qty", "Width", "Height");
            this.#outputSizeTable2.addRow("-", "-", "-");

            /** @Machine */
            createHeadingStyle1("Machine", null, this.container);
            createText("Setup", "width:100%;height:20px", this.container);
            this.#machineSetupTime = createInput_Infield("Setup Time (min)", 2, null, () => {this.UpdateFromChange();}, this.container, false, 0.1);

            createText("Run", "width:100%;height:20px", this.container);
            this.#machineRunSpeed = createInput_Infield("Run Speed (m/min)", 0.3, null, () => {this.UpdateFromChange();}, this.container, false, 0.1);
            this.#machineLengthToRun = createInput_Infield("Length to Run (m)", -1, null, () => {this.UpdateFromChange();}, this.container, false, 1);
            setFieldDisabled(true, this.#machineLengthToRun[1], this.#machineLengthToRun[0]);
            this.#machineRunTime = createInput_Infield("Total Run Time (mins)", -1, null, () => {this.UpdateFromChange();}, this.container, false, 1);
            setFieldDisabled(true, this.#machineRunTime[1], this.#machineRunTime[0]);

            /** @Production */
            createHeadingStyle1("Production", null, this.container);
            this.#production = new Production(this.container, null, function() { }, this.sizeClass);
            this.#production.showContainerDiv = true;
            this.#production.productionTime = 20;
            this.#production.required = true;
            this.#production.showRequiredCkb = false;
            this.#production.requiredName = "Production Time";

            this.UpdateDataForSubscribers();
      }

      /**@Inherited */
      UpdateFromChange() {
            super.UpdateFromChange();

            this.UpdateInheritedTable();
            this.UpdateOutputTable();
            this.UpdateRollOptions();
            this.UpdateVisualizer();
            this.UpdateMachineTimes();
            this.UpdateProductionTimes();
            this.UpdateDataForSubscribers();
            this.UpdateSubscribedLabel();
            this.PushToSubscribers();
      }

      UpdateDataForSubscribers() {
            this.dataToPushToSubscribers = {
                  parent: this,
                  data: this.#dataForSubscribers,
                  finalRollSize: this.#finalRollSize
            };
      }

      UpdateVisualizer() {
            if(this.#visualiser) this.#visualiser.updateFromFields();
      }

      UpdateInheritedTable = () => {
            this.#inheritedSizes = [];
            this.#inheritedSizeTable.deleteAllRows();

            let rowNumber = 0;

            for(let a = 0; a < this.#inheritedData.length; a++) {//Per Parent Subscription:
                  let recievedInputSizes = this.#inheritedData[a].data;
                  for(let i = 0; i < recievedInputSizes.length; i++) {

                        this.#inheritedSizes.push(recievedInputSizes[i]);
                        let needsJoins = Vinyl.isSizeBiggerThanRoll(recievedInputSizes[i].width, recievedInputSizes[i].height, this.rollWidth);

                        this.#inheritedSizeTable.addRow(recievedInputSizes[i].qty, recievedInputSizes[i].width, recievedInputSizes[i].height, "" + (needsJoins ? "yes" : "no"));
                        rowNumber++;
                        if(needsJoins) {
                              this.#inheritedSizeTable.getCell(rowNumber, 4).style.backgroundColor = "red";
                              this.#inheritedSizeTable.getCell(rowNumber, 4).style.color = "white";
                        } else {
                              this.#inheritedSizeTable.getCell(rowNumber, 4).style.backgroundColor = "white";
                              this.#inheritedSizeTable.getCell(rowNumber, 4).style.color = "black";
                        }
                  }
            }
      };

      UpdateMachineTimes() {
            let totalLength_mm = mToMM(this.rollLengthUsed);
            let runSpeed_mMin = zeroIfNaNNullBlank(this.#machineRunSpeed[1].value);
            let setupTime = zeroIfNaNNullBlank(this.#machineSetupTime[1].value);

            this.#machineLengthToRun[1].value = roundNumber(mmToM(totalLength_mm), 2);
            this.#machineRunTime[1].value = roundNumber(mmToM(totalLength_mm) / runSpeed_mMin, 2);
      }

      UpdateProductionTimes() {
            this.#production.productionTime = this.machineSetupTime + this.machineRunTime;
      }

      UpdateRollOptions() {
            let rollWidth_M = mmToM(this.rollWidth);
            let rollWastage_Percentage = this.rollWastage;
            let rollWastage_Decimal = rollWastage_Percentage / 100;
            let materialUsageArea = this.materialUsageArea;

            let rollLengthUsed = (materialUsageArea) / (rollWidth_M - (rollWidth_M * rollWastage_Decimal));
            this.#rollLengthUsed[1].value = roundNumber(rollLengthUsed, 2);

            if(rollLengthUsed > 50) {
                  console.log("%cNeed to implement multiple roll quantities for rollLengthUsed > 50, Vinyl.js", "background-color:red;color:white;font-weight:bold");
            }

            this.#finalRollSize = [{qty: 1, width: this.rollWidth, height: mToMM(rollLengthUsed)}];

            this.#outputSizeTable2.deleteAllRows();
            for(let j = 0; j < this.#finalRollSize.length; j++) {
                  this.#outputSizeTable2.addRow(this.#finalRollSize[j].qty, roundNumber(this.#finalRollSize[j].width, 2), roundNumber(this.#finalRollSize[j].height, 2));
            }
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

      UpdateOutputTable() {
            this.#outputSizes = [];
            this.#outputSizeTable.deleteAllRows();

            for(let i = 0; i < this.#inheritedSizes.length; i++) {
                  let qtyVal = this.#inheritedSizes[i].qty;
                  let widthVal = this.#inheritedSizes[i].width + zeroIfNaNNullBlank(this.#bleedLeft[1].value) + zeroIfNaNNullBlank(this.#bleedRight[1].value);
                  let heightVal = this.#inheritedSizes[i].height + zeroIfNaNNullBlank(this.#bleedTop[1].value) + zeroIfNaNNullBlank(this.#bleedBottom[1].value);

                  if(Vinyl.isSizeBiggerThanRoll(widthVal, heightVal, this.rollWidth)) {
                        let sizes = Vinyl.createJoins(qtyVal, widthVal, heightVal, this.isJoinHorizontal, true, this.rollWidth, this.joinOverlap);
                        for(let j = 0; j < sizes.length; j++) {
                              this.#outputSizes.push({qty: sizes[j].qty, width: sizes[j].width, height: sizes[j].height});
                              this.#outputSizeTable.addRow(sizes[j].qty, sizes[j].width, sizes[j].height);
                        }
                  } else {
                        this.#outputSizes.push({qty: qtyVal, width: widthVal, height: heightVal});
                        this.#outputSizeTable.addRow(qtyVal, widthVal, heightVal);
                  }
            }

            $(this.#materialUsageArea[1]).val(combinedSqm(this.#outputSizes));//.change();

            this.#dataForSubscribers = this.#outputSizes;
      };

      ReceiveSubscriptionData(data) {
            let dataIsNew = true;
            for(let i = 0; i < this.#inheritedData.length; i++) {
                  if(data.parent == this.#inheritedData[i].parent) {
                        dataIsNew = false;
                        this.#inheritedData[i] = data;
                        break;
                  }
            }
            if(dataIsNew) {
                  this.#inheritedData.push(data);
            }

            super.ReceiveSubscriptionData(data);
      }

      /**@Override */
      UnSubscribeFrom(parent) {
            for(let i = 0; i < this.#inheritedData.length; i++) {
                  if(this.#inheritedData[i].parent == parent) {
                        this.#inheritedData.splice(i, 1);
                        break;
                  }
            }
            super.UnSubscribeFrom(parent);
      }

      async Create(productNo, partIndex) {
            partIndex = await super.Create(productNo, partIndex);
            // var name = this.l_material[1].value + " - (sqm) - " + this.l_finish[1].value + " " + this.l_size[1].value.replaceAll("mm", "").replaceAll(" ", "") + "x" + this.l_thickness[1].value;

            var partFullName = getPredefinedParts_Name_FromLimitedName(name);
            return partIndex;
      }
}