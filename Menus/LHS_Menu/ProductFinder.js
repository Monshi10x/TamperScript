class ProductFinder extends LHSMenuWindow {

    constructor(width, height, ID, windowTitle) {
        super(width, height, ID, windowTitle);
        this.addPages(1);
    }

    show() {
        super.show();

        var page = this.getPage(0);

        while(page.hasChildNodes()) {page.removeChild(page.lastChild);}
        while(this.footer.hasChildNodes()) {this.footer.removeChild(this.footer.lastChild);}

        var productNameElements = document.querySelectorAll("input[id^='productDescription']");
        for(var i = 0; i < productNameElements.length; i++) {
            var elem = document.createElement('div');
            elem.style = "background-color:" + COLOUR.Blue + ";margin-top:10px;margin-left:10px;margin-right:10px;margin-bottom:0px;min-height:15px;width:90%;padding:5px;float:left;display:block;color:white;cursor: pointer;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;";
            elem.id = i;
            elem.innerHTML = "<b>Product " + parseInt(i + 1) + " -</b> " + productNameElements[i].value;
            $(elem).hover(function() {
                $(this).css("background-color", "#0af");
            }, function() {
                $(this).css("background-color", COLOUR.Blue);
            });
            $(elem).on('click', function() {
                const el = document.getElementsByClassName("ord-prod-model-item")[this.id];
                const y = el.getBoundingClientRect().top + window.pageYOffset - 85;

                window.scrollTo({top: y, behavior: 'smooth'});
            });
            page.appendChild(elem);
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