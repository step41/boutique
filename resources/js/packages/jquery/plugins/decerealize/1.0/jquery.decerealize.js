$.fn.decerealize = function (vals) {
	//vals = $.trim(vals);
	var flds, pairs, frm = $(this);
	if (vals && frm.length) {
		/* Check and encode values if they exist in a JSON format */ 
		try {
			var json = vals;
			json = JSON.parse(json);
			if (json) {
				vals = $.param(json);
			}
		}
		catch(e) {}
		frm.get(0).reset();
		vals = vals.replace(/\+/g, '%20');
		pairs = vals.split('&');
		$.each(pairs, 
			function(i, pair) {
				var fld = null;
				var fldph = null;
				var fldval = null;
				var key = null;
				var val = null;
				var fldexists = false;
				var keyval = pair.split(/=/);
				if (keyval.length === 2) {
					key = decodeURIComponent(keyval[0]);
					val = decodeURIComponent(keyval[1]);
					
					//console.log('JQuery Selector: [data-name=' + key + '], [name="' + key + '"], [name="' + key + '[]"]');
					frm.find('[data-name=' + key + '], [name="' + key + '"], [name="' + key + '[]"]').each(function() {
							
						var fld = $(this);
						var fldtype = fld.prop('nodeName').toLowerCase();

						//z$.clog('decerealizing... setting field [' + key + '] of type [' + fldtype + '] to [' + val + ']');
						/* [data-name] is for readonly placeholders or fields without a "name" attribute first... */
						if (fld.is('[data-name]')) {
							if (fld.is(':input')) {
								if (fld.hasClass('selectpicker')) {
									fld.selectpicker('val', val);
								}
								else {
									fld.val(val);
								}
							}
							else {
								fld.html(val);
							}
						}
						else if (fldtype && (fldtype === 'radio' || fldtype === 'checkbox')) {
							fldval = fld.filter('[value="' + val + '"]');			
							fldexists = (fldval.length);
							if (!fldexists && value === '1') {
								fld.first().prop('checked', true);
							} 
							else {
								fldval.prop('checked', fldexists);
							} 
						}
						else if (fldtype && fldtype === 'select') {
							val = (fld.is('[multiple]')) ? val.split(',') : val;
							if (fld.hasClass('selectpicker')) {
								fld.selectpicker('val', val);
							}
							else {
								fld.val(val);
							}
						}
						else {
							if (fld.hasClass('selectpicker')) {
								fld.selectpicker('val', val);
							}
							else {
								fld.val(val);
							}
						}
					
					});
				}
			}
		);
	}
};

/* 

USAGE EXAMPLE 
------------------------------------
var $form = $('form.myFormClass');
var s = $form.serialize();
$form.deserialize(s);

*/