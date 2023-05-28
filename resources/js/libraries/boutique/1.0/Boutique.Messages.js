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
		
		id: '#boutique_message',
		class: 'boutique-message-',
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

			const BM = Boutique.Messages;
			let icon, t, msg = '';

			text = text || BM.text;
			text = (Array.isArray(text)) ? text : [text];
			type = type || BM.type;
			icon = BM.icons[type] || BM.icons.progress;
			msg += '<div id="' + BM.id.replace(/#/, '') + '" class="status block-status ' + BM.class + type + '">';
				if (text.length > 1) {
					msg += (BM.titles[type]) ? '<p>' + BM.titles[type] + '</p>' : '';				
					msg += '<ul>';
						for (t in text) {
							msg += '<li><span class="text">' + text[t] + '</span></li>';	
						}
					msg += '</ul>';
				}
				else {
					msg += '<p>' + ((type === 'progress') ? '<span class="boutique-spinner"></span>' : '') + '&nbsp; ' + text[0] + ' &nbsp;</p>';				
				}
			msg += '</div>';

			return msg;
		},

		// wrapper function for danger messages
		danger: function(text, loc) { 

			const BM = Boutique.Messages;

			return BM.show(text, 'danger', loc); 

		},
		
		gettype: function(messages) {

			const BM = Boutique.Messages;
			let t, type, mtype;

			for (t in BM.types) {
				type = BM.types[t];
				mtype = (messages && messages[type]) ? messages[type] : false;
				if (mtype && mtype.length) {
					return type;
				}
			}
			return BM.types.pop();
		},
		
		// hides the message
		hide: function(loc, delay, success, failure) {
			
			const BM = Boutique.Messages;
			
			loc = loc || BM.loc;
			delay = delay || 0;
			clearTimeout(BM.tohide);
			if ($(loc).length) {
				BM.tohide = setTimeout(
					function() { 
						$(loc).unblock();
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

			const BM = Boutique.Messages;

			return BM.show(text, 'info', loc); 

		},
		
		// wrapper function for progress messages
		progress: function(text, loc) { 

			const BM = Boutique.Messages;

			return BM.show(text, 'progress', loc); 

		},
		
		// displays a message
		response: function(data, status, xhr, loc, success, failure) {

			const BM = Boutique.Messages;
			let BV = Boutique.Validator;
			
			let code = 200;
			let delay = 2000;
			let type = 'success';
			let messages = '';
			let json, frm, m, msg, text, validate;
			
			loc = (loc) ? loc : BM.loc;
			frm = $(loc).find('form');
			
			// Check for non-200 errors 
			if (status == 'error' && data.getResponseHeader && data.getResponseHeader('Boutique-Messages')) {
				data = data.getResponseHeader('Boutique-Messages');
			}
			// Check against async responses first
			else if (xhr && xhr.getResponseHeader && xhr.getResponseHeader('Boutique-Messages')) {
				data = xhr.getResponseHeader('Boutique-Messages');
			}
			// Check for sync responses next 
			else if ($('[name="boutique:message"]').length) {
				data = $('[name="boutique:message"]').attr('content');
			}
			if (trim(data)) { 
				try {
					json = JSON.parse(data);
					if (json['messages']) {
						messages = json['messages'];
						type = BM.gettype(messages);
						text = [];
						validate = (type === 'validation' && frm.length);
						if (validate) {
							$(loc).unblock();
							BV.clearErrors(frm);
							BV.displayErrors(messages['validation'][0], frm);
							return type;
						}
						else {
							for (m in messages[type]) {
								msg = messages[type][m]['text'];
								code = Math.max(code, parseInt(messages[type][m]['code']));
								if (status == 'error') {
									msg = '<strong>Error ' + code + ':</strong> ' + msg;
								}
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
							BM.show(text, type, loc);
						}
						if (type === 'danger' || type === 'warning') {
							BM.danger(text, loc);
							delay = 5000;
							success = null;
						}
					}
				}
				catch(e) {}
			}
			BM.hide(loc, delay, success, failure);
			return type;
		},
		
		// displays a message
		show: function(text, type, loc) {


			const BM = Boutique.Messages;
			let opts, msg;

			text = text || BM.text;
			type = type || BM.type;
			BM.loc = loc || BM.loc;
			msg = BM.build(text, type);
			if ($(BM.id).length) {
				$(BM.id).replaceWith(msg);
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

			const BM = Boutique.Messages;

			return BM.show(text, 'success', loc); 

		},
		
		// wrapper function for warning messages
		warning: function(text, loc) { 

			const BM = Boutique.Messages;

			return BM.show(text, 'warning', loc); 

		},

	};

})();


