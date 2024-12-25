class Toggle {
      #currentState = "off";
      #toggleOnFunction;
      #toggleOffFunction;

      constructor(toggleOnFunction, toggleOffFunction) {
            this.#toggleOnFunction = toggleOnFunction;
            this.#toggleOffFunction = toggleOffFunction;
      }

      toggle() {
            if(this.#currentState == "off") {
                  this.#toggleOffFunction();
                  this.#currentState = "on";
            } else {
                  this.#toggleOnFunction();
                  this.#currentState = "off";
            }
      }
}