class Install extends SubMenu {

	#quickLookup;
	#quickItem;
	#quickInstall_sub;

	constructor(parentObject, canvasCtx, updateFunction, sizeClass) {
		super(parentObject, canvasCtx, updateFunction, "INSTALL");

		this.l_installTimeTotalEach = createDropdown_Infield("Total or Each", 1, "width:30%;display:block;margin-right:63%;", [
			createDropdownOption("Total", "Total"),
			createDropdownOption("Each", "Each"),
		], () => {this.Update();}, this.contentContainer);
		this.l_install_InstallRate = createDropdown_Infield("Install Rate", 3, "display:block;width:63%;margin-right:20%;", [
			createDropdownOption(InstallLookup["1P $95"], InstallLookup["1P $95"]),
			createDropdownOption(InstallLookup["1P $135"], InstallLookup["1P $135"]),
			createDropdownOption(InstallLookup["1P $120 SAR"], InstallLookup["1P $120 SAR"]),
			createDropdownOption(InstallLookup["1P $135 Vehicles"], InstallLookup["1P $135 Vehicles"]),
			createDropdownOption(InstallLookup["2P $180"], InstallLookup["2P $180"]),
			createDropdownOption(InstallLookup["2P $270"], InstallLookup["2P $270"]),
			createDropdownOption(InstallLookup["2P $200 SAR"], InstallLookup["2P $200 SAR"]),
		], () => {this.Update();}, this.contentContainer);
		this.l_install_InstallMinutes = createInput_Infield("Install Minutes", null, "width:25%;display:block;margin-left:40px;", () => {this.Update();}, this.contentContainer, false, 10);
		this.l_install_InstallHours = createInput_Infield("Install Hours", null, "width:25%;display:block", () => {this.Update();}, this.contentContainer, false, 1);
		this.l_install_InstallDays = createInput_Infield("Install Days (8h)", null, "width:25%;display:block", () => {this.Update();}, this.contentContainer, false, 1);
		this.l_install_TravelRate = createDropdown_Infield("Travel Rate", 1, "display:block;width:63%;margin-right:20%", [
			createDropdownOption(TravelLookup["1P $95"], TravelLookup["1P $95"]),
			createDropdownOption(TravelLookup["1P $135"], TravelLookup["1P $135"]),
			createDropdownOption(TravelLookup["1P $120 SAR"], TravelLookup["1P $120 SAR"]),
			createDropdownOption(TravelLookup["2P $135"], TravelLookup["2P $135"]),
			createDropdownOption(TravelLookup["2P $270"], TravelLookup["2P $270"]),
			createDropdownOption(TravelLookup["2P $240 SAR"], TravelLookup["2P $240 SAR"])
		], () => {this.Update();}, this.contentContainer);
		this.l_install_TravelMinutes = createInput_Infield("Travel Minutes", null, "width:25%;display:block;margin-left:40px", () => {this.Update();}, this.contentContainer, false, 10);
		this.l_install_TravelHours = createInput_Infield("Travel Hours", null, "width:25%;display:block;", () => {this.Update();}, this.contentContainer, false, 1);
		this.l_install_TravelDays = createInput_Infield("Travel Days (8h)", null, "width:25%;display:block;", () => {this.Update();}, this.contentContainer, false, 1);

		this.#quickLookup = createCheckbox_Infield("Quick Lookup", false, null, () => { }, this.contentContainer);

		let installTypes = [];
		let types = Object.getOwnPropertyNames(InstallTimesLookup);
		for(let i = 0; i < types.length; i++) {
			installTypes.push(createDropdownOption(types[i], types[i]));
		}
		this.#quickItem = createDropdown_Infield("Type", 0, null, installTypes, () => {
			this.UpdateInstallLookup();
		}, this.contentContainer);

		this.#quickInstall_sub = createDropdown_Infield_Icons_Search("Sub", 0, null, 150, false, [], () => {
			this.UpdateInstallTimes();
		}, this.contentContainer, false);
		this.UpdateInstallLookup();

		makeFieldGroup("Checkbox", this.#quickLookup[1], false,
			this.#quickItem[0],
			this.#quickInstall_sub[0]
		);

		makeFieldGroup("Checkbox", this.requiredField[1], false,
			this.l_installTimeTotalEach[0],
			this.l_install_InstallMinutes[0],
			this.l_install_InstallHours[0],
			this.l_install_InstallDays[0],
			this.l_install_InstallRate[0],
			this.l_install_TravelMinutes[0],
			this.l_install_TravelHours[0],
			this.l_install_TravelDays[0],
			this.l_install_TravelRate[0]
		);
		$(this.#quickLookup[1]).click();
		$(this.#quickLookup[1]).click();
	}

	get installTotalEach() {return this.l_installTimeTotalEach[1].value;}
	set installTotalEach(value) {this.l_installTimeTotalEach[1].value = value;}

	get installMinutes() {return zeroIfNaNNullBlank(this.l_install_InstallMinutes[1].value);}
	set installMinutes(value) {$(this.l_install_InstallMinutes[1]).val(value).change();}

	get installHours() {return zeroIfNaNNullBlank(this.l_install_InstallHours[1].value);}
	set installHours(value) {$(this.l_install_InstallHours[1]).val(value).change();}

	get installDays() {return zeroIfNaNNullBlank(this.l_install_InstallDays[1].value);}
	set installDays(value) {$(this.l_install_InstallDays[1]).val(value).change();}

	get installRate() {return this.l_install_InstallRate[1].value;}
	set installRate(value) {this.l_install_InstallRate[1].value = value;}

	get travelMinutes() {return zeroIfNaNNullBlank(this.l_install_TravelMinutes[1].value);}
	set travelMinutes(value) {$(this.l_install_TravelMinutes[1]).val(value).change();}

	get travelHours() {return zeroIfNaNNullBlank(this.l_install_TravelHours[1].value);}
	set travelHours(value) {$(this.l_install_TravelHours[1]).val(value).change();}

	get travelDays() {return zeroIfNaNNullBlank(this.l_install_TravelDays[1].value);}
	set travelHours(value) {$(this.l_install_TravelDays[1]).val(value).change();}

	get travelRate() {return this.l_install_TravelRate[1].value;}
	set travelRate(value) {this.l_install_TravelRate[1].value = value;}

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
		this.#quickInstall_sub = createDropdown_Infield_Icons_Search("Sub", 0, null, 150, false, array, () => {
			this.UpdateInstallTimes();
		}, this.contentContainer, false);
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
					dropdownSetSelectedValue(this.l_install_InstallRate[1], InstallLookup["1P $135"]);
				}
				if(obj.installers == 2) {
					dropdownSetSelectedValue(this.l_install_InstallRate[1], InstallLookup["2P $270"]);
				}
				this.installMinutes = obj.minutes;
				this.installHours = 0;
				this.installDays = 0;
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
				await AddPart("Install - IH", productNo);
				partIndex++;
				await setPartDescription(productNo, partIndex, "[INSTALL (total)]");
				await setInstallTimeMHD(productNo, partIndex, this.installMinutes, this.installHours, this.installDays);
				await setInstallPartType(productNo, partIndex, this.installRate);
				await setTravelTimeMHD(productNo, partIndex, this.travelMinutes, this.travelHours, this.travelDays);
				await setTravelType(productNo, partIndex, this.travelRate);
				await savePart(productNo, partIndex);
			} else {
				await AddPart("Install - IH (ea)", productNo);
				partIndex++;
				await setPartDescription(productNo, partIndex, "[INSTALL (ea)]");
				await setInstallTimeMHDEa(productNo, partIndex, this.installMinutes, this.installHours, this.installDays);
				await setInstallPartTypeEa(productNo, partIndex, this.installRate);
				await setTravelTimeMHDEa(productNo, partIndex, this.travelMinutes, this.travelHours, this.travelDays);
				await setTravelTypeEa(productNo, partIndex, this.travelRate);
				await savePart(productNo, partIndex);
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
