class FrameSubscribable extends Material {
      static DISPLAY_NAME = "FRAME";
      static CORNER_TYPES = {
            mitred45: "Mitred 45",
            buttWeld: "Butt Weld"
      };
      static PRODUCTION_DEFAULTS = {
            setupMins: 12,
            minsPerPiece: 0.75,
            minsPerCorner: 3,
            minsPerTee: 1.5,
            minsPerCross: 2
      };
      static FRAME_KEYWORDS = ["RHS - ", "SHS - ", "Angle - "];
      static JOIN_PREFERENCES = {
            verticalFull: "Verticals Full Length",
            horizontalFull: "Horizontals Full Length"
      };

      #inheritedSizeTable;
      #materialType;
      #partDropdown;
      #verticals;
      #horizontals;
      #framePiecesX;
      #framePiecesY;
      #cornerType;
      #joinPreference;
      #faceField;
      #depthField;
      #wallField;
      #totalLengthField;
      #productionTimeField;
      #summaryField;
      #f_production;
      #productionSubscribable;
      #visualiser;
      #visualiserContainer;
      #dataForSubscribers = [];
      #latestVisualiserSvgText = "";
      #measurements = [];

      /*override*/get Type() {return "FRAME";}
      get backgroundColor() {return COLOUR.DarkGrey;}
      get textColor() {return COLOUR.White;}

      get materialType() {return this.#materialType[1].value;}
      set materialType(value) {
            this.#materialType[1].value = value;
            this.#refreshPartOptions();
            this.UpdateFromFields();
      }

      get framePartName() {return this.#partDropdown[1].value;}
      set framePartName(value) {
            this.#refreshPartOptions(value);
            this.UpdateFromFields();
      }

      get verticals() {return zeroIfNaNNullBlank(this.#verticals[1].value);}
      set verticals(value) {$(this.#verticals[1]).val(value).change();}

      get horizontals() {return zeroIfNaNNullBlank(this.#horizontals[1].value);}
      set horizontals(value) {$(this.#horizontals[1]).val(value).change();}
      get framePiecesX() {return Math.max(1, zeroIfNaNNullBlank(this.#framePiecesX[1].value));}
      set framePiecesX(value) {$(this.#framePiecesX[1]).val(value).change();}
      get framePiecesY() {return Math.max(1, zeroIfNaNNullBlank(this.#framePiecesY[1].value));}
      set framePiecesY(value) {$(this.#framePiecesY[1]).val(value).change();}

      get cornerType() {return this.#cornerType[1].value;}
      set cornerType(value) {$(this.#cornerType[1]).val(value).change();}

      get joinPreference() {return this.#joinPreference[1].value;}
      set joinPreference(value) {$(this.#joinPreference[1]).val(value).change();}

      constructor(parentContainer, lhsMenuWindow, options = {UPDATES_PAUSED: false}) {
            super(parentContainer, lhsMenuWindow, options);

            const inheritedContainer = createDivStyle5(null, "Inherited Sizes", this.container)[1];
            this.#inheritedSizeTable = new Table(inheritedContainer, "100%", 20, 250);
            this.#inheritedSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";
            this.#inheritedSizeTable.setHeading("Qty", "Width", "Height");
            this.#inheritedSizeTable.addRow("-", "-", "-");

            const frameContainer = createDivStyle5(null, "Frame Setup", this.container)[1];
            this.#materialType = createDropdown_Infield("Material Type", 0, "width:180px;", [
                  createDropdownOption("Steel", "Steel"),
                  createDropdownOption("Aluminium", "Aluminium")
            ], () => {
                  this.#refreshPartOptions();
                  this.UpdateFromFields();
            }, frameContainer);
            this.#partDropdown = createDropdown_Infield("Section", 0, "width:48%;", [], () => {this.UpdateFromFields();}, frameContainer);
            this.#verticals = createInput_Infield("Verticals", 0, "width:120px;", () => {this.UpdateFromFields();}, frameContainer, true, 1);
            this.#horizontals = createInput_Infield("Horizontals", 0, "width:120px;", () => {this.UpdateFromFields();}, frameContainer, true, 1);
            this.#framePiecesX = createInput_Infield("Frame Pieces X", 1, "width:120px;", () => {this.UpdateFromFields();}, frameContainer, true, 1);
            this.#framePiecesY = createInput_Infield("Frame Pieces Y", 1, "width:120px;", () => {this.UpdateFromFields();}, frameContainer, true, 1);
            this.#cornerType = createDropdown_Infield("Corner Type", 0, "width:180px;", [
                  createDropdownOption(FrameSubscribable.CORNER_TYPES.mitred45, FrameSubscribable.CORNER_TYPES.mitred45),
                  createDropdownOption(FrameSubscribable.CORNER_TYPES.buttWeld, FrameSubscribable.CORNER_TYPES.buttWeld)
            ], () => {this.UpdateFromFields();}, frameContainer);
            this.#joinPreference = createDropdown_Infield("Join Preference", 0, "width:220px;", [
                  createDropdownOption(FrameSubscribable.JOIN_PREFERENCES.verticalFull, FrameSubscribable.JOIN_PREFERENCES.verticalFull),
                  createDropdownOption(FrameSubscribable.JOIN_PREFERENCES.horizontalFull, FrameSubscribable.JOIN_PREFERENCES.horizontalFull)
            ], () => {this.UpdateFromFields();}, frameContainer);

            const statsContainer = createDivStyle5(null, "Stats", this.container)[1];
            this.#faceField = createInput_Infield("Face", 0, "width:110px;", () => {}, statsContainer, false, 0.1, {postfix: "mm"});
            this.#depthField = createInput_Infield("Depth", 0, "width:110px;", () => {}, statsContainer, false, 0.1, {postfix: "mm"});
            this.#wallField = createInput_Infield("Wall", 0, "width:110px;", () => {}, statsContainer, false, 0.1, {postfix: "mm"});
            this.#totalLengthField = createInput_Infield("Total Length", 0, "width:160px;", () => {}, statsContainer, false, 1, {postfix: "mm"});
            this.#productionTimeField = createInput_Infield("Welding Time", 0, "width:160px;", () => {}, statsContainer, false, 1, {postfix: "mins"});
            setFieldDisabled(true, this.#faceField[1], this.#faceField[0]);
            setFieldDisabled(true, this.#depthField[1], this.#depthField[0]);
            setFieldDisabled(true, this.#wallField[1], this.#wallField[0]);
            setFieldDisabled(true, this.#totalLengthField[1], this.#totalLengthField[0]);
            setFieldDisabled(true, this.#productionTimeField[1], this.#productionTimeField[0]);

            this.#visualiserContainer = createDivStyle5(null, "Visualiser", this.container)[1];
            this.#visualiserContainer.style.cssText += "padding:10px;";

            const productionContainer = createDivStyle5(null, "Frame Production", this.container)[1];
            this.#f_production = new Production(productionContainer, null, function() { }, null);
            this.#f_production.showContainerDiv = true;
            this.#f_production.productionTime = 0;
            this.#f_production.headerName = "Frame Production";
            this.#f_production.required = true;
            this.#f_production.showRequiredCkb = false;
            this.#f_production.requiredName = "Required";
            this.#productionSubscribable = this.#f_production;

            const summaryContainer = createDivStyle5(null, "Cut Notes", this.container)[1];
            this.#summaryField = createTextarea("Cut Notes", "", "width:calc(100% - 20px);margin:10px;height:220px;", () => {}, summaryContainer);
            setFieldDisabled(true, this.#summaryField);

            this.#refreshPartOptions();
            this.UpdateFromFields();
      }

      UpdateFromFields() {
            if(this.UPDATES_PAUSED) return;

            super.UpdateFromFields();
            const frameEntries = this.#collectFrameEntries();
            this.#dataForSubscribers = frameEntries;
            this.#renderInheritedSizes(frameEntries);
            this.#renderStats(frameEntries);
            this.#renderVisualiser(frameEntries[0] || null);
            this.#renderProductionSpecs(frameEntries);
            this.#renderCutNotes(frameEntries);
            this.DATA_FOR_SUBSCRIBERS = {
                  parent: this,
                  data: frameEntries
            };
            this.UpdateSubscribedLabel();
            this.PushToSubscribers();
      }

      #renderInheritedSizes(frameEntries) {
            this.#inheritedSizeTable.deleteAllRows();
            if(frameEntries.length === 0) {
                  this.#inheritedSizeTable.addRow("-", "-", "-");
                  return;
            }
            for(let i = 0; i < frameEntries.length; i++) {
                  this.#inheritedSizeTable.addRow(frameEntries[i].QWHD.qty, roundNumber(frameEntries[i].QWHD.width, 2), roundNumber(frameEntries[i].QWHD.height, 2));
            }
      }

      #renderStats(frameEntries) {
            const firstEntry = frameEntries[0];
            if(!firstEntry) {
                  this.#faceField[1].value = 0;
                  this.#depthField[1].value = 0;
                  this.#wallField[1].value = 0;
                  this.#totalLengthField[1].value = 0;
                  this.#productionTimeField[1].value = 0;
                  return;
            }

            this.#faceField[1].value = roundNumber(firstEntry.section.face, 2);
            this.#depthField[1].value = roundNumber(firstEntry.section.depth, 2);
            this.#wallField[1].value = roundNumber(firstEntry.section.wall, 2);
            this.#totalLengthField[1].value = roundNumber(firstEntry.totalLengthMmPerFrame, 2);

            let totalProductionMins = 0;
            for(let i = 0; i < frameEntries.length; i++) {
                  totalProductionMins += frameEntries[i].productionTimeMins;
            }
            this.#productionTimeField[1].value = roundNumber(totalProductionMins, 2);
      }



      #renderProductionSpecs(frameEntries) {
            if(!this.#f_production) return;
            let totalProductionMins = 0;
            let headerName = "Frame Production";
            for(let i = 0; i < frameEntries.length; i++) {
                  totalProductionMins += zeroIfNaNNullBlank(frameEntries[i].productionTimeMins);
                  if(frameEntries[i].productionLabel) headerName = frameEntries[i].productionLabel;
            }
            this.#f_production.productionTime = roundNumber(totalProductionMins, 2);
            this.#f_production.headerName = headerName;
            this.#f_production.required = totalProductionMins > 0;
      }

      #renderCutNotes(frameEntries) {
            if(frameEntries.length === 0) {
                  this.#summaryField.value = "";
                  return;
            }

            const notes = [];
            for(let i = 0; i < frameEntries.length; i++) {
                  const entry = frameEntries[i];
                  notes.push("Frame " + (i + 1) + ": x" + entry.QWHD.qty + " @ " + roundNumber(entry.QWHD.width, 2) + "W x " + roundNumber(entry.QWHD.height, 2) + "H");
                  notes.push(entry.cutNotes);
            }
            this.#summaryField.value = notes.join("\n\n");
      }

      #renderVisualiser(frameEntry) {
            if(this.#measurements?.length) {
                  for(let i = this.#measurements.length - 1; i >= 0; i--) this.#measurements[i]?.Delete?.();
                  this.#measurements = [];
            }
            if(this.#visualiser?.Close) this.#visualiser.Close();
            this.#visualiserContainer.innerHTML = "";

            if(!frameEntry || frameEntry.QWHD.width <= 0 || frameEntry.QWHD.height <= 0) {
                  this.#latestVisualiserSvgText = "";
                  return;
            }

            const width = frameEntry.QWHD.width;
            const height = frameEntry.QWHD.height;
            const piecesX = Math.max(1, frameEntry.piecesX || 1);
            const piecesY = Math.max(1, frameEntry.piecesY || 1);
            const pieceWidth = width / piecesX;
            const pieceHeight = height / piecesY;
            const face = Math.max(frameEntry.section.face, 1);
            const memberThickness = Math.max(face, 1);
            const memberColor = frameEntry.materialType === "Aluminium" ? "#9eb7c7" : "#5f666c";
            const dimensionColor = "#1f4f89";

            let svgContent = [];
            let joinContent = [];
            const joinStroke = Math.max(memberThickness * 0.15, 1);
            const addRect = (x, y, w, h) => {
                  svgContent.push(`<rect x="${x}" y="${y}" width="${Math.max(w, 0)}" height="${Math.max(h, 0)}" fill="${memberColor}"/>`);
            };
            const addJoinLine = (x1, y1, x2, y2) => {
                  joinContent.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#111" stroke-width="${joinStroke}" stroke-linecap="round"/>`);
            };

            const drawFrameInstance = (ox, oy, w, h) => {
                  const verticalSpacing = frameEntry.verticals > 0 ? w / (frameEntry.verticals + 1) : 0;
                  const horizontalSpacing = frameEntry.horizontals > 0 ? h / (frameEntry.horizontals + 1) : 0;

                  if(frameEntry.cornerType === FrameSubscribable.CORNER_TYPES.buttWeld) {
                        if(frameEntry.joinPreference === FrameSubscribable.JOIN_PREFERENCES.horizontalFull) {
                              addRect(ox, oy, w, memberThickness);
                              addRect(ox, oy + Math.max(h - memberThickness, 0), w, memberThickness);
                              addRect(ox, oy + memberThickness, memberThickness, Math.max(h - memberThickness * 2, 0));
                              addRect(ox + Math.max(w - memberThickness, 0), oy + memberThickness, memberThickness, Math.max(h - memberThickness * 2, 0));
                              addJoinLine(ox, oy + memberThickness, ox + memberThickness, oy + memberThickness);
                              addJoinLine(ox + w - memberThickness, oy + memberThickness, ox + w, oy + memberThickness);
                              addJoinLine(ox, oy + h - memberThickness, ox + memberThickness, oy + h - memberThickness);
                              addJoinLine(ox + w - memberThickness, oy + h - memberThickness, ox + w, oy + h - memberThickness);
                        } else {
                              addRect(ox, oy, memberThickness, h);
                              addRect(ox + Math.max(w - memberThickness, 0), oy, memberThickness, h);
                              addRect(ox + memberThickness, oy, Math.max(w - memberThickness * 2, 0), memberThickness);
                              addRect(ox + memberThickness, oy + Math.max(h - memberThickness, 0), Math.max(w - memberThickness * 2, 0), memberThickness);
                              addJoinLine(ox + memberThickness, oy, ox + memberThickness, oy + memberThickness);
                              addJoinLine(ox + w - memberThickness, oy, ox + w - memberThickness, oy + memberThickness);
                              addJoinLine(ox + memberThickness, oy + h - memberThickness, ox + memberThickness, oy + h);
                              addJoinLine(ox + w - memberThickness, oy + h - memberThickness, ox + w - memberThickness, oy + h);
                        }
                  } else {
                        addRect(ox, oy, w, memberThickness);
                        addRect(ox, oy + Math.max(h - memberThickness, 0), w, memberThickness);
                        addRect(ox, oy, memberThickness, h);
                        addRect(ox + Math.max(w - memberThickness, 0), oy, memberThickness, h);
                        const jl = memberThickness;
                        addJoinLine(ox, oy, ox + jl, oy + jl);
                        addJoinLine(ox + w, oy, ox + w - jl, oy + jl);
                        addJoinLine(ox, oy + h, ox + jl, oy + h - jl);
                        addJoinLine(ox + w, oy + h, ox + w - jl, oy + h - jl);
                  }

                  if(frameEntry.joinPreference === FrameSubscribable.JOIN_PREFERENCES.verticalFull) {
                        for(let i = 0; i < frameEntry.verticals; i++) {
                              const x = ox + verticalSpacing * (i + 1) - memberThickness / 2;
                              addRect(x, oy, memberThickness, h);
                        }
                        for(let i = 0; i < frameEntry.horizontals; i++) {
                              const y = oy + horizontalSpacing * (i + 1) - memberThickness / 2;
                              for(let seg = 0; seg < frameEntry.verticals + 1; seg++) {
                                    const sx = seg === 0 ? ox : ox + verticalSpacing * seg + memberThickness / 2;
                                    const ex = seg === frameEntry.verticals ? ox + w : ox + verticalSpacing * (seg + 1) - memberThickness / 2;
                                    addRect(sx, y, Math.max(ex - sx, 0), memberThickness);
                              }
                        }
                  } else {
                        for(let i = 0; i < frameEntry.horizontals; i++) {
                              const y = oy + horizontalSpacing * (i + 1) - memberThickness / 2;
                              addRect(ox, y, w, memberThickness);
                        }
                        for(let i = 0; i < frameEntry.verticals; i++) {
                              const x = ox + verticalSpacing * (i + 1) - memberThickness / 2;
                              for(let seg = 0; seg < frameEntry.horizontals + 1; seg++) {
                                    const sy = seg === 0 ? oy : oy + horizontalSpacing * seg + memberThickness / 2;
                                    const ey = seg === frameEntry.horizontals ? oy + h : oy + horizontalSpacing * (seg + 1) - memberThickness / 2;
                                    addRect(x, sy, memberThickness, Math.max(ey - sy, 0));
                              }
                        }
                  }
            };

            for(let py = 0; py < piecesY; py++) {
                  for(let px = 0; px < piecesX; px++) {
                        drawFrameInstance(px * pieceWidth, py * pieceHeight, pieceWidth, pieceHeight);
                  }
            }

            const svgText = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="${-width * 0.15} ${-height * 0.18} ${width * 1.3} ${height * 1.36}"><g id="mainGcreatedByT" transform="matrix(1 0 0 1 0 0)">${svgContent.join("")}${joinContent.join("")}</g><g><text x="${width / 2}" y="-12" fill="${dimensionColor}" font-size="14" font-family="Arial, sans-serif" text-anchor="middle">${roundNumber(width, 2)}mm</text><text x="-12" y="${height / 2}" fill="${dimensionColor}" font-size="14" font-family="Arial, sans-serif" text-anchor="middle" transform="rotate(-90 -12 ${height / 2})">${roundNumber(height, 2)}mm</text></g></svg>`;

            this.#visualiser = new DragZoomSVG("100%", "360px", svgText, this.#visualiserContainer, {
                  overrideCssStyles: "background:#f7f7f7;border:1px solid #d8d8d8;box-sizing:border-box;",
                  convertShapesToPaths: false,
                  splitCompoundPaths: false
            });
            this.#visualiser.centerAndFitSVGContent();

            this.#measurements.push(new TSVGMeasurement(this.#visualiser.svgG, {direction: "width", x1: 0, y1: 0, x2: width, y2: 0, autoLabel: true, text: roundNumber(width, 2) + " mm", deletable: true, unit: "mm", precision: 2, scale: 1, arrowSize: 10 / this.#visualiser.scale, textOffset: 10 / this.#visualiser.scale, stroke: "#000", sides: ["top"], lineWidth: 2 / this.#visualiser.scale, fontSize: 12 / this.#visualiser.scale + "px", tickLength: 20 / this.#visualiser.scale, handleRadius: 8 / this.#visualiser.scale, offsetX: 0, offsetY: -20 / this.#visualiser.scale}));
            this.#measurements.push(new TSVGMeasurement(this.#visualiser.svgG, {direction: "height", x1: 0, y1: 0, x2: 0, y2: height, autoLabel: true, text: roundNumber(height, 2) + " mm", deletable: true, unit: "mm", precision: 2, scale: 1, arrowSize: 10 / this.#visualiser.scale, textOffset: 10 / this.#visualiser.scale, stroke: "#000", sides: ["left"], lineWidth: 2 / this.#visualiser.scale, fontSize: 12 / this.#visualiser.scale + "px", tickLength: 20 / this.#visualiser.scale, handleRadius: 8 / this.#visualiser.scale, offsetX: -20 / this.#visualiser.scale, offsetY: 0, sideHint: "left"}));

            if(piecesX > 1) this.#measurements.push(new TSVGMeasurement(this.#visualiser.svgG, {direction: "width", x1: 0, y1: height, x2: pieceWidth, y2: height, autoLabel: true, text: roundNumber(pieceWidth, 2) + " mm", deletable: true, unit: "mm", precision: 2, scale: 1, arrowSize: 10 / this.#visualiser.scale, textOffset: 10 / this.#visualiser.scale, stroke: "#000", sides: ["bottom"], lineWidth: 2 / this.#visualiser.scale, fontSize: 12 / this.#visualiser.scale + "px", tickLength: 20 / this.#visualiser.scale, handleRadius: 8 / this.#visualiser.scale, offsetX: 0, offsetY: 20 / this.#visualiser.scale}));
            if(piecesY > 1) this.#measurements.push(new TSVGMeasurement(this.#visualiser.svgG, {direction: "height", x1: width, y1: 0, x2: width, y2: pieceHeight, autoLabel: true, text: roundNumber(pieceHeight, 2) + " mm", deletable: true, unit: "mm", precision: 2, scale: 1, arrowSize: 10 / this.#visualiser.scale, textOffset: 10 / this.#visualiser.scale, stroke: "#000", sides: ["right"], lineWidth: 2 / this.#visualiser.scale, fontSize: 12 / this.#visualiser.scale + "px", tickLength: 20 / this.#visualiser.scale, handleRadius: 8 / this.#visualiser.scale, offsetX: 20 / this.#visualiser.scale, offsetY: 0}));

            this.#latestVisualiserSvgText = this.#visualiser.unscaledSVGString || svgText;
      }

      #collectFrameEntries() {
            const result = [];
            const selectedPart = this.#getSelectedPart();
            const section = this.#parseSectionDimensions(selectedPart?.Name || this.framePartName);
            if(!selectedPart || !section) return result;

            const subscriptions = this.SUBSCRIPTION_DATA;
            for(let s = 0; s < subscriptions.length; s++) {
                  const subscription = subscriptions[s];
                  for(let i = 0; i < subscription.data.length; i++) {
                        const qwhd = subscription.data[i]?.QWHD;
                        if(!qwhd || qwhd.width <= 0 || qwhd.height <= 0 || qwhd.qty <= 0) continue;
                        result.push(this.#buildEntryFromQwhd(qwhd, selectedPart, section));
                  }
            }

            return result;
      }

      #buildEntryFromQwhd(qwhd, selectedPart, section) {
            const face = Math.max(section.face, 0);
            const width = zeroIfNaNNullBlank(qwhd.width);
            const height = zeroIfNaNNullBlank(qwhd.height);
            const piecesX = this.framePiecesX;
            const piecesY = this.framePiecesY;
            const pieceMultiplier = Math.max(1, piecesX * piecesY);
            const pieceWidth = width / piecesX;
            const pieceHeight = height / piecesY;
            const verticals = this.verticals;
            const horizontals = this.horizontals;
            const cornerType = this.cornerType;
            const joinPreference = this.joinPreference;

            const members = [];
            const addMember = (qty, length, label, cutType) => {
                  const safeQty = Math.max(Math.round(qty), 0);
                  const safeLength = Math.max(roundNumber(length, 2), 0);
                  if(safeQty <= 0 || safeLength <= 0) return;
                  members.push({qty: safeQty, length: safeLength, label, cutType});
            };

            let edgeVerticalLength = pieceHeight;
            let internalVerticalLength = height;
            let horizontalSegmentLength = width;
            let outerHorizontalLength = pieceWidth;
            let outerVerticalQty = 2;
            let cornerJointCount = 4;
            let teeToOuterSides = horizontals * 2;

            if(cornerType === FrameSubscribable.CORNER_TYPES.mitred45) {
                  edgeVerticalLength = pieceHeight;
                  internalVerticalLength = Math.max(pieceHeight - face * 2, 0);
                  horizontalSegmentLength = Math.max((pieceWidth - face * 2 - verticals * face) / Math.max(verticals + 1, 1), 0);
            } else if(cornerType === FrameSubscribable.CORNER_TYPES.buttWeld) {
                  if(joinPreference === FrameSubscribable.JOIN_PREFERENCES.horizontalFull) {
                        edgeVerticalLength = Math.max(pieceHeight - face * 2, 0);
                        internalVerticalLength = Math.max((height - horizontals * face) / Math.max(horizontals + 1, 1), 0);
                        outerHorizontalLength = pieceWidth;
                        horizontalSegmentLength = Math.max(pieceWidth - face * 2, 0);
                  } else {
                        edgeVerticalLength = pieceHeight;
                        internalVerticalLength = Math.max(pieceHeight - face * 2, 0);
                        outerHorizontalLength = Math.max(pieceWidth - face * 2, 0);
                        horizontalSegmentLength = Math.max((pieceWidth - face * 2 - verticals * face) / Math.max(verticals + 1, 1), 0);
                  }
            }

            addMember(2 * pieceMultiplier, outerHorizontalLength, "Outer Horizontal", cornerType === FrameSubscribable.CORNER_TYPES.mitred45 ? "mitred" : "straight");
            addMember(outerVerticalQty * pieceMultiplier, edgeVerticalLength, "Outer Vertical", cornerType === FrameSubscribable.CORNER_TYPES.mitred45 ? "mitred" : "straight");
            if(joinPreference === FrameSubscribable.JOIN_PREFERENCES.verticalFull) {
                  addMember(verticals * pieceMultiplier, internalVerticalLength, "Internal Vertical", "straight");
                  addMember(horizontals * Math.max(verticals + 1, 1) * pieceMultiplier, horizontalSegmentLength, "Internal Horizontal", "straight");
            } else {
                  addMember(verticals * Math.max(horizontals + 1, 1) * pieceMultiplier, Math.max((pieceHeight - horizontals * face) / Math.max(horizontals + 1, 1), 0), "Internal Vertical", "straight");
                  addMember(horizontals * pieceMultiplier, Math.max(pieceWidth - face * 2, 0), "Internal Horizontal", "straight");
            }

            let totalLengthMmPerFrame = 0;
            let totalPiecesPerFrame = 0;
            for(let i = 0; i < members.length; i++) {
                  totalLengthMmPerFrame += members[i].qty * members[i].length;
                  totalPiecesPerFrame += members[i].qty;
            }

            const teeJoints = verticals * 2 + teeToOuterSides;
            const crossJoints = 0;
            const totalProductionMins = roundNumber(
                  FrameSubscribable.PRODUCTION_DEFAULTS.setupMins +
                  totalPiecesPerFrame * FrameSubscribable.PRODUCTION_DEFAULTS.minsPerPiece +
                  cornerJointCount * FrameSubscribable.PRODUCTION_DEFAULTS.minsPerCorner +
                  teeJoints * FrameSubscribable.PRODUCTION_DEFAULTS.minsPerTee +
                  crossJoints * FrameSubscribable.PRODUCTION_DEFAULTS.minsPerCross,
                  2
            ) * qwhd.qty;

            const cutLines = members.map((member) => "x" + member.qty + " @ " + roundNumber(member.length, 2) + "mm - " + member.label + " (" + member.cutType + ")");
            const cutNotes = [
                  "Section: " + selectedPart.Name,
                  "Corner Type: " + cornerType,
                  "Total Length per Frame: " + roundNumber(totalLengthMmPerFrame, 2) + "mm",
                  "Corners: " + cornerJointCount + ", Tee Joints: " + teeJoints + ", Cross Joints: " + crossJoints,
                  "Cut To:",
                  cutLines.join("\n")
            ].join("\n");

            return {
                  QWHD: new QWHD(qwhd.qty, qwhd.width, qwhd.height, qwhd.depth),
                  materialType: this.materialType,
                  partName: selectedPart.Name,
                  section,
                  verticals,
                  horizontals,
                  joinPreference,
                  piecesX,
                  piecesY,
                  cornerType,
                  members,
                  totalLengthMmPerFrame,
                  productionTimeMins: totalProductionMins,
                  productionLabel: "WELDING",
                  productionPartDescription: "[WELDING]",
                  cutNotes,
                  joints: this.#buildJointMarkers(width, height, verticals, horizontals, cornerJointCount > 0)
            };
      }

      #buildJointMarkers(width, height, verticals, horizontals, hasCorners) {
            const corners = [];
            if(hasCorners) {
                  corners.push({x: 0, y: 0}, {x: width, y: 0}, {x: 0, y: height}, {x: width, y: height});
            }

            const tees = [];
            const crosses = [];
            const verticalSpacing = verticals > 0 ? width / (verticals + 1) : 0;
            const horizontalSpacing = horizontals > 0 ? height / (horizontals + 1) : 0;

            for(let i = 0; i < verticals; i++) {
                  const x = verticalSpacing * (i + 1);
                  tees.push({x, y: 0});
                  tees.push({x, y: height});
            }
            for(let i = 0; i < horizontals; i++) {
                  const y = horizontalSpacing * (i + 1);
                  if(hasCorners) {
                        tees.push({x: 0, y});
                        tees.push({x: width, y});
                  }
                  
            }

            return {corners, tees, crosses};
      }

      #getSelectedPart() {
            if(typeof predefinedParts_obj === "undefined" || !Array.isArray(predefinedParts_obj)) return null;
            for(let i = 0; i < predefinedParts_obj.length; i++) {
                  if(predefinedParts_obj[i].Name === this.framePartName) return predefinedParts_obj[i];
            }
            return null;
      }

      #getFrameCapableParts() {
            if(typeof predefinedParts_obj === "undefined" || !Array.isArray(predefinedParts_obj)) return [];

            const family = this.materialType;
            const results = predefinedParts_obj.filter((part) => {
                  if(!part?.Name) return false;
                  if(!part.Name.includes(family)) return false;
                  for(let i = 0; i < FrameSubscribable.FRAME_KEYWORDS.length; i++) {
                        if(part.Name.includes(FrameSubscribable.FRAME_KEYWORDS[i])) return true;
                  }
                  return false;
            });

            results.sort((a, b) => a.Name.localeCompare(b.Name));
            return results;
      }

      #refreshPartOptions(preferredName = null) {
            const partField = this.#partDropdown[1];
            const currentValue = preferredName || partField.value;
            while(partField.options.length > 0) {
                  partField.remove(0);
            }

            const parts = this.#getFrameCapableParts();
            for(let i = 0; i < parts.length; i++) {
                  partField.add(createDropdownOption(parts[i].Name, parts[i].Name));
            }

            if(parts.length === 0) {
                  partField.add(createDropdownOption("No matching frame parts found", ""));
                  partField.value = "";
                  return;
            }

            const matchedValue = parts.find((part) => part.Name === currentValue)?.Name || parts[0].Name;
            partField.value = matchedValue;
      }

      #parseSectionDimensions(partName) {
            if(!partName) return null;
            const compactName = ("" + partName).replaceAll(" ", "");
            const match = compactName.match(/(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)(?:x(\d+(?:\.\d+)?))?/);
            if(!match) return null;

            return {
                  face: zeroIfNaNNullBlank(parseFloat(match[1])),
                  depth: zeroIfNaNNullBlank(parseFloat(match[2])),
                  wall: zeroIfNaNNullBlank(parseFloat(match[3]))
            };
      }

      getSerializedState() {
            return {
                  materialType: this.materialType,
                  framePartName: this.framePartName,
                  verticals: this.verticals,
                  horizontals: this.horizontals,
                  cornerType: this.cornerType,
                  joinPreference: this.joinPreference,
                  framePiecesX: this.framePiecesX,
                  framePiecesY: this.framePiecesY
            };
      }

      applySerializedState(state = {}) {
            if(!state || typeof state !== "object") return;
            if(state.materialType !== undefined) this.materialType = state.materialType;
            if(state.framePartName !== undefined) this.framePartName = state.framePartName;
            if(state.verticals !== undefined) this.verticals = state.verticals;
            if(state.horizontals !== undefined) this.horizontals = state.horizontals;
            if(state.cornerType !== undefined) this.cornerType = state.cornerType;
            if(state.joinPreference !== undefined) this.joinPreference = state.joinPreference;
            if(state.framePiecesX !== undefined) this.framePiecesX = state.framePiecesX;
            if(state.framePiecesY !== undefined) this.framePiecesY = state.framePiecesY;
            this.UpdateFromFields();
      }

      async Create(productNo, partIndex) {
            partIndex = await super.Create(productNo, partIndex);
            for(let i = 0; i < this.#dataForSubscribers.length; i++) {
                  const entry = this.#dataForSubscribers[i];
                  partIndex = await q_AddPart_DimensionWH(
                        productNo,
                        partIndex,
                        true,
                        entry.partName,
                        entry.QWHD.qty,
                        entry.totalLengthMmPerFrame,
                        null,
                        "[FRAME] " + entry.partName,
                        null,
                        false,
                        (entry.cutNotes || "") + "\n\n" + (this.#latestVisualiserSvgText || "")
                  );
            }
            if(this.#f_production) partIndex = await this.#f_production.Create(productNo, partIndex);
            else if(this.#productionSubscribable?.Create) partIndex = await this.#productionSubscribable.Create(productNo, partIndex);
            return partIndex;
      }

      Description() {
            if(!this.framePartName) return "";
            return "[FRAME] " + this.framePartName;
      }
}
