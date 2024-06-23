class HandTrimming extends Material {
      static DISPLAY_NAME = "HAND TRIMMING";

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
      #trimmingSecondsPerMetreField;
      #totalTrimmingText;
      #numberOfShapesField;
      #handlingTimePerShapeField;
      #totalHandlingText;
      #totalTimeField;


      get backgroundColor() {return COLOUR.LightBlue;}
      get textColor() {return COLOUR.Black;}

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
            TimeStats*/
            let f_container_stats = createDivStyle5(null, "Stats", this.container)[1];

            this.#totalLinearMetresField = createInput_Infield("Total Linear Metres", 30, null, () => {this.UpdateTrimmingTimes();}, f_container_stats, true, 1);
            setFieldDisabled(true, this.#totalLinearMetresField[1], this.#totalLinearMetresField[0]);
            this.#trimmingSecondsPerMetreField = createInput_Infield("Trimming Seconds Per Metre", 30, null, () => {this.UpdateTrimmingTimes();}, f_container_stats, true, 1);
            this.#totalTrimmingText = createText("Total Trimming: ", "width:250px;height:60px;padding:16px;", f_container_stats);

            createHr(null, f_container_stats);

            this.#numberOfShapesField = createInputCalculated_Infield("Number Of Shapes", 0, null, () => {this.UpdateTrimmingTimes();}, true, f_container_stats);
            this.#handlingTimePerShapeField = createInput_Infield("Handling Time Per Shape (sec)", 30, null, () => {this.UpdateTrimmingTimes();}, f_container_stats, true, 1);
            this.#totalHandlingText = createText("Total Handling: ", "width:250px;height:60px;padding:16px;", f_container_stats);
            createHr(null, f_container_stats);
            this.#totalTimeField = createInputCalculated_Infield("Total Time (mins)", 0, "margin: 5px calc(50% - 125px);", () => {this.UpdateTrimmingTimes();}, true, f_container_stats);

            /*
            Production*/
            let f_container_production = createDivStyle5(null, "Production", this.container)[1];

            this.#production = new Production(f_container_production, null, function() { }, this.sizeClass);
            this.#production.showContainerDiv = true;
            this.#production.productionTime = 20;
            this.#production.headerName = "Hand Trimming Production";
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
            this.UpdateTrimmingTimes();
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
            this.#inheritedSizeTable.deleteAllRows();

            //Per Parent Subscription:
            for(let a = 0; a < this.#inheritedData.length; a++) {
                  let recievedInputSizes = this.#inheritedData[a].data;
                  for(let i = 0; i < recievedInputSizes.length; i++) {
                        this.#inheritedSizes.push(recievedInputSizes[i]);
                        this.#inheritedSizeTable.addRow(recievedInputSizes[i].qty, recievedInputSizes[i].width, recievedInputSizes[i].height);
                  }
            }
      };

      UpdateTrimmingTimes = () => {
            let totalLinearMetres = 0;
            let numberOfShapes = 0;
            for(let i = 0; i < this.#inheritedSizes.length; i++) {
                  totalLinearMetres += mmToM(this.#inheritedSizes[i].qty * 2 * (this.#inheritedSizes[i].width + this.#inheritedSizes[i].height));
                  numberOfShapes += this.#inheritedSizes[i].qty;
            }
            this.#totalLinearMetresField[1].value = roundNumber(totalLinearMetres, 2);

            let calculatedTrimmingTime = totalLinearMetres * secondsToMinutes(zeroIfNaNNullBlank(this.#trimmingSecondsPerMetreField[1].value));
            this.#totalTrimmingText.innerText = "Total Trimming: " + roundNumber(calculatedTrimmingTime, 2) + " (mins)";

            this.#numberOfShapesField[1].value = numberOfShapes;
            this.#numberOfShapesField[2].value = numberOfShapes;

            let shapeHandlingTimeMinutes = secondsToMinutes(zeroIfNaNNullBlank(this.#handlingTimePerShapeField[1].value));
            let totalShapeHandlingTime = shapeHandlingTimeMinutes * numberOfShapes;
            this.#totalHandlingText.innerText = "Total Handling: " + roundNumber(totalShapeHandlingTime, 2) + " (mins)";

            let totalTime = roundNumber(calculatedTrimmingTime + totalShapeHandlingTime, 2);
            this.#totalTimeField[1].value = totalTime;
            this.#totalTimeField[2].value = totalTime;
            this.#production.productionTime = totalTime;
      };

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