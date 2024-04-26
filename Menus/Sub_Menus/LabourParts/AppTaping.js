class AppTaping extends Material {
      static DISPLAY_NAME = "APP TAPE";

      #materialHeader;
      #production;
      #addAppTapeBtn;
      #productionHeader;
      #sheetSplitSizes;
      #materialTotalArea;
      #materialContainer;
      #material;

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

      /** @Machine */
      #machineType;
      get machineType() {return this.#machineType[1].value;}
      #machineSetupTime;
      get machineSetupTime() {return zeroIfNaNNullBlank(this.#machineSetupTime[1].value);}
      set machineSetupTime(time) {this.#machineSetupTime[1].value = time;};
      #machineRunSpeed;
      set machineRunSpeed(time) {this.#machineRunSpeed[1].value = time;};
      #machineLengthToRun;
      #machineRunTime;
      get machineRunTime() {return zeroIfNaNNullBlank(this.#machineRunTime[1].value);}
      set machineRunTime(time) {this.#machineRunTime[1].value = time;};

      defaultMachineTime = {
            rollover: {
                  setup: 2,
                  run: 6
            }, hand: {
                  setup: 1,
                  run: 2
            }
      };

      /**
       * @Output
       */
      #outputSizeTable;
      #outputSizes = [];

      get backgroundColor() {return COLOUR.DarkBlue;}
      get textColor() {return COLOUR.White;}

      constructor(parentObject, sizeClass, type) {
            super(parentObject, sizeClass, type);

            /**
             * @InheritedParentSizeSplits
             */
            createHeadingStyle1("Inherited Parent Size Splits", null, this.container);
            this.#inheritedSizeTable = new Table(this.container, 780, 20, 250);
            this.#inheritedSizeTable.setHeading("Qty", "Width", "Height");
            this.#inheritedSizeTable.addRow("-", "-", "-");
            this.#inheritedSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";


            /**
             * @Material
             */
            this.#materialHeader = createHeadingStyle1("Material", null, this.container);
            this.#materialTotalArea = createInput_Infield("Total Area", 0, null, () => { }, this.container, false, 1);
            setFieldDisabled(true, this.#materialTotalArea[1], this.#materialTotalArea[0]);

            let materialParts = getPredefinedParts("Tape - Application");
            var materialDropdownElements = [];
            materialParts.forEach(element => materialDropdownElements.push([element.Name, "white"]));
            this.#material = createDropdown_Infield_Icons_Search("App Tape", 0, "width:60%;", 10, true, materialDropdownElements, () => {this.UpdateFromChange();}, this.container);
            $(this.#material).val(AppTapeLookup["Medium Tack"]).change();

            /** @Machine */
            createHeadingStyle1("Machine", null, this.container);
            this.#machineType = createDropdown_Infield_Icons_Search("Machine Type", 0, "width:95%;box-sizing:border-box", 40, true, [["Rollover", "blue"], ["Hand App", "red"]], () => {this.UpdateMachineDefaults();}, this.container, false);

            createText("Setup", "width:100%;height:20px", this.container);
            this.#machineSetupTime = createInput_Infield("Setup Time (min)", this.defaultMachineTime.rollover.setup, null, () => {this.UpdateMachineTimes();}, this.container, false, 0.1);

            createText("Run", "width:100%;height:20px", this.container);
            this.#machineRunSpeed = createInput_Infield("Run Speed (m/min)", this.defaultMachineTime.rollover.run, null, () => {this.UpdateMachineTimes();}, this.container, false, 0.1);
            this.#machineLengthToRun = createInput_Infield("Length to Run (m)", -1, null, () => {this.UpdateMachineTimes();}, this.container, false, 1);
            setFieldDisabled(true, this.#machineLengthToRun[1], this.#machineLengthToRun[0]);
            this.#machineRunTime = createInput_Infield("Run Time (mins)", -1, null, () => {this.UpdateMachineTimes();}, this.container, false, 1);
            setFieldDisabled(true, this.#machineRunTime[1], this.#machineRunTime[0]);

            /** @OutputSizes */
            createHeadingStyle1("Output Sizes", null, this.container);
            this.#outputSizeTable = new Table(this.container, 780, 20, 250);
            this.#outputSizeTable.setHeading("Qty", "Width", "Height");
            this.#outputSizeTable.addRow("-", "-", "-");
            this.#outputSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";


            /** @Production */
            createHeadingStyle1("App Taping Production", null, this.container);
            this.#production = new Production(this.container, null, function() { }, this.sizeClass);
            this.#production.showContainerDiv = true;
            this.#production.productionTime = 20;
            this.#production.headerName = "App Taping Production";
            this.#production.required = true;
            this.#production.showRequiredCkb = false;
            this.#production.requiredName = "Required";

            this.dataToPushToSubscribers = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
      }

      /**@Override */
      UpdateFromChange() {
            super.UpdateFromChange();

            this.UpdateInheritedSizeTable();
            this.UpdateMachineTimes();
            this.UpdateProductionTimes();
            this.UpdateOutputSizeTable();
            this.dataToPushToSubscribers = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
            this.UpdateSubscribedLabel();
            this.PushToSubscribers();
      }

      UpdateInheritedSizeTable = () => {
            this.#inheritedSizes = [];
            this.#inheritedSizeTable.deleteAllRows();

            //Per Parent Subscription:
            for(let a = 0; a < this.#inheritedData.length; a++) {
                  if(this.#inheritedData[a].finalRollSize) {
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

      UpdateMachineDefaults() {
            switch(this.machineType) {
                  case "Rollover":
                        this.machineSetupTime = this.defaultMachineTime.rollover.setup;
                        this.machineRunSpeed = this.defaultMachineTime.rollover.run;
                        break;
                  case "Hand App":
                        this.machineSetupTime = this.defaultMachineTime.hand.setup;
                        this.machineRunSpeed = this.defaultMachineTime.hand.run;
                        break;
                  default:
                        alert("Unknown machine type: " + this.machineType);
                        break;
            }
      }

      UpdateMachineTimes() {
            let totalLength_mm = 0;
            let runSpeed_mMin = zeroIfNaNNullBlank(this.#machineRunSpeed[1].value);
            let setupTime = zeroIfNaNNullBlank(this.#machineSetupTime[1].value);
            for(let i = 0; i < this.#inheritedSizes.length; i++) {
                  totalLength_mm += this.#inheritedSizes[i].height;
            }
            this.#machineLengthToRun[1].value = roundNumber(mmToM(totalLength_mm), 2);
            this.#machineRunTime[1].value = roundNumber(mmToM(totalLength_mm) / runSpeed_mMin, 2);
      }

      UpdateProductionTimes() {
            this.#production.productionTime = this.machineSetupTime + this.machineRunTime;
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

      /** @Override */
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
}