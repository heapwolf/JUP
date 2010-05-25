var JUP = (typeof JUP != "undefined") ? JUP : (function() {

	var Util = {

		translate: function (o, data) {

            var c = [], atts = []; var count = 1;
            for (var i in o) {
				count++
                if (o[i] && typeof o[i] == "object") {

					if(Object.prototype.toString.call(o[i]) != "[object Array]") {
				        for(var attribute in o[i]) {
				            atts.push([" ", attribute, "=\"", o[i][attribute], "\""].join(""));
				        }
						c[i] = "";
						c[0] = [c[0], atts.join("")].join("");
					}
					else {
						c[i] = this.translate(o[i], data);
					}
                }
                else {
					
					c[i] = o[i].replace(/\{\{([^\{\}]*)\}\}/g,
		                function(str, r) {
							try { return data[r]; } catch(ex) { return r; }
		                }
		            );
                }

				if(typeof c[0] == "string") {
					c[0] = ["<", o[0], atts.join(""), ">"].join("");
					c.push("</" + o[0] + ">");
				}	
            }

			if(count-1 == o.length) {
				return [c.join("")]
			}
		}
	}

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

				for(var i=0; i < data.length; i++) {
					copystack.push(Util.translate(structure, data[i])[0]);
				}
				return copystack.join("");
			} 
			else if(data) {
				
				for(var i=0; i < data.length; i++) {
					return Util.translate(args[2] ? structure : Util.translate(structure)[0], data[i])
				}
			}

			return Util.translate(structure, data)[0];
		}
	}
})();