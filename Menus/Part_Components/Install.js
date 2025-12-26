class Install extends SubMenu {

	#isOutsourced;
	#quickLookup;
	#quickLookupContainer;
	#quickItem;
	#quickInstall_sub;
	#qtyContainer;
	#qty;
	#installTimeTotalEach;
	#timeContainer;
	#install_InstallRate;
	#install_InstallMinutes;
	#install_InstallHours;
	#install_InstallDays;
	#travelContainer;
	#install_TravelRate;
	#install_TravelMinutes;
	#install_TravelHours;
	#install_TravelDays;
	#outsourceCost;
	#outsourceMarkup;
	#outsourcedContainer;

	constructor(parentObject, canvasCtx, updateFunction, sizeClass) {
		super(parentObject, canvasCtx, updateFunction, "INSTALL");

		this.#qtyContainer = createDivStyle5(null, "Quantity", this.contentContainer);

		this.#qty = createInput_Infield("Qty", 1, "width:30%;display:block;", () => { }, this.#qtyContainer[1], true, 1);

		this.#installTimeTotalEach = createDropdown_Infield("Total or Each", 1, "width:30%;display:block;margin-right:20%;", [
			createDropdownOption("Total", "Total"),
			createDropdownOption("Each", "Each"),
		], () => {this.Update();}, this.#qtyContainer[1]);

		///Outsourced
		this.#outsourcedContainer = createDivStyle5(null, "Outsourced", this.contentContainer);
		this.#isOutsourced = createCheckbox_Infield("Is Outsourced", false, null, () => {
			$(this.#outsourceMarkup[0]).toggle();
			$(this.#outsourceCost[0]).toggle();
		}, this.#outsourcedContainer[1]);
		this.#outsourceCost = createInput_Infield("Outsource Cost", null, "width:30%;display:block;margin-left:40px;", () => { }, this.#outsourcedContainer[1], true, 1, {prefix: "$"});
		$(this.#outsourceCost[0]).hide();
		this.#outsourceMarkup = createInput_Infield("Markup", null, "width:30%;display:block;", () => { }, this.#outsourcedContainer[1], true, 1, {postfix: "x"});
		$(this.#outsourceMarkup[0]).hide();

		///Install Rate
		this.#timeContainer = createDivStyle5(null, "Time", this.contentContainer);
		this.#install_InstallRate = createDropdown_Infield("Install Rate", 1, "display:block;width:63%;margin-right:20%;", [], () => {/*this.Update();*/}, this.#timeContainer[1]);

		let dropdownOptions = [];
		let modifierOptions = getModifierDropdown_Name_Price_Cost("Install IH (ea)");
		modifierOptions.forEach((element) => {
			dropdownOptions.push(createDropdownOption(element.Name, element.Name));
		});
		if(dropdownOptions != null) {
			dropdownOptions.forEach((item) => {
				this.#install_InstallRate[1].add(item);
			});
		}

		///Install Times
		this.#install_InstallMinutes = createInput_Infield("Install Minutes", null, "width:25%;display:block;margin-left:40px;", () => {/*this.Update();*/}, this.#timeContainer[1], false, 10);
		this.#install_InstallHours = createInput_Infield("Install Hours", null, "width:25%;display:block", () => {/*this.Update();*/}, this.#timeContainer[1], false, 1);
		this.#install_InstallDays = createInput_Infield("Install Days (8h)", null, "width:25%;display:block", () => {/*this.Update();*/}, this.#timeContainer[1], false, 1);


		///Quick Lookup

		this.#quickLookupContainer = createDivStyle5(null, "Quick Lookup", this.#timeContainer[1]);
		this.#quickLookup = createCheckbox_Infield("Quick Lookup", false, null, () => {
			$(this.#quickItem[0]).toggle();
			$(this.#quickInstall_sub[0]).toggle();
			this.UpdateInstallTimes();
		}, this.#quickLookupContainer[1]);

		let installTypes = [];
		let types = Object.getOwnPropertyNames(InstallTimesLookup);
		for(let i = 0; i < types.length; i++) {
			installTypes.push(createDropdownOption(types[i], types[i]));
		}
		this.#quickItem = createDropdown_Infield("Type", 0, "margin-left:40px", installTypes, () => {
			this.UpdateInstallLookup();
		}, this.#quickLookupContainer[1]);
		$(this.#quickItem[0]).hide();

		this.#quickInstall_sub = createDropdown_Infield_Icons_Search("Size", 0, null, 150, false, [], () => {
			this.UpdateInstallTimes();
		}, this.#quickLookupContainer[1], false);
		this.UpdateInstallLookup();
		$(this.#quickInstall_sub[0]).hide();

		///Travel Rate
		this.#travelContainer = createDivStyle5("display:none;", "Travel", this.contentContainer);

		this.#install_TravelRate = createDropdown_Infield("Travel Rate", 1, "display:block;width:63%;margin-right:20%;", [], () => {this.Update();}, this.#travelContainer[1]);

		dropdownOptions = [];
		modifierOptions = getModifierDropdown_Name_Price_Cost("Travel IH (ea)");
		modifierOptions.forEach((element) => {
			dropdownOptions.push(createDropdownOption(element.Name, element.Name));
		});
		if(dropdownOptions != null) {
			dropdownOptions.forEach((item) => {
				this.#install_TravelRate[1].add(item);
			});
		}

		///Travel Times
		this.#install_TravelMinutes = createInput_Infield("Travel Minutes", null, "width:25%;display:block;margin-left:40px", () => {this.Update();}, this.#travelContainer[1], false, 10);
		this.#install_TravelHours = createInput_Infield("Travel Hours", null, "width:25%;display:block;", () => {this.Update();}, this.#travelContainer[1], false, 1);
		this.#install_TravelDays = createInput_Infield("Travel Days (8h)", null, "width:25%;display:block;", () => {this.Update();}, this.#travelContainer[1], false, 1);

	}

	get installTotalEach() {return this.#installTimeTotalEach[1].value;}
	set installTotalEach(value) {this.#installTimeTotalEach[1].value = value;}

	get installMinutes() {return zeroIfNaNNullBlank(this.#install_InstallMinutes[1].value);}
	set installMinutes(value) {$(this.#install_InstallMinutes[1]).val(value).change();}

	get installHours() {return zeroIfNaNNullBlank(this.#install_InstallHours[1].value);}
	set installHours(value) {$(this.#install_InstallHours[1]).val(value).change();}

	get installDays() {return zeroIfNaNNullBlank(this.#install_InstallDays[1].value);}
	set installDays(value) {$(this.#install_InstallDays[1]).val(value).change();}

	get installRate() {return this.#install_InstallRate[1].value;}
	set installRate(value) {this.#install_InstallRate[1].value = value;}

	get travelMinutes() {return zeroIfNaNNullBlank(this.#install_TravelMinutes[1].value);}
	set travelMinutes(value) {$(this.#install_TravelMinutes[1]).val(value).change();}

	get travelHours() {return zeroIfNaNNullBlank(this.#install_TravelHours[1].value);}
	set travelHours(value) {$(this.#install_TravelHours[1]).val(value).change();}

	get travelDays() {return zeroIfNaNNullBlank(this.#install_TravelDays[1].value);}
	set travelHours(value) {$(this.#install_TravelDays[1]).val(value).change();}

	get travelRate() {return this.#install_TravelRate[1].value;}
	set travelRate(value) {this.#install_TravelRate[1].value = value;}

	get qty() {return zeroIfNaNNullBlank(this.#qty[1].value);}

	UpdateInstallLookup() {
		let chosenLookupType = this.#quickItem[1].value;
		let types = Object.getOwnPropertyNames(InstallTimesLookup[chosenLookupType]);
		let array = [];
		for(let i = 0; i < types.length; i++) {
			let key = Object.keys(InstallTimesLookup[chosenLookupType])[i];
			let obj = InstallTimesLookup[chosenLookupType][key];
			array.push([types[i], obj.imageURL == null ? "null" : obj.imageURL]);
		}
		deleteElement(this.#quickInstall_sub[0]);
		this.#quickInstall_sub = createDropdown_Infield_Icons_Search("Size", 0, null, 150, false, array, () => {
			this.UpdateInstallTimes();
		}, this.#quickLookupContainer[1], false);
		this.UpdateInstallTimes();

	}

	UpdateInstallTimes() {
		console.log(this.#quickItem[1].value);
		console.log(this.#quickInstall_sub[1].value);

		let chosenLookupType = this.#quickItem[1].value;

		let types = Object.getOwnPropertyNames(InstallTimesLookup[chosenLookupType]);
		for(let i = 0; i < types.length; i++) {

			let key = Object.keys(InstallTimesLookup[chosenLookupType])[i];
			let obj = InstallTimesLookup[chosenLookupType][key];

			if(key == this.#quickInstall_sub[1].value) {
				if(obj.installers == 1) {
					dropdownSetSelectedValue(this.#install_InstallRate[1], InstallLookup["1P $135"]);
				}
				if(obj.installers == 2) {
					dropdownSetSelectedValue(this.#install_InstallRate[1], InstallLookup["2P $270"]);
				}
				let mhd = getMHD(obj.minutes);
				this.installMinutes = mhd[0];
				this.installHours = mhd[1];
				this.installDays = mhd[2];
			}
		}
	}

	Update() {
		this.callback();
	}

	async Create(productNo, partIndex) {
		partIndex = await super.Create(productNo, partIndex);
		if(this.required) {
			if(this.installTotalEach == "Total") {
				if(this.#isOutsourced[1].checked) {
					await AddPart("Custom Item Cost-Markup (Total)", productNo);
					partIndex++;
					await setPartQty(productNo, partIndex, this.qty);
					await setPartDescription(productNo, partIndex, "OUTSOURCED INSTALL");
					await setPartVendorCostEa(productNo, partIndex, zeroIfNaNNullBlank(this.#outsourceCost[1].value));
					await setPartMarkup(productNo, partIndex, zeroIfNaNNullBlank(this.#outsourceMarkup[1].value));
					await savePart(productNo, partIndex);
				}
				else {
					await AddPart("Install - IH", productNo);
					partIndex++;
					await setPartQty(productNo, partIndex, this.qty);
					await setPartDescription(productNo, partIndex, "[INSTALL (total)]" + (this.#quickLookup[1].checked ? " - QL[" + this.#quickItem[1].value + ", " + this.#quickInstall_sub[1].value + "]" : ""));
					await setInstallTimeMHD(productNo, partIndex, this.installMinutes, this.installHours, this.installDays);
					await setInstallPartType(productNo, partIndex, this.installRate);
					await setTravelTimeMHD(productNo, partIndex, this.travelMinutes, this.travelHours, this.travelDays);
					await setTravelType(productNo, partIndex, this.travelRate);
					await savePart(productNo, partIndex);
				}
			} else {
				if(this.#isOutsourced[1].checked) {
					await AddPart("Custom Item Cost-Markup (Ea)", productNo);
					partIndex++;
					await setPartQty(productNo, partIndex, this.qty);
					await setPartDescription(productNo, partIndex, "OUTSOURCED INSTALL");
					await setPartVendorCostEa(productNo, partIndex, zeroIfNaNNullBlank(this.#outsourceCost[1].value));
					await setPartMarkupEa(productNo, partIndex, zeroIfNaNNullBlank(this.#outsourceMarkup[1].value));
					await savePart(productNo, partIndex);
				} else {
					await AddPart("Install - IH (ea)", productNo);
					partIndex++;
					await setPartQty(productNo, partIndex, this.qty);
					await setPartDescription(productNo, partIndex, "[INSTALL (ea)]" + (this.#quickLookup[1].checked ? " - QL[" + this.#quickItem[1].value + ", " + this.#quickInstall_sub[1].value + "]" : ""));
					await setInstallTimeMHDEa(productNo, partIndex, this.installMinutes, this.installHours, this.installDays);
					await setInstallPartTypeEa(productNo, partIndex, this.installRate);
					await setTravelTimeMHDEa(productNo, partIndex, this.travelMinutes, this.travelHours, this.travelDays);
					await setTravelTypeEa(productNo, partIndex, this.travelRate);
					await savePart(productNo, partIndex);
				}
			}
		}
		return partIndex;
	}

	Description() {
		super.Description();
		if(!this.required) return "Install separately<br>";
		return "Includes Install<br>";
	}
}

var install_WindowGraphics_PerSqm = 12;
var install_WindowGraphics_TrimPerLnm = 2;
function getInstallTime(quantity, width, height) {
	var totalSqm = (width / 1000) * (height / 1000) * quantity;
	var totalTrimLnm = (width / 1000 + height / 1000) * quantity;
	var time = 0;

	time +=
		totalSqm * install_WindowGraphics_PerSqm +
		totalTrimLnm * install_WindowGraphics_TrimPerLnm;

	return roundNumber(time, 2);
}
