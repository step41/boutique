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