class UIContainer_Design {
      #container;
      get container() {return this.#container;}

      #headingContainer;
      get headingContainer() {return this.#headingContainer;}

      #headingContainer_Height = 30;
      #customerNameHeadingContainer;
      #customerNameHeadingContainer_Height = 30;
      #jobNameHeadingContainer;
      #jobNameHeadingContainer_Height = 30;

      #customerNameText;
      get customerNameText() {return this.#customerNameText;}

      #jobNameText;
      get jobNameText() {return this.#jobNameText;}

      #popOutBtn;
      #popOutBtn_Width = 30;
      #popOutBtn_Height = 30;
      #popOutModal;
      #whenClosedReturnBorrowed = true;
      get whenClosedReturnBorrowed() {return this.#whenClosedReturnBorrowed;}
      set whenClosedReturnBorrowed(val) {
            this.#whenClosedReturnBorrowed = val;
            if(this.#popOutModal) this.#popOutModal.whenClosedReturnBorrowed = val;
      }

      #minimizeBtn;
      #minimizeBtn_Width = 30;
      #minimizeBtn_Height = 30;
      #isMinimized = false;
      growOnHover = true;

      #contentContainer;
      get contentContainer() {return this.#contentContainer;}

      /**@Overrideable */
      onPopOut = function() { };
      /**@Overrideable */
      onPopOutLeave = function() { };
      /**@Overrideable */
      onCallback() { }

      #Id;
      set Id(value) {this.#Id = value;}
      get Id() {return this.#Id;}
      #OrderId;
      set OrderId(value) {this.#OrderId = value;}
      get OrderId() {return this.#OrderId;}
      #Priority;
      set Priority(value) {this.#Priority = value;}
      get Priority() {return this.#Priority;}
      #JobColour;
      set JobColour(value) {this.#JobColour = value;}
      get JobColour() {return this.#JobColour;}
      #QueuePrioritySettingId;
      set QueuePrioritySettingId(value) {this.#QueuePrioritySettingId = value;}
      get QueuePrioritySettingId() {return this.#QueuePrioritySettingId;}

      #jobData;
      set jobData(value) {this.#jobData = value;}
      get jobData() {return this.#jobData;}

      constructor(overrideCssStyles, customerNameText, jobNameText, parentObjectToAppendTo) {
            this.#customerNameText = customerNameText;
            this.#jobNameText = jobNameText;

            /**@Container */
            this.#container = document.createElement("div");
            this.#container.className = "UIContainer_Design";
            this.#container.style = STYLE.Div3;
            this.#container.style.cssText += "display:flex;flex-direction:column;margin-bottom:10px;border:1px solid rgb(0,0,0,0.6);cursor:auto;";
            this.#container.style.boxShadow = "rgb(0, 0, 0, 0.5) 0px 0px 20px 0px";
            this.#container.style.cssText += overrideCssStyles;

            let self = this;
            $(this.#container).hover(function() {
                  if(self.growOnHover) {
                        this.style.boxShadow = "rgb(0, 0, 0, 0.9) 0px 0px 20px 0.5px";
                        this.style.cssText += "transform: scale(1.01, 1.01);";
                  }
            }, function() {
                  this.style.boxShadow = "rgb(0, 0, 0, 0.5) 0px 0px 20px 0px";
                  this.style.cssText += "transform: scale(1.0, 1.0);";
            });

            if(parentObjectToAppendTo != null) {
                  parentObjectToAppendTo.appendChild(this.#container);
            }

            /**@HeadingContainer */
            this.#headingContainer = document.createElement("div");
            this.#headingContainer.style = "width:100%;height:" + this.#headingContainer_Height + "px;box-sizing:border-box;";
            this.#headingContainer.addEventListener("click", (e) => {
                  if(e.target == this.#headingContainer) {
                        setFieldDisabled(true, this.#popOutBtn);
                        this.popOut();
                        this.#popOutModal = new ModalPopOut("Expanded View", () => {
                              setFieldDisabled(false, this.#popOutBtn);
                              this.popOutLeave();
                              this.onCallback();
                        }, this.#container);
                        this.#popOutModal.shouldHideOnEnterKeyPress = false;
                        this.#popOutModal.whenClosedReturnBorrowed = this.whenClosedReturnBorrowed;
                  }
            });
            this.#container.appendChild(this.#headingContainer);

            /**@customerNameText */
            if(customerNameText !== null) {
                  this.#customerNameHeadingContainer = document.createElement("div");
                  this.#customerNameHeadingContainer.style = "width:100%;height:" + this.#customerNameHeadingContainer_Height + "px;box-sizing:border-box;";
                  this.#container.appendChild(this.#customerNameHeadingContainer);

                  this.#customerNameText = document.createElement("h3");
                  this.#customerNameText.innerText = customerNameText;
                  this.#customerNameText.style = "float: left; height: 30px; margin: 0px 0px 0px 0px; background-color: " + COLOUR.White + "; width: calc(100%); box-sizing: border-box; padding: 0px; font-size: 16px; color: " + COLOUR.Black + "; text-align: center; line-height: 30px; border: 1px solid " + COLOUR.White + ";overflow: hidden;text-overflow: ellipsis;white-space: nowrap;padding-left: 4px;padding-right: 4px;";
                  this.#customerNameHeadingContainer.appendChild(this.#customerNameText);

                  this.#customerNameHeadingContainer.addEventListener("click", () => {
                        setFieldDisabled(true, this.#popOutBtn);
                        this.popOut();
                        this.#popOutModal = new ModalPopOut("Expanded View", () => {
                              setFieldDisabled(false, this.#popOutBtn);
                              this.popOutLeave();
                              this.onCallback();
                        }, this.#container);
                        this.#popOutModal.whenClosedReturnBorrowed = this.whenClosedReturnBorrowed;
                        this.#popOutModal.shouldHideOnEnterKeyPress = false;
                  });
            }

            /**@jobNameText */
            if(jobNameText !== null) {
                  this.#jobNameHeadingContainer = document.createElement("div");
                  this.#jobNameHeadingContainer.style = "width:100%;height:" + this.#jobNameHeadingContainer_Height + "px;box-sizing:border-box;";
                  this.#container.appendChild(this.#jobNameHeadingContainer);

                  this.#jobNameText = document.createElement("h3");
                  this.#jobNameText.innerText = jobNameText;
                  this.#jobNameText.style = "float: left; height: 30px; margin: 0px 0px 0px 0px; background-color: " + COLOUR.White + "; width: calc(100%); box-sizing: border-box; padding: 0px; font-size: 10px; color: " + COLOUR.DarkGrey + "; text-align: center; line-height: 30px; border: 1px solid " + COLOUR.White + ";overflow: hidden;text-overflow: ellipsis;white-space: nowrap;padding-left: 4px;padding-right: 4px;";
                  this.#jobNameHeadingContainer.appendChild(this.#jobNameText);

                  this.#jobNameHeadingContainer.addEventListener("click", () => {
                        setFieldDisabled(true, this.#popOutBtn);
                        this.popOut();
                        this.#popOutModal = new ModalPopOut("Expanded View", () => {
                              setFieldDisabled(false, this.#popOutBtn);
                              this.popOutLeave();
                              this.onCallback();
                        }, this.#container);
                        this.#popOutModal.whenClosedReturnBorrowed = this.whenClosedReturnBorrowed;
                        this.#popOutModal.shouldHideOnEnterKeyPress = false;
                  });
            }

            /**@ContentContainer */
            this.#contentContainer = document.createElement("div");
            this.#contentContainer.style = "width:100%;max-height:calc(100% - 30px);overflow-y:scroll;display:block;";
            this.#container.appendChild(this.#contentContainer);
      }

      toggleMinimize() {
            if(this.#contentContainer.style.display == "none") {
                  this.Maximize();
            } else {
                  this.Minimize();
            }
      }

      Minimize() {
            this.#isMinimized = true;
            this.#contentContainer.style.display = "none";
      }

      Maximize() {
            this.#isMinimized = false;
            this.#contentContainer.style.display = "block";
      }

      popOut() {
            this.prePopOutState = this.#isMinimized;
            this.Maximize();
            this.#contentContainer.style.maxHeight = "100%";
            this.#container.style.maxHeight = "10000px";
            this.onPopOut();
      }

      popOutLeave() {
            //if was minimized before, restore to minimized
            if(this.prePopOutState == true) this.Minimize();
            else this.Maximize();
            this.#contentContainer.style.maxHeight = "400px";
            this.#container.style = STYLE.Div3;
            this.onPopOutLeave();
      }

      #addedHeadingItems_combinedWidth = 0;
      addHeadingButtons(...itemContainers) {
            for(let i = 0; i < itemContainers.length; i++) {
                  this.#headingContainer.appendChild(itemContainers[i]);
                  this.#addedHeadingItems_combinedWidth += itemContainers[i].offsetWidth;
            }
      }
}