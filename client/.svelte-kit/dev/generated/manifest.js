const c = [
	() => import("../../../src/routes/$layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/upload.svelte"),
	() => import("../../../src/routes/play.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/upload.svelte
	[/^\/upload\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/play.svelte
	[/^\/play\/?$/, [c[0], c[4]], [c[1]]]
];

export const fallback = [c[0](), c[1]()];