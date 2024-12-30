class Laminate extends Material {
      /*override*/get Type() {return "LAMINATE";}

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
      //#inheritedData2 = [];
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
      //#dataForSubscribers = [];

      /**
       * @Output
       */
      #outputSizeTable;
      #dataForSubscribers = [];

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
            this.#inheritedSizeTable = new Table(f_container_inheritedParentSizeSplits, "100%", 20, 250);
            this.#inheritedSizeTable.setHeading("Qty", "Width", "Height/Length");
            this.#inheritedSizeTable.addRow("-", "-", "-");
            this.#inheritedSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Material*/
            let f_container_material = createDivStyle5(null, "Laminate", this.container)[1];

            this.#materialTotalArea = createInput_Infield("Total Area", 0, null, () => { }, f_container_material, false, 1, {postfix: "m2"});
            setFieldDisabled(true, this.#materialTotalArea[1], this.#materialTotalArea[0]);

            var laminateParts = getPredefinedParts("Laminate - ");
            let vinylParts = getPredefinedParts(VinylLookup["Whiteback"]);
            var laminateDropdownElements = [];
            laminateParts.forEach(element => laminateDropdownElements.push([element.Name, "white"]));
            vinylParts.forEach(element => laminateDropdownElements.push([element.Name, "white"]));

            this.#material = createDropdown_Infield_Icons_Search("Laminate", 0, "width:60%;", 10, true, laminateDropdownElements, () => {this.UpdateFromChange();}, f_container_material);
            $(this.#material).val(LaminateLookup["Gloss"]).change();

            /*
            Machine*/
            let f_container_machine = createDivStyle5(null, "Machine", this.container)[1];

            createText("Setup", "width:100%;height:20px", f_container_machine);
            this.#machineSetupTime = createInput_Infield("Setup Time Average", 3, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 0.1, {postfix: "min"});

            createText("Run", "width:100%;height:20px", f_container_machine);
            this.#machineLengthToRun = createInput_Infield("Length to Run", -1, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 1, {postfix: "m"});
            setFieldDisabled(true, this.#machineLengthToRun[1], this.#machineLengthToRun[0]);
            this.#machineRunSpeed = createInput_Infield("Run Speed", 2, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 0.1, {postfix: "m/min"});
            this.#machineRunTime = createInput_Infield("Run Time", -1, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 1, {postfix: "mins"});
            setFieldDisabled(true, this.#machineRunTime[1], this.#machineRunTime[0]);
            createText("Total", "width:100%;height:20px", f_container_machine);
            this.#machineTotalTime = createInput_Infield("Total Time", -1, "width:30%;", () => {this.UpdateFromChange();}, f_container_machine, false, 1, {postfix: "mins"});
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
            OutputSizes*/
            let f_container_outputSizes = createDivStyle5(null, "Output Sizes", this.container)[1];

            this.#outputSizeTable = new Table(f_container_outputSizes, "100%", 20, 250);
            this.#outputSizeTable.setHeading("Qty", "Width", "Height");
            this.#outputSizeTable.addRow("-", "-", "-");
            this.#outputSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

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
            this.DATA_FOR_SUBSCRIBERS = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
      }

      UpdateInheritedSizeTable = () => {
            this.#inheritedSizes = [];
            this.#inheritedSizeTable.deleteAllRows();

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{QWHD: QWHD, finalRollSize: QWHD}*/) => {

                        //If using roll length
                        if(dataEntry.finalRollSize && this.#useRollLength) {
                              let recievedInputSizes = dataEntry.finalRollSize;

                              this.#inheritedSizes.push(recievedInputSizes);
                              this.#inheritedSizeTable.addRow(recievedInputSizes.qty, roundNumber(recievedInputSizes.width, 2), roundNumber(recievedInputSizes.height, 2));
                        }
                        //If using individual sizes
                        else {
                              let recievedInputSizes = dataEntry.QWHD;

                              this.#inheritedSizes.push(recievedInputSizes);
                              this.#inheritedSizeTable.addRow(recievedInputSizes.qty, roundNumber(recievedInputSizes.width, 2), roundNumber(recievedInputSizes.height, 2));
                        }
                  });
            });
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
            this.#dataForSubscribers = [];
            this.#outputSizeTable.deleteAllRows();

            let sizeArray = [];

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{QWHD: QWHD}*/) => {

                        this.#dataForSubscribers.push({QWHD: new QWHD(dataEntry.QWHD.qty, dataEntry.QWHD.width, dataEntry.QWHD.height)});
                        this.#outputSizeTable.addRow(dataEntry.QWHD.qty, roundNumber(dataEntry.QWHD.width, 2), roundNumber(dataEntry.QWHD.height, 2));

                        sizeArray.push(new QWHD(dataEntry.QWHD.qty, roundNumber(dataEntry.QWHD.width, 2), roundNumber(dataEntry.QWHD.height, 2)));
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

      Description() {
            super.Description();

            TODO("laminate gloss levels");
            return "Laminated in " + 'gloss' + " for UV protection and longevity";
      }
}