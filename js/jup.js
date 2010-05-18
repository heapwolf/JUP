
var JUP = (typeof JUP != "undefined") ? JUP : (function() { 

	var Util = {
		
		markup: [],
		attributes: [],
		lastout: [],	

		cloneStructure: function(o) {
			var c = (o instanceof Array) ? [] : {};
			for (i in o) {
				if (o[i] && typeof o[i] == "object") {
					c[i] = this.cloneStructure(o[i]);
				} 
				else {
					c[i] = o[i];
				}
			} 
			return c;
		},

		subst: function(s, o) { // inspired by doug crockford's "supplant" method.
		    var count = -1;
		    return s.replace(/{{([^{}]*)}}/g,
		        function(str, r) {
		            if(!isNaN(r)) { 
		                return o[r]; 
		            }
		            count++;
		            return o[(o instanceof Array) ? count : r];
		        }
		    );
		},

		resolve: function(val, record) {

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

						if(!(val[j] instanceof Array) && typeof val[j] == "object") { // this must be an attribute object

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

				this.resolve(val[i], record); // this must be a child.

				if(i == val.length-1 && tag !== null && !selfClosing) {
					this.markup.push(["</", tag, ">"].join("")); // close it!
				}
			}
		},
	}

	return {

		data: function(str) {
			return ["{{", str, "}}"].join("");
		},

		toHTML: function(params) {

			var structure = (params instanceof Array) ? 
				Util.cloneStructure(params) : Util.cloneStructure(params.structure);
			var qty = params.qty || 0;
			var data = params.data || null;

			if(data !== null && data.length) {
				
				for(var i=0; i < data.length; i++) {
					Util.resolve(structure);
					Util.markup = [Util.subst(Util.markup.join(""), data[i])];
				}
			} else {
				Util.resolve(structure);
				Util.markup = [Util.subst(Util.markup.join(""), data)];
			}

			for(var i=0; i < qty; i++) {
				Util.markup.push([data ? Util.subst(Util.markup.join(""), data) : Util.markup.join("")]);
			}

			Util.lastout = Util.markup.join("");
			Util.markup = []; 
			Util.attributes = [];

			return Util.lastout;
		}	
	};

})();

