; (function() {

    'use strict';
            
	// handles messaging
	Boutique.Messages = {
		
		icons: {
			danger:			'icon-angry', 
			info:			'icon-smiley', 
			progress:		'icon-spinner3 icon-spin',
			success: 		'icon-happy', 
			validation:		'icon-angry', 
			warning: 		'icon-shocked'
		},
		
		id: '#ocms_message',
		class: 'ocms-message-',
		loc: 'body',
		type: 'progress',
		text: Boutique.Settings.t('messageWorking'),
		titles: {
			danger:			'The following errors occurred:', 
			info:			'', 
			progress:		'',
			success: 		'The following actions were successful:', 
			validation:		'The following validation errors occurred:', 
			warning: 		'The following warnings occurred:'
		},
		
		tohide: null,
		
		types: [
			'validation', 
			'danger', 
			'warning',
			'info', 
			'success', 
			'progress',
		],
		
		// builds and returns a message
		build: function(text, type) {

			var OM = Boutique.Messages;
			var icon, t, msg = '';

			text = text || OM.text;
			text = (Array.isArray(text)) ? text : [text];
			type = type || OM.type;
			icon = OM.icons[type] || OM.icons.progress;
			msg += '<div id="' + OM.id.replace(/#/, '') + '" class="status block-status ' + OM.class + type + '">';
				if (text.length > 1) {
					msg += (OM.titles[type]) ? '<p>' + OM.titles[type] + '</p>' : '';				
					msg += '<ul>';
						for (t in text) {
							msg += '<li><span class="text">' + text[t] + '</span></li>';	
						}
					msg += '</ul>';
				}
				else {
					msg += '<p><i class="icon ' + icon + '"></i>&nbsp; ' + text[0] + '</p>';				
				}
			msg += '</div>';

			return msg;
		},

		// wrapper function for danger messages
		danger: function(text, loc) { 

			var OM = Boutique.Messages;

			return OM.show(text, 'danger', loc); 

		},
		
		gettype: function(messages) {

			var OM = Boutique.Messages;
			var t, type, mtype;

			for (t in OM.types) {
				type = OM.types[t];
				mtype = (messages && messages[type]) ? messages[type] : false;
				if (mtype && mtype.length) {
					return type;
				}
			}
			return OM.types.pop();
		},
		
		// hides the message
		hide: function(loc, delay, success, failure) {
			
			var OM = Boutique.Messages;
			
			loc = loc || OM.loc;
			delay = delay || 0;
			clearTimeout(OM.tohide);
			if ($(loc).length) {
				OM.tohide = setTimeout(
					function() { 
						$(loc).unblock();
						//$.clog('calling Messages unblock() with delay: ' + delay);
						if (typeof (success || undefined) === 'function') {
							success.call();
						}
						else if (typeof (failure || undefined) === 'function') {
							failure.call();
						}
					}
				, delay);
			}
		},

		// wrapper function for informational messages
		info: function(text, loc) { 

			var OM = Boutique.Messages;

			return OM.show(text, 'info', loc); 

		},
		
		// wrapper function for progress messages
		progress: function(text, loc) { 

			var OM = Boutique.Messages;

			return OM.show(text, 'progress', loc); 

		},
		
		// displays a message
		response: function(data, status, xhr, loc, success, failure) {

			var OM = Boutique.Messages;
			var OV = Boutique.Validator;
			
			var code = 200;
			var delay = 2000;
			var type = 'success';
			var messages = '';
			var code, json, frm, m, messages, msg, text, delay, validate, e, errors;
			
			loc = (loc) ? loc : OM.loc;
			frm = $(loc).find('form');
			
			// Check against async responses first
			if (xhr && xhr.getResponseHeader('OCMS-Messages')) {
				data = xhr.getResponseHeader('OCMS-Messages');
			}
			// Check for sync responses next 
			else if ($('[name="ocms:message"]').length) {
				data = $('[name="ocms:message"]').attr('content');
			}
			if (trim(data)) { 
				try {
					json = JSON.parse(data);
					if (json['messages']) {
						messages = json['messages'];
						type = OM.gettype(messages);
						text = [];
						validate = (type === 'validation' && frm.length);
						if (validate) {
							$(loc).unblock();
							OV.clearErrors(frm);
							OV.displayErrors(messages['validation'][0], frm);
							return type;
						}
						else {
							for (m in messages[type]) {
								msg = messages[type][m]['text'];
								code = Math.max(code, parseInt(messages[type][m]['code']));
								text.push(msg);
							}
							// Check for csrf expiration status
							if (code === 409) {
								text = Boutique.Settings.t('messageReloadRequired');
								failure = function() {
									location.reload();
									return false;
								}
							}
							OM.show(text, type, loc);
						}
						if (type === 'danger' || type === 'warning') {
							delay = 5000;
							success = null;
						}
					}
				}
				catch(e) {}
			}
			OM.hide(loc, delay, success, failure);
			return type;
		},
		
		// displays a message
		show: function(text, type, loc) {


			var OM = Boutique.Messages;
			var opts, msg;

			text = text || OM.text;
			type = type || OM.type;
			OM.loc = loc || OM.loc;
			msg = OM.build(text, type);
			if ($(OM.id).length) {
				$(OM.id).replaceWith(msg);
				$('.blockUI.blockMsg').center();
			}
			else {
				opts = { 
					message: msg
				};
				$(loc).block(opts);
			}
			return true;
		},
		
		// wrapper function for success messages
		success: function(text, loc) { 

			var OM = Boutique.Messages;

			return OM.show(text, 'success', loc); 

		},
		
		// wrapper function for warning messages
		warning: function(text, loc) { 

			var OM = Boutique.Messages;

			return OM.show(text, 'warning', loc); 

		},

	};

})();


