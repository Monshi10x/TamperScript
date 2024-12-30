class Baseplate {

      #canvasCtx;

      constructor(parentObject, canvasCtx, updateFunction) {
            this.createGUI(parentObject, canvasCtx, updateFunction);
      }

      createGUI(parentObject, canvasCtx, updateFunction) {
            this.#canvasCtx = canvasCtx;
            this.callback = updateFunction;
            this.l_numHoles = 4;
            this.l_holeDia = 14;
            this.l_baseplateContainer = document.createElement("div");
            this.l_baseplateContainer.style = STYLE.BillboardMenus;
            this.l_baseplateRequired = createCheckbox_Infield("Baseplates", false, "width:97%", this.baseplateToggle, this.l_baseplateContainer);
            this.l_qty = createInput_Infield("Qty", 2, "width:100px;margin-right:400px;", this.callback, this.l_baseplateContainer);
            setFieldDisabled(true, this.l_qty[1], this.l_qty[0]);
            setFieldHidden(true, this.l_qty[1], this.l_qty[0]);
            this.l_baseplateMaterial = createDropdown_Infield("Material", 0, "width:150px", null, this.changebaseplateDimensionListings, this.l_baseplateContainer);
            setFieldDisabled(true, this.l_baseplateMaterial[1], this.l_baseplateMaterial[0]);
            setFieldHidden(true, this.l_baseplateMaterial[1], this.l_baseplateMaterial[0]);
            this.l_baseplateMaterialOptions = new Array(BaseplateList.length);
            for(var bpmo = 0; bpmo < this.l_baseplateMaterialOptions.length; bpmo++) {
                  this.l_baseplateMaterialOptions[bpmo] = createDropdownOption(BaseplateList[bpmo][0], BaseplateList[bpmo][0]);
                  this.l_baseplateMaterial[1].add(this.l_baseplateMaterialOptions[bpmo], bpmo);
            }
            this.l_baseplateDimensionsOptions;
            this.l_baseplateDimensions = createDropdown_Infield("Dimensions", 0, "width:150px;margin-right:100px;", null, this.callback, this.l_baseplateContainer);
            setFieldDisabled(true, this.l_baseplateDimensions[1], this.l_baseplateDimensions[0]);
            setFieldHidden(true, this.l_baseplateDimensions[1], this.l_baseplateDimensions[0]);
            this.createbaseplateDimensionsOptions(0 /*initially set to Steel, index 0*/);
            this.l_baseplateNoHoles = createInput_Infield("Number of Holes", 4, "width:100px;", this.callback, this.l_baseplateContainer, false, 1);
            setFieldDisabled(true, this.l_baseplateNoHoles[1], this.l_baseplateNoHoles[0]);
            setFieldHidden(true, this.l_baseplateNoHoles[1], this.l_baseplateNoHoles[0]);
            this.l_baseplateHoleDiameter = createInput_Infield("Hole Diameter", "13", "width:100px;", this.callback, this.l_baseplateContainer, false, 0.5);
            setFieldDisabled(true, this.l_baseplateHoleDiameter[1], this.l_baseplateHoleDiameter[0]);
            setFieldHidden(true, this.l_baseplateHoleDiameter[1], this.l_baseplateHoleDiameter[0]);
            parentObject.appendChild(this.l_baseplateContainer);
      }

      get numberHoles() {
            return parseFloat(this.l_baseplateNoHoles[1].value);
      }
      set numberHoles(value) {
            this.l_baseplateNoHoles[1].value = value;
      }
      get holeDiameter() {
            return parseFloat(this.l_baseplateHoleDiameter[1].value);
      }
      set holeDiameter(value) {
            this.l_baseplateHoleDiameter[1].value = value;
      }
      get qty() {
            return parseFloat(this.l_qty[1].value);
      }
      set qty(value) {
            this.l_qty[1].value = value;
      }
      get baseplateRequired() {
            return this.l_baseplateRequired[1].checked;
      }
      set baseplateRequired(value) {
            this.l_baseplateRequired[1].checked = value;
      }
      get baseplateMaterial() {
            return this.l_baseplateMaterial[1].value;
      }
      set baseplateMaterial(value) {
            this.l_baseplateMaterial[1].selectedIndex = value;
      }
      get baseplateDimensions() {
            return this.l_baseplateDimensions[1].value;
      }
      set baseplateDimensions(value) {
            this.l_baseplateDimensions[1].selectedIndex = value;
      }
      get baseplateWidth() {
            return parseFloat(this.l_baseplateDimensions[1].value.split("x")[0]);
      }
      get baseplateLength() {
            return parseFloat(this.l_baseplateDimensions[1].value.split("x")[1]);
      }
      get baseplateThickness() {
            return parseFloat(this.l_baseplateDimensions[1].value.split("x")[2]);
      }

      createbaseplateDimensionsOptions(materialIndex) {
            this.l_baseplateDimensionsOptions = new Array(BaseplateList[materialIndex].length - 1);
            for(var fd = 0; fd < this.l_baseplateDimensionsOptions.length; fd++) {
                  this.l_baseplateDimensionsOptions[fd] = createDropdownOption(BaseplateList[materialIndex][fd + 1 /*Offset by name index 0*/], BaseplateList[materialIndex][fd + 1 /*Offset by name index 0*/]);
                  this.l_baseplateDimensions[1].add(this.l_baseplateDimensionsOptions[fd], fd);
            }
      }

      changebaseplateDimensionListings = () => {
            $(this.l_baseplateDimensions[1]).empty();
            this.createbaseplateDimensionsOptions(this.l_baseplateMaterial[1].selectedIndex);
            this.callback;
      };

      baseplateToggle = () => {
            if(this.baseplateRequired == false) {
                  setFieldDisabled(true, this.l_baseplateMaterial[1], this.l_baseplateMaterial[0]);
                  setFieldDisabled(true, this.l_baseplateDimensions[1], this.l_baseplateDimensions[0]);
                  setFieldDisabled(true, this.l_baseplateNoHoles[1], this.l_baseplateNoHoles[0]);
                  setFieldDisabled(true, this.l_baseplateHoleDiameter[1], this.l_baseplateHoleDiameter[0]);
                  setFieldHidden(true, this.l_baseplateMaterial[1], this.l_baseplateMaterial[0]);
                  setFieldHidden(true, this.l_baseplateDimensions[1], this.l_baseplateDimensions[0]);
                  setFieldHidden(true, this.l_baseplateNoHoles[1], this.l_baseplateNoHoles[0]);
                  setFieldHidden(true, this.l_baseplateHoleDiameter[1], this.l_baseplateHoleDiameter[0]);
                  setFieldHidden(true, this.l_qty[1], this.l_qty[0]);
            } else {
                  setFieldDisabled(false, this.l_baseplateMaterial[1], this.l_baseplateMaterial[0]);
                  setFieldDisabled(false, this.l_baseplateDimensions[1], this.l_baseplateDimensions[0]);
                  setFieldDisabled(false, this.l_baseplateNoHoles[1], this.l_baseplateNoHoles[0]);
                  setFieldDisabled(false, this.l_baseplateHoleDiameter[1], this.l_baseplateHoleDiameter[0]);
                  setFieldHidden(false, this.l_baseplateMaterial[1], this.l_baseplateMaterial[0]);
                  setFieldHidden(false, this.l_baseplateDimensions[1], this.l_baseplateDimensions[0]);
                  setFieldHidden(false, this.l_baseplateNoHoles[1], this.l_baseplateNoHoles[0]);
                  setFieldHidden(false, this.l_baseplateHoleDiameter[1], this.l_baseplateHoleDiameter[0]);
                  setFieldHidden(false, this.l_qty[1], this.l_qty[0]);
            }
            this.callback();
      };

      Draw(legClass, frameClass) {
            if(!this.baseplateRequired) return;
            var offsetArray;
            var l_sideBOffsetX = sideBOffsetX + legClass.legWidth * 2 + frameClass.frameWidth_SideA;
            if(attachmentType == "1 Post, Front Frame, Front Sign") {
                  this.qty = 1;
                  offsetArray = [[0 + frameClass.frameWidth_SideA / 2, legClass.legHeightAboveGround, 0 + legClass.legDepth / 2, true, true]];
            } else if(attachmentType == "2 Post, Centre Frame, Centre Sign" || attachmentType == "2 Post, Forward Frame, Front Sign") {
                  this.qty = 2;
                  offsetArray = [
                        [0 + legClass.legWidth / 2, legClass.legHeight, 0 + legClass.legDepth / 2, true, true],
                        [0 - legClass.legWidth / 2 + legClass.legWidth * 2 + frameClass.frameWidth_SideA, legClass.legHeight, 0 + legClass.legDepth / 2, true, true],
                  ];
            } else if(attachmentType == "2 Post, Front Frame, Front Sign") {
                  this.qty = 2;
                  offsetArray = [
                        [0 + legClass.legWidth / 2, legClass.legHeight, 0 + legClass.legDepth / 2, true, true],
                        [0 - legClass.legWidth / 2 + frameClass.frameWidth_SideA, legClass.legHeight, 0 + legClass.legDepth / 2, true, true],
                  ];
            } else if(attachmentType == "3 Post, Centre Frame, Centre Sign") {
                  this.qty = 3;
                  offsetArray = [
                        [0 + legClass.legWidth / 2, legClass.legHeight, 0 + legClass.legDepth / 2, true, true],
                        [0 - legClass.legWidth / 2 + legClass.legWidth * 2 + frameClass.frameWidth_SideA, legClass.legHeight, 0 + legClass.legDepth / 2, true, true],
                        [0 - legClass.legWidth / 2 + legClass.legWidth * 2 + frameClass.frameWidth_SideA, null, 0 - frameClass.frameWidth_SideB - legClass.legWidth / 2, false, true],
                        [0 + l_sideBOffsetX + legClass.legDepth / 2, legClass.legHeight, null, true, false],
                        [0 + l_sideBOffsetX + legClass.legDepth + frameClass.frameWidth_SideB + legClass.legWidth / 2, legClass.legHeight, null, true, false],
                  ];
            } else if(attachmentType == "3 Post, Forward Frame, Front Sign") {
                  this.qty = 3;
                  offsetArray = [
                        [0 + legClass.legWidth / 2, legClass.legHeight, 0 + legClass.legDepth / 2, true, true],
                        [0 - legClass.legWidth / 2 + legClass.legWidth * 2 + frameClass.frameWidth_SideA, legClass.legHeight, 0 + legClass.legDepth / 2, true, true],
                        [0 - legClass.legDepth / 2 + legClass.legWidth * 2 + frameClass.frameWidth_SideA, null, 0 - frameClass.frameWidth_SideB - legClass.legWidth / 2, false, true],
                        [0 + l_sideBOffsetX + legClass.legDepth / 2, legClass.legHeight, null, true, false],
                        [0 + l_sideBOffsetX + legClass.legDepth + frameClass.frameWidth_SideB + legClass.legWidth / 2, legClass.legHeight, null, true, false],
                  ];
            } else if(attachmentType == "3 Post, Front Frame, Front Sign") {
                  this.qty = 3;
                  offsetArray = [
                        [0 + legClass.legWidth / 2, legClass.legHeight, 0 + legClass.legDepth / 2, true, true],
                        [0 + frameClass.frameWidth_SideA - frameClass.frameDepth - legClass.legWidth / 2, legClass.legHeight, 0 + legClass.legDepth / 2, true, true],
                        [0 + frameClass.frameWidth_SideA - frameClass.frameDepth - legClass.legDepth / 2, null, 0 + legClass.legWidth / 2 - frameClass.frameWidth_SideB + legClass.legDepth, false, true],
                        [0 + l_sideBOffsetX - legClass.legWidth * 2 + legClass.legDepth / 2, legClass.legHeight, null, true, false],
                        [0 + l_sideBOffsetX - legClass.legWidth * 2 + frameClass.frameWidth_SideB - legClass.legWidth / 2, legClass.legHeight, null, true, false],
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
                        this.#canvasCtx.rect(xOffset + xo - this.baseplateWidth / 2, yOffset + yo, this.baseplateWidth, this.baseplateThickness);
                        this.#canvasCtx.stroke();
                  }
                  if(tv) {
                        var yOffset_TopView_Extra = attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign" ? frameClass.frameWidth_SideB : 0;
                        this.#canvasCtx.beginPath();
                        this.#canvasCtx.rect(xOffset_TopView + xo - this.baseplateWidth / 2, yOffset_TopView + yOffset_TopView_Extra + zo - this.baseplateLength / 2, this.baseplateWidth, this.baseplateLength);
                        this.#canvasCtx.stroke();
                  }
            }
      }

      Update() {
            if(!this.baseplateRequired) return;
            this.l_baseplateWidth = parseFloat(this.l_baseplateDimensions[1].value.split("x")[0]);
            this.l_baseplateLength = parseFloat(this.l_baseplateDimensions[1].value.split("x")[1]);
            this.l_baseplateThickness = parseFloat(this.l_baseplateDimensions[1].value.split("x")[2]);
      }

      async Create(productNo, partIndex) {
            if(this.baseplateRequired) {
                  var partName = "Baseplate - " + this.baseplateMaterial + " " + this.baseplateDimensions;
                  await AddPart(partName, productNo);
                  partIndex++;
                  await setPartQty(productNo, partIndex, this.qty);
                  await savePart(productNo, partIndex);
                  await setPartDescription(productNo, partIndex, partName);
            }
            return partIndex;
      }

      Description() {
            if(!this.baseplateRequired) return "";
            return "Baseplates: <br>" + "<ul>" + "<li>" + "Size: " + this.baseplateWidth + "mmW x " + this.baseplateLength + "mmL x " + this.baseplateThickness + "mmH" + "</li>" + "<li>" + "Material: " + this.baseplateMaterial + "</li>" + "</ul>";
      }
}
