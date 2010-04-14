
var JUP = (typeof JUP != "undefined") ? JUP : (function() { 

	var Util = {
		
		markup: [],
		attributes: [],
		lastout: null,	

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

		sup: function(s, o) {
			return s.replace(/{{([^{}]*)}}/g,
		        function (a, b) {
		            var r = o[b];
		            return typeof r === "string" || typeof r === "number" ? r : a;
		        });
		},

		resolve: function(val, record) {

			var tag = null;
			var selfClosing = false;

			for(var i=0; i < val.length; i++) {

				if(typeof val === "string") { // this must be a value

					if(val.indexOf("{{") != -1 && record != null) {		
						val = this.sup(val, record);
					}

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

						if(Object.prototype.toString.call(val[j]) != "[object Array]" && typeof val[j] == "object") { // this must be an attribute object

							var a = val[j];

							for (var v in a) {

								if(typeof a[v] === "string" && a[v].indexOf("{{") != -1 && record != null) { // if this is a token, pull it from the data param.
									a[v] = this.sup(a[v], record);
								}

								this.attributes.push(" " + v + "='" + a[v] + "'");
							}
						}								
					}

					var close = selfClosing ? "/" : "";

					if(this.attributes.length > 0) {
						this.markup.push("<" + val[i] + this.attributes.join("") + close + ">");
						this.attributes = [];
						tag = val[i].indexOf(" ") == -1 ? val[i] : val[i].substr(0, val[i].indexOf(" "));
						continue;
					}

					this.markup.push("<" + val[i] + close +">");
					tag = val[i];					
					continue;
				}

				this.resolve(val[i], record); // this must be a child.

				if(i == val.length-1 && tag !== null && !selfClosing) {
					this.markup.push("</" + tag + ">"); // close it!
				}
			}
		},
	}

	return {
		
		data: function(str) {
			return "{{" + str + "}}";
		},

		toHTML: function(params) {

			var structure = Object.prototype.toString.call(params) == "[object Array]" ? 
				Util.cloneStructure(params) : Util.cloneStructure(params.structure);
			var qty = params.qty || 0;
			var data = params.data || null;

			if(data !== null && data.length) {
				for(var i=0; i < data.length; i++) {
					Util.resolve(structure, data[i]);
				}
			}
			else {
				Util.resolve(structure, data);
			}

			for(var i=0; i < qty; i++) {
				Util.markup.push([Util.markup.join("")]);
			}

			Util.lastout = Util.markup.join("");
			Util.markup = []; 
			Util.attributes = [];

			return Util.lastout;
		}	
	};
})();

