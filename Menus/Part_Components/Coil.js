class Coil extends Material {
      /*
                        
      Variables         */
      #useRollLength = false;
      /**
       * @Inherited
       * @example
       * [{parent: SVGCutfile, data: {…}},
       * {parent: SVGCutfile, data: {…}}]*/
      //#inheritedData2 = [];
      /**
      /**
       * @Inherited*/
      #dataForSubscribers = [{qty: 0, totalLength: 0}];
      /*
                        
      Fields            */
      #f_production;
      #f_material;
      #f_materialTotalLength;
      #f_inheritedSizeTable;
      #f_outputSizeTable;
      #f_machineSetupTime;
      #f_machineRunSpeed;
      #f_machineLengthToRun;
      #f_machineRunTime;
      #f_machineTotalTime;
      /*
                        
      Getter            */
      /*override*/get Type() {return "COIL";}
      get machineRunTime() {return zeroIfNaNNullBlank(this.#f_machineRunTime[1].value);}
      get machineTotalTime() {return zeroIfNaNNullBlank(this.#f_machineTotalTime[1].value);}
      get machineSetupTime() {return zeroIfNaNNullBlank(this.#f_machineSetupTime[1].value);}
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

            this.#f_inheritedSizeTable = new Table(f_container_inheritedParentSizeSplits, "100%", 20, 250);
            this.#f_inheritedSizeTable.setHeading("Qty", "Length (mm)");
            this.#f_inheritedSizeTable.addRow("-", "-");
            this.#f_inheritedSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Material*/
            let f_container_material = createDivStyle5(null, "Coil", this.container)[1];

            this.#f_materialTotalLength = createInput_Infield("Total Length", 0, null, () => { }, f_container_material, false, 1, {postfix: "mm"});
            setFieldDisabled(true, this.#f_materialTotalLength[1], this.#f_materialTotalLength[0]);

            var coilParts = getPredefinedParts("Coil - ");
            var coilDropdownElements = [];
            coilParts.forEach(element => coilDropdownElements.push([element.Name, "white"]));

            this.#f_material = createDropdown_Infield_Icons_Search("Coil", 0, "width:60%;", 10, true, coilDropdownElements, () => {this.UpdateFromChange();}, f_container_material);

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
            let f_container_production = createDivStyle5(null, "Channel Bending Production", this.container)[1];

            this.#f_production = new Production(f_container_production, null, function() { }, this.sizeClass);
            this.#f_production.showContainerDiv = true;
            this.#f_production.productionTime = 20;
            this.#f_production.headerName = "Bending Production";
            this.#f_production.required = true;
            this.#f_production.showRequiredCkb = false;
            this.#f_production.requiredName = "Required";

            /*
            OutputSizes*/
            let f_container_outputSizes = createDivStyle5(null, "Output Sizes", this.container)[1];

            this.#f_outputSizeTable = new Table(f_container_outputSizes, "100%", 20, 250);
            this.#f_outputSizeTable.setHeading("Qty", "Length");
            this.#f_outputSizeTable.addRow("-", "-");
            this.#f_outputSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

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
            this.#f_inheritedSizeTable.deleteAllRows();

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{pathLength: 0, shapeAreas: 0, boundingRectAreas: 0, QWHD: QWHD}*/) => {

                        this.#f_inheritedSizeTable.addRow(dataEntry.QWHD.qty, roundNumber(dataEntry.pathLength, 2));
                  });
            });
      };

      UpdateMachineTimes() {
            let totalLength_mm = 0;

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{pathLength: 0, shapeAreas: 0, boundingRectAreas: 0, QWHD: QWHD}*/) => {

                        totalLength_mm += dataEntry.QWHD.qty * dataEntry.pathLength;
                  });
            });

            let runSpeed_mMin = zeroIfNaNNullBlank(this.#f_machineRunSpeed[1].value);
            this.#f_machineLengthToRun[1].value = roundNumber(mmToM(totalLength_mm), 2);
            this.#f_machineRunTime[1].value = roundNumber(mmToM(totalLength_mm) / runSpeed_mMin, 2);
            this.#f_machineTotalTime[1].value = this.machineSetupTime + this.machineRunTime;
      }

      UpdateProductionTimes() {
            this.#f_production.productionTime = this.machineTotalTime;
      }

      UpdateOutputSizeTable() {
            console.log(this);
            this.#dataForSubscribers = [];
            this.#f_outputSizeTable.deleteAllRows();

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{pathLength: 0, shapeAreas: 0, boundingRectAreas: 0, QWHD: QWHD}*/) => {

                        let qtyVal = zeroIfNaNNullBlank(dataEntry.QWHD.qty);
                        let lengthVal = zeroIfNaNNullBlank(dataEntry.pathLength);

                        this.#dataForSubscribers.push({qty: qtyVal, totalLength: lengthVal});
                        this.#f_outputSizeTable.addRow(qtyVal, roundNumber(lengthVal, 2));
                  });
            });

            $(this.#f_materialTotalLength[1]).val(combinedLnm(this.#dataForSubscribers, false)).change();
      };

      async Create(productNo, partIndex) {
            partIndex = await super.Create(productNo, partIndex);
            var name = this.#f_material[1].value;
            //var partFullName = getPredefinedParts_Name_FromLimitedName(name);

            for(let i = 0; i < this.#dataForSubscribers.length; i++) {
                  let partQty = this.#dataForSubscribers[i].qty;
                  let partLength = this.#dataForSubscribers[i].totalLength;
                  partIndex = await q_AddPart_DimensionWH(productNo, partIndex, true, name, partQty, partLength, null, partFullName, "", false);
            }
            partIndex = await this.#f_production.Create(productNo, partIndex);

            return partIndex;
      }

      Description() {
            super.Description();



            return "mmD returns";
      }
}