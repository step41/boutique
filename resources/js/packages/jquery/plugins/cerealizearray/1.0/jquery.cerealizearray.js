$.fn.cerealizeArray = function (filter) {
	filter = filter || ''; // ':not([data-recurly])'; - Disabling this option since recurly.js v4 CC fields are now hosted via secure iframes.
	var $form = $(this).closest('form');
	var arrKeyVals = [];
	var checkable, checked, key;
	var selector = (filter) ? $(':input').filter(filter) : $(':input');
	$(this).find(selector).each(
		function() {
			var n, mv, v;
			if ($(this).attr('name')) {
				n = $(this).attr('name');
				mv = (n.match(/\[\]$/)); // check for multi-value support
				if (arrKeyVals[n] && !mv) {
					$.clog('CEREALIZE WARNING!!! The field [' + n + '] exists more than once in form [' + $(this).closest('form').attr('id') + ']. Skipping further assignments for this field.', 'warning');
					return;
				}
				v = $(this).val();
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
	return arrKeyVals;
};

/* 

USAGE EXAMPLE 
------------------------------------
var fieldArray = $('form.myFormClass').cerealizeArray();

*/