const LOCALE = 'en-us';
const API_PATH = '';
const PAGE = location.pathname.split('/')[1];

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
	
	
