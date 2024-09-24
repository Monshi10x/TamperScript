class Laser extends SubMenu {

      static maxCutSize = {width: 4100, height: 2100};

      constructor(parentContainer, canvasCtx, updateFunction, sizeClass) {
            super(parentContainer, canvasCtx, updateFunction, "CNC Laser");
      }
}