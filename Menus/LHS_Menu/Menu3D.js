class Menu3D extends LHSMenuWindow {

      /** @ViewMode */
      #viewMode;
      #numProducts = 0;
      #creationOrder = [ProductDetails, Size, SVGCutfile, Coil, Sheet, LED, Transformer, Painting, Vinyl, Laminate, AppTaping, HandTrimming, PrintMounting, Finishing, ProductionSubscribable, ArtworkSubscribable, InstallSubscribable];


      /** @QuickTemplate */
      #addQuickTemplateBtn;
      #createProductBtn;
      /**
       * @Size
       */
      #sizeContainer;
      #addSizeBtn;
      #sizeArray = [];
      /**
       * @Sheet
       */
      #sheetContainer;
      #addSheetBtn;
      /**
       * @Vinyl
       */
      #vinylContainer;
      #addVinylBtn;
      /**
       * @Laminate
       */
      #laminateContainer;
      #addLaminateBtn;
      /**
       * @AppTape
       */
      #appTapingContainer;
      #appTapingBtn;
      /**
       * @HandTrimming
       */
      #handTrimmingContainer;
      #addHandTrimmingBtn;
      /**
       * @PrintMounting
       */
      #printMountingContainer;
      #printMountingBtn;
      /**
       * @Production
       */
      #production;
      #productionContainer;
      #addProductionBtn;
      /**
       * @Artwork
       */
      #artwork;
      #artworkContainer;
      #addArtworkBtn;
      /**
       * @Install
       */
      #install;
      #installContainer;
      #addInstallBtn;
      /**
       * @AllMaterialsArray
       */
      #allMaterials = new ObjectArray();
      get allMaterials() {return this.#allMaterials;};

      #containers = [];
      #productContainers = [];

      #subscriptionTree;
      get subscriptionTree() {
            return {
                  ProductDetails: [],
                  Size: [],
                  Coil: [],
                  Sheet: [Size],
                  LED: [],
                  Transformer: [],
                  Painting: [],
                  Vinyl: [Sheet],
                  Laminate: [Vinyl],
                  AppTaping: [Vinyl],
                  HandTrimming: [Vinyl],
                  PrintMounting: [Sheet],
                  ProductionSubscribable: [Sheet],
                  ArtworkSubscribable: [Size],
                  InstallSubscribable: [Sheet]
            };
      }

      quickTemplates = [
            ["3D Non-lit Letters", "https://cdn.gorilladash.com/images/media/3752855/signarama-australia-atco-small-fascia-resized-thumbnail-5f38fe9719f20.jpg"],
            ["3D Front-lit Letters", "https://cdn.gorilladash.com/images/media/12562260/signarama-australia-homeco-cafe-63-lightbox-thumbnail-663186cf397a7.jpg"],
            ["3D 10mm Acrylic Letters", "https://cdn.gorilladash.com/images/media/5077109/signarama-australia-img-1060-2-small-square-61611e488aba9.jpg?auto=webp&width=1600"],
            ["3D 20mm Acrylic Letters", ""],
            ["2D Cut ACM Letters", ""]
      ];


      constructor(width, height, ID, windowTitle) {
            super(width, height, ID, windowTitle);
            this.addPages(1);

            this.page1 = this.getPage(0);

            document.addEventListener("loadedPredefinedParts", () => {
                  /*
                  ToggleOpen */
                  let toggleOpenBtn = createButton("Open All", "width:20%;height:40px;margin:0px;", () => {this.#toggleAllOpen();}, this.page1);
                  /*
                  ToggleClosed */
                  let toggleClosedBtn = createButton("Close All", "width:20%;height:40px;margin:0px;", () => {this.#toggleAllClosed();}, this.page1);

                  this.#addQuickTemplateBtn = createDropdown_Infield_Icons_Search("Add Quick Template Product", 0, "width:40%;height:35px;margin:0px;box-sizing:border-box;", 150, false,
                        this.quickTemplates,
                        () => {this.#addQuickTemplate();},
                        this.page1, false
                  );

                  this.#viewMode = createDropdown_Infield('View Mode', 1, "width:calc(20% - 2px);height:35px;margin:0px;box-sizing:border-box;", [createDropdownOption("Per Type", "Per Type"), createDropdownOption("Per Product", "Per Product"), createDropdownOption("Per Type2", "Per Type2")], () => {this.#updateViewMode();}, this.page1);
            });

            this.#createProductBtn = createButton("Create Product   " + "\u25BA", "width:100%;margin:0px;", () => {this.CreateProduct(this);});
            this.footer.appendChild(this.#createProductBtn);
      }

      #addQuickTemplate() {
            this.#numProducts++;

            let productDetails = null;
            let size = null;
            let svgCutfile = null;
            let sheet = null;
            let coil = null;
            let led = null;
            let transformer = null;
            let vinyl = null;
            let laminate = null;
            let appTape = null;
            let handTrimming = null;
            let printMounting = null;
            let finishing = null;
            let painting = null;
            let production = null;
            let artwork = null;
            let install = null;

            switch(this.#addQuickTemplateBtn[1].value) {
                  case "3D Non-lit Letters":
                        productDetails = this.#add(ProductDetails, this.page1, []);
                        productDetails.productLocation = "";
                        productDetails.productName = "3D Fabricated Non-lit Letters";

                        svgCutfile = this.#add(SVGCutfile, this.page1, []);

                        coil = this.#add(Coil, this.page1, [SVGCutfile]);

                        production = this.#add(ProductionSubscribable, this.page1, [Coil]);
                        production.typeLabel = "LASER WELD PRODUCTION";
                        production.showRequiresInputTag(true);

                        sheet = this.#add(Sheet, this.page1, [SVGCutfile]);
                        sheet.UPDATES_PAUSED = true;
                        sheet.material = "Stainless";
                        sheet.sheetSize = "2440x1220";
                        sheet.sheetMaterial = "Stainless - (sqm) - 2440x1220x1.2 2B (Vulcan)";
                        sheet.sheetPerimeterIsCut = false;
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Stainless", thickness: "1.2mm", profile: "Cut Through", quality: "Good Quality"});
                        sheet.UPDATES_PAUSED = false;
                        sheet.typeLabel = "STAINLESS SHEET";

                        sheet = this.#add(Sheet, this.page1, [SVGCutfile]);
                        sheet.UPDATES_PAUSED = true;
                        sheet.material = "Foamed PVC";
                        sheet.sheetSize = "2440x1220";
                        sheet.sheetMaterial = "Foamed PVC - (sqm) - 2440x1220x10.0 Matte White (Signex Mulfords)";
                        sheet.sheetPerimeterIsCut = false;
                        sheet.addStaticRouterRow("pathLength", "numberOfPaths", {material: "Foamed PVC", thickness: "10mm", profile: "Cut Through", quality: "Good Quality"});
                        sheet.UPDATES_PAUSED = false;
                        sheet.typeLabel = "CELUKA SHEET";

                        sheet = this.#add(Sheet, this.page1, [svgCutfile]);
                        sheet.UPDATES_PAUSED = true;
                        sheet.material = "Corflute";
                        sheet.sheetSize = "2440x1220";
                        sheet.sheetMaterial = "Corflute - (sqm) - 2440x1220x3.0 Matte White (Mulfords)";
                        sheet.useOverallSVGSize = true;
                        sheet.setLaserCutProfile({material: "Corflute", thickness: "3mm", profile: "Cut Through", quality: "Good Quality"});
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Corflute", thickness: "3mm", profile: "Cut Through", quality: "Good Quality"});
                        sheet.UPDATES_PAUSED = false;
                        sheet.typeLabel = "CORFLUTE POUNCE";


                        painting = this.#add(Painting, this.page1, [SVGCutfile, Coil]);
                        painting.UPDATES_PAUSED = true;
                        painting.formula = "Fabricated NON-LIT Letters";
                        painting.numberOfCoats = "x3 (2K for Raw Metals Alum/Steel/Stainless...)";
                        painting.UPDATES_PAUSED = false;

                        artwork = this.#add(ArtworkSubscribable, this.page1, [SVGCutfile]);
                        artwork.artworkItem.artworkTime = 60;
                        install = this.#add(InstallSubscribable, this.page1, [Sheet]);
                        break;
                  case "3D Front-lit Letters":
                        productDetails = this.#add(ProductDetails, this.page1, []);
                        productDetails.productLocation = "";
                        productDetails.productName = "3D Fabricated Front-lit Letters";

                        svgCutfile = this.#add(SVGCutfile, this.page1, []);

                        coil = this.#add(Coil, this.page1, [SVGCutfile]);

                        production = this.#add(ProductionSubscribable, this.page1, [Coil]);
                        production.typeLabel = "LASER WELD PRODUCTION";
                        production.showRequiresInputTag(true);

                        sheet = this.#add(Sheet, this.page1, [SVGCutfile]);
                        sheet.UPDATES_PAUSED = true;
                        sheet.material = "Stainless";
                        sheet.sheetSize = "2440x1220";
                        sheet.sheetMaterial = "Stainless - (sqm) - 2440x1220x1.2 2B (Vulcan)";
                        sheet.sheetPerimeterIsCut = false;
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Stainless", thickness: "1.2mm", profile: "Cut Through", quality: "Good Quality"});
                        sheet.UPDATES_PAUSED = false;
                        sheet.typeLabel = "STAINLESS SHEET";

                        sheet = this.#add(Sheet, this.page1, [SVGCutfile]);
                        sheet.UPDATES_PAUSED = true;
                        sheet.material = "Acrylic";
                        sheet.sheetSize = "2440x1220";
                        sheet.sheetMaterial = "Acrylic - (sqm) - Opal 2440x1220x10 (Mulfords)";
                        sheet.sheetPerimeterIsCut = false;
                        sheet.addStaticRouterRow("pathLength", "numberOfPaths", {material: "Acrylic", thickness: "10mm", profile: "Opal Cut Through And Rebate", quality: "Good Quality"});
                        sheet.UPDATES_PAUSED = false;
                        sheet.typeLabel = "OPAL FACE SHEET";

                        led = this.#add(LED, this.page1, [SVGCutfile]);
                        led.UPDATES_PAUSED = true;
                        led.formula = "3D Letters 100D - 200 per m2";
                        led.material = "LED Module - 6500K 1.08W 5yr 175deg 12V";
                        led.UPDATES_PAUSED = false;

                        sheet = this.#add(Sheet, this.page1, [svgCutfile, led]);
                        sheet.UPDATES_PAUSED = true;
                        sheet.material = "ACM";
                        sheet.sheetSize = "2440x1220";
                        sheet.sheetMaterial = "ACM - (sqm) - 2440x1220x2x0.15 White Satin/White Gloss (Mulfords)";
                        sheet.sheetPerimeterIsCut = false;
                        sheet.addStaticRouterRow("pathLength", "numberOfPaths", {material: "ACM", thickness: "2mm", profile: "Cut Through", quality: "Fast"});
                        sheet.UPDATES_PAUSED = false;
                        sheet.typeLabel = "ACM for LEDs";

                        transformer = this.#add(Transformer, this.page1, [LED]);

                        sheet = this.#add(Sheet, this.page1, [svgCutfile]);
                        sheet.UPDATES_PAUSED = true;
                        sheet.material = "Corflute";
                        sheet.sheetSize = "2440x1220";
                        sheet.sheetMaterial = "Corflute - (sqm) - 2440x1220x3.0 Matte White (Mulfords)";
                        sheet.useOverallSVGSize = true;
                        sheet.setLaserCutProfile({material: "Corflute", thickness: "3mm", thickness: "3mm", profile: "Cut Through", quality: "Good Quality"});
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Corflute", thickness: "3mm", profile: "Cut Through", quality: "Good Quality"});
                        sheet.UPDATES_PAUSED = false;
                        sheet.typeLabel = "CORFLUTE POUNCE";


                        painting = this.#add(Painting, this.page1, [SVGCutfile, Coil]);
                        painting.UPDATES_PAUSED = true;
                        painting.formula = "Fabricated FRONT-LIT Letters";
                        painting.numberOfCoats = "x3 (2K for Raw Metals Alum/Steel/Stainless...)";
                        painting.UPDATES_PAUSED = false;

                        artwork = this.#add(ArtworkSubscribable, this.page1, [SVGCutfile]);
                        artwork.artworkItem.artworkTime = 60;
                        install = this.#add(InstallSubscribable, this.page1, [Sheet]);
                        break;
                  case "3D 10mm Acrylic Letters":
                        productDetails = this.#add(ProductDetails, this.page1, []);
                        productDetails.productLocation = "";
                        productDetails.productName = "3D 10mm Acrylic Letters";

                        svgCutfile = this.#add(SVGCutfile, this.page1, []);

                        sheet = this.#add(Sheet, this.page1, [SVGCutfile]);
                        sheet.UPDATES_PAUSED = true;
                        sheet.material = "Acrylic";
                        sheet.sheetSize = "2440x1220";
                        sheet.thickness = "10";
                        sheet.sheetMaterial = "Acrylic - (sqm) - White/Black 2440x1220x10 (Mulfords)";
                        sheet.setCuttingMachine("laser");
                        sheet.sheetPerimeterIsCut = false;
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Acrylic", thickness: "10mm", profile: "Cut Through", quality: "Glossy Edge"});
                        sheet.UPDATES_PAUSED = false;
                        sheet.typeLabel = "ACRYLIC SHEET";

                        sheet = this.#add(Sheet, this.page1, [svgCutfile]);
                        sheet.UPDATES_PAUSED = true;
                        sheet.material = "Corflute";
                        sheet.sheetSize = "2440x1220";
                        sheet.sheetMaterial = "Corflute - (sqm) - 2440x1220x3.0 Matte White (Mulfords)";
                        sheet.useOverallSVGSize = true;
                        sheet.setLaserCutProfile({material: "Corflute", thickness: "3mm", profile: "Cut Through", quality: "Good Quality"});
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Corflute", thickness: "3mm", profile: "Cut Through", quality: "Good Quality"});
                        sheet.UPDATES_PAUSED = false;
                        sheet.typeLabel = "CORFLUTE POUNCE";

                        painting = this.#add(Painting, this.page1, [SVGCutfile, Coil]);
                        painting.UPDATES_PAUSED = true;
                        painting.formula = "10-20mmD Letters";
                        painting.numberOfCoats = "x2 (2K for Acrylic/ACM)";
                        painting.UPDATES_PAUSED = false;

                        artwork = this.#add(ArtworkSubscribable, this.page1, [SVGCutfile]);
                        artwork.artworkItem.artworkTime = 60;
                        install = this.#add(InstallSubscribable, this.page1, [Sheet]);
                        break;
                  case "3D 20mm Acrylic Letters":
                        productDetails = this.#add(ProductDetails, this.page1, []);
                        productDetails.productLocation = "";
                        productDetails.productName = "3D 20mm Acrylic Letters";

                        svgCutfile = this.#add(SVGCutfile, this.page1, []);

                        sheet = this.#add(Sheet, this.page1, [SVGCutfile]);
                        sheet.UPDATES_PAUSED = true;
                        sheet.material = "Acrylic";
                        sheet.sheetSize = "2440x1220";
                        sheet.thickness = "20";
                        sheet.sheetMaterial = "Acrylic - (sqm) - White/Black 2440x1220x20 (Mulfords)";
                        sheet.setCuttingMachine("laser");
                        sheet.sheetPerimeterIsCut = false;
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Acrylic", thickness: "20mm", profile: "Cut Through", quality: "Glossy Edge"});
                        sheet.UPDATES_PAUSED = false;
                        sheet.typeLabel = "ACRYLIC SHEET";

                        sheet = this.#add(Sheet, this.page1, [svgCutfile]);
                        sheet.UPDATES_PAUSED = true;
                        sheet.material = "Corflute";
                        sheet.sheetSize = "2440x1220";
                        sheet.sheetMaterial = "Corflute - (sqm) - 2440x1220x3.0 Matte White (Mulfords)";
                        sheet.useOverallSVGSize = true;
                        sheet.setLaserCutProfile({material: "Corflute", thickness: "3mm", profile: "Cut Through", quality: "Good Quality"});
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Corflute", thickness: "3mm", profile: "Cut Through", quality: "Good Quality"});
                        sheet.UPDATES_PAUSED = false;
                        sheet.typeLabel = "CORFLUTE POUNCE";

                        painting = this.#add(Painting, this.page1, [SVGCutfile, Coil]);
                        painting.UPDATES_PAUSED = true;
                        painting.formula = "10-20mmD Letters";
                        painting.numberOfCoats = "x2 (2K for Acrylic/ACM)";
                        painting.UPDATES_PAUSED = false;

                        artwork = this.#add(ArtworkSubscribable, this.page1, [SVGCutfile]);
                        artwork.artworkItem.artworkTime = 60;
                        install = this.#add(InstallSubscribable, this.page1, [Sheet]);
                        break;
                  case "2D Cut ACM Letters":
                        productDetails = this.#add(ProductDetails, this.page1, []);
                        productDetails.productLocation = "";
                        productDetails.productName = "2D Cut ACM Letters";

                        svgCutfile = this.#add(SVGCutfile, this.page1, []);

                        sheet = this.#add(Sheet, this.page1, [SVGCutfile]);
                        sheet.UPDATES_PAUSED = true;
                        sheet.material = "ACM";
                        sheet.sheetSize = "2440x1220";
                        sheet.thickness = "3";
                        //sheet.sheetMaterial = "";
                        sheet.setCuttingMachine("router");
                        sheet.sheetPerimeterIsCut = false;
                        sheet.addStaticRouterRow("pathLength", "numberOfPaths", {material: "ACM", thickness: "3mm", profile: "Cut Through", quality: "Good Quality"});
                        sheet.UPDATES_PAUSED = false;
                        sheet.typeLabel = "ACM SHEET";

                        sheet = this.#add(Sheet, this.page1, [svgCutfile]);
                        sheet.UPDATES_PAUSED = true;
                        sheet.material = "Corflute";
                        sheet.sheetSize = "2440x1220";
                        sheet.sheetMaterial = "Corflute - (sqm) - 2440x1220x3.0 Matte White (Mulfords)";
                        sheet.useOverallSVGSize = true;
                        sheet.setLaserCutProfile({material: "Corflute", thickness: "3mm", profile: "Cut Through", quality: "Good Quality"});
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Corflute", thickness: "3mm", profile: "Cut Through", quality: "Good Quality"});
                        sheet.UPDATES_PAUSED = false;
                        sheet.typeLabel = "CORFLUTE POUNCE";

                        artwork = this.#add(ArtworkSubscribable, this.page1, [SVGCutfile]);
                        artwork.artworkItem.artworkTime = 60;
                        install = this.#add(InstallSubscribable, this.page1, [Sheet]);
                        break;
                  default:
                        break;
            }
            this.#updateViewMode();
      }

      #add(classType, container, subscribeTo = []) {
            let newItem = new classType(container, this);
            newItem.productNumber = this.#getProductNumber();

            for(let sub of subscribeTo) {
                  if(typeof sub === 'function') {
                        // It’s a class (subscribe to last created of that type)
                        for(let i = this.#allMaterials.length - 1; i >= 0; i--) {
                              if(this.#allMaterials[i].constructor.name === sub.name) {
                                    newItem.SubscribeTo(this.#allMaterials[i]);
                                    break;
                              }
                        }
                  } else if(typeof sub === 'object' && sub !== null) {
                        // It’s an object instance (subscribe directly)
                        newItem.SubscribeTo(sub);
                  } else {
                        console.warn('Unknown subscription type:', sub);
                  }
            }

            this.#allMaterials.push(newItem);
            this.#UpdateFromFields();
            return newItem;
      }

      #addBlank(classType, container, options = {productNumber: null}) {
            let newItem = new classType(container, this);
            if(options.productNumber != null) newItem.productNumber = options.productNumber;

            this.#allMaterials.push(newItem);

            this.#UpdateFromFields();
      }

      #getProductNumber() {
            return this.#numProducts;
      }

      DeleteMaterial(materialObject) {
            console.log("delete material from PanelSigns.js" + materialObject);
            let type = materialObject.constructor.name;

            for(let i = 0; i < this.#allMaterials.length; i++) {
                  if(this.#allMaterials[i] == materialObject) {
                        this.#allMaterials.splice(i, 1);
                        break;
                  }
            }
            this.#UpdateFromFields();
      }

      DeleteProduct(productNumber) {
            console.log("delete product from PanelSigns.js");
            let materials = this.#allMaterials;
            for(let i = 0; i < materials.length; i++) {
                  if(materials[i].productNumber == productNumber) {
                        materials[i].Delete();
                        i--;
                  }
            }
            this.#numProducts--;
            this.#updateViewMode();
      }

      DeleteProductsAll() {
            for(let i = 0; i < this.#numProducts + 1; i++) {
                  this.DeleteProduct(i + 1);
            }
      }

      #UpdateFromFields() { }

      #toggleAllOpen() {
            for(let i = 0; i < this.#containers.length; i++) {
                  this.#containers[i].Maximize();
            }
            for(let i = 0; i < this.#productContainers.length; i++) {
                  this.#productContainers[i].Maximize();
            }
      }

      #toggleAllClosed() {
            for(let i = 0; i < this.#containers.length; i++) {
                  this.#containers[i].Minimize();
            }
            for(let i = 0; i < this.#productContainers.length; i++) {
                  this.#productContainers[i].Minimize();
            }
      }

      #updateViewMode() {
            for(let i = 0; i < this.#productContainers.length; i++) {
                  deleteElement(this.#productContainers[i].container);
            }
            for(let i = 0; i < this.#containers.length; i++) {
                  deleteElement(this.#containers[i].container);
            }
            if(this.#viewMode[1].value == "Per Type") {

                  this.#containers = [/*ProductDetails, Size, SVGCutfile, Sheet, Vinyl, Laminate, Coil, AppTaping, HandTrimming, PrintMounting, Finishing, ProductionSubscribable, ArtworkSubscribable, InstallSubscribable */];

                  for(let i = 0; i < this.#creationOrder.length; i++) {
                        let UIContainer = new UIContainerType3("", this.#creationOrder[i].DISPLAY_NAME, this.page1);

                        this.#containers.push(UIContainer);
                        let addBtn = createButton("Add +", "width:100px;min-height:30px;margin:0px;border:0px;", () => {
                              this.#addBlank(this.#creationOrder[i], this.#containers[i].contentContainer);
                        }, null);
                        UIContainer.addHeadingButtons(addBtn);
                  }
                  for(let x = 0; x < this.#containers.length; x++) {
                        let sameItemCount = 0;
                        for(let y = 0; y < this.#allMaterials.length; y++) {
                              let item = this.#allMaterials[y];
                              item.container.style.width = "calc(100% - 16px)";
                              if(item instanceof this.#creationOrder[x]) {
                                    if(sameItemCount == 0) {

                                    }
                                    sameItemCount++;
                                    this.#containers[x].contentContainer.appendChild(item.container);
                              }
                        }
                  }
            } else if(this.#viewMode[1].value == "Per Product") {
                  let uniqueProductNumbers = [];
                  this.#productContainers = [];

                  for(let i = 0; i < this.#allMaterials.length; i++) {
                        let item = this.#allMaterials[i];
                        //make unique list of product numbers
                        if(!uniqueProductNumbers.includes(item.productNumber)) uniqueProductNumbers.push(item.productNumber);
                  }
                  uniqueProductNumbers.sort((a, b) => a - b);

                  for(let i = 0; i < uniqueProductNumbers.length; i++) {
                        let currentProductNumber = uniqueProductNumbers[i];
                        //create product container
                        let newProductContainer = new UIContainerType3("max-height:450px;", "PRODUCT " + uniqueProductNumbers[i], this.page1);
                        newProductContainer.contentContainer.style.cssText += "max-height:10000px;";
                        newProductContainer.container.style.cssText += "max-height:10000px;";
                        this.#productContainers.push(newProductContainer);

                        newProductContainer.addHeadingButtons(createButton("x", "width:30px;height:30px;margin:0px;border:none;padding:2px;min-height:30px;float:right;background-color:" + COLOUR.Red + ";", () => {
                              this.DeleteProduct(currentProductNumber);
                        }, null));

                        let dropdown = createDropdown("Add", 0, "width:200px;height:30px;margin:0px;border:none;padding:0px;min-height:30px;float:right;", this.#creationOrder.map((item) => {
                              return createDropdownOption(item.name, item.name);
                        }), () => {
                              this.#addBlank(this.#creationOrder.filter((item) => item.name == dropdown.value)[0], newProductContainer.contentContainer, {productNumber: uniqueProductNumbers[i]});
                        });
                        newProductContainer.addHeadingButtons(dropdown);

                        //add items to it
                        for(let j = 0; j < this.#allMaterials.length; j++) {
                              let item = this.#allMaterials[j];
                              let itemContainer = item.container;
                              item.container.style.width = "calc(100% - 16px)";

                              if(item.productNumber != currentProductNumber) continue;

                              newProductContainer.contentContainer.appendChild(itemContainer);
                        }

                        new Sortable(newProductContainer.contentContainer, {
                              animation: 120,
                              group: 'shared',
                              swapThreshold: 1,
                              ghostClass: 'sortable-ghost',
                              direction: 'vertical',
                        });
                  }
            } else if(this.#viewMode[1].value == "Per Type2") {

                  this.#containers = [/*ProductDetails, Size, SVGCutfile, etc...*/];

                  for(let i = 0; i < this.#creationOrder.length; i++) {
                        let UIContainer = new Object();
                        let d = createDivStyle5("", this.#creationOrder[i].DISPLAY_NAME, this.page1);
                        UIContainer.container = d[0];
                        UIContainer.contentContainer = d[1];
                        this.#containers.push(UIContainer);
                        let addBtn = createButton("+", "width:50px;min-height:100%;margin:0px;border:0px;", () => {
                              this.#addBlank(this.#creationOrder[i], this.#containers[i].contentContainer);
                        }, UIContainer.contentContainer);
                  }
                  for(let x = 0; x < this.#containers.length; x++) {
                        let sameItemCount = 0;
                        for(let y = 0; y < this.#allMaterials.length; y++) {
                              let item = this.#allMaterials[y];
                              item.container.style.width = "calc(100% - 70px)";
                              if(item instanceof this.#creationOrder[x]) {
                                    if(sameItemCount == 0) {

                                    }
                                    sameItemCount++;
                                    this.#containers[x].contentContainer.appendChild(item.container);
                              }
                        }
                  }
            } else {
                  alert("Not supported");
            }
      }

      async CreateProduct(parent) {
            parent.minimize();

            let pNo = 0;
            let productNo = 0;
            let partIndex = 0;
            let productDescription = "";

            let uniqueProductNumbers = [];
            for(let i = 0; i < this.#allMaterials.length; i++) {
                  let item = this.#allMaterials[i];
                  //make unique list of product numbers
                  if(!uniqueProductNumbers.includes(item.productNumber)) uniqueProductNumbers.push(item.productNumber);
            }
            uniqueProductNumbers.sort((a, b) => a - b);

            for(let i = 0; i < uniqueProductNumbers.length; i++) {
                  let currentProductNumber = uniqueProductNumbers[i];

                  await AddBlankProduct();
                  productNo = getNumProducts();
                  partIndex = 0;

                  for(let j = 0; j < this.#allMaterials.length; j++) {
                        let item = this.#allMaterials[j];
                        if(item.productNumber != currentProductNumber) continue;

                        partIndex = await item.Create(productNo, partIndex);
                        if(item.Description() != "") productDescription += item.Description() + "<br>";
                  }

                  await setProductSummary(productNo, productDescription);
                  productDescription = "";
            }

            Ordui.Alert("done");
      }

      hide() {
            super.hide();

            if(this.#numProducts > 0) {
                  this.DeleteProductsAll();
            }
      }
}