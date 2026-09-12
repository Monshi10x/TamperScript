class QuoteLoadAccelerator {
	constructor(options = {}) {
		this.concurrency = options.concurrency || 3;
		this.minimumOpenMs = options.minimumOpenMs || 350;
		this.maximumOpenMs = options.maximumOpenMs || 8000;
		this.queue = [];
		this.queued = new WeakSet();
		this.activeCount = 0;
		this.scanTimer = null;
		this.observer = null;
		this.started = false;
	}

	start() {
		if(this.started) return;
		this.started = true;

		this.observer = new MutationObserver(() => this.scheduleScan());
		this.observer.observe(document.body, {childList: true, subtree: true});
		window.setTimeout(() => this.scan(), 1200);
	}

	scheduleScan() {
		if(this.scanTimer !== null) return;
		this.scanTimer = window.setTimeout(() => {
			this.scanTimer = null;
			this.scan();
		}, 250);
	}

	scan() {
		let products = document.querySelectorAll('div[class^="ord-prod-model-item"]');
		for(let productIndex = 0; productIndex < products.length; productIndex++) {
			let expanders = products[productIndex].querySelectorAll('.partExpander');
			for(let partIndex = 0; partIndex < expanders.length; partIndex++) {
				let expander = expanders[partIndex];
				if(this.queued.has(expander)) continue;

				this.queued.add(expander);
				// Expanded parts have already caused Corebridge to fetch their full data.
				if(!expander.classList.contains('collapse')) this.queue.push(expander);
			}
		}

		this.runQueue();
	}

	runQueue() {
		while(this.activeCount < this.concurrency && this.queue.length > 0) {
			let expander = this.queue.shift();
			if(!expander.isConnected || expander.classList.contains('collapse')) continue;

			this.activeCount++;
			this.hydratePart(expander).catch(error => {
				console.warn('[Corebridge preload] Could not preload a part.', error);
			}).finally(() => {
				this.activeCount--;
				window.setTimeout(() => this.runQueue(), 100);
			});
		}
	}

	async hydratePart(expander) {
		let part = expander.closest('div[id^="ord_prod_part_"]');
		if(!part) return;

		let userChangedPart = false;
		let noteUserChange = event => {
			if(event.isTrusted) userChangedPart = true;
		};
		part.addEventListener('click', noteUserChange, true);

		try {
			expander.click();
			await this.waitForCorebridgeRequests();

			// Restore the layout unless the user interacted while it was prefetched.
			let closeExpander = part.querySelector('.partExpander.collapse');
			if(!userChangedPart && closeExpander) closeExpander.click();
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
}
