(function($) {

	var methods = {
		
		destroy: function() {
			var self = this;
			var o = $(self);
			var html, tablescroll, width, widths, thead, height;
			var table = o.closest('table').not('.table-fixed');
			if (table.length) {
				table.data('table-scroll', null);
				table.removeClass('table-inner-bordered').addClass(table.data('table-scroll-old-classes'));
				html = table.get(0).outerHTML;
				tablescroll = o.closest('.table-scroll');
				if (tablescroll.length) { // plugin already activated... simply replace wrap with original table contents
					tablescroll.replaceWith(html);
				}
			}
		},

		refresh: function() {
			var self = this;
			var o = $(self);
			var table = o.closest('table').not('.table-fixed');
			if (table.length) {
				/* Destroy any existing versions... */
				if (table.data('table-scroll')) {
					methods.destroy.apply(self, arguments);
				}
				methods.create.apply(self, arguments);
			}
		},

		create: function(options) {
			options = options || { callback: null };
			var self = this;
			var o = $(self);
			var html, tablescroll, tscdims, tscwidth, dims, width, widths, thead, height;
			var table = o.closest('table').not('.table-fixed');
			if (table.length) {
				/* Simple return if exists */
				if (table.data('table-scroll')) {
					return;
				}

				thead = table.find('thead').not('.header-fixed');
				widths = [];

				/* Set data prop so we can identify existing instances in the future */
				table.data('table-scroll', true);

				/* Save and adjust classes as neeeded */
				table.data('table-scroll-old-classes', table.prop('class')).removeClass('table-curved').addClass('table-inner-bordered');
				
				/* Generate table scroll wrapper and inject current table */
				tablescroll = table.wrap('<div class="table-scroll"><div class="table-scroll-content pscroll"></div></div>').parent().parent();
				
				/* Capture current cell widths for later assignment */
				thead.find('tr:first-of-type > th').each(
					function() {
						dims = $(this).hiddendims();
						width = dims.outerWidth;
						//$.clog('th width: ' + width);
						widths.push(width);
					}
				);
				
				/* Generate new table to contain fixed header elements */
				tablescrollcontent = tablescroll.find('.table-scroll-content');	
								
				$(document.createElement('table'))
					.addClass(table.attr('class') + ' table-fixed')
					.appendTo(tablescroll)
					.html(thead.clone().addClass('header-fixed'))
				;
				
				/* Assign previously captured widths to newly generated thead element */
				$.each(widths, function (i, width){
					tablescroll.find('thead.header-fixed > tr > th:eq('+ i +')').css({width: width});
				});
				
				
				tscdims = tablescrollcontent.hiddendims();
				tscwidth = tscdims.width;
				//$.clog('table scroll content width: ' + tscwidth);
				tablescroll.find('thead.header-fixed').css({ width: tscwidth });
				
				/* Execute callback function if applicable */
				if ($.isFunction(options.callback)) {
					options.callback.call();
				}

			}
			else {
				return null;
			}
		}
		
	};

	$.fn.tablescroll = function(options) {
		if (methods[options]) {
			return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
		} 
		else if (typeof options === 'object' || !options) {
			return methods.create.apply(this, arguments);
		} 
		else {
			$.clog('Method ' + options + ' does not exist on jQuery.tablescroll');
		}    
		
	};

})(jQuery);