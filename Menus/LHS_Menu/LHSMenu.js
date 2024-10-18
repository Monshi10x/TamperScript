class LHSMenuWindow {

    #container;
    #footer;
    #width;
    #minimizeWidth = 150;
    #maximizeWidth;
    #height;
    #ID;
    #windowTitle;
    #body;
    #currentPageIndex = 0;
    #numPages = 0;
    #xOffset = 160;
    #yOffset = 82;
    #pageButtonContainer;
    #previousPageBtn;
    #nextPageBtn;
    #pages = [];

    #doesTick = false;

    get doesTick() {
        return this.#doesTick;
    }
    set doesTick(value) {
        this.#doesTick = value;
    }

    #tickMS = 1000;
    #tickTimer;

    constructor(width, height, ID, windowTitle) {
        this.#width = width;
        this.#maximizeWidth = width;
        this.#height = height;
        this.#ID = ID;
        this.#windowTitle = windowTitle;

        this.#container = document.createElement('div');
        this.#container.id = ID;
        this.#container.style = "z-index:100;background-color:" + COLOUR.MediumGrey + ";color:" + COLOUR.White + ";width:" + this.#width + "px;min-height:" + this.#height + "px;position:fixed;top:" + this.#yOffset + "px;left:" + this.#xOffset + "px;display: none;flex-direction: column;flex: 1;overflow:none;box-shadow: rgb(0 0 0) 6px 1px 20px -2px;";

        this.createDragableHeaderAndClose();

        this.#body = document.createElement('div');
        this.#body.id = ID + "body";
        this.#body.style = "margin: 0px; min-height: 700px; max-height: 1000px; width: 100%; padding: 0px; float: left; display: block; color: white; cursor: pointer; border-style: none;overflow-y:auto;";

        this.#pageButtonContainer = document.createElement('div');
        this.#pageButtonContainer.id = ID + "pageButtonContainer";
        this.#pageButtonContainer.style = "margin: 0px; min-height: 0px; max-height: 50px; width: 100%; padding: 0px; float: left; display: block; color: white; cursor: pointer; border-style: none; overflow-y: none; background-color:white;margin-top: auto;";

        this.#previousPageBtn = createButton("< Back", "width:100px;float:left;margin:0;", this.previousPage);
        setFieldHidden(true, this.#previousPageBtn);
        this.#nextPageBtn = createButton("Next >", "width:100px;float:right;margin:0;", this.nextPage);
        setFieldHidden(true, this.#nextPageBtn);

        this.#footer = document.createElement('div');
        this.#footer.id = ID + "footer";
        this.#footer.style = "margin: 0px; min-height: 35px; max-height: 100px; width: 100%; padding: 0px; float: left; display: block; color: white; cursor: pointer; border-style: none; overflow-y: auto; background-color:#fff;border-top: 1px solid black;margin-top: auto;";

        this.#pageButtonContainer.appendChild(this.#nextPageBtn);
        this.#pageButtonContainer.appendChild(this.#previousPageBtn);
        this.#container.appendChild(this.#body);
        this.#container.appendChild(this.#pageButtonContainer);
        this.#container.appendChild(this.#footer);

        window.addEventListener("resize", (event) => {this.onWindowResize(event);});

        document.getElementsByTagName('body')[0].appendChild(this.#container);
    }

    set container(value) {
        this.#container = value;
    }

    get container() {
        return this.#container;
    }

    setContainerOffset = (xOffset, yOffset) => {
        $(this.container).animate({top: yOffset, left: xOffset});
    };

    resetContainerOffset = () => {
        $(this.container).animate({top: this.#yOffset, left: this.#xOffset});
    };

    set body(value) {
        this.#body = value;
    }

    get body() {
        return this.#body;
    }

    addPages = (count = 1) => {
        for(let c = 0; c < count; c++) {
            this.#numPages++;
            let newPage = document.createElement('div');
            newPage.id = this.#ID + "body";
            newPage.style = "margin: 0px;height:100%; min-height:400px;max-height:900px;width: 100%; padding: 0px; float: left; display: none; color: white; cursor: pointer; border-style: none; overflow-y: auto; overflow-x:none;background-color:" + COLOUR.MediumGrey + ";";
            if(this.#numPages == 1) setFieldHidden(false, newPage);
            this.#pages.push(newPage);
            this.body.appendChild(newPage);
            if(this.#numPages > 1) {
                setFieldHidden(false, this.#nextPageBtn);
            }
        }
    };

    getPage(pageIndex) {
        return this.#pages[pageIndex];
    }
    getPages() {
        return this.#pages;
    }
    getPageCount() {
        return this.#pages.length;
    }
    clearPages(optional_pageIndex = null) {
        var pages = this.getPages();
        if(optional_pageIndex === null) {
            for(let i = 0; i < pages.length; i++) {
                while(pages[i].hasChildNodes()) {
                    pages[i].removeChild(pages[i].lastChild);
                }
            }
        } else {
            while(pages[optional_pageIndex].hasChildNodes()) {
                pages[optional_pageIndex].removeChild(pages[optional_pageIndex].lastChild);
            }
        }
    }

    nextPage = () => {
        this.jumpToPage(clamp(this.currentPageIndex + 1, 0, Infinity));
    };

    previousPage = () => {
        this.jumpToPage(clamp(this.currentPageIndex - 1, 0, Infinity));
    };

    jumpToPage = (index) => {
        for(let i = 0; i < this.#pages.length; i++) {
            setFieldHidden(true, this.getPage(i));
        }
        this.currentPageIndex = index;
        setFieldHidden(false, this.getPage(index));
        if(this.#numPages == 1) {
            setFieldHidden(true, this.#nextPageBtn);
            setFieldHidden(true, this.#previousPageBtn);
        } else if(index == 0) {
            setFieldHidden(false, this.#nextPageBtn);
            setFieldHidden(true, this.#previousPageBtn);
        } else if(index == this.#numPages - 1) {
            setFieldHidden(true, this.#nextPageBtn);
            setFieldHidden(false, this.#previousPageBtn);
        } else {
            setFieldHidden(false, this.#nextPageBtn);
            setFieldHidden(false, this.#previousPageBtn);
        }
    };

    set currentPageIndex(value) {
        this.#currentPageIndex = value;
    }

    get currentPageIndex() {
        return this.#currentPageIndex;
    }

    set footer(value) {
        this.#footer = value;
    }

    get footer() {
        return this.#footer;
    }

    clearFooter() {
        while(this.#footer.hasChildNodes()) {
            this.#footer.removeChild(this.#footer.lastChild);
        }
    }

    set width(value) {
        this.#width = value;
        this.container.style.width = value + "px";
    }

    get width() {
        return this.#width;
    }

    set height(value) {
        this.#height = value;
        this.container.style.height = value + "px";
    }

    get height() {
        return this.#height;
    }

    show() {
        this.jumpToPage(0);
        if(this.#doesTick) {
            this.#tickTimer = setInterval(() => {this.tick();}, this.#tickMS);
        }
        this.container.style.display = "flex";
        this.resetContainerOffset();

        this.maximize();
    }

    tick() { }

    hide() {
        clearInterval(this.#tickTimer);
        this.container.style.display = "none";
        deselectSelectorBars();
    }

    minimize() {
        $(this.container).animate({width: this.#minimizeWidth});
    }

    maximize() {
        $(this.container).animate({width: this.#maximizeWidth});
    }

    onWindowResize(event) { }

    createDragableHeaderAndClose() {
        var parentContainerHeader = document.createElement('div');
        parentContainerHeader.id = this.container.id + "header";
        parentContainerHeader.style = "z-index:100;background-color:" + COLOUR.Blue + ";color:white;width:100%;min-height:30px;display: flex;";

        var dockBtn = createButton("<", "background-color:rgb(0 84 255);width:30px;max-height:30px;min-height:30px;float:left;margin:0px;border:0px;padding:2px;", () => {this.resetContainerOffset();});

        parentContainerHeader.appendChild(dockBtn);

        if(this.#windowTitle !== null) {
            var title = createText(this.#windowTitle, "display: flex;flex-grow: 1; color: white; font-weight: bold; font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif;text-align: center;vertical-align: middle;align-content: stretch;justify-content:flex-start;flex-direction:column;flex-wrap:nowrap;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;");
            parentContainerHeader.appendChild(title);
        }

        var minimizeBtn = createButton("-", "background-color:#0085ff;width:30px;max-height:30px;min-height:30px;float:right;margin:0px;border:0px;padding:2px;", () => {this.minimize();});
        minimizeBtn.innerHTML = "&#9644";
        parentContainerHeader.appendChild(minimizeBtn);

        var maximizeBtn = createButton("&#9645", "background-color:#00a8ff;width:30px;max-height:30px;min-height:30px;float:right;margin:0px;border:0px;padding:2px;", () => {this.maximize();});
        maximizeBtn.innerHTML = "&#9645";
        parentContainerHeader.appendChild(maximizeBtn);

        var closeBtn = createButton("X", "background-color:red;width:30px;max-height:30px;min-height:30px;float:right;margin:0px;border:0px;padding:2px;", () => {this.hide();});
        parentContainerHeader.appendChild(closeBtn);

        this.container.appendChild(parentContainerHeader);
        this.dragElement(parentContainerHeader, this.container);
    }

    dragElement(element, parent) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if(element) {
            element.onmousedown = dragMouseDown;
        } else {
            alert("error");
        }

        function dragMouseDown(e) {
            e = e || window.event;

            pos3 = e.clientX;
            pos4 = e.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            parent.style.top = (parent.offsetTop - pos2) + "px";
            parent.style.left = (parent.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

var menuOpen;
var menu_Admin;
var menu_Find;
var menu_Area;
var menu_Lnm;
var menu_LED;
var menu_Lightbox;
var menu_Billboard;
var menu_ProductCompare;
var menu_Router;
var menu_Window;
var menu_Vehicle;
var menu_creditCardSurcharge;
var menu_3D;
var menu_PanelSigns;
var menu_Charts;
var menu_POS;
async function initLHSMenu() {
    var container = document.createElement('div');
    container.style = "width:160px;position:fixed;top:82px;left:0px;bottom:0px;background-color:" + COLOUR.DarkGrey + ";box-shadow: rgb(0 0 0) 6px 1px 20px -2px;";
    container.id = "LHSMenu";

    let header = document.createElement('div');
    header.style = StringCombine("display:flex;justify-content:center;align-items:center;width:100%;height:30px;background-color:", COLOUR.DarkGrey);
    container.appendChild(header);

    let headerIcon = document.createElement('img');
    headerIcon.src = ICON.CPUChip;
    headerIcon.style = "height:70%;float:left;" + filterFromHex("#31efff");
    header.appendChild(headerIcon);

    menu_Admin = new AdminPanel(300, 300, "Admin", "Admin");
    menu_Find = new ProductFinder(400, 600, "ProductFinder", "Product Finder");
    menu_Area = new AreaMenu(400, 600, "Area", "Area");
    menu_Lnm = new LnmMenu(400, 600, "Lnm", "Linear Metre");
    menu_LED = new LEDMenu(800, 600, "LED", "LEDs");
    menu_Lightbox = new LightboxMenu(800, 600, "Lightbox", "Lightbox");
    menu_Billboard = new BillboardMenu(1200, 800, "Billboard", "Billboard");
    menu_ProductCompare = new ProductCompareMenu(800, 600, "Compare", "Compare");
    menu_Router = new RouterMenu(800, 600, "Router", "Router");
    menu_Window = new WindowMenu(800, 600, "Window", "Window");
    menu_Vehicle = new VehicleMenu(1500, 600, "Vehicle", "Vehicle");
    menu_creditCardSurcharge = new CreditSurchargeMenu(400, 600, "CreditSurchargeMenu", "Credit Card Surcharge");
    menu_3D = new Menu3D(900, 600, "3DLetterMenu", "3D Letters");
    menu_PanelSigns = new MenuPanelSigns(900, 700, "PanelSignsMenu", "Panel Signs");
    menu_Charts = new ChartMenu(900, 700, "ChartsMenu", "Charts");
    menu_POS = new MenuPOS(900, 700, "MenuPOS", "POS");

    addItem(GM_getResourceURL("Icon_Download"), "Find", "finder");
    addItem(ICON.area, "Area", "m2");
    addItem(ICON.length, "Length", "lnm");
    addItem(ICON.LED, "LED", "LED");
    addItem(ICON.lightbox, "Lightbox", "lightbox", null, "loadedPredefinedParts");
    addItem(ICON.billboard, "Billboard", "billboard", null, "loadedPredefinedParts");
    addItem(ICON.compare, "Compare", "compare", null, "loadedPredefinedParts");
    addItem(ICON.router, "Router", "router", null, "loadedPredefinedParts");
    addItem(ICON.window, "Window", "window", null, "loadedPredefinedParts");
    addItem(ICON.layer, "Panel Signs", "panel", null, "loadedPredefinedParts");
    addItem(ICON.vehicle, "Vehicles", "vehicle", null, "loadedPredefinedParts");
    addItem(ICON.admin, "Admin", "admin", "position:absolute;bottom:0px;");
    addItem(ICON.creditCard, "Surcharge", "surcharge");
    addItem(ICON._3D, "3D Letters", "3D", null, "loadedPredefinedParts");
    addItem(ICON.find, "Charts", "Charts", null, "loadedPredefinedParts");
    addItem(ICON.POS, "POS", "POS", null);

    function addItem(imageSrc, text, openMenuName, overrideCss, unlockListenEvent) {
        var itemContainer = document.createElement('div');
        itemContainer.style = "display:block;float:left;width:100%;height:50px;margin:0px;cursor:pointer;background-color:" + COLOUR.DarkGrey + ";padding:0px;border-bottom:0px solid #00b;";
        itemContainer.style.cssText += overrideCss;
        itemContainer.onmouseover = function() {
            itemContainer.style.backgroundColor = "#333";
        };
        itemContainer.onmouseout = function() {
            itemContainer.style.backgroundColor = COLOUR.DarkGrey;
        };
        itemContainer.onclick = function() {
            openMenu(openMenuName);
            deselectSelectorBars();
            selectorBar.style.backgroundColor = "red";
        };

        var selectorBar = document.createElement('div');
        selectorBar.style = "display:block;float:left;width:5px;height:100%;";
        selectorBar.id = "selectorBar";
        itemContainer.appendChild(selectorBar);

        var image = document.createElement('img');
        image.src = imageSrc;
        image.style = "display:block;float:left;width:25px;height:25px;padding:12.5px 10px;filter:invert(100%);background-size:cover;";
        image.onclick = function() {openMenu(openMenuName);};
        itemContainer.appendChild(image);

        var itemText = document.createElement('div');
        itemText.innerText = text;
        itemText.style = "display:block;float:right;width:80px;height:15px;padding:17.5px 10px;color:white;font-weight:bold; font-family: Century Gothic, CenturyGothic, AppleGothic, sans-serif";
        itemContainer.appendChild(itemText);

        if(unlockListenEvent) {
            itemContainer.style.pointerEvents = "none";
            itemContainer.style.backgroundColor = "#2828ff";
            document.addEventListener(unlockListenEvent, () => {
                itemContainer.style.pointerEvents = "inherit";
                itemContainer.style.backgroundColor = COLOUR.DarkGrey;
            });
        }

        container.appendChild(itemContainer);
    }

    document.getElementsByTagName('body')[0].appendChild(container);
}

function hideAllMenu() {
    menu_Admin.hide();
    menu_Find.hide();
    menu_Area.hide();
    menu_Lnm.hide();
    menu_LED.hide();
    menu_Lightbox.hide();
    menu_Billboard.hide();
    menu_ProductCompare.hide();
    menu_Router.hide();
    menu_Window.hide();
    menu_Vehicle.hide();
    menu_creditCardSurcharge.hide();
    menu_3D.hide();
    menu_PanelSigns.hide();
    menu_Charts.hide();
    menu_POS.hide();
}

function openMenu(menu) {
    if(menuOpen != menu) {
        hideAllMenu();
        if(menu == "LED") {
            menu_LED.show();
        }
        if(menu == "lnm") {
            menu_Lnm.show();
        }
        if(menu == "m2") {
            menu_Area.show();
        }
        if(menu == "finder") {
            menu_Find.show();
        }
        if(menu == "admin") {
            menu_Admin.show();
        }
        if(menu == "lightbox") {
            menu_Lightbox.show();
        }
        if(menu == "router") {
            menu_Router.show();
        }
        if(menu == "billboard") {
            menu_Billboard.show();
        }
        if(menu == "compare") {
            menu_ProductCompare.show();
        }
        if(menu == "window") {
            menu_Window.show();
        }
        if(menu == "panel") {
            menu_PanelSigns.show();
        }
        if(menu == "vehicle") {
            menu_Vehicle.show();
        }
        if(menu == "surcharge") {
            menu_creditCardSurcharge.show();
        }
        if(menu == "3D") {
            menu_3D.show();
        }
        if(menu == "Charts") {
            menu_Charts.show();
        }
        if(menu == "POS") {
            menu_POS.show();
        }
    }
}

function createDragableHeaderAndClose(parentContainer, closeFunction, minimizeFunction, maximizeFunction) {
    var parentContainerHeader = document.createElement('div');
    parentContainerHeader.id = parentContainer.id + "header";
    parentContainerHeader.style = "z-index:100;background-color:" + COLOUR.Blue + ";color:white;width:100%;min-height:30px;display:block;";

    var closeBtn = createButton("X", "background-color:red;width:30px;max-height:30px;min-height:30px;float:right;margin:0px;border:0px;padding:2px;", function() {deselectSelectorBars(); closeFunction();});
    $(closeBtn).hover(function() {
        $(this).css("background-color", "white");
        $(this).css("color", "red");
    }, function() {
        $(this).css("background-color", "red");
        $(this).css("color", "white");
    });
    parentContainerHeader.appendChild(closeBtn);

    if(maximizeFunction) {
        var maximizeBtn = createButton("+", "background-color:#00a8ff;width:30px;max-height:30px;min-height:30px;float:right;margin:0px;border:0px;padding:2px;", function() {maximizeFunction();});
        maximizeBtn.innerHTML = "&#9645";
        $(maximizeBtn).hover(function() {
            $(this).css("background-color", "white");
            $(this).css("color", "#00a8ff");
        }, function() {
            $(this).css("background-color", "#00a8ff");
            $(this).css("color", "white");
        });
        parentContainerHeader.appendChild(maximizeBtn);
    }

    if(minimizeFunction) {
        var minimizeBtn = createButton("-", "background-color:#0085ff;width:30px;max-height:30px;min-height:30px;float:right;margin:0px;border:0px;padding:2px;", function() {minimizeFunction();});
        minimizeBtn.innerHTML = "&#9644";
        $(minimizeBtn).hover(function() {
            $(this).css("background-color", "white");
            $(this).css("color", "#0085ff");
        }, function() {
            $(this).css("background-color", "#0085ff");
            $(this).css("color", "white");
        });
        parentContainerHeader.appendChild(minimizeBtn);
    }

    parentContainer.appendChild(parentContainerHeader);
    dragElement(parentContainer);
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if(document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        //e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function deselectSelectorBars(isSubMenu) {
    if(!isSubMenu) {
        var items = document.querySelectorAll("#selectorBar");
        for(var i = 0; i < items.length; i++) {
            items[i].style.backgroundColor = "transparent";
        }
    } else {
        var items2 = document.querySelectorAll("#selectorBar2");
        for(var i2 = 0; i2 < items2.length; i2++) {
            items2[i2].style.backgroundColor = "transparent";
        }
    }
}
