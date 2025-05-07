class Production extends SubMenu {
	#otherItemFields = {
		"Eyelets": {
			"show": false,
			"linked field": null
		},
		"Pins (Thread Rod)": {
			"show": false,
			"linked field": null
		},
		"Stand-off": {
			"show": false,
			"linked field": null
		},
		"Custom": {
			"show": false,
			"linked field": null
		},
	};

	#qty;
	#productionTimeTotalEach;
	#productionTimeMins;
	#productionTimeHours;
	#productionTimeDays;
	#toggleAdditionalFields;
	#eyeletsRequired;
	#eyeletsQty;
	#eyeletsHelper;
	#eyeletsHelperBtn;
	#pinsRequired;
	#pinsQty;
	#standOffRequired;
	#standOffQty;
	#standOffType;
	#standOffHelper;
	#standOffHelperBtn;
	#customRequired;
	#customQty;
	#customCost;
	#customMarkup;
	#customDescription;

	constructor(parentObject, canvasCtx, updateFunction, sizeClass) {
		super(parentObject, canvasCtx, updateFunction, "PRODUCTION");

		if(sizeClass === null) {
			this.sizeClass = new Size(null, function() { });
		} else {
			this.sizeClass = sizeClass;
		}

		this.#qty = createInput_Infield("Qty", 1, "width:29%;display:block;min-width:50px;", () => {this.Update();}, this.contentContainer, true, 1);
		this.#productionTimeTotalEach = createDropdown_Infield("Total or Each", 1, "width:29%;display:block;min-width:50px;margin-right:30%;", [
			createDropdownOption("Total", "Total"),
			createDropdownOption("Each", "Each")], () => {this.Update();}, this.contentContainer);

		this.#productionTimeMins = createInput_Infield("Mins", null, "width:29%;display:block;min-width:50px;", () => {this.Update();}, this.contentContainer, false, 10);
		this.#productionTimeHours = createInput_Infield("Hours", null, "width:29%;display:block;min-width:50px;", () => {this.Update();}, this.contentContainer, false, 1);
		this.#productionTimeDays = createInput_Infield("Days (8h)", null, "width:29%;display:block;min-width:50px;", () => {this.Update();}, this.contentContainer, false, 1);

		this.#toggleAdditionalFields = createButton("", "width:95px;height:40px;margin:5px calc((100% - 95px)/2)", () => {
			let modalToggleTokens = new ModalToggleTokens("Show", this.#otherItemFields, (arg1_newOptionPairs) => {
				if(arg1_newOptionPairs.length == 0) console.error("No new option pairs arg provided");
				let newOptionPairs = arg1_newOptionPairs[0];
				for(let i = 0; i < Object.keys(newOptionPairs).length; i++) {
					this.#otherItemFields[Object.keys(newOptionPairs)[i]]["show"] = newOptionPairs[Object.keys(newOptionPairs)[i]]["show"];
				}
				this.updateOtherItemFields();
			});
		}, this.contentContainer);
		this.#toggleAdditionalFields.innerHTML = "&#9776 Modifiers";

		this.#eyeletsRequired = createCheckbox_Infield("Eyelets", false, "width:30%;min-width:150px;margin-right:65%;display:none", () => {this.Update();}, this.contentContainer, true);
		this.#eyeletsQty = createInput_Infield("Qty per Product", null, "width:25%;min-width:110px;margin-left:40px;display:none", () => {this.Update();}, this.contentContainer, false, 1);
		this.#eyeletsHelper;
		this.#eyeletsHelperBtn = createButton("Helper", "width:100px;display:none;margin:5px;border-width:1px;min-height:40px;", () => {
			this.#eyeletsHelper = new ModalStandoffHelper("Eyelet Helper", 100, () => {this.#eyeletsQty[1].value = this.#eyeletsHelper.qty;});
			this.#eyeletsHelper.width = this.getQWHD().width;
			this.#eyeletsHelper.height = this.getQWHD().height;
			this.#eyeletsHelper.value_numberOnSide = this.#eyeletsHelper.calculatedQtyPerSide(this.#eyeletsHelper.height);
			this.#eyeletsHelper.value_numberOnTop = this.#eyeletsHelper.calculatedQtyPerSide(this.#eyeletsHelper.width);
			this.#eyeletsHelper.UpdateFromFields();
		}, this.contentContainer);
		makeFieldGroup("Checkbox", this.#eyeletsRequired[1], true, this.#eyeletsQty[0], this.#eyeletsHelperBtn);
		this.#otherItemFields["Eyelets"]["linked field"] = this.#eyeletsRequired;

		this.#pinsRequired = createCheckbox_Infield("Pins (Thread Rod)", false, "width:30%;min-width:150px;margin-right:65%;display:none", () => {this.Update();}, this.contentContainer, true);
		this.#pinsQty = createInput_Infield("Qty per Product", null, "width:25%;min-width:110px;margin-left:40px;display:none", () => {this.Update();}, this.contentContainer, false, 1);
		makeFieldGroup("Checkbox", this.#pinsRequired[1], true, this.#pinsQty[0]);
		this.#otherItemFields["Pins (Thread Rod)"]["linked field"] = this.#pinsRequired;

		this.#standOffRequired = createCheckbox_Infield("Stand-off", false, "width:30%;min-width:150px;margin-right:65%;display:none", () => {this.Update();}, this.contentContainer, true);
		this.#standOffQty = createInput_Infield("Qty per Product", null, "width:25%;min-width:110px;margin-left:40px;display:none", () => {this.Update();}, this.contentContainer, false, 1);
		this.#standOffType = createDropdown_Infield("Stand-off Type", 1, "width:30%;display:none",
			[createDropdownOption("Standoff 19w 25D", "Standoff 19w 25D"),
			createDropdownOption("Standoff 19w 25D", "Standoff 19w 25D"),
			createDropdownOption("Standoff 19w 25D", "Standoff 19w 25D"),
			createDropdownOption("Standoff 19w 25D", "Standoff 19w 25D")], () => {this.Update();}, this.contentContainer);
		this.#standOffHelper;
		this.#standOffHelperBtn = createButton("Helper", "width:100px;display:none;margin:5px;border-width:1px;min-height:40px;", () => {
			this.#standOffHelper = new ModalStandoffHelper("Standoff Helper", 100, () => {this.#standOffQty[1].value = this.#standOffHelper.qty;});
			this.#standOffHelper.width = this.getQWHD().width;
			this.#standOffHelper.height = this.getQWHD().height;
			this.#standOffHelper.value_numberOnSide = this.#standOffHelper.calculatedQtyPerSide(this.#standOffHelper.height);
			this.#standOffHelper.value_numberOnTop = this.#standOffHelper.calculatedQtyPerSide(this.#standOffHelper.width);
			this.#standOffHelper.UpdateFromFields();
		}, this.contentContainer);
		makeFieldGroup("Checkbox", this.#standOffRequired[1], true, this.#standOffQty[0], this.#standOffType[0], this.#standOffHelperBtn);
		this.#otherItemFields["Stand-off"]["linked field"] = this.#standOffRequired;

		this.#customRequired = createCheckbox_Infield("Custom", false, "width:30%;min-width:150px;margin-right:65%;display:none", () => {
			setFieldHidden(!this.#customRequired[1].checked, this.#customQty[0], this.#customQty[0]);
			setFieldHidden(!this.#customRequired[1].checked, this.#customCost[0], this.#customCost[0]);
			setFieldHidden(!this.#customRequired[1].checked, this.#customMarkup[0], this.#customMarkup[0]);
			setFieldHidden(!this.#customRequired[1].checked, this.#customDescription[0], this.#customDescription[0]);
		}, this.contentContainer, true);
		this.#customQty = createInput_Infield("Qty per Product", null, "width:20%;min-width:110px;margin-left:40px;display:none", () => {this.Update();}, this.contentContainer, false, 1);
		this.#customCost = createInput_Infield("Cost", null, "width:20%;min-width:110px;display:none", () => {this.Update();}, this.contentContainer, false, 1);
		this.#customMarkup = createInput_Infield("Markup", null, "width:20%;min-width:110px;display:none", () => {this.Update();}, this.contentContainer, false, 0.1);
		this.#customDescription = createInput_Infield("Description", null, "width:20%;min-width:110px;display:none;", () => {this.Update();}, this.contentContainer, false, null);
		makeFieldGroup("Checkbox", this.#customRequired[1], true, this.#customQty[0], this.#customCost[0], this.#customMarkup[0], this.#customDescription[0]);
		this.#otherItemFields["Custom"]["linked field"] = this.#customRequired;

		makeFieldGroup("Checkbox", this.requiredField[1], false,
			this.#qty[0],
			this.#productionTimeMins[0],
			this.#productionTimeHours[0],
			this.#productionTimeDays[0],
			this.#productionTimeTotalEach[0],
			this.#toggleAdditionalFields,
			this.#eyeletsRequired[0], this.#eyeletsQty[0], this.#eyeletsHelperBtn,
			this.#pinsRequired[0], this.#pinsQty[0],
			this.#standOffRequired[0], this.#standOffQty[0], this.#standOffType[0], this.#standOffHelperBtn,
			this.#customRequired[0], this.#customQty[0], this.#customCost[0], this.#customMarkup[0], this.#customDescription[0]);
	}

	updateOtherItemFields() {
		for(let i = 0; i < Object.keys(this.#otherItemFields).length; i++) {
			let masterCkb = this.#otherItemFields[Object.keys(this.#otherItemFields)[i]];
			if(masterCkb['show'] == true) {
				setFieldHidden(false, masterCkb["linked field"][0]);
				if(!masterCkb["linked field"][1].checked) {
					clickCheckbox(masterCkb["linked field"][1]);
				}
			} else {
				if(masterCkb["linked field"][1].checked) {
					clickCheckbox(masterCkb["linked field"][1]);
				}
				setFieldHidden(true, masterCkb["linked field"][0]);
			}
		}
	}

	addSubscriberToRows = (...rowIDs) => {
		this.sizeClass.addSubscriberToRows2(this, ...rowIDs);
	};

	getQWHD() {
		for(let i = 0; i < this.subscriptions.length; i++) {
			if(this.subscriptions[i].qty && this.subscriptions[i].width && this.subscriptions[i].height) {
				return new QWHD(this.subscriptions[i].qty, this.subscriptions[i].width, this.subscriptions[i].height);
			}
		}
		return new QWHD(0, 0, 0);
	};

	get productionTimeMins() {
		return zeroIfNaNNullBlank(this.#productionTimeMins[1].value) + zeroIfNaNNullBlank(this.#productionTimeHours[1].value) * 60 + zeroIfNaNNullBlank(this.#productionTimeDays[1].value) * 60 * dayHours;
	}
	set productionTime(minutes) {
		let times = getMHD(minutes);
		$(this.#productionTimeMins[1]).val(times[0]).change();
		$(this.#productionTimeHours[1]).val(times[1]).change();
		$(this.#productionTimeDays[1]).val(times[2]).change();
	}

	get productionTotalEach() {
		return this.#productionTimeTotalEach[1].value;
	}
	set productionTotalEach(value) {
		this.#productionTimeTotalEach[1].value = value;
	}

	get qty() {
		if(this.#qty[1].value == null) return 0;
		return this.#qty[1].value;
	}
	set qty(value) {
		$(this.#qty[1]).val(value).change();
	}

	Update() {
		super.Update();
	}

	async Create(productNo, partIndex) {
		partIndex = await super.Create(productNo, partIndex);

		if(!this.required) return partIndex;

		if(this.productionTotalEach == "Total") await AddPart("Production", productNo);
		else await AddPart("Production (ea)", productNo);

		partIndex++;
		await setPartQty(productNo, partIndex, this.qty);
		await setProductionTime(productNo, partIndex, this.productionTimeMins);
		await setPartDescription(productNo, partIndex, "[PRODUCTION] " + this.headerName);
		await savePart(productNo, partIndex);

		return partIndex;
	}

	Description() {
		return "";
	}
}

//TODO: RTA And Plotted Time
var production_CutMinPerLnm = 1;
var production_LamTimePerSqm = 3;
var production_PlottingPerSqm = 20;
var production_WeedingPerSqm = 20;
function getProductionTime(quantity, width, height, isRectangular, requiresLaminating, trimByHand, requiresPlotting, requiresWeeding) {
	var totalNumberOfSides;
	var totalLinearMm;
	var totalSqm = (width / 1000) * (height / 1000) * quantity;
	var time = 0;

	if(isRectangular) {
		totalNumberOfSides = quantity * 4;
		totalLinearMm = width * quantity * 2 + height * quantity * 2;
	} else {
		//todo: other shapes
		totalNumberOfSides = quantity * 4;
		totalLinearMm = width * quantity * 2 + height * quantity * 2;
	}

	if(requiresLaminating) {
		time += totalSqm * production_LamTimePerSqm;
	}

	if(trimByHand) {
		time += (totalLinearMm / 1000) * production_CutMinPerLnm;
	}

	if(requiresPlotting) {
		time += totalSqm * production_PlottingPerSqm;
	}

	if(requiresWeeding) {
		time += totalSqm * production_WeedingPerSqm;
	}

	return roundNumber(time, 2);
}
