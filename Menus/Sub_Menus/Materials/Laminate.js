class Laminate extends Material {
      static DISPLAY_NAME = "LAMINATE";

      #materialHeader;
      #production;
      #addLaminateBtn;
      #productionHeader;
      #sheetSplitSizes;
      #materialTotalArea;
      #materialContainer;
      #material;
      #useRollLength = false;
      #useRollLengthField;
      set material(value) {$(this.#material[1]).val(value).change();}

      /**
       * @Inherited
       * @example
       * [{parent: Object, data: [], finalRollSize:[]},
       * {parent: Object, data: [], finalRollSize:[]}]
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
       * @Output
       */
      #outputSizeTable;
      #outputSizes = [];

      /** @Machine */
      #machineSetupTime;
      get machineSetupTime() {return zeroIfNaNNullBlank(this.#machineSetupTime[1].value);}
      #machineRunSpeed;
      #machineLengthToRun;
      #machineRunTime;
      #machineTotalTime;
      get machineRunTime() {return zeroIfNaNNullBlank(this.#machineRunTime[1].value);}
      get machineTotalTime() {return zeroIfNaNNullBlank(this.#machineTotalTime[1].value);}

      get backgroundColor() {return COLOUR.Purple;}
      get textColor() {return COLOUR.White;}

      constructor(parentObject, sizeClass, type) {
            super(parentObject, sizeClass, type);

            /*
            InheritedParentSizeSplits*/
            let f_container_inheritedParentSizeSplits = createDivStyle5(null, "Inherited Parent Size Splits", this.container)[1];

            this.#useRollLengthField = createCheckbox_Infield("Use Approx. Roll Length", this.#useRollLength, "width:300px;", () => {this.#useRollLength = this.#useRollLengthField[1].checked; this.UpdateFromChange();}, f_container_inheritedParentSizeSplits);
            this.#inheritedSizeTable = new Table(f_container_inheritedParentSizeSplits, "!00%", 20, 250);
            this.#inheritedSizeTable.setHeading("Qty", "Width", "Height");
            this.#inheritedSizeTable.addRow("-", "-", "-");
            this.#inheritedSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";


            /*
            Material*/
            let f_container_material = createDivStyle5(null, "Laminate", this.container)[1];

            this.#materialTotalArea = createInput_Infield("Total Area", 0, null, () => { }, f_container_material, false, 1);
            setFieldDisabled(true, this.#materialTotalArea[1], this.#materialTotalArea[0]);

            var laminateParts = getPredefinedParts("Laminate - ");
            let vinylParts = getPredefinedParts(VinylLookup["Whiteback"]);
            var laminateDropdownElements = [];
            laminateParts.forEach(element => laminateDropdownElements.push([element.Name, "white"]));
            vinylParts.forEach(element => laminateDropdownElements.push([element.Name, "white"]));

            this.#material = createDropdown_Infield_Icons_Search("Laminate", 0, "width:60%;", 10, true, laminateDropdownElements, () => {this.UpdateFromChange();}, f_container_material);
            $(this.#material).val(LaminateLookup["Gloss"]).change();

            /*
            OutputSizes*/
            let f_container_outputSizes = createDivStyle5(null, "Output Sizes", this.container)[1];

            this.#outputSizeTable = new Table(f_container_outputSizes, "100%", 20, 250);
            this.#outputSizeTable.setHeading("Qty", "Width", "Height");
            this.#outputSizeTable.addRow("-", "-", "-");
            this.#outputSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Machine*/
            let f_container_machine = createDivStyle5(null, "Machine", this.container)[1];

            createText("Setup", "width:100%;height:20px", f_container_machine);
            this.#machineSetupTime = createInput_Infield("Setup Time Average (min)", 3, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 0.1);

            createText("Run", "width:100%;height:20px", f_container_machine);
            this.#machineLengthToRun = createInput_Infield("Length to Run (m)", -1, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 1);
            setFieldDisabled(true, this.#machineLengthToRun[1], this.#machineLengthToRun[0]);
            this.#machineRunSpeed = createInput_Infield("Run Speed (m/min)", 2, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 0.1);
            this.#machineRunTime = createInput_Infield("Run Time (mins)", -1, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 1);
            setFieldDisabled(true, this.#machineRunTime[1], this.#machineRunTime[0]);
            createText("Total", "width:100%;height:20px", f_container_machine);
            this.#machineTotalTime = createInput_Infield("Total Time (mins)", -1, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 1);
            setFieldDisabled(true, this.#machineTotalTime[1], this.#machineTotalTime[0]);

            /*
            Production*/
            let f_container_production = createDivStyle5(null, "Laminator Production", this.container)[1];

            this.#production = new Production(f_container_production, null, function() { }, this.sizeClass);
            this.#production.showContainerDiv = true;
            this.#production.productionTime = 20;
            this.#production.headerName = "Laminator Production";
            this.#production.required = true;
            this.#production.showRequiredCkb = false;
            this.#production.requiredName = "Required";

            /*
            Update*/
            this.UpdateDataForSubscribers();
      }

      /*
      Inherited*/
      UpdateFromChange() {
            super.UpdateFromChange();

            this.UpdateInheritedSizeTable();

            this.UpdateMachineTimes();
            this.UpdateProductionTimes();
            this.UpdateOutputSizeTable();
            this.UpdateDataForSubscribers();
            this.UpdateSubscribedLabel();
            this.PushToSubscribers();
      }

      UpdateDataForSubscribers() {
            this.dataToPushToSubscribers = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
      }

      UpdateInheritedSizeTable = () => {
            this.#inheritedSizes = [];
            this.#inheritedSizeTable.deleteAllRows();

            //Per Parent Subscription:
            for(let a = 0; a < this.#inheritedData.length; a++) {
                  if(this.#inheritedData[a].finalRollSize && this.#useRollLength) {
                        let recievedInputSizes = this.#inheritedData[a].finalRollSize;
                        let i = 0;
                        this.#inheritedSizes.push(recievedInputSizes[i]);
                        this.#inheritedSizeTable.addRow(recievedInputSizes[i].qty, roundNumber(recievedInputSizes[i].width, 2), roundNumber(recievedInputSizes[i].height, 2));
                  } else {
                        let recievedInputSizes = this.#inheritedData[a].data;

                        for(let i = 0; i < recievedInputSizes.length; i++) {
                              this.#inheritedSizes.push(recievedInputSizes[i]);
                              this.#inheritedSizeTable.addRow(recievedInputSizes[i].qty, roundNumber(recievedInputSizes[i].width, 2), roundNumber(recievedInputSizes[i].height, 2));
                        }
                  }
            }
      };

      UpdateMachineTimes() {
            let totalLength_mm = 0;
            let runSpeed_mMin = zeroIfNaNNullBlank(this.#machineRunSpeed[1].value);
            let setupTime = zeroIfNaNNullBlank(this.#machineSetupTime[1].value);
            for(let i = 0; i < this.#inheritedSizes.length; i++) {
                  totalLength_mm += Math.max(this.#inheritedSizes[i].height, this.#inheritedSizes[i].width) * this.#inheritedSizes[i].qty;
            }
            this.#machineLengthToRun[1].value = roundNumber(mmToM(totalLength_mm), 2);
            this.#machineRunTime[1].value = roundNumber(mmToM(totalLength_mm) / runSpeed_mMin, 2);
            this.#machineTotalTime[1].value = this.machineSetupTime + this.machineRunTime;
      }

      UpdateProductionTimes() {
            this.#production.productionTime = this.machineTotalTime;
      }

      UpdateOutputSizeTable() {
            this.#outputSizes = [];
            this.#outputSizeTable.deleteAllRows();

            for(let i = 0; i < this.#inheritedSizes.length; i++) {
                  let qtyVal = this.#inheritedSizes[i].qty;
                  let widthVal = this.#inheritedSizes[i].width;
                  let heightVal = this.#inheritedSizes[i].height;
                  this.#outputSizes.push({qty: qtyVal, width: widthVal, height: heightVal});
                  this.#outputSizeTable.addRow(qtyVal, roundNumber(widthVal, 2), roundNumber(heightVal, 2));
            }
            $(this.#materialTotalArea[1]).val(combinedSqm(this.#outputSizes)).change();

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

      /*
      Override*/
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
            var name = this.#material[1].value;
            var partFullName = getPredefinedParts_Name_FromLimitedName(name);

            for(let i = 0; i < this.#outputSizes.length; i++) {
                  let partQty = this.#outputSizes[i].qty;
                  let partWidth = this.#outputSizes[i].width;
                  let partHeight = this.#outputSizes[i].height;
                  partIndex = await q_AddPart_DimensionWH(productNo, partIndex, true, partFullName, partQty, partWidth, partHeight, partFullName, "", false);
            }
            partIndex = await this.#production.Create(productNo, partIndex);

            return partIndex;
      }

      Description() {
            super.Description();

            return "Laminated in " + '___' + " for UV protection and longevity";
      }
}