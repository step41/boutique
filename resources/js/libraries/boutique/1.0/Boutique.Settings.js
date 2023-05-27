; (function() {

	'use strict';
			
	// Add client side translation as required or pull down from server side to avoid redundancy
    Boutique.Settings.Translations = {};
	
    Boutique.Settings.t = function(text) {
        
        return (this.Translations[text] == undefined ? text : this.Translations[text]);
        
    };
    
})();
