class PrintMounting extends Material {
      static DISPLAY_NAME = "PRINT MOUNTING";

      static maxMountingWidth = 8000;
      static maxMountingHeight = 1750;

      #materialHeader;
      #production;
      #addVinylBtn;
      #productionHeader;
      #sheetSplitSizes;

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
       * @TimeStats
       */
      #totalLinearMetresField;
      #edgeWrapSecondsPerMetreField;
      #totalWrappingText;
      #numberOfPanelsField;
      #setupTimePerPanelField;
      #handlingTimePerPanelField;
      #totalHandlingText;
      #totalTimeField;
      #totalSetupText;
      #numberOfJoinsToMatchField;
      #setupTimePerJoinField;
      #totalJoinSetupText;
      #layTimePerPanel_Rollover;
      #layTimePerPanel_Hand;
      #totalLayTimePerPanel_Rollover;
      #totalLayTimePerPanel_Hand;
      #textRolloverSheets;
      #textHandSheets;

      #RolloverSheetsQty = 0;
      #HandSheetsQty = 0;
      #numberOfPanels = 0;
      #totalLinearMetres = 0;


      get backgroundColor() {return COLOUR.Red;}
      get textColor() {return COLOUR.White;}

      constructor(parentObject, sizeClass, type) {
            super(parentObject, sizeClass, type);

            /**
             * @InheritedParentSizeSplits
             */
            createHeadingStyle1("Inherited Parent Size Splits", null, this.container);
            this.#inheritedSizeTable = new Table(this.container, 780, 20, 250);
            this.#inheritedSizeTable.setHeading("Qty", "Width", "Height", "Longest Side", "Rollover Can Lay");
            this.#inheritedSizeTable.addRow("-", "-", "-", "-", "-");

            /**
             * @TimeStats
             */
            createHeadingStyle1("Stats", null, this.container);
            this.#numberOfPanelsField = createInputCalculated_Infield("Number Of Panels", 0, null, () => {this.UpdateFromChange();}, true, this.container);
            this.#setupTimePerPanelField = createInput_Infield("Setup Time Per Panel (mins)", 5, "", () => {this.UpdateFromChange();}, this.container, true, 1);
            this.#totalSetupText = createText("Total Setup: ", "width:30%;height:41px;margin:5px;padding:10px;", this.container);

            createHr(null, this.container);

            this.#numberOfJoinsToMatchField = createInputCalculated_Infield("Number Of Joins To Match", 0, "", () => {this.UpdateFromChange();}, true, this.container);
            this.#setupTimePerJoinField = createInput_Infield("Setup Time Per Join (mins)", 10, "", () => {this.UpdateFromChange();}, this.container, true, 1);
            this.#totalJoinSetupText = createText("Total Join Setup: ", "width:30%;height:41px;margin:5px;padding:10px;", this.container);

            createHr(null, this.container);
            this.#textRolloverSheets = createText("Rollover Sheets: x0", "width:30%;height:41px;margin:5px;padding:10px;", this.container);
            this.#layTimePerPanel_Rollover = createInput_Infield("Rollover Layup Time Per Panel (mins)", 5, null, () => {this.UpdateFromChange();}, this.container, true, 1);
            this.#totalLayTimePerPanel_Rollover = createInput_Infield("Total Rollover Layup Time (mins)", 5, null, () => {this.UpdateFromChange();}, this.container, true, 1);
            setFieldDisabled(true, this.#totalLayTimePerPanel_Rollover[1], this.#totalLayTimePerPanel_Rollover[0]);
            this.#textHandSheets = createText("Hand Sheets: x0", "width:30%;height:41px;margin:5px;padding:10px;", this.container);
            this.#layTimePerPanel_Hand = createInput_Infield("Hand Layup Time Per Panel (mins)", 20, null, () => {this.UpdateFromChange();}, this.container, true, 1);
            this.#totalLayTimePerPanel_Hand = createInput_Infield("Total Hand Layup Time (mins)", 20, null, () => {this.UpdateFromChange();}, this.container, true, 1);
            setFieldDisabled(true, this.#totalLayTimePerPanel_Hand[1], this.#totalLayTimePerPanel_Hand[0]);

            createHr(null, this.container);

            this.#totalLinearMetresField = createInput_Infield("Total Perimeter (m)", 0, null, () => {this.UpdateFromChange();}, this.container, true, 1);
            setFieldDisabled(true, this.#totalLinearMetresField[1], this.#totalLinearMetresField[0]);

            this.#edgeWrapSecondsPerMetreField = createInput_Infield("Edge Wrapping Seconds Per Metre", 30, null, () => {this.UpdateFromChange();}, this.container, true, 1);
            this.#totalWrappingText = createText("Total Wrapping: ", "width:30%;height:41px;margin:5px;padding:10px;", this.container);

            createHr(null, this.container);

            this.#handlingTimePerPanelField = createInput_Infield("Handling Time Per Panel (sec)", 60, "margin-left:270px;", () => {this.UpdateFromChange();}, this.container, true, 1);
            this.#totalHandlingText = createText("Total Handling: ", "width:30%;height:41px;margin:5px;padding:10px;", this.container);

            createHr(null, this.container);
            this.#totalTimeField = createInputCalculated_Infield("Total Time (mins)", 0, "margin: 5px calc(50% - 125px);", () => {this.UpdateFromChange();}, true, this.container);

            /**
             * @Production
             */
            this.#productionHeader = createHeadingStyle1("Production", null, this.container);
            this.#production = new Production(this.container, null, function() { }, this.sizeClass);
            this.#production.showContainerDiv = true;
            this.#production.productionTime = 20;
            this.#production.required = true;
            this.#production.showRequiredCkb = false;
            this.#production.requiredName = "Production Time";

            /**
             * @Subscribers
             */
            this.dataToPushToSubscribers = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
      }

      /**@Inherited */
      UpdateFromChange() {
            super.UpdateFromChange();

            this.UpdateInheritedSizes();
            this.UpdateSetupTimes();
            this.UpdateJoinMatchTimes();
            this.UpdateLayupTimes();
            this.UpdateWrappingTimes();
            this.UpdateHandlingTimes();
            this.UpdateTotalTimes();
            this.dataToPushToSubscribers = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
            this.UpdateSubscribedLabel();
            this.PushToSubscribers();
      }

      UpdateInheritedSizes = () => {
            this.#inheritedSizes = [];
            this.#RolloverSheetsQty = 0;
            this.#HandSheetsQty = 0;
            this.#numberOfPanels = 0;
            this.#totalLinearMetres = 0;
            this.#inheritedSizeTable.deleteAllRows();

            //Per Parent Subscription:
            for(let a = 0; a < this.#inheritedData.length; a++) {
                  let recievedInputSizes = this.#inheritedData[a].data;
                  for(let i = 0; i < recievedInputSizes.length; i++) {
                        this.#inheritedSizes.push(recievedInputSizes[i]);
                        this.canRollover(recievedInputSizes[i].width, recievedInputSizes[i].height) ? this.#RolloverSheetsQty += recievedInputSizes[i].qty : this.#HandSheetsQty += recievedInputSizes[i].qty;
                        this.#numberOfPanels += recievedInputSizes[i].qty;
                        this.#totalLinearMetres += mmToM((recievedInputSizes[i].height * recievedInputSizes[i].qty + recievedInputSizes[i].width * recievedInputSizes[i].qty) * 2);
                        this.#inheritedSizeTable.addRow(recievedInputSizes[i].qty,
                              recievedInputSizes[i].width,
                              recievedInputSizes[i].height,
                              Math.max(recievedInputSizes[i].width, recievedInputSizes[i].height),
                              "" + this.canRollover(recievedInputSizes[i].width, recievedInputSizes[i].height));
                  }
            }
      };

      UpdateSetupTimes() {
            this.#numberOfPanelsField[1].value = this.#numberOfPanels;
            this.#numberOfPanelsField[2].value = this.#numberOfPanels;
            let panelSetupTimeMinutes = zeroIfNaNNullBlank(this.#setupTimePerPanelField[1].value);
            this.totalSetupTime = panelSetupTimeMinutes * this.#numberOfPanels;
            this.#totalSetupText.innerText = "Total Setup: " + roundNumber(this.totalSetupTime, 2) + " (mins)";
      }

      UpdateJoinMatchTimes() {
            this.#numberOfJoinsToMatchField[1].value = this.#numberOfPanels - 1;
            this.#numberOfJoinsToMatchField[2].value = this.#numberOfPanels - 1;

            this.setupTimePerJoin = zeroIfNaNNullBlank(this.#setupTimePerJoinField[1].value);
            this.totalJoinSetup = this.setupTimePerJoin * (this.#numberOfPanels - 1);
            this.#totalJoinSetupText.innerText = "Total Join Setup: " + roundNumber(this.totalJoinSetup, 2) + " (mins)";
      }

      UpdateLayupTimes() {
            this.#textRolloverSheets.innerText = "Rollover Sheets: x" + this.#RolloverSheetsQty;
            this.#textHandSheets.innerText = "Hand Sheets: x" + this.#HandSheetsQty;

            this.#totalLayTimePerPanel_Rollover[1].value = this.#RolloverSheetsQty * zeroIfNaNNullBlank(this.#layTimePerPanel_Rollover[1].value);
            this.#totalLayTimePerPanel_Hand[1].value = this.#HandSheetsQty * zeroIfNaNNullBlank(this.#layTimePerPanel_Hand[1].value);

            this.totalLayTime = zeroIfNaNNullBlank(this.#totalLayTimePerPanel_Rollover[1].value) + zeroIfNaNNullBlank(this.#totalLayTimePerPanel_Hand[1].value);
      }

      UpdateWrappingTimes = () => {
            this.#totalLinearMetresField[1].value = roundNumber(this.#totalLinearMetres, 2);

            this.totalWrappingTime = this.#totalLinearMetres * secondsToMinutes(zeroIfNaNNullBlank(this.#edgeWrapSecondsPerMetreField[1].value));
            this.#totalWrappingText.innerText = "Total Wrapping: " + roundNumber(this.totalWrappingTime, 2) + " (mins)";
      };

      UpdateHandlingTimes() {
            let shapeHandlingTimeMinutes = secondsToMinutes(zeroIfNaNNullBlank(this.#handlingTimePerPanelField[1].value));
            this.totalPanelHandlingTime = shapeHandlingTimeMinutes * this.#numberOfPanels;
            this.#totalHandlingText.innerText = "Total Handling: " + roundNumber(this.totalPanelHandlingTime, 2) + " (mins)";
      }

      UpdateTotalTimes() {
            let totalTime = roundNumber(this.totalSetupTime + this.totalJoinSetup + this.totalLayTime + this.totalWrappingTime + this.totalPanelHandlingTime, 2);
            this.#totalTimeField[1].value = totalTime;
            this.#totalTimeField[2].value = totalTime;
            this.#production.productionTime = totalTime;
      }

      canRollover(width, height) {
            if(Math.min(width, height) > PrintMounting.maxMountingHeight || Math.max(width, height) > PrintMounting.maxMountingWidth) {
                  return false;
            }
            return true;
      }

      /**@Override */
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
            return partIndex;
      }
}