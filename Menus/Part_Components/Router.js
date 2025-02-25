class Router extends SubMenu {

	static maxCutSize = {width: 4100, height: 2100};

	perShapeTime = secondsToMinutes(5);
	runRows = [];
	#showIDInContainer = true;

	constructor(parentContainer, canvasCtx, updateFunction, sizeClass) {
		super(parentContainer, canvasCtx, updateFunction, "CNC Router");

		/*Qty*/
		let f_container_qty = createDivStyle5(null, "Qty", this.contentContainer);
		f_container_qty[3].style.cssText += "width:50px;";
		f_container_qty[1].style.cssText = "width:calc(100% - 50px)";
		this.l_qty = createInput_Infield("Qty", 1, "width:30%;min-width:50px;", null, f_container_qty[1], true, 1);


		this.l_timeTE = createDropdown_Infield("Each or Total", 1, "width:30%;margin-right:30%;", [
			createDropdownOption("Total", "Total"),
			createDropdownOption("Each", "Each")
		], () => {this.Update();}, f_container_qty[1]);

		/*Setup*/
		let f_container_setup = createDivStyle5(null, "Setup", this.contentContainer);
		f_container_setup[3].style.cssText += "width:50px;";
		f_container_setup[1].style.cssText = "width:calc(100% - 50px)";
		this.l_setupOnceOff = createCheckbox_Infield("Setup One Sheet", true, "width:30%;", () => {this.Update();}, f_container_setup[1], true);
		this.l_setupMultiple = createCheckbox_Infield("Setup Multiple Sheets", false, "width:60%;", () => {this.Update();}, f_container_setup[1], true);
		checkboxesAddToSelectionGroup(true, this.l_setupOnceOff, this.l_setupMultiple);
		this.l_setupNumberOfSheets = createInput_Infield("Number of Sheets", 1, "width:30%;display:none", () => {this.Update();}, f_container_setup[1], false, 1);
		this.l_setupPerSheet = createInput_Infield("Setup per Sheet", 10, "width:30%;display:none", () => {this.Update();}, f_container_setup[1], false, 1, {postfix: "mins"});
		this.l_setupTime = createInput_Infield("Total Setup Minutes", 20, "width:30%;", null, f_container_setup[1], false, 10, {postfix: "mins"});

		/*Run Time*/
		let f_container_run = createDivStyle5(null, "Run", this.contentContainer);
		f_container_run[3].style.cssText += "width:50px;";
		f_container_run[1].style.cssText = "width:calc(100% - 50px)";
		this.l_usePaths = createCheckbox_Infield("Use Path Specs for Times", true, "width:60%;margin-right:30%;", () => {this.UpdateRun();}, f_container_run[1]);
		this.l_cuttingTable = new Table(f_container_run[1], "100%", 20, 250);
		this.l_cuttingTable.setHeading("Total Path Length", "Number Shapes", "Material", "Profile", "Quality", "Speed", "Total Time", "Delete");
		this.l_addRowBtn = createButton("+ Row", "width:15%;margin:0px;margin-right:70%;min-width:80px;", () => {this.addRunRow(0, 0, {isCustom: true});}, f_container_run[1]);
		this.l_runTime = createInput_Infield("Total Run Minutes", 20, "width:30%", null, f_container_run[1], false, 10, {postfix: "mins"});

		/*Clean Time*/
		let f_container_clean = createDivStyle5(null, "Clean", this.contentContainer);
		f_container_clean[3].style.cssText += "width:50px;";
		f_container_clean[1].style.cssText = "width:calc(100% - 50px)";
		this.l_cleanOnceOff = createCheckbox_Infield("Clean One Sheet", true, "width:30%;", () => {this.Update();}, f_container_clean[1], true);
		this.l_cleanMultiple = createCheckbox_Infield("Clean Multiple Sheets", false, "width:60%;", () => {this.Update();}, f_container_clean[1], true);
		checkboxesAddToSelectionGroup(true, this.l_cleanOnceOff, this.l_cleanMultiple);
		this.l_cleanNumberOfSheets = createInput_Infield("Number of Sheets", 1, "width:30%;display:none", () => {this.Update();}, f_container_clean[1], false, 1);
		this.l_cleanPerSheet = createInput_Infield("Clean per Sheet", 10, "width:30%;display:none", () => {this.Update();}, f_container_clean[1], false, 1, {postfix: "mins"});
		this.l_cleanTime = createInput_Infield("Total Clean Minutes", 10, "width:30%", null, f_container_clean[1], false, 10, {postfix: "mins"});

		makeFieldGroup("Checkbox", this.l_setupMultiple[1], true, this.l_setupNumberOfSheets[0], this.l_setupPerSheet[0]);
		makeFieldGroup("Checkbox", this.l_cleanMultiple[1], true, this.l_cleanNumberOfSheets[0], this.l_cleanPerSheet[0]);
		makeFieldGroup("Checkbox", this.l_usePaths[1], true, this.l_cuttingTable.container, this.l_addRowBtn);

		makeFieldGroup("Checkbox",
			this.requiredField[1], false, this.l_qty[0], this.l_timeTE[0], this.l_setupOnceOff[0], this.l_setupTime[0], this.l_runTime[0], this.l_addRowBtn,
			this.l_cleanTime[0], this.l_usePaths[0], this.l_cuttingTable.container, this.l_setupMultiple[0], this.l_setupNumberOfSheets[0], this.l_setupPerSheet[0],
			this.l_cleanMultiple[0], this.l_cleanNumberOfSheets[0], this.l_cleanPerSheet[0], this.l_cleanOnceOff[0], f_container_qty[0], f_container_setup[0],
			f_container_run[0], f_container_clean[0]
		);

		this.Update();
	}

	getQWH() {
		for(let i = 0; i < this.subscriptions.length; i++) {
			if(this.subscriptions[i].Type.toLowerCase().includes("size")) {
				return new QWHD(this.subscriptions[i].qty, this.subscriptions[i].width, this.subscriptions[i].height);
			}
		}
		return new QWHD(0, 0, 0);
	};

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
	addRunRow(pathLength = 0, numberShapes = 0, options = {material: null, profile: null, quality: null, speed: null, isCustom: false}) {
		let internalIndex = this.runRowIndex;
		let l_pathLength = createInput_Infield("Length", pathLength, "width:90%;min-width:90px;margin:0px;", () => {this.Update();}, this.contentContainer, false, 10, {postfix: " mm"});
		let l_numberShapes = createInput_Infield("# Shapes", numberShapes, "width:90%;min-width:70px;margin:0px;", () => {this.Update();}, this.contentContainer, false, 1);
		let l_material, l_profile, l_quality, l_speed, l_totalTime;
		l_material = createDropdown_Infield("Material", 0, "width:80px;margin:0px;", this.getProfileOptions("Material"), () => {this.updateCutProfile("Material", l_material[1], l_profile[1], l_quality[1], l_speed[1]); this.UpdateRun();}, this.contentContainer);
		l_profile = createDropdown_Infield("Profile", 0, "width:80px;margin:0px;", [], () => {this.updateCutProfile("Profile", l_material[1], l_profile[1], l_quality[1], l_speed[1]); this.UpdateRun();}, this.contentContainer);
		l_quality = createDropdown_Infield("Quality", 0, "width:80px;margin:0px;", [], () => {this.updateCutProfile("Quality", l_material[1], l_profile[1], l_quality[1], l_speed[1]); this.UpdateRun();}, this.contentContainer);
		l_speed = createInput_Infield("Speed", 1000, "width:120px;margin:0px;", () => {this.updateCutProfile("Speed", l_material[1], l_profile[1], l_quality[1], l_speed[1]); this.UpdateRun();}, this.contentContainer, false, 10, {postfix: " mm/min"});
		l_totalTime = createInput_Infield("Total Time", 0, "width:120px;margin:0px;", () => {this.updateCutProfile("Speed", l_material[1], l_profile[1], l_quality[1], l_speed[1]); this.UpdateRun();}, this.contentContainer, false, 10, {postfix: " min"});

		if(options.material != null) dropdownSetSelectedValue(l_material[1], options.material);
		if(options.profile != null) dropdownSetSelectedValue(l_profile[1], options.profile);
		if(options.quality != null) dropdownSetSelectedValue(l_quality[1], options.quality);
		if(options.speed != null) $(l_speed[1]).val(options.speed);
		if(options.material == null && options.profile != null && options.quality != null && options.speed != null) this.updateCutProfile("Material", l_material[1], l_profile[1], l_quality[1], l_speed[1]);

		let l_deleteRowBtn = createButton("X", "background-color:red;width:30px;margin:0px;", () => {
			for(let i = 0; i < this.runRows.length; i++) {
				if(this.runRows[i].index === internalIndex) {
					this.deleteRunRows(i);
					break;
				}
			}
		}, this.contentContainer);

		this.runRows.push(
			{
				index: this.runRowIndex,
				items: [l_pathLength, l_numberShapes, l_material, l_profile, l_quality, l_speed, l_totalTime, l_deleteRowBtn]
			}
		);
		let addedRow = this.l_cuttingTable.addRow(l_pathLength[0], l_numberShapes[0], l_material[0], l_profile[0], l_quality[0], l_speed[0], l_totalTime[0], l_deleteRowBtn);

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
				let cutSpeed = mmToM(parseFloat(this.runRows[i].items[5][1].value));
				let usePerCutTime = this.runRows[i].items[4][1].value == "SecondsPerCut";

				let timeMin = 0;

				if(usePerCutTime) {
					this.runRows[i].items[5][6].innerHTML = "sec/cut";
					timeMin = (cutSpeed * 1000 * numberShapes) / 60;
				} else {
					this.runRows[i].items[5][6].innerHTML = "mm/min";
					timeMin = pathLength / cutSpeed + numberShapes * this.perShapeTime;
				}

				$(this.runRows[i].items[6][1]).val(roundNumber(timeMin, 2));

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

	updateRunRow(rowID, totalPathLength, numberOfShapes, material, profile, quality, speed) {
		let row = this.runRows[rowID].items;

		if(totalPathLength) $(row[5][1]).val(totalPathLength).change();
		if(numberOfShapes) $(row[5][1]).val(numberOfShapes).change();
		if(material) dropdownSetSelectedText(row[2][1], material);
		if(profile) dropdownSetSelectedText(row[3][1], profile);
		if(quality) dropdownSetSelectedText(row[4][1], quality);
		if(speed) $(row[5][1]).val(speed).change();
	}

	updateCutProfile = (requestFrom, materialField, profileField, qualityField, speedField) => {
		if(requestFrom == "Material") {
			setOptions(profileField, this.getProfileOptions("Profile", materialField, profileField, qualityField, speedField));
			setOptions(qualityField, this.getProfileOptions("Quality", materialField, profileField, qualityField, speedField));
			speedField.value = this.getProfileOptions("Speed", materialField, profileField, qualityField, speedField);
		} if(requestFrom == "Profile") {
			setOptions(qualityField, this.getProfileOptions("Quality", materialField, profileField, qualityField, speedField));
			speedField.value = this.getProfileOptions("Speed", materialField, profileField, qualityField, speedField);
		} if(requestFrom == "Quality") {
			speedField.value = this.getProfileOptions("Speed", materialField, profileField, qualityField, speedField);
		} if(requestFrom == "Speed") {
		}
	};

	getProfileOptions = (requestFrom, materialField, profileField, qualityField, speedField) => {
		let returnOptions = [];
		if(requestFrom == "Material") {
			let keys = Object.keys(RouterToolpathTimeLookup);
			let keysLength = keys.length;
			for(let i = 0; i < keysLength; i++) {
				returnOptions.push(createDropdownOption(keys[i], keys[i]));
			}
		}
		else if(requestFrom == "Profile") {
			let materialChosen = materialField.value;
			let keys = Object.keys(RouterToolpathTimeLookup[materialChosen]);
			let keysLength = keys.length;
			for(let i = 0; i < keysLength; i++) {
				returnOptions.push(createDropdownOption(keys[i], keys[i]));
			}
		} else if(requestFrom == "Quality") {
			let materialChosen = materialField.value;
			let profileChosen = profileField.value;
			let keys = Object.keys(RouterToolpathTimeLookup[materialChosen][profileChosen]);
			let keysLength = keys.length;
			for(let i = 0; i < keysLength; i++) {
				returnOptions.push(createDropdownOption(keys[i], keys[i]));
			}
		} else if(requestFrom == "Speed") {
			let materialChosen = materialField.value;
			let profileChosen = profileField.value;
			let qualityChosen = qualityField.value;
			return parseFloat(RouterToolpathTimeLookup[materialChosen][profileChosen][qualityChosen]);
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
