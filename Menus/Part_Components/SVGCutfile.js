class SVGCutfile extends SubscriptionManager {
      /*
                        
      Variables         */
      #Type = "SVG CUTFILE";
      #UNIQUEID = generateUniqueID();
      #productNumber = -1;
      #includeSizeInDescription = false;
      #showIDInContainer = true;
      #backgroundColor = COLOUR.BrightGreen;
      #textColor = COLOUR.White;
      /**
       * @Subscribers
       * @Updated on table changes
       * @example 
       *          [{qty: 4, width: '2440', height: '1220'},
       *           {qty: 4, width: '2440', height: '580'},
       *           {qty: 1, width: '240', height: '1220'},
       *           {qty: 1, width: '240', height: '580'}]
       */
      #dataForSubscribers = [];
      #totalBoundingRectAreas = 0;
      /*
                        
      Fields            */
      #f_container;
      #f_productNumberLabel;
      #f_typeLabel;
      #f_subscribedToLabel;
      #f_visualiser;
      #f_visualiserBtn;
      #f_svgFile;
      #f_deleteBtn;
      #f_fileChooser;
      #f_setting_IncludeSizeInDescription;
      #f_shapeAreas;
      #f_pathArea;
      #f_sizeMethod1;
      #f_sizeMethod2;
      #f_totalBoundingRectAreas;
      #f_lhsMenuWindow;
      #f_width;
      #f_height;
      #f_qty;
      #f_pathLength;
      /*
                        
      Getter            */
      get container() {return this.#f_container;}
      get Type() {return this.#Type;}
      get ID() {return this.#Type + "-" + this.#UNIQUEID;}
      get qty() {return zeroIfNaNNullBlank(this.#f_qty[1].value);}
      get pathLength() {return zeroIfNaNNullBlank(this.#f_pathLength[1].value);}
      get productNumber() {return this.#productNumber;}
      get typeLabel() {return this.#f_typeLabel;}
      get inheritedRowSizeLabel() {return this.#f_subscribedToLabel;}
      get backgroundColor() {return this.#backgroundColor;}
      get textColor() {return this.#textColor;}
      /*
                        
      Setter            */
      set Type(type) {this.#Type = type;};
      set productNumber(value) {this.#productNumber = value; this.#f_productNumberLabel.innerText = value;}
      set qty(value) {$(this.#f_qty[1]).val(value).change();};
      set pathLength(value) {$(this.#f_pathLength[1]).val(value).change();};
      /*
                        
      Start             */
      constructor(parentContainer, lhsMenuWindow) {
            super();
            if(!lhsMenuWindow instanceof LHSMenuWindow) throw new Error('Parameter 2 must be an instance of LHSMenuWindow');
            this.#f_lhsMenuWindow = lhsMenuWindow;

            this.#f_container = document.createElement("div");
            this.#f_container.style =
                  "display: block; float: left; width: calc(100% - 16px);min-height:20px; background-color:" +
                  COLOUR.White +
                  ";border:2px solid;border-color: black;margin:8px;box-shadow: rgb(0 0 0 / 80%) 3px 4px 10px 0px;padding:0px;overflow:hidden;box-sizing: border-box;";
            if(parentContainer != null) parentContainer.appendChild(this.#f_container);
            $(this.#f_container).hover(function() {
                  $(this).css("box-shadow", "rgba(0, 0, 0, 1) 3px 4px 10px 0px");
            }, function() {
                  $(this).css("box-shadow", "rgba(0, 0, 0, 0.8) 3px 4px 10px 0px");
            });

            this.#f_productNumberLabel = createButton(this.productNumber, "height:40px;margin:0px;background-color:" + this.backgroundColor + ";width:60px;font-size:10px;color:" + this.textColor + ";text-align:center;line-height:30px;border:1px solid " + this.backgroundColor + ";", () => {
                  let modal = new ModalSingleInput("Enter New Product Number", () => {
                        this.productNumber = modal.value;

                        this.UpdateFromChange();
                  });
                  modal.value = this.productNumber;
            }, this.#f_container);

            this.#f_typeLabel = createText(this.#Type, "height:40px;margin:0px;background-color:" + this.#backgroundColor + ";width:150px;font-size:10px;color:" + this.#textColor + ";text-align:center;line-height:30px;position:relative;border:1px solid " + this.#backgroundColor + ";", this.#f_container);

            this.#f_qty = createInput_Infield("Qty", 1, "width:80px;margin:0px 5px;box-shadow:none;box-sizing: border-box;", () => {this.UpdateFromChange();}, this.#f_container, true, 1);

            this.#f_pathLength = createInput_Infield("Path Length", null, "width:13%;margin:0px 5px;box-shadow:none;box-sizing: border-box;", () => {this.UpdateFromChange();}, this.#f_container, true, 100, {postfix: "mm"});

            this.#f_pathArea = createInput_Infield("Shape Areas", null, "width:13%;margin:0px 5px;box-shadow:none;box-sizing: border-box;", () => {this.UpdateFromChange();}, this.#f_container, true, 100, {postfix: "m2"});

            this.#f_totalBoundingRectAreas = createInput_Infield("Bounding Rect Areas", null, "width:20%;margin:0px 5px;box-shadow:none;box-sizing: border-box;", () => {this.UpdateFromChange();}, this.#f_container, true, 100, {postfix: "m2"});

            this.#f_fileChooser = createFileChooserButton("", "margin:0px;min-height:32px;", async (fileContent) => {
                  this.#f_svgFile = fileContent;
                  console.log("svg file set to");
                  console.log(this.#f_svgFile);
                  if(this.#f_svgFile) $(this.#f_visualiserBtn).show();
                  else $(this.#f_visualiserBtn).hide();

                  $(this.#f_pathLength[1]).val(roundNumber(svg_getTotalPathLengths(svg_makeFromString(this.#f_svgFile)), 2)).change();

                  //path Area
                  let loader = new Loader(this.#f_pathArea[0]);
                  this.#f_shapeAreas = await svg_getTotalPathArea_m2(this.#f_svgFile);
                  $(this.#f_pathArea[1]).val(roundNumber(this.#f_shapeAreas, 4)).change();
                  loader.Delete();

                  //Bounding Rects
                  let loader2 = new Loader(this.#f_totalBoundingRectAreas[0]);
                  this.#totalBoundingRectAreas = svg_getTotalBoundingRectAreas_m2(this.#f_svgFile, yes);
                  $(this.#f_totalBoundingRectAreas[1]).val(roundNumber(this.#totalBoundingRectAreas, 4)).change();
                  loader2.Delete();

                  this.UpdateFromChange();

            }, this.#f_container);

            this.#f_visualiserBtn = createIconButton("https://cdn.gorilladash.com/images/media/6195615/signarama-australia-searching-63ad3d8672602.png", "", "width:calc(60px);display:none;height:40px;margin:0px;background-color:" + COLOUR.Orange + ";", () => {
                  this.#f_visualiser = new ModalSVG("SVG", 100, () => {
                        this.UpdateFromChange();
                  }, this.#f_svgFile);
            }, this.#f_container, true);

            let settingsButton = createButton("", "width:40px;height:40px;margin:0px;margin-left:5px;margin-right:10px;font-size:20px;", () => {
                  this.#openSettingsModal();
            }, this.#f_container);
            settingsButton.innerHTML = "&#9881";

            this.#f_setting_IncludeSizeInDescription = createCheckbox_Infield("Include Size(s) In Description", false, "width: 450px;", () => {
                  this.#includeSizeInDescription = this.#f_setting_IncludeSizeInDescription[1].checked;
            });

            this.#f_deleteBtn = createIconButton(GM_getResourceURL("Icon_Bin"), "", "display: block; float: right; width: 35px;height:40px; border:none;padding:0px; color:white;min-height: 20px; margin: 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.Red + ";", () => {this.Delete();});
            this.#f_container.appendChild(this.#f_deleteBtn);

            let f_container_outputSizes = createDivStyle5(null, "Output Sizes", this.#f_container)[1];

            let temp;
            this.#f_sizeMethod1 = createCheckbox_Infield("Method 1 - Use Bounding Rect Areas", true, "width:300px;", temp = () => {
                  setFieldDisabled(true, this.#f_pathArea[1], this.#f_pathArea[0]);
                  setFieldDisabled(false, this.#f_totalBoundingRectAreas[1], this.#f_totalBoundingRectAreas[0]);
                  this.UpdateFromChange();
            }, f_container_outputSizes);
            this.#f_sizeMethod2 = createCheckbox_Infield("Method 2 - Use Shape Areas", false, "width:300px;", () => {
                  setFieldDisabled(false, this.#f_pathArea[1], this.#f_pathArea[0]);
                  setFieldDisabled(true, this.#f_totalBoundingRectAreas[1], this.#f_totalBoundingRectAreas[0]);
                  this.UpdateFromChange();
            }, f_container_outputSizes);

            checkboxesAddToSelectionGroup(true, this.#f_sizeMethod1, this.#f_sizeMethod2);

            this.#f_width = createInput_Infield("Width", null, "width:20%;margin:0px 5px;box-shadow:none;box-sizing: border-box;", () => {this.UpdateFromChange();}, f_container_outputSizes, true, 100, {postfix: "mm"});

            this.#f_height = createInput_Infield("Height", null, "width:20%;margin:0px 5px;box-shadow:none;box-sizing: border-box;", () => {this.UpdateFromChange();}, f_container_outputSizes, true, 100, {postfix: "mm"});

            this.UpdateFromChange();
      }

      UpdateFromChange() {
            this.UpdateWH();
            this.UpdateDataForSubscribers();
            this.PushToSubscribers();
      }

      UpdateWH() {
            let useBoundingRectArea = this.#f_sizeMethod1[1].checked;

            let sqrtWidth, sqrtHeight;
            IFELSEF(useBoundingRectArea == true,
                  () => {sqrtWidth = sqrtHeight = Math.sqrt(this.#totalBoundingRectAreas * 1000000);},
                  () => {sqrtWidth = sqrtHeight = Math.sqrt(this.#f_shapeAreas * 1000000);});

            $(this.#f_width[1]).val(zeroIfNaNNullBlank(roundNumber(sqrtWidth, 3)));
            $(this.#f_height[1]).val(zeroIfNaNNullBlank(roundNumber(sqrtHeight, 3)));
      }
      /**
       * @summary this.#dataForSubscribers = [{ qty, pathLength, shapeAreas, boundingRectAreas },...]
       */
      UpdateDataForSubscribers() {
            this.#dataForSubscribers = [];

            this.#dataForSubscribers.push({
                  pathLength: zeroIfNaNNullBlank(this.pathLength),
                  shapeAreas: zeroIfNaNNullBlank(this.#f_shapeAreas),
                  boundingRectAreas: zeroIfNaNNullBlank(this.#totalBoundingRectAreas),
                  QWHD: this.getQWH()
            });

            this.DATA_FOR_SUBSCRIBERS = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
      }

      getQWH() {
            let qty = zeroIfNaNNullBlank(this.qty);
            let width = zeroIfNaNNullBlank(this.#f_width[1].value);
            let height = zeroIfNaNNullBlank(this.#f_height[1].value);
            let depth = 0;

            return new QWHD(qty, width, height, depth);
      }

      #openSettingsModal() {
            let modal = new Modal("Settings", () => { });
            modal.setContainerSize(500, 500);
            modal.addBodyElement(this.#f_setting_IncludeSizeInDescription[0]);
            modal.addFooterElement(createButton("Ok", "width:100px;float:right;", () => {modal.hide();}));
      }

      /**
       * @CorebridgeCreate
       */
      async Create(productNo, partIndex) {
            return partIndex;
      }

      Description() {
            return "";
      }
      /**
      * @DeleteThis
      */
      Delete() {
            super.Delete();
            this.#f_lhsMenuWindow.DeleteMaterial(this);
            deleteElement(this.#f_container);
      }
}