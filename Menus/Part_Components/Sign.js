class Sign {

      #canvasCtx;

      constructor(parentObject, canvasCtx, updateFunction, DragZoomSVG) {
            this.createGUI(parentObject, canvasCtx, updateFunction, DragZoomSVG);
      }

      createGUI(parentObject, canvasCtx, updateFunction, DragZoomSVG) {
            this.#canvasCtx = canvasCtx;
            this.callback = updateFunction;
            this.DragZoomSVG = DragZoomSVG;
            this.l_signOffsetX = 0;
            this.l_signOffsetY = 0;
            this.l_signContainer = document.createElement("div");
            this.l_signContainer.style = STYLE.BillboardMenus;
            this.l_signRequired = createCheckbox_Infield("Sign", true, "width:97%", this.signToggle, this.l_signContainer);
            this.l_sideAFrontLabel = createLabel("Side A - Front", "width:50%;");
            this.l_signContainer.appendChild(this.l_sideAFrontLabel);
            this.l_sideBFrontLabel = createLabel("Side B - Front", "width:35%;");
            this.l_signContainer.appendChild(this.l_sideBFrontLabel);
            this.l_width_SideAFront = createInput_Infield("Width", "2000", "width:80px;", () => {this.UpdateSVG(); this.callback();}, this.l_signContainer, true, 100);
            this.l_height_SideAFront = createInput_Infield("Height", "1000", "width:80px;margin-right:20px;", () => {this.UpdateSVG(); this.callback();}, this.l_signContainer, true, 100);
            this.l_width_SideBFront = createInput_Infield("Width", "2000", "width:80px;", () => {this.UpdateSVG(); this.callback();}, this.l_signContainer, true, 100);
            setFieldDisabled(true, this.l_width_SideBFront[1], this.l_width_SideBFront[0]);
            this.l_height_SideBFront = createInput_Infield("Height", "1000", "width:80px;", () => {this.UpdateSVG(); this.callback();}, this.l_signContainer, true, 100);
            setFieldDisabled(true, this.l_height_SideBFront[1], this.l_height_SideBFront[0]);
            this.l_sideABackLabel = createLabel("Side A - Back", "width:50%;display:none");
            this.l_signContainer.appendChild(this.l_sideABackLabel);
            this.l_sideBBackLabel = createLabel("Side B - Back", "width:35%;display:none");
            this.l_signContainer.appendChild(this.l_sideBBackLabel);
            this.l_width_SideABack = createInput_Infield("Width", 2000, "width:80px;display:none", () => {this.UpdateSVG(); this.callback();}, this.l_signContainer, true, 100);
            setFieldDisabled(true, this.l_width_SideABack[1], this.l_width_SideABack[0]);
            this.l_height_SideABack = createInput_Infield("Height", 1000, "width:80px;display:none;margin-right:20px;", () => {this.UpdateSVG(); this.callback();}, this.l_signContainer, true, 100);
            setFieldDisabled(true, this.l_height_SideABack[1], this.l_height_SideABack[0]);
            this.l_width_SideBBack = createInput_Infield("Width", "2000", "width:80px;display:none;", () => {this.UpdateSVG(); this.callback();}, this.l_signContainer, true, 100);
            setFieldDisabled(true, this.l_width_SideBBack[1], this.l_width_SideBBack[0]);
            this.l_height_SideBBack = createInput_Infield("Height", "1000", "width:80px;display:none;", () => {this.UpdateSVG(); this.callback();}, this.l_signContainer, true, 100);
            setFieldDisabled(true, this.l_height_SideBBack[1], this.l_height_SideBBack[0]);
            this.l_hr1 = createHr("width:95%", this.l_signContainer);
            this.l_signType = createDropdown_Infield("Sign Type", 0, "width:150px;margin-right:400px;", [createDropdownOption("ACM with Laminated Vinyl", "ACM with Digitally Printed and Laminated Vinyl"), createDropdownOption("ACM (Blank)", "ACM (Blank)"), createDropdownOption("Sail-track Banner", "High-quality Long-term Sail-track Banner")], this.secondSideBlankToggle, this.l_signContainer);
            this.l_signSides = createDropdown_Infield("Sign Sides", 0, "width:150px", [createDropdownOption("Single-sided", "Single-sided"), createDropdownOption("Double-sided", "Double-sided")], this.secondSideToggle, this.l_signContainer);
            this.l_2ndSideBlank = createCheckbox_Infield("2nd Side Blank", false, "width:150px;display:none", () => {this.UpdateSVG(); this.callback();}, this.l_signContainer);
            parentObject.appendChild(this.l_signContainer);

            this.UpdateSVG();
      }


      get signOffsetX() {
            return this.l_signOffsetX;
      }
      set signOffsetX(value) {
            this.l_signOffsetX = value;
      }
      get signOffsetY() {
            return this.l_signOffsetY;
      }
      set signOffsetY(value) {
            this.l_signOffsetY = value;
      }
      get signRequired() {
            return this.l_signRequired[1].checked;
      }
      set signRequired(value) {
            this.l_signRequired[1].checked = value;
      }
      get signWidth_AFront() {
            return parseFloat(this.l_width_SideAFront[1].value);
      }
      set signWidth_AFront(value) {
            this.l_width_SideAFront[1].value = value;
      }
      get signWidth_ABack() {
            return parseFloat(this.l_width_SideABack[1].value);
      }
      set signWidth_ABack(value) {
            this.l_width_SideABack[1].value = value;
      }
      get signHeight_AFront() {
            return parseFloat(this.l_height_SideAFront[1].value);
      }
      set signHeight_AFront(value) {
            this.l_height_SideAFront[1].value = value;
      }
      get signHeight_ABack() {
            return parseFloat(this.l_height_SideABack[1].value);
      }
      set signHeight_ABack(value) {
            this.l_height_SideABack[1].value = value;
      }
      get signWidth_BFront() {
            return parseFloat(this.l_width_SideBFront[1].value);
      }
      set signWidth_BFront(value) {
            this.l_width_SideBFront[1].value = value;
      }
      get signWidth_BBack() {
            return parseFloat(this.l_width_SideBBack[1].value);
      }
      set signWidth_BBack(value) {
            this.l_width_SideBBack[1].value = value;
      }
      get signHeight_BFront() {
            return parseFloat(this.l_height_SideBFront[1].value);
      }
      set signHeight_BFront(value) {
            this.l_height_SideBFront[1].value = value;
      }
      get signHeight_BBack() {
            return parseFloat(this.l_height_SideBBack[1].value);
      }
      set signHeight_BBack(value) {
            this.l_height_SideBBack[1].value = value;
      }
      get signType() {
            return this.l_signType[1].value;
      }
      set signType(value) {
            this.l_signType[1].value = value;
      }
      get signSides() {
            return this.l_signSides[1].value;
      }
      set signSides(value) {
            this.l_signSides[1].value = value;
      }
      get sign2ndSideBlank() {
            return this.l_2ndSideBlank[1].checked;
      }
      set sign2ndSideBlank(value) {
            this.l_2ndSideBlank[1].checked = value;
      }

      signToggle = () => {
            if(!this.signRequired) {
                  setFieldDisabled(true, this.l_width_SideAFront[1], this.l_width_SideAFront[0]);
                  setFieldDisabled(true, this.l_height_SideAFront[1], this.l_height_SideAFront[0]);
                  setFieldDisabled(true, this.l_signType[1], this.l_signType[0]);
                  setFieldDisabled(true, this.l_signSides[1], this.l_signSides[0]);
                  setFieldDisabled(true, this.l_2ndSideBlank[1], this.l_2ndSideBlank[0]);
                  setFieldHidden(true, this.l_width_SideAFront[1], this.l_width_SideAFront[0]);
                  setFieldHidden(true, this.l_height_SideAFront[1], this.l_height_SideAFront[0]);
                  setFieldHidden(true, this.l_width_SideABack[1], this.l_width_SideABack[0]);
                  setFieldHidden(true, this.l_height_SideABack[1], this.l_height_SideABack[0]);
                  setFieldHidden(true, this.l_width_SideBFront[1], this.l_width_SideBFront[0]);
                  setFieldHidden(true, this.l_height_SideBFront[1], this.l_height_SideBFront[0]);
                  setFieldHidden(true, this.l_width_SideBBack[1], this.l_width_SideBBack[0]);
                  setFieldHidden(true, this.l_height_SideBBack[1], this.l_height_SideBBack[0]);
                  setFieldHidden(true, this.l_signType[1], this.l_signType[0]);
                  setFieldHidden(true, this.l_signSides[1], this.l_signSides[0]);
                  setFieldHidden(true, this.l_2ndSideBlank[1], this.l_2ndSideBlank[0]);
                  setFieldHidden(true, this.l_sideAFrontLabel, this.l_sideAFrontLabel);
                  setFieldHidden(true, this.l_sideBFrontLabel, this.l_sideBFrontLabel);
                  setFieldHidden(true, this.l_sideABackLabel, this.l_sideABackLabel);
                  setFieldHidden(true, this.l_sideBBackLabel, this.l_sideBBackLabel);
                  setFieldHidden(true, this.l_hr1, this.l_hr1);
            } else {
                  setFieldDisabled(false, this.l_width_SideAFront[1], this.l_width_SideAFront[0]);
                  setFieldDisabled(false, this.l_height_SideAFront[1], this.l_height_SideAFront[0]);
                  setFieldDisabled(false, this.l_signType[1], this.l_signType[0]);
                  setFieldDisabled(false, this.l_signSides[1], this.l_signSides[0]);
                  setFieldDisabled(false, this.l_2ndSideBlank[1], this.l_2ndSideBlank[0]);
                  setFieldHidden(false, this.l_width_SideAFront[1], this.l_width_SideAFront[0]);
                  setFieldHidden(false, this.l_height_SideAFront[1], this.l_height_SideAFront[0]);
                  setFieldHidden(false, this.l_width_SideBFront[1], this.l_width_SideBFront[0]);
                  setFieldHidden(false, this.l_height_SideBFront[1], this.l_height_SideBFront[0]);
                  setFieldHidden(false, this.l_sideAFrontLabel, this.l_sideAFrontLabel);
                  setFieldHidden(false, this.l_sideBFrontLabel, this.l_sideBFrontLabel);
                  setFieldHidden(false, this.l_signType[1], this.l_signType[0]);
                  setFieldHidden(false, this.l_signSides[1], this.l_signSides[0]);
                  setFieldHidden(false, this.l_2ndSideBlank[1], this.l_2ndSideBlank[0]);
                  setFieldHidden(false, this.l_hr1, this.l_hr1);
                  this.secondSideToggle();
                  this.sideBToggle();
            }
            this.callback();
      };

      secondSideBlankToggle = () => {
            if(this.signSides == "Double-sided" && this.signType != "ACM (Blank)") {
                  setFieldHidden(false, null, this.l_2ndSideBlank[0]);
            } else {
                  this.sign2ndSideBlank = false;
                  setFieldHidden(true, null, this.l_2ndSideBlank[0]);
            }
            this.callback();
      };

      secondSideToggle = () => {
            if(this.signSides == "Double-sided") {
                  setFieldHidden(false, null, this.l_sideABackLabel);
                  setFieldHidden(false, null, this.l_width_SideABack[0]);
                  setFieldHidden(false, null, this.l_height_SideABack[0]);
                  setFieldHidden(false, null, this.l_sideBBackLabel);
                  setFieldHidden(false, null, this.l_width_SideBBack[0]);
                  setFieldHidden(false, null, this.l_height_SideBBack[0]);
            } else {
                  setFieldHidden(true, null, this.l_sideABackLabel);
                  setFieldHidden(true, null, this.l_width_SideABack[0]);
                  setFieldHidden(true, null, this.l_height_SideABack[0]);
                  setFieldHidden(true, null, this.l_sideBBackLabel);
                  setFieldHidden(true, null, this.l_width_SideBBack[0]);
                  setFieldHidden(true, null, this.l_height_SideBBack[0]);
            }
            this.secondSideBlankToggle();
      };

      sideBToggle = () => {
            if(attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign") {
                  setFieldDisabled(false, this.l_width_SideBFront[1], this.l_width_SideBFront[0]);
                  setFieldDisabled(false, this.l_height_SideBFront[1], this.l_height_SideBFront[0]);
            } else {
                  setFieldDisabled(true, this.l_width_SideBFront[1], this.l_width_SideBFront[0]);
                  setFieldDisabled(true, this.l_height_SideBFront[1], this.l_height_SideBFront[0]);
            }
      };


      setReferences(frameClass, legClass) {
            this.frameClass = frameClass;
            this.legClass = legClass;

            this.UpdateSVG();
      }

      rects = [];
      measurements = [];
      DrawRect(xOffset, yOffset, width, height, originPoint, others = {}) {

            let rect = new TSVGRectangle(this.DragZoomSVG.svgG, {
                  x: xOffset,
                  y: yOffset,
                  width: width,
                  height: height,
                  origin: originPoint,
                  fill: "blue",
                  opacity: others.opacity || 0.3,
                  class: "sign",
                  ...others
            });

            this.rects.push(rect);

            return rect.rect;
      }

      UpdateSVG() {
            if(!this.legClass) return;
            let legClass = this.legClass;
            let frameClass = this.frameClass;



            for(let r = this.rects.length - 1; r >= 0; r--) {
                  this.rects[r].Delete();
            }
            this.rects = [];

            for(let r = this.measurements.length - 1; r >= 0; r--) {
                  this.measurements[r].Delete();
            }
            this.measurements = [];

            if(!this.signRequired) return;

            this.signOffsetX = xOffset +
                  (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth) +
                  (attachmentType == "2 Post, Forward Frame, Front Sign" || attachmentType == "2 Post, Front Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" ? -legClass.legWidth : 0);
            this.signOffsetY = yOffset;
            var signOffsetX_top = xOffset_TopView +
                  (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth) +
                  (attachmentType == "2 Post, Forward Frame, Front Sign" || attachmentType == "2 Post, Front Frame, Front Sign" ? -legClass.legWidth : 0) +
                  (attachmentType == "3 Post, Centre Frame, Centre Sign" ? 0 : 0) +
                  (attachmentType == "3 Post, Forward Frame, Front Sign" ? -legClass.legWidth : 0) +
                  (attachmentType == "3 Post, Front Frame, Front Sign" ? -legClass.legWidth : 0);
            var signOffsetY_top = yOffset_TopView +
                  (attachmentType == "1 Post, Front Frame, Front Sign" || attachmentType == "2 Post, Front Frame, Front Sign" ? frameClass.frameDepth + legClass.legDepth : 0) +
                  (attachmentType == "2 Post, Centre Frame, Centre Sign" ? frameClass.frameDepth / 2 + legClass.legDepth / 2 : 0) +
                  (attachmentType == "2 Post, Forward Frame, Front Sign" ? legClass.legDepth : 0) +
                  (attachmentType == "3 Post, Centre Frame, Centre Sign" ? frameClass.frameDepth / 2 + legClass.legDepth / 2 + frameClass.frameWidth_SideB : 0) +
                  (attachmentType == "3 Post, Forward Frame, Front Sign" ? legClass.legDepth + frameClass.frameWidth_SideB : 0) +
                  (attachmentType == "3 Post, Front Frame, Front Sign" ? frameClass.frameDepth + legClass.legDepth + frameClass.frameWidth_SideB : 0);

            let frontRect = this.DrawRect(this.signOffsetX, this.signOffsetY, this.signWidth_AFront, this.signHeight_AFront);
            this.DrawRect(signOffsetX_top, signOffsetY_top, this.signWidth_AFront, 3, null, {opacity: 1});


            /*
                  x1, y1, x2, y2,
                  target,
                  direction = "both",
                  sides = [],
                  autoLabel = false,
                  unit = "mm",
                  scale = 1,
                  precision = 0,
                  arrowSize = 5,
                  textOffset = 20,
                  stroke = "#000",
                  lineWidth = 1,
                  fontSize = "12px",
                  tickLength = 8,
                  handleRadius = 8,
                  offsetX = 0,
                  offsetY = 0,
                  sideHint = null
            */

            this.measurements.push(new TSVGMeasurement(this.DragZoomSVG.svgG, {
                  target: frontRect,
                  direction: "both",
                  autoLabel: true,
                  deletable: true,
                  unit: "mm",
                  precision: 1,
                  scale: 1,
                  arrowSize: 10,
                  textOffset: 20,
                  stroke: "#000",
                  sides: ["top", "right"],
                  lineWidth: 3,
                  fontSize: "18px",
                  tickLength: 50,
                  handleRadius: 8,
                  offsetX: 150,
                  offsetY: 150
            }));

            if(this.signSides == "Double-sided") {
                  var signAOffsetX_top = xOffset_TopView +
                        (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth) +
                        (attachmentType == "2 Post, Forward Frame, Front Sign" || "2 Post, Centre Frame, Centre Sign" ? 0 : 0) +
                        (attachmentType == "2 Post, Front Frame, Front Sign" ? 0 : 0) +
                        (attachmentType == "3 Post, Front Frame, Front Sign" ? 0 : 0) +
                        (attachmentType == "3 Post, Forward Frame, Front Sign" ? 0 : 0) +
                        (attachmentType == "3 Post, Centre Frame, Centre Sign" ? 0 : 0);

                  var signAOffsetY_top = yOffset_TopView +
                        (attachmentType == "1 Post, Front Frame, Front Sign" || attachmentType == "2 Post, Front Frame, Front Sign" ? legClass.legDepth : 0) +
                        (attachmentType == "2 Post, Centre Frame, Centre Sign" ? legClass.legDepth / 2 - frameClass.frameDepth / 2 : 0) +
                        (attachmentType == "2 Post, Forward Frame, Front Sign" ? legClass.legDepth - frameClass.frameDepth : 0) +
                        (attachmentType == "3 Post, Front Frame, Front Sign" ? frameClass.frameWidth_SideB + legClass.legDepth : 0) +
                        (attachmentType == "3 Post, Forward Frame, Front Sign" ? frameClass.frameWidth_SideB + legClass.legDepth - frameClass.frameDepth : 0) +
                        (attachmentType == "3 Post, Centre Frame, Centre Sign" ? frameClass.frameWidth_SideB + legClass.legDepth / 2 - frameClass.frameDepth / 2 : 0);

                  this.DrawRect(signAOffsetX_top, signAOffsetY_top, this.signWidth_ABack, 3, "BL", {opacity: 1});

                  var sideB = attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign";
                  if(sideB) {
                        var signOffsetXB_top = xOffset_TopView +
                              (attachmentType == "3 Post, Centre Frame, Centre Sign" ? frameClass.frameWidth_SideA + legClass.legWidth * 1.5 + frameClass.frameDepth / 2 - frameClass.frameDepth : 0) +
                              (attachmentType == "3 Post, Forward Frame, Front Sign" ? frameClass.frameWidth_SideA + legClass.legWidth * 2 - frameClass.frameDepth : 0) +
                              (attachmentType == "3 Post, Front Frame, Front Sign" ? frameClass.frameWidth_SideA - frameClass.frameDepth : 0);
                        var signOffsetYB_top = yOffset_TopView +
                              (attachmentType == "3 Post, Centre Frame, Centre Sign" ? 0 : 0) +
                              (attachmentType == "3 Post, Forward Frame, Front Sign" ? -legClass.legWidth + legClass.legWidth : 0) +
                              (attachmentType == "3 Post, Front Frame, Front Sign" ? frameClass.frameDepth + legClass.legDepth - frameClass.frameDepth + legClass.legWidth : 0);

                        //top view
                        this.DrawRect(signOffsetXB_top, signOffsetYB_top, 3, this.signWidth_BBack, "TR", {opacity: 1});
                  }
            }
            var sideB = attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign";
            if(sideB) {
                  var sideB_ExtraOffset = sideBOffsetX + legClass.legWidth * 2 + frameClass.frameWidth_SideA;
                  this.signOffsetXB = xOffset + sideB_ExtraOffset +
                        (attachmentType == "3 Post, Front Frame, Front Sign" ? -legClass.legWidth * 2 - frameClass.frameDepth : 0) +
                        (attachmentType == "3 Post, Forward Frame, Front Sign" ? 0 : 0) +
                        (attachmentType == "3 Post, Centre Frame, Centre Sign" ? legClass.legDepth : 0);
                  this.signOffsetYB = yOffset;
                  var signOffsetXB_top = xOffset_TopView +
                        (attachmentType == "3 Post, Centre Frame, Centre Sign" ? frameClass.frameWidth_SideA + legClass.legWidth * 1.5 + frameClass.frameDepth / 2 : 0) +
                        (attachmentType == "3 Post, Forward Frame, Front Sign" ? frameClass.frameWidth_SideA + legClass.legWidth * 2 : 0) +
                        (attachmentType == "3 Post, Front Frame, Front Sign" ? frameClass.frameWidth_SideA : 0);
                  var signOffsetYB_top = yOffset_TopView + (attachmentType == "3 Post, Centre Frame, Centre Sign" ? 0 : 0) +
                        (attachmentType == "3 Post, Forward Frame, Front Sign" ? -legClass.legWidth : 0) +
                        (attachmentType == "3 Post, Front Frame, Front Sign" ? frameClass.frameDepth + legClass.legDepth - frameClass.frameDepth : 0);

                  let frontRect = this.DrawRect(this.signOffsetXB, this.signOffsetYB, this.signWidth_BFront, this.signHeight_BFront);
                  this.DrawRect(signOffsetXB_top, signOffsetYB_top, 3, this.signWidth_BFront, null, {opacity: 1});

                  this.measurements.push(new TSVGMeasurement(this.DragZoomSVG.svgG, {
                        target: frontRect,
                        direction: "both",
                        autoLabel: true,
                        deletable: true,
                        unit: "mm",
                        precision: 1,
                        scale: 1,
                        arrowSize: 10,
                        textOffset: 20,
                        stroke: "#000",
                        sides: ["top", "right"],
                        lineWidth: 3,
                        fontSize: "18px",
                        tickLength: 50,
                        handleRadius: 8,
                        offsetX: 150,
                        offsetY: 150
                  }));
            }


      }

      Draw(legClass, frameClass) {
            if(!this.signRequired) return;
            this.signOffsetX = xOffset + (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth) + (attachmentType == "2 Post, Forward Frame, Front Sign" || attachmentType == "2 Post, Front Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" ? -legClass.legWidth : 0);
            this.signOffsetY = yOffset;
            var signOffsetX_top = xOffset_TopView + (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth) + (attachmentType == "2 Post, Forward Frame, Front Sign" || attachmentType == "2 Post, Front Frame, Front Sign" ? -legClass.legWidth : 0) + (attachmentType == "3 Post, Centre Frame, Centre Sign" ? 0 : 0) + (attachmentType == "3 Post, Forward Frame, Front Sign" ? -legClass.legWidth : 0) + (attachmentType == "3 Post, Front Frame, Front Sign" ? -legClass.legWidth : 0);
            var signOffsetY_top = yOffset_TopView + (attachmentType == "1 Post, Front Frame, Front Sign" || attachmentType == "2 Post, Front Frame, Front Sign" ? frameClass.frameDepth + 3 + legClass.legDepth : 0) + (attachmentType == "2 Post, Centre Frame, Centre Sign" ? frameClass.frameDepth / 2 + 3 + legClass.legDepth / 2 : 0) + (attachmentType == "2 Post, Forward Frame, Front Sign" ? legClass.legDepth + 3 : 0) + (attachmentType == "3 Post, Centre Frame, Centre Sign" ? frameClass.frameDepth / 2 + 3 + legClass.legDepth / 2 + frameClass.frameWidth_SideB : 0) + (attachmentType == "3 Post, Forward Frame, Front Sign" ? legClass.legDepth + 3 + frameClass.frameWidth_SideB : 0) + (attachmentType == "3 Post, Front Frame, Front Sign" ? frameClass.frameDepth + 3 + legClass.legDepth + frameClass.frameWidth_SideB : 0);

            drawFillRect(this.#canvasCtx, this.signOffsetX, this.signOffsetY, this.signWidth_AFront, this.signHeight_AFront, null, COLOUR.Blue, 0.2);
            drawFillRect(this.#canvasCtx, signOffsetX_top - 3, signOffsetY_top, this.signWidth_AFront, 3, null, COLOUR.Blue, 1);
            if(this.signSides == "Double-sided") {
                  var signAOffsetX_top = xOffset_TopView + (attachmentType == "1 Post, Front Frame, Front Sign" ? 0 : legClass.legWidth) + (attachmentType == "2 Post, Forward Frame, Front Sign" || "2 Post, Centre Frame, Centre Sign" ? 0 : 0) + (attachmentType == "2 Post, Front Frame, Front Sign" ? legClass.legWidth : 0) + (attachmentType == "3 Post, Front Frame, Front Sign" ? 0 : 0) + (attachmentType == "3 Post, Forward Frame, Front Sign" ? 0 : 0) + (attachmentType == "3 Post, Centre Frame, Centre Sign" ? 0 : 0);
                  var signAOffsetY_top = yOffset_TopView + (attachmentType == "1 Post, Front Frame, Front Sign" || attachmentType == "2 Post, Front Frame, Front Sign" ? legClass.legDepth - 6 : 0) + (attachmentType == "2 Post, Centre Frame, Centre Sign" ? legClass.legDepth / 2 - frameClass.frameDepth / 2 - 6 : 0) + (attachmentType == "2 Post, Forward Frame, Front Sign" ? -6 + legClass.legDepth - frameClass.frameDepth : 0) + (attachmentType == "3 Post, Front Frame, Front Sign" ? frameClass.frameWidth_SideB - 6 + legClass.legDepth : 0) + (attachmentType == "3 Post, Forward Frame, Front Sign" ? frameClass.frameWidth_SideB - 6 + legClass.legDepth - frameClass.frameDepth : 0) + (attachmentType == "3 Post, Centre Frame, Centre Sign" ? frameClass.frameWidth_SideB - 6 + legClass.legDepth / 2 - frameClass.frameDepth / 2 : 0);

                  drawFillRect(this.#canvasCtx, signAOffsetX_top - 3, signAOffsetY_top, this.signWidth_ABack, 3, null, COLOUR.Blue, 1);
                  var sideB = attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign";
                  if(sideB) {
                        var signOffsetXB_top = xOffset_TopView + (attachmentType == "3 Post, Centre Frame, Centre Sign" ? frameClass.frameWidth_SideA + legClass.legWidth * 1.5 + frameClass.frameDepth / 2 - frameClass.frameDepth : 0) + (attachmentType == "3 Post, Forward Frame, Front Sign" ? frameClass.frameWidth_SideA + legClass.legWidth * 2 - frameClass.frameDepth : 0) + (attachmentType == "3 Post, Front Frame, Front Sign" ? frameClass.frameWidth_SideA - frameClass.frameDepth : 0);
                        var signOffsetYB_top = yOffset_TopView + (attachmentType == "3 Post, Centre Frame, Centre Sign" ? 0 : 0) + (attachmentType == "3 Post, Forward Frame, Front Sign" ? -legClass.legWidth + legClass.legWidth : 0) + (attachmentType == "3 Post, Front Frame, Front Sign" ? frameClass.frameDepth + legClass.legDepth - frameClass.frameDepth + legClass.legWidth : 0);
                        drawFillRect(this.#canvasCtx, signOffsetXB_top - 6, signOffsetYB_top - 3, 3, this.signWidth_BBack, null, COLOUR.Blue, 1);
                  }
            }
            var sideB = attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign";
            if(sideB) {
                  var sideB_ExtraOffset = sideBOffsetX + legClass.legWidth * 2 + frameClass.frameWidth_SideA;
                  this.signOffsetXB = xOffset + sideB_ExtraOffset + (attachmentType == "3 Post, Front Frame, Front Sign" ? -legClass.legWidth * 2 - frameClass.frameDepth : 0) + (attachmentType == "3 Post, Forward Frame, Front Sign" ? 0 : 0) + (attachmentType == "3 Post, Centre Frame, Centre Sign" ? legClass.legDepth : 0);
                  this.signOffsetYB = yOffset;
                  var signOffsetXB_top = xOffset_TopView + (attachmentType == "3 Post, Centre Frame, Centre Sign" ? frameClass.frameWidth_SideA + legClass.legWidth * 1.5 + frameClass.frameDepth / 2 : 0) + (attachmentType == "3 Post, Forward Frame, Front Sign" ? frameClass.frameWidth_SideA + legClass.legWidth * 2 : 0) + (attachmentType == "3 Post, Front Frame, Front Sign" ? frameClass.frameWidth_SideA : 0);
                  var signOffsetYB_top = yOffset_TopView + (attachmentType == "3 Post, Centre Frame, Centre Sign" ? 0 : 0) + (attachmentType == "3 Post, Forward Frame, Front Sign" ? -legClass.legWidth : 0) + (attachmentType == "3 Post, Front Frame, Front Sign" ? frameClass.frameDepth + legClass.legDepth - frameClass.frameDepth : 0);
                  drawFillRect(this.#canvasCtx, this.signOffsetXB, this.signOffsetYB, this.signWidth_BFront, this.signHeight_BFront, null, COLOUR.Blue, 0.2);
                  drawFillRect(this.#canvasCtx, signOffsetXB_top + 3, signOffsetYB_top - 3, 3, this.signWidth_BFront, null, COLOUR.Blue, 1);
            }
      }

      Update() {
            if(!this.signRequired) return;
            this.sideBToggle();
      }

      async Create(productNo, partIndex) {
            var sign2ndSideBlank = this.sign2ndSideBlank;
            if(this.signRequired) {
                  var sideB = attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign";
                  var times = sideB ? 2 : 1;
                  for(var t = 0; t < times; t++) {
                        var width, height, sideDescription;
                        var isSideA = t == 0,
                              isSideB = t == 1;
                        if(this.signSides == "Single-sided") {
                              if(isSideA) {
                                    width = this.signWidth_AFront;
                                    height = this.signHeight_AFront;
                                    sideDescription = "Side A - Front";
                              } else if(isSideB) {
                                    width = this.signWidth_BFront;
                                    height = this.signHeight_BFront;
                                    sideDescription = "Side B - Front";
                              }
                              if(this.signType == "ACM with Digitally Printed and Laminated Vinyl") {
                                    await createItems_ACM(width, height, sideDescription, false);
                              }
                              if(this.signType == "ACM (Blank)") {
                                    await createItems_ACMBlank(width, height, sideDescription);
                              }
                              if(this.signType == "High-quality Long-term Sail-track Banner") {
                                    await createItems_SailtrackBanner(width, height, sideDescription);
                              }
                        } else if(this.signSides == "Double-sided") {
                              if(isSideA) {
                                    width = this.signWidth_AFront;
                                    height = this.signHeight_AFront;
                                    sideDescription = "Side A - Front";
                              } else if(isSideB) {
                                    width = this.signWidth_BFront;
                                    height = this.signHeight_BFront;
                                    sideDescription = "Side B - Front";
                              }
                              if(this.signType == "ACM with Digitally Printed and Laminated Vinyl") {
                                    await createItems_ACM(width, height, sideDescription, false);
                              }
                              if(this.signType == "ACM (Blank)") {
                                    await createItems_ACMBlank(width, height, sideDescription);
                              }
                              if(this.signType == "High-quality Long-term Sail-track Banner") {
                                    await createItems_SailtrackBanner(width, height, sideDescription);
                              }
                              if(isSideA) {
                                    width = this.signWidth_ABack;
                                    height = this.signHeight_ABack;
                                    sideDescription = "Side A - Back";
                              } else if(isSideB) {
                                    width = this.signWidth_BBack;
                                    height = this.signHeight_BBack;
                                    sideDescription = "Side B - Back";
                              }
                              if(this.signType == "ACM with Digitally Printed and Laminated Vinyl") {
                                    await createItems_ACM(width, height, sideDescription, true);
                              }
                              if(this.signType == "ACM (Blank)") {
                                    await createItems_ACMBlank(width, height, sideDescription);
                              }
                              if(this.signType == "High-quality Long-term Sail-track Banner") {
                                    await createItems_SailtrackBanner(width, height, sideDescription);
                              }
                        }
                  }
                  async function createItems_ACM(width, height, sideDescription, isSecondSide) {
                        await q_AddPart_DimensionWH(productNo, partIndex, true, ACMLookup["Standard Primer"], 1, width, height, "[" + sideDescription + "] " + ACMLookup["Standard Primer"], null, true);
                        partIndex++;
                        if(!isSecondSide || (!sign2ndSideBlank && isSecondSide)) {
                              await q_AddPart_DimensionWH(productNo, partIndex, true, VinylLookup["Air Release"], 1, width, height, "[" + sideDescription + "] " + VinylLookup["Air Release"], null, true);
                              partIndex++;
                              await q_AddPart_DimensionWH(productNo, partIndex, true, LaminateLookup["Gloss"], 1, width, height, "[" + sideDescription + "] " + LaminateLookup["Gloss"], null, true);
                              partIndex++;
                              await q_AddPart_DimensionWH(productNo, partIndex, true, "zProduction - ACM/sqm", 1, width, height, "[" + sideDescription + "] Production - ACM/sqm", null, true);
                              partIndex++;
                        }
                        await GroupParts(productNo);
                  }
                  async function createItems_ACMBlank(width, height, sideDescription) {
                        await q_AddPart_DimensionWH(productNo, partIndex, true, ACMLookup["Standard Primer"], 1, width, height, "[" + sideDescription + "] " + ACMLookup["Standard Primer"], null, true);
                        partIndex++;
                        await GroupParts(productNo);
                  }
                  async function createItems_SailtrackBanner(width, height, sideDescription) {
                        await q_AddPart_DimensionWH(productNo, partIndex, true, "Banner - MMT - Signage, Viewing Distance +5m, Life 4+ years", 1, width, height, "[" + sideDescription + "] Banner - MMT - Signage, Viewing Distance +5m, Life 4+ years", null, true);
                        partIndex++;
                        await q_AddPart_DimensionWH(productNo, partIndex, true, "Sailtrack - (perimeter) - Aluminium Black/White", 1, width, height, "[" + sideDescription + "] Sailtrack - (perimeter) - Aluminium Black/White", null, true);
                        partIndex++;
                        await GroupParts(productNo);
                  }
            }
            return partIndex;
      }

      Description() {
            if(!this.signRequired) return "";
            var sideB = attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" || attachmentType == "3 Post, Front Frame, Front Sign";
            return "Sign: <br>" + "<ul>" + "<li>" + "Size (Side A): " + this.signWidth_AFront + "mmW x " + this.signHeight_AFront + "mmH" + "</li>" + (sideB ? "<li>" + "Size (Side B): " + this.signWidth_BFront + "mmW x " + this.signWidth_BFront + "mmH" + "</li>" : "") + "<li>" + "Sign Type: " + this.signType + "</li>" + "<li>" + this.signSides + "</li>" + (this.sign2ndSideBlank ? "<li>" + this.signSides + "</li>" : "") + "</ul>";
      }
}
