class VehicleTemplate extends SubMenu {
      UNIQUEID = "VEHICLE_TEMPLATE-" + generateUniqueID();
      uniqueKeys = ["panel", "vinyl", "laminate"];
      appTapeIsSumOfAll = true;

      constructor(parentObject, ctx, updateFunction, fieldChangeUpdateFunction, fieldDeleteFunction) {
            super(parentObject, ctx, updateFunction, "Vehicle Template");

            this.createGUI(parentObject, updateFunction, fieldChangeUpdateFunction, fieldDeleteFunction);
      }

      blankTemplates = blankVehicleTemplates;
      predefinedTemplates = predefinedVehicleTemplates;

      createGUI(parentObject, updateFunction, fieldChangeFunction, fieldDeleteFunction) {
            this.rowID = 0;
            this.fieldChangeFunction = fieldChangeFunction;
            this.fieldDeleteFunction = fieldDeleteFunction;
            this.parentObject = parentObject;

            var tempThis = this;
            this.l_wordingSpecific = createCheckbox_Infield("Use Vinyl Specifics in wording", false, "width:300px;float:left;", () => {tempThis.useSpecificsInWording = tempThis.l_wordingSpecific[1].checked;}, this.contentContainer);

            createHeading_Numbered(1, "Choose Template", "width:97%", this.contentContainer);

            this.l_standardCustom = createDropdown_Infield("Standard or Custom", 0, "", [createDropdownOption("Standard", "Standard"), createDropdownOption("Custom", "Custom")], this.changeStandardCustom, this.contentContainer);
            var dropdownItems_types = [];
            for(var l = 0; l < this.predefinedTemplates.length; l++) {
                  dropdownItems_types.push(createDropdownOption(this.predefinedTemplates[l][0], this.predefinedTemplates[l][0]));
            }
            this.l_vehicleTypes = createDropdown_Infield("Vehicle Type", 0, "", dropdownItems_types, this.changeVehicleTypes, this.contentContainer);

            this.l_predefinedTemplate = createDropdown_Infield("Predefined Templates", 0, "", this.predefinedTemplateNames, this.callback, this.contentContainer);

            var dropdownItems = [];
            for(var t = 0; t < this.blankTemplates.length; t++) {
                  dropdownItems.push(createDropdownOption(this.blankTemplates[t][0], this.blankTemplates[t][0]));
            }

            this.l_customTemplate = createDropdown_Infield("Custom Template", 0, "margin-left:50px;margin-right:70%", dropdownItems, this.callback, this.contentContainer);
            setFieldDisabled(true, this.l_customTemplate[1], this.l_customTemplate[0]);
            setFieldHidden(true, this.l_customTemplate[1], this.l_customTemplate[0]);

            createHeading_Numbered(2, "Rows", "width:97%", this.contentContainer);

            this.l_itemsContainer = document.createElement("div");
            this.l_itemsContainer.style = "width:100%;min-height:50px;background-color:white;display:block;float:left;";
            this.contentContainer.appendChild(this.l_itemsContainer);
      }

      changeVehicleTypes = () => {
            $(this.l_predefinedTemplate[1]).empty();
            var newTemplates = this.predefinedTemplateNames;
            if(newTemplates != []) {
                  for(var x = 0; x < newTemplates.length; x++) {
                        this.l_predefinedTemplate[1].add(newTemplates[x]);
                  }
            }
            this.callback();
      };

      changeStandardCustom = () => {
            if(this.l_standardCustom[1].value == "Standard") {
                  setFieldDisabled(true, this.l_customTemplate[1], this.l_customTemplate[0]);
                  setFieldHidden(true, this.l_customTemplate[1], this.l_customTemplate[0]);
                  setFieldDisabled(false, this.l_vehicleTypes[1], this.l_vehicleTypes[0]);
                  setFieldHidden(false, this.l_vehicleTypes[1], this.l_vehicleTypes[0]);
                  setFieldDisabled(false, this.l_predefinedTemplate[1], this.l_predefinedTemplate[0]);
                  setFieldHidden(false, this.l_predefinedTemplate[1], this.l_predefinedTemplate[0]);
                  this.changeVehicleTypes();
            } else {
                  setFieldDisabled(false, this.l_customTemplate[1], this.l_customTemplate[0]);
                  setFieldHidden(false, this.l_customTemplate[1], this.l_customTemplate[0]);
                  setFieldDisabled(true, this.l_vehicleTypes[1], this.l_vehicleTypes[0]);
                  setFieldHidden(true, this.l_vehicleTypes[1], this.l_vehicleTypes[0]);
                  setFieldDisabled(true, this.l_predefinedTemplate[1], this.l_predefinedTemplate[0]);
                  setFieldHidden(true, this.l_predefinedTemplate[1], this.l_predefinedTemplate[0]);
            }
            this.callback();
      };

      get predefinedTemplateNames() {
            var items = [];
            var vehicleTypesIndex = this.l_vehicleTypes[1].selectedIndex;
            var numberPredefinedTemplates = this.predefinedTemplates[vehicleTypesIndex].length - 4;
            for(var a = 4; a < numberPredefinedTemplates + 4; a++) {
                  items.push(createDropdownOption(this.predefinedTemplates[vehicleTypesIndex][a].name, this.predefinedTemplates[vehicleTypesIndex][a].name));
            }
            return items;
      }

      get customTemplate() {
            return this.l_customTemplate;
      }

      get isStandardTemplate() {
            return this.l_standardCustom[1].value == "Standard";
      }

      get customTemplateChosen() {
            return this.customTemplate[1].value;
      }

      get templateData() {
            if(this.isStandardTemplate) {
                  var index = this.l_vehicleTypes[1].selectedIndex;
                  return this.predefinedTemplates[index];
            } else {
                  var index2 = this.customTemplate[1].selectedIndex;
                  return this.blankTemplates[index2];
            }
      }

      get selectedTemplateData() {
            if(this.isStandardTemplate) {
                  var vehicleTypeIndex = this.l_vehicleTypes[1].selectedIndex;
                  var chosenTemplateIndex = this.l_predefinedTemplate[1].selectedIndex;
                  //must return clone of predefinedTemplates using...
                  return JSON.parse(JSON.stringify(this.predefinedTemplates[vehicleTypeIndex][chosenTemplateIndex + 4]));
            } else {
                  return false;
            }
      }

      addRow = (item) => {
            this.rowID++;
            var rowContainer = document.createElement('div');
            rowContainer.style = "width:100%;height:55px;display:block;float:left;background-color:#aaa;margin-top:10px;";
            rowContainer.id = "rowContainer";
            rowContainer.className = this.rowID;

            var description = createInput_Infield("Description", null, "width:100px;height:40px;margin:5px;", () => {this.fieldChangeFunction();}, rowContainer, false);
            description[1].id = "description";
            var quantity = createInput_Infield("Qty", 1, "width:50px;height:40px;margin:5px;", () => {this.fieldChangeFunction();}, rowContainer, false, 1);
            quantity[1].id = "quantity";
            var width = createInput_Infield("Width", 0, "width:120px;height:40px;margin:5px;", () => {this.fieldChangeFunction();}, rowContainer, false, 50, {postfix: "mm"});
            width[1].id = "width";
            var height = createInput_Infield("Height", 0, "width:120px;height:40px;margin:5px;", () => {this.fieldChangeFunction();}, rowContainer, false, 50, {postfix: "mm"});
            height[1].id = "height";

            var tempThis = this;
            var deleteBtn = createButton("X", "width:40px;height:100%;margin:0px;margin-left:5px;margin-right:0px;background-color:red;border-color:red;float:right", () => {
                  var rows = tempThis.parentObject.querySelectorAll("#rowContainer");
                  var rowN = parseFloat(deleteBtn.id);
                  var actualIndex = 0;
                  for(var l = 0; l < rows.length; l++) {
                        if(rowN == parseFloat(rows[l].className)) actualIndex = l;
                  }
                  tempThis.deleteRow(actualIndex);
            }, rowContainer);
            deleteBtn.className = "deleteBtn";
            deleteBtn.id = this.rowID;

            var vinylParts = getPredefinedParts("Vinyl - ");
            var vinylDropdownElements = [];
            vinylDropdownElements.push(["None", "white"]);
            vinylParts.forEach((element) => {
                  let weightField = element.Weight;
                  if(weightField == "") vinylDropdownElements.push([element.Name, "white"]);
                  else {
                        let isStocked = false;
                        if(element.Weight.includes("Stocked:true")) isStocked = true;

                        if(isStocked) vinylDropdownElements.push([element.Name, "blue"]);
                  }
            });

            //console.log(vinylParts);
            //vinylParts.forEach(element => vinylDropdownElements.push([element.Name, "white"]));
            var vinyl = createDropdown_Infield_Icons_Search("Vinyl", 0, "width:200px;margin:5px;", 10, true, vinylDropdownElements, () => {this.fieldChangeFunction(); console.log("in vinyl change");}, rowContainer);
            vinyl[1].id = "vinyl";
            vinyl[6]();//pauseCallback
            $(vinyl[1]).val(item ? item.vinyl : VinylLookup["Air Release"]).change();
            vinyl[7]();//resumeCallback

            var laminateParts = getPredefinedParts("Laminate - ");
            var laminateDropdownElements = [];
            laminateDropdownElements.push(["None", "white"]);
            laminateParts.forEach((element) => {
                  let weightField = element.Weight;
                  if(weightField == "") laminateDropdownElements.push([element.Name, "white"]);
                  else {
                        let isStocked = false;
                        if(element.Weight.includes("Stocked:true")) isStocked = true;

                        if(isStocked) laminateDropdownElements.push([element.Name, "blue"]);
                  }
            });
            //laminateParts.forEach(element => laminateDropdownElements.push([element.Name, "white"]));
            var laminate = createDropdown_Infield_Icons_Search("Laminate", 0, "width:200px;margin:5px;", 10, true, laminateDropdownElements, () => {this.fieldChangeFunction();}, rowContainer);
            laminate[1].id = "laminate";
            laminate[6]();//pauseCallback
            $(laminate[1]).val(item ? item.laminate : LaminateLookup["Gloss"]).change();
            laminate[7]();//resumeCallback

            if(item) {
                  if(item.isPanel == true) {
                        var panel = createCheckbox_Infield("Panel", true, "width:100px", () => {this.fieldChangeFunction();}, rowContainer);
                        panel[1].id = "panel";
                  }
                  if(item.description != "Oneway") {
                        var combo_3M = createButton("3M", "width:40px;height:45px;margin:5px;", () => {
                              dropdownInfieldIconsSearchSetSelected(vinyl, VinylLookup["3M Vehicle"], false, true);
                              dropdownInfieldIconsSearchSetSelected(laminate, LaminateLookup["3m Gloss (Standard)"], false, true);
                        });
                        rowContainer.appendChild(combo_3M);
                        var combo_Poly = createButton("Py", "width:40px;height:45px;margin:5px;", () => {
                              dropdownInfieldIconsSearchSetSelected(vinyl, VinylLookup["Air Release"], false, true);
                              dropdownInfieldIconsSearchSetSelected(laminate, LaminateLookup["Gloss"], false, true);
                        });
                        rowContainer.appendChild(combo_Poly);
                  }
            } else {
                  var combo_3M_2 = createButton("3M", "width:30px;height:45px;margin:5px;", () => {
                        dropdownInfieldIconsSearchSetSelected(vinyl, VinylLookup["3M Vehicle"], false, true);
                        dropdownInfieldIconsSearchSetSelected(laminate, LaminateLookup["3m Gloss (Standard)"], false, true);
                  });
                  rowContainer.appendChild(combo_3M_2);
                  var combo_Poly_2 = createButton("Py", "width:30px;height:45px;margin:5px;", () => {
                        dropdownInfieldIconsSearchSetSelected(vinyl, VinylLookup["Air Release"], false, true);
                        dropdownInfieldIconsSearchSetSelected(laminate, LaminateLookup["Gloss"], false, true);
                  });
                  rowContainer.appendChild(combo_Poly_2);
            }

            var tapeParts = getPredefinedParts("Tape - ");
            var tapeDropdownElements = [];
            tapeDropdownElements.push(["None", "white"]);
            tapeParts.forEach(element => tapeDropdownElements.push([element.Name, "white"]));
            var tape = createDropdown_Infield_Icons_Search("App Tape", 0, "width:200px;margin:5px;", 0, true, tapeDropdownElements, () => {this.fieldChangeFunction();}, rowContainer);
            tape[1].id = "tape";
            tape[6]();//pauseCallback
            $(tape[1]).val(item ? item.appTape : AppTapeLookup["Medium Tack"]).change();
            tape[7]();//resumeCallback

            this.l_itemsContainer.appendChild(rowContainer);
      };

      deleteRow = (rowN) => {
            var tempThis = this;
            var rows = tempThis.parentObject.querySelectorAll("#rowContainer");

            tempThis.fieldDeleteFunction(rowN);
            $(rows[rowN]).remove();
      };

      clearRows = () => {
            while(this.l_itemsContainer.childElementCount > 0) {this.l_itemsContainer.removeChild(this.l_itemsContainer.lastChild);}
      };

      toggle = () => {
            if(!this.required) {
                  //TODO
            } else {

            }
            this.callback();
      };

      Update() {

      }

      rowObjects = [];
      uniqueGroupsByKeys = [];
      async Create(productNo, partIndex) {
            this.rowObjects = [];
            this.uniqueGroupsByKeys = [];
            if(this.required) {
                  var rows = this.l_itemsContainer.querySelectorAll("#rowContainer");
                  for(let i = 0; i < rows.length; i++) {
                        var includesPanelYN = VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelectorAll("#panel").length > 0;
                        this.rowObjects.push({
                              description: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelector("#description").value,
                              width: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelector("#width").value,
                              height: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelector("#height").value,
                              quantity: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelector("#quantity").value,
                              vinyl: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelector("#vinyl").value,
                              laminate: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelector("#laminate").value,
                              appTape: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelector("#tape").value,
                              includesPanel: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelectorAll("#panel").length > 0,
                              panel: (includesPanelYN ? ACMLookup["Standard Primer"] : false)
                        });
                        var uniqueItem = {};
                        for(var key of this.uniqueKeys) {
                              uniqueItem[key] = this.rowObjects[i][key];
                        }

                        if(i == 0) {
                              this.uniqueGroupsByKeys.push(uniqueItem);
                        } else {
                              var isFound = this.uniqueGroupsByKeys.find(element => {
                                    for(var key of this.uniqueKeys) {
                                          if(element[key] !== this.rowObjects[i][key]) return false;
                                    }
                                    return true;
                              });

                              if(!isFound) {
                                    this.uniqueGroupsByKeys.push(uniqueItem);
                              }
                        }
                  }
                  for(let i = 0; i < this.uniqueGroupsByKeys.length; i++) {
                        let descriptionText = "";

                        let area = 0;
                        for(let row = 0; row < this.rowObjects.length; row++) {
                              var lastItem = row == this.rowObjects.length - 1;
                              var isInGroup = true;
                              for(var key of this.uniqueKeys) {
                                    if(this.rowObjects[row][key] !== this.uniqueGroupsByKeys[i][key]) {
                                          isInGroup = false;
                                    }
                              }
                              if(isInGroup) {
                                    descriptionText += "x" + this.rowObjects[row].quantity + " @ " +
                                          roundNumber(this.rowObjects[row].width, 2) + "mmW x " +
                                          roundNumber(this.rowObjects[row].height, 2) + "mmH (" +
                                          this.rowObjects[row].description + ")" + "\n";
                                    area += this.rowObjects[row].quantity * mmToM(this.rowObjects[row].width) * mmToM(this.rowObjects[row].height);
                              }

                              if(lastItem) {
                                    var squareSide = roundNumber(Math.sqrt(m2ToMM2(area)), 2);
                                    for(let value in this.uniqueGroupsByKeys[i]) {
                                          if(this.uniqueGroupsByKeys[i][value] === false || this.uniqueGroupsByKeys[i][value] === 'None') continue;
                                          partIndex = await q_AddPart_DimensionWH(productNo, partIndex, true, this.uniqueGroupsByKeys[i][value], 1, squareSide, squareSide, this.uniqueGroupsByKeys[i][value], descriptionText, true);
                                    }

                                    await GroupParts(productNo);

                              }
                        }

                  }
                  if(this.appTapeIsSumOfAll) {
                        let appText = "";
                        let area = 0;
                        for(let row = 0; row < this.rowObjects.length; row++) {
                              if(this.rowObjects[row].appTape != "None") {
                                    appText += "x" + this.rowObjects[row].quantity + " @ " +
                                          roundNumber(this.rowObjects[row].width, 2) + "mmW x " +
                                          roundNumber(this.rowObjects[row].height, 2) + "mmH (" +
                                          this.rowObjects[row].description + ")" + "\n";
                                    area += this.rowObjects[row].quantity * mmToM(this.rowObjects[row].width) * mmToM(this.rowObjects[row].height);
                              }
                        }
                        if(area != 0) {
                              var squareSide = roundNumber(Math.sqrt(m2ToMM2(area)), 2);
                              partIndex = await q_AddPart_DimensionWH(productNo, partIndex, true, AppTapeLookup["Medium Tack"], 1, squareSide, squareSide, "App Tape (for all)", appText, no);
                        }
                  }
                  console.log(this.uniqueGroupsByKeys);
            }
            return partIndex;
      }

      set useSpecificsInWording(value) {
            this.l_useSpecificsInWording = value;
      }

      get useSpecificsInWording() {
            return this.l_useSpecificsInWording;
      }

      Description() {
            let str = "";
            str += "High quality Vehicle Graphics" + "<br>" +
                  "Coverage Includes: " +
                  "<ul>";
            for(let row = 0; row < this.rowObjects.length; row++) {
                  str += "<li>" + this.rowObjects[row].description + "</li>";
            }
            str += "</ul>" + "<br>";
            if(this.useSpecificsInWording) {
                  str += "Specific Materials Used: " + "<ul>";
                  for(var i = 0; i < this.uniqueGroupsByKeys.length; i++) {
                        var value = this.uniqueGroupsByKeys[i];
                        str += "<li>" + "Group " + (i + 1) + "</li>";
                        str += "<ul>";
                        $.each(value, function(idx2, val2) {
                              if(val2 != false) {

                                    str += "<li>" + val2 + "</li>";

                              }
                        });
                        str += "</ul>";
                  }
                  str += "</ul>" + "<br>";
            }
            str += "Vehicles must be brought in clean where graphics are applied, or an additional cleaning charge of $95/h+gst will be applied" + "<br>" + "<br>";

            return str;
      }
}