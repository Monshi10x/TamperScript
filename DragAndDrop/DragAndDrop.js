/**
 * 
<div id="div1" ondrop="drop(event)" ondragover="allowDrop(event)"></div>

<img id="drag1" src="img_logo.gif" draggable="true" ondragstart="drag(event)" width="336" height="69">
 */

/**ondragover="allowDrop(event)" */
function allowDrop(e) {
      e.preventDefault();
}

/**ondragstart="drag(event)" */
function drag(ev) {
      ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, optionalCallback) {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");
      ev.target.appendChild(document.getElementById(data));
      if(optionalCallback) optionalCallback();
}

function makeDraggable(element) {
      element.draggable = true;

      element.addEventListener("dragstart", function(e) {
            drag(e);
      });
      element.id = "draggable-" + generateUniqueID();
      element.className += element.id;
}

function makeReceiveDraggable(element) {

      element.ondrop = function(e) {
            drop(e);
      };
      element.ondragover = function(e) {
            allowDrop(e);
      };
}

var onPartOverDrop = function(e, dropOverElement, productNo, partNo) {
      e.preventDefault();
      let dropEvent = new CustomEvent("dropEvent",
            {
                  bubbles: false,
                  detail: {
                        dropOverElement: dropOverElement,
                        productNo: productNo,
                        partNo: partNo
                  }
            }
      );
      document.dispatchEvent(dropEvent);
};

class Sortable2 {
      constructor() {

      }
}