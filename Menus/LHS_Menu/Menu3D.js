class Menu3D extends LHSMenuWindow {
      letterTypes = {
            illuminated: {
                  halo: {
                        name: "Halo",
                        image: "https://fabsigns.com.au/wp-content/uploads/2022/05/3d-lettering-signs-brisbane-011.jpg",
                        subType: {
                              rebate: {
                                    name: "test",
                                    image: "https://image.made-in-china.com/2f0j00VLbGvoirYzqh/Modern-Acrylic-Signboard-Letter-Signage-LED-3D-Letters.jpg"
                              }
                        }
                  },
                  frontLit: {
                        name: "Front Lit",
                        image: "https://image.made-in-china.com/2f0j00VLbGvoirYzqh/Modern-Acrylic-Signboard-Letter-Signage-LED-3D-Letters.jpg",
                        subType: {
                              rebate: {
                                    name: "Rebate",
                                    image: "https://image.made-in-china.com/2f0j00VLbGvoirYzqh/Modern-Acrylic-Signboard-Letter-Signage-LED-3D-Letters.jpg"
                              },
                              capping: {
                                    name: "Capping",
                                    image: "https://image.made-in-china.com/2f0j00VLbGvoirYzqh/Modern-Acrylic-Signboard-Letter-Signage-LED-3D-Letters.jpg"
                              },
                              resin: {
                                    name: "Resin",
                                    image: "https://image.made-in-china.com/2f0j00VLbGvoirYzqh/Modern-Acrylic-Signboard-Letter-Signage-LED-3D-Letters.jpg"
                              }
                        }
                  }
            },
            nonIlluminated: {
                  fabricated: {
                        name: "Fabricated",
                        image: "https://kenwhitesigns.co.uk/wp-content/uploads/2021/03/Built-up-individual-fascia-lettering.jpg",
                        subType: {
                              rebate: {
                                    name: "test",
                                    image: "https://image.made-in-china.com/2f0j00VLbGvoirYzqh/Modern-Acrylic-Signboard-Letter-Signage-LED-3D-Letters.jpg"
                              }
                        }
                  }
            }
      };

      #sheetContainer;
      #sheetMaterial;

      constructor(width, height, ID, windowTitle) {
            super(width, height, ID, windowTitle);
            this.addPages(1);

            var page = this.getPage(0);
            this.page1 = page;

            document.addEventListener("loadedPredefinedParts", () => {

                  let illuminationContainer = createDivStyle3(null, "Illumination", page)[1];

                  this.isIlluminated = createCheckbox_Infield("Is Illuminated", true, null, () => {
                        this.toggleIlluminated();
                        this.toggleSubType();
                  }, illuminationContainer, true);

                  this.typeContainer = createDivStyle3(null, "Type", page)[1];

                  var typeOptions = [];
                  Object.entries(this.letterTypes.illuminated).forEach(item => {
                        typeOptions.push([item[1].name, item[1].image]);
                  });
                  this.type = createDropdown_Infield_Icons_Search("Letter Type", 0, "width:90%;", 100, false, typeOptions, () => {this.toggleSubType();}, this.typeContainer);

                  var subTypeOptions = [];
                  Object.entries(this.letterTypes.illuminated.halo.subType).forEach(item => {
                        subTypeOptions.push([item[1].name, item[1].image]);
                  });
                  this.subType = createDropdown_Infield_Icons_Search("Sub Type", 0, "margin-left:50px;width:70%;", 100, false, subTypeOptions, () => { }, this.typeContainer);

                  //this.faceMaterial = document.createElement("div");
                  this.sizeComponent = new Size(page, null);
                  //this.sizeComponent.container.style = "";
                  //sizeContainer.appendChild(this.faceMaterial);
                  document.addEventListener("loadedPredefinedParts", () => {
                        //var replacement = new Size(sizeContainer, null);
                        //replacement.container.style = "";
                        //replacement.rowHeaderField(1).value = "Back";
                        //replacement.addMaterialRow();
                        //replacement.rowHeaderField(2).value = "Face";
                        //this.page1.replaceChild(replacement.container, this.faceMaterial);
                        //this.faceMaterial = replacement;

                        //setFieldHidden(true, this.faceMaterial.sheetsRequiredField[1], this.faceMaterial.sheetsRequiredField[0]);



                  });

                  this.#sheetContainer = createDivStyle3("max-height:450px;", "Sheets", page);
                  //this.#sheetMaterial = new Material(this.#sheetContainer[1], Sheet, this.sizeComponent);

                  let returnsContainer = createDivStyle3(null, "Returns", page)[1];

                  this.returnDepth = createDropdown_Infield("Return Depth", 0, null, [
                        createDropdownOption(30, 30),
                        createDropdownOption(40, 40),
                        createDropdownOption(50, 50),
                        createDropdownOption(80, 80),
                        createDropdownOption(100, 100),
                        createDropdownOption(150, 150),
                        createDropdownOption(200, 200)
                  ], () => { }, returnsContainer);

                  this.returnLength = createInput_Infield("Return Length", null, null, () => { }, returnsContainer, true, 100);

                  let bendContainer = createDivStyle3(null, "Bend & Tig Time", page)[1];

                  this.useTotalTimes = createCheckbox_Infield("Use Total Times", true, "width:40%;", () => {
                        this.bendProduction.productionTotalEach = "Total";
                  }, bendContainer, true);

                  this.usePerPathTimes = createCheckbox_Infield("Use Per-Path Times", false, "width:40%;", () => {
                        setFieldHidden(!this.usePerPathTimes[1].checked, this.numPaths[1], this.numPaths[0]);
                        this.bendProduction.productionTotalEach = "Each";
                  }, bendContainer, true);
                  checkboxesAddToSelectionGroup(true, this.useTotalTimes, this.usePerPathTimes);

                  this.numPaths = createInput_Infield("Number of Paths (Insides & Outsides)", null, "margin-left:50px;", () => { }, bendContainer, true, 100);
                  setFieldHidden(true, this.numPaths[1], this.numPaths[0]);

                  this.bendProduction = new Production(bendContainer, null, () => { });

                  this.LED = new LED(page, null, function() { }, "LEDs");
                  //this.LED.removeContainerStyles();
                  //this.LED.hideHeading();

                  this.createProductBtn = createButton("Create Product   " + "\u25BA", "width:100%;margin:0px;", () => {this.createProduct(this);});
                  this.footer.appendChild(this.createProductBtn);
            });
      }

      toggleIlluminated = () => {
            var typeOptions = [];
            Object.entries(this.isIlluminated[1].checked ? this.letterTypes.illuminated : this.letterTypes.nonIlluminated).forEach(item => {
                  typeOptions.push([item[1].name, item[1].image]);
            });
            var newType = createDropdown_Infield_Icons_Search("Letter Type", 0, "width:90%;", 100, false, typeOptions, () => {this.toggleSubType();}, this.page1);
            this.page1.replaceChild(newType[0], this.type[0]);
            this.type = newType;

      };

      toggleSubType = () => {
            var subTypeOptions = [];

            var illumination = this.isIlluminated[1].checked ? this.letterTypes.illuminated : this.letterTypes.nonIlluminated;
            const keys = Object.keys(illumination);
            var type;
            keys.forEach(key => {
                  if(illumination[key].name === this.type[1].value) {
                        type = illumination[key];
                  }
            });
            var subType = type.subType;

            Object.entries(subType).forEach(item => {
                  subTypeOptions.push([item[1].name, item[1].image]);
            });
            var newType = createDropdown_Infield_Icons_Search("Sub Type", 0, "margin-left:50px;width:70%;", 100, false, subTypeOptions, () => { }, this.typeContainer);
            this.typeContainer.replaceChild(newType[0], this.subType[0]);
            this.subType = newType;
      };

      show() {
            super.show();

            this.doesTick = true;
      }

      hide() {
            super.hide();
      }

      tick() {
            this.fieldChangeUpdate();
      }

      fieldChangeUpdate() {
      }

      async createProduct() {
            this.minimize();
            Ordui.Alert("done");
      }

}