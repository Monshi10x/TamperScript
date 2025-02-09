class Laminate extends Material {
      /*
                        
      Variables         */
      static DISPLAY_NAME = "LAMINATE";
      #useRollLength = false;
      #dataForSubscribers = [{QWHD: new QWHD()}];
      #totalRunLength = 0;
      /*
                        
      Fields            */
      #f_material;
      #f_materialTotalArea;
      #f_production;
      #f_useRollLength;
      #f_inheritedSizeTable;
      /*
      Machine*/
      #f_machineSetupTime;
      #f_machineRunSpeed;
      #f_machineLengthToRun;
      #f_machineRunTime;
      #f_machineTotalTime;
      /*
      Output*/
      #f_outputSizeTable;
      /*
                        
      Getter            */
      /*override*/get Type() {return "LAMINATE";}
      get machineSetupTime() {return zeroIfNaNNullBlank(this.#f_machineSetupTime[1].value);}
      get machineRunTime() {return zeroIfNaNNullBlank(this.#f_machineRunTime[1].value);}
      get machineTotalTime() {return zeroIfNaNNullBlank(this.#f_machineTotalTime[1].value);}
      get backgroundColor() {return COLOUR.Purple;}
      get textColor() {return COLOUR.White;}
      /*
                        
      Setter            */
      set material(value) {$(this.#f_material[1]).val(value).change();}
      /*
                        
      Start             */
      constructor(parentObject, sizeClass, type) {
            super(parentObject, sizeClass, type);

            /*
            InheritedParentSizeSplits*/
            let f_container_inheritedParentSizeSplits = createDivStyle5(null, "Inherited Parent Size Splits", this.container)[1];

            this.#f_useRollLength = createCheckbox_Infield("Use Approx. Roll Length", this.#useRollLength, "width:300px;", () => {this.#useRollLength = this.#f_useRollLength[1].checked; this.UpdateFromChange();}, f_container_inheritedParentSizeSplits);
            this.#f_inheritedSizeTable = new Table(f_container_inheritedParentSizeSplits, "100%", 20, 250);
            this.#f_inheritedSizeTable.setHeading("Qty", "Width", "Height/Length");
            this.#f_inheritedSizeTable.addRow("-", "-", "-");
            this.#f_inheritedSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Material*/
            let f_container_material = createDivStyle5(null, "Laminate", this.container)[1];

            this.#f_materialTotalArea = createInput_Infield("Total Area", 0, null, () => { }, f_container_material, false, 1, {postfix: "m2"});
            setFieldDisabled(true, this.#f_materialTotalArea[1], this.#f_materialTotalArea[0]);

            var laminateDropdownElements = [];
            var laminateParts = getPredefinedParts("Laminate - ");
            laminateParts.forEach((element) => {
                  let isStocked = false;
                  if(element.Weight) {
                        let parsedWeight = JSON.parse(element.Weight);
                        if(parsedWeight.isStocked) isStocked = parsedWeight.isStocked;
                  }
                  laminateDropdownElements.push([element.Name, isStocked ? "blue" : "white"]);
            });
            let vinylParts = getPredefinedParts(VinylLookup["Whiteback"]);
            vinylParts.forEach((element) => {
                  let isStocked = false;
                  if(element.Weight) {
                        let parsedWeight = JSON.parse(element.Weight);
                        if(parsedWeight.isStocked) isStocked = parsedWeight.isStocked;
                  }
                  laminateDropdownElements.push([element.Name, isStocked ? "blue" : "white"]);
            });

            this.#f_material = createDropdown_Infield_Icons_Search("Laminate", 0, "width:60%;", 10, true, laminateDropdownElements, () => {this.UpdateFromChange();}, f_container_material);
            dropdownInfieldIconsSearchSetSelected(this.#f_material, LaminateLookup["Gloss"], false, false);

            /*
            Machine*/
            let f_container_machine = createDivStyle5(null, "Machine", this.container)[1];

            createText("Setup", "width:100%;height:20px", f_container_machine);
            this.#f_machineSetupTime = createInput_Infield("Setup Time Average", 3, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 0.1, {postfix: "min"});

            createText("Run", "width:100%;height:20px", f_container_machine);
            this.#f_machineLengthToRun = createInput_Infield("Length to Run", -1, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 1, {postfix: "m"});
            setFieldDisabled(true, this.#f_machineLengthToRun[1], this.#f_machineLengthToRun[0]);
            this.#f_machineRunSpeed = createInput_Infield("Run Speed", 2, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 0.1, {postfix: "m/min"});
            this.#f_machineRunTime = createInput_Infield("Run Time", -1, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 1, {postfix: "mins"});
            setFieldDisabled(true, this.#f_machineRunTime[1], this.#f_machineRunTime[0]);
            createText("Total", "width:100%;height:20px", f_container_machine);
            this.#f_machineTotalTime = createInput_Infield("Total Time", -1, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 1, {postfix: "mins"});
            setFieldDisabled(true, this.#f_machineTotalTime[1], this.#f_machineTotalTime[0]);

            /*
            Production*/
            let f_container_production = createDivStyle5(null, "Laminator Production", this.container)[1];

            this.#f_production = new Production(f_container_production, null, function() { }, this.sizeClass);
            this.#f_production.showContainerDiv = true;
            this.#f_production.productionTime = 20;
            this.#f_production.headerName = "Laminator Production";
            this.#f_production.required = true;
            this.#f_production.showRequiredCkb = false;
            this.#f_production.requiredName = "Required";

            /*
            OutputSizes*/
            let f_container_outputSizes = createDivStyle5(null, "Output Sizes", this.container)[1];

            this.#f_outputSizeTable = new Table(f_container_outputSizes, "100%", 20, 250);
            this.#f_outputSizeTable.setHeading("Qty", "Width", "Height");
            this.#f_outputSizeTable.addRow("-", "-", "-");
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

            this.UpdateMachineTimes();
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
            this.#totalRunLength = 0;
            this.#f_inheritedSizeTable.deleteAllRows();

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{QWHD: QWHD, finalRollSize: QWHD}*/) => {

                        if(!dataEntry.QWHD || !dataEntry.finalRollSize) return/**Only this iteration*/;

                        //If using roll length
                        if(dataEntry.finalRollSize && this.#useRollLength === true) {
                              this.#f_inheritedSizeTable.addRow(dataEntry.finalRollSize.qty, roundNumber(dataEntry.finalRollSize.width, 2), roundNumber(dataEntry.finalRollSize.height, 2));
                              this.#totalRunLength += dataEntry.finalRollSize.height * dataEntry.finalRollSize.qty * this.qty;
                        }
                        //If using QWHD
                        else {
                              this.#f_inheritedSizeTable.addRow(dataEntry.QWHD.qty, roundNumber(dataEntry.QWHD.width, 2), roundNumber(dataEntry.QWHD.height, 2));
                              this.#totalRunLength += Math.max(dataEntry.QWHD.width, dataEntry.QWHD.height) * dataEntry.QWHD.qty * this.qty;
                        }
                  });
            });
      };

      UpdateMachineTimes() {
            this.#f_machineLengthToRun[1].value = roundNumber(mmToM(this.#totalRunLength), 2);
            this.#f_machineRunTime[1].value = roundNumber(mmToM(this.#totalRunLength) / zeroIfNaNNullBlank(this.#f_machineRunSpeed[1].value), 2);
            this.#f_machineTotalTime[1].value = this.machineSetupTime + this.machineRunTime;
      }

      UpdateProductionTimes() {
            this.#f_production.productionTime = this.machineTotalTime;
      }

      UpdateOutput() {
            this.#dataForSubscribers = [];
            this.#f_outputSizeTable.deleteAllRows();

            let sizeArray = [];

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{QWHD: QWHD}*/) => {

                        if(!dataEntry.QWHD) return/**Only this iteration*/;

                        this.#dataForSubscribers.push({QWHD: new QWHD(dataEntry.QWHD.qty * this.qty, dataEntry.QWHD.width, dataEntry.QWHD.height)});
                        this.#f_outputSizeTable.addRow(dataEntry.QWHD.qty * this.qty, roundNumber(dataEntry.QWHD.width, 2), roundNumber(dataEntry.QWHD.height, 2));

                        sizeArray.push(new QWHD(dataEntry.QWHD.qty * this.qty, roundNumber(dataEntry.QWHD.width, 2), roundNumber(dataEntry.QWHD.height, 2)));
                  });
            });

            $(this.#f_materialTotalArea[1]).val(combinedSqm(sizeArray));
      };

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

      Description() {
            super.Description();

            TODO("laminate gloss levels");
            return "Laminated in " + 'gloss' + " for UV protection and longevity";
      }
}