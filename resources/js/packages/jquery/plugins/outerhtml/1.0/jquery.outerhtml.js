(function($){
	
	var div;

	$.fn.outerHTML = function(v) {
		
		var elm = this[0];
		var tmp;

		if (!elm) {
			return null;
		}
		else {
			// Value passed so we're setting instead of getting
			if (v) {
				$(elm).replaceWith(v);
			}
			// Get outer html of element
			else {
				return typeof (tmp = elm.outerHTML) === 'string' ? tmp : (div = div || $('<div/>')).html(this.eq(0).clone()).html();
			}
		}
	};
  
})(jQuery);
