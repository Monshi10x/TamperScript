class Size extends SubMenu {

	static commonSizes = {
		"DL": {
			"show": false,
			"width": 210,
			"height": 99
		},
		"A0": {
			"show": false,
			"width": 841,
			"height": 1189
		},
		"A1": {
			"show": false,
			"width": 594,
			"height": 841
		},
		"A2": {
			"show": false,
			"width": 420,
			"height": 594
		},
		"A3": {
			"show": false,
			"width": 297,
			"height": 420
		},
		"A4": {
			"show": false,
			"width": 210,
			"height": 297
		},
		"A5": {
			"show": false,
			"width": 148.5,
			"height": 210
		},
		"A6": {
			"show": false,
			"width": 105,
			"height": 148.5
		},
		"A7": {
			"show": false,
			"width": 74,
			"height": 105
		},
		"A8": {
			"show": false,
			"width": 52,
			"height": 74
		},
		"A9": {
			"show": false,
			"width": 37,
			"height": 52
		},
		"A10": {
			"show": false,
			"width": 26,
			"height": 37
		},
		"600x450": {
			"show": false,
			"width": 600,
			"height": 450
		},
		"600x900": {
			"show": false,
			"width": 600,
			"height": 900
		},
		"610x1220": {
			"show": false,
			"width": 610,
			"height": 1220
		},
		"1000x1000": {
			"show": false,
			"width": 1000,
			"height": 1000
		},
		"1220x1220": {
			"show": false,
			"width": 1220,
			"height": 1220
		},
		"2440x1220": {
			"show": false,
			"width": 2440,
			"height": 1220
		},
	};

	/**
	 * @example
	 * [{RowNameField: null,
	     QtyField: [],
	     WidthField: [],
	     HeightField: [],
	     DeleteBtn: [],
	     Subscribers: []}
	   ]
	 */
	#rows = [];
	get numberRows() {
		return this.#rows.length;
	}

	#rowsContainer;

	get ID() {return this.UNIQUEID;};

	#subscribers = [];
	/**
	 * @Subscribers
	 */

	constructor(parentContainer, updateFunction) {
		super(parentContainer, null, updateFunction, "Size");

		let buttonContainer = createDiv("width:100%;background-color:white;", null, this.contentContainer);

		let addSizeButton = createButton("Add +", "width:20%;margin-right:25%", () => {this.AddRow();}, buttonContainer);
		let includeSizeInDescription = createCheckbox_Infield("Include Sizes in Description", false, "width:40%;margin:12px 10% 12px 0px;", null, buttonContainer);
		this.#rowsContainer = createDiv("background-color: " + COLOUR.MediumGrey + ";width:100%;max-height:300px;overflow-y:scroll;", null, this.contentContainer);
		//this.AddRow();

		window.addEventListener(event_testing.type, () => {console.log(this);});

	}

	AddRow(qtyValue = 1, widthValue = null, heightValue = null, subscribers = null) {
		let bg = Color.randomRGBAsHex();
		let textC = Color.invertColor(bg, true);
		let rowName = createText("Row " + (this.numberRows + 1), "height:40px;margin:5px;background-color:" + bg + ";width:8%;font-size:10px;color:" + textC
			+ ";text-align:center;line-height:30px;border:1px solid " + COLOUR.White + ";", this.#rowsContainer);
		let qty = createInput_Infield("Quantity", qtyValue, "width:20%", this.triggerSizeChangeEvent, this.#rowsContainer, true, 1);
		let width = createInput_Infield("Width", widthValue, "width:25%", this.triggerSizeChangeEvent, this.#rowsContainer, true, 100);
		let height = createInput_Infield("Height", heightValue, "width:25%", this.triggerSizeChangeEvent, this.#rowsContainer, true, 100);
		let commonSizeButton = createButton("C", "width:5%;height:42px;margin:5px;", () => {
			this.getCommonSize(null, commonSizeButton);
		}, this.#rowsContainer);
		let deleteButton = createButton("X", "width:5%;height:42px;margin:5px;", () => {
			this.deleteRow(null, deleteButton);
		}, this.#rowsContainer);
		let SubscribersArray = subscribers == null ? [] : [subscribers];

		this.#rows.push(
			{
				RowNameField: rowName,
				QtyField: qty,
				WidthField: width,
				HeightField: height,
				CommonSizeBtn: commonSizeButton,
				DeleteBtn: deleteButton,
				Subscribers: SubscribersArray
			}
		);

		this.triggerSizeAddEvent();
	}

	deleteRow(rowIndex, rowWithObject) {
		if(rowIndex) {
			rowIndex = rowIndex;
		} else if(rowWithObject) {
			for(var i = 0; i < this.#rows.length; i++) {
				if(this.#rows[i].RowNameField == rowWithObject ||
					this.#rows[i].QtyField == rowWithObject ||
					this.#rows[i].WidthField == rowWithObject ||
					this.#rows[i].HeightField == rowWithObject ||
					this.#rows[i].CommonSizeBtn == rowWithObject ||
					this.#rows[i].DeleteBtn == rowWithObject) {
					rowIndex = i;
				}
			}
		}
		if(rowIndex == null) return false;
		$(this.#rows[rowIndex].RowNameField).remove();
		$(this.#rows[rowIndex].QtyField[0]).remove();
		$(this.#rows[rowIndex].WidthField[0]).remove();
		$(this.#rows[rowIndex].HeightField[0]).remove();
		$(this.#rows[rowIndex].CommonSizeBtn).remove();
		$(this.#rows[rowIndex].DeleteBtn).remove();
		this.#rows.splice(rowIndex, 1);
		this.renameRows();
		this.triggerSizeDeleteEvent();

	}

	getCommonSize(rowIndex, rowWithObject) {
		if(rowIndex) {
			rowIndex = rowIndex;
		} else if(rowWithObject) {
			for(var i = 0; i < this.#rows.length; i++) {
				if(this.#rows[i].RowNameField == rowWithObject ||
					this.#rows[i].QtyField == rowWithObject ||
					this.#rows[i].WidthField == rowWithObject ||
					this.#rows[i].HeightField == rowWithObject ||
					this.#rows[i].CommonSizeBtn == rowWithObject ||
					this.#rows[i].DeleteBtn == rowWithObject) {
					rowIndex = i;
				}
			}
		}
		if(rowIndex == null) return false;
		let modal = new ModalToggleTokens("Choose Common Size", Size.commonSizes, (arg1_returnedSizes) => {
			if(arg1_returnedSizes.length == 0) console.error("No new option pairs arg provided");
			let returnedSizes = arg1_returnedSizes[0];
			for(let i = 0; i < Object.keys(returnedSizes).length; i++) {
				if(returnedSizes[Object.keys(returnedSizes)[i]]["show"] === true) {
					$(this.#rows[rowIndex].WidthField[1]).val(parseFloat(returnedSizes[Object.keys(returnedSizes)[i]]["width"])).change();
					$(this.#rows[rowIndex].HeightField[1]).val(parseFloat(returnedSizes[Object.keys(returnedSizes)[i]]["height"])).change();
					break;
				}
			}
		}, false);
	}

	/**
	 * @Subscribers
	 * TODO: Soon this will be deprecated as the class will inherit this method from Material.js
	 */
	AddSubscriber(subscriber) {
		console.table(this.ID, " adds Subscriber ", subscriber.ID);
		this.#subscribers.push(subscriber);
	}

	addSubscriberToRows(SubscriberID, ...rowIDs) {
		for(let i = 0; i < rowIDs.length; i++) {
			let row = this.#rows[rowIDs[i]];
			if(!row.Subscribers.includes(SubscriberID)) {
				row.Subscribers.push(SubscriberID);
				this.AddSubscriber(SubscriberID);
			}
		}
	}

	addSubscriberToRows2(SubscriberObject, ...rowIDs) {
		for(let i = 0; i < rowIDs.length; i++) {
			if(rowIDs[i] == -1) return;
			let row = this.#rows[rowIDs[i]];
			if(!row.Subscribers.includes(SubscriberObject.ID)) {
				row.Subscribers.push(SubscriberObject.ID);
				SubscriberObject.SubscribeTo(this);
				//this.AddSubscriber(SubscriberObject);
			}
		}
	}

	getRowsBySubscriber(SubscriberID) {
		let rows = [];
		for(let i = 0; i < this.#rows.length; i++) {
			if(this.#rows[i].Subscribers.includes(SubscriberID)) {
				rows.push(this.#rows[i]);
			}
		}
		return rows;
	}

	getRowsIDsBySubscriber(SubscriberID) {
		let rowIDs = [];
		for(let i = 0; i < this.#rows.length; i++) {
			if(this.#rows[i].Subscribers.includes(SubscriberID)) {
				rowIDs.push(i);
			}
		}
		return rowIDs;
	}

	rowHasSubscriberOfType(rowID, SubscriberSearchTerm) {
		let rowSubscribers = this.#rows[rowID].Subscribers;
		for(let i = 0; i < rowSubscribers.length; i++) {
			if(rowSubscribers[i].includes(SubscriberSearchTerm)) {
				return true;
			}
		}
		return false;
	}

	deleteSubscriberInRows(SubscriberID, ...rowIDs) {
		for(var i = 0; i < this.#rows.length; i++) {
			if(!rowIDs.includes(i)) continue;
			if(this.#rows[i].Subscribers.includes(SubscriberID)) {
				this.#rows[i].Subscribers.splice(this.#rows[i].Subscribers.indexOf(SubscriberID), 1);
			}
		}
	}

	deleteSubscriberInRowsAll(SubscriberID) {
		for(var i = 0; i < this.#rows.length; i++) {
			if(this.#rows[i].Subscribers.includes(SubscriberID)) {
				this.#rows[i].Subscribers.splice(this.#rows[i].Subscribers.indexOf(SubscriberID), 1);
			}
		}
	}

	rowContainsSubscription(SubscriberID, rowID) {
		if(this.#rows[rowID].Subscribers.includes(SubscriberID)) return true;
		return false;
	};

	getQWH(SubscriberID) {
		let obj = {
			Qty: 0,
			Width: 0,
			Height: 0
		};

		let rows = this.getRowsBySubscriber(SubscriberID);
		if(rows.length > 0) {
			obj = {
				Qty: rows[0].QtyField[1].value,
				Width: rows[0].WidthField[1].value,
				Height: rows[0].HeightField[1].value
			};
		}

		return obj;
	}

	/**
	 * @example
	 * 		[[1, 2440, 1220],
	 * 		 [1, 2440, 1220],
	 * 		 [1, 800, 800]]
	 */
	get sizeRows() {
		let arr = [];
		for(let i = 0; i < this.#rows.length; i++) {
			var qty = parseFloat(this.#rows[i].QtyField[1].value);
			var width = parseFloat(this.#rows[i].WidthField[1].value);
			var height = parseFloat(this.#rows[i].HeightField[1].value);
			arr.push([qty, width, height]);
		}
		return arr;
	}

	get numberRows() {return this.#rows.length;}

	triggerSizeChangeEvent = () => {
		this.contentContainer.dispatchEvent(event_SizeChange);
	};
	triggerSizeAddEvent = () => {
		this.contentContainer.dispatchEvent(event_SizeAdded);
	};
	triggerSizeDeleteEvent = () => {
		this.contentContainer.dispatchEvent(event_SizeDeleted);
	};

	subscribeToSizeChangeEvent = (callback) => {
		this.contentContainer.addEventListener(event_SizeChange.type, callback);
	};
	subscribeToSizeAddEvent = (callback) => {
		this.contentContainer.addEventListener(event_SizeAdded.type, callback);
	};
	subscribeToSizeDeleteEvent = (callback) => {
		this.contentContainer.addEventListener(event_SizeDeleted.type, callback);
	};

	renameRows = () => {
		for(let i = 0; i < this.#rows.length; i++) {
			this.#rows[i].RowNameField.innerText = "Row " + (i + 1);
		}
	};

	getSizeGroupAverageWidthHeightQty = () => {
		var combinedSqm = 0;

		for(let i = 0; i < this.#rows.length; i++) {
			let qty = parseFloat(this.#rows[i].QtyField[1].value);
			let width = parseFloat(this.#rows[i].WidthField[1].value);
			let height = parseFloat(this.#rows[i].HeightField[1].value);

			if(this.#rows.length == 1) {
				return [qty, width, height];
			}

			combinedSqm += qty * width * height;
		}

		var averageDimension = Math.sqrt(combinedSqm);
		return [1, averageDimension, averageDimension];
	};

	getAllWidthHeightQty = () => {
		var arr = [];

		for(let i = 0; i < this.#rows.length; i++) {
			let qty = parseFloat(this.#rows[i].QtyField[1].value);
			let width = parseFloat(this.#rows[i].WidthField[1].value);
			let height = parseFloat(this.#rows[i].HeightField[1].value);

			arr.push([qty, width, height]);
		}

		return arr;
	};

	sheetsToggle = () => {
		if(this.required) {
			setFieldHidden(false, this.l_materialContainer, this.l_materialContainer);
			setFieldHidden(false, this.#rowsContainer, this.#rowsContainer);
		} else {
			setFieldHidden(true, this.l_materialContainer, this.l_materialContainer);
			setFieldHidden(true, this.#rowsContainer, this.#rowsContainer);
		}
		this.Update();
	};

	rowHeaderField = (rowNumber) => {
		return this.#rows[rowNumber - 1].RowNameField;
	};

	async Create(productNo, partIndex) {
		if(this.required) {

		}
		return partIndex;
	}

	Update() {
		super.Update();
	}

	Description() {
	}
}

