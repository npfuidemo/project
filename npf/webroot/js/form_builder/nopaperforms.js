var $ = jQuery.noConflict();
var file_upload_total = 0;
//var page_section_count = 1;
(function(G) {
    var A = G.fn.height,
        E = G.fn.width;
    G.fn.extend({
        height: function() {
            if (!this[0]) {
                D()
            }
            if (this[0] == window) {
                if (navigator.userAgent.toUpperCase().indexOf('OPERA') || (navigator.userAgent.toUpperCase().indexOf('SAFARI') && parseInt(navigator.userAgent.toUpperCase().indexOf('VERSION')) > 520)) {
                    return self.innerHeight - ((G(document).height() > self.innerHeight) ? B() : 0)
                } else {
                    if (navigator.userAgent.toUpperCase().indexOf('SAFARI')) {
                        return self.innerHeight
                    } else {
                        return G.boxModel && document.documentElement.clientHeight || document.body.clientHeight
                    }
                }
            }
            if (this[0] == document) {
                return Math.max((G.boxModel && document.documentElement.scrollHeight || document.body.scrollHeight), document.body.offsetHeight)
            }
            return A.apply(this, arguments)
        },
        width: function() {
            if (!this[0]) {
                D()
            }
            if (this[0] == window) {
                if (navigator.userAgent.toUpperCase().indexOf('OPERA') || (navigator.userAgent.toUpperCase().indexOf('SAFARI') && parseInt(navigator.userAgent.toUpperCase().indexOf('VERSION')) > 520)) {
                    return self.innerWidth - ((G(document).width() > self.innerWidth) ? B() : 0)
                } else {
                    if (navigator.userAgent.toUpperCase().indexOf('SAFARI')) {
                        return self.innerWidth
                    } else {
                        return G.boxModel && document.documentElement.clientWidth || document.body.clientWidth
                    }
                }
            }
            if (this[0] == document) {
                if (navigator.userAgent.toUpperCase().indexOf('MOZILLA')) {
                    var J = self.pageXOffset;
                    self.scrollTo(99999999, self.pageYOffset);
                    var I = self.pageXOffset;
                    self.scrollTo(J, self.pageYOffset);
                    return document.body.offsetWidth + I
                } else {
                    return Math.max(((G.boxModel && !navigator.userAgent.toUpperCase().indexOf('SAFARI')) && document.documentElement.scrollWidth || document.body.scrollWidth), document.body.offsetWidth)
                }
            }
            return E.apply(this, arguments)
        },
        innerHeight: function() {
            if (!this[0]) {
                D()
            }
            return this[0] == window || this[0] == document ? this.height() : this.is(":visible") ? this[0].offsetHeight - C(this, "borderTopWidth") - C(this, "borderBottomWidth") : this.height() + C(this, "paddingTop") + C(this, "paddingBottom")
        },
        innerWidth: function() {
            if (!this[0]) {
                D()
            }
            return this[0] == window || this[0] == document ? this.width() : this.is(":visible") ? this[0].offsetWidth - C(this, "borderLeftWidth") - C(this, "borderRightWidth") : this.width() + C(this, "paddingLeft") + C(this, "paddingRight")
        },
        outerHeight: function(I) {
            if (!this[0]) {
                D()
            }
            I = G.extend({
                margin: false
            }, I || {});
            return this[0] == window || this[0] == document ? this.height() : this.is(":visible") ? this[0].offsetHeight + (I.margin ? (C(this, "marginTop") + C(this, "marginBottom")) : 0) : this.height() + C(this, "borderTopWidth") + C(this, "borderBottomWidth") + C(this, "paddingTop") + C(this, "paddingBottom") + (I.margin ? (C(this, "marginTop") + C(this, "marginBottom")) : 0)
        },
        outerWidth: function(I) {
            if (!this[0]) {
                D()
            }
            I = G.extend({
                margin: false
            }, I || {});
            return this[0] == window || this[0] == document ? this.width() : this.is(":visible") ? this[0].offsetWidth + (I.margin ? (C(this, "marginLeft") + C(this, "marginRight")) : 0) : this.width() + C(this, "borderLeftWidth") + C(this, "borderRightWidth") + C(this, "paddingLeft") + C(this, "paddingRight") + (I.margin ? (C(this, "marginLeft") + C(this, "marginRight")) : 0)
        },
        scrollLeft: function(I) {
            if (!this[0]) {
                D()
            }
            if (I != undefined) {
                return this.each(function() {
                    if (this == window || this == document) {
                        window.scrollTo(I, G(window).scrollTop())
                    } else {
                        this.scrollLeft = I
                    }
                })
            }
            if (this[0] == window || this[0] == document) {
                return self.pageXOffset || G.boxModel && document.documentElement.scrollLeft || document.body.scrollLeft
            }
            return this[0].scrollLeft
        },
        scrollTop: function(I) {
            if (!this[0]) {
                D()
            }
            if (I != undefined) {
                return this.each(function() {
                    if (this == window || this == document) {
                        window.scrollTo(G(window).scrollLeft(), I)
                    } else {
                        this.scrollTop = I
                    }
                })
            }
            if (this[0] == window || this[0] == document) {
                return self.pageYOffset || G.boxModel && document.documentElement.scrollTop || document.body.scrollTop
            }
            return this[0].scrollTop
        },
        position: function(I) {
            return this.offset({
                margin: false,
                scroll: false,
                relativeTo: this.offsetParent()
            }, I)
        },
        offset: function(J, P) {
            if (!this[0]) {
                D()
            }
            var O = 0,
                N = 0,
                X = 0,
                S = 0,
                Y = this[0],
                M = this[0],
                L, I, W = G.css(Y, "position"),
                V = navigator.userAgent.toUpperCase().indexOf('MOZILLA'),
                Q = navigator.userAgent.toUpperCase().indexOf('MSIE'),
                U = navigator.userAgent.toUpperCase().indexOf('OPERA'),
                a = navigator.userAgent.toUpperCase().indexOf('SAFARI'),
                K = navigator.userAgent.toUpperCase().indexOf('SAFARI') && parseInt(navigator.userAgent.toUpperCase().indexOf('VERSION')) > 520,
                R = false,
                T = false,
                J = G.extend({
                    margin: true,
                    border: false,
                    padding: false,
                    scroll: true,
                    lite: false,
                    relativeTo: document.body
                }, J || {});
            if (J.lite) {
                return this.offsetLite(J, P)
            }
            if (J.relativeTo.jquery) {
                J.relativeTo = J.relativeTo[0]
            }
            if (Y.tagName == "BODY") {
                O = Y.offsetLeft;
                N = Y.offsetTop;
                if (V) {
                    O += C(Y, "marginLeft") + (C(Y, "borderLeftWidth") * 2);
                    N += C(Y, "marginTop") + (C(Y, "borderTopWidth") * 2)
                } else {
                    if (U) {
                        O += C(Y, "marginLeft");
                        N += C(Y, "marginTop")
                    } else {
                        if ((Q && jQuery.boxModel)) {
                            O += C(Y, "borderLeftWidth");
                            N += C(Y, "borderTopWidth")
                        } else {
                            if (K) {
                                O += C(Y, "marginLeft") + C(Y, "borderLeftWidth");
                                N += C(Y, "marginTop") + C(Y, "borderTopWidth")
                            }
                        }
                    }
                }
            } else {
                do {
                    I = G.css(M, "position");
                    O += M.offsetLeft;
                    N += M.offsetTop;
                    if ((V && !M.tagName.match(/^t[d|h]$/i)) || Q || K) {
                        O += C(M, "borderLeftWidth");
                        N += C(M, "borderTopWidth");
                        if (V && I == "absolute") {
                            R = true
                        }
                        if (Q && I == "relative") {
                            T = true
                        }
                    }
                    L = M.offsetParent || document.body;
                    if (J.scroll || V) {
                        do {
                            if (J.scroll) {
                                X += M.scrollLeft;
                                S += M.scrollTop
                            }
                            if (U && (G.css(M, "display") || "").match(/table-row|inline/)) {
                                X = X - ((M.scrollLeft == M.offsetLeft) ? M.scrollLeft : 0);
                                S = S - ((M.scrollTop == M.offsetTop) ? M.scrollTop : 0)
                            }
                            if (V && M != Y && G.css(M, "overflow") != "visible") {
                                O += C(M, "borderLeftWidth");
                                N += C(M, "borderTopWidth")
                            }
                            M = M.parentNode
                        } while (M != L)
                    }
                    M = L;
                    if (M == J.relativeTo && !(M.tagName == "BODY" || M.tagName == "HTML")) {
                        if (V && M != Y && G.css(M, "overflow") != "visible") {
                            O += C(M, "borderLeftWidth");
                            N += C(M, "borderTopWidth")
                        }
                        if (((a && !K) || U) && I != "static") {
                            O -= C(L, "borderLeftWidth");
                            N -= C(L, "borderTopWidth")
                        }
                        break
                    }
                    if (M.tagName == "BODY" || M.tagName == "HTML") {
                        if (((a && !K) || (Q && G.boxModel)) && W != "absolute" && W != "fixed") {
                            O += C(M, "marginLeft");
                            N += C(M, "marginTop")
                        }
                        if (K || (V && !R && W != "fixed") || (Q && W == "static" && !T)) {
                            O += C(M, "borderLeftWidth");
                            N += C(M, "borderTopWidth")
                        }
                        break
                    }
                } while (M)
            }
            var Z = H(Y, J, O, N, X, S);
            if (P) {
                G.extend(P, Z);
                return this
            } else {
                return Z
            }
        },
        offsetLite: function(Q, L) {
            if (!this[0]) {
                D()
            }
            var N = 0,
                M = 0,
                K = 0,
                P = 0,
                O = this[0],
                J, Q = G.extend({
                    margin: true,
                    border: false,
                    padding: false,
                    scroll: true,
                    relativeTo: document.body
                }, Q || {});
            if (Q.relativeTo.jquery) {
                Q.relativeTo = Q.relativeTo[0]
            }
            do {
                N += O.offsetLeft;
                M += O.offsetTop;
                J = O.offsetParent || document.body;
                if (Q.scroll) {
                    do {
                        K += O.scrollLeft;
                        P += O.scrollTop;
                        O = O.parentNode
                    } while (O != J)
                }
                O = J
            } while (O && O.tagName != "BODY" && O.tagName != "HTML" && O != Q.relativeTo);
            var I = H(this[0], Q, N, M, K, P);
            if (L) {
                G.extend(L, I);
                return this
            } else {
                return I
            }
        },
        offsetParent: function() {
            if (!this[0]) {
                D()
            }
            var I = this[0].offsetParent;
            while (I && (I.tagName != "BODY" && G.css(I, "position") == "static")) {
                I = I.offsetParent
            }
            return G(I)
        }
    });
    var D = function() {
        throw "Dimensions:jQuery collection is empty"
    };
    var C = function(I, J) {
        return parseInt(G.css(I.jquery ? I[0] : I, J)) || 0
    };
    var H = function(M, L, J, N, I, K) {
        if (!L.margin) {
            J -= C(M, "marginLeft");
            N -= C(M, "marginTop")
        }
        if (L.border && ((navigator.userAgent.toUpperCase().indexOf('SAFARI') && parseInt(navigator.userAgent.toUpperCase().indexOf('VERSION')) < 520) || navigator.userAgent.toUpperCase().indexOf('OPERA'))) {
            J += C(M, "borderLeftWidth");
            N += C(M, "borderTopWidth")
        } else {
            if (!L.border && !((navigator.userAgent.toUpperCase().indexOf('SAFARI') && parseInt(navigator.userAgent.toUpperCase().indexOf('VERSION')) < 520) || navigator.userAgent.toUpperCase().indexOf('OPERA'))) {
                J -= C(M, "borderLeftWidth");
                N -= C(M, "borderTopWidth")
            }
        }
        if (L.padding) {
            J += C(M, "paddingLeft");
            N += C(M, "paddingTop")
        }
        if (L.scroll && (!navigator.userAgent.toUpperCase().indexOf('OPERA') || M.offsetLeft != M.scrollLeft && M.offsetTop != M.scrollLeft)) {
            I -= M.scrollLeft;
            K -= M.scrollTop
        }
        return L.scroll ? {
            top: N - K,
            left: J - I,
            scrollTop: K,
            scrollLeft: I
        } : {
            top: N,
            left: J
        }
    };
    var F = 0;
    var B = function() {
        if (!F) {
            var I = G("<div>").css({
                width: 100,
                height: 100,
                overflow: "auto",
                position: "absolute",
                top: -1000,
                left: -1000
            }).appendTo("body");
            F = 100 - I.append("<div>").find("div").css({
                width: "100%",
                height: 200
            }).width();
            I.remove()
        }
        return F
    }
})(jQuery);
var JSON = function() {
    var m = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        s = {
            "boolean": function(x) {
                return String(x)
            },
            number: function(x) {
                return isFinite(x) ? String(x) : "null"
            },
            string: function(x) {
                if (/["\\\x00-\x1f]/.test(x)) {
                    x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                        var c = m[b];
                        if (c) {
                            return c
                        }
                        c = b.charCodeAt();
                        return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16)
                    })
                }
                return '"' + x + '"'
            },
            object: function(x) {
                if (x) {
                    var a = [],
                        b, f, i, l, v;
                    if (x instanceof Array) {
                        a[0] = "[";
                        l = x.length;
                        for (i = 0; i < l; i += 1) {
                            v = x[i];
                            f = s[typeof v];
                            if (f) {
                                v = f(v);
                                if (typeof v == "string") {
                                    if (b) {
                                        a[a.length] = ","
                                    }
                                    a[a.length] = v;
                                    b = true
                                }
                            }
                        }
                        a[a.length] = "]"
                    } else {
                        if (x instanceof Object) {
                            a[0] = "{";
                            for (i in x) {
                                v = x[i];
                                f = s[typeof v];
                                if (f) {
                                    v = f(v);
                                    if (typeof v == "string") {
                                        if (b) {
                                            a[a.length] = ","
                                        }
                                        a.push(s.string(i), ":", v);
                                        b = true
                                    }
                                }
                            }
                            a[a.length] = "}"
                        } else {
                            return
                        }
                    }
                    return a.join("")
                }
                return "null"
            }
        };
    return {
        copyright: "(c)2005 JSON.org",
        license: "http://www.crockford.com/JSON/license.html",
        stringify: function(v) {
            var f = s[typeof v];
            if (f) {
                v = f(v);
                if (typeof v == "string") {
                    return v
                }
            }
            return null
        },
        parse: function(a) {
            try {
                return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(a.replace(/"(\\.|[^"\\])*"/g, ""))) && eval("(" + a + ")")
            } catch (e) {
                return false
            }
        }
    }
}();
$(document).ready(function() {
    bind_event_to_tooltips();
    $("#statusPanel").ajaxStart(function() {
        $("#statusPanel").show("normal")
    });
    $("#statusPanel").ajaxStop(function() {
        $("#statusPanel").fadeOut("normal")
    });
    load_all();
});

function bind_event_to_tooltips() {
    jQuery(".tooltip").each(function(i) {
        jQuery(this).click(function() {
            if (jQuery(this).next().attr("id") == "tooltip") {
                hide_tooltip_messge(this.nextSibling);
            } else {
                show_tooltip_message(this);
            }
            return false;
        })
    })
}

function show_tooltip_message(elem) {
    if (jQuery("#tooltip").length) {
        hide_tooltip_messge("#tooltip");
    }
    if (elem.title == 'Field Size') {
        style = 'display:none;margin-left:-100px;';
    } else {
        style = 'display:none;';
    }
    var newElem = "<span onclick=\"hide_tooltip_messge(this)\" id=\"tooltip\" style=\"" + style + "\">" + "<b>" + elem.title + "</b>" + "<em>" + elem.rel + "</em>" + "</span>";
    jQuery(newElem).insertAfter(elem).show("normal");
}

function hide_tooltip_messge(elem) {
    jQuery(elem).fadeOut("normal", function() {
        jQuery(this).remove();
    });
}

function prepare_form_property_values() {
    $("#form_title").val(main_form.data.name);
    $("#form_instruction1").val(main_form.data.instruction1);
    $("#form_instruction2").val(main_form.data.instruction2);
    $("#form_instruction3").val(main_form.data.instruction3);
    $("#form_instruction4").val(main_form.data.instruction4);
    $("#form_review").val(main_form.data.review);
    $("#form_unique_ip").val(main_form.data.unique_ip);
    $("#form_captcha").val(main_form.data.captcha);
    $("#form_street_adr").val(main_form.data.street_adr);
    $("#form_city_adr").val(main_form.data.city_adr);
    $("#form_region_adr").val(main_form.data.region_adr);
    $("#form_postal_code_adr").val(main_form.data.postal_code_adr);
    $("#form_phone_adr").val(main_form.data.phone_adr);
    $("#form_email_adr").val(main_form.data.email_adr);
    $("#form_country_adr").val(main_form.data.country_adr);
    $("#form_website_adr").val(main_form.data.website_adr);
}
var element_properties = function() {};
element_properties.prototype = {
    initialize: function(A) {
        this.id = A
    },
    render: function() {
        $("#prop_phone_default").css("display", "none");
        $("#prop_time_noseconds").css("display", "none");
        $("#prop_default_country").css("display", "none");
        $("#prop_date_format").css("display", "none");
        $("#prop_access_control").css("display", "none");
        $("#prop_npf_attribute_type").css("display", "none");
        $("#prop_randomize").css("display", "none");
        $("#list_buttons").css("display", "none");
        $("#attribute_position").css("display", "none");
        $("#prop_default_value").css("display", "none");
        $("#prop_phone_format").css("display", "none");
        $("#prop_currency_format").css("display", "none");
        $("#prop_attribute_size").css("display", "none");
        $("#prop_name_format").css("display", "none");
        $("#prop_choices").css("display", "none");
        $("#prop_columns").css("display", "none");
        $("#prop_rows").css("display", "none");
        $("#prop_options").css("display", "none");
        $("#attribute_inactive").css("display", "none");
        $("#all_properties").css("display", "none");
        $("#prop_declaration").css("display", "none");
        $("#prop_documents").css("display", "none");
        $("#attrinute_label").val(ns.get(this.id, "title"));
        for (var A = 0; A < components[ns.get(this.id, "type")].length; A++) {
            this[components[ns.get(this.id, "type")][A]]()
        }
        $("#element_instructions").val(ns.get(this.id, "help"));
        $("#all_properties").css("display", "block");
        $("#attribute_position").css("display", "block");
        $("#list_buttons").css("display", "block");
        $("#attrinute_label").select().focus()
    },
    types: function() {
        $("#prop_npf_attribute_type").css("display", "block");
        if (ns.get(this.id, "is_db_live") == "1") {
            $("#attribute_type").attr("disabled", "disabled")
        } else {
            $("#attribute_type").attr("disabled", "")
        }
        var B = ns.get(this.id, "type");
        if (B == "name") {
            B = "simple_name"
        } else {
            if (B == "simple_phone") {
                B = "phone"
            } else {
                if (B == "europe_date") {
                    B = "date"
                }
            }
        }
        attribute_types = document.getElementById("attribute_type");
        for (var A = 0; A < attribute_types.options.length; A++) {
            if (attribute_types.options[A].value == B) {
                attribute_types.selectedIndex = A
            }
        }
    },
    required: function() {
        $("#prop_options").css("display", "block");
        if (ns.get(active_element, "is_required") == "1") {
            $("#attribute_required").attr("checked", "checked")
        } else {
            $("#attribute_required").attr("checked", "")
        }
    },
    only_numeric: function(A) {
        if (A == "hide") {
            $("#attribute_numeric").css("visibility", "hidden")
        } else {
            $("#attribute_numeric").css("visibility", "visible")
        }
        if (ns.get(active_element, "is_numeric") == "1") {
            $("#attribute_numeric").attr("checked", "checked")
        } else {
            $("#attribute_numeric").attr("checked", "")
        }
        var B = ns.get(active_element, "type");
        if (B == "radio" || B == "checkbox" || B == "select" || B == "multipleSelect" || B == "simple_name" || B == "name" || B == "address" || B == "textarea" || B == "email" || B == "money" || B == "percentage" || B == "url" || B == "europe_date" || B == "date" || B == "guardians_info" || B == "work_experience" || B == "edu_history" || B == "language_fluency" || B == "emergency_contact" || B == "parents_info" || B == "personalinfo" || B == "number" || B == "fileUpload" || B == "declaration" || B == "nationality" || B == "simple_phone") {
            $("#attribute_numeric_span").css("display", "none")
            $("#attribute_none_span").css("display", "none")
        } else {
            $("#attribute_numeric_span").css("display", "block")
            $("#attribute_none_span").css("display", "block")
        }
    },
    only_charecter: function(A) {
        if (A == "hide") {
            $("#attribute_charecter_span").css("visibility", "hidden")
        } else {
            $("#attribute_charecter_span").css("visibility", "visible")
        }
        if (ns.get(active_element, "is_charecter") == "1") {
            $("#attribute_charecter").attr("checked", "checked")
        } else {
            $("#attribute_charecter").attr("checked", "")
        }
        var C = ns.get(active_element, "type");
        if (C == "radio" || C == "checkbox" || C == "select" || C == "multipleSelect" || C == "address" || C == "textarea" || C == "email" || C == "money" || C == "number" || C == "percentage" || C == "url" || C == "europe_date" || C == "date" || C == "simple_phone" || C == "guardians_info" || C == "work_experience" || C == "edu_history" || C == "language_fluency" || C == "emergency_contact" || C == "parents_info" || C == "personalinfo" || C == "fileUpload" || C == "declaration" || C == "nationality") {
            $("#attribute_charecter_span").css("display", "none")
            $("#attribute_none_span").css("display", "none")
        } else {
            $("#attribute_charecter_span").css("display", "block")
            $("#attribute_none_span").css("display", "block")
        }
    },
    size: function() {
        $("#prop_attribute_size").css("display", "block");
        var B = ns.get(this.id, "size");
        field_sizes = document.getElementById("field_size");
        for (var A = 0; A < field_sizes.options.length; A++) {
            if (field_sizes.options[A].value == B) {
                field_sizes.selectedIndex = A
            }
        }
    },
    choices: function() {
        $("#prop_choices").css("display", "block");
        $("#attrinute_choices").html("");
        options = ns.get(this.id, "options");
        field_type = ns.get(this.id, "type");
        all_markup = new Array();
        for (var A = 0; A < options.length; A++) {
            el_val = options[A].option.replace(/\"/g, "&quot;");
            if (options[A].is_default == 1) {
                loc = "../../img/form_builder/star.gif";
                msg = "Default"
            } else {
                loc = "../../img/form_builder/stardim.gif";
                msg = "Make Default"
            }
            all_markup[A] = '<div class="choices_li"><input id="choice' + A + '" class="fb_r_textfield" style="width:160px;" type="text" autocomplete="off" value="' + el_val + "\" onkeyup=\"set_properties(this.value,'choices'," + A + ')" onkeypress="choices_event(event,' + A + ')"/><img class="button" src="../../img/form_builder/add.gif" alt="Add" title="Add" onclick="insert_choice(' + (A + 1) + ')"/><img class="button" src="../../img/form_builder/delete.gif" alt="Delete" title="Delete" onclick="delete_checkbox(' + options[A].id + "," + options[A].is_db_live + ",'" + field_type + "'," + A + ')"/><img class="button" src="' + loc + '" alt="' + msg + '" title="' + msg + '" onclick="set_choice_default(' + A + ')"/></div>'
        }
        $("#attrinute_choices").html(all_markup.join(""))
    },
    columns: function() {
        $("#prop_columns").css("display", "block");
        $("#attrinute_columns").html("");
        tab_columns = ns.get(this.id, "columns");
        field_type = ns.get(this.id, "type");
        all_markup_columns = new Array();
        for (var A = 0; A < tab_columns.length; A++) {
            el_val_column = tab_columns[A].option.replace(/\"/g, "&quot;");
            all_markup_columns[A] = '<div class="choices_li"><input id="column' + A + '" class="fb_r_textfield" style="width:160px;" type="text" autocomplete="off" value="' + el_val_column + "\" onkeyup=\"set_properties(this.value,'columns'," + A + ')" onkeypress="columns_event(event,' + A + ')"/><img class="button" src="../../img/form_builder/add.gif" alt="Add" title="Add" onclick="insert_column(' + (A + 1) + ')"/><img class="button" src="../../img/form_builder/delete.gif" alt="Delete" title="Delete" onclick="delete_column(' + tab_columns[A].id + "," + tab_columns[A].is_db_live + ",'" + field_type + "'," + A + ')"/></div>'
        }
        $("#attribute_columns").html(all_markup_columns.join(""))
    },
    rows: function() {
        $("#prop_rows").css("display", "block");
        $("#attrinute_rows").html("");
        tab_rows = ns.get(this.id, "rows");
        field_type = ns.get(this.id, "type");
        all_markup_rows = new Array();
        for (var A = 0; A < tab_rows.length; A++) {
            el_val_rows = tab_rows[A].option.replace(/\"/g, "&quot;");
            all_markup_rows[A] = '<div class="choices_li"><input id="row' + A + '" class="fb_r_textfield" style="width:160px;" type="text" autocomplete="off" value="' + el_val_rows + "\" onkeyup=\"set_properties(this.value,'rows'," + A + ')" onkeypress="rows_event(event,' + A + ')"/><img class="button" src="../../img/form_builder/add.gif" alt="Add" title="Add" onclick="insert_row(' + (A + 1) + ')"/><img class="button" src="../../img/form_builder/delete.gif" alt="Delete" title="Delete" onclick="delete_row(' + tab_rows[A].id + "," + tab_rows[A].is_db_live + ",'" + field_type + "'," + A + ')"/></div>'
        }
        $("#attribute_rows").html(all_markup_rows.join(""))
    },
    declaration_prop: function() {
        $("#prop_declaration").css("display", "block");
        el_val = ns.get(this.id, "declaration_prop");
        document.getElementById('element_declarations').value = el_val;
    },
    documents_prop: function() {
        $("#prop_documents").css("display", "block");
        el_val = ns.get(this.id, "documents_prop");
        document.getElementById('element_documents').value = el_val;
    },
    address_default: function() {
        $("#prop_default_country").css("display", "block");
        el_val = ns.get(this.id, "default_value");
        countries = document.getElementById("attrinute_countries");
        for (var A = 0; A < countries.options.length; A++) {
            if (countries.options[A].value == el_val) {
                countries.selectedIndex = A
            }
        }
    },
    nationality_default: function() {
        $("#prop_default_country").css("display", "block");
        el_val = ns.get(this.id, "default_value");
        countries = document.getElementById("attrinute_countries");
        for (var A = 0; A < countries.options.length; A++) {
            if (countries.options[A].value == el_val) {
                countries.selectedIndex = A
            }
        }
    },
    randomize: function() {
        $("#prop_randomize").css("display", "block");
        if (ns.get(active_element, "constraints") == "random") {
            $("#attribute_random").attr("checked", "checked")
        } else {
            $("#attribute_not_random").attr("checked", "checked")
        }
    },
    noseconds: function() {
        $("#prop_time_noseconds").css("display", "block");
        if (ns.get(active_element, "constraints") == "show_seconds") {
            $("#time_noseconds").attr("checked", "checked")
        } else {
            $("#time_noseconds").attr("checked", "")
        }
    },
    text_default: function() {
        $("#prop_default_value").css("display", "block");
        $("#attribute_default").val(ns.get(this.id, "default_value"))
    },
    date: function() {
        $("#prop_date_format").css("display", "block");
        date_type = ns.get(active_element, "type");
        dates = document.getElementById("date_type");
        for (var A = 0; A < dates.options.length; A++) {
            if (dates.options[A].value == date_type) {
                dates.selectedIndex = A
            }
        }
    },
    name: function() {
        $("#prop_name_format").css("display", "block");
        if (ns.get(this.id, "is_db_live") == "1") {
            $("#name_format").attr("disabled", "disabled")
        } else {
            $("#name_format").attr("disabled", "")
        }
        name_type = ns.get(active_element, "type");
        name_format = document.getElementById("name_format");
        for (var A = 0; A < name_format.options.length; A++) {
            if (name_format.options[A].value == name_type) {
                name_format.selectedIndex = A
            }
        }
    },
    phone: function() {
        $("#prop_phone_format").css("display", "block");
        phone_type = ns.get(active_element, "type");
        phone_format = document.getElementById("phone_format");
        for (var A = 0; A < phone_format.options.length; A++) {
            if (phone_format.options[A].value == phone_type) {
                phone_format.selectedIndex = A
            }
        }
    },
    currency: function() {
        $("#prop_currency_format").css("display", "block");
        money_format = document.getElementById("money_format");
        for (var A = 0; A < money_format.options.length; A++) {
            if (money_format.options[A].value == constraints) {
                money_format.selectedIndex = A
            }
        }
    }
};
var field = function() {};
field.prototype = {
    initialize: function(A) {
        this.id = A
    },
    display: function() {
        if (ns.get(this.id, 'type') == "fileUpload") {
            file_upload_total = file_upload_total + 1;
        }
        this.li = document.createElement("li");
        this.generate_markup();
        this.li.id = "li_" + this.id;
        var htmlId = ns.get(this.id, 'html_id');
        
        if (htmlId == '')
            ns.set(this.id, "html_id", this.id);
        
        
        $(this.li).addClass("drag");
        if (ns.get(this.id, "is_private") == "1") {
            $(this.li).addClass("private")
        }
        return this.li
    },
    selected: function() {
        $(this.li).addClass("current_edit")
    },
    unselect: function() {
        $(this.li).removeClass("current_edit")
    },
    generate_markup: function() {
        this.li.innerHTML = '<img id="arrow" src="../../img/form_builder/arrow.gif" alt="" class="arrow"><a href="#" class="hover_ready" onclick="return false;" title="Click to edit. Drag to reorder.">' + this.field_label() + this[ns.get(this.id, "type")]() + "</a>" + this.element_actions()
    },
    field_label: function() {
        label_id = "title" + this.id;
        label_val = ns.get(this.id, "title");
        label_val = label_val.replace(/\n/g, "<br/>");
        var B = "";
        if (ns.get(this.id, "is_numeric") == "1") {
            B = B + '<span class="req">(Numeric Only)</span>'
        }
        if (ns.get(this.id, "is_charecter") == "1") {
            B = B + '<span class="req">(Characters Only)</span>'
        }
        if (ns.get(this.id, "is_required") == "1") {
            B = B + '<span class="req">*</span>'
        }
        var A = '<label class="desc" id="' + label_id + '">' + label_val + B + "</label>";
        return A
    },
    element_actions: function() {
        if (navigator.userAgent.toUpperCase().indexOf('MSIE')) {
            style = 'style="margin-top:-18px"'
        } else {
            style = ""
        }
        return '<div class="element_actions" ' + style + '>\n\
<img src="../../img/form_builder/delete.gif" alt="Conditional Logic" title="Conditional Logic" onclick="conditionalLogic(' + this.id + ')">\n\
<img src="../../img/form_builder/delete.gif" alt="Delete." title="Delete" onclick="delete_attribute(' + this.id + ')">\n\
</div>'
        return '<div class="element_actions" ' + style + '><img src="../../img/form_builder/delete.gif" alt="Delete." title="Delete" onclick="delete_attribute(' + this.id + ')"></div>'
    },
    text: function() {
        return '<div><input readonly="readonly" id="field' + this.id + '" class="text ' + ns.get(this.id, "size") + '" type="text"></div>'
    },
    textarea: function() {
        return '<div><textarea type="text" readonly="readonly" id="field' + this.id + '" class="textarea ' + ns.get(this.id, "size") + '" rows="" cols=""></textarea></div>'
    },
    checkbox: function() {
        element_options = ns.get(this.id, "options");
        var A = "";
        for (i = 0; i < element_options.length; i++) {
            el_val = element_options[i].option;
            if (el_val == "") {
                el_val = "&nbsp;"
            }
            if (element_options[i].is_default == 1) {
                checked = 'checked="checked"'
            } else {
                checked = ""
            }
            A = A + '<input class="checkbox" ' + checked + ' type="checkbox"><label class="choice">' + el_val + "</label>\n"
        }
        A = '<span id="field' + this.id + '">' + A + "</span>";
        return A
    },
    multipleSelect: function() {
        element_options = ns.get(this.id, "options");
        var A = "";
        for (i = 0; i < element_options.length; i++) {
            if (element_options[i].is_default == 1) {
                selected = 'selected="selected"'
            } else {
                selected = ""
            }
            A = A + "<option " + selected + ">" + element_options[i].option + "</option>"
        }
        A = '<div><select id="field' + this.id + '" class="select ' + ns.get(this.id, "size") + '" multiple="multiple" size="3" readonly="readonly">' + A + "</select></div>";
        return A
    },
    select: function() {
        element_options = ns.get(this.id, "options");
        var A = "";
        for (i = 0; i < element_options.length; i++) {
            if (element_options[i].is_default == 1) {
                selected = 'selected="selected"'
            } else {
                selected = ""
            }
            A = A + "<option " + selected + ">" + element_options[i].option + "</option>"
        }
        A = '<div><select id="field' + this.id + '" class="select ' + ns.get(this.id, "size") + '">' + A + "</select></div>";
        return A
    },
    fileUpload: function() {
        return '<div><input class="text" readonly="readonly" type="file"></div>'
    },
    radio: function() {
        element_options = ns.get(this.id, "options");
        var A = "";
        for (i = 0; i < element_options.length; i++) {
            el_val = element_options[i].option;
            if (el_val == "") {
                el_val = "&nbsp;"
            }
            if (element_options[i].is_default == 1) {
                name = "radiogroup" + this.id;
                checked = 'checked="checked"'
            } else {
                name = "radiogroup";
                checked = ""
            }
            A = A + '<input class="radio" name="' + name + '" ' + checked + ' type="radio"><label class="choice">' + el_val + "</label>\n"
        }
        A = '<span id="field' + this.id + '">' + A + "</span>";
        return A
    },
    name: function() {
        return '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="packages"><tr><td width="8%"><input readonly="readonly" class="percent100" type="text"><label>Title</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="30%"><input readonly="readonly" class="percent100" type="text"><label>First Name</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="30%"><input readonly="readonly" class="percent100" type="text"><label>Middle Name</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="30%"><input readonly="readonly" class="percent100" type="text"><label>Last Name</label></td></tr></table>'
    },
    simple_name: function() {
        return '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="packages"><tr><td width="33%"><input readonly="readonly" class="percent100" type="text" /><label>First Name</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt="" /></td><td width="33%"><input readonly="readonly" class="percent100" type="text" /><label>Last Name</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt="" /></td><td width="33%">&nbsp;</td></tr></table>';
    },
    date: function() {
        return '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="packages"><tr><td width="50%"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="35"><input readonly="readonly" class="text dd_mm" size="2" type="text"/></td><td width="15" class="phone_divider">/</td><td width="35"><input readonly="readonly" class="text dd_mm" size="2" type="text"/></td><td width="15" class="phone_divider">/</td><td width="65"><input readonly="readonly" class="text yyyy" size="2" type="text"/></td><td width="15">&nbsp;</td><td>&nbsp;</td></tr><tr><td><label>DD</label></td><td class="phone_divider">&nbsp;</td><td><label>MM</label></td><td class="phone_divider">&nbsp;</td><td><label>YYYY</label></td><td>&nbsp;</td><td>&nbsp;</td></tr></table></td><td width="50%">&nbsp;</td></tr></table>'
    },
    europe_date: function() {
        return '<div><span><input readonly="readonly" class="text" size="2" type="text">/<label>DD</label></span><span><input readonly="readonly" class="text" size="2" type="text">/<label>MM</label></span><span><input readonly="readonly" class="text" size="4" type="text"><label>YYYY</label></span>&nbsp;</div>'
    },
    phone: function() {
        return '<div><span><input readonly="readonly" class="text" size="3" type="text">-<label>(###)</label></span><span><input readonly="readonly" class="text" size="3" type="text">-<label>###</label></span><span><input readonly="readonly" class="text" size="4" type="text"><label>####</label></span></div>'
    },
    simple_phone: function() {
        return '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="packages"><tr><td width="50%"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="35"><input readonly="readonly" class="text phonecode" size="3" type="text"/></td><td width="10" class="phone_divider">-</td><td><input readonly="readonly" class="text percent100" type="text"/></td></tr><tr><td>&nbsp;</td><td class="phone_divider">&nbsp;</td><td><label>Tel. Number</label></td></tr></table></td><td width="50%">&nbsp;</td></tr></table>'
    },
    address: function() {
        return '<div class="full"><div class="full"><input readonly="readonly" class="text large" type="text"><label>Street Address</label></div><div class="full"><input readonly="readonly" class="text large" type="text"><label>Address Line 2</label></div><div class="left"><input readonly="readonly" class="text medium" type="text"><label>City</label></div><div class="right"><input readonly="readonly" class="text medium" type="text"><label>State/Province/Region</label></div><div class="left"><input readonly="readonly" class="text medium" type="text"><label>Zip/Postal Code</label></div><div class="right"><select class="select medium" name=""><option value=""></option></select><label>Country</label></div></div>'
    },
    guardians_info: function() {
        return '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="packages"><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="32%"><input readonly="readonly" class="percent100" type="text"><label>First Name</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="32%"><input readonly="readonly" class="percent100" type="text"><label>Middle Name</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="32%"><input readonly="readonly" class="percent100" type="text"><label>Last Name</label></td></tr></table></td></tr><tr><td>&nbsp;</td></tr><tr><td><input readonly="readonly" class="percent100" type="text"><label>Relationship to the Applicant</label></td></tr><tr><td>&nbsp;</td></tr><tr><td><textarea type="text" readonly="readonly" id="" class="medium percent100" rows="" cols=""></textarea><label>Address</label></td></tr><tr><td>&nbsp;</td></tr><tr><td class="subsubheading">Telephone No.</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="48%"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="35"><input readonly="readonly" class="text phonecode" size="3" type="text"/></td><td width="10" class="phone_divider">-</td><td><input readonly="readonly" class="text percent100" type="text"/></td></tr><tr><td>&nbsp;</td><td class="phone_divider">&nbsp;</td><td><label>Residence Phone No.</label></td></tr></table></td><td><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="48%"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="35"><input readonly="readonly" class="text phonecode" size="3" type="text"/></td><td width="10" class="phone_divider">-</td><td><input readonly="readonly" class="text percent100" type="text"/></td></tr><tr><td>&nbsp;</td><td class="phone_divider">&nbsp;</td><td><label>Office Phone No.</label></td></tr></table></td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td><input readonly="readonly" class="text percent100" type="text"/></td></tr><tr><td><label>Mobile No.</label></td></tr></table></td><td>&nbsp;</td><td><input readonly="readonly" class="percent100" type="text"><label>Email</label></td></tr></table></td></tr></table>'
    },
    language_fluency: function() {
        return '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="packages"><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0" class="table_data_matrix"><tr><td class="subheading">Language</td><td width="70" class="subheading" style="text-align:center">Speaks</td><td width="70" class="subheading" style="text-align:center">Reads</td><td width="70" class="subheading" style="text-align:center">Writes</td></tr><tr><td style="padding-bottom:5px;"><input readonly="readonly" class="percent100" type="text"></td><td style="text-align:center"><input name="" type="checkbox" value="" class="checkbox"/></td><td style="text-align:center"><input name="" type="checkbox" value="" class="checkbox"/></td><td style="text-align:center"><input name="" type="checkbox" value="" class="checkbox"/></td></tr><tr><td style="padding-bottom:5px;"><input readonly="readonly" class="percent100" type="text"></td><td style="text-align:center"><input name="" type="checkbox" value="" class="checkbox"/></td><td style="text-align:center"><input name="" type="checkbox" value="" class="checkbox"/></td><td style="text-align:center"><input name="" type="checkbox" value="" class="checkbox"/></td></tr><tr><td style="padding-bottom:5px;"><input readonly="readonly" class="percent100" type="text"></td><td style="text-align:center"><input name="" type="checkbox" value="" class="checkbox"/></td><td style="text-align:center"><input name="" type="checkbox" value="" class="checkbox"/></td><td style="text-align:center"><input name="" type="checkbox" value="" class="checkbox"/></td></tr><tr><td style="padding-bottom:5px;"><input readonly="readonly" class="percent100" type="text"></td><td style="text-align:center"><input name="" type="checkbox" value="" class="checkbox"/></td><td style="text-align:center"><input name="" type="checkbox" value="" class="checkbox"/></td><td style="text-align:center"><input name="" type="checkbox" value="" class="checkbox"/></td></tr><tr><td><input readonly="readonly" class="percent100" type="text"></td><td style="text-align:center"><input name="" type="checkbox" value="" class="checkbox"/></td><td style="text-align:center"><input name="" type="checkbox" value="" class="checkbox"/></td><td style="text-align:center"><input name="" type="checkbox" value="" class="checkbox"/></td></tr></table></td></tr></table>'
    },
    declaration: function() {
        $("#prop_declaration").css("display", "block");
        var A = ns.get(this.id, "declaration_prop");
        return '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="packages"><tr><td><textarea type="text" readonly="readonly" id="declaration_text" class="medium percent100" rows="" cols="">' + A + '</textarea></td></tr><tr><td>&nbsp;</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="subsubheading"><input readonly="readonly" class="percent100" type="text"><label>Name of the Applicant</label></td><td>&nbsp;</td><td class="subsubheading"><input readonly="readonly" class="percent100" type="text"><label>Name of the Parent</label></td></tr><tr><td width="48%">&nbsp;</td><td>&nbsp;</td><td width="48%">&nbsp;</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="35"><input readonly="readonly" class="text dd_mm" size="2" type="text"/></td><td width="15" class="phone_divider">/</td><td width="35"><input readonly="readonly" class="text dd_mm" size="2" type="text"/></td><td width="15" class="phone_divider">/</td><td width="65"><input readonly="readonly" class="text yyyy" size="2" type="text"/></td><td width="15">&nbsp;</td><td>&nbsp;</td></tr><tr><td><label>DD</label></td><td class="phone_divider">&nbsp;</td><td><label>MM</label></td><td class="phone_divider">&nbsp;</td><td><label>YYYY</label></td><td>&nbsp;</td><td>&nbsp;</td></tr></table></td><td>&nbsp;</td><td>&nbsp;</td></tr></table></td></tr></table>'
    },
    work_experience: function() {
        return '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="packages "><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0" class="table_data_matrix"><tr><td class="subsubheading">Name of the Organisation</td><td width="80" class="subsubheading">Position</td><td width="60" class="subsubheading" style="text-align:center">Period<br/>From - To</td><td width="60" class="subsubheading" style="text-align:center">Total<br/>Experience</td></tr><tr><td><input readonly="readonly" class="percent95" type="text"></td><td><input readonly="readonly" class="percent95" type="text"></td><td style="text-align:center"><input readonly="readonly" class="percent95" type="text"></td><td style="text-align:center"><input readonly="readonly" class="percent95" type="text"></td></tr><tr><td><input readonly="readonly" class="percent95" type="text"></td><td><input readonly="readonly" class="percent95" type="text"></td><td style="text-align:center"><input readonly="readonly" class="percent95" type="text"></td><td style="text-align:center"><input readonly="readonly" class="percent95" type="text"></td></tr><tr><td><input readonly="readonly" class="percent95" type="text"></td><td><input readonly="readonly" class="percent95" type="text"></td><td style="text-align:center"><input readonly="readonly" class="percent95" type="text"></td><td style="text-align:center"><input readonly="readonly" class="percent95" type="text"></td></tr><tr><td><input readonly="readonly" class="percent95" type="text"></td><td><input readonly="readonly" class="percent95" type="text"></td><td style="text-align:center"><input readonly="readonly" class="percent95" type="text"></td><td style="text-align:center"><input readonly="readonly" class="percent95" type="text"></td></tr></table></td></tr></table>'
    },
    edu_history: function() {
        return '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="packages"><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0" class="table_data_matrix"><tr><td class="subsubheading">Examination</td><td width="110" class="subsubheading">University/Board</td><td width="90" class="subsubheading">College/School</td><td width="80" class="subsubheading">Marks(in %)/Grade</td></tr><tr><td class="subsubheading">10th</td><td><input readonly="readonly" class="percent95" type="text"/></td><td><input readonly="readonly" class="percent95" type="text"/></td><td><input readonly="readonly" class="percent95" type="text"/></td></tr><tr><td class="subsubheading">10+2</td><td><input readonly="readonly" class="percent95" type="text"/></td><td><input readonly="readonly" class="percent95" type="text"/></td><td><input readonly="readonly" class="percent95" type="text"/></td></tr><tr><td class="subsubheading">Graduation</td><td><input readonly="readonly" class="percent95" type="text"/></td><td><input readonly="readonly" class="percent95" type="text"/></td><td><input readonly="readonly" class="percent95" type="text"/></td></tr><tr><td class="subsubheading">Any Other</td><td><input readonly="readonly" class="percent95" type="text"/></td><td><input readonly="readonly" class="percent95" type="text"/></td><td><input readonly="readonly" class="percent95" type="text"/></td></tr></table></td></tr></table>'
    },
    emergency_contact: function() {
        return '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="packages"><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="32%"><input readonly="readonly" class="percent100" type="text"><label>First Name</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="32%"><input readonly="readonly" class="percent100" type="text"><label>Middle Name</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="32%"><input readonly="readonly" class="percent100" type="text"><label>Last Name</label></td></tr></table></td></tr><tr><td>&nbsp;</td></tr><tr><td><input readonly="readonly" class="percent100" type="text"><label>Relationship to the Applicant</label></td></tr><tr><td>&nbsp;</td></tr><tr><td><textarea type="text" readonly="readonly" id="" class="medium percent100" rows="" cols=""></textarea><label>Address</label></td></tr><tr><td>&nbsp;</td></tr><tr><td class="subsubheading">Telephone No.</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="48%"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="35"><input readonly="readonly" class="text phonecode" size="3" type="text"/></td><td width="10" class="phone_divider">-</td><td><input readonly="readonly" class="text percent100" type="text"/></td></tr><tr><td>&nbsp;</td><td class="phone_divider">&nbsp;</td><td><label>Residence Phone No.</label></td></tr></table></td><td><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="48%"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="35"><input readonly="readonly" class="text phonecode" size="3" type="text"/></td><td width="10" class="phone_divider">-</td><td><input readonly="readonly" class="text percent100" type="text"/></td></tr><tr><td>&nbsp;</td><td class="phone_divider">&nbsp;</td><td><label>Office Phone No.</label></td></tr></table></td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td><input readonly="readonly" class="text percent100" type="text"/></td></tr><tr><td><label>Mobile No.</label></td></tr></table></td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td><input readonly="readonly" class="percent100" type="text"><label>Email</label></td><td>&nbsp;</td><td><input readonly="readonly" class="percent100" type="text"><label>Applicant\'s blood group</label></td></tr></table></td></tr></table>'
    },
    parents_info: function() {
        return '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="packages"><tr><td class="subheading">Father\'s Details</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="32%"><input readonly="readonly" class="percent100" type="text"><label>First Name</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="32%"><input readonly="readonly" class="percent100" type="text"><label>Middle Name</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="32%"><input readonly="readonly" class="percent100" type="text"><label>Last Name</label></td></tr></table></td></tr><tr><td>&nbsp;</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="48%"><input readonly="readonly" class="percent100" type="text"/><label>Occupation</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="48%"><input readonly="readonly" class="percent100" type="text"/><label>Designation</label></td></tr></table></td></tr><tr><td>&nbsp;</td></tr><tr><td class="subsubheading">Telephone No.</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="48%"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="35"><input readonly="readonly" class="text phonecode" size="3" type="text"/></td><td width="10" class="phone_divider">-</td><td><input readonly="readonly" class="text percent100" type="text"/></td></tr><tr><td>&nbsp;</td><td class="phone_divider">&nbsp;</td><td><label>Residence Phone No.</label></td></tr></table></td><td><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="48%"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="35"><input readonly="readonly" class="text phonecode" size="3" type="text"/></td><td width="10" class="phone_divider">-</td><td><input readonly="readonly" class="text percent100" type="text"/></td></tr><tr><td>&nbsp;</td><td class="phone_divider">&nbsp;</td><td><label>Office Phone No.</label></td></tr></table></td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td><input readonly="readonly" class="text percent100" type="text"/></td></tr><tr><td><label>Mobile No.</label></td></tr></table></td><td>&nbsp;</td><td><input readonly="readonly" class="percent100" type="text"><label>Email</label></td></tr></table></td></tr><tr><td>&nbsp;</td></tr><tr><td class="subheading">Mother\'s Details</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="32%"><input readonly="readonly" class="percent100" type="text"><label>First Name</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="32%"><input readonly="readonly" class="percent100" type="text"><label>Middle Name</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="32%"><input readonly="readonly" class="percent100" type="text"><label>Last Name</label></td></tr></table></td></tr><tr><td>&nbsp;</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="48%"><input readonly="readonly" class="percent100" type="text"/><label>Occupation</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="48%"><input readonly="readonly" class="percent100" type="text"/><label>Designation</label></td></tr></table></td></tr><tr><td>&nbsp;</td></tr><tr><td class="subsubheading">Telephone No.</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="48%"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="35"><input readonly="readonly" class="text phonecode" size="3" type="text"/></td><td width="10" class="phone_divider">-</td><td><input readonly="readonly" class="text percent100" type="text"/></td></tr><tr><td>&nbsp;</td><td class="phone_divider">&nbsp;</td><td><label>Residence Phone No.</label></td></tr></table></td><td><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="48%"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="35"><input readonly="readonly" class="text phonecode" size="3" type="text"/></td><td width="10" class="phone_divider">-</td><td><input readonly="readonly" class="text percent100" type="text"/></td></tr><tr><td>&nbsp;</td><td class="phone_divider">&nbsp;</td><td><label>Office Phone No.</label></td></tr></table></td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td><input readonly="readonly" class="text percent100" type="text"/></td></tr><tr><td><label>Mobile No.</label></td></tr></table></td><td>&nbsp;</td><td><input readonly="readonly" class="percent100" type="text"><label>Email</label></td></tr></table></td></tr></table>'
    },
    nationality: function() {
        return '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="packages"><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="subsubheading"><input readonly="readonly" class="percent100" type="text"><label>Passport No.</label></td><td>&nbsp;</td><td class="subsubheading"><input readonly="readonly" class="percent100" type="text"><label>Place of Issue</label></td></tr><tr><td width="48%">&nbsp;</td><td>&nbsp;</td><td width="48%">&nbsp;</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="35"><input readonly="readonly" class="text dd_mm" size="2" type="text"/></td><td width="15" class="phone_divider">/</td><td width="35"><input readonly="readonly" class="text dd_mm" size="2" type="text"/></td><td width="15" class="phone_divider">/</td><td width="65"><input readonly="readonly" class="text yyyy" size="2" type="text"/></td><td width="15">&nbsp;</td><td>&nbsp;</td></tr><tr><td><label>DD</label></td><td class="phone_divider">&nbsp;</td><td><label>MM</label></td><td class="phone_divider">&nbsp;</td><td><label>YYYY</label></td><td>&nbsp;</td><td>&nbsp;</td></tr></table></td><td>&nbsp;</td><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="35"><input readonly="readonly" class="text dd_mm" size="2" type="text"/></td><td width="15" class="phone_divider">/</td><td width="35"><input readonly="readonly" class="text dd_mm" size="2" type="text"/></td><td width="15" class="phone_divider">/</td><td width="65"><input readonly="readonly" class="text yyyy" size="2" type="text"/></td><td width="15">&nbsp;</td><td>&nbsp;</td></tr><tr><td><label>DD</label></td><td class="phone_divider">&nbsp;</td><td><label>MM</label></td><td class="phone_divider">&nbsp;</td><td><label>YYYY</label></td><td>&nbsp;</td><td>&nbsp;</td></tr></table></td></tr><tr><td><label>Date of Issue</label></td><td>&nbsp;</td><td><label>Date of Expiry</label></td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td><select class="select percent100" name=""><option value=""></option></select><label>Country</label></td><td>&nbsp;</td><td>&nbsp;</td></tr></table></td></tr></table>'
    },
    personalinfo: function() {
        return '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="packages"><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="32%"><input readonly="readonly" class="percent100" type="text"><label>First Name</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="32%"><input readonly="readonly" class="percent100" type="text"><label>Middle Name</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="32%"><input readonly="readonly" class="percent100" type="text"><label>Last Name</label></td></tr></table></td></tr><tr><td>&nbsp;</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="48%" class="subsubheading">Date of Birth</td><td>&nbsp;</td><td width="48%" class="subsubheading">Gender</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="35"><input readonly="readonly" class="text dd_mm" size="2" type="text"></td><td width="15" class="phone_divider">/</td><td width="35"><input readonly="readonly" class="text dd_mm" size="2" type="text"></td><td width="15" class="phone_divider">/</td><td width="65"><input readonly="readonly" class="text yyyy" size="2" type="text"></td><td width="15">&nbsp;</td><td>&nbsp;</td></tr><tr><td><label>DD</label></td><td class="phone_divider">&nbsp;</td><td><label>MM</label></td><td class="phone_divider">&nbsp;</td><td><label>YYYY</label></td><td>&nbsp;</td><td>&nbsp;</td></tr></table></td><td>&nbsp;</td><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="20"><input type="radio" name="radio" id="radio2" class="radio" value="radio"/></td><td width="50">Male</td><td width="20"><input type="radio" name="radio" id="radio" class="radio" value="radio"/></td><td>&nbsp;Female</td></tr></table></td></tr></table></td></tr><tr><td>&nbsp;</td></tr><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="48%"><input readonly="readonly" class="percent100" type="text"><label>Place of Birth</label></td><td>&nbsp;</td><td width="48%">&nbsp;</td></tr></table></td></tr></table>'
    },
    money: function() {
        currency = ns.get(this.id, "constraints");
        return '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="packages"><tr><td width="50%"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="25">Rs.</td><td width="75"><input readonly="readonly" class="percent100" size="2" type="text"/></td><td width="15" class="phone_divider">.</td><td width="40"><input readonly="readonly" class="percent100" size="2" type="text"/></td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td><label>Rupee</label></td><td class="phone_divider">&nbsp;</td><td><label>Paise</label></td><td>&nbsp;</td></tr></table></td><td width="50%">&nbsp;</td></tr></table>'
    },
    percentage: function() {
        return '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="packages"><tr><td width="70%"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="32%"><input readonly="readonly" class="percent100" type="text"/><label>Obtained Marks</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="32%"><input readonly="readonly" class="percent100" type="text"/><label>Total Marks</label></td><td width="10"><img src="images/common/spacer.gif" width="10" height="10" alt=""/></td><td width="32%"><input readonly="readonly" class="percent100" type="text"/><label>Percentage</label></td></tr></table></td><td width="30%">&nbsp;</td></tr></table>'
    },
    matrix: function() {
        var tab_columns_var = ns.get(this.id, "columns").length;
        var tab_rows_var = ns.get(this.id, "rows").length;
        var el_val_columns;
        var el_val_rows;
        var attribute_columns = ns.get(this.id, "columns");
        var attribute_rows = ns.get(this.id, "rows");
        var table_val = '<table width="100%" class="table_data_matrix">';
        var t = 0;
        var k = 0;
        for (var i = 0; i <= tab_rows_var; i++) {
            table_val = table_val + '<tr>';
            for (var j = 0; j <= tab_columns_var; j++) {
                if (j == 0) {
                    if (i != 0) {
                        if (t < tab_rows_var) {
                            el_val_rows = attribute_rows[t].option;
                            if (el_val_rows == "") {
                                el_val_rows = "&nbsp;"
                            }
                        }
                        table_val = table_val + '<td align="left" width="13%">' + el_val_rows + '</td>';
                        t = t + 1;
                    } else {
                        table_val = table_val + '<td>&nbsp;</td>';
                    }
                } else {
                    if (i == 0) {
                        if (k < tab_columns_var) {
                            el_val_columns = attribute_columns[k].option;
                            if (el_val_columns == "") {
                                el_val_columns = "&nbsp;"
                            }
                        }
                        table_val = table_val + '<td align="left" width="13%">' + el_val_columns + '</td>';
                        k = k + 1;
                    } else {
                        table_val = table_val + '<td align="left"><input type="text" name="matrix_"' + j + '" style="width:95%;"/></td>';
                    }
                }
            }
            table_val = table_val + '</tr>';
        }
        table_val = table_val + '</table>';
        return '<div>' + table_val + '</div>'
    },
    email: function() {
        return '<div><input value="@" readonly="readonly" id="field' + this.id + '" class="text ' + ns.get(this.id, "size") + '" type="text"></div>'
    },
    url: function() {
        return '<div><input value="http://" readonly="readonly" id="field' + this.id + '" class="text ' + ns.get(this.id, "size") + '" type="text"></div>'
    },
    number: function() {
        return '<div><input value="0123456789" readonly="readonly" id="field' + this.id + '" class="text ' + ns.get(this.id, "size") + '" type="text"></div>'
    },
    section: function() {
        var A = ns.get(this.id, "help");
        A = A.replace(/\n/g, "<br/>");
        return '<span id="help' + ns.get(this.id, "id") + '">' + A + "</span>"
    },
    documents: function() {
        var A = ns.get(this.id, "documents_prop");
        A = A.replace(/\n/g, "<br/>");
        return '<span id="documents_prop' + ns.get(this.id, "id") + '">' + A + "</span>"
    }
};
var npf_source = function() {};
npf_source.prototype = {
    initialize: function() {
        this.data = {
            elements: []
        }
    },
    new_element: function(A, C, B, D) {
        title = "Untitled";
        switch (A) {
            case "text":
                title = "Text";
                break;
            case "textarea":
                title = "Paragraph";
                break;
            case "select":
                title = "Drop Down(Single Select)";
                break;
            case "multipleSelect":
                title = "Multiple select";
                break;
            case "fileUpload":
                title = "File Upload";
                break;
            case "radio":
                title = "Radio Button(Single Select)";
                break;
            case "checkbox":
                title = "Checkboxes";
                break;
            case "name":
                title = "Name";
                break;
            case "simple_name":
                title = "Name";
                break;
            case "date":
                title = "Date";
                break;
            case "europe_date":
                title = "Date";
                break;
            case "phone":
                title = "Phone";
                break;
            case "simple_phone":
                title = "Phone";
                break;
            case "address":
                title = "Address";
                break;
            case "guardians_info":
                title = "Guardian\'s Details";
                break;
            case "language_fluency":
                title = "Applicant\'s Language Fluency";
                break;
            case "declaration":
                title = "Declaration";
                break;
            case "work_experience":
                title = "Work Experience";
                break;
            case "edu_history":
                title = "Education History";
                break;
            case "emergency_contact":
                title = "Emergency Contact Information";
                break;
            case "parents_info":
                title = "Parent Details";
                break;
            case "nationality":
                title = "Nationality";
                break;
            case "personalinfo":
                title = "Personal Details";
                break;
            case "money":
                title = "Price";
                break;
            case "percentage":
                title = "Percentage";
                break;
            case "matrix":
                title = "Table";
                break;
            case "url":
                title = "Web Site";
                break;
            case "email":
                title = "Email";
                break;
            case "number":
                title = "Number";
                break;
            case "section":
                title = "Section Break";
                break;
            case "documents":
                title = "Documents to be submit";
                break;
        }
        this.data.elements.push({
            title: title,
            help: "",
            size: "medium",
            is_required: "0",
            is_numeric: "0",
            is_charecter: "0",
            declaration_prop: "",
            documents_prop: "",
            type: A,
            object: B,
            position: C,
            id: C,
            is_db_live: D,
            default_value: "",
            constraints: "",
            html_id: "",
            options: [{
                option: "First option",
                is_default: 0,
                is_db_live: D,
                id: "0"
            }, {
                option: "Second option",
                is_default: 0,
                is_db_live: "0",
                id: "0"
            }, {
                option: "Third option",
                is_default: 0,
                is_db_live: "0",
                id: "0"
            }],
            columns: [{
                option: "First column",
                is_db_live: D,
                id: "0"
            }, {
                option: "Second column",
                is_db_live: "0",
                id: "0"
            }, {
                option: "Third column",
                is_db_live: "0",
                id: "0"
            }],
            rows: [{
                option: "First row",
                is_db_live: D,
                id: "0"
            }, {
                option: "Second row",
                is_db_live: "0",
                id: "0"
            }, {
                option: "Third row",
                is_db_live: "0",
                id: "0"
            }]
        })
    },
    get: function(D, A) {
        for (var B = 0; B < this.data.elements.length; B++) {
            var C = this.data.elements[B];
            if (D == C.id) {
                el = C;
                break
            }
        }
        return el[A]
    },
    set: function(C, A, B) {
        jQuery.each(this.data.elements, function(E, D) {
            if ((typeof E === 'string' || E instanceof String) && B.replace) {
                B = B.replace(/\\\"/g, '\\ "')
            }
            if (D.id == C) {
                D[A] = B
            }
        })
    },
    set_option: function(C, A, B) {
        if (A.replace) {
            A = A.replace(/\\\"/g, '\\ "')
        }
        jQuery.each(this.data.elements, function(E, D) {
            if (D.id == C) {
                D.options[B].option = A
            }
        })
    },
    set_declaration: function(C, A, B) {
        if (A.replace) {
            A = A.replace(/\\\"/g, '\\ "')
        }
        jQuery.each(this.data.elements, function(E, D) {
            if (D.id == C) {
                D.declaration_prop = A
            }
        })
    },
    set_documents: function(C, A, B) {
        if (A.replace) {
            A = A.replace(/\\\"/g, '\\ "')
        }
        jQuery.each(this.data.elements, function(E, D) {
            if (D.id == C) {
                D.documents_prop = A
            }
        })
    },
    set_columns: function(C, A, B) {
        if (A.replace) {
            A = A.replace(/\\\"/g, '\\ "')
        }
        jQuery.each(this.data.elements, function(E, D) {
            if (D.id == C) {
                D.columns[B].option = A
            }
        })
    },
    set_rows: function(C, A, B) {
        if (A.replace) {
            A = A.replace(/\\\"/g, '\\ "')
        }
        jQuery.each(this.data.elements, function(E, D) {
            if (D.id == C) {
                D.rows[B].option = A
            }
        })
    },
    set_default_option: function(B, A) {
        jQuery.each(this.data.elements, function(D, C) {
            if (C.id == A) {
                jQuery.each(C.options, function(E, F) {
                    if (E == B && F.is_default == 0) {
                        F.is_default = 1
                    } else {
                        if (E == B && F.is_default == 1) {
                            F.is_default = 0
                        } else {
                            if (C.type != "checkbox") {
                                F.is_default = 0
                            }
                        }
                    }
                })
            }
        })
    },
    remove_element: function(C) {
        for (var A = 0; A < this.data.elements.length; A++) {
            var B = this.data.elements[A];
            if (C == B.id) {
                ns.data.elements.splice(A, 1);
                break
            }
        }
    },
    get_element: function(C, B) {
        var A;
        jQuery.each(this.data.elements, function(E, D) {
            if (D.position == C) {
                (B) ? A = D[B]: A = E
            }
        });
        return A
    },
    stringify: function() {
        save_elements = new Array();
        jQuery.each(this.data.elements, function(B, A) {
            save_elements.push(A.object);
            A.object = ""
        });
        ret = JSON.stringify(this.data);
        jQuery.each(this.data.elements, function(B, A) {
            A.object = save_elements[B]
        });
        return ret
    }
};
var form = function() {};
form.prototype = {
    initialize: function() {
        this.data = {
            id: "0",
            name: "Untitled Form",
            instruction1: "",
            instruction2: "",
            instruction3: "",
            instruction4: "",
            street_adr: "",
            city_adr: "",
            region_adr: "",
            postal_code_adr: "",
            phone_adr: "",
            email_adr: "",
            country_adr: "",
            startRange: "0",
            unique_ip: "1",
            captcha: "1",
            review: "1"
        }
    },
    display: function() {
        this.li = document.createElement("li");
        $(this.li).attr("id", "active_form").addClass("info");
        this.li.innerHTML = '<img src="../../img/form_builder/arrow.gif" alt="" class="arrow"><a href="#" class="hover_ready" title="Click to edit."><h2 id="form_name">' + this.data.name + '</h2>' + "</a>";
        return this.li
    },
    selected: function() {
        $(this.li).addClass("current_edit")
    },
    unselect: function() {
        $(this.li).removeClass("current_edit")
    }
};
var components = {
    text: ["types", "size", "required", "only_numeric", "only_charecter"],
    textarea: ["types", "size", "required", "only_numeric", "only_charecter"],
    select: ["types", "size", "required", "choices", "only_numeric", "only_charecter"],
    radio: ["types", "choices", "required", "only_numeric", "only_charecter"],
    checkbox: ["types", "choices", "required", "only_numeric", "only_charecter"],
    multipleSelect: ["types", "choices", "required", "size", "only_numeric", "only_charecter"],
    name: ["types", "required", "name", "only_numeric", "only_charecter"],
    simple_name: ["types", "required", "name", "only_numeric", "only_charecter"],
    date: ["types", "required", "date", "only_numeric", "only_charecter"],
    europe_date: ["types", "required", "date", "only_numeric", "only_charecter"],
    phone: ["types", "required", "unique", "phone", "phone_default", "only_numeric", "only_charecter"],
    simple_phone: ["types", "required", "phone", "only_numeric", "only_charecter"],
    address: ["types", "required", "address_default", "only_numeric", "only_charecter"],
    guardians_info: ["types", "required", "only_numeric", "only_charecter"],
    work_experience: ["types", "required", "only_numeric", "only_charecter"],
    edu_history: ["types", "required", "only_numeric", "only_charecter"],
    fileUpload: ["types", "required", "only_numeric", "only_charecter"],
    language_fluency: ["types", "required", "only_numeric", "only_charecter"],
    emergency_contact: ["types", "required", "only_numeric", "only_charecter"],
    parents_info: ["types", "required", "only_numeric", "only_charecter"],
    declaration: ["types", "required", "only_numeric", "only_charecter", "declaration_prop"],
    nationality: ["types", "required", "nationality_default", "only_numeric", "only_charecter"],
    personalinfo: ["types", "required", "only_numeric", "only_charecter"],
    money: ["types", "required", "only_numeric", "only_charecter"],
    percentage: ["types", "required", "only_numeric", "only_charecter"],
    matrix: ["types", "columns", "rows", "required", "only_numeric", "only_charecter"],
    url: ["types", "size", "required", "only_numeric", "only_charecter"],
    email: ["types", "size", "required", "only_numeric", "only_charecter"],
    number: ["types", "size", "required", "only_charecter", "only_numeric", "only_charecter"],
    section: ["types"],
    documents: ["types", "documents_prop"]
};
var redirect_url = "http://";
var ns = new npf_source();
ns.initialize();
var attribute_count = 0;
var active_element;
var element_view;
var main_form;
var current_offset;

function load_all() {
    if (jsVars.json_elements != "") {
        document.getElementById('all_properties').style.display = "none";
    }
    element_view = new element_properties();
    element_view.initialize(1);
    new_form();
    $("#active_form").css("display", "none");
    if (jsVars.json_elements != "") {
        populate_fields();
        $("#buttons").click(function() {
            save_form_attribute_data()
        });
    } else {
        $("#buttons").click(function() {
            save_form_data();
        });
    }
    $("#statusPanel").fadeOut("normal");
}

function new_form() {
    ctrl = new form();
    ctrl.initialize();
    main_form = ctrl;
    markup = ctrl.display();
    if (jsVars.json_elements != "") {
        document.getElementById("npf_form_all_elements").insertBefore(markup, document.getElementById("npf_form_all_elements").lastChild);
    }
    $(ctrl.li).mousedown(function() {
        activate_form()
    })
}
var boxHeight = 0;

function add_npf_field(A) {
    document.getElementById('save_status').value = 1;
    if (A == "fileUpload") {
        if (file_upload_total == 5) {
            alert("DANG! we only allow upto 5 document attachments with each application form. You seem to have exceeded that limit!");
            return false;
        }
    }
    if (A != "pagebreak") {
        $("#nofields").css("display", "none");
        if (A == "currency") {
            A = "money"
        }
        ctrl = initialize_control(A);
        if (A == "address") {
            ns.set(ctrl.id, "size", "large")
        }
        if (A == "guardians_info") {
            ns.set(ctrl.id, "size", "large")
        }
        if (A == "language_fluency") {
            ns.set(ctrl.id, "size", "large")
        }
        if (A == "declaration") {
            ns.set(ctrl.id, "size", "large")
        }
        if (A == "work_experience") {
            ns.set(ctrl.id, "size", "large")
        }
        if (A == "edu_history") {
            ns.set(ctrl.id, "size", "large")
        }
        if (A == "emergency_contact") {
            ns.set(ctrl.id, "size", "large")
        }
        if (A == "parents_info") {
            ns.set(ctrl.id, "size", "large")
        }
        if (A == "nationality") {
            ns.set(ctrl.id, "size", "large")
        }
        if (A == "personalinfo") {
            ns.set(ctrl.id, "size", "large")
        }
        if (A == "simple_name") {
            ns.set(ctrl.id, "size", "small")
        }
        if (A == "percentage") {
            ns.set(ctrl.id, "size", "small")
        }
        display_control(ctrl);
        add_element_events(ctrl);
        display_save_button();
        init_dragdrop();
        update_pos("true");
        select_attribute(ctrl);
        boxHeight = document.getElementById("main").clientHeight;
    }
}

function initialize_control(A) {
    pos = create_id(A);
    ctrl = new field();
    ctrl.initialize(pos);
    ns.new_element(A, pos, ctrl, 0);
    return ctrl
}

function display_control_bak(A) {
    markup = A.display();
    markup.style.display = "none";

    $("#npf_form_all_elements").append(markup);
    if (navigator.userAgent.toUpperCase().indexOf('MSIE')) {
        $(markup).fadeIn("normal")
    } else {
        $(markup).show("normal")
    }
}

function display_control(A) {
    markup = A.display();
    markup.style.display = "none";

    var rownum = jQuery('.onerow').last().data('row');
    
    if(isNaN(rownum)){
        rownum = 1;
    }else{
        rownum = eval(parseInt(rownum)+1);
    }

    var item_pos_data = {'row':rownum,'col':1,'pos':1};
    var markupd = jQuery(markup).data('position',item_pos_data);

    var m_div   = jQuery('<div class="column" data-col="1"></div>').append(jQuery('<ul class="con"></div>').append(markupd));
    var htmldiv = jQuery('<div class="column" data-col="2"><ul class="con"></ul></div><div class="column" data-col="3"><ul class="con"></ul></div><div class="column" data-col="4"><ul class="con"></ul></div><div class="column" data-col="5"><ul class="con"></ul></div>');
    
    var clearfixdiv = jQuery('<div></div>').attr('class','clearfix onerow').append(m_div,htmldiv);

    jQuery('#npf_form_all_elements').append(jQuery(clearfixdiv).data({'row':rownum,'r_page_section':page_section_count}));

    // $( ".con" ).sortable({
    //     connectWith: ".con"
    // }).disableSelection();

    //$("#npf_form_all_elements").append(markup);
    if (navigator.userAgent.toUpperCase().indexOf('MSIE')) {
        $(markupd).fadeIn("normal")
    } else {
        $(markupd).show("normal")
    }

    jQuery('.con').sortable({
        connectWith: ".con",
        cursor: "move",
        remove: function( event, ui ) {

            // remove row when there is no any element
              
            jQuery('.onerow').each(function(){
                if(jQuery(this).find('li').length==0){
                    jQuery(this).remove();
                }
            });


        },
        update: function( event, ui ) {
            var i =0;
            var newrow = jQuery(this).closest('.onerow').data('row');
            var newcol = jQuery(this).closest('.column').data('col');

            //console.log('newrow 2:'+newrow);
            //console.log('newcol 2:'+newcol);
            
            jQuery(this).parent().find('.con li').each(function(){
                i++;
                var item_pos_data = {'row':newrow,'col':newcol,'pos':i};
                jQuery(this).data('position',item_pos_data);

            });
        }
    }).disableSelection();
}


function add_element_events(A) {
    $(A.li).click(function() {
        select_attribute(A)
    });
    $(A.li).mousedown(function() {
        A.li.style.cursor = "move"
    });
    $(A.li).mouseup(function() {
        A.li.style.cursor = "pointer"
    })
}

function display_save_button() {
    $("#div_button").removeClass("hide")
}

function create_id(A) {
//    ret = attribute_count;
//    attribute_count += 1;

    var last_id = jQuery('#npf_form_all_elements li' ).last().attr('id');
    //console.log('last_id: '+last_id);
    if (last_id != 'active_form') {
        var liIdArray = [];
        $( "#npf_form_all_elements li" ).each(function() {
            if (this.id != 'active_form') {
                var numericIdObj = this.id.split("_");
                liIdArray.push(parseInt(numericIdObj[1]));
            }
        });
        maxValueInArray = Math.max.apply(Math, liIdArray);
        ret = parseInt(maxValueInArray) + 1;
        attribute_count = ret;
    }
    else {
        ret = parseInt(attribute_count) + 1;
        //console.log('ret: '+ret);
    }
//    if (A == "address") {
//        attribute_count += 5
//    }
//    if (A == "guardians_info") {
//        attribute_count += 8
//    }
//    if (A == "language_fluency") {
//        attribute_count += 15
//    }
//    if (A == "work_experience") {
//        attribute_count += 15
//    }
//    if (A == "edu_history") {
//        attribute_count += 11
//    }
//    if (A == "emergency_contact") {
//        attribute_count += 9
//    }
//    if (A == "parents_info") {
//        attribute_count += 17
//    }
//    if (A == "nationality") {
//        attribute_count += 3
//    }
//    if (A == "personalinfo") {
//        attribute_count += 5
//    }
//    if (A == "simple_name") {
//        attribute_count += 3
//    }
//    if (A == "name") {
//        attribute_count += 3
//    }
//    if (A == "checkbox") {
//        attribute_count += 100
//    }
//    if (A == "multipleSelect") {
//        attribute_count += 100
//    }
//    if (A == "percentage") {
//        attribute_count += 3
//    }
    return ret
}

function select_attribute(A) {
    unselect_allfields();
    main_form.unselect();
    A.selected();
    active_element = A.id;
    $("#element_properties").css("margin-top", $(A.li).offset().top - 179 + "px");
    show_field_property();
    display_properties();
    current_offset = $(A.li).offset().top - 179;
    adjust_element_properties()
}

function adjust_element_properties() {
    $("#element_properties").css("margin-top", $(ns.get(active_element, "object").li).offset().top - 179 + "px")
}

function unselect_allfields() {
    jQuery.each(ns.data.elements, function(B, A) {
        A.object.unselect()
    });
    $("#attribute_inactive").css("display", "block");
    $("#attribute_position").css("display", "none");
    $("#all_properties").css("display", "none");
}

function display_properties() {
    display_npf_rightbar("element_properties");
    element_view = new element_properties(active_element);
    element_view.initialize(active_element);
    element_view.render()
}

function set_properties(B, A, C) {
    document.getElementById('save_status').value = 1;
    if (A == "columns") {
        ns.set_columns(active_element, B, C)
    } else if (A == "rows") {
        ns.set_rows(active_element, B, C)
    } else if (A == "choices") {
        ns.set_option(active_element, B, C)
    } else if (A == "declaration_prop") {
        ns.set_declaration(active_element, B, C)
    } else if (A == "documents_prop") {
        ns.set_documents(active_element, B, C)
    } else {
        ns.set(active_element, A, B)
    }
    live_preview[A](B)
}
live_preview = {
    title: function(A) {
        if ($("#title" + active_element).length) {
            $("#title" + active_element).html(A.replace(/\n/g, "<br/>"))
        }
        this.is_required(ns.get(active_element, "is_required"))
        this.is_numeric(ns.get(active_element, "is_numeric"))
        this.is_charecter(ns.get(active_element, "is_charecter"))
    },
    help: function(A) {
        if ($("#help" + active_element)) {
            $("#help" + active_element).html(A.replace(/\n/g, "<br/>"))
        }
    },
    type: function(A) {
        if (A != "date" && A != "europe_date" && A != "phone" && A != "simple_phone") {
            child_id = create_id(A);
            ns.set(active_element, "id", child_id);
            active_element = child_id;
            if (A == "name") {
                ns.set(active_element, "size", "small")
            }
            if (A == "simple_name") {
                ns.set(active_element, "size", "small")
            }
            if (A == "address") {
                ns.set(active_element, "size", "large")
            }
            if (A == "guardians_info") {
                ns.set(active_element, "size", "large")
            }
            if (A == "language_fluency") {
                ns.set(active_element, "size", "large")
            }
            if (A == "work_experience") {
                ns.set(active_element, "size", "large")
            }
            if (A == "edu_history") {
                ns.set(active_element, "size", "large")
            }
            if (A == "emergency_contact") {
                ns.set(active_element, "size", "large")
            }
            if (A == "parents_info") {
                ns.set(active_element, "size", "large")
            }
            if (A == "nationality") {
                ns.set(active_element, "size", "large")
            }
            if (A == "personalinfo") {
                ns.set(active_element, "size", "large")
            }
            if (A == "percentage") {
                ns.set(active_element, "size", "small")
            }
        }
        this.redraw();
        element_view.id = active_element;
        element_view.render()
    },
    size: function(A) {
        $("#field" + active_element).attr("class", "text " + ns.get(active_element, "type") + " " + A);
        this.redraw()
    },
    is_required: function(A) {
        if (A == "1") {
            $("#title" + active_element).html(ns.get(active_element, "title").replace(/\n/g, "<br/>"));
            var abcd = '<span class="req">*</span>';
            if (ns.get(active_element, "is_charecter") == "1") {
                abcd = '<span class="req">(Characters Only)</span>' + abcd;
            } else if (ns.get(active_element, "is_numeric") == "1") {
                abcd = '<span class="req">(Numeric Only)</span>' + abcd;
            }
            $("#title" + active_element).html($("#title" + active_element).html() + abcd);
        } else {
            $("#title" + active_element).html(ns.get(active_element, "title").replace(/\n/g, "<br/>"));
            var abcd = '';
            if (ns.get(active_element, "is_charecter") == "1") {
                abcd = '<span class="req">(Characters Only)</span>' + abcd;
            } else if (ns.get(active_element, "is_numeric") == "1") {
                abcd = '<span class="req">(Numeric Only)</span>' + abcd;
            }
            $("#title" + active_element).html($("#title" + active_element).html() + abcd);
        }
    },
    is_numeric: function(B) {
        if (B == "1") {
            $("#title" + active_element).html(ns.get(active_element, "title").replace(/\n/g, "<br/>"));
            var abcd = '<span class="req">(Numeric Only)</span>';
            if (ns.get(active_element, "is_required") == "1") {
                abcd = '<span class="req">*</span>' + abcd;
            }
            $("#title" + active_element).html($("#title" + active_element).html() + abcd);
        } else {
            $("#title" + active_element).html(ns.get(active_element, "title").replace(/\n/g, "<br/>"))
            var abcd = '';
            if (ns.get(active_element, "is_required") == "1") {
                abcd = '<span class="req">*</span>' + abcd;
            }
            if (ns.get(active_element, "is_numeric") == "1") {
                abcd = '<span class="req">(Numeric Only)</span>' + abcd;
            } else if (ns.get(active_element, "is_charecter") == "1") {
                abcd = '<span class="req">(Characters Only)</span>' + abcd;
            }
            $("#title" + active_element).html($("#title" + active_element).html() + abcd);
        }
    },
    is_charecter: function(C) {
        if (C == "1") {
            $("#title" + active_element).html(ns.get(active_element, "title").replace(/\n/g, "<br/>"));
            var abcd = '<span class="req">(Characters Only)</span>';
            if (ns.get(active_element, "is_required") == "1") {
                abcd = '<span class="req">*</span>' + abcd;
            }
            $("#title" + active_element).html($("#title" + active_element).html() + abcd);
        } else {
            $("#title" + active_element).html(ns.get(active_element, "title").replace(/\n/g, "<br/>"))
            var abcd = '';
            if (ns.get(active_element, "is_required") == "1") {
                abcd = '<span class="req">*</span>' + abcd;
            }
            if (ns.get(active_element, "is_charecter") == "1") {
                abcd = '<span class="req">(Characters Only)</span>' + abcd;
            } else if (ns.get(active_element, "is_numeric") == "1") {
                abcd = '<span class="req">(Numeric Only)</span>' + abcd;
            }
            $("#title" + active_element).html($("#title" + active_element).html() + abcd);
        }
    },
    choices: function() {
        this.redraw()
    },
    columns: function() {
        this.redraw()
    },
    rows: function() {
        this.redraw()
    },
    constraints: function() {
        this.redraw()
    },
    declaration_prop: function() {
        this.redraw()
    },
    documents_prop: function() {
        this.redraw()
    },
    default_value: function() {},
    redraw: function() {
        ns.get(active_element, "object").li.innerHTML = "";
        ns.get(active_element, "object").li.id = "li_" + active_element;
        ns.get(active_element, "object").id = active_element;
        ns.get(active_element, "object").generate_markup();
        ns.get(active_element, "object").selected()
    }
};

function insert_choice(A) {
    document.getElementById('save_status').value = 1;
    ns.get(active_element, "options").splice(A, 0, {
        option: "",
        is_default: "0",
        is_db_live: "0",
        id: "0"
    });
    element_view.choices();
    set_properties("", "choices", A);
    if ($("#choice" + (A)).length) {
        $("#choice" + A).focus()
    }
}

function insert_column(A) {
    if (ns.get(active_element, "columns").length >= 7) {
        alert("You cannot add more than 7 columns.");
        return false;
    }
    document.getElementById('save_status').value = 1;
    ns.get(active_element, "columns").splice(A, 0, {
        option: "",
        is_db_live: "0",
        id: "0"
    });
    element_view.columns();
    set_properties("", "columns", A);
    if ($("#choice" + (A)).length) {
        $("#choice" + A).focus()
    }
}

function insert_row(A) {
    document.getElementById('save_status').value = 1;
    ns.get(active_element, "rows").splice(A, 0, {
        option: "",
        is_db_live: "0",
        id: "0"
    });
    element_view.rows();
    set_properties("", "rows", A);
    if ($("#choice" + (A)).length) {
        $("#choice" + A).focus()
    }
}

function delete_choice(A) {
    if (A == 0 && ns.get(active_element, "options").length == 1) {
        alert("You cannot delete all choices.");
        return false
    } else {
        ns.get(active_element, "options").splice(A, 1)
    }
    element_view.choices();
    live_preview.choices();
    if ($("#choice" + (A - 1)).length) {
        $("#choice" + (A - 1)).focus()
    } else {
        $("#choice" + (A)).focus()
    }
}

function delete_tab_column(A) {
    if (A == 0 && ns.get(active_element, "columns").length == 1) {
        alert("You cannot delete all columns.");
        return false
    } else {
        ns.get(active_element, "columns").splice(A, 1)
    }
    element_view.columns();
    live_preview.columns();
    if ($("#choice" + (A - 1)).length) {
        $("#choice" + (A - 1)).focus()
    } else {
        $("#choice" + (A)).focus()
    }
}

function delete_tab_row(A) {
    if (A == 0 && ns.get(active_element, "rows").length == 1) {
        alert("You cannot delete all rows.");
        return false
    } else {
        ns.get(active_element, "rows").splice(A, 1)
    }
    element_view.rows();
    live_preview.rows();
    if ($("#choice" + (A - 1)).length) {
        $("#choice" + (A - 1)).focus()
    } else {
        $("#choice" + (A)).focus()
    }
}

function delete_checkbox(c, d, e, f) {
    if (e == "checkbox" && ns.get(active_element, "options").length == 1) {
        alert("You cannot delete all choices.");
        return false
    }
    if ((e == "checkbox" && d == 1) || (e == "multipleSelect" && d == 1)) {
        confirmed = confirm("All data associated with this choice will be deleted. Are you sure you want to delete this choice?")
    } else {
        confirmed = true
    }
    if (confirmed) {
        if ((d == 1 && e == "checkbox") || (d == 1 && e == "multipleSelect")) {
            $("#statusText_field").html("Deleting... Please Wait...");
            
            $.ajax({
               url: '/form/optionAttrDelete',
               type: "POST",
               headers: { 'X-CSRF-TOKEN' : jsVars.csrfToken },
               cache: false,
               dataType: 'json',
               data: {form_id: json_form.id, attribute_id: active_element, option_id: c, current_user_id: jsVars.currentUserId},
               success: function (data) {
                   if (data.status === true) {
                       delete_choice(f)
                   }
                   else {
                       alert("An error occured while deleting your field!")
                   }
               }
           });
            
//            $.post("delete_attribute_option.php", {
//                form_id: json_form.id,
//                attribute_id: active_element,
//                option_id: c
//            }, function(a) {
//                var b = eval("(" + a + ")");
//                if (b.status == "ok") {
//                    delete_choice(f)
//                } else {
//                    alert("An error occured while deleting your field!")
//                }
//            })
        } else {
            delete_choice(f)
        }
    }
}

function delete_column(c, d, e, f) {
    if (e == "matrix" && ns.get(active_element, "columns").length == 1) {
        alert("You cannot delete all columns.");
        return false
    }
    if ((e == "matrix" && d == 1)) {
        confirmed = confirm("All data associated with this matrix columns will be deleted. Are you sure you want to delete this column?")
    } else {
        confirmed = true
    }
    if (confirmed) {
        if ((d == 1 && e == "matrix")) {
            $("#statusText_field").html("Deleting... Please Wait...");
            $.ajax({
               url: '/form/columnAttrDel',
               type: "POST",
               headers: { 'X-CSRF-TOKEN' : jsVars.csrfToken },
               cache: false,
               dataType: 'json',
               data: {form_id: json_form.id, attribute_id: active_element, column_id: c, current_user_id: jsVars.currentUserId},
               success: function (data) {
                   if (data.status === true) {
                       delete_tab_column(f)
                   }
                   else {
                       alert("An error occured while deleting your column!")
                   }
               }
           });
        } else {
            delete_tab_column(f)
        }
    }
}

function delete_row(c, d, e, f) {
    if (e == "matrix" && ns.get(active_element, "rows").length == 1) {
        alert("You cannot delete all rows.");
        return false
    }
    if ((e == "matrix" && d == 1)) {
        confirmed = confirm("All data associated with this matrix rows will be deleted. Are you sure you want to delete this row?")
    } else {
        confirmed = true
    }
    if (confirmed) {
        if ((d == 1 && e == "matrix")) {
            $("#statusText_field").html("Deleting... Please Wait...");
            $.ajax({
                url: '/form/rowAttrDel',
                type: "POST",
                headers: { 'X-CSRF-TOKEN' : jsVars.csrfToken },
                cache: false,
                dataType: 'json',
                data: {form_id: json_form.id, attribute_id: active_element, row_id: c, current_user_id: jsVars.currentUserId},
                success: function (data) {
                    if (data.status === true) {
                        delete_tab_row(f);
                    }
                    else {
                        alert("An error occured while deleting your row!")
                    }
                }
            });
        } else {
            delete_tab_row(f)
        }
    }
}

function set_choice_default(A) {
    ns.set_default_option(A, active_element);
    element_view.choices();
    ns.get(active_element, "object").li.innerHTML = "";
    ns.get(active_element, "object").generate_markup();
    ns.get(active_element, "object").selected()
}

function activate_form() {
    unselect_allfields();
    main_form.selected();
    display_form_properties()
}

function update_form(B, A) {
    if (B.replace) {
        B = B.replace(/\\\"/g, '\\ "')
    }
    main_form.data[A] = B;
    if (form_updates[A]) {
        form_updates[A](B)
    }
}
form_updates = {
    name: function(A) {
        $("#form_name").html(A)
    },
    instruction1: function(A) {
        $("#form_inst1").html(A)
    },
    instruction2: function(A) {
        $("#form_inst2").html(A)
    },
    instruction3: function(A) {
        $("#form_inst3").html(A)
    },
    instruction4: function(A) {
        $("#form_inst4").html(A)
    },
    street_adr: function(A) {
        $("#form_street_adr").html(A)
    },
    city_adr: function(A) {
        $("#form_city_adr").html(A)
    },
    region_adr: function(A) {
        $("#form_region_adr").html(A)
    },
    postal_code_adr: function(A) {
        $("#form_postal_code_adr").html(A)
    },
    country_adr: function(A) {
        $("#form_country_adr").html(A)
    },
    phone_adr: function(A) {
        $("#form_phone_adr").html(A)
    },
    email_adr: function(A) {
        $("#form_email_adr").html(A)
    },
    website_adr: function(A) {
        $("#form_website_adr").html(A)
    }
};

function display_fields(A) {
    unselect_allfields();
    main_form.unselect();
    if (navigator.userAgent.toUpperCase().indexOf('MSIE')) {
        if (A != 0) {
            $("#add_elements").css("margin-top", current_offset - 10)
        } else {
            $("#add_elements").css("margin-top", 0)
        }
    }
    display_npf_rightbar("add_elements");
    $("#tabs").attr("class", "add_field_tab")
}

function display_field_properties() {
    if (ns.data.elements.length == 0) {
        $("#nofields").css("display", "block");
        unselect_allfields();
        $("#div_button").addClass("hide");
        main_form.unselect()
    } else {
        if (!active_element) {
            active_element = ns.get_element(0, "id");
            $("#attribute_inactive").css("display", "block");
            $("#attribute_position").css("display", "none");
            $("#all_properties").css("display", "none")
        }
    }
    display_npf_rightbar("element_properties");
    show_field_property()
}

function display_form_properties() {
    unselect_allfields();
    main_form.selected();
    display_npf_rightbar("form_properties");
    prepare_form_property_values();
    show_form_property()
}

function display_npf_rightbar(A) {
    hide_npf_rightbar();
    switch_display(A, "block")
}

function hide_npf_rightbar() {
    switch_display("add_elements", "none");
    switch_display("element_properties", "none");
    switch_display("add_elements_button", "none")
}

function switch_display(A, B) {
    $("#" + A).css("display", B);
    if (A == "element_properties") {
        $("#add_elements_button").css("display", B)
    }
}

function delete_attribute(A) {
    if (ns.get(A, "is_db_live") == "1") {
        confirmed = confirm("All data associated with this field will be deleted. Are you sure you want to delete this field?")
    } else {
        confirmed = true
    }
    if (confirmed) {
        var A = ns.get(A, "id");
        delete_from_db(A)
    }
}

function delete_from_db(c) {
    if (ns.get(c, "is_db_live") == "1") {
        $("#statusText_field").html("Deleting ... Please wait ...");
        
        $.ajax({
            url: '/form/attrDelete',
            type: "POST",
            headers: { 'X-CSRF-TOKEN' : jsVars.csrfToken },
            cache: false,
            dataType: 'json',
            data: {form_id: json_form.id, attribute_id: c, current_user_id: jsVars.currentUserId},
            success: function (data) {
                if (data.status === true) {
                    delete_attribute_markup(c);
                }
                else {
                    alert("An error occured while deleting your field!")
                }
            }
        });
    } else {
        delete_attribute_markup(c)
    }
}

function delete_attribute_markup(A) {
    if (ns.get(A, "type") == 'fileUpload') {
        file_upload_total = file_upload_total - 1;
    }
    $(ns.get(A, "object").li).fadeOut("normal", function() {
        $(ns.get(A, "object").li).remove();
        ns.remove_element(A);
        update_pos("true");
        active_element = "";
        if ($("#element_properties").attr("display") == "block") {
            display_field_properties()
        }
        if (ns.data.elements.length == 0) {
            display_fields(true);
            $("#attribute_inactive").css("display", "none");
            $("#div_button").addClass("hide");
            $("#attribute_inactive").css("display", "block");
        }
    })
}

function duplicate_attribute(A) {
    field_type = ns.get(A, "type");
    ctrl = initialize_control(field_type);
    copy_values(ctrl, A);
    display_duplicate(ctrl, A);
    add_element_events(ctrl);
    display_save_button();
    init_dragdrop();
    update_pos("true")
}

function copy_values(C, E) {
    for (var A = 0; A < ns.data.elements.length; A++) {
        var D = ns.data.elements[A];
        if (E == D.id) {
            jQuery.each(ns.data.elements[A], function(G, H) {
                if (G != "id" && G != "object" && G != "is_db_live") {
                    if (G == "options") {
                        opts = [];
                        for (var F = 0; F < H.length; F++) {
                            opts.push(clone(H[F]))
                        }
                    } else {
                        opts = H
                    }
                    ns.set(C.id, G, opts)
                }
            });
            break
        }
    }
    next_val = ns.get(C.id, "options");
    for (var B = 0; B < next_val.length; B++) {
        next_val[B].is_db_live = "0";
        next_val[B].id = "0"
    }
}

function clone(C) {
    if (typeof(C) != "object") {
        return C
    }
    if (C == null) {
        return C
    }
    var B = new Object();
    for (var A in C) {
        B[A] = clone(C[A])
    }
    return B
}

function display_duplicate(A, B) {
    markup = A.display();
    markup.style.display = "none";
    document.getElementById("npf_form_all_elements").insertBefore(markup, document.getElementById("li_" + B).nextSibling);
    $(markup).show("normal")
}

function init_dragdrop() {

}

function update_pos(A) {
    jQuery.each(ns.data.elements, function(C, B) {
        B.position = get_prev_siblings(B.object.li)
    });
    if (A != "true") {
        $("#attribute_position").html(parseInt(ns.get(active_element, "position")) + 1)
    }
}

function get_prev_siblings(A) {
    var B = 0;
    while (A.previousSibling && A.previousSibling.className && $(A.previousSibling).hasClass("drag")) {
        A = A.previousSibling;
        B++
    }
    return B
}

function columns_event(A, B) {
    if (A.keyCode == 13) {
        insert_column(B + 1)
    }
}

function rows_event(A, B) {
    if (A.keyCode == 13) {
        insert_row(B + 1)
    }
}

function choices_event(A, B) {
    if (A.keyCode == 13) {
        insert_choice(B + 1)
    }
}

function show_field_property() {
    $("#tabs").attr("class", "field_prop_tab")
}

function show_form_property() {
    $("#tabs").attr("class", "form_prop_tab")
}

function save_form_data() {
    update_form(document.getElementById('form_id').value, "id");
    update_form(document.getElementById('form_title').value, "name");
    update_form(document.getElementById('form_inst1').value, "instruction1");
    update_form(document.getElementById('form_inst2').value, "instruction2");
    update_form(document.getElementById('form_inst3').value, "instruction3");
    update_form(document.getElementById('form_inst4').value, "instruction4");
    update_form(document.getElementById('form_street_adr').value, "street_adr");
    update_form(document.getElementById('form_city_adr').value, "city_adr");
    update_form(document.getElementById('form_region_adr').value, "region_adr");
    update_form(document.getElementById('form_postal_code_adr').value, "postal_code_adr");
    update_form(document.getElementById('form_country_adr').value, "country_adr");
    update_form(document.getElementById('form_phone_adr').value, "phone_adr");
    update_form(document.getElementById('form_email_adr').value, "email_adr");
    update_form(document.getElementById('form_website_adr').value, "website_adr");
    update_form(document.getElementById('form_startRange').value, "startRange");
    update_form(document.getElementById('form_prefix').value, "prefix");
    update_form(1, "captcha");
    update_form(1, "unique_ip");
    update_form(1, "review");
    $("#statusText_field").html("Saving ... Please wait ...");
    $.post("save_npf_formdetails.php", {
        form: JSON.stringify(main_form.data)
    }, function(A) {
        var abc_var = eval("(" + A + ")");
        if (abc_var.status == "ok") {
            //console.log('1');
//            window.location.replace("npf_form_fields.php?formId=" + abc_var.message);
            return false;
        } else {
            if (abc_var.message) {
                window.location.replace("npf_form_properties.php?formId=" + abc_var.message);
            } else {
                window.location.replace("npf_form_properties.php");
            }
            return false;
        }
        return true;
    })
}

function save_form_attribute_data(formId, save_ext_status, csrfToken) {
    if (ns.get(active_element, "columns").length > 7) {
        alert("You cannot add more than 7 columns.");
        return false
    }
    //console.log(ns.stringify());

    // edit by saurabh
    
    var form_data = getElemPosition();
        
     //console.log(form_data);
     //return false;

    $("#div_button").html("");
    $("#x").html("Saving ... Please wait ...");
    main_form.data.frame_height = $("#main").outerHeight();
    $.ajax({
        url: '/form/preview',
        type: "POST",
        headers: { 'X-CSRF-TOKEN' : csrfToken },
        cache: false,
        dataType: 'json',
        data: {form_id: formId, form: main_form.data.frame_height, save_exit: save_ext_status, attributes:ns.stringify(),elem_position:form_data},
        success: function (data) {
           if (data.status == true) {
               alert('Form Attributes Saved.');
               return false;
           }
           
//           if (abc.status == "ok" && abc.saveExit == "one") {
//            window.location.replace("npf_preview_form.php?formId=" + abc.message);
//            return false;
//            } else if (abc.status == "ok" && abc.saveExit == "zero") {
//                window.location.replace("fm_forms.php");
//                return false;
//            } else if (abc.status == "session error") {
//                alert(abc.message);
//                window.location.replace("index.php?log=t");
//                return false;
//            } else {
//                console.log('2');
//    //            window.location.replace("npf_form_fields.php?formId=" + abc.message);
//                return false;
//            }
        }
    });
    return false;
}

function populate_form() {
    var A = json_form;
    update_form(A.id, "id");
    update_form(A.name, "name");
    update_form(A.instruction1, "instruction1");
    update_form(A.instruction2, "instruction2");
    update_form(A.instruction3, "instruction3");
    update_form(A.instruction4, "instruction4");
    update_form(A.street_adr, "street_adr");
    update_form(A.city_adr, "city_adr");
    update_form(A.region_adr, "region_adr");
    update_form(A.postal_code_adr, "postal_code_adr");
    update_form(A.country_adr, "country_adr");
    update_form(A.phone_adr, "phone_adr");
    update_form(A.email_adr, "email_adr");
    update_form(A.website_adr, "website_adr");
    update_form(A.startRange, "startRange");
    update_form(A.unique_ip, "unique_ip");
    update_form(A.captcha, "captcha");
    update_form(A.review, "review")
}

function populate_fields() {
    var A = 50;
    var B = jsVars.json_elements;
    $(B.elements).each(function(C) {
        num = this;
        //console.log('num.id :'+ num.id);
        ctrl = new field();
        ctrl.initialize(num.id);
        ns.new_element(num.type, num.id, ctrl, num.is_db_live);
        newMax = parseInt(num.id);
        if (num.type == "address") {
            newMax += 5
        }
        if (num.type == "guardians_info") {
            newMax += 8
        }
        if (num.type == "language_fluency") {
            newMax += 15
        }
        if (num.type == "work_experience") {
            newMax += 15
        }
        if (num.type == "edu_history") {
            newMax += 11
        }
        if (num.type == "emergency_contact") {
            newMax += 9
        }
        if (num.type == "parents_info") {
            newMax += 17
        }
        if (num.type == "nationality") {
            newMax += 4
        }
        if (num.type == "personalinfo") {
            newMax += 5
        }
        if (num.type == "name") {
            newMax += 3
        }
        if (num.type == "percentage") {
            newMax += 3
        }
        if (num.type == "simple_name") {
            newMax += 1
        }
        if (num.type == "checkbox") {
            newMax += 100
        }
        if (num.type == "multipleSelect") {
            newMax += 100
        }
        if (num.type == "matrix") {
            newMax += 100
        }
        update_attribute_count(newMax);
        jQuery.each(num, function(D, E) {
            if ((typeof E === 'string' || E instanceof String) && E.replace) {
                next_val = E.replace(/\<br \/\>/g, "\n")
            } else {
                next_val = E
            }
            ns.set(ctrl.id, D, next_val)
        });
        markup = ctrl.display();
        // saurabh
        
        //console.log('elem_id:'+jQuery(markup).attr('id'));

        var p_row = num.position[0];
        var p_col = num.position[1];
        var p_pos = num.position[2];
        var p_sec = num.page_section;



        position_element(p_row,p_col,p_pos,p_sec,markup);

        
        add_element_events(ctrl);
        update_pos("true");
        A += 50
    });
    init_dragdrop();
    sort_form_elem_render();
}

/**
 * display form element to position
 */

function position_element(r,c,p,p_sec,markup){

    var rowfound = false;
    var item_pos_data = {'row':r,'col':c,'pos':p};
    var markupd = jQuery(markup).data('position',item_pos_data);

    var temp_sec = 0;
    //console.log(jQuery(markupd).data('position'));
    //jQuery('#npf_form_all_elements').append(markupd);
    
    //markupd = jQuery(markupd).data('sort_pos',p);
    //console.log(item_pos_data);
    //$("#npf_form_all_elements").append(markup);

    //check if row is available
    if(jQuery('.onerow').length>0){
        // iterate all row for check desire row
        jQuery('.onerow').each(function(){
            if(r==jQuery(this).data('row')){
                rowfound = true;
                // iterate column for insert element
                jQuery(this).find('.column').each(function(){
                    if(c==jQuery(this).data('col')){
                        jQuery(this).find('ul.con').append(markupd);
                    }
                });
            }
        });

    }
        var colelem = '';

        if(rowfound==false){

            var clearfixdiv = jQuery('<div></div>').attr({'class':'clearfix onerow','id':'row'+r});
            jQuery('#npf_form_all_elements').append(jQuery(clearfixdiv).data({'row':r,'r_page_section':p_sec}));

            //jQuery('#npf_form_all_elements');

            for(var i=1;i<=5;i++){

                if(c==i){
                    var elm_ul = jQuery('<ul></ul>').attr('class','con').append(markupd); 
                    var colem = jQuery('<div></div>').attr('class','column').data('col',i).append(elm_ul);
                    jQuery('#row'+r).append(colem);
                    //colelem+='<div class="column" data-col="'+i+'"><ul class="con">'+jQuery(markupd).html()+'</ul></div>';
                }else{
                    var elm_ul = jQuery('<ul></ul>').attr('class','con');
                    var colem = jQuery('<div></div>').attr('class','column').data('col',i).append(elm_ul);
                    jQuery('#row'+r).append(colem);
                    
                    //colelem+='<div class="column" data-col="'+i+'"><ul class="con"></ul></div>';
                }
            }

            //var clearfixdiv = jQuery('<div></div>').attr('class','clearfix onerow').append(colelem);
            //jQuery('#npf_form_all_elements').append(jQuery(clearfixdiv).data('row',r));
        }

        //     // sort column list wise
            // jQuery('.onerow').each(function(){
                
            //     jQuery(this).find('.column ul').each(function(){

            //         if(jQuery(this).find('li').length>0){
            //             var ul = jQuery(this);
            //             console.log(ul.find('li').length);

            //             ul.find('li').sort(function (a, b){
            //                 return +jQuery(a).data('sort_pos') - +jQuery(b).data('sort_pos'); 


            //             }).appendTo( ul);
            //         }

                  

            //     });
            // });
            
    
        //var rownum = jQuery('.onerow').last().data('row');
    
}

function sort_form_elem_render(){
    

    // jQuery('#npf_form_all_elements .column').each(function(){

    //     var column1 = jQuery(this);
    //     column1.find('li').sort(function(a,b){

    //         console.log(jQuery(a).data('position'));
    //     });
    // });
    
    // sort column row wise
    jQuery('.column ul').each(function(){
        var column1 = jQuery(this);
        //console.log(jQuery(column1))
         column1.find('li').sort(function (a, b) {
             var rpc_a = jQuery(a).data('position');
             var rpc_b = jQuery(b).data('position');
             //console.log(rpc.pos);
             return +rpc_a.pos - +rpc_b.pos;
         })
         .appendTo( column1 );
    });


    // sort column row wise
    jQuery('.onerow').each(function(){
        var onerow = jQuery(this);
        onerow.find('.column').sort(function (a, b) {
            return +jQuery(a).data('col') - +jQuery(b).data('col');
        })
        .appendTo( onerow );
    });


    // sort row ascending order
    var wrapper = jQuery('#npf_form_all_elements');
        wrapper.find('.onerow').sort(function (a, b) {
        return +jQuery(a).data('row') - +jQuery(b).data('row');
        })
    .appendTo( wrapper );


        wrapper.find('.onerow').each(function(){
            var p_sec = jQuery(this).data('r_page_section');

            if(jQuery("#p_sec"+p_sec).length>0){
                //console.log('found '+p_sec);                
                var section_element ='';
            }else{
                //console.log(' not found '+p_sec);

                var section_element = jQuery('<div></div>').attr('class','border-top').attr('id','p_sec'+p_sec).html('<span>section '+p_sec+'</span> <a href="#" class="remove_section" id="remove_'+p_sec+'" data-p_sec="'+p_sec+'">remove</a>');
            }

            jQuery(this).prepend(section_element);
        });
            // display page section mark
            



}


function update_attribute_count(A) {
    if (A >= attribute_count) {
        attribute_count = parseInt(A) + 1
    }
    display_save_button()
}


//////////

var stateCondradio = '<option>Please select a field state</option><option value="equals">Is Equal To</option><option value="notEquals">Is Not Equal To</option>';
var stateCondtext = '<option>Please select a field state</option><option value="equals">Is Equal To</option><option value="notEquals">Is Not Equal To</option>';
var doCondOptions = '<option>Please select condition action</option><option value="Hide">Hide</option><option value="Show">Show</option><option value="HideMultiple">Hide multiple</option><option value="ShowMultiple">Show multiple</option>';

function conditionalLogic(A) {
    if (ns.get(A, "is_db_live") == "1") {
        confirmed = confirm("This will add conditional logic, Make sure you assign proper conditions?")
    } else {
        confirmed = true
    }
    if (confirmed) {
        var A = ns.get(A, "id");
        openConditionalPopup(A);
    }
}

function openConditionalPopup(A) {
    var dialogHtml = prepareShowHideHtml(A);
    $("#dialog").html(dialogHtml);
    
    $( "#dialog" ).dialog({
        position: { my: "left top", at: "left bottom", of: window },
        draggable: false
    });
    $( "#conditionSaveBtn" ).click(function() {
      conditionSaveBtn(null); //save mode
    });
}

function formConditionGet(A) {
    $.ajax({
        type:"POST",
        url:"existing_condition_get.php",
        data: { html_id: A, form_id: json_form.id },
        cache: false,
        async : false,
        dataType: 'json',
            success: function (result) {
                ccc = result;
            }
    });
    return ccc;
}
function prepareShowHideHtml(A) {
    var viewMode = '';
    var result = formConditionGet(A);
//    var resultObj = JSON.parse(result);
    if (result.status == true) {
        viewMode = '<div><a href="javascript:void(0);" onclick="condView('+A+', '+json_form.id+');">View Existing Conditions</a></div>';
    }
    var ifOptions = '<option>Please select a field.</option>';
    $( "#npf_form_all_elements li" ).each(function() {
        if (this.id != 'active_form') {
            var numericIdObj = this.id.split("_");
            var id = numericIdObj[1];
            var fieldTitle = $('#title'+id).html();
            var fieldType = $.trim($('#'+this.id+' :input').attr( "type" ));
            
            if (fieldType == 'radio') {
                ifOptions = ifOptions + '<option id="'+fieldType+'|'+this.id+'">'+this.id+' | '+fieldTitle+'</option>';
            }
        }
    });
    //$('#li_4 :input').attr( "type" )
   var dialogHtml = viewMode + "<div><div><h2>SHOW / HIDE FIELD</h2><span>Change visibility of field(s) depending on `IF` State conditions.</span></div>\n\
<div><h3>IF</h3><div>\n\
<select id='ifCond' onchange='fillStateOptions(this);'>"+ifOptions+"</select></div><h3>STATE</h3><div>\n\
<select id='stateCond' onchange='fillValueOptions(this);' disabled=''><option>Please select a field state.</option></select></div><h3>VALUE</h3><div>\n\
<select id='valueCond' onchange='fillDoOptions(this);' disabled=''><option>Please select.</option></select></div></div><div><h3>DO</h3><div>\n\
<select id='doCond' onchange='fillFieldOptions(this);' disabled=''><option>Please select condition action.</option></select></div><h3>FIELD</h3><div>\n\
<select id='fieldCond' disabled=''><option>Please select a field.</option></select></div></div>\n\
<div><a href='javascript:void(0);' id='conditionSaveBtn'>Save</a></div>";
   return dialogHtml;
}

function condView(A, form_id) {
    $( "#dialog" ).dialog( "close" );
    var condViewHtml = formElementCondHTML(A, form_id);
    $("#dialog").html(condViewHtml);
    $( "#dialog" ).dialog({
        position: { my: "left top", at: "left bottom", of: window },
        draggable: false
    });
}

function formElementCondHTML(A) {
    var condHtml = '';
    result = formConditionGet(A);
    if (result.status == true) {
        var data = result.data;
        $.each(eval(data), function( key, item ) {
            condHtml = condHtml +'<span> If => '+item.if + ' State => '+item.state + ' Value => '+item.value + ' Do => '+item.do + ' Field => '+item.field +'</span>';
            condHtml = condHtml + "<span><a href='javascript:void(0);' onclick='editCond("+A+", "+json_form.id+", "+key+");'>Edit</a>/\n\
<a href='javascript:void(0);' onclick='delCond("+A+", "+json_form.id+", "+key+");'>Delete</a></span>";
      });
    }
    else {
        condHtml = "<span>This element don't have any conditional logic. <a href='javascript:void(0);' onclick='openConditionalPopup("+A+");'>Click Here</a> to add.</span>";
    }
    return "<div><span>"+condHtml+"</span></div>";
}

function editCond(A, form_id, index) {
    result = formConditionGet(A);
    if (result.status == true) {
        var data = result.data;
        $.each(eval(data), function( key, item ) {
            if (key == index) {
                fieldTitle = $('#title'+A).html();
                fieldType = $.trim($('#li_'+A+' :input').attr( "type" ));
                ifOptions = '<option id="'+fieldType+'|li_'+A+'">li_'+A+' | '+fieldTitle+'</option>';
                dialogHtml = "<div><div><h2>SHOW / HIDE FIELD</h2><span>Change visibility of field(s) depending on `IF` State conditions.</span></div>\n\
<div><h3>IF</h3><div>\n\
<select id='ifCond' disabled=''>"+ifOptions+"</select></div><h3>STATE</h3><div>\n\
<select id='stateCond' onchange='fillValueOptions(this);'><option>Please select a field state.</option></select></div><h3>VALUE</h3><div>\n\
<select id='valueCond' onchange='fillDoOptions(this);'><option>Please select.</option></select></div></div><div><h3>DO</h3><div>\n\
<select id='doCond' onchange='fillFieldOptions(this);'><option>Please select condition action.</option></select></div><h3>FIELD</h3><div>\n\
<select id='fieldCond' disabled=''><option>Please select a field.</option></select></div></div>\n\
<div><a href='javascript:void(0);' id='conditionSaveBtn'>Save</a></div>";
                
                $("#dialog").html(dialogHtml);
                fillStateOptions(fieldType+'|li_'+A);
                $("#stateCond").val(item.state);
                fillValueOptions(item.state);
                $("#valueCond").val(item.value);
                fillDoOptions();
                $("#doCond").val(item.do);
                fillFieldOptions();
                var n = item.field.indexOf("@");
                if (n > 0) {
                  var multi = [];
                  var myArray = item.field.split('@');
                  for(var i=0;i<myArray.length;i++){
                      fieldFieldType = $.trim($('#'+myArray[i]+' :input').attr( "type" ));
                      multi.push(fieldFieldType+'|'+myArray[i]);
                      
                  }
                  $('#fieldCond').val(multi);
                }
                else {
                  fieldFieldType = $.trim($('#'+item.field+' :input').attr( "type" ));
                  $("#fieldCond").val(fieldFieldType+'|'+item.field);
                }
            }
        });
    }
    
    $( "#dialog" ).dialog({
        position: { my: "left top", at: "left bottom", of: window },
        draggable: false
    });
    $( "#conditionSaveBtn" ).click(function() {
      conditionSaveBtn(index); //edit mode
    });
//    openConditionalPopup(A);
}

function delCond(A, form_id, index) {
    $.ajax({
        type:"POST",
        url:"existing_condition_del.php",
        data: { html_id: A, form_id: form_id, index: index },
        cache: false,
        async : false,
        dataType: 'json',
            success: function (result) {
                if (result.status == true) {
                    $( "#dialog" ).dialog( "close" );
                    var condViewHtml = formElementCondHTML(A, form_id);
                    $("#dialog").html(condViewHtml);
                    $( "#dialog" ).dialog({
                        position: { my: "left top", at: "left bottom", of: window },
                        draggable: false
                    });
                }
            }
    });
}

function fillStateOptions(obj) {
    var ifCondVal = $('#ifCond').children(":selected").attr("id");
    var ifCondValTypeObj = ifCondVal.split("|");
    var ifCondValType = ifCondValTypeObj[0];
    
    $("#stateCond").prop("disabled", false);
    switch(ifCondValType) {
        case 'radio':
            $('#stateCond').html(stateCondradio);
            break;
        case 'text':
            $('#stateCond').html(stateCondtext);
            break;
        default:
            $('#stateCond').html(stateCondradio);
    }
}

function fillValueOptions(obj) {
    var ifCondVal = $('#ifCond').children(":selected").attr("id");
    var ifCondValTypeObj = ifCondVal.split("|");
    var ifCondSelectedId = ifCondValTypeObj[1];
    var ifCondValType = ifCondValTypeObj[0];
    
    var ifCondSelectedIdObj = ifCondSelectedId.split("_");
    var elementId = ifCondSelectedIdObj[1];
    
    $("#valueCond").prop("disabled", false);
    switch(ifCondValType) {
        case 'radio':
            valueOptions = '<option>Please select.</option>';
            var optionId = 1;
            $( "#field"+elementId+" > label" ).each(function() {
                    var labelVal = $(this).html();
                    valueOptions = valueOptions + '<option value='+ optionId +' id='+ optionId +'>'+labelVal+'</option>';
                    optionId = parseInt(optionId) + 1;
            });
            $( "#valueCond" ).html(valueOptions);
            break;
        case 'text':
            $('#stateCond').html(stateCondtext);
            break;
        default:
            $('#stateCond').html(stateCondradio);
    }
}

function fillDoOptions(obj) {
    //DoCondOptions
    $("#doCond").prop("disabled", false);
    $('#doCond').html(doCondOptions);
}


function fillFieldOptions(obj) {
    var fieldOptions = '<option>Please select a field.</option>';
    var ifCondVal = $('#ifCond').children(":selected").attr("id");
    var ifCondValTypeObj = ifCondVal.split("|");
    var ifCondSelectedId = ifCondValTypeObj[1];
    
    $( "#npf_form_all_elements li" ).each(function() {
        if (this.id != 'active_form' && this.id != ifCondSelectedId) {
            var numericIdObj = this.id.split("_");
            var id = numericIdObj[1];
            var fieldTitle = $('#title'+id).html();
            var fieldType = $('#'+this.id+' :input').attr( "type" )
            fieldOptions = fieldOptions + '<option value="'+fieldType+'|'+this.id+'" id="'+fieldType+'|'+this.id+'">'+this.id+' | '+fieldTitle+'</option>';
        }
    });
    var doType = $('#doCond').children(":selected").attr("value");
    if (doType == 'HideMultiple' || doType == 'ShowMultiple') { 
        $("#fieldCond").attr('multiple', true);
    }
    else {
        $("#fieldCond").attr('multiple', false);
    }
    $("#fieldCond").prop("disabled", false);
    $('#fieldCond').html(fieldOptions);
}

function conditionSaveBtn(index) {
    var condJson = '';
    var ifCondVal = $('#ifCond').children(":selected").attr("id");
    var ifCondValTypeObj = ifCondVal.split("|");
    var ifCondSelectedType = ifCondValTypeObj[0];
    var ifCondSelectedId = ifCondValTypeObj[1];
    
    switch(ifCondSelectedType) {
        case 'radio':
            var cond = radioConditionMaker(ifCondSelectedId);
            break;
        case 'text':
            $('#stateCond').html(stateCondtext);
            break;
        default:
            $('#stateCond').html(stateCondradio);
    }

    $.post("save_form_condition.php", {
        form_id: json_form.id,
        condition: cond,
        index: index
    }, function(a) {
        var b = eval("(" + a + ")");
        if (b.status == "ok") {
            $( "#dialog" ).dialog( "close" );
            alert("Saved");
        } else {
            alert("An error occured while saving your conditions!")
        }
    })   
}

function radioConditionMaker(ifCondSelectedId) {
    var stateVal = $('#stateCond').children(":selected").attr("value");
    var valueVal = $('#valueCond').children(":selected").attr("id");
    var doVal = $('#doCond').children(":selected").attr("value");
    
    
    if (doVal == 'HideMultiple' || doVal == 'ShowMultiple') { 
        var fieldIdArray = [];
        $("#fieldCond :selected").each(function (i, sel) {
          var fieldCondValTypeObj = $(sel).text().split("|");
          fieldIdArray.push($.trim(fieldCondValTypeObj[0]));
          fieldCondSelectedId = fieldIdArray.join("@");
        });
    }
    else {
        var fieldCondVal = $('#fieldCond').children(":selected").attr("id");
        var fieldCondValTypeObj = fieldCondVal.split("|");
        var fieldCondSelectedId = fieldCondValTypeObj[1];
    }
    
    var ifCondSelectedFieldId = ifCondSelectedId.split('_')[1];
    
    var condition = [];
    final = {}; // '"a"'+':'+'"b"'
    condition.push({'if' : ifCondSelectedId,
    'state' : stateVal,
    'value' : valueVal,
    'do' : doVal,
    'field' : fieldCondSelectedId});
    final[ifCondSelectedFieldId] = condition;
    finalStr = JSON.stringify(final);
    return finalStr;
}


function getElemPosition(){
  var r =1;
  var p_sec;
  var elmPosData = [];
  // row iteration
  jQuery('#npf_form_all_elements .onerow').each(function(){
    p_sec = jQuery(this).data('r_page_section');
    // column iteration
    var c=1;
    jQuery(this).find('.column').each(function(){

    // check if column has form element
      if(jQuery(this).find('li').length>0){
        // iteration each element 
        jQuery(this).find('li').each(function(){
          var rpc = jQuery(this).data('position');  
          //console.log(rpc);
          var id_ar = this.id.split('_');
          var data_id = id_ar[1];
          //console.log(data_id+' :: (row = '+r+', column = '+c+', position = '+rpc.pos+')');
         
          var combined_data = {'id':data_id,'row':r,'col':c,'pos':rpc.pos,'p_sec':p_sec};
          elmPosData.push(combined_data);
          
        }); 
        c++;
      }
    });
    r++;        
  });
  return elmPosData;
}

// page section counter

jQuery(function(){

    // add section

    jQuery('#add_section').click(function(e){

        e.preventDefault();
        page_section_count+=1;

        jQuery('#npf_form_all_elements').append('<div class="border-top"><span>Section '+page_section_count+'</span>&nbsp; <a href="#"  onclick="return remove_section(this)" class="remove_section" data-p_sec="'+page_section_count+'">remove</a></div>');

        jQuery('.onerow').each(function(){

            //console.log('check row num : '+jQuery(this).data('row'));    
            //console.log('r_page_section : '+jQuery(this).data('r_page_section'));    

        });
        

    });

     jQuery('.remove_section').click(function(e){

        e.preventDefault();

        //alert("sdfasdfaaaaaaaaaaaaaaaaa");


        var confirmed =confirm("All data associated with this field will be deleted. Are you sure you want to delete this section?");
        if(confirmed){
            var id= jQuery(this).id;
            var p_sec = jQuery(this).data('p_sec');
            var deleteListIds=[];
            var db_deleteListIds=[];
            var deletestatus= false;

            jQuery('.onerow').each(function(){

                if(jQuery(this).data('r_page_section')==p_sec){
                    //console.log('secid : '+p_sec);

                    jQuery(this).find('li').each(function(){

                        var li_id = jQuery(this).attr('id');
                        var numericIdObj = li_id.split("_");
                        var elemid = parseInt(numericIdObj[1]);
                        deleteListIds.push(elemid);
                        
                        if(ns.get(elemid,"id") && (ns.get(elemid,"is_db_live")==1)) {                            
                            db_deleteListIds.push(elemid);
                        }
                    });
                }
            });

                    //console.log(deleteListIds);
                    //console.log(db_deleteListIds);

                    $("#statusText_field").html("Deleting ... Please wait ...");

                    $.ajax({
                        url: '/form/attrDeleteMultiple',
                        type: "POST",
                        headers: { 'X-CSRF-TOKEN' : jsVars.csrfToken },
                        cache: false,
                        dataType: 'json',
                        data: {form_id: json_form.id, attribute_ids: db_deleteListIds, current_user_id: jsVars.currentUserId},
                        success: function (data) {
                            if (data.status === true) {
                                deletestatus = true;
                            }
                            else {
                                alert("An error occured while deleting your field!")
                            }
                        }
                    });
            
            if(deleteListIds.length>0){
                jQuery.each(deleteListIds,function(index,value){
                    delete_attribute_markup(value);
                });

            }

            jQuery('.onerow').each(function(){

                if(jQuery(this).data('r_page_section')==p_sec){
                    jQuery(this).remove();
                }
            });


             // Reorder section and its elements
            jQuery('.onerow').each(function(){

                // decrement if deleted element has more section
                if(jQuery(this).data('r_page_section')>p_sec){

                    var rps = jQuery(this).data('r_page_section');
                    var newrps = rps-1;
                    // decrement global page_section variable
                    jQuery(this).data('r_page_section',newrps);
                }
            });

            // rename section bar
            

            jQuery('.remove_section').each(function(){

                if(jQuery(this).data('p_sec')>p_sec){

                    var ps = jQuery(this).data('p_sec');
                    var newps = ps-1;
                    jQuery(this).data('p_sec',newps);
                    jQuery(this).parent('div').find('span').text('Section '+newps);
                }
            });
            page_section_count = page_section_count-1;

            // end



            jQuery(this).remove();
        }

        
        //var r = jQuery(this).data('r_page_section').remove();

    });



});

function remove_section(this2){

      var confirmed =confirm("All data associated with this field will be deleted. Are you sure you want to delete this section?");
        if(confirmed){

            var id= jQuery(this2).id;
            var p_sec = jQuery(this2).data('p_sec');
            var deleteListIds=[];
            var db_deleteListIds=[];
            var deletestatus= false;

            jQuery('.onerow').each(function(){

                if(jQuery(this).data('r_page_section')==p_sec){
                    //console.log('secid : '+p_sec);

                    jQuery(this).find('li').each(function(){

                        var li_id = jQuery(this).attr('id');
                        var numericIdObj = li_id.split("_");
                        var elemid = parseInt(numericIdObj[1]);
                        deleteListIds.push(elemid);
                        
                        if(ns.get(elemid,"id") && (ns.get(elemid,"is_db_live")==1)) {                            
                            db_deleteListIds.push(elemid);
                        }
                    });
                }

            });



                //console.log(deleteListIds);
                //console.log(db_deleteListIds);

                $("#statusText_field").html("Deleting ... Please wait ...");
                if(db_deleteListIds.length>0){ 
                $.ajax({
                    url: '/form/attrDeleteMultiple',
                    type: "POST",
                    headers: { 'X-CSRF-TOKEN' : jsVars.csrfToken },
                    cache: false,
                    dataType: 'json',
                    data: {form_id: json_form.id, attribute_ids: db_deleteListIds, current_user_id: jsVars.currentUserId},
                    success: function (data) {
                        if (data.status === true) {
                            deletestatus = true;
                        }
                        else {
                            alert("An error occured while deleting your field!")
                        }
                    }
                });
                }
            
            if(deleteListIds.length>0){
                jQuery.each(deleteListIds,function(index,value){
                    delete_attribute_markup(value);
                });

            }

            jQuery('.onerow').each(function(){

                if(jQuery(this).data('r_page_section')==p_sec){
                    jQuery(this).remove();
                }
            });



            // Reorder section and its elements
            jQuery('.onerow').each(function(){

                // decrement if deleted element has more section
                if(jQuery(this).data('r_page_section')>p_sec){

                    var rps = jQuery(this).data('r_page_section');
                    var newrps = rps-1;
                    // decrement global page_section variable
                    jQuery(this).data('r_page_section',newrps);
                }
            });

            // rename section bar
            

            jQuery('.remove_section').each(function(){

                if(jQuery(this).data('p_sec')>p_sec){

                    var ps = jQuery(this).data('p_sec');
                    var newps = ps-1;
                    jQuery(this).data('p_sec',newps);
                    jQuery(this).parent('div').find('span').text('Section '+newps);
                }
            });
            page_section_count = page_section_count-1;

            // end

            jQuery(this2).parent('div').remove();
            
        }


        return false;
        //var r = jQuery(this).data('r_page_section').remove();
}