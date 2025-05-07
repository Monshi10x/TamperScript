class Finishing extends Material {
      static DISPLAY_NAME = "FINISHING";
      /*override*/get Type() {return "FINISHING";}

      #production;

      #productionHeader;
      #sheetSplitSizes;

      /**
       * @Inherited
       * @example
       * [{parent: 'SHEET-1699952073332-95570559', data: []},
       *  {parent: 'SHEET-1699952073332-95574529', data: []}]
       */
      #inheritedSizes = [];
      #inheritedSizeTable;

      /**
      * @Subscribers
      * @Updated on table changes
      * @example 
      *          [{qty: 4, width: '2440', height: '1220'},
      *           {qty: 4, width: '2440', height: '580' },
      *           {qty: 1, width: '240',  height: '1220'},
      *           {qty: 1, width: '240',  height: '580' }]
      */
      #dataForSubscribers = [];

      #eyeletsRequired;
      #eyeletsQty;
      #eyeletsHelper;
      #eyeletsHelperBtn;
      #pinsRequired;
      #pinsQty;
      #pins_productionEach;
      #standOffRequired;
      #standOffQty;
      #standOffType;
      #standoff_offsetFromEdgeField;
      #standoff_horizontalSpacingField;
      #standoff_verticalSpacingField;
      #standoff_spacingAllowanceField;
      #standoff_productionEach;
      #eyeletsType;
      #eyelets_horizontalSpacingField;
      #eyelets_verticalSpacingField;
      #eyelets_spacingAllowanceField;
      #eyelets_offsetFromEdgeField;
      #eyelets_productionEach;
      #standOffHelper;
      #standOffHelperBtn;
      #customRequired;
      #customQty;
      #customCost;
      #customMarkup;
      #customDescription;
      #custom_productionEach;

      #modalIsOpen = false;

      get diameter() {return parseFloat(this.#standOffType.value.split(",")[0]);}
      offsetFromEdge(fieldType) {
            if(fieldType == "eyelet") return parseFloat(this.#eyelets_offsetFromEdgeField[1].value);
            if(fieldType == "standoff") return parseFloat(this.#standoff_offsetFromEdgeField[1].value);
      }
      horizontalSpacing(fieldType) {
            if(fieldType == "eyelet") return parseFloat(this.#eyelets_horizontalSpacingField[1].value);
            if(fieldType == "standoff") return parseFloat(this.#standoff_horizontalSpacingField[1].value);
      }
      verticalSpacing(fieldType) {
            if(fieldType == "eyelet") return parseFloat(this.#eyelets_verticalSpacingField[1].value);
            if(fieldType == "standoff") return parseFloat(this.#standoff_verticalSpacingField[1].value);
      }
      spacingAllowance(fieldType) {
            if(fieldType == "eyelet") return parseFloat(this.#eyelets_spacingAllowanceField[1].value);
            if(fieldType == "standoff") return parseFloat(this.#standoff_spacingAllowanceField[1].value);
      }

      set standOffRequired(value) {setCheckboxChecked(value, this.#standOffRequired[1]);}
      set eyeletsRequired(value) {setCheckboxChecked(value, this.#eyeletsRequired[1]);}
      set customRequired(value) {setCheckboxChecked(value, this.#customRequired[1]);}
      set pinsRequired(value) {setCheckboxChecked(value, this.#pinsRequired[1]);}

      get backgroundColor() {return COLOUR.Lime;}
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
            standOffType*/
            let f_container_standOff = createDivStyle5(null, "Stand-Off", this.container)[1];

            this.#standOffRequired = createCheckbox_Infield("Stand-off", false, "width:30%;min-width:150px;margin-right:65%", () => {this.UpdateStandoffQty(); this.UpdateFromFields();}, f_container_standOff, true);
            this.#standOffQty = createInput_Infield("Qty per Product", null, "width:25%;min-width:110px;margin-left:40px;display:none;margin-right:400px;", () => {this.UpdateFromFields();}, f_container_standOff, false, 1);

            this.#standOffHelperBtn = createIconButton("https://cdn.gorilladash.com/images/media/6195615/signarama-australia-searching-63ad3d8672602.png", "Visualiser", "width:200px;height:40px;display:none;margin-left:40px;margin-right:400px;", () => {
                  this.#standOffHelper = new ModalStandoffHelper2("Standoff Helper", 100, () => {
                        this.UpdateStandoffQty();
                        this.UpdateFromFields();
                        this.#modalIsOpen = false;
                  }, this);
                  this.#modalIsOpen = true;
                  this.#standOffHelper.borrowFields(this.#standOffType[0], this.#standoff_offsetFromEdgeField[0],
                        this.#standoff_horizontalSpacingField[0], this.#standoff_verticalSpacingField[0],
                        this.#standoff_spacingAllowanceField[0]);
                  this.#standOffHelper.setTypeField(this.#standOffType[1]);
                  this.#standOffHelper.setOffsetFromEdgeField(this.#standoff_offsetFromEdgeField[1]);
                  this.#standOffHelper.setHorizontalSpacingField(this.#standoff_horizontalSpacingField[1]);
                  this.#standOffHelper.setVerticalSpacingField(this.#standoff_verticalSpacingField[1]);
                  this.#standOffHelper.setSpacingAllowanceField(this.#standoff_spacingAllowanceField[1]);
                  this.#standOffHelper.width = this.getQWHD().width;
                  this.#standOffHelper.height = this.getQWHD().height;

                  let matrixSizeArrays = [];
                  this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                        subscription.data.forEach((dataEntry/**{QWHD: QWHD, matrixSizes: [...]}*/) => {

                              matrixSizeArrays.push(dataEntry.matrixSizes);
                        });
                  });
                  this.#standOffHelper.setSizeArrays(...matrixSizeArrays);
            }, f_container_standOff, true);

            this.#standOffType = createDropdown_Infield("Stand-off Type", 1, "width:30%;display:none;margin-left:40px;",
                  [createDropdownOption("Standoff - 19x19 Satin Silver", "19,19"),
                  createDropdownOption("Standoff - 19x25 Satin Silver", "19,25"),
                  createDropdownOption("Standoff - 19x50 Satin Silver", "19,50")], () => {this.UpdateStandoffQty(); this.UpdateFromFields();}, f_container_standOff);
            this.#standoff_horizontalSpacingField = createInput_Infield("Max Spacing Horizontal", 600, "width:200px;display:none", () => {this.UpdateStandoffQty(); this.UpdateFromFields();}, f_container_standOff, true, 100, {postfix: "mm"});
            this.#standoff_verticalSpacingField = createInput_Infield("Max Spacing Vertical", 600, "width:200px;display:none", () => {this.UpdateStandoffQty(); this.UpdateFromFields();}, f_container_standOff, true, 100, {postfix: "mm"});
            this.#standoff_spacingAllowanceField = createInput_Infield("Max Spacing Allowance", 20, "width:200px;display:none;margin-left:40px;", () => {this.UpdateStandoffQty(); this.UpdateFromFields();}, f_container_standOff, true, 10, {postfix: "mm"});
            this.#standoff_offsetFromEdgeField = createInput_Infield("Centers' Offset From Edge", 20, "width:200px;display:none;margin-right:200px;", () => {this.UpdateStandoffQty(); this.UpdateFromFields();}, f_container_standOff, true, 1, {postfix: "mm"});
            this.#standoff_productionEach = createInput_Infield("Production per standoff", 2, "width:200px;display:none;margin-left:40px;", () => {this.UpdateFromFields();}, f_container_standOff, true, 1, {postfix: "mins"});

            makeFieldGroup("Checkbox", this.#standOffRequired[1], true, this.#standOffQty[0], this.#standOffType[0], this.#standOffHelperBtn,
                  this.#standoff_offsetFromEdgeField[0], this.#standoff_horizontalSpacingField[0], this.#standoff_verticalSpacingField[0],
                  this.#standoff_spacingAllowanceField[0], this.#standoff_productionEach[0]);


            /*
            Eyelets*/
            let f_container_eyelets = createDivStyle5(null, "Eyelets", this.container)[1];

            this.#eyeletsRequired = createCheckbox_Infield("Eyelets", false, "width:30%;min-width:150px;margin-right:65%", () => {this.UpdateFromFields();}, f_container_eyelets, true);
            this.#eyeletsQty = createInput_Infield("Qty per Product", null, "width:25%;min-width:110px;margin-left:40px;display:none;margin-right:400px;", () => {this.UpdateFromFields();}, f_container_eyelets, false, 1);
            this.#eyeletsHelper;
            this.#eyeletsHelperBtn = createIconButton("https://cdn.gorilladash.com/images/media/6195615/signarama-australia-searching-63ad3d8672602.png", "Visualiser", "width:200px;height:40px;display:none;margin-left:40px;margin-right:400px;", () => {
                  this.#eyeletsHelper = new ModalStandoffHelper2("Eyelets Helper", 100, () => {
                        this.UpdateEyeletQty();
                        this.UpdateFromFields();
                        this.#modalIsOpen = false;
                  }, this);
                  this.#modalIsOpen = true;
                  this.#eyeletsHelper.borrowFields(this.#eyeletsType[0], this.#eyelets_offsetFromEdgeField[0],
                        this.#eyelets_horizontalSpacingField[0], this.#eyelets_verticalSpacingField[0],
                        this.#eyelets_spacingAllowanceField[0]);
                  this.#eyeletsHelper.setTypeField(this.#eyeletsType[1]);
                  this.#eyeletsHelper.setOffsetFromEdgeField(this.#eyelets_offsetFromEdgeField[1]);
                  this.#eyeletsHelper.setHorizontalSpacingField(this.#eyelets_horizontalSpacingField[1]);
                  this.#eyeletsHelper.setVerticalSpacingField(this.#eyelets_verticalSpacingField[1]);
                  this.#eyeletsHelper.setSpacingAllowanceField(this.#eyelets_spacingAllowanceField[1]);
                  this.#eyeletsHelper.width = this.getQWHD().width;
                  this.#eyeletsHelper.height = this.getQWHD().height;

                  let matrixSizeArrays = [];
                  for(let i = 0; i < this.INHERITED_DATA.length; i++) {
                        matrixSizeArrays.push(this.INHERITED_DATA[i].data.matrixSizes);
                  }
                  this.#eyeletsHelper.setSizeArrays(...matrixSizeArrays);
            }, f_container_eyelets, true);
            this.#eyeletsType = createDropdown_Infield("Eyelets Type", 0, "width:30%;display:none;margin-left:40px;",
                  [createDropdownOption("Eyelet - 20x10 Silver", "20,10")], () => {this.UpdateEyeletQty(); this.UpdateFromFields();}, f_container_eyelets);
            this.#eyelets_horizontalSpacingField = createInput_Infield("Max Spacing Horizontal", 600, "width:200px;display:none", () => {this.UpdateEyeletQty(); this.UpdateFromFields();}, f_container_eyelets, true, 100, {postfix: "mm"});
            this.#eyelets_verticalSpacingField = createInput_Infield("Max Spacing Vertical", 600, "width:200px;display:none", () => {this.UpdateEyeletQty(); this.UpdateFromFields();}, f_container_eyelets, true, 100, {postfix: "mm"});
            this.#eyelets_spacingAllowanceField = createInput_Infield("Max Spacing Allowance", 20, "width:200px;display:none;margin-left:40px;", () => {this.UpdateEyeletQty(); this.UpdateFromFields();}, f_container_eyelets, true, 10, {postfix: "mm"});
            this.#eyelets_offsetFromEdgeField = createInput_Infield("Centers' Offset From Edge", 20, "width:200px;display:none;margin-right:200px;", () => {this.UpdateEyeletQty(); this.UpdateFromFields();}, f_container_eyelets, true, 1, {postfix: "mm"});
            this.#eyelets_productionEach = createInput_Infield("Production per eyelet", 2, "width:200px;display:none;margin-left:40px;", () => {this.UpdateFromFields();}, f_container_eyelets, true, 1, {postfix: "mins"});

            makeFieldGroup("Checkbox", this.#eyeletsRequired[1], true, this.#eyeletsQty[0], this.#eyeletsHelperBtn,
                  this.#eyeletsType[0],
                  this.#eyelets_offsetFromEdgeField[0], this.#eyelets_horizontalSpacingField[0], this.#eyelets_verticalSpacingField[0],
                  this.#eyelets_spacingAllowanceField[0], this.#eyelets_productionEach[0]
            );


            /*
            Pins*/
            let f_container_pins = createDivStyle5(null, "Pins", this.container)[1];

            this.#pinsRequired = createCheckbox_Infield("Pins (Thread Rod)", false, "width:30%;min-width:150px;margin-right:65%", () => {this.UpdateFromFields();}, f_container_pins, true);
            this.#pinsQty = createInput_Infield("Qty per Product", null, "width:25%;min-width:110px;margin-left:40px;display:none;margin-right:60%;", () => {this.UpdateFromFields();}, f_container_pins, false, 1);
            this.#pins_productionEach = createInput_Infield("Production per pin", 2, "width:200px;display:none;margin-left:40px;", () => {this.UpdateFromFields();}, f_container_pins, true, 1, {postfix: "mins"});

            makeFieldGroup("Checkbox", this.#pinsRequired[1], true, this.#pinsQty[0], this.#pins_productionEach[0]);

            /*
            Custom Required*/
            let f_container_custom = createDivStyle5(null, "Custom", this.container)[1];

            this.#customRequired = createCheckbox_Infield("Custom", false, "width:30%;min-width:150px;margin-right:65%;", () => {
                  setFieldHidden(!this.#customRequired[1].checked, this.#customQty[0], this.#customQty[0]);
                  setFieldHidden(!this.#customRequired[1].checked, this.#customCost[0], this.#customCost[0]);
                  setFieldHidden(!this.#customRequired[1].checked, this.#customMarkup[0], this.#customMarkup[0]);
                  setFieldHidden(!this.#customRequired[1].checked, this.#customDescription[0], this.#customDescription[0]);
            }, f_container_custom, true);
            this.#customQty = createInput_Infield("Qty per Product", null, "width:20%;min-width:110px;margin-left:40px;display:none", () => {this.UpdateFromFields();}, f_container_custom, false, 1);
            this.#customCost = createInput_Infield("Cost", null, "width:20%;min-width:110px;display:none", () => {this.UpdateFromFields();}, f_container_custom, false, 1, {prefix: "$"});
            this.#customMarkup = createInput_Infield("Markup", null, "width:20%;min-width:110px;display:none", () => {this.UpdateFromFields();}, f_container_custom, false, 0.1, {postfix: "x"});
            this.#customDescription = createInput_Infield("Description", null, "width:20%;min-width:110px;display:none;", () => {this.UpdateFromFields();}, f_container_custom, false, null);
            this.#custom_productionEach = createInput_Infield("Production per custom", 2, "width:200px;display:none;margin-left:40px;", () => {this.UpdateFromFields();}, f_container_custom, true, 1, {postfix: "mins"});
            makeFieldGroup("Checkbox", this.#customRequired[1], true, this.#customQty[0], this.#customCost[0], this.#customMarkup[0], this.#customDescription[0], this.#custom_productionEach[0]);

            /*
            Production*/
            let f_container_production = createDivStyle5(null, "Production", this.container)[1];

            this.#production = new Production(f_container_production, null, function() { }, this.sizeClass);
            this.#production.showContainerDiv = true;
            this.#production.headerName = "Finishing Production";
            this.#production.productionTime = 0;
            this.#production.required = true;
            this.#production.showRequiredCkb = false;
            this.#production.requiredName = "Production Time";

            /*
            Subscribers*/
            this.UpdateDataForSubscribers();
      }

      /*
      Inherited*/
      UpdateFromFields() {
            super.UpdateFromFields();

            this.UpdateInheritedSizes();

            this.UpdateDataForSubscribers();
            this.UpdateSubscribedLabel();
            this.PushToSubscribers();

            if(this.#standOffHelper && this.#modalIsOpen) {
                  this.#standOffHelper.UpdateFromFields();
            }

            if(this.#eyeletsHelper && this.#modalIsOpen) {
                  this.#eyeletsHelper.UpdateFromFields();
            }

            this.UpdateStandoffQty();
            this.UpdateProduction();
      }

      UpdateDataForSubscribers() {
            this.DATA_FOR_SUBSCRIBERS = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
      }

      getCalcQty(fieldType) {

            let matrixSizeArrays = [];
            let qty = 0;

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{QWHD: QWHD, matrixSizes: [...]}*/) => {

                        matrixSizeArrays.push(dataEntry.matrixSizes);
                  });
            });

            console.log(matrixSizeArrays);
            for(let i = 0; i < matrixSizeArrays.length; i++) {//per parent subscriptions matrix (i.e. Sheet or Size Matrix)
                  for(let j = 0; j < matrixSizeArrays[i].length; j++) {//per sheet subscription matrix
                        let matrixSize = matrixSizeArrays[i][j];

                        let isFirstRow, isFirstColumn = false;
                        for(let r = 0; r < matrixSize.length; r++) {//per matrix row
                              isFirstRow = r == 0;

                              for(let c = 0; c < matrixSize[r].length; c++) {//per matrix column i.e. size [w, h]
                                    isFirstColumn = c == 0;

                                    let [rectWidth, rectHeight] = matrixSize[r][c];

                                    //draw Stand-offs
                                    let numberTop = 1 + Math.ceil((rectWidth - 2 * this.offsetFromEdge(fieldType)) / clamp((this.horizontalSpacing(fieldType) + this.spacingAllowance(fieldType)), 1, Infinity));
                                    let numberLeft = 1 + Math.ceil((rectHeight - 2 * this.offsetFromEdge(fieldType)) / clamp((this.verticalSpacing(fieldType) + this.spacingAllowance(fieldType)), 1, Infinity));

                                    qty += numberTop * 2 + numberLeft * 2 - 4;
                              }
                        }
                  }
            }
            return qty;
      }

      UpdateStandoffQty() {
            this.#standOffQty[1].value = this.getCalcQty("standoff");
      }

      UpdateEyeletQty() {
            this.#eyeletsQty[1].value = this.getCalcQty("eyelet");
      }

      UpdateProduction() {
            let productionMins = 0;
            if(this.#eyeletsRequired[1].checked) {
                  productionMins += zeroIfNaNNullBlank(this.#eyelets_productionEach[1].value) * zeroIfNaNNullBlank(this.#eyeletsQty[1].value);
            }
            if(this.#standOffRequired[1].checked) {
                  productionMins += zeroIfNaNNullBlank(this.#standoff_productionEach[1].value) * zeroIfNaNNullBlank(this.#standOffQty[1].value);
            }
            if(this.#pinsRequired[1].checked) {
                  productionMins += zeroIfNaNNullBlank(this.#pins_productionEach[1].value) * zeroIfNaNNullBlank(this.#pinsQty[1].value);
            }
            if(this.#customRequired[1].checked) {
                  productionMins += zeroIfNaNNullBlank(this.#custom_productionEach[1].value) * zeroIfNaNNullBlank(this.#customQty[1].value);
            }
            this.#production.productionTime = productionMins;
      }

      UpdateInheritedSizes = () => {
            this.#inheritedSizes = [];
            this.#inheritedSizeTable.deleteAllRows();

            //Per Parent Subscription:
            for(let a = 0; a < this.INHERITED_DATA.length; a++) {
                  let recievedInputSizes = this.INHERITED_DATA[a].data;
                  for(let i = 0; i < recievedInputSizes.length; i++) {
                        this.#inheritedSizes.push(recievedInputSizes[i].QWHD);
                        this.#inheritedSizeTable.addRow(recievedInputSizes[i].QWHD.qty, recievedInputSizes[i].QWHD.width, recievedInputSizes[i].QWHD.height);
                  }
            }
      };

      async Create(productNo, partIndex) {
            partIndex = await super.Create(productNo, partIndex);

            if(this.#eyeletsRequired[1].checked) {
                  partIndex = await q_AddPart_Dimensionless(productNo, partIndex, true, this.#eyeletsType[1].selectedOptions[0].innerText, this.#eyeletsQty[1].value, this.#eyeletsType[1].selectedOptions[0].innerText, "", false);
            } if(this.#customRequired[1].checked) {
                  await AddPart("Custom Item Cost-Markup (Ea)", productNo);
                  partIndex++;
                  await setPartQty(productNo, partIndex, this.#customQty[1].value);
                  await setPartDescription(productNo, partIndex, "Supplier Cuts from " + this.#customDescription[1].value);
                  await setPartVendorCostEa(productNo, partIndex, this.#customCost[1].value);
                  await setPartMarkupEa(productNo, partIndex, this.#customMarkup[1].value);
                  await savePart(productNo, partIndex);
            } if(this.#standOffRequired[1].checked) {
                  partIndex = await q_AddPart_Dimensionless(productNo, partIndex, true, this.#standOffType[1].selectedOptions[0].innerText, this.#standOffQty[1].value, this.#standOffType[1].selectedOptions[0].innerText, "", false);
            } if(this.#pinsRequired[1].checked) {
                  alert("todo pins");
            }

            partIndex = await this.#production.Create(productNo, partIndex);

            return partIndex;
      }

      Description() {
            super.Description();

            let desc = "";
            if(this.#eyeletsRequired[1].checked) {
                  desc += "Includes x" + this.#eyeletsQty[1].value + " Eyelets: " + this.#eyeletsType[1].selectedOptions[0].innerText.replace('Eyelet - ', '');
            } if(this.#customRequired[1].checked) {
                  desc += "<br>";
                  desc += "Includes Custom: ";
            } if(this.#standOffRequired[1].checked) {
                  desc += "<br>";
                  desc += "Includes x" + this.#standOffQty[1].value + " Stand-offs: " + this.#standOffType[1].selectedOptions[0].innerText.replace('Standoff - ', '');
            } if(this.#pinsRequired[1].checked) {
                  desc += "<br>";
                  desc += "Includes Pins: ";
            }

            return desc;
      }
}