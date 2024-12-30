
class Sheet extends Material {
      /*override*/get Type() {return "SHEET";}

      #materialOptions = [
            createDropdownOption("ACM", "ACM"),
            createDropdownOption("Acrylic", "Acrylic"),
            createDropdownOption("Aluminium", "Aluminium"),
            createDropdownOption("Mondoclad", "Mondoclad"),
            createDropdownOption("Foamed PVC", "Foamed PVC"),
            createDropdownOption("Corflute", "Corflute"),
            createDropdownOption("Polycarb", "Polycarb"),
            createDropdownOption("Stainless", "Stainless"),
            createDropdownOption("HDPE", "HDPE"),
            createDropdownOption("Signwhite", "Signwhite")];

      #materialsWithUsableFactoryEdge = ["ACM", "Aluminium", "Foamed PVC", "Corflute", "HDPE", "Signwhite"];

      #cuttingOptions = {
            "Guillotine": createDropdownOption("Guillotine - Standard Rectangle (ACM, Signwhite)", "Guillotine"),
            "None": createDropdownOption("None - (standard sheet)", "None"),
            "Router": createDropdownOption("Router - Custom Contour (Circular, Rounded Corners, Irregular Shape)", "Router"),
            "Laser": createDropdownOption("Laser - Custom Contour (Circular, Rounded Corners, Irregular Shape)", "Laser"),
            "Hand": createDropdownOption("Cut By Hand - (PVC, Corflute)", "Cut By Hand"),
            "Supplier": createDropdownOption("Cut By Supplier", "Cut By Supplier")
      };
      static guillotineCutsPerType = {
            "Standard Sheet": 0,
            "One Side Sheet Size": 1,
            "Smaller Than Standard Sheet": 2,
            "Bigger Than Standard Sheet": 0
      };
      static guillotineMaxCutWidth = 2500;
      static guillotineMaxRunLength = 20000;
      static guillotinePerCutTime = 5;
      static guillotineMaterialsCanCut = [
            "ACM",
            "Signwhite",
            "Polycarb"
      ];
      static routerMaterialsCanCut = [
            "ACM",
            "Acrylic",
            "Aluminium",
            "Mondoclad",
            "Foamed PVC",
            "Polycarb",
            "HDPE",
            "MDF"
      ];
      static laserMaterialsCanCut = [
            "Acrylic",
            "Aluminium",
            "Foamed PVC",
            "Polycarb",
            "HDPE",
            "Corflute",
            "Stainless",
            "Copper",
            "Brass",
            "MDF",
            "Steel"
      ];
      static handMaterialsCanCut = [
            "ACM",
            "Foamed PVC",
            "Corflute",
            "Polycarb",
            "HDPE"
      ];
      static handPerCutTime = 10;
      static joinMethod = {
            "Full Sheet + Offcut": "Use Full Sheets + End Offcut",
            "Even Joins": "Even Joins"
      };
      #filterOrder = ['Material', 'Sheet Size', 'Thickness', 'Finish'];
      #sheetSizeOptions = [];
      #finishOptions = [];
      #thicknessOptions = [];

      /** @example ['ACM - (sqm)', 'Matte Colours Alucobond', '1000x1000', '3x0.30'] */
      #searchTerms = [];
      #parts = [];

      #currentJoinMethod = "Even Joins";
      get currentJoinMethod() {return this.#currentJoinMethod;}
      #method1;
      #method2;

      #totalNumberGuillotineCuts = 0;
      #totalNumberSupplierCuts = 0;
      #totalRouterPerimeter = 0;
      #totalRouterNumberOfShapes = 0;
      #totalNumberHandCuts = 0;

      /**
       * @Updated on table changes
       * @example
       *          [[4, 2440, 1220, 0, select, 0, 29280],
       *           [4, 2440, 580, 1, select, 4, 24160]
       *           [1, 240, 1220, 1, select, 1, 2920]
       *           [1, 240, 580, 2, select, 2, 1640]]
       */
      #outputSizeTableData = [];

      #supplierCuts;
      #filtersHeader;
      //#filterContainersOrdered = [null, null, null, null];
      #material;
      set material(value) {$(this.#material[1]).val(value).change();}

      #thickness;
      set thickness(value) {$(this.#thickness[1]).val(value).change();}

      #finish;
      set finish(value) {$(this.#finish[1]).val(value).change();}

      #sheetSize;
      set sheetSize(value) {$(this.#sheetSize[1]).val(value).change();}

      #sheetMaterial;
      set sheetMaterial(value) {$(this.#sheetMaterial[1]).val(value).change();}

      #updateOrderBtn;

      /**
             * @Inherited
             * @example
             * [{parent: 'SHEET-1699952073332-95570559', data: []},
             * {parent: 'SHEET-1699952073332-95574529', data: []}]
             */
      //#inheritedData2 = [];
      /**
       * @example [QWHD(), QWHD(),...]
       */
      #inheritedSizes = [];
      #inheritedSizeTable;


      #finalOutputSizesHeader;
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
       * @matrixSizes
       * @Updated on table changes or Join Helper
       * @Results are left to right, then top to bottom
       * @example [
       *                [//inherited size 1
                              [[2440, 1220], [2440, 1220], [2440, 1220], [2440, 1220], [240, 1220]],//row 1
                              [[2440, 1220], [2440, 1220], [2440, 1220], [2440, 1220], [240, 1220]],//row 2
                              [[2440, 110], [2440, 110], [2440, 110], [2440, 110], [240, 110]]//row 3
                        ]
                  ];
       */
      #matrixSizes = [];
      get matrixSizes() {return this.#matrixSizes;}

      #cuttingHeader;
      #cuttingContainer;
      #cuttingJoinNote;
      #visualiser;
      #dataForSubscribers;
      #joinHelperBtn;
      #joinHelperHeader;
      #outputSizeTable;
      #cuttingNote;
      #guillotineProduction;
      #cutByHandProduction;
      #router;
      #finishingHeader;
      #finishingProduction;
      #f_foldSideContainer;

      #isFolded;
      #foldedTop;
      #foldedLeft;
      #foldedBottom;
      #foldedRight;

      #flipSheet = false;
      #flip;

      #hasGrain;
      #grainDirection;

      get backgroundColor() {return COLOUR.Orange;}
      get textColor() {return COLOUR.White;}

      constructor(parentContainer, LHSMenuWindow, type) {
            super(parentContainer, LHSMenuWindow, type);

            /*
            InheritedParentSizeSplits*/
            let f_container_inheritedParentSizeSplits = createDivStyle5(null, "Inherited Parent Size Splits", this.container)[1];
            this.#inheritedSizeTable = new Table(f_container_inheritedParentSizeSplits, "100%", 20, 250);
            this.#inheritedSizeTable.setHeading("Qty", "Width", "Height", "Depth");
            this.#inheritedSizeTable.addRow("-", "-", "-", "-");
            this.#inheritedSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Sheet Size*/
            let f_container_sheetSize = createDivStyle5(null, "Sheet To Use", this.container)[1];

            let sheetFilterContainer = createDivStyle5(null, "Filters", f_container_sheetSize)[1];

            this.#material = createDropdown_Infield("Material", 0, "width:80px", [createDropdownOption("", "")].concat(this.#materialOptions), () => {this.UpdateFilters("Material");}, sheetFilterContainer);
            this.#searchTerms.push(this.#material[1].value + " - (sqm)");

            this.#sheetSize = createDropdown_Infield("Sheet Size", 0, "width:130px;", [], () => {this.UpdateFilters('Sheet Size');}, sheetFilterContainer);
            this.#sheetSize[1].id = "Sheet Size";

            this.#thickness = createDropdown_Infield("Thickness", 0, "width:80px", [], () => {this.UpdateFilters("Thickness");}, sheetFilterContainer);

            this.#finish = createDropdown_Infield("Finish", 0, "width:100px;", [], () => {this.UpdateFilters("Finish");}, sheetFilterContainer);


            this.#sheetMaterial = createDropdown_Infield_Icons_Search("Sheet Material", 0, "width:calc(100% - 10px);", 10, true, this.getSheetDropdownOptions(), () => {this.UpdateFromChange();}, f_container_sheetSize, false);

            /*
            Folded*/
            let f_container_folded = createDivStyle5(null, "Folded", this.container)[1];
            this.#f_foldSideContainer = document.createElement('div');
            let alertDiv;
            this.#isFolded = createCheckbox_Infield("Is Folded", false, "width:calc(50% - 20px);margin:10px;", () => {
                  if(this.#isFolded[1].checked) {
                        setFieldHidden(false, this.#foldedTop[1], this.#foldedTop[0]);
                        setFieldHidden(false, this.#foldedLeft[1], this.#foldedLeft[0]);
                        setFieldHidden(false, this.#foldedRight[1], this.#foldedRight[0]);
                        setFieldHidden(false, this.#foldedBottom[1], this.#foldedBottom[0]);
                        if(this.depth == 0) {
                              $(alertDiv).show();
                        }
                  } else {
                        setFieldHidden(true, this.#foldedTop[1], this.#foldedTop[0]);
                        setFieldHidden(true, this.#foldedLeft[1], this.#foldedLeft[0]);
                        setFieldHidden(true, this.#foldedRight[1], this.#foldedRight[0]);
                        setFieldHidden(true, this.#foldedBottom[1], this.#foldedBottom[0]);
                        $(alertDiv).hide();
                  }
                  this.UpdateFromChange();
            }, this.#f_foldSideContainer);
            alertDiv = createFloatingDiv("Depth is 0, has no effect", "width:120px;padding-left:4px;top:10px;", this.#isFolded[0]);



            this.#foldedTop = createCheckbox_Infield("Top", false, "margin-left: 20%; width:20%;margin-right: 50%; ", () => {this.UpdateFromChange();}, this.#f_foldSideContainer);
            this.#foldedLeft = createCheckbox_Infield("Left", false, "width:20%;margin-right: 20%;", () => {this.UpdateFromChange();}, this.#f_foldSideContainer);
            this.#foldedRight = createCheckbox_Infield("Right", false, " width:20%;margin-right: 30%;", () => {this.UpdateFromChange();}, this.#f_foldSideContainer);
            this.#foldedBottom = createCheckbox_Infield("Bottom", false, "margin-left: 20%;width:20%;", () => {this.UpdateFromChange();}, this.#f_foldSideContainer);
            setFieldHidden(true, this.#foldedTop[1], this.#foldedTop[0]);
            setFieldHidden(true, this.#foldedLeft[1], this.#foldedLeft[0]);
            setFieldHidden(true, this.#foldedRight[1], this.#foldedRight[0]);
            setFieldHidden(true, this.#foldedBottom[1], this.#foldedBottom[0]);
            f_container_folded.appendChild(this.#f_foldSideContainer);
            /*
            Joins*/
            let f_container_joins = createDivStyle5(null, "Joins", this.container)[1];

            this.#joinHelperBtn = createIconButton("https://cdn.gorilladash.com/images/media/6195615/signarama-australia-searching-63ad3d8672602.png", "Visualiser", "width:calc(100% - 20px);margin-right:55%;height:40px;background-color:" + COLOUR.Orange + ";", () => {
                  this.#visualiser = new ModalSheetJoins("Join Helper", 100, () => {
                        this.UpdateFromChange();
                  }, this);

                  this.#visualiser.borrowFields(f_container_sheetSize, this.#flip[0], this.#hasGrain[0], methodContainer, this.#f_foldSideContainer);
                  this.#visualiser.setFlippedField(this.#flip[1]);
                  this.#visualiser.setSheetSizeField(this.#sheetSize[1]);
                  this.#visualiser.setHasGrainField(this.#hasGrain[1]);
                  this.#visualiser.setGrainDirectionField(this.#grainDirection[1]);
                  this.#visualiser.setFoldFields(this.#foldedTop[1], this.#foldedLeft[1], this.#foldedRight[1], this.#foldedBottom[1]);
                  this.#visualiser.setDepth(this.getQWH().depth);
                  this.#visualiser.setIsFoldedField(this.#isFolded[1]);
                  this.#visualiser.width = this.getQWH().width;
                  this.#visualiser.height = this.getQWH().height;
                  this.#visualiser.setSizeArrays(this.#matrixSizes);
            }, f_container_joins, true);

            let methodContainer = createDivStyle4("width:calc(50% - 20px);", f_container_joins);
            let useMethod1 = (this.currentJoinMethod == "Use Full Sheets + End Offcut");
            let methodText = createText("Join Method", null, methodContainer);
            this.#method1 = createCheckbox_Infield("Even Joins", !useMethod1, "min-width:250px", () => {this.UpdateJoinMethod(); this.UpdateFromChange();}, methodContainer, false);
            this.#method2 = createCheckbox_Infield("Use Full Sheets + End Offcut", useMethod1, "min-width:250px", () => {this.UpdateJoinMethod(); this.UpdateFromChange();}, methodContainer, false);

            checkboxesAddToSelectionGroup(true, this.#method1, this.#method2);

            let flipDiagram;
            this.#flip = createCheckbox_Infield("Flip", this.#flipSheet, "width:calc(50% - 20px);margin:10px;", () => {
                  this.#flipSheet = this.#flip[1].checked;
                  if(this.#flipSheet) {
                        flipDiagram.style.marginTop = "0px";
                        flipDiagram.style.height = "30px";
                        flipDiagram.style.width = "10px";
                  } else {
                        flipDiagram.style.marginTop = "10px";
                        flipDiagram.style.height = "10px";
                        flipDiagram.style.width = "30px";
                  }
                  this.UpdateFromChange();
            }, f_container_joins, true);
            flipDiagram = createDiv("background-color:yellow;width:30px;height:10px;margin-top:10px;", null, this.#flip[0]);

            this.#hasGrain = createCheckbox_Infield("Has Grain", false, "width:calc(50% - 20px);margin:10px;", () => {
                  setFieldHidden(!this.#hasGrain[1].checked, this.#grainDirection[1], this.#grainDirection[0]);

                  this.UpdateFromChange();
            }, f_container_joins, true);

            this.#grainDirection = createDropdown_Infield("Grain Direction", 0, "width:calc(50% - 20px);", [createDropdownOption("With Long Side", "With Long Side"), createDropdownOption("With Short Side", "With Short Side")], () => { }, f_container_joins);
            setFieldDisabled(true, this.#grainDirection[1], this.#grainDirection[0]);
            setFieldHidden(true, this.#grainDirection[1], this.#grainDirection[0]);

            /*
            FinalOutputSizes*/
            let f_container_finalOutputSizes = createDivStyle5(null, "Final Output Sizes", this.container)[1];
            this.#outputSizeTable = new Table(f_container_finalOutputSizes, "100%", 20, 250);
            this.#outputSizeTable.setHeading("Qty", "Width", "Height", "Cuts Each", "Machine Type", "Cuts Total", "Total Router Perimeter");
            this.#outputSizeTable.addRow("-", "-", "-", "-", "-", "-", "-", "-");
            this.#outputSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Cutting*/
            let f_container_cutting = createDivStyle5(null, "Cutting", this.container)[1];
            this.#cuttingJoinNote = createLabel("Note: Some sizes bigger than sheet size. Increase sheet size or use helper to establish joins", "width:95%;font-weight:bold;display:none;color:red;padding-bottom:5px;", f_container_cutting);

            //Guillotine
            this.#guillotineProduction = new Production(f_container_cutting, null, function() { }, null);
            this.#guillotineProduction.showContainerDiv = true;
            this.#guillotineProduction.headerName = "Guillotine";
            this.#guillotineProduction.productionTime = Sheet.guillotinePerCutTime;
            this.#guillotineProduction.required = true;
            this.#guillotineProduction.showRequiredCkb = true;
            this.#guillotineProduction.requiredName = "Required";
            this.#guillotineProduction.SubscribeTo(this);

            //Router
            this.#router = new Router(f_container_cutting, null, null, null);
            this.#router.showContainer = false;
            this.#router.SubscribeTo(this);

            //Supplier
            this.#supplierCuts = new Supplier(f_container_cutting, null, () => { });
            this.#supplierCuts.SubscribeTo(this);

            //HandCutting
            this.#cutByHandProduction = new Production(f_container_cutting, null, function() { }, null);
            this.#cutByHandProduction.showContainerDiv = true;
            this.#cutByHandProduction.headerName = "Hand Cutting";
            this.#cutByHandProduction.productionTime = Sheet.handPerCutTime;
            this.#cutByHandProduction.required = true;
            this.#cutByHandProduction.showRequiredCkb = true;
            this.#cutByHandProduction.requiredName = "Required";
            this.#cutByHandProduction.SubscribeTo(this);

            /*
            Updates*/
            this.UpdateFilters();
            this.sheetSize = "2440mm x 1220mm";
            this.thickness = "3x0.21";
            this.finish = "Primer";

            this.UpdateDataForSubscribers();
      }

      /*
      Override*/
      UpdateFromChange() {
            super.UpdateFromChange();

            this.UpdateGrainDirection();
            this.UpdateInheritedTable();
            this.UpdateOutputSizes();
            this.UpdateVisualizer();
            this.UpdateDataForSubscribers();
            this.UpdateTableTotals();
            this.UpdateSubscribedLabel();
            this.PushToSubscribers();
      }

      UpdateVisualizer() {
            if(this.#visualiser) {
                  this.#visualiser.setSizeArrays(this.#matrixSizes);
                  this.#visualiser.updateFromFields();
            }
      }

      UpdateJoinMethod() {
            if(this.#method1[1].checked) this.#currentJoinMethod = Sheet.joinMethod["Even Joins"];
            else this.#currentJoinMethod = Sheet.joinMethod["Full Sheet + Offcut"];
      }

      UpdateGrainDirection() {
            let hasGrain = false;
            let grainDirection = "";
            //var name = this.#material[1].value + " - (sqm) - " + this.#finish[1].value + " " + this.#sheetSize[1].value.replaceAll("mm", "").replaceAll(" ", "") + "x" + this.#thickness[1].value;
            //var partFullName = getPredefinedParts_Name_FromLimitedName(name);
            var partFullName = this.#sheetMaterial[1].value;
            var part = getPredefinedParts(partFullName)[0];

            if(part) {
                  console.log(part);
                  if(part.Color) {
                        console.log(part.Color);
                        if(part.Color.includes("{")) {
                              let colourString = JSON.parse(part.Color.substring(1, part.Color.length - 1));
                              console.log(colourString.grainDirection);
                              if(colourString.grainDirection) {
                                    hasGrain = true;
                                    grainDirection = colourString.grainDirection;
                              }
                        }
                  }

            }

            if(hasGrain) {
                  setCheckboxChecked(true, this.#hasGrain[1]);
                  dropdownSetSelectedValue(this.#grainDirection[1], grainDirection);
            } else {
                  setCheckboxChecked(false, this.#hasGrain[1]);
            }
      }

      UpdateDataForSubscribers() {
            this.DATA_FOR_SUBSCRIBERS = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
      }

      UpdateInheritedTable = () => {
            this.#inheritedSizes = [];
            this.#inheritedSizeTable.deleteAllRows();

            //Per Parent Subscription:
            for(let a = 0; a < this.INHERITED_DATA.length; a++) {
                  let recievedInputSizes = this.INHERITED_DATA[a].data;
                  for(let i = 0; i < recievedInputSizes.length; i++) {
                        this.#inheritedSizes.push(recievedInputSizes[i].QWHD);
                        console.log(recievedInputSizes[i]);
                        this.#inheritedSizeTable.addRow(recievedInputSizes[i].QWHD.qty, recievedInputSizes[i].QWHD.width, recievedInputSizes[i].QWHD.height, recievedInputSizes[i].QWHD.depth);
                  }
            }

            if(this.INHERITED_DATA.length == 0) {
                  this.#inheritedSizes.push(new QWHD(this.qty, this.width, this.height, this.depth));
                  this.#inheritedSizeTable.addRow(this.qty, this.width, this.height, this.depth);
            }
      };

      /**
       * @Cutting
       */

      UpdateOutputSizes = () => {
            this.#outputSizeTable.deleteAllRows();
            this.#outputSizeTableData = [];

            this.#dataForSubscribers = [];

            this.#matrixSizes = [];

            this.#totalNumberGuillotineCuts = 0;
            this.#totalNumberSupplierCuts = 0;
            this.#totalRouterPerimeter = 0;
            this.#totalRouterNumberOfShapes = 0;

            let [sheetSizeWidth, sheetSizeHeight] = this.getSheetSizeWH();

            for(let i = 0; i < this.#inheritedSizes.length; i++) {

                  let suggestedCutQty = 0;
                  setFieldHidden(true, this.#cuttingJoinNote);
                  this.setAllCuttingTypeDisabled(false);
                  let perimeter = 0;
                  let cutsEach = 0;
                  let currentMaterial = this.#material[1].value;

                  let rowQty = this.#inheritedSizes[i].qty;
                  let rowWidth = this.#inheritedSizes[i].width;
                  let rowHeight = this.#inheritedSizes[i].height;

                  if(this.#isFolded[1].checked) {
                        if(this.#foldedTop[1].checked)
                              rowHeight += this.#inheritedSizes[i].depth;
                        if(this.#foldedLeft[1].checked)
                              rowWidth += this.#inheritedSizes[i].depth;
                        if(this.#foldedRight[1].checked)
                              rowWidth += this.#inheritedSizes[i].depth;
                        if(this.#foldedBottom[1].checked)
                              rowHeight += this.#inheritedSizes[i].depth;
                  }

                  perimeter += rowQty * mmToM(rowWidth) * mmToM(rowHeight);
                  cutsEach = Sheet.getNumberOfGuillotineCuts(rowWidth, rowHeight, sheetSizeWidth, sheetSizeHeight);
                  suggestedCutQty += rowQty * cutsEach;

                  let uniqueSizes = Sheet.cutResultsByMethodWithOccurenceCount(this.currentJoinMethod, rowWidth, rowHeight, sheetSizeWidth, sheetSizeHeight, this.#flipSheet);

                  this.#matrixSizes.push(Sheet.getMatrixSizes(this.currentJoinMethod, rowWidth, rowHeight, sheetSizeWidth, sheetSizeHeight, this.#flipSheet));

                  for(let u = 0; u < uniqueSizes.length; u++) {
                        let w = uniqueSizes[u].width;
                        let h = uniqueSizes[u].height;
                        let q = uniqueSizes[u].qty;
                        let qty = q * this.qty;

                        let cutsEach = Sheet.getNumberOfGuillotineCuts(w, h, sheetSizeWidth, sheetSizeHeight);
                        let cutsTotal = cutsEach * qty;

                        let totalPerimeter = roundNumber((w * 2 + h * 2) * qty, 2);
                        let options = this.createCuttingOptions(w, h, sheetSizeWidth, sheetSizeHeight, currentMaterial);

                        let cuttingTypeDropDown = createDropdown_Infield("Panel Cutting Type", 0, ";width:-webkit-fill-available;", options, () => {
                              this.UpdateTableTotals();
                        }, null);

                        this.#dataForSubscribers.push({QWHD: new QWHD(qty, w, h), matrixSizes: this.#matrixSizes});

                        this.#outputSizeTable.addRow(qty, roundNumber(w, 2), roundNumber(h, 2), cutsEach, cuttingTypeDropDown[0], cutsTotal, totalPerimeter);
                        this.#outputSizeTableData.push([qty, roundNumber(w, 2), roundNumber(h, 2), cutsEach, cuttingTypeDropDown[1], cutsTotal, totalPerimeter]);
                        dropdownSetSelectedIndexToNextAvailable(cuttingTypeDropDown[1], yes);
                  }
            }
      };

      UpdateTableTotals() {
            this.#totalNumberGuillotineCuts = 0;
            this.#totalNumberHandCuts = 0;
            this.#totalNumberSupplierCuts = 0;
            this.#totalRouterPerimeter = 0;
            this.#totalRouterNumberOfShapes = 0;

            for(let i = 0; i < this.#outputSizeTableData.length; i++) {
                  this.#outputSizeTable.getCell(i + 1, 6).style.backgroundColor = "white";
                  this.#outputSizeTable.getCell(i + 1, 7).style.backgroundColor = "white";
                  switch(this.#outputSizeTableData[i][4].value) {
                        case "Router":
                              this.#totalRouterPerimeter += this.#outputSizeTableData[i][6];
                              this.#totalRouterNumberOfShapes += this.#outputSizeTableData[i][0];
                              this.#outputSizeTable.getCell(i + 1, 7).style.backgroundColor = COLOUR.LightBlue;
                              break;
                        case "Guillotine":
                              this.#totalNumberGuillotineCuts += this.#outputSizeTableData[i][5];
                              this.#outputSizeTable.getCell(i + 1, 6).style.backgroundColor = COLOUR.LightBlue;
                              break;
                        case "None":
                              break;
                        case "Cut By Hand":
                              this.#totalNumberHandCuts += this.#outputSizeTableData[i][5];
                              this.#outputSizeTable.getCell(i + 1, 6).style.backgroundColor = COLOUR.LightBlue;
                              break;
                        case "Cut By Supplier":
                              this.#totalNumberSupplierCuts += this.#outputSizeTableData[i][5];
                              this.#outputSizeTable.getCell(i + 1, 6).style.backgroundColor = COLOUR.LightBlue;
                              break;
                        default:
                              break;
                  }
            }

            this.#guillotineProduction.qty = this.#totalNumberGuillotineCuts;
            if(this.#totalNumberGuillotineCuts === 0) {
                  this.#guillotineProduction.required = false;
                  this.#guillotineProduction.Minimize();
            } else {
                  this.#guillotineProduction.required = true;
                  this.#guillotineProduction.Maximize();
            }

            if(this.#totalRouterPerimeter + this.#totalRouterNumberOfShapes === 0) {
                  this.#router.required = false;
                  this.#router.Minimize();
            } else {
                  this.#router.required = true;
                  this.#router.Maximize();
            }
            this.#router.deleteAllRunRows();
            this.#router.addRunRow(this.#totalRouterPerimeter, this.#totalRouterNumberOfShapes);
            if(this.#isFolded[1].checked) {
                  let totalPerimeter = 0;
                  let numberShapes = 0;
                  let foldedTop = this.#foldedTop[1].checked;
                  let foldedLeft = this.#foldedLeft[1].checked;
                  let foldedRight = this.#foldedRight[1].checked;
                  let foldedBottom = this.#foldedBottom[1].checked;
                  if(foldedTop) {
                        totalPerimeter += this.width;
                  } if(foldedLeft) {
                        totalPerimeter += this.height;
                  } if(foldedRight) {
                        totalPerimeter += this.height;
                  } if(foldedBottom) {
                        totalPerimeter += this.width;
                  }

                  for(let i = 0; i < this.matrixSizes.length; i++) {
                        let numberRows = this.matrixSizes[i].length; console.log(numberRows);
                        let numberColumns = this.matrixSizes[i][0].length; console.log(numberColumns);
                        numberShapes += foldedTop ? numberColumns : 0;
                        numberShapes += foldedLeft ? numberRows : 0;
                        numberShapes += foldedRight ? numberRows : 0;
                        numberShapes += foldedBottom ? numberColumns : 0;
                  }

                  this.#router.addRunRow(totalPerimeter, numberShapes, {material: "ACM", profile: "Groove", quality: "Good Quality", speed: null});
            }
            if(this.#totalRouterNumberOfShapes > 1) {
                  this.#router.setupMultiple = true;
                  this.#router.setupNumberOfSheets = this.#totalRouterNumberOfShapes;
                  this.#router.setupPerSheet = 10;

                  this.#router.cleanMultiple = true;
                  this.#router.cleanNumberOfSheets = this.#totalRouterNumberOfShapes;
                  this.#router.cleanPerSheet = 10;
            } else {
                  this.#router.setupOnceOff = true;
                  this.#router.setupTime = 10;

                  this.#router.cleanOnceOff = true;
                  this.#router.cleanTime = 10;
            }

            if(this.#totalNumberSupplierCuts === 0) {
                  this.#supplierCuts.required = false;
                  this.#supplierCuts.Minimize();
            } else {
                  this.#supplierCuts.required = true;
                  this.#supplierCuts.Maximize();
            }

            this.#cutByHandProduction.qty = this.#totalNumberHandCuts;
            if(this.#totalNumberHandCuts === 0) {
                  this.#cutByHandProduction.required = false;
                  this.#cutByHandProduction.Minimize();
            } else {
                  this.#cutByHandProduction.required = true;
                  this.#cutByHandProduction.Maximize();
            }

      }

      setAllCuttingTypeDisabled = (disabledTF) => {
            for(let c = 0; c < Object.keys(this.#cuttingOptions).length; c++) {
                  setFieldDisabled(disabledTF, this.#cuttingOptions[Object.keys(this.#cuttingOptions)[c]], this.#cuttingOptions[Object.keys(this.#cuttingOptions)[c]]);
            }
      };

      createCuttingOptions = (width, height, sheetWidth, sheetHeight, material) => {
            let returnArray = [];
            let sheetIsFolded = this.#isFolded[1].checked && this.depth > 0;
            let isStandardSheet = Sheet.getCutVsSheetType(width, height, sheetWidth, sheetHeight) == "Standard Sheet" && !sheetIsFolded;
            let canUseFactoryEdge = this.#materialsWithUsableFactoryEdge.includes(material);
            let canGuillotineSheet = Sheet.canGuillotineSheet(width, height, sheetWidth, sheetHeight, material) && !sheetIsFolded;
            let canRouterSheet = Sheet.canRouterSheet(width, height, sheetWidth, sheetHeight, material);
            let canLaserSheet = Sheet.canLaserSheet(width, height, sheetWidth, sheetHeight, material);
            let canHandCutSheet = Sheet.canHandCutSheet(width, height, sheetWidth, sheetHeight, material) && !sheetIsFolded;
            if(width === null && height === null && sheetWidth === null && sheetHeight === null) {
                  returnArray = [
                        createDropdownOption("None - (standard sheet)", "None"),
                        createDropdownOption("Guillotine - Standard Rectangle (ACM, Signwhite)", "Guillotine"),
                        createDropdownOption("Router - Custom Contour (Circular, Rounded Corners, Irregular Shape)", "Router"),
                        createDropdownOption("Laser - Custom Contour (Circular, Rounded Corners, Irregular Shape)", "Laser"),
                        createDropdownOption("Cut By Hand - (PVC, Corflute)", "Cut By Hand"),
                        createDropdownOption("Cut By Supplier", "Cut By Supplier")
                  ];
            } else {
                  returnArray = [
                        setFieldDisabled(!isStandardSheet || !canUseFactoryEdge, createDropdownOption("None - (standard sheet)", "None")),
                        setFieldDisabled(!canGuillotineSheet, createDropdownOption("Guillotine - Standard Rectangle (ACM, Signwhite)", "Guillotine")),
                        setFieldDisabled(!canRouterSheet, createDropdownOption("Router - Custom Contour (Circular, Rounded Corners, Irregular Shape)", "Router")),
                        setFieldDisabled(!canLaserSheet, createDropdownOption("Laser - Custom Contour (Circular, Rounded Corners, Irregular Shape)", "Laser")),
                        setFieldDisabled(!canHandCutSheet, createDropdownOption("Cut By Hand - (PVC, Corflute)", "Cut By Hand")),
                        createDropdownOption("Cut By Supplier", "Cut By Supplier")
                  ];
            }
            return returnArray;
      };

      static getCutVsSheetType = (width, height, sheetWidth, sheetHeight) => {
            let [w, h] = convertDimensionsToLandscape(width, height);
            let [sw, sh] = convertDimensionsToLandscape(sheetWidth, sheetHeight);

            if(w == sw && h == sh) return "Standard Sheet";
            if(w > sw || h > sh) return "Bigger Than Standard Sheet";
            if(w == sw || h == sh || w == sh || h == sw) return "One Side Sheet Size";

            return "Smaller Than Standard Sheet";
      };

      /**
       * @returns array [[w,h], [w,h]...]
       */
      static cutResultsByMethod(method, width, height, sheetWidth, sheetHeight, flipSheet = false) {
            let returnArray = [];

            if(flipSheet) {
                  let tempW = sheetWidth, tempH = sheetHeight;
                  sheetWidth = tempH;
                  sheetHeight = tempW;
            }

            if(method == Sheet.joinMethod["Full Sheet + Offcut"]) {
                  let numbersheetsW, numbersheetsH, eachSheetWidth, eachSheetHeight;

                  numbersheetsW = Math.ceil(width / sheetWidth);
                  numbersheetsH = Math.ceil(height / sheetHeight);

                  for(let w = 0; w < numbersheetsW; w++) {
                        if(w == numbersheetsW - 1) {
                              eachSheetWidth = width - (sheetWidth * (w));
                        } else {
                              eachSheetWidth = sheetWidth;
                        }

                        for(let h = 0; h < numbersheetsH; h++) {
                              if(h == numbersheetsH - 1) {
                                    eachSheetHeight = height - (sheetHeight * (h));
                              } else {
                                    eachSheetHeight = sheetHeight;
                              }
                              returnArray.push([eachSheetWidth, eachSheetHeight]);
                        }
                  }
            }

            if(method == Sheet.joinMethod["Even Joins"]) {
                  let numbersheetsW, numbersheetsH, eachSheetWidth, eachSheetHeight;

                  numbersheetsW = Math.ceil(width / sheetWidth);
                  numbersheetsH = Math.ceil(height / sheetHeight);
                  eachSheetWidth = width / numbersheetsW;
                  eachSheetHeight = height / numbersheetsH;

                  for(let w = 0; w < numbersheetsW; w++) {
                        for(let h = 0; h < numbersheetsH; h++) {
                              returnArray.push([eachSheetWidth, eachSheetHeight]);
                        }
                  }
            }

            return returnArray;
      }


      /** 
       * @Returns matrix array of sheets
       * @Results are left to right, then top to bottom
       * @example [
                  [[2440, 1220], [2440, 1220], [2440, 1220], [2440, 1220], [240, 1220]],//row 1
                  [[2440, 1220], [2440, 1220], [2440, 1220], [2440, 1220], [240, 1220]],//row 2
                  [[2440, 110], [2440, 110], [2440, 110], [2440, 110], [240, 110]]//row 3
                  ];
      */
      static getMatrixSizes(method, width, height, sheetWidth, sheetHeight, flipSheet = false) {
            let matrixSizes = [];

            let returnArray = Sheet.cutResultsByMethod(method, width, height, sheetWidth, sheetHeight, flipSheet);

            if(flipSheet) {
                  let tempW = sheetWidth, tempH = sheetHeight;
                  sheetWidth = tempH;
                  sheetHeight = tempW;
            }

            let numbersheetsW = Math.ceil(width / sheetWidth);
            let numbersheetsH = Math.ceil(height / sheetHeight);

            /** @MatrixSizes */
            for(let y = 0; y < numbersheetsH; y++) {
                  matrixSizes.push([]);
                  for(let x = 0; x < numbersheetsW * numbersheetsH; x++) {
                        if(x % numbersheetsH == y) {
                              matrixSizes[y].push(returnArray[x]);
                        }
                  }

            }

            return matrixSizes;
      }

      /**
       * @returns [] i.e. [QWHD(), QWHD(), ...]
       */
      static cutResultsByMethodWithOccurenceCount(method, width, height, sheetWidth, sheetHeight, flipSheet) {
            return uniqueSizeArrayWithOccurenceCount(Sheet.cutResultsByMethod(method, width, height, sheetWidth, sheetHeight, flipSheet));
      }

      /**
       * @Guillotine
       */

      static canGuillotineSheet = (cutWidth, cutHeight, sheetWidth, sheetHeight, material) => {
            let [w, h] = convertDimensionsToLandscape(cutWidth, cutHeight);
            let [sw, sh] = convertDimensionsToLandscape(sheetWidth, sheetHeight);

            if(!Sheet.guillotineMaterialsCanCut.includes(material)) {
                  return false;
            }

            if(sw > Sheet.guillotineMaxRunLength ||
                  sh > Sheet.guillotineMaxRunLength ||
                  w > Sheet.guillotineMaxRunLength ||
                  h > Sheet.guillotineMaxRunLength) return false;
            if(sw > Sheet.guillotineMaxCutWidth && sh > Sheet.guillotineMaxCutWidth) return false;
            if(w > Sheet.guillotineMaxCutWidth && h > Sheet.guillotineMaxCutWidth) return false;
            if(w > Sheet.guillotineMaxCutWidth && h != sh) return false;
            return true;
      };

      static getNumberOfGuillotineCuts = (width, height, sheetWidth, sheetHeight) => {
            return Sheet.guillotineCutsPerType[Sheet.getCutVsSheetType(width, height, sheetWidth, sheetHeight)];
      };

      /**
       * @Router
       */
      static canRouterSheet = (cutWidth, cutHeight, sheetWidth, sheetHeight, material) => {
            console.log(cutWidth, cutHeight, sheetWidth, sheetHeight, material);
            if(!Sheet.routerMaterialsCanCut.includes(material)) {
                  return false;
            }
            let [maxCutW, maxCutH] = convertDimensionsToLandscape(Router.maxCutSize.width, Router.maxCutSize.height);
            let [sw, sh] = convertDimensionsToLandscape(sheetWidth, sheetHeight);
            let [w, h] = convertDimensionsToLandscape(cutWidth, cutHeight);

            if(sw > maxCutW || sh > maxCutH || w > maxCutW || h > maxCutH) return false;
            return true;
      };

      /**
       * @Laser
       */
      static canLaserSheet = (cutWidth, cutHeight, sheetWidth, sheetHeight, material) => {
            console.log(cutWidth, cutHeight, sheetWidth, sheetHeight, material);
            if(!Sheet.laserMaterialsCanCut.includes(material)) {
                  return false;
            }
            let [maxCutW, maxCutH] = convertDimensionsToLandscape(Laser.maxCutSize.width, Laser.maxCutSize.height);
            let [sw, sh] = convertDimensionsToLandscape(sheetWidth, sheetHeight);
            let [w, h] = convertDimensionsToLandscape(cutWidth, cutHeight);

            if(sw > maxCutW || sh > maxCutH || w > maxCutW || h > maxCutH) return false;
            return true;
      };

      /**
       * @HandCutting
       */
      static canHandCutSheet = (cutWidth, cutHeight, sheetWidth, sheetHeight, material) => {
            if(!Sheet.handMaterialsCanCut.includes(material)) {
                  return false;
            }
            return true;
      };

      /**
       * @Sheets
       */
      getSheetSizeWH() {
            var arr = getPredefinedParts(this.#sheetMaterial[1].value)[0].ParentSize.replaceAll("mm", "").replaceAll(" ", "").split("x");
            return [zeroIfNaNNullBlank(parseFloat(arr[0])), zeroIfNaNNullBlank(parseFloat(arr[1]))];
      }

      sheetSizeWidth() {
            return this.getSheetSizeWH()[0];
      }

      sheetSizeHeight() {
            return this.getSheetSizeWH()[1];
      }

      getSheetDropdownOptions() {
            let materialsToUse = [];
            this.#materialOptions.forEach((item) => {
                  materialsToUse.push(item.value);
            });

            let optionsArray = [];
            for(let i = 0; i < materialsToUse.length; i++) {
                  let foundParts = getPredefinedParts_RefinedSearch(materialsToUse[i] + " - ");
                  //Color,Finish,Id,IncomeAccountId,JoinedPartCategoryNames,MaterialType,Name,ParentSize,
                  //ParentSizeNumber,PartCategoryIds,PartGroupId,PartGroupName,PartIsRollMaterial,PricingTemplateId
                  //PricingTemplateIdMaterialType,SearchEncodedPartCategoryIds,SearchEncodedPartGroupId,Thickness,Weight

                  for(let j = 0; j < foundParts.length; j++) {
                        let itemIsStocked = foundParts[j].Weight.includes("Stocked:true");
                        optionsArray.push([foundParts[j].Name, itemIsStocked ? "blue" : "white"]);
                  }
                  console.log(foundParts);
            }

            return optionsArray;
      }

      getSheetSizeOptions() {
            let optionsArray = new TArray();
            optionsArray.push("");

            let selectedMaterial = this.#material[1].value;

            let foundParts = getPredefinedParts_RefinedSearch(selectedMaterial + " - ");

            for(let i = 0; i < foundParts.length; i++) {
                  var arr = foundParts[i].ParentSize.replaceAll("mm", "").replaceAll(" ", "").split("x");
                  let wh = "" + zeroIfNaNNullBlank(parseFloat(arr[0])) + "x" + zeroIfNaNNullBlank(parseFloat(arr[1]));

                  optionsArray.push(wh);
            }

            return optionsArray.uniqueArrayElements().sort();
      }

      getThicknessOptions() {
            let optionsArray = new TArray();
            optionsArray.push("");

            let selectedMaterial = this.#material[1].value;
            let selectedSize = this.#sheetSize[1].value;

            let foundParts = getPredefinedParts_RefinedSearch(selectedMaterial + " - (sqm) - " + selectedSize);

            for(let i = 0; i < foundParts.length; i++) {
                  optionsArray.push(foundParts[i].Thickness);
            }

            return optionsArray.uniqueArrayElements().sort();
      }

      getFinishOptions() {
            let optionsArray = new TArray();
            optionsArray.push("");

            let selectedMaterial = this.#material[1].value;
            let selectedSize = this.#sheetSize[1].value;
            let selectedThickness = this.#thickness[1].value;

            let foundParts = getPredefinedParts_RefinedSearch(selectedMaterial + " - (sqm) - " + selectedSize + "x" + selectedThickness);

            for(let i = 0; i < foundParts.length; i++) {
                  optionsArray.push(foundParts[i].Finish);
            }

            return optionsArray.uniqueArrayElements().sort();
      }

      UpdateFilters(updateFromFilter) {
            if(updateFromFilter == "Material") {
                  this.setSheetSizeOptions(...this.getSheetSizeOptions());
                  this.setThicknessOptions(...this.getThicknessOptions());
            }
            if(updateFromFilter == "Sheet Size") {
                  this.setThicknessOptions(...this.getThicknessOptions());
            }
            if(updateFromFilter == "Thickness") {
                  this.setFinishOptions(...this.getFinishOptions());
            }


            $(this.#sheetMaterial[4]).val(
                  this.#material[1].value + " " +
                  this.#sheetSize[1].value + " " +
                  this.#thickness[1].value + " " +
                  this.#finish[1].value).change();

            this.#sheetMaterial[5]();
            //$(this.#sheetMaterial[1]).change();
            /**this.#filterContainersOrdered[0] = this.#material[0];

            for(let i = this.#filterOrder.length - 1; i >= 0; i--) {
                  var firstNode = this.#material[0];
                  var nodeToMove;
                  if(this.#filterOrder[i] == 'Sheet Size') nodeToMove = this.#sheetSize[0];
                  if(this.#filterOrder[i] == 'Thickness') nodeToMove = this.#thickness[0];
                  if(this.#filterOrder[i] == 'Finish') nodeToMove = this.#finish[0];

                  nodeToMove.parentNode.insertBefore(nodeToMove, firstNode.nextSibling);
            }

            let c = 1;
            switch(updateFromFilter) {
                  case 'Material':
                        c = 1;
                        break;
                  case 'Thickness':
                        c = this.#filterOrder.indexOf("Thickness") + 1;
                        break;
                  case 'Finish':
                        c = this.#filterOrder.indexOf("Finish") + 1;
                        break;
                  case 'Sheet Size':
                        c = this.#filterOrder.indexOf("Sheet Size") + 1;
                        break;
                  default:
                        c = 1;
                        break;
            }

            this.#searchTerms[0] = this.#material[1].value + " - (sqm)";
            this.#searchTerms = this.#searchTerms.slice(0, c);
            this.#parts = getPredefinedParts_RefinedSearch(this.#searchTerms[0], null, null);

            for(let i = c; i < this.#filterOrder.length; i++) {
                  if(i == 1) {
                        if(this.#filterOrder[i] == 'Sheet Size') {
                              this.#parts = getPredefinedParts_RefinedSearch(this.#searchTerms[0], null, null);
                              let arr = [];
                              for(let j = 0; j < this.#parts.length; j++) {
                                    let sheetSize = this.#parts[j].ParentSize.replace(/<[^>]+>/g, "");
                                    if(!arr.includes(sheetSize)) arr.push(sheetSize);

                              }
                              this.setSheetSizeOptions(...arr);
                              this.#searchTerms.push(this.#sheetSize[1].value.replaceAll("mm", "").replaceAll(" ", ""));
                              this.#filterContainersOrdered[i] = this.#sheetSize[0];
                        }
                        if(this.#filterOrder[i] == 'Thickness') {
                              this.#parts = getPredefinedParts_RefinedSearch(this.#searchTerms[0], null, null);
                              let arr = [];
                              for(let j = 0; j < this.#parts.length; j++) {
                                    let thickness = this.#parts[j].Thickness;
                                    if(!arr.includes(thickness)) arr.push(thickness);

                              }
                              this.setThicknessOptions(...arr);
                              this.#searchTerms.push(this.#thickness[1].value.replaceAll("mm", "").replaceAll(" ", ""));
                              this.#filterContainersOrdered[i] = this.#thickness[0];
                        }
                        if(this.#filterOrder[i] == 'Finish') {
                              this.#parts = getPredefinedParts_RefinedSearch(this.#searchTerms[0], null, null);
                              let arr = [];
                              for(let j = 0; j < this.#parts.length; j++) {
                                    let finish = this.#parts[j].Finish;
                                    if(!arr.includes(finish)) arr.push(finish);
                              }
                              this.setFinishOptions(...arr);
                              this.#searchTerms.push(this.#finish[1].value);
                              this.#filterContainersOrdered[i] = this.#finish[0];
                        }
                  } else {
                        var tempThis = this;
                        if(this.#filterOrder[i - 1] == 'Sheet Size') {
                              this.#searchTerms[i - 1] = this.#sheetSize[1].value.replaceAll("mm", "").replaceAll(" ", "");
                        }
                        if(this.#filterOrder[i - 1] == 'Thickness') {
                              this.#searchTerms[i - 1] = this.#thickness[1].value.replaceAll("mm", "").replaceAll(" ", "");
                        }
                        if(this.#filterOrder[i - 1] == 'Finish') {
                              this.#searchTerms[i - 1] = this.#finish[1].value;
                        }


                        if(this.#filterOrder[i] == 'Sheet Size') {
                              var innerPart = $.grep(this.#parts, function(obj) {
                                    var containsAll = true;
                                    for(let x = 0; x < tempThis.#searchTerms.length; x++) {
                                          if(!obj.Name.includes(tempThis.#searchTerms[x])) containsAll = false;
                                    }
                                    return containsAll;
                              });
                              let arr = [];
                              for(let j = 0; j < innerPart.length; j++) {
                                    let sheetSize = innerPart[j].ParentSize.replace(/<[^>]+>/g, "");
                                    if(!arr.includes(sheetSize)) arr.push(sheetSize);

                              }
                              this.setSheetSizeOptions(...arr);
                              this.#searchTerms.push(this.#sheetSize[1].value.replaceAll("mm", "").replaceAll(" ", ""));
                              this.#filterContainersOrdered[i] = this.#sheetSize[0];
                        }
                        if(this.#filterOrder[i] == 'Thickness') {
                              var innerPart = $.grep(this.#parts, function(obj) {
                                    var containsAll = true;
                                    for(let x = 0; x < tempThis.#searchTerms.length; x++) {
                                          if(!obj.Name.includes(tempThis.#searchTerms[x])) containsAll = false;
                                    }
                                    return containsAll;
                              });
                              let arr = [];
                              for(let j = 0; j < innerPart.length; j++) {
                                    let thickness = innerPart[j].Thickness;
                                    if(!arr.includes(thickness)) arr.push(thickness);

                              }
                              this.setThicknessOptions(...arr);
                              this.#searchTerms.push(this.#thickness[1].value.replaceAll("mm", "").replaceAll(" ", ""));
                              this.#filterContainersOrdered[i] = this.#thickness[0];
                        }
                        if(this.#filterOrder[i] == 'Finish') {
                              var innerPart = $.grep(this.#parts, function(obj) {
                                    var containsAll = true;
                                    for(let x = 0; x < tempThis.#searchTerms.length; x++) {
                                          if(!obj.Name.includes(tempThis.#searchTerms[x])) containsAll = false;
                                    }
                                    return containsAll;
                              });
                              let arr = [];
                              for(let j = 0; j < innerPart.length; j++) {
                                    let finish = innerPart[j].Finish;
                                    if(!arr.includes(finish)) arr.push(finish);
                              }
                              this.setFinishOptions(...arr);
                              this.#searchTerms.push(this.#finish[1].value);
                              this.#filterContainersOrdered[i] = this.#finish[0];
                        }
                  }
            }
            this.UpdateFromChange();*/
      }

      setSheetSizeOptions(...options) {
            this.#sheetSizeOptions = [];

            for(let x = 0; x < options.length; x++) {
                  this.#sheetSizeOptions[x] = createDropdownOption(options[x], options[x]);
            }

            while(this.#sheetSize[1].firstChild) {
                  this.#sheetSize[1].removeChild(this.#sheetSize[1].firstChild);
            }

            for(var l = 0; l < options.length; l++) {
                  this.#sheetSize[1].add(this.#sheetSizeOptions[l]);
            }
      }

      setThicknessOptions(...options) {
            this.#thicknessOptions = [];

            for(let x = 0; x < options.length; x++) {
                  this.#thicknessOptions[x] = createDropdownOption(options[x], options[x]);
            }

            while(this.#thickness[1].firstChild) {
                  this.#thickness[1].removeChild(this.#thickness[1].firstChild);
            }

            for(var l = 0; l < options.length; l++) {
                  this.#thickness[1].add(this.#thicknessOptions[l]);
            }
      }

      setFinishOptions(...options) {
            /**this.#finishOptions = [];

            for(let x = 0; x < options.length; x++) {
                  this.#finishOptions[x] = createDropdownOption(options[x], options[x]);
            }

            while(this.#finish[1].firstChild) {
                  this.#finish[1].removeChild(this.#finish[1].firstChild);
            }

            for(var l = 0; l < options.length; l++) {
                  this.#finish[1].add(this.#finishOptions[l]);
            }*/
      }

      /**
       * @CorebridgeCreate
       */
      async Create(productNo, partIndex) {
            partIndex = await super.Create(productNo, partIndex);
            var name = this.#material[1].value + " - (sqm) - " + this.#finish[1].value + " " + this.#sheetSize[1].value.replaceAll("mm", "").replaceAll(" ", "") + "x" + this.#thickness[1].value;
            //var partFullName = getPredefinedParts_Name_FromLimitedName(name);
            var partFullName = this.#sheetMaterial[1].value;

            for(let i = 0; i < this.#outputSizeTableData.length; i++) {
                  let [partQty, partWidth, partHeight, aaa, aab, aac, aad] = this.#outputSizeTableData[i];
                  partIndex = await q_AddPart_DimensionWH(productNo, partIndex, true, partFullName, partQty, partWidth, partHeight, partFullName, "", false);
            }

            partIndex = await this.#guillotineProduction.Create(productNo, partIndex);
            partIndex = await this.#router.Create(productNo, partIndex);
            partIndex = await this.#supplierCuts.Create(productNo, partIndex);
            partIndex = await this.#cutByHandProduction.Create(productNo, partIndex);

            return partIndex;
      }

      Description() {
            super.Description();

            return this.#thickness[1].value + "mm " + this.#finish[1].value + " finish " + this.#material[1].value + " panel";
      }
}