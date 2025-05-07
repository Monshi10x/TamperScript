class Transformer extends Material {
      /*
                        
      Variables         */
      static DISPLAY_NAME = "TRANSFORMER";
      /**
      /**
       * @Inherited*/
      #dataForSubscribers = [{qty: 0}];
      #defaultLoadingPercentage = 80;
      #defaultExactDraw = 0;
      #defaultRequiredDraw = 0;
      /*
                        
      Fields            */
      #f_production;
      #f_material;
      #f_inheritedSizeTable;
      #f_outputSizeTable;
      #f_exactDraw;
      #f_requiredDraw;
      /*
                        
      Getter            */
      /*override*/get Type() {return "TRANSFORMER";}
      get backgroundColor() {return COLOUR.Yellow;}
      get textColor() {return COLOUR.Black;}

      get DEBUG_SHOW() {return true;}

      amperage(ledQty, ledWattage, ledVoltage, loadingPercentage = 80) {
            return (ledQty * (ledWattage / (loadingPercentage / 100))) / ledVoltage;
      }


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
            this.#f_inheritedSizeTable.setHeading("Qty", "Wattage (W)", "Voltage (V)");
            this.#f_inheritedSizeTable.addRow("-", "-", "-");
            this.#f_inheritedSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Draw*/
            let f_container_draw = createDivStyle5(null, "Transformer", this.container)[1]; 2;

            this.#f_exactDraw = createInput_Infield("Exact Draw", this.#defaultExactDraw, "width:30%;", () => {this.UpdateFromFields();}, f_container_draw, false, 5, {postfix: "A"});
            setFieldDisabled(true, this.#f_exactDraw[1], this.#f_exactDraw[0]);
            this.#f_requiredDraw = createInput_Infield("Total Draw Required for " + this.#defaultLoadingPercentage + "% Loading", this.#defaultRequiredDraw, "width:30%;", () => {this.UpdateFromFields();}, f_container_draw, false, 5, {postfix: "A"});

            /*
            Material*/
            let f_container_material = createDivStyle5(null, "Transformer", this.container)[1]; 2;

            var parts = getPredefinedParts("Transformer - ");
            var dropdownElements = [];
            parts.forEach(element => dropdownElements.push([element.Name, "https://sa-led.com/wp-content/uploads/2023/11/BT-1711_12V-300x300.jpg"]));

            this.#f_material = createDropdown_Infield_Icons_Search("Transformer", 0, "width:60%;", 50, false, dropdownElements, () => {this.UpdateFromFields();}, f_container_material);

            /*
            OutputSizes*/
            let f_container_outputSizes = createDivStyle5(null, "Output Sizes", this.container)[1];

            this.#f_outputSizeTable = new Table(f_container_outputSizes, "100%", 20, 250);
            this.#f_outputSizeTable.setHeading("Qty", "Wattage (W)", "Voltage (V)");
            this.#f_outputSizeTable.addRow("-", "-", "-");
            this.#f_outputSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Update*/
            this.UpdateFromFields();
      }

      /*
      Inherited*/
      UpdateFromFields() {
            super.UpdateFromFields();

            this.UpdateFromInheritedData();

            this.UpdateTotalDraw();
            this.UpdateQty();

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
            this.#f_inheritedSizeTable.deleteAllRows();

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{pathLength: 0, shapeAreas: 0, boundingRectAreas: 0, QWHD: QWHD}*/) => {

                        if(!(dataEntry.qty && dataEntry.wattage && dataEntry.voltage)) return/**just this entry*/;

                        this.#f_inheritedSizeTable.addRow(dataEntry.qty, dataEntry.wattage, dataEntry.voltage);
                  });
            });
      };

      UpdateTotalDraw() {
            let ledVoltage = 0;
            let ledQty = 0;
            let ledWattage = 0;

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{pathLength: 0, shapeAreas: 0, boundingRectAreas: 0, QWHD: QWHD}*/) => {

                        if(!(dataEntry.qty && dataEntry.wattage && dataEntry.voltage)) return/**just this entry*/;

                        ledVoltage = dataEntry.voltage;
                        ledQty += dataEntry.qty;
                        ledWattage = dataEntry.wattage;
                  });
            });

            if(ledQty == 0) return;

            $(this.#f_exactDraw[1]).val(roundNumber(this.amperage(ledQty, ledWattage, ledVoltage, 100), 2));
            $(this.#f_requiredDraw[1]).val(roundNumber(this.amperage(ledQty, ledWattage, ledVoltage, this.#defaultLoadingPercentage), 2));
      }

      UpdateQty() {
            let ledVoltage = 0;
            let ledQty = 0;
            let ledWattage = 0;

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{pathLength: 0, shapeAreas: 0, boundingRectAreas: 0, QWHD: QWHD}*/) => {

                        if(!(dataEntry.qty && dataEntry.wattage && dataEntry.voltage)) return/**just this entry*/;

                        ledVoltage = dataEntry.voltage;
                        ledQty += dataEntry.qty;
                        ledWattage = dataEntry.wattage;
                  });
            });

            if(ledQty == 0) return;

            let orderedList = getCheapestTransformersInOrder(this.amperage(ledQty, ledWattage, ledVoltage, this.#defaultLoadingPercentage), 0, false, ledVoltage);
            console.log(orderedList);

            let transformerQty = orderedList[0].i_totalComputedQuantity;
            let transformerName = orderedList[0].name;

            $(this.qtyField).val(transformerQty);

            this.#f_material[6]();//pause callback
            $(this.#f_material[4]).val(transformerName).change();
            $(this.#f_material[1]).val(transformerName).change();
            this.#f_material[7]();//resume callback
      }

      UpdateOutput() {
            this.#dataForSubscribers = [];
            this.#f_outputSizeTable.deleteAllRows();

            this.#dataForSubscribers.push({qty: this.qty, wattage: this.wattage, voltage: this.voltage});
            this.#f_outputSizeTable.addRow(this.qty, this.wattage, this.voltage);

      };

      async Create(productNo, partIndex) {
            console.log("in transformer create");
            partIndex = await super.Create(productNo, partIndex);
            var name = this.#f_material[1].value;

            for(let i = 0; i < this.#dataForSubscribers.length; i++) {
                  let partQty = this.#dataForSubscribers[i].qty;
                  partIndex = await q_AddPart_Dimensionless(productNo, partIndex, true, name, partQty, "Transformer", "");
            }

            return partIndex;
      }

      Description() {
            super.Description();

            return "";
      }
}

function getCheapestTransformer(totalAmpRequired, ampTolerance, dimming, voltage) {
      var cheapestPrice = 10000000;
      var orderedArray = [];
      for(var t = 0; t < TransformerLookup.length; t++) {
            if(
                  TransformerLookup[t].dimming == dimming &&
                  TransformerLookup[t].voltage == voltage
            ) {
                  TransformerLookup[t].i_totalComputedPrice =
                        TransformerLookup[t].price *
                        Math.ceil((totalAmpRequired - ampTolerance) / TransformerLookup[t].amp);
                  TransformerLookup[t].i_totalComputedQuantity = Math.ceil(
                        (totalAmpRequired - ampTolerance) / TransformerLookup[t].amp
                  );
                  orderedArray.push(TransformerLookup[t]);
            }
      }
      orderedArray.sort(
            compareCheapestTransformer(totalAmpRequired - ampTolerance)
      );
      return orderedArray[0];
}
function getCheapestTransformersInOrder(totalAmpRequired, ampTolerance, dimming, voltage) {
      var cheapestPrice = 10000000;
      var orderedArray = [];
      for(var t = 0; t < TransformerLookup.length; t++) {
            if(
                  TransformerLookup[t].dimming == dimming &&
                  TransformerLookup[t].voltage == voltage
            ) {
                  TransformerLookup[t].i_totalComputedPrice =
                        TransformerLookup[t].price *
                        Math.ceil((totalAmpRequired - ampTolerance) / TransformerLookup[t].amp);
                  TransformerLookup[t].i_totalComputedQuantity = Math.ceil(
                        (totalAmpRequired - ampTolerance) / TransformerLookup[t].amp
                  );
                  orderedArray.push(TransformerLookup[t]);
            }
      }
      orderedArray.sort(
            compareCheapestTransformer(totalAmpRequired - ampTolerance)
      );
      return orderedArray;
}
function compareCheapestTransformer(totalAmpRequired) {
      return function innerSort(a, b) {
            if(
                  a.price * Math.ceil(totalAmpRequired / a.amp) >
                  b.price * Math.ceil(totalAmpRequired / b.amp)
            )
                  return 1;
            if(
                  a.price * Math.ceil(totalAmpRequired / a.amp) <
                  b.price * Math.ceil(totalAmpRequired / b.amp)
            )
                  return -1;
            if(
                  a.price * Math.ceil(totalAmpRequired / a.amp) ==
                  b.price * Math.ceil(totalAmpRequired / b.amp)
            ) {
                  if(a.warranty > b.warranty) return -1;
                  else return 1;
            }
            return 0;
      };
}