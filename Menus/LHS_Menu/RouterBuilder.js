class RouterMenu extends LHSMenuWindow {

    constructor(width, height, ID, windowTitle) {
        super(width, height, ID, windowTitle);
        this.addPages(1);
    }

    show() {
        super.show();

        var page = this.getPage(0);

        while(page.hasChildNodes()) {page.removeChild(page.lastChild);}
        while(this.footer.hasChildNodes()) {this.footer.removeChild(this.footer.lastChild);}

        var btn_createInExisting = createButton("+ To Existing Product", "margin:0px;width:80%", createRouterProduct);
        this.footer.appendChild(btn_createInExisting);
        var input_createInExisting = createInput("P.No", null, "width:18%;margin:0px;box-shadow:0px;height:23px;", null);
        this.footer.appendChild(input_createInExisting);

        let size = new Size(page, null);

        let sheetMaterial = new Material(page, Sheet, size);

        let production = new Production(page, null, function() {});

        async function createRouterProduct() {
            if(input_createInExisting.value == "") {
                alert("Product Number must not be empty");
            } else {
                minimizeRouterBuilder();
                var productNo = parseFloat(input_createInExisting.value);
                var partIndex = getNumPartsInProduct(productNo);

                //-------Production----------//
                partIndex = await production.Create(productNo, partIndex);

                //-------Router-----------//
                partIndex = await router.Create(productNo, partIndex);
                Toast.notify("Done.", 3000, {position: "top-right"});
            }
        }

        //this.interval = setInterval(() => {this.tick();}, 1000 / 2);
    }

    hide() {
        super.hide();
        //clearInterval(this.interval);
    }

    tick() {
        this.tickUpdate();
    }

    tickUpdate() {

    }
}

/*
var RouterBuilderContainer;
async function createRouterBuilder() {
    RouterBuilderContainer = document.createElement('div');

    RouterBuilderContainer.id = "routerBuilderContainer";
    RouterBuilderContainer.style = "z-index:100;background-color:#fff;color:white;width:600px;min-height:500px;max-height:800px;position: fixed;top:82px;left:" + menuXOffset + "px;display:none;";
}
async function showRouterBuilder(parentToAppendTo) {


}
function hideRouterBuilder() {
    //routerBuilder_ChosenMaterials=[];
    //routerBuilder_RouterTime=[];
    //routerBuilder_Production=[];
    RouterBuilderContainer.style.display = "none";
    while(RouterBuilderContainer.childElementCount > 0) {RouterBuilderContainer.removeChild(RouterBuilderContainer.lastChild);}
    maximizeRouterBuilder();
}
function minimizeRouterBuilder() {
    RouterBuilderContainer.style.width = "100px";
}
function maximizeRouterBuilder() {
    RouterBuilderContainer.style.width = "600px";
}
*/
