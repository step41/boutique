/**
 * jQuery.reverse - reverse each loops
 * Author: Jeff Todnem - http://origincms.com
 *
 * Usage: $(selector).reverse().each(...)
 * Added: Sep 1, 2012
 **/ 

jQuery.fn.reverse = function() {
    return this.pushStack(this.get().reverse(), arguments);
};