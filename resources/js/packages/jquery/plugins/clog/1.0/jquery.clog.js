/* External function for console logging from anywhere */
$.clog = function(msg, status) {
	
	if (console && typeof console.log != 'undefined' && DEV_ENV) {
		switch (status) {
			case 'success':  	fg = '#28a745';    bg = '#242424'; break;
			case 'info':     	fg = '#17a2b8';	   bg = '#242424'; break;
			case 'danger':   	fg = '#dc3545';    bg = '#242424'; break;
			case 'start':    	fg = 'OliveDrab';  bg = '#242424'; break;
			case 'warning':  	fg = '#ffc107';    bg = '#242424'; break;
			case 'end':      	fg = 'Orchid';     bg = '#242424'; break;
			case 'primary':  	fg = '#007bff';	   bg = '#242424'; break;
			case 'secondary': 	fg = '#6c757d';    bg = '#242424'; break;
			case 'default':  	
			default: 			fg = '#ffffff';    bg = '#242424'; break;
		}
		//bg = '#ffffff'; 	// Standard "Light Mode" console background in Chrome dev tools
		//bg = '#242424'; 	// Reversed "Dark Mode" console in Chrome dev tools
		if (typeof msg == 'object') {
			console.log(msg);
		} 
		else if (typeof status == 'object') {
			console.log('%c' + msg, 'color: PowderBlue;font-weight:bold; background-color: RoyalBlue;');
			console.log(status);
		} 
		else {
			console.log('%c' + msg, 'color:' + fg + '; background-color: ' + bg + ';');
		}
	}
};

/* Inline function for console logging within a jQuery object */
$.fn.clog = function(msg) {
	msg = msg || '';
	if (console && typeof console.log != 'undefined' && DEV_ENV) {
		console.log('%o ', this, msg);
	}
	return this;
};
