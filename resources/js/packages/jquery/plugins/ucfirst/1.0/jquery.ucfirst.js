(function($) {

	$.ucfirst = function(str) {
		var text = str;
		var parts = text.split(' ');
		var len = parts.length;
		var i, part, first, rest, word;
		var words = [];
		for (i = 0; i < len; i++) {
			part = parts[i];
			first = part[0].toUpperCase();
			rest = part.substring(1, part.length);
			word = first + rest;
			words.push(word);
		}
		return words.join(' ');
	};

})(jQuery);
