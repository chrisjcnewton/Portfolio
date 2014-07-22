var PORT = PORT || (function(window){
	
	
	
	
	window.onload = function(){		
		
		
	};
	

	
	
	
	function getVendorPrefix(property) {
		function up(p, a) { 
			return a.toUpperCase();
		}		
		var div = document.createElement('div');
		var x = 'Khtml Moz Webkit O ms '.split(' '), i;
		for (i = x.length-1; i >= 0; i--) {
			if (((x[i] ? x[i] + '-' : '') + property).replace(/\-(\w)/g, up) in div.style) {
			  return x[i] ? '-' + x[i].toLowerCase() + '-'+property : ''+property; // empty string, if it works without prefix
			}
		}
		return null;// not found...
	}
	

////////////// Public methods ///////////////////////////////////////////
		
	return{
		//public function
		onipad: function(){			
			
			
		}		
	};
	
})(window);