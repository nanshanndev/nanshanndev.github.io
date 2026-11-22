// src/state/signal.ts
var e = 0, t, n = 0, r = 0, i = !1, a = /* @__PURE__ */ new Set();
function o() {
	return t !== void 0;
}
function s() {
	if (n > 0) throw Error("Cannot write state inside computed");
}
function c(e, t) {
	return {
		value: e,
		calculate: t,
		error: void 0,
		failed: !1,
		initialized: t === void 0,
		evaluating: !1,
		version: 0,
		checkedAt: -1,
		sources: /* @__PURE__ */ new Map(),
		sinks: /* @__PURE__ */ new Set()
	};
}
function l(e) {
	return e;
}
function u(e, t) {
	let n = e.sinks.size === 0;
	if (e.sinks.add(t), n && e.calculate) for (let t of e.sources.keys()) u(t, e);
}
function d(e, t) {
	if (e.sinks.delete(t) && e.sinks.size === 0 && e.calculate) for (let t of e.sources.keys()) d(t, e);
}
function f(r) {
	if (r.calculate) {
		if (r.evaluating) throw Error("Circular computed dependency");
		if (!(r.initialized && r.checkedAt === e)) {
			r.evaluating = !0;
			try {
				if (r.initialized) {
					let t = !1;
					for (let [e, n] of r.sources) if (f(e), e.version !== n) {
						t = !0;
						break;
					}
					if (!t) {
						r.checkedAt = e;
						return;
					}
				}
				let i = r.sources, a = /* @__PURE__ */ new Map(), o = t;
				t = a, n++;
				try {
					let e = r.calculate();
					r.initialized && !r.failed && Object.is(r.value, e) || r.version++, r.value = e, r.failed = !1, r.error = void 0;
				} catch (e) {
					r.error = e, r.failed = !0, r.version++;
				} finally {
					if (n--, t = o, r.sources = a, r.initialized = !0, r.checkedAt = e, r.sinks.size > 0) {
						for (let e of a.keys()) i.has(e) || u(e, l(r));
						for (let e of i.keys()) a.has(e) || d(e, l(r));
					}
				}
			} finally {
				r.evaluating = !1;
			}
		}
	}
}
function p(e) {
	if (f(e), t?.set(l(e), e.version), e.failed) throw e.error;
	return e.value;
}
function m(e) {
	let t = /* @__PURE__ */ new Set(), n = [e];
	for (let e = 0; e < n.length; e++) {
		let r = n[e];
		if (!t.has(r)) {
			t.add(r);
			for (let e of r.sinks) "listener" in e ? a.add(e) : n.push(e);
		}
	}
}
function h(e) {
	if (e.length === 1) throw e[0];
	if (e.length > 1) throw AggregateError(e, "Signal callbacks failed");
}
function g() {
	if (r > 0 || i) return;
	i = !0;
	let e = [];
	try {
		let t = 0;
		for (; a.size > 0;) {
			if (++t > 100) {
				a.clear(), e.push(/* @__PURE__ */ Error("Signal subscription update cycle"));
				break;
			}
			let n = [...a];
			a.clear();
			for (let t of n) if (t.active) try {
				let e = v(() => p(t.source));
				t.version !== t.source.version && (t.version = t.source.version, v(() => t.listener(e)));
			} catch (t) {
				e.push(t);
			}
		}
	} finally {
		i = !1;
	}
	h(e);
}
function _(e) {
	r++;
	let t, n = [];
	try {
		t = e();
	} catch (e) {
		n.push(e);
	} finally {
		r--;
		try {
			g();
		} catch (e) {
			n.push(e);
		}
	}
	return h(n), t;
}
function v(e) {
	let n = t;
	t = void 0;
	try {
		return e();
	} finally {
		t = n;
	}
}
function y(e, t) {
	if (n > 0) throw Error("Cannot subscribe inside computed");
	let r = v(() => p(e)), i = {
		source: l(e),
		listener: (e) => t(e),
		version: e.version,
		active: !0
	}, o = () => {
		i.active && (i.active = !1, a.delete(i), d(l(e), i));
	};
	u(l(e), i);
	try {
		_(() => v(() => t(r)));
	} catch (e) {
		throw o(), e;
	}
	return o;
}
var b = class {
	#e;
	constructor(e) {
		this.#e = c(e);
	}
	get() {
		return p(this.#e);
	}
	peek() {
		return v(() => this.get());
	}
	set(t) {
		s(), !Object.is(this.#e.value, t) && (this.#e.value = t, this.#e.version++, e++, m(l(this.#e)), g());
	}
	update(e) {
		this.set(v(() => e(this.peek())));
	}
	subscribe(e) {
		return y(this.#e, e);
	}
}, x = {
	State: b,
	Computed: class {
		#e;
		constructor(e) {
			this.#e = c(void 0, e);
		}
		get() {
			return p(this.#e);
		}
		peek() {
			return v(() => this.get());
		}
		subscribe(e) {
			return y(this.#e, e);
		}
	},
	subtle: { untrack: v }
}, S = /* @__PURE__ */ new WeakMap(), C = /* @__PURE__ */ new WeakMap(), w = /* @__PURE__ */ new WeakMap();
function T(e) {
	if (typeof e != "object" || !e) return !1;
	let t = Object.getPrototypeOf(e);
	return Array.isArray(e) ? t === Array.prototype : t === Object.prototype || t === null;
}
function E(e) {
	return typeof e == "object" && e ? C.get(e) ?? e : e;
}
function D(e) {
	let t = w.get(e);
	return t || (t = {}, w.set(e, t)), t;
}
function O(e, t, n) {
	if (!o()) return;
	let r = D(e)[n] ??= /* @__PURE__ */ new Map(), i = r.get(t);
	i || (i = new b(0), r.set(t, i)), i.get();
}
function k(e) {
	e && e.set(e.peek() + 1);
}
function A(e, t) {
	return {
		value: E(Reflect.get(e, t)),
		own: Object.hasOwn(e, t),
		has: Reflect.has(e, t)
	};
}
function j(e, t, n, r = !0) {
	let i = w.get(e);
	if (!i) return;
	let a = A(e, t);
	Object.is(n.value, a.value) || k(i.value?.get(t)), n.has !== a.has && k(i.has?.get(t)), n.own !== a.own && (k(i.own?.get(t)), r && k(i.keys));
}
function M(e) {
	return typeof e == "string" && /^(0|[1-9]\d*)$/.test(e) && Number(e) < 4294967295;
}
var N = /* @__PURE__ */ new Map();
for (let e of [
	"push",
	"pop",
	"shift",
	"unshift",
	"splice",
	"sort",
	"reverse",
	"copyWithin",
	"fill"
]) {
	let t = Array.prototype[e];
	N.set(t, function(...e) {
		return s(), _(() => v(() => Reflect.apply(t, this, e)));
	});
}
var P = /* @__PURE__ */ new Map();
for (let e of [
	"includes",
	"indexOf",
	"lastIndexOf"
]) {
	let t = Array.prototype[e];
	P.set(t, function(...e) {
		let n = Reflect.apply(t, this, e);
		return n === !1 || n === -1 ? Reflect.apply(t, E(this), e.map(E)) : n;
	});
}
var F = {
	get(e, t, n) {
		O(e, t, "value");
		let r = Reflect.get(e, t, n);
		return Array.isArray(e) && N.has(r) ? N.get(r) : Array.isArray(e) && P.has(r) ? P.get(r) : Object.hasOwn(e, t) ? I(r) : r;
	},
	set(e, t, n) {
		return s(), _(() => v(() => {
			let r = E(n), i = A(e, t);
			if (i.own && Object.is(i.value, r)) return !0;
			let a = Array.isArray(e) ? e.length : void 0, o = w.get(e), s;
			if (a !== void 0 && t === "length" && o) {
				s = /* @__PURE__ */ new Map();
				for (let t of [
					o.value,
					o.has,
					o.own
				]) for (let n of t?.keys() ?? []) M(n) && !s.has(n) && Object.hasOwn(e, n) && s.set(n, A(e, n));
			}
			let c = a !== void 0 && t === "length" && o?.keys ? Reflect.ownKeys(e).length : void 0;
			if (!(i.own ? Reflect.set(e, t, r, e) : Reflect.defineProperty(e, t, {
				value: r,
				writable: !0,
				enumerable: !0,
				configurable: !0
			}))) return !1;
			if (j(e, t, i), Array.isArray(e) && a !== e.length) {
				t !== "length" && k(o?.value?.get("length"));
				for (let [t, n] of s ?? []) j(e, t, n, !1);
				c !== void 0 && c !== Reflect.ownKeys(e).length && k(o?.keys);
			}
			return !0;
		}));
	},
	deleteProperty(e, t) {
		return s(), _(() => v(() => {
			let n = A(e, t), r = Reflect.deleteProperty(e, t);
			return r && j(e, t, n), r;
		}));
	},
	has(e, t) {
		return O(e, t, "has"), Reflect.has(e, t);
	},
	ownKeys(e) {
		return o() && (D(e).keys ??= new b(0)).get(), Reflect.ownKeys(e);
	},
	getOwnPropertyDescriptor(e, t) {
		return O(e, t, "own"), Reflect.getOwnPropertyDescriptor(e, t);
	},
	defineProperty() {
		throw TypeError("State property descriptors cannot be changed; use assignment");
	},
	setPrototypeOf() {
		throw TypeError("State prototype cannot be changed");
	},
	preventExtensions() {
		throw TypeError("State must remain extensible");
	}
};
function I(e) {
	let t = E(e);
	if (typeof t != "object" || !t) return e;
	let n = S.get(t);
	if (n) return n;
	if (!T(t)) return e;
	if (!Object.isExtensible(t)) throw TypeError("State requires extensible data objects");
	for (let e of Reflect.ownKeys(t)) {
		let n = Reflect.getOwnPropertyDescriptor(t, e), r = Array.isArray(t) && e === "length";
		if (!("value" in n) || !n.writable || !n.configurable && !r) throw TypeError("State requires mutable data properties, without accessors");
	}
	let r = new Proxy(t, F);
	return S.set(t, r), C.set(r, t), r;
}
function L(e) {
	if (!T(E(e))) throw TypeError("createState requires a plain object or array");
	return I(e);
}
export { x as n, _ as r, L as t };

//# sourceMappingURL=state-CY-J2rIa.js.map