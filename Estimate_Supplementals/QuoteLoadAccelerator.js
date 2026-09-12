class QuoteLoadAccelerator {
	constructor(options = {}) {
		this.concurrency = options.concurrency || 3;
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
		let nextIndex = 0;
		let completed = 0;
		onProgress({completed, total: expanders.length});

		let loadNext = async () => {
			while(nextIndex < expanders.length) {
				let expander = expanders[nextIndex];
				nextIndex++;
				try {
					if(await this.hydratePart(expander)) completed++;
				} catch(error) {
					console.warn('[Corebridge preload] Could not preload a part.', error);
				}
				onProgress({completed, total: expanders.length});
				await this.delay(100);
			}
		};

		try {
			let workers = [];
			let workerCount = Math.min(this.concurrency, expanders.length);
			for(let index = 0; index < workerCount; index++) workers.push(loadNext());
			await Promise.all(workers);
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

	async hydratePart(expander) {
		let part = expander.isConnected ? expander.closest('div[id^="ord_prod_part_"]') : null;
		if(!part || expander.classList.contains('collapse')) return false;

		let userChangedPart = false;
		let noteUserChange = event => {
			if(event.isTrusted) userChangedPart = true;
		};
		part.addEventListener('click', noteUserChange, true);

		try {
			expander.click();
			await this.waitForCorebridgeRequests();

			let closeExpander = part.querySelector('.partExpander.collapse');
			if(!userChangedPart && closeExpander) closeExpander.click();
			this.loadedExpanders.add(expander);
			return true;
		} finally {
			part.removeEventListener('click', noteUserChange, true);
		}
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
