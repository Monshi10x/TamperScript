class Frame {

      #canvasCtx;
      powdercoatingMarkup = 1.8;


      constructor(parentObject, canvasCtx, updateFunction, DragZoomSVG) {
            this.createGUI(parentObject, canvasCtx, updateFunction, DragZoomSVG);
      }

      createGUI(parentObject, canvasCtx, updateFunction, DragZoomSVG) {
            this.#canvasCtx = canvasCtx;
            this.callback = updateFunction;
            this.DragZoomSVG = DragZoomSVG;
            this.l_frameThickness = 0;
            this.l_frameDepth = 0;
            this.l_frameOffsetX = 0;
            this.l_frameOffsetY = 0;
            this.l_numCobelokCorners = 0;
            this.l_numCobelokTs = 0;
            this.l_numCobelokCrosses = 0;
            this.l_qty = 1;
            this.l_frameContainer = document.createElement("div");
            this.l_frameContainer.style = STYLE.BillboardMenus;
            this.l_frameRequired = createCheckbox_Infield("Frame", true, "width:97%", this.frameToggle, this.l_frameContainer);
            this.l_sizeLabel = createLabel("Side A", "width:98%");
            this.l_frameContainer.appendChild(this.l_sizeLabel);
            this.l_frameWidth_SideA = createInput_Infield("Width", 2000, "width:100px", this.callback, this.l_frameContainer, true, 100);
            setFieldDisabled(true, this.l_frameWidth_SideA[1], this.l_frameWidth_SideA[0]);
            this.l_frameHeight_SideA = createInput_Infield("Height", 1000, "width:100px", this.callback, this.l_frameContainer, true, 100);
            setFieldDisabled(true, this.l_frameHeight_SideA[1], this.l_frameHeight_SideA[0]);
            this.l_frameSide2Label = createLabel("Side B", "width:98%");
            this.l_frameContainer.appendChild(this.l_frameSide2Label);
            this.l_frameWidth_SideB = createInput_Infield("Width2", 0, "width:100px", this.callback, this.l_frameContainer, true, 100);
            setFieldHidden(true, this.l_frameWidth_SideB[1], this.l_frameWidth_SideB[0]);
            this.l_frameHeight_SideB = createInput_Infield("Height2", 0, "width:100px; margin-right:200px;", this.callback, this.l_frameContainer, true, 100);
            setFieldHidden(true, this.l_frameHeight_SideB[1], this.l_frameHeight_SideB[0]);
            this.l_hr1 = createHr("width:95%", this.l_frameContainer);
            this.l_frameMaterial = createDropdown_Infield("Material", 0, "width:150px", null, this.changeFrameDimensionListings, this.l_frameContainer);
            this.l_frameMaterialOptions = new Array(RHSList.length);
            for(var fmo = 0; fmo < this.l_frameMaterialOptions.length; fmo++) {
                  this.l_frameMaterialOptions[fmo] = createDropdownOption(RHSList[fmo][0], RHSList[fmo][0]);
                  this.l_frameMaterial[1].add(this.l_frameMaterialOptions[fmo], fmo);
            }
            this.l_frameDimensions = createDropdown_Infield("Dimensions", 0, "width:150px", null, this.toggleFlip, this.l_frameContainer);
            this.createFrameDimensionsOptions(0 /*initially set to Gal Steel, index 0*/);
            dropdownSetSelectedText(this.l_frameDimensions[1], "25x25x1.6", false);
            this.l_frameFlipDimensions = createCheckbox_Infield("Flip", false, "width:100px;", this.toggleFlip, this.l_frameContainer);
            this.l_isCubelokFrame = createCheckbox_Infield("Is Cubelok", false, "width:150px;margin-right:300px;", this.toggleCubelok, this.l_frameContainer);
            this.l_hr2 = createHr("width:95%", this.l_frameContainer);
            this.l_frameVerticalPartitions = createInput_Infield("Vertical Partitions", 1, "width:150px", this.callback, this.l_frameContainer, true, 1);
            this.l_frameHorizontalPartitions = createInput_Infield("Horizontal Partitions", 0, "width:150px;", this.callback, this.l_frameContainer, true, 1);
            this.l_frameCornerFinishing = createDropdown_Infield("Corner Finishing", 0, "width:150px;", [createDropdownOption("Mitred", "Mitred"), createDropdownOption("Open", "Open")], this.callback, this.l_frameContainer);
            this.l_frameSeparateFromLegs = createDropdown_Infield("Frame Separate From Legs", 0, "width:150px;", [createDropdownOption("Separate From Legs", "Separate From Legs"), createDropdownOption("Welded to Legs", "Welded to Legs")], this.callback, this.l_frameContainer);
            this.l_hr3 = createHr("width:95%", this.l_frameContainer);


            //this.l_addPowdercoatingBtn = createButton("Powdercoating +", "width:150px;margin-right:400px;", this.togglePowdercoating);
            //this.l_frameContainer.appendChild(this.l_addPowdercoatingBtn);
            //this.l_powdercoatingCost = createInput_Infield("Cost", null, "width:100px;display:none;margin-left:50px;", null, this.l_frameContainer);
            //this.l_powdercoatingMarkup = createInput_Infield("Markup", 1.8, "width:100px;display:none", null, this.l_frameContainer, false, 0.1);
            //this.l_powdercoatingTotalEach = createDropdown_Infield("Total or Each", 1, "width:100px;display:none;margin-right:50px;", [createDropdownOption("Total", "Total"), createDropdownOption("Each (Per Frame)", "Each")], this.callback, this.l_frameContainer);


            this.l_addPowdercoatingCkb = createCheckbox_Infield("Is Powdercoated", false, "", () => { }, this.l_frameContainer);

            this.l_add2PacBtn = createButton("2Pac +", "width:150px;margin-right:400px;", this.toggle2Pac);
            this.l_frameContainer.appendChild(this.l_add2PacBtn);
            this.l_2PacLitres = createInput_Infield("Litres", null, "width:100px;display:none;margin-left:50px;margin-right:400px;", null, this.l_frameContainer, false, 0.000000000001);
            this.l_colourMatchTime = createInput_Infield("Colour Match Time", null, "width:150px;display:none;margin-left:50px;", null, this.l_frameContainer, false, 10);
            this.l_setupTime = createInput_Infield("Setup Time (30m std)", 30, "width:150px;display:none", null, this.l_frameContainer, false, 10);
            this.l_numberCoats = createInput_Infield("# Coats (2 std)", 2, "margin-left:50px;width:100px;display:none", null, this.l_frameContainer, false, 1);
            this.l_sprayTime = createInput_Infield("Spray Time (per coat)", null, "width:150px;display:none", null, this.l_frameContainer, false, 5);
            this.l_flashTime = createInput_Infield("Flash Time (15m std)", 15, "width:150px;display:none;margin-left:50px;margin-right:150px;", null, this.l_frameContainer, false, 5);
            this.l_2PacTotalEach = createDropdown_Infield("Total or Each", 1, "width:100px;display:none;margin-left:50px;", [createDropdownOption("Total", "Total"), createDropdownOption("Each (Per Frame)", "Each")], this.callback, this.l_frameContainer);
            parentObject.appendChild(this.l_frameContainer);
      }

      frameToggle = () => {
            if(!this.frameRequired) {
                  setFieldDisabled(true, this.l_frameMaterial[1], this.l_frameMaterial[0]);
                  setFieldDisabled(true, this.l_frameDimensions[1], this.l_frameDimensions[0]);
                  setFieldDisabled(true, this.l_isCubelokFrame[1], this.l_isCubelokFrame[0]);
                  setFieldDisabled(true, this.l_frameFlipDimensions[1], this.l_frameFlipDimensions[0]);
                  setFieldDisabled(true, this.l_frameVerticalPartitions[1], this.l_frameVerticalPartitions[0]);
                  setFieldDisabled(true, this.l_frameHorizontalPartitions[1], this.l_frameHorizontalPartitions[0]);
                  setFieldDisabled(true, this.l_frameCornerFinishing[1], this.l_frameCornerFinishing[0]);
                  setFieldDisabled(true, this.l_frameSeparateFromLegs[1], this.l_frameSeparateFromLegs[0]);
                  setFieldHidden(true, this.l_frameWidth_SideA[1], this.l_frameWidth_SideA[0]);
                  setFieldHidden(true, this.l_frameHeight_SideA[1], this.l_frameHeight_SideA[0]);
                  setFieldHidden(true, this.l_sizeLabel, this.l_sizeLabel);
                  setFieldHidden(true, this.l_frameWidth_SideB[1], this.l_frameWidth_SideB[0]);
                  setFieldHidden(true, this.l_frameHeight_SideB[1], this.l_frameHeight_SideB[0]);
                  setFieldHidden(true, this.l_frameSide2Label, this.l_frameSide2Label);
                  setFieldHidden(true, this.l_frameMaterial[1], this.l_frameMaterial[0]);
                  setFieldHidden(true, this.l_frameDimensions[1], this.l_frameDimensions[0]);
                  setFieldHidden(true, this.l_isCubelokFrame[1], this.l_isCubelokFrame[0]);
                  setFieldHidden(true, this.l_frameFlipDimensions[1], this.l_frameFlipDimensions[0]);
                  setFieldHidden(true, this.l_frameVerticalPartitions[1], this.l_frameVerticalPartitions[0]);
                  setFieldHidden(true, this.l_frameHorizontalPartitions[1], this.l_frameHorizontalPartitions[0]);
                  setFieldHidden(true, this.l_frameCornerFinishing[1], this.l_frameCornerFinishing[0]);
                  setFieldHidden(true, this.l_frameSeparateFromLegs[1], this.l_frameSeparateFromLegs[0]);
                  setFieldHidden(true, this.l_addPowdercoatingCkb[1], this.l_addPowdercoatingCkb[0]);
                  setFieldHidden(true, this.l_add2PacBtn, this.l_add2PacBtn);
                  this.l_add2PacBtn.innerText = "2Pac +";
                  setFieldHidden(true, this.l_2PacLitres[1], this.l_2PacLitres[0]);
                  setFieldHidden(true, this.l_colourMatchTime[1], this.l_colourMatchTime[0]);
                  setFieldHidden(true, this.l_setupTime[1], this.l_setupTime[0]);
                  setFieldHidden(true, this.l_numberCoats[1], this.l_numberCoats[0]);
                  setFieldHidden(true, this.l_flashTime[1], this.l_flashTime[0]);
                  setFieldHidden(true, this.l_sprayTime[1], this.l_sprayTime[0]);
                  setFieldHidden(true, this.l_2PacTotalEach[1], this.l_2PacTotalEach[0]);
                  setFieldHidden(true, this.l_hr1, this.l_hr1);
                  setFieldHidden(true, this.l_hr2, this.l_hr2);
                  setFieldHidden(true, this.l_hr3, this.l_hr3);
            } else {
                  setFieldDisabled(false, this.l_frameMaterial[1], this.l_frameMaterial[0]);
                  setFieldDisabled(false, this.l_frameDimensions[1], this.l_frameDimensions[0]);
                  setFieldDisabled(false, this.l_isCubelokFrame[1], this.l_isCubelokFrame[0]);
                  setFieldDisabled(false, this.l_frameFlipDimensions[1], this.l_frameFlipDimensions[0]);
                  setFieldDisabled(false, this.l_frameVerticalPartitions[1], this.l_frameVerticalPartitions[0]);
                  setFieldDisabled(false, this.l_frameHorizontalPartitions[1], this.l_frameHorizontalPartitions[0]);
                  setFieldDisabled(false, this.l_frameCornerFinishing[1], this.l_frameCornerFinishing[0]);
                  setFieldDisabled(false, this.l_frameSeparateFromLegs[1], this.l_frameSeparateFromLegs[0]);
                  setFieldHidden(false, this.l_frameWidth_SideA[1], this.l_frameWidth_SideA[0]);
                  setFieldHidden(false, this.l_frameHeight_SideA[1], this.l_frameHeight_SideA[0]);
                  setFieldHidden(false, this.l_sizeLabel, this.l_sizeLabel);
                  setFieldHidden(false, this.l_frameWidth_SideB[1], this.l_frameWidth_SideB[0]);
                  setFieldHidden(false, this.l_frameHeight_SideB[1], this.l_frameHeight_SideB[0]);
                  setFieldHidden(false, this.l_frameSide2Label, this.l_frameSide2Label);
                  setFieldHidden(false, this.l_frameMaterial[1], this.l_frameMaterial[0]);
                  setFieldHidden(false, this.l_frameDimensions[1], this.l_frameDimensions[0]);
                  setFieldHidden(false, this.l_isCubelokFrame[1], this.l_isCubelokFrame[0]);
                  setFieldHidden(false, this.l_frameFlipDimensions[1], this.l_frameFlipDimensions[0]);
                  setFieldHidden(false, this.l_frameVerticalPartitions[1], this.l_frameVerticalPartitions[0]);
                  setFieldHidden(false, this.l_frameHorizontalPartitions[1], this.l_frameHorizontalPartitions[0]);
                  setFieldHidden(false, this.l_frameCornerFinishing[1], this.l_frameCornerFinishing[0]);
                  setFieldHidden(false, this.l_frameSeparateFromLegs[1], this.l_frameSeparateFromLegs[0]);
                  setFieldHidden(false, this.l_add2PacBtn, this.l_add2PacBtn);
                  this.l_add2PacBtn.innerText = "2Pac +";
                  setFieldHidden(false, this.l_hr1, this.l_hr1);
                  setFieldHidden(false, this.l_hr2, this.l_hr2);
                  setFieldHidden(false, this.l_hr3, this.l_hr3);
            }
            this.callback();
      };

      get qty() {
            return this.l_qty;
      }
      set qty(value) {
            this.l_qty = parseFloat(value);
      }
      get frameThickness() {
            return this.l_frameThickness;
      }
      set frameThickness(value) {
            this.l_frameThickness = parseFloat(value);
      }
      get frameDepth() {
            if(this.frameRequired) return this.l_frameDepth;
            else return 0;
      }
      set frameDepth(value) {
            this.l_frameDepth = parseFloat(value);
      }
      get frameOffsetX() {
            return this.l_frameOffsetX;
      }
      set frameOffsetX(value) {
            this.l_frameOffsetX = value;
      }
      get frameOffsetY() {
            return this.l_frameOffsetY;
      }
      set frameOffsetY(value) {
            this.l_frameOffsetY = value;
      }
      get frameRequired() {
            return this.l_frameRequired[1].checked;
      }
      set frameRequired(value) {
            this.l_frameRequired[1].checked = value;
      }
      get frameWidth_SideA() {
            return parseFloat(this.l_frameWidth_SideA[1].value);
      }
      set frameWidth_SideA(value) {
            this.l_frameWidth_SideA[1].value = value;
      }
      get frameHeight_SideA() {
            return parseFloat(this.l_frameHeight_SideA[1].value);
      }
      set frameHeight_SideA(value) {
            this.l_frameHeight_SideA[1].value = value;
      }
      get frameWidth_SideB() {
            return parseFloat(this.l_frameWidth_SideB[1].value);
      }
      set frameWidth_SideB(value) {
            this.l_frameWidth_SideB[1].value = value;
      }
      get frameHeight_SideB() {
            return parseFloat(this.l_frameHeight_SideB[1].value);
      }
      set frameHeight_SideB(value) {
            this.l_frameHeight_SideB[1].value = value;
      }
      get frameMaterial() {
            return this.l_frameMaterial[1].value;
      }
      set frameMaterial(value) {
            this.l_frameMaterial[1].value = value;
      }
      /**
       * Returns eg '25x25x3'
       */
      get frameDimensions() {
            return this.l_frameDimensions[1].value;
      }
      set frameDimensions(value) {
            this.l_frameDimensions[1].value = value;
      }
      get isQubelok() {
            return this.l_isCubelokFrame[1].checked;
      }
      set isQubelok(value) {
            this.l_isCubelokFrame[1].checked = value;
      }
      get isFrameFlipDimensions() {
            return this.l_frameFlipDimensions[1].checked;
      }
      set isFrameFlipDimensions(value) {
            this.l_frameFlipDimensions[1].checked = value;
      }
      get frameVerticalPartitions() {
            return parseFloat(this.l_frameVerticalPartitions[1].value);
      }
      set frameVerticalPartitions(value) {
            this.l_frameVerticalPartitions[1].value = value;
      }
      get frameHorizontalPartitions() {
            return parseFloat(this.l_frameHorizontalPartitions[1].value);
      }
      set frameHorizontalPartitions(value) {
            this.l_frameHorizontalPartitions[1].value = value;
      }
      get frameCornerFinishing() {
            return this.l_frameCornerFinishing[1].value;
      }
      set frameCornerFinishing(value) {
            this.l_frameCornerFinishing[1].value = value;
      }
      get frameSeparateFromLegs() {
            return this.l_frameSeparateFromLegs[1].value;
      }
      set frameSeparateFromLegs(value) {
            this.l_frameSeparateFromLegs[1].value = value;
      }
      get powdercoatingCost() {
            let [materialW, materialH, materialT] = this.frameDimensions.split("x");
            let frameSurfaceArea = mmToM(parseFloat(materialW)) * mmToM(parseFloat(materialH)) * (mmToM(this.getFrameLinearMm(true)) + mmToM(this.getFrameLinearMm(this.hasSecondSide)));
            return Powdercoat.cost(frameSurfaceArea, "Coat Only");
      }
      /*get powdercoatingRequired() {
            return this.l_powdercoatingCost[0].style.display == "block";
      }
      get powdercoatingCost() {
            return this.l_powdercoatingCost[1].value;
      }
      set powdercoatingCost(value) {
            this.l_powdercoatingCost[1].value = value;
      }
      get powdercoatingMarkup() {
            return this.l_powdercoatingMarkup[1].value;
      }
      set powdercoatingMarkup(value) {
            this.l_powdercoatingMarkup[1].value = value;
      }
      get powdercoatingTotalEach() {
            return this.l_powdercoatingTotalEach[1].value;
      }
      set powdercoatingTotalEach(value) {
            this.l_powdercoatingTotalEach[1].value = value;
      }*/
      get twoPacRequired() {
            return this.l_2PacLitres[0].style.display == "block";
      }
      get twoPacLitres() {
            return this.l_2PacLitres[1].value;
      }
      set twoPacLitres(value) {
            this.l_2PacLitres[1].value = value;
      }
      get twoPacColourMatchTime() {
            return this.l_colourMatchTime[1].value;
      }
      set twoPacColourMatchTime(value) {
            this.l_colourMatchTime[1].value = value;
      }
      get twoPacSetupTime() {
            return this.l_setupTime[1].value;
      }
      set twoPacSetupTime(value) {
            this.l_setupTime[1].value = value;
      }
      get twoPacNumberCoats() {
            return this.l_numberCoats[1].value;
      }
      set twoPacNumberCoats(value) {
            this.l_numberCoats[1].value = value;
      }
      get twoPacFlashTime() {
            return this.l_flashTime[1].value;
      }
      set twoPacFlashTime(value) {
            this.l_flashTime[1].value = value;
      }
      get twoPacSprayTime() {
            return this.l_sprayTime[1].value;
      }
      set twoPacSprayTime(value) {
            this.l_sprayTime[1].value = value;
      }
      get twoPacTotalEach() {
            return this.l_2PacTotalEach[1].value;
      }
      set twoPacTotalEach(value) {
            this.l_2PacTotalEach[1].value = value;
      }
      get numCobelokCorners() {
            return this.l_numCobelokCorners;
      }
      set numCobelokCorners(value) {
            this.l_numCobelokCorners = parseFloat(value);
      }
      get numCobelokTs() {
            return this.l_numCobelokTs;
      }
      set numCobelokTs(value) {
            this.l_numCobelokTs = parseFloat(value);
      }
      get numCobelokCrosses() {
            return this.l_numCobelokCrosses;
      }
      set numCobelokCrosses(value) {
            this.l_numCobelokCrosses = parseFloat(value);
      }
      get measurementOffsetY() {
            return 200 + this.legClass.measurementOffsetY;
      }
      get measurementOffsetX() {
            return 200 + this.legClass.measurementOffsetX;
      }
      get hasSecondSide() {
            return attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign";
      }


      unlockDimensions() {
            setFieldDisabled(false, this.l_frameWidth_SideA[1], this.l_frameWidth_SideA[0]);
            setFieldDisabled(false, this.l_frameHeight_SideA[1], this.l_frameHeight_SideA[0]);
            setFieldDisabled(false, this.l_frameWidth_SideB[1], this.l_frameWidth_SideB[0]);
            setFieldDisabled(false, this.l_frameHeight_SideB[1], this.l_frameHeight_SideB[0]);
      }

      lockDimensions() {
            setFieldDisabled(true, this.l_frameWidth_SideA[1], this.l_frameWidth_SideA[0]);
            setFieldDisabled(true, this.l_frameHeight_SideA[1], this.l_frameHeight_SideA[0]);
            setFieldDisabled(true, this.l_frameWidth_SideB[1], this.l_frameWidth_SideB[0]);
            setFieldDisabled(true, this.l_frameHeight_SideB[1], this.l_frameHeight_SideB[0]);
      }

      toggleCubelok = () => {
            if(this.isQubelok) {
                  setFieldDisabled(true, this.l_frameCornerFinishing[1], this.l_frameCornerFinishing[0]);
                  setFieldDisabled(true, this.l_frameSeparateFromLegs[1], this.l_frameSeparateFromLegs[0]);
                  setFieldDisabled(true, this.l_frameFlipDimensions[1], this.l_frameFlipDimensions[0]);
                  for(var fdsi = 0; fdsi < this.l_frameMaterialOptions.length; fdsi++) {
                        this.l_frameMaterialOptions[fdsi].disabled = true;
                        if(this.l_frameMaterialOptions[fdsi].text == "Aluminium") {
                              this.l_frameMaterialOptions[fdsi].disabled = false;
                              this.l_frameMaterial[1].selectedIndex = fdsi;
                        }
                  }
                  this.changeFrameDimensionListings();
                  for(var fd = 0; fd < this.l_frameDimensionsOptions.length; fd++) {
                        this.l_frameDimensionsOptions[fd].disabled = true;
                        if(this.l_frameDimensionsOptions[fd].text.includes("25.4x25.4x1.2")) {
                              this.l_frameDimensionsOptions[fd].disabled = false;
                              this.l_frameDimensions[1].selectedIndex = fd;
                        }
                  }
            } else {
                  setFieldDisabled(false, this.l_frameCornerFinishing[1], this.l_frameCornerFinishing[0]);
                  setFieldDisabled(false, this.l_frameSeparateFromLegs[1], this.l_frameSeparateFromLegs[0]);
                  setFieldDisabled(false, this.l_frameFlipDimensions[1], this.l_frameFlipDimensions[0]);
                  for(var fd2 = 0; fd2 < this.l_frameDimensionsOptions.length; fd2++) {
                        this.l_frameDimensionsOptions[fd2].disabled = false;
                  }
                  for(var fd3 = 0; fd3 < this.l_frameMaterialOptions.length; fd3++) {
                        this.l_frameMaterialOptions[fd3].disabled = false;
                  }
            }
            this.Update();
            this.callback();
      };

      /*togglePowdercoating = () => {
            if(this.l_powdercoatingCost[0].style.display == "none") {
                  this.l_powdercoatingCost[0].style.display = "block";
                  this.l_powdercoatingMarkup[0].style.display = "block";
                  this.l_powdercoatingTotalEach[0].style.display = "block";
            } else {
                  this.l_powdercoatingCost[0].style.display = "none";
                  this.l_powdercoatingCost[1].value = null;
                  this.l_powdercoatingMarkup[0].style.display = "none";
                  this.l_powdercoatingMarkup[1].value = null;
                  this.l_powdercoatingTotalEach[0].style.display = "none";
            }
            this.callback();
      };*/

      toggle2Pac = () => {
            if(this.l_2PacLitres[0].style.display == "none") {
                  this.l_add2PacBtn.innerText = "2Pac -";
                  this.l_2PacLitres[0].style.display = "block";
                  this.l_colourMatchTime[0].style.display = "block";
                  this.l_setupTime[0].style.display = "block";
                  this.l_numberCoats[0].style.display = "block";
                  this.l_flashTime[0].style.display = "block";
                  this.l_sprayTime[0].style.display = "block";
                  this.l_2PacTotalEach[0].style.display = "block";
            } else {
                  this.l_add2PacBtn.innerText = "2Pac +";
                  this.l_2PacLitres[0].style.display = "none";
                  this.l_colourMatchTime[0].style.display = "none";
                  this.l_setupTime[0].style.display = "none";
                  this.l_numberCoats[0].style.display = "none";
                  this.l_flashTime[0].style.display = "none";
                  this.l_sprayTime[0].style.display = "none";
                  this.l_2PacTotalEach[0].style.display = "none";
                  this.l_2PacLitres[1].value = null;
                  this.l_colourMatchTime[1].value = null;
                  this.l_setupTime[1].value = null;
                  this.l_numberCoats[1].value = null;
                  this.l_flashTime[1].value = null;
                  this.l_sprayTime[1].value = null;
            }
            this.callback();
      };

      toggleSideB() {
            if(this.hasSecondSide) {
                  this.qty = 2;
                  setFieldHidden(false, this.l_frameWidth_SideB[1], this.l_frameWidth_SideB[0]);
                  setFieldHidden(false, this.l_frameHeight_SideB[1], this.l_frameHeight_SideB[0]);
                  setFieldHidden(false, null, this.l_frameSide2Label);
            } else {
                  this.qty = 1;
                  setFieldHidden(true, this.l_frameWidth_SideB[1], this.l_frameWidth_SideB[0]);
                  setFieldHidden(true, this.l_frameHeight_SideB[1], this.l_frameHeight_SideB[0]);
                  setFieldHidden(true, null, this.l_frameSide2Label);
            }
      }

      toggleFlip = () => {
            this.Update();
            this.callback();
      };

      createFrameDimensionsOptions(materialIndex) {
            this.l_frameDimensionsOptions = new Array(RHSList[materialIndex].length - 1);
            for(var fd = 0; fd < this.l_frameDimensionsOptions.length; fd++) {
                  this.l_frameDimensionsOptions[fd] = createDropdownOption(RHSList[materialIndex][fd + 1], RHSList[materialIndex][fd + 1]);
                  this.l_frameDimensions[1].add(this.l_frameDimensionsOptions[fd], fd);
            }
      }

      changeFrameDimensionListings = () => {
            $(this.l_frameDimensions[1]).empty();
            this.createFrameDimensionsOptions(this.l_frameMaterial[1].selectedIndex);
            this.Update();
            this.callback();
      };

      getFrameLinearMm(sideA) {
            if(sideA) {
                  if(this.frameCornerFinishing == "Mitred") {
                        return this.frameWidth_SideA * 2 + this.frameHeight_SideA * 2 + this.frameVerticalPartitions * (this.frameHeight_SideA - 2 * this.frameThickness) + this.frameHorizontalPartitions * (this.frameWidth_SideA - 2 * this.frameThickness) - this.frameVerticalPartitions * this.frameHorizontalPartitions * this.frameThickness;
                  }
                  if(this.frameCornerFinishing == "Open") {
                        return this.frameWidth_SideA * 2 + (this.frameHeight_SideA - 2 * this.frameThickness) * 2 + this.frameVerticalPartitions * (this.frameHeight_SideA - 2 * this.frameThickness) + this.frameHorizontalPartitions * (this.frameWidth_SideA - 2 * this.frameThickness) - this.frameVerticalPartitions * this.frameHorizontalPartitions * this.frameThickness;
                  }
                  if(this.frameSeparateFromLegs == "Welded to Legs") {
                        return this.frameWidth_SideA * 2 + this.frameVerticalPartitions * (this.frameHeight_SideA - 2 * this.frameThickness) + this.frameHorizontalPartitions * this.frameWidth_SideA - this.frameVerticalPartitions * this.frameHorizontalPartitions * this.frameThickness;
                  }
            } else {
                  if(this.frameCornerFinishing == "Mitred") {
                        return this.frameWidth_SideB * 2 + this.frameHeight_SideB * 2 + this.frameVerticalPartitions * (this.frameHeight_SideB - 2 * this.frameThickness) + this.frameHorizontalPartitions * (this.frameWidth_SideB - 2 * this.frameThickness) - this.frameVerticalPartitions * this.frameHorizontalPartitions * this.frameThickness;
                  }
                  if(this.frameCornerFinishing == "Open") {
                        return this.frameWidth_SideB * 2 + (this.frameHeight_SideB - 2 * this.frameThickness) * 2 + this.frameVerticalPartitions * (this.frameHeight_SideB - 2 * this.frameThickness) + this.frameHorizontalPartitions * (this.frameWidth_SideB - 2 * this.frameThickness) - this.frameVerticalPartitions * this.frameHorizontalPartitions * this.frameThickness;
                  }
                  if(this.frameSeparateFromLegs == "Welded to Legs") {
                        return this.frameWidth_SideB * 2 + this.frameVerticalPartitions * (this.frameHeight_SideB - 2 * this.frameThickness) + this.frameHorizontalPartitions * this.frameWidth_SideB - this.frameVerticalPartitions * this.frameHorizontalPartitions * this.frameThickness;
                  }
            }
      }

      getCutSpecs(sideA) {
            if(sideA) {
                  if(this.frameCornerFinishing == "Mitred") {
                        return "Cut To: \n" + "x2 @ " + this.frameWidth_SideA + "mm (mitred 45)" + "\n" + "x2 @ " + this.frameHeight_SideA + "mm (mitred 45)" + "\n" + (this.frameVerticalPartitions != 0 ? "x" + this.frameVerticalPartitions + " @ " + (this.frameHeight_SideA - 2 * this.frameThickness) + "mm (straight)" + "\n" : "") + (this.frameHorizontalPartitions != 0 ? "x" + this.frameHorizontalPartitions * (this.frameVerticalPartitions + 1) + " @ " + (this.frameWidth_SideA - 2 * this.frameThickness - this.frameVerticalPartitions * this.frameThickness) / (this.frameVerticalPartitions + 1) + "mm (straight)" : "");
                  }
                  if(this.frameCornerFinishing == "Open") {
                        return "Cut To: \n" + "x2 @ " + this.frameWidth_SideA + "mm (straight)" + "\n" + "x2 @ " + (this.frameHeight_SideA - 2 * this.frameThickness) + "mm (straight)" + "\n" + (this.frameVerticalPartitions != 0 ? "x" + this.frameVerticalPartitions + " @ " + (this.frameHeight_SideA - 2 * this.frameThickness) + "mm (straight)" + "\n" : "") + (this.frameHorizontalPartitions != 0 ? "x" + this.frameHorizontalPartitions * (this.frameVerticalPartitions + 1) + " @ " + (this.frameWidth_SideA - 2 * this.frameThickness - this.frameVerticalPartitions * this.frameThickness) / (this.frameVerticalPartitions + 1) + "mm (straight)" : "");
                  }
                  if(this.frameSeparateFromLegs == "Welded to Legs") {
                        return "Cut To: \n" + "x2 @ " + this.frameWidth_SideA + "mm (straight)" + "\n" + (this.frameVerticalPartitions != 0 ? "x" + this.frameVerticalPartitions + " @ " + this.frameHeight_SideA + "mm (straight)" + "\n" : "") + (this.frameHorizontalPartitions != 0 ? "x" + this.frameHorizontalPartitions * (this.frameVerticalPartitions + 1) + " @ " + (this.frameWidth_SideA - this.frameVerticalPartitions * this.frameThickness) / (this.frameVerticalPartitions + 1) + "mm (straight)" : "");
                  }
            } else {
                  if(this.frameCornerFinishing == "Mitred") {
                        return "Cut To: \n" + "x2 @ " + this.frameWidth_SideB + "mm (mitred)" + "\n" + "x2 @ " + this.frameHeight_SideB + "mm (mitred)" + "\n" + (this.frameVerticalPartitions != 0 ? "x" + this.frameVerticalPartitions + " @ " + (this.frameHeight_SideB - 2 * this.frameThickness) + "mm (straight)" + "\n" : "") + (this.frameHorizontalPartitions != 0 ? "x" + this.frameHorizontalPartitions * (this.frameVerticalPartitions + 1) + " @ " + (this.frameWidth_SideB - 2 * this.frameThickness - this.frameVerticalPartitions * this.frameThickness) / (this.frameVerticalPartitions + 1) + "mm (straight)" : "");
                  }
                  if(this.frameCornerFinishing == "Open") {
                        return "Cut To: \n" + "x2 @ " + this.frameWidth_SideB + "mm (straight)" + "\n" + "x2 @ " + (this.frameHeight_SideB - 2 * this.frameThickness) + "mm (straight)" + "\n" + (this.frameVerticalPartitions != 0 ? "x" + this.frameVerticalPartitions + " @ " + (this.frameHeight_SideB - 2 * this.frameThickness) + "mm (straight)" + "\n" : "") + (this.frameHorizontalPartitions != 0 ? "x" + this.frameHorizontalPartitions * (this.frameVerticalPartitions + 1) + " @ " + (this.frameWidth_SideB - 2 * this.frameThickness - this.frameVerticalPartitions * this.frameThickness) / (this.frameVerticalPartitions + 1) + "mm (straight)" : "");
                  }
                  if(this.frameSeparateFromLegs == "Welded to Legs") {
                        return "Cut To: \n" + "x2 @ " + this.frameWidth_SideB + "mm (straight)" + "\n" + (this.frameVerticalPartitions != 0 ? "x" + this.frameVerticalPartitions + " @ " + this.frameHeight_SideB + "mm (straight)" + "\n" : "") + (this.frameHorizontalPartitions != 0 ? "x" + this.frameHorizontalPartitions * (this.frameVerticalPartitions + 1) + " @ " + (this.frameWidth_SideB - this.frameVerticalPartitions * this.frameThickness) / (this.frameVerticalPartitions + 1) + "mm (straight)" : "");
                  }
            }
      }

      setReferences(frameClass, legClass, footingClass, baseplateClass) {
            this.frameClass = frameClass;
            this.legClass = legClass;
            this.footingClass = footingClass;
            this.baseplateClass = baseplateClass;

            this.UpdateSVG();
      }

      rects = [];
      DrawRect(ctx, xOffset, yOffset, width, height, originPoint, colour, mitreAmount, mitreSides) {
            //drawRect(ctx, xOffset, yOffset, width, height, originPoint, colour, lineWidth);

            let defaultColour = "#bbb";
            let defaultOpacity = 1;

            let rect = new TSVGRectangle(this.DragZoomSVG.svgG, {
                  x: xOffset,
                  y: yOffset,
                  width: width,
                  height: height,
                  opacity: defaultOpacity,
                  fill: colour || defaultColour,
                  origin: originPoint,
                  class: "frame",
                  miter: mitreAmount || "null",
                  miterSides: mitreSides || "null",
            });
            this.rects.push(rect);
      }

      UpdateSVG() {
            let legClass = this.legClass;
            let frameClass = this.frameClass;
            let footingClass = this.footingClass;
            let baseplateClass = this.baseplateClass;

            for(let r = this.rects.length - 1; r >= 0; r--) {
                  this.rects[r].Delete();
            }
            this.rects = [];


            if(!this.frameRequired) return;


            var sideBRequired = attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign";
            if(this.frameWidth_SideA > 0 && this.frameHeight_SideA > 0) {
                  this.frameOffsetX = xOffset + (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth) + (attachmentType == "2 Post, Front Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign" ? -legClass.legWidth : 0);
                  this.frameOffsetY = yOffset;
                  var weldedToLegs = 0;
                  if(this.l_frameSeparateFromLegs.value == "Welded to Legs") {
                        weldedToLegs = 1;
                  } else {
                        weldedToLegs = 0;
                  }

                  // this.DrawRect(this.#canvasCtx, this.frameOffsetX + this.frameThickness - this.frameThickness * weldedToLegs, this.frameOffsetY + this.frameThickness, this.frameWidth_SideA - 2 * this.frameThickness + this.frameThickness * weldedToLegs * 2, this.frameHeight_SideA - 2 * this.frameThickness);
                  //this.DrawRect(this.#canvasCtx, this.frameOffsetX, this.frameOffsetY, this.frameWidth_SideA, this.frameHeight_SideA);

                  //top
                  this.DrawRect(this.#canvasCtx, this.frameOffsetX, this.frameOffsetY, this.frameWidth_SideA, this.frameThickness, "TL", null, this.frameThickness, ["bottom-left", "bottom-right"]);
                  //left
                  this.DrawRect(this.#canvasCtx, this.frameOffsetX, this.frameOffsetY, this.frameThickness, this.frameHeight_SideA, "TL", null, this.frameThickness, ["top-right", "bottom-right"]);
                  //bottom
                  this.DrawRect(this.#canvasCtx, this.frameOffsetX, this.frameOffsetY + this.frameHeight_SideA, this.frameWidth_SideA, this.frameThickness, "BL", null, this.frameThickness, ["top-left", "top-right"]);
                  //right
                  this.DrawRect(this.#canvasCtx, this.frameOffsetX + this.frameWidth_SideA, this.frameOffsetY, this.frameThickness, this.frameHeight_SideA, "TR", null, this.frameThickness, ['top-left', 'bottom-left']);


                  if(attachmentType == "2 Post, Forward Frame, Front Sign") {
                        this.DrawRect(this.#canvasCtx, xOffset_TopView + (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth), yOffset_TopView + legClass.legDepth - this.frameDepth, this.frameWidth_SideA, this.frameDepth);
                  } else if(attachmentType == "2 Post, Front Frame, Front Sign") {
                        this.DrawRect(this.#canvasCtx, xOffset_TopView, yOffset_TopView + legClass.legDepth, this.frameWidth_SideA, this.frameDepth);
                  } else if(attachmentType == "2 Post, Centre Frame, Centre Sign") {
                        this.DrawRect(this.#canvasCtx, xOffset_TopView + legClass.legWidth, yOffset_TopView + legClass.legDepth / 2, this.frameWidth_SideA, this.frameDepth, "L");
                  } else if(attachmentType == "3 Post, Centre Frame, Centre Sign") {
                        var yOffset_TopView_Extra = this.frameWidth_SideB;
                        this.DrawRect(this.#canvasCtx, xOffset_TopView + (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth), yOffset_TopView + yOffset_TopView_Extra + legClass.legDepth / 2 - this.frameDepth / 2, this.frameWidth_SideA, this.frameDepth);
                        this.DrawRect(this.#canvasCtx, xOffset_TopView + legClass.legWidth + this.frameWidth_SideA + legClass.legWidth / 2, yOffset_TopView + yOffset_TopView_Extra, this.frameDepth, this.frameWidth_SideB, "B");
                  } else if(attachmentType == "3 Post, Forward Frame, Front Sign") {
                        var yOffset_TopView_Extra = this.frameWidth_SideB;
                        this.DrawRect(this.#canvasCtx, xOffset_TopView + legClass.legWidth, yOffset_TopView + yOffset_TopView_Extra + legClass.legDepth, this.frameWidth_SideA, this.frameDepth, "BL");
                        this.DrawRect(this.#canvasCtx, xOffset_TopView + legClass.legWidth + this.frameWidth_SideA + legClass.legWidth, yOffset_TopView + yOffset_TopView_Extra, this.frameDepth, this.frameWidth_SideB, "BR");
                  } else if(attachmentType == "3 Post, Front Frame, Front Sign") {
                        var yOffset_TopView_Extra = this.frameWidth_SideB;
                        var xFrameOverlap = this.frameDepth;
                        this.DrawRect(this.#canvasCtx, xOffset_TopView, yOffset_TopView + yOffset_TopView_Extra + legClass.legDepth, this.frameWidth_SideA, this.frameDepth);
                        this.DrawRect(this.#canvasCtx, xOffset_TopView + this.frameWidth_SideA - xFrameOverlap, yOffset_TopView + yOffset_TopView_Extra + legClass.legDepth, this.frameDepth, this.frameWidth_SideB, "BL");
                  } else if(attachmentType == "1 Post, Front Frame, Front Sign") {
                        this.DrawRect(this.#canvasCtx, xOffset_TopView + (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth), yOffset_TopView + legClass.legDepth, this.frameWidth_SideA, this.frameDepth);
                  } else {
                        this.DrawRect(this.#canvasCtx, xOffset_TopView + (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth), yOffset_TopView + legClass.legDepth / 2, this.frameWidth_SideA, this.frameDepth);
                  }
                  for(var i = 0; i < this.frameVerticalPartitions; i++) {
                        var partitionPos = (this.frameWidth_SideA - this.frameThickness) / (this.frameVerticalPartitions + 1);
                        this.DrawRect(this.#canvasCtx, this.frameOffsetX + this.frameThickness + partitionPos * (i + 1) - this.frameThickness, this.frameOffsetY + this.frameThickness, this.frameThickness, this.frameHeight_SideA - 2 * this.frameThickness);
                  }
                  for(var w = 0; w < this.frameHorizontalPartitions; w++) {
                        var partitionPosw = (this.frameHeight_SideA - this.frameThickness) / (this.frameHorizontalPartitions + 1);
                        this.DrawRect(this.#canvasCtx, this.frameOffsetX + this.frameThickness, this.frameOffsetY + this.frameThickness + partitionPosw * (w + 1) - this.frameThickness, this.frameWidth_SideA - 2 * this.frameThickness, this.frameThickness);
                  }
                  if(this.isQubelok) {
                        this.numCobelokCorners = 0;
                        this.numCobelokTs = 0;
                        this.numCobelokCrosses = 0;
                        this.DrawRect(this.#canvasCtx, this.frameOffsetX, this.frameOffsetY, this.frameDepth, this.frameDepth, "TL", "black");
                        this.DrawRect(this.#canvasCtx, this.frameOffsetX + this.frameWidth_SideA - this.frameDepth, this.frameOffsetY, this.frameDepth, this.frameDepth, "TL", "black");
                        this.DrawRect(this.#canvasCtx, this.frameOffsetX, this.frameOffsetY + this.frameHeight_SideA - this.frameDepth, this.frameDepth, this.frameDepth, "TL", "black");
                        this.DrawRect(this.#canvasCtx, this.frameOffsetX + this.frameWidth_SideA - this.frameDepth, this.frameOffsetY + this.frameHeight_SideA - this.frameDepth, this.frameDepth, this.frameDepth, "TL", "black");
                        this.numCobelokCorners += 4;
                        for(var h = 0; h < this.frameVerticalPartitions; h++) {
                              var partitionPos1 = (this.frameWidth_SideA - this.frameThickness) / (this.frameVerticalPartitions + 1);
                              this.DrawRect(this.#canvasCtx, this.frameOffsetX + this.frameThickness + partitionPos1 * (h + 1) - this.frameThickness, this.frameOffsetY, this.frameThickness, this.frameThickness, "TL", "black");
                              this.DrawRect(this.#canvasCtx, this.frameOffsetX + this.frameThickness + partitionPos1 * (h + 1) - this.frameThickness, this.frameOffsetY + this.frameHeight_SideA - this.frameThickness, this.frameThickness, this.frameThickness, "TL", "black");
                              this.numCobelokTs += 2;
                        }
                        for(var j = 0; j < this.frameHorizontalPartitions; j++) {
                              var partitionPos2 = (this.frameHeight_SideA - this.frameThickness) / (this.frameHorizontalPartitions + 1);
                              this.DrawRect(this.#canvasCtx, this.frameOffsetX, this.frameOffsetY + this.frameThickness + partitionPos2 * (j + 1) - this.frameThickness, this.frameThickness, this.frameThickness, "TL", "black");
                              this.DrawRect(this.#canvasCtx, this.frameOffsetX + this.frameWidth_SideA - this.frameThickness, this.frameOffsetY + this.frameThickness + partitionPos2 * (j + 1) - this.frameThickness, this.frameThickness, this.frameThickness, "TL", "black");
                              this.numCobelokTs += 2;
                        }
                        for(var k = 0; k < this.frameVerticalPartitions; k++) {
                              var partitionPosV = (this.frameWidth_SideA - this.frameThickness) / (this.frameVerticalPartitions + 1);
                              for(var l = 0; l < this.frameHorizontalPartitions; l++) {
                                    var partitionPosH = (this.frameHeight_SideA - this.frameThickness) / (this.frameHorizontalPartitions + 1);
                                    this.DrawRect(this.#canvasCtx, this.frameOffsetX + this.frameThickness + partitionPosV * (k + 1) - this.frameThickness, this.frameOffsetY + this.frameThickness + partitionPosH * (l + 1) - this.frameThickness, this.frameThickness, this.frameThickness, "TL", "black");
                                    this.numCobelokCrosses++;
                              }
                        }
                  }
                  if(weldedToLegs == 0) {
                        if(this.frameCornerFinishing == "Mitred") {
                              this.#canvasCtx.moveTo(this.frameOffsetX, this.frameOffsetY);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameThickness, this.frameOffsetY + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetX + this.frameWidth_SideA, this.frameOffsetY);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameWidth_SideA - this.frameThickness, this.frameOffsetY + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetX, this.frameOffsetY + this.frameHeight_SideA);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameThickness, this.frameOffsetY + this.frameHeight_SideA - this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetX + this.frameWidth_SideA, this.frameOffsetY + this.frameHeight_SideA);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameWidth_SideA - this.frameThickness, this.frameOffsetY + this.frameHeight_SideA - this.frameThickness);
                              this.#canvasCtx.stroke();
                        } else if(this.frameCornerFinishing == "Open") {
                              this.#canvasCtx.moveTo(this.frameOffsetX, this.frameOffsetY + this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameThickness, this.frameOffsetY + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetX + this.frameWidth_SideA, this.frameOffsetY + this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameWidth_SideA - this.frameThickness, this.frameOffsetY + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetX, this.frameOffsetY + this.frameHeight_SideA - this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameThickness, this.frameOffsetY + this.frameHeight_SideA - this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetX + this.frameWidth_SideA, this.frameOffsetY + this.frameHeight_SideA - this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameWidth_SideA - this.frameThickness, this.frameOffsetY + this.frameHeight_SideA - this.frameThickness);
                              this.#canvasCtx.stroke();
                        }
                  }
                  this.DrawMeasurements(this.frameOffsetX, this.frameOffsetY, this.frameWidth_SideA, this.frameHeight_SideA);
            }

            //SIDE B
            if(sideBRequired && this.frameWidth_SideB > 0 && this.frameHeight_SideB > 0) {
                  this.frameOffsetXB = sideBOffsetX + xOffset + this.frameWidth_SideA + (attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" ? legClass.legWidth * 2 : 0) + legClass.legDepth + (attachmentType == "3 Post, Front Frame, Front Sign" ? -legClass.legDepth : 0);
                  this.frameOffsetYB = yOffset;
                  var weldedToLegs = 0;
                  if(this.l_frameSeparateFromLegs.value == "Welded to Legs") {
                        weldedToLegs = 1;
                  } else {
                        weldedToLegs = 0;
                  }


                  //top
                  this.DrawRect(this.#canvasCtx, this.frameOffsetXB, this.frameOffsetYB, this.frameWidth_SideB, this.frameThickness, "TL", null, this.frameThickness, ["bottom-left", "bottom-right"]);
                  //left
                  this.DrawRect(this.#canvasCtx, this.frameOffsetXB, this.frameOffsetYB, this.frameThickness, this.frameHeight_SideB, "TL", null, this.frameThickness, ["top-right", "bottom-right"]);
                  //bottom
                  this.DrawRect(this.#canvasCtx, this.frameOffsetXB, this.frameOffsetYB + this.frameHeight_SideB, this.frameWidth_SideB, this.frameThickness, "BL", null, this.frameThickness, ["top-left", "top-right"]);
                  //right
                  this.DrawRect(this.#canvasCtx, this.frameOffsetXB + this.frameWidth_SideB, this.frameOffsetYB, this.frameThickness, this.frameHeight_SideB, "TR", null, this.frameThickness, ['top-left', 'bottom-left']);




                  //this.DrawRect(this.#canvasCtx, this.frameOffsetXB + this.frameThickness - this.frameThickness * weldedToLegs, this.frameOffsetYB + this.frameThickness, this.frameWidth_SideB - 2 * this.frameThickness + this.frameThickness * weldedToLegs * 2, this.frameHeight_SideB - 2 * this.frameThickness);
                  //this.DrawRect(this.#canvasCtx, this.frameOffsetXB, this.frameOffsetYB, this.frameWidth_SideB, this.frameHeight_SideB);
                  for(var i = 0; i < this.frameVerticalPartitions; i++) {
                        var partitionPos = (this.frameWidth_SideB - this.frameThickness) / (this.frameVerticalPartitions + 1);
                        this.DrawRect(this.#canvasCtx, this.frameOffsetXB + this.frameThickness + partitionPos * (i + 1) - this.frameThickness, this.frameOffsetYB + this.frameThickness, this.frameThickness, this.frameHeight_SideB - 2 * this.frameThickness);
                  }
                  for(var w = 0; w < this.frameHorizontalPartitions; w++) {
                        var partitionPosw = (this.frameHeight_SideB - this.frameThickness) / (this.frameHorizontalPartitions + 1);
                        this.DrawRect(this.#canvasCtx, this.frameOffsetXB + this.frameThickness, this.frameOffsetYB + this.frameThickness + partitionPosw * (w + 1) - this.frameThickness, this.frameWidth_SideB - 2 * this.frameThickness, this.frameThickness);
                  }
                  if(this.isQubelok) {
                        this.numCobelokCorners = 0;
                        this.numCobelokTs = 0;
                        this.DrawRect(this.#canvasCtx, this.frameOffsetXB, this.frameOffsetYB, this.frameDepth, this.frameDepth, "TL", "black");
                        this.DrawRect(this.#canvasCtx, this.frameOffsetXB + this.frameWidth_SideB - this.frameDepth, this.frameOffsetYB, this.frameDepth, this.frameDepth, "TL", "black");
                        this.DrawRect(this.#canvasCtx, this.frameOffsetXB, this.frameOffsetYB + this.frameHeight_SideB - this.frameDepth, this.frameDepth, this.frameDepth, "TL", "black");
                        this.DrawRect(this.#canvasCtx, this.frameOffsetXB + this.frameWidth_SideB - this.frameDepth, this.frameOffsetYB + this.frameHeight_SideB - this.frameDepth, this.frameDepth, this.frameDepth, "TL", "black");
                        this.numCobelokCorners += 4;
                        for(var h = 0; h < this.frameVerticalPartitions; h++) {
                              var partitionPos1 = (this.frameWidth_SideB - this.frameThickness) / (this.frameVerticalPartitions + 1);
                              this.DrawRect(this.#canvasCtx, this.frameOffsetXB + this.frameThickness + partitionPos1 * (h + 1) - this.frameThickness, this.frameOffsetYB, this.frameThickness, this.frameThickness, "TL", "black");
                              this.DrawRect(this.#canvasCtx, this.frameOffsetXB + this.frameThickness + partitionPos1 * (h + 1) - this.frameThickness, this.frameOffsetYB + this.frameHeight_SideB - this.frameThickness, this.frameThickness, this.frameThickness, "TL", "black");
                              this.numCobelokTs += 2;
                        }
                        for(var j = 0; j < this.frameHorizontalPartitions; j++) {
                              var partitionPos2 = (this.frameHeight_SideB - this.frameThickness) / (this.frameHorizontalPartitions + 1);
                              this.DrawRect(this.#canvasCtx, this.frameOffsetXB, this.frameOffsetYB + this.frameThickness + partitionPos2 * (j + 1) - this.frameThickness, this.frameThickness, this.frameThickness, "TL", "black");
                              this.DrawRect(this.#canvasCtx, this.frameOffsetXB + this.frameWidth_SideB - this.frameThickness, this.frameOffsetYB + this.frameThickness + partitionPos2 * (j + 1) - this.frameThickness, this.frameThickness, this.frameThickness, "TL", "black");
                              this.numCobelokTs += 2;
                        }
                        for(var k = 0; k < this.frameVerticalPartitions; k++) {
                              var partitionPosV = (this.frameWidth_SideB - this.frameThickness) / (this.frameVerticalPartitions + 1);
                              for(var l = 0; l < this.frameHorizontalPartitions; l++) {
                                    var partitionPosH = (this.frameHeight_SideB - this.frameThickness) / (this.frameHorizontalPartitions + 1);
                                    this.DrawRect(this.#canvasCtx, this.frameOffsetXB + this.frameThickness + partitionPosV * (k + 1) - this.frameThickness, this.frameOffsetYB + this.frameThickness + partitionPosH * (l + 1) - this.frameThickness, this.frameThickness, this.frameThickness, "TL", "black");
                                    this.numCobelokCrosses++;
                              }
                        }
                  } else {
                        this.numCobelokCorners = 0;
                        this.numCobelokTs = 0;
                        this.numCobelokCrosses = 0;
                  }
                  if(weldedToLegs == 0) {
                        if(this.frameCornerFinishing == "Mitred") {

                              this.#canvasCtx.moveTo(this.frameOffsetXB, this.frameOffsetYB);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameThickness, this.frameOffsetYB + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetXB + this.frameWidth_SideB, this.frameOffsetYB);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameWidth_SideB - this.frameThickness, this.frameOffsetYB + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetXB, this.frameOffsetYB + this.frameHeight_SideB);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameThickness, this.frameOffsetYB + this.frameHeight_SideB - this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetXB + this.frameWidth_SideB, this.frameOffsetYB + this.frameHeight_SideB);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameWidth_SideB - this.frameThickness, this.frameOffsetYB + this.frameHeight_SideB - this.frameThickness);
                              this.#canvasCtx.stroke();
                        } else if(this.frameCornerFinishing == "Open") {
                              this.#canvasCtx.moveTo(this.frameOffsetXB, this.frameOffsetYB + this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameThickness, this.frameOffsetYB + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetXB + this.frameWidth_SideB, this.frameOffsetYB + this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameWidth_SideB - this.frameThickness, this.frameOffsetYB + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetXB, this.frameOffsetYB + this.frameHeight_SideB - this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameThickness, this.frameOffsetYB + this.frameHeight_SideB - this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetXB + this.frameWidth_SideB, this.frameOffsetYB + this.frameHeight_SideB - this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameWidth_SideB - this.frameThickness, this.frameOffsetYB + this.frameHeight_SideB - this.frameThickness);
                              this.#canvasCtx.stroke();
                        }
                  }
                  this.DrawMeasurements(this.frameOffsetXB, this.frameOffsetYB, this.frameWidth_SideB, this.frameHeight_SideB);
            }
      }

      Draw(legClass) {
            this.legClass = legClass;
            if(!this.frameRequired) return;
            var sideBRequired = attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign";
            if(this.frameWidth_SideA > 0 && this.frameHeight_SideA > 0) {
                  this.frameOffsetX = xOffset + (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth) + (attachmentType == "2 Post, Front Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign" ? -legClass.legWidth : 0);
                  this.frameOffsetY = yOffset;
                  var weldedToLegs = 0;
                  if(this.l_frameSeparateFromLegs.value == "Welded to Legs") {
                        weldedToLegs = 1;
                  } else {
                        weldedToLegs = 0;
                  }
                  drawRect(this.#canvasCtx, this.frameOffsetX + this.frameThickness - this.frameThickness * weldedToLegs, this.frameOffsetY + this.frameThickness, this.frameWidth_SideA - 2 * this.frameThickness + this.frameThickness * weldedToLegs * 2, this.frameHeight_SideA - 2 * this.frameThickness);
                  drawRect(this.#canvasCtx, this.frameOffsetX, this.frameOffsetY, this.frameWidth_SideA, this.frameHeight_SideA);
                  if(attachmentType == "2 Post, Forward Frame, Front Sign") {
                        drawRect(this.#canvasCtx, xOffset_TopView + (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth), yOffset_TopView + legClass.legDepth - this.frameDepth, this.frameWidth_SideA, this.frameDepth);
                  } else if(attachmentType == "2 Post, Front Frame, Front Sign") {
                        drawRect(this.#canvasCtx, xOffset_TopView, yOffset_TopView + legClass.legDepth, this.frameWidth_SideA, this.frameDepth);
                  } else if(attachmentType == "2 Post, Centre Frame, Centre Sign") {
                        drawRect(this.#canvasCtx, xOffset_TopView + legClass.legWidth, yOffset_TopView + legClass.legDepth / 2, this.frameWidth_SideA, this.frameDepth, "L");
                  } else if(attachmentType == "3 Post, Centre Frame, Centre Sign") {
                        var yOffset_TopView_Extra = this.frameWidth_SideB;
                        drawRect(this.#canvasCtx, xOffset_TopView + (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth), yOffset_TopView + yOffset_TopView_Extra + legClass.legDepth / 2 - this.frameDepth / 2, this.frameWidth_SideA, this.frameDepth);
                        drawRect(this.#canvasCtx, xOffset_TopView + legClass.legWidth + this.frameWidth_SideA + legClass.legWidth / 2, yOffset_TopView + yOffset_TopView_Extra, this.frameDepth, this.frameWidth_SideB, "B");
                  } else if(attachmentType == "3 Post, Forward Frame, Front Sign") {
                        var yOffset_TopView_Extra = this.frameWidth_SideB;
                        drawRect(this.#canvasCtx, xOffset_TopView + legClass.legWidth, yOffset_TopView + yOffset_TopView_Extra + legClass.legDepth, this.frameWidth_SideA, this.frameDepth, "BL");
                        drawRect(this.#canvasCtx, xOffset_TopView + legClass.legWidth + this.frameWidth_SideA + legClass.legWidth, yOffset_TopView + yOffset_TopView_Extra, this.frameDepth, this.frameWidth_SideB, "BR");
                  } else if(attachmentType == "3 Post, Front Frame, Front Sign") {
                        var yOffset_TopView_Extra = this.frameWidth_SideB;
                        var xFrameOverlap = this.frameDepth;
                        drawRect(this.#canvasCtx, xOffset_TopView, yOffset_TopView + yOffset_TopView_Extra + legClass.legDepth, this.frameWidth_SideA, this.frameDepth);
                        drawRect(this.#canvasCtx, xOffset_TopView + this.frameWidth_SideA - xFrameOverlap, yOffset_TopView + yOffset_TopView_Extra + legClass.legDepth, this.frameDepth, this.frameWidth_SideB, "BL");
                  } else if(attachmentType == "1 Post, Front Frame, Front Sign") {
                        drawRect(this.#canvasCtx, xOffset_TopView + (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth), yOffset_TopView + legClass.legDepth, this.frameWidth_SideA, this.frameDepth);
                  } else {
                        drawRect(this.#canvasCtx, xOffset_TopView + (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth), yOffset_TopView + legClass.legDepth / 2, this.frameWidth_SideA, this.frameDepth);
                  }
                  for(var i = 0; i < this.frameVerticalPartitions; i++) {
                        var partitionPos = (this.frameWidth_SideA - this.frameThickness) / (this.frameVerticalPartitions + 1);
                        drawRect(this.#canvasCtx, this.frameOffsetX + this.frameThickness + partitionPos * (i + 1) - this.frameThickness, this.frameOffsetY + this.frameThickness, this.frameThickness, this.frameHeight_SideA - 2 * this.frameThickness);
                  }
                  for(var w = 0; w < this.frameHorizontalPartitions; w++) {
                        var partitionPosw = (this.frameHeight_SideA - this.frameThickness) / (this.frameHorizontalPartitions + 1);
                        drawRect(this.#canvasCtx, this.frameOffsetX + this.frameThickness, this.frameOffsetY + this.frameThickness + partitionPosw * (w + 1) - this.frameThickness, this.frameWidth_SideA - 2 * this.frameThickness, this.frameThickness);
                  }
                  if(this.isQubelok) {
                        this.numCobelokCorners = 0;
                        this.numCobelokTs = 0;
                        this.numCobelokCrosses = 0;
                        drawFillRect(this.#canvasCtx, this.frameOffsetX, this.frameOffsetY, this.frameDepth, this.frameDepth, "black", 1);
                        drawFillRect(this.#canvasCtx, this.frameOffsetX + this.frameWidth_SideA - this.frameDepth, this.frameOffsetY, this.frameDepth, this.frameDepth, "black", 1);
                        drawFillRect(this.#canvasCtx, this.frameOffsetX, this.frameOffsetY + this.frameHeight_SideA - this.frameDepth, this.frameDepth, this.frameDepth, "black", 1);
                        drawFillRect(this.#canvasCtx, this.frameOffsetX + this.frameWidth_SideA - this.frameDepth, this.frameOffsetY + this.frameHeight_SideA - this.frameDepth, this.frameDepth, this.frameDepth, "black", 1);
                        this.numCobelokCorners += 4;
                        for(var h = 0; h < this.frameVerticalPartitions; h++) {
                              var partitionPos1 = (this.frameWidth_SideA - this.frameThickness) / (this.frameVerticalPartitions + 1);
                              drawFillRect(this.#canvasCtx, this.frameOffsetX + this.frameThickness + partitionPos1 * (h + 1) - this.frameThickness, this.frameOffsetY, this.frameThickness, this.frameThickness, "black", 1);
                              drawFillRect(this.#canvasCtx, this.frameOffsetX + this.frameThickness + partitionPos1 * (h + 1) - this.frameThickness, this.frameOffsetY + this.frameHeight_SideA - this.frameThickness, this.frameThickness, this.frameThickness, "black", 1);
                              this.numCobelokTs += 2;
                        }
                        for(var j = 0; j < this.frameHorizontalPartitions; j++) {
                              var partitionPos2 = (this.frameHeight_SideA - this.frameThickness) / (this.frameHorizontalPartitions + 1);
                              drawFillRect(this.#canvasCtx, this.frameOffsetX, this.frameOffsetY + this.frameThickness + partitionPos2 * (j + 1) - this.frameThickness, this.frameThickness, this.frameThickness, "black", 1);
                              drawFillRect(this.#canvasCtx, this.frameOffsetX + this.frameWidth_SideA - this.frameThickness, this.frameOffsetY + this.frameThickness + partitionPos2 * (j + 1) - this.frameThickness, this.frameThickness, this.frameThickness, "black", 1);
                              this.numCobelokTs += 2;
                        }
                        for(var k = 0; k < this.frameVerticalPartitions; k++) {
                              var partitionPosV = (this.frameWidth_SideA - this.frameThickness) / (this.frameVerticalPartitions + 1);
                              for(var l = 0; l < this.frameHorizontalPartitions; l++) {
                                    var partitionPosH = (this.frameHeight_SideA - this.frameThickness) / (this.frameHorizontalPartitions + 1);
                                    drawFillRect(this.#canvasCtx, this.frameOffsetX + this.frameThickness + partitionPosV * (k + 1) - this.frameThickness, this.frameOffsetY + this.frameThickness + partitionPosH * (l + 1) - this.frameThickness, this.frameThickness, this.frameThickness, "black", 1);
                                    this.numCobelokCrosses++;
                              }
                        }
                  }
                  if(weldedToLegs == 0) {
                        if(this.frameCornerFinishing == "Mitred") {
                              this.#canvasCtx.moveTo(this.frameOffsetX, this.frameOffsetY);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameThickness, this.frameOffsetY + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetX + this.frameWidth_SideA, this.frameOffsetY);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameWidth_SideA - this.frameThickness, this.frameOffsetY + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetX, this.frameOffsetY + this.frameHeight_SideA);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameThickness, this.frameOffsetY + this.frameHeight_SideA - this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetX + this.frameWidth_SideA, this.frameOffsetY + this.frameHeight_SideA);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameWidth_SideA - this.frameThickness, this.frameOffsetY + this.frameHeight_SideA - this.frameThickness);
                              this.#canvasCtx.stroke();
                        } else if(this.frameCornerFinishing == "Open") {
                              this.#canvasCtx.moveTo(this.frameOffsetX, this.frameOffsetY + this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameThickness, this.frameOffsetY + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetX + this.frameWidth_SideA, this.frameOffsetY + this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameWidth_SideA - this.frameThickness, this.frameOffsetY + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetX, this.frameOffsetY + this.frameHeight_SideA - this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameThickness, this.frameOffsetY + this.frameHeight_SideA - this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetX + this.frameWidth_SideA, this.frameOffsetY + this.frameHeight_SideA - this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetX + this.frameWidth_SideA - this.frameThickness, this.frameOffsetY + this.frameHeight_SideA - this.frameThickness);
                              this.#canvasCtx.stroke();
                        }
                  }
                  this.DrawMeasurements(this.frameOffsetX, this.frameOffsetY, this.frameWidth_SideA, this.frameHeight_SideA);
            }
            if(sideBRequired && this.frameWidth_SideB > 0 && this.frameHeight_SideB > 0) {
                  this.frameOffsetXB = sideBOffsetX + xOffset + this.frameWidth_SideA + (attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" ? legClass.legWidth * 2 : 0) + legClass.legDepth + (attachmentType == "3 Post, Front Frame, Front Sign" ? -legClass.legDepth : 0);
                  this.frameOffsetYB = yOffset;
                  var weldedToLegs = 0;
                  if(this.l_frameSeparateFromLegs.value == "Welded to Legs") {
                        weldedToLegs = 1;
                  } else {
                        weldedToLegs = 0;
                  }
                  drawRect(this.#canvasCtx, this.frameOffsetXB + this.frameThickness - this.frameThickness * weldedToLegs, this.frameOffsetYB + this.frameThickness, this.frameWidth_SideB - 2 * this.frameThickness + this.frameThickness * weldedToLegs * 2, this.frameHeight_SideB - 2 * this.frameThickness);
                  drawRect(this.#canvasCtx, this.frameOffsetXB, this.frameOffsetYB, this.frameWidth_SideB, this.frameHeight_SideB);
                  for(var i = 0; i < this.frameVerticalPartitions; i++) {
                        var partitionPos = (this.frameWidth_SideB - this.frameThickness) / (this.frameVerticalPartitions + 1);
                        drawRect(this.#canvasCtx, this.frameOffsetXB + this.frameThickness + partitionPos * (i + 1) - this.frameThickness, this.frameOffsetYB + this.frameThickness, this.frameThickness, this.frameHeight_SideB - 2 * this.frameThickness);
                  }
                  for(var w = 0; w < this.frameHorizontalPartitions; w++) {
                        var partitionPosw = (this.frameHeight_SideB - this.frameThickness) / (this.frameHorizontalPartitions + 1);
                        drawRect(this.#canvasCtx, this.frameOffsetXB + this.frameThickness, this.frameOffsetYB + this.frameThickness + partitionPosw * (w + 1) - this.frameThickness, this.frameWidth_SideB - 2 * this.frameThickness, this.frameThickness);
                  }
                  if(this.isQubelok) {
                        this.numCobelokCorners = 0;
                        this.numCobelokTs = 0;
                        drawFillRect(this.#canvasCtx, this.frameOffsetXB, this.frameOffsetYB, this.frameDepth, this.frameDepth, "black", 1);
                        drawFillRect(this.#canvasCtx, this.frameOffsetXB + this.frameWidth_SideB - this.frameDepth, this.frameOffsetYB, this.frameDepth, this.frameDepth, "black", 1);
                        drawFillRect(this.#canvasCtx, this.frameOffsetXB, this.frameOffsetYB + this.frameHeight_SideB - this.frameDepth, this.frameDepth, this.frameDepth, "black", 1);
                        drawFillRect(this.#canvasCtx, this.frameOffsetXB + this.frameWidth_SideB - this.frameDepth, this.frameOffsetYB + this.frameHeight_SideB - this.frameDepth, this.frameDepth, this.frameDepth, "black", 1);
                        this.numCobelokCorners += 4;
                        for(var h = 0; h < this.frameVerticalPartitions; h++) {
                              var partitionPos1 = (this.frameWidth_SideB - this.frameThickness) / (this.frameVerticalPartitions + 1);
                              drawFillRect(this.#canvasCtx, this.frameOffsetXB + this.frameThickness + partitionPos1 * (h + 1) - this.frameThickness, this.frameOffsetYB, this.frameThickness, this.frameThickness, "black", 1);
                              drawFillRect(this.#canvasCtx, this.frameOffsetXB + this.frameThickness + partitionPos1 * (h + 1) - this.frameThickness, this.frameOffsetYB + this.frameHeight_SideB - this.frameThickness, this.frameThickness, this.frameThickness, "black", 1);
                              this.numCobelokTs += 2;
                        }
                        for(var j = 0; j < this.frameHorizontalPartitions; j++) {
                              var partitionPos2 = (this.frameHeight_SideB - this.frameThickness) / (this.frameHorizontalPartitions + 1);
                              drawFillRect(this.#canvasCtx, this.frameOffsetXB, this.frameOffsetYB + this.frameThickness + partitionPos2 * (j + 1) - this.frameThickness, this.frameThickness, this.frameThickness, "black", 1);
                              drawFillRect(this.#canvasCtx, this.frameOffsetXB + this.frameWidth_SideB - this.frameThickness, this.frameOffsetYB + this.frameThickness + partitionPos2 * (j + 1) - this.frameThickness, this.frameThickness, this.frameThickness, "black", 1);
                              this.numCobelokTs += 2;
                        }
                        for(var k = 0; k < this.frameVerticalPartitions; k++) {
                              var partitionPosV = (this.frameWidth_SideB - this.frameThickness) / (this.frameVerticalPartitions + 1);
                              for(var l = 0; l < this.frameHorizontalPartitions; l++) {
                                    var partitionPosH = (this.frameHeight_SideB - this.frameThickness) / (this.frameHorizontalPartitions + 1);
                                    drawFillRect(this.#canvasCtx, this.frameOffsetXB + this.frameThickness + partitionPosV * (k + 1) - this.frameThickness, this.frameOffsetYB + this.frameThickness + partitionPosH * (l + 1) - this.frameThickness, this.frameThickness, this.frameThickness, "black", 1);
                                    this.numCobelokCrosses++;
                              }
                        }
                  } else {
                        this.numCobelokCorners = 0;
                        this.numCobelokTs = 0;
                        this.numCobelokCrosses = 0;
                  }
                  if(weldedToLegs == 0) {
                        if(this.frameCornerFinishing == "Mitred") {
                              this.#canvasCtx.moveTo(this.frameOffsetXB, this.frameOffsetYB);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameThickness, this.frameOffsetYB + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetXB + this.frameWidth_SideB, this.frameOffsetYB);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameWidth_SideB - this.frameThickness, this.frameOffsetYB + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetXB, this.frameOffsetYB + this.frameHeight_SideB);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameThickness, this.frameOffsetYB + this.frameHeight_SideB - this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetXB + this.frameWidth_SideB, this.frameOffsetYB + this.frameHeight_SideB);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameWidth_SideB - this.frameThickness, this.frameOffsetYB + this.frameHeight_SideB - this.frameThickness);
                              this.#canvasCtx.stroke();
                        } else if(this.frameCornerFinishing == "Open") {
                              this.#canvasCtx.moveTo(this.frameOffsetXB, this.frameOffsetYB + this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameThickness, this.frameOffsetYB + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetXB + this.frameWidth_SideB, this.frameOffsetYB + this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameWidth_SideB - this.frameThickness, this.frameOffsetYB + this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetXB, this.frameOffsetYB + this.frameHeight_SideB - this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameThickness, this.frameOffsetYB + this.frameHeight_SideB - this.frameThickness);
                              this.#canvasCtx.moveTo(this.frameOffsetXB + this.frameWidth_SideB, this.frameOffsetYB + this.frameHeight_SideB - this.frameThickness);
                              this.#canvasCtx.lineTo(this.frameOffsetXB + this.frameWidth_SideB - this.frameThickness, this.frameOffsetYB + this.frameHeight_SideB - this.frameThickness);
                              this.#canvasCtx.stroke();
                        }
                  }
                  this.DrawMeasurements(this.frameOffsetXB, this.frameOffsetYB, this.frameWidth_SideB, this.frameHeight_SideB);
            }
      }

      setReferences(frameClass, legClass, footingClass, baseplateClass) {
            this.frameClass = frameClass;
            this.legClass = legClass;
            this.footingClass = footingClass;
            this.baseplateClass = baseplateClass;

            this.UpdateSVG();
      }

      DrawMeasurements(xOffset, yOffset, width, height) {
            var frameOnFront = attachmentType == "1 Post, Front Frame, Front Sign" || attachmentType == "2 Post, Front Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign";
            drawMeasurement(this.#canvasCtx, xOffset + width + this.measurementOffsetX + (!frameOnFront ? this.legClass.legWidth : 0), yOffset, 0, height, height + "mm", false, "L");
            drawMeasurement(this.#canvasCtx, xOffset, yOffset + this.measurementOffsetY, width, 0, width + "mm", true, "T");
      }

      Update() {
            if(!this.frameRequired) return;
            if(!this.isFrameFlipDimensions) {
                  this.frameThickness = parseFloat(this.frameDimensions.split("x")[0]);
                  this.frameDepth = parseFloat(this.frameDimensions.split("x")[1]);
            } else {
                  this.frameThickness = parseFloat(this.frameDimensions.split("x")[1]);
                  this.frameDepth = parseFloat(this.frameDimensions.split("x")[0]);
            }
            this.toggleSideB();
      }

      async Create(productNo, partIndex) {
            if(this.frameRequired) {
                  var framePartName = "RHS - " + this.frameMaterial + " " + this.frameDimensions;
                  var frameQty = 1;
                  for(var s = 0; s < this.qty; s++) {
                        var frameLinearMetres = 0;
                        var frameCutToSpecs = "";
                        if(s == 0) {
                              if(this.frameCornerFinishing == "Mitred") {
                                    frameLinearMetres += this.frameWidth_SideA * 2 + this.frameHeight_SideA * 2 + this.frameVerticalPartitions * (this.frameHeight_SideA - 2 * this.frameThickness) + this.frameHorizontalPartitions * (this.frameWidth_SideA - 2 * this.frameThickness) - this.frameVerticalPartitions * this.frameHorizontalPartitions * this.frameThickness;
                                    frameCutToSpecs += "Cut To: \n" + "x2 @ " + this.frameWidth_SideA + "mm (mitred)" + "\n" + "x2 @ " + this.frameHeight_SideA + "mm (mitred)" + "\n" + (this.frameVerticalPartitions != 0 ? "x" + this.frameVerticalPartitions + " @ " + (this.frameHeight_SideA - 2 * this.frameThickness) + "mm (straight)" + "\n" : "") + (this.frameHorizontalPartitions != 0 ? "x" + this.frameHorizontalPartitions * (this.frameVerticalPartitions + 1) + " @ " + (this.frameWidth_SideA - 2 * this.frameThickness - this.frameVerticalPartitions * this.frameThickness) / (this.frameVerticalPartitions + 1) + "mm (straight)" : "");
                              }
                              if(this.frameCornerFinishing == "Open") {
                                    frameLinearMetres += this.frameWidth_SideA * 2 + (this.frameHeight_SideA * 2 - 2 * this.frameThickness) + this.frameVerticalPartitions * (this.frameHeight_SideA - 2 * this.frameThickness) + this.frameHorizontalPartitions * (this.frameWidth_SideA - 2 * this.frameThickness) - this.frameVerticalPartitions * this.frameHorizontalPartitions * this.frameThickness;
                                    frameCutToSpecs += "Cut To: \n" + "x2 @ " + this.frameWidth_SideA + "mm (straight)" + "\n" + "x2 @ " + (this.frameHeight_SideA - 2 * this.frameThickness) + "mm (straight)" + "\n" + (this.frameVerticalPartitions != 0 ? "x" + this.frameVerticalPartitions + " @ " + (this.frameHeight_SideA - 2 * this.frameThickness) + "mm (straight)" + "\n" : "") + (this.frameHorizontalPartitions != 0 ? "x" + this.frameHorizontalPartitions * (this.frameVerticalPartitions + 1) + " @ " + (this.frameWidth_SideA - 2 * this.frameThickness - this.frameVerticalPartitions * this.frameThickness) / (this.frameVerticalPartitions + 1) + "mm (straight)" : "");
                              }
                              if(this.frameSeparateFromLegs == "Welded to Legs") {
                                    frameLinearMetres += this.frameWidth_SideA * 2 + this.frameVerticalPartitions * this.frameHeight_SideA + this.frameHorizontalPartitions * this.frameWidth_SideA - this.frameVerticalPartitions * this.frameHorizontalPartitions * this.frameThickness;
                                    frameCutToSpecs += "Cut To: \n" + "x2 @ " + this.frameWidth_SideA + "mm (straight)" + "\n" + (this.frameVerticalPartitions != 0 ? "x" + this.frameVerticalPartitions + " @ " + this.frameHeight_SideA + "mm (straight)" + "\n" : "") + (this.frameHorizontalPartitions != 0 ? "x" + this.frameHorizontalPartitions * (this.frameVerticalPartitions + 1) + " @ " + (this.frameWidth_SideA - this.frameVerticalPartitions * this.frameThickness) / (this.frameVerticalPartitions + 1) + "mm (straight)" : "");
                              }
                              await q_AddPart_DimensionWH(productNo, partIndex, true, framePartName, 1, frameLinearMetres, null, "[FRAME(s)] " + framePartName, frameCutToSpecs, false);
                              partIndex++;
                        }
                        if(s == 1) {
                              if(this.frameCornerFinishing == "Mitred") {
                                    frameLinearMetres += this.frameWidth_SideB * 2 + this.frameHeight_SideB * 2 + this.frameVerticalPartitions * (this.frameHeight_SideB - 2 * this.frameThickness) + this.frameHorizontalPartitions * (this.frameWidth_SideB - 2 * this.frameThickness) - this.frameVerticalPartitions * this.frameHorizontalPartitions * this.frameThickness;
                                    frameCutToSpecs += "Cut To: \n" + "x2 @ " + this.frameWidth_SideB + "mm (mitred)" + "\n" + "x2 @ " + this.frameHeight_SideB + "mm (mitred)" + "\n" + (this.frameVerticalPartitions != 0 ? "x" + this.frameVerticalPartitions + " @ " + (this.frameHeight_SideB - 2 * this.frameThickness) + "mm (straight)" + "\n" : "") + (this.frameHorizontalPartitions != 0 ? "x" + this.frameHorizontalPartitions * (this.frameVerticalPartitions + 1) + " @ " + (this.frameWidth_SideB - 2 * this.frameThickness - this.frameVerticalPartitions * this.frameThickness) / (this.frameVerticalPartitions + 1) + "mm (straight)" : "");
                              }
                              if(this.frameCornerFinishing == "Open") {
                                    frameLinearMetres += this.frameWidth_SideB * 2 + (this.frameHeight_SideB * 2 - 2 * this.frameThickness) + this.frameVerticalPartitions * (this.frameHeight_SideB - 2 * this.frameThickness) + this.frameHorizontalPartitions * (this.frameWidth_SideB - 2 * this.frameThickness) - this.frameVerticalPartitions * this.frameHorizontalPartitions * this.frameThickness;
                                    frameCutToSpecs += "Cut To: \n" + "x2 @ " + this.frameWidth_SideB + "mm (straight)" + "\n" + "x2 @ " + (this.frameHeight_SideB - 2 * this.frameThickness) + "mm (straight)" + "\n" + (this.frameVerticalPartitions != 0 ? "x" + this.frameVerticalPartitions + " @ " + (this.frameHeight_SideB - 2 * this.frameThickness) + "mm (straight)" + "\n" : "") + (this.frameHorizontalPartitions != 0 ? "x" + this.frameHorizontalPartitions * (this.frameVerticalPartitions + 1) + " @ " + (this.frameWidth_SideB - 2 * this.frameThickness - this.frameVerticalPartitions * this.frameThickness) / (this.frameVerticalPartitions + 1) + "mm (straight)" : "");
                              }
                              if(this.frameSeparateFromLegs == "Welded to Legs") {
                                    frameLinearMetres += this.frameWidth_SideB * 2 + this.frameVerticalPartitions * this.frameHeight_SideB + this.frameHorizontalPartitions * this.frameWidth_SideB - this.frameVerticalPartitions * this.frameHorizontalPartitions * this.frameThickness;
                                    frameCutToSpecs += "Cut To: \n" + "x2 @ " + this.frameWidth_SideB + "mm (straight)" + "\n" + (this.frameVerticalPartitions != 0 ? "x" + this.frameVerticalPartitions + " @ " + this.frameHeight_SideB + "mm (straight)" + "\n" : "") + (this.frameHorizontalPartitions != 0 ? "x" + this.frameHorizontalPartitions * (this.frameVerticalPartitions + 1) + " @ " + (this.frameWidth_SideB - this.frameVerticalPartitions * this.frameThickness) / (this.frameVerticalPartitions + 1) + "mm (straight)" : "");
                              }
                              await q_AddPart_DimensionWH(productNo, partIndex, true, framePartName, 1, frameLinearMetres, null, "[FRAME(s)] " + framePartName, frameCutToSpecs, false);
                              partIndex++;
                        }
                  }
                  if(this.isQubelok) {
                        if(this.numCobelokCorners != 0) {
                              await q_AddPart_Dimensionless(productNo, partIndex, true, "Qubelok - Plastic Corner", this.numCobelokCorners, "[FRAME(s)] Qubelok - Plastic Corner", null, null);
                              partIndex++;
                        }
                        if(this.numCobelokCrosses != 0) {
                              await q_AddPart_Dimensionless(productNo, partIndex, true, "Qubelok - Plastic 'T' connector", this.numCobelokCrosses, "[FRAME(s)] Qubelok - Plastic '+' connector", null, null);
                              partIndex++;
                        }
                        if(this.numCobelokTs != 0) {
                              await q_AddPart_Dimensionless(productNo, partIndex, true, "Qubelok - Plastic 'T' connector", this.numCobelokTs, "[FRAME(s)] Qubelok - Plastic 'T' connector", null, null);
                              partIndex++;
                        }
                  }
                  //Outsource - Powdercoating (ACE) (ea)
                  if(this.l_addPowdercoatingCkb[1].checked) {
                        await AddPart("Outsource - Powdercoating (ACE) (ea)", productNo);
                        partIndex++;
                        await setPartQty(productNo, partIndex, 1);
                        await setPartVendorCostEa(productNo, partIndex, this.powdercoatingCost);
                        await setPartMarkupEa(productNo, partIndex, this.powdercoatingMarkup);
                        await setPartDescription(productNo, partIndex, "[FRAME(s)] Powdercoating");
                        await savePart(productNo, partIndex);

                  }
                  if(this.twoPacRequired) {
                        await q_AddPart_Painting(productNo, partIndex, true, this.twoPacTotalEach == "Total" ? true : false, this.twoPacTotalEach == "Total" ? 1 : this.qty, this.twoPacLitres, this.twoPacColourMatchTime, this.twoPacNumberCoats, this.twoPacSetupTime, this.twoPacFlashTime, this.twoPacSprayTime, "[FRAME(s)] 2Pac Painting");
                        partIndex++;
                  }
            }
            return partIndex;
      }

      Description() {
            TODO("Fix frameHeight_SideB -> wording comes up as width measure");
            if(!this.frameRequired) return "";
            return "Frame: <br>" + "<ul>" + "<li>" + "Size (Side A): " + this.frameWidth_SideA + "mmW x " + this.frameHeight_SideA + "mmH" + "</li>" + (this.qty == 2 ? "<li>" + "Size (Side B): " + this.frameWidth_SideB + "mmW x " + this.frameHeight_SideB + "mmH" + "</li>" : "") + "<li>" + "Material: " + this.frameMaterial + " " + this.frameDimensions + "</li>" + "<li>" + "Partitions: " + this.frameVerticalPartitions + " (V), " + this.frameHorizontalPartitions + " (H)" + "</li>" + (this.powdercoatingRequired ? "<li>" + "Powdercoated standard colour" + "</li>" : "") + (this.twoPacRequired ? "<li>" + "2Pac painted" + "</li>" : "") + "</ul>";
      }
}
