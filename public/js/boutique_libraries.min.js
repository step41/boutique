const LOCALE = 'en-us';
const API_PATH = '';

var Boutique = Boutique || {};

; (function() {

	'use strict';
			
	// instantiate core objects
	Boutique.Inflection 		= Boutique.Inflection 		|| {};
	Boutique.Settings 	 		= Boutique.Settings 		|| {};
	Boutique.Messages			= Boutique.Messages	 		|| {};
	Boutique.Storage 			= Boutique.Storage 			|| {};
	Boutique.Utilities 			= Boutique.Utilities 		|| {};
	Boutique.Validator 			= Boutique.Validator 		|| {};
	Boutique.Controllers 		= Boutique.Controllers 		|| {};

	// set basic options
	Boutique.debug = false;

	Boutique.init = function() {
		
	};

})();
	
	

; (function() {

    'use strict';
            
	Boutique.Inflection = {  
		
		/**
		 * Common plural word patterns
		 */
		plural: {
			'(quiz)$'               			: function(m, p1) { return p1 + 'zes'; },
			'^(ox)$'                			: function(m, p1) { return p1 + 'en'; },
			'([m|l])ouse$'          			: function(m, p1) { return p1 + 'ice'; },
			'(matr|vert|ind)ix|ex$' 			: function(m, p1) { return p1 + 'ices'; },
			'(x|ch|ss|sh)$'         			: function(m, p1) { return p1 + 'es'; },
			'([^aeiouy]|qu)y$'      			: function(m, p1) { return p1 + 'ies'; },
			'(hive)$'               			: function(m, p1) { return p1 + 's'; },
			'(?:([^f])fe|([lr])f)$' 			: function(m, p1, p2) { return p1 + p2 + 'ves'; },
			'(shea|lea|loa|thie)f$' 			: function(m, p1) { return p1 + 'ves'; },
			'sis$'                  			: 'ses',
			'([ti])um$'             			: function(m, p1) { return p1 + 'a'; },
			'(tomat|potat|ech|her|vet)o$'		: function(m, p1) { return p1 + 'oes'; },
			'(bu)s$'                			: function(m, p1) { return p1 + 'ses'; },
			'(alias)$'              			: function(m, p1) { return p1 + 'es'; },
			'(octop)us$'            			: function(m, p1) { return p1 + 'i'; },
			'(ax|test)is$'          			: function(m, p1) { return p1 + 'es'; },
			'(us)$'                 			: function(m, p1) { return p1 + 'es'; },
			's$'                    			: 's',
			'$/'                      			: 's'
		},

		/**
		 * Common singular word patterns
		 */
		singular: {
			'(quiz)zes$'             		: function(m, p1) { return p1; },
			'(matr)ices$'            		: function(m, p1) { return p1 + 'ix'; },
			'(vert|ind)ices$'        		: function(m, p1) { return p1 + 'ex'; },
			'^(ox)en$'               		: function(m, p1) { return p1; },
			'(alias)es$'             		: function(m, p1) { return p1; },
			'(octop|vir)i$'          		: function(m, p1) { return p1 + 'us'; },
			'(cris|ax|test)es$'      		: function(m, p1) { return p1 + 'is'; },
			'(shoe)s$'               		: function(m, p1) { return p1; },
			'(o)es$'                 		: function(m, p1) { return p1; },
			'(bus)es$'               		: function(m, p1) { return p1; },
			'([m|l])ice$'            		: function(m, p1) { return p1 + 'ouse'; },
			'(x|ch|ss|sh)es$'        		: function(m, p1) { return p1; },
			'(m)ovies$'              		: function(m, p1) { return p1 + 'ovie'; },
			'(s)eries$'              		: function(m, p1) { return p1 + 'eries'; },
			'([^aeiouy]|qu)ies$'     		: function(m, p1) { return p1 + 'y'; },
			'([lr])ves$'             		: function(m, p1) { return p1 + 'f'; },
			'(tive)s$'               		: function(m, p1) { return p1; },
			'(hive)s$'               		: function(m, p1) { return p1; },
			'(li|wi|kni)ves$'        		: function(m, p1) { return p1 + 'fe'; },
			'(shea|loa|lea|thie)ves$'		: function(m, p1) { return p1 + 'f'; },
			'(^analy)ses$'           		: function(m, p1) { return p1 + 'sis'; },
			'((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$'  : function(m, p1, p2) { return p1 + p2 + 'sis'; },
			'([ti])a$'               		: function(m, p1) { return p1 + 'um'; },
			'(n)ews$'                		: function(m, p1) { return p1 + 'ews'; },
			'(h|bl)ouses$'           		: function(m, p1) { return p1 + 'ouse'; },
			'(corpse)s$'             		: function(m, p1) { return p1; },
			'(us)es$'                		: function(m, p1) { return p1; },
			's$'                     		: ''
		},

		/**
		 * Array populated with irregular plural word types
		 */
		irregular: {
			'registered'   						: 'registered',
			'move'   							: 'moves',
			'foot'   							: 'feet',
			'goose'  							: 'geese',
			'sex'    							: 'sexes',
			'child'  							: 'children',
			'man'    							: 'men',
			'tooth'  							: 'teeth',
			'music'  							: 'music',
			'person' 							: 'people',
			'dns' 	 							: 'dns',
			'admin'  							: 'admin'
		},

		/**
		 * Array populated with collective plural word types
		 */
		uncountable: [
			'sheep',
			'fish',
			'deer',
			'series',
			'species',
			'money',
			'rice',
			'information',
			'equipment'
		],

		/**
		 * Custom irregular word patterns populated by external
		 * inflection configuration file.
		 */
		irregularWords: [],
		
		/**
		 * Custom multi-word patterns that require splitting. This array
		 * will be populated by the external inflection configuration file.
		 */
		splitWords: [],
			
		/**
		 * Makes a phrase camel case. Spaces and underscores will be removed.
		 */
		camelize: function(str) {
			str = 'x' + trim(str);
			str = str.toLowerCase();
			str = str.replace(/[\s_]+/, ' ');
			str = ucwords(str);
			str = str.replace(/\s+/, '');
			str = str.substring(0, (str.length - 1));
			return str;
		},

		/**
		 * Converts a camel case phrase into a spaced phrase.
		 */
		decamelize: function(str, delim = ' ') {
			str = trim(str);
			str = str.replace(/([a-z])([A-Z])/, $1 + delim + $2);
			str = str.toLowerCase();
			return str;
		},

		/**
		 * Makes an underscored or dashed phrase human-readable.
		 */
		humanize: function(str) {
			str = trim(str);
			str = str.replace(/[_-]+/, ' ');
			return str;
		},

		/**
		 * Converts multiple separate words into a combined multi-word string.
		 */
		joinWords: function(str) {	

			var OI = Boutique.Inflection;
			var result, pattern;

			for (result in OI.splitWords) {
				pattern = new RegExp('^' + OI.splitWords[result] + '$', 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}
			
			return str;

		},

		/**
		 * Converts a string in singular format to its commonly used plural
		 * format based on rules or regular expression patterns.
		 */
		pluralize: function(str) {

			var OI = Boutique.Inflection;
			var result, pattern;

			if (in_array(str.toLowerCase(), OI.uncountable)) {
				return str;
			}

			for (pattern in OI.irregularWords) {
				result = OI.irregularWords[pattern];
				pattern = new RegExp(pattern + '$', 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}

			for (pattern in OI.irregular) {
				result = OI.irregular[pattern];
				pattern = new RegExp(pattern + '$', 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}

			for (pattern in OI.plural) {
				result = OI.plural[pattern];
				pattern = new RegExp(pattern, 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}
			
			return str;

		},

		/**
		 * Converts a string in singular format to its commonly used plural
		 * format based on rules or regular expression patterns if the numerical
		 * value of $count is greater than one. 
		 */
		pluralizeIf: function(cnt, str) {

			var OI = Boutique.Inflection;
			
			return (cnt == 1) ? '1 ' + str : cnt + ' ' + OI.pluralize(str);
		
		},
		
		/**
		 * Converts a string in plural format to its commonly used singular
		 * format based on rules or regular expression patterns.
		 */
		singularize: function(str) {	
	
			var OI = Boutique.Inflection;
			var result, pattern;

			if (in_array(str.toLowerCase(), OI.uncountable)) {
				return str;
			}

			for (pattern in OI.irregularWords) {
				result = OI.irregularWords[pattern];
				pattern = new RegExp(pattern + '$', 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}

			for (pattern in OI.irregular) {
				result = OI.irregular[pattern];
				pattern = new RegExp(pattern + '$', 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}
			
			for (pattern in OI.singular) {
				result = OI.singular[pattern];
				pattern = new RegExp(pattern, 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}
			
			return str;

		},

		/**
		 * Converts a combined multi-word string into multiple separate words.
		 */
		splitWords: function(str) {	
	
			var OI = Boutique.Inflection;
			var result, pattern;

			for (pattern in OI.splitWords) {
				result = OI.irregular[pattern];
				pattern = new RegExp(pattern + '$', 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}
			
			return str;

		},

		/**
		 * Makes a phrase underscored instead of spaced.
		 */
		underscore: function(str) {
			str = trim(str);
			str = str.replace(/\s+/, '_');
			return str;
		},

	}

})();



; (function() {

	'use strict';
			
	// Add client side translation as required or pull down from server side to avoid redundancy
    Boutique.Settings.Translations = {
		// Application translation strings
		messageConfirmDelete: 'Are you sure you want to permanently delete this item?',
		messageLocalStorageNotSupported: 'Local Storage not supported by this browser.',
		messageCanceling: 'Canceling...',
		messageDiscarding: 'Discarding...',
		messageDeleting: 'Deleting...',
		messageLoading: 'Loading...',
		messageRestoring: 'Restoring...',
		messageSaving: 'Saving...',
		messageSending: 'Sending...',
		messageSubmitting: 'Submitting...',
		messagePublishing: 'Publishing...',
		messageUpdating: 'Updating...',
		messageWorking: 'Working...',
		textPleaseWait: 'Please wait...',

		// Validation translation strings
		validateAlphaNum: '%s must only contain letters and numbers',
		validateCcNum: '%s must be a valid credit card number',
		validateSymbols: 'symbols',
		validateDate: '%s is not a valid date',
		validateDateFormat: '%s must be in date format: %s',
		validateDateMax: '%s must be earlier than: %s',
		validateDateMin: '%s must be later than: %s',
		validateEndsWith: '%s must end with: %s',
		validateEndsNotWith: '%s must not end with: %s',
		validateDefault: '%s has an error',
		validateDigits: '%s must consist only of digits',
		validateEmail: '%s is an invalid email address',
		validateEquals: '%s must equal the value: %s',
		validateEqualsNot: '%s must not equal the value: %s',
		validateFloat: '%s must consist of a float value',
		validateInteger: '%s must consist of an integer value',
		validateIp: '%s is an invalid IP address',
		validateLength: '%s must be exactly %s %s',
		validateLengthBetween: '%s must be between %s and %s %s',
		validateLengthMax: '%s must be no longer than %s %s',
		validateLengthMin: '%s must be at least %s %s',
		validateMatchesField: '%s must match the value in field: %s',
		validateMatchesNotField: '%s must not match the value in field: %s',
		validateMatchesRegExp: '%s must match the regular expression: %s',
		validateNumBetween: '%s must be a number between %s and %s%s',
		validateNumMax: '%s must be a number less than%s %s',
		validateNumMin: '%s must be a number greater than%s %s',
		validateFieldIn: '%s must be among these fields: %s',
		validateOrEqualTo: 'or equal to',
		validateRequired: '%s is required',
		validateStartsWith: '%s must start with: %s',
		validateStartsNotWith: '%s must not start with: %s',
		validateUrl: '%s is an invalid url',
		validateWithoutLimits: '(without limits)',
    };
	
    Boutique.Settings.t = function(text) {
        
        return (this.Translations[text] == undefined ? text : this.Translations[text]);
        
    };
    
})();

; (function() {

    'use strict';
            
	Boutique.Utilities = {

		initialized: [],

		init: function() {

			const BU = Boutique.Utilities;

			BU.initBootbox();
			BU.initHelpBlocks();
			BU.initMultiModal();
			BU.setModalScroll();

		},
		
		initBootbox: function() {
			bootbox.setDefaults({
				locale: LOCALE,
				show: true,
				backdrop: true,
				closeButton: false,
				animate: true,
				className: "my-modal"	
			});	
		},
		
		initHelpBlocks: function(o) {

			function helpify(o) {
				$(o).each(
					function() {
						let hb = $(this).find('.help-block');
						let bh = $(this).find('.btn-help');
						if (hb.length) {
							hb.hide();
							bh.show();
							$(this).find('.btn-help').off('click').on('click', 
								function() {
									if (hb.is(':visible')) {
										/*hb.animate({opacity:0,height:'hide'});*/
										hb.hide();
									}
									else {
										hb.animate({opacity:1,height:'show'});
									}
								}
							);
						}
						else {
							bh.hide();
						}
					}
				);
			}
			
			o = ($(o).length) ? $(o) : $('.modal-dialog');
			helpify(o);

		},

		initMultiModal: function() {

			let indexBase = 1060;
			let marginBase = 30;

			// Allow for multiple simultaneous modals
			$(document).on('show.bs.modal', '.modal', function (e) {
				
				let self = $(this);
				let count = $('.modal:visible').length;
				let index = indexBase + (10 * count);
				let margin = ((count + 1) * marginBase) + 'px';

				self.css('z-index', index);
				self.css('margin-top', margin);
				$($('.modal-backdrop.show').not('.modal-stack')[count - 1]).css('z-index', (index - 1)).addClass('modal-stack');

			});	

			// Multi-modal scrolling fix - Re-establishes scrolling on underlying modal when closing top-most modal 
			$(document).on('hidden.bs.modal', '.modal', function() {

				let self = $(this);

				self.css('z-index', indexBase);
				self.css('margin-top', marginBase + 'px');
				$('.modal-backdrop.modal-stack').css('z-index', (indexBase - 1)).removeClass('modal-stack');
				
				if ($('.modal.show').length) {
					$('body').addClass('modal-open');
				}
				else {
					$('body').removeClass('modal-open');
				}

			});

		},

		initSegmentSelect: function(dialog, callback) {
			
			const BU = Boutique.Utilities;
			let seg, controls, segments;
			
			dialog = $(dialog);
			if (dialog.length) {

				controls = dialog.find('.segmented-control button');
				segments = dialog.find('.segment');
				
				controls.off('click').on('click', function() {
					let self = this;
					seg = '#' + $(this).attr('data-navigate');
					controls.add(segments).removeClass('active');
					$(self).add($(seg)).addClass('active');
					BU.initPscroll(seg);
					if (typeof (callback || undefined) === 'function') {
						callback.call(null, self);
					}
				
				});
				
			}
			
		},

		initSelectPicker: function(o, opts) {
			
			const BU = Boutique.Utilities;
			let sa = 'selectpicker-active';
			
			o = o || $('body');
			$(o).find('select.selectpicker').each(function() {
				let self = $(this);
				let defaults = {
					'delay': 0,
					'style': '',
					'iconBase': 'icon',
					'tickIcon': 'icon-check',
					// 20200628 - Commenting liveSearch out for now because it bugs and then no search is available at all
					//'liveSearch': (self.children('option').length > 10) ? true : false,
					'size': 10
				};
				let options = (opts && $.isPlainObject(opts)) ? BU.mergeObjects(defaults, opts) : defaults;
				setTimeout(function() {
					if (self.hasClass(sa)) {
						self.selectpicker('refresh');
					}
					else {
						self.addClass(sa).selectpicker(options).trigger('change');
					}
					if (self.hasClass('select-nested')) {
						BU.initSelectNested(self.parent().parent());	
					}
				}, options['delay']);
			});
			// Remove titles on selectpicker button elements as they are not needed
			$(o).find('button.selectpicker').removeAttr('title');
			
		},
		
		initTooltips: function(o) {
			if (!Modernizr.touch) { 
				let $tb, $tl, $tr, $tt;
				let tbs = ''; // Tooltip Bottom Selectors - Displays below the item
				let tls = ''; // Tooltip Left Selectors - Displays to the left of the item
				let trs = ''; // Tooltip Right Selectors - Displays to the right of the item
				let tts = ''; // Tooltip Top Selectors - Displays above the item

				o = ($(o).length) ? $(o) : $('body');
							
				tbs += '.toolbar a.tt,';
				tbs += '.primary-action a.expand-menu.tt,';
				tbs += '.primary-action .icon.tt,';
				tbs += 'tr a.expand-menu.tt, li a.expand-menu.tt,';
				tbs += 'tr .element-menu .tt, li .element-menu .tt,';
				tbs += 'tr .content-preview.tt,';
				tbs += 'tr th .tt,';
				tbs += 'tr td .tt,';
				tbs += '.block.row .tt,';
				tbs += '.modal-content .tt,';
				tbs += '.input-group-search .tt,';
				tbs += '.modal-full .tt,';
				tbs += '.gallery .thumbs .tt';
				
				tls += '.primary-action .element-menu a.tt,';

				trs += '';
				
				tts += '.editor-actions button .tt,';
				tts += '.editor-iframe-actions button .tt,';

				$tb = $(o).find(rtrim(tbs, ','));
				$tl = $(o).find(rtrim(tls, ','));
				$tr = $(o).find(rtrim(trs, ','));
				$tt = $(o).find(rtrim(tts, ','));

				$tb.addClass('ttb');
				$tl.addClass('ttl');
				$tr.addClass('ttr');
				$tt.addClass('ttt');
				
				$(o).find('.tt.ttb').tooltip({ container: 'body', placement: 'bottom' });
				$(o).find('.tt.ttl').tooltip({ container: 'body', placement: 'left' });
				$(o).find('.tt.ttr').tooltip({ container: 'body', placement: 'right' });
				$(o).find('.tt.ttt').tooltip({ container: 'body', placement: 'top' });
				$tt.add($tb).add($tl).add($tr).removeClass('tt');
			}
		},
		
		intervals: [],
		
		isJSON: function(v) {
			let isJSON = true;
			let json;
			if (typeof v != 'string') {
				v = JSON.stringify(v);
			}
			try {
				json = JSON.parse(v);
			}
			catch(err) {
				isJSON = false;
			}
			return isJSON;
		},
		
		mergeObjects: function(obj1, obj2, mutate) {
			// Merge options object into settings object
			// let settings = { validate: false, limit: 5, name: "foo" };
			// let options  = { validate: true, name: "bar" };
			// jQuery.extend(obj1, obj2);

			// Now the content of settings object is the following:
			// { validate: true, limit: 5, name: "bar" }
			// The above code will mutate the object named settings.

			// If you want to create a new object without modifying either argument, use this:

			// let defaults = { validate: false, limit: 5, name: "foo" };
			// let options = { validate: true, name: "bar" };

			// Merge defaults and options, without modifying defaults 
			// let settings = $.extend({}, defaults, options);

			// The content of settings variable is now the following:
			// {validate: true, limit: 5, name: "bar"}
			// The 'defaults' and 'options' variables remained the same.
			
			mutate = mutate || false;
			
			if (obj1 && obj2) {

				let newObj = {};

				if (mutate) {
					newObj = jQuery.extend(obj1, obj2);
				}
				else {
					newObj = $.extend({}, obj1, obj2);
				}

			}

			return newObj;

		},

		setDialogTitle: function(dialog, id) {

			/* 
				TODO - For full language compatibility, we need to first translate the 
				words below, then run replace and append. But we're not sure that the replace
				enclosers will not conflict with alt characters types from other languages
				so for now we're only calling this function on the English terms.
			*/ 

			if (dialog) {
				let header = dialog.find('.modal-header h3');
				let title = trim(header.text());
				title = title.replace(/(^\s*New\s+|\s+Properties\s*$)/i, '');
				title = (id) ? title + ' Properties' : 'New ' + title;
				header.text(title);
			}

		},

		setModalScroll: function() {

			if ($('.modal.show').length) {
				$('body').addClass('modal-open');
			}
			else {
				$('body').removeClass('modal-open');
			}

		},
		
		timeouts: [],
		
		uid: function() {
			return ('00000' + (Math.random()*Math.pow(36,5) << 0).toString(36)).slice(-5);
		},

		uuid: function() {
			let oUUID = new UUID();
			let sUUID = oUUID.createUUID();
			sUUID = sUUID.replace(/-/g,'');	
			return sUUID;
		},

	};

	$(function() {
		Boutique.Utilities.init();
	});       

})();


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



; (function() {

    'use strict';
            
    Boutique.Storage = {

        /**
         * Decrement an item's value (must be an Integer type)
         *
         * @param   object      os          Storage object
         * @param   string      key         String name of key
         * @access  private     
         * @since   1.0
         */
        _dec: function(os, key) {

            let obj, item;

            if (os && (os === this.Local || os === this.Session)) {
                obj = os.get(key);
                if (typeof obj == 'object' && obj.value) {
                    item = obj.value
                    if (parseInt(item) == item && typeof item != 'object') {
                        item = parseInt(item);
                        return os.set(key, (item - 1));
                    }
                    else {
                        console.error('Error: Value to be decremented [' + item + '] is not of Integer type');
                        return false;
                    }
                }
            }

        }, 

        /**
         * Delete one or all items in the local storage cache
         *
         * @param   object      os          Storage object
         * @param   string      key         Optional name of the key to be deleted. If no key is specified, all items will be deleted.
         * @return  mixed                   Returns true/false if key is present, otherwise null.
         * @access  private     
         * @since   1.0
         */
        _del: function(os, key) {

            let pairs, pair, i, k;

            if (os && (os == this.Local || os == this.Session)) {

                // Delete all items
                if (typeof key === 'undefined') {
                    if (!os.supported) {
                        try {
                            pairs = document.cookie.split(';');
                            for (i = 0; i < pairs.length; i++) {
                                pair = pairs[i].split('=');
                                k = pair[0];
                                $.cookie(k, null);
                            }
                        }
                        catch(e) {
                            return null;
                        }
                    }
                    else {
                        os.cache.clear();
                    }
                }
                // Delete a specific item
                else {
                    if (!os.supported) {
                        try {
                            $.cookie(key, null);
                            return true;
                        }
                        catch(e) {
                            return false;
                        }
                    }
                    os.cache.removeItem(key);
                    return true;
                }
            }
        }, 

        /**
         * Get one or all items in the local storage cache
         *
         * @param   object      os          Storage object
         * @param   string      key         Optional name of the key whose value will be retrieved. If no key is specified, all keys will be returned.
         * @return  mixed                   Returns the value of a specific item or an array of all items.
         * @access  private     
         * @since   1.0
         */
        _get: function(os, key) {

            let items = [];
            let item, pairs, pair, i, j, k;

            if (os && (os === this.Local || os === this.Session)) {
                // Get all items
                if (typeof key === 'undefined') {
                    if (!os.supported) {
                        try {
                            pairs = document.cookie.split(';');
                            for (i = 0; i < pairs.length; i++) {
                                pair = pairs[i].split('=');
                                k = pair[0];
                                items.push({k:k, value:os.rtn($.cookie(k))});
                            }
                        }
                        catch(e) {
                            return null;
                        }
                    }
                    else {
                        for (j in os.cache) {
                            if (j.length) {
                                items.push({k:j, value:os.rtn(os.cache.getItem(j))});
                            }
                        }
                    }
                    return items;
                }
                // Get specific item
                else {
                    if (!os.supported) {
                        try {
                            return os.rtn($.cookie(key));
                        }
                        catch(e) {
                            return null;
                        }
                    }
                    item = os.cache.getItem(key);
                    return os.rtn(item);
                }
            }
        }, 

        /**
         * Retrieve data from either local/session storage or hidden UI element based on name provided
         *
         *
         * @param   object      os          Storage object
         * @param   string      key         Name of the object to be located in storage or the page elements
         * @return  object                  Returns a data object
         * @access  private     
         * @since   1.0
         */
        _getData: function(os, key) {

            const BU = Boutique.Utilities;
            let exp, obj, val = '';

            if (os && (os === this.Local || os === this.Session)) {
                if (key && key != '') {
                    if (os.cache) {
                        obj = os.get(key);
                        if (obj && obj.hasOwnProperty('value') && obj.hasOwnProperty('expires')) {
                            // 20230430 - Check if value is JSON object (stringified) and convert to object if so. Return other types directly.
                            val = (BU.isJSON(obj.value)) ? os.rtn(obj.value) : obj.value;
                            exp = obj.expires;
                        }
                    }
                    else {
                        obj = $('#' + key);
                        if (obj.length && obj.not(':empty')) {
                            val = os.rtn(obj.text());
                            exp = obj.attr('data-expires');
                        }
                    }
                    if (exp && parseInt(exp) < Date.now()) {
                        val = '';
                    }
                }
            }

            return val;

        },
    
        /**
         * Increment an item's value (*must be an integer type)
         *
         * @param   object      os          Storage object
         * @param   string      key         String name of key
         * @access  private     
         * @since   1.0
         */
        _inc: function(os, key) {

            let obj, item;

            if (os && (os === this.Local || os === this.Session)) {
                obj = os.get(key);
                if (obj && obj.hasOwnProperty('value')) {
                    item = obj.value
                    if (parseInt(item) == item && typeof item != 'object') {
                        item = parseInt(item);
                        return os.set(key, (item + 1));
                    }
                    else {
                        console.error('Error: Value to be incremented [' + item + '] is not of Integer type');
                        return false;
                    }
                }
            }
        },

        /**
         * Initialize this object
         *
         * @param   object      os          Storage object
         * @access  private     
         * @since   1.0
         */
        _init: function(os) {

            if (os) {
                if (os === this.Local && this._supported(os)) {
                    os.cache = window.localStorage;
                }
                else if (os === this.Session && this._supported(os)) {
                    os.cache = window.sessionStorage;
                }
            }
        },

        /**
         * Prepare value for storage
         *
         * @param   object      os          Storage object
         * @param   mixed 	    val         Data to be stored
         * @return  string                  Returns a data object
         * @access  private     
         * @since   1.0
         */
        _prepIn: function(os, val) {

            if (os && (os === this.Local || os === this.Session)) {
                // Convert to String
                while (typeof val !== 'string') {
                    val = JSON.stringify(val);
                }
            }

            return val;

        },
    
        /**
         * Prepare value for retrieval
         *
         * @param   object      os          Storage object
         * @param   string      val         Data to be retrieved
         * @return  object                  Returns a data object
         * @access  private     
         * @since   1.0
         */
        _prepOut: function(os, val) {

            if (os && (os === this.Local || os === this.Session)) {
                // Convert to object
                while (typeof val !== 'object') {
                    val = JSON.parse(val);
                }
            }

            return val;

        },
    
        /**
         * Parse value and return the appropriate datatype/value
         *
         * @param   object      os          Storage object
         * @param   string      val     	String results to be parsed
         * @return  mixed                   Returns the resulting value after parsing
         * @access  private     
         * @since   1.0
         */
        _rtn: function(os, val) {

            let valOrig = val;

            if (os && (os === this.Local || os === this.Session)) {
                try {
                    val = os.prepOut(val);
                    if (typeof val == 'undefined') {
                        val = valOrig;
                    }
                    if (val == 'true') {
                        val = true;
                    }
                    if (val == 'false') {
                        val = false;
                    }
                    if (parseFloat(val) == val && typeof val != 'object') {
                        val = parseFloat(val);
                    }
                }
                catch(e) {
                    val = valOrig;
                }
            }
            return val;
        },

        /**
         * Set a value on a specific key
         *
         * @param   object      os          Storage object
         * @param   string      key         String name of key
         * @param   string      val         String value to be assigned
         * @param   int         ttl         Time to live in minutes
         * @return  mixed                   Returns the resulting value after assignment
         * @access  private     
         * @since   1.0
         */
        _set: function(os, key, val, ttl) {
            if (os && (os === this.Local || os === this.Session)) {
                if (!os.supported) {
                    try {
                        $.cookie(key, val, { path: '/', expires: ttl });
                        return val;
                    }
                    catch(e) {
                        console.error(OM.t('messageLocalStorageNotSupported') + ' Error: ' + e);
                    }
                }
                // Store value with expiration
                os.cache.setItem(key, os.prepIn({ created: new Date().toLocaleString(), expires: ttl.getTime(), value: val }));
                // Return only the value (stringified)
                return os.rtn(os.prepIn(val));
            }
        },

        /**
         * Save data to either local/session storage or hidden UI element based on name provided
         *
         *
         * @param   object      os          Storage object
         * @param   string      key         Name of the object to be located in storage or the page elements
         * @param   string      val         Data to be stored
         * @param   int         ttl         Time to live in minutes
         * @return  object                  Returns a data object
         * @access  private     
         * @since   1.0
         */
        _setData: function(os, key, val, ttl) {

            if (os && (os === this.Local || os === this.Session)) {
                if (key && key != '') {
                    // Convert ttl to a valid Date object
                    ttl = os.setExpire(ttl);
                    // If local storage supported, there is no need to Stringify as it's done when calling Set
                    if (os.cache) {
                        val = os.set(key, val, ttl);
                    }
                    // If local storage not supported then we need to Stringify prior to placing in DOM and passing to Rtn
                    else {
                        val = os.prepIn(val);
                        $('footer').append('<div id="' + key + '" data-expires="' + ttl.getTime() + '" class="hidden">' + val + '</div>');
                        val = os.rtn(val);
                    }
                }
                else {
                    console.error('Boutique.Storage.setData() failed because key was missing or invalid!');
                }
            }

            return val;

        },
    
        /**
         * Convert ttl integer value into Date object and set expiration
         *
         * @param   object      os          Storage object
         * @param   int         ttl         Time to live in minutes
         * @return  object                  Returns a date object
         * @access  private     
         * @since   1.0
         */
         _setExpire: function(os, ttl) {

            let expires = new Date();

            if (os && (os === this.Local || os === this.Session)) {
                
                ttl = parseInt(ttl);
                ttl = (ttl > 0) ? ttl : 525600; // One year in minutes - default expiration value
                ttl *= 60 * 1000; // convert to milliseconds
                expires.setTime(expires.getTime() + ttl);

                return expires;
            }

            return null;

        },
    
        /**
         * Determine if various storage types are supported
         *
         * @url     https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
         *
         * @param   object      os          Storage object
         * @return  mixed                   Returns true if supported or a DOMException object if not
         * @access  private     
         * @since   1.0
         */
        _supported: function(os) {
            let x, type, storage;
            if (os) {
                type = (os === this.Local) ? 'localStorage' : ((os === this.Session) ? 'sessionStorage' : null);
                try {
                    x = '__storage_test__';
                    storage = window[type];
                    storage.setItem(x, x);
                    storage.removeItem(x);
                    // Additional check for JSON support before signing off
                    if (typeof window.JSON == 'undefined') {
                        os.supported = false;
                    }
                    else if (os._enabled) {
                        os.supported = true;
                    }
                    return os.supported;
                }
                catch(e) {
                    return e instanceof DOMException && os._enabled && (
                        // Everything except Firefox
                        e.code === 22 || 
                        // Firefox
                        e.code === 1014 || 
                        // Test name field too, because code might not be present (all but Firefox)
                        e.name === 'QuotaExceededError' || 
                        // Firefox
                        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && 
                        // Acknowledge QuotaExceededError only if there's something already stored
                        storage.length !== 0
                    ;
                }
            }
        },

        /**
         * Local Storage Object
         *
         * @return  object                  Returns an Boutique.Storage.Local object and methods
         * @access  public     
         * @since   1.0
         */
        Local: {

            /**
             * Enabled - Used to forcibly disable local or session storage so only DOM storage is used.
             *
             * @var     boolean
             * @access  private     
             * @since   1.0
             */
            _enabled: true,

            /**
             * Cache - Holds data for future additions/modifications/retrieval.
             *
             * @var     mixed
             * @access  public     
             * @since   1.0
             */
            cache: null,

            /**
             * Supported - Dynamically determined based on support criteria provided by the client.
             *
             * @var     boolean
             * @access  public     
             * @since   1.0
             */
            supported: false,

            dec: 		function(key) 		        { return Boutique.Storage._dec(this, key); },
            del: 		function(key) 		        { return Boutique.Storage._del(this, key); },
            get: 		function(key) 		        { return Boutique.Storage._get(this, key); },
            getData: 	function(key) 		        { return Boutique.Storage._getData(this, key); },
            inc: 		function(key) 		        { return Boutique.Storage._inc(this, key); },
            init: 		function() 			        { return Boutique.Storage._init(this); },
            prepIn: 	function(val, ttl) 	        { return Boutique.Storage._prepIn(this, val, ttl); },
            prepOut: 	function(val) 		        { return Boutique.Storage._prepOut(this, val); },
            rtn: 		function(res) 		        { return Boutique.Storage._rtn(this, res); },
            set: 		function(key, val, ttl) 	{ return Boutique.Storage._set(this, key, val, ttl); },
            setData: 	function(key, val, ttl) 	{ return Boutique.Storage._setData(this, key, val, ttl); },
            setExpire:  function(ttl) 		        { return Boutique.Storage._setExpire(this, ttl); },

        },

        /**
         * Session Storage Object
         *
         * @return  object                  Returns an Boutique.Storage.Session object and methods
         * @access  public     
         * @since   1.0
         */
        Session: {

            /**
             * Enabled - Used to forcibly disable local or session storage so only DOM storage is used.
             *
             * @var     boolean
             * @access  private     
             * @since   1.0
             */
            _enabled: true,

            /**
             * Cache - Holds data for future additions/modifications/retrieval.
             *
             * @var     mixed
             * @access  public     
             * @since   1.0
             */
            cache: null,

            /**
             * Supported - Dynamically determined based on support criteria provided by the client.
             *
             * @var     boolean
             * @access  public     
             * @since   1.0
             */
            supported: false,

            dec: 		function(key) 		        { return Boutique.Storage._dec(this, key); },
            del: 		function(key) 		        { return Boutique.Storage._del(this, key); },
            get: 		function(key) 		        { return Boutique.Storage._get(this, key); },
            getData: 	function(key) 		        { return Boutique.Storage._getData(this, key); },
            inc: 		function(key) 		        { return Boutique.Storage._inc(this, key); },
            init: 		function() 			        { return Boutique.Storage._init(this); },
            prepIn: 	function(val, ttl)	        { return Boutique.Storage._prepIn(this, val, ttl); },
            prepOut: 	function(val) 		        { return Boutique.Storage._prepOut(this, val); },
            rtn: 		function(res) 		        { return Boutique.Storage._rtn(this, res); },
            set: 		function(key, val, ttl)	    { return Boutique.Storage._set(this, key, val, ttl); },
            setData: 	function(key, val, ttl) 	{ return Boutique.Storage._setData(this, key, val, ttl); },
            setExpire:  function(ttl) 		        { return Boutique.Storage._setExpire(this, ttl); },
            
        },

    };

    $(function(){
        Boutique.Storage.Local.init();
        Boutique.Storage.Session.init();
    });

})();



; (function() {

    'use strict';
            
	/**
	 * Form field validator
	 *
	 * @package		Boutique
	 * @author		Jeff Todnem
	 * @since 		5.0  
	 */ 
	Boutique.Validator = {

		_arguments 			: {},
		_data 				: null,
		_errors 			: {},
		_errorsToMessage 	: true,
		_fields 			: {},
		_filters 			: {},
		_form				: null,
		_functions 			: {},
		_icons: {
			danger			: 'icon-angry', 
			info			: 'icon-smiley', 
			progress		: 'icon-spinner3 icon-spin',
			success			: 'icon-happy', 
			validation		: 'icon-angry', 
			warning			: 'icon-shocked'
		},
		_ifSet	  			: false,
		_ifNotSet  			: false,
		_messages 			: {},
		_objectName			: 'Boutique.Validator',
		_rules 				: {},
		_validData 			: {},
		
		/**
		 * Parses a form for any data-validate attributes and auto-magically creates
		 * validation rules based on JSON values if present.
		 *
		 * @uses	phpjs.custom.js - is_bool()
		 * @uses	phpjs.custom.js - is_string()
		 *
		 * @param 	object			ov						An object of this type
		 * @return 	object									Returns an object of this type
		 * @since 	5.0
		 */
		_auto: function(ov) {
			ov = ov || this;
			let flds, cnt;
			if (this._form) {
				cnt = 0;
				flds = this._form.find('[data-validate]');
				flds.each(function() {
					let label, rules;
					let fld = $(this);
					let name = fld.attr('name');
					let r, args;
					/* Check for inline field data-label attr first, then default to form-group label */
					if (fld.data('label')) {
						label = fld.data('label');
					}
					else {
						label = fld.closest('.form-group, .form-group-inline').find('label').text();
					}
					if (name) { // Only process elements with a name attribute
						rules = JSON.parse(fld.attr('data-validate'));
						for (r in rules) {
							if (typeof (ov[r] || undefined) === 'function') {
								args = rules[r];
								args = (is_bool(args)) ? [] : ((Array.isArray(args)) ? args : ((is_string(args) || is_numeric(args)) ? [args] : null));
								ov[r].apply(ov, args);
							}
							else {
								console.warn(ov._objectName + ' encountered an invalid rule declaration: [' + r + ']'); 	
							}
						}
						ov.validate(name, label);
						cnt++;
					}
				});
				console.log(this._objectName + ' set up rules for [' + cnt + '] items successfully.');
				this.displayErrors();
			}
			return this;
		},

		/**
		 * Recursively apply filters to a value
		 *
		 * @param 	mixed 				val 				Reference
		 * @return 	void
		 * @since 	5.0
		 */
		_applyFilter: function(val) {
			if ($.isPlainObject(val) || Array.isArray(val)) {
				for (v in val) {
					this._applyFilter(val[v]);
				}
			}
			else {
				for (f in this._filters) {
					val = filters[f](val);
				}
			}
		},

		/**
		 * Applies filters based on a data key
		 *
		 * @param 	string 				key
		 * @return 	void
		 * @since 	5.0
		 */
		_applyFilters: function(key) {
			this._applyFilter(this._data[key]);
		},

		/**
		 * Get a default date formatting string if no other format is requested
		 *
		 * @return 	string
		 * @since 	5.0
		 */
		_getDefaultDateFormat: function() {
			return DATETIME_FORMAT_YMDHIS;
		},

		/**
		 * Get default error message.
		 *
		 * @uses	phpjs.custom.js - sprintf
		 *
		 * @param 	string 				rule
		 * @param 	array 				args
		 * @return 	string
		 * @since 	5.0
		 */
		_getDefaultMessage: function(rule, args) {

			const BS = Boutique.Settings;
			let message = '';
			
			args = args || null;
			
			switch(rule) {
				
				case 'lengthBetween':
					message = sprintf(this._getTranslation(rule), '%s', args[0], args[1], (args[2] || this._getTranslation('symbols')));
					break;

				case 'matchesField':
				case 'matchesNotField':
					message = sprintf(this._getTranslation(rule), '%s', args[1]);
					break;

				case 'numBetween':
					message = sprintf(this._getTranslation(rule), '%s', args[0], args[1], ((args[2] === false) ? ' ' + this._getTranslation('withoutLimits') : ''));
					break;

				case 'numMax':
				case 'numMin':
					message = sprintf(this._getTranslation(rule), '%s', ((args[1]) ? ' ' + this._getTranslation('orEqualTo') : ''), args[0]);
					break;

				case 'fieldIn':
					message = sprintf(this._getTranslation(rule), '%s', args[0].toString().split(/\s*,\s*/));
					break;

				case 'length':
				case 'lengthMax':
				case 'lengthMin':
					message = sprintf(this._getTranslation(rule), '%s', args[0], (args[1] || this._getTranslation('symbols')));
					break;

				case 'dateFormat':
				case 'dateMax':
				case 'dateMin':
				case 'endsWith':
				case 'endsNotWith':
				case 'equals':
				case 'equalsNot':
				case 'matchesRegExp':
				case 'startsWith':
				case 'startsNotWith':
					message = sprintf(this._getTranslation(rule), '%s', args[0]);
					break;

				case 'alphaNum':
				case 'ccNum':
				case 'date':
				case 'digits':
				case 'email':
				case 'float':
				case 'integer':
				case 'ip':
				case 'required':
				case 'url':
					message = this._getTranslation(rule);
					break;

				default:
					message = this._getTranslation('default');
					break;
			}
			return message;
		},

		/**
		 * Get translated error message.
		 *
		 * @param 	string 				rule
		 * @return 	string
		 * @since 	5.0
		 */
		_getTranslation: function(rule) {
			const BS = Boutique.Settings;
			return BS.t('validate' + ucfirst(rule));
		},
		
		/**
		 * Retrieve values from numeric and associative multi-dimensional arrays.
		 *
		 * @param 	string 				key
		 * @return 	mixed
		 * @since 	5.0
		 */
		_getVal: function(key) {
			// handle multi-dimensional arrays
			if (key.indexOf('.') > -1) {
				arrData = null;
				keys = key.split('.');
				keyLen = keys.length;
				for (i = 0; i < keyLen; ++i) {
					if (trim(keys[i]) == '') {
						return false;
					}
					else {
						if (arrData === null) {
							if (!$.isset(this._data[keys[i]])) {
								return false;
							}
							arrData = this._data[keys[i]];
						}
						else {
							if (!$.isset(arrData[keys[i]])) {
								return false;
							}
							arrData = arrData[keys[i]];
						}
					}
				}
				return arrData;
			}
			else {
				return ($.isset(this._data[key])) ? this._data[key] : false;
			}
		},

		/**
		 * Register error.
		 *
		 * @uses	phpjs.custom.js - sprintf()
		 *
		 * @param 	string 				rule
		 * @param 	string 				key
		 * @param 	string 				message			Validation results message
		 * @return 	void
		 * @since 	5.0
		 */
		_registerError: function(rule, key, message) {
			rule = rule || 'default';
			message = message || null;
			if (!message) {
				message = this._messages[rule];
			}
			message = sprintf(message, this._fields[key]);
			this._errors[key] = message;
		},

		/**
		 * Reset rules and filters
		 *
		 * @return 	void
		 * @since 	5.0
		 */
		_reset: function() {
			this._ifSet = false;
			this._ifNotSet = false;
			this._rules = {};
			this._filters = {};
		},

		/**
		 * Add or remove a name attribute to one or more fields based on a selector.
		 *
		 * Allows field names and values to be captured for validation purposes only.
		 * For obvious security reasons, all name attributes must be removed prior to 
		 * any form submissions since the only reason they are absent to begin with is
		 * to prevent the data in those fields from transmitting over an unsecure
		 * network.
		 * 
		 * @param 	boolean				add					Whether to add (true) or remove (false) the name attribute
		 * @param 	string				nameAttr			The attribute selector whose value will be used to assign a name to each selected :input fields. 
		 * @return 	void
		 * @since 	5.0
		 */
		_setName: function(add, nameAttr) {
			add = add || false;
			nameAttr = nameAttr || false;
			if (this._form && nameAttr) {
				this._form.find(':input[' + nameAttr + ']').each(function() {
					$(this).removeAttr('name');
					if (add) {
						$(this).attr('name', $(this).attr(nameAttr))
						;
					}
				});
			}
		},

		/**
		 * Recursively validates a value
		 *
		 * @param 	string 				key
		 * @param 	mixed 				val
		 * @return 	bool
		 * @since 	5.0
		 */
		_validate: function(key, val, recursive) {
			recursive = recursive || false;
			let v, r, fnc, args, valid;
			if (recursive && ($.isPlainObject(val) || Array.isArray(val))) {
				// run validations on each element of the array
				for (v in val) {
					if (!this._validate(key, val[v], recursive)) {
						// halt validation for this value.
						return false;
					}
				}
				return true;
			}
			else {
				// try each rule function
				for (r in this._rules) {
					if (this._rules[r]) {
						fnc = this._functions[r];
						args = this._arguments[r]; // Arguments of rule
						valid = (!args) ? fnc(key, val) : fnc(key, val, args);
						if (valid === false) {
							this._registerError(r, key);
							this._reset();
							return false;
						}
					}
				}
				this._validData[key] = val;
				return true;
			}
		},

		/**
		 * Field must contain only letters and numbers
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this type
		 * @since 	5.0
		 */
		alphaNum: function(message) {
			message = message || null;
			this.setRule('alphaNum', function(key, val) {
				return (!val.toString().match(/[^a-z0-9]/i));
			}, message);
			return this;
		},

		/**
		 * Constructor
		 * 
		 * Define values to validate.
		 *
		 * @param 	object|string		frm					jQuery form object or selector string for a form
		 * @return 	object									Returns an object of this type
		 * @since 	5.0
		 */
		build: function(frm, auto) {
			frm = $(frm).closest('form');
			auto = $.isset(auto) || true;
			let data;
			let msg = this._objectName + ' object created ';
			if (frm.length) {
				this._form = frm;
				data = this._form.cerealizeArray();
				this.setData(data);
				if (auto) {
					this._auto(this);
					msg += 'and auto-validated ';
				}
			}
			return this;
		},

		/**
		 * Callback method
		 *
		 * @uses 	phpjs.custom.js - array_merge
		 *
		 * @param   string  			name
		 * @param   mixed   			function
		 * @param   mixed   			params
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		callback: function(callback, message, params) {

			const BU = Boutique.Utilities;

			let name;
			
			message = message || '';
			params = params || [];
			
			if (typeof (callback || undefined) === 'function') {
				// needs a unique name to avoid collisions in the rules array
				name = 'callback_' + BU.uid();
				this.setRule(
					name, 
					function(key, value) { 
						// Creates merged arguments array with validation target as first argument
						args = array_merge([value], ((Array.isArray(params)) ? params : [params]));
						return callback.call(this, args);
					}, 
					message, 
					params
				);

			}
			else {
				console.warn(callback + ' is not callable!');
			}

			return this;
		},

		/**
		 * Field has to be a valid credit card number format.
		 *
		 * @param 	string 				message			Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		ccNum: function(message) { 
			message = message || null;
			this.setRule('ccNum', function(key, val) {
				
				let length, sum, weight, i, digit, mod;
				
				val = val.toString();
				val = val.replace(/\s+/g, '');
				length = val.length;

				if (length < 13 || length > 19) {
					return false;
				}

				sum = 0;
				weight = 2;

				for (i = length - 2; i >= 0; i--) {
					digit = weight * val[i];
					sum += Math.floor(digit / 10) + digit % 10;
					weight = weight % 2 + 1;
				}

				mod = (10 - sum % 10) % 10;

				return (mod == val[length - 1]);
			}, message);
			return this;
		},

		/**
		 * Clear all validation error messages
		 *
		 * @param 	object|string		frm					jQuery form object or selector string for a form (optional)
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		clearErrors: function(frm) { 
			frm = frm || this._form;
			frm = $(frm).closest('form');
			if (frm.length) {
				frm.find('.segmented-control button[data-navigate]').removeClass('has-error-boutique');
				frm.find('.form-control-feedback-block').remove();
			}
			this._reset();
			return this;
		},

		/**
		 * Field has to be a valid date.
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		date: function(message) { 
			message = message || null;
			this.setRule('date', function(key, val) {
				const BV = Boutique.Validator;
				return BV.isDate(val);
			}, message);
			return this;
		},

		/**
		 * Field has to have a value that matches the specified datetime string format.
		 *
		 * @param 	string 				format				Date-compatible formatting string
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		dateFormat: function(format, message) { 
			format = format || this._getDefaultDateFormat();
			message = message || null;
			this.setRule('dateFormat', function(key, val) {
				let df = new DateFormatter();
				return df.formatDate(val, format);
			}, message, [format]);
			return this;
		},

		/**
		 * Field has to be a date earlier than or equal to X.
		 *
		 * @param 	string|int	 		date 				Date used for limit comparison
		 * @param 	string 				format				Date-compatible formatting string
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		dateMax: function(date, format, message) { 
			date = date || null;
			format = format || this._getDefaultDateFormat();
			message = message || null;
			date = new Date(date);
			let df = new DateFormatter();
			date = df.formatDate(date, format);
			this.setRule('dateMax', function(key, val, args) {
				const BV = Boutique.Validator;
				let maxDate, currDate;
				if (BV.isDate(val)) {
					currDate = new Date(val);
					maxDate = new Date(args[0]);
					return (maxDate >= currDate);
				}
				return false;
			}, message, [date, format]);			
			return this;
		},

		/**
		 * Field has to be a date later than or equal to X.
		 *
		 * @param 	string|int	 		date 				Date used for limit comparison
		 * @param 	string 				format				Date-compatible formatting string
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		dateMin: function(date, format, message) { 
			let df = new DateFormatter();
			date = date || null;
			format = format || this._getDefaultDateFormat();
			message = message || null;
			date = new Date(date);
			date = df.formatDate(date, format);
			this.setRule('dateMin', function(key, val, args) {
				const BV = Boutique.Validator;
				let minDate, currDate;
				if (BV.isDate(val)) {
					currDate = new Date(val);
					minDate = new Date(args[0]);
					return (minDate <= currDate);
				}
				return false;
			}, message, [date, format]);			
			return this;
		},

		/**
		 * Every character in field, if completed, must be a digit.
		 * This is just like integer(), except there is no upper limit.
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		digits: function(message) { 
			message = message || null;
			this.setRule('digits', function(key, val) {
				val = val.toString();
				return (val.length === 0 || val.match(/^[0-9]+$/));
			}, message);
			return this;
		},

		/**
		 * Display validation error messages (an alternative to displayFeedback)
		 *
		 * @uses	phpjs.custom.js - in_array()
		 *
		 * @param 	object				errors				jQuery form object or selector string for a form (optional)
		 * @param 	object|string		frm					jQuery form object or selector string for a form (optional)
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		displayErrors: function(errors, frm) { 
			errors = errors || this.getAllErrors();
			frm = frm || this._form;
			frm = $(frm).closest('form');
			let e, fld, frmgrp, msg, s, seg, segId;
			let errsegs = [];
			let errorsLen = this.getObjectSize(errors);
			if (frm.length) {
				frm.find('.segmented-control button[data-navigate]').removeClass('has-error-boutique');
				frm.find('.form-control-feedback-block').remove();
				if (errorsLen) {
					console.warn('Validation encountered errors with the following fields:');
					for (e in errors) {
						fld = frm.find('[name="' + e + '"]');
						if (fld.length === 0) {
							fld = frm.find('[data-name="' + e + '"]');
						}
						if (fld.length) {
							console.warn('    * ' + e);
							seg = fld.parents('.segment');
							frmgrp = fld.closest('.form-group, .form-group-inline');
							msg = '';
							msg += '<div class="form-control-feedback-block status boutique-message-danger">';
							msg += '<a data-focus="' + e + '">' + errors[e] + '</a>';
							msg += '</div>';
							frmgrp.children('div[class*="col-"]').append(msg);
							if (fld.parents('.segment').parents(frm).length) {
								segId = fld.parents('.segment').attr('id');
								if (!in_array(segId, errsegs)) {
									errsegs.push(segId);
								}
							}
						}
					}
					frm.find('.form-control-feedback-block a').each(function() {
						$(this).off('click').on('click', function() {
							$(this).closest('form').find('[name="' + $(this).attr('data-focus') +'"]').trigger('focus') ;
						});
					});
					/* Check for segment presence and switch to first segment with error */
					for (s in errsegs) {
						frm.find('.segmented-control button[data-navigate="' + errsegs[s] + '"]').addClass('has-error-boutique');
					}
					frm.find('.segmented-control button[data-navigate="' + errsegs[0] + '"]').trigger('click');
					frm.find('.form-control-feedback-block').animate({height:'show', opacity:1});
				}
			}
			return this;
		},

		/**
		 * Display validation feedback messages
		 *
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		displayFeedback: function() { 
			let err, errors;
			if (this._form) {
				this._form.find('.form-control-feedback, .form-control-feedback-block').remove();
				this._form.find('.has-error').removeClass('has-error has-feedback');
				errors = this.getAllErrors();
				for (e in errors) {
					fld = this._form.find(':input[name="' + e +'"]');
					frmgrp = fld.closest('.form-group');
					frmgrp.addClass('has-error has-feedback');
					fld.closest('div').append('<div class="form-control-feedback-block">' + errors[e] + '</div>');
					fld.closest('div').append('<i class="form-control-feedback icon ' + this._icons.danger + '"></i>');
				}
			}
			return this;
		},

		/**
		 * Field, if completed, has to be a valid email address.
		 *
		 * @uses	phpjs.custom.js - strrpos
		 *
		 * @param 	string 				message			Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		email: function(message) { 
			message = message || null;
			this.setRule('email', function(key, val) {
				let isValid, atIndex, domain, local, localLen, domainLen;
				val = trim(val);
				if (val.length == 0) {
					return true;
				}
				isValid = true;
				atIndex = strrpos(val, '@');
				if (atIndex === false) {
					isValid = false;
				}
				else {
					domain = val.substr(atIndex+1);
					local = val.substr(0, atIndex);
					localLen = local.length;
					domainLen = domain.length;
					if (localLen < 1 || localLen > 64) {
						isValid = false;
					}
					else if (domainLen < 1 || domainLen > 255) {
						// domain part length exceeded
						isValid = false;
					}
					else if (local[0] == '.' || local[localLen-1] == '.') {
						// local part starts or ends with '.'
						isValid = false;
					}
					else if (local.match(/\.\./)) {
						// local part has two consecutive dots
						isValid = false;
					}
					else if (!domain.match(/^[A-Za-z0-9\-\.]+/)) {
						// character not valid in domain part
						isValid = false;
					}
					else if (domain.match(/\.\./)) {
						// domain part has two consecutive dots
						isValid = false;
					}
					else if (!local.replace(/\\/g, '').match(/^(\\.|[A-Za-z0-9!#%&`_=\/\'*+?^{}|~.-])+/)) {
						// character not valid in local part unless
						// local part is quoted
						if (!local.replace(/\\\\/g, '').match(/^"(\\\\"|[^"])+"/)) {
							isValid = false;
						}
					}
				}
				return isValid;
			}, message);
			return this;
		},

		/**
		 * Field must not end with a specific substring.
		 *
		 * @param 	string 				subst
		 * @param 	string 				message			Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		endsNotWith: function(subst, message) { 
			message = message || null;
			this.setRule('endsNotWith', function(key, val, args) {
				val = trim(val);
				subst = args[0];
				return (val.length === 0 || val.substr(-subst.length) !== subst);
			}, message, [subst]);
			return this;
		},

		/**
		 * Field must end with a specific substring.
		 *
		 * @param 	string 				subst
		 * @param 	string 				message			Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		endsWith: function(subst, message) { 
			message = message || null;
			this.setRule('endsWith', function(key, val, args) {
				val = trim(val);
				subst = args[0];
				return (val.length === 0 || val.substr(-subst.length) === subst);
			}, message, [subst]);
			return this;
		},

		/**
		 * Field value matches the pre-assigned value in the rule
		 *
		 * @param 	string 				value
		 * @param 	string 				label
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		equals: function(value, label, message) { 
			label = label || '';
			message = message || null;
			this.setRule('equals', function(key, val, args) {
				val = trim(val);
				return (args[0].toString() === val);
			}, message, [value, label]);
			return this;
		},

		/**
		 * Field value does not match the pre-assigned value in the rule
		 *
		 * @param 	string 				value
		 * @param 	string 				label
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		equalsNot: function(value, label, message) {
			label = label || '';
			message = message || null;
			this.setRule('equalsNot', function(key, val, args) {
				val = trim(val);
				return (args[0].toString() !== val);
			}, message, [value, label]);
			return this;
		},

		/**
		 * Field has to be one of the allowed ones.
		 *
		 * @uses	phpjs.custom.js - in_array
		 * @uses	phpjs.custom.js - is_string
		 *
		 * @param 	string|array 		allowed 			Allowed values.
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		fieldIn: function(allowed, message) { 
			message = message || null;
			if (is_string(allowed)) {
				allowed = allowed.split(/\s*,\s*/);
			}
			this.setRule('fieldIn', function(key, val, args) {
				return in_array(val, args[0]);
			}, message, [allowed]);
			return this;
		},

		/**
		 * Add a filter callback for the data
		 *
		 * @param 	mixed 				callback
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		filter: function(callback) {
			if (typeof (callback || undefined) === 'function') {
				this._filters.push(callback);
			}
			return this;
		},

		/**
		 * Field must contain a valid float value.
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		float: function(message) { 
			message = message || null;
			this.setRule('float', function(key, val) {
				const BV = Boutique.Validator;
				return BV.isFloat(val);
			}, message);
			return this;
		},

		/**
		 * Get all errors.
		 *
		 * @uses	phpjs.custom.js - array_values
		 *
		 * @return 	array
		 * @since 	5.0
		 */
		getAllErrors: function(keys) {
			keys = $.isset(keys) || true;
			return (keys == true) ? this._errors : array_values(this._errors);
		},

		/**
		 * Get specific error.
		 *
		 * @param 	string 				field
		 * @return 	string
		 * @since 	5.0
		 */
		getError: function(field) {
			return this._errors[field];
		},

		/**
		 * Gets the length of an associative array or object with properties
		 *
		 * @return 	int
		 * @since 	5.0
		 */
		getObjectSize: function(obj) {
			let size = 0, key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					size++;
				}
			}
			return size;
		},

		/**
		 * Get valid data
		 *
		 * @return 	array
		 * @since 	5.0
		 */
		getValidData: function() {
			return this._validData;
		},

		/**
		 * Whether errors have been found.
		 *
		 * @return 	bool
		 * @since 	5.0
		 */
		hasErrors: function() {
			return (this.getObjectSize(this._errors) > 0);
		},

		/**
		 * Enable validation only if a value is not present in one or more fields
		 * 
		 * @uses	phpjs.custom.js - is_string()
		 *
		 * @param 	array|string 		flds
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		ifNotSet: function(flds) {
			this._ifNotSet = (Array.isArray(flds)) ? flds : ((is_string(flds)) ? flds.split(/\s*,\s*/) : true);
			return this;
		},

		/**
		 * Enable validation only if a value is present in one or more fields
		 * 
		 * @uses	phpjs.custom.js - is_string()
		 *
		 * @param 	array|string 		flds
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		ifSet: function(flds) {
			this._ifSet = (Array.isArray(flds)) ? flds : ((is_string(flds)) ? flds.split(/\s*,\s*/) : true);
			return this;
		},

		/**
		 * Field must contain a valid integer value.
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		integer: function(message) { 
			message = message || null;
			this.setRule('integer', function(key, val) {
				const BV = Boutique.Validator;
				return BV.isInteger(val);
			}, message);
			return this;
		},

		/**
		 * Field has to be valid IP address.
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		ip: function(message) { 
			message = message || null;
			this.setRule('ip', function(key, val) {
				if (trim(val).length === 0) {
					return true;
				}
				else if (trim(val).match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
					segs = trim(val).split('.');
					for (s in segs) {
						if (segs[s] < 0 || segs[s] > 255) {
							return false;
						}
					}
					return true;
				}
				return false;
			}, message);
			return this;
		},

		/**
		 * Check date values to ensure they are valid
		 *
		 * @param 	string 				val
		 * @return 	boolean
		 * @since 	5.0
		 */
		isDate: function(val) {
			let msgInvalid = 'Value passed to ' + this._objectName + '.isDate() is not a valid date format';
			let dt, results;
			if (trim(val).length === 0) {
				return true;
			}
			try {
				dt = new Date(val);
				return dt instanceof Date && !isNaN(dt.valueOf());
			} 
			catch(e) {
				console.warn(msgInvalid);
				return false;
			}
		},

		/**
		 * Check to ensure value is of type float
		 *
		 * @param 	float 				val
		 * @return 	boolean
		 * @since 	5.0
		 */
		isFloat: function(val) {
			let valString = trim(val);
			let valFloat = parseFloat(val);
			return (valString === valFloat.toString() && valFloat === +valFloat && valFloat !== (valFloat|0));	
		},

		/**
		 * Check to ensure value is of type integer
		 *
		 * @param 	int 				val
		 * @return 	boolean
		 * @since 	5.0
		 */
		isInteger: function(val) {
			let valString = trim(val);
			let valInt = parseInt(val);
			return (valString === valInt.toString() && valInt === +valInt && valInt === (valInt|0));	
		},

		/**
		 * Field has to be X symbols long.
		 *
		 * @param 	int 				len
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		length: function(len, message) { 
			message = message || null;
			this.setRule('length', function(key, val, args) {
				return (trim(val).length == args[0]);
			}, message, [len]);
			return this;
		},

		/**
		 * Field has to be between minlength and maxlength symbols long.
		 *
		 * @param   int 				minlength
		 * @param   int 				maxlength
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		lengthBetween: function(minlength, maxlength, message) { 
			message = message || null;
			message = (!message) ? this._getDefaultMessage('lengthBetween', [minlength, maxlength]) : null;
			this.lengthMin(minlength, message).lengthMax(maxlength, message);
			return this;
		},

		/**
		 * Field has to be less than or equal to X symbols long.
		 *
		 * @param 	int 				len
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		lengthMax: function(len, message) { 
			message = message || null;
			this.setRule('lengthMax', function(key, val, args) {
				return !(trim(val).length > args[0]);
			}, message, [len]);
			return this;
		},

		/**
		 * Field has to be greater than or equal to X symbols long.
		 *
		 * @param 	int 				len
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		lengthMin: function(len, message) { 
			message = message || null;
			this.setRule('lengthMin', function(key, val, args) {
				return !(trim(val).length < args[0]);
			}, message, [len]);
			return this;
		},

		/**
		 * Field value is the same as another one (password comparison etc).
		 *
		 * @param 	string 				field
		 * @param 	string 				label
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		matchesField: function(field, label, message) {
			label = label || '';
			message = message || null;
			this.setRule('matchesField', function(key, val, args) {
				val = trim(val);
				return (args[0].toString() === val);
			}, message, [this._getVal(field), label]);
			return this;
		},

		/**
		 * Field value is not the same as another one (avoid duplicated values).
		 *
		 * @param 	string 				field
		 * @param 	string 				label
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		matchesNotField: function(field, label, message) {
			label = label || '';
			message = message || null;
			this.setRule('matchesNotField', function(key, val, args) {
				val = trim(val);
				return (args[0].toString() !== val);
			}, message, [this._getVal(field), label]);
			return this;
		},

		/**
		 * Field value matches a pre-assigned regular expression
		 *
		 * @param 	string 				regexp
		 * @param 	string 				label
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		matchesRegExp: function(regexp, label, message) {
			label = label || '';
			message = message || null;
			this.setRule('matchesRegExp', function(key, val, args) {
				let globs = 'g';
				let regex = args[0].toString();
				// Format in JS is a bit different so let's make it compatible...
				if (regex.match(new RegExp("i$"))) {
					globs += 'i';
					regex = regex.slice(0, -1);
				}
				// Strip separators
				regex = regex.slice(1, -1);
				console.log('... Validator is now matching against the following regular expression string: "' + val + '".match(new RegExp("' + regex + '", "' + globs + '"))');
				val = trim(val);
				return (val.match(new RegExp(regex, globs)) !== null);
			}, message, [regexp, label]);
			return this;
		},

		/**
		 * Field must be a number between X and Y.
		 *
		 * @param 	numeric 			min
		 * @param 	numeric 			max
		 * @param 	bool 				include 			Whether to include limit value.
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		numBetween: function(min, max, include, message) {
			include = $.isset(include) || true;
			message = message || null;
			message = this._getDefaultMessage('numBetween', [min, max, include]);
			this.numMin(min, include, message).numMax(max, include, message);
			return this;
		},

		/**
		 * Field must be a number greater than [or equal to] X.
		 *
		 * @param 	numeric 			limit
		 * @param 	bool 				include 			Whether to include limit value.
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		numMax: function(limit, include, message) {
			include = $.isset(include) || true; 
			message = message || null;
			this.setRule('numMax', function(key, val, args) {
				let inc;
				if (val.length === 0) {
					return true;
				}
				val = parseFloat(val);
				limit = parseFloat(args[0]);
				inc = Boolean(args[1]);
				return (val < limit || (inc === true && val === limit));
			}, message, [limit, include]);
			return this;
		},

		/**
		 * Field must be a number greater than [or equal to] X.
		 *
		 * @param numeric limit
		 * @param 	bool 				include 			Whether to include limit value.
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		numMin: function(limit, include, message) { 
			include = $.isset(include) || true; 
			message = message || null;
			this.setRule('numMin', function(key, val, args) {
				let inc;
				if (val.length === 0) {
					return true;
				}
				val = parseFloat(val);
				limit = parseFloat(args[0]);
				inc = Boolean(args[1]);
				return (val > limit || (inc === true && val === limit));
			}, message, [limit, include]);
			return this;
		},

		/**
		 * Field must be filled in.
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		required: function(message) { 
			message = message || null;
			this.setRule('required', function(key, val) {
				if (typeof val === 'string') {
					val = trim(val);
				}
				return ($.isset(val) && val !== false && val !== '');
			}, message);
			return this;
		},

		/**
		 * Set the data to be validated
		 *
		 * @param 	mixed 				data
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		setData: function(data) {
			this._data = data;
			this._errors = {};
			return this;
		},

		/**
		 * Set rule.
		 *
		 * @uses	phpjs.custom.js - is_string()
		 *
		 * @param 	string 				rule
		 * @param 	closure 			fnc
		 * @param 	string 				message				Validation results message
		 * @param 	array 				args
		 * @return 	void
		 * @since 	5.0
		 */
		setRule: function(rule, fnc, message, args) {
			message = message || '';
			args = args || [];
			if (!$.isset(this._rules[rule])) {
				this._rules[rule] = true;
				if (!$.isset(this._functions[rule])) {
					if (!typeof (fnc || undefined) === 'function') {
						console.warn('Invalid function for rule: ' + rule);
					}
					this._functions[rule] = fnc;
				}
				this._arguments[rule] = args; // Specific arguments for rule
				this._messages[rule] = (is_string(message) && trim(message) != '') ? message : this._getDefaultMessage(rule, args);
			}
		},

		/**
		 * Field must NOT start with a specific substring.
		 *
		 * @param 	string 				subst
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		startsNotWith: function(subst, message) { 
			message = message || null;
			this.setRule('startsNotWith', function(key, val, args) {
				val = trim(val);
				subst = args[0];
				return (val.length === 0 || val.substr(0, subst.length) !== subst);
			}, message, [subst]);
			return this;
		},

		/**
		 * Field must start with a specific substring.
		 *
		 * @param 	string 				subst
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		startsWith: function(subst, message) { 
			message = message || null;
			this.setRule('startsWith', function(key, val, args) {
				val = trim(val);
				subst = args[0];
				return (val.length === 0 || val.substr(0, subst.length) === subst);
			}, message, [subst]);
			return this;
		},

		/**
		 * Field has to be valid internet address.
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		url: function(message) { 
			message = message || null;
			this.setRule('url', function(key, val) {
				val = trim(val);
				return (val.length === 0 || 
					val.match(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i)
				);
			}, message);
			return this;
		},

		/**
		 * Validate
		 *
		 * @uses	phpjs.custom.js - empty()
		 *
		 * @param 	string 				key
		 * @param 	string 				label
		 * @param	boolean				recursive
		 * @return 	bool
		 * @since 	5.0
		 */
		validate: function(key, label, recursive) {
			label = label || '';
			recursive = recursive || false;
			let validate = true;
			let f, flds, val;
			if (this._ifSet !== false) {
				validate = false;
				flds = (Array.isArray(this._ifSet)) ? this._ifSet : [key];
				for (f in flds) {
					if (!empty(this._data[flds[f]])) {
						validate = true;
					}
				}
			}
			if (this._ifNotSet !== false) {
				flds = (Array.isArray(this._ifNotSet)) ? this._ifNotSet : [key];
				for (f in flds) {
					if (!empty(this._data[flds[f]])) {
						validate = false;
					}
				}
			}
			if (validate) {
				// set up field name for error message
				this._fields[key] = (!label) ? 'The field named "' + key + '"' : label;

				// apply filters to the data
				this._applyFilters(key);
		
				val = this._getVal(key);
		
				// validate the piece of data
				this._validate(key, val, recursive);
			}
			// reset rules
			this._reset();
			return val;
		},

		/**
		 * Validate if a value is not present in one or more fields
		 *
		 * @param 	string 				key
		 * @param 	string 				label
		 * @param	boolean				recursive
		 * @return 	bool
		 * @since 	5.0
		 */
		validateIfNotSet: function(key, label, recursive) {
			return this.ifNotSet().validate(key, label, recursive);
		},
		
		/**
		 * Validate if a value is present in one or more fields
		 *
		 * @param 	string 				key
		 * @param 	string 				label
		 * @param	boolean				recursive
		 * @return 	bool
		 * @since 	5.0
		 */
		validateIfSet: function(key, label, recursive) {
			return this.ifSet().validate(key, label, recursive);
		},
		
	};

})();



; (function() {

    'use strict';
	
	Boutique.Controllers.Product = {
		
		action: null,
		block: null,
		lastId: null,
		prefix: '#product',
		
		bindEvents: function() {

			const BCP = Boutique.Controllers.Product;
			
			$(BCP.prefix + '_table, ' + BCP.prefix + '_show').off('click').on('click', function(e) {

				BCP.show(e);

			});
			
			$(BCP.prefix + '_add').off('click').on('click', function() {
				
				BCP.save(this);
				
			});

			$(BCP.prefix + '_upd').off('click').on('click', function() {
				
				BCP.save(this);
				
			});

			$(BCP.prefix + '_del').off('click').on('click', function() {
				
				BCP.remove(this);
				
			});

		},
		
		delete: function(id) {

			const BCP = Boutique.Controllers.Product;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;
			
			if (id) {
			
				$.ajax({
					type: 'delete',
					url: API_PATH + '/products/' + id,
					data: BCP.formWrite.cerealize(),
					beforeSend: function() {
						BM.progress(BS.t('messageDeleting'), BCP.block);
					},
					success: function(data, status, xhr) {
						BCP.set(data, status, xhr);
					},
					error: function(data, status, xhr) {
						BM.response(data, status, xhr, BCP.block);
					}
				});
				return false;
			}

		},
		
		duplicate: function() {
			
			const BCP = Boutique.Controllers.Product;
						
			BCP.itemId = null;
			$(BCP.formWrite).find('#id').val('');
			
		},
		
		edit: function(callback) {
			
			const BCP = Boutique.Controllers.Product;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;


			if (BCP.itemId) {

				$.ajax({
					type: 'get',
					url: API_PATH + '/products/' + BCP.itemId,
					beforeSend: function() {
						BM.progress(BS.t('messageLoading'), BCP.block);
					},
					success: function(data, status, xhr) {
						BCP.formWrite.decerealize(data);
						BM.hide(BCP.block);
						
						BCP.lastId = BCP.itemId;
						
						if (typeof (callback || undefined) === 'function') {
							callback.call();
						}
					},
					error: function(data, status, xhr) {
						BM.response(data, status, xhr, BCP.block);
					}
				});
			}
			
		},
		
		hide: function() {
			
			const BCP = Boutique.Controllers.Product;
			
			BCP.dialog.modal('hide');

		},

		index: function() {
			
			const BCP = Boutique.Controllers.Product;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;

			BCP.block = $('body');

			$.ajax({
				type: 'get',
				url: API_PATH + '/products',
				data: BCP.formList.cerealize(),
				beforeSend: function() {
					BM.progress(BS.t('messageLoading'), BCP.block);
				},
				success: function(data, status, xhr) {
					BCP.formList.find('tbody').html(data);		
					BM.hide(BCP.block);
				},
				error: function(data, status, xhr) {
					BM.response(data, status, xhr, BCP.block);
				}
			});
			
		},

		init: function() {

			const BCP = Boutique.Controllers.Product;
			
			BCP.dialog = $(BCP.prefix + '_dialog');
			BCP.formList = $(BCP.prefix + '_form_list');
			BCP.formWrite = $(BCP.prefix + '_form_write');
			
			BCP.action = null;
			BCP.hide();
			BCP.bindEvents();
			BCP.index();
			
		},

		remove: function(o) {

			const BCP = Boutique.Controllers.Product;
			const BS = Boutique.Settings;
			
			let id = (BCP.itemId) ? BCP.itemId : $(o).closest('[data-id]').data('id');
			
			if (id) {
			
				BCP.block = ($(BCP.prefix + '_dialog:visible').length) ? BCP.dialog.find('.modal-content') : $('body');
				
				bootbox.confirm({
					title: 'Confirm',
					message: '<p class="center">' + BS.t('messageConfirmDelete') + '</p>',
					callback: function(ok) {
						if (ok) {
							BCP.delete(id);
						}
					}
				});
				return false;
			}
			
		},

		reset: function() {

			const BCP = Boutique.Controllers.Product;
			const BV = Boutique.Validator;
			
			/* Reset all visible fields */
			if (BCP.formWrite.length) {
				BCP.formWrite.get(0).reset();
				BV.clearErrors(BCP.formWrite);
			}
			
			/* Reset hidden id field manually since reset doesn't clear hidden fields */
			$(BCP.prefix + '_id').val('');
				
			if (BCP.action === 'view') {
				BCP.dialog.find('.form-control').alterClass('form-control', 'form-control-plaintext').prop('readonly', true);
				BCP.dialog.find('[data-bs-dismiss="modal"]').addClass('btn-last');
			}
			else {
				BCP.formWrite.find('.form-control-plaintext').alterClass('form-control-plaintext', 'form-control').prop('readonly', false);
				BCP.dialog.find('[data-bs-dismiss="modal"]').removeClass('btn-last');
			}

		},
		
		// saves/updates an item back to the database
		save: function() {
			
			const BCP = Boutique.Controllers.Product;
			const OU = Boutique.Utilities;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;
			const BV = Boutique.Validator;
	
			let id = (BCP.itemId && BCP.action === 'edit') ? '/' + BCP.itemId : '';
			
			BCP.bv = BV.build(BCP.formWrite);
			
			if (BCP.bv.hasErrors()) {
				return false;
			}
		
			BV.clearErrors(BCP.formWrite);
	
			$.ajax({
				type: (BCP.action === 'edit') ? 'put' : 'post',
				url: API_PATH + '/products' + id,
				data: BCP.formWrite.cerealize(),
				beforeSend: function() {
					BM.progress(BS.t('messageSaving'), BCP.block);
				},
				success: function(data, status, xhr) {
					BCP.set(data, status, xhr);
				},
				error: function(data, status, xhr) {
					BM.response(data, status, xhr, BCP.block);
				}
			});
	
		},
		
		set: function(data, status, xhr) {
			
			const BCP = Boutique.Controllers.Product;
			const BM = Boutique.Messages;
	
			BM.response(data, status, xhr, BCP.block, BCP.init);
				
		},
				
		show: function(e) { 
		
			const BCP = Boutique.Controllers.Product;
			
			BCP.action = (e && e.target && e.target.dataset['action']);

			let add = $(BCP.prefix + '_add');
			let upd = $(BCP.prefix + '_upd');
			let del = $(BCP.prefix + '_del');
			
			if (BCP.action) {

				BCP.reset();

				BCP.block = BCP.dialog.find('.modal-content');
				BCP.itemId = (e.target.dataset['id']) ? e.target.dataset['id'] : false;
				
				$(add).add(upd).add(del).hide();

				// Edit/Copy/View existing item
				if (BCP.itemId) {
					if (BCP.action === 'edit') {
						upd.show();
						del.show();
					}
					else if (BCP.action === 'copy') {
						add.show();
					}
				}
				// Add new item
				else {
					add.show();
				}

				BCP.dialog.modal('show');
				BCP.dialog.off('shown.bs.modal').on('shown.bs.modal', function() {
					
					if (BCP.action.match(/(edit|view)/i)) {
						BCP.edit();
					}
					else if (BCP.action === 'copy') {
						BCP.edit(BCP.duplicate);
					}
					
				});		

			}
		},

	};

	$(function() {
		Boutique.Controllers.Product.init();
	});       

})();

