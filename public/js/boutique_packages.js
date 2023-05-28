function array_fill (startIndex, num, mixedVal) { // eslint-disable-line camelcase
	//	discuss at: http://locutus.io/php/array_fill/
	// original by: Kevin van Zonneveld (http://kvz.io)
	// improved by: Waldo Malqui Silva (http://waldo.malqui.info)
	//	 example 1: array_fill(5, 6, 'banana')
	//	 returns 1: { 5: 'banana', 6: 'banana', 7: 'banana', 8: 'banana', 9: 'banana', 10: 'banana' }

	var key;
	var tmpArr = [];

	if (!isNaN(startIndex) && !isNaN(num)) {
		for (key = 0; key < num; key++) {
			tmpArr[(key + startIndex)] = mixedVal;
		}
	}

	return tmpArr;
}

function array_key_exists(key, search) {
	//	discuss at: http://phpjs.org/functions/array_key_exists/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Felix Geisendoerfer (http://www.debuggable.com/felix)
	//	 example 1: array_key_exists('kevin', {'kevin': 'van Zonneveld'});
	//	 returns 1: true

	if (!search || (search.constructor !== Array && search.constructor !== Object)) {
		return false;
	}

	return key in search;
}

function array_merge() {
	//	discuss at: http://phpjs.org/functions/array_merge/
	// original by: Brett Zamir (http://brett-zamir.me)
	// bugfixed by: Nate
	// bugfixed by: Brett Zamir (http://brett-zamir.me)
	//		input by: josh
	//	 example 1: arr1 = {"color": "red", 0: 2, 1: 4}
	//	 example 1: arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
	//	 example 1: array_merge(arr1, arr2)
	//	 returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
	//	 example 2: arr1 = []
	//	 example 2: arr2 = {1: "data"}
	//	 example 2: array_merge(arr1, arr2)
	//	 returns 2: {0: "data"}

	var args = Array.prototype.slice.call(arguments),
		argl = args.length,
		arg,
		retObj = {},
		k = '',
		argil = 0,
		j = 0,
		i = 0,
		ct = 0,
		toStr = Object.prototype.toString,
		retArr = true;

	for (i = 0; i < argl; i++) {
		if (toStr.call(args[i]) !== '[object Array]') {
			retArr = false;
			break;
		}
	}

	if (retArr) {
		retArr = [];
		for (i = 0; i < argl; i++) {
			retArr = retArr.concat(args[i]);
		}
		return retArr;
	}

	for (i = 0, ct = 0; i < argl; i++) {
		arg = args[i];
		if (toStr.call(arg) === '[object Array]') {
			for (j = 0, argil = arg.length; j < argil; j++) {
				retObj[ct++] = arg[j];
			}
		} else {
			for (k in arg) {
				if (arg.hasOwnProperty(k)) {
					if (parseInt(k, 10) + '' === k) {
						retObj[ct++] = arg[k];
					} else {
						retObj[k] = arg[k];
					}
				}
			}
		}
	}
	return retObj;
}

function array_values(input) {
	//	discuss at: http://phpjs.org/functions/array_values/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Brett Zamir (http://brett-zamir.me)
	//	 example 1: array_values( {firstname: 'Kevin', surname: 'van Zonneveld'} );
	//	 returns 1: {0: 'Kevin', 1: 'van Zonneveld'}

	var tmp_arr = [],
		key = '';

	if (input && typeof input === 'object' && input.change_key_case) {
		// Duck-type check for our own array()-created PHPJS_Array
		return input.values();
	}

	for (key in input) {
		tmp_arr[tmp_arr.length] = input[key];
	}

	return tmp_arr;
}

function empty(mixed_var) {
	//	discuss at: http://phpjs.org/functions/empty/
	// original by: Philippe Baumann
	//		input by: Onno Marsman
	//		input by: LH
	//		input by: Stoyan Kyosev (http://www.svest.org/)
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Onno Marsman
	// improved by: Francesco
	// improved by: Marc Jansen
	// improved by: Rafal Kukawski
	//	 example 1: empty(null);
	//	 returns 1: true
	//	 example 2: empty(undefined);
	//	 returns 2: true
	//	 example 3: empty([]);
	//	 returns 3: true
	//	 example 4: empty({});
	//	 returns 4: true
	//	 example 5: empty({'aFunc' : function () { alert('humpty'); } });
	//	 returns 5: false

	var undef, key, i, len;
	var emptyValues = [undef, null, false, 0, '', '0'];

	for (i = 0, len = emptyValues.length; i < len; i++) {
		if (mixed_var === emptyValues[i]) {
			return true;
		}
	}

	if (typeof mixed_var === 'object') {
		for (key in mixed_var) {
			// TODO: should we check for own properties only?
			//if (mixed_var.hasOwnProperty(key)) {
			return false;
			//}
		}
		return true;
	}

	return false;
}

function in_array(needle, haystack, argStrict) {
	//	discuss at: http://phpjs.org/functions/in_array/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: vlado houba
	// improved by: Jonas Sciangula Street (Joni2Back)
	//		input by: Billy
	// bugfixed by: Brett Zamir (http://brett-zamir.me)
	//	 example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
	//	 returns 1: true
	//	 example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'});
	//	 returns 2: false
	//	 example 3: in_array(1, ['1', '2', '3']);
	//	 example 3: in_array(1, ['1', '2', '3'], false);
	//	 returns 3: true
	//	 returns 3: true
	//	 example 4: in_array(1, ['1', '2', '3'], true);
	//	 returns 4: false

	var key = '',
		strict = !! argStrict;

	//we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] == ndl)
	//in just one for, in order to improve the performance 
	//deciding wich type of comparation will do before walk array
	if (strict) {
		for (key in haystack) {
			if (haystack[key] === needle) {
				return true;
			}
		}
	} else {
		for (key in haystack) {
			if (haystack[key] == needle) {
				return true;
			}
		}
	}

	return false;
}

function is_array (mixed_var) {
    // Returns true if variable is an array  
    // 
    // version: 1009.2513
    // discuss at: http://phpjs.org/functions/is_array
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Legaev Andrey
    // +   bugfixed by: Cord
    // +   bugfixed by: Manish
    // +   improved by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: In php.js, javascript objects are like php associative arrays, thus JavaScript objects will also
    // %        note 1: return true  in this function (except for objects which inherit properties, being thus used as objects),
    // %        note 1: unless you do ini_set('phpjs.objectsAsArrays', true), in which case only genuine JavaScript arrays
    // %        note 1: will return true
    // *     example 1: is_array(['Kevin', 'van', 'Zonneveld']);
    // *     returns 1: true
    // *     example 2: is_array('Kevin van Zonneveld');
    // *     returns 2: false
    // *     example 3: is_array({0: 'Kevin', 1: 'van', 2: 'Zonneveld'});
    // *     returns 3: true
    // *     example 4: is_array(function tmp_a(){this.name = 'Kevin'});
    // *     returns 4: false
    var key = '';
    var getFuncName = function (fn) {
        var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
        if (!name) {
            return '(Anonymous)';
        }
        return name[1];
    };
 
    if (!mixed_var) {
        return false;
    }
 
    // BEGIN REDUNDANT
    this.php_js = this.php_js || {};
    this.php_js.ini = this.php_js.ini || {};
    // END REDUNDANT
 
    if (typeof mixed_var === 'object') {
 
        if (this.php_js.ini['phpjs.objectsAsArrays'] &&  // Strict checking for being a JavaScript array (only check this way if call ini_set('phpjs.objectsAsArrays', 0) to disallow objects as arrays)
            (
            (this.php_js.ini['phpjs.objectsAsArrays'].local_value.toLowerCase &&
                    this.php_js.ini['phpjs.objectsAsArrays'].local_value.toLowerCase() === 'off') ||
                parseInt(this.php_js.ini['phpjs.objectsAsArrays'].local_value, 10) === 0)
            ) {
            return mixed_var.hasOwnProperty('length') && // Not non-enumerable because of being on parent class
                            !mixed_var.propertyIsEnumerable('length') && // Since is own property, if not enumerable, it must be a built-in function
                                getFuncName(mixed_var.constructor) !== 'String'; // exclude String()
        }
 
        if (mixed_var.hasOwnProperty) {
            for (key in mixed_var) {
                // Checks whether the object has the specified property
                // if not, we figure it's not an object in the sense of a php-associative-array.
                if (false === mixed_var.hasOwnProperty(key)) {
                    return false;
                }
            }
        }
 
        // Read discussion at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_is_array/
        return true;
    }
 
    return false;
}

function is_bool(mixed_var) {
	//	discuss at: http://phpjs.org/functions/is_bool/
	// original by: Onno Marsman
	// improved by: CoursesWeb (http://www.coursesweb.net/)
	//	 example 1: is_bool(false);
	//	 returns 1: true
	//	 example 2: is_bool(0);
	//	 returns 2: false

	return (mixed_var === true || mixed_var === false); // Faster (in FF) than type checking
}

function is_callable(v, syntax_only, callable_name) {
	//	discuss at: http://phpjs.org/functions/is_callable/
	// original by: Brett Zamir (http://brett-zamir.me)
	//		input by: François
	// improved by: Brett Zamir (http://brett-zamir.me)
	//				note: The variable callable_name cannot work as a string variable passed by reference as in PHP (since JavaScript does not support passing strings by reference), but instead will take the name of a global variable and set that instead
	//				note: When used on an object, depends on a constructor property being kept on the object prototype
	//				test: skip
	//	 example 1: is_callable('is_callable');
	//	 returns 1: true
	//	 example 2: is_callable('bogusFunction', true);
	//	 returns 2: true // gives true because does not do strict checking
	//	 example 3: function SomeClass () {}
	//	 example 3: SomeClass.prototype.someMethod = function (){};
	//	 example 3: var testObj = new SomeClass();
	//	 example 3: is_callable([testObj, 'someMethod'], true, 'myVar');
	//	 example 3: $result = myVar;
	//	 returns 3: 'SomeClass::someMethod'
	//	 example 4: is_callable(function () {});
	//	 returns 4: true

	var name = '',
		obj = {},
		method = '';
	var getFuncName = function (fn) {
		var name = (/\W*function\s+([\w\$]+)\s*\(/)
			.exec(fn);
		if (!name) {
			return '(Anonymous)';
		}
		return name[1];
	};
	if (typeof v === 'string') {
		obj = this.window;
		method = v;
		name = v;
	} else if (typeof v === 'function') {
		return true;
	} else if (Object.prototype.toString.call(v) === '[object Array]' &&
		v.length === 2 && typeof v[0] === 'object' && typeof v[1] === 'string') {
		obj = v[0];
		method = v[1];
		name = (obj.constructor && getFuncName(obj.constructor)) + '::' + method;
	} else {
		return false;
	}
	if (syntax_only || typeof obj[method] === 'function') {
		if (callable_name) {
			this.window[callable_name] = name;
		}
		return true;
	}
	return false;
}

function is_numeric(mixed_var) {
	//	discuss at: http://phpjs.org/functions/is_numeric/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: David
	// improved by: taith
	// bugfixed by: Tim de Koning
	// bugfixed by: WebDevHobo (http://webdevhobo.blogspot.com/)
	// bugfixed by: Brett Zamir (http://brett-zamir.me)
	// bugfixed by: Denis Chenu (http://shnoulle.net)
	//	 example 1: is_numeric(186.31);
	//	 returns 1: true
	//	 example 2: is_numeric('Kevin van Zonneveld');
	//	 returns 2: false
	//	 example 3: is_numeric(' +186.31e2');
	//	 returns 3: true
	//	 example 4: is_numeric('');
	//	 returns 4: false
	//	 example 5: is_numeric([]);
	//	 returns 5: false
	//	 example 6: is_numeric('1 ');
	//	 returns 6: false

	var whitespace =
		" \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
	return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -
		1)) && mixed_var !== '' && !isNaN(mixed_var);
}

function is_scalar(mixed_var) {
	//	discuss at: http://phpjs.org/functions/is_scalar/
	// original by: Paulo Freitas
	//	 example 1: is_scalar(186.31);
	//	 returns 1: true
	//	 example 2: is_scalar({0: 'Kevin van Zonneveld'});
	//	 returns 2: false

	return (/boolean|number|string/)
		.test(typeof mixed_var);
}

function is_string(mixed_var) {
	//	discuss at: http://phpjs.org/functions/is_string/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//	 example 1: is_string('23');
	//	 returns 1: true
	//	 example 2: is_string(23.5);
	//	 returns 2: false

	return (typeof mixed_var === 'string');
}

function ltrim(str, charlist) {
	//	discuss at: http://phpjs.org/functions/ltrim/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//		input by: Erkekjetter
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: Onno Marsman
	//	 example 1: ltrim('		Kevin van Zonneveld		');
	//	 returns 1: 'Kevin van Zonneveld		'

	charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
		.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
	var re = new RegExp('^[' + charlist + ']+', 'g');
	return (str + '')
		.replace(re, '');
}

function md5(str) {
	//	discuss at: http://phpjs.org/functions/md5/
	// original by: Webtoolkit.info (http://www.webtoolkit.info/)
	// improved by: Michael White (http://getsprink.com)
	// improved by: Jack
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//		input by: Brett Zamir (http://brett-zamir.me)
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//	depends on: utf8_encode
	//	 example 1: md5('Kevin van Zonneveld');
	//	 returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

	var xl;

	var rotateLeft = function(lValue, iShiftBits) {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	};

	var addUnsigned = function(lX, lY) {
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
	};

	var _F = function(x, y, z) {
		return (x & y) | ((~x) & z);
	};
	var _G = function(x, y, z) {
		return (x & z) | (y & (~z));
	};
	var _H = function(x, y, z) {
		return (x ^ y ^ z);
	};
	var _I = function(x, y, z) {
		return (y ^ (x | (~z)));
	};

	var _FF = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var _GG = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var _HH = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var _II = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var convertToWordArray = function(str) {
		var lWordCount;
		var lMessageLength = str.length;
		var lNumberOfWords_temp1 = lMessageLength + 8;
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		var lWordArray = new Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	};

	var wordToHex = function(lValue) {
		var wordToHexValue = '',
			wordToHexValue_temp = '',
			lByte, lCount;
		for (lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;
			wordToHexValue_temp = '0' + lByte.toString(16);
			wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
		}
		return wordToHexValue;
	};

	var x = [],
		k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
		S12 = 12,
		S13 = 17,
		S14 = 22,
		S21 = 5,
		S22 = 9,
		S23 = 14,
		S24 = 20,
		S31 = 4,
		S32 = 11,
		S33 = 16,
		S34 = 23,
		S41 = 6,
		S42 = 10,
		S43 = 15,
		S44 = 21;

	str = utf8_encode(str);
	x = convertToWordArray(str);
	a = 0x67452301;
	b = 0xEFCDAB89;
	c = 0x98BADCFE;
	d = 0x10325476;

	xl = x.length;
	for (k = 0; k < xl; k += 16) {
		AA = a;
		BB = b;
		CC = c;
		DD = d;
		a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		a = addUnsigned(a, AA);
		b = addUnsigned(b, BB);
		c = addUnsigned(c, CC);
		d = addUnsigned(d, DD);
	}

	var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

	return temp.toLowerCase();
}

function nl2br(str, is_xhtml) {
	//	discuss at: http://phpjs.org/functions/nl2br/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Philip Peterson
	// improved by: Onno Marsman
	// improved by: Atli Þór
	// improved by: Brett Zamir (http://brett-zamir.me)
	// improved by: Maximusya
	// bugfixed by: Onno Marsman
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//		input by: Brett Zamir (http://brett-zamir.me)
	//	 example 1: nl2br('Kevin\nvan\nZonneveld');
	//	 returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
	//	 example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
	//	 returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
	//	 example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
	//	 returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'

	var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

	return (str + '')
		.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function range (low, high, step) {
	//	discuss at: http://locutus.io/php/range/
	// original by: Waldo Malqui Silva (http://waldo.malqui.info)
	//	 example 1: range ( 0, 12 )
	//	 returns 1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	//	 example 2: range( 0, 100, 10 )
	//	 returns 2: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
	//	 example 3: range( 'a', 'i' )
	//	 returns 3: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
	//	 example 4: range( 'c', 'a' )
	//	 returns 4: ['c', 'b', 'a']

	var matrix = [];
	var iVal;
	var endval;
	var plus;
	var walker = step || 1;
	var chars = false;

	if (!isNaN(low) && !isNaN(high)) {
		iVal = low;
		endval = high;
	} else if (isNaN(low) && isNaN(high)) {
		chars = true;
		iVal = low.charCodeAt(0);
		endval = high.charCodeAt(0);
	} else {
		iVal = (isNaN(low) ? 0 : low);
		endval = (isNaN(high) ? 0 : high);
	}

	plus = !(iVal > endval);
	if (plus) {
		while (iVal <= endval) {
			matrix.push(((chars) ? String.fromCharCode(iVal) : iVal));
			iVal += walker;
		}
	} else {
		while (iVal >= endval) {
			matrix.push(((chars) ? String.fromCharCode(iVal) : iVal));
			iVal -= walker;
		}
	}

	return matrix;
}

function rtrim(str, charlist) {
	//	discuss at: http://phpjs.org/functions/rtrim/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//		input by: Erkekjetter
	//		input by: rem
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: Onno Marsman
	// bugfixed by: Brett Zamir (http://brett-zamir.me)
	//	 example 1: rtrim('		Kevin van Zonneveld		');
	//	 returns 1: '		Kevin van Zonneveld'

	charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
		.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
	var re = new RegExp('[' + charlist + ']+$', 'g');
	return (str + '')
		.replace(re, '');
}

function sprintf() {
	//	discuss at: http://phpjs.org/functions/sprintf/
	// original by: Ash Searle (http://hexmen.com/blog/)
	// improved by: Michael White (http://getsprink.com)
	// improved by: Jack
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Dj
	// improved by: Allidylls
	//		input by: Paulo Freitas
	//		input by: Brett Zamir (http://brett-zamir.me)
	//	 example 1: sprintf("%01.2f", 123.1);
	//	 returns 1: 123.10
	//	 example 2: sprintf("[%10s]", 'monkey');
	//	 returns 2: '[		monkey]'
	//	 example 3: sprintf("[%'#10s]", 'monkey');
	//	 returns 3: '[####monkey]'
	//	 example 4: sprintf("%d", 123456789012345);
	//	 returns 4: '123456789012345'
	//	 example 5: sprintf('%-03s', 'E');
	//	 returns 5: 'E00'

	var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
	var a = arguments;
	var i = 0;
	var format = a[i++];

	// pad()
	var pad = function (str, len, chr, leftJustify) {
		if (!chr) {
			chr = ' ';
		}
		var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0)
			.join(chr);
		return leftJustify ? str + padding : padding + str;
	};

	// justify()
	var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
		var diff = minWidth - value.length;
		if (diff > 0) {
			if (leftJustify || !zeroPad) {
				value = pad(value, minWidth, customPadChar, leftJustify);
			} else {
				value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
			}
		}
		return value;
	};

	// formatBaseX()
	var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
		// Note: casts negative numbers to positive ones
		var number = value >>> 0;
		prefix = prefix && number && {
			'2': '0b',
			'8': '0',
			'16': '0x'
		}[base] || '';
		value = prefix + pad(number.toString(base), precision || 0, '0', false);
		return justify(value, prefix, leftJustify, minWidth, zeroPad);
	};

	// formatString()
	var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
		if (precision != null) {
			value = value.slice(0, precision);
		}
		return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
	};

	// doFormat()
	var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
		var number, prefix, method, textTransform, value;

		if (substring === '%%') {
			return '%';
		}

		// parse flags
		var leftJustify = false;
		var positivePrefix = '';
		var zeroPad = false;
		var prefixBaseX = false;
		var customPadChar = ' ';
		var flagsl = flags.length;
		for (var j = 0; flags && j < flagsl; j++) {
			switch (flags.charAt(j)) {
			case ' ':
				positivePrefix = ' ';
				break;
			case '+':
				positivePrefix = '+';
				break;
			case '-':
				leftJustify = true;
				break;
			case "'":
				customPadChar = flags.charAt(j + 1);
				break;
			case '0':
				zeroPad = true;
				customPadChar = '0';
				break;
			case '#':
				prefixBaseX = true;
				break;
			}
		}

		// parameters may be null, undefined, empty-string or real valued
		// we want to ignore null, undefined and empty-string values
		if (!minWidth) {
			minWidth = 0;
		} else if (minWidth === '*') {
			minWidth = +a[i++];
		} else if (minWidth.charAt(0) == '*') {
			minWidth = +a[minWidth.slice(1, -1)];
		} else {
			minWidth = +minWidth;
		}

		// Note: undocumented perl feature:
		if (minWidth < 0) {
			minWidth = -minWidth;
			leftJustify = true;
		}

		if (!isFinite(minWidth)) {
			throw new Error('sprintf: (minimum-)width must be finite');
		}
	
		if (!precision) {
			precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
		} else if (precision === '*') {
			precision = +a[i++];
		} else if (precision.charAt(0) == '*') {
			precision = +a[precision.slice(1, -1)];
		} else {
			precision = +precision;
		}

		// grab value using valueIndex if required?
		value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

		switch (type) {
		case 's':
			return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
		case 'c':
			return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
		case 'b':
			return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
		case 'o':
			return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
		case 'x':
			return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
		case 'X':
			return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
				.toUpperCase();
		case 'u':
			return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
		case 'i':
		case 'd':
			number = +value || 0;
			// Plain Math.round doesn't just truncate
			number = Math.round(number - number % 1);
			prefix = number < 0 ? '-' : positivePrefix;
			value = prefix + pad(String(Math.abs(number)), precision, '0', false);
			return justify(value, prefix, leftJustify, minWidth, zeroPad);
		case 'e':
		case 'E':
		case 'f': // Should handle locales (as per setlocale)
		case 'F':
		case 'g':
		case 'G':
			number = +value;
			prefix = number < 0 ? '-' : positivePrefix;
			method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
			textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
			value = prefix + Math.abs(number)[method](precision);
			return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
		default:
			return substring;
		}
	};

	return format.replace(regex, doFormat);
}

function str_repeat (input, multiplier) { // eslint-disable-line camelcase
	//	discuss at: http://locutus.io/php/str_repeat/
	// original by: Kevin van Zonneveld (http://kvz.io)
	// improved by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	// improved by: Ian Carter (http://euona.com/)
	//	 example 1: str_repeat('-=', 10)
	//	 returns 1: '-=-=-=-=-=-=-=-=-=-='

	var y = '';
	while (true) {
		if (multiplier & 1) {
			y += input;
		}
		multiplier >>= 1;
		if (multiplier) {
			input += input;
		} else {
			break;
		}
	}
	return y;
}

function strrpos(haystack, needle, offset) {
	//	discuss at: http://phpjs.org/functions/strrpos/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: Onno Marsman
	// bugfixed by: Brett Zamir (http://brett-zamir.me)
	//		input by: saulius
	//	 example 1: strrpos('Kevin van Zonneveld', 'e');
	//	 returns 1: 16
	//	 example 2: strrpos('somepage.com', '.', false);
	//	 returns 2: 8
	//	 example 3: strrpos('baa', 'a', 3);
	//	 returns 3: false
	//	 example 4: strrpos('baa', 'a', 2);
	//	 returns 4: 2

	var i = -1;
	if (offset) {
		i = (haystack + '')
			.slice(offset)
			.lastIndexOf(needle); // strrpos' offset indicates starting point of range till end,
		// while lastIndexOf's optional 2nd argument indicates ending point of range from the beginning
		if (i !== -1) {
			i += offset;
		}
	} else {
		i = (haystack + '')
			.lastIndexOf(needle);
	}
	return i >= 0 ? i : false;
}

function strtotime(text, now) {
	//	discuss at: http://phpjs.org/functions/strtotime/
	//		 version: 1109.2016
	// original by: Caio Ariede (http://caioariede.com)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Caio Ariede (http://caioariede.com)
	// improved by: A. Matías Quezada (http://amatiasq.com)
	// improved by: preuter
	// improved by: Brett Zamir (http://brett-zamir.me)
	// improved by: Mirko Faber
	//		input by: David
	// bugfixed by: Wagner B. Soares
	// bugfixed by: Artur Tchernychev
	//				note: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
	//	 example 1: strtotime('+1 day', 1129633200);
	//	 returns 1: 1129719600
	//	 example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
	//	 returns 2: 1130425202
	//	 example 3: strtotime('last month', 1129633200);
	//	 returns 3: 1127041200
	//	 example 4: strtotime('2009-05-04 08:30:00 GMT');
	//	 returns 4: 1241425800

	var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;

	if (!text) {
		return fail;
	}

	// Unecessary spaces
	text = text.replace(/^\s+|\s+$/g, '')
		.replace(/\s{2,}/g, ' ')
		.replace(/[\t\r\n]/g, '')
		.toLowerCase();

	// in contrast to php, js Date.parse function interprets:
	// dates given as yyyy-mm-dd as in timezone: UTC,
	// dates with "." or "-" as MDY instead of DMY
	// dates with two-digit years differently
	// etc...etc...
	// ...therefore we manually parse lots of common date formats
	match = text.match(
		/^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

	if (match && match[2] === match[4]) {
		if (match[1] > 1901) {
			switch (match[2]) {
			case '-':
				{
					// YYYY-M-D
					if (match[3] > 12 || match[5] > 31) {
						return fail;
					}

					return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
						match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
				}
			case '.':
				{
					// YYYY.M.D is not parsed by strtotime()
					return fail;
				}
			case '/':
				{
					// YYYY/M/D
					if (match[3] > 12 || match[5] > 31) {
						return fail;
					}

					return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
						match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
				}
			}
		} else if (match[5] > 1901) {
			switch (match[2]) {
			case '-':
				{
					// D-M-YYYY
					if (match[3] > 12 || match[1] > 31) {
						return fail;
					}

					return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
						match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
				}
			case '.':
				{
					// D.M.YYYY
					if (match[3] > 12 || match[1] > 31) {
						return fail;
					}

					return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
						match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
				}
			case '/':
				{
					// M/D/YYYY
					if (match[1] > 12 || match[3] > 31) {
						return fail;
					}

					return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
						match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
				}
			}
		} else {
			switch (match[2]) {
			case '-':
				{
					// YY-M-D
					if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
						return fail;
					}

					year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
					return new Date(year, parseInt(match[3], 10) - 1, match[5],
						match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
				}
			case '.':
				{
					// D.M.YY or H.MM.SS
					if (match[5] >= 70) {
						// D.M.YY
						if (match[3] > 12 || match[1] > 31) {
							return fail;
						}

						return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
							match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
					}
					if (match[5] < 60 && !match[6]) {
						// H.MM.SS
						if (match[1] > 23 || match[3] > 59) {
							return fail;
						}

						today = new Date();
						return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
							match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
					}

					// invalid format, cannot be parsed
					return fail;
				}
			case '/':
				{
					// M/D/YY
					if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
						return fail;
					}

					year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
					return new Date(year, parseInt(match[1], 10) - 1, match[3],
						match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
				}
			case ':':
				{
					// HH:MM:SS
					if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
						return fail;
					}

					today = new Date();
					return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
						match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
				}
			}
		}
	}

	// other formats and "now" should be parsed by Date.parse()
	if (text === 'now') {
		return now === null || isNaN(now) ? new Date()
			.getTime() / 1000 | 0 : now | 0;
	}
	if (!isNaN(parsed = Date.parse(text))) {
		return parsed / 1000 | 0;
	}

	date = now ? new Date(now * 1000) : new Date();
	days = {
		'sun': 0,
		'mon': 1,
		'tue': 2,
		'wed': 3,
		'thu': 4,
		'fri': 5,
		'sat': 6
	};
	ranges = {
		'yea': 'FullYear',
		'mon': 'Month',
		'day': 'Date',
		'hou': 'Hours',
		'min': 'Minutes',
		'sec': 'Seconds'
	};

	function lastNext(type, range, modifier) {
		var diff, day = days[range];

		if (typeof day !== 'undefined') {
			diff = day - date.getDay();

			if (diff === 0) {
				diff = 7 * modifier;
			} else if (diff > 0 && type === 'last') {
				diff -= 7;
			} else if (diff < 0 && type === 'next') {
				diff += 7;
			}

			date.setDate(date.getDate() + diff);
		}
	}

	function process(val) {
		var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
			type = splt[0],
			range = splt[1].substring(0, 3),
			typeIsNumber = /\d+/.test(type),
			ago = splt[2] === 'ago',
			num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

		if (typeIsNumber) {
			num *= parseInt(type, 10);
		}

		if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
			return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
		}

		if (range === 'wee') {
			return date.setDate(date.getDate() + (num * 7));
		}

		if (type === 'next' || type === 'last') {
			lastNext(type, range, num);
		} else if (!typeIsNumber) {
			return false;
		}

		return true;
	}

	times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
		'|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
		'|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
	regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

	match = text.match(new RegExp(regex, 'gi'));
	if (!match) {
		return fail;
	}

	for (i = 0, len = match.length; i < len; i++) {
		if (!process(match[i])) {
			return fail;
		}
	}

	// ECMAScript 5 only
	// if (!match.every(process))
	//		return false;

	return (date.getTime() / 1000);
}

function trim(str, charlist) {
	//	discuss at: http://phpjs.org/functions/trim/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: mdsjack (http://www.mdsjack.bo.it)
	// improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Steven Levithan (http://blog.stevenlevithan.com)
	// improved by: Jack
	//		input by: Erkekjetter
	//		input by: DxGx
	// bugfixed by: Onno Marsman
	//	 example 1: trim('		Kevin van Zonneveld		');
	//	 returns 1: 'Kevin van Zonneveld'
	//	 example 2: trim('Hello World', 'Hdle');
	//	 returns 2: 'o Wor'
	//	 example 3: trim(16, 1);
	//	 returns 3: 6

	var whitespace, l = 0,
		i = 0;
	str += '';

	if (!charlist) {
		// default list
		whitespace =
			' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
	} else {
		// preg_quote custom list
		charlist += '';
		whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
	}

	l = str.length;
	for (i = 0; i < l; i++) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(i);
			break;
		}
	}

	l = str.length;
	for (i = l - 1; i >= 0; i--) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(0, i + 1);
			break;
		}
	}

	return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

function ucfirst(str) {
	//	discuss at: http://phpjs.org/functions/ucfirst/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: Onno Marsman
	// improved by: Brett Zamir (http://brett-zamir.me)
	//	 example 1: ucfirst('kevin van zonneveld');
	//	 returns 1: 'Kevin van zonneveld'

	str += '';
	var f = str.charAt(0)
		.toUpperCase();
	return f + str.substr(1);
}

function ucwords(str) {
	//	discuss at: http://phpjs.org/functions/ucwords/
	// original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	// improved by: Waldo Malqui Silva (http://waldo.malqui.info)
	// improved by: Robin
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: Onno Marsman
	//		input by: James (http://www.james-bell.co.uk/)
	//	 example 1: ucwords('kevin van	zonneveld');
	//	 returns 1: 'Kevin Van	Zonneveld'
	//	 example 2: ucwords('HELLO WORLD');
	//	 returns 2: 'HELLO WORLD'

	return (str + '')
		.replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
			return $1.toUpperCase();
		});
}

function utf8_decode(str_data) {
	//	discuss at: http://phpjs.org/functions/utf8_decode/
	// original by: Webtoolkit.info (http://www.webtoolkit.info/)
	//		input by: Aman Gupta
	//		input by: Brett Zamir (http://brett-zamir.me)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Norman "zEh" Fuchs
	// bugfixed by: hitwork
	// bugfixed by: Onno Marsman
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: kirilloid
	// bugfixed by: w35l3y (http://www.wesley.eti.br)
	//	 example 1: utf8_decode('Kevin van Zonneveld');
	//	 returns 1: 'Kevin van Zonneveld'

	var tmp_arr = [],
		i = 0,
		c1 = 0,
		seqlen = 0;

	str_data += '';

	while (i < str_data.length) {
		c1 = str_data.charCodeAt(i) & 0xFF;
		seqlen = 0;

		// http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
		if (c1 <= 0xBF) {
			c1 = (c1 & 0x7F);
			seqlen = 1;
		} else if (c1 <= 0xDF) {
			c1 = (c1 & 0x1F);
			seqlen = 2;
		} else if (c1 <= 0xEF) {
			c1 = (c1 & 0x0F);
			seqlen = 3;
		} else {
			c1 = (c1 & 0x07);
			seqlen = 4;
		}

		for (var ai = 1; ai < seqlen; ++ai) {
			c1 = ((c1 << 0x06) | (str_data.charCodeAt(ai + i) & 0x3F));
		}

		if (seqlen == 4) {
			c1 -= 0x10000;
			tmp_arr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)), String.fromCharCode(0xDC00 | (c1 & 0x3FF)));
		} else {
			tmp_arr.push(String.fromCharCode(c1));
		}

		i += seqlen;
	}

	return tmp_arr.join("");
}

function utf8_encode(argString) {
	//	discuss at: http://phpjs.org/functions/utf8_encode/
	// original by: Webtoolkit.info (http://www.webtoolkit.info/)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: sowberry
	// improved by: Jack
	// improved by: Yves Sucaet
	// improved by: kirilloid
	// bugfixed by: Onno Marsman
	// bugfixed by: Onno Marsman
	// bugfixed by: Ulrich
	// bugfixed by: Rafal Kukawski
	// bugfixed by: kirilloid
	//	 example 1: utf8_encode('Kevin van Zonneveld');
	//	 returns 1: 'Kevin van Zonneveld'

	if (argString === null || typeof argString === 'undefined') {
		return '';
	}

	// .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	var string = (argString + '');
	var utftext = '',
		start, end, stringl = 0;

	start = end = 0;
	stringl = string.length;
	for (var n = 0; n < stringl; n++) {
		var c1 = string.charCodeAt(n);
		var enc = null;

		if (c1 < 128) {
			end++;
		} else if (c1 > 127 && c1 < 2048) {
			enc = String.fromCharCode(
				(c1 >> 6) | 192, (c1 & 63) | 128
			);
		} else if ((c1 & 0xF800) != 0xD800) {
			enc = String.fromCharCode(
				(c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
			);
		} else {
			// surrogate pairs
			if ((c1 & 0xFC00) != 0xD800) {
				throw new RangeError('Unmatched trail surrogate at ' + n);
			}
			var c2 = string.charCodeAt(++n);
			if ((c2 & 0xFC00) != 0xDC00) {
				throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
			}
			c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
			enc = String.fromCharCode(
				(c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
			);
		}
		if (enc !== null) {
			if (end > start) {
				utftext += string.slice(start, end);
			}
			utftext += enc;
			start = end = n + 1;
		}
	}

	if (end > start) {
		utftext += string.slice(start, stringl);
	}

	return utftext;
}
(function($) {

	$.isset = function(v, d) {

		return (typeof(v) != "undefined" && v !== null) ? v : d;

	};

})(jQuery);

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


/*! @preserve
 * bootbox.js
 * version: 6.0.0
 * author: Nick Payne <nick@kurai.co.uk>
 * license: MIT
 * http://bootboxjs.com/
 */
(function(root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals (root is window)
    root.bootbox = factory(root.jQuery);
  }
}(this, function init($, undefined) {
  'use strict';

  let exports = {};

  let VERSION = '6.0.0';
  exports.VERSION = VERSION;

  let locales = {
    'en': {
      OK: 'OK',
      CANCEL: 'Cancel',
      CONFIRM: 'OK'
    }
  };

  let templates = {
    dialog: '<div class="bootbox modal" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-body"><div class="bootbox-body"></div></div></div></div></div>',
    header: '<div class="modal-header"><h5 class="modal-title"></h5></div>',
    footer: '<div class="modal-footer"></div>',
    closeButton: '<button type="button" class="bootbox-close-button close btn-close" aria-hidden="true" aria-label="Close"></button>',
    form: '<form class="bootbox-form"></form>',
    button: '<button type="button" class="btn"></button>',
    option: '<option value=""></option>',
    promptMessage: '<div class="bootbox-prompt-message"></div>',
    inputs: {
      text: '<input class="bootbox-input bootbox-input-text form-control" autocomplete="off" type="text" />',
      textarea: '<textarea class="bootbox-input bootbox-input-textarea form-control"></textarea>',
      email: '<input class="bootbox-input bootbox-input-email form-control" autocomplete="off" type="email" />',
      select: '<select class="bootbox-input bootbox-input-select form-select"></select>',
      checkbox: '<div class="form-check checkbox"><label class="form-check-label"><input class="form-check-input bootbox-input bootbox-input-checkbox" type="checkbox" /></label></div>',
      radio: '<div class="form-check radio"><label class="form-check-label"><input class="form-check-input bootbox-input bootbox-input-radio" type="radio" name="bootbox-radio" /></label></div>',
      date: '<input class="bootbox-input bootbox-input-date form-control" autocomplete="off" type="date" />',
      time: '<input class="bootbox-input bootbox-input-time form-control" autocomplete="off" type="time" />',
      number: '<input class="bootbox-input bootbox-input-number form-control" autocomplete="off" type="number" />',
      password: '<input class="bootbox-input bootbox-input-password form-control" autocomplete="off" type="password" />',
      range: '<input class="bootbox-input bootbox-input-range form-control-range" autocomplete="off" type="range" />'
    }
  };


  let defaults = {
    // Default language used when generating buttons for alert, confirm, and prompt dialogs
    locale: 'en',
    // Show backdrop or not. Default to static so user has to interact with dialog
    backdrop: 'static',
    // Animate the modal in/out
    animate: true,
    // Additional class string applied to the top level dialog
    className: null,
    // Whether or not to include a close button
    closeButton: true,
    // Show the dialog immediately by default
    show: true,
    // Dialog container
    container: 'body',
    // Default value (used by the prompt helper)
    value: '',
    // Default input type (used by the prompt helper)
    inputType: 'text',
    // Custom error message to report if prompt fails validation
    errorMessage: null,
    // Switch button order from cancel/confirm (default) to confirm/cancel
    swapButtonOrder: false,
    // Center modal vertically in page
    centerVertical: false,
    // Append "multiple" property to the select when using the "prompt" helper
    multiple: false,
    // Automatically scroll modal content when height exceeds viewport height
    scrollable: false,
    // Whether or not to destroy the modal on hide
    reusable: false,
    // The element which triggered the dialog
    relatedTarget: null,
    // The size of the modal to generate
    size: null,
    // A unique indentifier for this modal
    id: null
  };


  // PUBLIC FUNCTIONS
  // *************************************************************************************************************

  /**
   * Return all currently registered locales, or a specific locale if "name" is defined
   * @param {string} [name]
   * @returns {(Object|Object[])} An array of the available locale objects, or a single locale object if {name} is not null
   */
  exports.locales = function(name) {
    return name ? locales[name] : locales;
  };


  /**
   * Register localized strings for the OK, CONFIRM, and CANCEL buttons
   * @param {string} name - The key used to identify the new locale in the locales array
   * @param {Object} values - An object containing the localized string for each of the OK, CANCEL, and CONFIRM properties of a locale
   * @returns The updated bootbox object
   */
  exports.addLocale = function(name, values) {
    $.each(['OK', 'CANCEL', 'CONFIRM'], function(_, v) {
      if (!values[v]) {
        throw new Error('Please supply a translation for "' + v + '"');
      }
    });

    locales[name] = {
      OK: values.OK,
      CANCEL: values.CANCEL,
      CONFIRM: values.CONFIRM
    };

    return exports;
  };


  /**
   * Remove a previously-registered locale
   * @param {string} name - The key identifying the locale to remove
   * @returns The updated bootbox object
   */
  exports.removeLocale = function(name) {
    if (name !== 'en') {
      delete locales[name];
    } else {
      throw new Error('"en" is used as the default and fallback locale and cannot be removed.');
    }

    return exports;
  };


  /**
   * Set the default locale
   * @param {string} name - The key identifying the locale to set as the default locale for all future bootbox calls 
   * @returns The updated bootbox object
   */
  exports.setLocale = function(name) {
    return exports.setDefaults('locale', name);
  };


  /**
   * Override default value(s) of Bootbox.
   * @returns The updated bootbox object
   */
  exports.setDefaults = function() {
    let values = {};

    if (arguments.length === 2) {
      // Allow passing of single key/value...
      values[arguments[0]] = arguments[1];
    } else {
      // ... and as an object too
      values = arguments[0];
    }

    $.extend(defaults, values);

    return exports;
  };


  /**
   * Hides all currently active Bootbox modals
   * @returns The current bootbox object
   */
  exports.hideAll = function() {
    $('.bootbox').modal('hide');

    return exports;
  };


  /**
   * Allows the base init() function to be overridden
   * @param {function} _$ - A function to be called when the bootbox instance is created
   * @returns The current bootbox object
   */
  exports.init = function(_$) {
    return init(_$ || $);
  };


  // CORE HELPER FUNCTIONS
  // *************************************************************************************************************

  /**
   * The core dialog helper function, which can be used to create any custom Bootstrap modal. 
   * @param {Object} options - An object used to configure the various properties which define a Bootbox dialog
   * @returns A jQuery object upon which Bootstrap's modal function has been called
   */
  exports.dialog = function(options) {
    if ($.fn.modal === undefined) {
      throw new Error(
        '"$.fn.modal" is not defined; please double check you have included the Bootstrap JavaScript library. See https://getbootstrap.com/docs/5.1/getting-started/introduction/ for more details.'
      );
    }

    options = sanitize(options);

    if ($.fn.modal.Constructor.VERSION) {
      options.fullBootstrapVersion = $.fn.modal.Constructor.VERSION;
      let i = options.fullBootstrapVersion.indexOf('.');
      options.bootstrap = options.fullBootstrapVersion.substring(0, i);
    } else {
      // Assuming version 2.3.2, as that was the last "supported" 2.x version
      options.bootstrap = '2';
      options.fullBootstrapVersion = '2.3.2';
      console.warn('Bootbox will *mostly* work with Bootstrap 2, but we do not officially support it. Please upgrade, if possible.');
    }

    let dialog = $(templates.dialog);
    let innerDialog = dialog.find('.modal-dialog');
    let body = dialog.find('.modal-body');
    let header = $(templates.header);
    let footer = $(templates.footer);
    let buttons = options.buttons;

    let callbacks = {
      onEscape: options.onEscape
    };

    body.find('.bootbox-body').html(options.message);

    // Only attempt to create buttons if at least one has been defined in the options object
    if (getKeyLength(options.buttons) > 0) {
      each(buttons, function(key, b) {
        let button = $(templates.button);
        button.data('bb-handler', key);
        button.addClass(b.className);

        switch (key) {
          case 'ok':
          case 'confirm':
            button.addClass('bootbox-accept');
            break;

          case 'cancel':
            button.addClass('bootbox-cancel');
            break;
        }

        button.html(b.label);

        if (b.id) {
          button.attr({
            'id': b.id
          });
        }

        if (b.disabled === true) {
          button.prop({
            disabled: true
          });
        }

        footer.append(button);

        callbacks[key] = b.callback;
      });

      body.after(footer);
    }

    if (options.animate === true) {
      dialog.addClass('fade');
    }

    if (options.className) {
      dialog.addClass(options.className);
    }

    if (options.id) {
      dialog.attr({
        'id': options.id
      });
    }

    if (options.size) {
      // Requires Bootstrap 3.1.0 or higher
      if (options.fullBootstrapVersion.substring(0, 3) < '3.1') {
        console.warn('"size" requires Bootstrap 3.1.0 or higher. You appear to be using ' + options.fullBootstrapVersion + '. Please upgrade to use this option.');
      }

      switch (options.size) {
        case 'small':
        case 'sm':
          innerDialog.addClass('modal-sm');
          break;

        case 'large':
        case 'lg':
          innerDialog.addClass('modal-lg');
          break;

        case 'extra-large':
        case 'xl':
          innerDialog.addClass('modal-xl');

          // Requires Bootstrap 4.2.0 or higher
          if (options.fullBootstrapVersion.substring(0, 3) < '4.2') {
            console.warn('Using size "xl"/"extra-large" requires Bootstrap 4.2.0 or higher. You appear to be using ' + options.fullBootstrapVersion + '. Please upgrade to use this option.');
          }
          break;
      }
    }

    if (options.scrollable) {
      innerDialog.addClass('modal-dialog-scrollable');

      // Requires Bootstrap 4.3.0 or higher
      if (options.fullBootstrapVersion.substring(0, 3) < '4.3') {
        console.warn('Using "scrollable" requires Bootstrap 4.3.0 or higher. You appear to be using ' + options.fullBootstrapVersion + '. Please upgrade to use this option.');
      }
    }

    if (options.title || options.closeButton) {
      if (options.title) {
        header.find('.modal-title').html(options.title);
      } else {
        header.addClass('border-0');
      }

      if (options.closeButton) {
        let closeButton = $(templates.closeButton);
        if (options.bootstrap < 5) {
          closeButton.html('&times;');
        }

        /* Note: the close button for Bootstrap 5+ does not contain content */
        if (options.bootstrap < 4) {
          /* Bootstrap 3 and under */
          header.prepend(closeButton);
        } else {
          header.append(closeButton);
        }
      }

      body.before(header);
    }

    if (options.centerVertical) {
      innerDialog.addClass('modal-dialog-centered');

      // Requires Bootstrap 4.0.0-beta.3 or higher
      if (options.fullBootstrapVersion < '4.0.0') {
        console.warn('"centerVertical" requires Bootstrap 4.0.0-beta.3 or higher. You appear to be using ' + options.fullBootstrapVersion + '. Please upgrade to use this option.');
      }
    }

    // Bootstrap event listeners; these handle extra setup & teardown required after the underlying modal has performed certain actions.

    if (!options.reusable) {
      // make sure we unbind any listeners once the dialog has definitively been dismissed
      dialog.one('hide.bs.modal', {
        dialog: dialog
      }, unbindModal);
      dialog.one('hidden.bs.modal', {
        dialog: dialog
      }, destroyModal);
    }

    if (options.onHide) {
      if ($.isFunction(options.onHide)) {
        dialog.on('hide.bs.modal', options.onHide);
      } else {
        throw new Error('Argument supplied to "onHide" must be a function');
      }
    }

    if (options.onHidden) {
      if ($.isFunction(options.onHidden)) {
        dialog.on('hidden.bs.modal', options.onHidden);
      } else {
        throw new Error('Argument supplied to "onHidden" must be a function');
      }
    }

    if (options.onShow) {
      if ($.isFunction(options.onShow)) {
        dialog.on('show.bs.modal', options.onShow);
      } else {
        throw new Error('Argument supplied to "onShow" must be a function');
      }
    }

    dialog.one('shown.bs.modal', {
      dialog: dialog
    }, focusPrimaryButton);

    if (options.onShown) {
      if ($.isFunction(options.onShown)) {
        dialog.on('shown.bs.modal', options.onShown);
      } else {
        throw new Error('Argument supplied to "onShown" must be a function');
      }
    }

    // Bootbox event listeners; used to decouple some behaviours from their respective triggers

    if (options.backdrop === true) {
      let startedOnBody = false;

      // Prevents the event from propagating to the backdrop, when something inside the dialog is clicked
      dialog.on('mousedown', '.modal-content', function(e) {
        e.stopPropagation();

        startedOnBody = true;
      });

      // A boolean true/false according to the Bootstrap docs should show a dialog the user can dismiss by clicking on the background.
      // We always only ever pass static/false to the actual $.modal function because with "true" we can't trap this event (the .modal-backdrop swallows it).
      // However, we still want to sort-of respect true and invoke the escape mechanism instead
      dialog.on('click.dismiss.bs.modal', function(e) {
        if (startedOnBody || e.target !== e.currentTarget) {
          return;
        }

        dialog.trigger('escape.close.bb');
      });
    }

    dialog.on('escape.close.bb', function(e) {
      // The if() statement looks redundant but it isn't; without it, if we *didn't* have an onEscape handler then processCallback would automatically dismiss the dialog
      if (callbacks.onEscape) {
        processCallback(e, dialog, callbacks.onEscape);
      }
    });

    dialog.on('click', '.modal-footer button:not(.disabled)', function(e) {
      let callbackKey = $(this).data('bb-handler');

      if (callbackKey !== undefined) {
        // Only process callbacks for buttons we recognize:
        processCallback(e, dialog, callbacks[callbackKey]);
      }
    });

    dialog.on('click', '.bootbox-close-button', function(e) {
      // onEscape might be falsy, but that's fine; the fact is if the user has managed to click the close button we have to close the dialog, callback or not
      processCallback(e, dialog, callbacks.onEscape);
    });

    dialog.on('keyup', function(e) {
      if (e.which === 27) {
        dialog.trigger('escape.close.bb');
      }
    });

    /*
    The remainder of this method simply deals with adding our dialog element to the DOM, augmenting it with 
    Bootstrap's modal functionality and then giving the resulting object back to our caller
    */

    $(options.container).append(dialog);

    dialog.modal({
      backdrop: options.backdrop,
      keyboard: false,
      show: false
    });

    if (options.show) {
      dialog.modal('show', options.relatedTarget);
    }

    return dialog;
  };


  /**
   * Helper function to simulate the native alert() behavior. **NOTE**: This is non-blocking, so any code that must happen after the alert is dismissed should be placed within the callback function for this alert.
   * @returns  A jQuery object upon which Bootstrap's modal function has been called
   */
  exports.alert = function() {
    let options;

    options = mergeDialogOptions('alert', ['ok'], ['message', 'callback'], arguments);

    // @TODO: can this move inside exports.dialog when we're iterating over each button and checking its button.callback value instead?
    if (options.callback && !$.isFunction(options.callback)) {
      throw new Error('alert requires the "callback" property to be a function when provided');
    }

    // Override the ok and escape callback to make sure they just invoke the single user-supplied one (if provided)
    options.buttons.ok.callback = options.onEscape = function() {
      if ($.isFunction(options.callback)) {
        return options.callback.call(this);
      }

      return true;
    };

    return exports.dialog(options);
  };


  /**
   * Helper function to simulate the native confirm() behavior. **NOTE**: This is non-blocking, so any code that must happen after the confirm is dismissed should be placed within the callback function for this confirm.
   * @returns A jQuery object upon which Bootstrap's modal function has been called
   */
  exports.confirm = function() {
    let options;

    options = mergeDialogOptions('confirm', ['cancel', 'confirm'], ['message', 'callback'], arguments);

    // confirm specific validation; they don't make sense without a callback so make sure it's present
    if (!$.isFunction(options.callback)) {
      throw new Error('confirm requires a callback');
    }

    // Overrides; undo anything the user tried to set they shouldn't have
    options.buttons.cancel.callback = options.onEscape = function() {
      return options.callback.call(this, false);
    };

    options.buttons.confirm.callback = function() {
      return options.callback.call(this, true);
    };

    return exports.dialog(options);
  };


  /**
   * Helper function to simulate the native prompt() behavior. **NOTE**: This is non-blocking, so any code that must happen after the prompt is dismissed should be placed within the callback function for this prompt.
   * @returns A jQuery object upon which Bootstrap's modal function has been called
   */
  exports.prompt = function() {
    let options;
    let promptDialog;
    let form;
    let input;
    let shouldShow;
    let inputOptions;

    // We have to create our form first, otherwise its value is undefined when gearing up our options.
    // @TODO this could be solved by allowing message to be a function instead...
    form = $(templates.form);

    // prompt defaults are more complex than others in that users can override more defaults
    options = mergeDialogOptions('prompt', ['cancel', 'confirm'], ['title', 'callback'], arguments);

    if (!options.value) {
      options.value = defaults.value;
    }

    if (!options.inputType) {
      options.inputType = defaults.inputType;
    }

    // Capture the user's 'show' value; we always set this to false before spawning the dialog to give us a chance to attach some handlers to it, but we need to make sure we respect a preference not to show it
    shouldShow = (options.show === undefined) ? defaults.show : options.show;

    // This is required prior to calling the dialog builder below - we need to add an event handler just before the prompt is shown
    options.show = false;

    // Handles the 'cancel' action
    options.buttons.cancel.callback = options.onEscape = function() {
      return options.callback.call(this, null);
    };

    // Prompt submitted - extract the prompt value. This requires a bit of work, given the different input types available.
    options.buttons.confirm.callback = function() {
      let value;

      if (options.inputType === 'checkbox') {
        value = input.find('input:checked').map(function() {
          return $(this).val();
        }).get();
      } else if (options.inputType === 'radio') {
        value = input.find('input:checked').val();
      } else {
        let el = input[0];

        // Clear any previous custom error message
        if (options.errorMessage) {
          el.setCustomValidity('');
        }

        if (el.checkValidity && !el.checkValidity()) {
          // If a custom error message was provided, add it now
          if (options.errorMessage) {
            el.setCustomValidity(options.errorMessage);
          }

          if (el.reportValidity) {
            el.reportValidity();
          }

          // prevents button callback from being called
          return false;
        } else {
          if (options.inputType === 'select' && options.multiple === true) {
            value = input.find('option:selected').map(function() {
              return $(this).val();
            }).get();
          } else {
            value = input.val();
          }
        }
      }

      return options.callback.call(this, value);
    };

    // prompt-specific validation
    if (!options.title) {
      throw new Error('prompt requires a title');
    }

    if (!$.isFunction(options.callback)) {
      throw new Error('prompt requires a callback');
    }

    if (!templates.inputs[options.inputType]) {
      throw new Error('Invalid prompt type');
    }

    // Create the input based on the supplied type
    input = $(templates.inputs[options.inputType]);

    switch (options.inputType) {
      case 'text':
      case 'textarea':
      case 'email':
      case 'password':
        input.val(options.value);

        if (options.placeholder) {
          input.attr('placeholder', options.placeholder);
        }

        if (options.pattern) {
          input.attr('pattern', options.pattern);
        }

        if (options.maxlength) {
          input.attr('maxlength', options.maxlength);
        }

        if (options.required) {
          input.prop({
            'required': true
          });
        }

        if (options.rows && !isNaN(parseInt(options.rows))) {
          if (options.inputType === 'textarea') {
            input.attr({
              'rows': options.rows
            });
          }
        }
        break;

      case 'date':
      case 'time':
      case 'number':
      case 'range':
        input.val(options.value);

        if (options.placeholder) {
          input.attr('placeholder', options.placeholder);
        }

        if (options.pattern) {
          input.attr('pattern', options.pattern);
        } else {
          if (options.inputType === 'date') {
            // Add the ISO-8601 short date format as a fallback for browsers without native type="date" support
            input.attr('pattern', '\d{4}-\d{2}-\d{2}');
          } else if (options.inputType === 'time') {
            // Add an HH:MM pattern as a fallback for browsers without native type="time" support
            input.attr('pattern', '\d{2}:\d{2}');
          }
        }

        if (options.required) {
          input.prop({
            'required': true
          });
        }

        // These input types have extra attributes which affect their input validation.
        // Warning: For most browsers, date inputs are buggy in their implementation of 'step', so this attribute will have no effect. Therefore, we don't set the attribute for date inputs.
        // @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date#Setting_maximum_and_minimum_dates
        if (options.inputType !== 'date') {
          if (options.step) {
            if (options.step === 'any' || (!isNaN(options.step) && parseFloat(options.step) > 0)) {
              input.attr('step', options.step);
            } else {
              throw new Error('"step" must be a valid positive number or the value "any". See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-step for more information.');
            }
          }
        }

        if (minAndMaxAreValid(options.inputType, options.min, options.max)) {
          if (options.min !== undefined) {
            input.attr('min', options.min);
          }
          if (options.max !== undefined) {
            input.attr('max', options.max);
          }
        }
        break;

      case 'select':
        let groups = {};
        inputOptions = options.inputOptions || [];

        if (!$.isArray(inputOptions)) {
          throw new Error('Please pass an array of input options');
        }

        if (!inputOptions.length) {
          throw new Error('prompt with "inputType" set to "select" requires at least one option');
        }

        if (options.required) {
          input.prop({
            'required': true
          });
        }

        if (options.multiple) {
          input.prop({
            'multiple': true
          });
        }

        each(inputOptions, function(_, option) {
          // Assume the element to attach to is the input...
          let elem = input;

          if (option.value === undefined || option.text === undefined) {
            throw new Error('each option needs a "value" property and a "text" property');
          }

          // ... but override that element if this option sits in a group

          if (option.group) {
            // Initialise group if necessary
            if (!groups[option.group]) {
              groups[option.group] = $('<optgroup />').attr('label', option.group);
            }

            elem = groups[option.group];
          }

          let o = $(templates.option);
          o.attr('value', option.value).text(option.text);
          elem.append(o);
        });

        each(groups, function(_, group) {
          input.append(group);
        });

        // Safe to set a select's value as per a normal input
        input.val(options.value);
        if (options.bootstrap < 5) {
          input.removeClass('form-select').addClass('form-control');
        }
        break;

      case 'checkbox':
        let checkboxValues = $.isArray(options.value) ? options.value : [options.value];
        inputOptions = options.inputOptions || [];

        if (!inputOptions.length) {
          throw new Error('prompt with "inputType" set to "checkbox" requires at least one option');
        }

        // Checkboxes have to nest within a containing element, so they break the rules a bit and we end up re-assigning our 'input' element to this container instead
        input = $('<div class="bootbox-checkbox-list"></div>');

        each(inputOptions, function(_, option) {
          if (option.value === undefined || option.text === undefined) {
            throw new Error('each option needs a "value" property and a "text" property');
          }

          let checkbox = $(templates.inputs[options.inputType]);

          checkbox.find('input').attr('value', option.value);
          checkbox.find('label').append('\n' + option.text);

          // We've ensured values is an array, so we can always iterate over it
          each(checkboxValues, function(_, value) {
            if (value === option.value) {
              checkbox.find('input').prop('checked', true);
            }
          });

          input.append(checkbox);
        });
        break;

      case 'radio':
        // Make sure that value is not an array (only a single radio can ever be checked)
        if (options.value !== undefined && $.isArray(options.value)) {
          throw new Error('prompt with "inputType" set to "radio" requires a single, non-array value for "value"');
        }

        inputOptions = options.inputOptions || [];

        if (!inputOptions.length) {
          throw new Error('prompt with "inputType" set to "radio" requires at least one option');
        }

        // Radiobuttons have to nest within a containing element, so they break the rules a bit and we end up re-assigning our 'input' element to this container instead
        input = $('<div class="bootbox-radiobutton-list"></div>');

        // Radiobuttons should always have an initial checked input checked in a "group".
        // If value is undefined or doesn't match an input option, select the first radiobutton
        let checkFirstRadio = true;

        each(inputOptions, function(_, option) {
          if (option.value === undefined || option.text === undefined) {
            throw new Error('each option needs a "value" property and a "text" property');
          }

          let radio = $(templates.inputs[options.inputType]);

          radio.find('input').attr('value', option.value);
          radio.find('label').append('\n' + option.text);

          if (options.value !== undefined) {
            if (option.value === options.value) {
              radio.find('input').prop('checked', true);
              checkFirstRadio = false;
            }
          }

          input.append(radio);
        });

        if (checkFirstRadio) {
          input.find('input[type="radio"]').first().prop('checked', true);
        }
        break;
    }

    // Now place it in our form
    form.append(input);

    form.on('submit', function(e) {
      e.preventDefault();
      // Fix for SammyJS (or similar JS routing library) hijacking the form post.
      e.stopPropagation();

      // @TODO can we actually click *the* button object instead?
      // e.g. buttons.confirm.click() or similar
      promptDialog.find('.bootbox-accept').trigger('click');
    });

    if ($.trim(options.message) !== '') {
      // Add the form to whatever content the user may have added.
      let message = $(templates.promptMessage).html(options.message);
      form.prepend(message);
      options.message = form;
    } else {
      options.message = form;
    }

    // Generate the dialog
    promptDialog = exports.dialog(options);

    // Clear the existing handler focusing the submit button...
    promptDialog.off('shown.bs.modal', focusPrimaryButton);

    // ...and replace it with one focusing our input, if possible
    promptDialog.on('shown.bs.modal', function() {
      // Need the closure here since input isn'tcan object otherwise
      input.focus();
    });

    if (shouldShow === true) {
      promptDialog.modal('show');
    }

    return promptDialog;
  };


  // INTERNAL FUNCTIONS
  // *************************************************************************************************************

  // Map a flexible set of arguments into a single returned object.
  // If args.length is already one just return it, otherwise use the properties argument to map the unnamed args to object properties.
  // So in the latter case:
  //
  //    mapArguments(["foo", $.noop], ["message", "callback"])
  //  
  //  results in
  //
  //    { message: "foo", callback: $.noop }
  //
  function mapArguments(args, properties) {
    let argsLength = args.length;
    let options = {};

    if (argsLength < 1 || argsLength > 2) {
      throw new Error('Invalid argument length');
    }

    if (argsLength === 2 || typeof args[0] === 'string') {
      options[properties[0]] = args[0];
      options[properties[1]] = args[1];
    } else {
      options = args[0];
    }

    return options;
  }


  // Merge a set of default dialog options with user supplied arguments
  function mergeArguments(defaults, args, properties) {
    return $.extend(
      // Deep merge
      true,
      // Ensure the target is an empty, unreferenced object
      {},
      // The base options object for this type of dialog (often just buttons)
      defaults,
      // 'args' could be an object or array; if it's an array properties will map it to a proper options object
      mapArguments(args, properties)
    );
  }


  // This entry-level method makes heavy use of composition to take a simple range of inputs and return valid options suitable for passing to bootbox.dialog
  function mergeDialogOptions(className, labels, properties, args) {
    let locale;
    if (args && args[0]) {
      locale = args[0].locale || defaults.locale;
      let swapButtons = args[0].swapButtonOrder || defaults.swapButtonOrder;

      if (swapButtons) {
        labels = labels.reverse();
      }
    }

    // Build up a base set of dialog properties
    let baseOptions = {
      className: 'bootbox-' + className,
      buttons: createLabels(labels, locale)
    };

    // Ensure the buttons properties generated, *after* merging with user args are still valid against the supplied labels
    return validateButtons(
      // Merge the generated base properties with user supplied arguments
      mergeArguments(
        baseOptions,
        args,
        // If args.length > 1, properties specify how each arg maps to an object key
        properties
      ),
      labels
    );
  }


  // Checks each button object to see if key is valid. 
  // This function will only be called by the alert, confirm, and prompt helpers. 
  function validateButtons(options, buttons) {
    let allowedButtons = {};
    each(buttons, function(key, value) {
      allowedButtons[value] = true;
    });

    each(options.buttons, function(key) {
      if (allowedButtons[key] === undefined) {
        throw new Error('button key "' + key + '" is not allowed (options are ' + buttons.join(' ') + ')');
      }
    });

    return options;
  }


  // From a given list of arguments, return a suitable object of button labels.
  // All this does is normalise the given labels and translate them where possible.
  // e.g. "ok", "confirm" -> { ok: "OK", cancel: "Annuleren" }
  function createLabels(labels, locale) {
    let buttons = {};

    for (let i = 0, j = labels.length; i < j; i++) {
      let argument = labels[i];
      let key = argument.toLowerCase();
      let value = argument.toUpperCase();

      buttons[key] = {
        label: getText(value, locale)
      };
    }

    return buttons;
  }


  // Get localized text from a locale. Defaults to 'en' locale if no locale provided or a non-registered locale is requested
  function getText(key, locale) {
    let labels = locales[locale];

    return labels ? labels[key] : locales.en[key];
  }


  // Filter and tidy up any user supplied parameters to this dialog.
  // Also looks for any shorthands used and ensures that the options which are returned are all normalized properly
  function sanitize(options) {
    let buttons;
    let total;

    if (typeof options !== 'object') {
      throw new Error('Please supply an object of options');
    }

    if (!options.message) {
      throw new Error('"message" option must not be null or an empty string.');
    }

    // Make sure any supplied options take precedence over defaults
    options = $.extend({}, defaults, options);

    // Make sure backdrop is either true, false, or 'static'
    if (!options.backdrop) {
      options.backdrop = (options.backdrop === false || options.backdrop === 0) ? false : 'static';
    } else {
      options.backdrop = typeof options.backdrop === 'string' && options.backdrop.toLowerCase() === 'static' ? 'static' : true;
    }

    // No buttons is still a valid dialog but it's cleaner to always have a buttons object to iterate over, even if it's empty
    if (!options.buttons) {
      options.buttons = {};
    }

    buttons = options.buttons;

    total = getKeyLength(buttons);

    each(buttons, function(key, button, index) {
      if ($.isFunction(button)) {
        // Short form, assume value is our callback. Since button isn't an object it isn't a reference either so re-assign it
        button = buttons[key] = {
          callback: button
        };
      }

      // Before any further checks, make sure button is the correct type
      if ($.type(button) !== 'object') {
        throw new Error('button with key "' + key + '" must be an object');
      }

      if (!button.label) {
        // The lack of an explicit label means we'll assume the key is good enough
        button.label = key;
      }

      if (!button.className) {
        let isPrimary = false;
        if (options.swapButtonOrder) {
          isPrimary = index === 0;
        } else {
          isPrimary = index === total - 1;
        }

        if (total <= 2 && isPrimary) {
          // always add a primary to the main option in a one or two-button dialog
          button.className = 'btn-primary';
        } else {
          // adding both classes allows us to target both BS3 and BS4+ without needing to check the version
          button.className = 'btn-secondary btn-default';
        }
      }
    });

    return options;
  }


  // Returns a count of the properties defined on the object
  function getKeyLength(obj) {
    return Object.keys(obj).length;
  }


  // Tiny wrapper function around jQuery.each; just adds index as the third parameter
  function each(collection, iterator) {
    let index = 0;
    $.each(collection, function(key, value) {
      iterator(key, value, index++);
    });
  }


  function focusPrimaryButton(e) {
    e.data.dialog.find('.bootbox-accept').first().trigger('focus');
  }


  function destroyModal(e) {
    // Ensure we don't accidentally intercept hidden events triggered by children of the current dialog. 
    // We shouldn't need to handle this anymore, now that Bootstrap namespaces its events, but still worth doing.
    if (e.target === e.data.dialog[0]) {
      e.data.dialog.remove();
    }
  }


  function unbindModal(e) {
    if (e.target === e.data.dialog[0]) {
      e.data.dialog.off('escape.close.bb');
      e.data.dialog.off('click');
    }
  }


  //  Handle the invoked dialog callback
  function processCallback(e, dialog, callback) {
    e.stopPropagation();
    e.preventDefault();

    // By default we assume a callback will get rid of the dialog, although it is given the opportunity to override this

    // If the callback can be invoked and it *explicitly returns false*, then we'll set a flag to keep the dialog active...
    let preserveDialog = $.isFunction(callback) && callback.call(dialog, e) === false;

    // ... otherwise we'll bin it
    if (!preserveDialog) {
      dialog.modal('hide');
    }
  }

  // Validate `min` and `max` values based on the current `inputType` value
  function minAndMaxAreValid(type, min, max) {
    let result = false;
    let minValid = true;
    let maxValid = true;

    if (type === 'date') {
      if (min !== undefined && !(minValid = dateIsValid(min))) {
        console.warn('Browsers which natively support the "date" input type expect date values to be of the form "YYYY-MM-DD" (see ISO-8601 https://www.iso.org/iso-8601-date-and-time-format.html). Bootbox does not enforce this rule, but your min value may not be enforced by this browser.');
      } else if (max !== undefined && !(maxValid = dateIsValid(max))) {
        console.warn('Browsers which natively support the "date" input type expect date values to be of the form "YYYY-MM-DD" (see ISO-8601 https://www.iso.org/iso-8601-date-and-time-format.html). Bootbox does not enforce this rule, but your max value may not be enforced by this browser.');
      }
    } else if (type === 'time') {
      if (min !== undefined && !(minValid = timeIsValid(min))) {
        throw new Error('"min" is not a valid time. See https://www.w3.org/TR/2012/WD-html-markup-20120315/datatypes.html#form.data.time for more information.');
      } else if (max !== undefined && !(maxValid = timeIsValid(max))) {
        throw new Error('"max" is not a valid time. See https://www.w3.org/TR/2012/WD-html-markup-20120315/datatypes.html#form.data.time for more information.');
      }
    } else {
      if (min !== undefined && isNaN(min)) {
        minValid = false;
        throw new Error('"min" must be a valid number. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-min for more information.');
      }

      if (max !== undefined && isNaN(max)) {
        maxValid = false;
        throw new Error('"max" must be a valid number. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-max for more information.');
      }
    }

    if (minValid && maxValid) {
      if (max <= min) {
        throw new Error('"max" must be greater than "min". See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-max for more information.');
      } else {
        result = true;
      }
    }

    return result;
  }

  function timeIsValid(value) {
    return /([01][0-9]|2[0-3]):[0-5][0-9]?:[0-5][0-9]/.test(value);
  }

  function dateIsValid(value) {
    return /(\d{4})-(\d{2})-(\d{2})/.test(value);
  }

  //  The Bootbox object
  return exports;
}));

/*! @preserve
 * bootbox.locales.js
 * version: 6.0.0
 * author: Nick Payne <nick@kurai.co.uk>
 * license: MIT
 * http://bootboxjs.com/
 */
(function(global, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['bootbox'], factory);
  } else if (typeof module === 'object' && module.exports) {
    factory(require('./bootbox'));
  } else {
    factory(global.bootbox);
  }
}(this, function(bootbox) {
  'use strict';

  // locale : Arabic
  // author : Emad Omar
  bootbox.addLocale('ar', {
    OK: 'موافق',
    CANCEL: 'الغاء',
    CONFIRM: 'تأكيد'
  });
  // locale : Azerbaijani
  // author : Valentin Belousov
  bootbox.addLocale('az', {
    OK: 'OK',
    CANCEL: 'İmtina et',
    CONFIRM: 'Təsdiq et'
  });
  // locale : Bulgarian
  // author :  mraiur
  bootbox.addLocale('bg-BG', {
    OK: 'Ок',
    CANCEL: 'Отказ',
    CONFIRM: 'Потвърждавам'
  });
  // locale : Czech
  // author : Lukáš Fryč
  bootbox.addLocale('cs', {
    OK: 'OK',
    CANCEL: 'Zrušit',
    CONFIRM: 'Potvrdit'
  });
  // locale : Danish
  // author : Frederik Alkærsig
  bootbox.addLocale('da', {
    OK: 'OK',
    CANCEL: 'Annuller',
    CONFIRM: 'Accepter'
  });
  // locale : German
  // author : Nick Payne
  bootbox.addLocale('de', {
    OK: 'OK',
    CANCEL: 'Abbrechen',
    CONFIRM: 'Akzeptieren'
  });
  // locale : Greek
  // author : Tolis Emmanouilidis
  bootbox.addLocale('el', {
    OK: 'Εντάξει',
    CANCEL: 'Ακύρωση',
    CONFIRM: 'Επιβεβαίωση'
  });
  // locale : English
  // author : Nick Payne
  bootbox.addLocale('en', {
    OK: 'OK',
    CANCEL: 'Cancel',
    CONFIRM: 'OK'
  });
  // locale : Spanish
  // author : Ian Leckey
  bootbox.addLocale('es', {
    OK: 'OK',
    CANCEL: 'Cancelar',
    CONFIRM: 'Aceptar'
  });
  // locale : Estonian
  // author : Pavel Krõlov
  bootbox.addLocale('et', {
    OK: 'OK',
    CANCEL: 'Katkesta',
    CONFIRM: 'OK'
  });
  // locale : Basque
  // author : Iker Ibarguren
  bootbox.addLocale('eu', {
    OK: 'OK',
    CANCEL: 'Ezeztatu',
    CONFIRM: 'Onartu'
  });
  // locale : Persian
  // author : Touhid Arastu
  bootbox.addLocale('fa', {
    OK: 'قبول',
    CANCEL: 'لغو',
    CONFIRM: 'تایید'
  });
  // locale : Finnish
  // author : Nick Payne
  bootbox.addLocale('fi', {
    OK: 'OK',
    CANCEL: 'Peruuta',
    CONFIRM: 'OK'
  });
  // locale : French
  // author : Nick Payne, Sebastien Andary
  bootbox.addLocale('fr', {
    OK: 'OK',
    CANCEL: 'Annuler',
    CONFIRM: 'Confirmer'
  });
  // locale : Hebrew
  // author : Chen Alon
  bootbox.addLocale('he', {
    OK: 'אישור',
    CANCEL: 'ביטול',
    CONFIRM: 'אישור'
  });
  // locale : Croatian
  // author : Mario Bašić
  bootbox.addLocale('hr', {
    OK: 'OK',
    CANCEL: 'Odustani',
    CONFIRM: 'Potvrdi'
  });
  // locale : Hungarian
  // author : Márk Sági-Kazár
  bootbox.addLocale('hu', {
    OK: 'OK',
    CANCEL: 'Mégsem',
    CONFIRM: 'Megerősít'
  });
  // locale : Indonesian
  // author : Budi Irawan
  bootbox.addLocale('id', {
    OK: 'OK',
    CANCEL: 'Batal',
    CONFIRM: 'OK'
  });
  // locale : Italian
  // author : Mauro
  bootbox.addLocale('it', {
    OK: 'OK',
    CANCEL: 'Annulla',
    CONFIRM: 'Conferma'
  });
  // locale : Japanese
  // author : ms183
  bootbox.addLocale('ja', {
    OK: 'OK',
    CANCEL: 'キャンセル',
    CONFIRM: '確認'
  });
  // locale : Georgian
  // author : Avtandil Kikabidze aka LONGMAN (@akalongman)
  bootbox.addLocale('ka', {
    OK: 'OK',
    CANCEL: 'გაუქმება',
    CONFIRM: 'დადასტურება'
  });
  // locale : Korean
  // author : rigning
  bootbox.addLocale('ko', {
    OK: 'OK',
    CANCEL: '취소',
    CONFIRM: '확인'
  });
  // locale : Lithuanian
  // author : Tomas
  bootbox.addLocale('lt', {
    OK: 'Gerai',
    CANCEL: 'Atšaukti',
    CONFIRM: 'Patvirtinti'
  });
  // locale : Latvian
  // author : Dmitry Bogatykh, Lauris BH
  bootbox.addLocale('lv', {
    OK: 'Labi',
    CANCEL: 'Atcelt',
    CONFIRM: 'Apstiprināt'
  });
  // locale : Dutch
  // author : Bas ter Vrugt
  bootbox.addLocale('nl', {
    OK: 'OK',
    CANCEL: 'Annuleren',
    CONFIRM: 'Accepteren'
  });
  // locale : Norwegian
  // author : Nils Magnus Englund
  bootbox.addLocale('no', {
    OK: 'OK',
    CANCEL: 'Avbryt',
    CONFIRM: 'OK'
  });
  // locale : Polish
  // author : Szczepan Cieślik
  bootbox.addLocale('pl', {
    OK: 'OK',
    CANCEL: 'Anuluj',
    CONFIRM: 'Potwierdź'
  });
  // locale : Portuguese (Brasil)
  // author : Nick Payne
  bootbox.addLocale('pt-BR', {
    OK: 'OK',
    CANCEL: 'Cancelar',
    CONFIRM: 'Sim'
  });
  // locale : Portuguese
  // author : Cláudio Medina
  bootbox.addLocale('pt', {
    OK: 'OK',
    CANCEL: 'Cancelar',
    CONFIRM: 'Confirmar'
  });
  // locale : Russian
  // author : ionian-wind
  bootbox.addLocale('ru', {
    OK: 'OK',
    CANCEL: 'Отмена',
    CONFIRM: 'Применить'
  });
  // locale : Slovak
  // author : Stano Paška
  bootbox.addLocale('sk', {
    OK: 'OK',
    CANCEL: 'Zrušiť',
    CONFIRM: 'Potvrdiť'
  });
  // locale : Slovenian
  // author : @metalcamp
  bootbox.addLocale('sl', {
    OK: 'OK',
    CANCEL: 'Prekliči',
    CONFIRM: 'Potrdi'
  });
  // locale : Albanian
  // author : Knut Hühne
  bootbox.addLocale('sq', {
    OK: 'OK',
    CANCEL: 'Anulo',
    CONFIRM: 'Prano'
  });
  // locale : Swedish
  // author : Mattias Reichel
  bootbox.addLocale('sv', {
    OK: 'OK',
    CANCEL: 'Avbryt',
    CONFIRM: 'OK'
  });
  // locale : Swahili
  // author : Timothy Anyona
  bootbox.addLocale('sw', {
    OK: 'Sawa',
    CANCEL: 'Ghairi',
    CONFIRM: 'Thibitisha'
  });
  // locale : Tamil
  // author : Kolappan Nathan
  bootbox.addLocale('ta', {
    OK: 'சரி',
    CANCEL: 'ரத்து செய்',
    CONFIRM: 'உறுதி செய்'
  });
  // locale : Thai
  // author : Ishmael๛
  bootbox.addLocale('th', {
    OK: 'ตกลง',
    CANCEL: 'ยกเลิก',
    CONFIRM: 'ยืนยัน'
  });
  // locale : Turkish
  // author : Enes Karaca
  bootbox.addLocale('tr', {
    OK: 'Tamam',
    CANCEL: 'İptal',
    CONFIRM: 'Onayla'
  });
  // locale : Ukrainian
  // author : OlehBoiko
  bootbox.addLocale('uk', {
    OK: 'OK',
    CANCEL: 'Відміна',
    CONFIRM: 'Прийняти'
  });
  // locale : Vietnamese
  // author :  Anh Tu Nguyen
  bootbox.addLocale('vi', {
    OK: 'OK',
    CANCEL: 'Hủy bỏ',
    CONFIRM: 'Xác nhận'
  });
  // locale : Chinese (China / People's Republic of China)
  // author : Nick Payne
  bootbox.addLocale('zh-CN', {
    OK: 'OK',
    CANCEL: '取消',
    CONFIRM: '确认'
  });
  // locale : Chinese (Taiwan / Republic of China)
  // author : Nick Payne
  bootbox.addLocale('zh-TW', {
    OK: 'OK',
    CANCEL: '取消',
    CONFIRM: '確認'
  });

}));

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

/*! Copyright (c) 2013 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.1.3
 *
 * Requires: 1.2.2+
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'];
    var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
    var lowestDelta, lowestDeltaXY;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },

        unmousewheel: function(fn) {
            return this.unbind("mousewheel", fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event,
            args = [].slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            absDeltaXY = 0,
            fn;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta; }
        if ( orgEvent.detail )     { delta = orgEvent.detail * -1; }

        // New school wheel delta (wheel event)
        if ( orgEvent.deltaY ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( orgEvent.deltaX ) {
            deltaX = orgEvent.deltaX;
            delta  = deltaX * -1;
        }

        // Webkit
        if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY; }
        if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Look for lowest delta to normalize the delta values
        absDelta = Math.abs(delta);
        if ( !lowestDelta || absDelta < lowestDelta ) { lowestDelta = absDelta; }
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if ( !lowestDeltaXY || absDeltaXY < lowestDeltaXY ) { lowestDeltaXY = absDeltaXY; }

        // Get a whole value for the deltas
        fn = delta > 0 ? 'floor' : 'ceil';
        delta  = Math[fn](delta / lowestDelta);
        deltaX = Math[fn](deltaX / lowestDeltaXY);
        deltaY = Math[fn](deltaY / lowestDeltaXY);

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

}));

/*!
 * jQuery blockUI plugin
 * Version 2.70.0-2014.11.23
 * Requires jQuery v1.7 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2013 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */

;(function() {
/*jshint eqeqeq:false curly:false latedef:false */
"use strict";

	function setup($) {
		$.fn._fadeIn = $.fn.fadeIn;

		var noOp = $.noop || function() {};

		// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
		// confusing userAgent strings on Vista)
		var msie = /MSIE/.test(navigator.userAgent);
		var ie6  = /MSIE 6.0/.test(navigator.userAgent) && ! /MSIE 8.0/.test(navigator.userAgent);
		var mode = document.documentMode || 0;
		var setExpr = $.isFunction( document.createElement('div').style.setExpression );

		// global $ methods for blocking/unblocking the entire page
		$.blockUI   = function(opts) { install(window, opts); };
		$.unblockUI = function(opts) { remove(window, opts); };

		// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
		$.growlUI = function(title, message, timeout, onClose) {
			var $m = $('<div class="growlUI"></div>');
			if (title) {
				$m.append('<h1>'+title+'</h1>');
			}
			if (message) {
				$m.append('<h2>'+message+'</h2>');
			}
			if (timeout === undefined) {
				timeout = 3000;
			}

			// Added by konapun: Set timeout to 30 seconds if this growl is moused over, like normal toast notifications
			var callBlock = function(opts) {
				opts = opts || {};

				$.blockUI({
					message: $m,
					fadeIn : typeof opts.fadeIn  !== 'undefined' ? opts.fadeIn  : 700,
					fadeOut: typeof opts.fadeOut !== 'undefined' ? opts.fadeOut : 1000,
					timeout: typeof opts.timeout !== 'undefined' ? opts.timeout : timeout,
					centerY: false,
					showOverlay: false,
					onUnblock: onClose,
					css: $.blockUI.defaults.growlCSS
				});
			};

			callBlock();
			var nonmousedOpacity = $m.css('opacity');
			$m.mouseover(function() {
				callBlock({
					fadeIn: 0,
					timeout: 30000
				});

				var displayBlock = $('.blockMsg');
				displayBlock.stop(); // cancel fadeout if it has started
				displayBlock.fadeTo(300, 1); // make it easier to read the message by removing transparency
			}).mouseout(function() {
				$('.blockMsg').fadeOut(1000);
			});
			// End konapun additions
		};

		// plugin method for blocking element content
		$.fn.block = function(opts) {
			if ( this[0] === window ) {
				$.blockUI( opts );
				return this;
			}
			var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
			this.each(function() {
				var $el = $(this);
				if (fullOpts.ignoreIfBlocked && $el.data('blockUI.isBlocked'))
					return;
				$el.unblock({ fadeOut: 0 });
			});

			return this.each(function() {
				if ($.css(this,'position') == 'static') {
					this.style.position = 'relative';
					$(this).data('blockUI.static', true);
				}
				this.style.zoom = 1; // force 'hasLayout' in ie
				install(this, opts);
			});
		};

		// plugin method for unblocking element content
		$.fn.unblock = function(opts) {
			if ( this[0] === window ) {
				$.unblockUI( opts );
				return this;
			}
			return this.each(function() {
				remove(this, opts);
			});
		};

		$.blockUI.version = 2.70; // 2nd generation blocking at no extra cost!

		// override these in your code to change the default behavior and style
		$.blockUI.defaults = {
			// message displayed when blocking (use null for no message)
			message:  '<h1>Please wait...</h1>',

			title: null,		// title string; only used when theme == true
			draggable: true,	// only used when theme == true (requires jquery-ui.js to be loaded)

			theme: false, // set to true to use with jQuery UI themes

			// styles for the message when blocking; if you wish to disable
			// these and use an external stylesheet then do this in your code:
			// $.blockUI.defaults.css = {};
			css: {
//				padding:	0,
//				margin:		0,
//				width:		'30%',
//				top:		'40%',
//				left:		'35%',
//				textAlign:	'center',
//				color:		'#000',
//				border:		'3px solid #aaa',
//				backgroundColor:'#fff',
//				cursor:		'wait'
			},

			// minimal style set used when themes are used
			themedCSS: {
				width:	'30%',
				top:	'40%',
				left:	'35%'
			},

			// styles for the overlay
			overlayCSS:  {
//				backgroundColor:	'#000',
//				opacity:			0.6,
				cursor:				'wait'
			},

			// style to replace wait cursor before unblocking to correct issue
			// of lingering wait cursor
			cursorReset: 'default',

			// styles applied when using $.growlUI
			growlCSS: {
				width:		'350px',
				top:		'10px',
				left:		'',
				right:		'10px',
				border:		'none',
				padding:	'5px',
				opacity:	0.6,
				cursor:		'default',
				color:		'#fff',
				backgroundColor: '#000',
				'-webkit-border-radius':'10px',
				'-moz-border-radius':	'10px',
				'border-radius':		'10px'
			},

			// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
			// (hat tip to Jorge H. N. de Vasconcelos)
			/*jshint scripturl:true */
			iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

			// force usage of iframe in non-IE browsers (handy for blocking applets)
			forceIframe: false,

			// z-index for the blocking overlay
			baseZ: 20000,

			// set these to true to have the message automatically centered
			centerX: true, // <-- only effects element blocking (page block controlled via css above)
			centerY: true,

			// allow body element to be stetched in ie6; this makes blocking look better
			// on "short" pages.  disable if you wish to prevent changes to the body height
			allowBodyStretch: true,

			// enable if you want key and mouse events to be disabled for content that is blocked
			bindEvents: true,

			// be default blockUI will supress tab navigation from leaving blocking content
			// (if bindEvents is true)
			constrainTabKey: true,

			// fadeIn time in millis; set to 0 to disable fadeIn on block
			fadeIn:  200,

			// fadeOut time in millis; set to 0 to disable fadeOut on unblock
			fadeOut:  400,

			// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
			timeout: 0,

			// disable if you don't want to show the overlay
			showOverlay: true,

			// if true, focus will be placed in the first available input field when
			// page blocking
			focusInput: true,

            // elements that can receive focus
            focusableElements: ':input:enabled:visible',

			// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
			// no longer needed in 2012
			// applyPlatformOpacityRules: true,

			// callback method invoked when fadeIn has completed and blocking message is visible
			onBlock: null,

			// callback method invoked when unblocking has completed; the callback is
			// passed the element that has been unblocked (which is the window object for page
			// blocks) and the options that were passed to the unblock call:
			//	onUnblock(element, options)
			onUnblock: null,

			// callback method invoked when the overlay area is clicked.
			// setting this will turn the cursor to a pointer, otherwise cursor defined in overlayCss will be used.
			onOverlayClick: null,

			// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
			quirksmodeOffsetHack: 4,

			// class name of the message block
			blockMsgClass: 'blockMsg',

			// if it is already blocked, then ignore it (don't unblock and reblock)
			ignoreIfBlocked: false
		};

		// private data and functions follow...

		var pageBlock = null;
		var pageBlockEls = [];

		function install(el, opts) {
			var css, themedCSS;
			var full = (el == window);
			var msg = (opts && opts.message !== undefined ? opts.message : undefined);
			opts = $.extend({}, $.blockUI.defaults, opts || {});

			if (opts.ignoreIfBlocked && $(el).data('blockUI.isBlocked')) {
				return;
			}

			opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
			css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
			if (opts.onOverlayClick) {
				opts.overlayCSS.cursor = 'pointer';
			}
			themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
			msg = (msg === undefined) ? opts.message : msg;

			// remove the current block (if there is one)
			if (full && pageBlock) {
				remove(window, {fadeOut:0});
			}
			// if an existing element is being used as the blocking content then we capture
			// its current place in the DOM (and current display style) so we can restore
			// it when we unblock
			if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
				var node = msg.jquery ? msg[0] : msg;
				var data = {};
				$(el).data('blockUI.history', data);
				data.el = node;
				data.parent = node.parentNode;
				data.display = node.style.display;
				data.position = node.style.position;
				if (data.parent) {
					data.parent.removeChild(node);
				}
			}

			$(el).data('blockUI.onUnblock', opts.onUnblock);
			var z = opts.baseZ;

			// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
			// layer1 is the iframe layer which is used to supress bleed through of underlying content
			// layer2 is the overlay layer which has opacity and a wait cursor (by default)
			// layer3 is the message content that is displayed while blocking
			var lyr1, lyr2, lyr3, s;
			if (msie || opts.forceIframe) {
				lyr1 = $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>');
			}
			else {
				lyr1 = $('<div class="blockUI" style="display:none"></div>');
			}
			if (opts.theme) {
				lyr2 = $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+ (z++) +';display:none"></div>');
			}
			else {
				lyr2 = $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');
			}

			if (opts.theme && full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:fixed">';
				if ( opts.title ) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (opts.theme) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:absolute">';
				if ( opts.title ) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+(z+10)+';display:none;position:fixed"></div>';
			}
			else {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:'+(z+10)+';display:none;position:absolute"></div>';
			}
			lyr3 = $(s);

			// if we have a message, style it
			if (msg) {
				if (opts.theme) {
					lyr3.css(themedCSS);
					lyr3.addClass('ui-widget-content');
				}
				else
					lyr3.css(css);
			}

			// style the overlay
			if (!opts.theme /*&& (!opts.applyPlatformOpacityRules)*/) {
				lyr2.css(opts.overlayCSS);
			}
			lyr2.css('position', full ? 'fixed' : 'absolute');

			// make iframe layer transparent in IE
			if (msie || opts.forceIframe) {
				lyr1.css('opacity',0.0);
			}
			//$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
			var layers = [lyr1,lyr2,lyr3], $par = full ? $('body') : $(el);
			$.each(layers, function() {
				this.appendTo($par);
			});

			if (opts.theme && opts.draggable && $.fn.draggable) {
				lyr3.draggable({
					handle: '.ui-dialog-titlebar',
					cancel: 'li'
				});
			}

			// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
			var expr = setExpr && (!$.support.boxModel || $('object,embed', full ? null : el).length > 0);
			if (ie6 || expr) {
				// give body 100% height
				if (full && opts.allowBodyStretch && $.support.boxModel) {
					$('html,body').css('height','100%');
				}

				// fix ie6 issue when blocked element has a border width
				if ((ie6 || !$.support.boxModel) && !full) {
					var t = sz(el,'borderTopWidth'), l = sz(el,'borderLeftWidth');
					var fixT = t ? '(0 - '+t+')' : 0;
					var fixL = l ? '(0 - '+l+')' : 0;
				}

				// simulate fixed position
				$.each(layers, function(i,o) {
					var s = o[0].style;
					s.position = 'absolute';
					if (i < 2) {
						if (full) {
							s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"');
						}
						else {
							s.setExpression('height','this.parentNode.offsetHeight + "px"');
						}
						if (full) {
							s.setExpression('width','jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');
						}
						else {
							s.setExpression('width','this.parentNode.offsetWidth + "px"');
						}
						if (fixL) {
							s.setExpression('left', fixL);
						}
						if (fixT) {
							s.setExpression('top', fixT);
						}
					}
					else if (opts.centerY) {
						if (full) {
							s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
						}
						s.marginTop = 0;
					}
					else if (!opts.centerY && full) {
						var top = (opts.css && opts.css.top) ? parseInt(opts.css.top, 10) : 0;
						var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"';
						s.setExpression('top',expression);
					}
				});
			}

			// show the message
			if (msg) {
				if (opts.theme) {
					lyr3.find('.ui-widget-content').append(msg);
				}
				else {
					lyr3.append(msg);
				}
				if (msg.jquery || msg.nodeType) {
					$(msg).show();
				}
			}

			if ((msie || opts.forceIframe) && opts.showOverlay) {
				lyr1.show(); // opacity is zero
			}
			if (opts.fadeIn) {
				var cb = opts.onBlock ? opts.onBlock : noOp;
				var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
				var cb2 = msg ? cb : noOp;
				if (opts.showOverlay) {
					lyr2._fadeIn(opts.fadeIn, cb1);
				}
				if (msg) {
					lyr3._fadeIn(opts.fadeIn, cb2);
				}
			}
			else {
				if (opts.showOverlay) {
					lyr2.show();
				}
				if (msg) {
					lyr3.show();
				}
				if (opts.onBlock) {
					opts.onBlock.bind(lyr3)();
				}
			}

			// bind key and mouse events
			bind(1, el, opts);

			if (full) {
				pageBlock = lyr3[0];
				pageBlockEls = $(opts.focusableElements,pageBlock);
				if (opts.focusInput) {
					setTimeout(focus, 20);
				}
			}
			else {
				center(lyr3[0], opts.centerX, opts.centerY);
			}
			if (opts.timeout) {
				// auto-unblock
				var to = setTimeout(function() {
					if (full) {
						$.unblockUI(opts);
					}
					else {
						$(el).unblock(opts);
					}
				}, opts.timeout);
				$(el).data('blockUI.timeout', to);
			}
		}

		// remove the block
		function remove(el, opts) {
			var count;
			var full = (el == window);
			var $el = $(el);
			var data = $el.data('blockUI.history');
			var to = $el.data('blockUI.timeout');
			if (to) {
				clearTimeout(to);
				$el.removeData('blockUI.timeout');
			}
			opts = $.extend({}, $.blockUI.defaults, opts || {});
			bind(0, el, opts); // unbind events

			if (opts.onUnblock === null) {
				opts.onUnblock = $el.data('blockUI.onUnblock');
				$el.removeData('blockUI.onUnblock');
			}

			var els;
			if (full) { // crazy selector to handle odd field errors in ie6/7
				els = $('body').children().filter('.blockUI').add('body > .blockUI');
			}
			else {
				els = $el.find('>.blockUI');
			}
			
			// fix cursor issue
			if ( opts.cursorReset ) {
				if ( els.length > 1 ) {
					els[1].style.cursor = opts.cursorReset;
				}
				if ( els.length > 2 ) {
					els[2].style.cursor = opts.cursorReset;
				}
			}

			if (full) {
				pageBlock = pageBlockEls = null;
			}
			if (opts.fadeOut) {
				count = els.length;
				els.stop().fadeOut(opts.fadeOut, function() {
					if ( --count === 0) {
						reset(els,data,opts,el);
					}
				});
			}
			else {
				reset(els, data, opts, el);
			}
		}

		// move blocking element back into the DOM where it started
		function reset(els,data,opts,el) {
			var $el = $(el);
			if ($el.data('blockUI.isBlocked')) {
				return;
			}

			els.each(function(i,o) {
				// remove via DOM calls so we don't lose event handlers
				if (this.parentNode) {
					this.parentNode.removeChild(this);
				}
			});

			if (data && data.el) {
				data.el.style.display = data.display;
				data.el.style.position = data.position;
				data.el.style.cursor = 'default'; // #59
				if (data.parent) {
					data.parent.appendChild(data.el);
				}
				$el.removeData('blockUI.history');
			}

			if ($el.data('blockUI.static')) {
				$el.css('position', 'static'); // #22
			}

			if (typeof opts.onUnblock == 'function') {
				opts.onUnblock(el,opts);
			}

			// fix issue in Safari 6 where block artifacts remain until reflow
			var body = $(document.body), w = body.width(), cssW = body[0].style.width;
			body.width(w-1).width(w);
			body[0].style.width = cssW;
		}

		// bind/unbind the handler
		function bind(b, el, opts) {
			var full = (el == window);
			var $el = $(el);
			
			// don't bother unbinding if there is nothing to unbind
			if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked'))) {
				return;
			}

			$el.data('blockUI.isBlocked', b);

			// don't bind events when overlay is not in use or if bindEvents is false
			if (!full || !opts.bindEvents || (b && !opts.showOverlay)) {
				return;
			}

			// bind anchors and inputs for mouse and key events
			var events = 'mousedown mouseup keydown keypress keyup touchstart touchend touchmove';
			if (b) {
				$(document).bind(events, opts, handler);
			}
			else {
				$(document).unbind(events, handler);
			}
		// former impl...
		//		var $e = $('a,:input');
		//		b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
		}

		// event handler to suppress keyboard/mouse events when blocking
		function handler(e) {
			// allow tab navigation (conditionally)
			if (e.type === 'keydown' && e.keyCode && e.keyCode == 9) {
				if (pageBlock && e.data.constrainTabKey) {
					var els = pageBlockEls;
					var fwd = !e.shiftKey && e.target === els[els.length-1];
					var back = e.shiftKey && e.target === els[0];
					if (fwd || back) {
						setTimeout(function(){focus(back);},10);
						return false;
					}
				}
			}
			var opts = e.data;
			var target = $(e.target);
			if (target.hasClass('blockOverlay') && opts.onOverlayClick) {
				opts.onOverlayClick(e);
			}
			// allow events within the message content
			if (target.parents('div.' + opts.blockMsgClass).length > 0) {
				return true;
			}
			// allow events for content that is not being blocked
			return target.parents().children().filter('div.blockUI').length === 0;
		}

		function focus(back) {
			if (!pageBlockEls) {
				return;
			}
			var e = pageBlockEls[back===true ? pageBlockEls.length-1 : 0];
			if (e) {
				e.focus();
			}
		}

		function center(el, x, y) {
			var p = el.parentNode, s = el.style;
			var l = ((p.offsetWidth - el.offsetWidth)/2) - sz(p,'borderLeftWidth');
			var t = ((p.offsetHeight - el.offsetHeight)/2) - sz(p,'borderTopWidth');
			if (x) {
				s.left = (l > 0) ? (l+'px') : '0';
			}
			if (y) {
				s.top  = (t > 0) ? (t+'px') : '0';
			}
		}

		function sz(el, p) {
			return parseInt($.css(el,p),10)||0;
		}

	}


	/*global define:true */
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		define(['jquery'], setup);
	} 
	else {
		setup(jQuery);
	}

})();

/**
 * jQuery alterClass plugin
 *
 * Remove element classes with wildcard matching. Optionally add classes:
 *   $( '#foo' ).alterClass( 'foo-* bar-*', 'foobar' )
 *
 * Copyright (c) 2011 Pete Boere (the-echoplex.net)
 * Free under terms of the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 */
(function ( $ ) {
	
$.fn.alterClass = function ( removals, additions ) {
	
	var self = this;
	
	if ( removals.indexOf( '*' ) === -1 ) {
		// Use native jQuery methods if there is no wildcard matching
		self.removeClass( removals );
		return !additions ? self : self.addClass( additions );
	}
 
	var patt = new RegExp( '\\s' + 
			removals.
				replace( /\*/g, '[A-Za-z0-9-_]+' ).
				split( ' ' ).
				join( '\\s|\\s' ) + 
			'\\s', 'g' );
 
	self.each( function ( i, it ) {
		var cn = ' ' + it.className + ' ';
		while ( patt.test( cn ) ) {
			cn = cn.replace( patt, ' ' );
		}
		it.className = $.trim( cn );
	});
 
	return !additions ? self : self.addClass( additions );
};
 
})( jQuery );

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

/**
 * jQuery addBackIf plugin
 *
 */
(function ( $ ) {
	
$.fn.addBackIf = function ( selector, condition ) {
	
	var self = this;
	
	return (condition) ? self.addBack(selector) : self;
 
};
 
})( jQuery );

$.fn.cerealize = function (filter) {
	filter = filter || ''; // ':not([data-recurly])'; - Disabling this option since recurly.js v4 CC fields are now hosted via secure iframes.
	var $form = $(this).closest('form');
	var strKeyVals = '';	
	var arrKeyVals = [];
	var checkable, checked, key;
    var selector = (filter) ? $(':input').filter(filter) : $(':input');
	$(this).find(selector).each(
		function() {
			var n, mv, v;
			if ($(this).attr('name')) {
				n = $(this).attr('name');
				mv = (n.match(/\[\]$/)); // check for multi-value support
				if (arrKeyVals[n] && !mv) {
					$.clog('CEREALIZE WARNING!!! The field [' + n + '] exists more than once in form [' + $(this).closest('form').attr('id') + ']. Skipping further assignments for this field.', 'warning');
					return;
				}
				v = encodeURIComponent($(this).val());
				if ($(this).is(':radio') || $(this).is(':checkbox')) {
					if ($(this).is(':checked') || $(this).hasClass('boolean')) {
						arrKeyVals[n] = (arrKeyVals[n]) ? arrKeyVals[n] + ',' + v : v;
					}
				}
				else {
					arrKeyVals[n] = (arrKeyVals[n]) ? arrKeyVals[n] + ',' + v : v;
				}
			}
		}
	);
	for (key in arrKeyVals) {
        if (key.match(/\[\]$/)) {
			$('[name="' + key + '"]').each(
				function() {
					var $f = $(this);
					var vals;
					if ($f.is('[multiple]')) {
						vals = $f.val();
						/* The select may not have a current value (ie; an empty array object), so we'll check for array elements first before looping */
						if (vals.length) { 
							for (v in vals) {
								strKeyVals += '&' + key + '=' + vals[v];
							}
						}
						else {
							strKeyVals += '&' + key + '=';
						}
					}
					else {
						checkable = ($f.is(':radio') || $f.is(':checkbox'));
						checked = ($f.is(':checked') || $f.hasClass('boolean'));
						if (!checkable || (checkable && checked)) { 
							strKeyVals += '&' + key + '=' + $f.val();
						}
					}
				}
			);
		}
		else {
			strKeyVals += '&' + key + '=' + arrKeyVals[key];	
		}
	}
	return strKeyVals.replace(/^\s*&/, '');
};

/* 

USAGE EXAMPLE 
------------------------------------
var querystring = $('form.myFormClass').cerealize();

*/

$.fn.cerealizeArray = function (filter) {
	filter = filter || ''; // ':not([data-recurly])'; - Disabling this option since recurly.js v4 CC fields are now hosted via secure iframes.
	var $form = $(this).closest('form');
	var arrKeyVals = [];
	var checkable, checked, key;
	var selector = (filter) ? $(':input').filter(filter) : $(':input');
	$(this).find(selector).each(
		function() {
			var n, mv, v;
			if ($(this).attr('name')) {
				n = $(this).attr('name');
				mv = (n.match(/\[\]$/)); // check for multi-value support
				if (arrKeyVals[n] && !mv) {
					$.clog('CEREALIZE WARNING!!! The field [' + n + '] exists more than once in form [' + $(this).closest('form').attr('id') + ']. Skipping further assignments for this field.', 'warning');
					return;
				}
				v = $(this).val();
				if ($(this).is(':radio') || $(this).is(':checkbox')) {
					if ($(this).is(':checked') || $(this).hasClass('boolean')) {
						arrKeyVals[n] = (arrKeyVals[n]) ? arrKeyVals[n] + ',' + v : v;
					}
				}
				else {
					arrKeyVals[n] = (arrKeyVals[n]) ? arrKeyVals[n] + ',' + v : v;
				}
			}
		}
	);
	return arrKeyVals;
};

/* 

USAGE EXAMPLE 
------------------------------------
var fieldArray = $('form.myFormClass').cerealizeArray();

*/
$.fn.decerealize = function (vals) {
	//vals = $.trim(vals);
	var flds, pairs, frm = $(this);
	if (vals && frm.length) {
		/* Check and encode values if they exist in a JSON format */ 
		try {
			var json = vals;
			json = JSON.parse(json);
			if (json) {
				vals = $.param(json);
			}
		}
		catch(e) {}
		frm.get(0).reset();
		vals = vals.replace(/\+/g, '%20');
		pairs = vals.split('&');
		$.each(pairs, 
			function(i, pair) {
				var fld = null;
				var fldph = null;
				var fldval = null;
				var key = null;
				var val = null;
				var fldexists = false;
				var keyval = pair.split(/=/);
				if (keyval.length === 2) {
					key = decodeURIComponent(keyval[0]);
					val = decodeURIComponent(keyval[1]);
					
					//console.log('JQuery Selector: [data-name=' + key + '], [name="' + key + '"], [name="' + key + '[]"]');
					frm.find('[data-name=' + key + '], [name="' + key + '"], [name="' + key + '[]"]').each(function() {
							
						var fld = $(this);
						var fldtype = fld.prop('nodeName').toLowerCase();

						//z$.clog('decerealizing... setting field [' + key + '] of type [' + fldtype + '] to [' + val + ']');
						/* [data-name] is for readonly placeholders or fields without a "name" attribute first... */
						if (fld.is('[data-name]')) {
							if (fld.is(':input')) {
								if (fld.hasClass('selectpicker')) {
									fld.selectpicker('val', val);
								}
								else {
									fld.val(val);
								}
							}
							else {
								fld.html(val);
							}
						}
						else if (fldtype && (fldtype === 'radio' || fldtype === 'checkbox')) {
							fldval = fld.filter('[value="' + val + '"]');			
							fldexists = (fldval.length);
							if (!fldexists && value === '1') {
								fld.first().prop('checked', true);
							} 
							else {
								fldval.prop('checked', fldexists);
							} 
						}
						else if (fldtype && fldtype === 'select') {
							val = (fld.is('[multiple]')) ? val.split(',') : val;
							if (fld.hasClass('selectpicker')) {
								fld.selectpicker('val', val);
							}
							else {
								fld.val(val);
							}
						}
						else {
							if (fld.hasClass('selectpicker')) {
								fld.selectpicker('val', val);
							}
							else {
								fld.val(val);
							}
						}
					
					});
				}
			}
		);
	}
};

/* 

USAGE EXAMPLE 
------------------------------------
var $form = $('form.myFormClass');
var s = $form.serialize();
$form.deserialize(s);

*/