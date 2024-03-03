var applyCtxScale = false;
function drawRect(ctx, xOffset, yOffset, width, height, originPoint, colour, lineWidth) {
      var localXOffset = xOffset;
      var localYOffset = yOffset;
      if(!originPoint) originPoint = "TL";
      switch(originPoint) {
            case "TL":
                  //do nothing
                  break;
            case "T":
                  localXOffset -= (width / 2);
                  break;
            case "TR":
                  localXOffset -= width;
                  break;
            case "R":
                  localXOffset -= width;
                  localYOffset -= (height / 2);
                  break;
            case "BR":
                  localXOffset -= width;
                  localYOffset -= height;
                  break;
            case "B":
                  localXOffset -= (width / 2);
                  localYOffset -= height;
                  break;
            case "BL":
                  localYOffset -= height;
                  break;
            case "L":
                  localYOffset -= (height / 2);
                  break;
            case "M":
                  localXOffset -= (width / 2);
                  localYOffset -= (height / 2);
                  break;
            default:
                  alert("error");
                  break;
      }
      ctx.beginPath();
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = colour;
      ctx.lineWidth = lineWidth;
      ctx.rect(localXOffset, localYOffset, width, height);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = 'black';
}

function drawFillRect(ctx, xOffset, yOffset, width, height, originPoint, colour, transparency) {
      var localXOffset = xOffset;
      var localYOffset = yOffset;
      if(!originPoint) originPoint = "TL";
      switch(originPoint) {
            case "TL":
                  //do nothing
                  break;
            case "T":
                  localXOffset -= (width / 2);
                  break;
            case "TR":
                  localXOffset -= width;
                  break;
            case "R":
                  localXOffset -= width;
                  localYOffset -= (height / 2);
                  break;
            case "BR":
                  localXOffset -= width;
                  localYOffset -= height;
                  break;
            case "B":
                  localXOffset -= (width / 2);
                  localYOffset -= height;
                  break;
            case "BL":
                  localYOffset -= height;
                  break;
            case "L":
                  localYOffset -= (height / 2);
                  break;
            case "M":
                  localXOffset -= (width / 2);
                  localYOffset -= (height / 2);
                  break;
            default:
                  break;
      }
      ctx.beginPath();
      ctx.globalAlpha = transparency;
      ctx.fillStyle = colour;
      ctx.fillRect(localXOffset, localYOffset, width, height);
      //reset back to default colour, stroke, transparency
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = 'black';
      ctx.stroke();
}

function drawText(ctx, xOffset, yOffset, height, originPoint, text, colour) {
      var localXOffset = xOffset;
      var localYOffset = yOffset;

      var initialFont = ctx.font;
      var intialFillColour = ctx.fillStyle;
      ctx.font = height + "px Arial Bold";
      ctx.fillStyle = colour;
      ctx.textBaseline = "hanging";
      var width = ctx.measureText(text).width;

      if(!originPoint) originPoint = "TL";
      switch(originPoint) {
            case "TL":
                  //do nothing
                  break;
            case "T":
                  localXOffset -= (width / 2);
                  break;
            case "TR":
                  localXOffset -= width;
                  break;
            case "R":
                  localXOffset -= width;
                  localYOffset -= (height / 2);
                  break;
            case "BR":
                  localXOffset -= width;
                  localYOffset -= height;
                  break;
            case "B":
                  localXOffset -= (width / 2);
                  localYOffset -= height;
                  break;
            case "BL":
                  localYOffset -= height;
                  break;
            case "L":
                  localYOffset -= (height / 2);
                  break;
            case "M":
                  localXOffset -= (width / 2);
                  localYOffset -= (height / 2);
                  break;
            default:
                  alert("error");
                  break;
      }
      ctx.beginPath();
      ctx.fillText(text, localXOffset, localYOffset);
      ctx.stroke();
      ctx.font = initialFont;
      ctx.fillStyle = intialFillColour;
}

function drawMeasurement(ctx, xOffset, yOffset, width, height, text, isTopBottom, textOriginPoint) {
      ctx.beginPath();
      ctx.moveTo(xOffset, yOffset);
      ctx.lineTo(xOffset + width, yOffset + height);
      ctx.stroke();
      if(isTopBottom) {
            ctx.moveTo(xOffset, yOffset - 50);
            ctx.lineTo(xOffset, yOffset + 50);
            ctx.stroke();
            ctx.moveTo(xOffset + 20, yOffset - 30);
            ctx.lineTo(xOffset - 20, yOffset + 30);
            ctx.stroke();
            ctx.moveTo(xOffset + width, yOffset - 50);
            ctx.lineTo(xOffset + width, yOffset + 50);
            ctx.stroke();
            ctx.moveTo(xOffset + width + 20, yOffset - 30);
            ctx.lineTo(xOffset + width - 20, yOffset + 30);
            ctx.stroke();
      }
      else {
            ctx.moveTo(xOffset - 50, yOffset);
            ctx.lineTo(xOffset + 50, yOffset);
            ctx.stroke();
            ctx.moveTo(xOffset - 30, yOffset + 20);
            ctx.lineTo(xOffset + 30, yOffset - 20);
            ctx.stroke();
            ctx.moveTo(xOffset - 50, yOffset + height);
            ctx.lineTo(xOffset + 50, yOffset + height);
            ctx.stroke();
            ctx.moveTo(xOffset - 30, yOffset + height + 20);
            ctx.lineTo(xOffset + 30, yOffset + height - 20);
            ctx.stroke();
      }

      var widthOffset = (width == 0 ? 0 : width / 2);
      var heightOffset = (height == 0 ? 0 : height / 2);
      drawText(ctx, xOffset + widthOffset, yOffset + heightOffset, 80, textOriginPoint, text, 'black');
      // ctx.font = "80px Arial";
      //ctx.fillText(parseFloat(leg.legWidth*2+frame.frameWidth_SideA-tframeOffsetX*2)+"mm", xOffset+(leg.legWidth*2+frame.frameWidth_SideA)/2+measurementTextOffset+tframeOffsetX, yOffset+measurementOffset-measurementTextOffset+minYOffset);


}

function drawMeasurement_Verbose(ctx, xOffset, yOffset, width, height, measurementOrigin, text, textSize, colour, lineWidth, crossScale, offsetFromShape, isTopBottom, textOriginPoint, scalesWithCanvas = false, canvasScale = 1) {

      if(scalesWithCanvas === false) {
            textSize = textSize / canvasScale;
            lineWidth = lineWidth / canvasScale;
            crossScale = crossScale / canvasScale;
            offsetFromShape = offsetFromShape / canvasScale;
      }

      ctx.beginPath();
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = colour;
      ctx.lineWidth = lineWidth;

      var widthOffset; //= (width == 0 ? offsetFromShape : width / 2);
      var heightOffset; //= (height == 0 ? offsetFromShape : height / 2);

      switch(measurementOrigin) {
            case "T":
                  xOffset += 0;
                  yOffset -= offsetFromShape;
                  break;
            case "L":
                  xOffset -= offsetFromShape;
                  yOffset += 0;
                  break;
            case "B":
                  xOffset += 0;
                  yOffset += offsetFromShape;
                  break;
            case "R":
                  xOffset += offsetFromShape;
                  yOffset += 0;
                  break;
      }



      ctx.moveTo(xOffset, yOffset);
      ctx.lineTo(xOffset + width, yOffset + height);
      ctx.stroke();

      if(isTopBottom) {
            ctx.moveTo(xOffset, yOffset - 50 * crossScale);
            ctx.lineTo(xOffset, yOffset + 50 * crossScale);
            ctx.stroke();
            ctx.moveTo(xOffset + 20 * crossScale, yOffset - 30 * crossScale);
            ctx.lineTo(xOffset - 20 * crossScale, yOffset + 30 * crossScale);
            ctx.stroke();
            ctx.moveTo(xOffset + width, yOffset - 50 * crossScale);
            ctx.lineTo(xOffset + width, yOffset + 50 * crossScale);
            ctx.stroke();
            ctx.moveTo(xOffset + width + 20 * crossScale, yOffset - 30 * crossScale);
            ctx.lineTo(xOffset + width - 20 * crossScale, yOffset + 30 * crossScale);
            ctx.stroke();
      }
      else {
            ctx.moveTo(xOffset - 50 * crossScale, yOffset);
            ctx.lineTo(xOffset + 50 * crossScale, yOffset);
            ctx.stroke();
            ctx.moveTo(xOffset - 30 * crossScale, yOffset + 20 * crossScale);
            ctx.lineTo(xOffset + 30 * crossScale, yOffset - 20 * crossScale);
            ctx.stroke();
            ctx.moveTo(xOffset - 50 * crossScale, yOffset + height);
            ctx.lineTo(xOffset + 50 * crossScale, yOffset + height);
            ctx.stroke();
            ctx.moveTo(xOffset - 30 * crossScale, yOffset + height + 20 * crossScale);
            ctx.lineTo(xOffset + 30 * crossScale, yOffset + height - 20 * crossScale);
            ctx.stroke();
      }

      var widthOffset = (width == 0 ? 0 : width / 2);
      var heightOffset = (height == 0 ? 0 : height / 2);
      drawText(ctx, xOffset + widthOffset, yOffset + heightOffset, textSize, textOriginPoint, text, colour);
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 0.1;
}

function drawFillCircle(ctx, xOffset, yOffset, radius, originPoint, colour, transparency) {
      var localXOffset = xOffset;
      var localYOffset = yOffset;
      if(!originPoint) originPoint = "TL";
      switch(originPoint) {
            case "TL":
                  //do nothing
                  break;
            case "T":
                  localXOffset -= (radius / 2);
                  break;
            case "TR":
                  localXOffset -= radius;
                  break;
            case "R":
                  localXOffset -= radius;
                  localYOffset -= (radius / 2);
                  break;
            case "BR":
                  localXOffset -= radius;
                  localYOffset -= radius;
                  break;
            case "B":
                  localXOffset -= (radius / 2);
                  localYOffset -= radius;
                  break;
            case "BL":
                  localYOffset -= radius;
                  break;
            case "L":
                  localYOffset -= (radius / 2);
                  break;
            case "M":
                  //localXOffset -= (radius / 2);
                  //localYOffset -= (radius / 2);
                  break;
            default:
                  break;
      }
      ctx.beginPath();
      ctx.globalAlpha = transparency;
      ctx.lineWidth = 0.1;
      ctx.fillStyle = colour;

      ctx.arc(localXOffset, localYOffset, radius, 0, 2 * Math.PI, false);
      ctx.fill();
      //reset back to default colour, stroke, transparency
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = 'black';
      ctx.stroke();
}

function drawLine_WH(ctx, xOffset, yOffset, width, height, colour, thickness, transparency) {
      ctx.beginPath();
      ctx.lineWidth = thickness;
      ctx.globalAlpha = transparency;
      ctx.strokeStyle = colour;
      ctx.moveTo(xOffset, yOffset);
      ctx.lineTo(xOffset + width, yOffset + height);
      ctx.stroke();
      ctx.closePath();
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 0.1;
}

function drawLine_To(ctx, xOffset, yOffset, newPosX, newPosY, colour, thickness, transparency) {
      ctx.beginPath();
      ctx.lineWidth = thickness;
      ctx.globalAlpha = transparency;
      ctx.strokeStyle = colour;
      ctx.moveTo(xOffset, yOffset);
      ctx.lineTo(newPosX, newPosY);
      ctx.stroke();
      ctx.closePath();
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 0.1;
}

function drawDashGrid(ctx, xo, yo, w, h) {
      var spaceY = 50;
      w = parseFloat(w);
      h = parseFloat(h);
      var num = h / spaceY;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(xo, yo, w, h);
      ctx.globalAlpha = 1.0;
      ctx.stroke();
      for(var i = 0; i < num; i++) {
            ctx.beginPath();
            ctx.moveTo(xo, yo + i * spaceY);
            ctx.lineTo(xo + w, yo + (i + 1) * spaceY);
            ctx.stroke();
      }
}