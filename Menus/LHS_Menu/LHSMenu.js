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
    #header;

    #doesTick = false;

    get doesTick() {
        return this.#doesTick;
    }
    set doesTick(value) {
        this.#doesTick = value;
    }

    get header() {
        return this.#header;
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
        this.#container.style = "z-index:100;background-color:" + COLOUR.MediumGrey + ";color:" + COLOUR.White + ";width:" + this.#width + ";height:" + this.#height + ";position:fixed;top:" + this.#yOffset + "px;left:" + this.#xOffset + "px;display: none;flex-direction: column;overflow: hidden; box-shadow: rgb(0 0 0) 6px 1px 20px -2px;";

        this.createDragableHeaderAndClose();

        this.#body = document.createElement('div');
        this.#body.id = ID + "body";
        this.#body.style = "margin: 0px; min-height: 700px; max-height: 1500px; width: 100%; padding: 0px; color: white; cursor: pointer; border-style: none;flex: 1 1 auto;min-height: 0;overflow: auto; ";

        this.#pageButtonContainer = document.createElement('div');
        this.#pageButtonContainer.id = ID + "pageButtonContainer";
        this.#pageButtonContainer.style = "margin: 0px; min-height: 0px; max-height: 50px; width: 100%; padding: 0px; float: left; color: white; cursor: pointer; border-style: none; overflow-y: none; background-color:white;flex: 0 0 auto;";

        this.#previousPageBtn = createButton("< Back", "width:100px;float:left;margin:0;", this.previousPage);
        setFieldHidden(true, this.#previousPageBtn);
        this.#nextPageBtn = createButton("Next >", "width:100px;float:right;margin:0;", this.nextPage);
        setFieldHidden(true, this.#nextPageBtn);

        this.#footer = document.createElement('div');
        this.#footer.id = ID + "footer";
        this.#footer.style = "margin: 0px; min-height: 35px;max-height: 100px; width: 100%; padding: 0px; float: left; display: block; color: white; cursor: pointer; border-style: none; overflow-y: auto; background-color:#fff;border-top: 1px solid black;flex: 0 0 auto;";

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
            newPage.style = "margin: 0px;height:100%; min-height:400px;max-height:100%;width: 100%; padding: 0px; float: left; display: none; color: white; cursor: pointer; border-style: none; overflow-y: auto; overflow-x:none;background-color:" + COLOUR.MediumGrey + ";";
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

    set buttonContainer(value) {
        this.#pageButtonContainer = value;
    }

    get buttonContainer() {
        return this.#pageButtonContainer;
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

        this.#header = parentContainerHeader;

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
var menu_Travel;
var menu_OrderedVinyls;
var menu_Capral;
var menu_Console;
async function initLHSMenu() {
    var container = document.createElement('div');
    container.style = "width:160px;position:fixed;top:82px;left:0px;bottom:0px;background-color:" + "rgb(36 36 36)" + ";box-shadow: rgb(0, 0, 0) 6px 1px 20px -2px,rgb(0, 0, 0) 6px 1px 60px -2px;display:flex;flex-direction:column;overflow:hidden;";
    container.id = "LHSMenu";

    let header = document.createElement('div');
    header.style = StringCombine("display:flex;justify-content:center;align-items:center;width:100%;height:30px;background-color:", "rgb(36 36 36)");
    container.appendChild(header);

    let itemsContainer = document.createElement('div');
    itemsContainer.style = "flex:1 1 auto;position:relative;overflow-y:auto;overflow-x:hidden;";
    container.appendChild(itemsContainer);

    let headerIcon = document.createElement('img');
    headerIcon.src = ICON.CPUChip;
    headerIcon.style = "height:70%;float:left;" + filterFromHex("#31efff");
    headerIcon.classList.add("CPUChipIcon");
    header.appendChild(headerIcon);

    menu_Admin = new AdminPanel("400px", "600px", "Admin", "Admin");
    menu_Find = new ProductFinder("400px", "calc(100% - 85px)", "ProductFinder", "Product Finder");
    menu_Area = new AreaMenu("400px", "calc(100% - 85px)", "Area", "Area");
    menu_Lnm = new LnmMenu("400px", "calc(100% - 85px)", "Lnm", "Linear Metre");
    menu_LED = new LEDMenu("800px", "calc(100% - 85px)", "LED", "LEDs");
    menu_Lightbox = new LightboxMenu("800px", "calc(100% - 85px)", "Lightbox", "Lightbox");
    menu_Billboard = new BillboardMenu("1200px", "calc(100% - 85px)", "Billboard", "Billboard");
    menu_ProductCompare = new ProductCompareMenu("800px", "calc(100% - 85px)", "Compare", "Compare");
    menu_Router = new RouterMenu("800px", "calc(100% - 85px)", "Router", "Router");
    menu_Window = new WindowMenu("800px", "calc(100% - 85px)", "Window", "Window");
    menu_Vehicle = new VehicleMenu("1600px", "calc(100% - 85px)", "Vehicle", "Vehicle");
    menu_creditCardSurcharge = new CreditSurchargeMenu("400px", "calc(100% - 85px)", "CreditSurchargeMenu", "Credit Card Surcharge");
    menu_3D = new Menu3D("900px", "calc(100% - 85px)", "3DLetterMenu", "3D Letters");
    menu_PanelSigns = new MenuPanelSigns("900px", "calc(100% - 85px)", "PanelSignsMenu", "Panel Signs");
    menu_Charts = new ChartMenu("900px", "700px", "ChartsMenu", "Charts");
    menu_POS = new MenuPOS("900px", "calc(100% - 85px)", "MenuPOS", "POS");
    menu_Travel = new MenuMap("900px", "calc(100% - 85px)", "MenuMap", "Map");
    menu_OrderedVinyls = new OrderedVinyls("900px", "calc(100% - 85px)", "OrderedVinyls", "Ordered Vinyls");
    menu_Capral = new CapralMenu("1000px", "calc(100% - 85px)", "CapralMenu", "Capral");
    menu_Console = new ConsoleMenu("500px", "calc(100% - 85px)", "ConsoleMenu", "Console");

    addItem(GM_getResourceURL("Icon_Find"), "Find", "finder");
    addItem(GM_getResourceURL("Icon_M2"), "Area", "m2");
    addItem(GM_getResourceURL("Icon_Lnm"), "Length", "lnm");
    addItem(GM_getResourceURL("Icon_LED"), "LED", "LED");
    addItem(GM_getResourceURL("Icon_Lightbox"), "Lightbox", "lightbox", {unlockListenEvent: "loadedPredefinedParts"});
    addItem(GM_getResourceURL("Icon_Billboard"), "Billboard", "billboard", {unlockListenEvent: "loadedPredefinedParts"});
    addItem(GM_getResourceURL("Icon_Compare"), "Compare", "compare", {unlockListenEvent: "loadedPredefinedParts"});
    addItem(GM_getResourceURL("Icon_Router"), "Router", "router", {unlockListenEvent: "loadedPredefinedParts"});
    addItem(GM_getResourceURL("Icon_Window"), "Window", "window", {unlockListenEvent: "loadedPredefinedParts"});
    addItem(GM_getResourceURL("Icon_Layers"), "Panel Signs", "panel", {unlockListenEvent: "loadedPredefinedParts"});
    addItem(GM_getResourceURL("Icon_Vehicle"), "Vehicles", "vehicle", {unlockListenEvent: "loadedPredefinedParts"});
    addItem(GM_getResourceURL("Icon_Admin"), "Admin", "admin");
    addItem(GM_getResourceURL("Icon_CreditCard"), "Surcharge", "surcharge");
    addItem(GM_getResourceURL("Icon_3D"), "3D Letters", "3D", {unlockListenEvent: "loadedPredefinedParts"});
    addItem(GM_getResourceURL("Icon_Chart"), "Charts", "Charts", {unlockListenEvent: "loadedPredefinedParts"});
    addItem(GM_getResourceURL("Icon_POS"), "POS", "POS");
    addItem(GM_getResourceURL("Icon_Map"), "Travel", "Travel");
    addItem("https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Roll.svg", "Ord. Vinyls", "OrderedVinyls");
    addItem(GM_getResourceURL("Icon_Capral"), "Capral", "Capral");
    const consoleItem = addItem(GM_getResourceURL("Icon_Find"), "Console", "console", {badgeType: "consoleErrors"});
    registerConsoleErrorBadge(consoleItem.querySelector(".lhsMenuBadge"));

    function addItem(imageSrc, text, openMenuName, options = {}) {
        const {overrideCss, unlockListenEvent, badgeType} = options;
        var itemContainer = document.createElement('div');
        itemContainer.style = "display:block;float:left;width:100%;height:50px;margin:0px;cursor:pointer;background-color:" + "rgb(36 36 36)" + ";padding:0px;border-bottom:0px solid #00b;position:relative;";
        itemContainer.classList.add("lhsMenuItem");
        itemContainer.dataset.selected = "false";
        itemContainer.style.cssText += overrideCss;
        itemContainer.onmouseover = function() {
            itemContainer.style.backgroundColor = COLOUR.DarkGrey;
        };
        itemContainer.onmouseout = function() {
            if(itemContainer.dataset.selected === "true") return;
            itemContainer.style.backgroundColor = "rgb(36 36 36)";
        };
        itemContainer.onclick = function() {
            openMenu(openMenuName);
            deselectSelectorBars();
            selectorBar.style.backgroundColor = "#0099FF";
            itemContainer.dataset.selected = "true";
            itemContainer.style.backgroundColor = COLOUR.DarkGrey;
        };

        var selectorBar = document.createElement('div');
        selectorBar.style = "display:block;float:left;width:5px;height:100%;";
        selectorBar.id = "selectorBar";
        itemContainer.appendChild(selectorBar);

        var image = document.createElement('img');
        image.src = imageSrc;
        image.style = "display:block;float:left;width:45px;height:50px;;background-size:cover;";
        image.onclick = function() {openMenu(openMenuName);};
        itemContainer.appendChild(image);

        var itemText = document.createElement('div');
        itemText.innerText = text;
        itemText.style = "display:block;float:right;width:80px;height:15px;padding:17.5px 10px;color:white;font-weight:bold; font-family: Century Gothic, CenturyGothic, AppleGothic, sans-serif";
        itemContainer.appendChild(itemText);

        if(badgeType === "consoleErrors") {
            const badge = document.createElement("div");
            badge.className = "lhsMenuBadge";
            badge.style = "position:absolute;top:8px;right:8px;min-width:18px;height:18px;padding:0 6px;border-radius:9px;background-color:" + COLOUR.Red + ";color:white;font-size:11px;display:none;align-items:center;justify-content:center;";
            itemContainer.appendChild(badge);
        }

        if(unlockListenEvent) {
            itemContainer.style.pointerEvents = "none";
            //itemContainer.style.backgroundColor = COLOUR.Black;
            let loader = new Loader(itemContainer);
            document.addEventListener(unlockListenEvent, () => {
                itemContainer.style.pointerEvents = "inherit";
                itemContainer.style.backgroundColor = "rgb(36 36 36)";
                loader.Delete();
            });
        }

        itemsContainer.appendChild(itemContainer);
        return itemContainer;
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
    menu_Travel.hide();
    menu_OrderedVinyls.hide();
    menu_Capral.hide();
    menu_Console.hide();
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
        if(menu == "Travel") {
            menu_Travel.show();
        }
        if(menu == "OrderedVinyls") {
            menu_OrderedVinyls.show();
        }
        if(menu == "Capral") {
            menu_Capral.show();
        }
        if(menu == "console") {
            menu_Console.show();
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
        var menuItems = document.querySelectorAll(".lhsMenuItem");
        for(var i2 = 0; i2 < menuItems.length; i2++) {
            menuItems[i2].dataset.selected = "false";
            menuItems[i2].style.backgroundColor = "rgb(36 36 36)";
        }
    } else {
        var items2 = document.querySelectorAll("#selectorBar2");
        for(var i2 = 0; i2 < items2.length; i2++) {
            items2[i2].style.backgroundColor = "transparent";
        }
    }
}
