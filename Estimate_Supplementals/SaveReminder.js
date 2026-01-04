class SaveReminder {
      constructor() {
            this.intervalMs = 10 * 60 * 1000;
            this.toastDurationMs = 60 * 1000;
            this._intervalId = null;
            this._initialTimeoutId = null;
            this._currentToastId = null;

            this.start();
      }

      start() {
            this.stop();

            this._initialTimeoutId = window.setTimeout(() => {
                  this._showReminder();
                  this._intervalId = window.setInterval(() => this._showReminder(), this.intervalMs);
            }, this.intervalMs);
      }

      stop() {
            if(this._initialTimeoutId) {
                  window.clearTimeout(this._initialTimeoutId);
                  this._initialTimeoutId = null;
            }
            if(this._intervalId) {
                  window.clearInterval(this._intervalId);
                  this._intervalId = null;
            }
      }

      _showReminder() {
            if(this._currentToastId) {
                  Toast.dismiss(this._currentToastId);
                  this._currentToastId = null;
            }

            const toast = Toast.confirm("Would you like to save this estimate/order now?", {
                  title: "Save reminder",
                  icon: "💾",
                  duration: this.toastDurationMs,
                  pauseOnHover: true,
                  closeOnClick: false,
                  showProgress: true,
                  position: "top-right",
                  yesLabel: "Yes, save",
                  noLabel: "Not now",
                  onYes: () => this._triggerSave(),
                  onNo: () => {},
            });

            this._currentToastId = toast?.id || null;
      }

      _triggerSave() {
            const saveButton = document.getElementById("hlManualSaveOrder");
            if(saveButton) {
                  saveButton.click();
                  Toast.notify("Saving your estimate/order…", 3000, {position: "top-right", icon: "💾"});
            } else {
                  Toast.warn("Save button not available right now.", 4000, {position: "top-right"});
            }
      }
}
