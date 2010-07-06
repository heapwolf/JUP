
var JUP = (typeof JUP != "undefined") ? JUP : (function() {

    var Util = {

        isArray: (function() { return Array.isArray || function(obj) {
            // isArray function adapted from underscore.js
            return !!(obj && obj.concat && obj.unshift && !obj.callee); 
        }})(),

        sup: function(target, data) {
            
            return target.replace(/\{\{([^\{\}]*)\}\}/g, function(str, r) {
                try { return data[r]; } catch(ex) {}
            });
        },

        translate: function (o, data) {

            var c = [], atts = [], count = 1, selfClosing = false;

            for (var i in o) {
                if (o.hasOwnProperty(i) ) {

                    count++;
                    selfClosing = false;

                    if(typeof c[0] == "string") { 
                        switch(o[0].toLowerCase()) {
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
                    }

                    if (o[i] && typeof o[i] == "object") {
                        
                        if(!Util.isArray(o[i])) {
                            for(var attribute in o[i]) {
                                if (o[i].hasOwnProperty(attribute)) {
                                    atts.push([" ", Util.sup(attribute, data).replace(/ /g, "-"), "=\"", Util.sup(o[i][attribute], data), "\""].join(""));
                                }
                            }
                            c[i] = "";
                            c[0] = [c[0], atts.join("")].join("");
                        }
                        else {
                            c[i] = this.translate(o[i], data);
                        }
                    }
                    else {
                        c[i] = Util.sup(o[i], data);
                    }

                    if(typeof c[0] == "string") {

                        c[0] = ["<", o[0], atts.join(""), (selfClosing ? "/>" : ">")].join("");

                        if(selfClosing == false) { 
                            c.push("</" + o[0] + ">"); 
                        }
                    }
                }
            }
            if(count-1 == o.length) {
                return [c.join("")];
            }
        }
    };

    return {
		version: "0.2",
        data: function(str) {
            return ["{{", str, "}}"].join("");
        },
        html: function() {

            var args = Array.prototype.slice.call(arguments), structure = [], data = {};

            if(args.length == 2) {
                structure = args[1];
                data = args[0];
            }
            else {
                if(Util.isArray(args[0])) {
                    structure = args[0];
                }
                else {
                    data = args[0].data || null;
                    structure = args[0].structure;
                }
            }
            if(Util.isArray(data)) {

                var copystack = [];

                for(var c=0; c < data.length; c++) {
                    copystack.push(Util.translate(structure, data[c])[0]);
                }
                return copystack.join("");
            }
            else if(data) {
                for(var d=0; d < data.length; d++) {    
                    return Util.translate(args[2] ? structure : Util.translate(structure)[0], data[d]);
                }
            }
            return Util.translate(structure)[0];
        } 
    };
})();