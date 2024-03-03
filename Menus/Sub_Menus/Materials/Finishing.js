class Finishing extends Material {
      static DISPLAY_NAME = "FINISHING";

      #production;

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

      #eyeletsRequired;
      #eyeletsQty;
      #eyeletsHelper;
      #eyeletsHelperBtn;
      #pinsRequired;
      #pinsQty;
      #standOffRequired;
      #standOffQty;
      #standOffType;
      #standoff_offsetFromEdgeField;
      #standoff_horizontalSpacingField;
      #standoff_verticalSpacingField;
      #standoff_spacingAllowanceField;
      #eyeletsType;
      #eyelets_horizontalSpacingField;
      #eyelets_verticalSpacingField;
      #eyelets_spacingAllowanceField;
      #eyelets_offsetFromEdgeField;
      #standOffHelper;
      #standOffHelperBtn;
      #customRequired;
      #customQty;
      #customCost;
      #customMarkup;
      #customDescription;

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

            /**
             * @InheritedParentSizeSplits
             */
            createHeadingStyle1("Inherited Parent Size Splits", null, this.container);
            this.#inheritedSizeTable = new Table(this.container, 780, 20, 250);
            this.#inheritedSizeTable.setHeading("Qty", "Width", "Height");
            this.#inheritedSizeTable.addRow("-", "-", "-");

            /**
             * @Modifiers
             */
            createHeadingStyle1("Modifiers", null, this.container);

            this.#eyeletsRequired = createCheckbox_Infield("Eyelets", false, "width:30%;min-width:150px;margin-right:65%", () => {this.UpdateFromChange();}, this.container, true);
            this.#eyeletsQty = createInput_Infield("Qty per Product", null, "width:25%;min-width:110px;margin-left:40px;display:none;margin-right:400px;", () => {this.UpdateFromChange();}, this.container, false, 1);
            this.#eyeletsHelper;
            this.#eyeletsHelperBtn = createIconButton("https://cdn.gorilladash.com/images/media/6195615/signarama-australia-searching-63ad3d8672602.png", "Visualiser", "width:200px;height:40px;display:none;margin-left:40px;margin-right:400px;", () => {
                  this.#eyeletsHelper = new ModalStandoffHelper2("Eyelets Helper", 100, () => {
                        this.UpdateEyeletQty();
                        this.UpdateFromChange();
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
                  this.#eyeletsHelper.width = this.getQWH().width;
                  this.#eyeletsHelper.height = this.getQWH().height;

                  let matrixSizeArrays = [];
                  for(let i = 0; i < this.#inheritedData.length; i++) {
                        matrixSizeArrays.push(this.#inheritedData[i].matrixSizes);
                  }
                  this.#eyeletsHelper.setSizeArrays(...matrixSizeArrays);
            }, this.container, true);
            this.#eyeletsType = createDropdown_Infield("Eyelets Type", 0, "width:30%;display:none;margin-left:40px;",
                  [createDropdownOption("Eyelet 20mm", "20,6")], () => {this.UpdateEyeletQty(); this.UpdateFromChange();}, this.container);
            this.#eyelets_horizontalSpacingField = createInput_Infield("Max Spacing Horizontal", 600, "width:200px;display:none", () => {this.UpdateEyeletQty(); this.UpdateFromChange();}, this.container, true, 100);
            this.#eyelets_verticalSpacingField = createInput_Infield("Max Spacing Vertical", 600, "width:200px;display:none", () => {this.UpdateEyeletQty(); this.UpdateFromChange();}, this.container, true, 100);
            this.#eyelets_spacingAllowanceField = createInput_Infield("Max Spacing Allowance", 20, "width:200px;display:none;margin-left:40px;", () => {this.UpdateEyeletQty(); this.UpdateFromChange();}, this.container, true, 10);
            this.#eyelets_offsetFromEdgeField = createInput_Infield("Centers' Offset From Edge", 20, "width:200px;display:none", () => {this.UpdateEyeletQty(); this.UpdateFromChange();}, this.container, true, 1);

            makeFieldGroup("Checkbox", this.#eyeletsRequired[1], true, this.#eyeletsQty[0], this.#eyeletsHelperBtn,
                  this.#eyeletsType[0],
                  this.#eyelets_offsetFromEdgeField[0], this.#eyelets_horizontalSpacingField[0], this.#eyelets_verticalSpacingField[0],
                  this.#eyelets_spacingAllowanceField[0]
            );

            this.#pinsRequired = createCheckbox_Infield("Pins (Thread Rod)", false, "width:30%;min-width:150px;margin-right:65%", () => {this.UpdateFromChange();}, this.container, true);
            this.#pinsQty = createInput_Infield("Qty per Product", null, "width:25%;min-width:110px;margin-left:40px;display:none", () => {this.UpdateFromChange();}, this.container, false, 1);
            makeFieldGroup("Checkbox", this.#pinsRequired[1], true, this.#pinsQty[0]);

            this.#standOffRequired = createCheckbox_Infield("Stand-off", false, "width:30%;min-width:150px;margin-right:65%", () => {this.UpdateStandoffQty(); this.UpdateFromChange();}, this.container, true);
            this.#standOffQty = createInput_Infield("Qty per Product", null, "width:25%;min-width:110px;margin-left:40px;display:none;margin-right:400px;", () => {this.UpdateFromChange();}, this.container, false, 1);

            this.#standOffHelperBtn = createIconButton("https://cdn.gorilladash.com/images/media/6195615/signarama-australia-searching-63ad3d8672602.png", "Visualiser", "width:200px;height:40px;display:none;margin-left:40px;margin-right:400px;", () => {
                  this.#standOffHelper = new ModalStandoffHelper2("Standoff Helper", 100, () => {
                        this.UpdateStandoffQty();
                        this.UpdateFromChange();
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
                  this.#standOffHelper.width = this.getQWH().width;
                  this.#standOffHelper.height = this.getQWH().height;

                  let matrixSizeArrays = [];
                  for(let i = 0; i < this.#inheritedData.length; i++) {
                        matrixSizeArrays.push(this.#inheritedData[i].matrixSizes);

                  }
                  this.#standOffHelper.setSizeArrays(...matrixSizeArrays);
            }, this.container, true);

            this.#standOffType = createDropdown_Infield("Stand-off Type", 1, "width:30%;display:none;margin-left:40px;",
                  [createDropdownOption("Standoff 19w 25D", "19,25"),
                  createDropdownOption("Standoff 25w 25D", "25,25"),
                  createDropdownOption("Standoff 25w 50D", "25,50"),
                  createDropdownOption("Standoff 32w 50D", "32,50")], () => {this.UpdateStandoffQty(); this.UpdateFromChange();}, this.container);
            this.#standoff_horizontalSpacingField = createInput_Infield("Max Spacing Horizontal", 600, "width:200px;display:none", () => {this.UpdateStandoffQty(); this.UpdateFromChange();}, this.container, true, 100);
            this.#standoff_verticalSpacingField = createInput_Infield("Max Spacing Vertical", 600, "width:200px;display:none", () => {this.UpdateStandoffQty(); this.UpdateFromChange();}, this.container, true, 100);
            this.#standoff_spacingAllowanceField = createInput_Infield("Max Spacing Allowance", 20, "width:200px;display:none;margin-left:40px;", () => {this.UpdateStandoffQty(); this.UpdateFromChange();}, this.container, true, 10);
            this.#standoff_offsetFromEdgeField = createInput_Infield("Centers' Offset From Edge", 20, "width:200px;display:none", () => {this.UpdateStandoffQty(); this.UpdateFromChange();}, this.container, true, 1);

            makeFieldGroup("Checkbox", this.#standOffRequired[1], true, this.#standOffQty[0], this.#standOffType[0], this.#standOffHelperBtn,
                  this.#standoff_offsetFromEdgeField[0], this.#standoff_horizontalSpacingField[0], this.#standoff_verticalSpacingField[0],
                  this.#standoff_spacingAllowanceField[0]);

            this.#customRequired = createCheckbox_Infield("Custom", false, "width:30%;min-width:150px;margin-right:65%;", () => {
                  setFieldHidden(!this.#customRequired[1].checked, this.#customQty[0], this.#customQty[0]);
                  setFieldHidden(!this.#customRequired[1].checked, this.#customCost[0], this.#customCost[0]);
                  setFieldHidden(!this.#customRequired[1].checked, this.#customMarkup[0], this.#customMarkup[0]);
                  setFieldHidden(!this.#customRequired[1].checked, this.#customDescription[0], this.#customDescription[0]);
            }, this.container, true);
            this.#customQty = createInput_Infield("Qty per Product", null, "width:20%;min-width:110px;margin-left:40px;display:none", () => {this.UpdateFromChange();}, this.container, false, 1);
            this.#customCost = createInput_Infield("Cost", null, "width:20%;min-width:110px;display:none", () => {this.UpdateFromChange();}, this.container, false, 1);
            this.#customMarkup = createInput_Infield("Markup", null, "width:20%;min-width:110px;display:none", () => {this.UpdateFromChange();}, this.container, false, 0.1);
            this.#customDescription = createInput_Infield("Description", null, "width:20%;min-width:110px;display:none;", () => {this.UpdateFromChange();}, this.container, false, null);
            makeFieldGroup("Checkbox", this.#customRequired[1], true, this.#customQty[0], this.#customCost[0], this.#customMarkup[0], this.#customDescription[0]);

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

            this.dataToPushToSubscribers = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
            this.UpdateSubscribedLabel();
            this.PushToSubscribers();

            if(this.#standOffHelper && this.#modalIsOpen) {
                  this.#standOffHelper.updateFromFields();
            }

            if(this.#eyeletsHelper && this.#modalIsOpen) {
                  this.#eyeletsHelper.updateFromFields();
            }

            this.UpdateStandoffQty();
      }

      getCalcQty(fieldType) {
            let matrixSizeArrays = [];
            let qty = 0;
            for(let i = 0; i < this.#inheritedData.length; i++) {
                  matrixSizeArrays.push(this.#inheritedData[i].matrixSizes);
            }

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
            partIndex = super.Create(productNo, partIndex);
            return partIndex;
      }
}