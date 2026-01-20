class MenuPanelSigns extends LHSMenuWindow {

	/** @ViewMode */
	#viewMode;
	#numProducts = 0;
	#creationOrder = [ProductDetails, Size, SVGCutfile, Coil, Sheet, LED, Transformer, Painting, Vinyl, Laminate, AppTaping, HandTrimming, PrintMounting, Finishing, ProductionSubscribable, ArtworkSubscribable, InstallSubscribable];


	/** @QuickTemplate */
	#addQuickTemplateBtn;
	#createProductBtn;
	/**
	 * @Size
	 */
	#sizeContainer;
	#addSizeBtn;
	#sizeArray = [];
	/**
	 * @Sheet
	 */
	#sheetContainer;
	#addSheetBtn;
	/**
	 * @Vinyl
	 */
	#vinylContainer;
	#addVinylBtn;
	/**
	 * @Laminate
	 */
	#laminateContainer;
	#addLaminateBtn;
	/**
	 * @AppTape
	 */
	#appTapingContainer;
	#appTapingBtn;
	/**
	 * @HandTrimming
	 */
	#handTrimmingContainer;
	#addHandTrimmingBtn;
	/**
	 * @PrintMounting
	 */
	#printMountingContainer;
	#printMountingBtn;
	/**
	 * @Production
	 */
	#production;
	#productionContainer;
	#addProductionBtn;
	/**
	 * @Artwork
	 */
	#artwork;
	#artworkContainer;
	#addArtworkBtn;
	/**
	 * @Install
	 */
	#install;
	#installContainer;
	#addInstallBtn;
	/**
	 * @AllMaterialsArray
	 */
	#allMaterials = new ObjectArray();
	get allMaterials() {return this.#allMaterials;};

	#containers = [];
	#productContainers = [];

	#subscriptionTree;
	get subscriptionTree() {
		return {
			ProductDetails: [],
			Size: [],
			Coil: [],
			Sheet: [Size],
			LED: [],
			Transformer: [],
			Painting: [],
			Vinyl: [Sheet],
			Laminate: [Vinyl],
			AppTaping: [Vinyl],
			HandTrimming: [Vinyl],
			PrintMounting: [Sheet],
			ProductionSubscribable: [Sheet],
			ArtworkSubscribable: [Size],
			InstallSubscribable: [Sheet]
		};
	}

	quickTemplates = [
		["ACM", "https://d2ngzhadqk6uhe.cloudfront.net/deanssign/images/product/Deans-Aluminum-Composite-Board.jpg"],
		["Aluminium", "https://github.com/Monshi10x/TamperScript/raw/main/Images/AluminiumPanelWithPrint.png"],
		["Lightbox Face - Opal Acrylic", "https://cdn.gorilladash.com/images/media/5077257/signarama-australia-img-6911-2-small-thumbnail-61611e9ab2f0f.jpg"],
		["Clear Acrylic", "https://m.media-amazon.com/images/I/71hK5AoWC-L._AC_UF894,1000_QL80_.jpg"],
		["Foam PVC", "https://5.imimg.com/data5/RN/UM/MY-14219350/white-pvc-foam-sheet-500x500.jpg"],
		["Signwhite", "https://img.archiexpo.com/images_ae/photo-g/158002-12419012.jpg"],
		["Corflute", GM_getResourceURL("Image_Corflute")],
		["Wall Graphics", "https://cdn.gorilladash.com/images/media/6161323/signarama-australia-img-3113-thumbnail-638306a183cd0.jpg"]
	];


	constructor(width, height, ID, windowTitle) {
		super(width, height, ID, windowTitle);
		this.addPages(1);

		this.page1 = this.getPage(0);

		document.addEventListener("loadedPredefinedParts", () => {
			/*
			ToggleOpen */
			let toggleOpenBtn = createButton("Open All", "width:20%;height:40px;margin:0px;", () => {this.#toggleAllOpen();}, this.page1);
			/*
			ToggleClosed */
			let toggleClosedBtn = createButton("Close All", "width:20%;height:40px;margin:0px;", () => {this.#toggleAllClosed();}, this.page1);

			this.#addQuickTemplateBtn = createDropdown_Infield_Icons_Search("Add Quick Template Product", 0, "width:40%;height:35px;margin:0px;box-sizing:border-box;", 150, false,
				this.quickTemplates,
				() => {this.#addQuickTemplate();},
				this.page1, false
			);

			this.#viewMode = createDropdown_Infield('View Mode', 1, "width:calc(20% - 2px);height:35px;margin:0px;box-sizing:border-box;", [createDropdownOption("Per Type", "Per Type"), createDropdownOption("Per Product", "Per Product"), createDropdownOption("Per Type2", "Per Type2")], () => {this.#updateViewMode();}, this.page1);
		});

		this.#createProductBtn = createButton("Create Product   " + "\u25BA", "width:100%;margin:0px;", () => {this.CreateProduct(this);});
		this.footer.appendChild(this.#createProductBtn);
	}

	#addQuickTemplate() {
		this.#numProducts++;

		let productDetails = null;
		let size = null;
		let svgCutfile = null;
		let sheet = null;
		let coil = null;
		let led = null;
		let transformer = null;
		let vinyl = null;
		let laminate = null;
		let appTape = null;
		let handTrimming = null;
		let printMounting = null;
		let finishing = null;
		let painting = null;
		let production = null;
		let artwork = null;
		let install = null;

		switch(this.#addQuickTemplateBtn[1].value) {
			case "ACM":
				productDetails = this.#add(ProductDetails, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						productLocation: "",
						productName: "ACM Panel",
						description: "3mm ACM Panel with Digitally Printed Vinyl"
					}, itemUpdateOnCompletion: true
				});

				size = this.#add(Size, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						width: 2440,
						height: 1220
					}, itemUpdateOnCompletion: true
				});

				sheet = this.#add(Sheet, this.page1, [Size], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						material: "ACM",
						sheetSize: "2440x1220",
						sheetMaterial: "ACM - (sqm) - 2440x1220x3x0.21 Primer/Primer (Mulfords)"
					}, itemUpdateOnCompletion: true
				});

				vinyl = this.#add(Vinyl, this.page1, [Sheet]);
				laminate = this.#add(Laminate, this.page1, [Vinyl]);
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, this.page1, [Sheet]);
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Sheet]);
				break;
			case "Aluminium":
				productDetails = this.#add(ProductDetails, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						productLocation: "",
						productName: "Aluminium",
						description: "3mm Aluminium Panel with Digitally Printed Vinyl"
					}, itemUpdateOnCompletion: true
				});

				size = this.#add(Size, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						width: 2400,
						height: 1200
					}, itemUpdateOnCompletion: true
				});

				sheet = this.#add(Sheet, this.page1, [Size], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						material: "Aluminium",
						sheetSize: "2400x1200",
						thickness: 3
					}, itemUpdateOnCompletion: true
				});

				vinyl = this.#add(Vinyl, this.page1, [Sheet]);
				laminate = this.#add(Laminate, this.page1, [Vinyl]);
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, this.page1, [Sheet]);
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Sheet]);
				break;
			case "Lightbox Face - Opal Acrylic":
				productDetails = this.#add(ProductDetails, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						productLocation: "",
						productName: "Acrylic Lightbox Face",
						description: "4.5mm Opal Acrylic with Digitally Printed Vinyl"
					}, itemUpdateOnCompletion: true
				});

				size = this.#add(Size, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						width: 2440,
						height: 1220
					}, itemUpdateOnCompletion: true
				});

				sheet = this.#add(Sheet, this.page1, [Size], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						material: "Acrylic",
						sheetSize: "2440x1220",
						thickness: "4.5",
						finish: "Opal"
					}, itemUpdateOnCompletion: true
				});

				vinyl = this.#add(Vinyl, this.page1, [Sheet], {
					propertiesToAssign: {
						material: VinylLookup["Clear"],
						bleedDropdown: "Lightbox Faces"
					},
				});
				laminate = this.#add(Laminate, this.page1, [Vinyl], {
					propertiesToAssign: {
						material: LaminateLookup["Gloss"]
					},
				});
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, this.page1, [Sheet]);
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Sheet]);
				break;
			case "Clear Acrylic":
				productDetails = this.#add(ProductDetails, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						productLocation: "",
						productName: "Clear Acrylic Panel with Stand-offs",
						description: "6mm Clear Acrylic with Digitally Printed Vinyl"
					}, itemUpdateOnCompletion: true
				});

				size = this.#add(Size, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						width: 2440,
						height: 1220
					}, itemUpdateOnCompletion: true
				});

				sheet = this.#add(Sheet, this.page1, [Size], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						material: "Acrylic",
						sheetSize: "2440mm x 1220mm",
						thickness: "6",
						finish: "Clear",
						preferredCuttingMachine: "laser"
					}, itemUpdateOnCompletion: true
				});

				vinyl = this.#add(Vinyl, this.page1, [Sheet], {
					propertiesToAssign: {
						material: VinylLookup["Clear"],
						bleedDropdown: "Reverse Acrylics"
					},
				});
				laminate = this.#add(Laminate, this.page1, [Vinyl], {
					propertiesToAssign: {
						material: LaminateLookup["Whiteback"]
					},
				});
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, this.page1, [Sheet]);
				finishing = this.#add(Finishing, this.page1, [Sheet], {
					propertiesToAssign: {
						standOffRequired: true
					},
				});
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Sheet]);
				break;
			case "Foam PVC":
				productDetails = this.#add(ProductDetails, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						productLocation: "",
						productName: "Foam PVC Panel",
					}, itemUpdateOnCompletion: true
				});

				size = this.#add(Size, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						width: 2440,
						height: 1220
					}, itemUpdateOnCompletion: true
				});

				sheet = this.#add(Sheet, this.page1, [Size], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						material: "Foamed PVC",
						sheetSize: "2440mm x 1220mm",
						thickness: "3"
					}, itemUpdateOnCompletion: true
				});

				vinyl = this.#add(Vinyl, this.page1, [Sheet], {
					propertiesToAssign: {
						bleedDropdown: "ACM"
					},
				});
				laminate = this.#add(Laminate, this.page1, [Vinyl]);
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, this.page1, [Sheet]);
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Sheet]);
				break;
			case "Signwhite":
				productDetails = this.#add(ProductDetails, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						productLocation: "",
						productName: "Signwhite Panel",
					}, itemUpdateOnCompletion: true
				});

				size = this.#add(Size, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						width: 2440,
						height: 1220
					}, itemUpdateOnCompletion: true
				});

				sheet = this.#add(Sheet, this.page1, [Size], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						material: "Signwhite",
						sheetSize: "2400mm x 1200mm",
						thickness: "0.55"
					}, itemUpdateOnCompletion: true
				});

				vinyl = this.#add(Vinyl, this.page1, [Sheet], {
					propertiesToAssign: {
						bleedDropdown: "ACM"
					},
				});
				laminate = this.#add(Laminate, this.page1, [Vinyl]);
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, this.page1, [Sheet]);
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Sheet]);
				break;
			case "Corflute":
				productDetails = this.#add(ProductDetails, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						productLocation: "",
						productName: "Corflute Panel",
					}, itemUpdateOnCompletion: true
				});

				size = this.#add(Size, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						width: 600,
						height: 900
					}, itemUpdateOnCompletion: true
				});

				sheet = this.#add(Sheet, this.page1, [Size], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						material: "Corflute",
						sheetSize: "600mm x 900mm",
						thickness: "5",
						sheetSize: "600x900"
					}, itemUpdateOnCompletion: true
				});

				vinyl = this.#add(Vinyl, this.page1, [Sheet], {
					propertiesToAssign: {
						bleedDropdown: "Corflutes"
					},
				});
				laminate = this.#add(Laminate, this.page1, [Vinyl]);
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, this.page1, [Sheet]);
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Sheet]);
				break;
			case "Wall Graphics":
				productDetails = this.#add(ProductDetails, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						productLocation: "",
						productName: "Vinyl Wall Graphics",
					}, itemUpdateOnCompletion: true
				});

				size = this.#add(Size, this.page1, [], {
					UPDATES_PAUSED: true,
					propertiesToAssign: {
						width: 1200,
						height: 2400
					}, itemUpdateOnCompletion: true
				});

				vinyl = this.#add(Vinyl, this.page1, [size], {
					propertiesToAssign: {
						material: VinylLookup["High Tack"],
						bleedDropdown: "Wall Graphics",
						isJoinHorizontal: false
					},
				});

				laminate = this.#add(Laminate, this.page1, [Vinyl], {
					propertiesToAssign: {
						material: LaminateLookup["Satin"]
					},
				});
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Size]);
				break;
			default:
				break;
		}
		this.#updateViewMode();
	}

	#add(classType, container, subscribeTo = [], options = {
		UPDATES_PAUSED: true,
		propertiesToAssign: {
			//material: "ACM",
			//sheetSize: "2440x1220",
			//sheetMaterial: "ACM - (sqm) - 2440x1220x3x0.21 Primer/Primer (Mulfords)",
			//typeLabel: "ACM SHEET"
		},
		itemUpdateOnCompletion: true
	}) {
		let newItem = new classType(container, this, options);
		newItem.productNumber = this.#getProductNumber();

		Object.assign(newItem, options.propertiesToAssign);

		for(let sub of subscribeTo) {
			if(typeof sub === 'function') {
				// It’s a class (subscribe to last created of that type)
				for(let i = this.#allMaterials.length - 1; i >= 0; i--) {
					if(this.#allMaterials[i].constructor.name === sub.name) {
						newItem.SubscribeTo(this.#allMaterials[i]);
						break;
					}
				}
			} else if(typeof sub === 'object' && sub !== null) {
				// It’s an object instance (subscribe directly)
				newItem.SubscribeTo(sub);
			} else {
				console.warn('Unknown subscription type:', sub);
			}
		}

		if(options.itemUpdateOnCompletion) {
			newItem.UPDATES_PAUSED = false;
			newItem.UpdateFromFields();
		}

		this.#allMaterials.push(newItem);
		this.#UpdateFromFields();

		return newItem;
	}

	#addBlank(classType, container, options = {productNumber: null}) {
		let newItem = new classType(container, this);
		if(options.productNumber != null) newItem.productNumber = options.productNumber;

		this.#allMaterials.push(newItem);

		this.#UpdateFromFields();
	}

	#getProductNumber() {
		return this.#numProducts;
	}

	DeleteMaterial(materialObject) {
		console.log("delete material from PanelSigns.js" + materialObject);
		let type = materialObject.constructor.name;

		for(let i = 0; i < this.#allMaterials.length; i++) {
			if(this.#allMaterials[i] == materialObject) {
				this.#allMaterials.splice(i, 1);
				break;
			}
		}
		this.#UpdateFromFields();
	}

	DeleteProduct(productNumber) {
		console.log("delete product from PanelSigns.js");
		let materials = this.#allMaterials;
		for(let i = 0; i < materials.length; i++) {
			if(materials[i].productNumber == productNumber) {
				materials[i].UPDATES_PAUSED = true;//since all is being deleted and no continued reference or updates
				materials[i].Delete();
				i--;
			}
		}
		this.#numProducts--;
		this.#updateViewMode();
	}

	DeleteProductsAll() {
		for(let i = 0; i < this.#numProducts + 1; i++) {
			this.DeleteProduct(i + 1);
		}
	}

	#UpdateFromFields() { }

	#toggleAllOpen() {
		for(let i = 0; i < this.#containers.length; i++) {
			this.#containers[i].Maximize();
		}
		for(let i = 0; i < this.#productContainers.length; i++) {
			this.#productContainers[i].Maximize();
		}
	}

	#toggleAllClosed() {
		for(let i = 0; i < this.#containers.length; i++) {
			this.#containers[i].Minimize();
		}
		for(let i = 0; i < this.#productContainers.length; i++) {
			this.#productContainers[i].Minimize();
		}
	}

	#updateViewMode() {
		for(let i = 0; i < this.#productContainers.length; i++) {
			deleteElement(this.#productContainers[i].container);
		}
		for(let i = 0; i < this.#containers.length; i++) {
			deleteElement(this.#containers[i].container);
		}
		if(this.#viewMode[1].value == "Per Type") {

			this.#containers = [/*ProductDetails, Size, SVGCutfile, Sheet, Vinyl, Laminate, Coil, AppTaping, HandTrimming, PrintMounting, Finishing, ProductionSubscribable, ArtworkSubscribable, InstallSubscribable */];

			for(let i = 0; i < this.#creationOrder.length; i++) {
				let UIContainer = new UIContainerType3("", this.#creationOrder[i].DISPLAY_NAME, this.page1);

				this.#containers.push(UIContainer);
				let addBtn = createButton("Add +", "width:100px;min-height:30px;margin:0px;border:0px;", () => {
					this.#addBlank(this.#creationOrder[i], this.#containers[i].contentContainer);
				}, null);
				UIContainer.addHeadingButtons(addBtn);
			}
			for(let x = 0; x < this.#containers.length; x++) {
				let sameItemCount = 0;
				for(let y = 0; y < this.#allMaterials.length; y++) {
					let item = this.#allMaterials[y];
					item.container.style.width = "calc(100% - 16px)";
					if(item instanceof this.#creationOrder[x]) {
						if(sameItemCount == 0) {

						}
						sameItemCount++;
						this.#containers[x].contentContainer.appendChild(item.container);
					}
				}
			}
		} else if(this.#viewMode[1].value == "Per Product") {
			let uniqueProductNumbers = [];
			this.#productContainers = [];

			for(let i = 0; i < this.#allMaterials.length; i++) {
				let item = this.#allMaterials[i];
				//make unique list of product numbers
				if(!uniqueProductNumbers.includes(item.productNumber)) uniqueProductNumbers.push(item.productNumber);
			}
			uniqueProductNumbers.sort((a, b) => a - b);

			for(let i = 0; i < uniqueProductNumbers.length; i++) {
				let currentProductNumber = uniqueProductNumbers[i];
				//create product container
				let newProductContainer = new UIContainerType3("max-height:450px;", "PRODUCT " + uniqueProductNumbers[i], this.page1);
				newProductContainer.contentContainer.style.cssText += "max-height:10000px;";
				newProductContainer.container.style.cssText += "max-height:10000px;";
				this.#productContainers.push(newProductContainer);

				newProductContainer.addHeadingButtons(createButton("x", "width:30px;height:30px;margin:0px;border:none;padding:2px;min-height:30px;float:right;background-color:" + COLOUR.Red + ";", () => {
					this.DeleteProduct(currentProductNumber);
				}, null));

				const dropdown = new TDropdown({
					label: 'Add Component',
					defaultValue: '',
					options:
						this.#creationOrder.map((item) => {
							return {label: item.name, value: item.name, img: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/refs/heads/main/Images/Icon-Component.svg'};
						}),
					parent: null,
					onChange: (val) => {
						if(val != "") {
							this.#addBlank(this.#creationOrder.filter((item) => item.name == val)[0], newProductContainer.contentContainer, {productNumber: uniqueProductNumbers[i]});
						}
					}
				});
				newProductContainer.addHeadingButtons(dropdown.wrapper);

				//add items to it
				for(let j = 0; j < this.#allMaterials.length; j++) {
					let item = this.#allMaterials[j];
					let itemContainer = item.container;
					item.container.style.width = "calc(100% - 16px)";

					if(item.productNumber != currentProductNumber) continue;

					newProductContainer.contentContainer.appendChild(itemContainer);
				}

				new Sortable(newProductContainer.contentContainer, {
					animation: 120,
					group: 'shared',
					swapThreshold: 1,
					ghostClass: 'sortable-ghost',
					direction: 'vertical',
					handle: ".sortableHandle"
				});
			}
		} else if(this.#viewMode[1].value == "Per Type2") {

			this.#containers = [/*ProductDetails, Size, SVGCutfile, etc...*/];

			for(let i = 0; i < this.#creationOrder.length; i++) {
				let UIContainer = new Object();
				let d = createDivStyle5("", this.#creationOrder[i].DISPLAY_NAME, this.page1);
				UIContainer.container = d[0];
				UIContainer.contentContainer = d[1];
				this.#containers.push(UIContainer);
				let addBtn = createButton("+", "width:50px;min-height:100%;margin:0px;border:0px;", () => {
					this.#addBlank(this.#creationOrder[i], this.#containers[i].contentContainer);
				}, UIContainer.contentContainer);
			}
			for(let x = 0; x < this.#containers.length; x++) {
				let sameItemCount = 0;
				for(let y = 0; y < this.#allMaterials.length; y++) {
					let item = this.#allMaterials[y];
					item.container.style.width = "calc(100% - 70px)";
					if(item instanceof this.#creationOrder[x]) {
						if(sameItemCount == 0) {

						}
						sameItemCount++;
						this.#containers[x].contentContainer.appendChild(item.container);
					}
				}
			}
		} else {
			alert("Not supported");
		}
	}

	async CreateProduct(parent) {
		parent.minimize();

		let pNo = 0;
		let productNo = 0;
		let partIndex = 0;
		let productDescription = "";

		let uniqueProductNumbers = [];
		for(let i = 0; i < this.#allMaterials.length; i++) {
			let item = this.#allMaterials[i];
			//make unique list of product numbers
			if(!uniqueProductNumbers.includes(item.productNumber)) uniqueProductNumbers.push(item.productNumber);
		}
		uniqueProductNumbers.sort((a, b) => a - b);

		for(let i = 0; i < uniqueProductNumbers.length; i++) {
			let currentProductNumber = uniqueProductNumbers[i];

			await AddBlankProduct();
			productNo = getNumProducts();
			partIndex = 0;

			for(let j = 0; j < this.#allMaterials.length; j++) {
				let item = this.#allMaterials[j];
				if(item.productNumber != currentProductNumber) continue;

				partIndex = await item.Create(productNo, partIndex);
				if(item.Description() != "") productDescription += item.Description() + "<br>";
			}

			await setProductSummary(productNo, productDescription);
			productDescription = "";
		}

		Toast.notify("done", 3000, {position: "top-right"});
	}

	hide() {
		super.hide();

		if(this.#numProducts > 0) {
			this.DeleteProductsAll();
		}
	}
}
