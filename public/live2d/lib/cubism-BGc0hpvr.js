//#region vendor/compiled/Framework/src/id/cubismid.js
var e = class e {
	static createIdInternal(t) {
		return new e(t);
	}
	getString() {
		return this._id;
	}
	isEqual(t) {
		return typeof t == "string" ? this._id == t : t instanceof e && this._id == t._id;
	}
	isNotEqual(t) {
		return typeof t == "string" ? this._id != t : t instanceof e && this._id != t._id;
	}
	constructor(e) {
		this._id = e;
	}
	_id;
}, t;
(function(t) {
	t.CubismId = e;
})(t ||= {});
//#endregion
//#region vendor/compiled/Framework/src/id/cubismidmanager.js
var n = class {
	constructor() {
		this._ids = [];
	}
	release() {
		for (let e = 0; e < this._ids.length; ++e) this._ids[e] = void 0;
		this._ids = null;
	}
	registerIds(e) {
		for (let t = 0; t < e.length; t++) this.registerId(e[t]);
	}
	registerId(t) {
		let n = null;
		if (typeof t == "string") {
			if ((n = this.findId(t)) != null) return n;
			n = e.createIdInternal(t), this._ids.push(n);
		} else return this.registerId(t);
		return n;
	}
	getId(e) {
		return this.registerId(e);
	}
	isExist(e) {
		return typeof e == "string" ? this.findId(e) != null : this.isExist(e);
	}
	findId(e) {
		for (let t = 0; t < this._ids.length; ++t) if (this._ids[t].getString() == e) return this._ids[t];
		return null;
	}
	_ids;
}, r;
(function(e) {
	e.CubismIdManager = n;
})(r ||= {});
//#endregion
//#region vendor/compiled/Framework/src/math/cubismvector2.js
var i = class e {
	x;
	y;
	constructor(e, t) {
		this.x = e, this.y = t, this.x = e ?? 0, this.y = t ?? 0;
	}
	add(t) {
		let n = new e(0, 0);
		return n.x = this.x + t.x, n.y = this.y + t.y, n;
	}
	substract(t) {
		let n = new e(0, 0);
		return n.x = this.x - t.x, n.y = this.y - t.y, n;
	}
	multiply(t) {
		let n = new e(0, 0);
		return n.x = this.x * t.x, n.y = this.y * t.y, n;
	}
	multiplyByScaler(t) {
		return this.multiply(new e(t, t));
	}
	division(t) {
		let n = new e(0, 0);
		return n.x = this.x / t.x, n.y = this.y / t.y, n;
	}
	divisionByScalar(t) {
		return this.division(new e(t, t));
	}
	getLength() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	getDistanceWith(e) {
		return Math.sqrt((this.x - e.x) * (this.x - e.x) + (this.y - e.y) * (this.y - e.y));
	}
	dot(e) {
		return this.x * e.x + this.y * e.y;
	}
	normalize() {
		let e = (this.x * this.x + this.y * this.y) ** .5;
		this.x /= e, this.y /= e;
	}
	isEqual(e) {
		return this.x == e.x && this.y == e.y;
	}
	isNotEqual(e) {
		return !this.isEqual(e);
	}
}, a;
(function(e) {
	e.CubismVector2 = i;
})(a ||= {});
//#endregion
//#region vendor/compiled/Framework/src/math/cubismmath.js
var o = class e {
	static Epsilon = 1e-5;
	static range(e, t, n) {
		return e < t ? e = t : e > n && (e = n), e;
	}
	static sin(e) {
		return Math.sin(e);
	}
	static cos(e) {
		return Math.cos(e);
	}
	static abs(e) {
		return Math.abs(e);
	}
	static sqrt(e) {
		return Math.sqrt(e);
	}
	static cbrt(e) {
		if (e === 0) return e;
		let t = e, n = t < 0;
		n && (t = -t);
		let r;
		return t === Infinity ? r = Infinity : (r = Math.exp(Math.log(t) / 3), r = (t / (r * r) + 2 * r) / 3), n ? -r : r;
	}
	static getEasingSine(e) {
		return e < 0 ? 0 : e > 1 ? 1 : .5 - .5 * this.cos(e * Math.PI);
	}
	static max(e, t) {
		return e > t ? e : t;
	}
	static min(e, t) {
		return e > t ? t : e;
	}
	static clamp(e, t, n) {
		return e < t ? t : n < e ? n : e;
	}
	static degreesToRadian(e) {
		return e / 180 * Math.PI;
	}
	static radianToDegrees(e) {
		return e * 180 / Math.PI;
	}
	static directionToRadian(e, t) {
		let n = Math.atan2(t.y, t.x) - Math.atan2(e.y, e.x);
		for (; n < -Math.PI;) n += Math.PI * 2;
		for (; n > Math.PI;) n -= Math.PI * 2;
		return n;
	}
	static directionToDegrees(e, t) {
		let n = this.directionToRadian(e, t), r = this.radianToDegrees(n);
		return t.x - e.x > 0 && (r = -r), r;
	}
	static radianToDirection(e) {
		let t = new i();
		return t.x = this.sin(e), t.y = this.cos(e), t;
	}
	static quadraticEquation(t, n, r) {
		return this.abs(t) < e.Epsilon ? this.abs(n) < e.Epsilon ? -r : -r / n : -(n + this.sqrt(n * n - 4 * t * r)) / (2 * t);
	}
	static cardanoAlgorithmForBezier(t, n, r, i) {
		if (this.abs(t) < e.Epsilon) return this.range(this.quadraticEquation(n, r, i), 0, 1);
		let a = n / t, o = r / t, s = i / t, c = (3 * o - a * a) / 3, l = c / 3, u = (2 * a * a * a - 9 * a * o + 27 * s) / 27, d = u / 2, f = d * d + l * l * l, p = .5, m = .51;
		if (f < 0) {
			let e = -c / 3, t = e * e * e, n = this.sqrt(t), r = -u / (2 * n), i = this.range(r, -1, 1), o = Math.acos(i), s = 2 * this.cbrt(n), l = s * this.cos(o / 3) - a / 3;
			if (this.abs(l - p) < m) return this.range(l, 0, 1);
			let d = s * this.cos((o + 2 * Math.PI) / 3) - a / 3;
			if (this.abs(d - p) < m) return this.range(d, 0, 1);
			let f = s * this.cos((o + 4 * Math.PI) / 3) - a / 3;
			return this.range(f, 0, 1);
		}
		if (f == 0) {
			let e;
			e = d < 0 ? this.cbrt(-d) : -this.cbrt(d);
			let t = 2 * e - a / 3;
			if (this.abs(t - p) < m) return this.range(t, 0, 1);
			let n = -e - a / 3;
			return this.range(n, 0, 1);
		}
		let h = this.sqrt(f), g = this.cbrt(h - d) - this.cbrt(h + d) - a / 3;
		return this.range(g, 0, 1);
	}
	static mod(e, t) {
		if (!isFinite(e) || t === 0 || isNaN(e) || isNaN(t)) return console.warn(`divided: ${e}, divisor: ${t} mod() returns 'NaN'.`), NaN;
		let n = Math.abs(e), r = Math.abs(t), i = n - Math.floor(n / r) * r;
		return i *= Math.sign(e), i;
	}
	constructor() {}
}, s;
(function(e) {
	e.CubismMath = o;
})(s ||= {});
//#endregion
//#region vendor/compiled/Framework/src/math/cubismmatrix44.js
var c = class e {
	constructor() {
		this._tr = /* @__PURE__ */ new Float32Array(16), this.loadIdentity();
	}
	static multiply(e, t, n) {
		let r = new Float32Array([
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		]);
		for (let n = 0; n < 4; ++n) for (let i = 0; i < 4; ++i) for (let a = 0; a < 4; ++a) r[i + n * 4] += e[a + n * 4] * t[i + a * 4];
		for (let e = 0; e < 16; ++e) n[e] = r[e];
	}
	loadIdentity() {
		let e = new Float32Array([
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1
		]);
		this.setMatrix(e);
	}
	setMatrix(e) {
		for (let t = 0; t < 16; ++t) this._tr[t] = e[t];
	}
	getArray() {
		return this._tr;
	}
	getScaleX() {
		return this._tr[0];
	}
	getScaleY() {
		return this._tr[5];
	}
	getTranslateX() {
		return this._tr[12];
	}
	getTranslateY() {
		return this._tr[13];
	}
	transformX(e) {
		return this._tr[0] * e + this._tr[12];
	}
	transformY(e) {
		return this._tr[5] * e + this._tr[13];
	}
	invertTransformX(e) {
		return (e - this._tr[12]) / this._tr[0];
	}
	invertTransformY(e) {
		return (e - this._tr[13]) / this._tr[5];
	}
	translateRelative(t, n) {
		let r = new Float32Array([
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			t,
			n,
			0,
			1
		]);
		e.multiply(r, this._tr, this._tr);
	}
	translate(e, t) {
		this._tr[12] = e, this._tr[13] = t;
	}
	translateX(e) {
		this._tr[12] = e;
	}
	translateY(e) {
		this._tr[13] = e;
	}
	scaleRelative(t, n) {
		let r = new Float32Array([
			t,
			0,
			0,
			0,
			0,
			n,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1
		]);
		e.multiply(r, this._tr, this._tr);
	}
	scale(e, t) {
		this._tr[0] = e, this._tr[5] = t;
	}
	multiplyByMatrix(t) {
		e.multiply(t.getArray(), this._tr, this._tr);
	}
	getInvert() {
		let t = this._tr[0], n = this._tr[1], r = this._tr[2], i = this._tr[4], a = this._tr[5], s = this._tr[6], c = this._tr[8], l = this._tr[9], u = this._tr[10], d = this._tr[12], f = this._tr[13], p = this._tr[14], m = t * (a * u - l * s) - i * (n * u - l * r) + c * (n * s - a * r), h = new e();
		if (o.abs(m) < o.Epsilon) return h.loadIdentity(), h;
		let g = 1 / m, _ = (a * u - l * s) * g, v = -(i * u - c * s) * g, y = (i * l - c * a) * g, b = -(n * u - l * r) * g, x = (t * u - c * r) * g, S = -(t * l - c * n) * g, C = (n * s - a * r) * g, w = -(t * s - i * r) * g, T = (t * a - i * n) * g;
		return h._tr[0] = _, h._tr[1] = b, h._tr[2] = C, h._tr[3] = 0, h._tr[4] = v, h._tr[5] = x, h._tr[6] = w, h._tr[7] = 0, h._tr[8] = y, h._tr[9] = S, h._tr[10] = T, h._tr[11] = 0, h._tr[12] = -(_ * d + v * f + y * p), h._tr[13] = -(b * d + x * f + S * p), h._tr[14] = -(C * d + w * f + T * p), h._tr[15] = 1, h;
	}
	clone() {
		let t = new e();
		for (let e = 0; e < this._tr.length; e++) t._tr[e] = this._tr[e];
		return t;
	}
	_tr;
}, l;
(function(e) {
	e.CubismMatrix44 = c;
})(l ||= {});
//#endregion
//#region vendor/compiled/Framework/src/type/csmrectf.js
var u = class {
	constructor(e, t, n, r) {
		this.x = e, this.y = t, this.width = n, this.height = r;
	}
	getCenterX() {
		return this.x + .5 * this.width;
	}
	getCenterY() {
		return this.y + .5 * this.height;
	}
	getRight() {
		return this.x + this.width;
	}
	getBottom() {
		return this.y + this.height;
	}
	setRect(e) {
		this.x = e.x, this.y = e.y, this.width = e.width, this.height = e.height;
	}
	expand(e, t) {
		this.x -= e, this.y -= t, this.width += e * 2, this.height += t * 2;
	}
	x;
	y;
	width;
	height;
}, d;
(function(e) {
	e.csmRect = u;
})(d ||= {});
//#endregion
//#region vendor/compiled/Framework/src/utils/cubismdebug.js
var f = (e, t, n) => {
	y.print(e, "[CSM]" + t, n);
}, p = (e, t, n) => {
	f(e, t + "\n", n);
}, m = (e) => {
	console.assert(e);
}, h = (e, ...t) => {
	p(M.LogLevel_Debug, "[D]" + e, t);
}, g = (e, ...t) => {
	p(M.LogLevel_Info, "[I]" + e, t);
}, _ = (e, ...t) => {
	p(M.LogLevel_Warning, "[W]" + e, t);
}, v = (e, ...t) => {
	p(M.LogLevel_Error, "[E]" + e, t);
}, y = class {
	static print(e, t, n) {
		if (e < j.getLoggingLevel()) return;
		let r = j.coreLogFunction;
		r && r(t.replace(/\{(\d+)\}/g, (e, t) => n[t]));
	}
	static dumpBytes(e, t, n) {
		for (let r = 0; r < n; r++) r % 16 == 0 && r > 0 ? this.print(e, "\n") : r % 8 == 0 && r > 0 && this.print(e, "  "), this.print(e, "{0} ", [t[r] & 255]);
		this.print(e, "\n");
	}
	constructor() {}
}, b;
(function(e) {
	e.CubismDebug = y;
})(b ||= {});
//#endregion
//#region vendor/compiled/Framework/src/rendering/cubismrenderer.js
var x = class {
	static create() {
		return null;
	}
	static delete(e) {
		e = null;
	}
	initialize(e) {
		this._model = e, e.isBlendModeEnabled() && (this.useHighPrecisionMask(!0), g("This model uses a high-resolution mask because it operates in blend mode."));
	}
	drawModel(e = null) {
		this.getModel() != null && this.doDrawModel(e);
	}
	setMvpMatrix(e) {
		this._mvpMatrix4x4.setMatrix(e.getArray());
	}
	getMvpMatrix() {
		return this._mvpMatrix4x4;
	}
	setModelColor(e, t, n, r) {
		this._modelColor.r = o.clamp(e, 0, 1), this._modelColor.g = o.clamp(t, 0, 1), this._modelColor.b = o.clamp(n, 0, 1), this._modelColor.a = o.clamp(r, 0, 1);
	}
	getModelColor() {
		return JSON.parse(JSON.stringify(this._modelColor));
	}
	getModelColorWithOpacity(e) {
		let t = this.getModelColor();
		return t.a *= e, this.isPremultipliedAlpha() && (t.r *= t.a, t.g *= t.a, t.b *= t.a), t;
	}
	setIsPremultipliedAlpha(e) {
		this._isPremultipliedAlpha = e;
	}
	isPremultipliedAlpha() {
		return this._isPremultipliedAlpha;
	}
	setIsCulling(e) {
		this._isCulling = e;
	}
	isCulling() {
		return this._isCulling;
	}
	setAnisotropy(e) {
		this._anisotropy = e;
	}
	getAnisotropy() {
		return this._anisotropy;
	}
	getModel() {
		return this._model;
	}
	useHighPrecisionMask(e) {
		this._useHighPrecisionMask = e;
	}
	isUsingHighPrecisionMask() {
		return this._useHighPrecisionMask;
	}
	setRenderTargetSize(e, t) {
		this._modelRenderTargetWidth = e, this._modelRenderTargetHeight = t;
	}
	constructor(e, t) {
		this._modelRenderTargetWidth = e, this._modelRenderTargetHeight = t, this._isCulling = !1, this._isPremultipliedAlpha = !1, this._anisotropy = 0, this._model = null, this._modelColor = new w(), this._useHighPrecisionMask = !1, this._mvpMatrix4x4 = new c(), this._mvpMatrix4x4.loadIdentity();
	}
	static staticRelease;
	_mvpMatrix4x4;
	_modelColor;
	_isCulling;
	_isPremultipliedAlpha;
	_anisotropy;
	_model;
	_useHighPrecisionMask;
	_modelRenderTargetWidth;
	_modelRenderTargetHeight;
}, S;
(function(e) {
	e[e.CubismBlendMode_Normal = 0] = "CubismBlendMode_Normal", e[e.CubismBlendMode_Additive = 1] = "CubismBlendMode_Additive", e[e.CubismBlendMode_Multiplicative = 2] = "CubismBlendMode_Multiplicative";
})(S ||= {});
var C;
(function(e) {
	e[e.DrawableObjectType_Drawable = 0] = "DrawableObjectType_Drawable", e[e.DrawableObjectType_Offscreen = 1] = "DrawableObjectType_Offscreen";
})(C ||= {});
var w = class {
	constructor(e = 1, t = 1, n = 1, r = 1) {
		this.r = e, this.g = t, this.b = n, this.a = r;
	}
	r;
	g;
	b;
	a;
}, T = class {
	constructor(e, t) {
		this._clippingIdList = e, this._clippingIdCount = t, this._allClippedDrawRect = new u(), this._layoutBounds = new u(), this._clippedDrawableIndexList = [], this._clippedOffscreenIndexList = [], this._matrixForMask = new c(), this._matrixForDraw = new c(), this._bufferIndex = 0, this._layoutChannelIndex = 0;
	}
	release() {
		this._layoutBounds != null && (this._layoutBounds = null), this._allClippedDrawRect != null && (this._allClippedDrawRect = null), this._clippedDrawableIndexList != null && (this._clippedDrawableIndexList = null), this._clippedOffscreenIndexList != null && (this._clippedOffscreenIndexList = null);
	}
	addClippedDrawable(e) {
		this._clippedDrawableIndexList.push(e);
	}
	addClippedOffscreen(e) {
		this._clippedOffscreenIndexList.push(e);
	}
	_isUsing;
	_clippingIdList;
	_clippingIdCount;
	_layoutChannelIndex;
	_layoutBounds;
	_allClippedDrawRect;
	_matrixForMask;
	_matrixForDraw;
	_clippedDrawableIndexList;
	_clippedOffscreenIndexList;
	_bufferIndex;
}, ee;
(function(e) {
	e.CubismBlendMode = S, e.CubismRenderer = x, e.CubismTextureColor = w;
})(ee ||= {});
//#endregion
//#region vendor/compiled/Framework/src/utils/cubismjsonextension.js
var te = class e {
	static parseJsonObject(t, n) {
		return Object.keys(t).forEach((r) => {
			if (typeof t[r] == "boolean") {
				let e = !!t[r];
				n.put(r, new O(e));
			} else if (typeof t[r] == "string") {
				let e = String(t[r]);
				n.put(r, new ae(e));
			} else if (typeof t[r] == "number") {
				let e = Number(t[r]);
				n.put(r, new ie(e));
			} else t[r] instanceof Array ? n.put(r, e.parseJsonArray(t[r])) : t[r] instanceof Object ? n.put(r, e.parseJsonObject(t[r], new le())) : t[r] == null ? n.put(r, new se()) : n.put(r, t[r]);
		}), n;
	}
	static parseJsonArray(e) {
		let t = new ce();
		return Object.keys(e).forEach((n) => {
			if (typeof Number(n) == "number") if (typeof e[n] == "boolean") {
				let r = !!e[n];
				t.add(new O(r));
			} else if (typeof e[n] == "string") {
				let r = String(e[n]);
				t.add(new ae(r));
			} else if (typeof e[n] == "number") {
				let r = Number(e[n]);
				t.add(new ie(r));
			} else e[n] instanceof Array ? t.add(this.parseJsonArray(e[n])) : e[n] instanceof Object ? t.add(this.parseJsonObject(e[n], new le())) : e[n] == null ? t.add(new se()) : t.add(e[n]);
			else if (e[n] instanceof Array) t.add(this.parseJsonArray(e[n]));
			else if (e[n] instanceof Object) t.add(this.parseJsonObject(e[n], new le()));
			else if (e[n] == null) t.add(new se());
			else {
				let r = Array(e[n]);
				for (let e = 0; e < r.length; e++) t.add(r[e]);
			}
		}), t;
	}
}, ne = "Error: type mismatch", re = "Error: index out of bounds", E = class e {
	constructor() {}
	getRawString(e, t) {
		return this.getString(e, t);
	}
	toInt(e = 0) {
		return e;
	}
	toFloat(e = 0) {
		return e;
	}
	toBoolean(e = !1) {
		return e;
	}
	getSize() {
		return 0;
	}
	getArray(e = null) {
		return e;
	}
	getVector(e = []) {
		return e;
	}
	getMap(e) {
		return e;
	}
	getValueByIndex(t) {
		return e.errorValue.setErrorNotForClientCall(ne);
	}
	getValueByString(t) {
		return e.nullValue.setErrorNotForClientCall(ne);
	}
	getKeys() {
		return e.dummyKeys;
	}
	isError() {
		return !1;
	}
	isNull() {
		return !1;
	}
	isBool() {
		return !1;
	}
	isFloat() {
		return !1;
	}
	isString() {
		return !1;
	}
	isArray() {
		return !1;
	}
	isMap() {
		return !1;
	}
	equals(e) {
		return !1;
	}
	isStatic() {
		return !1;
	}
	setErrorNotForClientCall(e) {
		return oe.errorValue;
	}
	static staticInitializeNotForClientCall() {
		O.trueValue = new O(!0), O.falseValue = new O(!1), e.errorValue = new oe("ERROR", !0), e.nullValue = new se(), e.dummyKeys = [];
	}
	static staticReleaseNotForClientCall() {
		O.trueValue = null, O.falseValue = null, e.errorValue = null, e.nullValue = null, e.dummyKeys = null;
	}
	_stringBuffer;
	static dummyKeys;
	static errorValue;
	static nullValue;
}, D = class e {
	constructor(e, t) {
		this._error = null, this._lineCount = 0, this._root = null, e != null && this.parseBytes(e, t, this._parseCallback);
	}
	static create(t, n) {
		let r = new e();
		return r.parseBytes(t, n, r._parseCallback) ? r : (e.delete(r), null);
	}
	static delete(e) {
		e = null;
	}
	getRoot() {
		return this._root;
	}
	static arrayBufferToString(e) {
		let t = new Uint8Array(e), n = "";
		for (let e = 0, r = t.length; e < r; ++e) n += "%" + this.pad(t[e].toString(16));
		return n = decodeURIComponent(n), n;
	}
	static pad(e) {
		return e.length < 2 ? "0" + e : e;
	}
	parseBytes(t, n, r) {
		let i = [,], a = e.arrayBufferToString(t);
		if (r == null ? this._root = this.parseValue(a, n, 0, i) : this._root = r(JSON.parse(a), new le()), this._error) {
			let e = "\0";
			return e = "Json parse error : @line " + (this._lineCount + 1) + "\n", this._root = new ae(e), g("{0}", this._root.getRawString()), !1;
		} else if (this._root == null) return this._root = new oe(this._error, !1), !1;
		return !0;
	}
	getParseError() {
		return this._error;
	}
	checkEndOfFile() {
		return this._root.getArray()[1].equals("EOF");
	}
	parseValue(e, t, n, r) {
		if (this._error) return null;
		let i = null, a = n, o;
		for (; a < t; a++) switch (e[a]) {
			case "-":
			case ".":
			case "0":
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9": {
				let t = [,];
				return o = de(e.slice(a), t), r[0] = e.indexOf(t[0]), new ie(o);
			}
			case "\"": return new ae(this.parseString(e, t, a + 1, r));
			case "[": return i = this.parseArray(e, t, a + 1, r), i;
			case "{": return i = this.parseObject(e, t, a + 1, r), i;
			case "n": return a + 3 < t ? (i = new se(), r[0] = a + 4) : this._error = "parse null", i;
			case "t": return a + 3 < t ? (i = O.trueValue, r[0] = a + 4) : this._error = "parse true", i;
			case "f": return a + 4 < t ? (i = O.falseValue, r[0] = a + 5) : this._error = "illegal ',' position", i;
			case ",": return this._error = "illegal ',' position", null;
			case "]": return r[0] = a, null;
			case "\n": this._lineCount++;
			default: break;
		}
		return this._error = "illegal end of value", null;
	}
	parseString(e, t, n, r) {
		if (this._error) return null;
		if (!e) return this._error = "string is null", null;
		let i = n, a, o, s = "", c = n;
		for (; i < t; i++) switch (a = e[i], a) {
			case "\"": return r[0] = i + 1, s += e.substr(c, i - c), s;
			case "//": if (i++, i - 1 > c && (s += e.substr(c, i - c)), c = i + 1, i < t) switch (o = e[i], o) {
				case "\\":
					s += "\\";
					break;
				case "\"":
					s += "\"";
					break;
				case "/":
					s += "/";
					break;
				case "b":
					s += "\b";
					break;
				case "f":
					s += "\f";
					break;
				case "n":
					s += "\n";
					break;
				case "r":
					s += "\r";
					break;
				case "t":
					s += "	";
					break;
				case "u":
					this._error = "parse string/unicord escape not supported";
					break;
				default: break;
			}
			else this._error = "parse string/escape error";
			default: break;
		}
		return this._error = "parse string/illegal end", null;
	}
	parseObject(e, t, n, r) {
		if (this._error) return null;
		if (!e) return this._error = "buffer is null", null;
		let i = new le(), a = "", o = n, s = "", c = [,], l = !1;
		for (; o < t; o++) {
			FOR_LOOP: for (; o < t; o++) switch (s = e[o], s) {
				case "\"":
					if (a = this.parseString(e, t, o + 1, c), this._error) return null;
					o = c[0], l = !0;
					break FOR_LOOP;
				case "}": return r[0] = o + 1, i;
				case ":":
					this._error = "illegal ':' position";
					break;
				case "\n": this._lineCount++;
				default: break;
			}
			if (!l) return this._error = "key not found", null;
			l = !1;
			FOR_LOOP2: for (; o < t; o++) switch (s = e[o], s) {
				case ":":
					l = !0, o++;
					break FOR_LOOP2;
				case "}":
					this._error = "illegal '}' position";
					break;
				case "\n": this._lineCount++;
				default: break;
			}
			if (!l) return this._error = "':' not found", null;
			let n = this.parseValue(e, t, o, c);
			if (this._error) return null;
			o = c[0], i.put(a, n);
			FOR_LOOP3: for (; o < t; o++) switch (s = e[o], s) {
				case ",": break FOR_LOOP3;
				case "}": return r[0] = o + 1, i;
				case "\n": this._lineCount++;
				default: break;
			}
		}
		return this._error = "illegal end of perseObject", null;
	}
	parseArray(e, t, n, r) {
		if (this._error) return null;
		if (!e) return this._error = "buffer is null", null;
		let i = new ce(), a = n, o, s = [,];
		for (; a < t; a++) {
			let n = this.parseValue(e, t, a, s);
			if (this._error) return null;
			a = s[0], n && i.add(n);
			FOR_LOOP: for (; a < t; a++) switch (o = e[a], o) {
				case ",": break FOR_LOOP;
				case "]": return r[0] = a + 1, i;
				case "\n": ++this._lineCount;
				default: break;
			}
		}
		return i = void 0, this._error = "illegal end of parseObject", null;
	}
	_parseCallback = te.parseJsonObject;
	_error;
	_lineCount;
	_root;
}, ie = class extends E {
	constructor(e) {
		super(), this._value = e;
	}
	isFloat() {
		return !0;
	}
	getString(e, t) {
		return this._value = NaN, this._stringBuffer = "\0", this._stringBuffer;
	}
	toInt(e = 0) {
		return parseInt(this._value.toString());
	}
	toFloat(e = 0) {
		return this._value;
	}
	equals(e) {
		return typeof e == "number" && !Math.round(e) && e == this._value;
	}
	_value;
}, O = class extends E {
	isBool() {
		return !0;
	}
	toBoolean(e = !1) {
		return this._boolValue;
	}
	getString(e, t) {
		return this._stringBuffer = this._boolValue ? "true" : "false", this._stringBuffer;
	}
	equals(e) {
		return typeof e == "boolean" && e == this._boolValue;
	}
	isStatic() {
		return !0;
	}
	constructor(e) {
		super(), this._boolValue = e;
	}
	static trueValue;
	static falseValue;
	_boolValue;
}, ae = class extends E {
	constructor(e) {
		super(), this._stringBuffer = e;
	}
	isString() {
		return !0;
	}
	getString(e, t) {
		return this._stringBuffer;
	}
	equals(e) {
		return typeof e == "string" && this._stringBuffer == e;
	}
}, oe = class extends ae {
	isStatic() {
		return this._isStatic;
	}
	setErrorNotForClientCall(e) {
		return this._stringBuffer = e, this;
	}
	constructor(e, t) {
		super(e), this._isStatic = t;
	}
	isError() {
		return !0;
	}
	_isStatic;
}, se = class extends E {
	isNull() {
		return !0;
	}
	getString(e, t) {
		return this._stringBuffer;
	}
	isStatic() {
		return !0;
	}
	setErrorNotForClientCall(e) {
		return this._stringBuffer = e, oe.nullValue;
	}
	constructor() {
		super(), this._stringBuffer = "NullValue";
	}
}, ce = class extends E {
	constructor() {
		super(), this._array = [];
	}
	release() {
		for (let e = 0; e < this._array.length; e++) {
			let t = this._array[e];
			t && !t.isStatic() && (t = void 0, t = null);
		}
	}
	isArray() {
		return !0;
	}
	getValueByIndex(e) {
		return e < 0 || this._array.length <= e ? E.errorValue.setErrorNotForClientCall(re) : this._array[e] ?? E.nullValue;
	}
	getValueByString(e) {
		return E.errorValue.setErrorNotForClientCall(ne);
	}
	getString(e, t) {
		let n = t + "[\n";
		for (let e = 0; e < this._array.length; e++) {
			let n = this._array[e];
			this._stringBuffer += t + "" + n.getString(t + " ") + "\n";
		}
		return this._stringBuffer = n + t + "]\n", this._stringBuffer;
	}
	add(e) {
		this._array.push(e);
	}
	getVector(e = null) {
		return this._array;
	}
	getSize() {
		return this._array.length;
	}
	_array;
}, le = class extends E {
	constructor() {
		super(), this._map = /* @__PURE__ */ new Map();
	}
	release() {
		this._map.clear();
	}
	isMap() {
		return !0;
	}
	getValueByString(e) {
		return this._map.get(e) ?? E.nullValue;
	}
	getValueByIndex(e) {
		return E.errorValue.setErrorNotForClientCall(ne);
	}
	getString(e, t) {
		this._stringBuffer = t + "{\n";
		for (let e of this._map) {
			let n = e[0], r = e[1];
			this._stringBuffer += t + " " + n + " : " + r.getString(t + "   ") + " \n";
		}
		return this._stringBuffer += t + "}\n", this._stringBuffer;
	}
	getMap(e) {
		return this._map;
	}
	put(e, t) {
		this._map.set(e, t);
	}
	getKeys() {
		return this._keys ||= [...this._map.keys()], this._keys;
	}
	getSize() {
		return this._keys.length;
	}
	_map;
	_keys;
}, ue;
(function(e) {
	e.CubismJson = D, e.JsonArray = ce, e.JsonBoolean = O, e.JsonError = oe, e.JsonFloat = ie, e.JsonMap = le, e.JsonNullvalue = se, e.JsonString = ae, e.Value = E;
})(ue ||= {});
//#endregion
//#region vendor/compiled/Framework/src/live2dcubismframework.js
function de(e, t) {
	let n = 0;
	for (let t = 1;; t++) {
		let r = e.slice(t - 1, t);
		if (r == "e" || r == "-" || r == "E") continue;
		let i = e.substring(0, t), a = Number(i);
		if (isNaN(a)) break;
		n = t;
	}
	let r = parseFloat(e);
	return isNaN(r) && (r = NaN), t[0] = e.slice(n), r;
}
var k = !1, fe = !1, pe = null, me = null, A = Object.freeze({
	vertexOffset: 0,
	vertexStep: 2
});
function he(e) {
	e &&= void 0;
}
var j = class {
	static startUp(e = null) {
		if (k) return g("CubismFramework.startUp() is already done."), k;
		if (pe = e, pe != null && Live2DCubismCore.Logging.csmSetLogFunction(pe.logFunction), k = !0, k) {
			let e = Live2DCubismCore.Version.csmGetVersion(), t = (e & 4278190080) >> 24, n = (e & 16711680) >> 16, r = e & 65535, i = e;
			g("Live2D Cubism Core version: {0}.{1}.{2} ({3})", ("00" + t).slice(-2), ("00" + n).slice(-2), ("0000" + r).slice(-4), i);
		}
		return g("CubismFramework.startUp() is complete."), k;
	}
	static cleanUp() {
		k = !1, fe = !1, pe = null, me = null;
	}
	static initialize(e = 0) {
		if (m(k), !k) {
			_("CubismFramework is not started.");
			return;
		}
		if (fe) {
			_("CubismFramework.initialize() skipped, already initialized.");
			return;
		}
		E.staticInitializeNotForClientCall(), me = new n(), Live2DCubismCore.Memory.initializeAmountOfMemory(e), fe = !0, g("CubismFramework.initialize() is complete.");
	}
	static dispose() {
		if (m(k), !k) {
			_("CubismFramework is not started.");
			return;
		}
		if (!fe) {
			_("CubismFramework.dispose() skipped, not initialized.");
			return;
		}
		E.staticReleaseNotForClientCall(), me.release(), me = null, x.staticRelease(), fe = !1, g("CubismFramework.dispose() is complete.");
	}
	static isStarted() {
		return k;
	}
	static isInitialized() {
		return fe;
	}
	static coreLogFunction(e) {
		Live2DCubismCore.Logging.csmGetLogFunction() && Live2DCubismCore.Logging.csmGetLogFunction()(e);
	}
	static getLoggingLevel() {
		return pe == null ? M.LogLevel_Off : pe.loggingLevel;
	}
	static getIdManager() {
		return me;
	}
	constructor() {}
}, M;
(function(e) {
	e[e.LogLevel_Verbose = 0] = "LogLevel_Verbose", e[e.LogLevel_Debug = 1] = "LogLevel_Debug", e[e.LogLevel_Info = 2] = "LogLevel_Info", e[e.LogLevel_Warning = 3] = "LogLevel_Warning", e[e.LogLevel_Error = 4] = "LogLevel_Error", e[e.LogLevel_Off = 5] = "LogLevel_Off";
})(M ||= {});
var ge;
(function(e) {
	e.Constant = A, e.csmDelete = he, e.CubismFramework = j;
})(ge ||= {});
//#endregion
//#region vendor/compiled/Framework/src/effect/cubismbreath.js
var _e = class e {
	static create() {
		return new e();
	}
	static delete(e) {
		e != null && (e = null);
	}
	setParameters(e) {
		this._breathParameters = e;
	}
	getParameters() {
		return this._breathParameters;
	}
	updateParameters(e, t) {
		this._currentTime += t;
		let n = this._currentTime * 2 * Math.PI;
		for (let t = 0; t < this._breathParameters.length; ++t) {
			let r = this._breathParameters[t];
			e.addParameterValueById(r.parameterId, r.offset + r.peak * Math.sin(n / r.cycle), r.weight);
		}
	}
	constructor() {
		this._currentTime = 0;
	}
	_breathParameters;
	_currentTime;
}, ve = class {
	constructor(e, t, n, r, i) {
		this.parameterId = e ?? null, this.offset = t ?? 0, this.peak = n ?? 0, this.cycle = r ?? 0, this.weight = i ?? 0;
	}
	parameterId;
	offset;
	peak;
	cycle;
	weight;
}, ye;
(function(e) {
	e.BreathParameterData = ve, e.CubismBreath = _e;
})(ye ||= {});
//#endregion
//#region vendor/compiled/Framework/src/effect/cubismeyeblink.js
var be = class e {
	static create(t = null) {
		return new e(t);
	}
	static delete(e) {
		e != null && (e = null);
	}
	setBlinkingInterval(e) {
		this._blinkingIntervalSeconds = e;
	}
	setBlinkingSetting(e, t, n) {
		this._closingSeconds = e, this._closedSeconds = t, this._openingSeconds = n;
	}
	setParameterIds(e) {
		this._parameterIds = e;
	}
	getParameterIds() {
		return this._parameterIds;
	}
	updateParameters(t, n) {
		this._userTimeSeconds += n;
		let r, i = 0;
		switch (this._blinkingState) {
			case N.EyeState_Closing:
				i = (this._userTimeSeconds - this._stateStartTimeSeconds) / this._closingSeconds, i >= 1 && (i = 1, this._blinkingState = N.EyeState_Closed, this._stateStartTimeSeconds = this._userTimeSeconds), r = 1 - i;
				break;
			case N.EyeState_Closed:
				i = (this._userTimeSeconds - this._stateStartTimeSeconds) / this._closedSeconds, i >= 1 && (this._blinkingState = N.EyeState_Opening, this._stateStartTimeSeconds = this._userTimeSeconds), r = 0;
				break;
			case N.EyeState_Opening:
				i = (this._userTimeSeconds - this._stateStartTimeSeconds) / this._openingSeconds, i >= 1 && (i = 1, this._blinkingState = N.EyeState_Interval, this._nextBlinkingTime = this.determinNextBlinkingTiming()), r = i;
				break;
			case N.EyeState_Interval:
				this._nextBlinkingTime < this._userTimeSeconds && (this._blinkingState = N.EyeState_Closing, this._stateStartTimeSeconds = this._userTimeSeconds), r = 1;
				break;
			case N.EyeState_First:
			default:
				this._blinkingState = N.EyeState_Interval, this._nextBlinkingTime = this.determinNextBlinkingTiming(), r = 1;
				break;
		}
		e.CloseIfZero || (r = -r);
		for (let e = 0; e < this._parameterIds.length; ++e) t.setParameterValueById(this._parameterIds[e], r);
	}
	constructor(e) {
		if (this._blinkingState = N.EyeState_First, this._nextBlinkingTime = 0, this._stateStartTimeSeconds = 0, this._blinkingIntervalSeconds = 4, this._closingSeconds = .1, this._closedSeconds = .05, this._openingSeconds = .15, this._userTimeSeconds = 0, this._parameterIds = [], e != null) {
			this._parameterIds.length = e.getEyeBlinkParameterCount();
			for (let t = 0; t < e.getEyeBlinkParameterCount(); ++t) this._parameterIds[t] = e.getEyeBlinkParameterId(t);
		}
	}
	determinNextBlinkingTiming() {
		let e = Math.random();
		return this._userTimeSeconds + e * (2 * this._blinkingIntervalSeconds - 1);
	}
	_blinkingState;
	_parameterIds;
	_nextBlinkingTime;
	_stateStartTimeSeconds;
	_blinkingIntervalSeconds;
	_closingSeconds;
	_closedSeconds;
	_openingSeconds;
	_userTimeSeconds;
	static CloseIfZero = !0;
}, N;
(function(e) {
	e[e.EyeState_First = 0] = "EyeState_First", e[e.EyeState_Interval = 1] = "EyeState_Interval", e[e.EyeState_Closing = 2] = "EyeState_Closing", e[e.EyeState_Closed = 3] = "EyeState_Closed", e[e.EyeState_Opening = 4] = "EyeState_Opening";
})(N ||= {});
var xe;
(function(e) {
	e.CubismEyeBlink = be, e.EyeState = N;
})(xe ||= {});
//#endregion
//#region vendor/compiled/Framework/src/effect/cubismpose.js
var Se = .001, Ce = .5, we = "FadeInTime", Te = "Link", Ee = "Groups", De = "Id", Oe = class e {
	static create(t, n) {
		let r = D.create(t, n);
		if (!r) return null;
		let i = new e(), a = r.getRoot();
		a.getValueByString(we).isNull() || (i._fadeTimeSeconds = a.getValueByString(we).toFloat(Ce), i._fadeTimeSeconds < 0 && (i._fadeTimeSeconds = Ce));
		let o = a.getValueByString(Ee), s = o.getSize();
		i._partGroupCounts.length = s;
		for (let e = 0; e < s; ++e) {
			let t = o.getValueByIndex(e), n = t.getSize(), r = 0;
			for (let e = 0; e < n; ++e) {
				let n = t.getValueByIndex(e), a = new ke();
				if (a.partId = j.getIdManager().getId(n.getValueByString(De).getRawString()), !n.getValueByString(Te).isNull()) {
					let e = n.getValueByString(Te), t = e.getSize();
					for (let n = 0; n < t; ++n) {
						let t = new ke();
						t.partId = j.getIdManager().getId(e.getValueByIndex(n).getString()), a.link.push(t);
					}
				}
				i._partGroups.push(a.clone()), ++r;
			}
			i._partGroupCounts[e] = r;
		}
		return D.delete(r), i;
	}
	static delete(e) {
		e != null && (e = null);
	}
	updateParameters(e, t) {
		e != this._lastModel && this.reset(e), this._lastModel = e, t < 0 && (t = 0);
		let n = 0;
		for (let r = 0; r < this._partGroupCounts.length; r++) {
			let i = this._partGroupCounts[r];
			this.doFade(e, t, n, i), n += i;
		}
		this.copyPartOpacities(e);
	}
	reset(e) {
		let t = 0;
		for (let n = 0; n < this._partGroupCounts.length; ++n) {
			let r = this._partGroupCounts[n];
			for (let n = t; n < t + r; ++n) {
				this._partGroups[n].initialize(e);
				let r = this._partGroups[n].partIndex, i = this._partGroups[n].parameterIndex;
				if (!(r < 0)) {
					e.setPartOpacityByIndex(r, +(n == t)), e.setParameterValueByIndex(i, +(n == t));
					for (let t = 0; t < this._partGroups[n].link.length; ++t) this._partGroups[n].link[t].initialize(e);
				}
			}
			t += r;
		}
	}
	copyPartOpacities(e) {
		for (let t = 0; t < this._partGroups.length; ++t) {
			let n = this._partGroups[t];
			if (n.link.length == 0) continue;
			let r = this._partGroups[t].partIndex, i = e.getPartOpacityByIndex(r);
			for (let t = 0; t < n.link.length; ++t) {
				let r = n.link[t].partIndex;
				r < 0 || e.setPartOpacityByIndex(r, i);
			}
		}
	}
	doFade(e, t, n, r) {
		let i = -1, a = 1, o = .5, s = .15;
		for (let o = n; o < n + r; ++o) {
			let n = this._partGroups[o].partIndex, r = this._partGroups[o].parameterIndex;
			if (e.getParameterValueByIndex(r) > Se) {
				if (i >= 0) break;
				if (i = o, this._fadeTimeSeconds == 0) {
					a = 1;
					continue;
				}
				a = e.getPartOpacityByIndex(n), a += t / this._fadeTimeSeconds, a > 1 && (a = 1);
			}
		}
		i < 0 && (i = 0, a = 1);
		for (let t = n; t < n + r; ++t) {
			let n = this._partGroups[t].partIndex;
			if (i == t) e.setPartOpacityByIndex(n, a);
			else {
				let t = e.getPartOpacityByIndex(n), r;
				r = a < o ? a * (o - 1) / o + 1 : (1 - a) * o / (1 - o), (1 - r) * (1 - a) > s && (r = 1 - s / (1 - a)), t > r && (t = r), e.setPartOpacityByIndex(n, t);
			}
		}
	}
	constructor() {
		this._fadeTimeSeconds = Ce, this._lastModel = null, this._partGroups = [], this._partGroupCounts = [];
	}
	_partGroups;
	_partGroupCounts;
	_fadeTimeSeconds;
	_lastModel;
}, ke = class e {
	constructor(e) {
		if (this.parameterIndex = 0, this.partIndex = 0, this.link = [], e != null) {
			this.partId = e.partId, this.link.length = e.link.length;
			for (let t = 0; t < e.link.length; t++) this.link[t] = e.link[t].clone();
		}
	}
	assignment(e) {
		this.partId = e.partId;
		let t = this.link.length;
		this.link.length += e.link.length;
		for (let n of e.link) this.link[t++] = n.clone();
		return this;
	}
	initialize(e) {
		this.parameterIndex = e.getParameterIndex(this.partId), this.partIndex = e.getPartIndex(this.partId), e.setParameterValueByIndex(this.parameterIndex, 1);
	}
	clone() {
		let t = new e();
		t.partId = this.partId, t.parameterIndex = this.parameterIndex, t.partIndex = this.partIndex, t.link = [], t.link.length = this.link.length;
		for (let e = 0; e < this.link.length; e++) t.link[e] = this.link[e].clone();
		return t;
	}
	partId;
	parameterIndex;
	partIndex;
	link;
}, Ae;
(function(e) {
	e.CubismPose = Oe, e.PartData = ke;
})(Ae ||= {});
//#endregion
//#region vendor/compiled/Framework/src/math/cubismmodelmatrix.js
var je = class extends c {
	constructor(e, t) {
		super(), this._width = e === void 0 ? 0 : e, this._height = t === void 0 ? 0 : t, this.setHeight(2);
	}
	setWidth(e) {
		let t = e / this._width, n = t;
		this.scale(t, n);
	}
	setHeight(e) {
		let t = e / this._height, n = t;
		this.scale(t, n);
	}
	setPosition(e, t) {
		this.translate(e, t);
	}
	setCenterPosition(e, t) {
		this.centerX(e), this.centerY(t);
	}
	top(e) {
		this.setY(e);
	}
	bottom(e) {
		let t = this._height * this.getScaleY();
		this.translateY(e - t);
	}
	left(e) {
		this.setX(e);
	}
	right(e) {
		let t = this._width * this.getScaleX();
		this.translateX(e - t);
	}
	centerX(e) {
		let t = this._width * this.getScaleX();
		this.translateX(e - t / 2);
	}
	setX(e) {
		this.translateX(e);
	}
	centerY(e) {
		let t = this._height * this.getScaleY();
		this.translateY(e - t / 2);
	}
	setY(e) {
		this.translateY(e);
	}
	setupFromLayout(e) {
		for (let t of e) {
			let e = t[0], n = t[1];
			e == "width" ? this.setWidth(n) : e == "height" && this.setHeight(n);
		}
		for (let t of e) {
			let e = t[0], n = t[1];
			e == "x" ? this.setX(n) : e == "y" ? this.setY(n) : e == "center_x" ? this.centerX(n) : e == "center_y" ? this.centerY(n) : e == "top" ? this.top(n) : e == "bottom" ? this.bottom(n) : e == "left" ? this.left(n) : e == "right" && this.right(n);
		}
	}
	_width;
	_height;
}, Me;
(function(e) {
	e.CubismModelMatrix = je;
})(Me ||= {});
//#endregion
//#region vendor/compiled/Framework/src/math/cubismtargetpoint.js
var Ne = 30, Pe = .01, Fe = class {
	constructor() {
		this._faceTargetX = 0, this._faceTargetY = 0, this._faceX = 0, this._faceY = 0, this._faceVX = 0, this._faceVY = 0, this._lastTimeSeconds = 0, this._userTimeSeconds = 0;
	}
	update(e) {
		this._userTimeSeconds += e;
		let t = 40 / 10 * 1 / Ne;
		if (this._lastTimeSeconds == 0) {
			this._lastTimeSeconds = this._userTimeSeconds;
			return;
		}
		let n = (this._userTimeSeconds - this._lastTimeSeconds) * Ne;
		this._lastTimeSeconds = this._userTimeSeconds;
		let r = .15 * Ne, i = n * t / r, a = this._faceTargetX - this._faceX, s = this._faceTargetY - this._faceY;
		if (o.abs(a) <= Pe && o.abs(s) <= Pe) return;
		let c = o.sqrt(a * a + s * s), l = t * a / c, u = t * s / c, d = l - this._faceVX, f = u - this._faceVY, p = o.sqrt(d * d + f * f);
		(p < -i || p > i) && (d *= i / p, f *= i / p), this._faceVX += d, this._faceVY += f;
		{
			let e = .5 * (o.sqrt(i * i + 16 * i * c - 8 * i * c) - i), t = o.sqrt(this._faceVX * this._faceVX + this._faceVY * this._faceVY);
			t > e && (this._faceVX *= e / t, this._faceVY *= e / t);
		}
		this._faceX += this._faceVX, this._faceY += this._faceVY;
	}
	getX() {
		return this._faceX;
	}
	getY() {
		return this._faceY;
	}
	set(e, t) {
		this._faceTargetX = e, this._faceTargetY = t;
	}
	_faceTargetX;
	_faceTargetY;
	_faceX;
	_faceY;
	_faceVX;
	_faceVY;
	_lastTimeSeconds;
	_userTimeSeconds;
}, Ie;
(function(e) {
	e.CubismTargetPoint = Fe;
})(Ie ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/acubismmotion.js
var Le = class {
	static delete(e) {
		e.release(), e = null;
	}
	constructor() {
		this._fadeInSeconds = -1, this._fadeOutSeconds = -1, this._weight = 1, this._offsetSeconds = 0, this._isLoop = !1, this._isLoopFadeIn = !0, this._previousLoopState = this._isLoop, this._firedEventValues = [];
	}
	release() {
		this._weight = 0;
	}
	updateParameters(e, t, n) {
		if (!t.isAvailable() || t.isFinished()) return;
		this.setupMotionQueueEntry(t, n);
		let r = this.updateFadeWeight(t, n);
		this.doUpdateParameters(e, n, r, t), t.getEndTime() > 0 && t.getEndTime() < n && t.setIsFinished(!0);
	}
	setupMotionQueueEntry(e, t) {
		e == null || e.isStarted() || e.isAvailable() && (e.setIsStarted(!0), e.setStartTime(t - this._offsetSeconds), e.setFadeInStartTime(t), e.getEndTime() < 0 && this.adjustEndTime(e), e._motion._onBeganMotion && e._motion._onBeganMotion(e._motion));
	}
	updateFadeWeight(e, t) {
		e ?? y.print(M.LogLevel_Error, "motionQueueEntry is null.");
		let n = this._weight, r = this._fadeInSeconds == 0 ? 1 : o.getEasingSine((t - e.getFadeInStartTime()) / this._fadeInSeconds), i = this._fadeOutSeconds == 0 || e.getEndTime() < 0 ? 1 : o.getEasingSine((e.getEndTime() - t) / this._fadeOutSeconds);
		return n = n * r * i, e.setState(t, n), m(0 <= n && n <= 1), n;
	}
	setFadeInTime(e) {
		this._fadeInSeconds = e;
	}
	setFadeOutTime(e) {
		this._fadeOutSeconds = e;
	}
	getFadeOutTime() {
		return this._fadeOutSeconds;
	}
	getFadeInTime() {
		return this._fadeInSeconds;
	}
	setWeight(e) {
		this._weight = e;
	}
	getWeight() {
		return this._weight;
	}
	getDuration() {
		return -1;
	}
	getLoopDuration() {
		return -1;
	}
	setOffsetTime(e) {
		this._offsetSeconds = e;
	}
	setLoop(e) {
		this._isLoop = e;
	}
	getLoop() {
		return this._isLoop;
	}
	setLoopFadeIn(e) {
		this._isLoopFadeIn = e;
	}
	getLoopFadeIn() {
		return this._isLoopFadeIn;
	}
	getFiredEvent(e, t) {
		return this._firedEventValues;
	}
	setBeganMotionHandler = (e) => this._onBeganMotion = e;
	getBeganMotionHandler = () => this._onBeganMotion;
	setFinishedMotionHandler = (e) => this._onFinishedMotion = e;
	getFinishedMotionHandler = () => this._onFinishedMotion;
	isExistModelOpacity() {
		return !1;
	}
	getModelOpacityIndex() {
		return -1;
	}
	getModelOpacityId(e) {
		return null;
	}
	getModelOpacityValue() {
		return 1;
	}
	adjustEndTime(e) {
		let t = this.getDuration(), n = t <= 0 ? -1 : e.getStartTime() + t;
		e.setEndTime(n);
	}
	_fadeInSeconds;
	_fadeOutSeconds;
	_weight;
	_offsetSeconds;
	_isLoop;
	_isLoopFadeIn;
	_previousLoopState;
	_firedEventValues;
	_onBeganMotion;
	_onFinishedMotion;
}, Re;
(function(e) {
	e.ACubismMotion = Le;
})(Re ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/cubismexpressionmotion.js
var ze = "FadeInTime", Be = "FadeOutTime", Ve = "Parameters", He = "Id", Ue = "Value", We = "Blend", Ge = "Add", Ke = "Multiply", qe = "Overwrite", Je = 1, Ye = class e extends Le {
	static DefaultAdditiveValue = 0;
	static DefaultMultiplyValue = 1;
	static create(t, n) {
		let r = new e();
		return r.parse(t, n), r;
	}
	doUpdateParameters(e, t, n, r) {
		for (let t = 0; t < this._parameters.length; ++t) {
			let r = this._parameters[t];
			switch (r.blendType) {
				case P.Additive:
					e.addParameterValueById(r.parameterId, r.value, n);
					break;
				case P.Multiply:
					e.multiplyParameterValueById(r.parameterId, r.value, n);
					break;
				case P.Overwrite:
					e.setParameterValueById(r.parameterId, r.value, n);
					break;
				default: break;
			}
		}
	}
	calculateExpressionParameters(t, n, r, i, a, o) {
		if (!(r == null || i == null) && r.isAvailable()) for (let n = 0; n < i.length; ++n) {
			let r = i[n];
			if (r.parameterId == null) continue;
			let s = r.overwriteValue = t.getParameterValueById(r.parameterId), c = this.getExpressionParameters(), l = -1;
			for (let e = 0; e < c.length; ++e) if (r.parameterId == c[e].parameterId) {
				l = e;
				break;
			}
			if (l < 0) {
				a == 0 ? (r.additiveValue = e.DefaultAdditiveValue, r.multiplyValue = e.DefaultMultiplyValue, r.overwriteValue = s) : (r.additiveValue = this.calculateValue(r.additiveValue, e.DefaultAdditiveValue, o), r.multiplyValue = this.calculateValue(r.multiplyValue, e.DefaultMultiplyValue, o), r.overwriteValue = this.calculateValue(r.overwriteValue, s, o));
				continue;
			}
			let u = c[l].value, d, f, p;
			switch (c[l].blendType) {
				case P.Additive:
					d = u, f = e.DefaultMultiplyValue, p = s;
					break;
				case P.Multiply:
					d = e.DefaultAdditiveValue, f = u, p = s;
					break;
				case P.Overwrite:
					d = e.DefaultAdditiveValue, f = e.DefaultMultiplyValue, p = u;
					break;
				default: return;
			}
			a == 0 ? (r.additiveValue = d, r.multiplyValue = f, r.overwriteValue = p) : (r.additiveValue = r.additiveValue * (1 - o) + d * o, r.multiplyValue = r.multiplyValue * (1 - o) + f * o, r.overwriteValue = r.overwriteValue * (1 - o) + p * o);
		}
	}
	getExpressionParameters() {
		return this._parameters;
	}
	parse(e, t) {
		let n = D.create(e, t);
		if (!n) return;
		let r = n.getRoot();
		this.setFadeInTime(r.getValueByString(ze).toFloat(Je)), this.setFadeOutTime(r.getValueByString(Be).toFloat(Je));
		let i = r.getValueByString(Ve).getSize(), a = this._parameters.length;
		this._parameters.length += i;
		for (let e = 0; e < i; ++e) {
			let t = r.getValueByString(Ve).getValueByIndex(e), n = j.getIdManager().getId(t.getValueByString(He).getRawString()), i = t.getValueByString(Ue).toFloat(), o;
			o = t.getValueByString(We).isNull() || t.getValueByString(We).getString() == Ge ? P.Additive : t.getValueByString(We).getString() == Ke ? P.Multiply : t.getValueByString(We).getString() == qe ? P.Overwrite : P.Additive;
			let s = new Xe();
			s.parameterId = n, s.blendType = o, s.value = i, this._parameters[a++] = s;
		}
		D.delete(n);
	}
	calculateValue(e, t, n) {
		return e * (1 - n) + t * n;
	}
	constructor() {
		super(), this._parameters = [];
	}
	_parameters;
}, P;
(function(e) {
	e[e.Additive = 0] = "Additive", e[e.Multiply = 1] = "Multiply", e[e.Overwrite = 2] = "Overwrite";
})(P ||= {});
var Xe = class {
	parameterId;
	blendType;
	value;
}, Ze;
(function(e) {
	e.CubismExpressionMotion = Ye, e.ExpressionBlendType = P, e.ExpressionParameter = Xe;
})(Ze ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/cubismmotionqueueentry.js
var Qe = class {
	constructor() {
		this._autoDelete = !1, this._motion = null, this._available = !0, this._finished = !1, this._started = !1, this._startTimeSeconds = -1, this._fadeInStartTimeSeconds = 0, this._endTimeSeconds = -1, this._stateTimeSeconds = 0, this._stateWeight = 0, this._lastEventCheckSeconds = 0, this._motionQueueEntryHandle = this, this._fadeOutSeconds = 0, this._isTriggeredFadeOut = !1;
	}
	release() {
		this._autoDelete && this._motion && Le.delete(this._motion);
	}
	setFadeOut(e) {
		this._fadeOutSeconds = e, this._isTriggeredFadeOut = !0;
	}
	startFadeOut(e, t) {
		let n = t + e;
		this._isTriggeredFadeOut = !0, (this._endTimeSeconds < 0 || n < this._endTimeSeconds) && (this._endTimeSeconds = n);
	}
	isFinished() {
		return this._finished;
	}
	isStarted() {
		return this._started;
	}
	getStartTime() {
		return this._startTimeSeconds;
	}
	getFadeInStartTime() {
		return this._fadeInStartTimeSeconds;
	}
	getEndTime() {
		return this._endTimeSeconds;
	}
	setStartTime(e) {
		this._startTimeSeconds = e;
	}
	setFadeInStartTime(e) {
		this._fadeInStartTimeSeconds = e;
	}
	setEndTime(e) {
		this._endTimeSeconds = e;
	}
	setIsFinished(e) {
		this._finished = e;
	}
	setIsStarted(e) {
		this._started = e;
	}
	isAvailable() {
		return this._available;
	}
	setIsAvailable(e) {
		this._available = e;
	}
	setState(e, t) {
		this._stateTimeSeconds = e, this._stateWeight = t;
	}
	getStateTime() {
		return this._stateTimeSeconds;
	}
	getStateWeight() {
		return this._stateWeight;
	}
	getLastCheckEventSeconds() {
		return this._lastEventCheckSeconds;
	}
	setLastCheckEventSeconds(e) {
		this._lastEventCheckSeconds = e;
	}
	isTriggeredFadeOut() {
		return this._isTriggeredFadeOut;
	}
	getFadeOutSeconds() {
		return this._fadeOutSeconds;
	}
	getCubismMotion() {
		return this._motion;
	}
	_autoDelete;
	_motion;
	_available;
	_finished;
	_started;
	_startTimeSeconds;
	_fadeInStartTimeSeconds;
	_endTimeSeconds;
	_stateTimeSeconds;
	_stateWeight;
	_lastEventCheckSeconds;
	_fadeOutSeconds;
	_isTriggeredFadeOut;
	_motionQueueEntryHandle;
}, $e;
(function(e) {
	e.CubismMotionQueueEntry = Qe;
})($e ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/cubismmotionqueuemanager.js
var et = class {
	constructor() {
		this._userTimeSeconds = 0, this._eventCallBack = null, this._eventCustomData = null, this._motions = [];
	}
	release() {
		for (let e = 0; e < this._motions.length; ++e) this._motions[e] && (this._motions[e].release(), this._motions[e] = null);
		this._motions = null;
	}
	startMotion(e, t, n) {
		if (e == null) return -1;
		let r = null;
		for (let e = 0; e < this._motions.length; ++e) r = this._motions[e], r?.setFadeOut(r._motion.getFadeOutTime());
		return r = new Qe(), r._autoDelete = t, r._motion = e, this._motions.push(r), r._motionQueueEntryHandle;
	}
	isFinished() {
		for (let e = 0; e < this._motions.length;) {
			let t = this._motions[e];
			if (t == null) {
				this._motions.splice(e, 1);
				continue;
			}
			if (t._motion == null) {
				t.release(), t = null, this._motions.splice(e, 1);
				continue;
			}
			if (t.isFinished()) e++;
			else return !1;
		}
		return !0;
	}
	isFinishedByHandle(e) {
		for (let t = 0; t < this._motions.length; t++) {
			let n = this._motions[t];
			if (n != null && n._motionQueueEntryHandle == e && !n.isFinished()) return !1;
		}
		return !0;
	}
	stopAllMotions() {
		for (let e = 0; e < this._motions.length; e++) {
			let t = this._motions[e];
			if (t == null) {
				this._motions.splice(e, 1);
				continue;
			}
			t.release(), this._motions.splice(e, 1);
		}
	}
	getCubismMotionQueueEntries() {
		return this._motions;
	}
	getCubismMotionQueueEntry(e) {
		for (let t = 0; t < this._motions.length; t++) {
			let n = this._motions[t];
			if (n != null && n._motionQueueEntryHandle == e) return n;
		}
		return null;
	}
	setEventCallback(e, t = null) {
		this._eventCallBack = e, this._eventCustomData = t;
	}
	doUpdateMotion(e, t) {
		let n = !1;
		for (let r = 0; r < this._motions.length;) {
			let i = this._motions[r];
			if (i == null) {
				this._motions.splice(r, 1);
				continue;
			}
			let a = i._motion;
			if (a == null) {
				i.release(), i = null, this._motions.splice(r, 1);
				continue;
			}
			a.updateParameters(e, i, t), n = !0;
			let o = a.getFiredEvent(i.getLastCheckEventSeconds() - i.getStartTime(), t - i.getStartTime());
			for (let e = 0; e < o.length; ++e) this._eventCallBack(this, o[e], this._eventCustomData);
			i.setLastCheckEventSeconds(t), i.isFinished() ? (i.release(), i = null, this._motions.splice(r, 1)) : (i.isTriggeredFadeOut() && i.startFadeOut(i.getFadeOutSeconds(), t), r++);
		}
		return n;
	}
	_userTimeSeconds;
	_motions;
	_eventCallBack;
	_eventCustomData;
}, tt;
(function(e) {
	e.CubismMotionQueueManager = et, e.InvalidMotionQueueEntryHandleValue = -1;
})(tt ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/cubismexpressionmotionmanager.js
var nt = class {
	parameterId;
	additiveValue;
	multiplyValue;
	overwriteValue;
}, rt = class extends et {
	constructor() {
		super(), this._expressionParameterValues = [], this._fadeWeights = [];
	}
	release() {
		this._expressionParameterValues &&= (he(this._expressionParameterValues), null), this._fadeWeights &&= (he(this._fadeWeights), null);
	}
	getFadeWeight(e) {
		return e < 0 || this._fadeWeights.length < 1 || e >= this._fadeWeights.length ? (console.warn("Failed to get the fade weight value. The element at that index does not exist."), -1) : this._fadeWeights[e];
	}
	setFadeWeight(e, t) {
		if (e < 0 || this._fadeWeights.length < 1 || this._fadeWeights.length <= e) {
			console.warn("Failed to set the fade weight value. The element at that index does not exist.");
			return;
		}
		this._fadeWeights[e] = t;
	}
	updateMotion(e, t) {
		this._userTimeSeconds += t;
		let n = !1, r = this.getCubismMotionQueueEntries(), i = 0, a = 0;
		if (this._fadeWeights.length !== r.length) {
			let e = r.length - this._fadeWeights.length, t = this._fadeWeights.length;
			this._fadeWeights.length += e;
			for (let n = 0; n < e; n++) this._fadeWeights[t++] = 0;
		}
		for (let t = 0; t < this._motions.length;) {
			let s = this._motions[t];
			if (s == null) {
				r.splice(t, 1);
				continue;
			}
			let c = s.getCubismMotion();
			if (c == null) {
				he(s), r.splice(t, 1);
				continue;
			}
			let l = c.getExpressionParameters();
			if (s.isAvailable()) for (let t = 0; t < l.length; ++t) {
				if (l[t].parameterId == null) continue;
				let n = -1;
				for (let e = 0; e < this._expressionParameterValues.length; ++e) if (this._expressionParameterValues[e].parameterId == l[t].parameterId) {
					n = e;
					break;
				}
				if (n >= 0) continue;
				let r = new nt();
				r.parameterId = l[t].parameterId, r.additiveValue = Ye.DefaultAdditiveValue, r.multiplyValue = Ye.DefaultMultiplyValue, r.overwriteValue = e.getParameterValueById(r.parameterId), this._expressionParameterValues.push(r);
			}
			c.setupMotionQueueEntry(s, this._userTimeSeconds), this.setFadeWeight(a, c.updateFadeWeight(s, this._userTimeSeconds)), c.calculateExpressionParameters(e, this._userTimeSeconds, s, this._expressionParameterValues, a, this.getFadeWeight(a)), i += c.getFadeInTime() == 0 ? 1 : o.getEasingSine((this._userTimeSeconds - s.getFadeInStartTime()) / c.getFadeInTime()), n = !0, s.isTriggeredFadeOut() && s.startFadeOut(s.getFadeOutSeconds(), this._userTimeSeconds), ++t, ++a;
		}
		if (r.length > 1 && this.getFadeWeight(this._fadeWeights.length - 1) >= 1) for (let e = r.length - 2; e >= 0; --e) {
			let t = r[e];
			he(t), r.splice(e, 1), this._fadeWeights.splice(e, 1);
		}
		i > 1 && (i = 1);
		for (let t = 0; t < this._expressionParameterValues.length; ++t) {
			let n = this._expressionParameterValues[t];
			e.setParameterValueById(n.parameterId, (n.overwriteValue + n.additiveValue) * n.multiplyValue, i), n.additiveValue = Ye.DefaultAdditiveValue, n.multiplyValue = Ye.DefaultMultiplyValue;
		}
		return n;
	}
	_expressionParameterValues;
	_fadeWeights;
	_startExpressionTime;
}, it;
(function(e) {
	e.CubismExpressionMotionManager = rt;
})(it ||= {});
//#endregion
//#region vendor/compiled/Framework/src/utils/cubismarrayutils.js
function F(e, t, n = null, r = null) {
	if (e.length < t) if (r) for (let r = e.length; r < t; r++) typeof n == "function" ? e[r] = JSON.parse(JSON.stringify(new n())) : e[r] = n;
	else for (let r = e.length; r < t; r++) e[r] = n;
	else e.length = t;
}
//#endregion
//#region vendor/compiled/Framework/src/motion/cubismmotioninternal.js
var I;
(function(e) {
	e[e.CubismMotionCurveTarget_Model = 0] = "CubismMotionCurveTarget_Model", e[e.CubismMotionCurveTarget_Parameter = 1] = "CubismMotionCurveTarget_Parameter", e[e.CubismMotionCurveTarget_PartOpacity = 2] = "CubismMotionCurveTarget_PartOpacity";
})(I ||= {});
var L;
(function(e) {
	e[e.CubismMotionSegmentType_Linear = 0] = "CubismMotionSegmentType_Linear", e[e.CubismMotionSegmentType_Bezier = 1] = "CubismMotionSegmentType_Bezier", e[e.CubismMotionSegmentType_Stepped = 2] = "CubismMotionSegmentType_Stepped", e[e.CubismMotionSegmentType_InverseStepped = 3] = "CubismMotionSegmentType_InverseStepped";
})(L ||= {});
var at = class {
	time = 0;
	value = 0;
}, ot = class {
	constructor() {
		this.evaluate = null, this.basePointIndex = 0, this.segmentType = 0;
	}
	evaluate;
	basePointIndex;
	segmentType;
}, st = class {
	constructor() {
		this.type = I.CubismMotionCurveTarget_Model, this.segmentCount = 0, this.baseSegmentIndex = 0, this.fadeInTime = 0, this.fadeOutTime = 0;
	}
	type;
	id;
	segmentCount;
	baseSegmentIndex;
	fadeInTime;
	fadeOutTime;
}, ct = class {
	fireTime = 0;
	value;
}, lt = class {
	constructor() {
		this.duration = 0, this.loop = !1, this.curveCount = 0, this.eventCount = 0, this.fps = 0, this.curves = [], this.segments = [], this.points = [], this.events = [];
	}
	duration;
	loop;
	curveCount;
	eventCount;
	fps;
	curves;
	segments;
	points;
	events;
}, ut;
(function(e) {
	e.CubismMotionCurve = st, e.CubismMotionCurveTarget = I, e.CubismMotionData = lt, e.CubismMotionEvent = ct, e.CubismMotionPoint = at, e.CubismMotionSegment = ot, e.CubismMotionSegmentType = L;
})(ut ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/cubismmotionjson.js
var R = "Meta", dt = "Duration", ft = "Loop", pt = "AreBeziersRestricted", mt = "CurveCount", ht = "Fps", gt = "TotalSegmentCount", _t = "TotalPointCount", z = "Curves", vt = "Target", yt = "Id", bt = "FadeInTime", xt = "FadeOutTime", St = "Segments", Ct = "UserData", wt = "UserDataCount", Tt = "TotalUserDataSize", Et = "Time", Dt = "Value", Ot = class {
	constructor(e, t) {
		this._json = D.create(e, t);
	}
	release() {
		D.delete(this._json);
	}
	getMotionDuration() {
		return this._json.getRoot().getValueByString(R).getValueByString(dt).toFloat();
	}
	isMotionLoop() {
		return this._json.getRoot().getValueByString(R).getValueByString(ft).toBoolean();
	}
	hasConsistency() {
		let e = !0;
		if (!this._json || !this._json.getRoot()) return !1;
		let t = this._json.getRoot().getValueByString(z).getVector().length, n = 0, r = 0;
		for (let e = 0; e < t; ++e) for (let t = 0; t < this.getMotionCurveSegmentCount(e);) {
			switch (t == 0 && (r += 1, t += 2), this.getMotionCurveSegment(e, t)) {
				case L.CubismMotionSegmentType_Linear:
					r += 1, t += 3;
					break;
				case L.CubismMotionSegmentType_Bezier:
					r += 3, t += 7;
					break;
				case L.CubismMotionSegmentType_Stepped:
					r += 1, t += 3;
					break;
				case L.CubismMotionSegmentType_InverseStepped:
					r += 1, t += 3;
					break;
				default:
					m(0);
					break;
			}
			++n;
		}
		return t != this.getMotionCurveCount() && (_("The number of curves does not match the metadata."), e = !1), n != this.getMotionTotalSegmentCount() && (_("The number of segment does not match the metadata."), e = !1), r != this.getMotionTotalPointCount() && (_("The number of point does not match the metadata."), e = !1), e;
	}
	getEvaluationOptionFlag(e) {
		return kt.EvaluationOptionFlag_AreBeziersRistricted == e && this._json.getRoot().getValueByString(R).getValueByString(pt).toBoolean();
	}
	getMotionCurveCount() {
		return this._json.getRoot().getValueByString(R).getValueByString(mt).toInt();
	}
	getMotionFps() {
		return this._json.getRoot().getValueByString(R).getValueByString(ht).toFloat();
	}
	getMotionTotalSegmentCount() {
		return this._json.getRoot().getValueByString(R).getValueByString(gt).toInt();
	}
	getMotionTotalPointCount() {
		return this._json.getRoot().getValueByString(R).getValueByString(_t).toInt();
	}
	isExistMotionFadeInTime() {
		return !this._json.getRoot().getValueByString(R).getValueByString(bt).isNull();
	}
	isExistMotionFadeOutTime() {
		return !this._json.getRoot().getValueByString(R).getValueByString(xt).isNull();
	}
	getMotionFadeInTime() {
		return this._json.getRoot().getValueByString(R).getValueByString(bt).toFloat();
	}
	getMotionFadeOutTime() {
		return this._json.getRoot().getValueByString(R).getValueByString(xt).toFloat();
	}
	getMotionCurveTarget(e) {
		return this._json.getRoot().getValueByString(z).getValueByIndex(e).getValueByString(vt).getRawString();
	}
	getMotionCurveId(e) {
		return j.getIdManager().getId(this._json.getRoot().getValueByString(z).getValueByIndex(e).getValueByString(yt).getRawString());
	}
	isExistMotionCurveFadeInTime(e) {
		return !this._json.getRoot().getValueByString(z).getValueByIndex(e).getValueByString(bt).isNull();
	}
	isExistMotionCurveFadeOutTime(e) {
		return !this._json.getRoot().getValueByString(z).getValueByIndex(e).getValueByString(xt).isNull();
	}
	getMotionCurveFadeInTime(e) {
		return this._json.getRoot().getValueByString(z).getValueByIndex(e).getValueByString(bt).toFloat();
	}
	getMotionCurveFadeOutTime(e) {
		return this._json.getRoot().getValueByString(z).getValueByIndex(e).getValueByString(xt).toFloat();
	}
	getMotionCurveSegmentCount(e) {
		return this._json.getRoot().getValueByString(z).getValueByIndex(e).getValueByString(St).getVector().length;
	}
	getMotionCurveSegment(e, t) {
		return this._json.getRoot().getValueByString(z).getValueByIndex(e).getValueByString(St).getValueByIndex(t).toFloat();
	}
	getEventCount() {
		return this._json.getRoot().getValueByString(R).getValueByString(wt).toInt();
	}
	getTotalEventValueSize() {
		return this._json.getRoot().getValueByString(R).getValueByString(Tt).toInt();
	}
	getEventTime(e) {
		return this._json.getRoot().getValueByString(Ct).getValueByIndex(e).getValueByString(Et).toFloat();
	}
	getEventValue(e) {
		return this._json.getRoot().getValueByString(Ct).getValueByIndex(e).getValueByString(Dt).getRawString();
	}
	_json;
}, kt;
(function(e) {
	e[e.EvaluationOptionFlag_AreBeziersRistricted = 0] = "EvaluationOptionFlag_AreBeziersRistricted";
})(kt ||= {});
var At;
(function(e) {
	e.CubismMotionJson = Ot;
})(At ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/cubismmotion.js
var jt = "EyeBlink", Mt = "LipSync", Nt = "Model", Pt = "Parameter", Ft = "PartOpacity", It = "Opacity";
function B(e, t, n) {
	let r = new at();
	return r.time = e.time + (t.time - e.time) * n, r.value = e.value + (t.value - e.value) * n, r;
}
function Lt(e, t) {
	let n = (t - e[0].time) / (e[1].time - e[0].time);
	return n < 0 && (n = 0), e[0].value + (e[1].value - e[0].value) * n;
}
function Rt(e, t) {
	let n = (t - e[0].time) / (e[3].time - e[0].time);
	n < 0 && (n = 0);
	let r = B(e[0], e[1], n), i = B(e[1], e[2], n), a = B(e[2], e[3], n);
	return B(B(r, i, n), B(i, a, n), n).value;
}
function zt(e, t) {
	let n = t, r = e[0].time, i = e[3].time, a = e[1].time, s = e[2].time, c = i - 3 * s + 3 * a - r, l = 3 * s - 6 * a + 3 * r, u = 3 * a - 3 * r, d = r - n, f = o.cardanoAlgorithmForBezier(c, l, u, d), p = B(e[0], e[1], f), m = B(e[1], e[2], f), h = B(e[2], e[3], f);
	return B(B(p, m, f), B(m, h, f), f).value;
}
function Bt(e, t) {
	return e[0].value;
}
function Vt(e, t) {
	return e[1].value;
}
function Ht(e, t, n, r, i) {
	let a = e.curves[t], o = -1, s = a.baseSegmentIndex + a.segmentCount, c = 0;
	for (let t = a.baseSegmentIndex; t < s; ++t) if (c = e.segments[t].basePointIndex + (e.segments[t].segmentType == L.CubismMotionSegmentType_Bezier ? 3 : 1), e.points[c].time > n) {
		o = t;
		break;
	}
	if (o == -1) return r && n < i ? Ut(e, s - 1, e.segments[a.baseSegmentIndex].basePointIndex, c, n, i) : e.points[c].value;
	let l = e.segments[o];
	return l.evaluate(e.points.slice(l.basePointIndex), n);
}
function Ut(e, t, n, r, i, a) {
	let o = [new at(), new at()];
	{
		let t = e.points[r];
		o[0].time = t.time, o[0].value = t.value;
	}
	{
		let t = e.points[n];
		o[1].time = a, o[1].value = t.value;
	}
	switch (e.segments[t].segmentType) {
		case L.CubismMotionSegmentType_Linear:
		case L.CubismMotionSegmentType_Bezier:
		default: return Lt(o, i);
		case L.CubismMotionSegmentType_Stepped: return Bt(o, i);
		case L.CubismMotionSegmentType_InverseStepped: return Vt(o, i);
	}
}
var V;
(function(e) {
	e[e.MotionBehavior_V1 = 0] = "MotionBehavior_V1", e[e.MotionBehavior_V2 = 1] = "MotionBehavior_V2";
})(V ||= {});
var Wt = class e extends Le {
	static create(t, n, r, i, a = !1) {
		let o = new e();
		if (o.parse(t, n, a), o._motionData) o._sourceFrameRate = o._motionData.fps, o._loopDurationSeconds = o._motionData.duration, o._onFinishedMotion = r, o._onBeganMotion = i;
		else return he(o), null;
		return o;
	}
	doUpdateParameters(e, t, n, r) {
		this._modelCurveIdEyeBlink ??= j.getIdManager().getId(jt), this._modelCurveIdLipSync ??= j.getIdManager().getId(Mt), this._modelCurveIdOpacity ??= j.getIdManager().getId(It), this._motionBehavior === V.MotionBehavior_V2 && this._previousLoopState !== this._isLoop && (this.adjustEndTime(r), this._previousLoopState = this._isLoop);
		let i = t - r.getStartTime();
		i < 0 && (i = 0);
		let a = Number.MAX_VALUE, s = Number.MAX_VALUE, c = 0, l = 0;
		this._eyeBlinkParameterIds.length > 64 && h("too many eye blink targets : {0}", this._eyeBlinkParameterIds.length), this._lipSyncParameterIds.length > 64 && h("too many lip sync targets : {0}", this._lipSyncParameterIds.length);
		let u = this._fadeInSeconds <= 0 ? 1 : o.getEasingSine((t - r.getFadeInStartTime()) / this._fadeInSeconds), d = this._fadeOutSeconds <= 0 || r.getEndTime() < 0 ? 1 : o.getEasingSine((r.getEndTime() - t) / this._fadeOutSeconds), f, p, m, g = i, _ = this._motionData.duration, v = this._motionBehavior === V.MotionBehavior_V2 && this._isLoop;
		if (this._isLoop) for (this._motionBehavior === V.MotionBehavior_V2 && (_ += 1 / this._motionData.fps); g > _;) g -= _;
		let y = this._motionData.curves;
		for (p = 0; p < this._motionData.curveCount && y[p].type == I.CubismMotionCurveTarget_Model; ++p) f = Ht(this._motionData, p, g, v, _), y[p].id == this._modelCurveIdEyeBlink ? s = f : y[p].id == this._modelCurveIdLipSync ? a = f : y[p].id == this._modelCurveIdOpacity && (this._modelOpacity = f, e.setModelOapcity(this.getModelOpacityValue()));
		let b = 0;
		for (; p < this._motionData.curveCount && y[p].type == I.CubismMotionCurveTarget_Parameter; ++p) {
			if (b++, m = e.getParameterIndex(y[p].id), m == -1) continue;
			let i = e.getParameterValueByIndex(m);
			if (f = Ht(this._motionData, p, g, v, _), s != Number.MAX_VALUE) {
				for (let e = 0; e < this._eyeBlinkParameterIds.length && e < 64; ++e) if (this._eyeBlinkParameterIds[e] == y[p].id) {
					f *= s, l |= 1 << e;
					break;
				}
			}
			if (a != Number.MAX_VALUE) {
				for (let e = 0; e < this._lipSyncParameterIds.length && e < 64; ++e) if (this._lipSyncParameterIds[e] == y[p].id) {
					f += a, c |= 1 << e;
					break;
				}
			}
			e.isRepeat(m) && (f = e.getParameterRepeatValue(m, f));
			let h;
			if (y[p].fadeInTime < 0 && y[p].fadeOutTime < 0) h = i + (f - i) * n;
			else {
				let e, n;
				e = y[p].fadeInTime < 0 ? u : y[p].fadeInTime == 0 ? 1 : o.getEasingSine((t - r.getFadeInStartTime()) / y[p].fadeInTime), n = y[p].fadeOutTime < 0 ? d : y[p].fadeOutTime == 0 || r.getEndTime() < 0 ? 1 : o.getEasingSine((r.getEndTime() - t) / y[p].fadeOutTime);
				let a = this._weight * e * n;
				h = i + (f - i) * a;
			}
			e.setParameterValueByIndex(m, h, 1);
		}
		if (s != Number.MAX_VALUE) for (let t = 0; t < this._eyeBlinkParameterIds.length && t < 64; ++t) {
			let r = e.getParameterValueById(this._eyeBlinkParameterIds[t]);
			if (l >> t & 1) continue;
			let i = r + (s - r) * n;
			e.setParameterValueById(this._eyeBlinkParameterIds[t], i);
		}
		if (a != Number.MAX_VALUE) for (let t = 0; t < this._lipSyncParameterIds.length && t < 64; ++t) {
			let r = e.getParameterValueById(this._lipSyncParameterIds[t]);
			if (c >> t & 1) continue;
			let i = r + (a - r) * n;
			e.setParameterValueById(this._lipSyncParameterIds[t], i);
		}
		for (; p < this._motionData.curveCount && y[p].type == I.CubismMotionCurveTarget_PartOpacity; ++p) m = e.getParameterIndex(y[p].id), m != -1 && (f = Ht(this._motionData, p, g, v, _), e.setParameterValueByIndex(m, f));
		i >= _ && (this._isLoop ? this.updateForNextLoop(r, t, g) : (this._onFinishedMotion && this._onFinishedMotion(this), r.setIsFinished(!0))), this._lastWeight = n;
	}
	setMotionBehavior(e) {
		this._motionBehavior = e;
	}
	getMotionBehavior() {
		return this._motionBehavior;
	}
	getDuration() {
		return this._isLoop ? -1 : this._loopDurationSeconds;
	}
	getLoopDuration() {
		return this._loopDurationSeconds;
	}
	setParameterFadeInTime(e, t) {
		let n = this._motionData.curves;
		for (let r = 0; r < this._motionData.curveCount; ++r) if (e == n[r].id) {
			n[r].fadeInTime = t;
			return;
		}
	}
	setParameterFadeOutTime(e, t) {
		let n = this._motionData.curves;
		for (let r = 0; r < this._motionData.curveCount; ++r) if (e == n[r].id) {
			n[r].fadeOutTime = t;
			return;
		}
	}
	getParameterFadeInTime(e) {
		let t = this._motionData.curves;
		for (let n = 0; n < this._motionData.curveCount; ++n) if (e == t[n].id) return t[n].fadeInTime;
		return -1;
	}
	getParameterFadeOutTime(e) {
		let t = this._motionData.curves;
		for (let n = 0; n < this._motionData.curveCount; ++n) if (e == t[n].id) return t[n].fadeOutTime;
		return -1;
	}
	setEffectIds(e, t) {
		this._eyeBlinkParameterIds = e, this._lipSyncParameterIds = t;
	}
	constructor() {
		super(), this._sourceFrameRate = 30, this._loopDurationSeconds = -1, this._isLoop = !1, this._isLoopFadeIn = !0, this._lastWeight = 0, this._motionData = null, this._modelCurveIdEyeBlink = null, this._modelCurveIdLipSync = null, this._modelCurveIdOpacity = null, this._eyeBlinkParameterIds = null, this._lipSyncParameterIds = null, this._modelOpacity = 1, this._debugMode = !1;
	}
	release() {
		this._motionData = void 0, this._motionData = null;
	}
	updateForNextLoop(e, t, n) {
		switch (this._motionBehavior) {
			case V.MotionBehavior_V2:
			default:
				e.setStartTime(t - n), this._isLoopFadeIn && e.setFadeInStartTime(t - n), this._onFinishedMotion != null && this._onFinishedMotion(this);
				break;
			case V.MotionBehavior_V1:
				e.setStartTime(t), this._isLoopFadeIn && e.setFadeInStartTime(t);
				break;
		}
	}
	parse(e, t, n = !1) {
		let r = new Ot(e, t);
		if (!r) {
			r.release(), r = void 0;
			return;
		}
		if (n && !r.hasConsistency()) {
			r.release(), v("Inconsistent motion3.json.");
			return;
		}
		this._motionData = new lt(), this._motionData.duration = r.getMotionDuration(), this._motionData.loop = r.isMotionLoop(), this._motionData.curveCount = r.getMotionCurveCount(), this._motionData.fps = r.getMotionFps(), this._motionData.eventCount = r.getEventCount();
		let i = r.getEvaluationOptionFlag(kt.EvaluationOptionFlag_AreBeziersRistricted);
		r.isExistMotionFadeInTime() ? this._fadeInSeconds = r.getMotionFadeInTime() < 0 ? 1 : r.getMotionFadeInTime() : this._fadeInSeconds = 1, r.isExistMotionFadeOutTime() ? this._fadeOutSeconds = r.getMotionFadeOutTime() < 0 ? 1 : r.getMotionFadeOutTime() : this._fadeOutSeconds = 1, F(this._motionData.curves, this._motionData.curveCount, st, !0), F(this._motionData.segments, r.getMotionTotalSegmentCount(), ot, !0), F(this._motionData.points, r.getMotionTotalPointCount(), at, !0), F(this._motionData.events, this._motionData.eventCount, ct, !0);
		let a = 0, o = 0;
		for (let e = 0; e < this._motionData.curveCount; ++e) {
			r.getMotionCurveTarget(e) == Nt ? this._motionData.curves[e].type = I.CubismMotionCurveTarget_Model : r.getMotionCurveTarget(e) == Pt ? this._motionData.curves[e].type = I.CubismMotionCurveTarget_Parameter : r.getMotionCurveTarget(e) == Ft ? this._motionData.curves[e].type = I.CubismMotionCurveTarget_PartOpacity : _("Warning : Unable to get segment type from Curve! The number of \"CurveCount\" may be incorrect!"), this._motionData.curves[e].id = r.getMotionCurveId(e), this._motionData.curves[e].baseSegmentIndex = o, this._motionData.curves[e].fadeInTime = r.isExistMotionCurveFadeInTime(e) ? r.getMotionCurveFadeInTime(e) : -1, this._motionData.curves[e].fadeOutTime = r.isExistMotionCurveFadeOutTime(e) ? r.getMotionCurveFadeOutTime(e) : -1;
			for (let t = 0; t < r.getMotionCurveSegmentCount(e);) {
				switch (t == 0 ? (this._motionData.segments[o].basePointIndex = a, this._motionData.points[a].time = r.getMotionCurveSegment(e, t), this._motionData.points[a].value = r.getMotionCurveSegment(e, t + 1), a += 1, t += 2) : this._motionData.segments[o].basePointIndex = a - 1, r.getMotionCurveSegment(e, t)) {
					case L.CubismMotionSegmentType_Linear:
						this._motionData.segments[o].segmentType = L.CubismMotionSegmentType_Linear, this._motionData.segments[o].evaluate = Lt, this._motionData.points[a].time = r.getMotionCurveSegment(e, t + 1), this._motionData.points[a].value = r.getMotionCurveSegment(e, t + 2), a += 1, t += 3;
						break;
					case L.CubismMotionSegmentType_Bezier:
						this._motionData.segments[o].segmentType = L.CubismMotionSegmentType_Bezier, i ? this._motionData.segments[o].evaluate = Rt : this._motionData.segments[o].evaluate = zt, this._motionData.points[a].time = r.getMotionCurveSegment(e, t + 1), this._motionData.points[a].value = r.getMotionCurveSegment(e, t + 2), this._motionData.points[a + 1].time = r.getMotionCurveSegment(e, t + 3), this._motionData.points[a + 1].value = r.getMotionCurveSegment(e, t + 4), this._motionData.points[a + 2].time = r.getMotionCurveSegment(e, t + 5), this._motionData.points[a + 2].value = r.getMotionCurveSegment(e, t + 6), a += 3, t += 7;
						break;
					case L.CubismMotionSegmentType_Stepped:
						this._motionData.segments[o].segmentType = L.CubismMotionSegmentType_Stepped, this._motionData.segments[o].evaluate = Bt, this._motionData.points[a].time = r.getMotionCurveSegment(e, t + 1), this._motionData.points[a].value = r.getMotionCurveSegment(e, t + 2), a += 1, t += 3;
						break;
					case L.CubismMotionSegmentType_InverseStepped:
						this._motionData.segments[o].segmentType = L.CubismMotionSegmentType_InverseStepped, this._motionData.segments[o].evaluate = Vt, this._motionData.points[a].time = r.getMotionCurveSegment(e, t + 1), this._motionData.points[a].value = r.getMotionCurveSegment(e, t + 2), a += 1, t += 3;
						break;
					default:
						m(0);
						break;
				}
				++this._motionData.curves[e].segmentCount, ++o;
			}
		}
		for (let e = 0; e < r.getEventCount(); ++e) this._motionData.events[e].fireTime = r.getEventTime(e), this._motionData.events[e].value = r.getEventValue(e);
		r.release(), r = void 0, r = null;
	}
	getFiredEvent(e, t) {
		F(this._firedEventValues, 0);
		for (let n = 0; n < this._motionData.eventCount; ++n) this._motionData.events[n].fireTime > e && this._motionData.events[n].fireTime <= t && this._firedEventValues.push(this._motionData.events[n].value);
		return this._firedEventValues;
	}
	isExistModelOpacity() {
		for (let e = 0; e < this._motionData.curveCount; e++) {
			let t = this._motionData.curves[e];
			if (t.type == I.CubismMotionCurveTarget_Model && t.id.getString().localeCompare(It) == 0) return !0;
		}
		return !1;
	}
	getModelOpacityIndex() {
		if (this.isExistModelOpacity()) for (let e = 0; e < this._motionData.curveCount; e++) {
			let t = this._motionData.curves[e];
			if (t.type == I.CubismMotionCurveTarget_Model && t.id.getString().localeCompare(It) == 0) return e;
		}
		return -1;
	}
	getModelOpacityId(e) {
		if (e != -1) {
			let t = this._motionData.curves[e];
			if (t.type == I.CubismMotionCurveTarget_Model && t.id.getString().localeCompare(It) == 0) return j.getIdManager().getId(t.id.getString());
		}
		return null;
	}
	getModelOpacityValue() {
		return this._modelOpacity;
	}
	setDebugMode(e) {
		this._debugMode = e;
	}
	_sourceFrameRate;
	_loopDurationSeconds;
	_motionBehavior = V.MotionBehavior_V2;
	_lastWeight;
	_motionData;
	_eyeBlinkParameterIds;
	_lipSyncParameterIds;
	_modelCurveIdEyeBlink;
	_modelCurveIdLipSync;
	_modelCurveIdOpacity;
	_modelOpacity;
	_debugMode;
}, Gt;
(function(e) {
	e.CubismMotion = Wt;
})(Gt ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/cubismmotionmanager.js
var Kt = class extends et {
	constructor() {
		super(), this._currentPriority = 0, this._reservePriority = 0;
	}
	getCurrentPriority() {
		return this._currentPriority;
	}
	getReservePriority() {
		return this._reservePriority;
	}
	setReservePriority(e) {
		this._reservePriority = e;
	}
	startMotionPriority(e, t, n) {
		return n == this._reservePriority && (this._reservePriority = 0), this._currentPriority = n, super.startMotion(e, t);
	}
	updateMotion(e, t) {
		this._userTimeSeconds += t;
		let n = super.doUpdateMotion(e, this._userTimeSeconds);
		return this.isFinished() && (this._currentPriority = 0), n;
	}
	reserveMotion(e) {
		return e <= this._reservePriority || e <= this._currentPriority ? !1 : (this._reservePriority = e, !0);
	}
	_currentPriority;
	_reservePriority;
}, qt;
(function(e) {
	e.CubismMotionManager = Kt;
})(qt ||= {});
//#endregion
//#region vendor/compiled/Framework/src/physics/cubismphysicsinternal.js
var Jt;
(function(e) {
	e[e.CubismPhysicsTargetType_Parameter = 0] = "CubismPhysicsTargetType_Parameter";
})(Jt ||= {});
var H;
(function(e) {
	e[e.CubismPhysicsSource_X = 0] = "CubismPhysicsSource_X", e[e.CubismPhysicsSource_Y = 1] = "CubismPhysicsSource_Y", e[e.CubismPhysicsSource_Angle = 2] = "CubismPhysicsSource_Angle";
})(H ||= {});
var Yt = class {
	constructor() {
		this.gravity = new i(0, 0), this.wind = new i(0, 0);
	}
	gravity;
	wind;
}, Xt = class {
	id;
	targetType;
}, Zt = class {
	minimum;
	maximum;
	defalut;
}, Qt = class {
	constructor() {
		this.initialPosition = new i(0, 0), this.position = new i(0, 0), this.lastPosition = new i(0, 0), this.lastGravity = new i(0, 0), this.force = new i(0, 0), this.velocity = new i(0, 0);
	}
	initialPosition;
	mobility;
	delay;
	acceleration;
	radius;
	position;
	lastPosition;
	lastGravity;
	force;
	velocity;
}, $t = class {
	constructor() {
		this.normalizationPosition = new Zt(), this.normalizationAngle = new Zt();
	}
	inputCount;
	outputCount;
	particleCount;
	baseInputIndex;
	baseOutputIndex;
	baseParticleIndex;
	normalizationPosition;
	normalizationAngle;
}, en = class {
	constructor() {
		this.source = new Xt();
	}
	source;
	sourceParameterIndex;
	weight;
	type;
	reflect;
	getNormalizedParameterValue;
}, tn = class {
	constructor() {
		this.destination = new Xt(), this.translationScale = new i(0, 0);
	}
	destination;
	destinationParameterIndex;
	vertexIndex;
	translationScale;
	angleScale;
	weight;
	type;
	reflect;
	valueBelowMinimum;
	valueExceededMaximum;
	getValue;
	getScale;
}, nn = class {
	constructor() {
		this.settings = [], this.inputs = [], this.outputs = [], this.particles = [], this.gravity = new i(0, 0), this.wind = new i(0, 0), this.fps = 0;
	}
	subRigCount;
	settings;
	inputs;
	outputs;
	particles;
	gravity;
	wind;
	fps;
}, rn;
(function(e) {
	e.CubismPhysicsInput = en, e.CubismPhysicsNormalization = Zt, e.CubismPhysicsOutput = tn, e.CubismPhysicsParameter = Xt, e.CubismPhysicsParticle = Qt, e.CubismPhysicsRig = nn, e.CubismPhysicsSource = H, e.CubismPhysicsSubRig = $t, e.CubismPhysicsTargetType = Jt, e.PhysicsJsonEffectiveForces = Yt;
})(rn ||= {});
//#endregion
//#region vendor/compiled/Framework/src/physics/cubismphysicsjson.js
var an = "Position", on = "X", sn = "Y", cn = "Angle", ln = "Type", un = "Id", U = "Meta", dn = "EffectiveForces", fn = "TotalInputCount", pn = "TotalOutputCount", mn = "PhysicsSettingCount", hn = "Gravity", gn = "Wind", _n = "VertexCount", vn = "Fps", W = "PhysicsSettings", yn = "Normalization", bn = "Minimum", xn = "Maximum", Sn = "Default", Cn = "Reflect", wn = "Weight", Tn = "Input", En = "Source", G = "Output", Dn = "Scale", On = "VertexIndex", kn = "Destination", An = "Vertices", jn = "Mobility", Mn = "Delay", Nn = "Radius", Pn = "Acceleration", Fn = class {
	constructor(e, t) {
		this._json = D.create(e, t);
	}
	release() {
		D.delete(this._json);
	}
	getGravity() {
		let e = new i(0, 0);
		return e.x = this._json.getRoot().getValueByString(U).getValueByString(dn).getValueByString(hn).getValueByString(on).toFloat(), e.y = this._json.getRoot().getValueByString(U).getValueByString(dn).getValueByString(hn).getValueByString(sn).toFloat(), e;
	}
	getWind() {
		let e = new i(0, 0);
		return e.x = this._json.getRoot().getValueByString(U).getValueByString(dn).getValueByString(gn).getValueByString(on).toFloat(), e.y = this._json.getRoot().getValueByString(U).getValueByString(dn).getValueByString(gn).getValueByString(sn).toFloat(), e;
	}
	getFps() {
		return this._json.getRoot().getValueByString(U).getValueByString(vn).toFloat(0);
	}
	getSubRigCount() {
		return this._json.getRoot().getValueByString(U).getValueByString(mn).toInt();
	}
	getTotalInputCount() {
		return this._json.getRoot().getValueByString(U).getValueByString(fn).toInt();
	}
	getTotalOutputCount() {
		return this._json.getRoot().getValueByString(U).getValueByString(pn).toInt();
	}
	getVertexCount() {
		return this._json.getRoot().getValueByString(U).getValueByString(_n).toInt();
	}
	getNormalizationPositionMinimumValue(e) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(yn).getValueByString(an).getValueByString(bn).toFloat();
	}
	getNormalizationPositionMaximumValue(e) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(yn).getValueByString(an).getValueByString(xn).toFloat();
	}
	getNormalizationPositionDefaultValue(e) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(yn).getValueByString(an).getValueByString(Sn).toFloat();
	}
	getNormalizationAngleMinimumValue(e) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(yn).getValueByString(cn).getValueByString(bn).toFloat();
	}
	getNormalizationAngleMaximumValue(e) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(yn).getValueByString(cn).getValueByString(xn).toFloat();
	}
	getNormalizationAngleDefaultValue(e) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(yn).getValueByString(cn).getValueByString(Sn).toFloat();
	}
	getInputCount(e) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(Tn).getVector().length;
	}
	getInputWeight(e, t) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(Tn).getValueByIndex(t).getValueByString(wn).toFloat();
	}
	getInputReflect(e, t) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(Tn).getValueByIndex(t).getValueByString(Cn).toBoolean();
	}
	getInputType(e, t) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(Tn).getValueByIndex(t).getValueByString(ln).getRawString();
	}
	getInputSourceId(e, t) {
		return j.getIdManager().getId(this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(Tn).getValueByIndex(t).getValueByString(En).getValueByString(un).getRawString());
	}
	getOutputCount(e) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(G).getVector().length;
	}
	getOutputVertexIndex(e, t) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(G).getValueByIndex(t).getValueByString(On).toInt();
	}
	getOutputAngleScale(e, t) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(G).getValueByIndex(t).getValueByString(Dn).toFloat();
	}
	getOutputWeight(e, t) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(G).getValueByIndex(t).getValueByString(wn).toFloat();
	}
	getOutputDestinationId(e, t) {
		return j.getIdManager().getId(this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(G).getValueByIndex(t).getValueByString(kn).getValueByString(un).getRawString());
	}
	getOutputType(e, t) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(G).getValueByIndex(t).getValueByString(ln).getRawString();
	}
	getOutputReflect(e, t) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(G).getValueByIndex(t).getValueByString(Cn).toBoolean();
	}
	getParticleCount(e) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(An).getVector().length;
	}
	getParticleMobility(e, t) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(An).getValueByIndex(t).getValueByString(jn).toFloat();
	}
	getParticleDelay(e, t) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(An).getValueByIndex(t).getValueByString(Mn).toFloat();
	}
	getParticleAcceleration(e, t) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(An).getValueByIndex(t).getValueByString(Pn).toFloat();
	}
	getParticleRadius(e, t) {
		return this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(An).getValueByIndex(t).getValueByString(Nn).toFloat();
	}
	getParticlePosition(e, t) {
		let n = new i(0, 0);
		return n.x = this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(An).getValueByIndex(t).getValueByString(an).getValueByString(on).toFloat(), n.y = this._json.getRoot().getValueByString(W).getValueByIndex(e).getValueByString(An).getValueByIndex(t).getValueByString(an).getValueByString(sn).toFloat(), n;
	}
	_json;
}, In;
(function(e) {
	e.CubismPhysicsJson = Fn;
})(In ||= {});
//#endregion
//#region vendor/compiled/Framework/src/physics/cubismphysics.js
var Ln = "X", Rn = "Y", zn = "Angle", Bn = 5, Vn = 100, Hn = .001, Un = 5, Wn = class e {
	static create(t, n) {
		let r = new e();
		return r.parse(t, n), r._physicsRig.gravity.y = 0, r;
	}
	static delete(e) {
		e != null && (e.release(), e = null);
	}
	parse(e, t) {
		this._physicsRig = new nn();
		let n = new Fn(e, t);
		this._physicsRig.gravity = n.getGravity(), this._physicsRig.wind = n.getWind(), this._physicsRig.subRigCount = n.getSubRigCount(), this._physicsRig.fps = n.getFps(), F(this._physicsRig.settings, this._physicsRig.subRigCount, $t, !0), F(this._physicsRig.inputs, n.getTotalInputCount(), en, !0), F(this._physicsRig.outputs, n.getTotalOutputCount(), tn, !0), F(this._physicsRig.particles, n.getVertexCount(), Qt, !0), this._currentRigOutputs.length = 0, this._previousRigOutputs.length = 0;
		let r = 0, i = 0, a = 0, o = this._currentRigOutputs.length, s = this._previousRigOutputs.length;
		this._currentRigOutputs.length += this._physicsRig.settings.length, this._previousRigOutputs.length += this._physicsRig.settings.length;
		for (let e = 0; e < this._physicsRig.settings.length; ++e) {
			this._physicsRig.settings[e].normalizationPosition.minimum = n.getNormalizationPositionMinimumValue(e), this._physicsRig.settings[e].normalizationPosition.maximum = n.getNormalizationPositionMaximumValue(e), this._physicsRig.settings[e].normalizationPosition.defalut = n.getNormalizationPositionDefaultValue(e), this._physicsRig.settings[e].normalizationAngle.minimum = n.getNormalizationAngleMinimumValue(e), this._physicsRig.settings[e].normalizationAngle.maximum = n.getNormalizationAngleMaximumValue(e), this._physicsRig.settings[e].normalizationAngle.defalut = n.getNormalizationAngleDefaultValue(e), this._physicsRig.settings[e].inputCount = n.getInputCount(e), this._physicsRig.settings[e].baseInputIndex = r;
			for (let t = 0; t < this._physicsRig.settings[e].inputCount; ++t) this._physicsRig.inputs[r + t].sourceParameterIndex = -1, this._physicsRig.inputs[r + t].weight = n.getInputWeight(e, t), this._physicsRig.inputs[r + t].reflect = n.getInputReflect(e, t), n.getInputType(e, t) == Ln ? (this._physicsRig.inputs[r + t].type = H.CubismPhysicsSource_X, this._physicsRig.inputs[r + t].getNormalizedParameterValue = Jn) : n.getInputType(e, t) == Rn ? (this._physicsRig.inputs[r + t].type = H.CubismPhysicsSource_Y, this._physicsRig.inputs[r + t].getNormalizedParameterValue = Yn) : n.getInputType(e, t) == zn && (this._physicsRig.inputs[r + t].type = H.CubismPhysicsSource_Angle, this._physicsRig.inputs[r + t].getNormalizedParameterValue = Xn), this._physicsRig.inputs[r + t].source.targetType = Jt.CubismPhysicsTargetType_Parameter, this._physicsRig.inputs[r + t].source.id = n.getInputSourceId(e, t);
			r += this._physicsRig.settings[e].inputCount, this._physicsRig.settings[e].outputCount = n.getOutputCount(e), this._physicsRig.settings[e].baseOutputIndex = i;
			let t = new Kn();
			F(t.outputs, this._physicsRig.settings[e].outputCount, null, !0);
			let c = new Kn();
			F(c.outputs, this._physicsRig.settings[e].outputCount, null, !0);
			for (let r = 0; r < this._physicsRig.settings[e].outputCount; ++r) t.outputs[r] = 0, c.outputs[r] = 0, this._physicsRig.outputs[i + r].destinationParameterIndex = -1, this._physicsRig.outputs[i + r].vertexIndex = n.getOutputVertexIndex(e, r), this._physicsRig.outputs[i + r].angleScale = n.getOutputAngleScale(e, r), this._physicsRig.outputs[i + r].weight = n.getOutputWeight(e, r), this._physicsRig.outputs[i + r].destination.targetType = Jt.CubismPhysicsTargetType_Parameter, this._physicsRig.outputs[i + r].destination.id = n.getOutputDestinationId(e, r), n.getOutputType(e, r) == Ln ? (this._physicsRig.outputs[i + r].type = H.CubismPhysicsSource_X, this._physicsRig.outputs[i + r].getValue = Zn, this._physicsRig.outputs[i + r].getScale = nr) : n.getOutputType(e, r) == Rn ? (this._physicsRig.outputs[i + r].type = H.CubismPhysicsSource_Y, this._physicsRig.outputs[i + r].getValue = Qn, this._physicsRig.outputs[i + r].getScale = rr) : n.getOutputType(e, r) == zn && (this._physicsRig.outputs[i + r].type = H.CubismPhysicsSource_Angle, this._physicsRig.outputs[i + r].getValue = $n, this._physicsRig.outputs[i + r].getScale = ir), this._physicsRig.outputs[i + r].reflect = n.getOutputReflect(e, r);
			this._currentRigOutputs[o++] = t, this._previousRigOutputs[s++] = c, i += this._physicsRig.settings[e].outputCount, this._physicsRig.settings[e].particleCount = n.getParticleCount(e), this._physicsRig.settings[e].baseParticleIndex = a;
			for (let t = 0; t < this._physicsRig.settings[e].particleCount; ++t) this._physicsRig.particles[a + t].mobility = n.getParticleMobility(e, t), this._physicsRig.particles[a + t].delay = n.getParticleDelay(e, t), this._physicsRig.particles[a + t].acceleration = n.getParticleAcceleration(e, t), this._physicsRig.particles[a + t].radius = n.getParticleRadius(e, t), this._physicsRig.particles[a + t].position = n.getParticlePosition(e, t);
			a += this._physicsRig.settings[e].particleCount;
		}
		this.initialize(), n.release(), n = void 0, n = null;
	}
	stabilization(e) {
		let t, n, r, a, s = new i(), c, l, u, d, f = e.getModel().parameters.values, p = e.getModel().parameters.maximumValues, m = e.getModel().parameters.minimumValues, h = e.getModel().parameters.defaultValues;
		(this._parameterCaches?.length ?? 0) < e.getParameterCount() && (this._parameterCaches = new Float32Array(e.getParameterCount())), (this._parameterInputCaches?.length ?? 0) < e.getParameterCount() && (this._parameterInputCaches = new Float32Array(e.getParameterCount()));
		for (let t = 0; t < e.getParameterCount(); ++t) this._parameterCaches[t] = f[t], this._parameterInputCaches[t] = f[t];
		for (let g = 0; g < this._physicsRig.subRigCount; ++g) {
			t = { angle: 0 }, s.x = 0, s.y = 0, c = this._physicsRig.settings[g], l = this._physicsRig.inputs.slice(c.baseInputIndex), u = this._physicsRig.outputs.slice(c.baseOutputIndex), d = this._physicsRig.particles.slice(c.baseParticleIndex);
			for (let r = 0; r < c.inputCount; ++r) n = l[r].weight / Vn, l[r].sourceParameterIndex == -1 && (l[r].sourceParameterIndex = e.getParameterIndex(l[r].source.id)), l[r].getNormalizedParameterValue(s, t, f[l[r].sourceParameterIndex], m[l[r].sourceParameterIndex], p[l[r].sourceParameterIndex], h[l[r].sourceParameterIndex], c.normalizationPosition, c.normalizationAngle, l[r].reflect, n), this._parameterCaches[l[r].sourceParameterIndex] = f[l[r].sourceParameterIndex];
			r = o.degreesToRadian(-t.angle), s.x = s.x * o.cos(r) - s.y * o.sin(r), s.y = s.x * o.sin(r) + s.y * o.cos(r), or(d, c.particleCount, s, t.angle, this._options.wind, Hn * c.normalizationPosition.maximum);
			for (let t = 0; t < c.outputCount; ++t) {
				let n = u[t].vertexIndex;
				if (u[t].destinationParameterIndex == -1 && (u[t].destinationParameterIndex = e.getParameterIndex(u[t].destination.id)), n < 1 || n >= c.particleCount) continue;
				let r = new i();
				r = d[n].position.substract(d[n - 1].position), a = u[t].getValue(r, d, n, u[t].reflect, this._options.gravity), this._currentRigOutputs[g].outputs[t] = a, this._previousRigOutputs[g].outputs[t] = a;
				let o = u[t].destinationParameterIndex, s = !Float32Array.prototype.slice && "subarray" in Float32Array.prototype ? JSON.parse(JSON.stringify(f.subarray(o))) : f.slice(o);
				sr(s, m[o], p[o], a, u[t]);
				for (let e = o, t = 0; e < this._parameterCaches.length; e++, t++) f[e] = this._parameterCaches[e] = s[t];
			}
		}
	}
	evaluate(e, t) {
		let n, r, a, s, c = new i(), l, u, d, f;
		if (0 >= t) return;
		let p = e.getModel().parameters.values, m = e.getModel().parameters.maximumValues, h = e.getModel().parameters.minimumValues, g = e.getModel().parameters.defaultValues, _;
		if (this._currentRemainTime += t, this._currentRemainTime > Un && (this._currentRemainTime = 0), (this._parameterCaches?.length ?? 0) < e.getParameterCount() && (this._parameterCaches = new Float32Array(e.getParameterCount())), (this._parameterInputCaches?.length ?? 0) < e.getParameterCount()) {
			this._parameterInputCaches = new Float32Array(e.getParameterCount());
			for (let t = 0; t < e.getParameterCount(); ++t) this._parameterInputCaches[t] = p[t];
		}
		for (_ = this._physicsRig.fps > 0 ? 1 / this._physicsRig.fps : t; this._currentRemainTime >= _;) {
			for (let e = 0; e < this._physicsRig.subRigCount; ++e) {
				l = this._physicsRig.settings[e], d = this._physicsRig.outputs.slice(l.baseOutputIndex);
				for (let t = 0; t < l.outputCount; ++t) this._previousRigOutputs[e].outputs[t] = this._currentRigOutputs[e].outputs[t];
			}
			let t = _ / this._currentRemainTime;
			for (let n = 0; n < e.getParameterCount(); ++n) this._parameterCaches[n] = this._parameterInputCaches[n] * (1 - t) + p[n] * t, this._parameterInputCaches[n] = this._parameterCaches[n];
			for (let t = 0; t < this._physicsRig.subRigCount; ++t) {
				n = { angle: 0 }, c.x = 0, c.y = 0, l = this._physicsRig.settings[t], u = this._physicsRig.inputs.slice(l.baseInputIndex), d = this._physicsRig.outputs.slice(l.baseOutputIndex), f = this._physicsRig.particles.slice(l.baseParticleIndex);
				for (let t = 0; t < l.inputCount; ++t) r = u[t].weight / Vn, u[t].sourceParameterIndex == -1 && (u[t].sourceParameterIndex = e.getParameterIndex(u[t].source.id)), u[t].getNormalizedParameterValue(c, n, this._parameterCaches[u[t].sourceParameterIndex], h[u[t].sourceParameterIndex], m[u[t].sourceParameterIndex], g[u[t].sourceParameterIndex], l.normalizationPosition, l.normalizationAngle, u[t].reflect, r);
				a = o.degreesToRadian(-n.angle), c.x = c.x * o.cos(a) - c.y * o.sin(a), c.y = c.x * o.sin(a) + c.y * o.cos(a), ar(f, l.particleCount, c, n.angle, this._options.wind, Hn * l.normalizationPosition.maximum, _, Bn);
				for (let n = 0; n < l.outputCount; ++n) {
					let r = d[n].vertexIndex;
					if (d[n].destinationParameterIndex == -1 && (d[n].destinationParameterIndex = e.getParameterIndex(d[n].destination.id)), r < 1 || r >= l.particleCount) continue;
					let a = new i();
					a.x = f[r].position.x - f[r - 1].position.x, a.y = f[r].position.y - f[r - 1].position.y, s = d[n].getValue(a, f, r, d[n].reflect, this._options.gravity), this._currentRigOutputs[t].outputs[n] = s;
					let o = d[n].destinationParameterIndex, c = !Float32Array.prototype.slice && "subarray" in Float32Array.prototype ? JSON.parse(JSON.stringify(this._parameterCaches.subarray(o))) : this._parameterCaches.slice(o);
					sr(c, h[o], m[o], s, d[n]);
					for (let e = o, t = 0; e < this._parameterCaches.length; e++, t++) this._parameterCaches[e] = c[t];
				}
			}
			this._currentRemainTime -= _;
		}
		let v = this._currentRemainTime / _;
		this.interpolate(e, v);
	}
	interpolate(e, t) {
		let n, r, i = e.getModel().parameters.values, a = e.getModel().parameters.maximumValues, o = e.getModel().parameters.minimumValues;
		for (let e = 0; e < this._physicsRig.subRigCount; ++e) {
			r = this._physicsRig.settings[e], n = this._physicsRig.outputs.slice(r.baseOutputIndex);
			for (let s = 0; s < r.outputCount; ++s) {
				if (n[s].destinationParameterIndex == -1) continue;
				let r = n[s].destinationParameterIndex, c = !Float32Array.prototype.slice && "subarray" in Float32Array.prototype ? JSON.parse(JSON.stringify(i.subarray(r))) : i.slice(r);
				sr(c, o[r], a[r], this._previousRigOutputs[e].outputs[s] * (1 - t) + this._currentRigOutputs[e].outputs[s] * t, n[s]);
				for (let e = r, t = 0; e < i.length; e++, t++) i[e] = c[t];
			}
		}
	}
	setOptions(e) {
		this._options = e;
	}
	getOption() {
		return this._options;
	}
	constructor() {
		this._physicsRig = null, this._options = new Gn(), this._options.gravity.y = -1, this._options.gravity.x = 0, this._options.wind.x = 0, this._options.wind.y = 0, this._currentRigOutputs = [], this._previousRigOutputs = [], this._currentRemainTime = 0, this._parameterCaches = null, this._parameterInputCaches = null;
	}
	release() {
		this._physicsRig = void 0, this._physicsRig = null;
	}
	initialize() {
		let e, t, n;
		for (let r = 0; r < this._physicsRig.subRigCount; ++r) {
			t = this._physicsRig.settings[r], e = this._physicsRig.particles.slice(t.baseParticleIndex), e[0].initialPosition = new i(0, 0), e[0].lastPosition = new i(e[0].initialPosition.x, e[0].initialPosition.y), e[0].lastGravity = new i(0, -1), e[0].lastGravity.y *= -1, e[0].velocity = new i(0, 0), e[0].force = new i(0, 0);
			for (let r = 1; r < t.particleCount; ++r) n = new i(0, 0), n.y = e[r].radius, e[r].initialPosition = new i(e[r - 1].initialPosition.x + n.x, e[r - 1].initialPosition.y + n.y), e[r].position = new i(e[r].initialPosition.x, e[r].initialPosition.y), e[r].lastPosition = new i(e[r].initialPosition.x, e[r].initialPosition.y), e[r].lastGravity = new i(0, -1), e[r].lastGravity.y *= -1, e[r].velocity = new i(0, 0), e[r].force = new i(0, 0);
		}
	}
	_physicsRig;
	_options;
	_currentRigOutputs;
	_previousRigOutputs;
	_currentRemainTime;
	_parameterCaches;
	_parameterInputCaches;
}, Gn = class {
	constructor() {
		this.gravity = new i(0, 0), this.wind = new i(0, 0);
	}
	gravity;
	wind;
}, Kn = class {
	constructor() {
		this.outputs = [];
	}
	outputs;
};
function qn(e) {
	let t = 0;
	return e > 0 ? t = 1 : e < 0 && (t = -1), t;
}
function Jn(e, t, n, r, i, a, o, s, c, l) {
	e.x += cr(n, r, i, a, o.minimum, o.maximum, o.defalut, c) * l;
}
function Yn(e, t, n, r, i, a, o, s, c, l) {
	e.y += cr(n, r, i, a, o.minimum, o.maximum, o.defalut, c) * l;
}
function Xn(e, t, n, r, i, a, o, s, c, l) {
	t.angle += cr(n, r, i, a, s.minimum, s.maximum, s.defalut, c) * l;
}
function Zn(e, t, n, r, i) {
	let a = e.x;
	return r && (a *= -1), a;
}
function Qn(e, t, n, r, i) {
	let a = e.y;
	return r && (a *= -1), a;
}
function $n(e, t, n, r, i) {
	let a;
	return i = n >= 2 ? t[n - 1].position.substract(t[n - 2].position) : i.multiplyByScaler(-1), a = o.directionToRadian(i, e), r && (a *= -1), a;
}
function er(e, t) {
	let n = o.max(e, t), r = o.min(e, t);
	return o.abs(n - r);
}
function tr(e, t) {
	return o.min(e, t) + er(e, t) / 2;
}
function nr(e, t) {
	return JSON.parse(JSON.stringify(e.x));
}
function rr(e, t) {
	return JSON.parse(JSON.stringify(e.y));
}
function ir(e, t) {
	return JSON.parse(JSON.stringify(t));
}
function ar(e, t, n, r, a, s, c, l) {
	let u, d, f = new i(0, 0), p = new i(0, 0), m = new i(0, 0), h = new i(0, 0);
	e[0].position = new i(n.x, n.y);
	let g = o.degreesToRadian(r), _ = o.radianToDirection(g);
	_.normalize();
	for (let n = 1; n < t; ++n) e[n].force = _.multiplyByScaler(e[n].acceleration).add(a), e[n].lastPosition = new i(e[n].position.x, e[n].position.y), u = e[n].delay * c * 30, f = e[n].position.substract(e[n - 1].position), d = o.directionToRadian(e[n].lastGravity, _) / l, f.x = o.cos(d) * f.x - f.y * o.sin(d), f.y = o.sin(d) * f.x + f.y * o.cos(d), e[n].position = e[n - 1].position.add(f), p = e[n].velocity.multiplyByScaler(u), m = e[n].force.multiplyByScaler(u).multiplyByScaler(u), e[n].position = e[n].position.add(p).add(m), h = e[n].position.substract(e[n - 1].position), h.normalize(), e[n].position = e[n - 1].position.add(h.multiplyByScaler(e[n].radius)), o.abs(e[n].position.x) < s && (e[n].position.x = 0), u != 0 && (e[n].velocity = e[n].position.substract(e[n].lastPosition), e[n].velocity = e[n].velocity.divisionByScalar(u), e[n].velocity = e[n].velocity.multiplyByScaler(e[n].mobility)), e[n].force = new i(0, 0), e[n].lastGravity = new i(_.x, _.y);
}
function or(e, t, n, r, a, s) {
	let c = new i(0, 0);
	e[0].position = new i(n.x, n.y);
	let l = o.degreesToRadian(r), u = o.radianToDirection(l);
	u.normalize();
	for (let n = 1; n < t; ++n) e[n].force = u.multiplyByScaler(e[n].acceleration).add(a), e[n].lastPosition = new i(e[n].position.x, e[n].position.y), e[n].velocity = new i(0, 0), c = e[n].force, c.normalize(), c = c.multiplyByScaler(e[n].radius), e[n].position = e[n - 1].position.add(c), o.abs(e[n].position.x) < s && (e[n].position.x = 0), e[n].force = new i(0, 0), e[n].lastGravity = new i(u.x, u.y);
}
function sr(e, t, n, r, i) {
	let a;
	a = r * i.getScale(i.translationScale, i.angleScale), a < t ? (a < i.valueBelowMinimum && (i.valueBelowMinimum = a), a = t) : a > n && (a > i.valueExceededMaximum && (i.valueExceededMaximum = a), a = n);
	let o = i.weight / Vn;
	o >= 1 || (a = e[0] * (1 - o) + a * o), e[0] = a;
}
function cr(e, t, n, r, i, a, s, c) {
	let l = 0, u = o.max(n, t);
	u < e && (e = u);
	let d = o.min(n, t);
	d > e && (e = d);
	let f = o.min(i, a), p = o.max(i, a), m = s, h = tr(d, u), g = e - h;
	switch (qn(g)) {
		case 1: {
			let e = p - m, t = u - h;
			t != 0 && (l = e / t * g, l += m);
			break;
		}
		case -1: {
			let e = f - m, t = d - h;
			t != 0 && (l = e / t * g, l += m);
			break;
		}
		case 0:
			l = m;
			break;
		default: break;
	}
	return c ? l : l * -1;
}
var lr;
(function(e) {
	e.CubismPhysics = Wn, e.Options = Gn;
})(lr ||= {});
//#endregion
//#region vendor/compiled/Framework/src/model/cubismmodelmultiplyandscreencolor.js
var K = class {
	constructor(e = !1, t = new w()) {
		this.isOverridden = e, this.color = t;
	}
	isOverridden;
	color;
}, ur = class {
	_model;
	_isOverriddenModelMultiplyColors;
	_isOverriddenModelScreenColors;
	_userPartScreenColors;
	_userPartMultiplyColors;
	_userDrawableScreenColors;
	_userDrawableMultiplyColors;
	_userOffscreenScreenColors;
	_userOffscreenMultiplyColors;
	constructor(e) {
		this._model = e, this._isOverriddenModelMultiplyColors = !1, this._isOverriddenModelScreenColors = !1, this._userPartScreenColors = [], this._userPartMultiplyColors = [], this._userDrawableScreenColors = [], this._userDrawableMultiplyColors = [], this._userOffscreenScreenColors = [], this._userOffscreenMultiplyColors = [];
	}
	initialize(e, t, n) {
		let r = new K(!1, new w(1, 1, 1, 1)), i = new K(!1, new w(0, 0, 0, 1));
		this._userPartMultiplyColors = Array(e), this._userPartScreenColors = Array(e);
		for (let t = 0; t < e; t++) this._userPartMultiplyColors[t] = new K(r.isOverridden, new w(r.color.r, r.color.g, r.color.b, r.color.a)), this._userPartScreenColors[t] = new K(i.isOverridden, new w(i.color.r, i.color.g, i.color.b, i.color.a));
		this._userDrawableMultiplyColors = Array(t), this._userDrawableScreenColors = Array(t);
		for (let e = 0; e < t; e++) this._userDrawableMultiplyColors[e] = new K(r.isOverridden, new w(r.color.r, r.color.g, r.color.b, r.color.a)), this._userDrawableScreenColors[e] = new K(i.isOverridden, new w(i.color.r, i.color.g, i.color.b, i.color.a));
		this._userOffscreenMultiplyColors = Array(n), this._userOffscreenScreenColors = Array(n);
		for (let e = 0; e < n; e++) this._userOffscreenMultiplyColors[e] = new K(r.isOverridden, new w(r.color.r, r.color.g, r.color.b, r.color.a)), this._userOffscreenScreenColors[e] = new K(i.isOverridden, new w(i.color.r, i.color.g, i.color.b, i.color.a));
	}
	warnIndexOutOfRange(e, t, n) {
		_(`${e}: index is out of range. index=${t}, valid range=[0, ${n}].`);
	}
	isValidPartIndex(e, t) {
		return e < 0 || e >= this._model.getPartCount() ? (this.warnIndexOutOfRange(t, e, this._model.getPartCount() - 1), !1) : !0;
	}
	isValidDrawableIndex(e, t) {
		return e < 0 || e >= this._model.getDrawableCount() ? (this.warnIndexOutOfRange(t, e, this._model.getDrawableCount() - 1), !1) : !0;
	}
	isValidOffscreenIndex(e, t) {
		return e < 0 || e >= this._model.getOffscreenCount() ? (this.warnIndexOutOfRange(t, e, this._model.getOffscreenCount() - 1), !1) : !0;
	}
	setMultiplyColorEnabled(e) {
		this._isOverriddenModelMultiplyColors = e;
	}
	getMultiplyColorEnabled() {
		return this._isOverriddenModelMultiplyColors;
	}
	setScreenColorEnabled(e) {
		this._isOverriddenModelScreenColors = e;
	}
	getScreenColorEnabled() {
		return this._isOverriddenModelScreenColors;
	}
	setPartMultiplyColorEnabled(e, t) {
		this.isValidPartIndex(e, "setPartMultiplyColorEnabled") && this.setPartColorEnabled(e, t, this._userPartMultiplyColors, this._userDrawableMultiplyColors, this._userOffscreenMultiplyColors);
	}
	getPartMultiplyColorEnabled(e) {
		return this.isValidPartIndex(e, "getPartMultiplyColorEnabled") ? this._userPartMultiplyColors[e].isOverridden : !1;
	}
	setPartScreenColorEnabled(e, t) {
		this.isValidPartIndex(e, "setPartScreenColorEnabled") && this.setPartColorEnabled(e, t, this._userPartScreenColors, this._userDrawableScreenColors, this._userOffscreenScreenColors);
	}
	getPartScreenColorEnabled(e) {
		return this.isValidPartIndex(e, "getPartScreenColorEnabled") ? this._userPartScreenColors[e].isOverridden : !1;
	}
	setPartMultiplyColorByTextureColor(e, t) {
		this.isValidPartIndex(e, "setPartMultiplyColorByTextureColor") && this.setPartMultiplyColorByRGBA(e, t.r, t.g, t.b, t.a);
	}
	setPartMultiplyColorByRGBA(e, t, n, r, i = 1) {
		this.isValidPartIndex(e, "setPartMultiplyColorByRGBA") && this.setPartColor(e, t, n, r, i, this._userPartMultiplyColors, this._userDrawableMultiplyColors, this._userOffscreenMultiplyColors);
	}
	getPartMultiplyColor(e) {
		return this.isValidPartIndex(e, "getPartMultiplyColor") ? this._userPartMultiplyColors[e].color : new w(1, 1, 1, 1);
	}
	setPartScreenColorByTextureColor(e, t) {
		this.isValidPartIndex(e, "setPartScreenColorByTextureColor") && this.setPartScreenColorByRGBA(e, t.r, t.g, t.b, t.a);
	}
	setPartScreenColorByRGBA(e, t, n, r, i = 1) {
		this.isValidPartIndex(e, "setPartScreenColorByRGBA") && this.setPartColor(e, t, n, r, i, this._userPartScreenColors, this._userDrawableScreenColors, this._userOffscreenScreenColors);
	}
	getPartScreenColor(e) {
		return this.isValidPartIndex(e, "getPartScreenColor") ? this._userPartScreenColors[e].color : new w(0, 0, 0, 1);
	}
	setDrawableMultiplyColorEnabled(e, t) {
		this.isValidDrawableIndex(e, "setDrawableMultiplyColorEnabled") && (this._userDrawableMultiplyColors[e].isOverridden = t);
	}
	getDrawableMultiplyColorEnabled(e) {
		return this.isValidDrawableIndex(e, "getDrawableMultiplyColorEnabled") ? this._userDrawableMultiplyColors[e].isOverridden : !1;
	}
	setDrawableScreenColorEnabled(e, t) {
		this.isValidDrawableIndex(e, "setDrawableScreenColorEnabled") && (this._userDrawableScreenColors[e].isOverridden = t);
	}
	getDrawableScreenColorEnabled(e) {
		return this.isValidDrawableIndex(e, "getDrawableScreenColorEnabled") ? this._userDrawableScreenColors[e].isOverridden : !1;
	}
	setDrawableMultiplyColorByTextureColor(e, t) {
		this.isValidDrawableIndex(e, "setDrawableMultiplyColorByTextureColor") && this.setDrawableMultiplyColorByRGBA(e, t.r, t.g, t.b, t.a);
	}
	setDrawableMultiplyColorByRGBA(e, t, n, r, i = 1) {
		this.isValidDrawableIndex(e, "setDrawableMultiplyColorByRGBA") && (this._userDrawableMultiplyColors[e].color.r = t, this._userDrawableMultiplyColors[e].color.g = n, this._userDrawableMultiplyColors[e].color.b = r, this._userDrawableMultiplyColors[e].color.a = i);
	}
	getDrawableMultiplyColor(e) {
		return this.isValidDrawableIndex(e, "getDrawableMultiplyColor") ? this.getMultiplyColorEnabled() || this.getDrawableMultiplyColorEnabled(e) ? this._userDrawableMultiplyColors[e].color : this._model.getDrawableMultiplyColor(e) : new w(1, 1, 1, 1);
	}
	setDrawableScreenColorByTextureColor(e, t) {
		this.isValidDrawableIndex(e, "setDrawableScreenColorByTextureColor") && this.setDrawableScreenColorByRGBA(e, t.r, t.g, t.b, t.a);
	}
	setDrawableScreenColorByRGBA(e, t, n, r, i = 1) {
		this.isValidDrawableIndex(e, "setDrawableScreenColorByRGBA") && (this._userDrawableScreenColors[e].color.r = t, this._userDrawableScreenColors[e].color.g = n, this._userDrawableScreenColors[e].color.b = r, this._userDrawableScreenColors[e].color.a = i);
	}
	getDrawableScreenColor(e) {
		return this.isValidDrawableIndex(e, "getDrawableScreenColor") ? this.getScreenColorEnabled() || this.getDrawableScreenColorEnabled(e) ? this._userDrawableScreenColors[e].color : this._model.getDrawableScreenColor(e) : new w(0, 0, 0, 1);
	}
	setOffscreenMultiplyColorEnabled(e, t) {
		this.isValidOffscreenIndex(e, "setOffscreenMultiplyColorEnabled") && (this._userOffscreenMultiplyColors[e].isOverridden = t);
	}
	getOffscreenMultiplyColorEnabled(e) {
		return this.isValidOffscreenIndex(e, "getOffscreenMultiplyColorEnabled") ? this._userOffscreenMultiplyColors[e].isOverridden : !1;
	}
	setOffscreenScreenColorEnabled(e, t) {
		this.isValidOffscreenIndex(e, "setOffscreenScreenColorEnabled") && (this._userOffscreenScreenColors[e].isOverridden = t);
	}
	getOffscreenScreenColorEnabled(e) {
		return this.isValidOffscreenIndex(e, "getOffscreenScreenColorEnabled") ? this._userOffscreenScreenColors[e].isOverridden : !1;
	}
	setOffscreenMultiplyColorByTextureColor(e, t) {
		this.isValidOffscreenIndex(e, "setOffscreenMultiplyColorByTextureColor") && this.setOffscreenMultiplyColorByRGBA(e, t.r, t.g, t.b, t.a);
	}
	setOffscreenMultiplyColorByRGBA(e, t, n, r, i = 1) {
		this.isValidOffscreenIndex(e, "setOffscreenMultiplyColorByRGBA") && (this._userOffscreenMultiplyColors[e].color.r = t, this._userOffscreenMultiplyColors[e].color.g = n, this._userOffscreenMultiplyColors[e].color.b = r, this._userOffscreenMultiplyColors[e].color.a = i);
	}
	getOffscreenMultiplyColor(e) {
		return this.isValidOffscreenIndex(e, "getOffscreenMultiplyColor") ? this.getMultiplyColorEnabled() || this.getOffscreenMultiplyColorEnabled(e) ? this._userOffscreenMultiplyColors[e].color : this._model.getOffscreenMultiplyColor(e) : new w(1, 1, 1, 1);
	}
	setOffscreenScreenColorByTextureColor(e, t) {
		this.isValidOffscreenIndex(e, "setOffscreenScreenColorByTextureColor") && this.setOffscreenScreenColorByRGBA(e, t.r, t.g, t.b, t.a);
	}
	setOffscreenScreenColorByRGBA(e, t, n, r, i = 1) {
		this.isValidOffscreenIndex(e, "setOffscreenScreenColorByRGBA") && (this._userOffscreenScreenColors[e].color.r = t, this._userOffscreenScreenColors[e].color.g = n, this._userOffscreenScreenColors[e].color.b = r, this._userOffscreenScreenColors[e].color.a = i);
	}
	getOffscreenScreenColor(e) {
		return this.isValidOffscreenIndex(e, "getOffscreenScreenColor") ? this.getScreenColorEnabled() || this.getOffscreenScreenColorEnabled(e) ? this._userOffscreenScreenColors[e].color : this._model.getOffscreenScreenColor(e) : new w(0, 0, 0, 1);
	}
	setPartColor(e, t, n, r, i, a, o, s) {
		if (a[e].color.r = t, a[e].color.g = n, a[e].color.b = r, a[e].color.a = i, a[e].isOverridden) {
			let c = this._model.getPartOffscreenIndices()[e];
			if (c == -1) {
				let c = this._model.getPartsHierarchy();
				if (c && c[e]) for (let l = 0; l < c[e].objects.length; ++l) {
					let u = c[e].objects[l];
					if (u.objectType === dr.CubismModelObjectType_Drawable) {
						let e = u.objectIndex;
						o[e].color.r = t, o[e].color.g = n, o[e].color.b = r, o[e].color.a = i;
					} else {
						let e = u.objectIndex;
						this.setPartColor(e, t, n, r, i, a, o, s);
					}
				}
			} else s[c].color.r = t, s[c].color.g = n, s[c].color.b = r, s[c].color.a = i;
		}
	}
	setPartColorEnabled(e, t, n, r, i) {
		n[e].isOverridden = t;
		let a = this._model.getPartOffscreenIndices()[e];
		if (a == -1) {
			let a = this._model.getPartsHierarchy();
			if (a && a[e]) for (let o = 0; o < a[e].objects.length; ++o) {
				let s = a[e].objects[o];
				if (s.objectType === dr.CubismModelObjectType_Drawable) {
					let i = s.objectIndex;
					r[i].isOverridden = t, t && (r[i].color.r = n[e].color.r, r[i].color.g = n[e].color.g, r[i].color.b = n[e].color.b, r[i].color.a = n[e].color.a);
				} else {
					let a = s.objectIndex;
					t && (n[a].color.r = n[e].color.r, n[a].color.g = n[e].color.g, n[a].color.b = n[e].color.b, n[a].color.a = n[e].color.a), this.setPartColorEnabled(a, t, n, r, i);
				}
			}
		} else i[a].isOverridden = t, t && (i[a].color.r = n[e].color.r, i[a].color.g = n[e].color.g, i[a].color.b = n[e].color.b, i[a].color.a = n[e].color.a);
	}
}, q;
(function(e) {
	e[e.ColorBlend_None = -1] = "ColorBlend_None", e[e.ColorBlend_Normal = Live2DCubismCore.ColorBlendType_Normal] = "ColorBlend_Normal", e[e.ColorBlend_AddGlow = Live2DCubismCore.ColorBlendType_AddGlow] = "ColorBlend_AddGlow", e[e.ColorBlend_Add = Live2DCubismCore.ColorBlendType_Add] = "ColorBlend_Add", e[e.ColorBlend_Darken = Live2DCubismCore.ColorBlendType_Darken] = "ColorBlend_Darken", e[e.ColorBlend_Multiply = Live2DCubismCore.ColorBlendType_Multiply] = "ColorBlend_Multiply", e[e.ColorBlend_ColorBurn = Live2DCubismCore.ColorBlendType_ColorBurn] = "ColorBlend_ColorBurn", e[e.ColorBlend_LinearBurn = Live2DCubismCore.ColorBlendType_LinearBurn] = "ColorBlend_LinearBurn", e[e.ColorBlend_Lighten = Live2DCubismCore.ColorBlendType_Lighten] = "ColorBlend_Lighten", e[e.ColorBlend_Screen = Live2DCubismCore.ColorBlendType_Screen] = "ColorBlend_Screen", e[e.ColorBlend_ColorDodge = Live2DCubismCore.ColorBlendType_ColorDodge] = "ColorBlend_ColorDodge", e[e.ColorBlend_Overlay = Live2DCubismCore.ColorBlendType_Overlay] = "ColorBlend_Overlay", e[e.ColorBlend_SoftLight = Live2DCubismCore.ColorBlendType_SoftLight] = "ColorBlend_SoftLight", e[e.ColorBlend_HardLight = Live2DCubismCore.ColorBlendType_HardLight] = "ColorBlend_HardLight", e[e.ColorBlend_LinearLight = Live2DCubismCore.ColorBlendType_LinearLight] = "ColorBlend_LinearLight", e[e.ColorBlend_Hue = Live2DCubismCore.ColorBlendType_Hue] = "ColorBlend_Hue", e[e.ColorBlend_Color = Live2DCubismCore.ColorBlendType_Color] = "ColorBlend_Color", e[e.ColorBlend_AddCompatible = Live2DCubismCore.ColorBlendType_AddCompatible] = "ColorBlend_AddCompatible", e[e.ColorBlend_MultiplyCompatible = Live2DCubismCore.ColorBlendType_MultiplyCompatible] = "ColorBlend_MultiplyCompatible";
})(q ||= {});
var J;
(function(e) {
	e[e.AlphaBlend_None = -1] = "AlphaBlend_None", e[e.AlphaBlend_Over = 0] = "AlphaBlend_Over", e[e.AlphaBlend_Atop = 1] = "AlphaBlend_Atop", e[e.AlphaBlend_Out = 2] = "AlphaBlend_Out", e[e.AlphaBlend_ConjointOver = 3] = "AlphaBlend_ConjointOver", e[e.AlphaBlend_DisjointOver = 4] = "AlphaBlend_DisjointOver";
})(J ||= {});
var dr;
(function(e) {
	e[e.CubismModelObjectType_Drawable = 0] = "CubismModelObjectType_Drawable", e[e.CubismModelObjectType_Parts = 1] = "CubismModelObjectType_Parts";
})(dr ||= {});
var fr = class {
	constructor(e = !1, t = !1) {
		this.isOverridden = e, this.isParameterRepeated = t;
	}
	isOverridden;
	isParameterRepeated;
}, pr = class {
	constructor(e = !1, t = !1) {
		this.isOverridden = e, this.isCulling = t;
	}
	isOverridden;
	isCulling;
}, mr = class {
	drawableIndices;
	offscreenIndices;
	constructor(e = [], t = []) {
		this.drawableIndices = e, this.offscreenIndices = t;
	}
}, hr = class {
	objectType;
	objectIndex;
	constructor(e, t) {
		this.objectIndex = e, this.objectType = t;
	}
}, gr = class {
	objects;
	childDrawObjects;
	constructor(e = [], t = new mr()) {
		this.objects = e, this.childDrawObjects = t;
	}
	getChildObjectCount() {
		return this.objects.length;
	}
}, _r = class {
	update() {
		this._model.update(), this._model.drawables.resetDynamicFlags();
	}
	getPixelsPerUnit() {
		return this._model == null ? 0 : this._model.canvasinfo.PixelsPerUnit;
	}
	getCanvasWidth() {
		return this._model == null ? 0 : this._model.canvasinfo.CanvasWidth / this._model.canvasinfo.PixelsPerUnit;
	}
	getCanvasHeight() {
		return this._model == null ? 0 : this._model.canvasinfo.CanvasHeight / this._model.canvasinfo.PixelsPerUnit;
	}
	saveParameters() {
		let e = this._model.parameters.count, t = this._savedParameters.length;
		for (let n = 0; n < e; ++n) n < t ? this._savedParameters[n] = this._parameterValues[n] : this._savedParameters.push(this._parameterValues[n]);
	}
	getOverrideMultiplyAndScreenColor() {
		return this._overrideMultiplyAndScreenColor;
	}
	getOverrideFlagForModelParameterRepeat() {
		return this._isOverriddenParameterRepeat;
	}
	setOverrideFlagForModelParameterRepeat(e) {
		this._isOverriddenParameterRepeat = e;
	}
	getOverrideFlagForParameterRepeat(e) {
		return this._userParameterRepeatDataList[e].isOverridden;
	}
	setOverrideFlagForParameterRepeat(e, t) {
		this._userParameterRepeatDataList[e].isOverridden = t;
	}
	getRepeatFlagForParameterRepeat(e) {
		return this._userParameterRepeatDataList[e].isParameterRepeated;
	}
	setRepeatFlagForParameterRepeat(e, t) {
		this._userParameterRepeatDataList[e].isParameterRepeated = t;
	}
	getDrawableCulling(e) {
		if (this.getOverrideFlagForModelCullings() || this.getOverrideFlagForDrawableCullings(e)) return this._userDrawableCullings[e].isCulling;
		let t = this._model.drawables.constantFlags;
		return !Live2DCubismCore.Utils.hasIsDoubleSidedBit(t[e]);
	}
	setDrawableCulling(e, t) {
		this._userDrawableCullings[e].isCulling = t;
	}
	getOffscreenCulling(e) {
		if (this.getOverrideFlagForModelCullings() || this.getOverrideFlagForOffscreenCullings(e)) return this._userOffscreenCullings[e].isCulling;
		let t = this._model.offscreens.constantFlags;
		return !Live2DCubismCore.Utils.hasIsDoubleSidedBit(t[e]);
	}
	setOffscreenCulling(e, t) {
		this._userOffscreenCullings[e].isCulling = t;
	}
	getOverrideFlagForModelCullings() {
		return this._isOverriddenCullings;
	}
	setOverrideFlagForModelCullings(e) {
		this._isOverriddenCullings = e;
	}
	getOverrideFlagForDrawableCullings(e) {
		return this._userDrawableCullings[e].isOverridden;
	}
	getOverrideFlagForOffscreenCullings(e) {
		return this._userOffscreenCullings[e].isOverridden;
	}
	setOverrideFlagForDrawableCullings(e, t) {
		this._userDrawableCullings[e].isOverridden = t;
	}
	getModelOapcity() {
		return this._modelOpacity;
	}
	setModelOapcity(e) {
		this._modelOpacity = e;
	}
	getModel() {
		return this._model;
	}
	getPartIndex(e) {
		let t, n = this._model.parts.count;
		for (t = 0; t < n; ++t) if (e == this._partIds[t]) return t;
		return this._notExistPartId.has(e) ? this._notExistPartId.get(e) : (t = n + this._notExistPartId.size, this._notExistPartId.set(e, t), this._notExistPartOpacities.set(t, null), t);
	}
	getPartId(e) {
		let t = this._model.parts.ids[e];
		return j.getIdManager().getId(t);
	}
	getPartCount() {
		return this._model.parts.count;
	}
	getPartOffscreenIndices() {
		return this._model.parts.offscreenIndices;
	}
	getPartParentPartIndices() {
		return this._model.parts.parentIndices;
	}
	setPartOpacityByIndex(e, t) {
		if (this._notExistPartOpacities.has(e)) {
			this._notExistPartOpacities.set(e, t);
			return;
		}
		m(0 <= e && e < this.getPartCount()), this._partOpacities[e] = t;
	}
	setPartOpacityById(e, t) {
		let n = this.getPartIndex(e);
		n < 0 || this.setPartOpacityByIndex(n, t);
	}
	getPartOpacityByIndex(e) {
		return this._notExistPartOpacities.has(e) ? this._notExistPartOpacities.get(e) : (m(0 <= e && e < this.getPartCount()), this._partOpacities[e]);
	}
	getPartOpacityById(e) {
		let t = this.getPartIndex(e);
		return t < 0 ? 0 : this.getPartOpacityByIndex(t);
	}
	getParameterIndex(e) {
		let t, n = this._model.parameters.count;
		for (t = 0; t < n; ++t) if (e == this._parameterIds[t]) return t;
		return this._notExistParameterId.has(e) ? this._notExistParameterId.get(e) : (t = this._model.parameters.count + this._notExistParameterId.size, this._notExistParameterId.set(e, t), this._notExistParameterValues.set(t, null), t);
	}
	getParameterCount() {
		return this._model.parameters.count;
	}
	getParameterType(e) {
		return this._model.parameters.types[e];
	}
	getParameterMaximumValue(e) {
		return this._model.parameters.maximumValues[e];
	}
	getParameterMinimumValue(e) {
		return this._model.parameters.minimumValues[e];
	}
	getParameterDefaultValue(e) {
		return this._model.parameters.defaultValues[e];
	}
	getParameterId(e) {
		return j.getIdManager().getId(this._model.parameters.ids[e]);
	}
	getParameterValueByIndex(e) {
		return this._notExistParameterValues.has(e) ? this._notExistParameterValues.get(e) : (m(0 <= e && e < this.getParameterCount()), this._parameterValues[e]);
	}
	getParameterValueById(e) {
		let t = this.getParameterIndex(e);
		return this.getParameterValueByIndex(t);
	}
	setParameterValueByIndex(e, t, n = 1) {
		if (this._notExistParameterValues.has(e)) {
			this._notExistParameterValues.set(e, n == 1 ? t : this._notExistParameterValues.get(e) * (1 - n) + t * n);
			return;
		}
		m(0 <= e && e < this.getParameterCount()), t = this.isRepeat(e) ? this.getParameterRepeatValue(e, t) : this.getParameterClampValue(e, t), this._parameterValues[e] = n == 1 ? t : this._parameterValues[e] = this._parameterValues[e] * (1 - n) + t * n;
	}
	setParameterValueById(e, t, n = 1) {
		let r = this.getParameterIndex(e);
		this.setParameterValueByIndex(r, t, n);
	}
	addParameterValueByIndex(e, t, n = 1) {
		this.setParameterValueByIndex(e, this.getParameterValueByIndex(e) + t * n);
	}
	addParameterValueById(e, t, n = 1) {
		let r = this.getParameterIndex(e);
		this.addParameterValueByIndex(r, t, n);
	}
	isRepeat(e) {
		if (this._notExistParameterValues.has(e)) return !1;
		m(0 <= e && e < this.getParameterCount());
		let t;
		return t = this._isOverriddenParameterRepeat || this._userParameterRepeatDataList[e].isOverridden ? this._userParameterRepeatDataList[e].isParameterRepeated : this._model.parameters.repeats[e] != 0, t;
	}
	getParameterRepeatValue(e, t) {
		if (this._notExistParameterValues.has(e)) return t;
		m(0 <= e && e < this.getParameterCount());
		let n = this._model.parameters.maximumValues[e], r = this._model.parameters.minimumValues[e], i = n - r;
		if (n < t) {
			let e = o.mod(t - n, i);
			t = Number.isNaN(e) ? n : r + e;
		}
		if (t < r) {
			let e = o.mod(r - t, i);
			t = Number.isNaN(e) ? r : n - e;
		}
		return t;
	}
	getParameterClampValue(e, t) {
		if (this._notExistParameterValues.has(e)) return t;
		m(0 <= e && e < this.getParameterCount());
		let n = this._model.parameters.maximumValues[e], r = this._model.parameters.minimumValues[e];
		return o.clamp(t, r, n);
	}
	getParameterRepeats(e) {
		return this._model.parameters.repeats[e] != 0;
	}
	multiplyParameterValueById(e, t, n = 1) {
		let r = this.getParameterIndex(e);
		this.multiplyParameterValueByIndex(r, t, n);
	}
	multiplyParameterValueByIndex(e, t, n = 1) {
		this.setParameterValueByIndex(e, this.getParameterValueByIndex(e) * (1 + (t - 1) * n));
	}
	getDrawableIndex(e) {
		let t = this._model.drawables.count;
		for (let n = 0; n < t; ++n) if (this._drawableIds[n] == e) return n;
		return -1;
	}
	getDrawableCount() {
		return this._model.drawables.count;
	}
	getDrawableId(e) {
		let t = this._model.drawables.ids;
		return j.getIdManager().getId(t[e]);
	}
	getRenderOrders() {
		return this._model.getRenderOrders();
	}
	getDrawableTextureIndex(e) {
		return this._model.drawables.textureIndices[e];
	}
	getDrawableDynamicFlagVertexPositionsDidChange(e) {
		let t = this._model.drawables.dynamicFlags;
		return Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(t[e]);
	}
	getDrawableVertexIndexCount(e) {
		return this._model.drawables.indexCounts[e];
	}
	getDrawableVertexCount(e) {
		return this._model.drawables.vertexCounts[e];
	}
	getDrawableVertices(e) {
		return this.getDrawableVertexPositions(e);
	}
	getDrawableVertexIndices(e) {
		return this._model.drawables.indices[e];
	}
	getDrawableVertexPositions(e) {
		return this._model.drawables.vertexPositions[e];
	}
	getDrawableVertexUvs(e) {
		return this._model.drawables.vertexUvs[e];
	}
	getDrawableOpacity(e) {
		return this._model.drawables.opacities[e];
	}
	getDrawableMultiplyColor(e) {
		this._drawableMultiplyColors ?? (this._drawableMultiplyColors = Array(this._model.drawables.count), this._drawableMultiplyColors.fill(new w()));
		let t = this._model.drawables.multiplyColors, n = e * 4;
		return this._drawableMultiplyColors[e].r = t[n], this._drawableMultiplyColors[e].g = t[n + 1], this._drawableMultiplyColors[e].b = t[n + 2], this._drawableMultiplyColors[e].a = t[n + 3], this._drawableMultiplyColors[e];
	}
	getDrawableScreenColor(e) {
		this._drawableScreenColors ?? (this._drawableScreenColors = Array(this._model.drawables.count), this._drawableScreenColors.fill(new w()));
		let t = this._model.drawables.screenColors, n = e * 4;
		return this._drawableScreenColors[e].r = t[n], this._drawableScreenColors[e].g = t[n + 1], this._drawableScreenColors[e].b = t[n + 2], this._drawableScreenColors[e].a = t[n + 3], this._drawableScreenColors[e];
	}
	getOffscreenMultiplyColor(e) {
		this._offscreenMultiplyColors ?? (this._offscreenMultiplyColors = Array(this._model.offscreens.count), this._offscreenMultiplyColors.fill(new w()));
		let t = this._model.offscreens.multiplyColors, n = e * 4;
		return this._offscreenMultiplyColors[e].r = t[n], this._offscreenMultiplyColors[e].g = t[n + 1], this._offscreenMultiplyColors[e].b = t[n + 2], this._offscreenMultiplyColors[e].a = t[n + 3], this._offscreenMultiplyColors[e];
	}
	getOffscreenScreenColor(e) {
		this._offscreenScreenColors ?? (this._offscreenScreenColors = Array(this._model.offscreens.count), this._offscreenScreenColors.fill(new w()));
		let t = this._model.offscreens.screenColors, n = e * 4;
		return this._offscreenScreenColors[e].r = t[n], this._offscreenScreenColors[e].g = t[n + 1], this._offscreenScreenColors[e].b = t[n + 2], this._offscreenScreenColors[e].a = t[n + 3], this._offscreenScreenColors[e];
	}
	getDrawableParentPartIndex(e) {
		return this._model.drawables.parentPartIndices[e];
	}
	getDrawableBlendMode(e) {
		let t = this._model.drawables.constantFlags;
		return Live2DCubismCore.Utils.hasBlendAdditiveBit(t[e]) ? S.CubismBlendMode_Additive : Live2DCubismCore.Utils.hasBlendMultiplicativeBit(t[e]) ? S.CubismBlendMode_Multiplicative : S.CubismBlendMode_Normal;
	}
	getDrawableColorBlend(e) {
		return this._drawableColorBlends[e] == q.ColorBlend_None && (this._drawableColorBlends[e] = this._model.drawables.blendModes[e] & 255), this._drawableColorBlends[e];
	}
	getDrawableAlphaBlend(e) {
		return this._drawableAlphaBlends[e] == J.AlphaBlend_None && (this._drawableAlphaBlends[e] = this._model.drawables.blendModes[e] >> 8 & 255), this._drawableAlphaBlends[e];
	}
	getDrawableInvertedMaskBit(e) {
		let t = this._model.drawables.constantFlags;
		return Live2DCubismCore.Utils.hasIsInvertedMaskBit(t[e]);
	}
	getDrawableMasks() {
		return this._model.drawables.masks;
	}
	getDrawableMaskCounts() {
		return this._model.drawables.maskCounts;
	}
	isUsingMasking() {
		for (let e = 0; e < this._model.drawables.count; ++e) if (!(this._model.drawables.maskCounts[e] <= 0)) return !0;
		return !1;
	}
	isUsingMaskingForOffscreen() {
		for (let e = 0; e < this.getOffscreenCount(); ++e) if (!(this._model.offscreens.maskCounts[e] <= 0)) return !0;
		return !1;
	}
	getDrawableDynamicFlagIsVisible(e) {
		let t = this._model.drawables.dynamicFlags;
		return Live2DCubismCore.Utils.hasIsVisibleBit(t[e]);
	}
	getDrawableDynamicFlagVisibilityDidChange(e) {
		let t = this._model.drawables.dynamicFlags;
		return Live2DCubismCore.Utils.hasVisibilityDidChangeBit(t[e]);
	}
	getDrawableDynamicFlagOpacityDidChange(e) {
		let t = this._model.drawables.dynamicFlags;
		return Live2DCubismCore.Utils.hasOpacityDidChangeBit(t[e]);
	}
	getDrawableDynamicFlagRenderOrderDidChange(e) {
		let t = this._model.drawables.dynamicFlags;
		return Live2DCubismCore.Utils.hasRenderOrderDidChangeBit(t[e]);
	}
	getDrawableDynamicFlagBlendColorDidChange(e) {
		let t = this._model.drawables.dynamicFlags;
		return Live2DCubismCore.Utils.hasBlendColorDidChangeBit(t[e]);
	}
	getOffscreenCount() {
		return this._model.offscreens.count;
	}
	getOffscreenColorBlend(e) {
		return this._offscreenColorBlends[e] == q.ColorBlend_None && (this._offscreenColorBlends[e] = this._model.offscreens.blendModes[e] & 255), this._offscreenColorBlends[e];
	}
	getOffscreenAlphaBlend(e) {
		return this._offscreenAlphaBlends[e] == J.AlphaBlend_None && (this._offscreenAlphaBlends[e] = this._model.offscreens.blendModes[e] >> 8 & 255), this._offscreenAlphaBlends[e];
	}
	getOffscreenOwnerIndices() {
		return this._model.offscreens.ownerIndices;
	}
	getOffscreenOpacity(e) {
		return e < 0 || e >= this._model.offscreens.count ? 1 : this._model.offscreens.opacities[e];
	}
	getOffscreenMasks() {
		return this._model.offscreens.masks;
	}
	getOffscreenMaskCounts() {
		return this._model.offscreens.maskCounts;
	}
	getOffscreenInvertedMask(e) {
		let t = this._model.offscreens.constantFlags;
		return Live2DCubismCore.Utils.hasIsInvertedMaskBit(t[e]);
	}
	isBlendModeEnabled() {
		return this._isBlendModeEnabled;
	}
	loadParameters() {
		let e = this._model.parameters.count, t = this._savedParameters.length;
		e > t && (e = t);
		for (let t = 0; t < e; ++t) this._parameterValues[t] = this._savedParameters[t];
	}
	initialize() {
		m(this._model), this._parameterValues = this._model.parameters.values, this._partOpacities = this._model.parts.opacities, this._offscreenOpacities = this._model.offscreens.opacities, this._parameterMaximumValues = this._model.parameters.maximumValues, this._parameterMinimumValues = this._model.parameters.minimumValues;
		{
			let e = this._model.parameters.ids, t = this._model.parameters.count;
			this._parameterIds.length = t, this._userParameterRepeatDataList.length = t;
			for (let n = 0; n < t; ++n) this._parameterIds[n] = j.getIdManager().getId(e[n]), this._userParameterRepeatDataList[n] = new fr(!1, !1);
		}
		let e = this._model.parts.count;
		{
			let t = this._model.parts.ids;
			this._partIds.length = e;
			for (let n = 0; n < e; ++n) this._partIds[n] = j.getIdManager().getId(t[n]);
		}
		{
			let t = this._model.drawables.ids, n = this._model.drawables.count;
			this._userDrawableCullings.length = n;
			let r = new pr(!1, !1);
			this._userOffscreenCullings.length = this._model.offscreens.count;
			let i = new pr(!1, !1);
			for (let e = 0; e < n; ++e) this._drawableIds.push(j.getIdManager().getId(t[e])), this._userDrawableCullings[e] = r;
			for (let e = 0; e < this._model.offscreens.count; ++e) this._userOffscreenCullings[e] = i;
			if (this.getOffscreenCount() > 0) this._isBlendModeEnabled = !0;
			else {
				this._model.drawables.blendModes;
				for (let e = 0; e < n; ++e) {
					let t = this.getDrawableColorBlend(e), n = this.getDrawableAlphaBlend(e);
					if (!(t == q.ColorBlend_Normal && n == J.AlphaBlend_Over) && t != q.ColorBlend_AddCompatible && t != q.ColorBlend_MultiplyCompatible) {
						this._isBlendModeEnabled = !0;
						break;
					}
				}
			}
			this.setupPartsHierarchy();
			let a = this.getOffscreenCount();
			this._overrideMultiplyAndScreenColor.initialize(e, n, a);
		}
	}
	getPartsHierarchy() {
		return this._partsHierarchy;
	}
	setupPartsHierarchy() {
		this._partsHierarchy.length = 0;
		let e = this.getPartCount();
		this._partsHierarchy.length = e;
		for (let t = 0; t < e; ++t) {
			let e = new gr();
			this._partsHierarchy[t] = e;
		}
		for (let t = 0; t < e; ++t) {
			let e = this.getPartParentPartIndices()[t];
			if (e !== -1) {
				for (let n = 0; n < this._partsHierarchy.length; ++n) if (n === e) {
					let e = new hr(t, dr.CubismModelObjectType_Parts);
					this._partsHierarchy[n].objects.push(e);
					break;
				}
			}
		}
		let t = this.getDrawableCount();
		for (let e = 0; e < t; ++e) {
			let t = this.getDrawableParentPartIndex(e);
			if (t !== -1) {
				for (let n = 0; n < this._partsHierarchy.length; ++n) if (n === t) {
					let t = new hr(e, dr.CubismModelObjectType_Drawable);
					this._partsHierarchy[n].objects.push(t);
					break;
				}
			}
		}
		for (let e = 0; e < this._partsHierarchy.length; ++e) this.getPartChildDrawObjects(e);
	}
	getPartChildDrawObjects(e) {
		if (this._partsHierarchy[e].getChildObjectCount() < 1) return this._partsHierarchy[e].childDrawObjects;
		let t = this._partsHierarchy[e].childDrawObjects;
		if (t.drawableIndices.length !== 0 || t.offscreenIndices.length !== 0) return t;
		let n = this._partsHierarchy[e].objects;
		for (let e = 0; e < n.length; ++e) {
			let r = n[e];
			if (r.objectType === dr.CubismModelObjectType_Parts) {
				this.getPartChildDrawObjects(r.objectIndex);
				let e = this._partsHierarchy[r.objectIndex].childDrawObjects;
				t.drawableIndices.push(...e.drawableIndices), t.offscreenIndices.push(...e.offscreenIndices);
				let n = this.getOffscreenIndices(), i = n ? n[r.objectIndex] : -1;
				i !== -1 && t.offscreenIndices.push(i);
			} else r.objectType === dr.CubismModelObjectType_Drawable && t.drawableIndices.push(r.objectIndex);
		}
		return t;
	}
	getOffscreenIndices() {
		return this._model.parts.offscreenIndices;
	}
	constructor(e) {
		this._model = e, this._parameterValues = null, this._parameterMaximumValues = null, this._parameterMinimumValues = null, this._partOpacities = null, this._offscreenOpacities = null, this._savedParameters = [], this._parameterIds = [], this._drawableIds = [], this._partIds = [], this._isOverriddenParameterRepeat = !0, this._isOverriddenCullings = !1, this._modelOpacity = 1, this._overrideMultiplyAndScreenColor = new ur(this), this._isBlendModeEnabled = !1, this._drawableColorBlends = null, this._drawableAlphaBlends = null, this._offscreenColorBlends = null, this._offscreenAlphaBlends = null, this._drawableMultiplyColors = null, this._drawableScreenColors = null, this._offscreenMultiplyColors = null, this._offscreenScreenColors = null, this._userParameterRepeatDataList = [], this._userDrawableCullings = [], this._userOffscreenCullings = [], this._partsHierarchy = [], this._notExistPartId = /* @__PURE__ */ new Map(), this._notExistParameterId = /* @__PURE__ */ new Map(), this._notExistParameterValues = /* @__PURE__ */ new Map(), this._notExistPartOpacities = /* @__PURE__ */ new Map(), this._drawableColorBlends = Array(e.drawables.count).fill(q.ColorBlend_None), this._drawableAlphaBlends = Array(e.drawables.count).fill(J.AlphaBlend_None), this._offscreenColorBlends = Array(e.offscreens.count).fill(q.ColorBlend_None), this._offscreenAlphaBlends = Array(e.offscreens.count).fill(J.AlphaBlend_None);
	}
	release() {
		this._model.release(), this._model = null, this._drawableColorBlends = null, this._drawableAlphaBlends = null, this._offscreenColorBlends = null, this._offscreenAlphaBlends = null, this._drawableMultiplyColors = null, this._drawableScreenColors = null, this._offscreenMultiplyColors = null, this._offscreenScreenColors = null;
	}
	_notExistPartOpacities;
	_notExistPartId;
	_notExistParameterValues;
	_notExistParameterId;
	_savedParameters;
	_isOverriddenParameterRepeat;
	_overrideMultiplyAndScreenColor;
	_userParameterRepeatDataList;
	_partsHierarchy;
	_model;
	_parameterValues;
	_parameterMaximumValues;
	_parameterMinimumValues;
	_partOpacities;
	_offscreenOpacities;
	_modelOpacity;
	_parameterIds;
	_partIds;
	_drawableIds;
	_isOverriddenCullings;
	_userDrawableCullings;
	_userOffscreenCullings;
	_isBlendModeEnabled;
	_drawableColorBlends;
	_drawableAlphaBlends;
	_offscreenColorBlends;
	_offscreenAlphaBlends;
	_drawableMultiplyColors;
	_drawableScreenColors;
	_offscreenMultiplyColors;
	_offscreenScreenColors;
}, vr;
(function(e) {
	e.CubismModel = _r;
})(vr ||= {});
//#endregion
//#region vendor/compiled/Framework/src/rendering/cubismclippingmanager.js
var yr = 4, br = 36, xr = 32, Sr = class {
	constructor(e) {
		this._renderTextureCount = 0, this._clippingMaskBufferSize = 256, this._clippingContextListForMask = [], this._clippingContextListForDraw = [], this._clippingContextListForOffscreen = [], this._tmpBoundsOnModel = new u(), this._tmpMatrix = new c(), this._tmpMatrixForMask = new c(), this._tmpMatrixForDraw = new c(), this._clearedMaskBufferFlags = [], this._clippingContexttConstructor = e, this._channelColors = [
			new w(1, 0, 0, 0),
			new w(0, 1, 0, 0),
			new w(0, 0, 1, 0),
			new w(0, 0, 0, 1)
		];
	}
	release() {
		for (let e = 0; e < this._clippingContextListForMask.length; e++) this._clippingContextListForMask[e] && (this._clippingContextListForMask[e].release(), this._clippingContextListForMask[e] = void 0), this._clippingContextListForMask[e] = null;
		this._clippingContextListForMask = null;
		for (let e = 0; e < this._clippingContextListForDraw.length; e++) this._clippingContextListForDraw[e] = null;
		this._clippingContextListForDraw = null;
		for (let e = 0; e < this._channelColors.length; e++) this._channelColors[e] = null;
		this._channelColors = null, this._clearedMaskBufferFlags != null && (this._clearedMaskBufferFlags.length = 0), this._clearedMaskBufferFlags = null;
	}
	initializeForDrawable(e, t) {
		t % 1 != 0 && (_("The number of render textures must be specified as an integer. The decimal point is rounded down and corrected to an integer."), t = ~~t), t < 1 && _("The number of render textures must be an integer greater than or equal to 1. Set the number of render textures to 1."), this._renderTextureCount = t < 1 ? 1 : t, this._clearedMaskBufferFlags = Array(this._renderTextureCount), this._clippingContextListForDraw.length = e.getDrawableCount();
		for (let t = 0; t < e.getDrawableCount(); t++) {
			if (e.getDrawableMaskCounts()[t] <= 0) {
				this._clippingContextListForDraw[t] = null;
				continue;
			}
			let n = this.findSameClip(e.getDrawableMasks()[t], e.getDrawableMaskCounts()[t]);
			n ?? (n = new this._clippingContexttConstructor(this, e.getDrawableMasks()[t], e.getDrawableMaskCounts()[t]), this._clippingContextListForMask.push(n)), n.addClippedDrawable(t), this._clippingContextListForDraw[t] = n;
		}
	}
	initializeForOffscreen(e, t) {
		this._renderTextureCount = t, this._clearedMaskBufferFlags.length = this._renderTextureCount;
		for (let e = 0; e < this._renderTextureCount; ++e) this._clearedMaskBufferFlags[e] = !1;
		this._clippingContextListForOffscreen.length = e.getOffscreenCount();
		for (let t = 0; t < e.getOffscreenCount(); ++t) {
			if (e.getOffscreenMaskCounts()[t] <= 0) {
				this._clippingContextListForOffscreen.push(null);
				continue;
			}
			let n = this.findSameClip(e.getOffscreenMasks()[t], e.getOffscreenMaskCounts()[t]);
			n ?? (n = new this._clippingContexttConstructor(this, e.getOffscreenMasks()[t], e.getOffscreenMaskCounts()[t]), this._clippingContextListForMask.push(n)), n.addClippedOffscreen(t), this._clippingContextListForOffscreen[t] = n;
		}
	}
	findSameClip(e, t) {
		for (let n = 0; n < this._clippingContextListForMask.length; n++) {
			let r = this._clippingContextListForMask[n], i = r._clippingIdCount;
			if (i != t) continue;
			let a = 0;
			for (let t = 0; t < i; t++) {
				let n = r._clippingIdList[t];
				for (let t = 0; t < i; t++) if (e[t] == n) {
					a++;
					break;
				}
			}
			if (a == i) return r;
		}
		return null;
	}
	setupMatrixForHighPrecision(e, t) {
		let n = 0;
		for (let t = 0; t < this._clippingContextListForMask.length; t++) {
			let r = this._clippingContextListForMask[t];
			this.calcClippedDrawableTotalBounds(e, r), r._isUsing && n++;
		}
		if (n > 0) {
			if (this.setupLayoutBounds(0), this._clearedMaskBufferFlags.length != this._renderTextureCount) {
				this._clearedMaskBufferFlags.length = this._renderTextureCount;
				for (let e = 0; e < this._renderTextureCount; e++) this._clearedMaskBufferFlags[e] = !1;
			} else for (let e = 0; e < this._renderTextureCount; e++) this._clearedMaskBufferFlags[e] = !1;
			for (let n = 0; n < this._clippingContextListForMask.length; n++) {
				let r = this._clippingContextListForMask[n], i = r._allClippedDrawRect, a = r._layoutBounds, o = .05, s = 0, c = 0, l = e.getPixelsPerUnit(), u = r.getClippingManager().getClippingMaskBufferSize(), d = a.width * u, f = a.height * u;
				this._tmpBoundsOnModel.setRect(i), this._tmpBoundsOnModel.width * l > d ? (this._tmpBoundsOnModel.expand(i.width * o, 0), s = a.width / this._tmpBoundsOnModel.width) : s = l / d, this._tmpBoundsOnModel.height * l > f ? (this._tmpBoundsOnModel.expand(0, i.height * o), c = a.height / this._tmpBoundsOnModel.height) : c = l / f, this.createMatrixForMask(t, a, s, c), r._matrixForMask.setMatrix(this._tmpMatrixForMask.getArray()), r._matrixForDraw.setMatrix(this._tmpMatrixForDraw.getArray());
			}
		}
	}
	setupMatrixForOffscreenHighPrecision(e, t, n) {
		let r = 0;
		for (let t = 0; t < this._clippingContextListForMask.length; t++) {
			let n = this._clippingContextListForMask[t];
			this.calcClippedOffscreenTotalBounds(e, n), n._isUsing && r++;
		}
		if (!(r <= 0)) {
			if (this.setupLayoutBounds(0), this._clearedMaskBufferFlags.length != this._renderTextureCount) {
				this._clearedMaskBufferFlags.length = this._renderTextureCount;
				for (let e = 0; e < this._renderTextureCount; ++e) this._clearedMaskBufferFlags[e] = !1;
			} else for (let e = 0; e < this._renderTextureCount; ++e) this._clearedMaskBufferFlags[e] = !1;
			for (let r = 0; r < this._clippingContextListForMask.length; r++) {
				let i = this._clippingContextListForMask[r], a = i._allClippedDrawRect, o = i._layoutBounds, s = .05, c = 0, l = 0, u = e.getPixelsPerUnit(), d = i.getClippingManager().getClippingMaskBufferSize(), f = o.width * d, p = o.height * d;
				this._tmpBoundsOnModel.setRect(a), this._tmpBoundsOnModel.width * u > f ? (this._tmpBoundsOnModel.expand(a.width * s, 0), c = o.width / this._tmpBoundsOnModel.width) : c = u / f, this._tmpBoundsOnModel.height * u > p ? (this._tmpBoundsOnModel.expand(0, a.height * s), l = o.height / this._tmpBoundsOnModel.height) : l = u / p, this.createMatrixForMask(t, o, c, l), i._matrixForMask.setMatrix(this._tmpMatrixForMask.getArray()), i._matrixForDraw.setMatrix(this._tmpMatrixForDraw.getArray());
				let m = n.getInvert();
				i._matrixForDraw.multiplyByMatrix(m);
			}
		}
	}
	calcClippedOffscreenTotalBounds(e, t) {
		let n = Number.MAX_VALUE, r = Number.MAX_VALUE, i = -Number.MAX_VALUE, a = -Number.MAX_VALUE, o = t._clippedOffscreenIndexList.length, s = [];
		for (let n = 0; n < o; n++) {
			let r = t._clippedOffscreenIndexList[n];
			this.getOffscreenChildDrawableIndexList(e, r, s);
		}
		let c = s.length;
		for (let t = 0; t < c; t++) {
			let o = e.getDrawableVertexCount(s[t]), c = e.getDrawableVertices(s[t]), l = Number.MAX_VALUE, u = Number.MAX_VALUE, d = -Number.MAX_VALUE, f = -Number.MAX_VALUE, p = o * A.vertexStep;
			for (let e = A.vertexOffset; e < p; e += A.vertexStep) {
				let t = c[e], n = c[e + 1];
				t < l && (l = t), t > d && (d = t), n < u && (u = n), n > f && (f = n);
			}
			l != Number.MAX_VALUE && (l < n && (n = l), u < r && (r = u), d > i && (i = d), f > a && (a = f));
		}
		if (n == Number.MAX_VALUE) t._allClippedDrawRect.x = 0, t._allClippedDrawRect.y = 0, t._allClippedDrawRect.width = 0, t._allClippedDrawRect.height = 0, t._isUsing = !1;
		else {
			t._isUsing = !0;
			let e = i - n, o = a - r;
			t._allClippedDrawRect.x = n, t._allClippedDrawRect.y = r, t._allClippedDrawRect.width = e, t._allClippedDrawRect.height = o;
		}
	}
	getOffscreenChildDrawableIndexList(e, t, n) {
		let r = e.getOffscreenOwnerIndices()[t];
		this.getPartChildDrawableIndexList(e, r, n);
	}
	getPartChildDrawableIndexList(e, t, n) {
		let r = e.getPartsHierarchy()[t].childDrawObjects;
		n.push(...r.drawableIndices);
		for (let t = 0; t < r.offscreenIndices.length; ++t) this.getOffscreenChildDrawableIndexList(e, r.offscreenIndices[t], n);
	}
	createMatrixForMask(e, t, n, r) {
		this._tmpMatrix.loadIdentity(), this._tmpMatrix.translateRelative(-1, -1), this._tmpMatrix.scaleRelative(2, 2), this._tmpMatrix.translateRelative(t.x, t.y), this._tmpMatrix.scaleRelative(n, r), this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y), this._tmpMatrixForMask.setMatrix(this._tmpMatrix.getArray()), this._tmpMatrix.loadIdentity(), this._tmpMatrix.translateRelative(t.x, t.y * (e ? -1 : 1)), this._tmpMatrix.scaleRelative(n, r * (e ? -1 : 1)), this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y), this._tmpMatrixForDraw.setMatrix(this._tmpMatrix.getArray());
	}
	setupLayoutBounds(e) {
		let t = this._renderTextureCount <= 1 ? br : xr * this._renderTextureCount;
		if (e <= 0 || e > t) {
			e > t && v("not supported mask count : {0}\n[Details] render texture count : {1}, mask count : {2}", e - t, this._renderTextureCount, e);
			for (let e = 0; e < this._clippingContextListForMask.length; e++) {
				let t = this._clippingContextListForMask[e];
				t._layoutChannelIndex = 0, t._layoutBounds.x = 0, t._layoutBounds.y = 0, t._layoutBounds.width = 1, t._layoutBounds.height = 1, t._bufferIndex = 0;
			}
			return;
		}
		let n = this._renderTextureCount <= 1 ? 9 : 8, r = e / this._renderTextureCount, i = e % this._renderTextureCount;
		r = Math.ceil(r);
		let a = r / yr, o = r % yr;
		a = ~~a;
		let s = 0;
		for (let r = 0; r < this._renderTextureCount; r++) for (let c = 0; c < yr; c++) {
			let l = a + +(c < o), u = o + (a < 1 ? -1 : 0);
			if (c == u && i > 0 && (l -= r < i ? 0 : 1), l != 0) if (l == 1) {
				let e = this._clippingContextListForMask[s++];
				e._layoutChannelIndex = c, e._layoutBounds.x = 0, e._layoutBounds.y = 0, e._layoutBounds.width = 1, e._layoutBounds.height = 1, e._bufferIndex = r;
			} else if (l == 2) for (let e = 0; e < l; e++) {
				let t = e % 2;
				t = ~~t;
				let n = this._clippingContextListForMask[s++];
				n._layoutChannelIndex = c, n._layoutBounds.x = t * .5, n._layoutBounds.y = 0, n._layoutBounds.width = .5, n._layoutBounds.height = 1, n._bufferIndex = r;
			}
			else if (l <= 4) for (let e = 0; e < l; e++) {
				let t = e % 2, n = e / 2;
				t = ~~t, n = ~~n;
				let i = this._clippingContextListForMask[s++];
				i._layoutChannelIndex = c, i._layoutBounds.x = t * .5, i._layoutBounds.y = n * .5, i._layoutBounds.width = .5, i._layoutBounds.height = .5, i._bufferIndex = r;
			}
			else if (l <= n) for (let e = 0; e < l; e++) {
				let t = e % 3, n = e / 3;
				t = ~~t, n = ~~n;
				let i = this._clippingContextListForMask[s++];
				i._layoutChannelIndex = c, i._layoutBounds.x = t / 3, i._layoutBounds.y = n / 3, i._layoutBounds.width = 1 / 3, i._layoutBounds.height = 1 / 3, i._bufferIndex = r;
			}
			else {
				v("not supported mask count : {0}\n[Details] render texture count : {1}, mask count : {2}", e - t, this._renderTextureCount, e);
				for (let e = 0; e < l; e++) {
					let e = this._clippingContextListForMask[s++];
					e._layoutChannelIndex = 0, e._layoutBounds.x = 0, e._layoutBounds.y = 0, e._layoutBounds.width = 1, e._layoutBounds.height = 1, e._bufferIndex = 0;
				}
			}
		}
	}
	calcClippedDrawableTotalBounds(e, t) {
		let n = Number.MAX_VALUE, r = Number.MAX_VALUE, i = Number.MIN_VALUE, a = Number.MIN_VALUE, o = t._clippedDrawableIndexList.length;
		for (let s = 0; s < o; s++) {
			let o = t._clippedDrawableIndexList[s], c = e.getDrawableVertexCount(o), l = e.getDrawableVertices(o), u = Number.MAX_VALUE, d = Number.MAX_VALUE, f = -Number.MAX_VALUE, p = -Number.MAX_VALUE, m = c * A.vertexStep;
			for (let e = A.vertexOffset; e < m; e += A.vertexStep) {
				let t = l[e], n = l[e + 1];
				t < u && (u = t), t > f && (f = t), n < d && (d = n), n > p && (p = n);
			}
			if (u != Number.MAX_VALUE) if (u < n && (n = u), d < r && (r = d), f > i && (i = f), p > a && (a = p), n == Number.MAX_VALUE) t._allClippedDrawRect.x = 0, t._allClippedDrawRect.y = 0, t._allClippedDrawRect.width = 0, t._allClippedDrawRect.height = 0, t._isUsing = !1;
			else {
				t._isUsing = !0;
				let e = i - n, o = a - r;
				t._allClippedDrawRect.x = n, t._allClippedDrawRect.y = r, t._allClippedDrawRect.width = e, t._allClippedDrawRect.height = o;
			}
		}
	}
	getClippingContextListForDraw() {
		return this._clippingContextListForDraw;
	}
	getClippingContextListForOffscreen() {
		return this._clippingContextListForOffscreen;
	}
	getClippingMaskBufferSize() {
		return this._clippingMaskBufferSize;
	}
	getRenderTextureCount() {
		return this._renderTextureCount;
	}
	getChannelFlagAsColor(e) {
		return this._channelColors[e];
	}
	setClippingMaskBufferSize(e) {
		this._clippingMaskBufferSize = e;
	}
	_clearedMaskBufferFlags;
	_channelColors;
	_clippingContextListForMask;
	_clippingContextListForDraw;
	_clippingContextListForOffscreen;
	_clippingMaskBufferSize;
	_renderTextureCount;
	_tmpMatrix;
	_tmpMatrixForMask;
	_tmpMatrixForDraw;
	_tmpBoundsOnModel;
	_clippingContexttConstructor;
}, Y = class {
	static copyBuffer(e, t, n) {
		if (t == null || n == null) return;
		if (!(e instanceof WebGL2RenderingContext)) throw Error("WebGL2RenderingContext is required for buffer copy.");
		let r = e.getParameter(e.FRAMEBUFFER_BINDING);
		e.bindFramebuffer(e.READ_FRAMEBUFFER, t.getRenderTexture()), e.bindFramebuffer(e.DRAW_FRAMEBUFFER, n.getRenderTexture()), e.blitFramebuffer(0, 0, t.getBufferWidth(), t.getBufferHeight(), 0, 0, n.getBufferWidth(), n.getBufferHeight(), e.COLOR_BUFFER_BIT, e.NEAREST), e.bindFramebuffer(e.FRAMEBUFFER, r);
	}
	beginDraw(e = null) {
		if (this._renderTexture == null) {
			console.error("_renderTexture is null");
			return;
		}
		e == null ? this._oldFbo = this._gl.getParameter(this._gl.FRAMEBUFFER_BINDING) : this._oldFbo = e, this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._renderTexture);
	}
	endDraw() {
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._oldFbo);
	}
	clear(e, t, n, r) {
		this._gl.clearColor(e, t, n, r), this._gl.clear(this._gl.COLOR_BUFFER_BIT);
	}
	createRenderTarget(e, t, n, r) {
		this.destroyRenderTarget(), this._colorBuffer = e.createTexture(), e.bindTexture(e.TEXTURE_2D, this._colorBuffer), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, t, n, 0, e.RGBA, e.UNSIGNED_BYTE, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.bindTexture(e.TEXTURE_2D, null);
		let i = e.createFramebuffer();
		return i == null ? (v("Failed to create framebuffer"), !1) : (e.bindFramebuffer(e.FRAMEBUFFER, i), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, this._colorBuffer, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) === e.FRAMEBUFFER_COMPLETE ? (this._renderTexture = i, this._bufferWidth = t, this._bufferHeight = n, this._gl = e, !0) : (v("Framebuffer is not complete"), e.bindFramebuffer(e.FRAMEBUFFER, r), e.deleteFramebuffer(i), this.destroyRenderTarget(), !1));
	}
	destroyRenderTarget() {
		this._colorBuffer &&= (this._gl.bindTexture(this._gl.TEXTURE_2D, null), this._gl.deleteTexture(this._colorBuffer), null), this._renderTexture &&= (this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null), this._gl.deleteFramebuffer(this._renderTexture), null);
	}
	getGL() {
		return this._gl;
	}
	getRenderTexture() {
		return this._renderTexture;
	}
	getColorBuffer() {
		return this._colorBuffer;
	}
	getBufferWidth() {
		return this._bufferWidth;
	}
	getBufferHeight() {
		return this._bufferHeight;
	}
	isValid() {
		return this._renderTexture != null;
	}
	getOldFBO() {
		return this._oldFbo;
	}
	constructor() {
		this._gl = null, this._colorBuffer = null, this._renderTexture = null, this._bufferWidth = 0, this._bufferHeight = 0, this._oldFbo = null;
	}
	_gl;
	_colorBuffer;
	_renderTexture;
	_bufferWidth;
	_bufferHeight;
	_oldFbo;
}, Cr;
(function(e) {
	e.CubismOffscreenSurface_WebGL = Y;
})(Cr ||= {});
//#endregion
//#region vendor/compiled/Framework/src/rendering/cubismshader_webgl.js
var wr = "vertshadersrc.vert", Tr = "vertshadersrcmasked.vert", Er = "vertshadersrcsetupmask.vert", Dr = "fragshadersrcsetupmask.frag", Or = "fragshadersrcpremultipliedalpha.frag", kr = "fragshadersrcmaskpremultipliedalpha.frag", Ar = "fragshadersrcmaskinvertedpremultipliedalpha.frag", jr = "vertshadersrccopy.vert", Mr = "fragshadersrccopy.frag", Nr = "fragshadersrccolorblend.frag", Pr = "fragshadersrcalphablend.frag", Fr = "vertshadersrcblend.vert", Ir = "fragshadersrcpremultipliedalphablend.frag", Lr = "ColorBlend_", Rr = "AlphaBlend_", zr, Br = new Float32Array([
	-1,
	-1,
	1,
	-1,
	-1,
	1,
	1,
	1
]), Vr = new Float32Array([
	0,
	0,
	1,
	0,
	0,
	1,
	1,
	1
]), Hr = new Float32Array([
	0,
	1,
	1,
	1,
	0,
	0,
	1,
	0
]), Ur = class {
	async loadShader(e) {
		return await (await fetch(e)).text();
	}
	async loadShaders() {
		let e = this._shaderPath ?? this._defaultShaderPath, t = [
			{
				path: e + wr,
				prop: "_vertShaderSrc"
			},
			{
				path: e + Tr,
				prop: "_vertShaderSrcMasked"
			},
			{
				path: e + Er,
				prop: "_vertShaderSrcSetupMask"
			},
			{
				path: e + Dr,
				prop: "_fragShaderSrcSetupMask"
			},
			{
				path: e + Or,
				prop: "_fragShaderSrcPremultipliedAlpha"
			},
			{
				path: e + kr,
				prop: "_fragShaderSrcMaskPremultipliedAlpha"
			},
			{
				path: e + Ar,
				prop: "_fragShaderSrcMaskInvertedPremultipliedAlpha"
			},
			{
				path: e + jr,
				prop: "_vertShaderSrcCopy"
			},
			{
				path: e + Mr,
				prop: "_fragShaderSrcCopy"
			},
			{
				path: e + Nr,
				prop: "_fragShaderSrcColorBlend"
			},
			{
				path: e + Pr,
				prop: "_fragShaderSrcAlphaBlend"
			},
			{
				path: e + Fr,
				prop: "_vertShaderSrcBlend"
			},
			{
				path: e + Ir,
				prop: "_fragShaderSrcBlend"
			}
		];
		(await Promise.all(t.map((e) => this.loadShader(e.path).then((t) => ({
			prop: e.prop,
			data: t
		})).catch((t) => (console.error(`Error loading ${e.path} shader:`, t), {
			prop: e.prop,
			data: ""
		}))))).forEach((e) => {
			this[e.prop] = e.data;
		});
	}
	constructor() {
		this._shaderSets = [], this._isShaderLoading = !1, this._isShaderLoaded = !1, this._colorBlendMap = /* @__PURE__ */ new Map(), this._colorBlendValues = [];
		let e = Object.keys(q), t = Object.keys(q).map((e) => q[e]);
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (r.includes(Lr)) {
				let e = r.slice(11), i = parseInt(t[n].toString());
				this._colorBlendMap.set(i, e), this._colorBlendValues.push(i);
			}
		}
		this._alphaBlendMap = /* @__PURE__ */ new Map(), this._alphaBlendValues = [];
		let n = Object.keys(J), r = Object.keys(J).map((e) => J[e]);
		for (let e = 0; e < n.length; e++) {
			let t = n[e];
			if (t.includes(Rr)) {
				let n = t.slice(11), i = parseInt(r[e].toString());
				this._alphaBlendMap.set(i, n), this._alphaBlendValues.push(i);
			}
		}
		this._blendShaderSetMap = /* @__PURE__ */ new Map(), this._shaderCount = Z.ShaderNames_ShaderCount + 1 + (this._colorBlendValues.length - 3) * (this._alphaBlendValues.length - 1) * 3, this._defaultShaderPath = "../../Framework/Shaders/WebGL/", this._shaderPath = this._defaultShaderPath;
	}
	release() {
		this.releaseShaderProgram();
	}
	setupShaderProgramForDrawable(e, t, n) {
		if (e.isPremultipliedAlpha() || v("NoPremultipliedAlpha is not allowed"), this._shaderSets.length == 0 && this.generateShaders(), this._isShaderLoaded == 0) {
			_("Shader program is not initialized.");
			return;
		}
		let r, i, a, o, s = e.getClippingContextBufferForDrawable() != null, c = t.getDrawableInvertedMaskBit(n), l = s ? c ? 2 : 1 : 0, u, d = !0;
		if (t.isBlendModeEnabled()) {
			let s = t.getDrawableColorBlend(n), c = t.getDrawableAlphaBlend(n);
			if (s == q.ColorBlend_None || c == J.AlphaBlend_None || s == q.ColorBlend_Normal && c == J.AlphaBlend_Over) u = this._shaderSets[Z.ShaderNames_NormalPremultipliedAlpha + l], r = this.gl.ONE, i = this.gl.ONE_MINUS_SRC_ALPHA, a = this.gl.ONE, o = this.gl.ONE_MINUS_SRC_ALPHA;
			else switch (s) {
				case q.ColorBlend_AddCompatible:
					u = this._shaderSets[Z.ShaderNames_AddPremultipliedAlpha + l], r = this.gl.ONE, i = this.gl.ONE, a = this.gl.ZERO, o = this.gl.ONE;
					break;
				case q.ColorBlend_MultiplyCompatible:
					u = this._shaderSets[Z.ShaderNames_MultPremultipliedAlpha + l], r = this.gl.DST_COLOR, i = this.gl.ONE_MINUS_SRC_ALPHA, a = this.gl.ZERO, o = this.gl.ONE;
					break;
				default:
					{
						let t = e._currentOffscreen == null ? e.getModelRenderTarget(0) : e._currentOffscreen;
						Y.copyBuffer(this.gl, t, e.getModelRenderTarget(1));
						let n = this._blendShaderSetMap.get(this._colorBlendMap.get(s) + this._alphaBlendMap.get(c));
						u = this._shaderSets[n + l], r = this.gl.ONE, i = this.gl.ZERO, a = this.gl.ONE, o = this.gl.ZERO, d = !1;
					}
					break;
			}
		} else switch (t.getDrawableBlendMode(n)) {
			case S.CubismBlendMode_Normal:
			default:
				u = this._shaderSets[Z.ShaderNames_NormalPremultipliedAlpha + l], r = this.gl.ONE, i = this.gl.ONE_MINUS_SRC_ALPHA, a = this.gl.ONE, o = this.gl.ONE_MINUS_SRC_ALPHA;
				break;
			case S.CubismBlendMode_Additive:
				u = this._shaderSets[Z.ShaderNames_AddPremultipliedAlpha + l], r = this.gl.ONE, i = this.gl.ONE, a = this.gl.ZERO, o = this.gl.ONE;
				break;
			case S.CubismBlendMode_Multiplicative:
				u = this._shaderSets[Z.ShaderNames_MultPremultipliedAlpha + l], r = this.gl.DST_COLOR, i = this.gl.ONE_MINUS_SRC_ALPHA, a = this.gl.ZERO, o = this.gl.ONE;
				break;
		}
		this.gl.useProgram(u.shaderProgram), e._bufferData.vertex ?? (e._bufferData.vertex = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e._bufferData.vertex);
		let f = t.getDrawableVertices(n);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, f, this.gl.DYNAMIC_DRAW), this.gl.enableVertexAttribArray(u.attributePositionLocation), this.gl.vertexAttribPointer(u.attributePositionLocation, 2, this.gl.FLOAT, !1, 0, 0), e._bufferData.uv ?? (e._bufferData.uv = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e._bufferData.uv);
		let p = t.getDrawableVertexUvs(n);
		if (this.gl.bufferData(this.gl.ARRAY_BUFFER, p, this.gl.DYNAMIC_DRAW), this.gl.enableVertexAttribArray(u.attributeTexCoordLocation), this.gl.vertexAttribPointer(u.attributeTexCoordLocation, 2, this.gl.FLOAT, !1, 0, 0), s) {
			this.gl.activeTexture(this.gl.TEXTURE1);
			let n = e.getDrawableMaskBuffer(e.getClippingContextBufferForDrawable()._bufferIndex).getColorBuffer();
			this.gl.bindTexture(this.gl.TEXTURE_2D, n), this.gl.uniform1i(u.samplerTexture1Location, 1), this.gl.uniformMatrix4fv(u.uniformClipMatrixLocation, !1, e.getClippingContextBufferForDrawable()._matrixForDraw.getArray());
			let r = e.getClippingContextBufferForDrawable()._layoutChannelIndex, i = e.getClippingContextBufferForDrawable().getClippingManager().getChannelFlagAsColor(r);
			this.gl.uniform4f(u.uniformChannelFlagLocation, i.r, i.g, i.b, i.a), t.isBlendModeEnabled() && this.gl.uniform1f(u.uniformInvertMaskFlagLocation, +!!c);
		}
		let m = t.getDrawableTextureIndex(n), h = e.getBindedTextures().get(m);
		this.gl.activeTexture(this.gl.TEXTURE0), this.gl.bindTexture(this.gl.TEXTURE_2D, h), this.gl.uniform1i(u.samplerTexture0Location, 0);
		let g = e.getMvpMatrix();
		this.gl.uniformMatrix4fv(u.uniformMatrixLocation, !1, g.getArray());
		let y = null;
		if (t.isBlendModeEnabled()) {
			let e = t.getDrawableOpacity(n);
			y = new w(e, e, e, e);
		} else y = e.getModelColorWithOpacity(t.getDrawableOpacity(n));
		let b = t.getOverrideMultiplyAndScreenColor(), x = b.getDrawableMultiplyColor(n), C = b.getDrawableScreenColor(n);
		if (this.gl.uniform4f(u.uniformBaseColorLocation, y.r, y.g, y.b, y.a), this.gl.uniform4f(u.uniformMultiplyColorLocation, x.r, x.g, x.b, x.a), this.gl.uniform4f(u.uniformScreenColorLocation, C.r, C.g, C.b, C.a), t.isBlendModeEnabled() && (this.gl.activeTexture(this.gl.TEXTURE2), !d)) {
			let t = e.getModelRenderTarget(1).getColorBuffer();
			this.gl.bindTexture(this.gl.TEXTURE_2D, t), this.gl.uniform1i(u.samplerFrameBufferTextureLocation, 2);
		}
		e._bufferData.index ?? (e._bufferData.index = this.gl.createBuffer());
		let T = t.getDrawableVertexIndices(n);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, e._bufferData.index), this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, T, this.gl.DYNAMIC_DRAW), this.gl.blendFuncSeparate(r, i, a, o);
	}
	setupShaderProgramForOffscreen(e, t, n) {
		if (e.isPremultipliedAlpha() || v("NoPremultipliedAlpha is not allowed"), this._shaderSets.length == 0 && this.generateShaders(), this._isShaderLoaded == 0) {
			_("Shader program is not initialized.");
			return;
		}
		let r, i, a, o, s = n.getOffscreenIndex(), l = e.getClippingContextBufferForOffscreen() != null, u = t.getOffscreenInvertedMask(s), d = l ? u ? 2 : 1 : 0, f, p = !0, m = t.getOffscreenColorBlend(s), h = t.getOffscreenAlphaBlend(s);
		if (m == q.ColorBlend_None || h == J.AlphaBlend_None || m == q.ColorBlend_Normal && h == J.AlphaBlend_Over) f = this._shaderSets[Z.ShaderNames_NormalPremultipliedAlpha + d], r = this.gl.ONE, i = this.gl.ONE_MINUS_SRC_ALPHA, a = this.gl.ONE, o = this.gl.ONE_MINUS_SRC_ALPHA;
		else switch (m) {
			case q.ColorBlend_AddCompatible:
				f = this._shaderSets[Z.ShaderNames_AddPremultipliedAlpha + d], r = this.gl.ONE, i = this.gl.ONE, a = this.gl.ZERO, o = this.gl.ONE;
				break;
			case q.ColorBlend_MultiplyCompatible:
				f = this._shaderSets[Z.ShaderNames_MultPremultipliedAlpha + d], r = this.gl.DST_COLOR, i = this.gl.ONE_MINUS_SRC_ALPHA, a = this.gl.ZERO, o = this.gl.ONE;
				break;
			default:
				{
					let t = n.getOldOffscreen() == null ? e.getModelRenderTarget(0) : n.getOldOffscreen();
					Y.copyBuffer(this.gl, t, e.getModelRenderTarget(1));
					let s = this._blendShaderSetMap.get(this._colorBlendMap.get(m) + this._alphaBlendMap.get(h));
					f = this._shaderSets[s + d], r = this.gl.ONE, i = this.gl.ZERO, a = this.gl.ONE, o = this.gl.ZERO, p = !1;
				}
				break;
		}
		this.gl.useProgram(f.shaderProgram), Y.copyBuffer(this.gl, n, e.getModelRenderTarget(2)), this.gl.activeTexture(this.gl.TEXTURE0);
		let g = e.getModelRenderTarget(2).getColorBuffer();
		this.gl.bindTexture(this.gl.TEXTURE_2D, g), this.gl.uniform1i(f.samplerTexture0Location, 0);
		let y = new c();
		y.loadIdentity(), this.gl.uniformMatrix4fv(f.uniformMatrixLocation, !1, y.getArray());
		let b = t.getOffscreenOpacity(s), x = new w(b, b, b, b), S = t.getOverrideMultiplyAndScreenColor(), C = S.getOffscreenMultiplyColor(s), T = S.getOffscreenScreenColor(s);
		if (this.gl.uniform4f(f.uniformBaseColorLocation, x.r, x.g, x.b, x.a), this.gl.uniform4f(f.uniformMultiplyColorLocation, C.r, C.g, C.b, C.a), this.gl.uniform4f(f.uniformScreenColorLocation, T.r, T.g, T.b, T.a), this.gl.activeTexture(this.gl.TEXTURE2), !p) {
			let t = e.getModelRenderTarget(1).getColorBuffer();
			this.gl.bindTexture(this.gl.TEXTURE_2D, t), this.gl.uniform1i(f.samplerFrameBufferTextureLocation, 2);
		}
		if (l) {
			this.gl.activeTexture(this.gl.TEXTURE1);
			let n = e.getOffscreenMaskBuffer(e.getClippingContextBufferForOffscreen()._bufferIndex).getColorBuffer();
			this.gl.bindTexture(this.gl.TEXTURE_2D, n), this.gl.uniform1i(f.samplerTexture1Location, 1), this.gl.uniformMatrix4fv(f.uniformClipMatrixLocation, !1, e.getClippingContextBufferForOffscreen()._matrixForDraw.getArray());
			let r = e.getClippingContextBufferForOffscreen()._layoutChannelIndex, i = e.getClippingContextBufferForOffscreen().getClippingManager().getChannelFlagAsColor(r);
			this.gl.uniform4f(f.uniformChannelFlagLocation, i.r, i.g, i.b, i.a), t.isBlendModeEnabled() && this.gl.uniform1f(f.uniformInvertMaskFlagLocation, +!!u);
		}
		e._bufferData.vertex || (e._bufferData.vertex = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e._bufferData.vertex), this.gl.bufferData(this.gl.ARRAY_BUFFER, Br, this.gl.STATIC_DRAW), this.gl.enableVertexAttribArray(f.attributePositionLocation), this.gl.vertexAttribPointer(f.attributePositionLocation, 2, this.gl.FLOAT, !1, Float32Array.BYTES_PER_ELEMENT * 2, 0), e._bufferData.uv || (e._bufferData.uv = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e._bufferData.uv), this.gl.bufferData(this.gl.ARRAY_BUFFER, Hr, this.gl.STATIC_DRAW), this.gl.enableVertexAttribArray(f.attributeTexCoordLocation), this.gl.vertexAttribPointer(f.attributeTexCoordLocation, 2, this.gl.FLOAT, !1, Float32Array.BYTES_PER_ELEMENT * 2, 0), this.gl.blendFuncSeparate(r, i, a, o);
	}
	setupShaderProgramForMask(e, t, n) {
		if (e.isPremultipliedAlpha() || v("NoPremultipliedAlpha is not allowed"), this._shaderSets.length == 0 && this.generateShaders(), this._isShaderLoaded == 0) {
			_("Shader program is not initialized.");
			return;
		}
		let r = this._shaderSets[Z.ShaderNames_SetupMask];
		this.gl.useProgram(r.shaderProgram), e._bufferData.vertex ?? (e._bufferData.vertex = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e._bufferData.vertex);
		let i = t.getDrawableVertices(n);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, i, this.gl.DYNAMIC_DRAW), this.gl.enableVertexAttribArray(r.attributePositionLocation), this.gl.vertexAttribPointer(r.attributePositionLocation, 2, this.gl.FLOAT, !1, 0, 0), e._bufferData.uv ?? (e._bufferData.uv = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e._bufferData.uv);
		let a = t.getDrawableTextureIndex(n), o = e.getBindedTextures().get(a);
		this.gl.activeTexture(this.gl.TEXTURE0), this.gl.bindTexture(this.gl.TEXTURE_2D, o), this.gl.uniform1i(r.samplerTexture0Location, 0), e._bufferData.uv ?? (e._bufferData.uv = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e._bufferData.uv);
		let s = t.getDrawableVertexUvs(n);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, s, this.gl.DYNAMIC_DRAW), this.gl.enableVertexAttribArray(r.attributeTexCoordLocation), this.gl.vertexAttribPointer(r.attributeTexCoordLocation, 2, this.gl.FLOAT, !1, 0, 0);
		let c = e.getClippingContextBufferForMask()._layoutChannelIndex, l = e.getClippingContextBufferForMask().getClippingManager().getChannelFlagAsColor(c);
		this.gl.uniform4f(r.uniformChannelFlagLocation, l.r, l.g, l.b, l.a), this.gl.uniformMatrix4fv(r.uniformClipMatrixLocation, !1, e.getClippingContextBufferForMask()._matrixForMask.getArray());
		let u = e.getClippingContextBufferForMask()._layoutBounds;
		this.gl.uniform4f(r.uniformBaseColorLocation, u.x * 2 - 1, u.y * 2 - 1, u.getRight() * 2 - 1, u.getBottom() * 2 - 1);
		let d = this.gl.ZERO, f = this.gl.ONE_MINUS_SRC_COLOR, p = this.gl.ZERO, m = this.gl.ONE_MINUS_SRC_ALPHA;
		e._bufferData.index ?? (e._bufferData.index = this.gl.createBuffer());
		let h = t.getDrawableVertexIndices(n);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, e._bufferData.index), this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, h, this.gl.DYNAMIC_DRAW), this.gl.blendFuncSeparate(d, f, p, m);
	}
	setupShaderProgramForOffscreenRenderTarget(e) {
		if (this._shaderSets.length == 0 && this.generateShaders(), this._isShaderLoaded == 0) {
			_("Shader program is not initialized.");
			return;
		}
		let t = e.getModelColor();
		t.r *= t.a, t.g *= t.a, t.b *= t.a, this.copyTexture(e, t);
	}
	copyTexture(e, t) {
		let n = this.gl.ONE, r = this.gl.ONE_MINUS_SRC_ALPHA, i = this.gl.ONE, a = this.gl.ONE_MINUS_SRC_ALPHA, o = this._shaderSets[10];
		this.gl.useProgram(o.shaderProgram), this.gl.uniform4f(o.uniformBaseColorLocation, t.r, t.g, t.b, t.a), this.gl.activeTexture(this.gl.TEXTURE0);
		let s = e.getModelRenderTarget(0).getColorBuffer();
		this.gl.bindTexture(this.gl.TEXTURE_2D, s), this.gl.uniform1i(o.samplerTexture0Location, 0), e._bufferData.vertex || (e._bufferData.vertex = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e._bufferData.vertex), this.gl.bufferData(this.gl.ARRAY_BUFFER, Br, this.gl.STATIC_DRAW), this.gl.enableVertexAttribArray(o.attributePositionLocation), this.gl.vertexAttribPointer(o.attributePositionLocation, 2, this.gl.FLOAT, !1, Float32Array.BYTES_PER_ELEMENT * 2, 0), e._bufferData.uv || (e._bufferData.uv = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e._bufferData.uv), this.gl.bufferData(this.gl.ARRAY_BUFFER, Vr, this.gl.STATIC_DRAW), this.gl.enableVertexAttribArray(o.attributeTexCoordLocation), this.gl.vertexAttribPointer(o.attributeTexCoordLocation, 2, this.gl.FLOAT, !1, Float32Array.BYTES_PER_ELEMENT * 2, 0), this.gl.blendFuncSeparate(n, r, i, a);
	}
	releaseShaderProgram() {
		for (let e = 0; e < this._shaderSets.length; e++) this.gl.deleteProgram(this._shaderSets[e].shaderProgram), this._shaderSets[e].shaderProgram = 0, this._shaderSets[e] = void 0, this._shaderSets[e] = null;
	}
	generateShaders() {
		if (!this._isShaderLoading) {
			this._isShaderLoading = !0, this._isShaderLoaded = !1, this._shaderSets.length = this._shaderCount;
			for (let e = 0; e < this._shaderCount; e++) this._shaderSets[e] = new Wr();
			this.loadShaders().then(() => {
				this.registerShader(), this.registerBlendShader(), this._isShaderLoading = !1, this._isShaderLoaded = !0;
			}).catch((e) => {
				this._isShaderLoading = !1, console.error("Failed to load shaders:", e);
			});
		}
	}
	registerShader() {
		let e = this._vertShaderSrc, t = this._vertShaderSrcMasked, n = this._vertShaderSrcSetupMask, r = this._fragShaderSrcSetupMask, i = this._fragShaderSrcPremultipliedAlpha, a = this._fragShaderSrcMaskPremultipliedAlpha, o = this._fragShaderSrcMaskInvertedPremultipliedAlpha;
		this._shaderSets[0].shaderProgram = this.loadShaderProgram(n, r), this._shaderSets[1].shaderProgram = this.loadShaderProgram(e, i), this._shaderSets[2].shaderProgram = this.loadShaderProgram(t, a), this._shaderSets[3].shaderProgram = this.loadShaderProgram(t, o), this._shaderSets[4].shaderProgram = this._shaderSets[1].shaderProgram, this._shaderSets[5].shaderProgram = this._shaderSets[2].shaderProgram, this._shaderSets[6].shaderProgram = this._shaderSets[3].shaderProgram, this._shaderSets[7].shaderProgram = this._shaderSets[1].shaderProgram, this._shaderSets[8].shaderProgram = this._shaderSets[2].shaderProgram, this._shaderSets[9].shaderProgram = this._shaderSets[3].shaderProgram, this._shaderSets[0].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[0].shaderProgram, "a_position"), this._shaderSets[0].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[0].shaderProgram, "a_texCoord"), this._shaderSets[0].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[0].shaderProgram, "s_texture0"), this._shaderSets[0].uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets[0].shaderProgram, "u_clipMatrix"), this._shaderSets[0].uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets[0].shaderProgram, "u_channelFlag"), this._shaderSets[0].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[0].shaderProgram, "u_baseColor"), this._shaderSets[1].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[1].shaderProgram, "a_position"), this._shaderSets[1].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[1].shaderProgram, "a_texCoord"), this._shaderSets[1].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[1].shaderProgram, "s_texture0"), this._shaderSets[1].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[1].shaderProgram, "u_matrix"), this._shaderSets[1].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[1].shaderProgram, "u_baseColor"), this._shaderSets[1].uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets[1].shaderProgram, "u_multiplyColor"), this._shaderSets[1].uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets[1].shaderProgram, "u_screenColor"), this._shaderSets[2].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[2].shaderProgram, "a_position"), this._shaderSets[2].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[2].shaderProgram, "a_texCoord"), this._shaderSets[2].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[2].shaderProgram, "s_texture0"), this._shaderSets[2].samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets[2].shaderProgram, "s_texture1"), this._shaderSets[2].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[2].shaderProgram, "u_matrix"), this._shaderSets[2].uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets[2].shaderProgram, "u_clipMatrix"), this._shaderSets[2].uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets[2].shaderProgram, "u_channelFlag"), this._shaderSets[2].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[2].shaderProgram, "u_baseColor"), this._shaderSets[2].uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets[2].shaderProgram, "u_multiplyColor"), this._shaderSets[2].uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets[2].shaderProgram, "u_screenColor"), this._shaderSets[3].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[3].shaderProgram, "a_position"), this._shaderSets[3].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[3].shaderProgram, "a_texCoord"), this._shaderSets[3].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[3].shaderProgram, "s_texture0"), this._shaderSets[3].samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets[3].shaderProgram, "s_texture1"), this._shaderSets[3].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[3].shaderProgram, "u_matrix"), this._shaderSets[3].uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets[3].shaderProgram, "u_clipMatrix"), this._shaderSets[3].uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets[3].shaderProgram, "u_channelFlag"), this._shaderSets[3].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[3].shaderProgram, "u_baseColor"), this._shaderSets[3].uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets[3].shaderProgram, "u_multiplyColor"), this._shaderSets[3].uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets[3].shaderProgram, "u_screenColor"), this._shaderSets[4].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[4].shaderProgram, "a_position"), this._shaderSets[4].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[4].shaderProgram, "a_texCoord"), this._shaderSets[4].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[4].shaderProgram, "s_texture0"), this._shaderSets[4].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[4].shaderProgram, "u_matrix"), this._shaderSets[4].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[4].shaderProgram, "u_baseColor"), this._shaderSets[4].uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets[4].shaderProgram, "u_multiplyColor"), this._shaderSets[4].uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets[4].shaderProgram, "u_screenColor"), this._shaderSets[5].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[5].shaderProgram, "a_position"), this._shaderSets[5].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[5].shaderProgram, "a_texCoord"), this._shaderSets[5].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[5].shaderProgram, "s_texture0"), this._shaderSets[5].samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets[5].shaderProgram, "s_texture1"), this._shaderSets[5].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[5].shaderProgram, "u_matrix"), this._shaderSets[5].uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets[5].shaderProgram, "u_clipMatrix"), this._shaderSets[5].uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets[5].shaderProgram, "u_channelFlag"), this._shaderSets[5].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[5].shaderProgram, "u_baseColor"), this._shaderSets[5].uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets[5].shaderProgram, "u_multiplyColor"), this._shaderSets[5].uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets[5].shaderProgram, "u_screenColor"), this._shaderSets[6].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[6].shaderProgram, "a_position"), this._shaderSets[6].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[6].shaderProgram, "a_texCoord"), this._shaderSets[6].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[6].shaderProgram, "s_texture0"), this._shaderSets[6].samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets[6].shaderProgram, "s_texture1"), this._shaderSets[6].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[6].shaderProgram, "u_matrix"), this._shaderSets[6].uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets[6].shaderProgram, "u_clipMatrix"), this._shaderSets[6].uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets[6].shaderProgram, "u_channelFlag"), this._shaderSets[6].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[6].shaderProgram, "u_baseColor"), this._shaderSets[6].uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets[6].shaderProgram, "u_multiplyColor"), this._shaderSets[6].uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets[6].shaderProgram, "u_screenColor"), this._shaderSets[7].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[7].shaderProgram, "a_position"), this._shaderSets[7].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[7].shaderProgram, "a_texCoord"), this._shaderSets[7].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[7].shaderProgram, "s_texture0"), this._shaderSets[7].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[7].shaderProgram, "u_matrix"), this._shaderSets[7].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[7].shaderProgram, "u_baseColor"), this._shaderSets[7].uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets[7].shaderProgram, "u_multiplyColor"), this._shaderSets[7].uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets[7].shaderProgram, "u_screenColor"), this._shaderSets[8].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[8].shaderProgram, "a_position"), this._shaderSets[8].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[8].shaderProgram, "a_texCoord"), this._shaderSets[8].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[8].shaderProgram, "s_texture0"), this._shaderSets[8].samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets[8].shaderProgram, "s_texture1"), this._shaderSets[8].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[8].shaderProgram, "u_matrix"), this._shaderSets[8].uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets[8].shaderProgram, "u_clipMatrix"), this._shaderSets[8].uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets[8].shaderProgram, "u_channelFlag"), this._shaderSets[8].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[8].shaderProgram, "u_baseColor"), this._shaderSets[8].uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets[8].shaderProgram, "u_multiplyColor"), this._shaderSets[8].uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets[8].shaderProgram, "u_screenColor"), this._shaderSets[9].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[9].shaderProgram, "a_position"), this._shaderSets[9].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[9].shaderProgram, "a_texCoord"), this._shaderSets[9].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[9].shaderProgram, "s_texture0"), this._shaderSets[9].samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets[9].shaderProgram, "s_texture1"), this._shaderSets[9].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[9].shaderProgram, "u_matrix"), this._shaderSets[9].uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets[9].shaderProgram, "u_clipMatrix"), this._shaderSets[9].uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets[9].shaderProgram, "u_channelFlag"), this._shaderSets[9].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[9].shaderProgram, "u_baseColor"), this._shaderSets[9].uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets[9].shaderProgram, "u_multiplyColor"), this._shaderSets[9].uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets[9].shaderProgram, "u_screenColor");
	}
	registerBlendShader() {
		let e = this._vertShaderSrcCopy, t = this._fragShaderSrcCopy, n = this._shaderSets[10];
		n.shaderProgram = this.loadShaderProgram(e, t), n.attributeTexCoordLocation = this.gl.getAttribLocation(n.shaderProgram, "a_texCoord"), n.attributePositionLocation = this.gl.getAttribLocation(n.shaderProgram, "a_position"), n.uniformBaseColorLocation = this.gl.getUniformLocation(n.shaderProgram, "u_baseColor");
		let r = 11;
		for (let e = 0; e < this._colorBlendValues.length; e++) {
			if (this._colorBlendValues[e] == q.ColorBlend_None || this._colorBlendValues[e] == q.ColorBlend_AddCompatible || this._colorBlendValues[e] == q.ColorBlend_MultiplyCompatible) continue;
			let t = this._colorBlendValues[e], n = `#define COLOR_BLEND_${this._colorBlendMap.get(t).toUpperCase()}\n`;
			for (let t = 0; t < this._alphaBlendValues.length; t++) {
				if (this._alphaBlendValues[t] == J.AlphaBlend_None || this._colorBlendValues[e] == q.ColorBlend_Normal && this._alphaBlendValues[t] == J.AlphaBlend_Over) continue;
				let i = this._alphaBlendValues[t], a = `#define ALPHA_BLEND_${this._alphaBlendMap.get(i).toUpperCase()}\n`;
				this.generateBlendShader(n, a, r), this._blendShaderSetMap.set(this._colorBlendMap.get(this._colorBlendValues[e]) + this._alphaBlendMap.get(this._alphaBlendValues[t]), r), r += Gr.ShaderType_Count;
			}
		}
	}
	generateBlendShader(e, t, n) {
		for (let r = 0; r < Gr.ShaderType_Count; r++) {
			let i = "", a = "precision mediump float;\n", o = n + r;
			if (a += e, a += t, a += this._fragShaderSrcColorBlend, a += this._fragShaderSrcAlphaBlend, r == Gr.ShaderType_Masked || r == Gr.ShaderType_MaskedInverted) {
				let e = "#define CLIPPING_MASK\n";
				i += e, a += e;
			}
			i += this._vertShaderSrcBlend, a += this._fragShaderSrcBlend, this._shaderSets[o].shaderProgram = this.loadShaderProgram(i, a), this._shaderSets[o].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[o].shaderProgram, "a_position"), this._shaderSets[o].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[o].shaderProgram, "a_texCoord"), this._shaderSets[o].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[o].shaderProgram, "s_texture0"), this._shaderSets[o].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[o].shaderProgram, "u_matrix"), this._shaderSets[o].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[o].shaderProgram, "u_baseColor"), this._shaderSets[o].uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets[o].shaderProgram, "u_multiplyColor"), this._shaderSets[o].uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets[o].shaderProgram, "u_screenColor"), this._shaderSets[o].samplerFrameBufferTextureLocation = this.gl.getUniformLocation(this._shaderSets[o].shaderProgram, "s_blendTexture"), (r == Gr.ShaderType_Masked || r == Gr.ShaderType_MaskedInverted) && (this._shaderSets[o].samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets[o].shaderProgram, "s_texture1"), this._shaderSets[o].uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets[o].shaderProgram, "u_clipMatrix"), this._shaderSets[o].uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets[o].shaderProgram, "u_channelFlag"), this._shaderSets[o].uniformInvertMaskFlagLocation = this.gl.getUniformLocation(this._shaderSets[o].shaderProgram, "u_invertClippingMask"));
		}
	}
	loadShaderProgram(e, t) {
		let n = this.gl.createProgram(), r = this.compileShaderSource(this.gl.VERTEX_SHADER, e);
		if (!r) return v("Vertex shader compile error!"), 0;
		let i = this.compileShaderSource(this.gl.FRAGMENT_SHADER, t);
		return i ? (this.gl.attachShader(n, r), this.gl.attachShader(n, i), this.gl.linkProgram(n), this.gl.getProgramParameter(n, this.gl.LINK_STATUS) ? (this.gl.deleteShader(r), this.gl.deleteShader(i), n) : (v("Failed to link program: {0}", n), this.gl.deleteShader(r), r = 0, this.gl.deleteShader(i), i = 0, n &&= (this.gl.deleteProgram(n), 0), 0)) : (v("Fragment shader compile error!"), 0);
	}
	compileShaderSource(e, t) {
		let n = t, r = this.gl.createShader(e);
		return this.gl.shaderSource(r, n), this.gl.compileShader(r), r || v("Shader compile log: {0} ", this.gl.getShaderInfoLog(r)), this.gl.getShaderParameter(r, this.gl.COMPILE_STATUS) ? r : (v("Shader compile log: {0} ", this.gl.getShaderInfoLog(r)), this.gl.deleteShader(r), null);
	}
	setGl(e) {
		this.gl = e;
	}
	setShaderPath(e) {
		this._shaderPath = e;
	}
	getShaderPath() {
		return this._shaderPath;
	}
	_shaderSets;
	gl;
	_colorBlendMap;
	_alphaBlendMap;
	_colorBlendValues;
	_alphaBlendValues;
	_blendShaderSetMap;
	_shaderCount;
	_vertShaderSrc;
	_vertShaderSrcMasked;
	_vertShaderSrcSetupMask;
	_fragShaderSrcSetupMask;
	_fragShaderSrcPremultipliedAlpha;
	_fragShaderSrcMaskPremultipliedAlpha;
	_fragShaderSrcMaskInvertedPremultipliedAlpha;
	_vertShaderSrcCopy;
	_fragShaderSrcCopy;
	_fragShaderSrcColorBlend;
	_fragShaderSrcAlphaBlend;
	_vertShaderSrcBlend;
	_fragShaderSrcBlend;
	_isShaderLoading;
	_isShaderLoaded;
	_defaultShaderPath;
	_shaderPath;
}, X = class e {
	static getInstance() {
		return zr ??= new e(), zr;
	}
	static deleteInstance() {
		zr &&= (zr.release(), null);
	}
	constructor() {
		this._shaderMap = /* @__PURE__ */ new Map();
	}
	release() {
		for (let e of this._shaderMap) e[1].release();
		this._shaderMap.clear();
	}
	getShader(e) {
		return this._shaderMap.get(e);
	}
	setGlContext(e) {
		if (!this._shaderMap.has(e)) {
			let t = new Ur();
			t.setGl(e), this._shaderMap.set(e, t);
		}
	}
	_shaderMap;
}, Wr = class {
	shaderProgram;
	attributePositionLocation;
	attributeTexCoordLocation;
	uniformMatrixLocation;
	uniformClipMatrixLocation;
	samplerTexture0Location;
	samplerTexture1Location;
	uniformBaseColorLocation;
	uniformChannelFlagLocation;
	uniformMultiplyColorLocation;
	uniformScreenColorLocation;
	samplerFrameBufferTextureLocation;
	uniformInvertMaskFlagLocation;
}, Z;
(function(e) {
	e[e.ShaderNames_SetupMask = 0] = "ShaderNames_SetupMask", e[e.ShaderNames_NormalPremultipliedAlpha = 1] = "ShaderNames_NormalPremultipliedAlpha", e[e.ShaderNames_NormalMaskedPremultipliedAlpha = 2] = "ShaderNames_NormalMaskedPremultipliedAlpha", e[e.ShaderNames_NomralMaskedInvertedPremultipliedAlpha = 3] = "ShaderNames_NomralMaskedInvertedPremultipliedAlpha", e[e.ShaderNames_AddPremultipliedAlpha = 4] = "ShaderNames_AddPremultipliedAlpha", e[e.ShaderNames_AddMaskedPremultipliedAlpha = 5] = "ShaderNames_AddMaskedPremultipliedAlpha", e[e.ShaderNames_AddMaskedPremultipliedAlphaInverted = 6] = "ShaderNames_AddMaskedPremultipliedAlphaInverted", e[e.ShaderNames_MultPremultipliedAlpha = 7] = "ShaderNames_MultPremultipliedAlpha", e[e.ShaderNames_MultMaskedPremultipliedAlpha = 8] = "ShaderNames_MultMaskedPremultipliedAlpha", e[e.ShaderNames_MultMaskedPremultipliedAlphaInverted = 9] = "ShaderNames_MultMaskedPremultipliedAlphaInverted", e[e.ShaderNames_ShaderCount = 10] = "ShaderNames_ShaderCount";
})(Z ||= {});
var Gr;
(function(e) {
	e[e.ShaderType_Normal = 0] = "ShaderType_Normal", e[e.ShaderType_Masked = 1] = "ShaderType_Masked", e[e.ShaderType_MaskedInverted = 2] = "ShaderType_MaskedInverted", e[e.ShaderType_Count = 3] = "ShaderType_Count";
})(Gr ||= {});
var Kr;
(function(e) {
	e.CubismShaderSet = Wr, e.CubismShader_WebGL = Ur, e.CubismShaderManager_WebGL = X, e.ShaderNames = Z;
})(Kr ||= {});
//#endregion
//#region vendor/compiled/Framework/src/rendering/cubismoffscreenmanager.js
var qr = class {
	constructor(e = null, t = null, n = !1) {
		this.colorBuffer = e, this.renderTexture = t, this.inUse = n;
	}
	clear() {
		this.colorBuffer = null, this.renderTexture = null, this.inUse = !1;
	}
	getColorBuffer() {
		return this.colorBuffer;
	}
	getRenderTexture() {
		return this.renderTexture;
	}
	colorBuffer;
	renderTexture;
	inUse;
}, Jr = class {
	constructor(e) {
		this.gl = e, this.offscreenRenderTargetContainers = [], this.previousActiveRenderTextureMaxCount = 0, this.currentActiveRenderTextureCount = 0, this.hasResetThisFrame = !1, this.width = 0, this.height = 0;
	}
	release() {
		if (this.offscreenRenderTargetContainers != null) {
			for (let e = 0; e < this.offscreenRenderTargetContainers.length; ++e) {
				let t = this.offscreenRenderTargetContainers[e];
				this.gl.deleteTexture(t.colorBuffer), this.gl.deleteFramebuffer(t.renderTexture);
			}
			this.offscreenRenderTargetContainers.length = 0, this.offscreenRenderTargetContainers = null;
		}
	}
	gl;
	offscreenRenderTargetContainers;
	previousActiveRenderTextureMaxCount;
	currentActiveRenderTextureCount;
	hasResetThisFrame;
	width;
	height;
}, Yr = class e {
	constructor() {
		this._contextManagers = /* @__PURE__ */ new Map();
	}
	release() {
		if (this._contextManagers != null) {
			for (let e of this._contextManagers.values()) e.release();
			this._contextManagers.clear(), this._contextManagers = null;
		}
		e._instance = null;
	}
	static getInstance() {
		return this._instance ??= new e(), this._instance;
	}
	getContextManager(e) {
		return this._contextManagers.has(e) || this._contextManagers.set(e, new Jr(e)), this._contextManagers.get(e);
	}
	removeContext(e) {
		this._contextManagers.has(e) && (this._contextManagers.get(e).release(), this._contextManagers.delete(e));
	}
	initialize(e, t, n) {
		let r = this.getContextManager(e);
		if (r.offscreenRenderTargetContainers != null) {
			for (let e = 0; e < r.offscreenRenderTargetContainers.length; ++e) {
				let t = r.offscreenRenderTargetContainers[e];
				r.gl.deleteTexture(t.colorBuffer), r.gl.deleteFramebuffer(t.renderTexture), t.clear();
			}
			r.offscreenRenderTargetContainers.length = 0;
		} else r.offscreenRenderTargetContainers = [];
		r.width = t, r.height = n, r.previousActiveRenderTextureMaxCount = 0, r.currentActiveRenderTextureCount = 0, r.hasResetThisFrame = !1;
	}
	beginFrameProcess(e) {
		let t = this.getContextManager(e);
		t.hasResetThisFrame ||= (t.previousActiveRenderTextureMaxCount = 0, !0);
	}
	endFrameProcess(e) {
		let t = this.getContextManager(e);
		t.hasResetThisFrame = !1;
	}
	getContainerSize(e) {
		let t = this.getContextManager(e);
		return t.offscreenRenderTargetContainers == null ? 0 : t.offscreenRenderTargetContainers.length;
	}
	getOffscreenRenderTargetContainers(e, t, n, r) {
		let i = this.getContextManager(e);
		return (i.width != t || i.height != n || i.offscreenRenderTargetContainers == null) && this.initialize(e, t, n), this.updateRenderTargetContainerCount(e), this.getUnusedOffscreenRenderTargetContainer(e) ?? this.createOffscreenRenderTargetContainer(e, t, n, r);
	}
	getUsingRenderTextureState(e, t) {
		let n = this.getContextManager(e);
		for (let e = 0; e < n.offscreenRenderTargetContainers.length; ++e) if (n.offscreenRenderTargetContainers[e].renderTexture == t) return n.offscreenRenderTargetContainers[e].inUse;
		return !0;
	}
	startUsingRenderTexture(e, t) {
		let n = this.getContextManager(e);
		for (let r = 0; r < n.offscreenRenderTargetContainers.length; ++r) if (n.offscreenRenderTargetContainers[r].renderTexture == t) {
			n.offscreenRenderTargetContainers[r].inUse = !0, this.updateRenderTargetContainerCount(e);
			break;
		}
	}
	stopUsingRenderTexture(e, t) {
		let n = this.getContextManager(e);
		for (let e = 0; e < n.offscreenRenderTargetContainers.length; ++e) if (n.offscreenRenderTargetContainers[e].renderTexture == t) {
			n.offscreenRenderTargetContainers[e].inUse = !1, n.currentActiveRenderTextureCount--, n.currentActiveRenderTextureCount < 0 && (n.currentActiveRenderTextureCount = 0);
			break;
		}
	}
	stopUsingAllRenderTextures(e) {
		let t = this.getContextManager(e);
		for (let e = 0; e < t.offscreenRenderTargetContainers.length; ++e) t.offscreenRenderTargetContainers[e].inUse = !1;
		t.currentActiveRenderTextureCount = 0;
	}
	releaseStaleRenderTextures(e) {
		let t = this.getContextManager(e), n = t.offscreenRenderTargetContainers.length;
		if (t.hasResetThisFrame || n === 0) return;
		let r = 0, i = t.previousActiveRenderTextureMaxCount;
		for (let e = n; t.previousActiveRenderTextureMaxCount < e; --e) {
			let n = e - 1;
			if (t.offscreenRenderTargetContainers[n].inUse) {
				let a = !1;
				for (; r < t.previousActiveRenderTextureMaxCount; ++r) if (!t.offscreenRenderTargetContainers[r].inUse) {
					let e = t.offscreenRenderTargetContainers[r];
					t.offscreenRenderTargetContainers[r] = t.offscreenRenderTargetContainers[n], t.offscreenRenderTargetContainers[r].inUse = !0, t.offscreenRenderTargetContainers[n] = e, t.offscreenRenderTargetContainers[n].inUse = !1, a = !0;
					break;
				}
				if (!a) {
					i = e;
					break;
				}
			}
			let a = t.offscreenRenderTargetContainers[n];
			t.gl.bindTexture(t.gl.TEXTURE_2D, null), t.gl.deleteTexture(a.colorBuffer), t.gl.bindFramebuffer(t.gl.FRAMEBUFFER, null), t.gl.deleteFramebuffer(a.renderTexture), a.clear();
		}
		F(t.offscreenRenderTargetContainers, i);
	}
	getPreviousActiveRenderTextureCount(e) {
		return this.getContextManager(e).previousActiveRenderTextureMaxCount;
	}
	getCurrentActiveRenderTextureCount(e) {
		return this.getContextManager(e).currentActiveRenderTextureCount;
	}
	updateRenderTargetContainerCount(e) {
		let t = this.getContextManager(e);
		++t.currentActiveRenderTextureCount, t.previousActiveRenderTextureMaxCount = t.currentActiveRenderTextureCount > t.previousActiveRenderTextureMaxCount ? t.currentActiveRenderTextureCount : t.previousActiveRenderTextureMaxCount;
	}
	getUnusedOffscreenRenderTargetContainer(e) {
		let t = this.getContextManager(e);
		for (let e = 0; e < t.offscreenRenderTargetContainers.length; ++e) {
			let n = t.offscreenRenderTargetContainers[e];
			if (n.inUse == 0) return n.inUse = !0, n;
		}
		return null;
	}
	createOffscreenRenderTargetContainer(e, t, n, r) {
		let i = new Y();
		if (!i.createRenderTarget(e, t, n, r)) return v("Failed to create offscreen render texture."), null;
		let a = new qr(i.getColorBuffer(), i.getRenderTexture(), !0);
		return this.getContextManager(e).offscreenRenderTargetContainers.push(a), a;
	}
	static _instance;
	_contextManagers;
}, Xr = class extends Y {
	initializeOffscreenManager(e, t, n) {
		this._gl = e, this._webGLOffscreenManager = Yr.getInstance(), this._webGLOffscreenManager.getContainerSize(e) === 0 && this._webGLOffscreenManager.initialize(e, t, n);
	}
	setOffscreenRenderTarget(e, t, n, r) {
		this._webGLOffscreenManager ?? this.initializeOffscreenManager(e, t, n);
		let i = this._webGLOffscreenManager.getOffscreenRenderTargetContainers(e, t, n, r);
		if (i == null) {
			v("Failed to acquire offscreen render texture container.");
			return;
		}
		this._colorBuffer = i.getColorBuffer(), this._renderTexture = i.getRenderTexture(), this._bufferWidth = t, this._bufferHeight = n, this._gl = e, this._renderTexture ?? (this._renderTexture = r, v("Failed to create offscreen render texture."));
	}
	getUsingRenderTextureState() {
		return this._webGLOffscreenManager == null || this._gl == null || this._webGLOffscreenManager.getUsingRenderTextureState(this._gl, this._renderTexture);
	}
	startUsingRenderTexture() {
		this._webGLOffscreenManager == null || this._gl == null || this._webGLOffscreenManager.startUsingRenderTexture(this._gl, this._renderTexture);
	}
	stopUsingRenderTexture() {
		this._webGLOffscreenManager == null || this._gl == null || this._webGLOffscreenManager.stopUsingRenderTexture(this._gl, this._renderTexture);
	}
	setOffscreenIndex(e) {
		this._offscreenIndex = e;
	}
	getOffscreenIndex() {
		return this._offscreenIndex;
	}
	setOldOffscreen(e) {
		this._oldOffscreen = e;
	}
	getOldOffscreen() {
		return this._oldOffscreen;
	}
	setParentPartOffscreen(e) {
		this._parentOffscreenRenderTarget = e;
	}
	getParentPartOffscreen() {
		return this._parentOffscreenRenderTarget;
	}
	constructor() {
		super(), this._offscreenIndex = -1, this._parentOffscreenRenderTarget = null, this._oldOffscreen = null, this._webGLOffscreenManager = null;
	}
	release() {
		this._webGLOffscreenManager != null && this._gl != null && this._renderTexture != null && this._webGLOffscreenManager.stopUsingRenderTexture(this._gl, this._renderTexture), this._colorBuffer && this._gl && (this._gl.deleteTexture(this._colorBuffer), this._colorBuffer = null), this._renderTexture && this._gl && (this._gl.deleteFramebuffer(this._renderTexture), this._renderTexture = null), this._webGLOffscreenManager != null && (this._webGLOffscreenManager = null), this._oldOffscreen = null, this._parentOffscreenRenderTarget = null;
	}
	_offscreenIndex;
	_parentOffscreenRenderTarget;
	_oldOffscreen;
	_webGLOffscreenManager;
	_gl;
}, Zr = -1, Qr = new Uint16Array([
	0,
	1,
	2,
	2,
	1,
	3
]), $r = class extends Sr {
	setGL(e) {
		this.gl = e;
	}
	constructor() {
		super(ei);
	}
	setupClippingContext(e, t, n, r, i) {
		let a = 0;
		for (let t = 0; t < this._clippingContextListForMask.length; t++) {
			let n = this._clippingContextListForMask[t];
			switch (i) {
				case C.DrawableObjectType_Drawable:
				default:
					this.calcClippedDrawableTotalBounds(e, n);
					break;
				case C.DrawableObjectType_Offscreen:
					this.calcClippedOffscreenTotalBounds(e, n);
					break;
			}
			n._isUsing && a++;
		}
		if (!(a <= 0)) {
			switch (this.gl.viewport(0, 0, this._clippingMaskBufferSize, this._clippingMaskBufferSize), i) {
				case C.DrawableObjectType_Drawable:
				default:
					this._currentMaskBuffer = t.getDrawableMaskBuffer(0);
					break;
				case C.DrawableObjectType_Offscreen:
					this._currentMaskBuffer = t.getOffscreenMaskBuffer(0);
					break;
			}
			if (this._currentMaskBuffer.beginDraw(n), t.preDraw(), this.setupLayoutBounds(a), this._clearedMaskBufferFlags.length != this._renderTextureCount) {
				this._clearedMaskBufferFlags.length = 0, this._clearedMaskBufferFlags = Array(this._renderTextureCount);
				for (let e = 0; e < this._clearedMaskBufferFlags.length; e++) this._clearedMaskBufferFlags[e] = !1;
			}
			for (let e = 0; e < this._clearedMaskBufferFlags.length; e++) this._clearedMaskBufferFlags[e] = !1;
			for (let r = 0; r < this._clippingContextListForMask.length; r++) {
				let a = this._clippingContextListForMask[r], o = a._allClippedDrawRect, s = a._layoutBounds, c = .05, l = 0, u = 0, d;
				switch (i) {
					case C.DrawableObjectType_Drawable:
					default:
						d = t.getDrawableMaskBuffer(a._bufferIndex);
						break;
					case C.DrawableObjectType_Offscreen:
						d = t.getOffscreenMaskBuffer(a._bufferIndex);
						break;
				}
				if (this._currentMaskBuffer != d && (this._currentMaskBuffer.endDraw(), this._currentMaskBuffer = d, this._currentMaskBuffer.beginDraw(n), t.preDraw()), this._tmpBoundsOnModel.setRect(o), this._tmpBoundsOnModel.expand(o.width * c, o.height * c), l = s.width / this._tmpBoundsOnModel.width, u = s.height / this._tmpBoundsOnModel.height, this.createMatrixForMask(!1, s, l, u), a._matrixForMask.setMatrix(this._tmpMatrixForMask.getArray()), a._matrixForDraw.setMatrix(this._tmpMatrixForDraw.getArray()), i == C.DrawableObjectType_Offscreen) {
					let e = t.getMvpMatrix().getInvert();
					a._matrixForDraw.multiplyByMatrix(e);
				}
				let f = a._clippingIdCount;
				for (let n = 0; n < f; n++) {
					let r = a._clippingIdList[n];
					e.getDrawableDynamicFlagVertexPositionsDidChange(r) && (t.setIsCulling(e.getDrawableCulling(r) != 0), this._clearedMaskBufferFlags[a._bufferIndex] || (this.gl.clearColor(1, 1, 1, 1), this.gl.clear(this.gl.COLOR_BUFFER_BIT), this._clearedMaskBufferFlags[a._bufferIndex] = !0), t.setClippingContextBufferForMask(a), t.drawMeshWebGL(e, r));
				}
			}
			this._currentMaskBuffer.endDraw(), t.setClippingContextBufferForMask(null), this.gl.viewport(r[0], r[1], r[2], r[3]);
		}
	}
	getClippingMaskCount() {
		return this._clippingContextListForMask.length;
	}
	_currentMaskBuffer;
	gl;
}, ei = class extends T {
	constructor(e, t, n) {
		super(t, n), this._owner = e;
	}
	getClippingManager() {
		return this._owner;
	}
	setGl(e) {
		this._owner.setGL(e);
	}
	_owner;
}, ti = class {
	setGlEnable(e, t) {
		t ? this.gl.enable(e) : this.gl.disable(e);
	}
	setGlEnableVertexAttribArray(e, t) {
		t ? this.gl.enableVertexAttribArray(e) : this.gl.disableVertexAttribArray(e);
	}
	save() {
		if (this.gl == null) {
			v("'gl' is null. WebGLRenderingContext is required.\nPlease call 'CubimRenderer_WebGL.startUp' function.");
			return;
		}
		this._lastArrayBufferBinding = this.gl.getParameter(this.gl.ARRAY_BUFFER_BINDING), this._lastElementArrayBufferBinding = this.gl.getParameter(this.gl.ELEMENT_ARRAY_BUFFER_BINDING), this._lastProgram = this.gl.getParameter(this.gl.CURRENT_PROGRAM), this._lastActiveTexture = this.gl.getParameter(this.gl.ACTIVE_TEXTURE), this.gl.activeTexture(this.gl.TEXTURE1), this._lastTexture1Binding2D = this.gl.getParameter(this.gl.TEXTURE_BINDING_2D), this.gl.activeTexture(this.gl.TEXTURE0), this._lastTexture0Binding2D = this.gl.getParameter(this.gl.TEXTURE_BINDING_2D), this._lastVertexAttribArrayEnabled[0] = this.gl.getVertexAttrib(0, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED), this._lastVertexAttribArrayEnabled[1] = this.gl.getVertexAttrib(1, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED), this._lastVertexAttribArrayEnabled[2] = this.gl.getVertexAttrib(2, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED), this._lastVertexAttribArrayEnabled[3] = this.gl.getVertexAttrib(3, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED), this._lastScissorTest = this.gl.isEnabled(this.gl.SCISSOR_TEST), this._lastStencilTest = this.gl.isEnabled(this.gl.STENCIL_TEST), this._lastDepthTest = this.gl.isEnabled(this.gl.DEPTH_TEST), this._lastCullFace = this.gl.isEnabled(this.gl.CULL_FACE), this._lastBlend = this.gl.isEnabled(this.gl.BLEND), this._lastFrontFace = this.gl.getParameter(this.gl.FRONT_FACE), this._lastColorMask = this.gl.getParameter(this.gl.COLOR_WRITEMASK), this._lastBlending[0] = this.gl.getParameter(this.gl.BLEND_SRC_RGB), this._lastBlending[1] = this.gl.getParameter(this.gl.BLEND_DST_RGB), this._lastBlending[2] = this.gl.getParameter(this.gl.BLEND_SRC_ALPHA), this._lastBlending[3] = this.gl.getParameter(this.gl.BLEND_DST_ALPHA);
	}
	restore() {
		if (this.gl == null) {
			v("'gl' is null. WebGLRenderingContext is required.\nPlease call 'CubimRenderer_WebGL.startUp' function.");
			return;
		}
		this.gl.useProgram(this._lastProgram), this.setGlEnableVertexAttribArray(0, this._lastVertexAttribArrayEnabled[0]), this.setGlEnableVertexAttribArray(1, this._lastVertexAttribArrayEnabled[1]), this.setGlEnableVertexAttribArray(2, this._lastVertexAttribArrayEnabled[2]), this.setGlEnableVertexAttribArray(3, this._lastVertexAttribArrayEnabled[3]), this.setGlEnable(this.gl.SCISSOR_TEST, this._lastScissorTest), this.setGlEnable(this.gl.STENCIL_TEST, this._lastStencilTest), this.setGlEnable(this.gl.DEPTH_TEST, this._lastDepthTest), this.setGlEnable(this.gl.CULL_FACE, this._lastCullFace), this.setGlEnable(this.gl.BLEND, this._lastBlend), this.gl.frontFace(this._lastFrontFace), this.gl.colorMask(this._lastColorMask[0], this._lastColorMask[1], this._lastColorMask[2], this._lastColorMask[3]), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._lastArrayBufferBinding), this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._lastElementArrayBufferBinding), this.gl.activeTexture(this.gl.TEXTURE1), this.gl.bindTexture(this.gl.TEXTURE_2D, this._lastTexture1Binding2D), this.gl.activeTexture(this.gl.TEXTURE0), this.gl.bindTexture(this.gl.TEXTURE_2D, this._lastTexture0Binding2D), this.gl.activeTexture(this._lastActiveTexture), this.gl.blendFuncSeparate(this._lastBlending[0], this._lastBlending[1], this._lastBlending[2], this._lastBlending[3]);
	}
	setGl(e) {
		this.gl = e;
	}
	constructor() {
		this._lastVertexAttribArrayEnabled = [
			,
			,
			,
			,
		], this._lastColorMask = [
			,
			,
			,
			,
		], this._lastBlending = [
			,
			,
			,
			,
		];
	}
	_lastArrayBufferBinding;
	_lastElementArrayBufferBinding;
	_lastProgram;
	_lastActiveTexture;
	_lastTexture0Binding2D;
	_lastTexture1Binding2D;
	_lastVertexAttribArrayEnabled;
	_lastScissorTest;
	_lastBlend;
	_lastStencilTest;
	_lastDepthTest;
	_lastCullFace;
	_lastFrontFace;
	_lastColorMask;
	_lastBlending;
	gl;
}, ni = class extends x {
	initialize(e, t = 1) {
		e.isUsingMasking() && (this._drawableClippingManager = new $r(), this._drawableClippingManager.initializeForDrawable(e, t)), e.isUsingMaskingForOffscreen() && (this._offscreenClippingManager = new $r(), this._offscreenClippingManager.initializeForOffscreen(e, t)), F(this._sortedObjectsIndexList, e.getDrawableCount() + (e.getOffscreenCount ? e.getOffscreenCount() : 0), 0, !0), F(this._sortedObjectsTypeList, e.getDrawableCount() + (e.getOffscreenCount ? e.getOffscreenCount() : 0), 0, !0), super.initialize(e);
	}
	setupParentOffscreens(e, t) {
		let n;
		for (let r = 0; r < t; ++r) {
			n = null;
			let i = e.getOffscreenOwnerIndices()[r], a = e.getPartParentPartIndices()[i];
			for (; a != -1;) {
				for (let r = 0; r < t; ++r) if (e.getOffscreenOwnerIndices()[this._offscreenList[r].getOffscreenIndex()] == a) {
					n = this._offscreenList[r];
					break;
				}
				if (n != null) break;
				a = e.getPartParentPartIndices()[a];
			}
			this._offscreenList[r].setParentPartOffscreen(n);
		}
	}
	bindTexture(e, t) {
		this._textures.set(e, t);
	}
	getBindedTextures() {
		return this._textures;
	}
	setClippingMaskBufferSize(e) {
		if (!this._model.isUsingMasking()) return;
		let t = this._drawableClippingManager.getRenderTextureCount();
		this._drawableClippingManager.release(), this._drawableClippingManager = void 0, this._drawableClippingManager = null, this._drawableClippingManager = new $r(), this._drawableClippingManager.setClippingMaskBufferSize(e), this._drawableClippingManager.initializeForDrawable(this.getModel(), t);
	}
	getClippingMaskBufferSize() {
		return this._model.isUsingMasking() ? this._drawableClippingManager.getClippingMaskBufferSize() : Zr;
	}
	getModelRenderTarget(e) {
		return this._modelRenderTargets[e];
	}
	getRenderTextureCount() {
		return this._model.isUsingMasking() ? this._drawableClippingManager.getRenderTextureCount() : Zr;
	}
	constructor(e, t) {
		super(e, t), this._clippingContextBufferForMask = null, this._clippingContextBufferForDraw = null, this._rendererProfile = new ti(), this._textures = /* @__PURE__ */ new Map(), this._sortedObjectsIndexList = [], this._sortedObjectsTypeList = [], this._bufferData = {
			vertex: WebGLBuffer = null,
			uv: WebGLBuffer = null,
			index: WebGLBuffer = null
		}, this._modelRenderTargets = [], this._drawableMasks = [], this._currentFbo = null, this._drawableClippingManager = null, this._offscreenClippingManager = null, this._offscreenMasks = [], this._offscreenList = [];
	}
	release() {
		if (this._drawableClippingManager &&= (this._drawableClippingManager.release(), this._drawableClippingManager = void 0, null), this.gl != null) {
			this.gl.deleteBuffer(this._bufferData.vertex), this._bufferData.vertex = null, this.gl.deleteBuffer(this._bufferData.uv), this._bufferData.uv = null, this.gl.deleteBuffer(this._bufferData.index), this._bufferData.index = null, this._bufferData = null, this._textures = null;
			for (let e = 0; e < this._modelRenderTargets.length; e++) this._modelRenderTargets[e] != null && this._modelRenderTargets[e].isValid() && this._modelRenderTargets[e].destroyRenderTarget();
			this._modelRenderTargets.length = 0, this._modelRenderTargets = null;
			for (let e = 0; e < this._drawableMasks.length; e++) this._drawableMasks[e] != null && this._drawableMasks[e].isValid() && this._drawableMasks[e].destroyRenderTarget();
			this._drawableMasks.length = 0, this._drawableMasks = null;
			for (let e = 0; e < this._offscreenMasks.length; e++) this._offscreenMasks[e] != null && this._offscreenMasks[e].isValid() && this._offscreenMasks[e].destroyRenderTarget();
			this._offscreenMasks.length = 0, this._offscreenMasks = null;
			for (let e = 0; e < this._offscreenList.length; e++) this._offscreenList[e] != null && this._offscreenList[e].isValid() && this._offscreenList[e].destroyRenderTarget();
			this._offscreenList.length = 0, this._offscreenList = null, this._offscreenClippingManager = null, this._drawableClippingManager = null, this._clippingContextBufferForMask = null, this._clippingContextBufferForDraw = null, this._rendererProfile = null, this._sortedObjectsIndexList = null, this._sortedObjectsTypeList = null, this._currentFbo = null, this._model = null, this.gl = null;
		}
	}
	loadShaders(e = null) {
		if (this.gl == null) {
			v("'gl' is null. WebGLRenderingContext is required.\nPlease call 'CubimRenderer_WebGL.startUp' function.");
			return;
		}
		if (X.getInstance().getShader(this.gl)._shaderSets.length == 0 || !X.getInstance().getShader(this.gl)._isShaderLoaded) {
			let t = X.getInstance().getShader(this.gl);
			e != null && t.setShaderPath(e), t.generateShaders();
		}
	}
	doDrawModel(e = null) {
		this.loadShaders(e), this.beforeDrawModelRenderTarget();
		let t = this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING), n = this.gl.getParameter(this.gl.VIEWPORT);
		if (this._drawableClippingManager != null) {
			this.preDraw();
			for (let e = 0; e < this._drawableClippingManager.getRenderTextureCount(); ++e) (this._drawableMasks[e].getBufferWidth() != this._drawableClippingManager.getClippingMaskBufferSize() || this._drawableMasks[e].getBufferHeight() != this._drawableClippingManager.getClippingMaskBufferSize()) && this._drawableMasks[e].createRenderTarget(this.gl, this._drawableClippingManager.getClippingMaskBufferSize(), this._drawableClippingManager.getClippingMaskBufferSize(), t);
			this.isUsingHighPrecisionMask() ? this._drawableClippingManager.setupMatrixForHighPrecision(this.getModel(), !1) : this._drawableClippingManager.setupClippingContext(this.getModel(), this, t, n, C.DrawableObjectType_Drawable);
		}
		if (this._offscreenClippingManager != null) {
			this.preDraw();
			for (let e = 0; e < this._offscreenClippingManager.getRenderTextureCount(); ++e) (this._offscreenMasks[e].getBufferWidth() != this._offscreenClippingManager.getClippingMaskBufferSize() || this._offscreenMasks[e].getBufferHeight() != this._offscreenClippingManager.getClippingMaskBufferSize()) && this._offscreenMasks[e].createRenderTarget(this.gl, this._offscreenClippingManager.getClippingMaskBufferSize(), this._offscreenClippingManager.getClippingMaskBufferSize(), t);
			this.isUsingHighPrecisionMask() ? this._offscreenClippingManager.setupMatrixForOffscreenHighPrecision(this.getModel(), !1, this.getMvpMatrix()) : this._offscreenClippingManager.setupClippingContext(this.getModel(), this, t, n, C.DrawableObjectType_Offscreen);
		}
		this.preDraw(), this.drawObjectLoop(t), this.afterDrawModelRenderTarget();
	}
	drawObjectLoop(e) {
		let t = this.getModel(), n = t.getDrawableCount(), r = n + t.getOffscreenCount(), i = t.getRenderOrders();
		this._currentOffscreen = null, this._currentFbo = e, this._modelRootFbo = e;
		for (let e = 0; e < r; ++e) {
			let t = i[e];
			e < n ? (this._sortedObjectsIndexList[t] = e, this._sortedObjectsTypeList[t] = C.DrawableObjectType_Drawable) : e < r && (this._sortedObjectsIndexList[t] = e - n, this._sortedObjectsTypeList[t] = C.DrawableObjectType_Offscreen);
		}
		for (let e = 0; e < r; ++e) {
			let t = this._sortedObjectsIndexList[e], n = this._sortedObjectsTypeList[e];
			this.renderObject(t, n);
		}
		for (; this._currentOffscreen != null;) this.submitDrawToParentOffscreen(this._currentOffscreen.getOffscreenIndex(), C.DrawableObjectType_Offscreen);
	}
	renderObject(e, t) {
		switch (t) {
			case C.DrawableObjectType_Drawable:
				this.drawDrawable(e, this._modelRootFbo);
				break;
			case C.DrawableObjectType_Offscreen:
				this.addOffscreen(e);
				break;
			default:
				v("Unknown object type: " + t);
				break;
		}
	}
	drawDrawable(e, t) {
		if (!this.getModel().getDrawableDynamicFlagIsVisible(e)) return;
		this.submitDrawToParentOffscreen(e, C.DrawableObjectType_Drawable);
		let n = this._drawableClippingManager == null ? null : this._drawableClippingManager.getClippingContextListForDraw()[e];
		if (n != null && this.isUsingHighPrecisionMask()) {
			n._isUsing && (this.gl.viewport(0, 0, this._drawableClippingManager.getClippingMaskBufferSize(), this._drawableClippingManager.getClippingMaskBufferSize()), this.preDraw(), this.getDrawableMaskBuffer(n._bufferIndex).beginDraw(this._currentFbo), this.gl.clearColor(1, 1, 1, 1), this.gl.clear(this.gl.COLOR_BUFFER_BIT));
			{
				let e = n._clippingIdCount;
				for (let t = 0; t < e; t++) {
					let e = n._clippingIdList[t];
					this._model.getDrawableDynamicFlagVertexPositionsDidChange(e) && (this.setIsCulling(this._model.getDrawableCulling(e) != 0), this.setClippingContextBufferForMask(n), this.drawMeshWebGL(this._model, e));
				}
				this.getDrawableMaskBuffer(n._bufferIndex).endDraw(), this.setClippingContextBufferForMask(null), this.gl.viewport(0, 0, this._modelRenderTargetWidth, this._modelRenderTargetHeight), this.preDraw();
			}
		}
		this.setClippingContextBufferForDrawable(n), this.setIsCulling(this.getModel().getDrawableCulling(e)), this.drawMeshWebGL(this._model, e);
	}
	drawMeshWebGL(e, t) {
		if (this.isCulling() ? this.gl.enable(this.gl.CULL_FACE) : this.gl.disable(this.gl.CULL_FACE), this.gl.frontFace(this.gl.CCW), this.isGeneratingMask() ? X.getInstance().getShader(this.gl).setupShaderProgramForMask(this, e, t) : X.getInstance().getShader(this.gl).setupShaderProgramForDrawable(this, e, t), X.getInstance().getShader(this.gl)._isShaderLoaded) {
			{
				let n = e.getDrawableVertexIndexCount(t);
				this.gl.drawElements(this.gl.TRIANGLES, n, this.gl.UNSIGNED_SHORT, 0);
			}
			this.gl.useProgram(null), this.setClippingContextBufferForDrawable(null), this.setClippingContextBufferForMask(null);
		}
	}
	submitDrawToParentOffscreen(e, t) {
		if (this._currentOffscreen == null || e == Zr) return;
		let n = this.getModel().getOffscreenOwnerIndices()[this._currentOffscreen.getOffscreenIndex()];
		if (n == Zr) return;
		let r = -1;
		switch (t) {
			case C.DrawableObjectType_Drawable:
				r = this.getModel().getDrawableParentPartIndex(e);
				break;
			case C.DrawableObjectType_Offscreen:
				r = this.getModel().getPartParentPartIndices()[this.getModel().getOffscreenOwnerIndices()[e]];
				break;
			default: return;
		}
		for (; r != -1;) {
			if (r == n) return;
			r = this.getModel().getPartParentPartIndices()[r];
		}
		this.drawOffscreen(this._currentOffscreen), this.submitDrawToParentOffscreen(e, t);
	}
	addOffscreen(e) {
		if (this._currentOffscreen != null && this._currentOffscreen.getOffscreenIndex() != e) {
			let t = !1, n = this.getModel().getOffscreenOwnerIndices()[e], r = this.getModel().getPartParentPartIndices()[n], i = this._currentOffscreen.getOffscreenIndex(), a = this.getModel().getOffscreenOwnerIndices()[i];
			for (; r != -1;) {
				if (r == a) {
					t = !0;
					break;
				}
				r = this.getModel().getPartParentPartIndices()[r];
			}
			t || this.submitDrawToParentOffscreen(e, C.DrawableObjectType_Offscreen);
		}
		let t = this._offscreenList[e];
		t.getRenderTexture() == null || t.getBufferWidth() != this._modelRenderTargetWidth || t.getBufferHeight() != this._modelRenderTargetHeight || t.getUsingRenderTextureState() ? t.setOffscreenRenderTarget(this.gl, this._modelRenderTargetWidth, this._modelRenderTargetHeight, this._currentFbo) : t.startUsingRenderTexture();
		let n = t.getParentPartOffscreen();
		t.setOldOffscreen(n);
		let r = null;
		n != null && (r = n.getRenderTexture()), r ??= this._modelRootFbo, t.beginDraw(r), this.gl.viewport(0, 0, this._modelRenderTargetWidth, this._modelRenderTargetHeight), t.clear(0, 0, 0, 0), this._currentOffscreen = t, this._currentFbo = t.getRenderTexture();
	}
	drawOffscreen(e) {
		let t = e.getOffscreenIndex(), n = this._offscreenClippingManager == null ? null : this._offscreenClippingManager.getClippingContextListForOffscreen()[t];
		if (n != null && this.isUsingHighPrecisionMask()) {
			n._isUsing && (this.gl.viewport(0, 0, this._offscreenClippingManager.getClippingMaskBufferSize(), this._offscreenClippingManager.getClippingMaskBufferSize()), this.preDraw(), this.getOffscreenMaskBuffer(n._bufferIndex).beginDraw(this._currentFbo), this.gl.clearColor(1, 1, 1, 1), this.gl.clear(this.gl.COLOR_BUFFER_BIT));
			{
				let e = n._clippingIdCount;
				for (let t = 0; t < e; t++) {
					let e = n._clippingIdList[t];
					this.getModel().getDrawableDynamicFlagVertexPositionsDidChange(e) && (this.setIsCulling(this.getModel().getDrawableCulling(e) != 0), this.setClippingContextBufferForMask(n), this.drawMeshWebGL(this.getModel(), e));
				}
			}
			this.getOffscreenMaskBuffer(n._bufferIndex).endDraw(), this.setClippingContextBufferForMask(null), this.gl.viewport(0, 0, this._modelRenderTargetWidth, this._modelRenderTargetHeight), this.preDraw();
		}
		this.setClippingContextBufferForOffscreen(n), this.setIsCulling(this._model.getOffscreenCulling(t) != 0), this.drawOffscreenWebGL(this.getModel(), e);
	}
	drawOffscreenWebGL(e, t) {
		this.isCulling() ? this.gl.enable(this.gl.CULL_FACE) : this.gl.disable(this.gl.CULL_FACE), this.gl.frontFace(this.gl.CCW), X.getInstance().getShader(this.gl).setupShaderProgramForOffscreen(this, e, t), t.endDraw(), this._currentOffscreen = this._currentOffscreen.getOldOffscreen(), this._currentFbo = t.getOldFBO(), this._currentFbo ?? (this._currentOffscreen = this._modelRenderTargets[0], this._currentFbo = this._modelRenderTargets[0].getRenderTexture(), this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._currentFbo));
		{
			let e = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, e), this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, Qr, this.gl.STATIC_DRAW), this.gl.drawElements(this.gl.TRIANGLES, Qr.length, this.gl.UNSIGNED_SHORT, 0), this.gl.deleteBuffer(e);
		}
		t.stopUsingRenderTexture(), this.gl.useProgram(null), this.setClippingContextBufferForMask(null), this.setClippingContextBufferForOffscreen(null);
	}
	saveProfile() {
		this._rendererProfile.save();
	}
	restoreProfile() {
		this._rendererProfile.restore();
	}
	beforeDrawModelRenderTarget() {
		if (this._modelRenderTargets.length != 0) {
			for (let e = 0; e < this._modelRenderTargets.length; ++e) (this._modelRenderTargets[e].getBufferWidth() != this._modelRenderTargetWidth || this._modelRenderTargets[e].getBufferHeight() != this._modelRenderTargetHeight) && this._modelRenderTargets[e].createRenderTarget(this.gl, this._modelRenderTargetWidth, this._modelRenderTargetHeight, this._currentFbo);
			this._modelRenderTargets[0].beginDraw(), this._modelRenderTargets[0].clear(0, 0, 0, 0);
		}
	}
	afterDrawModelRenderTarget() {
		if (this._modelRenderTargets.length != 0) {
			if (this._modelRenderTargets[0].endDraw(), X.getInstance().getShader(this.gl).setupShaderProgramForOffscreenRenderTarget(this), X.getInstance().getShader(this.gl)._isShaderLoaded) {
				let e = this.gl.createBuffer();
				this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, e), this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, Qr, this.gl.STATIC_DRAW), this.gl.drawElements(this.gl.TRIANGLES, Qr.length, this.gl.UNSIGNED_SHORT, 0), this.gl.deleteBuffer(e);
			}
			this.gl.useProgram(null);
		}
	}
	getOffscreenMaskBuffer(e) {
		return this._offscreenMasks[e];
	}
	static doStaticRelease() {
		X.deleteInstance();
	}
	setRenderState(e, t) {
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, e), this.gl.viewport(t[0], t[1], t[2], t[3]), (this._modelRenderTargetWidth != t[2] || this._modelRenderTargetHeight != t[3]) && (this._modelRenderTargetWidth = t[2], this._modelRenderTargetHeight = t[3]);
	}
	preDraw() {
		if (this.gl.disable(this.gl.SCISSOR_TEST), this.gl.disable(this.gl.STENCIL_TEST), this.gl.disable(this.gl.DEPTH_TEST), this.gl.frontFace(this.gl.CW), this.gl.enable(this.gl.BLEND), this.gl.colorMask(!0, !0, !0, !0), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null), this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null), this.getAnisotropy() > 0 && this._extension) for (let e = 0; e < this._textures.size; ++e) this.gl.bindTexture(this.gl.TEXTURE_2D, this._textures.get(e)), this.gl.texParameterf(this.gl.TEXTURE_2D, this._extension.TEXTURE_MAX_ANISOTROPY_EXT, this.getAnisotropy());
	}
	getDrawableMaskBuffer(e) {
		return this._drawableMasks[e];
	}
	setClippingContextBufferForMask(e) {
		this._clippingContextBufferForMask = e;
	}
	getClippingContextBufferForMask() {
		return this._clippingContextBufferForMask;
	}
	setClippingContextBufferForDrawable(e) {
		this._clippingContextBufferForDraw = e;
	}
	getClippingContextBufferForDrawable() {
		return this._clippingContextBufferForDraw;
	}
	setClippingContextBufferForOffscreen(e) {
		this._clippingContextBufferForOffscreen = e;
	}
	getClippingContextBufferForOffscreen() {
		return this._clippingContextBufferForOffscreen;
	}
	isGeneratingMask() {
		return this.getClippingContextBufferForMask() != null;
	}
	startUp(e) {
		if (this.gl = e, this._drawableClippingManager && this._drawableClippingManager.setGL(e), this._offscreenClippingManager && this._offscreenClippingManager.setGL(e), X.getInstance().setGlContext(e), this._rendererProfile.setGl(e), this._extension = this.gl.getExtension("EXT_texture_filter_anisotropic") || this.gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || this.gl.getExtension("MOZ_EXT_texture_filter_anisotropic"), this._model.isUsingMasking()) {
			this._drawableMasks.length = this._drawableClippingManager.getRenderTextureCount();
			for (let e = 0; e < this._drawableMasks.length; ++e) {
				let t = new Y();
				t.createRenderTarget(this.gl, this._drawableClippingManager.getClippingMaskBufferSize(), this._drawableClippingManager.getClippingMaskBufferSize(), this._currentFbo), this._drawableMasks[e] = t;
			}
		}
		if (this._model.isBlendModeEnabled()) {
			this._modelRenderTargets.length = 0, this._modelRenderTargets.length = 3;
			for (let e = 0; e < 3; ++e) {
				let t = new Xr();
				t.createRenderTarget(this.gl, this._modelRenderTargetWidth, this._modelRenderTargetHeight, this._currentFbo), this._modelRenderTargets[e] = t;
			}
			if (this._model.isUsingMaskingForOffscreen()) {
				this._offscreenMasks.length = this._offscreenClippingManager.getRenderTextureCount();
				for (let e = 0; e < this._offscreenMasks.length; ++e) {
					let t = new Y();
					t.createRenderTarget(this.gl, this._offscreenClippingManager.getClippingMaskBufferSize(), this._offscreenClippingManager.getClippingMaskBufferSize(), this._currentFbo), this._offscreenMasks[e] = t;
				}
			}
			let e = this._model.getOffscreenCount();
			if (e > 0) {
				this._offscreenList = Array(e);
				for (let t = 0; t < e; ++t) {
					let e = new Xr();
					e.setOffscreenIndex(t), this._offscreenList[t] = e;
				}
				this.setupParentOffscreens(this._model, e);
			}
		}
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._currentFbo);
	}
	_textures;
	_sortedObjectsIndexList;
	_sortedObjectsTypeList;
	_rendererProfile;
	_drawableClippingManager;
	_clippingContextBufferForMask;
	_clippingContextBufferForDraw;
	_clippingContextBufferForOffscreen;
	_offscreenClippingManager;
	_modelRenderTargets;
	_drawableMasks;
	_offscreenMasks;
	_offscreenList;
	_currentFbo;
	_currentOffscreen;
	_modelRootFbo;
	_bufferData;
	_extension;
	gl;
};
x.staticRelease = () => {
	ni.doStaticRelease();
};
var ri;
(function(e) {
	e.CubismClippingContext = ei, e.CubismClippingManager_WebGL = $r, e.CubismRenderer_WebGL = ni;
})(ri ||= {});
//#endregion
//#region vendor/compiled/Framework/src/model/cubismmoc.js
var ii = class e {
	static create(t, n) {
		let r = null;
		if (n && !this.hasMocConsistency(t)) return v("Inconsistent MOC3."), r;
		let i = Live2DCubismCore.Moc.fromArrayBuffer(t);
		return i && (r = new e(i), r._mocVersion = Live2DCubismCore.Version.csmGetMocVersion(t)), r;
	}
	static delete(e) {
		e._moc._release(), e._moc = null, e = null;
	}
	createModel() {
		let e = null, t = Live2DCubismCore.Model.fromMoc(this._moc);
		return t && (e = new _r(t), e.initialize(), ++this._modelCount), e;
	}
	deleteModel(e) {
		e != null && (e.release(), e = null, --this._modelCount);
	}
	constructor(e) {
		this._moc = e, this._modelCount = 0, this._mocVersion = 0;
	}
	release() {
		m(this._modelCount == 0), this._moc._release(), this._moc = null;
	}
	getLatestMocVersion() {
		return Live2DCubismCore.Version.csmGetLatestMocVersion();
	}
	getMocVersion() {
		return this._mocVersion;
	}
	static getMocVersionFromBuffer(e) {
		return Live2DCubismCore.Version.csmGetMocVersion(e);
	}
	static hasMocConsistency(e) {
		return Live2DCubismCore.Moc.prototype.hasMocConsistency(e) === 1;
	}
	_moc;
	_modelCount;
	_mocVersion;
}, ai;
(function(e) {
	e.CubismMoc = ii;
})(ai ||= {});
//#endregion
//#region vendor/compiled/Framework/src/model/cubismmodeluserdatajson.js
var oi = "Meta", si = "UserDataCount", ci = "TotalUserDataSize", li = "UserData", ui = "Target", di = "Id", fi = "Value", pi = class {
	constructor(e, t) {
		this._json = D.create(e, t);
	}
	release() {
		D.delete(this._json);
	}
	getUserDataCount() {
		return this._json.getRoot().getValueByString(oi).getValueByString(si).toInt();
	}
	getTotalUserDataSize() {
		return this._json.getRoot().getValueByString(oi).getValueByString(ci).toInt();
	}
	getUserDataTargetType(e) {
		return this._json.getRoot().getValueByString(li).getValueByIndex(e).getValueByString(ui).getRawString();
	}
	getUserDataId(e) {
		return j.getIdManager().getId(this._json.getRoot().getValueByString(li).getValueByIndex(e).getValueByString(di).getRawString());
	}
	getUserDataValue(e) {
		return this._json.getRoot().getValueByString(li).getValueByIndex(e).getValueByString(fi).getRawString();
	}
	_json;
}, mi;
(function(e) {
	e.CubismModelUserDataJson = pi;
})(mi ||= {});
//#endregion
//#region vendor/compiled/Framework/src/model/cubismmodeluserdata.js
var hi = "ArtMesh", gi = class {
	targetType;
	targetId;
	value;
}, _i = class e {
	static create(t, n) {
		let r = new e();
		return r.parseUserData(t, n), r;
	}
	static delete(e) {
		e != null && (e.release(), e = null);
	}
	getArtMeshUserDatas() {
		return this._artMeshUserDataNode;
	}
	parseUserData(e, t) {
		let n = new pi(e, t);
		if (!n) {
			n.release(), n = void 0;
			return;
		}
		let r = j.getIdManager().getId(hi), i = n.getUserDataCount(), a = this._userDataNodes.length;
		this._userDataNodes.length = i;
		for (let e = 0; e < i; e++) {
			let t = new gi();
			t.targetId = n.getUserDataId(e), t.targetType = j.getIdManager().getId(n.getUserDataTargetType(e)), t.value = n.getUserDataValue(e), this._userDataNodes[a++] = t, t.targetType == r && this._artMeshUserDataNode.push(t);
		}
		n.release(), n = void 0;
	}
	constructor() {
		this._userDataNodes = [], this._artMeshUserDataNode = [];
	}
	release() {
		for (let e = 0; e < this._userDataNodes.length; ++e) this._userDataNodes[e] = null;
		this._userDataNodes = null;
	}
	_userDataNodes;
	_artMeshUserDataNode;
}, vi;
(function(e) {
	e.CubismModelUserData = _i, e.CubismModelUserDataNode = gi;
})(vi ||= {});
//#endregion
//#region vendor/compiled/Framework/src/model/cubismusermodel.js
var yi = class e {
	isInitialized() {
		return this._initialized;
	}
	setInitialized(e) {
		this._initialized = e;
	}
	isUpdating() {
		return this._updating;
	}
	setUpdating(e) {
		this._updating = e;
	}
	setDragging(e, t) {
		this._dragManager.set(e, t);
	}
	getModelMatrix() {
		return this._modelMatrix;
	}
	setRenderTargetSize(e, t) {
		this._renderer && this._renderer.setRenderTargetSize(e, t);
	}
	setOpacity(e) {
		this._opacity = e;
	}
	getOpacity() {
		return this._opacity;
	}
	loadModel(e, t = !1) {
		if (this._moc = ii.create(e, t), this._moc == null) {
			v("Failed to CubismMoc.create().");
			return;
		}
		if (this._model = this._moc.createModel(), this._model == null) {
			v("Failed to CreateModel().");
			return;
		}
		this._model.saveParameters(), this._modelMatrix = new je(this._model.getCanvasWidth(), this._model.getCanvasHeight());
	}
	loadMotion(e, t, n, r, i, a, o, s, c = !1) {
		if (e == null || t == 0) return v("Failed to loadMotion()."), null;
		let l = Wt.create(e, t, r, i, c);
		if (l == null) return v("Failed to create motion from buffer in LoadMotion()"), null;
		if (a) {
			let e = a.getMotionFadeInTimeValue(o, s);
			e >= 0 && l.setFadeInTime(e);
			let t = a.getMotionFadeOutTimeValue(o, s);
			t >= 0 && l.setFadeOutTime(t);
		}
		return l;
	}
	loadExpression(e, t, n) {
		return e == null || t == 0 ? (v("Failed to loadExpression()."), null) : Ye.create(e, t);
	}
	loadPose(e, t) {
		if (e == null || t == 0) {
			v("Failed to loadPose().");
			return;
		}
		this._pose = Oe.create(e, t);
	}
	loadUserData(e, t) {
		if (e == null || t == 0) {
			v("Failed to loadUserData().");
			return;
		}
		this._modelUserData = _i.create(e, t);
	}
	loadPhysics(e, t) {
		if (e == null || t == 0) {
			v("Failed to loadPhysics().");
			return;
		}
		this._physics = Wn.create(e, t);
	}
	isHit(e, t, n) {
		let r = this._model.getDrawableIndex(e);
		if (r < 0) return !1;
		let i = this._model.getDrawableVertexCount(r), a = this._model.getDrawableVertices(r), o = a[0], s = a[0], c = a[1], l = a[1];
		for (let e = 1; e < i; ++e) {
			let t = a[A.vertexOffset + e * A.vertexStep], n = a[A.vertexOffset + e * A.vertexStep + 1];
			t < o && (o = t), t > s && (s = t), n < c && (c = n), n > l && (l = n);
		}
		let u = this._modelMatrix.invertTransformX(t), d = this._modelMatrix.invertTransformY(n);
		return o <= u && u <= s && c <= d && d <= l;
	}
	getModel() {
		return this._model;
	}
	getMocVersionFromBuffer(e) {
		return ii.getMocVersionFromBuffer(e);
	}
	getRenderer() {
		return this._renderer;
	}
	createRenderer(e, t, n = 1) {
		this._renderer && this.deleteRenderer(), this._renderer = new ni(e, t), this._renderer.initialize(this._model, n);
	}
	deleteRenderer() {
		this._renderer != null && (this._renderer.release(), this._renderer = null);
	}
	motionEventFired(e) {
		g("{0}", e);
	}
	static cubismDefaultMotionEventCallback(e, t, n) {
		n?.motionEventFired(t);
	}
	constructor() {
		this._moc = null, this._model = null, this._motionManager = null, this._expressionManager = null, this._eyeBlink = null, this._breath = null, this._modelMatrix = null, this._pose = null, this._dragManager = null, this._physics = null, this._modelUserData = null, this._initialized = !1, this._updating = !1, this._opacity = 1, this._mocConsistency = !1, this._debugMode = !1, this._renderer = null, this._motionManager = new Kt(), this._motionManager.setEventCallback(e.cubismDefaultMotionEventCallback, this), this._expressionManager = new rt(), this._dragManager = new Fe();
	}
	release() {
		this._motionManager != null && (this._motionManager.release(), this._motionManager = null), this._expressionManager != null && (this._expressionManager.release(), this._expressionManager = null), this._moc != null && (this._moc.deleteModel(this._model), this._moc.release(), this._moc = null), this._modelMatrix = null, Oe.delete(this._pose), be.delete(this._eyeBlink), _e.delete(this._breath), this._dragManager = null, Wn.delete(this._physics), _i.delete(this._modelUserData), this.deleteRenderer();
	}
	_moc;
	_model;
	_motionManager;
	_expressionManager;
	_eyeBlink;
	_breath;
	_modelMatrix;
	_pose;
	_dragManager;
	_physics;
	_modelUserData;
	_initialized;
	_updating;
	_opacity;
	_mocConsistency;
	_motionConsistency;
	_debugMode;
	_renderer;
}, bi;
(function(e) {
	e.CubismUserModel = yi;
})(bi ||= {});
//#endregion
//#region vendor/compiled/Framework/src/icubismmodelsetting.js
var xi = class {}, Si;
(function(e) {
	e.ICubismModelSetting = xi;
})(Si ||= {});
//#endregion
//#region vendor/compiled/Framework/src/cubismmodelsettingjson.js
var Q;
(function(e) {
	e[e.FrequestNode_Groups = 0] = "FrequestNode_Groups", e[e.FrequestNode_Moc = 1] = "FrequestNode_Moc", e[e.FrequestNode_Motions = 2] = "FrequestNode_Motions", e[e.FrequestNode_Expressions = 3] = "FrequestNode_Expressions", e[e.FrequestNode_Textures = 4] = "FrequestNode_Textures", e[e.FrequestNode_Physics = 5] = "FrequestNode_Physics", e[e.FrequestNode_Pose = 6] = "FrequestNode_Pose", e[e.FrequestNode_HitAreas = 7] = "FrequestNode_HitAreas";
})(Q ||= {});
var Ci = class extends xi {
	constructor(e, t) {
		super(), this._json = D.create(e, t), this.getJson() && (this._jsonValue = [
			this.getJson().getRoot().getValueByString(this.groups),
			this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.moc),
			this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.motions),
			this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.expressions),
			this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.textures),
			this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.physics),
			this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.pose),
			this.getJson().getRoot().getValueByString(this.hitAreas)
		]);
	}
	release() {
		D.delete(this._json), this._jsonValue = null;
	}
	getJson() {
		return this._json;
	}
	getModelFileName() {
		return this.isExistModelFile() ? this._jsonValue[Q.FrequestNode_Moc].getRawString() : "";
	}
	getTextureCount() {
		return this.isExistTextureFiles() ? this._jsonValue[Q.FrequestNode_Textures].getSize() : 0;
	}
	getTextureDirectory() {
		let e = this._jsonValue[Q.FrequestNode_Textures].getValueByIndex(0).getRawString().split("/"), t = e.length - 1, n = "";
		for (let r = 0; r < t; r++) n += e[r], r < t - 1 && (n += "/");
		return n;
	}
	getTextureFileName(e) {
		return this._jsonValue[Q.FrequestNode_Textures].getValueByIndex(e).getRawString();
	}
	getHitAreasCount() {
		return this.isExistHitAreas() ? this._jsonValue[Q.FrequestNode_HitAreas].getSize() : 0;
	}
	getHitAreaId(e) {
		return j.getIdManager().getId(this._jsonValue[Q.FrequestNode_HitAreas].getValueByIndex(e).getValueByString(this.id).getRawString());
	}
	getHitAreaName(e) {
		return this._jsonValue[Q.FrequestNode_HitAreas].getValueByIndex(e).getValueByString(this.name).getRawString();
	}
	getPhysicsFileName() {
		return this.isExistPhysicsFile() ? this._jsonValue[Q.FrequestNode_Physics].getRawString() : "";
	}
	getPoseFileName() {
		return this.isExistPoseFile() ? this._jsonValue[Q.FrequestNode_Pose].getRawString() : "";
	}
	getExpressionCount() {
		return this.isExistExpressionFile() ? this._jsonValue[Q.FrequestNode_Expressions].getSize() : 0;
	}
	getExpressionName(e) {
		return this._jsonValue[Q.FrequestNode_Expressions].getValueByIndex(e).getValueByString(this.name).getRawString();
	}
	getExpressionFileName(e) {
		return this._jsonValue[Q.FrequestNode_Expressions].getValueByIndex(e).getValueByString(this.filePath).getRawString();
	}
	getMotionGroupCount() {
		return this.isExistMotionGroups() ? this._jsonValue[Q.FrequestNode_Motions].getKeys().length : 0;
	}
	getMotionGroupName(e) {
		return this.isExistMotionGroups() ? this._jsonValue[Q.FrequestNode_Motions].getKeys()[e] : null;
	}
	getMotionCount(e) {
		return this.isExistMotionGroupName(e) ? this._jsonValue[Q.FrequestNode_Motions].getValueByString(e).getSize() : 0;
	}
	getMotionFileName(e, t) {
		return this.isExistMotionGroupName(e) ? this._jsonValue[Q.FrequestNode_Motions].getValueByString(e).getValueByIndex(t).getValueByString(this.filePath).getRawString() : "";
	}
	getMotionSoundFileName(e, t) {
		return this.isExistMotionSoundFile(e, t) ? this._jsonValue[Q.FrequestNode_Motions].getValueByString(e).getValueByIndex(t).getValueByString(this.soundPath).getRawString() : "";
	}
	getMotionFadeInTimeValue(e, t) {
		return this.isExistMotionFadeIn(e, t) ? this._jsonValue[Q.FrequestNode_Motions].getValueByString(e).getValueByIndex(t).getValueByString(this.fadeInTime).toFloat() : -1;
	}
	getMotionFadeOutTimeValue(e, t) {
		return this.isExistMotionFadeOut(e, t) ? this._jsonValue[Q.FrequestNode_Motions].getValueByString(e).getValueByIndex(t).getValueByString(this.fadeOutTime).toFloat() : -1;
	}
	getUserDataFile() {
		return this.isExistUserDataFile() ? this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.userData).getRawString() : "";
	}
	getLayoutMap(e) {
		let t = this.getJson().getRoot().getValueByString(this.layout).getMap();
		if (t == null) return !1;
		let n = !1;
		for (let r of t) e.set(r[0], r[1].toFloat()), n = !0;
		return n;
	}
	getEyeBlinkParameterCount() {
		if (!this.isExistEyeBlinkParameters()) return 0;
		let e = 0;
		for (let t = 0; t < this._jsonValue[Q.FrequestNode_Groups].getSize(); t++) {
			let n = this._jsonValue[Q.FrequestNode_Groups].getValueByIndex(t);
			if (!(n.isNull() || n.isError()) && n.getValueByString(this.name).getRawString() == this.eyeBlink) {
				e = n.getValueByString(this.ids).getVector().length;
				break;
			}
		}
		return e;
	}
	getEyeBlinkParameterId(e) {
		if (!this.isExistEyeBlinkParameters()) return null;
		for (let t = 0; t < this._jsonValue[Q.FrequestNode_Groups].getSize(); t++) {
			let n = this._jsonValue[Q.FrequestNode_Groups].getValueByIndex(t);
			if (!(n.isNull() || n.isError()) && n.getValueByString(this.name).getRawString() == this.eyeBlink) return j.getIdManager().getId(n.getValueByString(this.ids).getValueByIndex(e).getRawString());
		}
		return null;
	}
	getLipSyncParameterCount() {
		if (!this.isExistLipSyncParameters()) return 0;
		let e = 0;
		for (let t = 0; t < this._jsonValue[Q.FrequestNode_Groups].getSize(); t++) {
			let n = this._jsonValue[Q.FrequestNode_Groups].getValueByIndex(t);
			if (!(n.isNull() || n.isError()) && n.getValueByString(this.name).getRawString() == this.lipSync) {
				e = n.getValueByString(this.ids).getVector().length;
				break;
			}
		}
		return e;
	}
	getLipSyncParameterId(e) {
		if (!this.isExistLipSyncParameters()) return null;
		for (let t = 0; t < this._jsonValue[Q.FrequestNode_Groups].getSize(); t++) {
			let n = this._jsonValue[Q.FrequestNode_Groups].getValueByIndex(t);
			if (!(n.isNull() || n.isError()) && n.getValueByString(this.name).getRawString() == this.lipSync) return j.getIdManager().getId(n.getValueByString(this.ids).getValueByIndex(e).getRawString());
		}
		return null;
	}
	isExistModelFile() {
		let e = this._jsonValue[Q.FrequestNode_Moc];
		return !e.isNull() && !e.isError();
	}
	isExistTextureFiles() {
		let e = this._jsonValue[Q.FrequestNode_Textures];
		return !e.isNull() && !e.isError();
	}
	isExistHitAreas() {
		let e = this._jsonValue[Q.FrequestNode_HitAreas];
		return !e.isNull() && !e.isError();
	}
	isExistPhysicsFile() {
		let e = this._jsonValue[Q.FrequestNode_Physics];
		return !e.isNull() && !e.isError();
	}
	isExistPoseFile() {
		let e = this._jsonValue[Q.FrequestNode_Pose];
		return !e.isNull() && !e.isError();
	}
	isExistExpressionFile() {
		let e = this._jsonValue[Q.FrequestNode_Expressions];
		return !e.isNull() && !e.isError();
	}
	isExistMotionGroups() {
		let e = this._jsonValue[Q.FrequestNode_Motions];
		return !e.isNull() && !e.isError();
	}
	isExistMotionGroupName(e) {
		let t = this._jsonValue[Q.FrequestNode_Motions].getValueByString(e);
		return !t.isNull() && !t.isError();
	}
	isExistMotionSoundFile(e, t) {
		let n = this._jsonValue[Q.FrequestNode_Motions].getValueByString(e).getValueByIndex(t).getValueByString(this.soundPath);
		return !n.isNull() && !n.isError();
	}
	isExistMotionFadeIn(e, t) {
		let n = this._jsonValue[Q.FrequestNode_Motions].getValueByString(e).getValueByIndex(t).getValueByString(this.fadeInTime);
		return !n.isNull() && !n.isError();
	}
	isExistMotionFadeOut(e, t) {
		let n = this._jsonValue[Q.FrequestNode_Motions].getValueByString(e).getValueByIndex(t).getValueByString(this.fadeOutTime);
		return !n.isNull() && !n.isError();
	}
	isExistUserDataFile() {
		let e = this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.userData);
		return !e.isNull() && !e.isError();
	}
	isExistEyeBlinkParameters() {
		if (this._jsonValue[Q.FrequestNode_Groups].isNull() || this._jsonValue[Q.FrequestNode_Groups].isError()) return !1;
		for (let e = 0; e < this._jsonValue[Q.FrequestNode_Groups].getSize(); ++e) if (this._jsonValue[Q.FrequestNode_Groups].getValueByIndex(e).getValueByString(this.name).getRawString() == this.eyeBlink) return !0;
		return !1;
	}
	isExistLipSyncParameters() {
		if (this._jsonValue[Q.FrequestNode_Groups].isNull() || this._jsonValue[Q.FrequestNode_Groups].isError()) return !1;
		for (let e = 0; e < this._jsonValue[Q.FrequestNode_Groups].getSize(); ++e) if (this._jsonValue[Q.FrequestNode_Groups].getValueByIndex(e).getValueByString(this.name).getRawString() == this.lipSync) return !0;
		return !1;
	}
	_json;
	_jsonValue;
	version = "Version";
	fileReferences = "FileReferences";
	groups = "Groups";
	layout = "Layout";
	hitAreas = "HitAreas";
	moc = "Moc";
	textures = "Textures";
	physics = "Physics";
	pose = "Pose";
	expressions = "Expressions";
	motions = "Motions";
	userData = "UserData";
	name = "Name";
	filePath = "File";
	id = "Id";
	ids = "Ids";
	target = "Target";
	idle = "Idle";
	tapBody = "TapBody";
	pinchIn = "PinchIn";
	pinchOut = "PinchOut";
	shake = "Shake";
	flickHead = "FlickHead";
	parameter = "Parameter";
	soundPath = "Sound";
	fadeInTime = "FadeInTime";
	fadeOutTime = "FadeOutTime";
	centerX = "CenterX";
	centerY = "CenterY";
	x = "X";
	y = "Y";
	width = "Width";
	height = "Height";
	lipSync = "LipSync";
	eyeBlink = "EyeBlink";
	initParameter = "init_param";
	initPartsVisible = "init_parts_visible";
	val = "val";
}, wi;
(function(e) {
	e.CubismModelSettingJson = Ci, e.FrequestNode = Q;
})(wi ||= {});
//#endregion
//#region vendor/compiled/Framework/src/effect/cubismlook.js
var Ti = class e {
	static create() {
		return new e();
	}
	static delete(e) {
		e != null && (e = null);
	}
	setParameters(e) {
		this._lookParameters = e;
	}
	getParameters() {
		return this._lookParameters;
	}
	updateParameters(e, t, n) {
		for (let r = 0; r < this._lookParameters.length; ++r) {
			let i = this._lookParameters[r];
			e.addParameterValueById(i.parameterId, i.factorX * t + i.factorY * n + i.factorXY * t * n);
		}
	}
	constructor() {
		this._lookParameters = [];
	}
	_lookParameters;
}, Ei = class {
	constructor(e, t, n, r) {
		this.parameterId = e ?? null, this.factorX = t ?? 0, this.factorY = n ?? 0, this.factorXY = r ?? 0;
	}
	parameterId;
	factorX;
	factorY;
	factorXY;
}, Di;
(function(e) {
	e.LookParameterData = Ei, e.CubismLook = Ti;
})(Di ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/icubismupdater.js
var Oi;
(function(e) {
	e[e.CubismUpdateOrder_EyeBlink = 200] = "CubismUpdateOrder_EyeBlink", e[e.CubismUpdateOrder_Expression = 300] = "CubismUpdateOrder_Expression", e[e.CubismUpdateOrder_Drag = 400] = "CubismUpdateOrder_Drag", e[e.CubismUpdateOrder_Breath = 500] = "CubismUpdateOrder_Breath", e[e.CubismUpdateOrder_Physics = 600] = "CubismUpdateOrder_Physics", e[e.CubismUpdateOrder_LipSync = 700] = "CubismUpdateOrder_LipSync", e[e.CubismUpdateOrder_Pose = 800] = "CubismUpdateOrder_Pose", e[e.CubismUpdateOrder_Max = 2 ** 53 - 1] = "CubismUpdateOrder_Max";
})(Oi ||= {});
var $ = class {
	static sortFunction(e, t) {
		if (!e || !t) {
			if (!e && !t) return 0;
			if (!e) return 1;
			if (!t) return -1;
		}
		return e.getExecutionOrder() - t.getExecutionOrder();
	}
	_executionOrder;
	_changeListeners = [];
	constructor(e = 0) {
		this._executionOrder = e;
	}
	getExecutionOrder() {
		return this._executionOrder;
	}
	setExecutionOrder(e) {
		this._executionOrder !== e && (this._executionOrder = e, this.notifyChangeListeners());
	}
	addChangeListener(e) {
		e && this._changeListeners.indexOf(e) === -1 && this._changeListeners.push(e);
	}
	removeChangeListener(e) {
		let t = this._changeListeners.indexOf(e);
		t >= 0 && this._changeListeners.splice(t, 1);
	}
	notifyChangeListeners() {
		for (let e of this._changeListeners) e.onUpdaterChanged(this);
	}
}, ki;
(function(e) {
	e.ICubismUpdater = $;
})(ki ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/cubismupdatescheduler.js
var Ai = class {
	_cubismUpdatableList;
	_needsSort;
	constructor() {
		this._cubismUpdatableList = [], this._needsSort = !1;
	}
	release() {
		for (let e of this._cubismUpdatableList) e && e.removeChangeListener(this);
		this._cubismUpdatableList.length = 0;
	}
	addUpdatableList(e) {
		e && (this.hasUpdatable(e) || (this._cubismUpdatableList.push(e), e.addChangeListener(this), this._needsSort = !0));
	}
	removeUpdatableList(e) {
		if (!e) return !1;
		let t = this._cubismUpdatableList.indexOf(e);
		return t >= 0 ? (this._cubismUpdatableList.splice(t, 1), e.removeChangeListener(this), !0) : !1;
	}
	sortUpdatableList() {
		this._cubismUpdatableList.sort($.sortFunction), this._needsSort = !1;
	}
	onLateUpdate(e, t) {
		if (e) {
			this._needsSort && this.sortUpdatableList();
			for (let n = 0; n < this._cubismUpdatableList.length; ++n) {
				let r = this._cubismUpdatableList[n];
				r && r.onLateUpdate(e, t);
			}
		}
	}
	getUpdatableCount() {
		return this._cubismUpdatableList.length;
	}
	getUpdatable(e) {
		return e < 0 || e >= this._cubismUpdatableList.length ? null : this._cubismUpdatableList[e];
	}
	hasUpdatable(e) {
		return this._cubismUpdatableList.indexOf(e) >= 0;
	}
	clearUpdatableList() {
		for (let e of this._cubismUpdatableList) e && e.removeChangeListener(this);
		this._cubismUpdatableList.length = 0, this._needsSort = !1;
	}
	onUpdaterChanged(e) {
		this._needsSort = !0;
	}
}, ji;
(function(e) {
	e.CubismUpdateScheduler = Ai;
})(ji ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/cubismeyeblinkupdater.js
var Mi = class extends $ {
	_motionUpdated;
	_eyeBlink;
	constructor(e, t, n) {
		super(n ?? Oi.CubismUpdateOrder_EyeBlink), this._motionUpdated = e, this._eyeBlink = t;
	}
	onLateUpdate(e, t) {
		e && (this._motionUpdated() || this._eyeBlink.updateParameters(e, t));
	}
}, Ni;
(function(e) {
	e.CubismEyeBlinkUpdater = Mi;
})(Ni ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/cubismbreathupdater.js
var Pi = class extends $ {
	_breath;
	constructor(e, t) {
		super(t ?? Oi.CubismUpdateOrder_Breath), this._breath = e;
	}
	onLateUpdate(e, t) {
		e && this._breath.updateParameters(e, t);
	}
}, Fi;
(function(e) {
	e.CubismBreathUpdater = Pi;
})(Fi ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/cubismlookupdater.js
var Ii = class extends $ {
	_look;
	_dragManager;
	constructor(e, t, n) {
		super(n ?? Oi.CubismUpdateOrder_Drag), this._look = e, this._dragManager = t;
	}
	onLateUpdate(e, t) {
		if (!e) return;
		this._dragManager.update(t);
		let n = this._dragManager.getX(), r = this._dragManager.getY();
		this._look.updateParameters(e, n, r);
	}
}, Li;
(function(e) {
	e.CubismLookUpdater = Ii;
})(Li ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/cubismphysicsupdater.js
var Ri = class extends $ {
	_physics;
	constructor(e, t) {
		super(t ?? Oi.CubismUpdateOrder_Physics), this._physics = e;
	}
	onLateUpdate(e, t) {
		e && this._physics.evaluate(e, t);
	}
}, zi;
(function(e) {
	e.CubismPhysicsUpdater = Ri;
})(zi ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/cubismposeupdater.js
var Bi = class extends $ {
	_pose;
	constructor(e, t) {
		super(t ?? Oi.CubismUpdateOrder_Pose), this._pose = e;
	}
	onLateUpdate(e, t) {
		e && this._pose.updateParameters(e, t);
	}
}, Vi;
(function(e) {
	e.CubismPoseUpdater = Bi;
})(Vi ||= {});
//#endregion
//#region vendor/compiled/Framework/src/motion/cubismexpressionupdater.js
var Hi = class extends $ {
	_expressionManager;
	constructor(e, t) {
		super(t ?? Oi.CubismUpdateOrder_Expression), this._expressionManager = e;
	}
	onLateUpdate(e, t) {
		e && this._expressionManager.updateMotion(e, t);
	}
}, Ui;
(function(e) {
	e.CubismExpressionUpdater = Hi;
})(Ui ||= {});
//#endregion
//#region src/sdk/cubism.ts
function Wi() {
	j.isInitialized() || (j.startUp(), j.initialize());
}
function Gi() {
	X.getInstance().release(), Yr.getInstance().release();
}
var Ki = class extends yi {
	gl;
	config;
	signal;
	emit;
	settings;
	scheduler = new Ai();
	look = Ti.create();
	textures = [];
	motions = /* @__PURE__ */ new Map();
	expressions = /* @__PURE__ */ new Map();
	blinkIds = [];
	expressionRevision = 0;
	motionUpdated = !1;
	projection = new c();
	disposed = !1;
	actionRevision = 0;
	actionLoading = !1;
	idleFailed = !1;
	capabilities;
	activeMotion = !1;
	constructor(e, t, n, r) {
		super(), this.gl = e, this.config = t, this.signal = n, this.emit = r;
	}
	async bytes(e) {
		let t = new URL(e, new URL(this.config.url, document.baseURI)), n = await fetch(t, { signal: this.signal });
		if (!n.ok) throw Error(`Resource ${n.status}: ${t.pathname}`);
		if (n.headers.get("content-type")?.includes("text/html")) throw Error(`Expected model resource, received an HTML page: ${t.pathname}`);
		let r = await n.arrayBuffer();
		return this.signal.throwIfAborted(), r;
	}
	async initialize(e) {
		let t = await this.bytes("");
		this.settings = new Ci(t, t.byteLength);
		let n = await this.bytes(this.settings.getModelFileName());
		if (this.loadModel(n, !0), !this.getModel()) throw Error("The SDK could not read this moc3 model.");
		for (let [e, t] of [[this.settings.getPhysicsFileName(), (e) => this.loadPhysics(e, e.byteLength)], [this.settings.getPoseFileName(), (e) => this.loadPose(e, e.byteLength)]]) e && t(await this.bytes(e));
		let r = /* @__PURE__ */ new Map();
		this.settings.getLayoutMap(r), this._modelMatrix.setupFromLayout(r);
		let i = Array.from({ length: this._model.getParameterCount() }, (e, t) => ({
			id: this._model.getParameterId(t).getString(),
			min: this._model.getParameterMinimumValue(t),
			max: this._model.getParameterMaximumValue(t)
		}));
		this.capabilities = {
			parameters: i,
			motions: Array.from({ length: this.settings.getMotionGroupCount() }, (e, t) => {
				let n = this.settings.getMotionGroupName(t);
				return {
					group: n,
					count: this.settings.getMotionCount(n)
				};
			}),
			expressions: Array.from({ length: this.settings.getExpressionCount() }, (e, t) => this.settings.getExpressionName(t)),
			hitAreas: Array.from({ length: this.settings.getHitAreasCount() }, (e, t) => this.settings.getHitAreaName(t))
		};
		for (let [e, t] of Object.entries(this.config.actions)) this.validateMotion(t, `actions.${e}`);
		if (this.config.tapHitArea && !this.capabilities.hitAreas.includes(this.config.tapHitArea)) throw Error(`Unknown hit area: ${this.config.tapHitArea}`);
		for (let e of this.config.interactionRegions ?? []) {
			if (!Array.isArray(e.bounds) || e.bounds.length !== 4 || !e.bounds.every(Number.isFinite) || e.bounds[0] >= e.bounds[2] || e.bounds[1] >= e.bounds[3]) throw Error(`Invalid region bounds: ${e.id}`);
			for (let [t, n] of Object.entries(e.actions)) {
				if (![
					"click",
					"doubleClick",
					"hold"
				].includes(t)) throw Error(`Unknown gesture: ${e.id}.${t}`);
				this.validateMotion(n, `${e.id}.${t}`);
			}
		}
		let a = this.config.framing;
		if (a && (Object.values(a).some((e) => !Number.isFinite(e)) || (a.scale ?? 1) <= 0)) throw Error("Invalid framing configuration.");
		this.scheduler.addUpdatableList(new Hi(this._expressionManager));
		let o = (e) => j.getIdManager().getId(e), s = (e) => i.some((t) => t.id === e), c = this.config.blinkParameters ?? Array.from({ length: this.settings.getEyeBlinkParameterCount() }, (e, t) => this.settings.getEyeBlinkParameterId(t).getString());
		this.blinkIds = c.map((e) => {
			if (!s(e)) throw Error(`Invalid blink parameter: ${e}`);
			return o(e);
		}), this.blinkIds.length && (this._eyeBlink = be.create(this.settings), this._eyeBlink.setParameterIds(this.blinkIds), this.scheduler.addUpdatableList(new Mi(() => this.motionUpdated, this._eyeBlink)));
		let l = (e, t) => s(e) ? e : t, u = i.find((e) => e.id === l("ParamBreath", "PARAM_BREATH"));
		this._breath = _e.create(), this._breath.setParameters(u ? [new ve(o(u.id), (u.min + u.max) / 2, (u.max - u.min) / 2, 3.2345, 1)] : []), this.scheduler.addUpdatableList(new Pi(this._breath));
		let d = this.config.follow ?? [
			{
				id: l("ParamAngleX", "PARAM_ANGLE_X"),
				x: 1
			},
			{
				id: l("ParamAngleY", "PARAM_ANGLE_Y"),
				y: 1
			},
			{
				id: l("ParamAngleZ", "PARAM_ANGLE_Z"),
				xy: -1
			},
			{
				id: l("ParamBodyAngleX", "PARAM_BODY_ANGLE_X"),
				x: 1 / 3
			},
			{
				id: l("ParamEyeBallX", "PARAM_EYE_BALL_X"),
				x: 1
			},
			{
				id: l("ParamEyeBallY", "PARAM_EYE_BALL_Y"),
				y: 1
			}
		].filter((e) => s(e.id));
		this.look.setParameters(d.map(({ id: e, x: t = 0, y: n = 0, xy: r = 0 }) => {
			let a = i.find((t) => t.id === e);
			if (!a || ![
				t,
				n,
				r
			].every(Number.isFinite)) throw Error(`Invalid follow mapping: ${e}`);
			let s = (a.max - a.min) / 2;
			return new Ei(o(e), t * s, n * s, r * s);
		})), this.scheduler.addUpdatableList(new Ii(this.look, this._dragManager)), this._physics && this.scheduler.addUpdatableList(new Ri(this._physics)), this._pose && this.scheduler.addUpdatableList(new Bi(this._pose)), this.scheduler.sortUpdatableList();
		let f = this.gl;
		this.createRenderer(f.canvas.width, f.canvas.height), this.getRenderer().startUp(f), this.getRenderer().setIsPremultipliedAlpha(!0);
		for (let e = 0; e < this.settings.getTextureCount(); e++) {
			let t = await this.bytes(this.settings.getTextureFileName(e)), n = await createImageBitmap(new Blob([t]), { premultiplyAlpha: "premultiply" });
			try {
				this.signal.throwIfAborted();
				let t = f.createTexture();
				this.textures.push(t), f.bindTexture(f.TEXTURE_2D, t);
				let r = f instanceof WebGL2RenderingContext || (n.width & n.width - 1) == 0 && (n.height & n.height - 1) == 0;
				f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MIN_FILTER, r ? f.LINEAR_MIPMAP_LINEAR : f.LINEAR), f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MAG_FILTER, f.LINEAR), f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_S, f.CLAMP_TO_EDGE), f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_T, f.CLAMP_TO_EDGE), f.texImage2D(f.TEXTURE_2D, 0, f.RGBA, f.RGBA, f.UNSIGNED_BYTE, n), r && f.generateMipmap(f.TEXTURE_2D), this.getRenderer().bindTexture(e, t);
			} finally {
				n.close();
			}
		}
		let p = X.getInstance().getShader(f);
		if (p.setShaderPath(new URL(e, document.baseURI).href.replace(/\/?$/, "/")), !p._isShaderLoaded) {
			p.generateShaders();
			let e = Date.now() + 2e4;
			for (; p._isShaderLoading && Date.now() < e;) await new Promise((e) => setTimeout(e, 16));
			if (!p._isShaderLoaded || !p._shaderSets[0].shaderProgram) throw Error("SDK shader initialization failed.");
		}
		this.signal.throwIfAborted(), this._model.saveParameters(), this._model.update();
	}
	validateMotion(e, t) {
		let n = this.capabilities.motions.find((t) => t.group === e?.group);
		if (!n?.count || e.index !== void 0 && (!Number.isInteger(e.index) || e.index < 0 || e.index >= n.count)) throw Error(`Invalid motion mapping ${t}: ${JSON.stringify(e)}`);
	}
	async setExpression(e, t = !1) {
		let n = ++this.expressionRevision;
		if (e === null) {
			this._expressionManager.stopAllMotions(), this.emit("expressionchange", { name: e });
			return;
		}
		let r = this.capabilities.expressions.indexOf(e);
		if (r < 0) throw Error(`Unknown expression: ${e}`);
		let i = this.expressions.get(e);
		if (!i) {
			let t = await this.bytes(this.settings.getExpressionFileName(r));
			if (this.disposed || n !== this.expressionRevision) return;
			if (i = this.loadExpression(t, t.byteLength, e), !i) throw Error(`Invalid expression: ${e}`);
			this.expressions.set(e, i);
		}
		this._expressionManager.startMotion(i, !1), t && (this._model.loadParameters(), this._expressionManager.updateMotion(this._model, 0), this._model.loadParameters(), this._expressionManager.updateMotion(this._model, Math.max(0, ...Array.from(this.expressions.values(), (e) => Math.max(e.getFadeInTime(), e.getFadeOutTime()))))), this.emit("expressionchange", { name: e });
	}
	async play(e, t = 3) {
		this.validateMotion(e, "playMotion");
		let n = this.capabilities.motions.find((t) => t.group === e.group), r = e.index ?? Math.floor(Math.random() * n.count), i = `${n.group}:${r}`, a = ++this.actionRevision;
		this.actionLoading = !0;
		try {
			let e = this.motions.get(i);
			if (!e) {
				let t = await this.bytes(this.settings.getMotionFileName(n.group, r));
				if (a !== this.actionRevision || this.disposed) return !1;
				if (e = this.loadMotion(t, t.byteLength, i, void 0, void 0, this.settings, n.group, r, !0), !e) throw Error(`Invalid motion: ${i}`);
				e.setEffectIds(this.blinkIds, []), this.motions.set(i, e);
			}
			return e.setFinishedMotionHandler(() => {
				a === this.actionRevision && (this.activeMotion = !1), this.emit("motionend", {
					group: n.group,
					index: r
				});
			}), this._motionManager.startMotionPriority(e, !1, t), this.activeMotion = !0, this.emit("motionstart", {
				group: n.group,
				index: r
			}), !0;
		} finally {
			a === this.actionRevision && (this.actionLoading = !1);
		}
	}
	update(e, t) {
		this._model.loadParameters(), this.motionUpdated = this._motionManager.updateMotion(this._model, e), this._model.saveParameters(), t || this.activeMotion ? this.scheduler.onLateUpdate(this._model, e) : this._expressionManager.updateMotion(this._model, e), this._model.update(), t && !this.idleFailed && this._motionManager.isFinished() && !this.actionLoading && this.config.actions.idle && this.play(this.config.actions.idle, 1).catch((e) => {
			this.idleFailed = !0, this.signal.aborted || this.emit("error", e);
		});
	}
	stop() {
		++this.actionRevision, this.actionLoading = !1, this._motionManager.stopAllMotions(), this.activeMotion = !1, this.setDragging(0, 0);
	}
	draw() {
		let e = this.gl, t = e.canvas.width, n = e.canvas.height, r = Yr.getInstance();
		r.beginFrameProcess(e), e.bindFramebuffer(e.FRAMEBUFFER, null), e.viewport(0, 0, t, n), e.clearColor(0, 0, 0, 0), e.clear(e.COLOR_BUFFER_BIT), this.projection.loadIdentity();
		let i = Math.min(.94, .94 * t / n * this._model.getCanvasHeight() / this._model.getCanvasWidth()), a = this.config.framing, o = a?.scale ?? 1;
		this.projection.scale(i * n * o / t, i * o), this.projection.translate(a?.x ?? 0, a?.y ?? 0);
		let s = new c();
		s.setMatrix(this.projection.getArray()), s.multiplyByMatrix(this._modelMatrix), this.getRenderer().setMvpMatrix(s), this.setRenderTargetSize(t, n), this.getRenderer().setRenderState(null, [
			0,
			0,
			t,
			n
		]), this.getRenderer().drawModel(), r.endFrameProcess(e), r.releaseStaleRenderTextures(e);
	}
	visibleBounds() {
		this.draw();
		let e = this.gl, t = e.canvas.width, n = e.canvas.height, r = new Uint8Array(t * n * 4);
		e.bindFramebuffer(e.FRAMEBUFFER, null), e.readPixels(0, 0, t, n, e.RGBA, e.UNSIGNED_BYTE, r);
		let i = t, a = -1, o = n, s = -1;
		for (let e = 0; e < n; e++) for (let n = 0; n < t; n++) r[(e * t + n) * 4 + 3] < 8 || (i = Math.min(i, n), a = Math.max(a, n), o = Math.min(o, e), s = Math.max(s, e));
		if (!(a < i)) return {
			left: i / t,
			right: (a + 1) / t,
			top: 1 - (s + 1) / n,
			bottom: 1 - o / n
		};
	}
	hit(e, t, n) {
		let r = this.projection.invertTransformX(e), i = this.projection.invertTransformY(t);
		if (n) {
			for (let e = 0; e < this.settings.getHitAreasCount(); e++) if (this.settings.getHitAreaName(e) === this.config.tapHitArea && this.isHit(this.settings.getHitAreaId(e), r, i)) return !0;
			return !1;
		}
		let a = this._modelMatrix.invertTransformX(r), o = this._modelMatrix.invertTransformY(i);
		for (let e = 0; e < this._model.getDrawableCount(); e++) {
			if (this._model.getDrawableOpacity(e) < .05) continue;
			let t = this._model.getDrawableVertices(e), n = this._model.getDrawableVertexIndices(e);
			for (let e = 0; e < n.length; e += 3) {
				let r = n[e] * 2, i = n[e + 1] * 2, s = n[e + 2] * 2, c = (e, n) => (a - t[n]) * (t[e + 1] - t[n + 1]) - (t[e] - t[n]) * (o - t[n + 1]), l = c(r, i), u = c(i, s), d = c(s, r);
				if (Math.abs(l) + Math.abs(u) + Math.abs(d) > 1e-8 && !((l < 0 || u < 0 || d < 0) && (l > 0 || u > 0 || d > 0))) return !0;
			}
		}
		return !1;
	}
	release() {
		if (!this.disposed) {
			this.disposed = !0, ++this.expressionRevision, this._expressionManager.stopAllMotions();
			for (let e of this.expressions.values()) Le.delete(e);
			this.expressions.clear(), ++this.actionRevision, this.scheduler.release(), this._motionManager.stopAllMotions();
			for (let e of this.motions.values()) Wt.delete(e);
			this.motions.clear();
			for (let e of this.textures) this.gl.deleteTexture(e);
			this.textures.length = 0, this.settings?.release(), Ti.delete(this.look), super.release();
		}
	}
};
//#endregion
export { Ki as CubismActor, Wi as initializeFramework, Gi as releaseContexts };
