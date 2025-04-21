class Material extends SubscriptionManager {
      /*
                         
       Variables         */
      #isMinimized = true;
      #showIDInContainer = false;
      #productNumber = -1;
      #Type = "";
      #UNIQUEID = generateUniqueID();
      #backgroundColor = COLOUR.Black;
      #textColor = COLOUR.White;
      #isLocked;
      static DISPLAY_NAME = "MATERIAL";
      /*
                        
      FIELDS            */
      #f_overallQtyContainer;
      #f_qty;
      #f_width;
      #f_height;
      #f_depth;
      #f_lockBtn;
      #f_deleteBtn;
      #f_container;
      #f_typeLabel;
      #f_productNumberLabel;
      #f_subscribedToLabel;
      #f_subscriptionsContainer;
      #f_minimizeBtn;
      #f_subscriptionsModal;
      #f_lhsMenuWindow;
      #f_popOutModal;
      #f_popOutBtn;
      #f_debugInheritedData;
      #f_requiresInputTag;
      /*
                        
      GETTER            */
      get qty() {return zeroIfNaNNullBlank(this.#f_qty[1].value);}
      get qtyField() {return this.#f_qty[1];}
      get width() {return zeroIfNaNNullBlank(this.#f_width[1].value);}
      get height() {return zeroIfNaNNullBlank(this.#f_height[1].value);}
      get depth() {return zeroIfNaNNullBlank(this.#f_depth[1].value);}
      get container() {return this.#f_container;}
      get Type() {return this.TYPE;}
      get ID() {return this.#Type + "-" + this.#UNIQUEID;}
      get typeLabel() {return this.#f_typeLabel;}
      get productNumber() {return this.#productNumber;}
      get inheritedRowSizeLabel() {return this.#f_subscribedToLabel;}
      get backgroundColor() {return this.#backgroundColor;}
      get textColor() {return this.#textColor;}
      get DEBUG_SHOW() {return false;}

      /*
                        
      SETTER            */
      set Type(type) {this.#Type = type;};
      set productNumber(value) {this.#productNumber = value; this.#f_productNumberLabel.innerText = value;}
      set backgroundColor(color) {this.#backgroundColor = color;}
      set textColor(color) {this.#textColor = color;}
      set qty(value) {this.#f_qty[1].value = value;}
      set typeLabel(value) {this.#f_typeLabel.innerText = value;}
      showRequiresInputTag(value) {if(value == true) $(this.#f_requiresInputTag[0]).show(); else $(this.#f_requiresInputTag[0]).hide();}

      /*
                        
      START             */
      constructor(parentContainer, lhsMenuWindow) {
            super();
            if(!lhsMenuWindow instanceof LHSMenuWindow) throw new Error('Parameter 2 must be an instance of LHSMenuWindow');
            this.#f_lhsMenuWindow = lhsMenuWindow;

            this.#f_container = document.createElement("div");
            this.#f_container.style =
                  "display: block; float: left; width: calc(100% - 16px);min-height:20px; background-color:" +
                  COLOUR.White +
                  ";border:2px solid;border-color: black;margin:8px;box-shadow: rgb(0 0 0 / 80%) 3px 4px 10px 0px;padding:0px;overflow:hidden;box-sizing: border-box";
            parentContainer.appendChild(this.#f_container);
            this.#f_container.addEventListener("click", (e) => {
                  if(e.target == this.#f_container && this.#isMinimized == true) this.onPopOut();
            });

            this.#f_productNumberLabel = createButton(this.productNumber, "height:40px;margin:0px;background-color:" + this.backgroundColor + ";width:60px;font-size:10px;color:" + this.textColor + ";text-align:center;line-height:30px;border:1px solid " + this.backgroundColor + ";", () => {
                  let modal = new ModalSingleInput("Enter New Product Number", () => {
                        this.productNumber = modal.value;
                        this.onProductNumberChange();
                  });
                  modal.value = this.productNumber;
            }, this.#f_container);

            this.#f_typeLabel = createText(this.Type, "height:40px;margin:0px;background-color:" + this.backgroundColor + ";width:150px;font-size:10px;color:" + this.textColor + ";text-align:center;line-height:30px;border:1px solid " + this.backgroundColor + ";", this.#f_container);
            this.#f_typeLabel.addEventListener("click", () => {
                  if(this.#isMinimized == true) this.onPopOut();
            });
            /*
            Subscriptions */
            this.#f_subscriptionsModal = createIconButton("https://cdn.gorilladash.com/images/media/6144522/signarama-australia-noun-multiple-assign-2848055-635d23b3b3f2b.png", "Subscriptions",
                  "width: 150px; height: 40px; margin: 0px;margin-left:0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.DarkGrey, () => {this.OpenSubscriptionsModal();}, this.#f_container);

            this.#f_subscriptionsContainer = document.createElement("div");
            this.#f_subscriptionsContainer.style = "height:40px;width:20%;background-color:white;box-sizing:border-box;float:left;margin:0px;";
            this.#f_subscriptionsContainer.addEventListener("click", (e) => {
                  if(e.target == this.#f_subscriptionsContainer && this.#isMinimized == true) this.onPopOut();
            });
            this.#f_container.appendChild(this.#f_subscriptionsContainer);

            this.#f_requiresInputTag = createToken("Requires Your Input!", false, "background-color:red;color:white;pointer-events:none", this.#f_container);
            this.showRequiresInputTag(false);

            $(this.#f_container).hover(function() {
                  $(this).css("box-shadow", "rgba(0, 0, 0, 1) 3px 4px 10px 0px");
            }, function() {
                  $(this).css("box-shadow", "rgba(0, 0, 0, 0.8) 3px 4px 10px 0px");
            });

            this.#f_deleteBtn = createIconButton(GM_getResourceURL("Icon_Bin"), "", "display: block; float: right; width: 35px;height:40px; border:none;padding:0px;color:white;min-height: 20px; margin: 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.Red + ";", () => {this.Delete();});
            this.#f_container.appendChild(this.#f_deleteBtn);

            this.#f_minimizeBtn = createButton("-", "display: block; float: right; width: 35px;height:40px; border:none;padding:2px; color:white;min-height: 20px; margin: 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.LightBlue + ";", () => {this.toggleMinimize();});
            this.#f_container.appendChild(this.#f_minimizeBtn);

            this.#f_popOutBtn = createButton("\u274F", "display: block; float: right; width: 35px;height:40px; border:none;padding:2px; color:white;min-height: 20px; margin: 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.DarkBlue + ";", () => {
                  this.onPopOut();
            }, this.#f_container);

            if(this.#showIDInContainer) createLabel(this.ID, "width:100%", this.#f_container);

            this.#f_overallQtyContainer = createDivStyle5(null, "Overall Qty", this.#f_container)[1];


            this.#f_debugInheritedData = createTextarea("DEBUG", "", "width:90%;", () => { }, this.#f_overallQtyContainer);
            if(!this.DEBUG_SHOW) $(this.#f_debugInheritedData).hide();

            this.#f_qty = createInput_Infield("Qty", 1, "width:20%", () => {this.UpdateFromChange();}, this.#f_overallQtyContainer, true, 1);
            setFieldDisabled(false, this.#f_qty[1], this.#f_qty[0]);

            this.Minimize();
      }

      /*
      Override */
      UpdateFromChange() {
            super.UpdateFromChange();

            this.UpdateSubscribedLabel();
            this.UpdateDebug();
      }

      UpdateDebug() {
            let debugData = "";

            this.INHERITED_DATA.forEach((subscription/**{parent: p, data: [{...}]}*/) => {

                  debugData += subscription.parent.constructor.name + "\n";
                  debugData += JSON.stringify(subscription.data, null, 4) + "\n\n";
            });

            this.#f_debugInheritedData.value = debugData;
      }

      OpenSubscriptionsModal() {
            new ModalManageSubscriptions2("Manage Subscriptions", () => {
                  this.UpdateFromChange();
            }, this, this.#f_lhsMenuWindow);
      }

      UpdateSubscribedLabel() {
            removeAllChildrenFromParent(this.#f_subscriptionsContainer);
            for(let i = 0; i < this.subscriptions.length; i++) {
                  let subscription_colour = this.subscriptions[i].backgroundColor;

                  let subSlot = document.createElement("div");
                  subSlot.style = "width:20px;position:relative;height:100%;box-sizing: border-box;background-color: " + subscription_colour + ";float:left;margin-left:2px;";
                  subSlot.title = this.subscriptions[i].Type + " " + this.subscriptions[i].productNumber;

                  let subSlotText = createText(this.subscriptions[i].productNumber, "width:100%;height:100%;padding:2px;padding-top:10px;box-sizing: border-box;color: " + this.subscriptions[i].textColor, subSlot);

                  this.#f_subscriptionsContainer.appendChild(subSlot);
            }

      }

      getQWH() {
            if(!this.#isLocked) return new QWHD(this.qty, 0, 0, 0);

            for(let i = 0; i < this.subscriptions.length; i++) {
                  if(this.subscriptions[i].qty && this.subscriptions[i].width && this.subscriptions[i].height) {
                        return this.subscriptions[i].getQWH();//new QWHD(this.subscriptions[i].qty, this.subscriptions[i].width, this.subscriptions[i].height);
                  }
            }
            return new QWHD(0, 0, 0);
      };

      Delete() {
            this.#f_lhsMenuWindow.DeleteMaterial(this);
            super.Delete();

            deleteElement(this.#f_container);
      }

      toggleMinimize() {
            if(this.#isMinimized) this.Maximize();
            else this.Minimize();
      }

      Maximize() {
            this.#isMinimized = false;
            this.#f_container.style.maxHeight = "10000px";
            this.#f_minimizeBtn.innerText = "-";
      }

      Minimize() {
            this.#isMinimized = true;
            this.#f_container.style.maxHeight = "44px";
            this.#f_minimizeBtn.innerText = "▭";
      }

      onPopOut() {
            this.prePopOutState = this.#isMinimized;

            this.#f_popOutModal = new ModalPopOut("Expanded View", () => {
                  this.onPopOutLeave();
            }, this.#f_container);

            setFieldDisabled(true, this.#f_popOutBtn);

            this.#f_container.style.cssText += "margin:0px;width:100%;border:0px;";
            this.Maximize();
      }

      onPopOutLeave() {
            if(this.prePopOutState == true) this.Minimize(); else this.Maximize();

            setFieldDisabled(false, this.#f_popOutBtn);
      }

      onProductNumberChange() {
            this.UpdateFromChange();
      }

      /*
       CorebridgeCreate*/
      async Create(productNo, partIndex) {
            return partIndex;
      }

      Description() {
            return "";
      }
}