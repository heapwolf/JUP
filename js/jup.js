var JUP = (typeof JUP != "undefined") ? JUP : (function() {

    var Util = {

        selfClosingTags: ["area", "base", "basefont", "br", "hr", "input", "img", "link", "meta", ""],
        markup: [],
        attributes: [],
        lastout: [],

        adopt: function(o) {
            var c = (o instanceof Array) ? [] : {};
            for (var i in o) {
                if (o[i] && typeof o[i] == "object") {
                    c[i] = this.adopt(o[i]);
                }
                else {
                    c[i] = o[i];
                }
            }
            return c;
        },

        subst: function(s, o) { // inspired by doug crockford's "supplant" method.

            var count = -1;
            return s.replace(/\{\{([^\{\}]*)\}\}/g,
                function(str, r) {
                    if(!isNaN(r)) {
                        return o[r];
                    }

                    count++;
                    return o[(o instanceof Array) ? count : r];
                }
            );
        },

        resolve: function(val) {

            var tag = null;
            var selfClosing = false;

            for(var i=0; i < val.length; i++) {

                if(typeof val === "string") { // this must be a value

                    this.markup.push(val);
                    break;
                }

                if(typeof val[i] === "string" && i === 0) { // this must be a tag, its in the first position

                    switch(val[i].toLowerCase()) {
                        case "area":
                        case "base":
                        case "basefont":
                        case "br":
                        case "hr":
                        case "input":
                        case "img":
                        case "link":
                        case "meta":
                            selfClosing = true;
                        break;
                    }

                    // check to see if this array has any objects in it (check for attributes).
                    for(var j=i; j < val.length; j++) {

                        if(!(val[j] instanceof Array) && typeof val[j] == "object") {

                            var a = val[j];

                            for (var v in a) {

                                this.attributes.push([" ", v, "='", a[v], "'"].join(""));
                            }
                        }
                    }

                    var close = selfClosing ? "/" : "";

                    if(this.attributes.length > 0) {
                        this.markup.push(["<", val[i], this.attributes.join(""), close, ">"].join(""));
                        this.attributes = [];
                        tag = val[i].indexOf(" ") == -1 ? val[i] : val[i].substr(0, val[i].indexOf(" "));
                        continue;
                    }

                    this.markup.push(["<", val[i], close, ">"].join(""));
                    tag = val[i];
                    continue;
                }

                this.resolve(val[i]); // this must be a child.

                if(i == val.length-1 && tag !== null && !selfClosing) {
                    this.markup.push(["</", tag, ">"].join("")); // close it!
                }
            }
        }
    };

    return {

        data: function(str) {
            return ["{{", str, "}}"].join("");
        },

        html: function() {

            var args = Array.prototype.slice.call(arguments),
                structure = [],
                data = {};

            if(args.length == 2) {
                structure = args[1];
                data = args[0];
            }
            else {
                if(args[0] instanceof Array) {
                    structure = args[0];
                }
                else {
                    data = args[0].data || null;
                    structure = args[0].structure;
                }
            }

            if(data !== null && data.length) {
                for(var i=0; i < data.length; i++) {
                    Util.resolve(structure);
                    Util.markup = [Util.subst(Util.markup.join(""), data[i])];
                }
            } else if(data !== null) {
                Util.resolve(structure);
                Util.markup = [Util.subst(Util.markup.join(""), data)];
            } else {
                Util.resolve(structure);
            }

            Util.lastout = (data !== null) ? Util.subst(Util.markup.join(""), data) : Util.markup.join("");
            Util.markup = [];
            Util.attributes = []; // reset;

            return Util.lastout;
        }
    };
})();