class QuoteLoadAccelerator {
	constructor(options = {}) {
		this.batchSize = options.batchSize || 6;
		this.minimumOpenMs = options.minimumOpenMs || 350;
		this.maximumOpenMs = options.maximumOpenMs || 8000;
		this.loadedExpanders = new WeakSet();
		this.isLoading = false;
	}

	async loadAll(options = {}) {
		if(this.isLoading) return {completed: 0, total: 0};
		this.isLoading = true;

		let onProgress = typeof options.onProgress === 'function' ? options.onProgress : () => {};
		let expanders = this.findUnloadedExpanders();
		let completed = 0;
		onProgress({completed, total: expanders.length});

		try {
			for(let index = 0; index < expanders.length; index += this.batchSize) {
				let batch = expanders.slice(index, index + this.batchSize);
				completed += await this.hydrateBatch(batch);
				onProgress({completed, total: expanders.length});
				await this.delay(100);
			}
		} finally {
			this.isLoading = false;
		}

		return {completed, total: expanders.length};
	}

	findUnloadedExpanders() {
		let collapsedExpanders = [];
		let products = document.querySelectorAll('div[class^="ord-prod-model-item"]');
		for(let productIndex = 0; productIndex < products.length; productIndex++) {
			let expanders = products[productIndex].querySelectorAll('.partExpander');
			for(let partIndex = 0; partIndex < expanders.length; partIndex++) {
				let expander = expanders[partIndex];
				if(expander.classList.contains('collapse')) {
					this.loadedExpanders.add(expander);
				} else if(!this.loadedExpanders.has(expander)) {
					collapsedExpanders.push(expander);
				}
			}
		}
		return collapsedExpanders;
	}

	async hydrateBatch(expanders) {
		let parts = [];
		for(let index = 0; index < expanders.length; index++) {
			let expander = expanders[index];
			let part = expander.isConnected ? expander.closest('div[id^="ord_prod_part_"]') : null;
			if(!part || expander.classList.contains('collapse')) continue;

			let state = {expander, part, userChangedPart: false, noteUserChange: null, wasOpened: false};
			state.noteUserChange = event => {
				if(event.isTrusted) state.userChangedPart = true;
			};
			part.addEventListener('click', state.noteUserChange, true);
			parts.push(state);
		}

		try {
			// Clicking the complete batch first lets Chrome run several independent
			// Corebridge requests in parallel without flooding the legacy page.
			for(let index = 0; index < parts.length; index++) {
				let state = parts[index];
				state.expander.click();
				state.wasOpened = true;
			}
			await this.waitForCorebridgeRequests();
			for(let index = 0; index < parts.length; index++) {
				let state = parts[index];
				let closeExpander = state.part.querySelector('.partExpander.collapse');
				if(!state.userChangedPart && closeExpander) closeExpander.click();
			}
		} finally {
			for(let index = 0; index < parts.length; index++) {
				let state = parts[index];
				state.part.removeEventListener('click', state.noteUserChange, true);
			}
			for(let index = 0; index < parts.length; index++) {
				if(parts[index].wasOpened) this.loadedExpanders.add(parts[index].expander);
			}
		}

		return parts.filter(state => state.wasOpened).length;
	}

	waitForCorebridgeRequests() {
		let startedAt = Date.now();
		return new Promise(resolve => {
			let check = () => {
				let elapsed = Date.now() - startedAt;
				let pageJQuery = typeof unsafeWindow !== 'undefined' ? unsafeWindow.jQuery : null;
				let requestsActive = pageJQuery && typeof pageJQuery.active === 'number'
					? pageJQuery.active > 0
					: false;

				if(elapsed >= this.maximumOpenMs || (elapsed >= this.minimumOpenMs && !requestsActive)) {
					resolve();
					return;
				}
				window.setTimeout(check, 100);
			};
			window.setTimeout(check, this.minimumOpenMs);
		});
	}

	delay(milliseconds) {
		return new Promise(resolve => window.setTimeout(resolve, milliseconds));
	}
}
