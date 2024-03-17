var container;
var productModalSummary;
function createSummaryHelper() {
    container = document.createElement('div');

    var width = 400;
    var height = 400;

    var offsetTop = (window.innerHeight - height) / 2 + 100;
    var str = "top:" + offsetTop + "px;";
    console.log(str);
    container.style = "width:" + width + "px;height:" + height + "px;background-color:white;z-index:3000;display:none;position:fixed;" + str + "left:" + 0 + "px";

    function addText(text) {
        var field = document.querySelector("#modalProductSummary > div:nth-child(4) > div > div.trumbowyg-editor.notranslate");
        var target = document.createTextNode("\u0001");
        document.getSelection().getRangeAt(0).insertNode(target);
        var position = field.innerHTML.indexOf("\u0001");
        console.log(position);
        target.parentNode.removeChild(target);

        var fieldCurrentText = field.innerHTML;

        function addStr(str, index, stringToAdd) {
            return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
        }

        field.innerHTML = addStr(fieldCurrentText, (position == -1 ? 0 : position), text + "<br>");  //outPut : "This is a modified string"

        //Delete Blank Spaces At End
        var txt = field.innerHTML;
        console.log(txt);
        txt = txt.replaceAll('<br><br>', '<br>');
        txt = txt.replaceAll('<br><br><br>', '<br>');
        txt = txt.replaceAll('<br><br><br><br>', '<br>');
        txt = txt.replaceAll('<br><br><br><br><br>', '<br>');
        txt = txt.replaceAll('<br><br><br><br><br><br>', '<br>');
        txt = txt.replaceAll('<br><br><br><br><br><br><br>', '<br>');
        txt = txt.replaceAll('<br><br><br><br><br><br><br><br>', '<br>');
        txt = txt.replaceAll('<br><br><br><br><br><br><br><br><br>', '<br>');
        txt = txt.replaceAll('<br><br><br><br><br><br><br><br><br><br>', '<br>');
        txt = txt.replaceAll('<br><br><br><br><br><br><br><br><br><br><br>', '<br>');
        txt = txt.replaceAll('<br><br><br><br><br><br><br><br><br><br><br><br>', '<br>');
        txt = txt.replaceAll('<br><br><br><br><br><br><br><br><br><br><br><br><br>', '<br>');
        txt = txt.replaceAll('<div><br></div><div><br></div>', '<div><br></div>');
        txt = txt.replaceAll('<div><br></div><div><br></div><div><br></div>', '<div><br></div>');
        txt = txt.replaceAll('<div><br></div><div><br></div><div><br></div><div><br></div>', '<div><br></div>');
        txt = txt.replaceAll('<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div>', '<div><br></div>');
        txt = txt.replaceAll('<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div>', '<div><br></div>');
        txt = txt.replaceAll('<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div>', '<div><br></div>');
        txt = txt.replaceAll('<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div>', '<div><br></div>');
        txt = txt.replaceAll('<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div>', '<div><br></div>');
        txt = txt.replaceAll('<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div>', '<div><br></div>');
        txt = txt.replaceAll('<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div>', '<div><br></div>');
        txt = txt.replaceAll('<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div>', '<div><br></div>');
        txt = txt.replaceAll('<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div>', '<div><br></div>');
        txt = txt.replaceAll('<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div>', '<div><br></div>');
        txt = txt.replaceAll('<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div>', '<div><br></div>');
        txt = txt.replaceAll('<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div>', '<div><br></div>');
        txt = txt.replaceAll('<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div>', '<div><br></div>');
        field.innerHTML = txt;

        $(field).keyup();
        $(field).trigger('keyup');
        $(field).focus();
    }

    var qtyField = createInput_Infield("Qty (opt)", null, "width:20%", null, container, false, 1);
    var widthField = createInput_Infield("Width", null, "width:25%", null, container, false, 100);
    var heightField = createInput_Infield("Height", null, "width:25%", null, container, false, 100);

    var sizeBtn = createButton("+", "width:10%", function() {
        addText((qtyField[1].value != '' ? "x" + qtyField[1].value + " @ " : "") + widthField[1].value + "mmW x " + heightField[1].value + "mmH");
    });

    var btn1 = createButton("Includes Install", "width:93%", function() {
        addText(this.innerText);
    });
    var btn1b = createButton("Install Not Included, or Separately", "width:93%", function() {
        addText(this.innerText);
    });
    var btn2 = createButton("Includes Artwork & Proofing", "width:93%", function() {
        addText(this.innerText);
    });
    var btn3 = createButton("Supply Only", "width:93%", function() {
        addText(this.innerText);
    });
    var btn4 = createButton("Includes Freight & Handling", "width:93%", function() {
        addText(this.innerText);
    });
    var btn5 = createButton("Important", "width:93%;", function() {
        addText("<div style='color: red;'><b>Important</b></div>");
    });

    window.addEventListener('resize', function() {
        container.style.top = (window.innerHeight - height) / 2 + 100 + "px";
        console.log('in');
    });

    container.appendChild(sizeBtn);
    container.appendChild(btn1);
    container.appendChild(btn1b);
    container.appendChild(btn2);
    container.appendChild(btn3);
    container.appendChild(btn4);
    container.appendChild(btn5);

    document.getElementsByTagName('body')[0].appendChild(container);
}
function showSummaryHelper() {
    container.style.display = "block";
    var width = 400;
    var height = 400;

    // var bodyRect = document.body.getBoundingClientRect();
    //var elemRect = productModalSummary.getBoundingClientRect();
    // var offsetTop   = elemRect.top - bodyRect.top;
    // var offsetLeft   = elemRect.left - bodyRect.left - width - 30;
    //container.style.top=offsetTop+"px";
    //container.style.left=offsetLeft+"px";
    /*
    productModalSummary.addEventListener('mousemove', e => {
        elemRect = productModalSummary.getBoundingClientRect();
        offsetTop   = elemRect.top - bodyRect.top;
        offsetLeft   = elemRect.left - bodyRect.left - width - 30;
        container.style.top=offsetTop+"px";
        container.style.left=offsetLeft+"px";
    });*/

}
function closeSummaryHelper() {
    container.style.display = "none";
}

function summaryHelperTick() {
    productModalSummary = document.getElementById("modalProductSummary");

    if(productModalSummary.style.display == "block") {
        if(container.style.display != "block") showSummaryHelper();
    } else {
        if(container.style.display == "block") closeSummaryHelper();
    }
}