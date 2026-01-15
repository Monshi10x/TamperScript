
class Sheet extends Material {
      static DISPLAY_NAME = "SHEET";
      /*override*/get Type() {return "SHEET";}

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
      #laser;
      #finishingHeader;
      #finishingProduction;
      #f_foldSideContainer;
      #isFolded;
      #foldedTop;
      #foldedLeft;
      #foldedBottom;
      #foldedRight;
      #updateOrderBtn;
      #flipSheet = false;
      preferredCuttingMachine = null;
      #totalPerimeter = 0;
      #flip;
      #supplierCuts;
      #material;
      #thickness;
      #finish;
      #sheetSize;
      #f_returnDepth;
      #sheetMaterial;
      #filtersHeader;
      #hasGrain;
      #grainDirection;
      #totalNumberGuillotineCuts = 0;
      #totalNumberSupplierCuts = 0;
      #totalRouterPerimeter = 0;
      #totalRouterNumberOfShapes = 0;
      #totalLaserPerimeter;
      #totalLaserNumberOfShapes;
      #totalNumberHandCuts = 0;
      #method1;
      #method2;
      #currentJoinMethod = "Even Joins";

      #sheetPerimeterIsCut = true;
      #useOverallSVGSize = false;
      #finalOutputSizesHeader;
      /**
       * @Updated on table changes
       * @example
       *          [[4, 2440, 1220, 0, select, 0, 29280],
       *           [4, 2440, 580, 1, select, 4, 24160]
       *           [1, 240, 1220, 1, select, 1, 2920]
       *           [1, 240, 580, 2, select, 2, 1640]]
       */
      #outputSizeTableData = [];
      #filterOrder = ['Material', 'Sheet Size', 'Thickness', 'Finish'];
      #sheetSizeOptions = [];
      #finishOptions = [];
      #thicknessOptions = [];
      /** @example ['ACM - (sqm)', 'Matte Colours Alucobond', '1000x1000', '3x0.30'] */
      #searchTerms = [];
      #parts = [];
      routerCutProfile = {material: "ACM", thickness: "3", profile: "Cut Through", quality: "Good Quality"};
      staticRouterRows = [];
      laserCutProfile = {material: "Stainless", thickness: "1.2", profile: "Cut Through", quality: "Good Quality"};
      staticLaserRows = [];
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
      /**
       * @Inherited
       * @example
       * [{parent: 'SHEET-1699952073332-95570559', data: []},
       * {parent: 'SHEET-1699952073332-95574529', data: []}]
       */
      /**
       * @example [QWHD(), QWHD(),...]
       */
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
      //#dataForSubscribers = [];

      setRouterCutProfile(options = {material: null, thickness: null, profile: null, quality: null}) {
            this.routerCutProfile = {material: options.material, thickness: options.thickness, profile: options.profile, quality: options.quality};
            this.UpdateFromFields();
      }

      addStaticRouterRow(_length, _numberOfPaths, _profileSettings = {material: "ACM", thickness: "", profile: "Cut Through", quality: "Good Quality"}) {
            this.staticRouterRows.push({pathLength: _length, numberOfPaths: _numberOfPaths, profileSettings: _profileSettings});
            this.UpdateFromFields();
      }

      setLaserCutProfile(options = {material: null, thickness: null, profile: null, quality: null}) {
            this.laserCutProfile = {material: options.material, thickness: options.thickness, profile: options.profile, quality: options.quality};
            this.UpdateFromFields();
      }

      addStaticLaserRow(_length, _numberOfPaths, _profileSettings = {material: "ACM", thickness: "", profile: "Cut Through", quality: "Good Quality"}) {
            this.staticLaserRows.push({pathLength: _length, numberOfPaths: _numberOfPaths, profileSettings: _profileSettings});
            this.UpdateFromFields();
      }

      static guillotineCutsPerType = {
            "Standard Sheet": 0,
            "One Side Sheet Size": 1,
            "Smaller Than Standard Sheet": 2,
            "Bigger Than Standard Sheet": 0
      };
      static guillotineMaxCutWidth = 2480;
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
      static cutResultsByMethod(method, width, height, sheetWidth, sheetHeight, flipSheet = false, groupBySize = false) {
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

            if(groupBySize) return uniqueSizeArrayWithOccurenceCount(returnArray);
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

      set material(value) {$(this.#material[1]).val(value).change();}
      set thickness(value) {$(this.#thickness[1]).val(value).change();}
      set finish(value) {$(this.#finish[1]).val(value).change();}
      set sheetSize(value) {$(this.#sheetSize[1]).val(value).change();}
      set sheetMaterial(value) {$(this.#sheetMaterial[1]).val(value).change();}
      set joinMethod(value) {
            if(value === Sheet.joinMethod["Even Joins"]) {setCheckboxChecked(true, this.#method1[1]); setCheckboxChecked(false, this.#method2[1]);}
            if(value === Sheet.joinMethod["Full Sheet + Offcut"]) {setCheckboxChecked(false, this.#method1[1]); setCheckboxChecked(true, this.#method2[1]);}
            this.updateJoinMethod();
      }
      set sheetPerimeterIsCut(value) {
            this.#sheetPerimeterIsCut = value;
            this.UpdateFromFields();
      }

      set useOverallSVGSize(value) {
            this.#useOverallSVGSize = value;
            this.UpdateFromFields();
      }

      setSheetMaterial(value, triggerChange = true) {
            dropdownSetSelectedText(this.#material[1], value, triggerChange);
            this.setFilters(triggerChange);
      }
      setSheetSize(value, triggerChange = true) {
            dropdownSetSelectedText(this.#sheetSize[1], value, triggerChange);
            this.setFilters(triggerChange);
      }
      setSheetThickness(value, triggerChange = true) {
            dropdownSetSelectedText(this.#thickness[1], value, triggerChange);
            this.setFilters(triggerChange);
      }
      setSheetFinish(value, triggerChange = true) {
            dropdownSetSelectedText(this.#finish[1], value, triggerChange);
            this.setFilters(triggerChange);
      }
      setAllCuttingTypeDisabled = (disabledTF) => {
            for(let c = 0; c < Object.keys(this.#cuttingOptions).length; c++) {
                  setFieldDisabled(disabledTF, this.#cuttingOptions[Object.keys(this.#cuttingOptions)[c]], this.#cuttingOptions[Object.keys(this.#cuttingOptions)[c]]);
            }
      };
      updateJoinMethod() {
            if(this.#method1[1].checked) this.#currentJoinMethod = Sheet.joinMethod["Even Joins"];
            else this.#currentJoinMethod = Sheet.joinMethod["Full Sheet + Offcut"];
      }
      setFilters(triggerChange = true) {
            let chosenMaterial = this.#material[1].value || null;
            let chosenSheetSize = this.#sheetSize[1].value || null;
            let chosenThickness = this.#thickness[1].value || null;
            let chosenFinish = this.#finish[1].value || null;

            ///Note, the below might seem inefficient, but it is required for the search algorithm among multiple dropdowns

            //Material
            let materialOptionsArray = new TArray();
            materialOptionsArray.push("");
            let foundParts = getPredefinedParts_RefinedSearch("- (sqm) -", chosenThickness, chosenFinish, chosenSheetSize, null);
            for(let i = 0; i < foundParts.length; i++) {
                  materialOptionsArray.push(foundParts[i].Material);
            }

            //sheet size
            let sheetOptionsArray = new TArray();
            sheetOptionsArray.push("");
            foundParts = getPredefinedParts_RefinedSearch("- (sqm) -", chosenThickness, chosenFinish, null, chosenMaterial);
            for(let i = 0; i < foundParts.length; i++) {
                  sheetOptionsArray.push(foundParts[i].SheetSize);
            }

            //Thickness
            let thicknessOptionsArray = new TArray();
            thicknessOptionsArray.push("");
            foundParts = getPredefinedParts_RefinedSearch("- (sqm) -", null, chosenFinish, chosenSheetSize, chosenMaterial);
            for(let i = 0; i < foundParts.length; i++) {
                  thicknessOptionsArray.push(foundParts[i].Thickness);
            }

            //finish
            let finishOptionsArray = new TArray();
            finishOptionsArray.push("");
            foundParts = getPredefinedParts_RefinedSearch("- (sqm) -", chosenThickness, null, chosenSheetSize, chosenMaterial);
            for(let i = 0; i < foundParts.length; i++) {
                  finishOptionsArray.push(foundParts[i].Finish);
            }

            materialOptionsArray = materialOptionsArray.uniqueArrayElements().sort();
            sheetOptionsArray = sheetOptionsArray.uniqueArrayElements().sort();
            thicknessOptionsArray = thicknessOptionsArray.uniqueArrayElements().sort();
            finishOptionsArray = finishOptionsArray.uniqueArrayElements().sort();

            dropdownSetOptions(this.#material[1], ...materialOptionsArray);
            dropdownSetOptions(this.#sheetSize[1], ...sheetOptionsArray);
            dropdownSetOptions(this.#thickness[1], ...thicknessOptionsArray);
            dropdownSetOptions(this.#finish[1], ...finishOptionsArray);

            dropdownSetSelectedText(this.#material[1], chosenMaterial, false);
            dropdownSetSelectedText(this.#sheetSize[1], chosenSheetSize, false);
            dropdownSetSelectedText(this.#thickness[1], chosenThickness, false);
            dropdownSetSelectedText(this.#finish[1], chosenFinish, false);

            let searchString =
                  IFELSE(this.#material[1].value != "", this.#material[1].value + " ", "") +
                  IFELSE(this.#sheetSize[1].value != "", this.#sheetSize[1].value + " ", "") +
                  IFELSE(this.#thickness[1].value != "", "x" + this.#thickness[1].value + " ", "") +
                  IFELSE(this.#finish[1].value != "", this.#finish[1].value + " ", "");

            if(triggerChange) $(this.#sheetMaterial[4]).val(searchString).change();
            else $(this.#sheetMaterial[4]).val(searchString);

            this.#sheetMaterial[5]();
      }
      createCuttingOptions = (width, height, foldDepth, sheetWidth, sheetHeight, material) => {
            let returnArray = [];
            let sheetIsFolded = this.#isFolded[1].checked && foldDepth > 0;
            let isStandardSheet = Sheet.getCutVsSheetType(width, height, sheetWidth, sheetHeight) == "Standard Sheet" && !sheetIsFolded;
            let canUseFactoryEdge = this.#materialsWithUsableFactoryEdge.includes(material) && !sheetIsFolded;
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
      /**
       * 
       * @param {*} machine "router" || "laser" || "guillotine"
       */
      setCuttingMachine(machine = "router") {
            switch(machine) {
                  case "router":
                        this.preferredCuttingMachine = "router";
                        this.UpdateFromFields();
                        break;
                  case "laser":
                        this.preferredCuttingMachine = "laser";
                        this.UpdateFromFields();
                        break;
                  case "guillotine":
                        this.preferredCuttingMachine = "guillotine";
                        this.UpdateFromFields();
                        break;
                  default: break;
            }
      }
      /**
       * @Sheets
       */
      getSheetSizeWH() {
            var arr = getPredefinedParts(this.#sheetMaterial[1].value)[0].ParentSize.replaceAll("mm", "").replaceAll(" ", "").split("x");
            return [zeroIfNaNNullBlank(parseFloat(arr[0])), zeroIfNaNNullBlank(parseFloat(arr[1]))];
      }

      get matrixSizes() {return this.#matrixSizes;}
      get currentJoinMethod() {return this.#currentJoinMethod;}
      get backgroundColor() {return COLOUR.Orange;}
      get textColor() {return COLOUR.White;}
      get DEBUG_SHOW() {return true;}
      get router() {return this.#router;}

      getSheetDropdownOptions() {
            let materialsToUse = [];
            this.#materialOptions.forEach((item) => {
                  materialsToUse.push(item.value);
            });

            let optionsArray = [];
            for(let i = 0; i < materialsToUse.length; i++) {
                  let foundParts = getPredefinedParts_RefinedSearch(materialsToUse[i] + " - ");
                  for(let j = 0; j < foundParts.length; j++) {
                        optionsArray.push([foundParts[j].Name, foundParts[j].IsStocked ? GM_getResourceURL("Image_IsStocked") : null]);
                  }
            }

            return optionsArray;
      }


      constructor(parentContainer, LHSMenuWindow, options = {UPDATES_PAUSED: false}) {
            super(parentContainer, LHSMenuWindow, options);

            /*
            InheritedParentSizeSplits*/
            let f_container_inheritedParentSizeSplits = createDivStyle5(null, "Inherited Parent Size Splits", this.container)[1];
            this.#inheritedSizeTable = new Table(f_container_inheritedParentSizeSplits, "100%", 20, 250);
            this.#inheritedSizeTable.setHeading("Qty", "Width", "Height", "Depth");
            this.#inheritedSizeTable.addRow("-", "-", "-", "-");
            this.#inheritedSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";

            /*
            Sheet Size*/
            let f_container_sheetSize = createDivStyle5("width:calc(100%)", "Sheet To Use", this.container);
            f_container_sheetSize[1].id = "iojsdnbgkjasngjknas";

            let sheetFilterContainer = createDivStyle5("width:calc(100%)", "Filters", f_container_sheetSize[1]);

            this.#material = createDropdown_Infield("Material", 0, "width:80px", [createDropdownOption("", "")].concat(this.#materialOptions), () => {this.setFilters();}, sheetFilterContainer[1]);

            this.#sheetSize = createDropdown_Infield("Sheet Size", 0, "width:130px;", [], () => {this.setFilters();}, sheetFilterContainer[1]);
            this.#sheetSize[1].id = "Sheet Size";

            this.#thickness = createDropdown_Infield("Thickness", 0, "width:80px", [], () => {this.setFilters();}, sheetFilterContainer[1]);

            this.#finish = createDropdown_Infield("Finish", 0, "width:100px;", [], () => {this.setFilters();}, sheetFilterContainer[1]);

            this.#sheetMaterial = createDropdown_Infield_Icons_Search("Sheet Material", 0, "width:calc(100% - 12px);", 40, false, this.getSheetDropdownOptions(), () => {this.UpdateFromFields();}, f_container_sheetSize[1], false);

            /*
            Folded*/
            let f_container_folded = createDivStyle5(null, "Folded", this.container)[1];
            this.#f_foldSideContainer = document.createElement('div');

            this.#isFolded = createCheckbox_Infield("Is Folded", false, "width:calc(50% - 20px);margin:10px;", () => {
                  if(this.#isFolded[1].checked) {
                        setFieldHidden(false, this.#foldedTop[1], this.#foldedTop[0]);
                        setFieldHidden(false, this.#foldedLeft[1], this.#foldedLeft[0]);
                        setFieldHidden(false, this.#foldedRight[1], this.#foldedRight[0]);
                        setFieldHidden(false, this.#foldedBottom[1], this.#foldedBottom[0]);
                        setFieldHidden(false, this.#f_returnDepth[1], this.#f_returnDepth[0]);
                  } else {
                        setFieldHidden(true, this.#foldedTop[1], this.#foldedTop[0]);
                        setFieldHidden(true, this.#foldedLeft[1], this.#foldedLeft[0]);
                        setFieldHidden(true, this.#foldedRight[1], this.#foldedRight[0]);
                        setFieldHidden(true, this.#foldedBottom[1], this.#foldedBottom[0]);
                        setFieldHidden(true, this.#f_returnDepth[1], this.#f_returnDepth[0]);
                  }
                  this.UpdateFromFields();
            }, this.#f_foldSideContainer);

            this.#f_returnDepth = createInput_Infield("Return Depth", 0, "", () => {this.UpdateFromFields();}, this.#f_foldSideContainer, false, 10, {postfix: "mm"});
            this.#foldedTop = createCheckbox_Infield("Top", false, "margin-left: 20%; width:20%;margin-right: 50%; ", () => {this.UpdateFromFields();}, this.#f_foldSideContainer);
            this.#foldedLeft = createCheckbox_Infield("Left", false, "width:20%;margin-right: 20%;", () => {this.UpdateFromFields();}, this.#f_foldSideContainer);
            this.#foldedRight = createCheckbox_Infield("Right", false, " width:20%;margin-right: 30%;", () => {this.UpdateFromFields();}, this.#f_foldSideContainer);
            this.#foldedBottom = createCheckbox_Infield("Bottom", false, "margin-left: 20%;width:20%;", () => {this.UpdateFromFields();}, this.#f_foldSideContainer);
            setFieldHidden(true, this.#foldedTop[1], this.#foldedTop[0]);
            setFieldHidden(true, this.#foldedLeft[1], this.#foldedLeft[0]);
            setFieldHidden(true, this.#foldedRight[1], this.#foldedRight[0]);
            setFieldHidden(true, this.#foldedBottom[1], this.#foldedBottom[0]);
            setFieldHidden(true, this.#f_returnDepth[1], this.#f_returnDepth[0]);
            f_container_folded.appendChild(this.#f_foldSideContainer);
            /*
            Joins*/
            let f_container_joins = createDivStyle5(null, "Joins", this.container)[1];


            this.#joinHelperBtn = createIconButton("https://cdn.gorilladash.com/images/media/6195615/signarama-australia-searching-63ad3d8672602.png", "Visualiser", "width:calc(100% - 20px);margin-right:55%;height:40px;background-color:" + COLOUR.Orange + ";", () => {
                  this.#visualiser.borrowFields(sheetFilterContainer[0], this.#sheetMaterial[0], this.#flip[0], this.#hasGrain[0], methodContainer, this.#f_foldSideContainer);
                  this.#visualiser.setFlippedField(this.#flip[1]);
                  this.#visualiser.setSheetSizeField(this.#sheetSize[1]);
                  this.#visualiser.setHasGrainField(this.#hasGrain[1]);
                  this.#visualiser.setGrainDirectionField(this.#grainDirection[1]);
                  this.#visualiser.setFoldFields(this.#foldedTop[1], this.#foldedLeft[1], this.#foldedRight[1], this.#foldedBottom[1]);
                  this.#visualiser.setFoldDepth(parseFloat(this.#f_returnDepth[1].value)/*this.getQWHD().depth*/);//TODO
                  this.#visualiser.setIsFoldedField(this.#isFolded[1]);
                  this.#visualiser.width = this.getQWHD().width;
                  this.#visualiser.height = this.getQWHD().height;
                  this.#visualiser.setSizeArrays(this.#matrixSizes);
                  this.#visualiser.show();
            }, f_container_joins, true);

            let methodContainer = createDivStyle4("width:calc(50% - 20px);", f_container_joins);
            let useMethod1 = (this.currentJoinMethod == "Use Full Sheets + End Offcut");
            let methodText = createText("Join Method", null, methodContainer);
            this.#method1 = createCheckbox_Infield("Even Joins", !useMethod1, "min-width:250px", () => {this.updateJoinMethod(); this.UpdateFromFields();}, methodContainer, false);
            this.#method2 = createCheckbox_Infield("Use Full Sheets + End Offcut", useMethod1, "min-width:250px", () => {this.updateJoinMethod(); this.UpdateFromFields();}, methodContainer, false);

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
                  this.UpdateFromFields();
            }, f_container_joins, true);
            flipDiagram = createDiv("background-color:yellow;width:30px;height:10px;margin-top:10px;", null, this.#flip[0]);

            this.#hasGrain = createCheckbox_Infield("Has Grain", false, "width:calc(50% - 20px);margin:10px;", () => {
                  setFieldHidden(!this.#hasGrain[1].checked, this.#grainDirection[1], this.#grainDirection[0]);

                  this.UpdateFromFields();
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
            this.#router = new Router(f_container_cutting, null, null, null, {required: false});
            this.#router.showContainer = false;
            this.#router.required = false;
            this.#router.SubscribeTo(this);

            //Laser
            this.#laser = new Laser(f_container_cutting, null, null, null);
            this.#laser.showContainer = false;
            this.#laser.required = false;
            this.#laser.SubscribeTo(this);

            //Supplier
            this.#supplierCuts = new Supplier(f_container_cutting, null, () => { });
            this.#supplierCuts.required = false;
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

            this.#visualiser = new ModalSheetJoins("Join Helper", 100, () => {
                  this.UpdateFromFields();
            }, this);

            // this.container.appendChild(this.#visualiser.dragZoomSVG.container);
            //TODO: Borrow DragZoom

            this.UpdateFromFields();
      }

      /*overrides*/UpdateFromFields() {
            if(this.UPDATES_PAUSED) return;

            this.UpdateFromInheritedData();
            this.UpdateGrainDirection();
            this.UpdateOutput();
            this.UpdateOutputTable();
            this.UpdateVisualizer();

            this.UpdateDataForSubscribers();
            this.PushToSubscribers();

            super.UpdateFromFields();
      }

      UpdateFromInheritedData = () => {
            this.#inheritedSizes = [];
            this.#inheritedSizeTable.deleteAllRows();

            this.SUBSCRIPTION_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{overallSize: {width, height}, QWHD: QWHD}*/) => {
                        if(this.#useOverallSVGSize && dataEntry.overallSize) {
                              this.#inheritedSizes.push(new QWHD(1, dataEntry.overallSize.width, dataEntry.overallSize.height, 0));
                              this.#inheritedSizeTable.addRow(1, dataEntry.overallSize.width, dataEntry.overallSize.height, 0);
                              return;
                        }
                        else if(dataEntry.QWHD) {
                              this.#inheritedSizes.push(dataEntry.QWHD);
                              this.#inheritedSizeTable.addRow(dataEntry.QWHD.qty, dataEntry.QWHD.width, dataEntry.QWHD.height, dataEntry.QWHD.depth);
                        }
                  });
            });


            if(this.SUBSCRIPTION_DATA.length == 0) {
                  this.#inheritedSizes.push(new QWHD(this.qty, 0, 0, 0));
                  this.#inheritedSizeTable.addRow(this.qty, 0, 0, 0);
            }
      };

      UpdateGrainDirection() {
            let hasGrain = false;
            let grainDirection = "";

            var partFullName = this.#sheetMaterial[1].value;
            var part = getPredefinedParts(partFullName)[0];

            if(part) {
                  if(part.Color) {
                        if(part.Color.includes("{")) {
                              let colourString = JSON.parse(part.Color.substring(1, part.Color.length - 1));
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

      UpdateOutput = () => {
            this.#outputSizeTable.deleteAllRows();
            this.#outputSizeTableData = [];
            this.#dataForSubscribers = [];
            this.#matrixSizes = [];

            this.#totalNumberGuillotineCuts = 0;
            this.#totalNumberSupplierCuts = 0;
            this.#totalRouterPerimeter = 0;
            this.#totalRouterNumberOfShapes = 0;

            let [sheetSizeWidth, sheetSizeHeight] = this.getSheetSizeWH();

            let mustBeRouterCut = false;
            let _this = this;
            this.SUBSCRIPTION_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{pathQty: {}}*/) => {

                        if(subscription.parent instanceof LED) {
                              mustBeRouterCut = true;
                              _this.preferredCuttingMachine = "router";
                        }
                  });
            });

            for(let i = 0; i < this.#inheritedSizes.length; i++) {

                  setFieldHidden(true, this.#cuttingJoinNote);
                  this.setAllCuttingTypeDisabled(false);

                  let currentMaterial = this.#material[1].value;

                  let subscriptionQty = this.#inheritedSizes[i].qty;
                  let rowWidth = this.#inheritedSizes[i].width;
                  let rowHeight = this.#inheritedSizes[i].height;

                  if(this.#isFolded[1].checked) {
                        if(this.#foldedTop[1].checked)
                              rowHeight += parseFloat(this.#f_returnDepth[1].value);//this.#inheritedSizes[i].depth;
                        if(this.#foldedLeft[1].checked)
                              rowWidth += parseFloat(this.#f_returnDepth[1].value);//this.#inheritedSizes[i].depth;
                        if(this.#foldedRight[1].checked)
                              rowWidth += parseFloat(this.#f_returnDepth[1].value); //this.#inheritedSizes[i].depth;
                        if(this.#foldedBottom[1].checked)
                              rowHeight += parseFloat(this.#f_returnDepth[1].value); //this.#inheritedSizes[i].depth;
                  }

                  let uniqueSizes = Sheet.cutResultsByMethod(this.currentJoinMethod, rowWidth, rowHeight, sheetSizeWidth, sheetSizeHeight, this.#flipSheet, true);

                  this.#matrixSizes.push(Sheet.getMatrixSizes(this.currentJoinMethod, rowWidth, rowHeight, sheetSizeWidth, sheetSizeHeight, this.#flipSheet));
                  this.#dataForSubscribers.push({
                        matrixSizes: this.#matrixSizes,
                        sheetMaterial: this.#sheetMaterial[1].value
                  });

                  for(let u = 0; u < uniqueSizes.length; u++) {
                        let w = uniqueSizes[u].width;
                        let h = uniqueSizes[u].height;
                        let q = uniqueSizes[u].qty;
                        let d = parseFloat(this.#f_returnDepth[1].value);//uniqueSizes[u].depth;
                        let qty = q * this.qty * subscriptionQty;
                        let paintedArea =
                              mmToM(w) * mmToM(h) * qty +
                              2 * mmToM(d) * mmToM(w) * qty +
                              2 * mmToM(d) * mmToM(h) * qty;

                        let numberCutsPerSheet = Sheet.getNumberOfGuillotineCuts(w, h, sheetSizeWidth, sheetSizeHeight);
                        let totalNumberCuts = numberCutsPerSheet * qty;

                        this.#totalPerimeter = roundNumber((w * 2 + h * 2) * qty, 2);
                        let options = this.createCuttingOptions(w, h, d, sheetSizeWidth, sheetSizeHeight, currentMaterial);

                        let cuttingTypeDropDown = createDropdown_Infield("Panel Cutting Type", 0, ";width:-webkit-fill-available;", options, () => {
                              this.UpdateOutputTable();
                        }, null);

                        this.#dataForSubscribers.push({QWHD: new QWHD(qty, w, h, d), paintedArea: paintedArea});

                        this.#outputSizeTable.addRow(qty, roundNumber(w, 2), roundNumber(h, 2), numberCutsPerSheet, cuttingTypeDropDown[0], totalNumberCuts, this.#totalPerimeter);
                        this.#outputSizeTableData.push([qty, roundNumber(w, 2), roundNumber(h, 2), numberCutsPerSheet, cuttingTypeDropDown[1], totalNumberCuts, this.#totalPerimeter]);

                        if(this.preferredCuttingMachine == null) dropdownSetSelectedIndexToNextAvailable(cuttingTypeDropDown[1], yes);
                        if(this.preferredCuttingMachine == "router") dropdownSetSelectedValue(cuttingTypeDropDown[1], this.#cuttingOptions.Router.value);
                        if(this.preferredCuttingMachine == "laser") dropdownSetSelectedValue(cuttingTypeDropDown[1], this.#cuttingOptions.Laser.value);
                        if(this.preferredCuttingMachine == "guillotine") dropdownSetSelectedValue(cuttingTypeDropDown[1], this.#cuttingOptions.Guillotine.value);
                  }
            }
      };

      UpdateOutputTable() {
            this.#totalNumberGuillotineCuts = 0;
            this.#totalNumberHandCuts = 0;
            this.#totalNumberSupplierCuts = 0;
            this.#totalRouterPerimeter = 0;
            this.#totalRouterNumberOfShapes = 0;
            this.#totalLaserPerimeter = 0;
            this.#totalLaserNumberOfShapes = 0;

            let numberOfPaths = 0;
            let penMarkingQty = 0;
            let penMarkingLength = 0;
            let pathLength = 0;
            let boundingPerimeter = 0;

            let overallSVGSizes = [];

            this.SUBSCRIPTION_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  subscription.data.forEach((dataEntry/**{pathLength:{},pathQty: {}}*/) => {

                        if(dataEntry.pathQty) numberOfPaths += dataEntry.pathQty.totalQty;
                        if(subscription.parent instanceof LED) {
                              penMarkingQty += dataEntry.qty;
                              penMarkingLength += dataEntry.qty * 100;
                        }
                        if(subscription.parent instanceof SVGCutfile) {
                              pathLength += dataEntry.pathLength;
                              boundingPerimeter += (dataEntry.overallSize?.width * 2 + dataEntry.overallSize?.height * 2) * dataEntry.QWHD.qty;
                              overallSVGSizes.push(dataEntry.overallSize);
                        }
                  });
            });

            for(let i = 0; i < this.#outputSizeTableData.length; i++) {
                  this.#outputSizeTable.getCell(i + 1, 6).style.backgroundColor = "white";
                  this.#outputSizeTable.getCell(i + 1, 7).style.backgroundColor = "white";
                  //alert(this.#outputSizeTableData[i][4].value);
                  switch(this.#outputSizeTableData[i][4].value) {
                        case "Router":
                              this.#totalRouterPerimeter += this.#outputSizeTableData[i][6];
                              this.#totalRouterNumberOfShapes += this.#outputSizeTableData[i][0];
                              this.#outputSizeTable.getCell(i + 1, 7).style.backgroundColor = COLOUR.LightBlue;
                              break;
                        case "Laser":
                              this.#totalLaserPerimeter += this.#outputSizeTableData[i][6];
                              this.#totalLaserNumberOfShapes += this.#outputSizeTableData[i][0];
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

            if(this.#totalLaserPerimeter + this.#totalLaserNumberOfShapes === 0) {
                  this.#laser.required = false;
                  this.#laser.Minimize();
            } else {
                  this.#laser.required = true;
                  this.#laser.Maximize();
            }



            ///ROUTER
            this.#router.deleteAllRunRows();
            this.staticRouterRows.forEach((element) => {
                  this.#router.addRunRow(eval(element.pathLength), eval(element.numberOfPaths), eval(element.profileSettings));
            });
            if(this.#sheetPerimeterIsCut) this.#router.addRunRow(this.#totalRouterPerimeter, numberOfPaths == 0 ? this.#totalRouterNumberOfShapes : numberOfPaths, this.routerCutProfile);
            if(penMarkingQty > 0) this.#router.addRunRow(penMarkingLength, penMarkingQty, {material: "Any", profile: "LED Marking", quality: "SecondsPerCut"});

            ///LASER
            this.#laser.deleteAllRunRows();
            this.staticLaserRows.forEach((element) => {
                  this.#laser.addRunRow(eval(element.pathLength), eval(element.numberOfPaths), eval(element.profileSettings));
            });
            if(this.#sheetPerimeterIsCut) this.#laser.addRunRow(this.#totalLaserPerimeter, numberOfPaths == 0 ? this.#totalLaserNumberOfShapes : numberOfPaths, this.laserCutProfile);

            ///FOLDED
            if(this.#isFolded[1].checked) {
                  let foldPerimeter = 0;
                  let numberShapes = 0;
                  let foldedTop = this.#foldedTop[1].checked;
                  let foldedLeft = this.#foldedLeft[1].checked;
                  let foldedRight = this.#foldedRight[1].checked;
                  let foldedBottom = this.#foldedBottom[1].checked;

                  for(let i = 0; i < this.#matrixSizes.length; i++) {//per subscription
                        let numberRows = this.#matrixSizes[i].length;
                        let numberColumns = this.#matrixSizes[i][0].length;
                        numberShapes += foldedTop ? numberColumns : 0;
                        numberShapes += foldedLeft ? numberRows : 0;
                        numberShapes += foldedRight ? numberRows : 0;
                        numberShapes += foldedBottom ? numberColumns : 0;
                        /*per row*/for(let j = 0; j < this.#matrixSizes[i].length; j++) {
                              /*per item in row*/for(let k = 0; k < this.#matrixSizes[i][j].length; k++) {
                                    /*first row*/if(j == 0) {
                                          foldPerimeter += foldedTop ? this.#matrixSizes[i][j][k][0/*width*/] : 0;
                                          foldPerimeter += foldedBottom ? this.#matrixSizes[i][j][k][0/*width*/] : 0;
                                    }
                                    /*first column*/if(k == 0) {
                                          foldPerimeter += foldedLeft ? this.#matrixSizes[i][j][k][1/*height*/] : 0;
                                          foldPerimeter += foldedRight ? this.#matrixSizes[i][j][k][1/*height*/] : 0;
                                    }
                              }
                        }
                  }

                  this.#router.addRunRow(foldPerimeter, numberOfPaths == 0 ? numberShapes : numberOfPaths, {material: "ACM", thickness: "3", profile: "Groove", quality: "Good Quality"});
                  TODO("Laser folding");
            }

            this.#router.setupNumberOfSheets = this.#totalRouterNumberOfShapes;

            this.#router.cleanNumberOfSheets = this.#totalRouterNumberOfShapes;

            this.#laser.setupNumberOfSheets = this.#totalLaserNumberOfShapes;

            this.#laser.cleanNumberOfSheets = this.#totalLaserNumberOfShapes;


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

      UpdateVisualizer() {
            if(this.#visualiser) {
                  this.#visualiser.setSizeArrays(this.#matrixSizes);
                  this.#visualiser.UpdateFromFields();
            }
      }

      UpdateDataForSubscribers() {
            this.DATA_FOR_SUBSCRIBERS = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
      }

      /*overrides*/ async Create(productNo, partIndex) {
            partIndex = await super.Create(productNo, partIndex);
            var name = this.#material[1].value + " - (sqm) - " + this.#finish[1].value + " " + this.#sheetSize[1].value.replaceAll("mm", "").replaceAll(" ", "") + "x" + this.#thickness[1].value;
            //var partFullName = getPredefinedParts_Name_FromLimitedName(name);
            var partFullName = this.#sheetMaterial[1].value;

            for(let i = 0; i < this.#outputSizeTableData.length; i++) {
                  let [partQty, partWidth, partHeight, aaa, aab, aac, aad] = this.#outputSizeTableData[i];
                  partIndex = await q_AddPart_DimensionWH(productNo, partIndex, true, partFullName, partQty, partWidth, partHeight, partFullName, null, false, this.#visualiser.unscaledSVGString);
            }

            partIndex = await this.#guillotineProduction.Create(productNo, partIndex);
            partIndex = await this.#router.Create(productNo, partIndex);
            partIndex = await this.#laser.Create(productNo, partIndex);
            partIndex = await this.#supplierCuts.Create(productNo, partIndex);
            partIndex = await this.#cutByHandProduction.Create(productNo, partIndex);

            return partIndex;
      }

      /*overrides*/Description() {
            super.Description();

            return "";//this.#thickness[1].value + "mm " + this.#finish[1].value + " finish " + this.#material[1].value + " panel";
      }
}