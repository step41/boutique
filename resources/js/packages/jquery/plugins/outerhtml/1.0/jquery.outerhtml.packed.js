(function($){var c;$.fn.outerHTML=function(v){var a=this[0];var b;if(!a){return null}else{if(v){$(a).replaceWith(v)}else{return typeof(b=a.outerHTML)==='string'?b:(c=c||$('<div/>')).html(this.eq(0).clone()).html()}}}})(jQuery);
