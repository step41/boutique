/**
 * jQuery addBackIf plugin
 *
 */
(function ( $ ) {
	
$.fn.addBackIf = function ( selector, condition ) {
	
	var self = this;
	
	return (condition) ? self.addBack(selector) : self;
 
};
 
})( jQuery );
