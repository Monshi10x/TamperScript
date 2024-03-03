class Material extends SubscriptionManager {
      #container;
      get container() {return this.#container;}

      #Type = "";
      get Type() {return this.#Type;}
      set Type(type) {this.#Type = type;};

      #UNIQUEID = generateUniqueID();
      get ID() {return this.#Type + "-" + this.#UNIQUEID;}

      #typeLabel;
      get typeLabel() {return this.#typeLabel;}

      #easyNameLabel;
      #easyName = -1;
      get easyName() {return this.#easyName;}
      set easyName(value) {this.#easyName = value; this.#easyNameLabel.innerText = value;}

      #subscribedToLabel;
      #subscriptionsContainer;
      get inheritedRowSizeLabel() {return this.#subscribedToLabel;}

      #heading;
      #minimizeBtn;
      #isMinimized = true;
      #deleteBtn;
      #showIDInContainer = true;
      #subscriptionsModal;
      #lhsMenuWindow;

      /**
       * @InheritedSize
       */
      #inheritedSizeHeader;
      #qty;
      get qty() {return zeroIfNaNNullBlank(this.#qty[1].value);}
      #width;
      get width() {return zeroIfNaNNullBlank(this.#width[1].value);}
      #height;
      get height() {return zeroIfNaNNullBlank(this.#height[1].value);}
      #lockBtn;
      #isLocked;

      #backgroundColor = COLOUR.Black;
      get backgroundColor() {return this.#backgroundColor;}
      set backgroundColor(color) {this.#backgroundColor = color;}
      #textColor = COLOUR.White;
      get textColor() {return this.#textColor;}
      set textColor(color) {this.#textColor = color;}

      constructor(parentContainer, lhsMenuWindow, Type) {
            super();
            if(!lhsMenuWindow instanceof LHSMenuWindow) throw new Error('Parameter 2 must be an instance of LHSMenuWindow');
            this.#lhsMenuWindow = lhsMenuWindow;
            this.Type = Type;

            this.#container = document.createElement("div");
            this.#container.style =
                  "display: block; float: left; width: calc(100% - 16px);min-height:20px; background-color:" +
                  COLOUR.White +
                  ";border:2px solid;border-color: black;margin:8px;box-shadow: rgb(0 0 0 / 80%) 3px 4px 10px 0px;padding:0px;overflow:hidden;box-sizing: border-box";
            parentContainer.appendChild(this.#container);

            this.#easyNameLabel = createButton(this.easyName, "height:40px;margin:0px;background-color:" + this.backgroundColor + ";width:60px;font-size:10px;color:" + this.textColor + ";text-align:center;line-height:30px;border:1px solid " + this.backgroundColor + ";", () => {
                  let modal = new ModalSingleInput("Enter New Product Number", () => {
                        this.easyName = modal.value;
                        console.log(modal.value);
                        this.onEasyNameChange();
                  });
                  modal.value = this.easyName;
            }, this.#container);

            this.#typeLabel = createText(this.#Type, "height:40px;margin:0px;background-color:" + this.backgroundColor + ";width:150px;font-size:10px;color:" + this.textColor + ";text-align:center;line-height:30px;border:1px solid " + this.backgroundColor + ";", this.#container);

            /** @Subscriptions */
            this.#subscriptionsModal = createIconButton("https://cdn.gorilladash.com/images/media/6144522/signarama-australia-noun-multiple-assign-2848055-635d23b3b3f2b.png", "Subscriptions",
                  "width: 150px; height: 40px; margin: 0px;margin-left:30px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.DarkGrey, () => {this.OpenSubscriptionsModal();}, this.#container);

            //this.#subscribedToLabel = createText("Subscribed: None", "height:40px;margin:0px;background-color:" + COLOUR.White + ";width:129px;font-size:10px;color:" + COLOUR.Blue + ";text-align:center;line-height:30px;border:1px solid " + COLOUR.Blue + ";", this.#container);
            this.#subscriptionsContainer = document.createElement("div");
            this.#subscriptionsContainer.style = "height:40px;width:310px;background-color:white;box-sizing:border-box;float:left;margin:0px;";
            this.#container.appendChild(this.#subscriptionsContainer);
            //this.#heading = createInput("Description", "", "width:calc(100% - 364px);height:30px;margin:0px;text-align:center;font-weight:bold", () => { }, this.#container);
            //this.#heading.id = "rowHeading";


            this.#deleteBtn = createButton("X", "display: block; float: right; width: 35px;height:40px; border:none;padding:2px; color:white;min-height: 20px; margin: 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.Red + ";", () => {this.Delete();});
            this.#container.appendChild(this.#deleteBtn);

            this.#minimizeBtn = createButton("-", "display: block; float: right; width: 35px;height:40px; border:none;padding:2px; color:white;min-height: 20px; margin: 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.LightBlue + ";", () => {this.toggleMinimize();});
            this.#container.appendChild(this.#minimizeBtn);

            let popOutBtn = createButton("\u274F", "display: block; float: right; width: 35px;height:40px; border:none;padding:2px; color:white;min-height: 20px; margin: 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.DarkBlue + ";", () => {
                  setFieldDisabled(true, popOutBtn);
                  this.onPopOut();
                  new ModalPopOut("Expanded View", () => {
                        this.onPopOutLeave();
                        setFieldDisabled(false, popOutBtn);
                  }, this.#container);
            }, this.#container);

            if(this.#showIDInContainer) createLabel(this.ID, "width:100%", this.#container);

            this.#inheritedSizeHeader = createHeadingStyle1("Inherited Total Size", null, this.#container);

            this.#qty = createInput_Infield("Qty", 0, "width:20%", () => {this.UpdateFromChange();}, this.#container, true, 1);
            setFieldDisabled(true, this.#qty[1], this.#qty[0]);

            this.#width = createInput_Infield("Width", 0, "width:20%", () => {this.UpdateFromChange();}, this.#container, true, 100);
            setFieldDisabled(true, this.#width[1], this.#width[0]);

            this.#height = createInput_Infield("Height", 0, "width:20%", () => {this.UpdateFromChange();}, this.#container, true, 100);
            setFieldDisabled(true, this.#height[1], this.#height[0]);

            this.#lockBtn = createButton("", "font-size: 18px;display: block; float: left; width:10%; min-width:20px;max-width:30px;border:none;padding:2px; color:white;min-height: 40px; margin: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;", () => {
                  this.#isLocked = toggleLock(this.#lockBtn);
                  this.UpdateFromChange();
            }, this.#container);
            this.#lockBtn.innerHTML = "🔒";
            this.#isLocked = true;

            /**
             * @Updates
             */
            this.UpdateQWH();
            this.Minimize();
      }

      /**@Override */
      UpdateFromChange() {
            super.UpdateFromChange();
            this.UpdateQWH();
            this.UpdateSubscribedLabel();
      }

      OpenSubscriptionsModal() {
            new ModalManageSubscriptions2("Manage Subscriptions", () => {
                  this.UpdateFromChange();
            }, this, this.#lhsMenuWindow);
            this.UpdateQWH();
      }

      UpdateSubscribedLabel() {
            removeAllChildrenFromParent(this.#subscriptionsContainer);
            for(let i = 0; i < this.subscriptions.length; i++) {
                  let subscription_colour = this.subscriptions[i].backgroundColor;

                  let subSlot = document.createElement("div");
                  subSlot.style = "width:20px;position:relative;height:100%;box-sizing: border-box;background-color: " + subscription_colour + ";float:left;margin-left:2px;";
                  subSlot.title = this.subscriptions[i].Type + " " + this.subscriptions[i].easyName;

                  let subSlotText = createText(this.subscriptions[i].easyName, "width:100%;height:100%;padding:2px;padding-top:10px;box-sizing: border-box;color: " + this.subscriptions[i].textColor, subSlot);

                  this.#subscriptionsContainer.appendChild(subSlot);
            }

      }

      UpdateQWH() {
            let setDisabled = true;
            if(this.#isLocked) {
                  $(this.#qty[1]).val(roundNumber(this.getQWH().qty, 0));
                  $(this.#width[1]).val(roundNumber(this.getQWH().width, 2));
                  $(this.#height[1]).val(roundNumber(this.getQWH().height, 2));
            } else {
                  setDisabled = false;
            }
            setFieldDisabled(setDisabled, this.#width[1], this.#width[0]);
            setFieldDisabled(setDisabled, this.#height[1], this.#height[0]);
            setFieldDisabled(setDisabled, this.#qty[1], this.#qty[0]);
      }

      //TODO: Handle Multiple Size Subscriptions, not just the first one
      getQWH() {
            if(!this.#isLocked) return new QWH(this.qty, this.width, this.height);

            for(let i = 0; i < this.subscriptions.length; i++) {
                  if(this.subscriptions[i].qty && this.subscriptions[i].width && this.subscriptions[i].height) {
                        return new QWH(this.subscriptions[i].qty, this.subscriptions[i].width, this.subscriptions[i].height);
                  }
            }
            return new QWH(0, 0, 0);
      };

      /**
       * @DeleteThis
       */
      Delete() {
            this.#lhsMenuWindow.DeleteMaterial(this);
            super.Delete();

            deleteElement(this.#container);
      }

      /**
       * @Container
       */
      toggleMinimize() {
            if(this.#isMinimized) this.Maximize();
            else this.Minimize();
      }

      Maximize() {
            this.#isMinimized = false;
            this.#container.style.maxHeight = "10000px";
            this.#minimizeBtn.innerText = "-";
      }

      Minimize() {
            this.#isMinimized = true;
            this.#container.style.maxHeight = "44px";
            this.#minimizeBtn.innerText = "▭";
      }

      onPopOut() {
            this.prePopOutState = this.#isMinimized;
            this.Maximize();
      }

      onPopOutLeave() {
            //if was minimized before, restore to minimized
            if(this.prePopOutState == true) this.Minimize();
            else this.Maximize();
      }

      onEasyNameChange() {
            this.UpdateFromChange();
      }

      /**
       * @CorebridgeCreate
       */
      async Create(productNo, partIndex) {
            return partIndex;
      }

}