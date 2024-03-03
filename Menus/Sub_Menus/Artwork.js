class Artwork extends SubMenu {
	headerText = "Artwork";
	#canvasCtx;
	#artworkTimeMins;
	#artworkTimeHours;
	#artworkTimeDays;
	#artworkCreateInNewItem;

	constructor(parentObject, canvasCtx, updateFunction) {
		super(parentObject, canvasCtx, updateFunction, "ARTWORK");

		this.#canvasCtx = canvasCtx;

		this.#artworkTimeMins = createInput_Infield("Mins", null, "width:29%;display:block;min-width:50px;", () => {this.Update();}, this.contentContainer, false, 10);
		this.#artworkTimeMins[1].id = "artworkTimeField";
		this.#artworkTimeHours = createInput_Infield("Hours", null, "width:29%;display:block;min-width:50px;", () => {this.Update();}, this.contentContainer, false, 1);
		this.#artworkTimeDays = createInput_Infield("Days (8h)", null, "width:29%;display:block;min-width:50px;", () => {this.Update();}, this.contentContainer, false, 1);

		this.#artworkCreateInNewItem = createCheckbox_Infield("Create in New Product", false, "margin-left:40%;width:50%;float:right", () => {this.Update();}, this.contentContainer);

		this.requiredField[1].id = "artworkRequiredField";

		makeFieldGroup("Checkbox", this.requiredField[1], false,
			this.#artworkTimeMins[0],
			this.#artworkTimeHours[0],
			this.#artworkTimeDays[0],
			this.#artworkCreateInNewItem[0]
		);
	}


	get artworkCreateInNewItem() {
		return this.#artworkCreateInNewItem[1].checked;
	}
	set artworkCreateInNewItem(value) {
		this.#artworkCreateInNewItem[1].checked = value;
	}

	get artworkTimeMins() {
		return zeroIfNaNNullBlank(this.#artworkTimeMins[1].value) + zeroIfNaNNullBlank(this.#artworkTimeHours[1].value) * 60 + zeroIfNaNNullBlank(this.#artworkTimeDays[1].value) * 60 * dayHours;
	}
	set artworkTime(minutes) {
		let times = getMHD(minutes);
		$(this.#artworkTimeMins[1]).val(times[0]).change();
		$(this.#artworkTimeHours[1]).val(times[1]).change();
		$(this.#artworkTimeDays[1]).val(times[2]).change();
	}

	Update() {
		super.Update();
	}

	async Create(productNo, partIndex) {
		if(this.required) {
			if(this.artworkCreateInNewItem) {
				await AddQuickProduct(" ARTWORK, PROOFING & CONVERSION TO PRINT READY FORMAT- Signage");
				productNo = getNumProducts();
				var newPartIndex = 1;
				await openPart(productNo, newPartIndex);
				await setArtworkTime(productNo, newPartIndex, this.artworkTimeMins);
				await setPartDescription(productNo, newPartIndex, "[ARTWORK]");
				await savePart(productNo, newPartIndex);
				return partIndex; //return old partIndex still
			}
			await AddPart("Artwork and Print Files", productNo);
			partIndex++;
			await setArtworkTime(productNo, partIndex, this.artworkTimeMins);
			await setPartDescription(productNo, partIndex, "[ARTWORK]");
			await savePart(productNo, partIndex);
		}
		return partIndex;
	}

	Description() {
		if(!this.required) return "Artwork separately<br>";
		return "Includes Artwork<br>";
	}
}
