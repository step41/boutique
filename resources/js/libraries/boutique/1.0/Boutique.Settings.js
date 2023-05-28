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
