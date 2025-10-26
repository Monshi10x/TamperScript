class Leg {

	#canvasCtx;
	powdercoatingMarkup = 1.8;

	constructor(parentObject, canvasCtx, updateFunction, DragZoomSVG) {
		this.createGUI(parentObject, canvasCtx, updateFunction, DragZoomSVG);
	}

	createGUI(parentObject, canvasCtx, updateFunction, DragZoomSVG) {
		this.#canvasCtx = canvasCtx;
		this.callback = updateFunction;
		this.DragZoomSVG = DragZoomSVG;
		this.l_legContainer = document.createElement("div");
		this.l_legContainer.style = STYLE.BillboardMenus;
		this.l_legRequired = createCheckbox_Infield("Legs", true, "width:97%", this.legToggle, this.l_legContainer);
		this.l_qty = createInput_Infield("Qty", 2, "width:100px;margin-right:400px;", () => {this.callback(); this.UpdateSVG();}, this.l_legContainer);
		setFieldDisabled(true, this.l_qty[1], this.l_qty[0]);
		this.l_heightAboveGround = createInput_Infield("Height Above Ground", "2000", "width:150px;margin-right:400px;", () => {this.callback(); this.UpdateSVG();}, this.l_legContainer, true, 100);
		this.l_height = parseFloat(this.l_heightAboveGround[1].value);
		this.l_hr1 = createHr("width:95%", this.l_legContainer);
		this.l_material = createDropdown_Infield("Material", 0, "width:150px", null, this.changeDimensionListings, this.l_legContainer);
		this.l_materialOptions = new Array(RHSList.length);
		for(var bpmo = 0; bpmo < this.l_materialOptions.length; bpmo++) {
			this.l_materialOptions[bpmo] = createDropdownOption(RHSList[bpmo][0], RHSList[bpmo][0]);
			this.l_material[1].add(this.l_materialOptions[bpmo], bpmo);
		}
		this.l_dimensionsOptions;
		this.l_dimensions = createDropdown_Infield("Leg Dimensions", 0, "width:150px;", null, () => {this.callback(); this.UpdateSVG();}, this.l_legContainer);
		this.createDimensionsOptions(0 /*initially set to Gal Steel, index 0*/);
		dropdownSetSelectedText(this.l_dimensions[1], "75x75x3", false);
		this.l_flip = createCheckbox_Infield("Flip", false, "width:100px;", () => {this.callback(); this.UpdateSVG();}, this.l_legContainer);
		this.l_hr2 = createHr("width:95%", this.l_legContainer);
		this.l_cap = createDropdown_Infield("Cap", 0, "width:150px;", [createDropdownOption("Plastic Cap", "Plastic Cap"), createDropdownOption("Weld Closed", "Weld Closed"), createDropdownOption("Gal Cap", "Gal Cap")], () => {this.callback(); this.UpdateSVG();}, this.l_legContainer);
		this.l_hr3 = createHr("width:95%", this.l_legContainer);

		this.l_addPowdercoatingCkb = createCheckbox_Infield("Is Powdercoated", false, "", () => { }, this.l_legContainer);

		//this.l_powdercoatingCost = createInput_Infield("Cost", null, "width:100px;display:none;margin-left:50px;", null, this.l_legContainer);
		//this.l_powdercoatingMarkup = createInput_Infield("Markup", 1.8, "width:100px;display:none", null, this.l_legContainer, false, 0.1);
		//this.l_powdercoatingTotalEach = createDropdown_Infield("Total or Each", 1, "width:100px;display:none;margin-right:50px;", [createDropdownOption("Total", "Total"), createDropdownOption("Each (Per Frame)", "Each")], () => {this.callback(); this.UpdateSVG();}, this.l_legContainer);
		this.l_add2PacBtn = createButton("2Pac +", "width:150px;margin-right:400px;", this.toggle2Pac);
		this.l_legContainer.appendChild(this.l_add2PacBtn);
		this.l_2PacLitres = createInput_Infield("Litres", null, "width:100px;display:none;margin-left:50px;margin-right:400px;", null, this.l_legContainer, false, 0.000000000001);
		this.l_colourMatchTime = createInput_Infield("Colour Match Time", null, "width:150px;display:none;margin-left:50px;", null, this.l_legContainer, false, 10);
		this.l_setupTime = createInput_Infield("Setup Time (30m std)", 30, "width:150px;display:none", null, this.l_legContainer, false, 10);
		this.l_numberCoats = createInput_Infield("# Coats (2 std)", 2, "margin-left:50px;width:100px;display:none", null, this.l_legContainer, false, 1);
		this.l_sprayTime = createInput_Infield("Spray Time (per coat)", null, "width:150px;display:none", null, this.l_legContainer, false, 5);
		this.l_flashTime = createInput_Infield("Flash Time (15m std)", 15, "width:150px;display:none;margin-left:50px;margin-right:150px;", null, this.l_legContainer, false, 5);
		this.l_2PacTotalEach = createDropdown_Infield("Total or Each", 1, "width:100px;display:none;margin-left:50px;", [createDropdownOption("Total", "Total"), createDropdownOption("Each (Per Frame)", "Each")], () => {this.callback(); this.UpdateSVG();}, this.l_legContainer);
		parentObject.appendChild(this.l_legContainer);
	}

	legToggle = () => {
		if(this.legRequired == false) {
			setFieldDisabled(true, this.l_heightAboveGround[1], this.l_heightAboveGround[0]);
			setFieldDisabled(true, this.l_material[1], this.l_material[0]);
			setFieldDisabled(true, this.l_dimensions[1], this.l_dimensions[0]);
			setFieldDisabled(true, this.l_flip[1], this.l_flip[0]);
			setFieldDisabled(true, this.l_cap[1], this.l_cap[0]);
			setFieldHidden(true, this.l_qty[1], this.l_qty[0]);
			setFieldHidden(true, this.l_heightAboveGround[1], this.l_heightAboveGround[0]);
			setFieldHidden(true, this.l_material[1], this.l_material[0]);
			setFieldHidden(true, this.l_dimensions[1], this.l_dimensions[0]);
			setFieldHidden(true, this.l_flip[1], this.l_flip[0]);
			setFieldHidden(true, this.l_cap[1], this.l_cap[0]);
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
			setFieldDisabled(false, this.l_heightAboveGround[1], this.l_heightAboveGround[0]);
			setFieldDisabled(false, this.l_material[1], this.l_material[0]);
			setFieldDisabled(false, this.l_dimensions[1], this.l_dimensions[0]);
			setFieldDisabled(false, this.l_flip[1], this.l_flip[0]);
			setFieldDisabled(false, this.l_cap[1], this.l_cap[0]);
			setFieldHidden(false, this.l_qty[1], this.l_qty[0]);
			setFieldHidden(false, this.l_heightAboveGround[1], this.l_heightAboveGround[0]);
			setFieldHidden(false, this.l_material[1], this.l_material[0]);
			setFieldHidden(false, this.l_dimensions[1], this.l_dimensions[0]);
			setFieldHidden(false, this.l_flip[1], this.l_flip[0]);
			setFieldHidden(false, this.l_cap[1], this.l_cap[0]);
			setFieldHidden(false, this.l_add2PacBtn, this.l_add2PacBtn);
			this.l_add2PacBtn.innerText = "2Pac +";
			setFieldHidden(false, this.l_hr1, this.l_hr1);
			setFieldHidden(false, this.l_hr2, this.l_hr2);
			setFieldHidden(false, this.l_hr3, this.l_hr3);
		}
		this.callback();
	};

	get legRequired() {
		return this.l_legRequired[1].checked;
	}
	set legRequired(value) {
		this.l_legRequired.checked[1] = value;
	}
	get qty() {
		return parseFloat(this.l_qty[1].value);
	}
	set qty(value) {
		this.l_qty[1].value = value;
	}
	get legMaterial() {
		return this.l_material[1].value;
	}
	set legMaterial(value) {
		this.l_material[1].selectedIndex = value;
	}
	/**
	 * Returns eg '25x25x3'
	 */
	get legDimensions() {
		return this.l_dimensions[1].value;
	}
	set legDimensions(value) {
		this.l_dimensions[1].selectedIndex = value;
	}
	get legWidth() {
		if(!this.l_flip[1].checked) {
			return parseFloat(this.legDimensions.split("x")[0]);
		} else {
			return parseFloat(this.legDimensions.split("x")[1]);
		}
	}
	get legDepth() {
		if(!this.l_flip[1].checked) {
			return parseFloat(this.legDimensions.split("x")[1]);
		} else {
			return parseFloat(this.legDimensions.split("x")[0]);
		}
	}
	get legHeightAboveGround() {
		return parseFloat(this.l_heightAboveGround[1].value);
	}
	set legHeightAboveGround(value) {
		return (this.l_heightAboveGround[1].value = value);
	}
	get legHeight() {
		return parseFloat(this.l_height);
	}
	set legHeight(value) {
		this.l_height = value;
	}
	get isFlipDimensions() {
		return this.l_flip[1].checked;
	}
	set isFlipDimensions(value) {
		this.l_flip[1].checked = value;
	}
	get cap() {
		return this.l_cap[1].value;
	}
	set cap(value) {
		this.l_cap[1].value = value;
	}
	get powdercoatingCost() {
		let [materialW, materialH, materialT] = this.legDimensions.split("x");
		let surfaceArea = mmToM(parseFloat(materialW)) * mmToM(parseFloat(materialH)) * mmToM(this.getLegLinearMm());
		return Powdercoat.cost(surfaceArea, "Coat Only");
	}
	getLegLinearMm() {
		return this.qty * this.legHeight;
	}
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
	get measurementOffsetY() {
		return 200 + this.legHeight;
	}
	get measurementOffsetX() {
		return 200;
	}

	createDimensionsOptions(materialIndex) {
		this.l_dimensionsOptions = new Array(RHSList[materialIndex].length - 1);
		for(var fd = 0; fd < this.l_dimensionsOptions.length; fd++) {
			this.l_dimensionsOptions[fd] = createDropdownOption(RHSList[materialIndex][fd + 1 /*Offset by name index 0*/], RHSList[materialIndex][fd + 1 /*Offset by name index 0*/]);
			this.l_dimensions[1].add(this.l_dimensionsOptions[fd], fd);
		}
	}

	changeDimensionListings = () => {
		$(this.l_dimensions[1]).empty();
		this.createDimensionsOptions(this.l_material[1].selectedIndex);
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

	Draw(frameClass, baseplateClass, footingClass) {
		this.frameClass = frameClass;
		this.baseplateClass = baseplateClass;
		this.footingClass = footingClass;
		if(!this.legRequired) return;
		this.legHeight = this.legHeightAboveGround;
		if(baseplateClass.baseplateRequired) {
			this.legHeight -= baseplateClass.baseplateThickness;
		}
		if(footingClass.footingRequired) {
			this.legHeight += footingClass.depth;
		}
		yOffset_TopView = yOffset + this.legHeight + 1800;
		xOffset_TopView = xOffset;
		var frameOffsetXB = sideBOffsetX + xOffset + frameClass.frameWidth_SideA + (attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" ? this.legWidth : 0) + this.legWidth + (attachmentType == "3 Post, Front Frame, Front Sign" ? -this.legWidth : 0);
		if(this.legHeight > 0) {
			if(attachmentType == "1 Post, Front Frame, Front Sign") {
				this.qty = 1;
				drawRect(this.#canvasCtx, xOffset + (attachmentType == "1 Post, Front Frame, Front Sign" ? -this.legWidth / 2 : this.legWidth / 2) + frameClass.frameWidth_SideA / 2, yOffset, this.legWidth, this.legHeight);
				drawRect(this.#canvasCtx, xOffset_TopView + (attachmentType == "1 Post, Front Frame, Front Sign" ? -this.legWidth / 2 : this.legWidth / 2) + frameClass.frameWidth_SideA / 2, yOffset_TopView, this.legWidth, this.legDepth);
			} else if(attachmentType == "2 Post, Centre Frame, Centre Sign" || attachmentType == "2 Post, Forward Frame, Front Sign") {
				this.qty = 2;
				drawRect(this.#canvasCtx, xOffset, yOffset, this.legWidth, this.legHeight);
				drawRect(this.#canvasCtx, xOffset + this.legWidth + frameClass.frameWidth_SideA, yOffset, this.legWidth, this.legHeight);
				this.DrawMeasurements(xOffset, yOffset, this.legWidth * 2 + frameClass.frameWidth_SideA, this.legHeightAboveGround);
				drawRect(this.#canvasCtx, xOffset_TopView, yOffset_TopView, this.legWidth, this.legDepth);
				drawRect(this.#canvasCtx, xOffset_TopView + this.legWidth + frameClass.frameWidth_SideA, yOffset_TopView, this.legWidth, this.legDepth);
			} else if(attachmentType == "2 Post, Front Frame, Front Sign") {
				this.qty = 2;
				drawRect(this.#canvasCtx, xOffset, yOffset, this.legWidth, this.legHeight);
				drawRect(this.#canvasCtx, xOffset - this.legWidth + frameClass.frameWidth_SideA, yOffset, this.legWidth, this.legHeight);
				this.DrawMeasurements(xOffset, yOffset, frameClass.frameWidth_SideA, this.legHeightAboveGround);
				drawRect(this.#canvasCtx, xOffset_TopView, yOffset_TopView, this.legWidth, this.legDepth);
				drawRect(this.#canvasCtx, xOffset_TopView - this.legWidth + frameClass.frameWidth_SideA, yOffset_TopView, this.legWidth, this.legDepth);
			} else if(attachmentType == "3 Post, Centre Frame, Centre Sign") {
				this.qty = 3;
				var yOffset_TopView_Extra = frameClass.frameWidth_SideB;
				drawRect(this.#canvasCtx, xOffset, yOffset, this.legWidth, this.legHeight);
				drawRect(this.#canvasCtx, xOffset + this.legWidth + frameClass.frameWidth_SideA, yOffset, this.legWidth, this.legHeight);
				this.DrawMeasurements(xOffset, yOffset, this.legWidth * 2 + frameClass.frameWidth_SideA, this.legHeightAboveGround);
				drawRect(this.#canvasCtx, frameOffsetXB, yOffset, this.legDepth, this.legHeight);
				drawRect(this.#canvasCtx, frameOffsetXB + frameClass.frameWidth_SideB + this.legDepth, yOffset, this.legWidth, this.legHeight);
				this.DrawMeasurements(frameOffsetXB, yOffset, frameClass.frameWidth_SideB + this.legDepth + this.legWidth, this.legHeightAboveGround);
				drawRect(this.#canvasCtx, xOffset_TopView, yOffset_TopView + yOffset_TopView_Extra, this.legWidth, this.legDepth);
				drawRect(this.#canvasCtx, xOffset_TopView + this.legWidth + frameClass.frameWidth_SideA, yOffset_TopView + yOffset_TopView_Extra, this.legWidth, this.legDepth);
				drawRect(this.#canvasCtx, xOffset_TopView + this.legWidth * 1.5 + frameClass.frameWidth_SideA, yOffset_TopView, this.legDepth, this.legWidth, "B");
			} else if(attachmentType == "3 Post, Forward Frame, Front Sign") {
				this.qty = 3;
				var yOffset_TopView_Extra = frameClass.frameWidth_SideB;
				drawRect(this.#canvasCtx, xOffset, yOffset /*+todo:charli */, this.legWidth, this.legHeight);
				drawRect(this.#canvasCtx, xOffset + this.legWidth + frameClass.frameWidth_SideA, yOffset, this.legWidth, this.legHeight);
				this.DrawMeasurements(xOffset, yOffset, this.legWidth * 2 + frameClass.frameWidth_SideA, this.legHeightAboveGround);
				drawRect(this.#canvasCtx, frameOffsetXB, yOffset, this.legDepth, this.legHeight);
				drawRect(this.#canvasCtx, frameOffsetXB + this.legDepth + frameClass.frameWidth_SideB, yOffset, this.legWidth, this.legHeight);
				this.DrawMeasurements(frameOffsetXB, yOffset, frameClass.frameWidth_SideB + this.legDepth + this.legWidth, this.legHeightAboveGround);
				drawRect(this.#canvasCtx, xOffset_TopView, yOffset_TopView + yOffset_TopView_Extra, this.legWidth, this.legDepth);
				drawRect(this.#canvasCtx, xOffset_TopView + this.legWidth + frameClass.frameWidth_SideA, yOffset_TopView + yOffset_TopView_Extra, this.legWidth, this.legDepth);
				drawRect(this.#canvasCtx, xOffset_TopView + this.legWidth * 2 + frameClass.frameWidth_SideA, yOffset_TopView, this.legDepth, this.legWidth, "BR");
			} else if(attachmentType == "3 Post, Front Frame, Front Sign") {
				this.qty = 3;
				var yOffset_TopView_Extra = frameClass.frameWidth_SideB;
				var xFrameOverlap = frameClass.frameDepth;
				drawRect(this.#canvasCtx, xOffset, yOffset, this.legWidth, this.legHeight);
				drawRect(this.#canvasCtx, xOffset - this.legWidth + frameClass.frameWidth_SideA - xFrameOverlap, yOffset, this.legWidth, this.legHeight);
				this.DrawMeasurements(xOffset, yOffset, frameClass.frameWidth_SideA - xFrameOverlap, this.legHeightAboveGround);
				drawRect(this.#canvasCtx, frameOffsetXB, yOffset, this.legDepth, this.legHeight);
				drawRect(this.#canvasCtx, frameOffsetXB + frameClass.frameWidth_SideB - this.legWidth, yOffset, this.legWidth, this.legHeight);
				this.DrawMeasurements(frameOffsetXB, yOffset, frameClass.frameWidth_SideB, this.legHeightAboveGround);
				drawRect(this.#canvasCtx, xOffset_TopView, yOffset_TopView + yOffset_TopView_Extra, this.legWidth, this.legDepth);
				drawRect(this.#canvasCtx, xOffset_TopView + frameClass.frameWidth_SideA - xFrameOverlap - this.legWidth, yOffset_TopView + yOffset_TopView_Extra, this.legWidth, this.legDepth);
				drawRect(this.#canvasCtx, xOffset_TopView + frameClass.frameWidth_SideA - xFrameOverlap, yOffset_TopView + this.legDepth, this.legDepth, this.legWidth, "TR");
			} else {
				this.qty = 3;
			}
		}
	}

	setReferences(frameClass, legClass, footingClass, baseplateClass, signClass) {
		this.frameClass = frameClass;
		this.legClass = legClass;
		this.footingClass = footingClass;
		this.baseplateClass = baseplateClass;
		this.signClass = signClass;

		this.UpdateSVG();
	}

	rects = [];
	measurements = [];
	DrawRect(params) {
		let defaultColour = "#bbb";
		let defaultOpacity = 1;

		let rect = new TSVGRectangle(this.DragZoomSVG.svgG, {
			x: params.xOffset,
			y: params.yOffset,
			width: params.width,
			height: params.height,
			opacity: defaultOpacity,
			fill: params.colour || defaultColour,
			origin: params.originPoint,
			class: params.class || "leg",
			...params
		});
		this.rects.push(rect);

		return rect.rect;
	}

	UpdateSVG() {
		let legClass = this.legClass;
		let frameClass = this.frameClass;
		let footingClass = this.footingClass;
		let baseplateClass = this.baseplateClass;
		let signClass = this.signClass;

		for(let r = this.rects.length - 1; r >= 0; r--) {
			this.rects[r].Delete();
		}
		this.rects = [];

		for(let r = this.measurements.length - 1; r >= 0; r--) {
			this.measurements[r].Delete();
		}
		this.measurements = [];

		if(!this.legRequired) return;
		this.legHeight = this.legHeightAboveGround;
		if(baseplateClass.baseplateRequired) {
			this.legHeight -= baseplateClass.baseplateThickness;
		}
		if(footingClass.footingRequired) {
			this.legHeight += footingClass.depth;
		}
		yOffset_TopView = yOffset + this.legHeight + 1800;
		xOffset_TopView = xOffset;
		var frameOffsetXB = sideBOffsetX + xOffset + frameClass.frameWidth_SideA +
			(attachmentType == "3 Post, Centre Frame, Centre Sign" || attachmentType == "3 Post, Forward Frame, Front Sign" ? this.legWidth : 0) +
			this.legWidth +
			(attachmentType == "3 Post, Front Frame, Front Sign" ? -this.legWidth : 0);

		let signIsDoubleSided = this.signClass.signSides == "Double-sided";

		if(this.legHeight > 0) {
			if(attachmentType == "1 Post, Front Frame, Front Sign") {
				this.qty = 1;
				let legToMeasure = this.DrawRect({
					xOffset: xOffset + (attachmentType == "1 Post, Front Frame, Front Sign" ? -this.legWidth / 2 : this.legWidth / 2) + frameClass.frameWidth_SideA / 2,
					yOffset: yOffset,
					width: this.legWidth,
					height: this.legHeight
				});
				this.DrawRect({
					xOffset: xOffset_TopView + (attachmentType == "1 Post, Front Frame, Front Sign" ? -this.legWidth / 2 : this.legWidth / 2) + frameClass.frameWidth_SideA / 2,
					yOffset: yOffset_TopView - (signIsDoubleSided ? 3 : 0),
					width: this.legWidth,
					height: this.legDepth
				});
				this.measurements.push(new TSVGMeasurement(this.DragZoomSVG.svgG, {
					target: legToMeasure,
					direction: "both",
					autoLabel: true,
					deletable: true,
					unit: "mm",
					precision: 1,
					scale: 1,
					arrowSize: 10,
					textOffset: 20,
					stroke: "#000",
					sides: ["top", "left"],
					lineWidth: 3,
					fontSize: "18px",
					tickLength: 50,
					handleRadius: 30,
					offsetX: 300 + Math.max(signClass.signWidth_AFront, frameClass.frameWidth_SideA) / 2,
					offsetY: 50
				}));
			} else if(attachmentType == "2 Post, Centre Frame, Centre Sign" || attachmentType == "2 Post, Forward Frame, Front Sign") {
				this.qty = 2;
				let legToMeasure = this.DrawRect({xOffset, yOffset, width: this.legWidth, height: this.legHeight});
				this.DrawRect({xOffset: xOffset + this.legWidth + frameClass.frameWidth_SideA, yOffset, width: this.legWidth, height: this.legHeight});
				this.DrawMeasurements(xOffset, yOffset, this.legWidth * 2 + frameClass.frameWidth_SideA, this.legHeightAboveGround);
				this.DrawRect({xOffset: xOffset_TopView, yOffset: yOffset_TopView, width: this.legWidth, height: this.legDepth});
				this.DrawRect({xOffset: xOffset_TopView + this.legWidth + frameClass.frameWidth_SideA, yOffset: yOffset_TopView, width: this.legWidth, height: this.legDepth});

				this.measurements.push(new TSVGMeasurement(this.DragZoomSVG.svgG, {
					target: legToMeasure,
					direction: "both",
					autoLabel: true,
					deletable: true,
					unit: "mm",
					precision: 1,
					scale: 1,
					arrowSize: 10,
					textOffset: 20,
					stroke: "#000",
					sides: ["top", "left"],
					lineWidth: 3,
					fontSize: "18px",
					tickLength: 50,
					handleRadius: 30,
					offsetX: 300,
					offsetY: 50
				}));
			} else if(attachmentType == "2 Post, Front Frame, Front Sign") {
				this.qty = 2;
				let legToMeasure = this.DrawRect({xOffset, yOffset, width: this.legWidth, height: this.legHeight});
				this.DrawRect({xOffset: xOffset - this.legWidth + frameClass.frameWidth_SideA, yOffset, width: this.legWidth, height: this.legHeight});
				this.DrawMeasurements(xOffset, yOffset, frameClass.frameWidth_SideA, this.legHeightAboveGround);
				this.DrawRect({xOffset: xOffset_TopView, yOffset: yOffset_TopView, width: this.legWidth, height: this.legDepth});
				this.DrawRect({xOffset: xOffset_TopView - this.legWidth + frameClass.frameWidth_SideA, yOffset: yOffset_TopView, width: this.legWidth, height: this.legDepth});

				this.measurements.push(new TSVGMeasurement(this.DragZoomSVG.svgG, {
					target: legToMeasure,
					direction: "both",
					autoLabel: true,
					deletable: true,
					unit: "mm",
					precision: 1,
					scale: 1,
					arrowSize: 10,
					textOffset: 20,
					stroke: "#000",
					sides: ["top", "left"],
					lineWidth: 3,
					fontSize: "18px",
					tickLength: 50,
					handleRadius: 30,
					offsetX: 300,
					offsetY: 50
				}));
			} else if(attachmentType == "3 Post, Centre Frame, Centre Sign") {
				this.qty = 3;
				var yOffset_TopView_Extra = frameClass.frameWidth_SideB;
				let legToMeasure = this.DrawRect({xOffset, yOffset, width: this.legWidth, height: this.legHeight});
				this.DrawRect({xOffset: xOffset + this.legWidth + frameClass.frameWidth_SideA, yOffset, width: this.legWidth, height: this.legHeight});
				this.DrawMeasurements(xOffset, yOffset, this.legWidth * 2 + frameClass.frameWidth_SideA, this.legHeightAboveGround);
				this.DrawRect({xOffset: frameOffsetXB, yOffset, width: this.legDepth, height: this.legHeight});
				this.DrawRect({xOffset: frameOffsetXB + frameClass.frameWidth_SideB + this.legDepth, yOffset, width: this.legWidth, height: this.legHeight});
				this.DrawMeasurements(frameOffsetXB, yOffset, frameClass.frameWidth_SideB + this.legDepth + this.legWidth, this.legHeightAboveGround);
				this.DrawRect({xOffset: xOffset_TopView, yOffset: yOffset_TopView + yOffset_TopView_Extra, width: this.legWidth, height: this.legDepth});
				this.DrawRect({xOffset: xOffset_TopView + this.legWidth + frameClass.frameWidth_SideA, yOffset: yOffset_TopView + yOffset_TopView_Extra, width: this.legWidth, height: this.legDepth});
				this.DrawRect({xOffset: xOffset_TopView + this.legWidth * 1.5 + frameClass.frameWidth_SideA, yOffset: yOffset_TopView, width: this.legDepth, height: this.legWidth, originPoint: "B"});

				this.measurements.push(new TSVGMeasurement(this.DragZoomSVG.svgG, {
					target: legToMeasure,
					direction: "both",
					autoLabel: true,
					deletable: true,
					unit: "mm",
					precision: 1,
					scale: 1,
					arrowSize: 10,
					textOffset: 20,
					stroke: "#000",
					sides: ["top", "left"],
					lineWidth: 3,
					fontSize: "18px",
					tickLength: 50,
					handleRadius: 30,
					offsetX: 300,
					offsetY: 50
				}));
			} else if(attachmentType == "3 Post, Forward Frame, Front Sign") {
				this.qty = 3;
				var yOffset_TopView_Extra = frameClass.frameWidth_SideB;
				let legToMeasure = this.DrawRect({xOffset, yOffset, width: this.legWidth, height: this.legHeight});
				this.DrawRect({xOffset: xOffset + this.legWidth + frameClass.frameWidth_SideA, yOffset, width: this.legWidth, height: this.legHeight});
				this.DrawMeasurements(xOffset, yOffset, this.legWidth * 2 + frameClass.frameWidth_SideA, this.legHeightAboveGround);
				this.DrawRect({xOffset: frameOffsetXB, yOffset, width: this.legDepth, height: this.legHeight});
				this.DrawRect({xOffset: frameOffsetXB + this.legDepth + frameClass.frameWidth_SideB, yOffset, width: this.legWidth, height: this.legHeight});
				this.DrawMeasurements(frameOffsetXB, yOffset, frameClass.frameWidth_SideB + this.legDepth + this.legWidth, this.legHeightAboveGround);
				this.DrawRect({xOffset: xOffset_TopView, yOffset: yOffset_TopView + yOffset_TopView_Extra, width: this.legWidth, height: this.legDepth});
				this.DrawRect({xOffset: xOffset_TopView + this.legWidth + frameClass.frameWidth_SideA, yOffset: yOffset_TopView + yOffset_TopView_Extra, width: this.legWidth, height: this.legDepth});
				this.DrawRect({xOffset: xOffset_TopView + this.legWidth * 2 + frameClass.frameWidth_SideA, yOffset: yOffset_TopView, width: this.legDepth, height: this.legWidth, originPoint: "BR"});

				this.measurements.push(new TSVGMeasurement(this.DragZoomSVG.svgG, {
					target: legToMeasure,
					direction: "both",
					autoLabel: true,
					deletable: true,
					unit: "mm",
					precision: 1,
					scale: 1,
					arrowSize: 10,
					textOffset: 20,
					stroke: "#000",
					sides: ["top", "left"],
					lineWidth: 3,
					fontSize: "18px",
					tickLength: 50,
					handleRadius: 30,
					offsetX: 300,
					offsetY: 50
				}));
			} else if(attachmentType == "3 Post, Front Frame, Front Sign") {
				this.qty = 3;
				var yOffset_TopView_Extra = frameClass.frameWidth_SideB;
				var xFrameOverlap = frameClass.frameDepth;
				let legToMeasure = this.DrawRect({xOffset, yOffset, width: this.legWidth, height: this.legHeight});
				this.DrawRect({xOffset: xOffset - this.legWidth + frameClass.frameWidth_SideA - xFrameOverlap, yOffset, width: this.legWidth, height: this.legHeight});
				this.DrawMeasurements(xOffset, yOffset, frameClass.frameWidth_SideA - xFrameOverlap, this.legHeightAboveGround);
				this.DrawRect({xOffset: frameOffsetXB, yOffset, width: this.legDepth, height: this.legHeight});
				this.DrawRect({xOffset: frameOffsetXB + frameClass.frameWidth_SideB - this.legWidth, yOffset, width: this.legWidth, height: this.legHeight});
				this.DrawMeasurements(frameOffsetXB, yOffset, frameClass.frameWidth_SideB, this.legHeightAboveGround);
				this.DrawRect({xOffset: xOffset_TopView, yOffset: yOffset_TopView + yOffset_TopView_Extra, width: this.legWidth, height: this.legDepth});
				this.DrawRect({xOffset: xOffset_TopView + frameClass.frameWidth_SideA - xFrameOverlap - this.legWidth, yOffset: yOffset_TopView + yOffset_TopView_Extra, width: this.legWidth, height: this.legDepth});
				this.DrawRect({xOffset: xOffset_TopView + frameClass.frameWidth_SideA - xFrameOverlap, yOffset: yOffset_TopView + this.legDepth, width: this.legDepth, height: this.legWidth, originPoint: "TR"});

				this.measurements.push(new TSVGMeasurement(this.DragZoomSVG.svgG, {
					target: legToMeasure,
					direction: "both",
					autoLabel: true,
					deletable: true,
					unit: "mm",
					precision: 1,
					scale: 1,
					arrowSize: 10,
					textOffset: 20,
					stroke: "#000",
					sides: ["top", "left"],
					lineWidth: 3,
					fontSize: "18px",
					tickLength: 50,
					handleRadius: 30,
					offsetX: 300,
					offsetY: 50
				}));
			} else {
				this.qty = 3;
			}
		}

	}

	DrawMeasurements(xOffset, yOffset, width, height) {
		drawMeasurement(this.#canvasCtx, xOffset + width + this.measurementOffsetX, yOffset, 0, height, height + "mm", false, "L");
		drawMeasurement(this.#canvasCtx, xOffset, yOffset + this.measurementOffsetY, width, 0, width + "mm", true, "T");
	}

	Update() {
		if(!this.legRequired) return;
	}

	async Create(productNo, partIndex) {
		if(this.legRequired) {
			var legPartName = "RHS - " + this.legMaterial + " " + this.legDimensions;
			await AddPart(legPartName, productNo);
			partIndex++;
			await setPartQty(productNo, partIndex, this.qty);
			await setPartWidth(productNo, partIndex, this.legHeight);
			await setPartText(productNo, partIndex, "Cut To: \n" + "x" + this.qty + " @ " + this.legHeight + "mm");
			await savePart(productNo, partIndex);
			await setPartDescription(productNo, partIndex, "[LEG] " + legPartName);
			if(this.cap == "Plastic Cap") {
				await AddPart("Cap - Plastic 100x100", productNo);
				partIndex++;
				await setPartQty(productNo, partIndex, this.qty);
				await setPartDescription(productNo, partIndex, "[LEG] Cap - Plastic 100x100");
				await savePart(productNo, partIndex);
			}
			//Outsource - Powdercoating (ACE) (ea)
			if(this.l_addPowdercoatingCkb[1].checked) {
				await AddPart("Outsource - Powdercoating (ACE) (ea)", productNo);
				partIndex++;
				await setPartQty(productNo, partIndex, 1);
				await setPartVendorCostEa(productNo, partIndex, this.powdercoatingCost);
				await setPartMarkupEa(productNo, partIndex, this.powdercoatingMarkup);
				await setPartDescription(productNo, partIndex, "[LEG(s)] Powdercoating");
				await savePart(productNo, partIndex);

			}
			if(this.twoPacRequired) {
				await q_AddPart_Painting(productNo, partIndex, true, this.twoPacTotalEach == "Total" ? true : false, this.twoPacTotalEach == "Total" ? 1 : this.qty, this.twoPacLitres, this.twoPacColourMatchTime, this.twoPacNumberCoats, this.twoPacSetupTime, this.twoPacFlashTime, this.twoPacSprayTime, "[LEG] 2Pac Painting");
				partIndex++;
			}
		}
		return partIndex;
	}

	Description() {
		if(!this.legRequired) return "";
		return "Leg(s): <br>" + "<ul>" + "<li>" + "Material: " + this.legWidth + "mmW x " + this.legDepth + "mmD" + " " + this.legMaterial + "</li>" + "<li>" + "Height Above Ground: " + this.legHeightAboveGround + "mmH" + "</li>" + (this.powdercoatingRequired ? "<li> Powdercoated Standard Black or White </li>" : "") + (this.twoPacRequired ? "<li> 2Pac painted Standard Black or White </li>" : "") + "</ul>";
	}
}
