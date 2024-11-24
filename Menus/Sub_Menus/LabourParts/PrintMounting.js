class PrintMounting extends Material {
      /*override*/get Type() {return "PRINT MOUNTING";}

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

            /*
            InheritedParentSizeSplits*/
            let f_container_inheritedParentSizeSplits = createDivStyle5(null, "Inherited Parent Size Splits", this.container)[1];

            this.#inheritedSizeTable = new Table(f_container_inheritedParentSizeSplits, "100%", 20, 250);
            this.#inheritedSizeTable.setHeading("Qty", "Width", "Height", "Longest Side", "Rollover Can Lay");
            this.#inheritedSizeTable.addRow("-", "-", "-", "-", "-");
            this.#inheritedSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            TimeStats*/
            let f_container_stats = createDivStyle5(null, "Stats", this.container)[1];

            this.#numberOfPanelsField = createInput_Infield("Number Of Panels", 0, "width:30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1);
            this.#setupTimePerPanelField = createInput_Infield("Setup Time Per Panel", 5, "width:30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1, {postfix: "mins"});
            this.#totalSetupText = createInput_Infield("Total Setup", 0, "width:30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1, {postfix: "mins"});

            createHr(null, f_container_stats);

            this.#numberOfJoinsToMatchField = createInput_Infield("Number Of Joins To Match", 0, "width:30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1);
            this.#setupTimePerJoinField = createInput_Infield("Setup Time Per Join", 10, "width:30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1, {postfix: "mins"});
            this.#totalJoinSetupText = createInput_Infield("Total Join Setup", 0, "width:30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1, {postfix: "mins"});

            createHr(null, f_container_stats);
            this.#textRolloverSheets = createText("Rollover Sheets: x0", "width:30%;height:41px;margin:5px;padding:10px;", f_container_stats);
            this.#layTimePerPanel_Rollover = createInput_Infield("Rollover Layup Time Per Panel", 5, "width:30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1, {postfix: "mins"});
            this.#totalLayTimePerPanel_Rollover = createInput_Infield("Total Rollover Layup Time", 5, "width:30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1, {postfix: "mins"});
            setFieldDisabled(true, this.#totalLayTimePerPanel_Rollover[1], this.#totalLayTimePerPanel_Rollover[0]);
            this.#textHandSheets = createText("Hand Sheets: x0", "width:30%;height:41px;margin:5px;padding:10px;", f_container_stats);
            this.#layTimePerPanel_Hand = createInput_Infield("Hand Layup Time Per Panel", 20, "width:30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1, {postfix: "mins"});
            this.#totalLayTimePerPanel_Hand = createInput_Infield("Total Hand Layup Time", 20, "width:30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1, {postfix: "mins"});
            setFieldDisabled(true, this.#totalLayTimePerPanel_Hand[1], this.#totalLayTimePerPanel_Hand[0]);

            createHr(null, f_container_stats);

            this.#totalLinearMetresField = createInput_Infield("Total Perimeter", 0, "width:30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1, {postfix: "m"});
            setFieldDisabled(true, this.#totalLinearMetresField[1], this.#totalLinearMetresField[0]);

            this.#edgeWrapSecondsPerMetreField = createInput_Infield("Edge Wrapping", 30, "width:30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1, {postfix: "sec/m"});
            this.#totalWrappingText = createInput_Infield("Total Wrapping", 0, "width:30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1, {postfix: "mins"});

            createHr(null, f_container_stats);

            this.#handlingTimePerPanelField = createInput_Infield("Handling Time Per Panel", 60, "margin-left:calc(30% + 16px);width: 30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1, {postfix: "sec"});
            this.#totalHandlingText = createInput_Infield("Total Handling", 0, "width:30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1, {postfix: "mins"});

            createHr(null, f_container_stats);
            this.#totalTimeField = createInput_Infield("Total Time", 0, "margin-left:calc(30% + 16px);width:30%;", () => {this.UpdateFromChange();}, f_container_stats, true, 1, {postfix: "mins"});

            /*
            Production*/
            let f_container_production = createDivStyle5(null, "Production", this.container)[1];

            this.#production = new Production(f_container_production, null, function() { }, this.sizeClass);
            this.#production.showContainerDiv = true;
            this.#production.productionTime = 20;
            this.#production.headerName = "Print Mounting";
            this.#production.required = true;
            this.#production.showRequiredCkb = false;
            this.#production.requiredName = "Production Time";

            /*
            Subscribers*/
            this.UpdateDataForSubscribers();
      }

      /*
      Inherited */
      UpdateFromChange() {
            super.UpdateFromChange();

            this.UpdateInheritedSizes();
            this.UpdateSetupTimes();
            this.UpdateJoinMatchTimes();
            this.UpdateLayupTimes();
            this.UpdateWrappingTimes();
            this.UpdateHandlingTimes();
            this.UpdateTotalTimes();
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
            this.#totalSetupText[1].value = roundNumber(this.totalSetupTime, 2);
      }

      UpdateJoinMatchTimes() {
            this.#numberOfJoinsToMatchField[1].value = this.#numberOfPanels - 1;
            this.#numberOfJoinsToMatchField[2].value = this.#numberOfPanels - 1;

            this.setupTimePerJoin = zeroIfNaNNullBlank(this.#setupTimePerJoinField[1].value);
            this.totalJoinSetup = this.setupTimePerJoin * (this.#numberOfPanels - 1);
            this.#totalJoinSetupText[1].value = roundNumber(this.totalJoinSetup, 2);
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
            this.#totalWrappingText[1].value = roundNumber(this.totalWrappingTime, 2);
      };

      UpdateHandlingTimes() {
            let shapeHandlingTimeMinutes = secondsToMinutes(zeroIfNaNNullBlank(this.#handlingTimePerPanelField[1].value));
            this.totalPanelHandlingTime = shapeHandlingTimeMinutes * this.#numberOfPanels;
            this.#totalHandlingText[1].value = roundNumber(this.totalPanelHandlingTime, 2);
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

      /*
      Override */
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
      Override */
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
            partIndex = await this.#production.Create(productNo, partIndex);
            return partIndex;
      }
}