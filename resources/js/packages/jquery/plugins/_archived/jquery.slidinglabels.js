/*
	Sliding Labels 3.2.1
	
	This is the official plugin version of Sliding Labels.
	It is open source code by Tim Wright of CSSKarma.com
	Use as you see fit, I'd like it if you kept this in 
	the code, but basically share it and don't be a jerk.
	
	Support:
	http://www.csskarma.com/blog/sliding-labels-plugin
	
	Version: 2 - added textarea functionality
	Version: 3 - added axis parameter
	           - added speed parameter
	           - removed color parameter, as it should be define in the CSS
	           - added position:relative to wrapping element
	           - coverted to jQuery plugin
	Version: 3.1 - changed "children" to "find" so it works a little better with UL & fieldsets
	Version: 3.2 - Added a "className" option so you don't have to use ".slider" as the wrapper
	Version: 3.2.1 - general clean up
	Version: 3.2.2 - Jeff Todnem added support for outward/upward class assignment as well as click through wrappers
*/

(function($){  
$.fn.slidinglabels = function(options, callback) { 
	var defaults = {
		className    : 'labelSlider',
		classNameOut : 'labelSliderOut',
		topPosition  : '0px',
		leftPosition : '0px',
		offset       : 10,
		axis         : 'x',
		speed        : 'fast'
	},
	options = $.extend(defaults, options),
		itemwrapper = this.find('.' + defaults.className),
		labels = itemwrapper.find('label');
	
	return labels.each(function() {
		var obj = $(this);
		
		var parent = obj.parents('.' + defaults.className + '');
		parent.css({'position':'relative'});
		
		// style the label with JS for progressive enhancement
		obj.css({
			'position' : 'absolute',
			'top'      : defaults.topPosition,
			'left'     : defaults.leftPosition,
			'display'  : 'inline',
			'z-index'  : 10
		});
		
		var inputval = $(this).next().val(),
			labelwidth = $(this).width(),
			labelmove = labelwidth + defaults.offset +'px',
			labelheight = $(this).height();
		
		//onload, check if a field is filled out, if so, move the label out of the way
		if(inputval !== ''){
			if(defaults.axis == 'x'){
				obj.stop().animate({ 'left':'-'+labelmove }, 1);
			} else if(defaults.axis == 'y') {
				obj.stop().animate({ 'top':'-'+labelheight }, 1);
			}
			obj.closest('.'+defaults.className).addClass(defaults.classNameOut);
		} // 	

		$('.'+defaults.className).click(function(){
			$(this).find(':input').focus();
		});

		// if the input is empty on focus move the label to the left
		// if it's empty on blur, move it back
		$(parent).find('input, textarea, select').focus(function(){
			var label = $(this).prev('label'),
				width = label.width(),
				height = label.height(),
				adjust = width + defaults.offset + 'px',
				adjustUp = height + 'px',
				value = $(this).val();
			
			if(value === ''){
				if(defaults.axis == 'x'){
					label.stop().animate({ 'left':'-'+adjust }, defaults.speed);
					
				} else if(defaults.axis == 'y') {
					label.stop().animate({ 'top':'-'+adjustUp }, defaults.speed);
				}
				$(this).closest('.'+defaults.className).addClass(defaults.classNameOut);
			} else {
				if(defaults.axis == 'x'){
					label.css({ 'left':'-'+adjust });
				} else if(defaults.axis == 'y') {
					label.css({ 'top':'-'+adjustUp });
				}
				$(this).closest('.'+defaults.className).addClass(defaults.classNameOut);
			}
			
			}).blur(function(){
				var label = $(this).prev('label'),
					value = $(this).val();
				
				if(value === ''){					
					if(defaults.axis == 'x'){
						label.stop().animate({ 'left': defaults.leftPosition }, defaults.speed);
					} else if(defaults.axis == 'y') {
						label.stop().animate({ 'top': defaults.topPosition }, defaults.speed);
					}
					$(this).closest('.'+defaults.className).removeClass(defaults.classNameOut);					
				}
			});

		});
 
	}; // End function
})(jQuery); // End jQuery

