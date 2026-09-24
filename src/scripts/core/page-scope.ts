/** Each page owns its listeners/timers; application singletons (audio) live outside this scope. */
export class PageScope {
	private controller = new AbortController();
	private cleanup: (() => void)[] = [];
	private timers = new Set<number>();
	get active() {
		return !this.controller.signal.aborted;
	}
	on(
		target: EventTarget,
		event: string,
		callback: (event: any) => void,
		options: AddEventListenerOptions = {},
	) {
		target.addEventListener(event, callback, {
			...options,
			signal: this.controller.signal,
		});
	}
	defer(callback: () => void) {
		this.cleanup.push(callback);
	}
	timeout(callback: () => void, delay: number) {
		const id = window.setTimeout(() => {
			this.timers.delete(id);
			if (this.active) callback();
		}, delay);
		this.timers.add(id);
		return id;
	}
	interval(callback: () => void, delay: number) {
		const id = window.setInterval(callback, delay);
		this.defer(() => window.clearInterval(id));
		return id;
	}
	clearTimeout(id: number | undefined) {
		if (id === undefined) return;
		window.clearTimeout(id);
		this.timers.delete(id);
	}
	dispose() {
		this.controller.abort();
		for (const id of this.timers) window.clearTimeout(id);
		this.timers.clear();
		for (const cleanup of this.cleanup.reverse()) cleanup();
		this.cleanup = [];
	}
}

export function pageFeature(initialize: (scope: PageScope) => void) {
	let current: PageScope | undefined;
	const start = () => {
		current?.dispose();
		current = new PageScope();
		initialize(current);
	};
	document.addEventListener("astro:before-swap", () => {
		current?.dispose();
		current = undefined;
	});
	document.addEventListener("astro:page-load", start);
	// The router dispatches the initial page-load after bundled modules are ready.
}
