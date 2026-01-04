var customContextMenuContainer;
function initCustomContextMenu() {
      customContextMenuContainer = document.createElement('div');
      customContextMenuContainer.style = "display:none;width:350px;min-height:50px;box-shadow: rgb(0 0 0 / 80%) 3px 4px 10px 0px;background-color:white;border:solid black 1px;position:absolute;z-index:10000;left:0;top:0;padding:0px;";
      customContextMenuContainer.oncontextmenu = function(event) {
            event.preventDefault();
      };

      document.body.appendChild(customContextMenuContainer);
}

var contextParentContainer;
function showCustomContextMenu(container, ...args) {
      contextParentContainer = container;

      contextParentContainer.oncontextmenu = null;
      contextParentContainer.oncontextmenu = function(event) {
            event.preventDefault();

            let x = event.pageX;
            let y = event.pageY;

            if(!customContextMenuContainer) initCustomContextMenu();
            setFieldHidden(false, customContextMenuContainer);

            customContextMenuContainer.style.left = x + "px";
            customContextMenuContainer.style.top = y + "px";

            removeAllChildrenFromParent(customContextMenuContainer);

            var closeBtn = createButton("X", "background-color:red;width:20px;height:20px;position:absolute;top:-21px;right:0;margin:0px;min-height:20px;border:0px;", closeCustomContextMenu);
            customContextMenuContainer.appendChild(closeBtn);

            for(var i = 0; i < args.length; i++) {
                  customContextMenuContainer.appendChild(args[i]);
            }
      };

}

function closeCustomContextMenu() {
      setFieldHidden(true, customContextMenuContainer);
      if(customContextMenuContainer) deleteElement(customContextMenuContainer);
      customContextMenuContainer = null;
      if(contextParentContainer) contextParentContainer.oncontextmenu = null;
}

function newContextItem(name, callback, ...args) {
      var contextItem = createText(name, "width: 192px;height:20px;color:white;margin:0px;font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif;border-bottom:0px black solid; background-color:" + COLOUR.DarkGrey + ";");
      contextItem.innerText = name;
      $(contextItem).hover(function() {
            contextItem.style.cursor = "pointer";
            $(this).css("background-color", COLOUR.Blue);
      }, function() {
            $(this).css("background-color", COLOUR.DarkGrey);
      });
      contextItem.onclick = () => {
            closeCustomContextMenu();
            callback(...args);
      };
      return contextItem;
}

function newContextItemFile(name, callback, ...args) {
      var contextItem = createText(name, "width: 192px;height:20px;color:white;margin:0px;font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif;border-bottom:0px black solid; background-color:" + COLOUR.DarkGrey + ";");
      contextItem.innerText = name;
      $(contextItem).hover(function() {
            contextItem.style.cursor = "pointer";
            $(this).css("background-color", COLOUR.Blue);
      }, function() {
            $(this).css("background-color", COLOUR.DarkGrey);
      });

      var itemChooseBtn = document.createElement('input');
      itemChooseBtn.style = "z-index:1000";
      itemChooseBtn.type = "file";
      itemChooseBtn.id = "itemChooseBtn";
      itemChooseBtn.multiple = false;
      itemChooseBtn.style = "display:none";
      itemChooseBtn.accept = ".txt, text/plain";
      contextItem.appendChild(itemChooseBtn);

      var itemChooseLabel = document.createElement('label');
      itemChooseLabel.htmlFor = "itemChooseBtn";
      itemChooseLabel.innerText = "Choose";
      itemChooseLabel.style = "display:none;background-color: indigo;color: white;padding: 0.5rem;font - family: sans - serif;border - radius: 0.3rem;cursor: pointer;position:absolute;top:0px;left:0px";
      contextItem.appendChild(itemChooseLabel);

      contextItem.addEventListener("change", (e) => {
            callback(e, ...args);
            closeCustomContextMenu();
      });

      contextItem.onclick = () => {
            $(itemChooseBtn)[0].click();
      };
      return contextItem;
}


function newContextSubheading(name) {
      var contextItem = createText(name, "width: 192px;height:12px;color:" + COLOUR.MediumGrey + ";margin:0px;font-size:10px;text-align:center;font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif; background-color:" + COLOUR.Black + ";");
      contextItem.innerText = name;
      return contextItem;
}

function newContextSubdivision() {
      var contextItem = createHr("padding:0px;margin:0px auto;width:calc(100% - 1px);height:2px;border-radius:0;border-width: 1px;");
      return contextItem;
}