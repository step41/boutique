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


