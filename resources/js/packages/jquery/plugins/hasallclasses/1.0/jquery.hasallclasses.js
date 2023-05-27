/**
 * jQuery hasAllClasses plugin
 *
 */
(function ( $ ) {
	
    $.fn.hasAllClasses = function() {
        
        var al = arguments.length;
        var f = [];
        var i, j, c, cl;

        for (i = 0; i < al; i++) {
            
            c = $.unique(arguments[i].split(' '));
            cl = c.length;
            
            for (j = 0; j < cl; j++) {
            
                if (!this.hasClass(c[j])) {
            
                    f.push(true);
            
                }
            
            }
        
        }

        return (!f.length);

    };
     
})( jQuery );
