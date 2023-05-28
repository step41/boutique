// centers the selected object in the middle of the screen
(function($){  
    $.fn.center = function () {
		this.css({
			'left': '50%',
			'top': '50%'
		});
		this.css({
			'margin-left': -this.outerWidth() / 2 + 'px',
			'margin-top': -this.outerHeight() / 2 + 'px'
		});
	
		return this;
    }
})(jQuery);

