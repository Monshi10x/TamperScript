
class Sheet extends Material {
      static DISPLAY_NAME = "SHEET";

      #materialOptions = [
            createDropdownOption("ACM", "ACM"),
            createDropdownOption("Acrylic", "Acrylic"),
            createDropdownOption("Aluminium", "Aluminium"),
            createDropdownOption("Mondoclad", "Mondoclad"),
            createDropdownOption("Foamed PVC", "Foamed PVC"),
            createDropdownOption("Corflute", "Corflute"),
            createDropdownOption("Polycarb", "Polycarb"),
            createDropdownOption("HDPE", "HDPE"),
            createDropdownOption("Signwhite", "Signwhite")];

      #cuttingOptions = {
            "Guillotine": createDropdownOption("Guillotine - Standard Rectangle (ACM, Signwhite)", "Guillotine"),
            "None": createDropdownOption("None - (standard sheet)", "None"),
            "Router": createDropdownOption("Router - Custom Contour (Circular, Rounded Corners, Irregular Shape)", "Router"),
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
      static guillotineMaterialsCanCut = ["ACM", "Signwhite", "Polycarb"];
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
      #filterContainersOrdered = [null, null, null, null];
      #material;
      set material(value) {$(this.#material[1]).val(value).change();}

      #thickness;
      set thickness(value) {$(this.#thickness[1]).val(value).change();}

      #finish;
      set finish(value) {$(this.#finish[1]).val(value).change();}

      #sheetSize;
      set sheetSize(value) {$(this.#sheetSize[1]).val(value).change();}

      /*

            $(this.#thickness[1]).val("3x0.21").change();
            $(this.#finish[1]).val("Primer").change();
      */
      #updateOrderBtn;

      /**
             * @Inherited
             * @example
             * [{parent: 'SHEET-1699952073332-95570559', data: []},
             * {parent: 'SHEET-1699952073332-95574529', data: []}]
             */
      #inheritedData = [];
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
      #dataForSubscribers = [];

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
      #joinHelperBtn;
      #joinHelperHeader;
      #outputSizeTable;
      #cuttingNote;
      #guillotineProduction;
      #cutByHandProduction;
      #router;
      #finishingHeader;
      #finishingProduction;

      #flipSheet = false;
      #flip;

      get backgroundColor() {return COLOUR.Orange;}
      get textColor() {return COLOUR.White;}

      constructor(parentContainer, LHSMenuWindow, type) {
            super(parentContainer, LHSMenuWindow, type);

            /** @InheritedParentSizeSplits */
            createHeadingStyle1("Inherited Parent Size Splits", null, this.container);
            this.#inheritedSizeTable = new Table(this.container, "100%", 20, 250);
            this.#inheritedSizeTable.setHeading("Qty", "Width", "Height");
            this.#inheritedSizeTable.addRow("-", "-", "-");

            this.#filtersHeader = createHeadingStyle1("Filters", null, this.container);

            this.#material = createDropdown_Infield("Material", 0, "width:80px", this.#materialOptions, () => {this.UpdateFilters("Material");}, this.container);
            this.#searchTerms.push(this.#material[1].value + " - (sqm)");

            this.#thickness = createDropdown_Infield("Thickness", 0, "width:80px", [], () => {this.UpdateFilters("Thickness");}, this.container);

            this.#finish = createDropdown_Infield("Finish", 0, "width:100px;", [], () => {this.UpdateFilters("Finish");}, this.container);

            this.#sheetSize = createDropdown_Infield("Sheet Size", 0, "width:130px;", [], () => {this.UpdateFilters('Sheet Size');}, this.container);
            this.#sheetSize[1].id = "Sheet Size";

            this.#updateOrderBtn = createIconButton("https://cdn.gorilladash.com/images/media/6144512/signarama-australia-icons8-numeric-50-635d113e9382c.png", "Set Order", "width: 120px; height: 40px; margin: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;", () => {
                  let items = this.#filterOrder;
                  items.shift();
                  let modal = new ModalSetOrder("Set Order", () => {
                        this.#filterOrder = ['Material', ...modal.getOrder()];
                        this.UpdateFilters('Material');
                  }, ...items);
            }, this.container);

            /**
             * @Visualiser
             */

            this.#joinHelperHeader = createHeadingStyle1("Joins", null, this.container);

            this.#joinHelperBtn = createIconButton("https://cdn.gorilladash.com/images/media/6195615/signarama-australia-searching-63ad3d8672602.png", "Visualiser", "width:40%;margin-right:55%;height:40px;background-color:" + COLOUR.Orange + ";", () => {
                  this.#visualiser = new ModalSheetJoins("Join Helper", 100, () => {
                        this.#visualiser.Close();
                        this.UpdateFromChange();
                  }, this);

                  this.#visualiser.borrowFields(...this.#filterContainersOrdered, this.#flip[0], methodContainer);
                  this.#visualiser.setFlippedField(this.#flip[1]);
                  this.#visualiser.setSheetSizeField(this.#sheetSize[1]);
                  this.#visualiser.width = this.getQWH().width;
                  this.#visualiser.height = this.getQWH().height;
                  this.#visualiser.setSizeArrays(this.#matrixSizes);
            }, this.container, true);

            let flipDiagram;
            this.#flip = createCheckbox_Infield("Flip", this.#flipSheet, "width:150px;margin-left:10px;", () => {
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
            }, this.container, true);
            flipDiagram = createDiv("background-color:yellow;width:30px;height:10px;margin-top:10px;", null, this.#flip[0]);


            let methodContainer = createDivStyle4("width:40%;margin-right:50%;", this.container);
            let useMethod1 = (this.currentJoinMethod == "Use Full Sheets + End Offcut");
            let methodText = createText("Join Method", null, methodContainer);
            this.#method1 = createCheckbox_Infield("Even Joins", !useMethod1, "min-width:250px", () => {this.UpdateJoinMethod(); this.UpdateFromChange();}, methodContainer, false);
            this.#method2 = createCheckbox_Infield("Use Full Sheets + End Offcut", useMethod1, "min-width:250px", () => {this.UpdateJoinMethod(); this.UpdateFromChange();}, methodContainer, false);

            checkboxesAddToSelectionGroup(true, this.#method1, this.#method2);

            /**
             * @FinalOutputSizes
             */
            this.#finalOutputSizesHeader = createHeadingStyle1("Final Output Sizes", null, this.container);
            this.#outputSizeTable = new Table(this.container, "100%", 20, 250);
            this.#outputSizeTable.setHeading("Qty", "Width", "Height", "Cuts Each", "Machine Type", "Cuts Total", "Total Router Perimeter");
            this.#outputSizeTable.addRow("-", "-", "-", "-", "-", "-", "-", "-");

            /**
             * @Cutting
             */
            this.#cuttingHeader = createHeadingStyle1("Cutting", null, this.container);
            this.#cuttingJoinNote = createLabel("Note: Some sizes bigger than sheet size. Increase sheet size or use helper to establish joins", "width:95%;font-weight:bold;display:none;color:red;padding-bottom:5px;", this.container);
            this.#cuttingNote = createLabel("Note: Materials other than ACM, and bigger than 2500w must be router cut", "width:95%;font-weight:bold", this.container);

            /**
             * @Guillotine
             */
            this.#guillotineProduction = new Production(this.container, null, function() { }, null);
            this.#guillotineProduction.showContainerDiv = true;
            this.#guillotineProduction.headerName = "Guillotine";
            this.#guillotineProduction.productionTime = Sheet.guillotinePerCutTime;
            this.#guillotineProduction.required = true;
            this.#guillotineProduction.showRequiredCkb = true;
            this.#guillotineProduction.requiredName = "Required";
            this.#guillotineProduction.SubscribeTo(this);

            /**
             * @Router
             */
            this.#router = new Router(this.container, null, null, null);
            this.#router.showContainer = false;
            this.#router.SubscribeTo(this);

            /**
             * @Supplier
             */
            this.#supplierCuts = new Supplier(this.container, null, () => { });
            this.#supplierCuts.SubscribeTo(this);

            /**
             * @HandCutting
             */
            this.#cutByHandProduction = new Production(this.container, null, function() { }, null);
            this.#cutByHandProduction.showContainerDiv = true;
            this.#cutByHandProduction.headerName = "Hand Cutting";
            this.#cutByHandProduction.productionTime = Sheet.handPerCutTime;
            this.#cutByHandProduction.required = true;
            this.#cutByHandProduction.showRequiredCkb = true;
            this.#cutByHandProduction.requiredName = "Required";
            this.#cutByHandProduction.SubscribeTo(this);

            /**
             * @Updates
             */
            this.UpdateFilters();
            this.sheetSize = "2440mm x 1220mm";
            this.thickness = "3x0.21";
            this.finish = "Primer";

            this.UpdateDataForSubscribers();

      }

      /**@Override */
      UpdateFromChange() {
            super.UpdateFromChange();

            this.UpdateInheritedTable();

            this.UpdateOutputTable();
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

      UpdateDataForSubscribers() {
            this.dataToPushToSubscribers = {
                  parent: this,
                  data: this.#dataForSubscribers,
                  matrixSizes: this.#matrixSizes
            };
      }

      UpdateInheritedTable = () => {
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

      /**
       * @Cutting
       */

      UpdateOutputTable = () => {
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

                        let cuttingTypeDropDown = createDropdown_Infield("Panel Cutting Type", 0, "width:200px;", options, () => {
                              this.UpdateTableTotals();
                        }, null);

                        this.#dataForSubscribers.push(new QWH(qty, w, h));

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
            let isStandardSheet = Sheet.getCutVsSheetType(width, height, sheetWidth, sheetHeight) == "Standard Sheet";
            let guillotineCanCut = Sheet.guillotineCanCutSheet(width, height, sheetWidth, sheetHeight, material);
            if(width === null && height === null && sheetWidth === null && sheetHeight === null) {
                  returnArray = [
                        createDropdownOption("None - (standard sheet)", "None"),
                        createDropdownOption("Guillotine - Standard Rectangle (ACM, Signwhite)", "Guillotine"),
                        createDropdownOption("Router - Custom Contour (Circular, Rounded Corners, Irregular Shape)", "Router"),
                        createDropdownOption("Cut By Hand - (PVC, Corflute)", "Cut By Hand"),
                        createDropdownOption("Cut By Supplier", "Cut By Supplier")
                  ];
            } else {
                  returnArray = [
                        setFieldDisabled(!isStandardSheet, createDropdownOption("None - (standard sheet)", "None")),
                        setFieldDisabled(!guillotineCanCut, createDropdownOption("Guillotine - Standard Rectangle (ACM, Signwhite)", "Guillotine")),
                        createDropdownOption("Router - Custom Contour (Circular, Rounded Corners, Irregular Shape)", "Router"),
                        createDropdownOption("Cut By Hand - (PVC, Corflute)", "Cut By Hand"),
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
       * @returns [] i.e. [QWH(), QWH(), ...]
       */
      static cutResultsByMethodWithOccurenceCount(method, width, height, sheetWidth, sheetHeight, flipSheet) {
            return uniqueSizeArrayWithOccurenceCount(Sheet.cutResultsByMethod(method, width, height, sheetWidth, sheetHeight, flipSheet));
      }

      /**
       * @Guillotine
       */

      static guillotineCanCutSheet = (cutWidth, cutHeight, sheetWidth, sheetHeight, material) => {
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
            else return true;
      };

      static getNumberOfGuillotineCuts = (width, height, sheetWidth, sheetHeight) => {
            return Sheet.guillotineCutsPerType[Sheet.getCutVsSheetType(width, height, sheetWidth, sheetHeight)];
      };

      /**
       * @Sheets
       */
      getSheetSizeWH() {
            var arr = this.#sheetSize[1].value.replaceAll("mm", "").replaceAll(" ", "").split("x");
            return [zeroIfNaN(parseFloat(arr[0])), zeroIfNaN(parseFloat(arr[1]))];
      }

      sheetSizeWidth() {
            return this.getSheetSizeWH()[0];
      }

      sheetSizeHeight() {
            return this.getSheetSizeWH()[1];
      }

      UpdateFilters(updateFromFilter) {
            this.#filterContainersOrdered[0] = this.#material[0];

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
            this.UpdateFromChange();
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
            this.#finishOptions = [];

            for(let x = 0; x < options.length; x++) {
                  this.#finishOptions[x] = createDropdownOption(options[x], options[x]);
            }

            while(this.#finish[1].firstChild) {
                  this.#finish[1].removeChild(this.#finish[1].firstChild);
            }

            for(var l = 0; l < options.length; l++) {
                  this.#finish[1].add(this.#finishOptions[l]);
            }
      }

      /**
       * @CorebridgeCreate
       */
      async Create(productNo, partIndex) {
            partIndex = await super.Create(productNo, partIndex);
            var name = this.#material[1].value + " - (sqm) - " + this.#finish[1].value + " " + this.#sheetSize[1].value.replaceAll("mm", "").replaceAll(" ", "") + "x" + this.#thickness[1].value;
            var partFullName = getPredefinedParts_Name_FromLimitedName(name);

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