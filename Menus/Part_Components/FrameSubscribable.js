class FrameSubscribable extends Material {
      static DISPLAY_NAME = "FRAME";
      static CORNER_TYPES = {
            mitred45: "Mitred 45",
            buttWeld: "Butt Weld",
            openCorners: "Open Corners",
            squareCut: "Square Cut",
            radiusCorners: "Radius Corners"
      };
      static PRODUCTION_DEFAULTS = {
            setupMins: 12,
            minsPerPiece: 0.75,
            minsPerCorner: 3,
            minsPerTee: 1.5,
            minsPerCross: 2
      };
      static FRAME_KEYWORDS = ["RHS - ", "SHS - ", "Angle - "];

      #inheritedSizeTable;
      #materialType;
      #partDropdown;
      #verticals;
      #horizontals;
      #cornerType;
      #faceField;
      #depthField;
      #wallField;
      #totalLengthField;
      #productionTimeField;
      #summaryField;
      #visualiser;
      #dataForSubscribers = [];

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

      get cornerType() {return this.#cornerType[1].value;}
      set cornerType(value) {$(this.#cornerType[1]).val(value).change();}

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
            this.#cornerType = createDropdown_Infield("Corner Type", 0, "width:180px;", [
                  createDropdownOption(FrameSubscribable.CORNER_TYPES.mitred45, FrameSubscribable.CORNER_TYPES.mitred45),
                  createDropdownOption(FrameSubscribable.CORNER_TYPES.buttWeld, FrameSubscribable.CORNER_TYPES.buttWeld),
                  createDropdownOption(FrameSubscribable.CORNER_TYPES.openCorners, FrameSubscribable.CORNER_TYPES.openCorners),
                  createDropdownOption(FrameSubscribable.CORNER_TYPES.squareCut, FrameSubscribable.CORNER_TYPES.squareCut),
                  createDropdownOption(FrameSubscribable.CORNER_TYPES.radiusCorners, FrameSubscribable.CORNER_TYPES.radiusCorners)
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

            const visualiserContainer = createDivStyle5(null, "Visualiser", this.container)[1];
            this.#visualiser = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            this.#visualiser.setAttribute("viewBox", "0 0 500 360");
            this.#visualiser.setAttribute("preserveAspectRatio", "xMidYMid meet");
            this.#visualiser.style.cssText = "display:block;width:100%;height:360px;background:#f7f7f7;border:1px solid #d8d8d8;box-sizing:border-box;";
            visualiserContainer.appendChild(this.#visualiser);

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
            while(this.#visualiser.firstChild) {
                  this.#visualiser.removeChild(this.#visualiser.firstChild);
            }

            if(!frameEntry || frameEntry.QWHD.width <= 0 || frameEntry.QWHD.height <= 0) return;

            const svgNs = "http://www.w3.org/2000/svg";
            const width = frameEntry.QWHD.width;
            const height = frameEntry.QWHD.height;
            const face = Math.max(frameEntry.section.face, 1);
            const margin = 55;
            const drawWidth = 500 - margin * 2;
            const drawHeight = 360 - margin * 2;
            const scale = Math.min(drawWidth / width, drawHeight / height);
            const ox = (500 - width * scale) / 2;
            const oy = (360 - height * scale) / 2;
            const stroke = Math.max(face * scale, 4);

            const addLine = (x1, y1, x2, y2, color, lineWidth, dashArray = "") => {
                  const line = document.createElementNS(svgNs, "line");
                  line.setAttribute("x1", x1);
                  line.setAttribute("y1", y1);
                  line.setAttribute("x2", x2);
                  line.setAttribute("y2", y2);
                  line.setAttribute("stroke", color);
                  line.setAttribute("stroke-width", lineWidth);
                  line.setAttribute("stroke-linecap", "square");
                  if(dashArray) line.setAttribute("stroke-dasharray", dashArray);
                  this.#visualiser.appendChild(line);
                  return line;
            };
            const addText = (textValue, x, y, fill, fontSize = 13, anchor = "middle") => {
                  const text = document.createElementNS(svgNs, "text");
                  text.setAttribute("x", x);
                  text.setAttribute("y", y);
                  text.setAttribute("fill", fill);
                  text.setAttribute("font-size", fontSize);
                  text.setAttribute("font-family", "Arial, sans-serif");
                  text.setAttribute("text-anchor", anchor);
                  text.textContent = textValue;
                  this.#visualiser.appendChild(text);
                  return text;
            };
            const addCircle = (cx, cy, r, fill) => {
                  const circle = document.createElementNS(svgNs, "circle");
                  circle.setAttribute("cx", cx);
                  circle.setAttribute("cy", cy);
                  circle.setAttribute("r", r);
                  circle.setAttribute("fill", fill);
                  this.#visualiser.appendChild(circle);
                  return circle;
            };

            const left = ox;
            const right = ox + width * scale;
            const top = oy;
            const bottom = oy + height * scale;
            const memberColor = frameEntry.materialType === "Aluminium" ? "#9eb7c7" : "#5f666c";
            const indicatorColor = "#d84b3d";
            const dimensionColor = "#1f4f89";

            if(frameEntry.cornerType !== FrameSubscribable.CORNER_TYPES.openCorners) {
                  addLine(left, top, right, top, memberColor, stroke);
                  addLine(left, bottom, right, bottom, memberColor, stroke);
                  addLine(left, top, left, bottom, memberColor, stroke);
                  addLine(right, top, right, bottom, memberColor, stroke);
            } else {
                  addLine(left + stroke / 2, top, right - stroke / 2, top, memberColor, stroke);
                  addLine(left + stroke / 2, bottom, right - stroke / 2, bottom, memberColor, stroke);
            }

            const verticalSpacing = frameEntry.verticals > 0 ? width / (frameEntry.verticals + 1) : 0;
            const horizontalSpacing = frameEntry.horizontals > 0 ? height / (frameEntry.horizontals + 1) : 0;

            for(let i = 0; i < frameEntry.verticals; i++) {
                  const x = left + verticalSpacing * (i + 1) * scale;
                  addLine(x, top, x, bottom, memberColor, stroke * 0.9);
            }
            for(let i = 0; i < frameEntry.horizontals; i++) {
                  const y = top + horizontalSpacing * (i + 1) * scale;
                  addLine(left, y, right, y, memberColor, stroke * 0.9, frameEntry.verticals > 0 ? "0" : "");
            }

            const markers = frameEntry.joints;
            for(let i = 0; i < markers.corners.length; i++) {
                  addCircle(markers.corners[i].x * scale + ox, markers.corners[i].y * scale + oy, 5, indicatorColor);
            }
            for(let i = 0; i < markers.tees.length; i++) {
                  addCircle(markers.tees[i].x * scale + ox, markers.tees[i].y * scale + oy, 4, "#ff9f1c");
            }
            for(let i = 0; i < markers.crosses.length; i++) {
                  addCircle(markers.crosses[i].x * scale + ox, markers.crosses[i].y * scale + oy, 4, "#2a9d8f");
            }

            addLine(left, top - 28, right, top - 28, dimensionColor, 1.5);
            addLine(left, top - 34, left, top - 20, dimensionColor, 1.5);
            addLine(right, top - 34, right, top - 20, dimensionColor, 1.5);
            addText(roundNumber(width, 2) + "mm", (left + right) / 2, top - 36, dimensionColor, 13);

            addLine(left - 28, top, left - 28, bottom, dimensionColor, 1.5);
            addLine(left - 34, top, left - 20, top, dimensionColor, 1.5);
            addLine(left - 34, bottom, left - 20, bottom, dimensionColor, 1.5);
            const heightLabel = addText(roundNumber(height, 2) + "mm", left - 38, (top + bottom) / 2, dimensionColor, 13);
            heightLabel.setAttribute("transform", "rotate(-90 " + (left - 38) + " " + ((top + bottom) / 2) + ")");

            addText(frameEntry.cornerType, 250, 340, "#202020", 13);
            addText("Corners " + markers.corners.length + " | Tees " + markers.tees.length + " | Crosses " + markers.crosses.length, 250, 22, "#202020", 12);
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
            const verticals = this.verticals;
            const horizontals = this.horizontals;
            const cornerType = this.cornerType;

            const members = [];
            const addMember = (qty, length, label, cutType) => {
                  const safeQty = Math.max(Math.round(qty), 0);
                  const safeLength = Math.max(roundNumber(length, 2), 0);
                  if(safeQty <= 0 || safeLength <= 0) return;
                  members.push({qty: safeQty, length: safeLength, label, cutType});
            };

            let edgeVerticalLength = height;
            let internalVerticalLength = height;
            let horizontalSegmentLength = width;
            let outerVerticalQty = 2;
            let cornerJointCount = 4;
            let teeToOuterSides = horizontals * 2;

            if(cornerType === FrameSubscribable.CORNER_TYPES.mitred45 || cornerType === FrameSubscribable.CORNER_TYPES.radiusCorners) {
                  edgeVerticalLength = height;
                  internalVerticalLength = Math.max(height - face * 2, 0);
                  horizontalSegmentLength = Math.max((width - face * 2 - verticals * face) / Math.max(verticals + 1, 1), 0);
            } else if(cornerType === FrameSubscribable.CORNER_TYPES.buttWeld) {
                  edgeVerticalLength = Math.max(height - face * 2, 0);
                  internalVerticalLength = Math.max(height - face * 2, 0);
                  horizontalSegmentLength = Math.max((width - face * 2 - verticals * face) / Math.max(verticals + 1, 1), 0);
            } else if(cornerType === FrameSubscribable.CORNER_TYPES.squareCut) {
                  edgeVerticalLength = height;
                  internalVerticalLength = height;
                  horizontalSegmentLength = Math.max((width - verticals * face) / Math.max(verticals + 1, 1), 0);
            } else if(cornerType === FrameSubscribable.CORNER_TYPES.openCorners) {
                  outerVerticalQty = 0;
                  cornerJointCount = 0;
                  teeToOuterSides = 0;
                  edgeVerticalLength = 0;
                  internalVerticalLength = height;
                  horizontalSegmentLength = Math.max((width - verticals * face) / Math.max(verticals + 1, 1), 0);
            }

            addMember(2, width, "Outer Horizontal", cornerType === FrameSubscribable.CORNER_TYPES.mitred45 ? "mitred" : "straight");
            addMember(outerVerticalQty, edgeVerticalLength, "Outer Vertical", cornerType === FrameSubscribable.CORNER_TYPES.mitred45 ? "mitred" : "straight");
            addMember(verticals, internalVerticalLength, "Internal Vertical", "straight");
            addMember(horizontals * Math.max(verticals + 1, 1), horizontalSegmentLength, "Internal Horizontal", "straight");

            let totalLengthMmPerFrame = 0;
            let totalPiecesPerFrame = 0;
            for(let i = 0; i < members.length; i++) {
                  totalLengthMmPerFrame += members[i].qty * members[i].length;
                  totalPiecesPerFrame += members[i].qty;
            }

            const teeJoints = verticals * 2 + teeToOuterSides;
            const crossJoints = verticals * horizontals;
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
                  for(let v = 0; v < verticals; v++) {
                        const x = verticalSpacing * (v + 1);
                        crosses.push({x, y});
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
                  cornerType: this.cornerType
            };
      }

      applySerializedState(state = {}) {
            if(!state || typeof state !== "object") return;
            if(state.materialType !== undefined) this.materialType = state.materialType;
            if(state.framePartName !== undefined) this.framePartName = state.framePartName;
            if(state.verticals !== undefined) this.verticals = state.verticals;
            if(state.horizontals !== undefined) this.horizontals = state.horizontals;
            if(state.cornerType !== undefined) this.cornerType = state.cornerType;
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
                        entry.cutNotes
                  );
            }
            return partIndex;
      }

      Description() {
            if(!this.framePartName) return "";
            return "[FRAME] " + this.framePartName;
      }
}
