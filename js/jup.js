
var JUP = (typeof JUP == "undefined") ? {} : JUP;

JUP.toHTML = function(params) {
	
	var structure = isObject(params) ? params.structure : params, 
		qty = params.qty || 0,
		data = params.data || null;
		
	var markup = [];
	var attributes = [];		

	function isArray(obj) {
	    return obj.constructor == Array;					
	}
	
	function isObject(obj) {
	    return obj.constructor == Object;					
	}					
	
	function isString(s) {
		return s.constructor == String;
	}

	var resolve = function(val, record) {
		
		var tag = null;
		var selfClosing = false;
		
		

		for(var i=0; i < val.length; i++) {

			if(isString(val)) { // this must be a value
				markup.push(val);								
				break;
			}

			if(isString(val[i]) && i == 0) { // this must be a tag, its in the first position								
				
				switch(val[i].toLowerCase()) {
					case "data":
						if(record !== undefined) {
							markup.push(record[val[i+1]]);
							return;
						}
					break;
					
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

					if(isObject(val[j])) { // this must be an attribute object
						
						var a = val[j];

						for (var v in a) {
							attributes.push(" " + v + "='" + a[v] + "'");
						}
					}								
				}

				var close = selfClosing ? "/" : "";

				if(attributes.length > 0) {
					markup.push("<" + val[i] + attributes.join("") + close + ">");
					attributes = [];
					tag = val[i];
					continue;
				}
				
				markup.push("<" + val[i] + close +">");
				tag = val[i];					
				continue;
			}
			
			resolve(val[i], record); // this must be a child.

			if(i == val.length-1 && tag !== null && !selfClosing) {
				markup.push("</" + tag + ">"); // close it!
			}
		}
	};

	if(data !== null) {
		for(var i=0; i < data.length; i++) {
			resolve(structure, data[i]);
		}
	}
	else {
	 	resolve(structure);
	}
	
	
	for(var i=1; i < qty; i++) {
		markup.push([markup.join("")]);
	}
	
	return markup.join("");
};
