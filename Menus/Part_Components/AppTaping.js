class AppTaping extends Material {
      static DISPLAY_NAME = "APP TAPE";
      /*override*/get Type() {return "APP TAPE";}

      #materialHeader;
      #production;
      #addAppTapeBtn;
      #productionHeader;
      #sheetSplitSizes;
      #inheritedSizeTable;
      #materialTotalArea;
      #materialContainer;
      #material;

      /**
       * @Inherited
       * @example
       * [{parent: 'SHEET-1699952073332-95570559', data: []},
       *  {parent: 'SHEET-1699952073332-95574529', data: []}]
       */
      //#inheritedData2 = [];



      /**
      * @Subscribers
      * @Updated on table changes
      * @example 
      *          [{qty: 4, width: '2440', height: '1220'},
      *           {qty: 4, width: '2440', height: '580' },
      *           {qty: 1, width: '240',  height: '1220'},
      *           {qty: 1, width: '240',  height: '580' }]
      */
      //#dataForSubscribers = [];

      /*
      Machine*/
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

      /*
      Output*/
      #outputSizeTable;
      #dataForSubscribers = [];

      get backgroundColor() {return COLOUR.DarkBlue;}
      get textColor() {return COLOUR.White;}

      constructor(parentObject, sizeClass, type) {
            super(parentObject, sizeClass, type);

            /*
            InheritedParentSizeSplits*/
            let f_container_inheritedParentSizeSplits = createDivStyle5(null, "Inherited Parent Size Splits", this.container)[1];

            this.#inheritedSizeTable = new Table(f_container_inheritedParentSizeSplits, "100%", 20, 250);
            this.#inheritedSizeTable.setHeading("Qty", "Width", "Height");
            this.#inheritedSizeTable.addRow("-", "-", "-");
            this.#inheritedSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Material*/
            let f_container_material = createDivStyle5(null, "Material", this.container)[1];

            this.#materialTotalArea = createInput_Infield("Total Area", 0, null, () => { }, f_container_material, false, 1);
            setFieldDisabled(true, this.#materialTotalArea[1], this.#materialTotalArea[0]);

            let materialParts = getPredefinedParts("Tape - Application");
            var materialDropdownElements = [];
            materialParts.forEach(element => materialDropdownElements.push([element.Name, "white"]));
            this.#material = createDropdown_Infield_Icons_Search("App Tape", 0, "width:60%;", 10, true, materialDropdownElements, () => {this.UpdateFromChange();}, f_container_material);
            $(this.#material).val(AppTapeLookup["Medium Tack"]).change();

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

            this.#machineType = createDropdown_Infield_Icons_Search("Machine Type", 0, "width:95%;box-sizing:border-box", 40, true, [["Rollover", "blue"], ["Hand App", "red"]], () => {this.UpdateMachineDefaults();}, f_container_machine, false);

            createText("Setup", "width:100%;height:20px", f_container_machine);
            this.#machineSetupTime = createInput_Infield("Setup Time (min)", this.defaultMachineTime.rollover.setup, null, () => {this.UpdateMachineTimes();}, f_container_machine, false, 0.1);

            createText("Run", "width:100%;height:20px", f_container_machine);
            this.#machineRunSpeed = createInput_Infield("Run Speed (m/min)", this.defaultMachineTime.rollover.run, null, () => {this.UpdateMachineTimes();}, f_container_machine, false, 0.1);
            this.#machineLengthToRun = createInput_Infield("Length to Run (m)", -1, null, () => {this.UpdateMachineTimes();}, f_container_machine, false, 1);
            setFieldDisabled(true, this.#machineLengthToRun[1], this.#machineLengthToRun[0]);
            this.#machineRunTime = createInput_Infield("Run Time (mins)", -1, null, () => {this.UpdateMachineTimes();}, f_container_machine, false, 1);
            setFieldDisabled(true, this.#machineRunTime[1], this.#machineRunTime[0]);


            /*
            Production*/
            let f_container_production = createDivStyle5(null, "Production", this.container)[1];

            this.#production = new Production(f_container_production, null, function() { }, this.sizeClass);
            this.#production.showContainerDiv = true;
            this.#production.productionTime = 20;
            this.#production.headerName = "App Taping Production";
            this.#production.required = true;
            this.#production.showRequiredCkb = false;
            this.#production.requiredName = "Required";

            this.UpdateDataForSubscribers();
      }

      /*
      Override*/
      UpdateFromChange() {
            super.UpdateFromChange();

            this.UpdateFromInheritedData();
            this.UpdateMachineTimes();
            this.UpdateProductionTimes();
            this.UpdateOutput();
            this.UpdateDataForSubscribers();
            this.UpdateSubscribedLabel();
            this.PushToSubscribers();
      }

      UpdateDataForSubscribers() {
            this.DATA_FOR_SUBSCRIBERS = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
      }

      UpdateFromInheritedData = () => {
            this.#inheritedSizeTable.deleteAllRows();

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{QWHD: QWHD, finalRollSize: [...]}*/) => {

                        if(!dataEntry.QWHD || !dataEntry.finalRollSize) return/**Only this iteration*/;

                        if(dataEntry.finalRollSize) {
                              let recievedInputSizes = dataEntry.finalRollSize;

                              this.#inheritedSizeTable.addRow(recievedInputSizes[0].qty, roundNumber(recievedInputSizes[0].width, 2), roundNumber(recievedInputSizes[0].height, 2));
                        } else {
                              this.#inheritedSizeTable.addRow(dataEntry.QWHD.qty, roundNumber(dataEntry.QWHD.width, 2), roundNumber(dataEntry.QWHD.height, 2));
                        }
                  });
            });
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

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{QWHD: QWHD, finalRollSize: [...]}*/) => {

                        totalLength_mm += dataEntry.QWHD.height;
                  });
            });

            this.#machineLengthToRun[1].value = roundNumber(mmToM(totalLength_mm), 2);
            this.#machineRunTime[1].value = roundNumber(mmToM(totalLength_mm) / runSpeed_mMin, 2);
      }

      UpdateProductionTimes() {
            this.#production.productionTime = this.machineSetupTime + this.machineRunTime;
      }

      UpdateOutput() {
            this.#dataForSubscribers = [];
            this.#outputSizeTable.deleteAllRows();

            let sizeArray = [];

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{QWHD: QWHD}*/) => {

                        this.#dataForSubscribers.push({QWHD: new QWHD(dataEntry.QWHD.qty * this.qty, dataEntry.QWHD.width, dataEntry.QWHD.height)});
                        this.#outputSizeTable.addRow(dataEntry.QWHD.qty * this.qty, roundNumber(dataEntry.QWHD.width, 2), roundNumber(dataEntry.QWHD.height, 2));

                        sizeArray.push(new QWHD(dataEntry.QWHD.qty * this.qty, roundNumber(dataEntry.QWHD.width, 2), roundNumber(dataEntry.QWHD.height, 2)));
                  });
            });

            $(this.#materialTotalArea[1]).val(combinedSqm(sizeArray));
      };

      async Create(productNo, partIndex) {
            partIndex = await super.Create(productNo, partIndex);
            var name = this.#material[1].value;
            var partFullName = getPredefinedParts_Name_FromLimitedName(name);

            for(let i = 0; i < this.#dataForSubscribers.length; i++) {
                  let partQty = this.#dataForSubscribers[i].qty;
                  let partWidth = this.#dataForSubscribers[i].width;
                  let partHeight = this.#dataForSubscribers[i].height;
                  partIndex = await q_AddPart_DimensionWH(productNo, partIndex, true, partFullName, partQty, partWidth, partHeight, partFullName, "", false);
            }
            partIndex = await this.#production.Create(productNo, partIndex);

            return partIndex;
      }
}