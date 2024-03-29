var TINGYUN = function (e, t, n) {
    function r(e) {
        var t = !!e && "length" in e && e.length,
            n = typeof e;
        return "function" !== n && ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
    }

    function i(e, t) {
        var n, i = 0;
        if (e)
            if (r(e))
                for (n = e.length; i < n && !1 !== t.call(e[i], e[i], i); i++);
            else
                for (i in e)
                    if (!1 === t.call(e[i], e[i], i)) break;
        return e
    }

    function o(e) {
        return function (t) {
            return "Array" === e && Array.isArray ? Array.isArray(t) : Object.prototype.toString.call(t) === "[object " + e + "]"
        }
    }

    function a(e) {
        switch (typeof e) {
            case "object":
                if (!e) return null;
                if (e instanceof Array) return i(e, function (t, n) {
                    e[n] = a(t)
                }), "[" + e.join(",") + "]";
                if (e instanceof Date) return e.getTime().toString();
                var t = "";
                return i(e, function (e, n) {
                    Re(e) || (t += a(n) + ":" + a(e) + ",")
                }), t && (t = t.substr(0, t.length - 1)), "{" + t + "}";
            case "string":
                return Oe + e.replace(Le, "\\$1").replace(De, "\\n") + Oe;
            case "number":
                return isNaN(e) ? null : e;
            case "boolean":
                return e;
            case "function":
                return a(e.toString());
            case "undefined":
            default:
                return '"undefined"'
        }
    }

    function u(e) {
        return e && qe(e) ? ke(e) : e
    }

    function c(e, t, n, r) {
        var i = function () {
            return Me(e, t, i), n.apply(this, arguments)
        };
        return Be(e, t, i, r)
    }

    function s(e, t) {
        return Function.prototype.apply.apply(e, t)
    }

    function f(e, t) {
        return function () {
            e.apply(t, arguments)
        }
    }

    function l(e) {
        return He ? He(e) : e
    }

    function d(e) {
        return arguments.length < 2 || !e ? e : (i(Pe.call(arguments, 1), function (t) {
            i(t, function (t, n) {
                e[n] = t
            })
        }), e)
    }

    function h(e, t) {
        for (var n = -1, r = 0, i = null == e ? 0 : e.length, o = []; ++n < i;) {
            var a = e[n];
            t(a, n, e) && (o[r++] = a)
        }
        return o
    }

    function v(e, t) {
        return e ? t ? e.replace(/\{(\w+.?\w+)\}/g, function (e, n) {
            return t[n] || ""
        }).replace(/\{(\d+)\}/g, function (e, n) {
            return t[n] || ""
        }) : e : ""
    }

    function p(e) {
        return setTimeout(e, 0)
    }

    function m() {}

    function g() {
        return +new Date
    }

    function y(e) {
        return function () {
            if (null !== e) {
                var t = e;
                e = null, t.apply(this, arguments)
            }
        }
    }

    function S(e) {
        return e ? qe(e) ? e.length : t.ArrayBuffer && e instanceof ArrayBuffer ? e.byteLength : t.Blob && e instanceof Blob ? e.size : e.length ? e.length : 0 : 0
    }

    function b(e) {
        return Ue !== ze && /^https/i.test(e && e.protocol || Ue) ? "https:" : ze
    }

    function w(e, t, n, r) {
        var o = null;
        return e && t && (o = b(r) + "//" + e + t, n && (o += "?", i(n, function (e, t) {
            var n = [l(t), "=", l(e), "&"];
            o += n.join("")
        }), o += "__r=" + g())), o
    }

    function E() {
        this.events = {}
    }

    function _(e) {
        return !(e in Ke) || Ke[e]
    }

    function x(e) {
        var t = Ge.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));
        return t ? t[3] : null
    }

    function T(e, t, n) {
        var r = e + "=" + t;
        if (n) {
            var i = new Date;
            i.setTime(i.getTime() + 1e3 * n), r += ";expires=" + i.toGMTString()
        }
        Ge.cookie = r
    }

    function k(e, t, n) {
        var r = Ge.createElement(e);
        try {
            for (var i in t) r[i] = t[i]
        } catch (a) {
            var o = "<" + e;
            for (var i in t) o += " " + i + '="' + t[i] + '"';
            o += ">", n || (o += "</" + e + ">"), r = Ge.createElement(o)
        }
        return r
    }

    function I(e, t, n, r) {
        Re(n) && (r = n);
        var i = k("div", {
                style: yt
            }),
            o = k("iframe", {
                name: "ty_form",
                width: 0,
                height: 0,
                style: yt
            }),
            a = k("form", {
                style: yt,
                action: e,
                enctype: "application/x-www-form-urlencoded",
                method: "post",
                target: "ty_form"
            }),
            u = k("input", {
                name: "data",
                type: "hidden"
            }, !0);
        u.value = Ie(t), a.appendChild(u), i.appendChild(o), i.appendChild(a), Ge.body.appendChild(i), a.submit(), o.onreadystatechange = function () {
            o.readyState !== ft && 4 !== o.readyState || (r(null, o.innerHTML), Ge.body.removeChild(i))
        }
    }

    function q(e, t, n) {
        if (e && n && Re(n)) {
            var r = e[t];
            if (!r || !r._wrapped) {
                var i = n(r);
                return i && (i._wrapped = !0), e[t] = i, i
            }
        }
    }

    function N(e) {
        wt && e()
    }

    function R(e) {
        return function () {
            wt && e.apply(this, arguments)
        }
    }

    function A() {
        wt = !1
    }

    function C() {
        Tt.on(ot, y(function () {
            e();
            var t = g();
            N(function () {
                Et.load = t
            }), Nt.loadEventEnd = t
        })), i([ot, at, ut, ct], function (e) {
            Be(t, e, function (t) {
                N(function () {
                    (Et.e[e] || (Et.e[e] = [])).push(g())
                }), Tt.emit(e, t)
            })
        });
        var e = y(function () {
            var e = g();
            N(function () {
                Et.end = e
            }), Nt.domContentLoadedEventStart = e, Ge.querySelectorAll && (xt.resources = xt.resources || [], i(Ge.querySelectorAll("head>link,head>script"), function (e) {
                var t;
                "LINK" == e.tagName ? t = e.href : "SCRIPT" != e.tagName || e.defer || e.async || (t = e.src), t && xt.resources.push(t)
            }))
        });
        Be(Ge, "DOMContentLoaded", e), Be(Ge, st, function (t) {
            Ge.readyState === ft && e()
        });
        var n = y(function () {
            Nt.touch = g()
        });
        i(["scroll", "click", "keypress"], function (e) {
            c(Ge, e, n)
        });
        var r = t.requestAnimationFrame;
        !r || r.toString().indexOf("[native code]") < 0 || q(t, "requestAnimationFrame", function (e) {
            return function () {
                if (!Nt.firstPaint) {
                    var n = g();
                    N(function () {
                        Et.an.count++, Et.an.t = n
                    }), Nt.firstPaint = n, t.requestAnimationFrame = e
                }
                return e.apply(this, arguments)
            }
        })
    }

    function O(e) {
        D(e, kt)
    }

    function L(e) {
        D(e, It)
    }

    function D(e, t) {
        var n = "ok";
        if (!e) return n = t.length ? t.join("\n") : n;
        t.push(e)
    }

    function j() {
        var e = this;
        e.xhrs = {}, e.errs = [], E.call(e)
    }

    function B(e, t) {
        this.flags = 0, Re(e.create) && (this.create = e.create, this.flags |= jt), Re(e.before) && (this.before = e.before, this.flags |= Bt), Re(e.after) && (this.after = e.after, this.flags |= Mt), Re(e.error) && (this.error = e.error, this.flags |= Ht), this.data = t
    }

    function M(e, t) {
        if (!Ft) {
            if (!Ae(e) || !e) throw new TypeError("callbacks arguments must be an object");
            return Ft = new B(e, t)
        }
    }

    function H(e) {
        var t = Ft.data;
        if (0 != (Ft.flags & jt)) {
            var n = Ft.create(Ft.data);
            n !== undefined && (t = n)
        }
        return function () {
            0 != (Ft.flags & Bt) && Ft.before(this, t);
            try {
                var n = e.apply(this, arguments)
            } catch (r) {
                throw 0 != (Ft.flags & Ht) && Ft.error(t, r), r
            }
            return 0 != (Ft.flags & Mt) && Ft.after(this, t), n
        }
    }

    function P(e) {
        return !Ft || Ft.flags <= 0 ? e : H(e)
    }

    function F() {
        function e(e) {
            return function (t) {
                var n = Pe.call(arguments, 0);
                Re(t) && (n[0] = P(t));
                var r = this;
                try {
                    return e.apply(r, n)
                } catch (i) {}
                return s(e, [r, n])
            }
        }
        q(t, "setTimeout", e), q(t, "setInterval", e)
    }

    function U() {
        this.id = null, this.active = null, this._set = []
    }

    function z() {
        F();
        var e = new U;
        return e.id = M({
            create: function () {
                return e.active
            },
            before: function (t, n) {
                n && e.enter(n)
            },
            after: function (t, n) {
                n && e.exit(n)
            },
            error: function (t, n) {
                if (t) {
                    try {
                        n.moduleId = t.moduleId
                    } catch (r) {}
                    e.exit(t)
                }
            }
        }), e
    }

    function Y(e) {
        Dt && console.warn(e || "Event key required!")
    }

    function X(e) {
        e = e || {}, this.key = e.key;
        var t = e.timeout || 6e5;
        this.i = t ? setTimeout(f(this.fail, this), t) : null, this.status = 1, this.remain = 0, this.xhrs = [], this.s = g(), this.e = null, this.called = this.sent = !1
    }

    function G() {
        if (Object.defineProperty) {
            var e = t[vt];
            Object.defineProperty(t, vt, {
                get: function () {
                    return Kt++ > 0 && t.console && console.warn("window.%s is deprecated, use window.%s instead.", vt, pt), e
                }
            })
        }
    }

    function J(e) {
        try {
            return u(e)
        } catch (t) {
            O(t && t.message)
        }
        return null
    }

    function $() {
        return Nt[nn] || Nt._end
    }

    function K() {
        return Nt.loadEventEnd || Nt._end
    }

    function V(e) {
        function r(t) {
            return e[t] > 0 ? e[t] - a : 0
        }
        var o = {},
            a = n;
        if (e) {
            N(function () {
                var t = Et.t = {};
                i(e, function (e, n) {
                    Re(e) || (t[n] = e)
                })
            }), a = e.navigationStart, o = {
                f: r(Wt),
                qs: r(Zt),
                rs: r(en),
                re: r(tn),
                os: r(nn),
                oe: r(rn),
                oi: r(on),
                oc: r(an),
                ls: r(un),
                le: r(cn),
                tus: r(sn),
                tue: r(fn)
            };
            var u = r(ln),
                c = r(dn),
                s = r(hn),
                f = r(vn),
                l = r(pn),
                d = r(mn);
            if (d - l > 0 && (o.cs = l, o.ce = d), c - u > 0 && (o.ds = u, o.de = c), (f - s > 0 || f > 0) && (o.es = s, o.ee = f), 0 == o.le) {
                var h = K();
                o.ue = h - a
            }
            Nt._le = o.ue || o.le;
            var v, p;
            if (e.msFirstPaint) v = e.msFirstPaint, N(function () {
                Et.fp = "m_" + v
            });
            else if ((p = t.chrome) && p.loadTimes) {
                var m = p.loadTimes();
                m && m.firstPaintTime && (v = 1e3 * m.firstPaintTime), N(function () {
                    Et.fp = "c_" + m.firstPaintTime
                })
            } else Nt.firstPaint && (v = Nt.firstPaint, N(function () {
                Et.fp = v
            }));
            v && (o.fp = Math.round(v - a), Nt.fp = o.fp), e[gn] && (o.sl = r(gn))
        } else o = {
            t: a,
            os: $() - a,
            ls: K() - a
        };
        return o.je = Nt.errs && Nt.errs.length || 0, Nt.ct && (o.ct = Nt.ct - a), Nt.touch && (o.fi = Nt.touch - a), o
    }

    function Q(e, t) {
        var r = {
            tr: !1,
            tt: l(Ge.title),
            charset: Ge.characterSet
        };
        _t.resources && d(r, _t.resources), N(function () {
            r.debug = Et
        }), A();
        var o = Nt.errs;
        i(o, function (e, r) {
            var i = e.toObject();
            i.o = i.o - t && t.navigationStart || n, o[r] = i
        }), r.err = o;
        var a = "getEntriesByType";
        return e[a] ? (r.tr = !0, r.res = [], i(e[a]("resource"), function (e) {
            function t(t) {
                var n = e[t];
                return n > 0 ? n : 0
            }
            var n = e.initiatorType,
                i = e.name,
                o = {
                    o: t("startTime"),
                    rt: n,
                    n: i,
                    f: t(Wt),
                    ds: t(ln),
                    de: t(dn),
                    cs: t(pn),
                    ce: t(mn),
                    sl: t(gn),
                    qs: t(Zt),
                    rs: t(en),
                    re: t(tn),
                    ts: e.transferSize || 0,
                    es: e.encodedBodySize || 0
                };
            if ("xmlhttprequest" === n) {
                var a = W(i);
                a && (o.aid = a.id, o.atd = a.trId, o.an = a.action, o.aq = a.time && a.time.qu, o.as = a.time && a.time.duration)
            }
            r.res.push(o)
        })) : L(v(Ct, [a])), r
    }

    function W(e) {
        var t;
        return i(Nt.xhrs, function (n, r) {
            if (r && r.indexOf(e) > -1) return t = n, !1
        }), t
    }

    function Z(e) {
        var t = {};
        return e && (t.id = e.id, t.a = e.a, t.q = e.q, t.tid = e.tid, t.n = e.n), t
    }

    function ee(e) {
        var t = 0,
            n = e.timing;
        return n ? e.getEntriesByName && (t = n.domLoading, i(xt.resources, function (r) {
            var i = e.getEntriesByName(r);
            if (1 == i.length) {
                var o = i[0].responseEnd + n.navigationStart;
                o > t && (t = o)
            }
        }), t -= n.navigationStart) : L("fp=0"), N(function () {
            Et._fp = t
        }), Math.round(t)
    }

    function te(e, n, r, o) {
        var a = r || 0,
            u = _t.firstScreenResources;
        if (u && u.length && e.getEntriesByName) return i(u, function (t) {
            var n = e.getEntriesByName(t);
            if (n.length) {
                var r = n[0].responseEnd;
                r > a && (a = r)
            }
        }), o.fs_s = 1, Math.round(a);
        if (!Ge.createElement("img").getBoundingClientRect) return N(function () {
            Et.fs = a
        }), a;
        if (e.getEntriesByName) {
            var c = t.innerHeight,
                s = [];
            i(Ge.querySelectorAll("img"), function (e) {
                !re(e) && "" != e.src && ne(e) < c && s.push(e.src)
            });
            var f = (n.loadEventEnd || Nt.loadEventEnd) - n.navigationStart;
            i(s, function (t) {
                var n = e.getEntriesByName(t);
                if (n.length) {
                    var r = n[0],
                        i = r.responseEnd;
                    r.fetchStart <= f && i > a && (a = i)
                }
            })
        }
        return Math.round(a)
    }

    function ne(e) {
        var n;
        if ("undefined" == typeof e.getBoundingClientRect) return undefined;
        n = e.getBoundingClientRect();
        var r = t.pageYOffset;
        return n.top + (0 === r ? 0 : r || Ge.scrollTop || 0) - (Ge.clientTop || 0)
    }

    function re(e) {
        var n = "none";
        if (t.getComputedStyle) {
            var r = e.ownerDocument.defaultView;
            r && r.opener || (r = t), n = r.getComputedStyle(e).display
        } else e.currentStyle && (n = e.currentStyle.display);
        return n && "none" == n
    }

    function ie(e) {
        var t = n,
            r = 0;
        return e && (t = e.navigationStart || t, r = e[nn] || e.domInteractive || e.domLoading || r), (r = Nt[nn] || r || Nt._end) - t
    }

    function oe(e) {
        if (e) {
            var t = e.fetchStart;
            if (t) return t - e.navigationStart
        }
        return undefined
    }

    function ae(e) {
        return function (t, n) {
            var r = this;
            if (!r[gt]) {
                var i = r[vt] = {};
                i.method = t, i.url = n, i.id = xn++;
                var o = zt.get("event");
                o && (i.key = o.key, o.remain++)
            }
            try {
                return e.apply(r, arguments)
            } catch (a) {}
            return s(e, [r, arguments])
        }
    }

    function ue(e) {
        return function (t) {
            var n = this;
            if (!n[gt]) {
                var r = n[vt];
                r && (r.start = g(), r.reqSize = S(t)), ce(n), n.setRequestHeader && Ke.id && r && In(r.url) && (r.r = g() % 1e9, n.setRequestHeader("X-Tingyun-Id", Ke.id + ";r=" + r.r))
            }
            try {
                return e.apply(n, arguments)
            } catch (i) {}
            return s(e, [n, arguments])
        }
    }

    function ce(e) {
        function t(t) {
            return P(function () {
                se(e);
                var n;
                if (Re(t)) {
                    var r = e[vt];
                    if (r && 4 == e.readyState) var i = g();
                    n = t.apply(this, arguments), r && 4 == e.readyState && (r.cbTime = g() - i, e[vt] = null)
                }
                return n
            })
        }

        function n(t) {
            e[vt] && (e[vt].errorCode = t)
        }
        if (e[kn]) q(e, kn, t);
        else try {
            Be(e, st, P(function () {
                se(e)
            })), i(Tn, function (t, r) {
                Be(e, r, function () {
                    n(t)
                })
            })
        } catch (r) {
            return void p(function () {
                i(Tn, function (t, r) {
                    var i = "on" + r;
                    e[i] ? q(e, i, function (e) {
                        if (n(t), Re(e)) return e.apply(this, arguments)
                    }) : e[i] = function () {
                        n(t)
                    }
                }), q(e, kn, t)
            })
        }
        p(function () {
            q(e, kn, t)
        })
    }

    function se(e) {
        var t = e[vt];
        if (t && (t.end = g(), t.readyState = e.readyState, 4 == e.readyState)) {
            t.status = e.status, t.resSize = fe(e);
            var n = zt.get("event");
            p(function () {
                var r = !1;
                if (i(_n, function (e) {
                        if (e.id === t.id) return r = !0, !1
                    }), !r) {
                    var o = le(t, e);
                    n && n.key == t.key && (n.xhrs.push(o), 0 == --n.remain && n._end()), Nt.xhrs && (En(t), Nt.xhrs[t.url] = o), _n.push(o)
                }
            })
        }
    }

    function fe(e) {
        var t = 0;
        if ("" == e.responseType || "text" == e.responseType) t = S(e.responseText);
        else if (e.response) t = S(e.response);
        else try {
            t = S(e.responseText)
        } catch (n) {}
        return t
    }

    function le(e, t) {
        if (e) {
            var n = e.status,
                r = {
                    id: e.id,
                    req: e.method + " " + e.url,
                    start: e.start,
                    du: n > 0 ? e.end - e.start : 0,
                    cb: e.cbTime || 0,
                    status: n,
                    err: e.errorCode ? e.errorCode : 0,
                    rec: e.resSize,
                    send: e.reqSize
                };
            if (e.r) {
                var i = he(t, e);
                i && (r.s_id = i.id, r.s_name = i.action, i.time && (r.s_du = i.time.duration, r.s_qu = i.time.qu), r.t_id = i.trId)
            }
            return r
        }
    }

    function de(e, t) {
        if (e && e.getResponseHeader) return e.getResponseHeader(t)
    }

    function he(e, t) {
        var n = J(de(e, "X-Tingyun-Tx-Data"));
        return n && n.r && ve(n.r) === ve(t.r) ? n : null
    }

    function ve(e) {
        return e + ""
    }

    function pe() {
        return setInterval(function () {
            if (_n && _n.length) {
                var e = [];
                i(_n, function (t) {
                    e.push(t)
                });
                var n = null;
                _t.ulabel && (n = {
                    ulabel: _t.ulabel
                }), Nt.emit("send", "/xhr1", n, {
                    xhr: e
                }, function () {
                    _n = h(_n, function (t) {
                        return e.indexOf(t) < 0
                    })
                }), Fe() && !t.XDomainRequest && (_n = [])
            }
        }, bn)
    }

    function me() {
        var e = Je && Je.prototype;
        return e ? (q(e, "open", ae), q(e, "send", ue)) : Je && (t.XMLHttpRequest = function () {
            var e = new Je;
            return q(e, "open", ae), q(e, "send", ue), e
        }), pe()
    }

    function ge(e) {
        this.limit = e, this.reset()
    }

    function ye(e, t, n, r) {
        return String(e) + String(t) + String(n) + String(r)
    }

    function Se(e, t, n, r, i, o, a) {
        var u = this;
        u.id = e, u.time = g(), u.msg = t, u.lineno = r, u.colno = i, u.filename = n, u.count = 1, u.stack = o && o.stack || "", u.module = a, u.fix();
        var c = An[e];
        u.ep = c ? 0 : 1, An[e] = !0
    }

    function be(e) {
        var t = function (e) {
            var t = [];
            return i(e, function (e) {
                t.push(e.toObject())
            }), t
        }(Rn.c);
        if (!t || !t.length) return null;
        var r = {
            fu: Nn || Nn++,
            os: parseInt((g() - (xt.pfStart || n)) / 1e3)
        };
        _t.ulabel && (r.ulabel = _t.ulabel), Nt.emit("send", "/err1", r, {
            datas: t
        }, f(Rn.reset, Rn))
    }

    function we(e, t, n, r, o) {
        if (t || !We) {
            var a = !1;
            if (i($e.domains, function (e) {
                    if (a = e.test(t)) return !1
                }), !a) {
                var u = o && o.moduleId,
                    c = ye(e, n, r, u),
                    s = Rn.get(c);
                s ? s.increase() : (s = new Se(c, e, t, n, r, o, u), Rn.add(c, s), Nt.errs && Nt.errs.push(s))
            }
        }
    }

    function Ee() {
        var e = t.onerror;
        t.onerror = function (t, n, r, i, o) {
            if (we(t, n, r, i, o), Re(e)) return e.apply(this, arguments)
        }, t.onerror._ty = !0
    }

    function _e() {
        var e = t.onerror;
        e && e._ty || Ee()
    }

    function xe() {
        var e = Fe();
        return e ? Ee() : Be(t, it, function (e) {
            var n, r, i, o, a;
            (e instanceof t.Event || t.ErrorEvent && e instanceof t.ErrorEvent) && (n = e.message || e.error && (e.error.message || e.error.constructor.name) || "", r = e.lineno || 0, i = e.colno || 0, (o = e.filename || e.error && e.error.filename || e.target && e.target.baseURI || "") == Ge.URL && (o = "#"), a = e.error), we(n, o, r, i, a)
        }), Tt.on([ot, at, ut, ct], function (e) {
            be()
        }).on(ot, function () {
            e && p(_e)
        }), setInterval(be, qn)
    }

    function Te() {
        var e = Array.prototype;
        e.indexOf || (e.indexOf = function (e, t) {
            var n = this.length >>> 0;
            if ((t |= 0) < 0) t = Math.max(n - t, 0);
            else if (t >= n) return -1;
            if (e === undefined) {
                do {
                    if (t in this && this[t] === undefined) return t
                } while (++t !== n)
            } else
                do {
                    if (this[t] === e) return t
                } while (++t !== n);
            return -1
        })
    }
    var ke, Ie, qe = o("String"),
        Ne = o("Array"),
        Re = o("Function"),
        Ae = o("Object"),
        Ce = o("Undefined"),
        Oe = '"',
        Le = /([\"\\])/g,
        De = /\n/g,
        je = t.JSON;
    je && je.parse && je.stringify ? (ke = function (e) {
        return JSON.parse(e)
    }, Ie = function (e) {
        return JSON.stringify(e)
    }) : (ke = function (e) {
        return new Function("return " + e)()
    }, Ie = a);
    var Be, Me;
    t.addEventListener ? (Be = function (e, t, n, r) {
        return e.addEventListener(t, n, r)
    }, Me = function (e, t, n) {
        return e.removeEventListener(t, n)
    }) : (Be = function (e, t, n) {
        return e.attachEvent("on" + t, n)
    }, Me = function (e, t, n) {
        return e.detachEvent("on" + t, n)
    });
    var He = t.encodeURIComponent,
        Pe = [].slice,
        Fe = new Function("return!+[1,]"),
        Ue = t.location.protocol,
        ze = "http:",
        Ye = function () {
            function e(e) {
                return e < 0 ? NaN : e <= 30 ? 0 | Math.random() * (1 << e) : e <= 53 ? (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << e - 30)) * (1 << 30) : NaN
            }

            function t(e, t) {
                for (var n = e.toString(16), r = t - n.length, i = "0"; r > 0; r >>>= 1, i += i) 1 & r && (n = i + n);
                return n
            }
            return function () {
                return t(e(32), 8) + "-" + t(e(16), 4) + "-" + t(16384 | e(12), 4) + "-" + t(32768 | e(14), 4) + "-" + t(e(48), 12)
            }
        }();
    E.prototype = {
        on: function (e, t) {
            var n = this;
            return qe(e) ? (n.events[e] || (n.events[e] = [])).push(t) : Ne(e) && i(e, function (e) {
                n.on(e, t)
            }), n
        },
        off: function (e, t) {
            var n = arguments.length,
                r = this;
            if (0 === n) return r.events = {}, r;
            var i = r.events[e];
            if (!i) return r;
            if (1 === n) return r.events[e] = null, r;
            for (var o = i.length; o--;)
                if (i[o] === t) {
                    i.splice(o, 1);
                    break
                }
            return r
        },
        emit: function (e) {
            var t = [].slice.call(arguments, 1),
                n = this.events[e];
            return n && i(n, function (e) {
                return e.apply(this, t)
            }), this
        },
        unshift: function (e, t) {
            var n = this;
            return (n.events[e] || (n.events[e] = [])).unshift(t), n
        }
    };
    var Xe = t.Error,
        Ge = t.document,
        Je = t.XMLHttpRequest,
        $e = {};
    e($e);
    var Ke = $e.server || {};
    Ke = d({
        fp_threshold: 2e3,
        fs_threshold: 4e3,
        dr_threshold: 4e3
    }, Ke);
    var Ve, Qe, We = _("ignore_err"),
        Ze = _("debug"),
        et = t.location,
        tt = t.navigator,
        nt = t.HTMLElement;
    ({
        localStorage: function () {
            try {
                var e = Ye();
                return t.localStorage.setItem(e, e), t.localStorage.removeItem(e), !0
            } catch (n) {
                return !1
            }
        }()
    }).localStorage ? (Ve = function (e) {
        return t.localStorage.getItem(e)
    }, Qe = function (e, n) {
        return t.localStorage.setItem(e, n), n
    }) : (Ve = x, Qe = T);
    var rt, it = "error",
        ot = "load",
        at = "unload",
        ut = "beforeunload",
        ct = "pagehide",
        st = "readystatechange",
        ft = "complete",
        lt = "TY_DISTINCT_ID",
        dt = "TY_SESSION_ID",
        ht = 86400,
        vt = "_ty_rum",
        pt = "TINGYUN",
        mt = 2,
        gt = "__ign",
        yt = "display:none",
        St = "POST",
        bt = function (e, t) {
            t = t || m;
            var n = new Image;
            Be(n, st, function () {
                "loaded" != n.readyState && 4 != n.readyState || t(null)
            }, !1), Be(n, ot, function () {
                t(null)
            }, !1), Be(n, it, function () {
                t(it)
            }, !1), n.src = e
        };
    t.XDomainRequest ? rt = function (e, t, n, r) {
        Re(n) && (r = n);
        var i = new XDomainRequest;
        i.open(St, e), i.onload = function () {
            r(null, i.responseText)
        }, i.onerror = function (e) {
            r(e)
        }, i.send(Ie(t))
    } : Fe() ? rt = I : tt.sendBeacon ? bt = rt = function (e, t, n, r) {
        Re(n) && (r = n, n = null), tt.sendBeacon(e, Ie(t)) && r && r()
    } : rt = function (e, t, n, r) {
        Re(n) && (r = n, n = null);
        var i = y(r),
            o = new Je;
        o[gt] = !0, o.overrideMimeType && o.overrideMimeType("text/html"), o.onreadystatechange = function () {
            4 == o.readyState && 200 == o.status && i(null, o.responseText)
        }, o.onerror = i, t = Ie(t);
        try {
            o.open(St, e, !0)
        } catch (u) {
            return I(e, t, i)
        }
        for (var a in n) o.setRequestHeader(a, n[a]);
        o.send(t)
    };
    var wt = Ze,
        Et = {
            start: n,
            e: {},
            an: {
                count: 0
            },
            visible: []
        },
        _t = {},
        xt = {};
    ! function () {
        if (Ze) {
            var e, t, n = "visibilitychange";
            Ce(Ge.hidden) ? Ce(Ge.msHidden) ? Ce(Ge.webkitHidden) || (e = "webkitHidden", t = "webkit" + n) : (e = "msHidden", t = "ms" + n) : (e = "hidden", t = n), Ce(Ge.addEventListener) || Ce(Ge[e]) || Be(Ge, t, R(function () {
                Et.visible.push([Ge[e], g()])
            }))
        }
    }();
    var Tt = new E,
        kt = [],
        It = [],
        qt = j.prototype;
    qt.start = function () {
        if (!Ke.key) return O("missing config, agent disabled!"), !1;
        var e = t[vt] || t[pt];
        return e && e.server ? (O("already loaded!"), !1) : (C(), this)
    }, d(qt, E.prototype);
    var Nt = new j;
    Nt.on("send", function (e, t, n, r) {
        var i = w(Ke.beacon, e, d({}, Rt, t || {}));
        switch (r = r || m, e) {
            case "/pf":
                n ? rt(i, n, function () {
                    Nt.xhrs = Nt.errs = null, r()
                }) : bt(i, r);
                break;
            default:
                rt(i, n, r)
        }
    });
    var Rt = {
            pvid: Ye(),
            ref: Ge.URL,
            referrer: Ge.referrer,
            key: Ke.key,
            v: "1.7.4",
            av: "1.7.4",
            did: function () {
                var e = Ve(lt);
                return e || Qe(lt, Ye(), ht)
            }(),
            sid: function () {
                var e = x(dt);
                return e || (e = Ye(), T(dt, e)), e
            }()
        },
        At = nt ? function (e) {
            return e instanceof nt
        } : function (e) {
            e && "object" == typeof e && 1 === e.nodeType && qe(e.nodeName)
        },
        Ct = "{0} not support",
        Ot = "illegal argument",
        Lt = {},
        Dt = "undefined" != typeof t.console,
        jt = 1,
        Bt = 2,
        Mt = 4,
        Ht = 8,
        Pt = B.prototype;
    Pt.create = Pt.before = Pt.after = Pt.error = null;
    var Ft;
    U.prototype = {
        createContext: function () {
            return Object.create ? Object.create(this.active) : z(this.active)
        },
        get: function (e) {
            if (this.active) return this.active[e]
        },
        set: function (e, t) {
            if (this.active) return this.active[e] = t
        },
        enter: function (e) {
            if (!e) throw new Xe("context required!");
            this._set.push(this.active), this.active = e
        },
        exit: function (e) {
            if (!e) throw new Xe("context required!");
            if (e !== this.active) {
                var t = this._set.lastIndexOf(e);
                if (t < 0) throw new Xe("context not currently entered!");
                this._set.splice(t, 1)
            } else this.active = this._set.pop()
        },
        bind: function (e, t) {
            t || (t = this.active ? this.active : this.createContext());
            var n = this;
            return function () {
                n.enter(t);
                try {
                    return e.apply(this, arguments)
                } catch (r) {
                    try {
                        r.moduleId = t.moduleId
                    } catch (i) {}
                    throw r
                } finally {
                    n.exit(t)
                }
            }
        }
    };
    var Ut = !1,
        zt = (Ut || (zt = z(), Ut = !0), zt),
        Yt = Y.prototype;
    Yt.fail = Yt.end = m;
    var Xt = X.prototype;
    Xt.end = Xt.finish = Xt.fail = null, Xt.send = function (e) {
        var t = this;
        t.sent = !0;
        var n = e.event && e.event.xhrs || [];
        i(n, function (e) {
            e.start = e.start - t.s
        });
        var r = {
            key: t.key,
            duration: t.e - t.s,
            status: t.status,
            xhrs: n
        };
        Nt.emit("send", "/spe", null, r, m)
    };
    var Gt = {},
        Jt = {
            host: "cshst",
            url: "csurl"
        },
        $t = {
            version: "1.7.4",
            config: function (e, t) {
                var n;
                if (Ae(e)) n = e;
                else {
                    if (!qe(e) || t === undefined) throw new Xe(Ot);
                    (n = {})[e] = t
                }
                return i(n, function (e, t) {
                    t in Jt ? _t[Jt[t]] = e : _t[t] = e
                }), this
            },
            DIAGNOSE_HREF: mt,
            diagnose: function (e) {
                function t(e, t, r) {
                    var i = r || "log",
                        o = n[e] || (n[e] = {});
                    o[i] = o[i] || "", o[i] += t
                }
                var n = {},
                    r = O();
                if (t("Status", r, "ok" !== r), t("Debug", L()), i(Lt, function (e, n) {
                        t("Timeline", n + ": " + e.toString())
                    }), !e && Dt) console.log("[TingYun Agent Diagnosis]\n"), i(n, function (e, t) {
                    i(console[t], function (e, t) {
                        console[t](e)
                    })
                });
                else {
                    if (e !== mt) return Ie(n);
                    et.href = et.href + "#" + Ie(n)
                }
            },
            createEvent: function (e) {
                var t = (e = e || {}).key;
                if (!t) return new Y;
                if (Gt[t]) return new Y("event " + t + " is executing");
                Gt[t] = !0;
                var n = zt.createContext();
                zt.enter(n);
                var r = new X(e);
                return zt.set("event", r), r._end = function () {
                    var e = this;
                    !e.sent && 0 === e.remain && e.called && e.finish().send(n)
                }, r.end = function (e) {
                    var t = this;
                    t.called ? Dt && console.warn("Event " + this.key + "has ended or failed!") : (t.called = !0, zt.exit(n), t.status = arguments.length ? e : 1, t._end())
                }, r.finish = function (e) {
                    var t = this;
                    return t.e = g(), t.i && clearTimeout(t.i), delete Gt[t.key], t
                }, r.fail = function () {
                    this.end(0)
                }, r
            },
            logFirstScreen: function (e) {
                if (e) {
                    var t = _t.firstScreenResources = _t.firstScreenResources || [];
                    Ne(e) || (e = [e]), i(e, function (e) {
                        if (qe(e)) t.push(e);
                        else if (At(e)) {
                            var n = e.src || e.href;
                            n && t.push(n)
                        }
                    })
                }
            },
            addExcludedDomain: function (e) {
                Ne(e) || (e = [e]), i(e, function (e) {
                    if (e) {
                        if (!(e instanceof RegExp)) throw new Xe("parameter's type requires RegExp");
                        ($e.domains || ($e.domains = [])).push(e)
                    }
                })
            }
        };
    t[vt] = t[pt] = $t;
    var Kt = 0,
        Vt = {},
        Qt = t.screen;
    Qt && (Vt.sh = Qt.height, Vt.sw = Qt.width);
    var Wt = "fetchStart",
        Zt = "requestStart",
        en = "responseStart",
        tn = "responseEnd",
        nn = "domContentLoadedEventStart",
        rn = "domContentLoadedEventEnd",
        on = "domInteractive",
        an = "domComplete",
        un = "loadEventStart",
        cn = "loadEventEnd",
        sn = "unloadEventStart",
        fn = "unloadEventEnd",
        ln = "domainLookupStart",
        dn = "domainLookupEnd",
        hn = "redirectStart",
        vn = "redirectEnd",
        pn = "connectStart",
        mn = "connectEnd",
        gn = "secureConnectionStart",
        yn = function (e) {
            if (!e.agent) {
                var n = t._ty_rum;
                if (n && n.agent) e.agent = n.agent;
                else {
                    var r = x("TINGYUN_DATA");
                    if (r) {
                        try {
                            e.agent = J(decodeURIComponent(r))
                        } catch (i) {
                            O(i && i.message)
                        }
                        T("TINGYUN_DATA", "", -1e3)
                    }
                }
            }
            return e.agent
        }($e);
    yn && yn.ulabel && (_t.ulabel = yn.ulabel);
    var Sn = function () {
            var e = y(function () {
                function e(e) {
                    return e ? "1" : "0"
                }
                var r = t.performance,
                    o = !!r;
                o || L(v(Ct, ["pf"]));
                var a = Z(yn),
                    u = r && r.timing,
                    c = d(V(u), a, _t),
                    s = d({}, Vt);
                Nt.fp ? (s.fp = Nt.fp, o && Nt.fp > Nt._le && (L("fp>le"), s.fp = ee(r), s.__fp = 2)) : o ? (s.fp = ee(r), s.__fp = 1) : s.fp = s.__fp = 0, s.dr = ie(u), o ? s.fs = te(r, u, s.fp, s) : s.__fs = 0;
                var f, l = "";
                if (o) {
                    var h = Math.max(c.ls, 0);
                    h || (h = K() - u.navigationStart || n), s.trace = h;
                    var p = oe(u);
                    i(["fp", "fs", "dr", "trace"], function (t) {
                        l += e((p ? s[t] - p : s[t]) >= Ke[t + "_threshold"])
                    }), delete s.trace, l.indexOf("1") > -1 && (f = Q(r, u))
                }
                s.trflag = l || "0000", xt.pfStart = g(), delete c.firstScreenResources, delete c.resources, Nt.emit("send", "/pf", d(c, s), f, function () {
                    L("pf sent!"), Nt.xhrs = Nt.errs = null
                })
            });
            return Tt.on(ot, function () {
                p(e)
            }).on([at, ut, ct], e)
        },
        bn = 2e3,
        wn = function (e) {
            var t = [];
            return i(Ke.custom_urls, function (e) {
                try {
                    t.push(new RegExp(e))
                } catch (n) {
                    O(n && n.message)
                }
            }), t
        }(),
        En = wn.length ? function (e) {
            var t = e.url;
            !Nt.ct && t && i(wn, function (n) {
                if (t.match(n)) return Nt.ct = e.end + e.cbTime, !1
            })
        } : m,
        _n = [],
        xn = 0,
        Tn = {
            error: 990,
            abort: 905,
            timeout: 903
        },
        kn = "on" + st,
        In = function () {
            function e(e) {
                var r = e;
                return t && (n.setAttribute("href", r), r = n.href), n.setAttribute("href", r), {
                    href: n.href,
                    protocol: n.protocol ? n.protocol.replace(/:$/, "") : "",
                    host: n.host,
                    search: n.search ? n.search.replace(/^\?/, "") : "",
                    hash: n.hash ? n.hash.replace(/^#/, "") : "",
                    hostname: n.hostname,
                    port: n.port,
                    pathname: "/" === n.pathname.charAt(0) ? n.pathname : "/" + n.pathname
                }
            }
            var t = /(msie|trident)/i.test(tt.userAgent),
                n = Ge.createElement("a"),
                r = e(et.href);
            return function (t) {
                var n = e(t);
                return n.protocol === r.protocol && n.host === r.host
            }
        }(),
        qn = 1e4,
        Nn = 0;
    ge.prototype = {
        add: function (e, t) {
            this.len > this.limit || this.get(e) || (this.c[e] = t, this.len++)
        },
        get: function (e) {
            return this.c[e]
        },
        reset: function () {
            this.c = {}, this.len = 0
        }
    };
    var Rn = new ge(100),
        An = {},
        Cn = /([a-z]+:\/{2,3}.*):(\d+):(\d+)/;
    return Se.prototype = {
        increase: function () {
            this.count++
        },
        fix: function () {
            var e = this,
                t = e.stack;
            if (e.module && t && qe(t) && e.filename) {
                t = t.split(/\n/);
                var n = Cn.exec(t[0]) || Cn.exec(t[1]);
                n && n[1] != e.filename && (e.filename = n[1] || e.filename, e.lineno = n[2] || e.lineno, e.colno = n[3] || e.colno)
            }
        },
        toObject: function () {
            var e = this;
            return {
                o: e.time,
                e: e.msg,
                l: e.lineno,
                c: e.colno,
                r: e.filename,
                ec: e.count,
                s: e.stack,
                m: e.module,
                ep: e.ep
            }
        }
    }, Te(), Nt.start() && (Sn(), me(), xe()), Nt._end = g(), N(function () {
        Et._end = Nt._end
    }), G(), $t
}(function (ty_rum) {
    ty_rum.server = {
        id: 'v38kG-V5oYE',
        ignore_err: true,
        beacon: 'beacon.tingyun.com',
        beacon_err: 'beacon-err.tingyun.com',
        key: 'YkbmwJog6JU',
        trace_threshold: 7000,
        fp_threshold: 2000,
        fs_threshold: 4000,
        dr_threshold: 4000,
        custom_urls: [],
        sr: 1.0
    };
}, window, +new Date);