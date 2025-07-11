class HandTrimming extends Material {
      static DISPLAY_NAME = "HAND TRIMMING";
      /*override*/get Type() {return "HAND TRIMMING";}

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

            this.#totalLinearMetresField = createInput_Infield("Total Linear Metres", 45, null, () => {this.UpdateTrimmingTimes();}, f_container_stats, true, 1, {postfix: "m"});
            setFieldDisabled(true, this.#totalLinearMetresField[1], this.#totalLinearMetresField[0]);
            this.#trimmingSecondsPerMetreField = createInput_Infield("Trimming Speed", 30, null, () => {this.UpdateTrimmingTimes();}, f_container_stats, true, 1, {postfix: "sec/m"});
            this.#totalTrimmingText = createInput_Infield("Total Trimming", 0, null, () => {this.UpdateTrimmingTimes();}, f_container_stats, true, 1, {postfix: "sec"});

            createHr(null, f_container_stats);

            this.#numberOfShapesField = createInput_Infield("Number Of Shapes", 0, null, () => {this.UpdateTrimmingTimes();}, f_container_stats, true, 1);
            this.#handlingTimePerShapeField = createInput_Infield("Handling Time Per Shape", 60, null, () => {this.UpdateTrimmingTimes();}, f_container_stats, true, 1, {postfix: "sec"});
            this.#totalHandlingText = createInput_Infield("Total Handling", 0, null, () => {this.UpdateTrimmingTimes();}, f_container_stats, true, 1, {postfix: "mins"});
            createHr(null, f_container_stats);
            this.#totalTimeField = createInput_Infield("Total Time", 0, "margin: 5px calc(50% - 125px);", () => {this.UpdateTrimmingTimes();}, f_container_stats, true, 1, {postfix: "mins"});

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
      UpdateFromFields() {
            super.UpdateFromFields();

            this.UpdateInheritedSizes();
            this.UpdateTrimmingTimes();
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

      UpdateInheritedSizes = () => {
            this.#inheritedSizes = [];
            this.#inheritedSizeTable.deleteAllRows();

            this.SUBSCRIPTION_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{QWHD: QWHD, finalRollSize: [...]}*/) => {

                        if(dataEntry.QWHD) {
                              this.#inheritedSizeTable.addRow(dataEntry.QWHD.qty, dataEntry.QWHD.width, dataEntry.QWHD.height);
                        }
                  });
            });
      };

      UpdateTrimmingTimes = () => {
            let totalLinearMetres = 0;
            let numberOfShapes = 0;

            this.SUBSCRIPTION_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{QWHD: QWHD, finalRollSize: [...]}*/) => {

                        if(dataEntry.QWHD) {
                              totalLinearMetres += mmToM(dataEntry.QWHD.qty * 2 * (dataEntry.QWHD.width + dataEntry.QWHD.height)) * this.qty;
                              numberOfShapes += dataEntry.QWHD.qty * this.qty;
                        }
                  });
            });

            this.#totalLinearMetresField[1].value = roundNumber(totalLinearMetres, 2);

            let calculatedTrimmingTime = totalLinearMetres * secondsToMinutes(zeroIfNaNNullBlank(this.#trimmingSecondsPerMetreField[1].value));
            this.#totalTrimmingText[1].value = roundNumber(calculatedTrimmingTime, 2);

            this.#numberOfShapesField[1].value = numberOfShapes;
            this.#numberOfShapesField[2].value = numberOfShapes;

            let shapeHandlingTimeMinutes = secondsToMinutes(zeroIfNaNNullBlank(this.#handlingTimePerShapeField[1].value));
            let totalShapeHandlingTime = shapeHandlingTimeMinutes * numberOfShapes;
            this.#totalHandlingText[1].value = roundNumber(totalShapeHandlingTime, 2);

            let totalTime = roundNumber(calculatedTrimmingTime + totalShapeHandlingTime, 2);
            this.#totalTimeField[1].value = totalTime;
            this.#totalTimeField[2].value = totalTime;
            this.#production.productionTime = totalTime;
      };

      async Create(productNo, partIndex) {
            partIndex = await super.Create(productNo, partIndex);
            partIndex = await this.#production.Create(productNo, partIndex);
            return partIndex;
      }
}