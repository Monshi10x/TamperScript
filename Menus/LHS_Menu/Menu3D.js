class Menu3D extends LHSMenuWindow {

      /** @ViewMode */
      #viewMode;
      #numProducts = 0;
      #creationOrder = [ProductDetails, Size, SVGCutfile, Coil, Sheet, LED, Transformer, Painting, Vinyl, Laminate, AppTaping, HandTrimming, PrintMounting, Finishing, ProductionSubscribable, ArtworkSubscribable, InstallSubscribable];


      /** @QuickTemplate */
      addQuickTemplateBtn;
      #createProductBtn;
      /**
       * @Size
       */
      #sizeContainer;
      addSizeBtn;
      #sizeArray = [];
      /**
       * @Sheet
       */
      #sheetContainer;
      addSheetBtn;
      /**
       * @Vinyl
       */
      #vinylContainer;
      addVinylBtn;
      /**
       * @Laminate
       */
      #laminateContainer;
      addLaminateBtn;
      /**
       * @AppTape
       */
      #appTapingContainer;
      #appTapingBtn;
      /**
       * @HandTrimming
       */
      #handTrimmingContainer;
      addHandTrimmingBtn;
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
      addProductionBtn;
      /**
       * @Artwork
       */
      #artwork;
      #artworkContainer;
      addArtworkBtn;
      /**
       * @Install
       */
      #install;
      #installContainer;
      addInstallBtn;
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
            ["10mm Push-through Box", "https://cdn.gorilladash.com/images/media/3752855/signarama-australia-atco-small-fascia-resized-thumbnail-5f38fe9719f20.jpg"],
            ["3D Non-lit Letters", "https://cdn.gorilladash.com/images/media/3752855/signarama-australia-atco-small-fascia-resized-thumbnail-5f38fe9719f20.jpg"],
            ["3D Front-lit Letters", "https://cdn.gorilladash.com/images/media/12562260/signarama-australia-homeco-cafe-63-lightbox-thumbnail-663186cf397a7.jpg"],
            ["3D Halo-lit Letters", GM_getResourceURL("Image_FrostyBoyHalo")],
            ["3D 10mm Acrylic Letters", "https://cdn.gorilladash.com/images/media/5077109/signarama-australia-img-1060-2-small-square-61611e488aba9.jpg?auto=webp&width=1600"],
            ["3D 20mm Acrylic Letters", GM_getResourceURL("Image_FrostyBoy3D")],
            ["2D Cut ACM Letters", GM_getResourceURL("Image_DJJCutACM")],
            ["2D Cut ACM Letters With Vinyl", GM_getResourceURL("Image_DJJCutACM")]
      ];


      constructor(width, height, ID, windowTitle) {
            super(width, height, ID, windowTitle);
            this.addPages(1);

            this.page1 = this.getPage(0);

            document.addEventListener("loadedPredefinedParts", () => {
                  /*
                  ToggleOpen */
                  let toggleOpenBtn = createButton("Open All", "width:20%;height:40px;margin:0px;", () => {this.toggleAllOpen();}, this.page1);
                  /*
                  ToggleClosed */
                  let toggleClosedBtn = createButton("Close All", "width:20%;height:40px;margin:0px;", () => {this.toggleAllClosed();}, this.page1);

                  this.addQuickTemplateBtn = createDropdown_Infield_Icons_Search("Add Quick Template Product", 0, "width:40%;height:35px;margin:0px;box-sizing:border-box;", 150, false,
                        this.quickTemplates,
                        () => {this.addQuickTemplate();},
                        this.page1, false
                  );

                  this.#viewMode = createDropdown_Infield('View Mode', 1, "width:calc(20% - 2px);height:35px;margin:0px;box-sizing:border-box;", [createDropdownOption("Per Type", "Per Type"), createDropdownOption("Per Product", "Per Product"), createDropdownOption("Per Type2", "Per Type2")], () => {this.updateViewMode();}, this.page1);
            });

            this.#createProductBtn = createButton("Create Product   " + "\u25BA", "width:100%;margin:0px;", () => {this.CreateProduct(this);});
            this.footer.appendChild(this.#createProductBtn);
      }

      addQuickTemplate() {
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

            switch(this.addQuickTemplateBtn[1].value) {
                  case "10mm Push-through Box":
                        productDetails = this.add(ProductDetails, this.page1, [], {
                              propertiesToAssign: {
                                    productName: "3D Fabricated Non-lit Letters"
                              }
                        });
                        let svgCutfile_lettersOnly = this.add(SVGCutfile, this.page1, [], {
                              propertiesToAssign: {
                                    typeLabel: "SVG Letters Only"
                              }
                        });
                        let svgCutfile_lettersWithVinyl = this.add(SVGCutfile, this.page1, [], {
                              propertiesToAssign: {
                                    typeLabel: "Letters with Vinyl"
                              }
                        });
                        let svgCutfile_sheetWithLetterCutout = this.add(SVGCutfile, this.page1, [], {
                              propertiesToAssign: {
                                    typeLabel: "Sheet with Letter Cut-outs"
                              }
                        });

                        sheet = this.add(Sheet, this.page1, [svgCutfile_lettersOnly], {
                              propertiesToAssign: {
                                    material: "Acrylic",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "Acrylic - (sqm) - Opal 2440x1220x10 (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    sheetPerimeterIsCut: false,
                                    preferredCuttingMachine: "laser",
                                    typeLabel: "10mm OPAL ACRYLIC"
                              }
                        });
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Acrylic", thickness: "10", profile: "Cut Through", quality: "Good Quality"});

                        vinyl = this.add(Vinyl, this.page1, [svgCutfile_lettersWithVinyl], {
                              propertiesToAssign: {
                                    bleedDropdown: "ACM",
                                    material: "Vinyl - Translucent Cast Colours (Avery 5500) - 6-8 yrs",
                                    rollWidth: 1230
                              },
                        });

                        sheet = this.add(Sheet, this.page1, [svgCutfile_lettersOnly], {
                              propertiesToAssign: {
                                    material: "Acrylic",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "Acrylic - (sqm) - Opal 2440x1220x3 (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    sheetPerimeterIsCut: false,
                                    preferredCuttingMachine: "laser",
                                    typeLabel: "3mm OPAL ACRYLIC"
                              }
                        });
                        sheet.addStaticLaserRow("boundingPerimeter", "1", {material: "Acrylic", thickness: "4.5", profile: "Cut Through", quality: "Good Quality"});

                        sheet = this.add(Sheet, this.page1, [svgCutfile_sheetWithLetterCutout], {
                              propertiesToAssign: {
                                    material: "ACM",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "ACM - (sqm) - 2440x1220x3x0.21 White Satin/Gloss (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    sheetPerimeterIsCut: false,
                                    preferredCuttingMachine: "router",
                                    typeLabel: "ACM Folded Sheet"
                              }
                        });
                        sheet.addStaticLaserRow("boundingPerimeter", "1", {material: "Acrylic", thickness: "4.5", profile: "Cut Through", quality: "Good Quality"});



                        led = this.add(LED, this.page1, [svgCutfile_lettersOnly], {
                              propertiesToAssign: {
                                    formula: "3D Letters 100D - 200 per m2",
                                    material: "LED Module - 6500K 1.08W 5yr 175deg 12V"
                              }
                        });
                        led.showRequiresInputTag(true);

                        sheet = this.add(Sheet, this.page1, [svgCutfile_sheetWithLetterCutout, led], {
                              propertiesToAssign: {
                                    material: "ACM",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "ACM - (sqm) - 2440x1220x2x0.15 White Satin/White Gloss (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    typeLabel: "ACM for LEDs",
                                    sheetPerimeterIsCut: false
                              }
                        });
                        sheet.addStaticRouterRow("pathLength", "numberOfPaths", {material: "ACM", thickness: "2", profile: "Cut Through", quality: "Fast"});

                        transformer = this.add(Transformer, this.page1, [LED]);

                        production = this.add(ProductionSubscribable, this.page1, [Coil], {
                              propertiesToAssign: {
                                    typeLabel: "Assembly"
                              }
                        });
                        production.showRequiresInputTag(true);

                        artwork = this.add(ArtworkSubscribable, this.page1, [SVGCutfile]);
                        artwork.artworkItem.artworkTime = 60;
                        install = this.add(InstallSubscribable, this.page1, [Sheet]);
                        break;

                  case "3D Non-lit Letters":
                        productDetails = this.add(ProductDetails, this.page1, [], {
                              propertiesToAssign: {
                                    productName: "3D Fabricated Non-lit Letters"
                              }
                        });

                        svgCutfile = this.add(SVGCutfile, this.page1, []);

                        coil = this.add(Coil, this.page1, [SVGCutfile]);

                        production = this.add(ProductionSubscribable, this.page1, [Coil], {
                              propertiesToAssign: {
                                    typeLabel: "LASER WELD PRODUCTION"
                              }
                        });
                        production.showRequiresInputTag(true);

                        sheet = this.add(Sheet, this.page1, [SVGCutfile], {
                              propertiesToAssign: {
                                    material: "Stainless",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "Stainless - (sqm) - 2440x1220x1.2 2B (Vulcan)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    sheetPerimeterIsCut: false,
                                    typeLabel: "STAINLESS SHEET"
                              }
                        });
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Stainless", thickness: "1.2", profile: "Cut Through", quality: "Good Quality"});

                        sheet = this.add(Sheet, this.page1, [SVGCutfile], {
                              propertiesToAssign: {
                                    material: "Foamed PVC",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "Foamed PVC - (sqm) - 2440x1220x10 Matte White (Signex Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    sheetPerimeterIsCut: false,
                                    typeLabel: "CELUKA SHEET"
                              }
                        });
                        sheet.addStaticRouterRow("pathLength", "numberOfPaths", {material: "Foamed PVC", thickness: "10", profile: "Cut Through", quality: "Good Quality"});

                        sheet = this.add(Sheet, this.page1, [SVGCutfile], {
                              propertiesToAssign: {
                                    material: "Corflute",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "Corflute - (sqm) - 2440x1220x3 Matte White (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    useOverallSVGSize: true,
                                    typeLabel: "CORFLUTE POUNCE",
                              }
                        });
                        sheet.setLaserCutProfile({material: "Corflute", thickness: "3", profile: "Cut Through", quality: "Good Quality"});
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Corflute", thickness: "3", profile: "Cut Through", quality: "Good Quality"});

                        painting = this.add(Painting, this.page1, [SVGCutfile, Coil], {
                              propertiesToAssign: {
                                    formula: "Fabricated NON-LIT Letters",
                                    numberOfCoats: "x3 (2K for Raw Metals Alum/Steel/Stainless...)"
                              }
                        });

                        artwork = this.add(ArtworkSubscribable, this.page1, [SVGCutfile]);
                        artwork.artworkItem.artworkTime = 60;
                        install = this.add(InstallSubscribable, this.page1, [Sheet]);
                        break;
                  case "3D Front-lit Letters":
                        productDetails = this.add(ProductDetails, this.page1, [], {
                              propertiesToAssign: {
                                    productName: "3D Fabricated Front-lit Letters"
                              }
                        });

                        svgCutfile = this.add(SVGCutfile, this.page1, []);

                        coil = this.add(Coil, this.page1, [SVGCutfile]);

                        production = this.add(ProductionSubscribable, this.page1, [Coil], {
                              propertiesToAssign: {
                                    typeLabel: "LASER WELD PRODUCTION"
                              }
                        });
                        production.showRequiresInputTag(true);

                        sheet = this.add(Sheet, this.page1, [SVGCutfile], {
                              propertiesToAssign: {
                                    material: "Stainless",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "Stainless - (sqm) - 2440x1220x1.2 2B (Vulcan)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    sheetPerimeterIsCut: false,
                                    typeLabel: "STAINLESS SHEET"
                              }
                        });
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Stainless", thickness: "1.2", profile: "Cut Through", quality: "Good Quality"});

                        sheet = this.add(Sheet, this.page1, [SVGCutfile], {
                              propertiesToAssign: {
                                    material: "Acrylic",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "Acrylic - (sqm) - Opal 2440x1220x10 (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    sheetPerimeterIsCut: false,
                                    typeLabel: "OPAL FACE SHEET"
                              }
                        });
                        sheet.addStaticRouterRow("pathLength", "numberOfPaths", {material: "Acrylic", thickness: "10", profile: "Opal Cut Through And Rebate", quality: "Good Quality"});


                        led = this.add(LED, this.page1, [SVGCutfile], {
                              propertiesToAssign: {
                                    formula: "3D Letters 100D - 200 per m2",
                                    material: "LED Module - 6500K 1.08W 5yr 175deg 12V"
                              }
                        });

                        sheet = this.add(Sheet, this.page1, [svgCutfile, led], {
                              propertiesToAssign: {
                                    material: "ACM",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "ACM - (sqm) - 2440x1220x2x0.15 White Satin/White Gloss (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    typeLabel: "ACM for LEDs",
                                    sheetPerimeterIsCut: false
                              }
                        });
                        sheet.addStaticRouterRow("pathLength", "numberOfPaths", {material: "ACM", thickness: "2", profile: "Cut Through", quality: "Fast"});

                        transformer = this.add(Transformer, this.page1, [LED]);

                        sheet = this.add(Sheet, this.page1, [svgCutfile], {
                              propertiesToAssign: {
                                    material: "Corflute",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "Corflute - (sqm) - 2440x1220x3 Matte White (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    useOverallSVGSize: true,
                                    typeLabel: "CORFLUTE POUNCE"
                              }
                        });
                        sheet.setLaserCutProfile({material: "Corflute", thickness: "3", profile: "Cut Through", quality: "Good Quality"});
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Corflute", thickness: "3", profile: "Cut Through", quality: "Good Quality"});


                        painting = this.add(Painting, this.page1, [SVGCutfile, Coil], {
                              propertiesToAssign: {
                                    formula: "Fabricated FRONT-LIT Letters",
                                    numberOfCoats: "x3 (2K for Raw Metals Alum/Steel/Stainless...)"
                              }
                        });

                        artwork = this.add(ArtworkSubscribable, this.page1, [SVGCutfile]);
                        artwork.artworkItem.artworkTime = 60;
                        install = this.add(InstallSubscribable, this.page1, [Sheet]);
                        break;
                  case "3D Halo-lit Letters":
                        productDetails = this.add(ProductDetails, this.page1, [], {
                              propertiesToAssign: {
                                    productName: "3D Fabricated Halo-lit Letters"
                              }
                        });

                        svgCutfile = this.add(SVGCutfile, this.page1, []);

                        coil = this.add(Coil, this.page1, [SVGCutfile]);

                        production = this.add(ProductionSubscribable, this.page1, [Coil], {
                              propertiesToAssign: {
                                    typeLabel: "LASER WELD PRODUCTION"
                              }
                        });
                        production.showRequiresInputTag(true);

                        sheet = this.add(Sheet, this.page1, [SVGCutfile], {
                              propertiesToAssign: {
                                    material: "Stainless",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "Stainless - (sqm) - 2440x1220x1.2 2B (Vulcan)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    sheetPerimeterIsCut: false,
                                    typeLabel: "STAINLESS SHEET"
                              }
                        });
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Stainless", thickness: "1.2", profile: "Cut Through", quality: "Good Quality"});


                        sheet = this.add(Sheet, this.page1, [SVGCutfile], {
                              propertiesToAssign: {
                                    material: "Acrylic",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "Acrylic - (sqm) - Opal 2440x1220x10 (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    sheetPerimeterIsCut: false,
                                    typeLabel: "OPAL BACK SHEET"
                              }
                        });
                        sheet.addStaticRouterRow("pathLength", "numberOfPaths", {material: "Acrylic", thickness: "10", profile: "Opal Cut Through And Rebate", quality: "Good Quality"});

                        led = this.add(LED, this.page1, [SVGCutfile], {
                              propertiesToAssign: {
                                    formula: "3D Letters 100D - 200 per m2",
                                    material: "LED Module - 6500K 1.08W 5yr 175deg 12V"
                              }
                        });

                        sheet = this.add(Sheet, this.page1, [svgCutfile, led], {
                              propertiesToAssign: {
                                    material: "ACM",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "ACM - (sqm) - 2440x1220x2x0.15 White Satin/White Gloss (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    typeLabel: "ACM for LEDs",
                                    sheetPerimeterIsCut: false
                              }
                        });
                        sheet.addStaticRouterRow("pathLength", "numberOfPaths", {material: "ACM", thickness: "2", profile: "Cut Through", quality: "Fast"});

                        transformer = this.add(Transformer, this.page1, [LED]);

                        sheet = this.add(Sheet, this.page1, [SVGCutfile], {
                              propertiesToAssign: {
                                    material: "Corflute",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "Corflute - (sqm) - 2440x1220x3 Matte White (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    useOverallSVGSize: true,
                                    typeLabel: "CORFLUTE POUNCE",
                              }
                        });
                        sheet.setLaserCutProfile({material: "Corflute", thickness: "3", profile: "Cut Through", quality: "Good Quality"});
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Corflute", thickness: "3", profile: "Cut Through", quality: "Good Quality"});


                        painting = this.add(Painting, this.page1, [SVGCutfile, Coil], {
                              propertiesToAssign: {
                                    formula: "Fabricated BACK-LIT Letters",
                                    numberOfCoats: "x3 (2K for Raw Metals Alum/Steel/Stainless...)"
                              }
                        });

                        artwork = this.add(ArtworkSubscribable, this.page1, [SVGCutfile]);
                        artwork.artworkItem.artworkTime = 60;
                        install = this.add(InstallSubscribable, this.page1, [Sheet]);
                        break;
                  case "3D 10mm Acrylic Letters":
                        productDetails = this.add(ProductDetails, this.page1, [], {
                              propertiesToAssign: {
                                    productName: "3D 10mm Acrylic Letters"
                              }
                        });

                        svgCutfile = this.add(SVGCutfile, this.page1, []);


                        sheet = this.add(Sheet, this.page1, [SVGCutfile], {
                              propertiesToAssign: {
                                    material: "Acrylic",
                                    sheetSize: "2440x1220",
                                    thickness: "10",
                                    sheetMaterial: "Acrylic - (sqm) - White/Black 2440x1220x10 (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    preferredCuttingMachine: "laser",
                                    sheetPerimeterIsCut: false,
                                    typeLabel: "ACRYLIC SHEET"
                              }
                        });
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Acrylic", thickness: "10", profile: "Cut Through", quality: "Glossy Edge"});


                        sheet = this.add(Sheet, this.page1, [svgCutfile], {
                              propertiesToAssign: {
                                    material: "Corflute",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "Corflute - (sqm) - 2440x1220x3 Matte White (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    useOverallSVGSize: true,
                                    typeLabel: "CORFLUTE POUNCE"
                              }
                        });
                        sheet.setLaserCutProfile({material: "Corflute", thickness: "3", profile: "Cut Through", quality: "Good Quality"});
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Corflute", thickness: "3", profile: "Cut Through", quality: "Good Quality"});


                        painting = this.add(Painting, this.page1, [SVGCutfile, Coil], {
                              propertiesToAssign: {
                                    formula: "10-20mmD Letters",
                                    numberOfCoats: "x2 (2K for Acrylic/ACM)"
                              }
                        });

                        artwork = this.add(ArtworkSubscribable, this.page1, [SVGCutfile]);
                        artwork.artworkItem.artworkTime = 60;
                        install = this.add(InstallSubscribable, this.page1, [Sheet]);
                        break;
                  case "3D 20mm Acrylic Letters":
                        productDetails = this.add(ProductDetails, this.page1, [], {
                              propertiesToAssign: {
                                    productName: "3D 20mm Acrylic Letters"
                              }
                        });

                        svgCutfile = this.add(SVGCutfile, this.page1, []);


                        sheet = this.add(Sheet, this.page1, [SVGCutfile], {
                              propertiesToAssign: {
                                    material: "Acrylic",
                                    sheetSize: "2440x1220",
                                    thickness: "20",
                                    sheetMaterial: "Acrylic - (sqm) - White/Black 2440x1220x20 (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    preferredCuttingMachine: "laser",
                                    sheetPerimeterIsCut: false,
                                    typeLabel: "ACRYLIC SHEET"
                              }
                        });
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Acrylic", thickness: "20", profile: "Cut Through", quality: "Glossy Edge"});


                        sheet = this.add(Sheet, this.page1, [svgCutfile], {
                              propertiesToAssign: {
                                    material: "Corflute",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "Corflute - (sqm) - 2440x1220x3 Matte White (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    useOverallSVGSize: true,
                                    typeLabel: "CORFLUTE POUNCE"
                              }
                        });
                        sheet.setLaserCutProfile({material: "Corflute", thickness: "3", profile: "Cut Through", quality: "Good Quality"});
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Corflute", thickness: "3", profile: "Cut Through", quality: "Good Quality"});


                        painting = this.add(Painting, this.page1, [SVGCutfile, Coil], {
                              propertiesToAssign: {
                                    formula: "10-20mmD Letters",
                                    numberOfCoats: "x2 (2K for Acrylic/ACM)"
                              }
                        });

                        artwork = this.add(ArtworkSubscribable, this.page1, [SVGCutfile]);
                        artwork.artworkItem.artworkTime = 60;
                        install = this.add(InstallSubscribable, this.page1, [Sheet]);
                        break;
                  case "2D Cut ACM Letters":
                        productDetails = this.add(ProductDetails, this.page1, [], {
                              propertiesToAssign: {
                                    productName: "2D Cut ACM Letters"
                              }
                        });

                        svgCutfile = this.add(SVGCutfile, this.page1, []);

                        sheet = this.add(Sheet, this.page1, [svgCutfile], {
                              propertiesToAssign: {
                                    material: "ACM",
                                    sheetSize: "2440x1220",
                                    thickness: "3x0.21",
                                    sheetMaterial: "ACM - (sqm) - 2440x1220x3x0.21 White Satin/Gloss (Mulfords)",
                                    preferredCuttingMachine: "router",
                                    sheetPerimeterIsCut: false,
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    typeLabel: "ACM SHEET"
                              }
                        });
                        sheet.addStaticRouterRow("pathLength", "numberOfPaths", {material: "ACM", thickness: "3", profile: "Cut Through", quality: "Good Quality"});

                        sheet = this.add(Sheet, this.page1, [svgCutfile], {
                              propertiesToAssign: {
                                    material: "Corflute",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "Corflute - (sqm) - 2440x1220x3 Matte White (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    useOverallSVGSize: true,
                                    typeLabel: "CORFLUTE POUNCE"
                              }
                        });
                        sheet.setLaserCutProfile({material: "Corflute", thickness: "3", profile: "Cut Through", quality: "Good Quality"});
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Corflute", thickness: "3", profile: "Cut Through", quality: "Good Quality"});


                        artwork = this.add(ArtworkSubscribable, this.page1, [SVGCutfile]);
                        artwork.artworkItem.artworkTime = 60;
                        install = this.add(InstallSubscribable, this.page1, [Sheet]);
                        break;
                  case "2D Cut ACM Letters With Vinyl":
                        productDetails = this.add(ProductDetails, this.page1, [], {
                              propertiesToAssign: {
                                    productName: "2D Cut ACM Letters"
                              }
                        });

                        svgCutfile = this.add(SVGCutfile, this.page1, []);

                        let acmSheet = this.add(Sheet, this.page1, [svgCutfile], {
                              propertiesToAssign: {
                                    material: "ACM",
                                    sheetSize: "2440x1220",
                                    thickness: "3x0.21",
                                    sheetMaterial: "ACM - (sqm) - 2440x1220x3x0.21 White Satin/Gloss (Mulfords)",
                                    preferredCuttingMachine: "router",
                                    sheetPerimeterIsCut: false,
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    typeLabel: "ACM SHEET"
                              }
                        });
                        acmSheet.addStaticRouterRow("pathLength", "numberOfPaths", {material: "ACM", thickness: "3", profile: "Cut Through", quality: "Good Quality"});

                        sheet = this.add(Sheet, this.page1, [svgCutfile], {
                              propertiesToAssign: {
                                    material: "Corflute",
                                    sheetSize: "2440x1220",
                                    sheetMaterial: "Corflute - (sqm) - 2440x1220x3 Matte White (Mulfords)",
                                    joinMethod: Sheet.joinMethod["Full Sheet + Offcut"],
                                    useOverallSVGSize: true,
                                    typeLabel: "CORFLUTE POUNCE"
                              }
                        });
                        sheet.setLaserCutProfile({material: "Corflute", thickness: "3", profile: "Cut Through", quality: "Good Quality"});
                        sheet.addStaticLaserRow("pathLength", "numberOfPaths", {material: "Corflute", thickness: "3", profile: "Cut Through", quality: "Good Quality"});

                        vinyl = this.add(Vinyl, this.page1, [acmSheet], {
                              propertiesToAssign: {
                                    bleedDropdown: "ACM",
                                    rollWidth: 1600
                              },
                        });
                        laminate = this.add(Laminate, this.page1, [Vinyl]);
                        printMounting = this.add(PrintMounting, this.page1, [Sheet]);

                        artwork = this.add(ArtworkSubscribable, this.page1, [SVGCutfile]);
                        artwork.artworkItem.artworkTime = 60;
                        install = this.add(InstallSubscribable, this.page1, [Sheet]);
                        break;
                  default:
                        break;
            }
            this.updateViewMode();
      }

      add(classType, container, subscribeTo = [], options = {
            UPDATES_PAUSED: true,
            propertiesToAssign: {
                  //material: "ACM",
                  //sheetSize: "2440x1220",
                  //sheetMaterial: "ACM - (sqm) - 2440x1220x3x0.21 Primer/Primer (Mulfords)",
                  //typeLabel: "ACM SHEET"
            },
            itemUpdateOnCompletion: true
      }) {
            let newItem = new classType(container, this, options);
            newItem.productNumber = this.getProductNumber();

            Object.assign(newItem, options.propertiesToAssign);

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

            if(options.itemUpdateOnCompletion) {
                  newItem.UPDATES_PAUSED = false;
                  newItem.UpdateFromFields();
            }

            this.#allMaterials.push(newItem);
            this.UpdateFromFields();

            return newItem;
      }

      addBlank(classType, container, options = {productNumber: null}) {
            let newItem = new classType(container, this);
            if(options.productNumber != null) newItem.productNumber = options.productNumber;

            this.#allMaterials.push(newItem);

            this.UpdateFromFields();
      }

      getProductNumber() {
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
            this.UpdateFromFields();
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
            this.updateViewMode();
      }

      DeleteProductsAll() {
            for(let i = 0; i < this.#numProducts + 1; i++) {
                  this.DeleteProduct(i + 1);
            }
      }

      UpdateFromFields() { }

      toggleAllOpen() {
            for(let i = 0; i < this.#containers.length; i++) {
                  this.#containers[i].Maximize();
            }
            for(let i = 0; i < this.#productContainers.length; i++) {
                  this.#productContainers[i].Maximize();
            }
      }

      toggleAllClosed() {
            for(let i = 0; i < this.#containers.length; i++) {
                  this.#containers[i].Minimize();
            }
            for(let i = 0; i < this.#productContainers.length; i++) {
                  this.#productContainers[i].Minimize();
            }
      }

      updateViewMode() {
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
                              this.addBlank(this.#creationOrder[i], this.#containers[i].contentContainer);
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

                        const dropdown = new TDropdown({
                              label: 'Add Component',
                              defaultValue: '',
                              options:
                                    this.#creationOrder.map((item) => {
                                          return {label: item.name, value: item.name, img: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/refs/heads/main/Images/Icon-Component.svg'};
                                    }),
                              parent: null,
                              onChange: (val) => {
                                    if(val != "") {
                                          this.addBlank(this.#creationOrder.filter((item) => item.name == val)[0], newProductContainer.contentContainer, {productNumber: uniqueProductNumbers[i]});
                                    }
                              }
                        });
                        newProductContainer.addHeadingButtons(dropdown.wrapper);

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
                              handle: ".sortableHandle"
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
                              this.addBlank(this.#creationOrder[i], this.#containers[i].contentContainer);
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

            Toast.notify("done", 3000, {position: "top-right"});
      }

      hide() {
            super.hide();

            if(this.#numProducts > 0) {
                  this.DeleteProductsAll();
            }
      }
}
