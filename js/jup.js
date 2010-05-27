var JUP = (typeof JUP != "undefined") ? JUP : (function() {

    var Util = {

        translate: function (o, data) {

            var c = [], atts = [], count = 1, selfClosing = false;
            var replace = function(str, r) { try { return data[r]; } catch(ex) {} };

            for (var i in o) {
                if (o.hasOwnProperty(i) ) {
                    count++;
                    if (o[i] && typeof o[i] == "object") {
                        if(Object.prototype.toString.call(o[i]) != "[object Array]") {
                            for(var attribute in o[i]) {
                                if (o[i].hasOwnProperty(attribute)) {
                                    atts.push([" ", attribute, "=\"", o[i][attribute], "\""].join(""));
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
                        c[i] = o[i].replace(/\{\{([^\{\}]*)\}\}/g, replace);
                    }

                    if(typeof c[0] == "string") {
                        selfClosing = false;
                        switch(c[0].toLowerCase()) {
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
                if(Object.prototype.toString.call(args[0]) == "[object Array]") {
                    structure = args[0];
                }
                else {
                    data = args[0].data || null;
                    structure = args[0].structure;
                }
            }
            if(Object.prototype.toString.call(data) == "[object Array]") {

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