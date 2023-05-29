$.fn.cerealize = function (filter) {
	filter = filter || ''; // ':not([data-recurly])'; - Disabling this option since recurly.js v4 CC fields are now hosted via secure iframes.
	var $form = $(this).closest('form');
	var strKeyVals = '';	
	var arrKeyVals = {};
	var checkable, checked, key;
    var selector = (filter) ? $(':input').filter(filter) : $(':input');
	$(this).find(selector).each(
		function() {
			var n, mv, v;
			if ($(this).attr('name')) {
				n = $(this).attr('name');
				mv = (n.match(/\[\]$/)); // check for multi-value support
				if (arrKeyVals[n] && !mv) {
					console.warn('CEREALIZE WARNING!!! The field [' + n + '] exists more than once in form [' + $(this).closest('form').attr('id') + ']. Skipping further assignments for this field.');
					return;
				}
				v = encodeURIComponent($(this).val());
				if ($(this).is(':radio') || $(this).is(':checkbox')) {
					if ($(this).is(':checked') || $(this).hasClass('boolean')) {
						arrKeyVals[n] = (arrKeyVals[n]) ? arrKeyVals[n] + ',' + v : v;
					}
				}
				else {
					arrKeyVals[n] = (arrKeyVals[n]) ? arrKeyVals[n] + ',' + v : v;
				}
			}
		}
	);
	for (key in arrKeyVals) {
        if (key.match(/\[\]$/)) {
			$('[name="' + key + '"]').each(
				function() {
					var $f = $(this);
					var vals;
					if ($f.is('[multiple]')) {
						vals = $f.val();
						/* The select may not have a current value (ie; an empty array object), so we'll check for array elements first before looping */
						if (vals.length) { 
							for (v in vals) {
								strKeyVals += '&' + key + '=' + vals[v];
							}
						}
						else {
							strKeyVals += '&' + key + '=';
						}
					}
					else {
						checkable = ($f.is(':radio') || $f.is(':checkbox'));
						checked = ($f.is(':checked') || $f.hasClass('boolean'));
						if (!checkable || (checkable && checked)) { 
							strKeyVals += '&' + key + '=' + $f.val();
						}
					}
				}
			);
		}
		else {
			strKeyVals += '&' + key + '=' + arrKeyVals[key];	
		}
	}
	return strKeyVals.replace(/^\s*&/, '');
};

/* 

USAGE EXAMPLE 
------------------------------------
var querystring = $('form.myFormClass').cerealize();

*/
