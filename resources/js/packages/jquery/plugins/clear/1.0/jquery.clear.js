/* jQuery plugin for clearing form fields */
$.fn.clear = function() {
	$(this).find('input')
			.filter(':text, :password, :file, :color, :date, :datetime, :datetime-local, :email, :month, :number, :range, :search, :tel, :time, :url, :week').val('')
			.end()
			.filter(':checkbox, :radio')
				.removeAttr('checked')
			.end()
		.end()
	.find('textarea').val('')
		.end()
	.find('select').prop("selectedIndex", -1)
		.find('option:selected').removeAttr('selected')
	;
	return this;
};
