import { n as e, r as t, t as n } from "./state-CY-J2rIa.js";
// src/lifecycle/scope.ts
function r() {
	let e = /* @__PURE__ */ new Set();
	return {
		add(t) {
			if (typeof t != "function") throw TypeError("Scope cleanup must be a function");
			let n = t, r = () => {
				let t = n;
				n = void 0, e?.delete(r), t?.();
			};
			return e ? e.add(r) : r(), r;
		},
		dispose() {
			if (!e) return;
			let t = [...e].reverse();
			e.clear(), e = void 0;
			let n = [];
			for (let e of t) try {
				e();
			} catch (e) {
				n.push(e);
			}
			if (n.length === 1) throw n[0];
			if (n.length > 1) throw AggregateError(n, "Scope cleanup failed");
		}
	};
}
// src/component/fields.ts
var i = Symbol("nanshann.field");
function a(e, t, n) {
	if (!n || typeof n != "object" || Array.isArray(n) || Object.keys(n).some((e) => e !== "reflect") || n.reflect !== void 0 && typeof n.reflect != "boolean") throw TypeError("Input options support a boolean reflect flag");
	if ((e === "attribute" || n.reflect) && !c(t)) throw TypeError("Attributes and reflected properties require a string, boolean or finite number default");
	return Object.freeze({
		[i]: !0,
		kind: e,
		defaultValue: t,
		reflect: n.reflect ?? !1
	});
}
function o(e, t = {}) {
	return a("property", e, t);
}
function s(e, t = {}) {
	return a("attribute", e, t);
}
function c(e) {
	return typeof e == "string" || typeof e == "boolean" || typeof e == "number" && Number.isFinite(e);
}
Object.freeze({
	properties: Object.freeze({}),
	attributes: Object.freeze({})
});
var l = Object.freeze({});
function u(e) {
	let t = /* @__PURE__ */ new Set(), n = (e, n) => {
		if (e === void 0) return Object.freeze({});
		if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`${n} definitions must be an object`);
		let r = Object.create(null);
		for (let [a, o] of Object.entries(e)) {
			if (!/^[A-Za-z_]\w*$/.test(a) || [
				"__proto__",
				"constructor",
				"prototype",
				"src",
				"ready",
				"path",
				"index"
			].includes(a.toLowerCase())) throw TypeError(`Reserved or invalid component input: ${a}`);
			if (t.has(a.toLowerCase())) throw TypeError(`Duplicate component input: ${a}`);
			if (!o || o[i] !== !0 || o.kind !== n) throw TypeError(`Invalid ${n} definition: ${a}`);
			t.add(a.toLowerCase()), r[a] = o;
		}
		return Object.freeze(r);
	};
	return Object.freeze({
		properties: n(e?.properties, "property"),
		attributes: n(e?.attributes, "attribute")
	});
}
function d(e) {
	let t = e.defaultValue;
	return typeof t == "object" && t ? structuredClone(t) : t;
}
function f(e, t) {
	if (t === null) return e.defaultValue;
	if (typeof e.defaultValue == "boolean") return !0;
	if (typeof e.defaultValue == "number") {
		let e = t.trim() ? Number(t) : NaN;
		if (!Number.isFinite(e)) throw TypeError(`Invalid numeric attribute: ${JSON.stringify(t)}`);
		return e;
	}
	return t;
}
function p(e, t) {
	if (t === void 0 && (t = e.defaultValue), !c(t) || typeof t != typeof e.defaultValue) throw TypeError(`Input requires ${typeof e.defaultValue}`);
	return typeof t == "boolean" ? t ? "" : null : String(t);
}
// src/behavior/instance.ts
function m(e) {
	if (e !== null && (typeof e == "object" || typeof e == "function") && "then" in e && typeof e.then == "function") throw Promise.resolve(e).catch(() => {}), TypeError("Behavior must synchronously return { state, actions }");
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError("Behavior must synchronously return { state, actions }");
	let { state: t, actions: n } = e;
	if (!t || typeof t != "object") throw TypeError("Behavior state must be an object");
	if (!n || typeof n != "object" || Array.isArray(n) || Object.values(n).some((e) => typeof e != "function")) throw TypeError("Behavior actions must be an object of functions");
}
function h(e, t = {}) {
	if (typeof e != "function") throw TypeError("Behavior must be a function");
	let n = r(), i = r(), a = /* @__PURE__ */ new Map(), o = !1, s = !0, c = () => {
		if (o) return;
		o = !0;
		let e = [];
		try {
			n.dispose();
		} catch (t) {
			e.push(t);
		}
		try {
			i.dispose();
		} catch (t) {
			e.push(t);
		}
		if (a.clear(), e.length === 1) throw e[0];
		if (e.length > 1) throw AggregateError(e, "Behavior resources and dependencies cleanup failed");
	}, u = Object.freeze({
		properties: t.properties ?? l,
		attributes: t.attributes ?? l,
		route: t.route,
		onMount(e) {
			if (typeof e != "function") throw TypeError("onMount callback must be a function");
			if (!s || o) throw Error("onMount must be registered during Behavior initialization");
			if (!t.onMount) throw Error("onMount requires a component Behavior");
			t.onMount(e);
		},
		getBehavior(e) {
			if (o) throw Error("Behavior instance has been disposed");
			let n = a.get(e);
			if (!n) {
				if (!t.acquireBehavior) throw Error(`Business Behavior resolver is unavailable: ${e}`);
				if (n = t.acquireBehavior(e), o) throw n.release(), Error("Behavior instance has been disposed");
				a.set(e, n), i.add(n.release);
			}
			return n.value;
		},
		onDispose: n.add,
		subscribe(e, t) {
			if (o) throw Error("Behavior instance has been disposed");
			return n.add(e.subscribe(t));
		}
	});
	try {
		let t;
		try {
			t = Reflect.apply(e, void 0, [u]);
		} finally {
			s = !1;
		}
		return m(t), Object.freeze({
			value: t,
			get disposed() {
				return o;
			},
			dispose: c
		});
	} catch (e) {
		try {
			c();
		} catch (t) {
			throw AggregateError([e, t], "Behavior initialization and cleanup failed");
		}
		throw e;
	}
}
// src/behavior/registry.ts
var g = /^[A-Za-z_$][\w$]*$/, _ = /* @__PURE__ */ new Set([
	"state",
	"actions",
	"__proto__",
	"prototype",
	"constructor"
]);
function v(e) {
	if (typeof e != "string" || !g.test(e) || _.has(e)) throw Error(`Invalid business Behavior name: ${String(e)}`);
}
function y() {
	let e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), n = [];
	function r(e, n, i = /* @__PURE__ */ new Set()) {
		if (e === n) return [e];
		if (!i.has(e)) {
			i.add(e);
			for (let a of t.get(e)?.dependencies ?? []) {
				let t = r(a, n, i);
				if (t) return [e, ...t];
			}
		}
	}
	function i(e, t) {
		v(t);
		let n = r(t, e.name);
		if (n) throw Error(`Circular Behavior dependency: ${[e.name, ...n].join(" -> ")}`);
		e.dependencies.add(t);
		let i;
		try {
			i = a(t);
		} catch (n) {
			throw e.dependencies.delete(t), n;
		}
		let o = !1;
		return Object.freeze({
			value: i.value,
			release() {
				o || (o = !0, e.dependencies.delete(t), i.release());
			}
		});
	}
	function a(r) {
		v(r);
		let a = e.get(r);
		if (!a) throw Error(`Unknown business Behavior: ${r}`);
		let o = t.get(r);
		if (o?.phase === "creating") throw Error(`Circular Behavior initialization: ${[...n, r].join(" -> ")}`);
		if (o?.phase === "disposing") throw Error(`Business Behavior is being disposed: ${r}`);
		if (!o) {
			o = {
				name: r,
				dependencies: /* @__PURE__ */ new Set(),
				phase: "creating",
				references: 0
			}, t.set(r, o);
			let e = o;
			n.push(r);
			try {
				o.instance = h(a, { acquireBehavior: (t) => i(e, t) }), o.phase = "ready";
			} catch (e) {
				throw t.delete(r), e;
			} finally {
				n.pop();
			}
		}
		o.references++;
		let s = o, c = !1;
		return Object.freeze({
			value: s.instance.value,
			release() {
				if (!c && (c = !0, s.references--, s.references === 0)) {
					s.phase = "disposing";
					try {
						s.instance.dispose();
					} finally {
						t.delete(r), s.dependencies.clear();
					}
				}
			}
		});
	}
	return Object.freeze({
		register(t, n) {
			if (v(t), typeof n != "function") throw TypeError(`Business Behavior must be a function: ${t}`);
			if (e.has(t)) throw Error(`Duplicate business Behavior: ${t}`);
			e.set(t, n);
		},
		acquire: a
	});
}
// src/router/path.ts
var b = /^[$_\p{ID_Start}][$\u200C\u200D\p{ID_Continue}]*$/u, x = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
function S(e, t) {
	if (!Number.isInteger(t) || t < 0) throw Error("Route depth must be a non-negative integer");
	if (!e || typeof e != "object") throw TypeError("Route declaration must be an object");
	let { path: n, index: r, src: i } = e;
	if (typeof i != "string" || !i.trim()) throw Error("Route src must be a non-empty string");
	if (typeof r != "boolean") throw Error("Route index must be a boolean");
	if (r) {
		if (n !== void 0) throw Error("Route path and index are mutually exclusive");
		return {
			kind: "index",
			src: i.trim()
		};
	}
	if (typeof n != "string" || !n.trim()) throw Error("Route path must be a non-empty string");
	let a = n.trim();
	if (/[?#*]/.test(a)) throw Error("Route path does not support query, hash, wildcard or optional parameters");
	if (t === 0 && !a.startsWith("/")) throw Error("Top-level route path must be absolute");
	if (t > 0 && a.startsWith("/")) throw Error("Child route path must be relative");
	let o = t === 0 ? a.slice(1) : a;
	if (o.endsWith("/") && (o = o.slice(0, -1)), a === "/") return {
		kind: "path",
		src: i.trim(),
		segments: []
	};
	let s = /* @__PURE__ */ new Set(), c = o.split("/").map((e) => {
		if (!e) throw Error("Route path cannot contain empty segments");
		if (e.startsWith(":")) {
			let t = e.slice(1);
			if (!b.test(t) || x.has(t)) throw Error(`Invalid route parameter name: ${t}`);
			if (s.has(t)) throw Error(`Duplicate route parameter name: ${t}`);
			return s.add(t), {
				kind: "parameter",
				name: t
			};
		}
		try {
			return {
				kind: "static",
				value: decodeURIComponent(e)
			};
		} catch {
			throw Error(`Invalid encoding in route path segment: ${e}`);
		}
	});
	return {
		kind: "path",
		src: i.trim(),
		segments: c
	};
}
function C(e, t) {
	if (e.kind === "index" || t.length < e.segments.length) return;
	let n = Object.create(null);
	for (let r = 0; r < e.segments.length; r++) {
		let i = e.segments[r], a = t[r];
		if (typeof a != "string" || !a) return;
		let o;
		try {
			o = decodeURIComponent(a);
		} catch {
			return;
		}
		if (i.kind === "static") {
			if (i.value !== o) return;
		} else n[i.name] = o;
	}
	return {
		params: n,
		consumed: e.segments.length
	};
}
// src/router/group.ts
var w = class e {
	depth;
	offset;
	parentParams;
	location;
	report;
	entries = /* @__PURE__ */ new Set();
	holds = /* @__PURE__ */ new Map();
	selected;
	disposed = !1;
	queued = !1;
	constructor(e, t, n, r, i) {
		this.depth = e, this.offset = t, this.parentParams = n, this.location = r, this.report = i;
	}
	hold() {
		if (this.disposed) throw Error("Route group has been disposed");
		let e = {};
		this.holds.set(e, "pending");
		let t = !1;
		return {
			settle: () => {
				t || this.disposed || (this.holds.delete(e), t = !0, this.schedule());
			},
			fail: () => {
				t || this.disposed || (this.holds.set(e, "failed"), this.schedule());
			},
			release: () => {
				t = !0, this.holds.delete(e), this.schedule();
			}
		};
	}
	register(e) {
		if (this.disposed) throw Error("Route group has been disposed");
		let t = e.element, n = S({
			path: t.hasAttribute("path") ? t.getAttribute("path") : void 0,
			index: t.hasAttribute("index"),
			src: t.getAttribute("src") ?? ""
		}, this.depth), r = {
			...e,
			parsed: n
		};
		return this.entries.add(r), this.schedule(), {
			stopBindings: () => r.content.stopBindings(),
			dispose: () => {
				if (this.entries.delete(r)) try {
					this.selected?.entry === r && this.clear();
				} finally {
					this.schedule();
				}
			}
		};
	}
	schedule() {
		this.queued || this.disposed || (this.queued = !0, queueMicrotask(() => {
			if (this.queued = !1, !this.disposed) try {
				this.reconcile();
			} catch (e) {
				this.report(e);
			}
		}));
	}
	choose(e) {
		let t = [...this.entries].filter((e) => e.parsed.kind === "index");
		if (t.length > 1) throw Error("Only one index route is allowed per logical parent");
		let n = e.pathname.replace(/\/$/, ""), r = (n ? n.slice(1).split("/") : []).slice(this.offset), i, a = !1;
		for (let e of this.entries) {
			let t = C(e.parsed, r);
			if (!t) continue;
			let n = {
				entry: e,
				match: t,
				identity: JSON.stringify(t.params)
			};
			if (!i) {
				i = n;
				continue;
			}
			let o = T(e.parsed, i.entry.parsed);
			o === 0 && (a = !0), o > 0 && (i = n, a = !1);
		}
		if (a) throw Error(`Ambiguous route candidates for ${e.pathname}`);
		return !i && t[0] && (i = {
			entry: t[0],
			match: {
				params: {},
				consumed: 0
			},
			identity: "index"
		}), i;
	}
	reconcile() {
		if (this.holds.size) return;
		let r = this.location(), i = this.choose(r);
		if (!i) {
			this.clear();
			return;
		}
		if (this.selected?.entry === i.entry && this.selected.identity === i.identity) {
			t(() => Object.assign(this.selected.state, {
				pathname: r.pathname,
				search: r.search,
				hash: r.hash
			})), this.selected.child.schedule();
			return;
		}
		try {
			this.clear();
		} catch (e) {
			this.report(e);
		}
		let a = {
			...this.parentParams,
			...i.match.params
		}, o = n({
			pathname: r.pathname,
			params: a,
			search: r.search,
			hash: r.hash
		}), s = new e(this.depth + 1, this.offset + i.match.consumed, a, this.location, this.report);
		this.selected = {
			entry: i.entry,
			identity: i.identity,
			state: o,
			child: s
		}, i.entry.activate({
			...i.entry.context,
			route: o,
			group: s
		}), s.schedule();
	}
	clear() {
		let e = this.selected;
		if (this.selected = void 0, !e) return;
		let t = [];
		for (let n of [
			() => e.entry.content.stopBindings(),
			() => e.child.dispose(),
			() => e.entry.content.dispose()
		]) try {
			n();
		} catch (e) {
			t.push(e);
		}
		if (t.length) throw AggregateError(t, "Route cleanup failed");
	}
	stopBindings() {
		let e = [];
		for (let t of [() => this.selected?.entry.content.stopBindings(), () => this.selected?.child.stopBindings()]) try {
			t();
		} catch (t) {
			e.push(t);
		}
		if (e.length) throw AggregateError(e, "Route binding cleanup failed");
	}
	dispose() {
		if (!this.disposed) {
			this.disposed = !0;
			try {
				this.clear();
			} finally {
				this.entries.clear(), this.holds.clear();
			}
		}
	}
};
function T(e, t) {
	if (e.kind === "index" || t.kind === "index") return 0;
	for (let n = 0; n < Math.min(e.segments.length, t.segments.length); n++) {
		let r = Number(e.segments[n].kind === "static") - Number(t.segments[n].kind === "static");
		if (r) return r;
	}
	return e.segments.length - t.segments.length;
}
// src/template/source.ts
var E = class extends Error {
	src;
	baseURL;
	requestedURL;
	finalURL;
	ancestors;
	constructor(e, t) {
		let n = e.ancestors.length ? e.ancestors.join(" -> ") : "(unresolved)";
		super(`Failed to load Template ${JSON.stringify(e.src)} from ${JSON.stringify(e.baseURL)}; chain: ${n}`, { cause: t }), this.name = "TemplateSourceError", this.src = e.src, this.baseURL = e.baseURL, this.requestedURL = e.requestedURL, this.finalURL = e.finalURL, this.ancestors = Object.freeze([...e.ancestors]);
	}
};
function D(e, t) {
	let n = new URL(e, t);
	return n.hash = "", n.href;
}
async function O(e, t) {
	let n, r, i, a, o = [];
	try {
		if (n = t?.baseURL, r = t?.signal, o = [...t?.ancestors ?? []], r?.throwIfAborted(), typeof e != "string" || !e.trim()) throw TypeError("Template src must be a non-empty string");
		if (typeof n != "string" || !n.trim()) throw TypeError("Template baseURL must be a non-empty URL");
		let s = n, c = o.map((e) => D(e, s));
		if (i = D(e, s), o = [...c, i], c.includes(i)) throw Error(`Circular Template include: ${i}`);
		let l = await fetch(i, { signal: r });
		if (r?.throwIfAborted(), a = D(l.url || i, i), a !== i && o.push(a), c.includes(a)) throw Error(`Circular Template redirect: ${a}`);
		if (!l.ok) throw Error(`Template request failed: HTTP ${l.status} ${l.statusText}`.trim());
		let u = await l.text();
		return r?.throwIfAborted(), Object.freeze({
			url: a,
			requestedURL: i,
			html: u,
			ancestors: Object.freeze([...o])
		});
	} catch (t) {
		let s = r?.aborted ? r.reason : t;
		throw new E({
			src: e,
			baseURL: n,
			requestedURL: i,
			finalURL: a,
			ancestors: o
		}, s);
	}
}
// src/template/fragment.ts
function k(e, t) {
	if (typeof e != "string") throw TypeError("Template source must be a string");
	let n = new URL(t).href, r = document.createElement("template");
	r.innerHTML = e;
	let i = r.content, a = [], o = [], s = (e, t) => {
		t && o.push(e);
		for (let n of e.querySelectorAll("script[ns-behavior], template")) if (n.localName === "script") a.push(n);
		else {
			let e = [
				"ns-foreach",
				"ns-if",
				"ns-else-if",
				"ns-else"
			].some((e) => n.hasAttribute(e));
			s(n.content, t && e);
		}
	};
	s(i, !0);
	let c;
	for (let [e, t] of a.entries()) {
		let r = new URL(n);
		if (r.hash = `behavior-${e + 1}`, t.parentNode !== i) throw Error(`Local Behavior must be declared at component template top level: ${r.href}`);
		if (c) throw Error(`Duplicate local Behavior: at most one declaration per component: ${r.href}`);
		if (t.getAttribute("type")?.trim().toLowerCase() !== "module") throw Error(`Local Behavior requires type="module": ${r.href}`);
		if (t.hasAttribute("src")) throw Error(`Local Behavior must be inline: ${r.href}`);
		c = {
			source: t.textContent ?? "",
			sourceURL: r.href
		};
	}
	for (let e of o.flatMap((e) => [...e.querySelectorAll("link[rel][href]")])) e.getAttribute("rel").split(/\s+/).some((e) => e.toLowerCase() === "stylesheet") && e.setAttribute("href", new URL(e.getAttribute("href"), n).href);
	for (let e of a) e.remove();
	return {
		content: i,
		sourceURL: n,
		behavior: c
	};
}
// src/template/resources.ts
var A = (e) => e === " " || e === "	" || e === "\n" || e === "\r" || e === "\f";
function j(e, t) {
	if (typeof e != "string") throw TypeError("Srcset value must be a string");
	let n = [], r = 0, i = 0;
	for (; r < e.length;) {
		for (; A(e[r]) || e[r] === ",";) r++;
		if (r >= e.length) break;
		let a = r;
		for (; r < e.length && !A(e[r]);) r++;
		let o = r;
		for (; e[o - 1] === ",";) o--;
		let s = e.slice(a, o), c;
		try {
			c = new URL(s, t).href;
		} catch (e) {
			throw Error(`Invalid srcset URL ${JSON.stringify(s)} from ${JSON.stringify(t)}`, { cause: e });
		}
		if (n.push(e.slice(i, a), c), i = o, o !== r) continue;
		let l = !1;
		for (; r < e.length;) {
			let t = e[r++];
			if (l) t === ")" && (l = !1);
			else if (t === "(") l = !0;
			else if (t === ",") break;
		}
	}
	return n.push(e.slice(i)), n.join("");
}
// src/behavior/module.ts
var M = /* @__PURE__ */ new Map();
function N(e, t) {
	return P(e, t, "Behavior");
}
function P(e, t, n = "Template") {
	if (typeof e != "string") return Promise.reject(/* @__PURE__ */ TypeError(`Inline ${n} source must be a string`));
	if (typeof t != "string" || !t.trim()) return Promise.reject(/* @__PURE__ */ TypeError(`Inline ${n} source URL must be a non-empty string`));
	let r = `${n}\0${t}`, i = M.get(r);
	if (i?.source === e) return i.promise;
	let a = {
		source: e,
		promise: F(e, t, n).catch((e) => {
			throw M.get(r) === a && M.delete(r), e;
		})
	};
	return M.set(r, a), a.promise;
}
async function F(e, t, n) {
	let r;
	try {
		let i = new Blob([e, `\n//# sourceURL=${encodeURI(t)}\n`], { type: "text/javascript" });
		r = URL.createObjectURL(i);
		let a = await import(
			/* @vite-ignore */
			r
);
		if (typeof a.default != "function") throw TypeError(`Inline ${n} module must default-export a function`);
		return a.default;
	} catch (e) {
		throw Error(`Failed to load inline ${n} from ${t}`, { cause: e });
	} finally {
		r !== void 0 && URL.revokeObjectURL(r);
	}
}
// src/template/binding/event.ts
function I(e) {
	if (e !== e.trim() || !e.startsWith("ns-on-")) throw Error(`Invalid event directive: ${e}`);
	let [t, ...n] = e.slice(6).split(".");
	if (!/^[a-z][a-z0-9:_-]*$/.test(t)) throw Error(`Invalid event binding name: ${t}`);
	let r = {
		capture: !1,
		once: !1,
		passive: !1
	}, i = /* @__PURE__ */ new Set();
	for (let t of n) {
		if (!Object.hasOwn(r, t) || i.has(t)) throw Error(`Invalid event option: ${e}`);
		i.add(t), r[t] = !0;
	}
	return {
		name: t,
		options: r
	};
}
function ee(t, n, r, i, a) {
	if (typeof r != "function") throw TypeError("Event handler expression must produce a function");
	let o = (t) => {
		try {
			let n = e.subtle.untrack(() => Reflect.apply(r, void 0, [t]));
			n !== null && (typeof n == "object" || typeof n == "function") && Promise.resolve(n).catch(a);
		} catch (e) {
			a(e);
		}
	};
	t.addEventListener(n.name, o, n.options), i.add(() => t.removeEventListener(n.name, o, n.options));
}
// src/template/binding/path.ts
var L = /^[A-Za-z_$][\w$]*$/, R = /^(?:[A-Za-z_$][\w$]*|\d+)$/, z = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
function te(e) {
	if (typeof e != "string") throw TypeError("Handler expression must be a string");
	let t = /^(?:actions|context\.behaviors\.([A-Za-z_$][\w$]*)\.actions)\.([A-Za-z_$][\w$]*)$/.exec(e.trim());
	if (t) {
		if (z.has(t[1]) || z.has(t[2])) throw Error(`Invalid handler path: ${e}`);
		return {
			name: t[2],
			...t[1] === void 0 ? {} : { behavior: t[1] }
		};
	}
}
var B = new Set("state actions properties attributes context event arguments eval await yield let const var function class return if else for while do switch case default break continue try catch finally throw new delete typeof void in instanceof this super import export extends static enum implements interface package private protected public null true false with debugger".split(" "));
function V(e) {
	if (!L.test(e) || e.startsWith("__ns") || z.has(e) || B.has(e)) throw Error(`Invalid template alias: ${e}`);
}
function H(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e != "string") throw TypeError("Binding expression must be a string");
	let n = e.trim().split("."), r = () => /* @__PURE__ */ Error(`Invalid value binding path: ${e}`);
	if (!n.length || n.some((e) => !R.test(e) || z.has(e))) throw r();
	let i = n[0];
	if (i === "state") return {
		root: "local",
		path: n.slice(1)
	};
	if (i === "properties" || i === "attributes") return {
		root: i,
		path: n.slice(1)
	};
	if (i === "context") {
		if (n[1] === "behaviors" && L.test(n[2] ?? "") && n[3] === "state") return {
			root: "business",
			name: n[2],
			path: n.slice(4)
		};
		throw r();
	}
	if (t.has(i)) return {
		root: "alias",
		name: i,
		path: n.slice(1)
	};
	throw r();
}
function U(e, t) {
	let n = e;
	for (let e of t) {
		if (n == null || !Object.hasOwn(Object(n), e)) return;
		n = n[e];
	}
	return n;
}
function ne(e, t, n) {
	if (!t.length || t.some((e) => z.has(e))) throw Error("Model requires a writable field path");
	let r = U(e, t.slice(0, -1));
	if (r === null || typeof r != "object" && typeof r != "function") throw TypeError("Model cannot write through a missing or non-object parent");
	let i = t[t.length - 1];
	if (!Object.hasOwn(r, i) && i in r) throw TypeError("Model cannot write an inherited property");
	if (!(Object.hasOwn(r, i) && Object.is(r[i], n)) && !Reflect.set(r, i, n)) throw TypeError("Model state field is not writable");
}
function W(e, t, n, r = /* @__PURE__ */ new Set()) {
	let i = /^\s*([A-Za-z_$][\w$]*)\s+of\s+(.+?)\s*$/.exec(e);
	if (!i) throw Error(`Invalid ns-foreach declaration: ${e}`);
	let a = i[1];
	V(a);
	let o = n?.trim();
	if (o !== void 0 && V(o), o === a) throw Error("ns-index and ns-foreach aliases must differ");
	if (t === null || !t.trim()) throw Error("ns-foreach requires ns-key");
	let s = H(i[2], r), c = new Set(r);
	c.add(a);
	let l = H(t, c);
	if (l.root !== "alias" || l.name !== a) throw Error("ns-key must identify the current row, not its position or an outer value");
	return {
		alias: a,
		source: s,
		key: l,
		...o === void 0 ? {} : { index: o }
	};
}
// src/component/inputs.ts
var G = /* @__PURE__ */ new WeakMap();
function re(e) {
	for (let t of ["properties", "attributes"]) for (let [n, r] of Object.entries(e[t])) if ((t === "properties" || r.reflect) && (n in HTMLElement.prototype || /^(?:connected|disconnected|adopted|attributeChanged|connectedMove)Callback$/.test(n))) throw TypeError(`Component property conflicts with the host: ${n}`);
}
function K(e, t, n) {
	let r = G.get(e);
	return r ? (r.write(t, n), !0) : !1;
}
var ie = class {
	element;
	report;
	properties = l;
	attributes = l;
	fields;
	pending = /* @__PURE__ */ new Map();
	observer;
	syncing = !1;
	detached = /* @__PURE__ */ new Map();
	constructor(e, t) {
		this.element = e, this.report = t, G.set(e, this);
	}
	write(e, t) {
		if (!this.fields) {
			this.pending.set(e, t), Reflect.set(this.element, e, t);
			return;
		}
		let n = this.fields.get(e.toLowerCase());
		if (!n) throw Error(`Unknown component input ${e} on <${this.element.localName}>`);
		this.syncAttributes(), this.set(n, t, !0);
	}
	configure(t) {
		this.fields = /* @__PURE__ */ new Map();
		let n = Object.create(null), r = Object.create(null);
		try {
			re(t);
			let i = /* @__PURE__ */ new Set([...Object.keys(t.properties), ...Object.entries(t.attributes).filter(([, e]) => e.reflect).map(([e]) => e)]);
			for (let [e, t] of this.detached) i.has(e) || (Object.getOwnPropertyDescriptor(this.element, e)?.get === t && Reflect.deleteProperty(this.element, e), this.detached.delete(e));
			for (let i of ["properties", "attributes"]) {
				let a = t[i];
				for (let [t, o] of Object.entries(a)) {
					let a = i === "properties" || o.reflect ? t : void 0, s = i === "attributes" || o.reflect ? t.toLowerCase() : void 0, c = d(o), l = s ? this.element.getAttribute(s) : null;
					l !== null && (c = f(o, l));
					let u = [...this.pending.keys()].find((e) => e.toLowerCase() === t.toLowerCase()), p = Object.hasOwn(this.element, t) ? t : u, m = p !== void 0 && Object.hasOwn(this.element, p);
					m ? c = Reflect.get(this.element, p) : u !== void 0 && (c = this.pending.get(u));
					let h = {
						name: t,
						definition: o,
						signal: new e.State(c),
						propertyName: a,
						attributeName: s,
						lastAttribute: l
					};
					if (this.fields.set(t.toLowerCase(), h), m && !Reflect.deleteProperty(this.element, p)) throw TypeError(`Component input is not configurable: ${t}`);
					a && (h.getProperty = () => h.signal.get(), Object.defineProperty(this.element, a, {
						configurable: !0,
						enumerable: !0,
						get: h.getProperty,
						set: (e) => {
							this.syncAttributes(), this.set(h, e, !0);
						}
					}), this.detached.delete(a));
					let g = Object.freeze({
						get: () => h.signal.get(),
						peek: () => h.signal.peek(),
						subscribe: (e) => h.signal.subscribe(e)
					});
					(i === "properties" ? n : r)[t] = g, (m || u !== void 0) && this.set(h, c, !0);
				}
			}
			for (let e of this.pending.keys()) if (!this.fields.has(e.toLowerCase())) throw Error(`Unknown component input ${e} on <${this.element.localName}>`);
			this.pending.clear(), this.properties = Object.freeze(n), this.attributes = Object.freeze(r);
			let a = [...this.fields.values()].flatMap((e) => e.attributeName ? [e.attributeName] : []);
			a.length && (this.observer = new MutationObserver(() => this.syncAttributes()), this.observer.observe(this.element, {
				attributes: !0,
				attributeFilter: a
			}));
		} catch (e) {
			throw this.dispose(), e;
		}
	}
	set(e, t, n) {
		if (t === void 0 && (t = d(e.definition)), e.attributeName && n) {
			let n = p(e.definition, t);
			e.lastAttribute = n, this.element.getAttribute(e.attributeName) !== n && (n === null ? this.element.removeAttribute(e.attributeName) : this.element.setAttribute(e.attributeName, n));
		}
		e.signal.set(t);
	}
	syncAttributes() {
		if (!this.syncing && this.fields) {
			this.syncing = !0, this.observer?.takeRecords();
			try {
				for (let e of this.fields.values()) {
					if (!e.attributeName) continue;
					let t = this.element.getAttribute(e.attributeName);
					if (t !== e.lastAttribute) {
						e.lastAttribute = t;
						try {
							this.set(e, f(e.definition, t), !1);
						} catch (t) {
							this.report(Error(`Invalid component attribute ${e.attributeName} on <${this.element.localName}>`, { cause: t }));
						}
					}
				}
			} finally {
				this.syncing = !1;
			}
		}
	}
	stop() {
		this.observer?.disconnect(), this.observer = void 0;
	}
	dispose() {
		this.stop();
		for (let e of this.fields?.values() ?? []) {
			if (!e.propertyName || Object.getOwnPropertyDescriptor(this.element, e.propertyName)?.get !== e.getProperty) continue;
			let { definition: t, attributeName: n, propertyName: r } = e, i = this.element, a = e.signal.peek(), o = e.lastAttribute, s = () => {
				if (n) {
					let e = i.getAttribute(n);
					e !== o && (a = f(t, e), o = e);
				}
				return a;
			};
			Object.defineProperty(i, r, {
				configurable: !0,
				enumerable: !0,
				get: s,
				set(e) {
					if (e === void 0 && (e = d(t)), n) {
						let r = p(t, e);
						r === null ? i.removeAttribute(n) : i.getAttribute(n) !== r && i.setAttribute(n, r), o = r;
					}
					a = e;
				}
			}), this.detached.set(r, s);
		}
		this.fields = void 0, this.properties = l, this.attributes = l;
	}
}, q = "http://www.w3.org/1999/xhtml", ae = "http://www.w3.org/2000/svg", J = {
	disabled: [
		"button",
		"input",
		"select",
		"textarea",
		"fieldset",
		"optgroup",
		"option"
	],
	checked: ["input"],
	selected: ["option"],
	multiple: ["input", "select"],
	readonly: ["input", "textarea"],
	required: [
		"input",
		"select",
		"textarea"
	],
	autofocus: ["*"],
	inert: ["*"],
	itemscope: ["*"],
	open: ["details", "dialog"],
	controls: ["audio", "video"],
	autoplay: ["audio", "video"],
	loop: ["audio", "video"],
	muted: ["audio", "video"],
	playsinline: ["video"],
	reversed: ["ol"],
	ismap: ["img"],
	novalidate: ["form"],
	formnovalidate: ["button", "input"],
	allowfullscreen: ["iframe"],
	default: ["track"],
	defer: ["script"],
	async: ["script"]
}, Y = new Map([
	"defaultValue",
	"defaultChecked",
	"defaultSelected",
	"indeterminate",
	"scrollTop",
	"scrollLeft",
	"currentTime",
	"volume",
	"muted",
	"playbackRate",
	"selectedIndex",
	"valueAsNumber",
	"valueAsDate"
].map((e) => [e.toLowerCase(), e])), oe = new Map((/* @__PURE__ */ "viewBox.preserveAspectRatio.gradientUnits.gradientTransform.patternUnits.patternContentUnits.patternTransform.markerWidth.markerHeight.markerUnits.refX.refY.textLength.lengthAdjust.attributeName.keyTimes.keySplines.filterUnits.primitiveUnits.stdDeviation.baseFrequency.numOctaves.pathLength.clipPathUnits.maskUnits.maskContentUnits".split(".")).map((e) => [e.toLowerCase(), e])), se = /* @__PURE__ */ new Set([
	"innerhtml",
	"outerhtml",
	"textcontent",
	"innertext",
	"srcdoc"
]), ce = /* @__PURE__ */ new Set(/* @__PURE__ */ "title.id.slot.hidden.role.lang.dir.tabindex.accesskey.contenteditable.draggable.spellcheck.translate.autocapitalize.autocorrect.enterkeyhint.inputmode.is.nonce.part.exportparts.popover.inert.autofocus.itemscope.itemid.itemprop.itemref.itemtype".split("."));
function X(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function le(e, t) {
	let n = e.namespaceURI === q && e.localName.includes("-"), r = t.toLowerCase().startsWith("on") && (!n || t.toLowerCase() in HTMLElement.prototype);
	if (!/^[A-Za-z_][\w:-]*$/.test(t) || z.has(t) || se.has(t.toLowerCase()) || r || t.startsWith("ns-")) throw Error(`Unsupported ns-bind target: ${t}`);
	return e.namespaceURI === ae ? oe.get(t.toLowerCase()) ?? t : e.localName.includes("-") ? t : Y.get(t.toLowerCase()) ?? (/[A-Z]/.test(t) && t in e ? t : t.toLowerCase());
}
function ue(e, t) {
	if (typeof e == "object" && e || typeof e == "function" || typeof e == "symbol") throw TypeError(`ns-bind-${t} requires a scalar attribute value`);
	return String(e);
}
function de(e, t) {
	return (e === "class" || e === "style") && X(t) ? { ...t } : t;
}
function fe(e, t, n, r) {
	let i = {
		run: n,
		report: r
	}, a = t.add(() => {
		i.run = void 0, i.report = void 0;
	});
	customElements.whenDefined(e).then(() => {
		try {
			i.run?.();
		} catch (e) {
			i.report?.(e);
		} finally {
			a();
		}
	}, (e) => {
		try {
			i.report?.(e);
		} finally {
			a();
		}
	});
}
function pe(t, n, r, i) {
	let a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = !0;
	r.add(() => {
		s = !1;
	});
	function c(e) {
		let n = le(t, e);
		return t.localName === "input" && ["valueAsNumber", "valueAsDate"].includes(n) || t.localName === "select" && n === "selectedIndex" ? "value" : n;
	}
	function l(e, t) {
		let n = c(e), r = a.get(n);
		if (r !== void 0 && r !== t) throw Error(`Conflicting bindings for ${e}: ${r} and ${t}`);
		a.set(n, t);
	}
	function u(e) {
		let a = t.localName, o = t.namespaceURI === q;
		if (e === "class") {
			let e = new Set(t.classList), n = /* @__PURE__ */ new Set();
			return (r) => {
				let i = r == null ? [] : typeof r == "string" ? r.split(/\s+/).filter(Boolean) : X(r) ? Object.keys(r).filter((e) => r[e]) : (() => {
					throw TypeError("class binding requires a string or a class/boolean map");
				})();
				if (i.some((e) => /\s/.test(e))) throw TypeError("Class map keys must be single class names");
				let a = new Set(i);
				for (let r of n) !a.has(r) && !e.has(r) && t.classList.remove(r);
				for (let e of a) t.classList.contains(e) || t.classList.add(e);
				n = a;
			};
		}
		if (e === "style") {
			let e = t.style;
			if (!e) throw Error("Element does not support inline style");
			let n = new Map([...e].map((t) => [t, [e.getPropertyValue(t), e.getPropertyPriority(t)]])), r = /* @__PURE__ */ new Set();
			return (t) => {
				let i = /* @__PURE__ */ new Map();
				if (typeof t == "string") {
					let e = document.createElement("span").style;
					e.cssText = t;
					for (let t of e) i.set(t, [e.getPropertyValue(t), e.getPropertyPriority(t)]);
				} else if (X(t)) for (let [e, n] of Object.entries(t)) n != null && i.set(e, [ue(n, `style.${e}`), ""]);
				else if (t != null) throw TypeError("style binding requires a CSS string or a CSS property map");
				for (let t of r) {
					if (i.has(t)) continue;
					let r = n.get(t);
					r ? e.setProperty(t, r[0], r[1]) : e.removeProperty(t);
				}
				for (let [t, [n, r]] of i) (e.getPropertyValue(t) !== n || e.getPropertyPriority(t) !== r) && e.setProperty(t, n, r);
				r = new Set(i.keys());
			};
		}
		if (o && e === "value" && [
			"input",
			"textarea",
			"select"
		].includes(a)) {
			let n = t, i = !1, o = !1, s, c = (t) => {
				if (a === "input" && n.type === "file" && t != null && t !== "") throw TypeError("File input value can only be cleared");
				let r = t == null ? "" : ue(t, e);
				n.value !== r && (n.value = r);
			}, l = () => {
				i = !0, o = !1;
			}, u = () => {
				i = !1, o && c(s), o = !1;
			};
			return t.addEventListener("compositionstart", l), t.addEventListener("compositionend", u), r.add(() => {
				t.removeEventListener("compositionstart", l), t.removeEventListener("compositionend", u);
			}), (e) => {
				s = e, i ? o = !0 : c(e);
			};
		}
		if (o && (e === "checked" && a === "input" || e === "selected" && a === "option")) return (n) => {
			if (n != null && typeof n != "boolean") throw TypeError(`${e} binding requires boolean`);
			let r = t;
			r[e] !== !!n && (r[e] = !!n);
		};
		let c = ce.has(e) || e.startsWith("data-") || e.startsWith("aria-"), l = ["ns-include", "ns-route"].includes(a) && [
			"src",
			"path",
			"index"
		].includes(e), u = o && a.includes("-") && !l && !c, d = o && (Y.get(e.toLowerCase()) === e && e in t || /[A-Z]/.test(e) && e in t);
		if (u || d) {
			let n = !1, o, c = () => {
				if (s && !(u && K(t, e, o)) && !Object.is(t[e], o) && !Reflect.set(t, e, o)) throw TypeError(`DOM property is not writable: ${e}`);
			};
			return (l) => {
				if (d && [
					"defaultChecked",
					"defaultSelected",
					"indeterminate",
					"muted"
				].includes(e) && l != null && typeof l != "boolean") throw TypeError(`${e} binding requires boolean`);
				o = l, u && !customElements.get(a) ? n || (n = !0, fe(a, r, () => {
					s && (t.ownerDocument !== document && document.adoptNode(t), customElements.upgrade(t), c());
				}, i)) : (a.includes("-") && (t.ownerDocument !== document && document.adoptNode(t), customElements.upgrade(t)), c());
			};
		}
		let f = o && (J[e]?.some((e) => e === "*" || e === a) || a === "ns-route" && e === "index"), p = e.startsWith("xlink:") ? "http://www.w3.org/1999/xlink" : e.startsWith("xml:") ? "http://www.w3.org/XML/1998/namespace" : null;
		return (r) => {
			let i;
			if (o && e === "hidden") {
				if (![
					!0,
					!1,
					null,
					void 0,
					"hidden",
					"until-found"
				].includes(r)) throw TypeError("Invalid hidden binding value");
				i = r === !1 || r == null ? null : r === !0 ? "" : String(r);
			} else if (f) {
				if (r != null && typeof r != "boolean") throw TypeError(`${e} binding requires boolean`);
				i = r ? "" : null;
			} else i = r == null ? null : ue(r, e);
			if (i !== null && (me(t, e) && !i.startsWith("#") && (i = new URL(i, n).href), (e === "srcset" && ["img", "source"].includes(a) || e === "imagesrcset" && a === "link") && (i = j(i, n))), ["ns-include", "ns-route"].includes(a) && e === "src" && (r == null || !String(r).trim())) throw TypeError(`${a}.src requires a non-empty URL`);
			let s = p ? e.slice(e.indexOf(":") + 1) : e;
			(p ? t.getAttributeNS(p, s) : t.getAttribute(e)) !== i && (i === null ? t.removeAttributeNS(p, s) : t.setAttributeNS(p, e, i));
		};
	}
	function d(e, t) {
		let n = o.get(e);
		n || (n = u(e), o.set(e, n)), n(t);
	}
	return {
		claim: l,
		bind(n, i) {
			let a = le(t, n);
			l(a, `ns-bind-${n}`), r.add(new e.Computed(() => de(a, i())).subscribe((e) => d(a, e)));
		},
		bindMany(n) {
			let i = /* @__PURE__ */ new Set(), o = new e.Computed(() => {
				let e = n();
				if (!X(e)) throw TypeError("ns-bind requires an object of target/value entries");
				return Object.entries(e).map(([e, n]) => {
					let r = le(t, e);
					return [r, de(r, n)];
				});
			});
			r.add(o.subscribe((e) => {
				let t = /* @__PURE__ */ new Set();
				for (let [n] of e) {
					let e = c(n);
					if (t.has(e)) throw Error(`Duplicate ns-bind target: ${n}`);
					t.add(e);
					let r = a.get(e);
					if (r !== void 0 && r !== "ns-bind") throw Error(`Conflicting bindings for ${n}: ${r} and ns-bind`);
				}
				for (let t of i) e.some(([e]) => e === t) || (d(t, void 0), a.delete(c(t)));
				for (let [t] of e) l(t, "ns-bind");
				let n = (e) => [
					"type",
					"multiple",
					"defaultValue",
					"defaultChecked",
					"defaultSelected"
				].includes(e) ? 0 : [
					"value",
					"checked",
					"selected"
				].includes(e) ? 2 : 1;
				for (let [t, r] of [...e].sort((e, t) => n(e[0]) - n(t[0]))) d(t, r);
				i = new Set(e.map(([e]) => e));
			}));
		}
	};
}
function me(e, t) {
	let n = e.localName;
	return t === "src" ? [
		"img",
		"audio",
		"video",
		"source",
		"track",
		"input",
		"iframe",
		"embed",
		"ns-include",
		"ns-route"
	].includes(n) : t === "href" || t === "xlink:href" ? [
		"a",
		"area",
		"link",
		"use",
		"image"
	].includes(n) : t === "poster" ? n === "video" : t === "action" ? n === "form" : t === "formaction" ? n === "input" || n === "button" : t === "data" && n === "object";
}
// src/template/binding/control.ts
var he = /* @__PURE__ */ new Set([
	"text",
	"search",
	"tel",
	"url",
	"email",
	"password",
	"date",
	"datetime-local",
	"month",
	"week",
	"time",
	"color"
]), ge = /* @__PURE__ */ new WeakMap();
function _e(e, n) {
	let r = ge.get(e);
	if (!r) {
		let n = /* @__PURE__ */ new Set(), i = (e) => queueMicrotask(() => {
			if (e.defaultPrevented) return;
			let r = [];
			for (let e of n) try {
				let t = e.capture();
				t && r.push({
					run: t,
					member: e
				});
			} catch (t) {
				e.report(t);
			}
			t(() => {
				for (let { run: e, member: t } of r) try {
					e();
				} catch (e) {
					t.report(e);
				}
			});
		});
		r = {
			members: n,
			listener: i
		}, ge.set(e, r), e.addEventListener("reset", i);
	}
	r.members.add(n);
	let i = r;
	return () => {
		i.members.delete(n), i.members.size || (e.removeEventListener("reset", i.listener), ge.delete(e));
	};
}
function ve(t, n, r, i, a) {
	let o = t.localName === "input" ? t : void 0, s = t.localName === "select" ? t : void 0, c = t.localName === "textarea" ? t : void 0, l = o ?? s ?? c;
	if (!l) throw Error("ns-model requires a supported native form control");
	let u = !0, d = !1, f = null, p, m = () => {
		if (c) return "text";
		if (s) return s.multiple ? "multiple" : "select";
		if (he.has(o.type)) return "text";
		if ([
			"checkbox",
			"radio",
			"number",
			"range"
		].includes(o.type)) return o.type;
		throw Error(`Unsupported ns-model input type: ${o.type}`);
	}, h = (e) => {
		if (!Array.isArray(e) || e.some((e) => typeof e != "string")) throw TypeError("Selection collection model requires an array of strings");
		return e;
	}, g = (e) => {
		if (e == null) return "";
		if (typeof e == "object" || typeof e == "function" || typeof e == "symbol") throw TypeError("Text model requires a scalar value");
		return String(e);
	}, _ = new e.Computed(() => {
		let e = n.read();
		return Array.isArray(e) ? [...e] : e;
	}), v = (e) => {
		let t = m();
		if (a(t === "checkbox" || t === "radio" ? "checked" : "value"), !d) {
			if (t === "checkbox") {
				if (typeof e != "boolean" && !Array.isArray(e)) throw TypeError("Checkbox model requires boolean or a string array");
				let t = typeof e == "boolean" ? e : h(e).includes(o.value);
				o.checked !== t && (o.checked = t);
			} else if (t === "radio") {
				if (e != null && typeof e != "string") throw TypeError("Radio model requires a string");
				let t = e === o.value;
				o.checked !== t && (o.checked = t);
			} else if (t === "multiple") {
				let t = new Set(h(e));
				for (let e of s.options) {
					let n = t.has(e.value);
					e.selected !== n && (e.selected = n);
				}
			} else {
				if ((t === "number" || t === "range") && (e != null || t === "range") && (typeof e != "number" || !Number.isFinite(e))) throw TypeError(`${t} model requires a finite number${t === "number" ? " or null" : ""}`);
				let n = g(e);
				l.value !== n && (l.value = n);
			}
		}
	}, y = (e = !1) => {
		if (!u || d) return;
		let t = m(), r = o?.checked, i = o?.value;
		if (t === "radio" && !r) {
			if (!e) return;
			let t = l.getRootNode();
			return o.name && [...t.querySelectorAll("input[type=\"radio\"]")].some((e) => e.name === o.name && e.form === o.form && e.checked) ? void 0 : () => {
				u && n.write("");
			};
		}
		let a;
		if (t === "multiple") a = [...s.selectedOptions].map((e) => e.value);
		else if (t === "number" || t === "range") {
			if (o.validity.badInput || (a = o.value === "" ? null : o.valueAsNumber, typeof a == "number" && !Number.isFinite(a))) return;
		} else a = l.value;
		return () => {
			if (u) {
				if (t === "checkbox") {
					let e = n.read();
					if (typeof e == "boolean") n.write(r);
					else {
						let t = h(e);
						n.write(r ? t.includes(i) ? e : [...t, i] : t.filter((e) => e !== i));
					}
				} else n.write(a);
			}
		};
	}, b = () => {
		try {
			y()?.();
		} catch (e) {
			i(e);
		}
	}, x = () => {
		u && f !== l.form && (p?.(), f = l.form, p = f ? _e(f, {
			capture() {
				return d = !1, y(!0);
			},
			report: i
		}) : void 0);
	}, S = (e, t) => {
		l.addEventListener(e, t, !0), r.add(() => l.removeEventListener(e, t, !0));
	};
	r.add(() => {
		u = !1, p?.(), p = void 0, f = null;
	}), r.add(_.subscribe(v));
	for (let e of ["input", "change"]) S(e, (t) => {
		if (!t.isComposing) try {
			let t = m(), n = [
				"checkbox",
				"radio",
				"select",
				"multiple"
			].includes(t) ? "change" : "input";
			e === n && b();
		} catch (e) {
			i(e);
		}
	});
	S("compositionstart", () => {
		m() === "text" && (d = !0);
	}), S("compositionend", () => {
		d && (d = !1, b());
	});
	let C = new MutationObserver(() => {
		if (u) try {
			x(), v(_.get());
		} catch (e) {
			i(e);
		}
	});
	return C.observe(t, {
		attributes: !0,
		attributeFilter: [
			"type",
			"multiple",
			"value",
			"form",
			"selected"
		],
		...s ? {
			childList: !0,
			subtree: !0,
			characterData: !0
		} : {}
	}), r.add(() => C.disconnect()), { mount: x };
}
// src/template/errors.ts
function ye(e) {
	typeof globalThis.reportError == "function" ? globalThis.reportError(e) : setTimeout(() => {
		throw e;
	}, 0);
}
function be(e) {
	if (e !== void 0 && typeof e != "function") throw TypeError("onError must be a function");
	return e ? (t) => {
		let n = (e) => ye(AggregateError([t, e], "Binding error handler failed"));
		try {
			let r = e(t);
			r !== null && (typeof r == "object" || typeof r == "function") && Promise.resolve(r).catch(n);
		} catch (e) {
			n(e);
		}
	} : ye;
}
// src/template/handlers.ts
function xe(e, t) {
	if (!e.length) return Promise.resolve(() => {
		throw Error("No handler expressions in this template");
	});
	let n = `const __nsPromise = Promise;
  export default function(__nsIndex, __nsEnvironment) {
    switch (__nsIndex) { ${e.map(({ expression: e, aliases: t }, n) => {
		for (let e of t) V(e);
		let r = t.map((e) => `${e} = __nsEnvironment.readAlias(${JSON.stringify(e)})`).join(";\n");
		return `case ${n}: {
      const { state, actions, context, properties, attributes } = __nsEnvironment;
      ${t.length ? `let ${t.join(", ")};` : ""}
      const __nsUpdate = () => { ${r} };
      __nsUpdate();
      const __nsHandler = (\n${e}\n);
      if (typeof __nsHandler !== 'function') {
        if (__nsHandler != null && (typeof __nsHandler === 'object')) __nsPromise.resolve(__nsHandler).catch(() => {});
        throw new TypeError('Event handler expression must produce a function (handler ${n + 1})');
      }
      return { handler: __nsHandler, update: __nsUpdate };
    }`;
	}).join("\n")} }
    throw new Error('Unknown template handler');
  }`, r = new URL(t);
	return r.hash = `handlers-${JSON.stringify(e.map((e) => e.aliases))}`, P(n, r.href, "event");
}
// src/template/binding/expression.ts
function Se(e) {
	let t = [], n = 0, r = "";
	for (; n < e.length;) {
		let i = e.indexOf("{{", n);
		if (i === -1) {
			r += e.slice(n);
			break;
		}
		if (i > n && e[i - 1] === "\\") {
			r += e.slice(n, i - 1) + "{{", n = i + 2;
			continue;
		}
		r += e.slice(n, i), r && t.push({
			kind: "text",
			value: r
		}), r = "";
		let a = e.indexOf("}}", i + 2);
		if (a === -1) throw Error(`Unclosed text interpolation: ${e.slice(i)}`);
		let o = e.slice(i + 2, a);
		t.push({
			kind: "binding",
			path: o
		}), n = a + 2;
	}
	return r && t.push({
		kind: "text",
		value: r
	}), t;
}
// src/template/plan.ts
function Ce(e, t = /* @__PURE__ */ new Set()) {
	let n = [], r = /* @__PURE__ */ new Set([
		"ns-foreach",
		"ns-key",
		"ns-index",
		"ns-if",
		"ns-else-if",
		"ns-else"
	]);
	function i(e, t, n = !1) {
		let r = [], i = [...e.childNodes];
		for (let e = 0; e < i.length; e++) {
			let s = i[e];
			if (s.nodeType === 3 && !n) {
				for (let e of Se(s.textContent ?? "")) r.push(e.kind === "text" ? {
					kind: "literal",
					node: s.ownerDocument.createTextNode(e.value)
				} : {
					kind: "text",
					path: H(e.path, t)
				});
				continue;
			}
			if (s.nodeType !== 1) {
				r.push({
					kind: "literal",
					node: s
				});
				continue;
			}
			let c = s;
			if (c.hasAttribute("ns-else") || c.hasAttribute("ns-else-if")) throw Error("Conditional branch requires a preceding ns-if");
			if (c.hasAttribute("ns-if") && !c.hasAttribute("ns-foreach")) {
				let n = [{
					when: H(c.getAttribute("ns-if"), t),
					child: o(c, t)
				}], a = [];
				for (; e + 1 < i.length;) {
					let r = e + 1;
					for (; r < i.length && (i[r].nodeType === 8 || i[r].nodeType === 3 && !i[r].textContent?.trim());) r++;
					let s = i[r];
					if (!s || s.nodeType !== 1) break;
					let c = s;
					if (!c.hasAttribute("ns-else-if") && !c.hasAttribute("ns-else")) break;
					if (c.hasAttribute("ns-if") || c.hasAttribute("ns-foreach") || c.hasAttribute("ns-else-if") && c.hasAttribute("ns-else")) throw Error("Conflicting conditional branch declarations");
					if (c.hasAttribute("ns-else") && c.getAttribute("ns-else").trim()) throw Error("ns-else does not accept a value");
					if (a.push(...i.slice(e + 1, r)), n.push({
						...c.hasAttribute("ns-else-if") ? { when: H(c.getAttribute("ns-else-if"), t) } : {},
						child: o(c, t)
					}), e = r, c.hasAttribute("ns-else")) break;
				}
				r.push({
					kind: "if",
					branches: n
				}, ...a.map((e) => ({
					kind: "literal",
					node: e
				})));
			} else r.push(a(c, t));
		}
		return r;
	}
	function a(e, t) {
		let n = e.getAttribute("ns-foreach");
		if (n !== null) {
			let r = W(n, e.getAttribute("ns-key"), e.getAttribute("ns-index"), t), i = new Set(t);
			i.add(r.alias), r.index && i.add(r.index);
			let a = o(e, i);
			return {
				kind: "foreach",
				declaration: r,
				child: e.hasAttribute("ns-if") ? {
					kind: "if",
					branches: [{
						when: H(e.getAttribute("ns-if"), i),
						child: a
					}]
				} : a
			};
		}
		return o(e, t);
	}
	function o(e, t) {
		let a = e.localName === "template";
		if (a && ![
			"ns-foreach",
			"ns-if",
			"ns-else-if",
			"ns-else"
		].some((t) => e.hasAttribute(t))) return {
			kind: "literal",
			node: e
		};
		if (!e.hasAttribute("ns-foreach") && (e.hasAttribute("ns-key") || e.hasAttribute("ns-index"))) throw Error("ns-key and ns-index require ns-foreach on the same element");
		let o = a ? e.content : e, s = [], c = [], l, u, d;
		for (let i of e.attributes) {
			let { name: e, value: a } = i;
			if (!r.has(e)) {
				if (e === "ns-bind") l = H(a, t);
				else if (e.startsWith("ns-bind-")) {
					let n = e.slice(8);
					if (!n || n.includes(".")) throw Error(`Invalid ns-bind target: ${n}`);
					c.push({
						name: n,
						path: H(a, t)
					});
				} else if (e === "ns-model") {
					let e = H(a, t);
					if (!e.path.length || e.root === "properties" || e.root === "attributes") throw Error("Model requires a writable state or row field");
					u = e;
				} else if (e === "ns-html") d = H(a, t);
				else if (e.startsWith("ns-on-")) {
					let r = I(e), i = te(a);
					if (i) s.push({
						declaration: r,
						handler: i
					});
					else {
						let e = n.length;
						n.push({
							expression: a,
							aliases: [...t]
						}), s.push({
							declaration: r,
							factory: e
						});
					}
				} else if (e.startsWith("ns-")) throw Error(`Unknown template directive: ${e}`);
			}
		}
		if (a && (c.length || l || u || d || s.length)) throw Error("A structural template has no element target for value, model or event bindings");
		if (d && u) throw Error("ns-html and ns-model cannot own the same element");
		let f = [
			"script",
			"style",
			"textarea",
			"noscript"
		].includes(e.localName);
		if (d) for (let e of [o, ...o.querySelectorAll("*")]) {
			if (e !== o && [...e.attributes].some((e) => e.name.startsWith("ns-"))) throw Error("ns-html cannot own a subtree containing template bindings");
			for (let t of e.childNodes) if (t.nodeType === 3 && Se(t.textContent ?? "").some((e) => e.kind === "binding")) throw Error("ns-html cannot share its content with text interpolation");
		}
		let p = d ? [] : i(o, t, f);
		return {
			kind: a ? "fragment" : "element",
			node: e,
			children: p,
			bindings: c,
			bulk: l,
			model: u,
			html: d,
			events: s
		};
	}
	try {
		return {
			children: i(e.content, t),
			handlers: n
		};
	} catch (t) {
		throw Error(`Invalid template bindings in ${e.sourceURL}: ${t instanceof Error ? t.message : String(t)}`, { cause: t });
	}
}
// src/template/view.ts
function Z(e, t) {
	if (e.length === 1) throw e[0];
	if (e.length > 1) throw AggregateError(e, t);
}
function we(e, t) {
	return t ? new Promise((n, r) => {
		let i = () => {
			t.removeEventListener("abort", i), r(t.reason);
		};
		t.addEventListener("abort", i, { once: !0 }), e.then((e) => {
			t.removeEventListener("abort", i), t.aborted ? r(t.reason) : n(e);
		}, (e) => {
			t.removeEventListener("abort", i), r(t.aborted ? t.reason : e);
		}), t.aborted && i();
	}) : e;
}
async function Te(e, t = /* @__PURE__ */ new Set(), n) {
	n?.throwIfAborted();
	let r = Ce(e, t), i = e.behavior, [a, o] = await we(Promise.all([i ? N(i.source, i.sourceURL) : void 0, xe(r.handlers, e.sourceURL)]), n);
	return Object.freeze({
		sourceURL: e.sourceURL,
		plan: r,
		behavior: i,
		factory: a,
		fields: u(a),
		handlerFactory: o
	});
}
function Ee(n, i, a) {
	let o = document.createDocumentFragment(), { factory: s, handlerFactory: c } = n, u, d = i.local, f = [], p = be(a.onError), m = a.signal, g = /* @__PURE__ */ new Map(), _, v, y, b = !1, x = !1, S, C = /* @__PURE__ */ new Set(), w, T = 0, E = !1, D = !1, O = i.properties ?? l, k = i.attributes ?? l, A = (e) => Object.freeze(Object.defineProperties(Object.create(null), Object.fromEntries(Object.entries(e).map(([e, t]) => [e, {
		enumerable: !0,
		get: () => t.get()
	}])))), j = A(O), M = A(k);
	function N(e, t, n) {
		if (b || x) throw Error("Cannot initialize a stopped template region");
		let a = {
			owner: e,
			parent: t,
			variables: n ?? t?.variables ?? i.variables ?? /* @__PURE__ */ new Map(),
			bindings: r(),
			children: /* @__PURE__ */ new Set(),
			business: /* @__PURE__ */ new Map(),
			bindingsStopped: !1,
			disposed: !1,
			didMount: !1,
			failureScope: w
		};
		return t?.children.add(a), g.set(e, a), a;
	}
	function P(e) {
		let t = /* @__PURE__ */ new Set(), n = (e) => {
			if (!(e.disposed || t.has(e))) {
				t.add(e);
				for (let t of e.children) n(t);
			}
		};
		for (let t of e) n(t);
		return [...g.values()].filter((e) => t.has(e));
	}
	function F(e, t) {
		let n = e.filter((e) => !e.bindingsStopped);
		for (let e of n) e.bindingsStopped = !0, e === _ && (f.length = 0), C.delete(e);
		for (let e of n) try {
			e.bindings.dispose();
		} catch (e) {
			t.push(e);
		}
		for (let e of n) try {
			e.childResources?.stopBindings();
		} catch (e) {
			t.push(e);
		}
	}
	function I(e) {
		let t = e.filter((e) => !e.disposed), n = [];
		for (let e of t) e.disposed = !0;
		F(t, n);
		for (let e of [...t].reverse()) {
			try {
				e.childResources?.dispose();
			} catch (e) {
				n.push(e);
			}
			if (e === _) {
				try {
					u?.dispose();
				} catch (e) {
					n.push(e);
				}
				u = void 0, d = void 0;
			}
			for (let t of [...e.business.values()].reverse()) try {
				t.release();
			} catch (e) {
				n.push(e);
			}
			e.business.clear(), e.parent?.children.delete(e), g.delete(e.owner), e.children.clear(), e.parent = void 0, e.childResources = void 0, e.mounted = void 0, e.failureScope = void 0;
		}
		Z(n, "Template region cleanup failed");
	}
	function L() {
		if (x) return;
		x = !0;
		let e = [];
		F([...g.values()], e), Z(e, "Template binding cleanup failed");
	}
	function R() {
		if (!b) {
			b = !0, y?.disconnect(), y = void 0, S && m?.removeEventListener("abort", S), S = void 0, x = !0;
			try {
				I([...g.values()]);
			} finally {
				_ = void 0, v = void 0;
			}
		}
	}
	function z(e) {
		if (b || !v) return;
		let t = /* @__PURE__ */ new Set(), n = (e) => {
			let n = g.get(e);
			n && !v.contains(e) && t.add(n);
		};
		for (let t of e) for (let e of t.removedNodes) {
			n(e);
			let t = e.ownerDocument.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT);
			for (; t.nextNode();) n(t.currentNode);
		}
		if (t.size) try {
			I(P(t));
		} catch (e) {
			p(e);
		}
	}
	let te = Object.freeze({
		content: o,
		stopBindings: L,
		dispose: R,
		get actions() {
			return u?.value.actions;
		},
		mount(e) {
			if (b || x) throw Error("Cannot mount a stopped Template view");
			if (v) throw Error("Template view is already mounted");
			try {
				if (m?.throwIfAborted(), !e || e.nodeType !== 11 || !("host" in e)) throw TypeError("Template view root must be a ShadowRoot");
				v = e, y = new MutationObserver(z), y.observe(e, {
					childList: !0,
					subtree: !0
				}), e.append(o), q(_ ? [_] : []);
				for (let t of f.splice(0)) {
					if (b || x) break;
					try {
						let r = Reflect.apply(t, void 0, [e.host]);
						if (r !== null && (typeof r == "object" || typeof r == "function") && typeof r.then == "function") throw Promise.resolve(r).catch((e) => p(Error(`Late onMount rejection at ${n.behavior?.sourceURL}`, { cause: e }))), TypeError("onMount callback must be synchronous; use onDispose for cleanup");
					} catch (e) {
						throw Error(`Behavior onMount failed at ${n.behavior?.sourceURL}`, { cause: e });
					}
				}
				D = !0, m?.throwIfAborted();
			} catch (e) {
				try {
					R();
				} catch (t) {
					throw AggregateError([e, t], "Template mount and cleanup failed");
				}
				throw e;
			}
		}
	});
	function B(e, t) {
		if (t.disposed || t.bindingsStopped) throw Error("Template region has been disposed");
		let r = t.business.get(e);
		if (!r) {
			if (!i.acquireBehavior) throw Error(`Business Behavior registry is required for ${e} in ${n.sourceURL}`);
			if (r = i.acquireBehavior(e), t.disposed || t.bindingsStopped) throw r.release(), Error("Template region has been disposed");
			t.business.set(e, r);
		}
		return m?.throwIfAborted(), r.value;
	}
	function V() {
		if (!d) throw Error(`Local Behavior is required for this binding in ${n.sourceURL}`);
		return d;
	}
	function H(e, t) {
		if (e.root === "local") {
			let e = V();
			return () => e.state;
		}
		if (e.root === "business") {
			let n = B(e.name, t);
			return () => n.state;
		}
		if (e.root === "properties" || e.root === "attributes") {
			let t = e.root === "properties" ? O : k;
			if (e.path.length && !Object.hasOwn(t, e.path[0])) throw Error(`Unknown component input ${e.root}.${e.path[0]} in ${n.sourceURL}`);
			let r = e.root === "properties" ? j : M;
			return () => r;
		}
		let r = t.variables.get(e.name);
		if (!r) throw Error(`Unknown template alias: ${e.name}`);
		return () => r.get();
	}
	function W(e, t) {
		let n = H(e, t);
		return () => U(n(), e.path);
	}
	function G(e, t, n, r) {
		let i = document.createComment(n), a = document.createComment(`/${n}`);
		e.appendChild(i), e.appendChild(a);
		let o = N(i, t, r);
		return o.end = a, {
			first: i,
			last: a,
			region: o
		};
	}
	function re(e) {
		let t = e.first;
		for (; t;) {
			let n = t === e.last ? null : t.nextSibling;
			t.parentNode?.removeChild(t), t = n;
		}
	}
	function K(e) {
		try {
			e.region && I(P([e.region]));
		} finally {
			re(e);
		}
	}
	function ie(e, t) {
		let n = w;
		w ??= e, T++;
		try {
			return t();
		} finally {
			T--, w = n;
		}
	}
	function q(e) {
		if (!v || b || x) return;
		for (let t of P(e)) !t.didMount && (t === _ || v.contains(t.owner)) && C.add(t);
		if (T || E) return;
		E = !0;
		let t = [], r = (e) => {
			if (b || x || e.disposed || e.bindingsStopped) return !1;
			let n;
			for (let t = e; t; t = t.parent) {
				if (t.disposed || t.bindingsStopped) return !1;
				t !== _ && (!v.contains(t.owner) || t.end && !v.contains(t.end)) && (n = t);
			}
			if (!n) return !0;
			try {
				I(P([n]));
			} catch (e) {
				t.push(e);
			}
			return !1;
		}, i = (e, r, i) => {
			let a = Error(`${i} failed at ${n.sourceURL} (${e.owner.nodeName})`, { cause: r });
			if (!D) throw a;
			t.push(a);
			try {
				e.failureScope ? e.failureScope.remove() : I(P([e]));
			} catch (e) {
				t.push(e);
			}
		};
		try {
			for (; C.size;) {
				let e = new Set(C);
				C.clear();
				for (let t of e) if (r(t)) {
					t.didMount = !0;
					try {
						t.mounted?.();
					} catch (e) {
						i(t, e, "Native control mount");
					}
				}
				for (let t of e) t.failureScope = void 0;
			}
		} finally {
			E = !1;
		}
		Z(t, "Native control mount and cleanup failed");
	}
	function ae(e, t, n) {
		if (e.last.nextSibling === n && e.first.parentNode === t) return;
		let r = [], i = e.first;
		for (; i && (r.push(i), i !== e.last);) i = i.nextSibling;
		let a = t;
		for (let e of r) a.moveBefore && e.isConnected && t.isConnected ? a.moveBefore(e, n) : t.insertBefore(e, n);
	}
	function J(n, r, i) {
		if (m?.throwIfAborted(), n.kind === "literal") {
			let e = n.node.cloneNode(!0);
			return r.appendChild(e), {
				first: e,
				last: e
			};
		}
		if (n.kind === "text") {
			let t = document.createTextNode("");
			r.appendChild(t);
			let a = N(t, i), o = W(n.path, a);
			return a.bindings.add(new e.Computed(() => {
				let e = o();
				return e == null ? "" : String(e);
			}).subscribe((e) => {
				t.data !== e && (t.data = e);
			})), {
				first: t,
				last: t,
				region: a
			};
		}
		if (n.kind === "if") {
			let t = G(r, i, "ns-if"), a = n.branches.map((e) => e.when ? W(e.when, t.region) : () => !0), o;
			return t.region.bindings.add(new e.Computed(() => a.findIndex((e) => !!e())).subscribe((e) => {
				let r = [];
				if (o) {
					try {
						K(o);
					} catch (e) {
						r.push(e);
					}
					o = void 0;
				}
				if (e < 0) {
					Z(r, "Conditional cleanup failed");
					return;
				}
				let i = document.createDocumentFragment(), a = G(i, t.region, "ns-branch"), s = { remove() {
					o === a && (o = void 0), K(a);
				} };
				a.region.failureScope = w ?? s;
				try {
					ie(s, () => {
						let r = document.createDocumentFragment();
						J(n.branches[e].child, r, a.region), i.insertBefore(r, a.last), t.last.parentNode.insertBefore(i, t.last);
					}), o = a;
				} catch (e) {
					r.push(e);
					try {
						K(a);
					} catch (e) {
						r.push(e);
					}
					o === a && (o = void 0);
				}
				if (o === a) try {
					q([a.region]);
				} catch (e) {
					r.push(e);
				}
				Z(r, "Conditional initialization and cleanup failed");
			})), t;
		}
		if (n.kind === "foreach") {
			let a = G(r, i, "ns-foreach"), { declaration: o } = n, s = W(o.source, a.region), c = /* @__PURE__ */ new Map(), l = new e.Computed(() => {
				let e = s();
				if (!Array.isArray(e)) throw TypeError("ns-foreach requires an array");
				let t = /* @__PURE__ */ new Set();
				return Array.from(e, (e, n) => {
					let r = U(e, o.key.path);
					if (typeof r != "string" && (typeof r != "number" || !Number.isFinite(r))) throw TypeError("ns-key requires a string or finite number");
					if (t.has(r)) throw Error(`Duplicate ns-key: ${r}`);
					return t.add(r), {
						key: r,
						item: e,
						index: n
					};
				});
			});
			return a.region.bindings.add(l.subscribe((r) => {
				let i = /* @__PURE__ */ new Map(), s = [];
				try {
					for (let t of r) {
						let r = c.get(t.key);
						if (!r || r.instance.region.disposed) {
							let i = new Map(a.region.variables), l = new e.State(t.item), u = o.index ? new e.State(t.index) : void 0;
							i.set(o.alias, l), o.index && i.set(o.index, u);
							let d = document.createDocumentFragment(), f = G(d, a.region, "ns-row", i);
							r = {
								instance: f,
								item: l,
								index: u
							}, s.push(r);
							let p = r, m = { remove() {
								c.get(t.key) === p && c.delete(t.key), K(f);
							} };
							f.region.failureScope = w ?? m, ie(m, () => {
								let e = document.createDocumentFragment();
								J(n.child, e, f.region), d.insertBefore(e, f.last);
							});
						}
						i.set(t.key, r);
					}
				} catch (e) {
					let t = [e];
					for (let e of s) try {
						K(e.instance);
					} catch (e) {
						t.push(e);
					}
					Z(t, "List initialization and cleanup failed");
					return;
				}
				let l = [];
				for (let [e, t] of c) if (!i.has(e)) try {
					K(t.instance);
				} catch (e) {
					l.push(e);
				}
				c = i, t(() => {
					for (let e of r) {
						let t = c.get(e.key);
						t.item.set(e.item), t.index?.set(e.index);
					}
				});
				let u = a.last;
				for (let e of [...c.values()].reverse()) ae(e.instance, a.last.parentNode, u), u = e.instance.first;
				try {
					q(s.map((e) => e.instance.region));
				} catch (e) {
					l.push(e);
				}
				Z(l, "List row cleanup failed");
			})), a.region.bindings.add(() => c.clear()), a;
		}
		return Y(n, r, i);
	}
	function Y(t, r, i) {
		let o = t.kind === "fragment", s = o ? void 0 : t.node.cloneNode(!1), l = o ? G(r, i, "ns-fragment") : (r.appendChild(s), {
			first: s,
			last: s,
			region: N(s, i)
		}), u = l.region, f = Object.freeze({ behaviors: new Proxy(Object.create(null), {
			get(e, t) {
				return typeof t == "string" ? B(t, u) : void 0;
			},
			set() {
				throw TypeError("context.behaviors is readonly");
			}
		}) }), h = t.events.map((t) => {
			if (t.handler) {
				let e = t.handler.behavior === void 0 ? V() : B(t.handler.behavior, u), n = Object.hasOwn(e.actions, t.handler.name) ? e.actions[t.handler.name] : void 0;
				if (typeof n != "function") throw Error(`Unknown action: ${t.handler.name}`);
				return n;
			}
			let n = c(t.factory, {
				state: d?.state,
				actions: d?.actions,
				context: f,
				properties: j,
				attributes: M,
				readAlias: (e) => u.variables.get(e).get()
			});
			return u.variables.size && u.bindings.add(new e.Computed(() => [...u.variables.values()].map((e) => e.get())).subscribe(n.update)), (e) => (n.update(), Reflect.apply(n.handler, void 0, [e]));
		}), g = o ? document.createDocumentFragment() : s;
		for (let e of t.children) J(e, g, u);
		if (o) return r.insertBefore(g, l.last), l;
		let _ = pe(s, n.sourceURL, u.bindings, p), v = (e) => +![
			"type",
			"multiple",
			"defaultvalue",
			"defaultchecked",
			"defaultselected"
		].includes(e);
		for (let e of [...t.bindings].sort((e, t) => v(e.name) - v(t.name))) _.bind(e.name, W(e.path, u));
		if (t.bulk && _.bindMany(W(t.bulk, u)), t.html) {
			let n = W(t.html, u);
			u.bindings.add(new e.Computed(n).subscribe((e) => {
				if (e != null && typeof e != "string" && Object.prototype.toString.call(e) !== "[object TrustedHTML]") throw TypeError("ns-html requires an HTML string or TrustedHTML");
				s.innerHTML = e ?? "";
			}));
		}
		if (t.model) {
			let e = H(t.model, u);
			u.mounted = ve(s, {
				read: () => U(e(), t.model.path),
				write: (n) => ne(e(), t.model.path, n)
			}, u.bindings, p, (e) => _.claim(e, "ns-model")).mount;
		}
		for (let [e, n] of t.events.entries()) ee(s, n.declaration, h[e], u.bindings, p);
		let y = a.onElement?.(s, d, {
			variables: u.variables,
			properties: O,
			attributes: k
		});
		return y && (u.childResources = y), m?.throwIfAborted(), l;
	}
	try {
		m?.throwIfAborted(), _ = N(o), s && (u = h(s, {
			acquireBehavior: i.acquireBehavior,
			route: i.route,
			properties: O,
			attributes: k,
			onMount: (e) => {
				f.push(e);
			}
		}), d = u.value, m?.throwIfAborted());
		for (let e of n.plan.children) J(e, o, _);
		return S = () => {
			try {
				R();
			} catch (e) {
				p(e);
			}
		}, m?.addEventListener("abort", S, { once: !0 }), m?.throwIfAborted(), te;
	} catch (e) {
		try {
			R();
		} catch (t) {
			throw AggregateError([e, t], "Template initialization and cleanup failed");
		}
		throw e;
	}
}
// src/component/actions.ts
function De(e, t, n, r) {
	let i = new Set([...Object.keys(n.properties), ...Object.keys(n.attributes)].map((e) => e.toLowerCase())), a = /* @__PURE__ */ new Set([
		"__proto__",
		"constructor",
		"prototype",
		"src",
		"ready",
		"path",
		"index"
	]), o = Object.entries(t ?? {}).map(([e, t]) => {
		let n = `Component action ${e} at ${r}`;
		if (!/^[A-Za-z_]\w*$/.test(e) || a.has(e.toLowerCase()) || i.has(e.toLowerCase())) throw TypeError(`${n}: reserved or conflicting name`);
		if (typeof t != "function") throw TypeError(`${n} must be a function`);
		let o = { fn: t };
		return {
			name: e,
			cell: o,
			wrapper: function(...e) {
				if (!o.fn) throw Error(`${n}: instance has been disposed`);
				return Reflect.apply(o.fn, this, e);
			},
			label: n
		};
	}), s = !1, c = () => {
		for (let t of o) if (t.name in e) throw TypeError(`${t.label}: conflicts with host member`);
	};
	c();
	let l = () => {
		if (s) return;
		s = !0;
		for (let e of o) e.cell.fn = void 0;
		let t = [];
		for (let n of o) try {
			if (Object.getOwnPropertyDescriptor(e, n.name)?.value === n.wrapper && !Reflect.deleteProperty(e, n.name)) throw TypeError(`${n.label}: cannot remove host method`);
		} catch (e) {
			t.push(e);
		}
		if (t.length) throw AggregateError(t, `Component action cleanup failed at ${r}`);
	};
	return {
		dispose: l,
		install() {
			if (s) throw Error(`Component actions have been disposed at ${r}`);
			try {
				c();
				for (let { name: t, wrapper: n } of o) Object.defineProperty(e, t, {
					value: n,
					enumerable: !1,
					writable: !1,
					configurable: !0
				});
			} catch (e) {
				try {
					l();
				} catch (t) {
					throw AggregateError([e, t], `Component action installation failed at ${r}`);
				}
				throw e;
			}
		}
	};
}
// src/runtime/host.ts
var Q = /* @__PURE__ */ new Map();
function Oe(e, t) {
	t?.throwIfAborted();
	let n = new URL(e);
	n.hash = "";
	let r = n.href, i = Q.get(r);
	if (!i) {
		let e = new AbortController();
		i = {
			controller: e,
			users: 0,
			settled: !1,
			promise: Promise.resolve(void 0)
		};
		let t = i;
		i.promise = (async () => {
			let n = await O(r, {
				baseURL: r,
				signal: e.signal
			}), i = k(n.html, n.url);
			Ae(i.content, n.url);
			let a = await Te(i, /* @__PURE__ */ new Set(), e.signal);
			return re(a.fields), t.settled = !0, Q.has(n.url) || Q.set(n.url, t), Object.freeze({
				source: n,
				definition: a
			});
		})().catch((e) => {
			throw t.settled = !0, Q.get(r) === t && Q.delete(r), e;
		}), Q.set(r, i);
	}
	let a = i;
	return a.users++, new Promise((e, n) => {
		let i = !1, o = () => !i && (i = !0, t?.removeEventListener("abort", s), --a.users === 0 && !a.settled && (Q.get(r) === a && Q.delete(r), a.controller.abort()), !0), s = () => {
			o() && n(t.reason);
		};
		t?.addEventListener("abort", s, { once: !0 }), a.promise.then((t) => {
			o() && e(t);
		}, (e) => {
			o() && n(e);
		}), t?.aborted && s();
	});
}
var ke = class {
	element;
	prepareChild;
	report;
	inputs;
	get shadowRoot() {
		return this.element.shadowRoot ?? this.element.attachShadow({ mode: "open" });
	}
	ready = Promise.resolve();
	abort;
	view;
	actions;
	releaseHold;
	constructor(e, t, n) {
		this.element = e, this.prepareChild = t, this.report = n, this.inputs = new ie(e, (t) => n(e, t));
	}
	load(e, t) {
		this.dispose();
		let n = new AbortController();
		this.abort = n;
		let r = e.group.hold();
		this.releaseHold = r.release;
		let i = () => this.abort === n && !n.signal.aborted && this.element.isConnected, a, o, s = !1;
		this.ready = (async () => {
			let c = t ?? this.element.getAttribute("src");
			if (!c?.trim()) throw TypeError("Template src must be a non-empty string");
			let l = new URL(c, e.baseURL);
			if (l.hash = "", e.ancestors.includes(l.href)) throw Error(`Circular Template: ${[...e.ancestors, l.href].join(" -> ")}`);
			let { source: u, definition: d } = await Oe(l.href, n.signal);
			if (!i()) return;
			if (u.ancestors.some((t) => e.ancestors.includes(t))) throw Error(`Circular Template: ${[...e.ancestors, ...u.ancestors].join(" -> ")}`);
			this.inputs.configure(d.fields);
			let f = {
				...e,
				baseURL: u.url,
				ancestors: [...e.ancestors, ...u.ancestors],
				variables: void 0,
				properties: this.inputs.properties,
				attributes: this.inputs.attributes
			}, p = Ee(d, {
				acquireBehavior: e.acquireBehavior,
				route: e.route,
				properties: this.inputs.properties,
				attributes: this.inputs.attributes
			}, {
				signal: n.signal,
				onError: (e) => this.report(this.element, e),
				onElement: (e, t, n) => this.prepareChild(e, {
					...f,
					...n
				})
			});
			a = p, i() ? (this.view = p, o = De(this.element, p.actions, d.fields, u.url), this.actions = o, s = !0, p.mount(this.shadowRoot), i() ? (o.install(), r.settle()) : o.dispose()) : p.dispose();
		})().catch((n) => {
			if (!i()) {
				if (s) throw n;
				return;
			}
			r.fail();
			let c = [n];
			this.view === a && (this.view = void 0), this.actions === o && (this.actions = void 0);
			try {
				o?.dispose();
			} catch (e) {
				c.push(e);
			}
			try {
				a?.dispose();
			} catch (e) {
				c.push(e);
			}
			if (i()) {
				try {
					this.inputs.dispose();
				} catch (e) {
					c.push(e);
				}
				this.shadowRoot.replaceChildren();
			}
			throw AggregateError(c, `Template load failed at ${t ?? this.element.getAttribute("src")} (from ${e.baseURL})`);
		}), this.ready.catch((e) => this.report(this.element, e));
	}
	stopBindings() {
		let e = [];
		for (let t of [
			() => this.actions?.dispose(),
			() => this.inputs.stop(),
			() => {
				this.view || this.abort?.abort();
			},
			() => this.view?.stopBindings()
		]) try {
			t();
		} catch (t) {
			e.push(t);
		}
		if (e.length) throw AggregateError(e, "Template stop failed");
	}
	dispose() {
		let e = this.view;
		this.view = void 0;
		let t = this.actions;
		this.actions = void 0;
		let n = this.abort;
		this.abort = void 0;
		let r = this.releaseHold;
		this.releaseHold = void 0;
		let i = [];
		for (let a of [
			() => t?.dispose(),
			() => this.inputs.stop(),
			() => e?.dispose(),
			() => this.inputs.dispose(),
			() => n?.abort(),
			() => r?.(),
			() => this.element.shadowRoot?.replaceChildren()
		]) try {
			a();
		} catch (e) {
			i.push(e);
		}
		if (i.length) throw AggregateError(i, "Template cleanup failed");
	}
};
function Ae(e, t) {
	for (let n of e.querySelectorAll("*")) {
		if (n.localName === "script") throw Error(`Template scripts must use inline <script ns-behavior type="module">: ${t}`);
		if (n.localName === "base") throw Error(`Template must not declare a document base URL: ${t}`);
		if (n.localName === "ns-include" || n.localName === "ns-route") {
			if (n.hasAttribute("behavior")) throw Error(`Declare Behavior inside the Template, not on ${n.localName}: ${t}`);
			if (n.localName === "ns-route" && [...n.childNodes].some((e) => e.nodeType !== Node.COMMENT_NODE && (e.nodeType !== Node.TEXT_NODE || e.textContent?.trim()))) throw Error(`${n.localName} content must be provided through src: ${t}`);
		}
		let e = [];
		[
			"img",
			"audio",
			"video",
			"source",
			"track",
			"input",
			"iframe",
			"embed"
		].includes(n.localName) && e.push("src"), [
			"a",
			"area",
			"link",
			"use",
			"image"
		].includes(n.localName) && e.push("href"), n.localName === "video" && e.push("poster"), n.localName === "form" && e.push("action"), (n.localName === "input" || n.localName === "button") && e.push("formaction"), n.localName === "object" && e.push("data");
		for (let r of e) {
			let e = n.getAttribute(r);
			e !== null && !e.startsWith("#") && n.setAttribute(r, new URL(e, t).href);
		}
		let r = ["img", "source"].includes(n.localName) ? ["srcset"] : n.localName === "link" ? ["imagesrcset"] : [];
		for (let e of r) n.hasAttribute(e) && n.setAttribute(e, j(n.getAttribute(e), t));
		n.localName === "template" && [
			"ns-foreach",
			"ns-if",
			"ns-else-if",
			"ns-else"
		].some((e) => n.hasAttribute(e)) && Ae(n.content, t);
	}
}
// src/runtime/index.ts
var je = y();
function Me(e, t) {
	je.register(e, t);
}
var $;
function Ne() {
	if ($ || typeof window > "u" || typeof customElements > "u") return;
	let e = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new Map(), n = (e, t) => {
		let n = new CustomEvent("ns-error", {
			detail: t,
			bubbles: !0,
			composed: !0,
			cancelable: !0
		});
		(e.isConnected ? e : document.documentElement).dispatchEvent(n) && (typeof globalThis.reportError == "function" ? globalThis.reportError(t) : console.error(t));
	}, r = new w(0, 0, {}, () => new URL(location.href), (e) => n(document.documentElement, e)), i = () => ({
		baseURL: document.baseURI,
		ancestors: [],
		acquireBehavior: je.acquire,
		group: r
	}), a = (t) => {
		let r = e.get(t);
		return r || (r = {
			controller: new ke(t, s, n),
			connected: !1
		}, e.set(t, r)), r;
	}, o = (e) => {
		e.connected = !1;
		let t = e.registration;
		e.registration = void 0;
		let n = [];
		for (let r of [() => t?.dispose(), () => e.controller.dispose()]) try {
			r();
		} catch (e) {
			n.push(e);
		}
		if (n.length) throw AggregateError(n, "Element cleanup failed");
	};
	function s(e, n) {
		if (!(e instanceof HTMLElement) || !["ns-include", "ns-route"].includes(e.localName) && !t.has(e.localName)) return;
		let r = a(e);
		return r.context = n, r.staleContext = !1, {
			stopBindings: () => {
				r.controller.stopBindings(), r.registration?.stopBindings();
			},
			dispose: () => {
				r.staleContext = !0, r.context = void 0, o(r);
			}
		};
	}
	function c(e) {
		let n = a(e);
		if (!n.context && e.closest("[ns-html]") || n.connected || !e.isConnected) return;
		if (n.staleContext) throw Error("A disposed nested template requires a new loading context");
		n.connected = !0;
		let r = n.context ?? i();
		if (e.localName !== "ns-route") n.controller.load(r, t.get(e.localName)?.url);
		else try {
			if ([...e.childNodes].some((e) => e.nodeType !== Node.COMMENT_NODE && (e.nodeType !== Node.TEXT_NODE || e.textContent?.trim()))) throw Error("ns-route requires src; inline route contents are not supported");
			n.registration = r.group.register({
				element: e,
				context: r,
				content: n.controller,
				activate: (e) => n.controller.load(e)
			});
		} catch (e) {
			let t = r.group.hold();
			throw t.fail(), n.registration = {
				stopBindings() {},
				dispose: t.release
			}, e;
		}
	}
	class l extends HTMLElement {
		constructor() {
			super(), this.shadowRoot || this.attachShadow({ mode: "open" }), a(this);
		}
		get ready() {
			return a(this).controller.ready;
		}
		connectedCallback() {
			try {
				c(this);
			} catch (e) {
				n(this, e);
			}
		}
		disconnectedCallback() {
			queueMicrotask(() => {
				if (!this.isConnected) try {
					o(a(this));
				} catch (e) {
					n(this, e);
				}
			});
		}
	}
	class u extends l {
		static observedAttributes = ["src"];
		attributeChangedCallback(e, t, r) {
			if (t !== r && a(this).connected) {
				if (this.localName === "ns-route") {
					let e = a(this);
					if (e.refreshQueued) return;
					e.refreshQueued = !0;
					let t = (e.context ?? i()).group.hold();
					queueMicrotask(() => {
						e.refreshQueued = !1;
						try {
							if (!e.connected || !this.isConnected) return;
							try {
								o(e);
							} catch (e) {
								n(this, e);
							}
							try {
								c(this);
							} catch (e) {
								n(this, e);
							}
						} finally {
							t.release();
						}
					});
				} else {
					try {
						o(a(this));
					} catch (e) {
						n(this, e);
					}
					try {
						c(this);
					} catch (e) {
						n(this, e);
					}
				}
			}
		}
	}
	class d extends u {
		static observedAttributes = [
			"src",
			"path",
			"index"
		];
	}
	$ = {
		createComponent(e, n) {
			if (typeof e != "string" || !/^[a-z][.0-9_a-z-]*-[.0-9_a-z-]*$/.test(e) || e.startsWith("ns-") || [
				"annotation-xml",
				"color-profile",
				"font-face",
				"font-face-src",
				"font-face-uri",
				"font-face-format",
				"font-face-name",
				"missing-glyph"
			].includes(e)) return Promise.reject(/* @__PURE__ */ TypeError("Component name must be a lowercase ASCII custom element name outside the ns- namespace"));
			if (!(typeof n == "string" && n.trim()) && !(n instanceof URL)) return Promise.reject(/* @__PURE__ */ TypeError("Component template URL must be a non-empty string or URL"));
			let r = new URL(n, document.baseURI);
			r.hash = "";
			let i = r.href, a = t.get(e);
			if (a) return a.url === i ? a.promise : Promise.reject(/* @__PURE__ */ Error(`Component ${e} is already registered with ${a.url}`));
			if (customElements.get(e)) return Promise.reject(/* @__PURE__ */ Error(`Custom element already registered: ${e}`));
			let o = {
				url: i,
				promise: Promise.resolve()
			};
			return t.set(e, o), o.promise = (async () => {
				await Oe(i), customElements.define(e, class extends l {});
			})().catch((n) => {
				throw t.get(e) === o && t.delete(e), Error(`Failed to define component ${e} from ${i}`, { cause: n });
			}), o.promise;
		},
		navigate(e, t = {}) {
			let n = new URL(e, location.href);
			if (n.origin !== location.origin) throw Error("navigate requires a same-origin URL");
			t.replace ? history.replaceState(null, "", n) : history.pushState(null, "", n), r.schedule();
		}
	}, window.addEventListener("popstate", () => r.schedule()), window.addEventListener("hashchange", () => r.schedule()), document.addEventListener("click", (e) => {
		if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		let t = e.composedPath().find((e) => e instanceof HTMLAnchorElement);
		if (!t || !t.hasAttribute("href") || t.hasAttribute("target") || t.hasAttribute("download")) return;
		let n = new URL(t.href);
		n.origin === location.origin && ["http:", "https:"].includes(n.protocol) && (e.preventDefault(), $.navigate(n));
	});
	let f = document.readyState === "loading" ? r.hold() : void 0;
	f && document.addEventListener("DOMContentLoaded", () => f.settle(), { once: !0 });
	for (let [e, t] of [["ns-include", u], ["ns-route", d]]) {
		if (customElements.get(e)) throw Error(`Custom element already registered: ${e}`);
		customElements.define(e, t);
	}
	r.schedule();
}
function Pe(e, t) {
	if (Ne(), !$) throw Error("navigate is only available in a browser");
	$.navigate(e, t);
}
async function Fe(e, t) {
	if (Ne(), !$) throw Error("createComponent is only available in a browser");
	return $.createComponent(e, t);
}
Ne();
export { e as Signal, s as attribute, t as batch, Fe as createComponent, n as createState, Pe as navigate, o as property, Me as registerBehavior };

//# sourceMappingURL=index.js.map