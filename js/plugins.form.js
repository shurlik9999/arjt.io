!function (e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof module && module.exports ? module.exports = e(require("jquery")) : e(jQuery)
}(function (c) {
    c.extend(c.fn, {
        validate: function (e) {
            var a;
            if (this.length) return (a = c.data(this[0], "validator")) || (this.attr("novalidate", "novalidate"), a = new c.validator(e, this[0]), c.data(this[0], "validator", a), a.settings.onsubmit && (this.on("click.validate", ":submit", function (e) {
                a.submitButton = e.currentTarget, c(this).hasClass("cancel") && (a.cancelSubmit = !0), void 0 !== c(this).attr("formnovalidate") && (a.cancelSubmit = !0)
            }), this.on("submit.validate", function (r) {
                function e() {
                    var e, t;
                    return a.submitButton && (a.settings.submitHandler || a.formSubmitted) && (e = c("<input type='hidden'/>").attr("name", a.submitButton.name).val(c(a.submitButton).val()).appendTo(a.currentForm)), !(a.settings.submitHandler && !a.settings.debug) || (t = a.settings.submitHandler.call(a, a.currentForm, r), e && e.remove(), void 0 !== t && t)
                }

                return a.settings.debug && r.preventDefault(), a.cancelSubmit ? (a.cancelSubmit = !1, e()) : a.form() ? a.pendingRequest ? !(a.formSubmitted = !0) : e() : (a.focusInvalid(), !1)
            })), a);
            e && e.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing.")
        }, valid: function () {
            var e, t, r;
            return c(this[0]).is("form") ? e = this.validate().form() : (r = [], e = !0, t = c(this[0].form).validate(), this.each(function () {
                (e = t.element(this) && e) || (r = r.concat(t.errorList))
            }), t.errorList = r), e
        }, rules: function (e, t) {
            var r, a, i, n, s, o = this[0],
                l = void 0 !== this.attr("contenteditable") && "false" !== this.attr("contenteditable");
            if (null != o && (!o.form && l && (o.form = this.closest("form")[0], o.name = this.attr("name")), null != o.form)) {
                if (e) switch (r = c.data(o.form, "validator").settings, a = r.rules, i = c.validator.staticRules(o), e) {
                    case"add":
                        c.extend(i, c.validator.normalizeRule(t)), delete i.messages, a[o.name] = i, t.messages && (r.messages[o.name] = c.extend(r.messages[o.name], t.messages));
                        break;
                    case"remove":
                        return t ? (s = {}, c.each(t.split(/\s/), function (e, t) {
                            s[t] = i[t], delete i[t]
                        }), s) : (delete a[o.name], i)
                }
                return (l = c.validator.normalizeRules(c.extend({}, c.validator.classRules(o), c.validator.attributeRules(o), c.validator.dataRules(o), c.validator.staticRules(o)), o)).required && (n = l.required, delete l.required, l = c.extend({required: n}, l)), l.remote && (n = l.remote, delete l.remote, l = c.extend(l, {remote: n})), l
            }
        }
    });

    function t(e) {
        return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
    }

    var r;
    c.extend(c.expr.pseudos || c.expr[":"], {
        blank: function (e) {
            return !t("" + c(e).val())
        }, filled: function (e) {
            e = c(e).val();
            return null !== e && !!t("" + e)
        }, unchecked: function (e) {
            return !c(e).prop("checked")
        }
    }), c.validator = function (e, t) {
        this.settings = c.extend(!0, {}, c.validator.defaults, e), this.currentForm = t, this.init()
    }, c.validator.format = function (r, e) {
        return 1 === arguments.length ? function () {
            var e = c.makeArray(arguments);
            return e.unshift(r), c.validator.format.apply(this, e)
        } : (void 0 === e || ((e = 2 < arguments.length && e.constructor !== Array ? c.makeArray(arguments).slice(1) : e).constructor !== Array && (e = [e]), c.each(e, function (e, t) {
            r = r.replace(new RegExp("\\{" + e + "\\}", "g"), function () {
                return t
            })
        })), r)
    }, c.extend(c.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            pendingClass: "pending",
            validClass: "valid",
            errorElement: "label",
            focusCleanup: !1,
            focusInvalid: !0,
            errorContainer: c([]),
            errorLabelContainer: c([]),
            onsubmit: !0,
            ignore: ":hidden",
            ignoreTitle: !1,
            onfocusin: function (e) {
                this.lastActive = e, this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, e, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(e)))
            },
            onfocusout: function (e) {
                this.checkable(e) || !(e.name in this.submitted) && this.optional(e) || this.element(e)
            },
            onkeyup: function (e, t) {
                9 === t.which && "" === this.elementValue(e) || -1 !== c.inArray(t.keyCode, [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225]) || (e.name in this.submitted || e.name in this.invalid) && this.element(e)
            },
            onclick: function (e) {
                e.name in this.submitted ? this.element(e) : e.parentNode.name in this.submitted && this.element(e.parentNode)
            },
            highlight: function (e, t, r) {
                ("radio" === e.type ? this.findByName(e.name) : c(e)).addClass(t).removeClass(r)
            },
            unhighlight: function (e, t, r) {
                ("radio" === e.type ? this.findByName(e.name) : c(e)).removeClass(t).addClass(r)
            }
        },
        setDefaults: function (e) {
            c.extend(c.validator.defaults, e)
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            equalTo: "Please enter the same value again.",
            maxlength: c.validator.format("Please enter no more than {0} characters."),
            minlength: c.validator.format("Please enter at least {0} characters."),
            rangelength: c.validator.format("Please enter a value between {0} and {1} characters long."),
            range: c.validator.format("Please enter a value between {0} and {1}."),
            max: c.validator.format("Please enter a value less than or equal to {0}."),
            min: c.validator.format("Please enter a value greater than or equal to {0}."),
            step: c.validator.format("Please enter a multiple of {0}.")
        },
        autoCreateRanges: !1,
        prototype: {
            init: function () {
                function e(e) {
                    var t, r,
                        a = void 0 !== c(this).attr("contenteditable") && "false" !== c(this).attr("contenteditable");
                    !this.form && a && (this.form = c(this).closest("form")[0], this.name = c(this).attr("name")), i === this.form && (a = c.data(this.form, "validator"), t = "on" + e.type.replace(/^validate/, ""), (r = a.settings)[t]) && !c(this).is(r.ignore) && r[t].call(a, this, e)
                }

                this.labelContainer = c(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || c(this.currentForm), this.containers = c(this.settings.errorContainer).add(this.settings.errorLabelContainer), this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, this.invalid = {}, this.reset();
                var r, i = this.currentForm, a = this.groups = {};
                c.each(this.settings.groups, function (r, e) {
                    "string" == typeof e && (e = e.split(/\s/)), c.each(e, function (e, t) {
                        a[t] = r
                    })
                }), r = this.settings.rules, c.each(r, function (e, t) {
                    r[e] = c.validator.normalizeRule(t)
                }), c(this.currentForm).on("focusin.validate focusout.validate keyup.validate", ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable], [type='button']", e).on("click.validate", "select, option, [type='radio'], [type='checkbox']", e), this.settings.invalidHandler && c(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler)
            }, form: function () {
                return this.checkForm(), c.extend(this.submitted, this.errorMap), this.invalid = c.extend({}, this.errorMap), this.valid() || c(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid()
            }, checkForm: function () {
                this.prepareForm();
                for (var e = 0, t = this.currentElements = this.elements(); t[e]; e++) this.check(t[e]);
                return this.valid()
            }, element: function (e) {
                var t, r, a = this.clean(e), i = this.validationTargetFor(a), n = this, s = !0;
                return void 0 === i ? delete this.invalid[a.name] : (this.prepareElement(i), this.currentElements = c(i), (r = this.groups[i.name]) && c.each(this.groups, function (e, t) {
                    t === r && e !== i.name && (a = n.validationTargetFor(n.clean(n.findByName(e)))) && a.name in n.invalid && (n.currentElements.push(a), s = n.check(a) && s)
                }), t = !1 !== this.check(i), s = s && t, this.invalid[i.name] = !t, this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), c(e).attr("aria-invalid", !t)), s
            }, showErrors: function (t) {
                var r;
                t && (c.extend((r = this).errorMap, t), this.errorList = c.map(this.errorMap, function (e, t) {
                    return {message: e, element: r.findByName(t)[0]}
                }), this.successList = c.grep(this.successList, function (e) {
                    return !(e.name in t)
                })), this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
            }, resetForm: function () {
                c.fn.resetForm && c(this.currentForm).resetForm(), this.invalid = {}, this.submitted = {}, this.prepareForm(), this.hideErrors();
                var e = this.elements().removeData("previousValue").removeAttr("aria-invalid");
                this.resetElements(e)
            }, resetElements: function (e) {
                var t;
                if (this.settings.unhighlight) for (t = 0; e[t]; t++) this.settings.unhighlight.call(this, e[t], this.settings.errorClass, ""), this.findByName(e[t].name).removeClass(this.settings.validClass); else e.removeClass(this.settings.errorClass).removeClass(this.settings.validClass)
            }, numberOfInvalids: function () {
                return this.objectLength(this.invalid)
            }, objectLength: function (e) {
                var t, r = 0;
                for (t in e) void 0 !== e[t] && null !== e[t] && !1 !== e[t] && r++;
                return r
            }, hideErrors: function () {
                this.hideThese(this.toHide)
            }, hideThese: function (e) {
                e.not(this.containers).text(""), this.addWrapper(e).hide()
            }, valid: function () {
                return 0 === this.size()
            }, size: function () {
                return this.errorList.length
            }, focusInvalid: function () {
                if (this.settings.focusInvalid) try {
                    c(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").trigger("focus").trigger("focusin")
                } catch (e) {
                }
            }, findLastActive: function () {
                var t = this.lastActive;
                return t && 1 === c.grep(this.errorList, function (e) {
                    return e.element.name === t.name
                }).length && t
            }, elements: function () {
                var r = this, a = {};
                return c(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function () {
                    var e = this.name || c(this).attr("name"),
                        t = void 0 !== c(this).attr("contenteditable") && "false" !== c(this).attr("contenteditable");
                    return !e && r.settings.debug && window.console && console.error("%o has no name assigned", this), t && (this.form = c(this).closest("form")[0], this.name = e), !(this.form !== r.currentForm || e in a || !r.objectLength(c(this).rules()) || (a[e] = !0, 0))
                })
            }, clean: function (e) {
                return c(e)[0]
            }, errors: function () {
                var e = this.settings.errorClass.split(" ").join(".");
                return c(this.settings.errorElement + "." + e, this.errorContext)
            }, resetInternals: function () {
                this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = c([]), this.toHide = c([])
            }, reset: function () {
                this.resetInternals(), this.currentElements = c([])
            }, prepareForm: function () {
                this.reset(), this.toHide = this.errors().add(this.containers)
            }, prepareElement: function (e) {
                this.reset(), this.toHide = this.errorsFor(e)
            }, elementValue: function (e) {
                var t = c(e), r = e.type,
                    a = void 0 !== t.attr("contenteditable") && "false" !== t.attr("contenteditable");
                return "radio" === r || "checkbox" === r ? this.findByName(e.name).filter(":checked").val() : "number" === r && void 0 !== e.validity ? e.validity.badInput ? "NaN" : t.val() : (e = a ? t.text() : t.val(), "file" === r ? "C:\\fakepath\\" === e.substr(0, 12) ? e.substr(12) : 0 <= (a = e.lastIndexOf("/")) || 0 <= (a = e.lastIndexOf("\\")) ? e.substr(a + 1) : e : "string" == typeof e ? e.replace(/\r/g, "") : e)
            }, check: function (t) {
                t = this.validationTargetFor(this.clean(t));
                var e, r, a, i, n = c(t).rules(), s = c.map(n, function (e, t) {
                    return t
                }).length, o = !1, l = this.elementValue(t);
                for (r in "function" == typeof n.normalizer ? i = n.normalizer : "function" == typeof this.settings.normalizer && (i = this.settings.normalizer), i && (l = i.call(t, l), delete n.normalizer), n) {
                    a = {method: r, parameters: n[r]};
                    try {
                        if ("dependency-mismatch" === (e = c.validator.methods[r].call(this, l, t, a.parameters)) && 1 === s) o = !0; else {
                            if (o = !1, "pending" === e) return void (this.toHide = this.toHide.not(this.errorsFor(t)));
                            if (!e) return this.formatAndAdd(t, a), !1
                        }
                    } catch (e) {
                        throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + t.id + ", check the '" + a.method + "' method.", e), e instanceof TypeError && (e.message += ".  Exception occurred when checking element " + t.id + ", check the '" + a.method + "' method."), e
                    }
                }
                if (!o) return this.objectLength(n) && this.successList.push(t), !0
            }, customDataMessage: function (e, t) {
                return c(e).data("msg" + t.charAt(0).toUpperCase() + t.substring(1).toLowerCase()) || c(e).data("msg")
            }, customMessage: function (e, t) {
                e = this.settings.messages[e];
                return e && (e.constructor === String ? e : e[t])
            }, findDefined: function () {
                for (var e = 0; e < arguments.length; e++) if (void 0 !== arguments[e]) return arguments[e]
            }, defaultMessage: function (e, t) {
                var r = this.findDefined(this.customMessage(e.name, (t = "string" == typeof t ? {method: t} : t).method), this.customDataMessage(e, t.method), !this.settings.ignoreTitle && e.title || void 0, c.validator.messages[t.method], "<strong>Warning: No message defined for " + e.name + "</strong>"),
                    a = /\$?\{(\d+)\}/g;
                return "function" == typeof r ? r = r.call(this, t.parameters, e) : a.test(r) && (r = c.validator.format(r.replace(a, "{$1}"), t.parameters)), r
            }, formatAndAdd: function (e, t) {
                var r = this.defaultMessage(e, t);
                this.errorList.push({
                    message: r,
                    element: e,
                    method: t.method
                }), this.errorMap[e.name] = r, this.submitted[e.name] = r
            }, addWrapper: function (e) {
                return e = this.settings.wrapper ? e.add(e.parent(this.settings.wrapper)) : e
            }, defaultShowErrors: function () {
                for (var e, t, r = 0; this.errorList[r]; r++) t = this.errorList[r], this.settings.highlight && this.settings.highlight.call(this, t.element, this.settings.errorClass, this.settings.validClass), this.showLabel(t.element, t.message);
                if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success) for (r = 0; this.successList[r]; r++) this.showLabel(this.successList[r]);
                if (this.settings.unhighlight) for (r = 0, e = this.validElements(); e[r]; r++) this.settings.unhighlight.call(this, e[r], this.settings.errorClass, this.settings.validClass);
                this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show()
            }, validElements: function () {
                return this.currentElements.not(this.invalidElements())
            }, invalidElements: function () {
                return c(this.errorList).map(function () {
                    return this.element
                })
            }, showLabel: function (e, t) {
                var r, a, i, n = this.errorsFor(e), s = this.idOrName(e), o = c(e).attr("aria-describedby");
                n.length ? (n.removeClass(this.settings.validClass).addClass(this.settings.errorClass), n.html(t)) : (a = n = c("<" + this.settings.errorElement + ">").attr("id", s + "-error").addClass(this.settings.errorClass).html(t || ""), this.settings.wrapper && (a = n.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.length ? this.labelContainer.append(a) : this.settings.errorPlacement ? this.settings.errorPlacement.call(this, a, c(e)) : a.insertAfter(e), n.is("label") ? n.attr("for", s) : 0 === n.parents("label[for='" + this.escapeCssMeta(s) + "']").length && (a = n.attr("id"), o ? o.match(new RegExp("\\b" + this.escapeCssMeta(a) + "\\b")) || (o += " " + a) : o = a, c(e).attr("aria-describedby", o), r = this.groups[e.name]) && c.each((i = this).groups, function (e, t) {
                    t === r && c("[name='" + i.escapeCssMeta(e) + "']", i.currentForm).attr("aria-describedby", n.attr("id"))
                })), !t && this.settings.success && (n.text(""), "string" == typeof this.settings.success ? n.addClass(this.settings.success) : this.settings.success(n, e)), this.toShow = this.toShow.add(n)
            }, errorsFor: function (e) {
                var t = this.escapeCssMeta(this.idOrName(e)), e = c(e).attr("aria-describedby"),
                    t = "label[for='" + t + "'], label[for='" + t + "'] *";
                return e && (t = t + ", #" + this.escapeCssMeta(e).replace(/\s+/g, ", #")), this.errors().filter(t)
            }, escapeCssMeta: function (e) {
                return void 0 === e ? "" : e.replace(/([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1")
            }, idOrName: function (e) {
                return this.groups[e.name] || !this.checkable(e) && e.id || e.name
            }, validationTargetFor: function (e) {
                return this.checkable(e) && (e = this.findByName(e.name)), c(e).not(this.settings.ignore)[0]
            }, checkable: function (e) {
                return /radio|checkbox/i.test(e.type)
            }, findByName: function (e) {
                return c(this.currentForm).find("[name='" + this.escapeCssMeta(e) + "']")
            }, getLength: function (e, t) {
                switch (t.nodeName.toLowerCase()) {
                    case"select":
                        return c("option:selected", t).length;
                    case"input":
                        if (this.checkable(t)) return this.findByName(t.name).filter(":checked").length
                }
                return e.length
            }, depend: function (e, t) {
                return !this.dependTypes[typeof e] || this.dependTypes[typeof e](e, t)
            }, dependTypes: {
                boolean: function (e) {
                    return e
                }, string: function (e, t) {
                    return !!c(e, t.form).length
                }, function: function (e, t) {
                    return e(t)
                }
            }, optional: function (e) {
                var t = this.elementValue(e);
                return !c.validator.methods.required.call(this, t, e) && "dependency-mismatch"
            }, startRequest: function (e) {
                this.pending[e.name] || (this.pendingRequest++, c(e).addClass(this.settings.pendingClass), this.pending[e.name] = !0)
            }, stopRequest: function (e, t) {
                this.pendingRequest--, this.pendingRequest < 0 && (this.pendingRequest = 0), delete this.pending[e.name], c(e).removeClass(this.settings.pendingClass), t && 0 === this.pendingRequest && this.formSubmitted && this.form() && 0 === this.pendingRequest ? (c(this.currentForm).trigger("submit"), this.submitButton && c("input:hidden[name='" + this.submitButton.name + "']", this.currentForm).remove(), this.formSubmitted = !1) : !t && 0 === this.pendingRequest && this.formSubmitted && (c(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
            }, previousValue: function (e, t) {
                return t = "string" == typeof t && t || "remote", c.data(e, "previousValue") || c.data(e, "previousValue", {
                    old: null,
                    valid: !0,
                    message: this.defaultMessage(e, {method: t})
                })
            }, destroy: function () {
                this.resetForm(), c(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur").find(".validate-lessThan-blur").off(".validate-lessThan").removeClass("validate-lessThan-blur").find(".validate-lessThanEqual-blur").off(".validate-lessThanEqual").removeClass("validate-lessThanEqual-blur").find(".validate-greaterThanEqual-blur").off(".validate-greaterThanEqual").removeClass("validate-greaterThanEqual-blur").find(".validate-greaterThan-blur").off(".validate-greaterThan").removeClass("validate-greaterThan-blur")
            }
        },
        classRuleSettings: {
            required: {required: !0},
            email: {email: !0},
            url: {url: !0},
            date: {date: !0},
            dateISO: {dateISO: !0},
            number: {number: !0},
            digits: {digits: !0},
            creditcard: {creditcard: !0}
        },
        addClassRules: function (e, t) {
            e.constructor === String ? this.classRuleSettings[e] = t : c.extend(this.classRuleSettings, e)
        },
        classRules: function (e) {
            var t = {}, e = c(e).attr("class");
            return e && c.each(e.split(" "), function () {
                this in c.validator.classRuleSettings && c.extend(t, c.validator.classRuleSettings[this])
            }), t
        },
        normalizeAttributeRule: function (e, t, r, a) {
            (a = /min|max|step/.test(r) && (null === t || /number|range|text/.test(t)) && (a = Number(a), isNaN(a)) ? void 0 : a) || 0 === a ? e[r] = a : t === r && "range" !== t && (e["date" === t ? "dateISO" : r] = !0)
        },
        attributeRules: function (e) {
            var t, r, a = {}, i = c(e), n = e.getAttribute("type");
            for (t in c.validator.methods) r = "required" === t ? (r = e.getAttribute(t), "" === r && (r = !0), !!r) : i.attr(t), this.normalizeAttributeRule(a, n, t, r);
            return a.maxlength && /-1|2147483647|524288/.test(a.maxlength) && delete a.maxlength, a
        },
        dataRules: function (e) {
            var t, r, a = {}, i = c(e), n = e.getAttribute("type");
            for (t in c.validator.methods) r = i.data("rule" + t.charAt(0).toUpperCase() + t.substring(1).toLowerCase()), "" === r && (r = !0), this.normalizeAttributeRule(a, n, t, r);
            return a
        },
        staticRules: function (e) {
            var t = {}, r = c.data(e.form, "validator");
            return t = r.settings.rules ? c.validator.normalizeRule(r.settings.rules[e.name]) || {} : t
        },
        normalizeRules: function (a, i) {
            return c.each(a, function (e, t) {
                if (!1 === t) delete a[e]; else if (t.param || t.depends) {
                    var r = !0;
                    switch (typeof t.depends) {
                        case"string":
                            r = !!c(t.depends, i.form).length;
                            break;
                        case"function":
                            r = t.depends.call(i, i)
                    }
                    r ? a[e] = void 0 === t.param || t.param : (c.data(i.form, "validator").resetElements(c(i)), delete a[e])
                }
            }), c.each(a, function (e, t) {
                a[e] = "function" == typeof t && "normalizer" !== e ? t(i) : t
            }), c.each(["minlength", "maxlength"], function () {
                a[this] && (a[this] = Number(a[this]))
            }), c.each(["rangelength", "range"], function () {
                var e;
                a[this] && (Array.isArray(a[this]) ? a[this] = [Number(a[this][0]), Number(a[this][1])] : "string" == typeof a[this] && (e = a[this].replace(/[\[\]]/g, "").split(/[\s,]+/), a[this] = [Number(e[0]), Number(e[1])]))
            }), c.validator.autoCreateRanges && (null != a.min && null != a.max && (a.range = [a.min, a.max], delete a.min, delete a.max), null != a.minlength) && null != a.maxlength && (a.rangelength = [a.minlength, a.maxlength], delete a.minlength, delete a.maxlength), a
        },
        normalizeRule: function (e) {
            var t;
            return "string" == typeof e && (t = {}, c.each(e.split(/\s/), function () {
                t[this] = !0
            }), e = t), e
        },
        addMethod: function (e, t, r) {
            c.validator.methods[e] = t, c.validator.messages[e] = void 0 !== r ? r : c.validator.messages[e], t.length < 3 && c.validator.addClassRules(e, c.validator.normalizeRule(e))
        },
        methods: {
            required: function (e, t, r) {
                return this.depend(r, t) ? "select" === t.nodeName.toLowerCase() ? (r = c(t).val()) && 0 < r.length : this.checkable(t) ? 0 < this.getLength(e, t) : null != e && 0 < e.length : "dependency-mismatch"
            }, email: function (e, t) {
                return this.optional(t) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(e)
            }, url: function (e, t) {
                return this.optional(t) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:(?:[^\]\[?\/<~#`!@$^&*()+=}|:";',>{ ]|%[0-9A-Fa-f]{2})+(?::(?:[^\]\[?\/<~#`!@$^&*()+=}|:";',>{ ]|%[0-9A-Fa-f]{2})*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(e)
            }, date: (r = !1, function (e, t) {
                return r || (r = !0, this.settings.debug && window.console && console.warn("The `date` method is deprecated and will be removed in version '2.0.0'.\nPlease don't use it, since it relies on the Date constructor, which\nbehaves very differently across browsers and locales. Use `dateISO`\ninstead or one of the locale specific methods in `localizations/`\nand `additional-methods.js`.")), this.optional(t) || !/Invalid|NaN/.test(new Date(e).toString())
            }), dateISO: function (e, t) {
                return this.optional(t) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(e)
            }, number: function (e, t) {
                return this.optional(t) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(e)
            }, digits: function (e, t) {
                return this.optional(t) || /^\d+$/.test(e)
            }, minlength: function (e, t, r) {
                e = Array.isArray(e) ? e.length : this.getLength(e, t);
                return this.optional(t) || r <= e
            }, maxlength: function (e, t, r) {
                e = Array.isArray(e) ? e.length : this.getLength(e, t);
                return this.optional(t) || e <= r
            }, rangelength: function (e, t, r) {
                e = Array.isArray(e) ? e.length : this.getLength(e, t);
                return this.optional(t) || e >= r[0] && e <= r[1]
            }, min: function (e, t, r) {
                return this.optional(t) || r <= e
            }, max: function (e, t, r) {
                return this.optional(t) || e <= r
            }, range: function (e, t, r) {
                return this.optional(t) || e >= r[0] && e <= r[1]
            }, step: function (e, t, r) {
                function a(e) {
                    return (e = ("" + e).match(/(?:\.(\d+))?$/)) && e[1] ? e[1].length : 0
                }

                function i(e) {
                    return Math.round(e * Math.pow(10, n))
                }

                var n, s = c(t).attr("type"), o = "Step attribute on input type " + s + " is not supported.",
                    l = new RegExp("\\b" + s + "\\b"), u = !0;
                if (s && !l.test(["text", "number", "range"].join())) throw new Error(o);
                return n = a(r), (a(e) > n || i(e) % i(r) != 0) && (u = !1), this.optional(t) || u
            }, equalTo: function (e, t, r) {
                r = c(r);
                return this.settings.onfocusout && r.not(".validate-equalTo-blur").length && r.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
                    c(t).valid()
                }), e === r.val()
            }, remote: function (a, i, e, n) {
                if (this.optional(i)) return "dependency-mismatch";
                n = "string" == typeof n && n || "remote";
                var s, t, o = this.previousValue(i, n);
                return this.settings.messages[i.name] || (this.settings.messages[i.name] = {}), o.originalMessage = o.originalMessage || this.settings.messages[i.name][n], this.settings.messages[i.name][n] = o.message, t = c.param(c.extend({data: a}, (e = "string" == typeof e ? {url: e} : e).data)), o.old === t ? o.valid : (o.old = t, (s = this).startRequest(i), (t = {})[i.name] = a, c.ajax(c.extend(!0, {
                    mode: "abort",
                    port: "validate" + i.name,
                    dataType: "json",
                    data: t,
                    context: s.currentForm,
                    success: function (e) {
                        var t, r = !0 === e || "true" === e;
                        s.settings.messages[i.name][n] = o.originalMessage, r ? (t = s.formSubmitted, s.resetInternals(), s.toHide = s.errorsFor(i), s.formSubmitted = t, s.successList.push(i), s.invalid[i.name] = !1, s.showErrors()) : (t = {}, e = e || s.defaultMessage(i, {
                            method: n,
                            parameters: a
                        }), t[i.name] = o.message = e, s.invalid[i.name] = !0, s.showErrors(t)), o.valid = r, s.stopRequest(i, r)
                    }
                }, e)), "pending")
            }
        }
    });
    var a, i = {};
    return c.ajaxPrefilter ? c.ajaxPrefilter(function (e, t, r) {
        var a = e.port;
        "abort" === e.mode && (i[a] && i[a].abort(), i[a] = r)
    }) : (a = c.ajax, c.ajax = function (e) {
        var t = ("mode" in e ? e : c.ajaxSettings).mode, r = ("port" in e ? e : c.ajaxSettings).port;
        return "abort" === t ? (i[r] && i[r].abort(), i[r] = a.apply(this, arguments), i[r]) : a.apply(this, arguments)
    }), c
}), function (r) {
    "function" == typeof define && define.amd ? define(["jquery"], r) : "object" == typeof module && module.exports ? module.exports = function (e, t) {
        return void 0 === t && (t = "undefined" != typeof window ? require("jquery") : require("jquery")(e)), r(t), t
    } : r(jQuery)
}(function (R) {
    "use strict";
    var d = /\r?\n/g, p = {},
        D = (p.fileapi = void 0 !== R('<input type="file">').get(0).files, p.formdata = void 0 !== window.FormData, !!R.fn.prop);

    function n(e) {
        var t = e.data;
        e.isDefaultPrevented() || (e.preventDefault(), R(e.target).closest("form").ajaxSubmit(t))
    }

    function s(e) {
        var t = e.target, r = R(t);
        if (!r.is("[type=submit],[type=image]")) {
            var a = r.closest("[type=submit]");
            if (0 === a.length) return;
            t = a[0]
        }
        var i = t.form;
        "image" === (i.clk = t).type && (void 0 !== e.offsetX ? (i.clk_x = e.offsetX, i.clk_y = e.offsetY) : "function" == typeof R.fn.offset ? (a = r.offset(), i.clk_x = e.pageX - a.left, i.clk_y = e.pageY - a.top) : (i.clk_x = e.pageX - t.offsetLeft, i.clk_y = e.pageY - t.offsetTop)), setTimeout(function () {
            i.clk = i.clk_x = i.clk_y = null
        }, 100)
    }

    function M() {
        var e;
        R.fn.ajaxSubmit.debug && (e = "[jquery.form] " + Array.prototype.join.call(arguments, ""), window.console && window.console.log ? window.console.log(e) : window.opera && window.opera.postError && window.opera.postError(e))
    }

    R.fn.attr2 = function () {
        var e;
        return D && ((e = this.prop.apply(this, arguments)) && e.jquery || "string" == typeof e) ? e : this.attr.apply(this, arguments)
    }, R.fn.ajaxSubmit = function (F, e, t, r) {
        if (this.length) {
            var E, L = this,
                e = ("function" == typeof F ? F = {success: F} : "string" == typeof F || !1 === F && 0 < arguments.length ? (F = {
                    url: F,
                    data: e,
                    dataType: t
                }, "function" == typeof r && (F.success = r)) : void 0 === F && (F = {}), E = F.method || F.type || this.attr2("method"), t = (t = (t = "string" == typeof (e = F.url || this.attr2("action")) ? R.trim(e) : "") || window.location.href || "") && (t.match(/^([^#]+)/) || [])[1], r = /(MSIE|Trident)/.test(navigator.userAgent || "") && /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank", F = R.extend(!0, {
                    url: t,
                    success: R.ajaxSettings.success,
                    type: E || R.ajaxSettings.type,
                    iframeSrc: r
                }, F), {});
            if (this.trigger("form-pre-serialize", [this, F, e]), e.veto) M("ajaxSubmit: submit vetoed via form-pre-serialize trigger"); else if (F.beforeSerialize && !1 === F.beforeSerialize(this, F)) M("ajaxSubmit: submit aborted via beforeSerialize callback"); else {
                t = F.traditional;
                void 0 === t && (t = R.ajaxSettings.traditional);
                var q = [], a = this.formToArray(F.semantic, q, F.filtering);
                if (F.data && (r = R.isFunction(F.data) ? F.data(a) : F.data, F.extraData = r, u = R.param(r, t)), F.beforeSubmit && !1 === F.beforeSubmit(a, this, F)) M("ajaxSubmit: submit aborted via beforeSubmit callback"); else if (this.trigger("form-submit-validate", [a, this, F, e]), e.veto) M("ajaxSubmit: submit vetoed via form-submit-validate trigger"); else {
                    r = R.param(a, t);
                    u && (r = r ? r + "&" + u : u), "GET" === F.type.toUpperCase() ? (F.url += (0 <= F.url.indexOf("?") ? "&" : "?") + r, F.data = null) : F.data = r;
                    var n, i, s, o, l = [], e = (F.resetForm && l.push(function () {
                            L.resetForm()
                        }), F.clearForm && l.push(function () {
                            L.clearForm(F.includeHidden)
                        }), !F.dataType && F.target ? (n = F.success || function () {
                        }, l.push(function (e, t, r) {
                            var a = arguments, i = F.replaceTarget ? "replaceWith" : "html";
                            R(F.target)[i](e).each(function () {
                                n.apply(this, a)
                            })
                        })) : F.success && (R.isArray(F.success) ? R.merge(l, F.success) : l.push(F.success)), F.success = function (e, t, r) {
                            for (var a = F.context || this, i = 0, n = l.length; i < n; i++) l[i].apply(a, [e, t, r || L, L])
                        }, F.error && (i = F.error, F.error = function (e, t, r) {
                            var a = F.context || this;
                            i.apply(a, [e, t, r, L])
                        }), F.complete && (s = F.complete, F.complete = function (e, t) {
                            var r = F.context || this;
                            s.apply(r, [e, t, L])
                        }), 0 < R("input[type=file]:enabled", this).filter(function () {
                            return "" !== R(this).val()
                        }).length), t = "multipart/form-data", u = L.attr("enctype") === t || L.attr("encoding") === t,
                        r = p.fileapi && p.formdata;
                    M("fileAPI :" + r), !1 !== F.iframe && (F.iframe || (e || u) && !r) ? F.closeKeepAlive ? R.get(F.closeKeepAlive, function () {
                        o = d(a)
                    }) : o = d(a) : o = (e || u) && r ? function (e) {
                        for (var r = new FormData, t = 0; t < e.length; t++) r.append(e[t].name, e[t].value);
                        if (F.extraData) for (var a = function (e) {
                            for (var t, r = R.param(e, F.traditional).split("&"), a = r.length, i = [], n = 0; n < a; n++) r[n] = r[n].replace(/\+/g, " "), t = r[n].split("="), i.push([decodeURIComponent(t[0]), decodeURIComponent(t[1])]);
                            return i
                        }(F.extraData), t = 0; t < a.length; t++) a[t] && r.append(a[t][0], a[t][1]);
                        F.data = null;
                        var i = R.extend(!0, {}, R.ajaxSettings, F, {
                            contentType: !1,
                            processData: !1,
                            cache: !1,
                            type: E || "POST"
                        }), n = (F.uploadProgress && (i.xhr = function () {
                            var e = R.ajaxSettings.xhr();
                            return e.upload && e.upload.addEventListener("progress", function (e) {
                                var t = 0, r = e.loaded || e.position, a = e.total;
                                e.lengthComputable && (t = Math.ceil(r / a * 100)), F.uploadProgress(e, r, a, t)
                            }, !1), e
                        }), i.data = null, i.beforeSend);
                        return i.beforeSend = function (e, t) {
                            F.formData ? t.data = F.formData : t.data = r, n && n.call(this, e, t)
                        }, R.ajax(i)
                    }(a) : R.ajax(F), L.removeData("jqxhr").data("jqxhr", o);
                    for (var c = 0; c < q.length; c++) q[c] = null;
                    this.trigger("form-submit-notify", [this, F])
                }
            }
        } else M("ajaxSubmit: skipping submit process - no element selected");
        return this;

        function d(e) {
            var t, r, c, d, h, m, f, p, g, n = L[0], v = R.Deferred();
            if (v.abort = function (e) {
                f.abort(e)
            }, e) for (r = 0; r < q.length; r++) t = R(q[r]), D ? t.prop("disabled", !1) : t.removeAttr("disabled");
            (c = R.extend(!0, {}, R.ajaxSettings, F)).context = c.context || c;
            var b, y, a, x, w, T, C, S, s, k, o = "jqFormIO" + (new Date).getTime(), l = n.ownerDocument,
                u = L.closest("body");
            return (c.iframeTarget ? (a = (h = R(c.iframeTarget, l)).attr2("name")) ? o = a : h.attr2("name", o) : (h = R('<iframe name="' + o + '" src="' + c.iframeSrc + '" />', l)).css({
                position: "absolute",
                top: "-1000px",
                left: "-1000px"
            }), m = h[0], f = {
                aborted: 0,
                responseText: null,
                responseXML: null,
                status: 0,
                statusText: "n/a",
                getAllResponseHeaders: function () {
                },
                getResponseHeader: function () {
                },
                setRequestHeader: function () {
                },
                abort: function (e) {
                    var t = "timeout" === e ? "timeout" : "aborted";
                    M("aborting upload... " + t), this.aborted = 1;
                    try {
                        m.contentWindow.document.execCommand && m.contentWindow.document.execCommand("Stop")
                    } catch (e) {
                    }
                    h.attr("src", c.iframeSrc), f.error = t, c.error && c.error.call(c.context, f, t, e), d && R.event.trigger("ajaxError", [f, c, t]), c.complete && c.complete.call(c.context, f, t)
                }
            }, (d = c.global) && 0 == R.active++ && R.event.trigger("ajaxStart"), d && R.event.trigger("ajaxSend", [f, c]), c.beforeSend && !1 === c.beforeSend.call(c.context, f, c)) ? (c.global && R.active--, v.reject()) : f.aborted ? v.reject() : ((e = n.clk) && (a = e.name) && !e.disabled && (c.extraData = c.extraData || {}, c.extraData[a] = e.value, "image" === e.type) && (c.extraData[a + ".x"] = n.clk_x, c.extraData[a + ".y"] = n.clk_y), b = 1, y = 2, e = R("meta[name=csrf-token]").attr("content"), (a = R("meta[name=csrf-param]").attr("content")) && e && (c.extraData = c.extraData || {}, c.extraData[a] = e), c.forceSync ? i() : setTimeout(i, 10), C = 50, S = R.parseXML || function (e, t) {
                return window.ActiveXObject ? ((t = new ActiveXObject("Microsoft.XMLDOM")).async = "false", t.loadXML(e)) : t = (new DOMParser).parseFromString(e, "text/xml"), t && t.documentElement && "parsererror" !== t.documentElement.nodeName ? t : null
            }, s = R.parseJSON || function (e) {
                return window.eval("(" + e + ")")
            }, k = function (e, t, r) {
                var a = e.getResponseHeader("content-type") || "", i = ("xml" === t || !t) && 0 <= a.indexOf("xml"),
                    e = i ? e.responseXML : e.responseText;
                return i && "parsererror" === e.documentElement.nodeName && R.error && R.error("parsererror"), "string" == typeof (e = r && r.dataFilter ? r.dataFilter(e, t) : e) && (("json" === t || !t) && 0 <= a.indexOf("json") ? e = s(e) : ("script" === t || !t) && 0 <= a.indexOf("javascript") && R.globalEval(e)), e
            }), v;

            function j(t) {
                var r = null;
                try {
                    t.contentWindow && (r = t.contentWindow.document)
                } catch (e) {
                    M("cannot get iframe.contentWindow document: " + e)
                }
                if (!r) try {
                    r = t.contentDocument || t.document
                } catch (e) {
                    M("cannot get iframe.contentDocument: " + e), r = t.document
                }
                return r
            }

            function i() {
                var e = L.attr2("target"), t = L.attr2("action"),
                    r = L.attr("enctype") || L.attr("encoding") || "multipart/form-data",
                    a = (n.setAttribute("target", o), E && !/post/i.test(E) || n.setAttribute("method", "POST"), t !== c.url && n.setAttribute("action", c.url), c.skipEncodingOverride || E && !/post/i.test(E) || L.attr({
                        encoding: "multipart/form-data",
                        enctype: "multipart/form-data"
                    }), c.timeout && (g = setTimeout(function () {
                        p = !0, A(b)
                    }, c.timeout)), []);
                try {
                    if (c.extraData) for (var i in c.extraData) c.extraData.hasOwnProperty(i) && (R.isPlainObject(c.extraData[i]) && c.extraData[i].hasOwnProperty("name") && c.extraData[i].hasOwnProperty("value") ? a.push(R('<input type="hidden" name="' + c.extraData[i].name + '">', l).val(c.extraData[i].value).appendTo(n)[0]) : a.push(R('<input type="hidden" name="' + i + '">', l).val(c.extraData[i]).appendTo(n)[0]));
                    c.iframeTarget || h.appendTo(u), m.attachEvent ? m.attachEvent("onload", A) : m.addEventListener("load", A, !1), setTimeout(function e() {
                        try {
                            var t = j(m).readyState;
                            M("state = " + t), t && "uninitialized" === t.toLowerCase() && setTimeout(e, 50)
                        } catch (e) {
                            M("Server abort: ", e, " (", e.name, ")"), A(y), g && clearTimeout(g), g = void 0
                        }
                    }, 15);
                    try {
                        n.submit()
                    } catch (e) {
                        document.createElement("form").submit.apply(n)
                    }
                } finally {
                    n.setAttribute("action", t), n.setAttribute("enctype", r), e ? n.setAttribute("target", e) : L.removeAttr("target"), R(a).remove()
                }
            }

            function A(e) {
                if (!f.aborted && !T) if ((w = j(m)) || (M("cannot access response document"), e = y), e === b && f) f.abort("timeout"), v.reject(f, "timeout"); else if (e === y && f) f.abort("server abort"), v.reject(f, "error", "server abort"); else if (w && w.location.href !== c.iframeSrc || p) {
                    m.detachEvent ? m.detachEvent("onload", A) : m.removeEventListener("load", A, !1);
                    var t, r = "success";
                    try {
                        if (p) throw"timeout";
                        var a = "xml" === c.dataType || w.XMLDocument || R.isXMLDoc(w);
                        if (M("isXml=" + a), !a && window.opera && (null === w.body || !w.body.innerHTML) && --C) return M("requeing onLoad callback, DOM not available"), void setTimeout(A, 250);
                        var i = w.body || w.documentElement;
                        f.responseText = i ? i.innerHTML : null, f.responseXML = w.XMLDocument || w, a && (c.dataType = "xml"), f.getResponseHeader = function (e) {
                            return {"content-type": c.dataType}[e.toLowerCase()]
                        }, i && (f.status = Number(i.getAttribute("status")) || f.status, f.statusText = i.getAttribute("statusText") || f.statusText);
                        var n, s, o, l = (c.dataType || "").toLowerCase(), u = /(json|script|text)/.test(l);
                        u || c.textarea ? (n = w.getElementsByTagName("textarea")[0]) ? (f.responseText = n.value, f.status = Number(n.getAttribute("status")) || f.status, f.statusText = n.getAttribute("statusText") || f.statusText) : u && (s = w.getElementsByTagName("pre")[0], o = w.getElementsByTagName("body")[0], s ? f.responseText = s.textContent || s.innerText : o && (f.responseText = o.textContent || o.innerText)) : "xml" === l && !f.responseXML && f.responseText && (f.responseXML = S(f.responseText));
                        try {
                            x = k(f, l, c)
                        } catch (e) {
                            r = "parsererror", f.error = t = e || r
                        }
                    } catch (e) {
                        M("error caught: ", e), r = "error", f.error = t = e || r
                    }
                    f.aborted && (M("upload aborted"), r = null), "success" === (r = f.status ? 200 <= f.status && f.status < 300 || 304 === f.status ? "success" : "error" : r) ? (c.success && c.success.call(c.context, x, "success", f), v.resolve(f.responseText, "success", f), d && R.event.trigger("ajaxSuccess", [f, c])) : r && (void 0 === t && (t = f.statusText), c.error && c.error.call(c.context, f, r, t), v.reject(f, "error", t), d) && R.event.trigger("ajaxError", [f, c, t]), d && R.event.trigger("ajaxComplete", [f, c]), d && !--R.active && R.event.trigger("ajaxStop"), c.complete && c.complete.call(c.context, f, r), T = !0, c.timeout && clearTimeout(g), setTimeout(function () {
                        c.iframeTarget ? h.attr("src", c.iframeSrc) : h.remove(), f.responseXML = null
                    }, 100)
                }
            }
        }
    }, R.fn.ajaxForm = function (e, t, r, a) {
        var i;
        return ("string" == typeof e || !1 === e && 0 < arguments.length) && (e = {
            url: e,
            data: t,
            dataType: r
        }, "function" == typeof a) && (e.success = a), (e = e || {}).delegation = e.delegation && R.isFunction(R.fn.on), e.delegation || 0 !== this.length ? e.delegation ? (R(document).off("submit.form-plugin", this.selector, n).off("click.form-plugin", this.selector, s).on("submit.form-plugin", this.selector, e, n).on("click.form-plugin", this.selector, e, s), this) : (e.beforeFormUnbind && e.beforeFormUnbind(this, e), this.ajaxFormUnbind().on("submit.form-plugin", e, n).on("click.form-plugin", e, s)) : (i = {
            s: this.selector,
            c: this.context
        }, !R.isReady && i.s ? (M("DOM not ready, queuing ajaxForm"), R(function () {
            R(i.s, i.c).ajaxForm(e)
        })) : M("terminating; zero elements found by selector" + (R.isReady ? "" : " (DOM not ready)")), this)
    }, R.fn.ajaxFormUnbind = function () {
        return this.off("submit.form-plugin click.form-plugin")
    }, R.fn.formToArray = function (e, t, r) {
        var a = [];
        if (0 !== this.length) {
            var i, n, s, o, l, u, c, d = this[0], h = this.attr("id"),
                m = (m = e || void 0 === d.elements ? d.getElementsByTagName("*") : d.elements) && R.makeArray(m);
            if ((m = h && (e || /(Edge|Trident)\//.test(navigator.userAgent)) && (h = R(':input[form="' + h + '"]').get()).length ? (m || []).concat(h) : m) && m.length) {
                for (i = 0, l = (m = R.isFunction(r) ? R.map(m, r) : m).length; i < l; i++) if ((c = (o = m[i]).name) && !o.disabled) if (e && d.clk && "image" === o.type) d.clk === o && (a.push({
                    name: c,
                    value: R(o).val(),
                    type: o.type
                }), a.push({name: c + ".x", value: d.clk_x}, {
                    name: c + ".y",
                    value: d.clk_y
                })); else if ((s = R.fieldValue(o, !0)) && s.constructor === Array) for (t && t.push(o), n = 0, u = s.length; n < u; n++) a.push({
                    name: c,
                    value: s[n]
                }); else if (p.fileapi && "file" === o.type) {
                    t && t.push(o);
                    var f = o.files;
                    if (f.length) for (n = 0; n < f.length; n++) a.push({
                        name: c,
                        value: f[n],
                        type: o.type
                    }); else a.push({name: c, value: "", type: o.type})
                } else null != s && (t && t.push(o), a.push({name: c, value: s, type: o.type, required: o.required}));
                !e && d.clk && (c = (r = (h = R(d.clk))[0]).name) && !r.disabled && "image" === r.type && (a.push({
                    name: c,
                    value: h.val()
                }), a.push({name: c + ".x", value: d.clk_x}, {name: c + ".y", value: d.clk_y}))
            }
        }
        return a
    }, R.fn.formSerialize = function (e) {
        return R.param(this.formToArray(e))
    }, R.fn.fieldSerialize = function (i) {
        var n = [];
        return this.each(function () {
            var e = this.name;
            if (e) {
                var t = R.fieldValue(this, i);
                if (t && t.constructor === Array) for (var r = 0, a = t.length; r < a; r++) n.push({
                    name: e,
                    value: t[r]
                }); else null != t && n.push({name: this.name, value: t})
            }
        }), R.param(n)
    }, R.fn.fieldValue = function (e) {
        for (var t = [], r = 0, a = this.length; r < a; r++) {
            var i = this[r], i = R.fieldValue(i, e);
            null == i || i.constructor === Array && !i.length || (i.constructor === Array ? R.merge(t, i) : t.push(i))
        }
        return t
    }, R.fieldValue = function (e, t) {
        var r = e.name, a = e.type, i = e.tagName.toLowerCase();
        if ((t = void 0 === t ? !0 : t) && (!r || e.disabled || "reset" === a || "button" === a || ("checkbox" === a || "radio" === a) && !e.checked || ("submit" === a || "image" === a) && e.form && e.form.clk !== e || "select" === i && -1 === e.selectedIndex)) return null;
        if ("select" !== i) return R(e).val().replace(d, "\r\n");
        t = e.selectedIndex;
        if (t < 0) return null;
        for (var n = [], s = e.options, o = "select-one" === a, l = o ? t + 1 : s.length, u = o ? t : 0; u < l; u++) {
            var c = s[u];
            if (c.selected && !c.disabled) {
                c = c.value || (c.attributes && c.attributes.value && !c.attributes.value.specified ? c.text : c.value);
                if (o) return c;
                n.push(c)
            }
        }
        return n
    }, R.fn.clearForm = function (e) {
        return this.each(function () {
            R("input,select,textarea", this).clearFields(e)
        })
    }, R.fn.clearFields = R.fn.clearInputs = function (r) {
        var a = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
        return this.each(function () {
            var e = this.type, t = this.tagName.toLowerCase();
            a.test(e) || "textarea" === t ? this.value = "" : "checkbox" === e || "radio" === e ? this.checked = !1 : "select" === t ? this.selectedIndex = -1 : "file" === e ? /MSIE/.test(navigator.userAgent) ? R(this).replaceWith(R(this).clone(!0)) : R(this).val("") : r && (!0 === r && /hidden/.test(e) || "string" == typeof r && R(this).is(r)) && (this.value = "")
        })
    }, R.fn.resetForm = function () {
        return this.each(function () {
            var t = R(this), e = this.tagName.toLowerCase();
            switch (e) {
                case"input":
                    this.checked = this.defaultChecked;
                case"textarea":
                    return this.value = this.defaultValue, !0;
                case"option":
                case"optgroup":
                    var r = t.parents("select");
                    return r.length && r[0].multiple ? "option" === e ? this.selected = this.defaultSelected : t.find("option").resetForm() : r.resetForm(), !0;
                case"select":
                    return t.find("option").each(function (e) {
                        if (this.selected = this.defaultSelected, this.defaultSelected && !t[0].multiple) return t[0].selectedIndex = e, !1
                    }), !0;
                case"label":
                    var r = R(t.attr("for")), a = t.find("input,select,textarea");
                    return r[0] && a.unshift(r[0]), a.resetForm(), !0;
                case"form":
                    return "function" != typeof this.reset && ("object" != typeof this.reset || this.reset.nodeType) || this.reset(), !0;
                default:
                    return t.find("form,input,label,select,textarea").resetForm(), !0
            }
        })
    }, R.fn.enable = function (e) {
        return void 0 === e && (e = !0), this.each(function () {
            this.disabled = !e
        })
    }, R.fn.selected = function (t) {
        return void 0 === t && (t = !0), this.each(function () {
            var e = this.type;
            "checkbox" === e || "radio" === e ? this.checked = t : "option" === this.tagName.toLowerCase() && (e = R(this).parent("select"), t && e[0] && "select-one" === e[0].type && e.find("option").selected(!1), this.selected = t)
        })
    }, R.fn.ajaxSubmit.debug = !1
});