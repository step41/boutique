/**
 * jQuery hasAnyClass plugin
 *
 */
(function ( $ ) {
	
    $.fn.hasAnyClass = function() {
        
        var al = arguments.length;
        var i, j, c, cl;

        for (i = 0; i < al; i++) {
            
            c = arguments[i].split(' ');
            cl = c.length;
            
            for (j = 0; j < cl; j++) {
            
                if (this.hasClass(c[j])) {
            
                    return true;
            
                }
            
            }
        
        }

        return false;

    };
     
})( jQuery );
    