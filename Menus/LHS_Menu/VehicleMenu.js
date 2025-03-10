
var vehicleContainer;
var xOffset_Vehicle = 0;
var yOffset_Vehicle = 0;
var scrollMin = 0.005;
var canvas_Vehicle_BG;
var canvas_Vehicle;
var canvasArray = [];
var canvasCtxLayers = [];
/**
 * @Example
 * {
 * appTape: "Tape - Application Low Tack (TransferRite APP656093)",
* colour: "red"
* description: null
* h: 600
* laminate: "Laminate - Polymeric Gloss (Oraguard 215G)"
* vinyl: "Vinyl - Polymeric Blockout Air-Release (Orafol 3651GRA)"
* w: 600
* x: 6245
* y: 3840
* qty:1
} 
 */
var rects = [];
var lastX = 0, lastY = 0;
var mouseDownX = 0, mouseDownY = 0;
var mouseOffsetFromShapeX = 0;
var mouseOffsetFromShapeY = 0;
var canvasWidth_Vehicle;
var canvasHeight_Vehicle;
var canvasScale_Vehicle = 0.1;
var ctx_Vehicle;
var canvasContainer;
var lockMovement = false;
var isHoveringOnRect = false;
var images = [];
var skewInterval;
var skewableRects = [];
var triangles = [];
var selectRadius = 10;
var fps = 30;
var mousePos;
var dirtyTriangles = true;
var holding = {
	isGrabbingShape: false,
	shapeIndex: null,
	cornerIndex: null,
	hoveringOverShape: false,
	hoveringOverCorner: false
};
var p = Point.prototype;
var VehicleMenu_Template;
var VehicleMenu_MenuContainer;
let VehicleMenu_Production;
let VehicleMenu_TotalQuantity;
let VehicleMenu_Install;
let VehicleMenu_Artwork;

var img;
var tem;

var handlesSize = 8;
var dragging = false;
var speed = 0.15;

var showMeasures = false;
var showQuantity = true;
var showDescription = true;

var currentHandle = [
	false,//current handle i.e. 'topleft'
	null//rectID # i.e. 1
];

class VehicleMenu extends LHSMenuWindow {

	#canvasHeight = 600;
	#canvasWidth = 1000;

	constructor(width, height, ID, windowTitle) {
		super(width, height, ID, windowTitle);
		this.addPages(2);
		this.doesTick = false;
	}

	show() {
		super.show();
		super.clearPages();
		super.clearFooter();

		this.createContent();
	}

	createContent() {
		var page = this.getPage(0);
		var footer = this.footer;
		let thisClass = this;

		canvasContainer = document.createElement("div");
		canvasContainer.style = "width:100%;height:650px;display:block;background-color:white;position: relative;";

		let createCanvasContainer = () => {
			canvas_Vehicle = document.createElement('canvas');
			canvas_Vehicle_BG = document.createElement('canvas');

			canvasArray.push(canvas_Vehicle_BG);
			canvasArray.push(canvas_Vehicle);

			for(var l = 0; l < canvasArray.length; l++) {
				canvasArray[l].style = "z-index:1000; border: 2px solid black;display:block;position: absolute;top: 0px;";
				canvasArray[l].width = this.#canvasWidth;//$(page).width() * 0.9;
				canvasArray[l].height = this.#canvasHeight; //$(page).height() * 1.5;
				canvasWidth_Vehicle = canvasArray[l].width;
				canvasHeight_Vehicle = canvasArray[l].height;
				canvasContainer.appendChild(canvasArray[l]);

				canvasCtxLayers.push(canvasArray[l].getContext("2d"));
				canvasCtxLayers[l].clearRect(0, 0, canvasWidth_Vehicle, canvasHeight_Vehicle);
				canvasCtxLayers[l].setTransform(1, 0, 0, 1, 0, 0);
				canvasCtxLayers[l].scale(canvasScale_Vehicle, canvasScale_Vehicle);
				canvasCtxLayers[l].lineWidth = 3;
				canvasCtxLayers[l].restore();
			}

			//todo
			$(window).resize((e) => {
				for(var l = 0; l < canvasArray.length; l++) {
					canvasArray[l].width = this.#canvasWidth;//$(page).width() * 0.9;
					canvasArray[l].height = this.#canvasHeight; //$(page).height() * 1.5;
					canvasWidth_Vehicle = canvasArray[l].width;
					canvasHeight_Vehicle = canvasArray[l].height;
					canvasCtxLayers[l].clearRect(0, 0, canvasWidth_Vehicle, canvasHeight_Vehicle);
					canvasCtxLayers[l].restore();
				}

				update();
			});

			var speed = 0.15;

			canvasContainer.onwheel = function(event) {
				event.preventDefault();
				var boundingRect = canvas_Vehicle.getBoundingClientRect();

				var pos = {
					x: (event.clientX - boundingRect.left - xOffset_Vehicle) / canvasScale_Vehicle,
					y: (event.clientY - boundingRect.top - yOffset_Vehicle) / canvasScale_Vehicle
				};

				canvasScale_Vehicle = canvasScale_Vehicle * Math.exp(-Math.sign(event.deltaY) * speed);
				if(canvasScale_Vehicle < scrollMin) canvasScale_Vehicle = scrollMin;

				xOffset_Vehicle = (event.clientX - boundingRect.left - canvasScale_Vehicle * pos.x);
				yOffset_Vehicle = (event.clientY - boundingRect.top - canvasScale_Vehicle * pos.y);

				refreshBackground();
				needsToUpdate = true;
			};
		};

		//******************************************************************************//
		//                                 MENU CONTAINER                               //
		//******************************************************************************//
		VehicleMenu_MenuContainer = document.createElement('div');
		VehicleMenu_MenuContainer.style = "display:block; width:60px;background-color:" + COLOUR.Blue + ";height:80%;position:absolute;top:0px;right:0px;";
		VehicleMenu_MenuContainer.onwheel = function(event) {
			event.preventDefault();
		};
		canvasContainer.appendChild(VehicleMenu_MenuContainer);

		addItem(ICON.add, "Vinyl", null, null, function() {
			var item = {
				x: getCenterPosReal(canvasArray[0]).x - 300,
				y: getCenterPosReal(canvasArray[0]).y - 300,
				w: 600,
				h: 600,
				qty: 1,
				vinyl: VinylLookup["Air Release"],
				laminate: LaminateLookup["Gloss"],
				appTape: AppTapeLookup["Medium Tack"],
				description: "Vinyl",
				colour: "#FF5A5A"
			};
			console.log(item);
			rects.push(item);
			VehicleMenu_Template.addRow(item);
			refreshBackground();
			needsToUpdate = true;
		});
		addItem(ICON.add, "Oneway", null, null, function() {
			var item = {
				x: getCenterPosReal(canvasArray[0]).x - 300,
				y: getCenterPosReal(canvasArray[0]).y - 300,
				w: 600,
				h: 600,
				qty: 1,
				vinyl: VinylLookup["Oneway Vehicle"],
				laminate: LaminateLookup["3m Gloss (Standard)"],
				appTape: "None",
				description: "Oneway",
				colour: "#5EEF7D"
			};
			rects.push(item);
			VehicleMenu_Template.addRow(item);
			refreshBackground();
			needsToUpdate = true;
		});
		addItem(ICON.add, "Panel", null, null, function() {
			var item = {
				x: getCenterPosReal(canvasArray[0]).x - 300,
				y: getCenterPosReal(canvasArray[0]).y - 300,
				w: 600,
				h: 600,
				qty: 1,
				isPanel: true,
				vinyl: VinylLookup["Air Release"],
				laminate: LaminateLookup["Gloss"],
				appTape: "None",
				description: "Panel",
				colour: "#FF5CFF"
			};
			rects.push(item);
			VehicleMenu_Template.addRow(item);
			refreshBackground();
			needsToUpdate = true;
		});
		addItem(ICON.add, "Tray Back", null, null, function() {
			var item = {
				x: getCenterPosReal(canvasArray[0]).x - 300,
				y: getCenterPosReal(canvasArray[0]).y - 300,
				w: 1800,
				h: 300,
				qty: 1,
				isPanel: true,
				vinyl: VinylLookup["Air Release"],
				laminate: LaminateLookup["Gloss"],
				appTape: "None",
				description: "Tray Back Panel",
				colour: "#FF5CFF"
			};
			rects.push(item);
			VehicleMenu_Template.addRow(item);
			refreshBackground();
			needsToUpdate = true;
		});
		addItem(ICON.add, "Tray Sides", null, null, function() {
			var item = {
				x: getCenterPosReal(canvasArray[0]).x - 300,
				y: getCenterPosReal(canvasArray[0]).y - 300,
				w: 2500,
				h: 300,
				qty: 2,
				isPanel: true,
				vinyl: VinylLookup["Air Release"],
				laminate: LaminateLookup["Gloss"],
				appTape: "None",
				description: "Tray Sides Panel",
				colour: "#FF5CFF"
			};
			rects.push(item);
			VehicleMenu_Template.addRow(item);
			refreshBackground();
			needsToUpdate = true;
		});

		var imageSrcs = [];
		addFileItem(ICON.add, "Images", null, function() {
			callback_SkewableImages();
			async function callback_SkewableImages() {
				await addSkewableImages(null, null, imageSrcs);
				refreshBackground();
			}
		});

		addItem(ICON.convert, "SVG Convert", null, null, function() {
			window.open("https://cloudconvert.com/eps-to-svg", "_blank");
		});


		addItem(ICON.add, "Copy Template", null, null, function() {
			console.log(rects);
			Ordui.Alert("Template Copied to Clipboard");

			saveToClipboard(JSON.stringify(rects));
		});

		function addItem(imageSrc, text, overrideCss, overrideImageCss, callback) {
			var itemContainer = document.createElement('div');
			itemContainer.style = "display:block;float:left;width:100%;height:70px;margin:0px;cursor:pointer;background-color:" + COLOUR.Blue + ";padding:0px;border-bottom:1px solid #00b;";
			itemContainer.style.cssText += overrideCss;
			itemContainer.onmouseover = function() {
				itemContainer.style.backgroundColor = "#333";
			};
			itemContainer.onmouseout = function() {
				itemContainer.style.backgroundColor = COLOUR.Blue;
			};
			itemContainer.onclick = function() {
				if(callback) callback();
				deselectSelectorBars(true);
				selectorBar.style.backgroundColor = "red";
			};

			var selectorBar = document.createElement('div');
			selectorBar.style = "display:block;float:left;width:5px;height:100%;";
			selectorBar.id = "selectorBar2";
			itemContainer.appendChild(selectorBar);

			var image = document.createElement('img');
			image.src = imageSrc;
			image.style = "display:block;float:left;width:35px;height:25px;padding:7.5px 10px;filter:invert(100%);background-size:cover;";
			image.style.cssText += overrideCss;
			itemContainer.appendChild(image);

			var itemText = document.createElement('p');
			itemText.innerText = text;
			itemText.style = "display:block;float:left;width:90%;height:15px;margin:0px;padding:0px;color:white;font-weight:bold;font-size:12px;text-align: center;";
			itemContainer.appendChild(itemText);

			VehicleMenu_MenuContainer.appendChild(itemContainer);
		}

		function addFileItem(imageSrc, text, overrideCss, callback) {
			var itemContainer = document.createElement('div');
			itemContainer.style = "display:block;float:left;width:100%;height:70px;margin:0px;cursor:pointer;background-color:" + COLOUR.Blue + ";padding:0px;border-bottom:1px solid #00b;position:relative;";
			itemContainer.style.cssText += overrideCss;
			itemContainer.onmouseover = function() {
				itemContainer.style.backgroundColor = "#333";
			};
			itemContainer.onmouseout = function() {
				itemContainer.style.backgroundColor = COLOUR.Blue;
			};
			itemContainer.onclick = function(e) {
				e.stopPropagation();
				deselectSelectorBars(true);
				selectorBar.style.backgroundColor = "red";
				$(itemChooseBtn)[0].click();
			};


			var selectorBar = document.createElement('div');
			selectorBar.style = "display:block;float:left;width:5px;height:100%;";
			selectorBar.id = "selectorBar2";
			itemContainer.appendChild(selectorBar);

			var image = document.createElement('img');
			image.src = imageSrc;
			image.style = "display:block;float:left;width:35px;height:25px;padding:7.5px 10px;filter:invert(100%);background-size:cover;";
			itemContainer.appendChild(image);

			var itemText = document.createElement('div');
			itemText.innerText = text;
			itemText.style = "display:block;float:left;width:90%;height:15px;padding:0px;color:white;font-weight:bold;font-size:12px;text-align: center;";
			itemContainer.appendChild(itemText);

			var itemChooseBtn = document.createElement('input');
			itemChooseBtn.style = "z-index:1000";
			itemChooseBtn.type = "file";
			itemChooseBtn.id = "itemChooseBtn";
			itemChooseBtn.multiple = true;
			itemChooseBtn.style = "display:none";
			itemChooseBtn.accept = "image/jpeg, image/png, image/jpg, image/svg+xml";
			itemContainer.appendChild(itemChooseBtn);

			var itemChooseLabel = document.createElement('label');
			itemChooseLabel.htmlFor = "itemChooseBtn";
			itemChooseLabel.innerText = "Choose";
			itemChooseLabel.style = "display:none;background-color: indigo;color: white;padding: 0.5rem;font - family: sans - serif;border - radius: 0.3rem;cursor: pointer;position:absolute;top:0px;left:0px";
			itemContainer.appendChild(itemChooseLabel);

			itemContainer.addEventListener("change", (e) => { //CHANGE EVENT FOR UPLOADING PHOTOS
				imageSrcs = [];
				if(window.File && window.FileReader && window.FileList && window.Blob) { //CHECK IF FILE API IS SUPPORTED
					const files = e.target.files; //FILE LIST OBJECT CONTAINING UPLOADED FILES
					for(let i = 0; i < files.length; i++) { // LOOP THROUGH THE FILE LIST OBJECT
						if(!files[i].type.match("image")) {
							alert("Not supported format");
							continue;
						}// ONLY PHOTOS (SKIP CURRENT ITERATION IF NOT A PHOTO)
						const picReader = new FileReader(); // RETRIEVE DATA URI 
						picReader.addEventListener("load", function(event) { // LOAD EVENT FOR DISPLAYING PHOTOS
							const picFile = event.target;
							imageSrcs.push("" + picFile.result);
							//if last itteration (has loaded images)
							if(i == files.length - 1) {
								if(callback) callback();
							}
						});
						picReader.readAsDataURL(files[i]); //READ THE IMAGE
					}
				} else {
					alert("Your browser does not support File API");
				}
			});

			VehicleMenu_MenuContainer.appendChild(itemContainer);
		}

		async function createVehicleProduct() {
			thisClass.minimize();
			await AddBlankProduct();
			var productNo = getNumProducts();
			await setProductName(productNo, "Vehicle Graphics");
			var partNo = await VehicleMenu_Template.Create(productNo, 0);
			partNo = await VehicleMenu_Production.Create(productNo, partNo);
			partNo = await VehicleMenu_Install.Create(productNo, partNo);
			partNo = await VehicleMenu_Artwork.Create(productNo, partNo);
			var pSummary = VehicleMenu_Template.Description() +
				VehicleMenu_Production.Description() +
				VehicleMenu_Artwork.Description() +
				VehicleMenu_Install.Description();

			await setProductSummary(productNo, pSummary);
			Ordui.Alert("Done.");
		}

		let measuresCkb = createCheckbox_Infield("Show Measurements", showMeasures, "width: 200px;", () => {showMeasures = measuresCkb[1].checked; update(null);}, footer);
		let qtyCkb = createCheckbox_Infield("Show Quantity", showQuantity, "width: 200px;", () => {showQuantity = qtyCkb[1].checked; update(null);}, footer);
		let descriptionCkb = createCheckbox_Infield("Show Description", showDescription, "width: 200px;", () => {showDescription = descriptionCkb[1].checked; update(null);}, footer);

		createCanvasContainer();
		VehicleMenu_TotalQuantity = new TotalQuantity(this.getPage(1), canvasCtxLayers[1], update);
		VehicleMenu_Template = new VehicleTemplate(this.getPage(1), canvasCtxLayers[1], function() {initRects(); update(); initBackground(); refreshBackground();}, () => {updateRectsFromFields(); console.log("should call this");}, function(rowNumber) {deleteRow(rowNumber);});
		VehicleMenu_Production = new Production(this.getPage(1), canvasCtxLayers[1], () => { });
		VehicleMenu_Production.requiredName = "Production";
		VehicleMenu_Install = new Install(this.getPage(1), canvasCtxLayers[1], () => { });
		VehicleMenu_Artwork = new Artwork(this.getPage(1), canvasCtxLayers[1], () => { });

		page.appendChild(canvasContainer);

		var fieldCreateProduct = createButton('Create Product', 'width:300px;height:35px;margin:0px;display:block;float:right', createVehicleProduct);
		footer.appendChild(fieldCreateProduct);

		//--------------INITIAL UPDATE---------------//
		initVehicleCanvas();
		update(null);
	}

	hide() {
		rects = [];
		canvasArray = [];
		canvasCtxLayers = [];
		images = [];
		skewableRects = [];
		canvasScale_Vehicle = 0.1;
		xOffset_Vehicle = 0;
		yOffset_Vehicle = 0;

		super.hide();
	}

	tick() {
		this.tickUpdate();
	}

	tickUpdate() {

	}
}

function initVehicleCanvas() {
	console.log("in initVehicleCanvas");
	canvasContainer.style.cursor = "grab";

	canvas_Vehicle.addEventListener('mousedown', mouseDown, false);
	canvas_Vehicle.addEventListener('mouseup', mouseUp, false);
	canvas_Vehicle.addEventListener('mousemove', mouseMove, false);

	initBackground();
	initRects();
}

function initRects() {
	console.log("in initRects, should only happen once");
	if(!VehicleMenu_Template.isStandardTemplate) {
		rects = [];
		VehicleMenu_Template.clearRows();
	} else {
		rects = VehicleMenu_Template.selectedTemplateData.template_rects;
		VehicleMenu_Template.clearRows();
		for(var n = 0; n < rects.length; n++) {

			let newItem = {
				"x": 6152.058116005365,
				"y": 3630.7737281592413,
				"w": roundNumber(parseFloat(rects[n].w), 2),
				"h": roundNumber(parseFloat(rects[n].h), 2),
				"qty": parseFloat(rects[n].qty),
				"isPanel": rects[n].isPanel,
				"vinyl": rects[n].vinyl,
				"laminate": rects[n].laminate,
				"appTape": rects[n].appTape,
				"description": rects[n].description,
				"colour": rects[n].colour
			};
			VehicleMenu_Template.addRow(newItem);
		}

		VehicleMenu_Production.required = true;
		VehicleMenu_Production.productionTime = VehicleMenu_Template.selectedTemplateData.production_time;
		VehicleMenu_Production.productionTotalEach = VehicleMenu_Template.selectedTemplateData.production_TE;

		VehicleMenu_Install.installRequired = true;
		VehicleMenu_Install.installMinutes = VehicleMenu_Template.selectedTemplateData.install_time;
		VehicleMenu_Install.installRate = VehicleMenu_Template.selectedTemplateData.install_rate;
		VehicleMenu_Install.installTotalEach = VehicleMenu_Template.selectedTemplateData.install_TE;
	}
}

function getHandle(mouse, shapeIndex) {
	if(dist(mouse, point(rects[shapeIndex].x, rects[shapeIndex].y)) <= handlesSize) return 'topleft';
	if(dist(mouse, point(rects[shapeIndex].x + rects[shapeIndex].w, rects[shapeIndex].y)) <= handlesSize) return 'topright';
	if(dist(mouse, point(rects[shapeIndex].x, rects[shapeIndex].y + rects[shapeIndex].h)) <= handlesSize) return 'bottomleft';
	if(dist(mouse, point(rects[shapeIndex].x + rects[shapeIndex].w, rects[shapeIndex].y + rects[shapeIndex].h)) <= handlesSize) return 'bottomright';
	if(dist(mouse, point(rects[shapeIndex].x + rects[shapeIndex].w / 2, rects[shapeIndex].y)) <= handlesSize) return 'top';
	if(dist(mouse, point(rects[shapeIndex].x, rects[shapeIndex].y + rects[shapeIndex].h / 2)) <= handlesSize) return 'left';
	if(dist(mouse, point(rects[shapeIndex].x + rects[shapeIndex].w / 2, rects[shapeIndex].y + rects[shapeIndex].h)) <= handlesSize) return 'bottom';
	if(dist(mouse, point(rects[shapeIndex].x + rects[shapeIndex].w, rects[shapeIndex].y + rects[shapeIndex].h / 2)) <= handlesSize) return 'right';
	var shapeX = point(rects[shapeIndex].x, rects[shapeIndex].y).x;
	var shapeY = point(rects[shapeIndex].x, rects[shapeIndex].y).y;
	var shapeW = point(rects[shapeIndex].w, rects[shapeIndex].h).x;
	var shapeH = point(rects[shapeIndex].w, rects[shapeIndex].h).y;
	if(mouse.x >= shapeX &&
		mouse.x <= (shapeX + shapeW) &&
		mouse.y >= shapeY &&
		mouse.y <= (shapeY + shapeH)) {
		return 'grabbable';
	};
	return false;
}

function mouseDown(e) {
	e.preventDefault();
	console.log('mouseDown');
	var leftPressed = e.button == 0,
		scrossPressed = e.button == 1,
		rightPressed = e.button == 2;

	if(leftPressed) {
		dragging = true;

		mouseDownX = getMousePos(canvas_Vehicle, e).x;
		mouseDownY = getMousePos(canvas_Vehicle, e).y;

		lastX = e.clientX;
		lastY = e.clientY;
	}

	canvasContainer.style.cursor = "grabbing";
}


function mouseMove(e) {
	e.preventDefault();

	canvasContainer.style.cursor = "grab";

	if(dragging) {
		var deltaX = e.clientX - lastX;
		var deltaY = e.clientY - lastY;
		lastX = e.clientX;
		lastY = e.clientY;

		if(!lockMovement) {
			xOffset_Vehicle += deltaX;
			yOffset_Vehicle += deltaY;
		}

		canvasContainer.style.cursor = "grabbing";
	}

	update(e);
}

function mouseUp(e) {
	dragging = false;

	canvasContainer.style.cursor = "grab";
	currentHandle = [false, null];
	mouseOffsetFromShapeX = 0;
	mouseOffsetFromShapeY = 0;
	var pos = getMousePos(canvasArray[1], e);
	var leftPressed = e.button == 0,
		scrossPressed = e.button == 1,
		rightPressed = e.button == 2;

	closeCustomContextMenu();

	if(rightPressed) {
		console.log("in rightPressed");

		if(isHoveringOnRect) {
			showCustomContextMenu(canvasArray[1],
				newContextItem("Delete", deleteRect, pos.x, pos.y),
				newContextItem("Set Qty", setQtyRect, pos.x, pos.y),
				newContextItem("Set Size", setSizeRect, pos.x, pos.y),
				newContextItem("Set Description", setDescriptionRect, pos.x, pos.y),
				newContextItem("Set is RTA", setIsRTARect, pos.x, pos.y),
				newContextSubdivision(),
				newContextItem("Reverse Engineer Scale", getScaleRect, pos.x, pos.y),
			);
		}
	}
}

function drawRects(e) {

	canvasCtxLayers[1].clearRect(0, 0, canvasWidth_Vehicle, canvasHeight_Vehicle);
	canvasCtxLayers[1].fillStyle = "white";
	lockMovement = false;

	isHoveringOnRect = false;

	var x, y;

	if(e) {
		mousePos = getMousePos(canvas_Vehicle, e);
		x = mousePos.x;
		y = mousePos.y;

	} else {
		x = 0;
		y = 0;
	}

	for(var r = 0; r < rects.length; r++) {
		//Draw Rectangle
		canvasCtxLayers[1].fillStyle = rects[r].colour;
		canvasCtxLayers[1].globalAlpha = 0.65;
		canvasCtxLayers[1].shadowColor = "black";
		canvasCtxLayers[1].shadowBlur = 20;
		canvasCtxLayers[1].fillRect(xOffset_Vehicle + rects[r].x * canvasScale_Vehicle, yOffset_Vehicle + rects[r].y * canvasScale_Vehicle, rects[r].w * canvasScale_Vehicle, rects[r].h * canvasScale_Vehicle);
		canvasCtxLayers[1].shadowColor = "black";
		canvasCtxLayers[1].shadowBlur = 0;
		canvasCtxLayers[1].globalAlpha = 1;

		//if mouse move
		if(!dragging) {
			//if hover on blue for this shape
			if(getHandle(point(x, y), r)) {
				lockMovement = true;
				currentHandle = [getHandle(point(x, y), r), r];
			}
			//if not on blue for this shape
			else {
				if(r == currentHandle[1]) currentHandle[0] = false;
			}
		}

		//if holding shape
		if(dragging && currentHandle[0] && currentHandle[1] == r) {
			//mouse offset from shape
			if(mouseOffsetFromShapeX == 0 && mouseOffsetFromShapeY == 0) {
				mouseOffsetFromShapeX = (rects[r].x + rects[r].w / 2 - mouseDownX);
				mouseOffsetFromShapeY = (rects[r].y + rects[r].h / 2 - mouseDownY);
			}

			lockMovement = true;
			//holding.isGrabbingShape = true;
			mousePos = point((x) / canvasScale_Vehicle, (y) / canvasScale_Vehicle);


			//rect offsets
			switch(currentHandle[0]) {
				case 'topleft':
					rects[r].w += rects[r].x - mousePos.x;
					rects[r].h += rects[r].y - mousePos.y;
					rects[r].x = mousePos.x;
					rects[r].y = mousePos.y;
					break;
				case 'topright':
					rects[r].w = mousePos.x - rects[r].x;
					rects[r].h += rects[r].y - mousePos.y;
					rects[r].y = mousePos.y;
					break;
				case 'bottomleft':
					rects[r].w += rects[r].x - mousePos.x;
					rects[r].x = mousePos.x;
					rects[r].h = mousePos.y - rects[r].y;
					break;
				case 'bottomright':
					rects[r].w = mousePos.x - rects[r].x;
					rects[r].h = mousePos.y - rects[r].y;
					break;
				case 'top':
					rects[r].h += rects[r].y - mousePos.y;
					rects[r].y = mousePos.y;
					break;
				case 'left':
					rects[r].w += rects[r].x - mousePos.x;
					rects[r].x = mousePos.x;
					break;
				case 'bottom':
					rects[r].h = mousePos.y - rects[r].y;
					break;
				case 'right':
					rects[r].w = mousePos.x - rects[r].x;
					break;
				case 'grabbable':
					mousePos.x += mouseOffsetFromShapeX;
					mousePos.y += mouseOffsetFromShapeY;
					rects[r].x = (mousePos.x - rects[r].w / 2);
					rects[r].y = (mousePos.y - rects[r].h / 2);
					break;
			}
		}

		//Draw Handle
		var handle = getHandle(point(x, y), r);
		if(handle) {
			isHoveringOnRect = true;
			var posHandle = point(0, 0);
			switch(currentHandle[0]) {
				case 'topleft':
					if(!dragging) canvasContainer.style.cursor = "nwse-resize";
					posHandle.x = rects[r].x;
					posHandle.y = rects[r].y;
					break;
				case 'topright':
					if(!dragging) canvasContainer.style.cursor = "nesw-resize";
					posHandle.x = rects[r].x + rects[r].w;
					posHandle.y = rects[r].y;
					break;
				case 'bottomleft':
					if(!dragging) canvasContainer.style.cursor = "nesw-resize";
					posHandle.x = rects[r].x;
					posHandle.y = rects[r].y + rects[r].h;
					break;
				case 'bottomright':
					if(!dragging) canvasContainer.style.cursor = "nwse-resize";
					posHandle.x = rects[r].x + rects[r].w;
					posHandle.y = rects[r].y + rects[r].h;
					break;
				case 'top':
					if(!dragging) canvasContainer.style.cursor = "ns-resize";
					posHandle.x = rects[r].x + (rects[r].w) / 2;
					posHandle.y = rects[r].y;
					break;
				case 'left':
					if(!dragging) canvasContainer.style.cursor = "ew-resize";
					posHandle.x = rects[r].x;
					posHandle.y = rects[r].y + (rects[r].h) / 2;
					break;
				case 'bottom':
					if(!dragging) canvasContainer.style.cursor = "ns-resize";
					posHandle.x = rects[r].x + (rects[r].w) / 2;
					posHandle.y = rects[r].y + rects[r].h;
					break;
				case 'right':
					if(!dragging) canvasContainer.style.cursor = "ew-resize";
					posHandle.x = rects[r].x + rects[r].w;
					posHandle.y = rects[r].y + (rects[r].h) / 2;
					break;
				case 'grabbable':
					if(!dragging) canvasContainer.style.cursor = "grab";
					posHandle.x = rects[r].x + rects[r].w / 2;
					posHandle.y = rects[r].y + rects[r].h / 2;
					break;
			}

			//Draw Handle
			canvasCtxLayers[1].beginPath();
			canvasCtxLayers[1].fillStyle = COLOUR.Blue;
			canvasCtxLayers[1].arc(posHandle.x * canvasScale_Vehicle + xOffset_Vehicle, posHandle.y * canvasScale_Vehicle + yOffset_Vehicle, handlesSize, 0, 2 * Math.PI);
			canvasCtxLayers[1].fill();
			canvasCtxLayers[1].globalCompositeOperation = 'source-over';

			//Draw Rect
			drawRect(canvasCtxLayers[1], xOffset_Vehicle + rects[r].x * canvasScale_Vehicle, yOffset_Vehicle + rects[r].y * canvasScale_Vehicle, rects[r].w * canvasScale_Vehicle, rects[r].h * canvasScale_Vehicle, "TL", "blue", 1);

		}

		//Draw Description
		if(showDescription) {
			let xo = (rects[r].x + rects[r].w / 2) * canvasScale_Vehicle + xOffset_Vehicle;
			let yo = (rects[r].y + rects[r].h / 2) * canvasScale_Vehicle + yOffset_Vehicle;

			drawText(canvasCtxLayers[1], xo, yo, 14, "M", rects[r].description == null ? "" : rects[r].description, COLOUR.Black);
		}

		//Draw Qty
		if(showQuantity) {
			let xo = (rects[r].x + rects[r].w / 2) * canvasScale_Vehicle + xOffset_Vehicle;
			let yo = (rects[r].y) * canvasScale_Vehicle + yOffset_Vehicle;

			drawText(canvasCtxLayers[1], xo, yo, 14, "T", "x" + rects[r].qty, COLOUR.Black);
		}

		//Draw Measures
		if(showMeasures) {
			let xo1 = (rects[r].x) * canvasScale_Vehicle + xOffset_Vehicle;
			let yo1 = (rects[r].y) * canvasScale_Vehicle + yOffset_Vehicle;

			let w = (rects[r].w) * canvasScale_Vehicle;
			let h = (rects[r].h) * canvasScale_Vehicle;

			drawMeasurement_Verbose(canvasCtxLayers[1], xo1, yo1, w, 0, "T", roundNumber(rects[r].w, 1), 14, COLOUR.Blue, 0.5, 0.2, 15, true, "B");
			drawMeasurement_Verbose(canvasCtxLayers[1], xo1, yo1, 0, h, "L", roundNumber(rects[r].h, 1), 14, COLOUR.Blue, 0.5, 0.2, 15, false, "R");
		}
	}
}

async function initBackground() {
	console.log("in initBackground " + VehicleMenu_Template.isStandardTemplate);
	closeSkewableCanvas();
	if(VehicleMenu_Template.isStandardTemplate) {
		console.log("template.isStandardTemplate");
		img = new Image();
		tem = VehicleMenu_Template.templateData;
		img.src = tem[1];
		img.onload = function() {
			canvasCtxLayers[0].clearRect(0, 0, canvasWidth_Vehicle, canvasHeight_Vehicle);
			canvasCtxLayers[0].drawImage(img, xOffset_Vehicle, yOffset_Vehicle, tem[2] * canvasScale_Vehicle, tem[3] * canvasScale_Vehicle);
			canvasCtxLayers[0].fillStyle = COLOUR.Blue;
		};

	} else {
		if(VehicleMenu_Template.customTemplateChosen == "Custom Image") {
			await createSkewableCanvas();
		}
	}
}

function updateBackground() {
	if(VehicleMenu_Template.isStandardTemplate) {
		canvasCtxLayers[0].clearRect(0, 0, canvasWidth_Vehicle, canvasHeight_Vehicle);
		canvasCtxLayers[0].drawImage(img, xOffset_Vehicle, yOffset_Vehicle, tem[2] * canvasScale_Vehicle, tem[3] * canvasScale_Vehicle);
	}
}

function refreshBackground() {
	for(var l = 0; l < canvasCtxLayers.length; l++) {
		canvasCtxLayers[l].clearRect(0, 0, canvasWidth_Vehicle, canvasHeight_Vehicle);
	}
	updateBackground();
	update();
}

function update(e) {
	console.log("in update(e) vehicleMenu.js");
	for(var l = 0; l < canvasCtxLayers.length; l++) {
		canvasCtxLayers[l].scale(canvasScale_Vehicle, canvasScale_Vehicle);
		canvasCtxLayers[l].setTransform(1, 0, 0, 1, 0, 0);
		canvasCtxLayers[l].restore();
	}

	drawRects(e);
	for(var n = 0; n < rects.length; n++) {
		if(!VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n]) {
			console.trace("here quest");
			continue;
		}
		VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n].querySelector("#description").value = rects[n].description;
		VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n].querySelector("#quantity").value = parseFloat(rects[n].qty);
		VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n].querySelector("#width").value = roundNumber(parseFloat(rects[n].w), 2);
		VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n].querySelector("#height").value = roundNumber(parseFloat(rects[n].h), 2);
		VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n].querySelector("#tape").value = rects[n].appTape;
		VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n].querySelector("#vinyl").value = rects[n].vinyl;
		VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n].querySelector("#laminate").value = rects[n].laminate;
	}

	console.log(rects);

	updateBackground();
}

function updateRectsFromFields() {
	for(var n = 0; n < rects.length; n++) {
		if(!VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n]) continue;
		rects[n].description = VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n].querySelector("#description").value;
		rects[n].w = roundNumber(parseFloat(VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n].querySelector("#width").value), 2);
		rects[n].h = roundNumber(parseFloat(VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n].querySelector("#height").value), 2);
		rects[n].qty = parseFloat(VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n].querySelector("#quantity").value);
		rects[n].appTape = VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n].querySelector("#tape").value;
		rects[n].vinyl = VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n].querySelector("#vinyl").value;
		rects[n].laminate = VehicleMenu_Template.contentContainer.querySelectorAll("#rowContainer")[n].querySelector("#laminate").value;
	}

	console.log(rects);

	update(null);
}

function deleteRow(rowNumber) {
	rects.splice(rowNumber, 1);
	update(null);
}

async function createSkewableCanvas() {
	skewInterval = setInterval(updateSkewCanvas, 1000 / fps);

	let withinCorner = false;
	let mouseDownPosition;
	let shapeVertsWhenMouseDown = [];

	$(canvasContainer).mousedown(function(e) {
		var leftPressed = e.button == 0,
			scrossPressed = e.button == 1,
			rightPressed = e.button == 2;

		mousePos = getMousePos(canvas_Vehicle, e);
		mouseDownPosition = mousePos;
		canvasContainer.style.cursor = "grabbing";
		console.log("in mouseDown ");
		closeCustomContextMenu();

		if(isHoveringOnRect) return;

		if(rightPressed) {

		}

		if(leftPressed) {
			holding.isGrabbingShape = false;
			shapeVertsWhenMouseDown = [];
			if(withinCorner || holding.hoveringOverShape) {
				holding.isGrabbingShape = true;
				dirtyTriangles = true;
				needsToUpdate = true;
				lockMovement = true;

				shapeVertsWhenMouseDown = arrayAsValuesNotReference(skewableRects[holding.shapeIndex]);
			}
		}
	});
	$(canvasContainer).mousemove(function(e) {
		if(isHoveringOnRect && !holding.isGrabbingShape) return;
		mousePos = getMousePos(canvas_Vehicle, e);

		if(!holding.isGrabbingShape) {
			topLoop:
			for(var s = skewableRects.length - 1; s >= 0; s--) {
				var numCorners = skewableRects[s].length - 1;
				var shapeVertsX = [], shapeVertsY = [];
				for(var c = 0; c < numCorners; c++) {
					var lastcorner = c == numCorners - 1;
					withinCorner = dist({x: mousePos.x, y: mousePos.y}, {x: skewableRects[s][c].x, y: skewableRects[s][c].y}) <= (selectRadius / canvasScale_Vehicle);

					shapeVertsX.push(skewableRects[s][c].x);
					shapeVertsY.push(skewableRects[s][c].y);
					holding.hoveringOverShape = false;
					holding.hoveringOverCorner = false;
					if(withinCorner) {
						//canvasContainer.style.cursor = "grab";
						holding.shapeIndex = s;
						holding.cornerIndex = c;
						holding.hoveringOverCorner = true;
						drawFillCircle(canvasCtxLayers[1], skewableRects[s][c].x * canvasScale_Vehicle + xOffset_Vehicle, skewableRects[s][c].y * canvasScale_Vehicle + yOffset_Vehicle, selectRadius, "M", "red", 0.5);
						c = numCorners;
						break topLoop;
					} else if(lastcorner) {
						if(pointInPolygon(numCorners, shapeVertsX, shapeVertsY, mousePos.x, mousePos.y)) {
							holding.shapeIndex = s;
							holding.cornerIndex = null;
							holding.hoveringOverShape = true;
							//canvasContainer.style.cursor = "grab";
							break topLoop;
						}
					}
				}
			}
		}

		if(holding.isGrabbingShape) {
			for(var s = skewableRects.length - 1; s >= 0; s--) {
				canvasContainer.style.cursor = "grabbing";
				let hoveringOverCorner = !holding.hoveringOverShape;

				if(hoveringOverCorner) {
					dirtyTriangles = true;
					needsToUpdate = true;

					skewableRects[holding.shapeIndex][holding.cornerIndex] = {x: mousePos.x, y: mousePos.y};
					lockMovement = true;
					drawFillCircle(canvasCtxLayers[1], mousePos.x * canvasScale_Vehicle + xOffset_Vehicle, mousePos.y * canvasScale_Vehicle + yOffset_Vehicle, selectRadius, "M", "red", 0.5);
				} else {
					dirtyTriangles = true;
					needsToUpdate = true;
					lockMovement = true;
					// canvasContainer.style.cursor = "grab";
					for(let i = 0; i < shapeVertsWhenMouseDown.length - 1; i++) {
						let xo = mouseDownPosition.x - shapeVertsWhenMouseDown[i].x;
						let yo = mouseDownPosition.y - shapeVertsWhenMouseDown[i].y;

						skewableRects[holding.shapeIndex][i].x = mousePos.x - xo;
						skewableRects[holding.shapeIndex][i].y = mousePos.y - yo;
					}
				}
			}
		}

		//if hovering on shape
		if(holding.hoveringOverShape || holding.hoveringOverCorner) {
			for(var s = skewableRects.length - 1; s >= 0; s--) {
				var numCorners = skewableRects[s].length - 1;
				for(var c = 0; c < numCorners; c++) {
					var lastcorner = c == numCorners - 1;
					let bv = c + 1;
					if(lastcorner) bv = 0;
					drawLine_To(canvasCtxLayers[1], skewableRects[s][c].x * canvasScale_Vehicle + xOffset_Vehicle, skewableRects[s][c].y * canvasScale_Vehicle + yOffset_Vehicle,
						skewableRects[s][bv].x * canvasScale_Vehicle + xOffset_Vehicle, skewableRects[s][bv].y * canvasScale_Vehicle + yOffset_Vehicle, "blue", 0.5, 1);
				}
			}
		}
	});

	$(canvasContainer).mouseup(function(e) {
		console.log("mouseup called");
		//canvasContainer.style.cursor = "grab";
		holding.isGrabbingShape = false;
		holding.shapeIndex = null;
		holding.cornerIndex = null;
		holding.hoveringOverShape = false;
		lockMovement = false;

		var leftPressed = e.button == 0,
			scrossPressed = e.button == 1,
			rightPressed = e.button == 2;

		closeCustomContextMenu();

		if(rightPressed) {
			console.log("in rightPressed");
			if(!isHoveringOnRect) {
				showCustomContextMenu(canvasArray[1],
					newContextItem("Delete", deleteSkewableRect, mouseDownPosition.x, mouseDownPosition.y),
					newContextItem("Scale", scaleSkewableRect, mouseDownPosition.x, mouseDownPosition.y),
					newContextItem("Copy", copySkewableRect, mouseDownPosition.x, mouseDownPosition.y),
					newContextItem("Paste", pasteSkewableRect, mouseDownPosition.x, mouseDownPosition.y),
					newContextSubdivision(),
					newContextItem("Reset Skew and Scale", resetSkewableRect, mouseDownPosition.x, mouseDownPosition.y),
					newContextItem("Reset View and Origin", resetSkewableView),
					newContextSubdivision(),
					newContextItem("Save To File", saveSkewableImageToFile, mouseDownPosition.x, mouseDownPosition.y),
					newContextItemFile("Open From File", openSkewableImageFromFile, mouseDownPosition.x, mouseDownPosition.y)
				);
			}
			if(isHoveringOnRect) {
				showCustomContextMenu(canvasArray[1],
					newContextItem("Delete", deleteRect, mouseDownPosition.x, mouseDownPosition.y),
					newContextItem("Set Qty", setQtyRect, mouseDownPosition.x, mouseDownPosition.y),
					newContextItem("Set Size", setSizeRect, mouseDownPosition.x, mouseDownPosition.y),
					newContextItem("Set Description", setDescriptionRect, mouseDownPosition.x, mouseDownPosition.y),
					newContextItem("Set is RTA", setIsRTARect, mouseDownPosition.x, mouseDownPosition.y),
					newContextSubdivision(),
					newContextItem("Reverse Engineer Scale", getScaleRect, mouseDownPosition.x, mouseDownPosition.y)
				);
			}
		}

		if(leftPressed) {
		}
	});
}

var needsToUpdate = false;
function updateSkewCanvas() {
	var updateCondition = dragging || needsToUpdate;
	if(updateCondition) {
		needsToUpdate = false;
		canvasCtxLayers[0].clearRect(0, 0, canvasWidth_Vehicle, canvasHeight_Vehicle);

		if(dirtyTriangles) {
			dirtyTriangles = false;
			calculateGeometry();
		}

		for(var i = 0; i < images.length; i++) {
			for(triangle of triangles[i]) {
				renderSkew_Wireframe_Image(true, images[i], triangle);
			}
		}

		//Draw Origin
		drawLine_WH(canvasCtxLayers[0], xOffset_Vehicle, yOffset_Vehicle, 100, 0, COLOUR.Blue, 1, 1);
		drawLine_WH(canvasCtxLayers[0], xOffset_Vehicle, yOffset_Vehicle, 0, 100, COLOUR.Blue, 1, 1);
		drawText(canvasCtxLayers[0], xOffset_Vehicle, yOffset_Vehicle, 12, "B", "Origin: (0,0)", COLOUR.Blue);
	}
};

/**
 * @param {Array} array - list of image src i.e. ["https://example.com"]
 * @param {Integer} xOffset - x offset for TL
 * @param {Integer} yOffset - y offset for TL
 */
async function addSkewableImages(xOffset, yOffset, srcArray, optional_c1, optional_c2, optional_c3, optional_c4) {
	console.log("in addSkewableImages ");

	for(let y = 0; y < srcArray.length; y++) {
		let image = new Image();
		image.src = srcArray[y];

		let isSVG = srcArray[y].includes("image/svg+xml") || srcArray[y].includes(".svg");

		await new Promise((resolve, reject) => {
			image.onload = () => resolve();
			image.onerror = reject;
		});

		let widthMM = pixelToMM(image.width);
		let heightMM = pixelToMM(image.height);
		let width = isSVG ? widthMM : image.width;
		let height = isSVG ? heightMM : image.height;

		if(!xOffset) {
			xOffset = getCenterPosReal(canvasArray[0]).x - width / 2;
		}
		if(!yOffset) {
			yOffset = getCenterPosReal(canvasArray[0]).y - height / 2;
		}

		if(optional_c1 != null && optional_c2 != null && optional_c3 != null && optional_c4 != null) {
			skewableRects.push([
				{x: optional_c1.x, y: optional_c1.y},     //TL
				{x: optional_c2.x, y: optional_c2.y},     //TR
				{x: optional_c3.x, y: optional_c3.y},    //BR
				{x: optional_c4.x, y: optional_c4.y},     //BL
				srcArray[y]
			]);
		} else {
			skewableRects.push([
				{x: xOffset, y: yOffset},     //TL
				{x: xOffset + width, y: yOffset},    //TR
				{x: xOffset + width, y: yOffset + height},   //BR
				{x: xOffset, y: yOffset + height},    //BL
				srcArray[y]
			]);
		}
		images.push(image);
		needsToUpdate = true;
	}
	calculateGeometry();
}

function deleteSkewableRect(xPos, yPos) {
	if(isHoveringOnRect) return;
	let shapeIndex = getSkewRectAtPosition(xPos, yPos);
	console.log("in deleteSkewableRect", shapeIndex, xPos, yPos);

	if(shapeIndex != null && shapeIndex !== false) {
		console.log("in final delete");
		skewableRects.splice(shapeIndex, 1);
		images.splice(shapeIndex, 1);
		triangles.splice(shapeIndex, 1);
		needsToUpdate = true;
	} else {
		alert("cant delete SkewableRects");
	}
}

function scaleSkewableRect(xPos, yPos) {
	if(isHoveringOnRect) return;

	let shapeIndex = getSkewRectAtPosition(xPos, yPos);
	if(shapeIndex != null && shapeIndex !== false) {
		let modal = new ModalWidthHeight("Apply Scale", 1, function() {
			let scaleW = (modal.width || modal.width != 0) ? modal.width - 1 : 0;
			let scaleH = (modal.height || modal.height != 0) ? modal.height - 1 : 0;

			let centerCoord = {
				x: (skewableRects[shapeIndex][1].x + skewableRects[shapeIndex][0].x) / 2,
				y: (skewableRects[shapeIndex][2].y + skewableRects[shapeIndex][0].y) / 2
			};
			for(var c = 0; c < skewableRects[shapeIndex].length - 1; c++) {
				let x = skewableRects[shapeIndex][c].x,
					y = skewableRects[shapeIndex][c].y;
				let dx = x - centerCoord.x,
					dy = y - centerCoord.y;
				let newXPos = x + dx * scaleW,
					newYPos = y + dy * scaleH;

				skewableRects[shapeIndex][c].x = newXPos;
				skewableRects[shapeIndex][c].y = newYPos;
			}
			dirtyTriangles = true;
			needsToUpdate = true;
		});
		modal.setContainerSize(300, 300);
	}
}

var copiedRect;
function copySkewableRect(xPos, yPos) {
	if(isHoveringOnRect) return;

	console.log("in copy");
	copiedRect = skewableRects[getSkewRectAtPosition(xPos, yPos)];
}

async function pasteSkewableRect(xPos, yPos) {
	if(isHoveringOnRect) return;

	console.log("in paste");
	if(copiedRect != null) {
		var centrePos = getCenterPosReal(canvasArray[0]);
		await addSkewableImages(centrePos.x, centrePos.y, [copiedRect[4]]);
		for(var c = 0; c < 4; c++) {
			var offset;
			if(c == 0) {
				offset = {x: copiedRect[c].x - xPos, y: copiedRect[c].y - yPos};
			}
			skewableRects[skewableRects.length - 1][c] = {
				x: copiedRect[c].x - offset.x,
				y: copiedRect[c].y - offset.y
			};
			dirtyTriangles = true;
			needsToUpdate = true;
		}
	}
}

function resetSkewableRect(xPos, yPos) {
	let shapeIndex = getSkewRectAtPosition(xPos, yPos);
	if(shapeIndex != null && shapeIndex !== false) {
		let isSVG = skewableRects[shapeIndex][4].includes("image/svg+xml") || skewableRects[shapeIndex][4].includes(".svg");
		let widthMM = pixelToMM(images[shapeIndex].width);
		let heightMM = pixelToMM(images[shapeIndex].height);
		let width = isSVG ? widthMM : images[shapeIndex].width;
		let height = isSVG ? heightMM : images[shapeIndex].height;

		for(var c = 0; c < 4; c++) {
			var offset;
			switch(c) {
				case 0:
					offset = {x: skewableRects[shapeIndex][c].x, y: skewableRects[shapeIndex][c].y};
					skewableRects[shapeIndex][c] = {x: offset.x, y: offset.y};
					break;
				case 1:
					skewableRects[shapeIndex][c] = {x: offset.x + width, y: offset.y};
					break;
				case 2:
					skewableRects[shapeIndex][c] = {x: offset.x + width, y: offset.y + height};
					break;
				case 3:
					skewableRects[shapeIndex][c] = {x: offset.x, y: offset.y + height};
					break;
				default:
					break;
			}
			dirtyTriangles = true;
			needsToUpdate = true;
		}
	}
}

function resetSkewableView() {
	xOffset_Vehicle = 0;
	yOffset_Vehicle = 0;
	canvasScale_Vehicle = 0.1;
	dirtyTriangles = true;
	needsToUpdate = true;
	update(null);
}

async function saveSkewableImageToFile(xPos, yPos) {
	if(isHoveringOnRect) return;
	let shapeIndex = getSkewRectAtPosition(xPos, yPos);
	if(shapeIndex != null && shapeIndex !== false) {
		let isSVG = skewableRects[shapeIndex][4].includes("image/svg+xml") || skewableRects[shapeIndex][4].includes(".svg");
		let widthMM = pixelToMM(images[shapeIndex].width);
		let heightMM = pixelToMM(images[shapeIndex].height);
		let width = isSVG ? widthMM : images[shapeIndex].width;
		let height = isSVG ? heightMM : images[shapeIndex].height;
		console.log(shapeIndex, isSVG, widthMM, heightMM, width, height);
		console.log(images[shapeIndex]);
		console.log(skewableRects[shapeIndex]);

		await downloadFileContent_Text_SingleFile(JSON.stringify(skewableRects[shapeIndex]));
	}
}

async function openSkewableImageFromFile(event, xPos, yPos) {
	if(isHoveringOnRect) return;

	console.log("in loadSkewableImageFromFile");
	var content = await getFileContent_Text_SingleFile(event);
	console.log(content);
	var parsedContent = JSON.parse(content);
	console.log(parsedContent);
	var offset = {x: xPos - parsedContent[0].x, y: yPos - parsedContent[0].y};
	await addSkewableImages(null, null, [parsedContent[4]],
		{x: parsedContent[0].x + offset.x, y: parsedContent[0].y + offset.y},
		{x: parsedContent[1].x + offset.x, y: parsedContent[1].y + offset.y},
		{x: parsedContent[2].x + offset.x, y: parsedContent[2].y + offset.y},
		{x: parsedContent[3].x + offset.x, y: parsedContent[3].y + offset.y});
	refreshBackground();
}

function deleteRect(xPos, yPos) {
	let shapeIndex = getRectAtPosition(xPos, yPos);
	console.log("in deleteRect", shapeIndex, xPos, yPos);

	if(shapeIndex != null && shapeIndex !== false) {
		console.log("in final delete " + shapeIndex);
		VehicleMenu_Template.deleteRow(shapeIndex);
	} else {
		console.log("cant");
	}
}

function setQtyRect(xPos, yPos) {
	console.log("in setQtyRect");
	var shapeIndex = getRectAtPosition(xPos, yPos);
	console.log(shapeIndex);
	if(shapeIndex != null && shapeIndex !== false) {
		let modal = new ModalSingleInput("Enter New Quantity", function() {
			rects[shapeIndex].qty = parseFloat(modal.value);
			update(null);
		});
		modal.setContainerSize(300, 300);
		$(modal.valField[1]).val(rects[shapeIndex].qty).change();
	}
}

function setSizeRect(xPos, yPos) {
	var shapeIndex = getRectAtPosition(xPos, yPos);
	if(shapeIndex != null && shapeIndex !== false) {
		let modal = new ModalWidthHeight("Change Size", 100, function() {
			rects[shapeIndex].w = parseFloat(modal.width);
			rects[shapeIndex].h = parseFloat(modal.height);
			update(null);
		});
		modal.setContainerSize(300, 300);
		$(modal.widthField[1]).val(rects[shapeIndex].w).change();
		$(modal.heightField[1]).val(rects[shapeIndex].h).change();
	}
}

function setDescriptionRect(xPos, yPos) {
	var shapeIndex = getRectAtPosition(xPos, yPos);
	if(shapeIndex != null && shapeIndex !== false) {
		let modal = new ModalSingleInputText("Enter Description", function() {
			rects[shapeIndex].description = modal.value;
			update(null);
		});
		modal.setContainerSize(300, 300);
		$(modal.valField[1]).val(rects[shapeIndex].description).change();
	}
}

function setIsRTARect(xPos, yPos) {
	var shapeIndex = getRectAtPosition(xPos, yPos);
	if(shapeIndex != null && shapeIndex !== false) {
		let modal = new ModalSingleInputCheckbox("Set Is RTA", function() {
			console.log(modal.value);
			modal.value == true ? rects[shapeIndex].appTape = AppTapeLookup["Medium Tack"] : rects[shapeIndex].appTape = "None";
		});
		modal.setContainerSize(300, 300);
		$(modal.valField[1]).prop("checked", rects[shapeIndex].appTape == "None" ? false : true).change();
	}
}

function getScaleRect(xPos, yPos) {
	var shapeIndex = getRectAtPosition(xPos, yPos);
	if(shapeIndex != null && shapeIndex !== false) {
		let rectWidth = rects[shapeIndex].w;
		let rectHeight = rects[shapeIndex].h;
		let modal = new ModalWidthHeightWithCalcResult("Reverse Engineer Scale", "Width should be", "Height should be", "New Width Scale", "New Height Scale", function() {
			$(modal.calcWidthField[1]).val(modal.width / rectWidth).change();
		}, function() {
			$(modal.calcHeightField[1]).val(modal.height / rectHeight).change();
		}, null);
		modal.setContainerSize(300, 300);
		//$(modal.valField[1]).prop("checked", rects[shapeIndex].appTape == "None" ? false : true).change();
	}
}

function closeSkewableCanvas() {
	canvasCtxLayers[0].clearRect(0, 0, canvasWidth_Vehicle, canvasHeight_Vehicle);
	images = [];
	skewableRects = [];
	triangles = [];
	clearInterval(skewInterval);
}

function renderSkew_Wireframe_Image(wireframe, image, tri) {
	canvasCtxLayers[0].setTransform(1, 0, 0, 1, 0, 0);

	let _x, _y, _w, _h;

	if(wireframe) {
		canvasCtxLayers[0].beginPath();
		canvasCtxLayers[0].strokeStyle = "black";
		canvasCtxLayers[0].lineWidth = 0.2;
		canvasCtxLayers[0].moveTo(xOffset_Vehicle + tri.p0.x * canvasScale_Vehicle, yOffset_Vehicle + tri.p0.y * canvasScale_Vehicle);
		canvasCtxLayers[0].lineTo(xOffset_Vehicle + tri.p1.x * canvasScale_Vehicle, yOffset_Vehicle + tri.p1.y * canvasScale_Vehicle);
		canvasCtxLayers[0].lineTo(xOffset_Vehicle + tri.p2.x * canvasScale_Vehicle, yOffset_Vehicle + tri.p2.y * canvasScale_Vehicle);
		canvasCtxLayers[0].lineTo(xOffset_Vehicle + tri.p0.x * canvasScale_Vehicle, yOffset_Vehicle + tri.p0.y * canvasScale_Vehicle);
		canvasCtxLayers[0].stroke();
		canvasCtxLayers[0].closePath();
	}

	if(image) {
		drawTriangle(canvasCtxLayers[0], image,
			xOffset_Vehicle + tri.p0.x * canvasScale_Vehicle, yOffset_Vehicle + tri.p0.y * canvasScale_Vehicle,
			xOffset_Vehicle + tri.p1.x * canvasScale_Vehicle, yOffset_Vehicle + tri.p1.y * canvasScale_Vehicle,
			xOffset_Vehicle + tri.p2.x * canvasScale_Vehicle, yOffset_Vehicle + tri.p2.y * canvasScale_Vehicle,
			tri.t0.u, tri.t0.v,
			tri.t1.u, tri.t1.v,
			tri.t2.u, tri.t2.v);
	}
};

function drawTriangle(ctx, im, x0, y0, x1, y1, x2, y2,
	sx0, sy0, sx1, sy1, sx2, sy2) {
	canvasCtxLayers[0].strokeStyle = "black";
	canvasCtxLayers[0].lineWidth = 0.2;
	ctx.save();

	// Clip the output to the on-screen triangle boundaries.

	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.closePath();
	//ctx.stroke();//xxxxxxx for wireframe
	ctx.clip();

	// TODO: eliminate common subexpressions.
	var denom = sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0;
	if(denom == 0) {
		return;
	}
	var m11 = -(sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
	var m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
	var m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
	var m22 = -(sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
	var dx = (sx0 * (sy2 * x1 - sy1 * x2) + sy0 * (sx1 * x2 - sx2 * x1) + (sx2 * sy1 - sx1 * sy2) * x0) / denom;
	var dy = (sx0 * (sy2 * y1 - sy1 * y2) + sy0 * (sx1 * y2 - sx2 * y1) + (sx2 * sy1 - sx1 * sy2) * y0) / denom;

	ctx.transform(m11, m12, m21, m22, dx, dy);

	// Draw the whole image.  Transform and clip will map it onto the
	// correct output triangle.
	//
	// TODO: figure out if drawImage goes faster if we specify the rectangle that
	// bounds the source coords.
	ctx.drawImage(im, 0, 0);
	ctx.restore();
};

function Point(x, y) {
	this.x = x ? x : 0;
	this.y = y ? y : 0;
};

p.length = function(point) {
	point = point ? point : new Point();
	var xs = 0, ys = 0;
	xs = point.x - this.x;
	xs = xs * xs;

	ys = point.y - this.y;
	ys = ys * ys;
	return Math.sqrt(xs + ys);
};

function TextCoord(u, v) {
	this.u = u ? u : 0;
	this.v = v ? v : 0;
};

function Triangle(p0, p1, p2, t0, t1, t2) {
	this.p0 = p0;
	this.p1 = p1;
	this.p2 = p2;

	this.t0 = t0;
	this.t1 = t1;
	this.t2 = t2;
};

function calculateGeometry() {
	for(var i = 0; i < images.length; i++) {
		// clear triangles out
		triangles[i] = [];

		// generate subdivision
		var subs = 7; // vertical subdivisions
		var divs = 7; // horizontal subdivisions

		var p1 = new Point(skewableRects[i][0].x, skewableRects[i][0].y);
		var p2 = new Point(skewableRects[i][1].x, skewableRects[i][1].y);
		var p3 = new Point(skewableRects[i][2].x, skewableRects[i][2].y);
		var p4 = new Point(skewableRects[i][3].x, skewableRects[i][3].y);

		var dx1 = p4.x - p1.x;
		var dy1 = p4.y - p1.y;
		var dx2 = p3.x - p2.x;
		var dy2 = p3.y - p2.y;

		var imgW = images[i].width;
		var imgH = images[i].height;

		for(var sub = 0; sub < subs; ++sub) {
			var curRow = sub / subs;
			var nextRow = (sub + 1) / subs;

			var curRowX1 = p1.x + dx1 * curRow;
			var curRowY1 = p1.y + dy1 * curRow;

			var curRowX2 = p2.x + dx2 * curRow;
			var curRowY2 = p2.y + dy2 * curRow;

			var nextRowX1 = p1.x + dx1 * nextRow;
			var nextRowY1 = p1.y + dy1 * nextRow;

			var nextRowX2 = p2.x + dx2 * nextRow;
			var nextRowY2 = p2.y + dy2 * nextRow;

			for(var div = 0; div < divs; ++div) {
				var curCol = div / divs;
				var nextCol = (div + 1) / divs;

				var dCurX = curRowX2 - curRowX1;
				var dCurY = curRowY2 - curRowY1;
				var dNextX = nextRowX2 - nextRowX1;
				var dNextY = nextRowY2 - nextRowY1;

				var p1x = curRowX1 + dCurX * curCol;
				var p1y = curRowY1 + dCurY * curCol;

				var p2x = curRowX1 + (curRowX2 - curRowX1) * nextCol;
				var p2y = curRowY1 + (curRowY2 - curRowY1) * nextCol;

				var p3x = nextRowX1 + dNextX * nextCol;
				var p3y = nextRowY1 + dNextY * nextCol;

				var p4x = nextRowX1 + dNextX * curCol;
				var p4y = nextRowY1 + dNextY * curCol;

				var u1 = curCol * imgW;
				var u2 = nextCol * imgW;
				var v1 = curRow * imgH;
				var v2 = nextRow * imgH;

				var triangle1 = new Triangle(
					new Point(p1x, p1y),
					new Point(p3x, p3y),
					new Point(p4x, p4y),
					new TextCoord(u1, v1),
					new TextCoord(u2, v2),
					new TextCoord(u1, v2)
				);

				var triangle2 = new Triangle(
					new Point(p1x, p1y),
					new Point(p2x, p2y),
					new Point(p3x, p3y),
					new TextCoord(u1, v1),
					new TextCoord(u2, v1),
					new TextCoord(u2, v2)
				);

				triangles[i].push(triangle1);
				triangles[i].push(triangle2);
			}
		}
	}
};

function dist(p1, p2) {
	return parseFloat(Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y)));
}

/**
 * get real mm position of mouse relative to TL origin
 * @param {Canvas} canvas 
 * @param {Event} event 
 * @returns new {x,y}
 */
function getMousePos(canvas, e) {
	if(!e) return;
	var boundingRect = canvas.getBoundingClientRect();
	return {x: (e.clientX - boundingRect.left - xOffset_Vehicle) / canvasScale_Vehicle, y: (e.clientY - boundingRect.top - yOffset_Vehicle) / canvasScale_Vehicle};
}

function getCenterPosReal(canvas) {
	var boundingRect = canvas.getBoundingClientRect();
	let width = boundingRect.right - boundingRect.left,
		height = boundingRect.bottom - boundingRect.top;
	return {x: (width / 2 - xOffset_Vehicle) / canvasScale_Vehicle, y: (height / 2 - yOffset_Vehicle) / canvasScale_Vehicle};
}

function point(x, y) {
	return {
		x: x * canvasScale_Vehicle,
		y: y * canvasScale_Vehicle
	};
}

/**
 * Checks if there are skewableRects at the given coordinates
 * @param {Float} xPos 
 * @param {Float} yPos 
 * @returns shape index or false if no skewableRects at the given coordinates
 */
function getSkewRectAtPosition(xPos, yPos) {
	for(var s = 0; s < skewableRects.length; s++) {
		let searchArrayX = [],
			searchArrayY = [];
		for(var c = 0; c < skewableRects[s].length - 1; c++) {
			searchArrayX.push(skewableRects[s][c].x);
			searchArrayY.push(skewableRects[s][c].y);
		}
		var inThisShape = pointInPolygon(4, searchArrayX, searchArrayY, xPos, yPos);

		if(inThisShape) {
			return s;
		}
	}
	return false;
}

function getRectAtPosition(xPos, yPos) {
	for(var s = 0; s < rects.length; s++) {
		if(xPos >= rects[s].x && xPos <= rects[s].x + rects[s].w && yPos >= rects[s].y && yPos <= rects[s].y + rects[s].h) return s;
	}
	return false;
}