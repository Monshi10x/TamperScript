var canvas;
var canvasWidth;
var canvasHeight;
var xOffset = 400;
var yOffset = 400;
var xOffset_TopView = xOffset;
var yOffset_TopView;
var canvasScale;
var sideBOffsetX = 800;

//Attachment Type
var attachmentType;
var attachmentRelation = {
      "2 Post, Centre Frame, Centre Sign": 0,
      "2 Post, Forward Frame, Front Sign": 1,
      "2 Post, Front Frame, Front Sign": 2,
      "3 Post, Centre Frame, Centre Sign": 3,
      "3 Post, Forward Frame, Front Sign": 4,
      "3 Post, Front Frame, Front Sign": 5,
      "1 Post, Front Frame, Front Sign": 6
};

var groundLevel;

var measurementOffset = 200;
var measurementTextOffset = -150;

class BillboardMenu extends LHSMenuWindow {

      #dragZoomCanvas;
      #dragZoomSVG;
      #canvasCtx;

      #totalQuantity;
      #sign;
      #frame;
      #leg;
      #footing;
      #baseplate;
      #production;
      #install;
      #artwork;
      #f_showGroundCkb;

      #showGround = true;

      constructor(width, height, ID, windowTitle) {
            super(width, height, ID, windowTitle);
            this.addPages(1);
            this.doesTick = false;
      }

      show() {
            super.show();

            var page = this.getPage(0);
            var footer = this.footer;

            while(page.hasChildNodes()) {page.removeChild(page.lastChild);}
            while(footer.hasChildNodes()) {footer.removeChild(footer.lastChild);}

            this.createContent();
      }

      createContent() {
            var page = this.getPage(0);

            let settingsButton = createButton("", "width:30px;height:30px;margin:0px;padding:0;float:right;font-size:20px;min-height:30px;line-height:30px;", () => {
                  this.openSettingsModal();
            }, null);
            this.add;
            settingsButton.innerHTML = "&#9881";
            this.header.appendChild(settingsButton);

            this.#f_showGroundCkb = createCheckbox_Infield("Show Ground", true, null, () => {this.#showGround = this.#f_showGroundCkb[1].checked; this.UpdateFromFields();});

            this.#dragZoomCanvas = new DragZoomCanvas(page.getBoundingClientRect().width / 2 + 50, this.height, () => {this.draw();}, page,);
            this.#dragZoomCanvas.canvas.style.cssText += "float:right;";
            this.#dragZoomCanvas.canvas.style.cssText += ";display:none;";//TEMPORARY

            this.#canvasCtx = this.#dragZoomCanvas.canvasCtx;

            var infoContainer = document.createElement("div");
            infoContainer.style = "width:50%;box-sizing:border-box;overflow-y:scroll;height:100%;display:block;float:left;background-color:" + COLOUR.MediumGrey;
            //infoContainer.style.height = this.height + "px";

            let thisClass = this;
            function createAttachmentTypeContainer() {
                  var container = document.createElement('div');
                  container.style = STYLE.BillboardMenus + ";min-height:200px;max-height:300px;overflow-y:scroll;";

                  var headerLabel = createLabel('Attachment Type', "width:97%;");

                  var items = [];
                  function addType(imageSrc, typeId) {
                        var item = document.createElement('div');
                        item.id = typeId;
                        item.style = "display:block;float:left; width:120px;height:120px; background-color:#fff;margin:10px;border:2px solid white;position: relative;box-shadow:0 4px 8px 0 #888;";
                        var image = document.createElement('img');
                        image.src = imageSrc;
                        item.appendChild(image);
                        image.style = "width: 80px;top: 50%;position: absolute;left: 50%;transform: translate(-50%, -50%);";
                        item.onclick = function() {
                              toggleSelectedType(this);
                              thisClass.draw();
                              thisClass.UpdateFromFields();
                        };
                        item.onmouseover = function() {
                              this.style.boxShadow = "0 4px 8px 0 black";
                        };
                        item.onmouseout = function() {
                              this.style.boxShadow = "0 4px 8px 0 #888";
                        };
                        container.appendChild(item);
                        items.push(item);
                        return item;
                  }

                  function toggleSelectedType(item) {
                        attachmentType = item.id;

                        for(var t = 0; t < items.length; t++) {
                              items[t].style.border = "2px solid white";
                        }
                        item.style.border = "2px solid black";

                  }

                  container.appendChild(headerLabel);

                  var item1 = addType("https://cdn.gorilladash.com/images/media/4757720/signarama-australia-pap-type-1a-6066a4df29d12.png", "2 Post, Centre Frame, Centre Sign");
                  var item2 = addType("https://cdn.gorilladash.com/images/media/4757721/signarama-australia-pap-type-1b-6066a4e041e5e.png", "2 Post, Forward Frame, Front Sign");
                  var item3 = addType("https://cdn.gorilladash.com/images/media/4757722/signarama-australia-pap-type-1c-6066a4e060d6d.png", "2 Post, Front Frame, Front Sign");
                  var item4 = addType("https://cdn.gorilladash.com/images/media/4757717/signarama-australia-pap-type-3a-6066a4dcb982c.png", "3 Post, Centre Frame, Centre Sign");
                  var item5 = addType("https://cdn.gorilladash.com/images/media/4757718/signarama-australia-pap-type-3b-6066a4dd11fa8.png", "3 Post, Forward Frame, Front Sign");
                  var item6 = addType("https://cdn.gorilladash.com/images/media/4757719/signarama-australia-pap-type-3c-6066a4dd12c1c.png", "3 Post, Front Frame, Front Sign");
                  var item7 = addType("https://cdn.gorilladash.com/images/media/4757716/signarama-australia-pap-type-2a-6066a4dc65d91.png", "1 Post, Front Frame, Front Sign");
                  toggleSelectedType(item1);

                  infoContainer.appendChild(container);
            }

            createAttachmentTypeContainer();

            page.appendChild(infoContainer);
            //page.getBoundingClientRect().width / 2 + 50 + "px"
            this.#dragZoomSVG = new DragZoomSVG("calc(50%)", "calc(100% - 0px)", '<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="1980.32mm" height="1186.57mm" viewBox="0 0 5613.5 3363.5"></svg>',
                  page, {
                  convertShapesToPaths: false,
                  scaleStrokeOnScroll: false,
                  scaleFontOnScroll: true,
                  defaultStrokeWidth: 1,
                  defaultFontSize: 12
            });

            this.#totalQuantity = null;
            this.#sign = null;
            this.#frame = null;
            this.#leg = null;
            this.#footing = null;
            this.#baseplate = null;
            this.#production = null;
            this.#install = null;
            this.#artwork = null;

            this.#totalQuantity = new TotalQuantity(infoContainer, this.#canvasCtx, () => {this.UpdateFromFields();}, this.#dragZoomSVG);
            this.#sign = new Sign(infoContainer, this.#canvasCtx, () => {this.UpdateFromFields();}, this.#dragZoomSVG);
            this.#frame = new Frame(infoContainer, this.#canvasCtx, () => {this.UpdateFromFields();}, this.#dragZoomSVG);
            this.#leg = new Leg(infoContainer, this.#canvasCtx, () => {this.UpdateFromFields();}, this.#dragZoomSVG);
            this.#footing = new Footing(infoContainer, this.#canvasCtx, () => {this.UpdateFromFields();}, this.#dragZoomSVG);
            this.#baseplate = new Baseplate(infoContainer, this.#canvasCtx, () => {this.UpdateFromFields();}, this.#dragZoomSVG);
            this.#production = new Production(infoContainer, this.#canvasCtx, () => {this.UpdateFromFields();}, this.#dragZoomSVG);
            this.#install = new Install(infoContainer, this.#canvasCtx, () => {this.UpdateFromFields();}, this.#dragZoomSVG);
            this.#artwork = new Artwork(infoContainer, this.#canvasCtx, () => {this.UpdateFromFields();}, this.#dragZoomSVG);

            this.drawSVGGround();

            this.#dragZoomCanvas.scale = 0.15;

            this.#footing.setReferences(this.#frame, this.#leg, this.#baseplate, this.#sign);
            this.#baseplate.setReferences(this.#frame, this.#leg, this.#footing, this.#sign);
            this.#leg.setReferences(this.#frame, this.#leg, this.#footing, this.#baseplate, this.#sign);
            this.#frame.setReferences(this.#frame, this.#leg, this.#footing, this.#baseplate);
            this.#sign.setReferences(this.#frame, this.#leg);

            var fieldCreateBillboardProduct = createButton('Create Billboard Product', 'width:100%;margin:0px;', () => {this.createBillboardProduct(this);});
            this.footer.appendChild(fieldCreateBillboardProduct);

            this.#dragZoomSVG.onZoom();
      }

      async createBillboardProduct(tempThis) {
            tempThis.minimize();

            var productNo = 0;
            var partIndex = 0;

            await AddBlankProduct();
            productNo = getNumProducts();
            await setProductName(productNo, "POST and PANEL SIGN");

            await setProductSummary(productNo, "Post and Panel / Billboard Sign <br><br>" +
                  tempThis.#sign.Description() +
                  tempThis.#frame.Description() +
                  tempThis.#leg.Description() +
                  tempThis.#baseplate.Description() +
                  tempThis.#footing.Description() +
                  tempThis.#artwork.Description() +
                  tempThis.#install.Description());

            await AddPart("No Cost Part", productNo);
            partIndex++;
            await setPartDescription(productNo, partIndex, "CODE [Automatic]");
            partIndex = await setPartNotes(productNo, partIndex, this.#dragZoomSVG.unscaledSVGString);
            await savePart(productNo, partIndex);

            partIndex = await tempThis.#sign.Create(productNo, partIndex);
            partIndex = await tempThis.#leg.Create(productNo, partIndex);
            partIndex = await tempThis.#frame.Create(productNo, partIndex);
            partIndex = await tempThis.#baseplate.Create(productNo, partIndex);
            partIndex = await tempThis.#footing.Create(productNo, partIndex);
            partIndex = await tempThis.#production.Create(productNo, partIndex);
            partIndex = await tempThis.#install.Create(productNo, partIndex);
            partIndex = await tempThis.#artwork.Create(productNo, partIndex);
            partIndex = await tempThis.#totalQuantity.Create(productNo, partIndex);

            Toast.notify("Done.", 3000, {position: "top-right"});
      }

      updateSignFrameSize = () => {
            if(this.#sign.signRequired) {
                  this.#frame.lockDimensions();
                  if(attachmentType == "2 Post, Centre Frame, Centre Sign") {
                        this.#frame.frameWidth_SideA = this.#sign.signWidth_AFront;
                        this.#frame.frameHeight_SideA = this.#sign.signHeight_AFront;
                        this.#sign.signWidth_ABack = this.#sign.signWidth_AFront;
                        this.#sign.signHeight_ABack = this.#sign.signHeight_AFront;
                  } else if(attachmentType == "2 Post, Forward Frame, Front Sign") {
                        this.#frame.frameWidth_SideA = this.#sign.signWidth_AFront - this.#leg.legWidth * 2;
                        this.#frame.frameHeight_SideA = this.#sign.signHeight_AFront;
                        this.#sign.signWidth_ABack = this.#sign.signWidth_AFront - this.#leg.legWidth * 2;
                        this.#sign.signHeight_ABack = this.#sign.signHeight_AFront;
                  } else if(attachmentType == "2 Post, Front Frame, Front Sign") {
                        this.#frame.frameWidth_SideA = this.#sign.signWidth_AFront;
                        this.#frame.frameHeight_SideA = this.#sign.signHeight_AFront;
                        this.#sign.signWidth_ABack = this.#sign.signWidth_AFront - this.#leg.legWidth * 2;
                        this.#sign.signHeight_ABack = this.#sign.signHeight_AFront;
                  } else if(attachmentType == "3 Post, Centre Frame, Centre Sign") {
                        this.#frame.frameWidth_SideA = this.#sign.signWidth_AFront;
                        this.#frame.frameHeight_SideA = this.#sign.signHeight_AFront;
                        this.#sign.signWidth_ABack = this.#sign.signWidth_AFront;
                        this.#sign.signHeight_ABack = this.#sign.signHeight_AFront;
                        this.#frame.frameWidth_SideB = this.#sign.signWidth_BFront;
                        this.#frame.frameHeight_SideB = this.#sign.signHeight_BFront;
                        this.#sign.signWidth_BBack = this.#sign.signWidth_BFront;
                        this.#sign.signHeight_BBack = this.#sign.signHeight_BFront;
                  } else if(attachmentType == "3 Post, Forward Frame, Front Sign") {
                        this.#frame.frameWidth_SideA = this.#sign.signWidth_AFront - this.#leg.legWidth * 2;
                        this.#frame.frameHeight_SideA = this.#sign.signHeight_AFront;
                        this.#sign.signWidth_ABack = this.#frame.frameWidth_SideA;
                        this.#sign.signHeight_ABack = this.#frame.frameHeight_SideA;
                        this.#frame.frameWidth_SideB = this.#sign.signWidth_BFront - this.#leg.legWidth - this.#leg.legDepth;
                        this.#frame.frameHeight_SideB = this.#sign.signHeight_BFront;
                        this.#sign.signWidth_BBack = this.#frame.frameWidth_SideB;
                        this.#sign.signHeight_BBack = this.#frame.frameHeight_SideB;
                  } else if(attachmentType == "3 Post, Front Frame, Front Sign") {
                        this.#frame.frameWidth_SideA = this.#sign.signWidth_AFront;
                        this.#frame.frameHeight_SideA = this.#sign.signHeight_AFront;
                        this.#sign.signWidth_ABack = this.#frame.frameWidth_SideA - 2 * this.#leg.legWidth - this.#frame.frameDepth;
                        this.#sign.signHeight_ABack = this.#frame.frameHeight_SideA;
                        this.#frame.frameWidth_SideB = this.#sign.signWidth_BFront - this.#frame.frameDepth;
                        this.#frame.frameHeight_SideB = this.#sign.signHeight_BFront;
                        this.#sign.signWidth_BBack = this.#frame.frameWidth_SideB - this.#leg.legWidth - this.#leg.legDepth;
                        this.#sign.signHeight_BBack = this.#sign.signHeight_BFront;
                  } else {
                        this.#frame.frameWidth_SideA = this.#sign.signWidth_AFront;
                        this.#frame.frameHeight_SideA = this.#sign.signHeight_AFront;
                        this.#sign.signWidth_ABack = this.#sign.signWidth_AFront;
                        this.#sign.signHeight_ABack = this.#sign.signHeight_AFront;
                  }
            } else {
                  this.#frame.unlockDimensions();
            }
      };


      drawGroundLevel = () => {
            if(this.#leg.legHeight != 0 && this.#leg.legWidth != 0) {
                  this.#canvasCtx.moveTo(xOffset - 100, groundLevel);
                  this.#canvasCtx.lineTo(xOffset + this.#leg.legWidth * 2 + this.#frame.frameWidth_SideA + 100, groundLevel);
                  this.#canvasCtx.stroke();
                  this.#canvasCtx.font = "80px Arial";
                  this.#canvasCtx.fillText("Ground", xOffset + (this.#leg.legWidth * 2 + this.#frame.frameWidth_SideA) / 2 + measurementTextOffset, groundLevel + measurementTextOffset / 2);
            }
      };

      drawMeasurements = () => {
            var minYOffset = Math.max(this.#frame.frameHeight_SideA, this.#leg.legHeight);
            var tframeOffsetX = attachmentType == "2 Post, Front Frame, Front Sign" ? this.#leg.legWidth : 0;

            if(this.#leg.legRequired) {
                  //------------MEASUREMENT TOTAL WIDTH----------//
                  if(this.#leg.legWidth > 0 && this.#leg.legHeight > 0 && this.#frame.frameWidth_SideA > 0 && !attachmentType == "1 Post, Front Frame, Front Sign") {
                        this.#canvasCtx.moveTo(xOffset + tframeOffsetX, yOffset + measurementOffset + minYOffset);
                        this.#canvasCtx.lineTo(xOffset + this.#leg.legWidth * 2 + this.#frame.frameWidth_SideA - tframeOffsetX, yOffset + measurementOffset + minYOffset);
                        this.#canvasCtx.stroke();
                        this.#canvasCtx.font = "80px Arial";
                        this.#canvasCtx.fillText(parseFloat(this.#leg.legWidth * 2 + this.#frame.frameWidth_SideA - tframeOffsetX * 2) + "mm", xOffset + (this.#leg.legWidth * 2 + this.#frame.frameWidth_SideA) / 2 + measurementTextOffset + tframeOffsetX, yOffset + measurementOffset - measurementTextOffset + minYOffset);
                  }
            }
            if(this.#frame.frameRequired) {
                  if(this.#frame.frameWidth_SideA > 0) {
                        //-------MEASUREMENTS OUTER FRAME WIDTH----------//
                        this.#canvasCtx.moveTo(xOffset + this.#leg.legWidth + tframeOffsetX, yOffset + measurementOffset * 2 + minYOffset);
                        this.#canvasCtx.lineTo(xOffset + this.#leg.legWidth + this.#frame.frameWidth_SideA - tframeOffsetX, yOffset + measurementOffset * 2 + minYOffset);
                        this.#canvasCtx.stroke();
                        this.#canvasCtx.font = "80px Arial";
                        this.#canvasCtx.fillText(parseFloat(this.#frame.frameWidth_SideA - tframeOffsetX * 2) + "mm", xOffset + (this.#leg.legWidth * 2 + this.#frame.frameWidth_SideA) / 2 + measurementTextOffset + tframeOffsetX, yOffset + measurementOffset * 2 - measurementTextOffset + minYOffset);
                  }
                  if(this.#frame.frameHeight_SideA > 0) {
                        //-------MEASUREMENTS OUTER FRAME HEIGHT----------//
                        this.#canvasCtx.moveTo(xOffset + this.#leg.legWidth * 2 + this.#frame.frameWidth_SideA + measurementOffset * 2 + 80, yOffset);
                        this.#canvasCtx.lineTo(xOffset + this.#leg.legWidth * 2 + this.#frame.frameWidth_SideA + measurementOffset * 2 + 80, yOffset + this.#frame.frameHeight_SideA);
                        this.#canvasCtx.stroke();
                        this.#canvasCtx.font = "80px Arial";
                        this.#canvasCtx.fillText(this.#frame.frameHeight_SideA + "mm", xOffset + this.#leg.legWidth * 2 + this.#frame.frameWidth_SideA + measurementOffset * 2 + 100, yOffset + (this.#frame.frameHeight_SideA / 2));
                  }
            }
            if(this.#leg.legHeight != 0) {
                  //-------MEASUREMENTS TOTAL HEIGHT ABOVE GROUND----------//
                  this.#canvasCtx.moveTo(xOffset + this.#leg.legWidth * 2 + this.#frame.frameWidth_SideA + measurementOffset, yOffset);
                  this.#canvasCtx.lineTo(xOffset + this.#leg.legWidth * 2 + this.#frame.frameWidth_SideA + measurementOffset, groundLevel);
                  this.#canvasCtx.stroke();
                  this.#canvasCtx.font = "80px Arial";
                  this.#canvasCtx.fillText(this.#leg.legHeightAboveGround + "mm", xOffset + this.#leg.legWidth * 2 + this.#frame.frameWidth_SideA + measurementOffset + 20, yOffset + (this.#leg.legHeight / 2));
            }
            if(this.#footing.diameter > 0 && this.#footing.footingRequired && this.#leg.legHeight > 0 && this.#leg.legWidth > 0) {
                  //-------MEASUREMENTS DEPTH IN GROUND HEIGHT----------//
                  this.#canvasCtx.moveTo(xOffset + this.#leg.legWidth * 2 + this.#frame.frameWidth_SideA + measurementOffset + 80 * 2, groundLevel);
                  this.#canvasCtx.lineTo(xOffset + this.#leg.legWidth * 2 + this.#frame.frameWidth_SideA + measurementOffset + 80 * 2, groundLevel + this.#footing.depth);
                  this.#canvasCtx.stroke();
                  this.#canvasCtx.font = "80px Arial";
                  this.#canvasCtx.fillText(this.#footing.depth + "mm", xOffset + this.#leg.legWidth * 2 + this.#frame.frameWidth_SideA + measurementOffset + 80 * 2 + 20, groundLevel - (this.#footing.depth / 2) + this.#footing.depth);
                  this.#canvasCtx.beginPath();

                  //-------MEASUREMENTS DEPTH IN GROUND WIDTH----------//
                  this.#canvasCtx.moveTo(xOffset + this.#leg.legWidth * 2 - this.#leg.legWidth / 2 + this.#frame.frameWidth_SideA - this.#footing.diameter / 2 - tframeOffsetX, yOffset + measurementOffset * 3 + 100 + minYOffset);
                  this.#canvasCtx.lineTo(xOffset + this.#leg.legWidth * 2 - this.#leg.legWidth / 2 + this.#frame.frameWidth_SideA - this.#footing.diameter / 2 + this.#footing.diameter - tframeOffsetX, yOffset + measurementOffset * 3 + 100 + minYOffset);
                  this.#canvasCtx.stroke();
                  this.#canvasCtx.font = "80px Arial";
                  if(this.#footing.diameter > 0)
                        this.#canvasCtx.fillText(this.#footing.diameter + "mm", xOffset + this.#leg.legWidth * 2 - this.#leg.legWidth / 2 + this.#frame.frameWidth_SideA - this.#footing.diameter / 4 - tframeOffsetX, yOffset + measurementOffset * 3 + 200 + minYOffset);

            }
            if(this.#baseplate.baseplateRequired) {
                  //todo
            }

            this.#canvasCtx.font = "80px Arial";
      };

      drawDescriptors = () => {
            drawFillRect(this.#canvasCtx, 0, yOffset - 200 - 200, 1000, 200, "TL", COLOUR.Blue, 1);
            drawText(this.#canvasCtx, 0 + 100, yOffset - 200 - 200 + 100, 100, "L", "Side View", 'white');

            drawFillRect(this.#canvasCtx, 0, yOffset_TopView - 600, 1000, 200, "TL", COLOUR.Blue, 1);
            drawText(this.#canvasCtx, 0 + 100, yOffset_TopView - 600 + 100, 100, "L", "Top View", 'white');
      };

      grounds = [];
      drawSVGGround() {
            for(let g = 0; g < this.grounds.length; g++) {
                  this.grounds[g].Delete();
            }
            this.grounds = [];

            console.log("in drawsvgground", this.#showGround);

            if(!this.#showGround) return;

            let signIsFront = attachmentType == "2 Post, Forward Frame, Front Sign" ||
                  attachmentType == "2 Post, Front Frame, Front Sign" ||
                  attachmentType == "3 Post, Forward Frame, Front Sign" ||
                  attachmentType == "3 Post, Front Frame, Front Sign" ||
                  attachmentType == "1 Post, Front Frame, Front Sign";

            let signIs3Leg = attachmentType == "3 Post, Centre Frame, Centre Sign" ||
                  attachmentType == "3 Post, Forward Frame, Front Sign" ||
                  attachmentType == "3 Post, Front Frame, Front Sign";

            let side3Offset = signIs3Leg ? (this.#sign.signWidth_BFront + (signIsFront ? 0 : 2 * this.#leg.legDepth) + sideBOffsetX) : 0;

            this.grounds.push(new TSVGRectangle(this.#dragZoomSVG.svgG, {
                  x: xOffset - 400,
                  y: yOffset + this.#leg.legHeightAboveGround,
                  width: (this.#sign.signWidth_AFront + (signIsFront ? 0 : 2 * this.#leg.legWidth) +
                        +side3Offset
                        + 800),
                  height: this.#footing.depth + 300,
                  fill: '#c19a7c',
                  usePattern: true,
                  patternType: 'soil',
                  hatchLineColor: '#2d1b0e'
            }));
      }

      openSettingsModal() {
            let modal = new Modal("Settings", () => { });
            modal.setContainerSize(500, 500);
            modal.addBodyElement(this.#f_showGroundCkb[0]);
            modal.addFooterElement(createButton("Ok", "width:100px;float:right;", () => {
                  this.UpdateFromFields();
                  modal.hide();
            }));
      }

      UpdateFromFields() {
            this.#dragZoomCanvas.UpdateFromFields();

            if(this.#totalQuantity.UpdateSVG) this.#totalQuantity.UpdateSVG();

            this.drawSVGGround();

            if(this.#footing.UpdateSVG) this.#footing.UpdateSVG();
            if(this.#baseplate.UpdateSVG) this.#baseplate.UpdateSVG();
            if(this.#leg.UpdateSVG) this.#leg.UpdateSVG();
            if(this.#frame.UpdateSVG) this.#frame.UpdateSVG();
            if(this.#sign.UpdateSVG) this.#sign.UpdateSVG();
            if(this.#production.UpdateSVG) this.#production.UpdateSVG();
            if(this.#install.UpdateSVG) this.#install.UpdateSVG();
            if(this.#artwork.UpdateSVG) this.#artwork.UpdateSVG();

            this.#dragZoomSVG.onZoom();
      }

      /**
       * @CalledBy DragZoomCanvas
       */
      draw = () => {
            this.#leg.Update();
            this.#baseplate.Update();
            this.#frame.Update();
            this.#footing.Update();
            this.#sign.Update();
            // this.#install.Update();

            //this.#artwork.Update();
            groundLevel = yOffset + this.#leg.legHeightAboveGround;
            this.updateSignFrameSize();


            this.#leg.Draw(this.#frame, this.#baseplate, this.#footing);

            this.#baseplate.Draw(this.#leg, this.#frame);

            this.#frame.Draw(this.#leg);

            this.#footing.Draw(this.#leg, this.#frame);

            this.#sign.Draw(this.#leg, this.#frame);

            if(this.#leg.legRequired) {
                  this.drawGroundLevel();
            }

            this.drawDescriptors();
      };

      hide() {
            super.hide();
      }

      tick() {
            this.tickUpdate();
      }

      tickUpdate() {

      }

      onWindowResize(event) {
            super.onWindowResize(event);
      }
}
