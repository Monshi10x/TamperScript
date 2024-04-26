var kgConcretePerCube = 2406;
var kgConcretePerBag = 20;
function getSuggestedConcreteKg(cubicMetre) {
      return kgConcretePerCube * cubicMetre;
}
function getSuggestedNumber20kgConcreteBags(cubicMetre) {
      return getSuggestedConcreteKg(cubicMetre) / kgConcretePerBag;
}
class Footing {

      #canvasCtx;

      constructor(parentObject, canvasCtx, updateFunction) {
            this.createGUI(parentObject, canvasCtx, updateFunction);
      }

      createGUI(parentObject, canvasCtx, updateFunction) {
            this.#canvasCtx = canvasCtx;
            this.callback = updateFunction;
            this.l_footingContainer = document.createElement("div");
            this.l_footingContainer.style = STYLE.BillboardMenus;
            this.l_footingRequired = createCheckbox_Infield("Footing", false, "width:97%;", this.footingToggle, this.l_footingContainer);
            this.l_qty = createInput_Infield("Qty", "2", "width:100px;margin-right:500px;", this.callback, this.l_footingContainer);
            setFieldDisabled(true, this.l_qty[1], this.l_qty[0]);
            setFieldHidden(true, this.l_qty[1], this.l_qty[0]);
            this.l_hr1 = createHr("width:95%;display:none", this.l_footingContainer);
            this.l_footingDepth = createInput_Infield("Depth", 600, "width:100px;", this.callback, this.l_footingContainer, true, 100);
            setFieldDisabled(true, this.l_footingDepth[1], this.l_footingDepth[0]);
            setFieldHidden(true, this.l_footingDepth[1], this.l_footingDepth[0]);
            this.l_footingDiameter = createInput_Infield("Diameter", 300, "width:100px;;margin-right:200px;", this.callback, this.l_footingContainer, true, 50);
            setFieldDisabled(true, this.l_footingDiameter[1], this.l_footingDiameter[0]);
            setFieldHidden(true, this.l_footingDiameter[1], this.l_footingDiameter[0]);
            this.l_hr2 = createHr("width:95%;display:none", this.l_footingContainer);
            this.l_footingMaterial = createDropdown_Infield("Material", 0, "width:200px;margin-right:400px;", [createDropdownOption("Bag - Rapid-set Concrete", "Bag - Rapid-set Concrete"), createDropdownOption("Bag - Slow-set Concrete", "Bag - Slow-set Concrete"), createDropdownOption("Concrete Truck", "Concrete Truck")], this.toggleConcreteTruckOptions, this.l_footingContainer);
            setFieldDisabled(true, this.l_footingMaterial[1], this.l_footingMaterial[0]);
            setFieldHidden(true, this.l_footingMaterial[1], this.l_footingMaterial[0]);
            this.l_concreteTruckCost = createInput_Infield("Cost", null, "margin-left:50px;width:100px;", null, this.l_footingContainer);
            setFieldHidden(true, this.l_concreteTruckCost[1], this.l_concreteTruckCost[0]);
            this.l_concreteTruckMarkup = createInput_Infield("Markup", null, "width:100px;", null, this.l_footingContainer);
            setFieldHidden(true, this.l_concreteTruckMarkup[1], this.l_concreteTruckMarkup[0]);
            this.l_concreteTruckTotalEach = createDropdown_Infield("Total or Each", 0, "width:100px;margin-right:50px", [createDropdownOption("Total", "Total"), createDropdownOption("Each (Per Footing)", "Each")], null, this.l_footingContainer);
            setFieldHidden(true, this.l_concreteTruckTotalEach[1], this.l_concreteTruckTotalEach[0]);
            this.l_suggestedBags = createInput_Infield("Suggested Bags", 0, "width:100px;", null, this.l_footingContainer);
            setFieldDisabled(true, this.l_suggestedBags[1], this.l_suggestedBags[0]);
            setFieldHidden(true, this.l_suggestedBags[1], this.l_suggestedBags[0]);
            this.l_lockButton_isLocked = false;
            this.l_lockButton = createButton("", "border-color:rgb(218, 218, 218);margin:0px;width:30px;height:20px;object-fit: contain;float:left;background:url('https://cdn.gorilladash.com/images/media/5044676/signarama-australia-lockicon-thumbnail-6122028f23804.jpg');background-size: cover;background-repeat: no-repeat;background-position: center;", this.lockToggle, this.l_footingContainer);
            this.l_lockButton.disabled = true;
            setFieldHidden(true, this.l_lockButton, this.l_lockButton);
            this.l_footingContainer.appendChild(this.l_lockButton);
            this.l_hr3 = createHr("width:95%;display:none", this.l_footingContainer);
            this.l_addCageBtn = createButton("Cage +", "width:150px;margin-right:400px;", this.toggleCage);
            setFieldHidden(true, this.l_addCageBtn, this.l_addCageBtn);
            this.l_footingContainer.appendChild(this.l_addCageBtn);
            this.l_cageCost = createInput_Infield("Cost", null, "width:100px;display:none;margin-left:50px;", null, this.l_footingContainer);
            this.l_cageMarkup = createInput_Infield("Markup", null, "width:100px;display:none", null, this.l_footingContainer);
            this.l_cageTotalEach = createDropdown_Infield("Total or Each", 0, "width:100px;display:none;margin-right:50px;", [createDropdownOption("Total", "Total"), createDropdownOption("Each (Per Footing)", "Each")], this.callback, this.l_footingContainer);
            parentObject.appendChild(this.l_footingContainer);
      }

      lockToggle = () => {
            if(this.l_lockButton.style.borderColor == "rgb(218, 218, 218)") {
                  this.l_lockButton_isLocked = true;
                  this.l_lockButton.style.borderColor = "red";
            } else {
                  this.l_lockButton.style.borderColor = "rgb(218, 218, 218)";
                  this.l_lockButton_isLocked = false;
            }
            this.callback();
      };

      footingToggle = () => {
            if(!this.footingRequired) {
                  setFieldDisabled(true, this.l_footingMaterial[1], this.l_footingMaterial[0]);
                  setFieldDisabled(true, this.l_footingDepth[1], this.l_footingDepth[0]);
                  setFieldDisabled(true, this.l_footingDiameter[1], this.l_footingDiameter[0]);
                  setFieldDisabled(true, this.l_suggestedBags[1], this.l_suggestedBags[0]);
                  this.l_lockButton.disabled = true;
                  setFieldDisabled(true, this.l_concreteTruckTotalEach[1], this.l_concreteTruckTotalEach[0]);
                  setFieldDisabled(true, this.l_concreteTruckCost[1], this.l_concreteTruckCost[0]);
                  setFieldDisabled(true, this.l_concreteTruckMarkup[1], this.l_concreteTruckMarkup[0]);
                  setFieldHidden(true, this.l_qty[1], this.l_qty[0]);
                  setFieldHidden(true, null, this.l_lockButton);
                  setFieldHidden(true, this.l_footingMaterial[1], this.l_footingMaterial[0]);
                  setFieldHidden(true, this.l_footingDepth[1], this.l_footingDepth[0]);
                  setFieldHidden(true, this.l_footingDiameter[1], this.l_footingDiameter[0]);
                  setFieldHidden(true, this.l_suggestedBags[1], this.l_suggestedBags[0]);
                  setFieldHidden(true, this.l_concreteTruckTotalEach[1], this.l_concreteTruckTotalEach[0]);
                  setFieldHidden(true, this.l_concreteTruckCost[1], this.l_concreteTruckCost[0]);
                  setFieldHidden(true, this.l_concreteTruckMarkup[1], this.l_concreteTruckMarkup[0]);
                  setFieldHidden(true, null, this.l_addCageBtn);
                  setFieldHidden(true, this.l_cageCost[1], this.l_cageCost[0]);
                  setFieldHidden(true, this.l_cageMarkup[1], this.l_cageMarkup[0]);
                  setFieldHidden(true, this.l_cageTotalEach[1], this.l_cageTotalEach[0]);
                  setFieldHidden(true, this.l_hr1, this.l_hr1);
                  setFieldHidden(true, this.l_hr2, this.l_hr2);
                  setFieldHidden(true, this.l_hr3, this.l_hr3);
            } else {
                  setFieldDisabled(false, this.l_footingMaterial[1], this.l_footingMaterial[0]);
                  setFieldDisabled(false, this.l_footingDepth[1], this.l_footingDepth[0]);
                  setFieldDisabled(false, this.l_footingDiameter[1], this.l_footingDiameter[0]);
                  setFieldDisabled(false, this.l_suggestedBags[1], this.l_suggestedBags[0]);
                  this.l_lockButton.disabled = false;
                  setFieldDisabled(false, this.l_concreteTruckTotalEach[1], this.l_concreteTruckTotalEach[0]);
                  setFieldDisabled(false, this.l_concreteTruckCost[1], this.l_concreteTruckCost[0]);
                  setFieldDisabled(false, this.l_concreteTruckMarkup[1], this.l_concreteTruckMarkup[0]);
                  setFieldHidden(false, this.l_qty[1], this.l_qty[0]);
                  setFieldHidden(false, null, this.l_lockButton);
                  setFieldHidden(false, this.l_footingMaterial[1], this.l_footingMaterial[0]);
                  setFieldHidden(false, this.l_footingDepth[1], this.l_footingDepth[0]);
                  setFieldHidden(false, this.l_footingDiameter[1], this.l_footingDiameter[0]);
                  setFieldHidden(false, this.l_suggestedBags[1], this.l_suggestedBags[0]);
                  this.toggleConcreteTruckOptions();
                  setFieldHidden(false, null, this.l_addCageBtn);
                  this.l_addCageBtn.innerText = "Cage +";
                  setFieldHidden(true, this.l_cageCost[1], this.l_cageCost[0]);
                  setFieldHidden(true, this.l_cageMarkup[1], this.l_cageMarkup[0]);
                  setFieldHidden(true, this.l_cageTotalEach[1], this.l_cageTotalEach[0]);
                  setFieldHidden(false, this.l_hr1, this.l_hr1);
                  setFieldHidden(false, this.l_hr2, this.l_hr2);
                  setFieldHidden(false, this.l_hr3, this.l_hr3);
            }
            this.callback();
      };

      toggleConcreteTruckOptions = () => {
            var state = this.l_footingMaterial[1].value;
            if(state == "Concrete Truck") {
                  setFieldHidden(false, this.l_concreteTruckTotalEach[1], this.l_concreteTruckTotalEach[0]);
                  setFieldHidden(false, this.l_concreteTruckCost[1], this.l_concreteTruckCost[0]);
                  setFieldHidden(false, this.l_concreteTruckMarkup[1], this.l_concreteTruckMarkup[0]);
                  setFieldHidden(true, this.l_suggestedBags[1], this.l_suggestedBags[0]);
                  this.l_lockButton.style.display = "none";
            } else {
                  setFieldHidden(true, this.l_concreteTruckTotalEach[1], this.l_concreteTruckTotalEach[0]);
                  setFieldHidden(true, this.l_concreteTruckCost[1], this.l_concreteTruckCost[0]);
                  setFieldHidden(true, this.l_concreteTruckMarkup[1], this.l_concreteTruckMarkup[0]);
                  setFieldHidden(false, this.l_suggestedBags[1], this.l_suggestedBags[0]);
                  this.l_lockButton.style.display = "block";
            }
      };

      toggleCage = () => {
            if(this.l_cageCost[0].style.display == "none") {
                  this.l_addCageBtn.innerText = "Cage -";
                  setFieldHidden(false, this.l_cageCost[1], this.l_cageCost[0]);
                  setFieldHidden(false, this.l_cageMarkup[1], this.l_cageMarkup[0]);
                  setFieldHidden(false, this.l_cageTotalEach[1], this.l_cageTotalEach[0]);
            } else {
                  this.l_addCageBtn.innerText = "Cage +";
                  setFieldHidden(true, this.l_cageCost[1], this.l_cageCost[0]);
                  setFieldHidden(true, this.l_cageMarkup[1], this.l_cageMarkup[0]);
                  setFieldHidden(true, this.l_cageTotalEach[1], this.l_cageTotalEach[0]);
            }
            this.callback();
      };

      get depth() {
            return parseFloat(this.l_footingDepth[1].value);
      }
      set depth(value) {
            this.l_footingDepth[1].value = value;
      }
      get diameter() {
            if(isNaN(parseFloat(this.l_footingDiameter[1].value))) return 0;
            else return parseFloat(this.l_footingDiameter[1].value);
      }
      set diameter(value) {
            this.l_footingDiameter[1].value = value;
      }
      get qty() {
            return parseFloat(this.l_qty[1].value);
      }
      set qty(value) {
            this.l_qty[1].value = value;
      }
      get footingRequired() {
            return this.l_footingRequired[1].checked;
      }
      set footingRequired(value) {
            this.l_footingRequired[1].checked = value;
      }
      get footingMaterial() {
            return this.l_footingMaterial[1].value;
      }
      set footingMaterial(value) {
            this.l_footingMaterial[1].selectedIndex = value;
      }
      get suggestedBags() {
            return parseFloat(this.l_suggestedBags[1].value);
      }
      set suggestedBags(value) {
            this.l_suggestedBags[1].value = value;
      }
      get concreteTruckRequired() {
            return this.footingMaterial == "Concrete Truck";
      }
      get concreteTruckTotalEach() {
            return parseFloat(this.l_concreteTruckTotalEach[1].value);
      }
      set concreteTruckTotalEach(value) {
            this.l_concreteTruckTotalEach[1].value = value;
      }
      get concreteTruckCost() {
            return parseFloat(this.l_concreteTruckCost[1].value);
      }
      set concreteTruckCost(value) {
            this.l_concreteTruckCost[1].value = value;
      }
      get concreteTruckMarkup() {
            return parseFloat(this.l_concreteTruckMarkup[1].value);
      }
      set concreteTruckMarkup(value) {
            this.l_concreteTruckMarkup[1].value = value;
      }
      get cageRequired() {
            return this.l_cageCost[0].style.display == "block";
      }
      get cageCost() {
            return parseFloat(this.l_cageCost[1].value);
      }
      set cageCost(value) {
            this.l_cageCost[1].value = value;
      }
      get cageMarkup() {
            return parseFloat(this.l_cageMarkup[1].value);
      }
      set cageMarkup(value) {
            this.l_cageMarkup[1].value = value;
      }
      get cageTotalEach() {
            return this.l_cageTotalEach[1].value;
      }
      set cageTotalEach(value) {
            this.l_cageTotalEach[1].value = value;
      }
      get measurementOffsetY() {
            return 200 + this.frameClass.measurementOffsetY;
      }
      get measurementOffsetX() {
            return 250;
      }

      updateSuggestedConcreteBags() {
            var radius = this.diameter / 2 / 1000;
            var totalCubic = this.qty * ((this.depth / 1000) * Math.PI * radius * radius);
            var legsCubic = this.qty * (this.legClass.legWidth / 1000) * (this.legClass.legDepth / 1000) * (this.depth / 1000);
            var cubicExLegs = totalCubic - legsCubic;
            this.suggestedBags = roundNumber(getSuggestedNumber20kgConcreteBags(cubicExLegs), 2);
      }

      drawDashGrid(x, y, w, h) {
            var spaceY = 50;
            w = parseFloat(w);
            h = parseFloat(h);
            var num = h / spaceY;
            this.#canvasCtx.lineWidth = 3;
            this.#canvasCtx.globalAlpha = 0.2;
            this.#canvasCtx.fillRect(x, y, w, h);
            this.#canvasCtx.globalAlpha = 1.0;
            this.#canvasCtx.stroke();
            for(var i = 0; i < num; i++) {
                  this.#canvasCtx.beginPath();
                  this.#canvasCtx.moveTo(x, y + i * spaceY);
                  this.#canvasCtx.lineTo(x + w, y + (i + 1) * spaceY);
                  this.#canvasCtx.stroke();
            }
      }

      Draw(legClass, frameClass) {
            this.legClass = legClass;
            this.frameClass = frameClass;
            if(!this.footingRequired) return;
            var offsetArray;
            var l_sideBOffsetX = sideBOffsetX + legClass.legWidth * 2 + frameClass.frameWidth_SideA;
            if(attachmentType == "1 Post, Front Frame, Front Sign") {
                  this.qty = 1;
                  offsetArray = [[0 + frameClass.frameWidth_SideA / 2, legClass.legHeightAboveGround, 0 + legClass.legDepth / 2, true, true]];
            } else if(attachmentType == "2 Post, Centre Frame, Centre Sign" || attachmentType == "2 Post, Forward Frame, Front Sign") {
                  this.qty = 2;
                  offsetArray = [
                        [0 + legClass.legWidth / 2, legClass.legHeightAboveGround, 0 + legClass.legDepth / 2, true, true],
                        [0 - legClass.legWidth / 2 + legClass.legWidth * 2 + frameClass.frameWidth_SideA, legClass.legHeightAboveGround, 0 + legClass.legDepth / 2, true, true],
                  ];
            } else if(attachmentType == "2 Post, Front Frame, Front Sign") {
                  this.qty = 2;
                  offsetArray = [
                        [0 + legClass.legWidth / 2, legClass.legHeightAboveGround, 0 + legClass.legDepth / 2, true, true],
                        [0 - legClass.legWidth / 2 + frameClass.frameWidth_SideA, legClass.legHeightAboveGround, 0 + legClass.legDepth / 2, true, true],
                  ];
            } else if(attachmentType == "3 Post, Centre Frame, Centre Sign") {
                  this.qty = 3;
                  offsetArray = [
                        [0 + legClass.legWidth / 2, legClass.legHeightAboveGround, 0 + legClass.legDepth / 2, true, true],
                        [0 - legClass.legWidth / 2 + legClass.legWidth * 2 + frameClass.frameWidth_SideA, legClass.legHeightAboveGround, 0 + legClass.legDepth / 2, true, true],
                        [0 - legClass.legWidth / 2 + legClass.legWidth * 2 + frameClass.frameWidth_SideA, null, 0 - frameClass.frameWidth_SideB - legClass.legWidth / 2, false, true],
                        [0 + l_sideBOffsetX + legClass.legDepth / 2, legClass.legHeightAboveGround, null, true, false],
                        [0 + l_sideBOffsetX + legClass.legDepth + frameClass.frameWidth_SideB + legClass.legWidth / 2, legClass.legHeightAboveGround, null, true, false],
                  ];
            } else if(attachmentType == "3 Post, Forward Frame, Front Sign") {
                  this.qty = 3;
                  offsetArray = [
                        [0 + legClass.legWidth / 2, legClass.legHeightAboveGround, 0 + legClass.legDepth / 2, true, true],
                        [0 - legClass.legWidth / 2 + legClass.legWidth * 2 + frameClass.frameWidth_SideA, legClass.legHeightAboveGround, 0 + legClass.legDepth / 2, true, true],
                        [0 - legClass.legDepth / 2 + legClass.legWidth * 2 + frameClass.frameWidth_SideA, null, 0 - frameClass.frameWidth_SideB - legClass.legWidth / 2, false, true],
                        [0 + l_sideBOffsetX + legClass.legDepth / 2, legClass.legHeightAboveGround, null, true, false],
                        [0 + l_sideBOffsetX + legClass.legDepth + frameClass.frameWidth_SideB + legClass.legWidth / 2, legClass.legHeightAboveGround, null, true, false],
                  ];
            } else if(attachmentType == "3 Post, Front Frame, Front Sign") {
                  this.qty = 3;
                  offsetArray = [
                        [0 + legClass.legWidth / 2, legClass.legHeightAboveGround, 0 + legClass.legDepth / 2, true, true],
                        [0 + frameClass.frameWidth_SideA - frameClass.frameDepth - legClass.legWidth / 2, legClass.legHeightAboveGround, 0 + legClass.legDepth / 2, true, true],
                        [0 + frameClass.frameWidth_SideA - frameClass.frameDepth - legClass.legDepth / 2, null, 0 + legClass.legWidth / 2 - frameClass.frameWidth_SideB + legClass.legDepth, false, true],
                        [0 + l_sideBOffsetX - legClass.legWidth * 2 + legClass.legDepth / 2, legClass.legHeightAboveGround, null, true, false],
                        [0 + l_sideBOffsetX - legClass.legWidth * 2 + frameClass.frameWidth_SideB - legClass.legWidth / 2, legClass.legHeightAboveGround, null, true, false],
                  ];
            }
            for(var a = 0; a < offsetArray.length; a++) {
                  var xo = offsetArray[a][0];
                  var yo = offsetArray[a][1];
                  var zo = offsetArray[a][2];
                  var sv = offsetArray[a][3];
                  var tv = offsetArray[a][4];
                  if(sv) {
                        this.#canvasCtx.beginPath();
                        this.#canvasCtx.rect(xOffset + xo - this.diameter / 2, yOffset + yo, this.diameter, this.depth);
                        this.#canvasCtx.stroke();
                        this.drawDashGrid(xOffset + xo - this.diameter / 2, yOffset + yo, this.diameter, this.depth);
                        if(a == 0) {
                              this.DrawMeasurements(xOffset + xo - this.diameter / 2, [yOffset + yo, yOffset], this.diameter, this.depth);
                        }
                  }
                  if(tv) {
                        var yOffset_TopView_Extra = attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign" ? frameClass.frameWidth_SideB : 0;
                        this.#canvasCtx.beginPath();
                        this.#canvasCtx.lineWidth = 3;
                        this.#canvasCtx.arc(xOffset_TopView + xo, yOffset_TopView + yOffset_TopView_Extra + zo, this.diameter / 2, 0 * Math.PI, 2 * Math.PI);
                        this.#canvasCtx.globalAlpha = 0.2;
                        this.#canvasCtx.fill();
                        this.#canvasCtx.closePath();
                        this.#canvasCtx.globalAlpha = 1;
                        this.#canvasCtx.stroke();
                  }
            }
      }

      DrawMeasurements(xOffset, yOffset, width, height) {
            drawMeasurement(this.#canvasCtx, xOffset + width + this.measurementOffsetX, yOffset[0], 0, height, this.depth + "mm", false, "L");
            drawMeasurement(this.#canvasCtx, xOffset, yOffset[1] + this.measurementOffsetY, width, 0, this.diameter + "mm", true, "T");
      }

      Update() {
            if(!this.footingRequired) return;
            if(!this.l_lockButton_isLocked) this.updateSuggestedConcreteBags();
      }

      async Create(productNo, partIndex) {
            if(this.footingRequired) {
                  var numberBags = Math.ceil(this.suggestedBags);
                  if(this.footingMaterial == "Bag - Rapid-set Concrete") {
                        await AddPart("Concrete - 20kg Bag Rapid-set (Bastion)", productNo);
                        partIndex++;
                        await setPartQty(productNo, partIndex, numberBags);
                        await setPartDescription(productNo, partIndex, "[FOOTING] - Concrete");
                        await savePart(productNo, partIndex);
                  } else if(this.footingMaterial == "Bag - Slow-set Concrete") {
                        await AddPart("Concrete - 20kg Bag Rapid-set (Bastion)", productNo);
                        partIndex++;
                        await setPartQty(productNo, partIndex, numberBags);
                        await setPartDescription(productNo, partIndex, "[FOOTING] - Concrete");
                        await savePart(productNo, partIndex);
                  } else if(this.footingMaterial == "Concrete Truck") {
                        if(this.concreteTruckTotalEach == "Total") {
                              await AddPart("Custom Item Cost-Markup (Total)", productNo);
                              partIndex++;
                              await setPartVendorCostEa(productNo, partIndex, this.concreteTruckCost);
                              await setPartMarkup(productNo, partIndex, this.concreteTruckMarkup);
                              await setPartDescription(productNo, partIndex, "[FOOTING] - Concrete Truck");
                              await savePart(productNo, partIndex);
                        } else {
                              await AddPart("Custom Item Cost-Markup (Ea)", productNo);
                              partIndex++;
                              await setPartVendorCostEa(productNo, partIndex, this.concreteTruckCost);
                              await setPartMarkupEa(productNo, partIndex, this.concreteTruckMarkup);
                              await setPartDescription(productNo, partIndex, "[FOOTING] - Concrete Truck");
                              await savePart(productNo, partIndex);
                        }
                  }
                  if(this.cageRequired) {
                        await q_AddPart_CostMarkup(productNo, partIndex, true, this.cageTotalEach == "Total" ? true : false, this.cageTotalEach == "Total" ? 1 : this.qty, this.cageCost, this.cageMarkup, "[FOOTING] - Cage");
                        partIndex++;
                  }
            }
            return partIndex;
      }

      Description() {
            if(!this.footingRequired) return "";
            return "Footing(s): <br>" + "<ul>" + "<li>" + "Depth: " + this.depth + "mmD, Diameter: " + this.diameter + "mmW" + "</li>" + (this.cageRequired ? "<li>Welded Steel Cage with J-bolts</li>" : "") + "</ul>";
      }
}
