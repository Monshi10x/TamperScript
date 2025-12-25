class Router extends SubMenu {

	static maxCutSize = {width: 4100, height: 2100};

	perShapeTime = secondsToMinutes(5);
	runRows = [];
	detectedMaterial = null;
	detectedThickness = null;
	latestSubscriptionData = null;
	profileWarningId = null;
	#showIDInContainer = true;

	constructor(parentContainer, canvasCtx, updateFunction, sizeClass) {
		super(parentContainer, canvasCtx, updateFunction, "CNC Router");

		this.createQtySection();
		this.createSetupSection();
		this.createRunSection();
		this.createCleanSection();
		this.createFieldGroups();

		this.Update();
	}

	createQtySection() {
		let qtyContainer = createDivStyle5(null, "Qty", this.contentContainer);
		qtyContainer[3].style.cssText += "width:50px;";
		qtyContainer[1].style.cssText = "width:calc(100% - 50px)";
		this.l_qty = createInput_Infield("Qty", 1, "width:30%;min-width:50px;", null, qtyContainer[1], true, 1);
		this.l_timeTE = createDropdown_Infield("Each or Total", 1, "width:30%;margin-right:30%;", [
			createDropdownOption("Total", "Total"),
			createDropdownOption("Each", "Each")
		], () => {this.Update();}, qtyContainer[1]);
		this.qtyContainer = qtyContainer;
	}

	createSetupSection() {
		let setupContainer = createDivStyle5(null, "Setup", this.contentContainer);
		setupContainer[3].style.cssText += "width:50px;";
		setupContainer[1].style.cssText = "width:calc(100% - 50px)";
		this.l_setupOnceOff = createCheckbox_Infield("Setup One Sheet", true, "width:30%;", () => {this.Update();}, setupContainer[1], true);
		this.l_setupMultiple = createCheckbox_Infield("Setup Multiple Sheets", false, "width:60%;", () => {this.Update();}, setupContainer[1], true);
		checkboxesAddToSelectionGroup(true, this.l_setupOnceOff, this.l_setupMultiple);
		this.l_setupNumberOfSheets = createInput_Infield("Number of Sheets", 1, "width:30%;display:none", () => {this.Update();}, setupContainer[1], false, 1);
		this.l_setupPerSheet = createInput_Infield("Setup per Sheet", 20, "width:30%;display:none", () => {this.Update();}, setupContainer[1], false, 10, {postfix: "mins"});
		this.l_setupTime = createInput_Infield("Total Setup Minutes", 20, "width:30%;", null, setupContainer[1], false, 10, {postfix: "mins"});
		this.setupContainer = setupContainer;
	}

	createRunSection() {
		let runContainer = createDivStyle5(null, "Run", this.contentContainer);
		runContainer[3].style.cssText += "width:50px;";
		runContainer[1].style.cssText = "width:calc(100% - 50px)";
		this.l_usePaths = createCheckbox_Infield("Use Path Specs for Times", true, "width:60%;margin-right:30%;", () => {this.UpdateRun();}, runContainer[1]);
		this.l_cuttingTable = new Table(runContainer[1], "100%", 20, 250);
		this.l_cuttingTable.setHeading("Path Length", "Number Shapes", "Material", "Thickness", "Profile", "Quality", "Speed", "Total Time", "Delete");
		this.l_addRowBtn = createButton("+ Row", "width:15%;margin:0px;margin-right:70%;min-width:80px;", () => {this.addRunRow(0, 0, {isCustom: true});}, runContainer[1]);
		this.l_runTime = createInput_Infield("Total Run Minutes", 20, "width:30%", null, runContainer[1], false, 10, {postfix: "mins"});
		this.runContainer = runContainer;
	}

	createCleanSection() {
		let cleanContainer = createDivStyle5(null, "Clean", this.contentContainer);
		cleanContainer[3].style.cssText += "width:50px;";
		cleanContainer[1].style.cssText = "width:calc(100% - 50px)";
		this.l_cleanOnceOff = createCheckbox_Infield("Clean One Sheet", true, "width:30%;", () => {this.Update();}, cleanContainer[1], true);
		this.l_cleanMultiple = createCheckbox_Infield("Clean Multiple Sheets", false, "width:60%;", () => {this.Update();}, cleanContainer[1], true);
		checkboxesAddToSelectionGroup(true, this.l_cleanOnceOff, this.l_cleanMultiple);
		this.l_cleanNumberOfSheets = createInput_Infield("Number of Sheets", 1, "width:30%;display:none", () => {this.Update();}, cleanContainer[1], false, 1);
		this.l_cleanPerSheet = createInput_Infield("Clean per Sheet", 20, "width:30%;display:none", () => {this.Update();}, cleanContainer[1], false, 1, {postfix: "mins"});
		this.l_cleanTime = createInput_Infield("Total Clean Minutes", 20, "width:30%", null, cleanContainer[1], false, 10, {postfix: "mins"});
		this.cleanContainer = cleanContainer;
	}

	createFieldGroups() {
		makeFieldGroup("Checkbox", this.l_setupMultiple[1], true, this.l_setupNumberOfSheets[0], this.l_setupPerSheet[0]);
		makeFieldGroup("Checkbox", this.l_cleanMultiple[1], true, this.l_cleanNumberOfSheets[0], this.l_cleanPerSheet[0]);
		makeFieldGroup("Checkbox", this.l_usePaths[1], true, this.l_cuttingTable.container, this.l_addRowBtn);
		makeFieldGroup("Checkbox",
			this.requiredField[1], false, this.l_qty[0], this.l_timeTE[0], this.l_setupOnceOff[0], this.l_setupTime[0], this.l_runTime[0], this.l_addRowBtn,
			this.l_cleanTime[0], this.l_usePaths[0], this.l_cuttingTable.container, this.l_setupMultiple[0], this.l_setupNumberOfSheets[0], this.l_setupPerSheet[0],
			this.l_cleanMultiple[0], this.l_cleanNumberOfSheets[0], this.l_cleanPerSheet[0], this.l_cleanOnceOff[0], this.qtyContainer[0], this.setupContainer[0],
			this.runContainer[0], this.cleanContainer[0]
		);
	}

	getQWHD() {
		for(let i = 0; i < this.subscriptions.length; i++) {
			if(this.subscriptions[i].Type.toLowerCase().includes("size")) {
				return new QWHD(this.subscriptions[i].qty, this.subscriptions[i].width, this.subscriptions[i].height, this.subscriptions[i].depth);
			}
		}
		return new QWHD(0, 0, 0);
	};

	/*overrides*/ReceiveSubscriptionData(data) {
		super.ReceiveSubscriptionData(data);
		this.latestSubscriptionData = data;
		let detectedMaterial = this.extractMaterialFromSubscription(data);
		if(detectedMaterial == null) {
			this.notifyProfileMissing("Router material not found for current sheet selection.");
			return;
		}
		let detectedThickness = this.extractThicknessFromSubscription(data, detectedMaterial);

		this.detectedMaterial = detectedMaterial;
		this.detectedThickness = detectedThickness;

		if(detectedThickness == null) {
			this.notifyProfileMissing(`Router thickness not found for ${detectedMaterial}.`);
		}

		this.applyDetectedMaterialToRows(detectedMaterial, data, detectedThickness);
		this.UpdateRun();
	}

	extractMaterialFromSubscription(data) {
		if(typeof RouterToolpathTimeLookup !== "object" || RouterToolpathTimeLookup == null) return null;
		if(!data || !data.data || !Array.isArray(data.data)) return null;
		let materialKeys = Object.keys(RouterToolpathTimeLookup);
		let parsedMaterialFromSheet = this.getMaterialFromSheetMaterial(data);
		if(parsedMaterialFromSheet) return parsedMaterialFromSheet;

		for(let i = 0; i < data.data.length; i++) {
			let sheetMaterial = data.data[i].sheetMaterial;
			if(sheetMaterial == null) continue;
			for(let k = 0; k < materialKeys.length; k++) {
				if(sheetMaterial.toLowerCase().includes(materialKeys[k].toLowerCase())) {
					return materialKeys[k];
				}
			}
		}
		return null;
	}

	extractThicknessFromSubscription(data, materialKey) {
		if(typeof RouterToolpathTimeLookup !== "object" || RouterToolpathTimeLookup == null) return null;
		if(!data || !data.data || !Array.isArray(data.data) || materialKey == null) return null;
		let sheetMaterials = this.getSheetMaterialsFromData(data);

		for(let i = 0; i < sheetMaterials.length; i++) {
			let predefinedThickness = this.getThicknessFromPredefined(sheetMaterials[i], materialKey);
			if(predefinedThickness != null) return predefinedThickness;

			let matchedThickness = this.matchThicknessToProfiles(sheetMaterials[i], materialKey);
			if(matchedThickness != null) return matchedThickness;
		}

		return null;
	}

	applyDetectedMaterialToRows(material, subscriptionData = null, thicknessOverride = null) {
		let thickness = thicknessOverride ?? this.extractThicknessFromSubscription(subscriptionData, material);

		for(let i = 0; i < this.runRows.length; i++) {
			let currentRow = this.runRows[i];
			if(currentRow.rowElement && currentRow.rowElement.id == "customRow") continue;
			if(currentRow.allowAutoDetection === false) continue;
			this.applyMaterialToRow(currentRow, material, thickness);
		}
	}

	applyMaterialToRow(row, material, thickness) {
		let materialField = row.items[2][1];
		let thicknessField = row.items[3][1];
		let profileField = row.items[4][1];
		let qualityField = row.items[5][1];
		let speedField = row.items[6][1];

		if(row.suppressAutoDetectionFlag) return;
		row.suppressAutoDetectionFlag = true;

		dropdownSetSelectedValue(materialField, material);
		this.updateCutProfile("Material", materialField, thicknessField, profileField, qualityField, speedField);

		if(thickness != null && this.fieldHasOption(thicknessField, thickness)) {
			dropdownSetSelectedValue(thicknessField, thickness);
		} else {
			if(thickness == null) this.notifyProfileMissing(`Router thickness not found for ${material}.`);
			// populate thickness options but avoid forcing a default when unknown
			thicknessField.selectedIndex = -1;
			row.suppressAutoDetectionFlag = false;
			return;
		}
		this.updateCutProfile("Thickness", materialField, thicknessField, profileField, qualityField, speedField);

		if(profileField.options.length > 0 && profileField.value == "") profileField.selectedIndex = 0;
		this.updateCutProfile("Profile", materialField, thicknessField, profileField, qualityField, speedField);

		if(qualityField.options.length > 0 && qualityField.value == "") qualityField.selectedIndex = 0;
		this.updateCutProfile("Quality", materialField, thicknessField, profileField, qualityField, speedField);

		row.suppressAutoDetectionFlag = false;
	}

	fieldHasOption(field, value) {
		for(let i = 0; i < field.options.length; i++) {
			if(field.options[i].value == value) return true;
		}
		return false;
	}

	getSheetMaterialsFromData(data) {
		let sheetMaterials = [];
		if(data && data.data && Array.isArray(data.data)) {
			for(let i = 0; i < data.data.length; i++) {
				if(data.data[i].sheetMaterial) sheetMaterials.push(data.data[i].sheetMaterial);
			}
		}
		return sheetMaterials;
	}

	getMaterialFromSheetMaterial(data) {
		if(typeof RouterToolpathTimeLookup !== "object" || RouterToolpathTimeLookup == null) return null;
		let materialKeys = Object.keys(RouterToolpathTimeLookup);
		let sheetMaterials = this.getSheetMaterialsFromData(data);

		for(let i = 0; i < sheetMaterials.length; i++) {
			let baseMaterialName = sheetMaterials[i].split(" - ")[0].trim();
			if(baseMaterialName.length === 0) continue;
			for(let k = 0; k < materialKeys.length; k++) {
				let key = materialKeys[k];
				if(baseMaterialName.toLowerCase() === key.toLowerCase()) return key;
				if(baseMaterialName.toLowerCase().includes(key.toLowerCase())) return key;
			}
		}
		return null;
	}

	getThicknessFromPredefined(sheetMaterial, materialKey) {
		if(typeof predefinedParts_obj === "undefined" || predefinedParts_obj == null) return null;
		let matchedPart = predefinedParts_obj.find(p => p.Name === sheetMaterial) || predefinedParts_obj.find(p => p.Name && p.Name.includes(sheetMaterial));
		if(!matchedPart || !matchedPart.Thickness) return null;
		return this.matchThicknessToProfiles(matchedPart.Thickness, materialKey);
	}

	matchThicknessToProfiles(thicknessCandidate, materialKey) {
		let availableThicknesses = Object.keys(RouterToolpathTimeLookup[materialKey] || {});
		if(availableThicknesses.length === 0) return null;
		if(thicknessCandidate) {
			for(let i = 0; i < availableThicknesses.length; i++) {
				let profileThickness = availableThicknesses[i];
				let profileThicknessLower = profileThickness.toLowerCase();
				let candidateLower = thicknessCandidate.toLowerCase();
				if(candidateLower === profileThicknessLower) return profileThickness;
				if(candidateLower.includes(profileThicknessLower)) return profileThickness;
				let numberMatch = candidateLower.match(/[0-9.]+/);
				if(numberMatch && profileThicknessLower.includes(numberMatch[0])) return profileThickness;
			}
		}
		return null;
	}

	notifyProfileMissing(message) {
		if(typeof Toast !== "undefined" && Toast.notify) {
			this.profileWarningId = Toast.notify(message, 4000, {id: this.profileWarningId, position: "top-right"});
		} else {
			console.warn(message);
		}
	}

	get timeTE() {
		return this.l_timeTE[1].value;
	}
	set timeTE(value) {
		$(this.l_timeTE[1]).val(value).change();
	}

	get setupTime() {
		if(this.l_setupTime[1].value == null) return 0;
		return this.l_setupTime[1].value;
	}
	set setupTime(value) {
		$(this.l_setupTime[1]).val(value).change();
	}

	get runTime() {
		if(this.l_runTime[1].value == null) return 0;
		return parseFloat(this.l_runTime[1].value);
	}
	set runTime(value) {
		$(this.l_runTime[1]).val(value).change();
	}

	get cleanTime() {
		if(this.l_cleanTime[1].value == null) return 0;
		return this.l_cleanTime[1].value;
	}
	set cleanTime(value) {
		$(this.l_cleanTime[1]).val(value).change();
	}

	get setupOnceOff() {
		return this.l_setupOnceOff[1].checked;
	}
	set setupOnceOff(value) {
		setCheckboxChecked(value, this.l_setupOnceOff[1]);
	}

	get setupMultiple() {
		return this.l_setupMultiple[1].checked;
	}
	set setupMultiple(value) {
		setCheckboxChecked(value, this.l_setupMultiple[1]);
	}

	get cleanOnceOff() {
		return this.l_cleanOnceOff[1].checked;
	}
	set cleanOnceOff(value) {
		setCheckboxChecked(value, this.l_cleanOnceOff[1]);
	}

	get cleanMultiple() {
		return this.l_cleanMultiple[1].checked;
	}
	set cleanMultiple(value) {
		setCheckboxChecked(value, this.l_cleanMultiple[1]);
	}

	get qty() {
		if(this.l_qty[1].value == null) return 0;
		return parseFloat(this.l_qty[1].value);
	}
	set qty(value) {
		$(this.l_qty[1]).val(value).change();
	}

	get setupNumberOfSheets() {
		return parseFloat(this.l_setupNumberOfSheets[1].value);
	}

	set setupNumberOfSheets(value) {
		$(this.l_setupNumberOfSheets[1]).val(value).change();
	}

	get setupPerSheet() {
		return parseFloat(this.l_setupPerSheet[1].value);
	}

	set setupPerSheet(value) {
		$(this.l_setupPerSheet[1]).val(value).change();
	}

	get cleanNumberOfSheets() {
		return parseFloat(this.l_cleanNumberOfSheets[1].value);
	}

	set cleanNumberOfSheets(value) {
		$(this.l_cleanNumberOfSheets[1]).val(value).change();
	}

	get cleanPerSheet() {
		return parseFloat(this.l_cleanPerSheet[1].value);
	}

	set cleanPerSheet(value) {
		$(this.l_cleanPerSheet[1]).val(value).change();
	}

	runRowIndex = 0;
	addRunRow(pathLength = 0, numberShapes = 0, options = {material: null, thickness: null, profile: null, quality: null, speed: null, isCustom: false}) {
		let internalIndex = this.runRowIndex;
		let l_pathLength = createInput_Infield("Length", pathLength, "width:90%;min-width:90px;margin:0px;", () => {this.Update();}, this.contentContainer, false, 10, {postfix: " mm"});
		let l_numberShapes = createInput_Infield("# Shapes", numberShapes, "width:90%;min-width:70px;margin:0px;", () => {this.Update();}, this.contentContainer, false, 1);
		let l_material, l_thickness, l_profile, l_quality, l_speed, l_totalTime;
		l_material = createDropdown_Infield("Material", 0, "width:80px;margin:0px;", this.getProfileOptions("Material"), () => {this.updateCutProfile("Material", l_material[1], l_thickness[1], l_profile[1], l_quality[1], l_speed[1]); this.UpdateRun();}, this.contentContainer);
		l_thickness = createDropdown_Infield("Thickness", 0, "width:80px;margin:0px;", [], () => {this.updateCutProfile("Thickness", l_material[1], l_thickness[1], l_profile[1], l_quality[1], l_speed[1]); this.UpdateRun();}, this.contentContainer);
		l_profile = createDropdown_Infield("Profile", 0, "width:80px;margin:0px;", [], () => {this.updateCutProfile("Profile", l_material[1], l_thickness[1], l_profile[1], l_quality[1], l_speed[1]); this.UpdateRun();}, this.contentContainer);
		l_quality = createDropdown_Infield("Quality", 0, "width:80px;margin:0px;", [], () => {this.updateCutProfile("Quality", l_material[1], l_thickness[1], l_profile[1], l_quality[1], l_speed[1]); this.UpdateRun();}, this.contentContainer);
		l_speed = createInput_Infield("Speed", 1000, "width:120px;margin:0px;", () => {this.updateCutProfile("Speed", l_material[1], l_thickness[1], l_profile[1], l_quality[1], l_speed[1]); this.UpdateRun();}, this.contentContainer, false, 10, {postfix: " mm/min"});
		l_totalTime = createInput_Infield("Total Time", 0, "width:80px;margin:0px;", () => {this.updateCutProfile("Speed", l_material[1], l_thickness[1], l_profile[1], l_quality[1], l_speed[1]); this.UpdateRun();}, this.contentContainer, false, 10, {postfix: " min"});

		let l_deleteRowBtn = createButton("X", "background-color:red;width:30px;margin:0px;", () => {
			for(let i = 0; i < this.runRows.length; i++) {
				if(this.runRows[i].index === internalIndex) {
					this.deleteRunRows(i);
					break;
				}
			}
		}, this.contentContainer);

		let addedRow = this.l_cuttingTable.addRow(l_pathLength[0], l_numberShapes[0], l_material[0], l_thickness[0], l_profile[0], l_quality[0], l_speed[0], l_totalTime[0], l_deleteRowBtn);
		let rowMeta = {
			index: this.runRowIndex,
			items: [l_pathLength, l_numberShapes, l_material, l_thickness, l_profile, l_quality, l_speed, l_totalTime, l_deleteRowBtn],
			rowElement: addedRow,
			allowAutoDetection: true,
			suppressAutoDetectionFlag: false
		};
		let markManualOverride = () => {
			if(rowMeta.suppressAutoDetectionFlag) return;
			rowMeta.allowAutoDetection = false;
		};
		l_material[1].addEventListener("change", markManualOverride);
		l_thickness[1].addEventListener("change", markManualOverride);
		l_profile[1].addEventListener("change", markManualOverride);
		l_quality[1].addEventListener("change", markManualOverride);
		l_speed[1].addEventListener("change", markManualOverride);
		this.runRows.push(rowMeta);

		rowMeta.suppressAutoDetectionFlag = true;

		if(options.material != null) {
			dropdownSetSelectedValue(l_material[1], options.material);
			this.updateCutProfile("Material", l_material[1], l_thickness[1], l_profile[1], l_quality[1], l_speed[1]);
		}
		if(options.thickness != null && this.fieldHasOption(l_thickness[1], options.thickness)) {
			dropdownSetSelectedValue(l_thickness[1], options.thickness);
			this.updateCutProfile("Thickness", l_material[1], l_thickness[1], l_profile[1], l_quality[1], l_speed[1]);
		}
		if(options.profile != null && this.fieldHasOption(l_profile[1], options.profile)) {
			dropdownSetSelectedValue(l_profile[1], options.profile);
			this.updateCutProfile("Profile", l_material[1], l_thickness[1], l_profile[1], l_quality[1], l_speed[1]);
		}
		if(options.quality != null && this.fieldHasOption(l_quality[1], options.quality)) {
			dropdownSetSelectedValue(l_quality[1], options.quality);
			this.updateCutProfile("Quality", l_material[1], l_thickness[1], l_profile[1], l_quality[1], l_speed[1]);
		}
		if(options.speed != null) $(l_speed[1]).val(options.speed);
		if(options.material == null && options.profile != null && options.quality != null && options.speed != null) this.updateCutProfile("Material", l_material[1], l_thickness[1], l_profile[1], l_quality[1], l_speed[1]);

		rowMeta.suppressAutoDetectionFlag = false;

		if(this.detectedMaterial != null && options.material == null) {
			this.applyMaterialToRow(
				this.runRows[this.runRows.length - 1],
				this.detectedMaterial,
				this.detectedThickness ?? this.extractThicknessFromSubscription(this.latestSubscriptionData, this.detectedMaterial)
			);
		} else if(options.material == null) {
			l_material[1].selectedIndex = -1;
			l_thickness[1].selectedIndex = -1;
			l_profile[1].selectedIndex = -1;
			l_quality[1].selectedIndex = -1;
		}

		if(options.isCustom === true) {
			addedRow.id = "customRow";
			addedRow.style.backgroundColor = "yellow";
		}

		this.runRowIndex++;

		this.Update();

		return addedRow;
	}

	deleteRunRows(...rowIndexesToDelete) {
		removeElementsFromArrayByIndex(this.runRows, rowIndexesToDelete);

		this.l_cuttingTable.deleteRows(...rowIndexesToDelete);

		this.Update();
	}

	deleteAllRunRows(includingCustomRows = false) {
		if(includingCustomRows == true) {
			this.runRows = [];
			this.l_cuttingTable.deleteAllRows();
		}
		else {
			let rowIndexesToDelete = [];
			let allRows = this.l_cuttingTable.getRowsAll();
			let allRows_length = allRows.length;

			for(let i = 0; i < allRows_length; i++) {
				if(allRows[i].id == "customRow") {continue;}
				rowIndexesToDelete.push(i);
			}

			this.deleteRunRows(...rowIndexesToDelete);
		}
		this.Update();
	}

	Update() {
		super.Update();

		this.UpdateSetup();
		this.UpdateRun();
		this.UpdateClean();
	}

	UpdateSetup = () => {
		setFieldDisabled(this.l_setupMultiple[1].checked, this.l_setupTime[1], this.l_setupTime[0]);

		if(this.setupMultiple) {
			this.setupTime = this.setupNumberOfSheets * this.setupPerSheet;
		}
	};

	UpdateRun() {
		if(this.l_usePaths[1].checked) {
			this.runTime = 0;
			for(let i = 0; i < this.runRows.length; i++) {
				let pathLength = mmToM(parseFloat(this.runRows[i].items[0][1].value));
				let numberShapes = parseFloat(this.runRows[i].items[1][1].value);
				let cutSpeed = mmToM(parseFloat(this.runRows[i].items[6][1].value));
				let usePerCutTime = this.runRows[i].items[5][1].value == "SecondsPerCut";

				let timeMin = 0;

				if(usePerCutTime) {
					this.runRows[i].items[6][6].innerHTML = "sec/cut";
					timeMin = (cutSpeed * 1000 * numberShapes) / 60;
				} else {
					this.runRows[i].items[6][6].innerHTML = "mm/min";
					timeMin = pathLength / cutSpeed + numberShapes * this.perShapeTime;
				}

				$(this.runRows[i].items[7][1]).val(roundNumber(timeMin, 2));

				this.runTime += timeMin;
			}
			this.runTime = roundNumber(this.runTime, 2);
		}
	}

	UpdateClean() {
		setFieldDisabled(this.l_cleanMultiple[1].checked, this.l_cleanTime[1], this.l_cleanTime[0]);

		if(this.cleanMultiple) {
			this.cleanTime = this.cleanNumberOfSheets * this.cleanPerSheet;
		}
	}

	requiredToggle = () => {
		this.Update();
	};

	updateRunRow(rowID, totalPathLength, numberOfShapes, material, thickness, profile, quality, speed) {
		let row = this.runRows[rowID].items;

		if(totalPathLength) $(row[0][1]).val(totalPathLength).change();
		if(numberOfShapes) $(row[1][1]).val(numberOfShapes).change();
		if(material) dropdownSetSelectedText(row[2][1], material);
		if(thickness) dropdownSetSelectedText(row[3][1], thickness);
		if(profile) dropdownSetSelectedText(row[4][1], profile);
		if(quality) dropdownSetSelectedText(row[5][1], quality);
		if(speed) $(row[6][1]).val(speed).change();
	}

	updateCutProfile = (requestFrom, materialField, thicknessField, profileField, qualityField, speedField) => {
		if(requestFrom == "Material") {
			setOptions(thicknessField, this.getProfileOptions("Thickness", materialField, thicknessField, profileField, qualityField, speedField));
			setOptions(profileField, this.getProfileOptions("Profile", materialField, thicknessField, profileField, qualityField, speedField));
			setOptions(qualityField, this.getProfileOptions("Quality", materialField, thicknessField, profileField, qualityField, speedField));
			speedField.value = this.getProfileOptions("Speed", materialField, thicknessField, profileField, qualityField, speedField);
		} if(requestFrom == "Thickness") {
			setOptions(profileField, this.getProfileOptions("Profile", materialField, thicknessField, profileField, qualityField, speedField));
			setOptions(qualityField, this.getProfileOptions("Quality", materialField, thicknessField, profileField, qualityField, speedField));
			speedField.value = this.getProfileOptions("Speed", materialField, thicknessField, profileField, qualityField, speedField);
		} if(requestFrom == "Profile") {
			setOptions(qualityField, this.getProfileOptions("Quality", materialField, thicknessField, profileField, qualityField, speedField));
			speedField.value = this.getProfileOptions("Speed", materialField, thicknessField, profileField, qualityField, speedField);
		} if(requestFrom == "Quality") {
			speedField.value = this.getProfileOptions("Speed", materialField, thicknessField, profileField, qualityField, speedField);
		} if(requestFrom == "Speed") {
		}
	};

	getProfileOptions = (requestFrom, materialField, thicknessField, profileField, qualityField, speedField) => {
		let returnOptions = [];
		if(requestFrom == "Material") {
			let keys = Object.keys(RouterToolpathTimeLookup);
			let keysLength = keys.length;
			for(let i = 0; i < keysLength; i++) {
				returnOptions.push(createDropdownOption(keys[i], keys[i]));
			}
		} else if(requestFrom == "Thickness") {
			let materialChosen = materialField.value;
			let keys = Object.keys(RouterToolpathTimeLookup[materialChosen]);
			let keysLength = keys.length;
			for(let i = 0; i < keysLength; i++) {
				returnOptions.push(createDropdownOption(keys[i], keys[i]));
			}
		}
		else if(requestFrom == "Profile") {
			let materialChosen = materialField.value;
			let thicknessChosen = thicknessField.value;
			let keys = Object.keys(RouterToolpathTimeLookup[materialChosen][thicknessChosen]);
			let keysLength = keys.length;
			for(let i = 0; i < keysLength; i++) {
				returnOptions.push(createDropdownOption(keys[i], keys[i]));
			}
		} else if(requestFrom == "Quality") {
			let materialChosen = materialField.value;
			let thicknessChosen = thicknessField.value;
			let profileChosen = profileField.value;
			let keys = Object.keys(RouterToolpathTimeLookup[materialChosen][thicknessChosen][profileChosen]);
			let keysLength = keys.length;
			for(let i = 0; i < keysLength; i++) {
				returnOptions.push(createDropdownOption(keys[i], keys[i]));
			}
		} else if(requestFrom == "Speed") {
			let materialChosen = materialField.value;
			let thicknessChosen = thicknessField.value;
			let profileChosen = profileField.value;
			let qualityChosen = qualityField.value;
			return parseFloat(RouterToolpathTimeLookup[materialChosen][thicknessChosen][profileChosen][qualityChosen]);
		}
		return returnOptions;
	};

	async Create(productNo, partIndex) {
		if(this.required) {
			if(!isNaN(parseFloat(this.setupTime + this.runTime + this.cleanTime))) {
				if(this.timeTE == "Each") {
					await AddPart("Router Cutting (ea)", productNo);
					partIndex++;
					await setPartQty(productNo, partIndex, this.qty);
					await setRouterSetupTimeEach(productNo, partIndex, this.setupTime);
					await setRouterRunTimeEach(productNo, partIndex, this.runTime);
					await setRouterPostJobTimeEach(productNo, partIndex, this.cleanTime);
					await setRouterSetupOnceOff(productNo, partIndex, this.setupOnceOff);
					await setPartDescription(productNo, partIndex, "[ROUTERING] Router Cutting per ea");
					await savePart(productNo, partIndex);
				} else {
					await AddPart("Router Cutting (total)", productNo);
					partIndex++;
					await setPartQty(productNo, partIndex, this.qty);
					await setRouterSetupTimeTotal(productNo, partIndex, this.setupTime);
					await setRouterRunTimeTotal(productNo, partIndex, this.runTime);
					await setRouterPostJobTimeTotal(productNo, partIndex, this.cleanTime);
					await setPartDescription(productNo, partIndex, "[ROUTERING] Router Cutting per total");
					await savePart(productNo, partIndex);
				}
			}
		}
		return partIndex;
	}

	Description() {
		return "";
	}
}
