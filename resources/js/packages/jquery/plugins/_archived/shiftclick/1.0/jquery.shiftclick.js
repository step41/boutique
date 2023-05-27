// Usage: $form.find('input[type="checkbox"]').shiftClick();
// replace input[type="checkbox"] with the selector to match your list of checkboxes

$.fn.shiftClick = function() {
	var last;
	var $boxes = this;
	$boxes.click(function(evt) {
		if (!last) {
			last = this;
			return;
		}
		if (evt.shiftKey) {
			var beg = $boxes.index(this);
			var end = $boxes.index(last);
			$boxes.slice(Math.min(beg, end), Math.max(beg, end) + 1).attr('checked', last.checked).trigger('change');
		}
		last = this;
	});
};
