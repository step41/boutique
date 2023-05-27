		
var Boutique = Boutique || {};
var API_PATH = '';


; (function() {

	'use strict';
			
	// instantiate core objects
	Boutique.Inflection 		= Boutique.Inflection 		|| {};
	Boutique.Settings 	 		= Boutique.Settings 		|| {};
	Boutique.Messages			= Boutique.Messages	 		|| {};
	Boutique.Storage 			= Boutique.Storage 			|| {};
	Boutique.Utilities 			= Boutique.Utilities 		|| {};
	Boutique.Validator 			= Boutique.Validator 		|| {};
	Boutique.Controllers 		= Boutique.Controllers 		|| {};

	// set basic options
	Boutique.debug = false;

	Boutique.init = function() {
		
	};

})();
	
	

; (function() {

    'use strict';
            
	Boutique.Inflection = {  
		
		/**
		 * Common plural word patterns
		 */
		plural: {
			'(quiz)$'               			: function(m, p1) { return p1 + 'zes'; },
			'^(ox)$'                			: function(m, p1) { return p1 + 'en'; },
			'([m|l])ouse$'          			: function(m, p1) { return p1 + 'ice'; },
			'(matr|vert|ind)ix|ex$' 			: function(m, p1) { return p1 + 'ices'; },
			'(x|ch|ss|sh)$'         			: function(m, p1) { return p1 + 'es'; },
			'([^aeiouy]|qu)y$'      			: function(m, p1) { return p1 + 'ies'; },
			'(hive)$'               			: function(m, p1) { return p1 + 's'; },
			'(?:([^f])fe|([lr])f)$' 			: function(m, p1, p2) { return p1 + p2 + 'ves'; },
			'(shea|lea|loa|thie)f$' 			: function(m, p1) { return p1 + 'ves'; },
			'sis$'                  			: 'ses',
			'([ti])um$'             			: function(m, p1) { return p1 + 'a'; },
			'(tomat|potat|ech|her|vet)o$'		: function(m, p1) { return p1 + 'oes'; },
			'(bu)s$'                			: function(m, p1) { return p1 + 'ses'; },
			'(alias)$'              			: function(m, p1) { return p1 + 'es'; },
			'(octop)us$'            			: function(m, p1) { return p1 + 'i'; },
			'(ax|test)is$'          			: function(m, p1) { return p1 + 'es'; },
			'(us)$'                 			: function(m, p1) { return p1 + 'es'; },
			's$'                    			: 's',
			'$/'                      			: 's'
		},

		/**
		 * Common singular word patterns
		 */
		singular: {
			'(quiz)zes$'             		: function(m, p1) { return p1; },
			'(matr)ices$'            		: function(m, p1) { return p1 + 'ix'; },
			'(vert|ind)ices$'        		: function(m, p1) { return p1 + 'ex'; },
			'^(ox)en$'               		: function(m, p1) { return p1; },
			'(alias)es$'             		: function(m, p1) { return p1; },
			'(octop|vir)i$'          		: function(m, p1) { return p1 + 'us'; },
			'(cris|ax|test)es$'      		: function(m, p1) { return p1 + 'is'; },
			'(shoe)s$'               		: function(m, p1) { return p1; },
			'(o)es$'                 		: function(m, p1) { return p1; },
			'(bus)es$'               		: function(m, p1) { return p1; },
			'([m|l])ice$'            		: function(m, p1) { return p1 + 'ouse'; },
			'(x|ch|ss|sh)es$'        		: function(m, p1) { return p1; },
			'(m)ovies$'              		: function(m, p1) { return p1 + 'ovie'; },
			'(s)eries$'              		: function(m, p1) { return p1 + 'eries'; },
			'([^aeiouy]|qu)ies$'     		: function(m, p1) { return p1 + 'y'; },
			'([lr])ves$'             		: function(m, p1) { return p1 + 'f'; },
			'(tive)s$'               		: function(m, p1) { return p1; },
			'(hive)s$'               		: function(m, p1) { return p1; },
			'(li|wi|kni)ves$'        		: function(m, p1) { return p1 + 'fe'; },
			'(shea|loa|lea|thie)ves$'		: function(m, p1) { return p1 + 'f'; },
			'(^analy)ses$'           		: function(m, p1) { return p1 + 'sis'; },
			'((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$'  : function(m, p1, p2) { return p1 + p2 + 'sis'; },
			'([ti])a$'               		: function(m, p1) { return p1 + 'um'; },
			'(n)ews$'                		: function(m, p1) { return p1 + 'ews'; },
			'(h|bl)ouses$'           		: function(m, p1) { return p1 + 'ouse'; },
			'(corpse)s$'             		: function(m, p1) { return p1; },
			'(us)es$'                		: function(m, p1) { return p1; },
			's$'                     		: ''
		},

		/**
		 * Array populated with irregular plural word types
		 */
		irregular: {
			'registered'   						: 'registered',
			'move'   							: 'moves',
			'foot'   							: 'feet',
			'goose'  							: 'geese',
			'sex'    							: 'sexes',
			'child'  							: 'children',
			'man'    							: 'men',
			'tooth'  							: 'teeth',
			'music'  							: 'music',
			'person' 							: 'people',
			'dns' 	 							: 'dns',
			'admin'  							: 'admin'
		},

		/**
		 * Array populated with collective plural word types
		 */
		uncountable: [
			'sheep',
			'fish',
			'deer',
			'series',
			'species',
			'money',
			'rice',
			'information',
			'equipment'
		],

		/**
		 * Custom irregular word patterns populated by external
		 * inflection configuration file.
		 */
		irregularWords: [],
		
		/**
		 * Custom multi-word patterns that require splitting. This array
		 * will be populated by the external inflection configuration file.
		 */
		splitWords: [],
			
		/**
		 * Makes a phrase camel case. Spaces and underscores will be removed.
		 */
		camelize: function(str) {
			str = 'x' + trim(str);
			str = str.toLowerCase();
			str = str.replace(/[\s_]+/, ' ');
			str = ucwords(str);
			str = str.replace(/\s+/, '');
			str = str.substring(0, (str.length - 1));
			return str;
		},

		/**
		 * Converts a camel case phrase into a spaced phrase.
		 */
		decamelize: function(str, delim = ' ') {
			str = trim(str);
			str = str.replace(/([a-z])([A-Z])/, $1 + delim + $2);
			str = str.toLowerCase();
			return str;
		},

		/**
		 * Makes an underscored or dashed phrase human-readable.
		 */
		humanize: function(str) {
			str = trim(str);
			str = str.replace(/[_-]+/, ' ');
			return str;
		},

		/**
		 * Converts multiple separate words into a combined multi-word string.
		 */
		joinWords: function(str) {	

			var OI = Boutique.Inflection;
			var result, pattern;

			for (result in OI.splitWords) {
				pattern = new RegExp('^' + OI.splitWords[result] + '$', 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}
			
			return str;

		},

		/**
		 * Converts a string in singular format to its commonly used plural
		 * format based on rules or regular expression patterns.
		 */
		pluralize: function(str) {

			var OI = Boutique.Inflection;
			var result, pattern;

			if (in_array(str.toLowerCase(), OI.uncountable)) {
				return str;
			}

			for (pattern in OI.irregularWords) {
				result = OI.irregularWords[pattern];
				pattern = new RegExp(pattern + '$', 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}

			for (pattern in OI.irregular) {
				result = OI.irregular[pattern];
				pattern = new RegExp(pattern + '$', 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}

			for (pattern in OI.plural) {
				result = OI.plural[pattern];
				pattern = new RegExp(pattern, 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}
			
			return str;

		},

		/**
		 * Converts a string in singular format to its commonly used plural
		 * format based on rules or regular expression patterns if the numerical
		 * value of $count is greater than one. 
		 */
		pluralizeIf: function(cnt, str) {

			var OI = Boutique.Inflection;
			
			return (cnt == 1) ? '1 ' + str : cnt + ' ' + OI.pluralize(str);
		
		},
		
		/**
		 * Converts a string in plural format to its commonly used singular
		 * format based on rules or regular expression patterns.
		 */
		singularize: function(str) {	
	
			var OI = Boutique.Inflection;
			var result, pattern;

			if (in_array(str.toLowerCase(), OI.uncountable)) {
				return str;
			}

			for (pattern in OI.irregularWords) {
				result = OI.irregularWords[pattern];
				pattern = new RegExp(pattern + '$', 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}

			for (pattern in OI.irregular) {
				result = OI.irregular[pattern];
				pattern = new RegExp(pattern + '$', 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}
			
			for (pattern in OI.singular) {
				result = OI.singular[pattern];
				pattern = new RegExp(pattern, 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}
			
			return str;

		},

		/**
		 * Converts a combined multi-word string into multiple separate words.
		 */
		splitWords: function(str) {	
	
			var OI = Boutique.Inflection;
			var result, pattern;

			for (pattern in OI.splitWords) {
				result = OI.irregular[pattern];
				pattern = new RegExp(pattern + '$', 'i');
				if (str.match(pattern)) {
					return str.replace(pattern, result);
				}
			}
			
			return str;

		},

		/**
		 * Makes a phrase underscored instead of spaced.
		 */
		underscore: function(str) {
			str = trim(str);
			str = str.replace(/\s+/, '_');
			return str;
		},

	}

})();



; (function() {

    'use strict';
            
	Boutique.Utilities = {

		initialized: [],

		addToInit: function(o) {

			var BU = Boutique.Utilities;

			if (o && !in_array(o, BU.initialized)) {
				BU.initialized.push(o);
			}

		},
		
		clickIs: function(e, type) {
			//$.clog(e);
			switch(e.which) {
				case 1: // left click
					//$.clog('...clickIs: LEFT');
					return (type.match(/^left$/i));
				break;
				case 2: // middle click
					//$.clog('...clickIs: MIDDLE');
					return (type.match(/^middle$/i));
				break;
				case 3: // right click
					//$.clog('...clickIs: RIGHT');
					return (type.match(/^right$/i));
				break;
			}
			//$.clog('...clickIs: FALSE');		
			return false;
		},

		codeBlockRetrieve: function(v) {
			var chr = {
				'[[TAB]]' 		: '\t',
				'[[SPACE]]'		: ' ',
				'[[RETURN]]'	: '\n',
			};
			return v.replace(/\[\[(TAB|SPACE|RETURN)\]\]/g, function(a) { return chr[a]; });
		},

		codeBlockStore: function(v) {
			var chr = {
				'\t'	: '[[TAB]]',
				' '	: '[[SPACE]]',
				'\n'	: '[[RETURN]]',
			};
			return v.replace(/(\t| |\n)/g, function(a) { return chr[a]; });
		},

		codeEscapeMin: function(v) {
			var chr = {
				'<'		: '&lt;',  
				'>'		: '&gt;',
				'\t'	: '&nbsp; &nbsp; '
			};
			return v.replace(/[<>\t]/g, function(a) { return chr[a]; });
		},

		codeEscape: function(v) {
			var chr = {
				'"' 	: '&#34;', 
				"'"		: '&#39;',
				'/'		: '&#47;',  
				'<'		: '&lt;',  
				'>'		: '&gt;',
				'\r\n'	: '&#10;',
				'\r'	: '&#10;',
				'\n'	: '&#10;',
				//'\t'	: '&nbsp; &nbsp; ',
				//'&'		: '&amp;' 
			};
			return v.replace(/[\"&'\/<>\r\n\t]/g, function(a) { return (chr[a]) ? chr[a] : a; });
		},

		codeUnescapeMin: function(v) {
			var chr = {
				'&lt;' 				: '<',  
				'&gt;' 				: '>',
				'&nbsp; &nbsp; '	: '\t',
			};
			return v.replace(/(&lt;|&gt;|emsp; &emsp;)/g, function(a) { return (chr[a]) ? chr[a] : a; });
		},

		codeUnescape: function(v) {
			var chr = {
				'&#34;' 		: '"', 
				'&#39;'  		: "'",
				'&#47;'  		: '/',  
				'&lt;'   		: '<',  
				'&gt;'   		: '>',
				'&#13;&#10;'  	: '\n',
				'&#13;'  		: '\n',
				'&#10;'  		: '\n',
				//'&nbsp; &nbsp; ' 		: '\t',
				//'&amp;'  		: '&' 
			};
			return v.replace(/(&#(3(4|9)+|47|1(3|0)+|&09|&13;&#10);|&nbsp; &nbsp; |&amp;|&lt;|&gt;)+/g, function(a) { return chr[a]; });
		},

		exists: function(needle, haystack) {
			if (needle && haystack) {
				return (haystack.indexOf(needle) !== -1);	
			}
			return null;
		},
		
		extend: function(ns, nsString) {
			var parts = nsString.split('.'),
				parent = ns,
				pl, i;
		
			if (parts[0] == 'Boutique') {
				parts = parts.slice(1);
			}
		
			pl = parts.length;
			for (i = 0; i < pl; i++) {
				//create a property if it doesnt exist
				if (typeof parent[parts[i]] == 'undefined') {
					parent[parts[i]] = {};
				}
		
				parent = parent[parts[i]];
			}
		
			return parent;
		},
		
		filter: function(input, list) {
			
			var children;

			if (list) {
				$(input).on('keyup', function() {
					var a = $(this).val();
					if (a.length > 0) {
						children = ($(list).children());
						var containing = children.filter(function() {
							var regex = new RegExp('\\b' + a, 'i');
							return regex.test($(this).text());
						}).show();
						children.not(containing).hide();
					} 
					else {
						children.show();
					}
					return false;
				});
			}

		},
		
		// use Google maps to geocode address, #ref: https://developers.google.com/maps/documentation/javascript/geocoding
		geocode: function(address, callback){
		
			try {
				if (google.maps.Geocoder) {
			
					var geocoder = new google.maps.Geocoder();
					
					geocoder.geocode({'address': address}, function(results, status){
					
						console.log('fn geocode: ' + results);
					
						if (status == google.maps.GeocoderStatus.OK){
							// #ref: https://developers.google.com/maps/documentation/javascript/reference#LatLng
							callback(results[0].geometry.location.lat(), results[0].geometry.location.lng(), results[0].formatted_address);
						}
					
					});
				
				}
				else {
					return false;
				}
			}
			catch(e) {
				return false;
			}

		},
		
		getAlignment: function(classes) {
			
			classes = classes || '';
			var alignclass = '';
			if (classes.indexOf('text-left') != -1) {
				alignclass = ' text-left';
			}
			else if (classes.indexOf('text-center') != -1) {
				alignclass = ' text-center';
			}
			else if (classes.indexOf('text-right') != -1) {
				alignclass = ' text-right';
			}
			return alignclass;
			
		},
		
		getAttribs: function(node, format, stripdata) {
			if (node) {
				node = $(node).get(0);
				//$.clog('getAttribs: ' + node.nodeName);
				if (node.nodeName) {
					format = format || 'string';
					stripdata = stripdata || false;
					var str = '';
					var all = {};
					var obj = {};
					var attrs = $(node).attrs();
					var key, val, bgi;
					for (key in attrs) {
						if (key.match(/^(style)$/i) === null) {
							val = attrs[key];
							if (key === 'class') {
								val = val.replace(/(\s*ui-sortable\s*)/g, '');
								val = val.replace(/\s+/g, ' ');
								val = trim(val);
							}
							if (key === 'id') {
								val = val.replace(/^([^\s]+)\s+[^_]+(_.+)$/g, '$1$2');
							}
							// Add one style exception for background image since we cannot dynamically apply this except via style tag
							if (key === 'data-background-image') {
								bgi = (val.match(/\/[^\/\.]+\.[a-z0-9]+\s*$/i)) ? 'url(' + val + ')' : val;
								obj['style'] = bgi; 
								str += 'style' + '="background-image:' + bgi + '" ';
							}
							if (stripdata) {
								key = key.replace(/^data-/g, '');
							}
							//$.clog('key: ' + key + ' -- val: ' + val);
							obj[key] = val; 
							str += key + '="' + val + '" ';
						}
					}
					str = (str) ? ' ' + trim(str) + ' ' : '';
					all.object = obj;
					all.string = str;
					switch (format) {
						case 'all': 			return all; break;	
						case 'object': 			return obj; break;	
						case 'string': default: return str; break;
					}
				}
			}
			return false;
		},
		
		getClasses: function(node, raw) {
					
			var classes = '';
			var filtered = '';
			var regexp, c, cls;

			raw = raw || false;
			node = $(node);
			
			if (node) {
				classes = $(node).prop('class') || '';
				if (!raw) {
					//$.clog('current classes: [' + classes + '] regexes:[' + Boutique.Editor.reservedClasses + ']');
					regexp = new RegExp(Boutique.Editor.reservedClasses, 'gi');
					classes = trim(classes);
					//$.clog('original node classes: ' + classes);
					classes = classes.split(/\s+/);
					for (c in classes) {
						cls = classes[c];
						//$.clog('node class to filter: ' + cls);
						filtered += ((filtered) ? ' ' : '') + cls.replace(regexp, '');
					}
					classes = filtered;
				}
			}
			return classes;
			
		},

		getDialogStyles: function(node, dialog) {
			
			var BU = Boutique.Utilities;
			var children = Boutique.Editor.nodeSelectorChildren;
			var blocked = Boutique.Editor.blockedChildClasses;
			var nodetypes = Boutique.Editor.nodeTypes;
			var selectorMediaPath = '.ocms-select-media-path';
			var attrBGI = 'data-background-image';
			var classesNode = '';
			var classesChild = '';
			var nodename, child;

			node = $(node);
			dialog = $(dialog);
			if (node.length && dialog.length) {
				// Ensure dialog is visible - if not, reset fields to default values
				if (!dialog.is(':visible')) {
					BU.setDialogDefaults(dialog);
				}
				// Check for background image 
				dialog.find('.segment-style :input' + selectorMediaPath).each(function() { 
					var val = trim($(this).val());
					var bgi = (val.match(/\/[^\/\.]+\.[a-z0-9]+\s*$/i)) ? 'url(' + val + ')' : val;
					if (val) {
						node.attr(attrBGI, val).css('backgroundImage', bgi);
					}
					else {
						node.removeAttr(attrBGI).css('backgroundImage', 'none');
					}
				});
				// Check all other style types
				dialog.find('.segment-style :input:not(' + selectorMediaPath + ')').each(function() { 
					var v = $(this).val();
					var c = (Number(v) === 0 || v === '') ? '' : v + ' '; 
					classesNode += c;
					classesChild += (v.match(new RegExp(blocked)) === null) ? c : ''; 
				});
				nodename = node.attr('data-nodename') || node.get(0).nodeName;
				nodename = nodename.toLowerCase();
				if (nodename.match(new RegExp(nodetypes))) {
					$(node).attr('data-styleclass', classesNode);
					child = children[nodename] || null;
					if (child) {
						$(node).find(child).addBackIf(node, (nodename.match(/(blockrow|h(1|2|3|4|5|6)|p)/) !== null)).alterClass('ocms-*', classesChild);
					}
				}
			}

			return false;			
		},

		getEditorChildByParent: function(node) {
			childnode = false;
			nodename = $(node).attr('data-nodename') || '';
			if (nodename) {
				switch (nodename) {
					case 'codeblock':
						childnode = $(node).find('pre.prettyprint');
						
						break;
				
					case 'contentlist':
						childnode = $(node).find('div.title');

						break;

					case 'embedded':
					case 'vimeo':
						childnode = $(node).find('textarea');
						
						break;
				
					case 'figure':
						childnode = $(node).find('figure');
						
						break;
				
					case 'file':
					case 'map':
						childnode = $(node).find('div input');
						
						break;
				
					case 'form':
						childnode = $(node).find('div.field-list');

						break;

					case 'gallery':
					case 'shelf':
					case 'slideshow':
						childnode = $(node).find('module');
						
						break;
					
					case 'hr':
						childnode = $(node).find('div.line');
						
						break;
						
					case 'table':
						childnode = $(node).find('table');
						
						break;
				
					case 'blockquote':
					case 'blog':
					case 'h1':
					case 'h2':
					case 'h3':
					case 'h4':
					case 'h5':
					case 'h6':
					case 'list':
					case 'mvc':
					case 'ol':
					case 'p':
					case 'secure':
					case 'twitter':
					case 'ul':
					default:
						childnode = $(node).find('[contentEditable=true]');
						
						break;
						
				} // ends switch(nodename)
			}

			return childnode;
		},

		getFunctionName: function() {

			var BU = Boutique.Utilities;
			
			return BU.getFunctionName.caller.name;
			
		},

		getNodeType: function(node) {
			
			var c, classes;
			var type = false;
			node = $(node);
			if (node) {
				if (node.attr('data-nodename')) {
					type = node.attr('data-nodename');
				}
				else {
					classes = trim(node.prop('class'));
					if (classes) {
						classes = classes.split(' ');
						for (c in classes) {
							if (trim(classes[c]).match(new RegExp(Boutique.Editor.nodeTypes))) {
								type = trim(classes[c]);
								break;
							}
						}
					}
				}
			}
			return type;
			
		},

		// gets a query string variable by name	
		getQueryStringByName: function(name){

			name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
			var regexS = '[\\?&]' + name + '=([^&#]*)';
			var regex = new RegExp(regexS);
			var results = regex.exec(window.location.href);
			return (results === null) ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));

		},
		
		getReferrer: function(o, nocache) {
			
			var BU = Boutique.Utilities;
			var ref = null;
			if (o && $(o).attr('data-referrer')) {
				ref = $(o).attr('data-referrer');
			}
			else {
				ref = document.referrer;
			}
			if (nocache) {
				if (ref.match(/nocache=[a-z0-9]+(&)*/i)) {
					ref = ref.replace(/nocache=[a-z0-9]+(&)*/i, 'nocache=' + BU.uid());
				}
				else if (ref.match(/\?.+?/)) {
					ref += '&nocache=' + BU.uid();
				}
				else {
					ref += '?nocache=' + BU.uid();
				}
			}
			return ref;
		
		},

		getUrl: function (url, tgt) {
			tgt = (tgt && tgt.match(/^_(blank|parent|self|top)$/gi)) ? tgt : '_blank';
			if (url) { window.open(url, tgt); }	
		},
		
		hasContent: function(o) {
			var v;
			var content = false;
			if (o) {
				content = ($(o).find('img').length) ? true : trim($(o).text());
				$(o).find(':input').each(
					function() {
						v = trim($(this).val());
						if (v != '') {
							content = v;	
						}
					}
				);
			}
			//$.clog('Node is empty? [' + content + ']');
			return content;
		},

		htmlDecode: function(content) {
			if (content && typeof DOMParser != 'undefined') {
				var doc = new DOMParser().parseFromString(content, "text/html");			
				content = doc.documentElement.textContent;
			}
			return content;
		},

		initAnchors: function() {
			$(document).on('click', 'a[href="#"]', function(e) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			});
		},

		initBackToFront: function() {

			// Convert styleclass data element values to standard class values
			$('#header [data-styleclass], #content [data-styleclass], #footer [data-styleclass]').each(function() {
				var obj = $(this);
				var classes = obj.data('styleclass');
				obj.addClass(classes);
				obj.removeAttr('data-styleclass');
			});

			// Remove unneeded nodename data elements
			$('#header [data-nodename], #content [data-nodename], #footer [data-nodename]').each(function() {
				var obj = $(this);
				obj.removeAttr('data-nodename');
			});
			
		},
		
		// Update up and down block buttons based on position
		initBlockSwap: function() {
					
			$(Boutique.Editor.el).find('.up').removeClass('disabled');
			$(Boutique.Editor.el).find('.up').first().addClass('disabled');			
			$(Boutique.Editor.el).find('.down').removeClass('disabled');
			$(Boutique.Editor.el).find('.down').last().addClass('disabled');	
				
		},
		
		initBootbox: function() {
			bootbox.setDefaults({
				locale: LOCALE,
				show: true,
				backdrop: true,
				closeButton: false,
				animate: true,
				className: "my-modal"	
			});	
		},
		
		initBorderSelect: function(o) {

			var BU = Boutique.Utilities;
			var OEM = Boutique.Editors.Media;

			if (o && o.prefix) {
				$(o.prefix + '_border_width').on('change', function() {
				
					BU.toggleBorderStyles(o);
					
				});
			}

		},

		initComboBox: function(o) {

			var BU = Boutique.Utilities;
			
			o = o || $('body');
			$(o).find('select.combobox').each(function() {
				$(this).combobox({
					'bsVersion': '3', // bootstrap version
				});
				if ($(this).hasClass('select-nested')) {
					BU.initSelectNested($(this).parent());	
				}
			});
			
		},
		
		initDateRangePicker: function(parentEl) {

			var BU = Boutique.Utilities;
			var $parentEl;
			
			parentEl = parentEl || 'body';
			$parentEl = $(parentEl);

			var $daterangeButton	= $parentEl.find('.btn-select-daterange');
			var $daterangeField 	= $parentEl.find(':input[name="daterange"]');
			var $daterangeDiv 		= $parentEl.find('.daterangepicker');

			if ($daterangeField.length) {

				var dates 				= $daterangeField.val().split(' - ');
				var dateBeg				= (dates && dates[0]) ? dates[0] : moment().subtract(30, 'days');
				var dateEnd				= (dates && dates[1]) ? dates[1] : moment();

				/* Add an anonymous callback function to call after DateRangePicker gets initialized */
				function cbDateRangePicker(start, end, label) {

					var format = 'YYYY-MM-DD hh:mm:ss';
					var dateBeg = start.format(format);
					var dateEnd = end.format(format);
					var daterange = dateBeg + ' - ' + dateEnd;
					$daterangeField.val(daterange);
				
				};

				/* Clear all previously generated pickers */
				$daterangeDiv.remove();

				$daterangeButton.daterangepicker(
					{
						"showDropdowns": true,
						//"timePicker": true,
						//"alwaysShowCalendars" : true,
						"startDate": dateBeg,
						"endDate": dateEnd,
						"timePicker24Hour": true,
						"timePickerIncrement": 30,
						"timePickerSeconds": true,
						"parentEl": $parentEl,
						"locale": {
							"format": "YYYY-MM-DD hh:mm:ss",
							"separator": " - ",
							"applyLabel": "Apply",
							"cancelLabel": "Clear",
							"fromLabel": "From",
							"toLabel": "To",
							"customRangeLabel": "Custom",
							"daysOfWeek": [
								"Su",
								"Mo",
								"Tu",
								"We",
								"Th",
								"Fr",
								"Sa"
							],
							"monthNames": [
								"January",
								"February",
								"March",
								"April",
								"May",
								"June",
								"July",
								"August",
								"September",
								"October",
								"November",
								"December"
							],
							"firstDay": 1
						},
						"opens": "left",
						"drops": "down",
						"buttonClasses": "btn btn-sm",
						"applyClass": "btn-primary",
						"cancelClass": "btn-primary",
						ranges: {
						'Today': [moment(), moment()],
						'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
						'Last 7 Days': [moment().subtract(6, 'days'), moment()],
						'Last 30 Days': [moment().subtract(29, 'days'), moment()],
						'This Month': [moment().startOf('month'), moment().endOf('month')],
						'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
						},
					}, 
					cbDateRangePicker /* This callback function will be called every time the Apply button is clicked */
				);
				
				$daterangeButton.on('cancel.daterangepicker', function(ev, picker) {
					$daterangeField.val('');
				});


			}
		},
		
		initDropups: function() {
			
			Boutique.Utilities.resizeDropups();
			
		},
		
		initEditor: function() {
			var el = $('#editor');
			if ($(el).length) {
				new Boutique.Editor({
					el: $(el).get(0)
				});	
			}
		},

		// sets up flipsnap
		initFlipSnap: function(){
		
			var fs;
			var tb = $('.menu-secondary-actions .toolbar');
			if (tb.length) {
				fs = Flipsnap('.menu-secondary-actions .toolbar', {distance: 250, maxPoint:6});
		
				$('.fs-next').on('click', function(){
					fs.toNext(); 
					
					if(fs.hasPrev()){
						$('.fs-prev').show();
					}
					else{
						$('.fs-prev').hide();
					}
					
					if(fs.hasNext()){
						$('.fs-next').show();
					}
					else{
						$('.fs-next').hide();
					}
				});
				
				$('.fs-prev').on('click', function(){
					fs.toPrev(); 
					
					if(fs.hasPrev()){
						$('.fs-prev').show();
					}
					else{
						$('.fs-prev').hide();
					}
					
					if(fs.hasNext()){
						$('.fs-next').show();
					}
					else{
						$('.fs-next').hide();
					}
				});
			}
			
		},
		
		initGroupMembers: function(o) {
			$(o).selectize({
				plugins: ['remove_button','restore_on_backspace','drag_drop'],
				maxItems: null,
				valueField: 'id',
				labelField: 'title',
				searchField: 'title',
				options: [
					{id: 1, title: 'Spectrometer', url: 'http://en.wikipedia.org/wiki/Spectrometers'},
					{id: 2, title: 'Star Chart', url: 'http://en.wikipedia.org/wiki/Star_chart'},
					{id: 3, title: 'Electrical Tape', url: 'http://en.wikipedia.org/wiki/Electrical_tape'}
				],			
				persist: false,
				create: true,
				render: {
					item: function(data, escape) {
						return '<div>' + escape(data.text) + '</div>';
					}
				}
			});		
		},
		
		initHelpBlocks: function(o) {

			function helpify(o) {
				$(o).each(
					function() {
						var hb = $(this).find('.help-block');
						var bh = $(this).find('.btn-help');
						if (hb.length) {
							hb.hide();
							bh.show();
							$(this).find('.btn-help').off('click').on('click', 
								function() {
									if (hb.is(':visible')) {
										/*hb.animate({opacity:0,height:'hide'});*/
										hb.hide();
									}
									else {
										hb.animate({opacity:1,height:'show'});
									}
								}
							);
						}
						else {
							bh.hide();
						}
					}
				);
			}
			
			o = ($(o).length) ? $(o) : $('.modal-dialog');
			helpify(o);

		},

		initHtml5Elements: function() {
			/* Add one or more HTML5 elements below for non-supporting browsers. We're looking at YOU, Internet Explorer. */
			document.createElement('section');		
		},
		
		initIframe: function() {
			
			$('.editor-iframe').off('load').on('load', 
				function() { 
					Boutique.Utilities.resizeIframe();
				}
			);
			
		},
		
		initMenuPrimary: function() {

			var BU = Boutique.Utilities;
			var OM = Boutique.Messages;
			var OS = Boutique.Settings;

			var $mp = $('.menu-primary');
			$mp.mlpm({
				container: $mp,                                   	// Holding container.
		//		containersToPush: [ $( '#page_wrapper' ), $( '#content2' ) ],  	// Array of DOM elements to push/slide together with menu.
		//		containersToPush: [$('.page-content')],  	// Array of DOM elements to push/slide together with menu.
				collapsed: true,                                          	// Initialize menu in collapsed/expanded mode
		//		menuID: 'mlpm',                              				// ID of the <nav> element.
				wrapperClass: 'mlpm-wrapper',                				// Wrapper CSS class.
				menuInactiveClass: 'mlpm-inactive',          				// CSS class for inactive wrappers.
		//		menu: arrMenu,                                             	// JS array of menu items (if markup not provided).
				menuWidth: '280px',                                              	// Wrapper width (integer, '%', 'px', 'em').
		//		menuHeight: 0,                                             	// Menu height (integer, '%', 'px', 'em').
		//		backText: 'Back',                                          	// Text for 'Back' menu item.
		//		backItemClass: 'backItemClass',                            	// CSS class for back menu item.
		//		backItemIcon: 'icon icon-angle-right',                         	// FontAvesome icon used for back menu item.
		//		groupIcon: 'icon icon-angle-left',                             	// FontAvesome icon used for menu items contaning sub-items.
		//		mode: 'overlap',                                           	// Menu sliding mode: overlap/cover.
		//		overlapWidth: 40,                                          	// Width in px of menu wrappers overlap
				preventItemClick: false,                                    // set to false if you do not need event callback functionality
				//preventGroupItemClick: false,                               	// set to false if you do not need event callback functionality
		//		direction: 'ltr',                                          	// set to 'rtl' for reverse sliding direction
				fullCollapse: true,                                      	 // set to true to fully hide base level holder when collapsed
		//		swipe: 'both'                                              	// or 'touchscreen', or 'desktop'
			});
		
			var $lh = $mp.find('.mlpm-level-holder:first-child');
			
			$('body').on('click', function() {
				if ($mp.mlpm('menuexpanded', $lh)) {
					$mp.mlpm('collapse');
				}
			});
			
			$('body').on('click', '.toggle-mlpm', function(e) {
				e.stopPropagation();
				if ($mp.mlpm('menuexpanded', $lh)) {
					$mp.mlpm('collapse');
				}
				else {
					$mp.mlpm('expand');
				}
			});
			
			$mp.find('a.mlpm-end-anchor').filter('a[href!="#"]').filter('a[target="_self"]').on('click', BU.loadMessage);

			$mp.find('a.mlpm-reload-page').off('click').on('click', function(e) {

				BU.loadMessage(e);
				window.location.reload();

			});
				
		},
		
		initMenuYamm: function() {
			$(document).on('click', '.yamm .dropdown-menu', function(e) {
				e.stopPropagation()
			});		
		},
		
		initMultiModal: function() {
			/* 
			UPDATE! Since Bootstrap 3.2.2, multi-modals are now fully supported in the base code. Leaving this function for posterity reasons only.

			UPDATE#2: Apparently there are still some circumstances where default multi-modal behavior is broken (nested modals). So I'm re-implementing the following function.
			*/

			var indexBase = 1040;
			var marginBase = 30;

			// Allow for multiple simultaneous modals
			$(document).on('show.bs.modal', '.modal', function (e) {
				
				var self = $(this);
				var count = $('.modal:visible').length;
				var index = indexBase + (10 * count);
				var margin = ((count + 1) * marginBase) + 'px';

				//console.log('Showing modal #' + self.attr('id') + ' CSS { zIndex:' + index + ', marginTop:' + margin + ' }');

				// Ensure there is at least one visible modal present and that it is not nested within another modal (eg; Search modal within Media modal)
				if (count > 0 && self.parents('.modal').length === 0) {
					self.add(self.children('.modal-dialog')).css({ 'zIndex': index });
					self.children('.modal-dialog').css({ 'marginTop': margin });
					setTimeout(function() {
						self.children('.modal-backdrop').not('.modal-stack').css('zIndex', index - 1).addClass('modal-stack');
					}, 0);
				}

			});	

			// Multi-modal scrolling fix - Re-establishes scrolling on underlying modal when closing top-most modal 
			$(document).on('hidden.bs.modal', '.modal', function() {

				var self = $(this);
				//console.log('Hiding modal #' + self.attr('id') + ' CSS { zIndex:' + indexBase + ', marginTop:' + marginBase + ' }');
				self.add(self.children('.modal-dialog')).css({ 'zIndex': indexBase });
				self.children('.modal-dialog').css({ 'marginTop': marginBase + 'px' });
				setTimeout(function() {
					self.children('.modal-backdrop.modal-stack').css('zIndex', indexBase - 1).removeClass('modal-stack');
				}, 0);
				
				if ($('.modal.in').length) {
					$('body').addClass('modal-open');
				}
				else {
					$('body').removeClass('modal-open');
				}

			});

		},

		initNavbarMenus: function() {
			$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
				event.preventDefault(); 
				event.stopPropagation(); 
				$(this).parent().siblings().removeClass('open');
				$(this).parent().toggleClass('open');
			});		
		},

		initPaste: function() {
			
			var BU = Boutique.Utilities;
			
			BU.paste = {
				
				curr: null,
				
				tags: ['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'b', 'base', 'basefont', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'dir', 'div', 'dl', 'dt', 'em', 'fieldset', 'font', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'map', 'menu', 'meta', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'q', 's', 'samp', 'script', 'select', 'small', 'span', 'strike', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'tt', 'u', 'ul', 'var', 'xmp'],
				
				stripStyles: function(data) {
					return data.replace(new RegExp("([\w-]+)\s*:\s*([^;]+)"), '');
				},
				
				stripTags: function(data, tag) {
					return data.replace(new RegExp('<' + tag + '[^><]*>|<.' + tag + '[^><]*>','g'), '');
				},
				
				callback: function(tags) {
					var t, tag, data;
					tags = (tags) ? tags.split(',') : ['a', 'b', 'br', 'del', 'em', 'i', 'ins', 'strong', 's', 'strike', 'strikethrough', 'style', 'sub', 'sup', 'u'];
					data = $(BU.paste.curr).html();
					for (t in BU.paste.tags) {
						tag = BU.paste.tags[t];
						data = BU.paste.stripStyles(data);
						if ($.inArray(tag, tags) < 0) {
							//$.clog('removing tag: ' + tag);
							data = BU.paste.stripTags(data, tag);
						}
					}
					if (document.all) {
						data = data.replace(/<\/?[^>]+>/gi, '');
						data = data.replace(/"/gi, '').replace(/'/gi, '');
					}
					$(BU.paste.curr).html(data);
				}
				
			};
			
			(function($){  
				$.fn.paste = function(tags){
					$(this).on('paste', function(e, tags){
						BU.paste.curr = this;
						setTimeout(function(tags) { BU.paste.callback(tags); }, 100);
					});
				}	
			})(jQuery);
			
		},
		
		// Deprecated and replaced with the more modern getNiceScroll (see initPscroll below)
		initPerfectScroll: function(o) {
			o = o || 'body';
			var ps = 'pscroll';
			var psv = 'pscrollv';
			var psc = 'ps-container';
			$(o).find('.' + ps + ', .' + psv).each(function() {
				$.clog('Performing perfectScrollbar initialization');
				// Previously we checked for existing prior to updating but perfectscrollbar has issues
				// with performing updates so we simply destroy any existing versions and recreate
				$(this).perfectScrollbar('destroy');
				if ($(this).hasClass(ps)) {
					$(this).perfectScrollbar({ wheelSpeed:50, suppressScrollX:true });
				}
				else if ($(this).hasClass(psv)) {
					$(this).perfectScrollbar({ wheelSpeed:50, suppressScrollX:true, vertShift:true });
				}
			});
		},

		// 20210315 - Disabling this because we are now using native scrollbar styling via CSS
		initPscroll: function(o) {
			return;

			o = o || 'body';
			
			var BU = Boutique.Utilities;
			var ps = 'pscroll';
			var psv = 'pscrollv';
			var psw = 'pscrollw';
			var psa = 'pscroll-active';
			var pswr = 'pscroll-wrap';
			var options = {};
			var defaults = {
				autohidemode: true, // how hide the scrollbar works, possible values: 
					//true | // hide when no scrolling
					//"cursor" | // only cursor hidden
					//false | // do not hide,
					//"leave" | // hide only if pointer leaves content
					//"hidden" | // hide always
					//"scroll", // show only on scroll          
				background: "", // change css for rail background
				bouncescroll: false, // (only hw accell) enable scroll bouncing at the end of content as mobile-like 
				boxzoom: false, // enable zoom for box content
				cursorborder: "", // css definition for cursor border
				cursorborderradius: "", // border radius in pixel for cursor
				cursorcolor: "", // change cursor color in hex
				cursordragontouch: false, // drag cursor in touch / touchbehavior mode also
				cursordragspeed: 0.3, // speed of selection when dragged with cursor
				cursorfixedheight: false, // set fixed height for cursor in pixel
				cursorminheight: 32, // set the minimum cursor height (pixel)
				cursoropacitymax: 1, // change opacity when cursor is active (scrollabar "visible" state), range from 1 to 0
				cursoropacitymin: 0, // change opacity when cursor is inactive (scrollabar "hidden" state), range from 1 to 0
				cursorwidth: "", // cursor width in pixel (you can also write "5px")
				dblclickzoom: true, // (only when boxzoom=true) zoom activated when double click on box
				disableoutline: true, // for chrome browser, disable outline (orange highlight) when selecting a div with nicescroll
				disablemutationobserver: false, // force MutationObserver disabled,
				enablemouselockapi: true, // can use mouse caption lock API (same issue on object dragging)
				enablemousewheel: true, // nicescroll can manage mouse wheel events
				enablekeyboard: true, // nicescroll can manage keyboard events
				emulatetouch: false, // enable cursor-drag scrolling like touch devices in desktop computer
				enabletranslate3d: true, // nicescroll can use css translate to scroll content
				enableobserver: true, // enable DOM changing observer, it tries to resize/hide/show when parent or content div had changed
				enablescrollonselection: true, // enable auto-scrolling of content when selection text
				gesturezoom: true, // (only when boxzoom=true and with touch devices) zoom activated when pinch out/in on box
				grabcursorenabled: true, // (only when touchbehavior=true) display "grab" icon
				hidecursordelay: 400, // set the delay in microseconds to fading out scrollbars
				horizrailenabled: true, // nicescroll can manage horizontal scroll
				hwacceleration: true, // use hardware accelerated scroll when supported
				iframeautoresize: true, // autoresize iframe on load event
				mousescrollstep: 40, // scrolling speed with mouse wheel (pixel)
				nativeparentscrolling: true, // detect bottom of content and let parent to scroll, as native scroll does
				oneaxismousemode: "auto", // it permits horizontal scrolling with mousewheel on horizontal only content, if false (vertical-only) mousewheel don't scroll horizontally, if value is auto detects two-axis mouse
				preservenativescrolling: true, // you can scroll native scrollable areas with mouse, bubbling mouse wheel event
				preventmultitouchscrolling: true, // prevent scrolling on multitouch events
				railalign: "right", // alignment of vertical rail
				railoffset: false, // you can add offset top/left for rail position
				railpadding: { top: 0, right: 0, left: 0, bottom: 0 }, // set padding for rail bar
				railvalign: "bottom", // alignment of horizontal rail
				rtlmode: "auto", // horizontal div scrolling starts at left side
				scrollbarid: false, // set a custom ID for nicescroll bars 
				scrollspeed: 60, // scrolling speed
				scriptpath: "", // define custom path for boxmode icons ("" => same script path)
				sensitiverail: true, // click on rail make a scroll
				smoothscroll: true, // scroll with ease movement
				spacebarenabled: true, // enable page down scrolling when space bar has pressed
				touchbehavior: false, // DEPRECATED!! use "touchemulate"
				zindex: "auto", // | [number], // change z-index for scrollbar div
			};

			// Activate niceScroll with a wrapper div:
			// 	<div id="scrollbox">
			// 		<div class="scroll-content">
			// 			The content...
			// 		</div>
			// 	</div>
			// 	$("#scrollbox").niceScroll("#scrollbox .scroll-content");

			$(o).find('.' + ps + ',.' + psw + ',.' + psv).each(function() {

				var psChild = $(this);
				var psWrap, height, heightMax, heightOuter;

				if (psChild.hasClass(psa)) {
					if (psChild.hasClass(psw)) {
						psWrap = psChild.parent('.' + pswr);
						psWrap.getNiceScroll().resize();
					}
					else {
						psChild.getNiceScroll().resize();
					}
				}
				else {
					if (psChild.hasClass(psw)) {
						psChild.wrap('<div class="' + pswr + '"></div>');
						height = psChild.css('height');
						heightMax = psChild.css('max-height');
						heightOuter = psChild.outerHeight();
						heights = [parseInt(height), parseInt(heightMax), parseInt(heightOuter)];
						psWrap = psChild.parent('.' + pswr).css('max-height', Math.max.apply(null, heights));
					}
					options = (psChild.hasClass(ps)) ? { horizrailenabled: false } : {};
					options = BU.mergeObjects(defaults, options);
					if (psChild.hasClass(psw)) {
						psChild.css('height', 'initial').css('max-height', 'initial').css('overflow', 'initial');
						psWrap.niceScroll(psChild, options);
					}
					else {
						psChild.niceScroll(options);
					}
					psChild.addClass(psa);
				}

			});
		},
		
		initResize: function() {

			var OEM = Boutique.Editors.Media;
			var BU = Boutique.Utilities;
			
			$('#menu_primary').mlpm('redraw');
			
			// Commenting this out for now since it fails on pages where this dialog is not loaded
			// Need to revise the media dialog and processing anyway so... to be determined??
			//OEM.resize();
			
			BU.resizeDropups();
			
			BU.initSearchForm();

			BU.initPscroll();
			
			$('.expand-menu, .element-menu').removeClass('active');
			
			$('.blockUI.blockMsg').center();
			
			BU.resizeIframe();

		},

		initSearchForm: function(frm, callback, args) {
			
			var OCS = Boutique.Controllers.Search;
			var BU = Boutique.Utilities;
			var OI = Boutique.Inflection;
			var fnc = 'initSearchForm';
			var searchPos, $frm, sels, sf, sfs, sfp, filterCount, filterButton, filterTitle;

			// Adjust position of search element based on menu type and screen width (not within a modal)
			if ($('.modal .input-group-search').length === 0) {	
				searchPos = ($('.menu-secondary.full').length || Modernizr.mq('(max-width: 767px)')) ? '0px' : '45px';
				$($('.editor > form').find('.input-group-search').get(0)).css({ right: searchPos });
			}

			$frm = $(frm);
			if ($frm.length) {
				
				// Search modal is actually contained within the async html so it will 
				// disappear when the new content is dumped. So all we need to do is
				// reset the scroll bar on the main page content (assuming no other 
				// modals are present beneath the current search modal).
				BU.setModalScroll();

				// Unbind default actions for current form
				$frm.off('submit').on('submit', function(e) {
					e.preventDefault();
					e.stopImmediatePropagation();			
					if (typeof (callback || undefined) === 'function') {
						callback.call(null, args);	
					}
					return false;
				
				});

				// Set up sorting functionality on list headers
				$frm.find('[data-orderby]').off('click').on('click', function() {
					
					// ASC and DESC switching is now done via PGR::setOrderBy
					// So all we need to do here is transfer the value from
					// this item to the orderby paging field and we're all set
					
					var elm = $(this);

					elm.addClass('tt');
					$frm.find('[name="orderby"]').val(elm.data('orderby'));
					console.log("$frm.find('[name=\"orderby\"]').val() = " + $frm.find('[name="orderby"]').val());
					console.log("elm.data('orderby') = " + elm.data('orderby'));
					if (typeof (callback || undefined) === 'function') {
						callback.call(null, args);
					}

				});

				// Reset paging for all search submit buttons
				$frm.find('.btn-search').off('click').on('click', function() {
					BU.pageset(1, $(this));
				});

				// Reset close functionality for pages with nested modals
				// Editor contains nested modals so only close one at a time
				if (PAGE === 'editor') {
					sels = $frm.find('.modal-header .btn-modal-close, .modal-footer .btn.dialog-close');
					sels.removeAttr('data-dismiss');
					sels.off('click').on('click', function() {
						$(this).closest('.modal').hide();
					});
				}

				// Set attribs and function on paging buttons
				$frm.find('.btn-paging').each(
					function() {
						if ($(this).attr('href')) {
							$(this)
							.removeAttr('href')
							.off('click')
							.on('click', 
								function() {
									BU.pageset($(this).attr('data-value'), this);
									$(this).closest('form').trigger('submit') ;
								}
							);
						}
					}
				);

				filterButton = $frm.find('.input-group-search .show-search-filters');
				if (filterButton.length) {
					
					// Check for active filters and alter button accordingly
					filterCount = $frm.find(':input.search-filter').filter(function() { 
						var val = $.isset(trim($(this).val()));
						var isActive = (val && val != 'null'); 
						if (isActive) { console.log($(this).attr('name') + ':[' + val + ']'); }
						return isActive; 
					}).length;
					
					filterTitle = filterButton.attr('title');
					
					if (filterCount) {
						filterButton
							.attr('title', filterTitle + ' (' + filterCount + ' active)')
							.addClass('ocms-glowing-default')
						;
					}
					else {
						filterButton
							.attr('title', filterTitle.replace(/\s*\([0-9]+\s+[a-z]\s*$/i, ''))
							.removeClass('ocms-glowing-default')
						;
					}

				}

				// The index list is loaded via ajax and includes the search dialogs so we need to 
				// re-initialize all the Boutique.Controllers.Search.* dialogs to repopulate fields
				// and restore search functionality. Note: Check to ensure it's present before calling.
				if (OCS) {
					OCS.init();
					for (sf in OCS.selectizeFields) {
						sfp = OCS.selectizeFields[sf];
						sfs = ucfirst(OI.singularize(sfp));
						OCS[sfs].init();
					}
				}
		
				BU.initHelpBlocks();
				BU.initSelectPicker($frm);
				BU.initPscroll($frm);
				BU.addToInit(fnc);

			}
		},
		
		initSegmentSelect: function(dialog, callback) {
			
			var BU = Boutique.Utilities;
			var dialog, seg, controls, segments;
			
			dialog = $(dialog);
			if (dialog.length) {

				controls = dialog.find('.segmented-control button');
				segments = dialog.find('.segment');
				
				controls.off('click').on('click', function() {
					var self = this;
					seg = '#' + $(this).attr('data-navigate');
					controls.add(segments).removeClass('active');
					$(self).add($(seg)).addClass('active');
					BU.initPscroll(seg);
					if (typeof (callback || undefined) === 'function') {
						callback.call(null, self);
					}
				
				});
				
			}
			
		},

		initSelectize: function(o) {
			o = o || 'body';
			$(o).find('.selectize').selectize({
				plugins: ['remove_button','restore_on_backspace','drag_drop'],
				persist: false,
				create: true,
				render: {
					item: function(data, escape) {
						return '<div>' + escape(data.text) + '</div>';
					}
				}
			});	
			$(o).find('.selectize-input').addClass('pscroll');	
		},

		initSelectMediaBrowseImage: function(o) {

			var BU = Boutique.Utilities;
			var OEM = Boutique.Editors.Media;

			if (o && o.dialog) {
				$(o.dialog).find('.ocms-select-media-path').off('input blur change').on('input blur change', function() {

					BU.toggleBackgroundStyles(o);
		
				});
				$(o.dialog).find('.ocms-select-media-browse').off('click').on('click', function() {
		
					var options = {
						action: 'path',
						filters: true,
						multiple: false,
						origin: $(o.dialog).find('.ocms-select-media-path'),
						search: true,
						text: 'SEARCH to locate your media. LEFT click the item to select it.',
						upload: true,
					};
		
					OEM.show(null, options);
		
				});
			}

		},

		initSelectMediaBrowseLinkable: function(o) {

			var OEM = Boutique.Editors.Media;

			if (o && o.dialog) {
				$(o.dialog).find('.ocms-select-media-browse').off('click').on('click', function() {
		
					var options = {
						action: 'path',
						browse: false,
						contenttypes: 'tutorials,links,collections,lists,messages,products,faqs,pages,templates,headers,footers,fragments,polls,documents,books,events',
						filters: true,
						multiple: true,
						origin: $(o.dialog).find('.ocms-select-media-path'),
						perpage: 49,
						search: true,
						text: 'SEARCH to locate your item. LEFT click the item to select it.',
						upload: true,
						view: 'list',
					};
		
					OEM.show(null, options);
		
				});
			}

		},

		/* Format nested selects */
		initSelectNested: function(o) {
			o = o || $('body');
			$(o).find('div.select-nested .text').each(
				function(i) {
					var m = '0';
					var s = $(this);
					if (i === 0) {
						if (s.closest('div.select-nested').find('select.select-nested option').first().val() === '') {
							s.addClass('select-nested-top');	
						}
					}
					else {
						var hb = s.html();
						var ha = hb;
						var l = hb.split('&nbsp;').length-1; 
						if (l) {
							m = parseInt(l * 4);
							s.css({marginLeft:m + 'px'});
							ha = hb.replace(/(&nbsp;)+?/g, '');
							s.html(ha);	
						}
						//$.clog('hb: ' + hb + ' -- ha: ' + ha + ' -- length: ' + l + ' -- margin-left: ' + m); 
					}
				}
			);			
		},
		
		initSelectPicker: function(o, opts) {
			
			var BU = Boutique.Utilities;
			var sa = 'selectpicker-active';
			
			o = o || $('body');
			$(o).find('select.selectpicker').each(function() {
				var self = $(this);
				var defaults = {
					'delay': 0,
					'style': '',
					'iconBase': 'icon',
					'tickIcon': 'icon-check',
					// 20200628 - Commenting liveSearch out for now because it bugs and then no search is available at all
					//'liveSearch': (self.children('option').length > 10) ? true : false,
					'size': 10
				};
				var options = (opts && $.isPlainObject(opts)) ? BU.mergeObjects(defaults, opts) : defaults;
				setTimeout(function() {
					if (self.hasClass(sa)) {
						self.selectpicker('refresh');
					}
					else {
						self.addClass(sa).selectpicker(options).trigger('change');
					}
					if (self.hasClass('select-nested')) {
						BU.initSelectNested(self.parent().parent());	
					}
				}, options['delay']);
			});
			// Remove titles on selectpicker button elements as they are not needed
			$(o).find('button.selectpicker').removeAttr('title');
			
		},
		
		initSlider: function(o, label) {
			
			var BU = Boutique.Utilities;
			
			o = o || $('body');
			label = label || ' percent';
			$(o).find('input.ocms-slider').each(function() {
				$(this).slider({
					formatter: function(value) {
						return value + label;
					}
				});
			});
			
		},
		
		initSortable: function() {

			var BU = Boutique.Utilities;
			var cep = '<div id="content_editor_placeholder" class="ocms-dd-placeholder"></div>';
			var cols; 
			
			$('.sortable').sortable({
				handle:'.move', 
				connectWith: '.sortable', 
				placeholder: 'ocms-dd-placeholder', 
				opacity:'0.6', 
				tolerance: 'pointer',
				start: function(event, ui) {
					var h;
					if (!$(ui.item).hasClass('draggable')) {
						cols = $(ui.item).closest('.block.row').find('.col');
						h = 0;
						cols.each(function() { 
							if ($(this).height() > h) {
								h = $(this).height();
							}
						});
						cols.height(h);
						//$.clog('setting column heights to ' + $cols.height());
						$(this).sortable('refreshPositions');
					}
				},
				stop: function(event, ui) {
					cols = $(ui.item).closest('.block.row').find('.col');
					if (cols.length) { 
						cols.height('');
					}
					$(Boutique.Editor.el).find('.expand-menu, .element-menu').removeClass('active');

				},
				receive: function(event, ui) {
					if ($(ui.item).is('a')) {
						$(Boutique.Editor.el).find('a.ui-draggable').replaceWith(cep);
					}
				}
			});
			// setup sorting on .shelf-items, forms, slideshows
			BU.initSortableForm();
			BU.initSortableShelf();
			BU.initSortableGallery();
		},
		
		initSortableForm: function() {
			$('.form div').sortable({handle: '.move', placeholder: 'ocms-dd-placeholder', opacity:'0.6', axis:'y'});
		},
		
		initSortableShelf: function() {
			$('.shelf-items').sortable({handle: '.move', placeholder: 'ocms-dd-placeholder', opacity:'0.6', axis:'y'});
		},
		
		initSortableGallery: function() {
			//$.clog('init sortable gallery now!');
			/* Setup sorting on galleries */
			$('.gallery div.thumbs').each(function() {
				if ($(this).data('ui-sortable')) {
					$(this).sortable('destroy');
				}
				$(this).sortable({
					start: function(e, ui){
						ui.placeholder.css({
							height: ui.item.css('height'),
							width: ui.item.css('width'),
							margin: ui.item.css('margin'),
							padding: ui.item.css('padding')
						});
					},
					handle:'img', 
					items:'span.thumb', 
					placeholder: 'ocms-dd-placeholder-inline', 
					opacity:'0.6'
				});
			});
		},

		initTimepicker: function() {
			$('.datetime').datetimepicker({
				closeOnDateSelect:true,
				datepicker:true,
				dayOfWeekStart: 1,
				format:	'Y-m-d H:i:s',

				//defaultDate:'',
				//defaultTime:'',
				formatDate:'Y-m-d',
				formatTime:'H:i:s',
				//inline:false,
				lang: 'en',
				//mask:'9999-19-39 29:59',
				//startDate: '',
				step:30,
				timepicker:true,
				//yearOffset:0,
				//minDate:0,
				//maxDate:0
			});
		},
		
		initTooltips: function(o) {
			if (!Modernizr.touch) { 
				var $tb, $tl, $tr, $tt;
				var tbs = ''; // Tooltip Bottom Selectors - Displays below the item
				var tls = ''; // Tooltip Left Selectors - Displays to the left of the item
				var trs = ''; // Tooltip Right Selectors - Displays to the right of the item
				var tts = ''; // Tooltip Top Selectors - Displays above the item

				o = ($(o).length) ? $(o) : $('body');
							
				tbs += '.toolbar a.tt,';
				tbs += '.primary-action a.expand-menu.tt,';
				tbs += '.primary-action .icon.tt,';
				tbs += 'tr a.expand-menu.tt, li a.expand-menu.tt,';
				tbs += 'tr .element-menu .tt, li .element-menu .tt,';
				tbs += 'tr .content-preview.tt,';
				tbs += 'tr th .tt,';
				tbs += 'tr td .tt,';
				tbs += '.block.row .tt,';
				tbs += '.modal-content .tt,';
				tbs += '.input-group-search .tt,';
				tbs += '.modal-full .tt,';
				tbs += '.gallery .thumbs .tt';
				
				tls += '.primary-action .element-menu a.tt,';

				trs += '';
				
				tts += '.editor-actions button .tt,';
				tts += '.editor-iframe-actions button .tt,';

				$tb = $(o).find(rtrim(tbs, ','));
				$tl = $(o).find(rtrim(tls, ','));
				$tr = $(o).find(rtrim(trs, ','));
				$tt = $(o).find(rtrim(tts, ','));

				$tb.addClass('ttb');
				$tl.addClass('ttl');
				$tr.addClass('ttr');
				$tt.addClass('ttt');
				
				$(o).find('.tt.ttb').tooltip({ container: 'body', placement: 'bottom' });
				$(o).find('.tt.ttl').tooltip({ container: 'body', placement: 'left' });
				$(o).find('.tt.ttr').tooltip({ container: 'body', placement: 'right' });
				$(o).find('.tt.ttt').tooltip({ container: 'body', placement: 'top' });
				$tt.add($tb).add($tl).add($tr).removeClass('tt');
			}
		},
		
		intervals: [],
		
		isJSON: function(v) {
			var isJSON = true;
			var json;
			if (typeof v != 'string') {
				v = JSON.stringify(v);
			}
			try {
				json = JSON.parse(v);
			}
			catch(err) {
				isJSON = false;
			}
			return isJSON;
		},
		
		loadMessage: function(e) {

			var BU = Boutique.Utilities;
			var OM = Boutique.Messages;
			var OS = Boutique.Settings;

			if (BU.clickIs(e, 'left')) {
				OM.progress(OS.t('messageLoading'), $('body'));
			}

		},

		mergeObjects: function(obj1, obj2, mutate) {
			// Merge options object into settings object
			// var settings = { validate: false, limit: 5, name: "foo" };
			// var options  = { validate: true, name: "bar" };
			// jQuery.extend(obj1, obj2);

			// Now the content of settings object is the following:
			// { validate: true, limit: 5, name: "bar" }
			// The above code will mutate the object named settings.

			// If you want to create a new object without modifying either argument, use this:

			// var defaults = { validate: false, limit: 5, name: "foo" };
			// var options = { validate: true, name: "bar" };

			// Merge defaults and options, without modifying defaults 
			// var settings = $.extend({}, defaults, options);

			// The content of settings variable is now the following:
			// {validate: true, limit: 5, name: "bar"}
			// The 'defaults' and 'options' variables remained the same.
			
			mutate = mutate || false;
			
			if (obj1 && obj2) {

				var newObj = {};

				if (mutate) {
					newObj = jQuery.extend(obj1, obj2);
				}
				else {
					newObj = $.extend({}, obj1, obj2);
				}

			}

			return newObj;

		},

		nestable: function(root, menu) {
			
			var BU = Boutique.Utilities;
			var actions;
			var list = $(root);

			if (list.length && menu) {
				actions = $('.editor-actions');
				list.find('.ocms-dd-content').each(function() { $(this).prepend(menu); console.log('appending menu to ocms-dd-content item!'); });
				list.nestable({
					listNodeName    	: 'ol',
					itemNodeName    	: 'li',
					rootClass       	: 'ocms-dd',
					listClass       	: 'ocms-dd-list',
					itemClass       	: 'ocms-dd-item',
					dragClass       	: 'ocms-dd-dragel',
					handleClass     	: 'expand-menu',
					collapsedClass  	: 'ocms-dd-collapsed',
					placeClass      	: 'ocms-dd-placeholder',
					noDragClass     	: 'ocms-dd-nodrag',
					emptyClass      	: 'ocms-dd-empty',
					expandBtnHTML   	: '<button data-action="expand" type="button">Expand</button>',
					collapseBtnHTML 	: '<button data-action="collapse" type="button">Collapse</button>',
					group           	: 0,
					maxDepth        	: 5,
					threshold       	: 20,
					expandCallback		: function() { BU.nestableExpand(list, actions); },
					collapseCallback	: function() { BU.nestableCollapse(list, actions); },
					dropCallback		: function() { BU.nestableDrop(list, actions); },
				});

				list.nestable('collapseAll');

				BU.nestableButtons(list, actions);

			}
			
		},
		
		nestableButtons: function(list, actions) {

			var BU = Boutique.Utilities;

			var btnexp, btncol, cntitems, cntcolls;

			if (list && actions) {

				btnexp = actions.find('button[data-action="expand-all"]');
				btncol = actions.find('button[data-action="collapse-all"]');

				cntitems = list.find('li button').length;
				cntcolls = list.find('li.ocms-dd-collapsed button').length;

				btnexp.off('click').on('click', function() { 
					list.nestable('expandAll'); 
					BU.nestableButtons(list, actions);
				});

				btncol.off('click').on('click', function() { 
					list.nestable('collapseAll'); 
					BU.nestableButtons(list, actions);
				});

				//console.log('cntitems: ' + cntitems + ', cntcolls: ' + cntcolls);

				if (cntcolls === 0) {
					btnexp.removeClass('btn-first').hide();
					btncol.addClass('btn-first').show();
				}
				else if (cntitems === cntcolls) {
					btnexp.addClass('btn-first').show();
					btncol.removeClass('btn-first').hide();
				}
				else {
					btnexp.addClass('btn-first').show();
					btncol.removeClass('btn-first').show();
				}

			}	

		},

		nestableCollapse: function(list, actions) {
			
			var BU = Boutique.Utilities;

			BU.nestableStripe();
			BU.nestableButtons(list, actions);

		},
		
		nestableDrop: function(list, actions) {

			var BU = Boutique.Utilities;

			Boutique.Utilities.nestableStripe(o);
			$('.editor-actions').find('button.editor-save').trigger('click');
			BU.nestableButtons(list, actions);

		},
		
		nestableExpand: function(list, actions) {
			
			var BU = Boutique.Utilities;

			BU.nestableStripe();
			BU.nestableButtons(list, actions);

		},
		
		nestableOrder: function(o) {
			o = $(o);
			var ord = 0;
			var oid, cid;
			if (o.length) {
				oid = o.closest('.ocms-dd-item').attr('data-id');
				o.closest('.ocms-dd-list').children('.ocms-dd-item').each(
					function(i) {
						cid = $(this).attr('data-id');
						if (cid === oid) {
						$.clog('oid: ' + oid + ' vs. cid: ' + cid);
							ord = i;
							return;
						}
					}
				);
			}

			return ord;	
		},
			
		nestableStripe: function() {
			$('.ocms-dd-list').find('.ocms-dd-content:visible').each(
				function(i) { 
					$(this).removeClass('ocms-dd-even ocms-dd-odd').addClass((i % 2 === 0) ? 'ocms-dd-even' : 'ocms-dd-odd');
				}
			);
		},
		
		pageset: function(v, o) {
			var $frm = $(o).closest('form');
			var $srow = $frm.find(':input[name="srow"]');
			var $erow = $frm.find(':input[name="erow"]');
			var $pg = $frm.find(':input[name="pg"]');
			var $pp = $frm.find(':input[name="perpage"]');
			if (v == '') {
				$pg.val(1);
				var page = false;
			}
			else {
				$pg.val(v);
				var page = true;
			}
			//$.clog('page val: '+ $pg.val());
			if ($pg.val() == 1) {
				$srow.val(1);
				$erow.val(parseInt($pp.val()));
			}
			else {
				$srow.val(((parseInt($pg.val()) - 1) * parseInt($pp.val())) + 1);
				$erow.val(parseInt($srow.val()) + parseInt($pp.val()) - 1);
			}
			return page;
		},

		pauseEvent: function(e) {
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			if (e.preventDefault) {
				e.preventDefault();
			}
			e.cancelBubble = true;
			e.returnValue = false;
			return false;
		},

		prefix: function(obj, dialog, prefix) {
			
			obj = obj || null;
			dialog = dialog || null;

			if (obj && dialog) {
				if (!prefix) {
					prefix = dialog.attr('id').split('_');
					prefix = '#' + prefix[0];
				}
				obj.prefix = prefix;		
			}

		},
		
		// redirects current URL to a new one with possible delay
		redirect: function(url, delay){
			
			var BU = Boutique.Utilities;
			
			delay = (delay && delay.toString().match(/[0-9]+/)) ? delay : 0;
			if (url) {
				BU.timeouts[BU.timeouts.length] = setTimeout(function() { 
					window.location = url;
				}, delay); 
			}
			
		},
		
		// replaces all occurances for a string
		replaceAll: function(src, stringToFind, stringToReplace){

			var temp = src;
			var index = temp.indexOf(stringToFind);
			while(index != -1){
				temp = temp.replace(stringToFind, stringToReplace);
				index = temp.indexOf(stringToFind);
			}
			return temp;

		},
		
		// resize dropdown-menus to fit in current window
		resizeDropups: function(o) {
			o = o || 'body';
			o = $(o);
			if (o.length) {
				o.find('.editor-actions .dropup').each(
					function() {
						var btn = $(this).prev('button.dropdown-toggle');
						var offset = btn.offset();
						var height = offset.top;
						$(this).css('max-height', parseInt(height - 4) + 'px');
					}
				);	
			}
		},	
		
		// resize iframe to same height as contents within
		resizeIframe: function() {
			var h;
			var o = $('.editor-iframe');
			if (o.length) {
				h = parseInt(o.get(0).contentWindow.document.body.scrollHeight + 100) + 'px';
				o.height(h);
				//$.clog('Resizing iframe to height: ' + h);
			}
		},	
		
		// use Google maps to reverse geocode address, #ref: https://developers.google.com/maps/documentation/javascript/geocoding
		reverseGeocode: function(latitude, longitude, callback){
			
			try{
				if(google.maps.Geocoder){
		
					var latLng  = new google.maps.LatLng(latitude, longitude);
					var geocoder = new google.maps.Geocoder();
					
					geocoder.geocode({'latLng': latLng}, function(results, status){
					
						console.log(results);
					
						if (status == google.maps.GeocoderStatus.OK){
							// #ref: https://developers.google.com/maps/documentation/javascript/reference#LatLng
							callback(results[0].geometry.location.lat(), results[0].geometry.location.lng(), results[0].formatted_address);
						}
					
					});
				
				}
				else{
					return false;
				}
			}
			catch(e){
				return false;
			}

		},
		
		// converts an rgb color to a hex color value
		rgbToHex: function(rgb){
			
			if(jQuery.browser.msie)return rgb.replace('#', '');
			
			rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
			function hex(x) {
			hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
			return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
			}
			return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
		},
		
		scriptAppend: function(src, id, pos) {
			if (src) {
				var BU = Boutique.Utilities;
				var s = document.createElement('script');
				
				pos = pos || '#footer';
				id = name || 'ocms_script_' + BU.uid();
				
				if (src.match(/^((http(s)*:)*\/\/)/) !== false) {
					s.src = src;
					s.id = id;
					$(pos).append(s);	
				}
			}
		},
		
		scrollTo: function(o) {
			if ($(o).length) {
				var padTop = parseInt(parseInt($('#content').css('padding-top')) + 4);
				//$.clog('padding top of content: '+padTop);
				$('html, body').animate({ scrollTop: ($(o).offset().top - padTop) }, 1000);
			}
		},
		
		// expands a selection if required in order to remove a link
		selectionExpand: function(selected, elm) {
			var self = this;
			if (selected && selected['selection'] && elm) {
				var selection = selected['selection'];
				var node = selection.anchorNode; 
				while (node && node.nodeName.toLowerCase() !== elm.toLowerCase()) { 
					node = node.parentNode;
				}
				if (node) { 
					range = document.createRange(); 
					range.selectNodeContents(node); 
					selection.addRange(range); 
				}
				selected = self.selectionSave(selected);
			}
			return selected;	
		},
		
		// highlights format and block element editor buttons if selection sits between them
		selectionHighlight: function() {
			var elm = Boutique.currnode;
			var nnu, nc, ec, cls, elmclasses, selection, node, name;
			var selected = this.selectionSave();
			if (selected && elm) {
				$('.menu-secondary-actions a').removeClass('active');
				elm = $(elm).get(0);
				node = selected['parent'];
				while (node && node !== elm) {
					nc = false;
					name = node.nodeName.toLowerCase();
					switch (name) {
						case 'a': 		
							nc = 'link'; 			
							break;
						case 'code': 		
							nc = 'code'; 			
							break;
						case 'img': 		
							nc = 'img'; 			
							break;
						case 'strong': 		
						case 'b': 		
							nc = 'bold'; 			
							break;
						case 'sub': 	
							nc = 'subscript'; 		
							break;
						case 'sup': 	
							nc = 'superscript'; 	
							break;
						case 'del': 	
						case 'strike': 	
						case 'strikethrough': 	
							nc = 'strike'; 			
							break;
						case 'u':		
						case 'ins':		
							nc = 'underline';		
							break;
						case 'em':
						case 'i': 		
							nc = ($(node).hasClass('icon')) ? 'fonticon' : 'italic'; 
							break;
					}
					if (nc) {
						$('.menu-secondary-actions .' + nc).addClass('active');
						$.clog('highlighting node [' + name + '] with class [' + $(node).prop('class') + ']');
					}
					node = node.parentNode;
				}
				elmclasses = trim($(elm).prop('class')).split(' ');
				for (ec in elmclasses) {
					nc = false;
					cls = elmclasses[ec];
					switch (cls) {
						case 'text-center': 		
							nc = 'align-center'; 			
							break;
						case 'text-justify': 		
							nc = 'align-justify'; 			
							break;
						case 'text-left': 		
							nc = 'align-left'; 			
							break;
						case 'text-right': 		
							nc = 'align-right'; 			
							break;
						default:
							nc = cls;
							break;
					}
					if (nc) {
						$('.menu-secondary-actions .' + nc).addClass('active');
						//$.clog('highlighting block node [' + elm + '] with class [' + nc + ']');
					}
				}
			}
		},
		
		selectionInsertElementAtCaret: function(node) {
			var BU = Boutique.Utilities;
			BU.selectionInsertNodeAtCaret(node, 'element');
		},

		selectionInsertNodeAtCaret: function(node, type) {
			if (node) {
				type = type || 'text';
				node = (type == 'element') ? document.createElement(node) : document.createTextNode(node);
				if (typeof window.getSelection != "undefined") {
					var sel = window.getSelection();
					if (sel.rangeCount) {
						var range = sel.getRangeAt(0);
						range.collapse(false);
						range.insertNode(node);
						range = range.cloneRange();
						range.selectNodeContents(node);
						range.collapse(false);
						range.setStartAfter(node);
						range.setEndAfter(node); 					
						sel.removeAllRanges();
						sel.addRange(range);
					}
				} 
				else if (typeof document.selection != "undefined" && document.selection.type != 'Control') {
					var html = (node.nodeType == 1) ? node.outerHTML : node.data;
					var id = 'marker_' + ('' + Math.random()).slice(2);
					html += '<span id="' + id + '"></span>';
					var textRange = document.selection.createRange();
					textRange.collapse(false);
					textRange.pasteHTML(html);
					var markerSpan = document.getElementById(id);
					textRange.moveToElementText(markerSpan);
					textRange.trigger('select') ;
					markerSpan.parentNode.removeChild(markerSpan);
				}
			}
		},
		
		selectionInsertTextAtCaret: function(node) {
			var BU = Boutique.Utilities;
			BU.selectionInsertNodeAtCaret(node);
		},

		selectionMoveCaret(node, end) {
			var sel = window.getSelection();
			sel.selectAllChildren(node);
			if (end) {
				sel.collapseToEnd();		
			}
			else {
				sel.collapseToStart();
			}
		},

		// restores the selection
		selectionRestore: function(selected) {
			
			var theRange, sel;

			if (selected['range']) {
				theRange = selected['range'];
				if (window.getSelection) {
					sel = window.getSelection();
					sel.removeAllRanges();
					for (var i = 0, len = theRange.length; i < len; ++i) {
						sel.addRange(theRange[i]);
					}
				} 
				else if (document.selection && theRange.select) {
					theRange.trigger('select') ;
				}
			}
		},
		
		// saves the current selection
		selectionSave: function(selected) {

			var expand = selected || false;
			var theText = '';
			var theSelection, theRange, theParent;
			
			selected = selected || [];
			
			if (!window.opera && document.selection && document.selection.type != 'Control') {
				theSelection = document.selection;
				theParent = theSelection.anchorNode;
				theRange = theSelection.createRange();
				theText = theSelection.text;
				if (theRange) {
					theParent = theRange.parentElement();
				}
			}
			else if (window.getSelection) {
				theSelection = window.getSelection();
				theParent = theSelection.anchorNode;
				if (theSelection.getRangeAt && theSelection.rangeCount) {
					var theRange = [];
					for (var i = 0, len = theSelection.rangeCount; i < len; ++i) {
						theRange.push(theSelection.getRangeAt(i));
					}
				}
				if (theRange && theRange[0]) {
					if (theParent.nodeName.toLowerCase() == '#text') {
						theParent = theRange[0].startContainer.parentNode;
					}
					else {
						theParent = theRange[0].startContainer.childNodes[0];
					}
				}
				theText = theSelection.toString();
			}
			selected['text'] = theText;
			selected['selection'] = theSelection;
			selected['range'] = theRange;
			if (!expand) {
				selected['parent'] = theParent;
			}
			return selected;
		},
		
		// gets the selected text
		selectionText: function() {
			
			var self = this;
			var selected = self.selectionSave();
			return selected['text'];
			
		},
		
		serialize: function(v) {
			
			var output = '';
			if (window.JSON) {
				output = window.JSON.stringify(v);
				$.clog(output);
			}
			else {
				$.clog('JSON browser support required for serialization of nestable lists.');
			}
			return output;
			
		},
		
		setAttribs: function(node, attribs, format) {
			format = format || 'string';
			var BU = Boutique.Utilities;
			var key, val, nodename;
			var output = (format === 'string') ? '' : {};
			var defaults = {};
			if (node) {
				if (typeof (attribs || undefined) === 'string') {
					nodename = trim(attribs).toLowerCase();
					defaults['id'] = '';
					defaults['class'] = nodename;
					defaults['data-nodename'] = nodename;
					attribs = defaults;
				}
				if ($.isPlainObject(attribs)) { 
					node = $(node);
					for (key in attribs) {
						val = attribs[key];
						if (key === 'class') {
							node = $(node).addClass(val);
						}
						else {
							if (key === 'id') {
								val = val.replace(/^([^\s]+)\s+[^_]+(_.+)$/g, '$1$2');
							}
							node = $(node).attr(key, val);
						}
					}
				}
				if ($.isEmptyObject(defaults) === false) {
					node = BU.setId(node);	
				}
				if ($(node).get(0)) {
					output = (format === 'string') ? $(node).get(0).outerHTML : $(node).get(0);
				}
			}
			//$.clog('setAttribs: ' + output);
			return output;
		},

		// Assign a block element to be used for centering message output
		setBlock: function(o) {

			var block = $('body');
			var i, c, t;

			if (o && o.prefix && o.dialog) {

				block = ($(o.prefix + '_dialog:visible').length) ? o.dialog.find('.modal-content') : block;
				o.block = block;

			}

			i = block.attr('id');
			c = block.attr('class');
			t = block.prop('tagName');

			//$.clog('BU.setBlock called. Current block: ' + t.toUpperCase() + ((i) ? '#' + i : '') + ((c) ? '.' + trim(c).split(/\s+/).join('.') : ''), 'success');
			return block;

		},

		// Assign coordinates to currcell var to track current x,y position of cursor within an editable html table
		setCurrCell: function(o) {
			if ($(o).length) {
				Boutique.currcell = [];
				$(o).closest('table').find('tr').each(function(r) {
					$('th, td', this).each(function(c) {
						if (this === o) {
							Boutique.currcell.push(r);
							Boutique.currcell.push(c);
							Boutique.currcell.push(o);
						}
					});
				});
			}
		},
		
		setDialogDefaults: function(dialog) {
			
			var BU = Boutique.Utilities;

			dialog = $(dialog);

			if (dialog.length) {
				//dialog.find('.segment-general :input, .segment-advanced :input').val('');
				dialog.find('.segment-style :input').each(function() {
					$(this).val($(this).attr('data-default'));
				});
				BU.initSelectPicker(dialog);
			}

		},

		setDialogStyles: function(node, dialog) {
			
			var BU = Boutique.Utilities;
			var bgi, styleclass, styleclasses, c, m;

			node = $(node);
			dialog = $(dialog);

			if (dialog.length) {
				// Reset dialog to default values prior to gathering from DOM element
				BU.setDialogDefaults(dialog);
				if (node.length) {
					// Check for background image
					bgi = node.attr('data-background-image');
					if (bgi) {
						dialog.find('.segment-style :input.ocms-select-media-path').val(bgi);
					}
					// Check all other style types
					styleclasses = node.attr('data-styleclass');
					styleclasses = (styleclasses) ? trim(styleclasses).split(' ') : '';
					if (styleclasses.length) {
						for (styleclass in styleclasses) {
							c = styleclasses[styleclass];
							if (c) {
								m = c.match(/^(ocms-[a-z]+)-(.+)$/i);
								if (m && m.length > 1) {
									//console.log('setDialogStyles m[1]:' + m[1] + ', m[0]:' + m[0]);
									dialog.find('.' + m[1]).val(m[0]);
								}
							}
						}
					}
					BU.initSelectPicker(dialog);
				}
			}

			return false;			
		},

		setDialogTitle: function(dialog, id) {

			/* 
				TODO - For full language compatibility, we need to first translate the 
				words below, then run replace and append. But we're not sure that the replace
				enclosers will not conflict with alt characters types from other languages
				so for now we're only calling this function on the English terms.
			*/ 

			if (dialog) {
				var header = dialog.find('.modal-header h3');
				var title = trim(header.text());
				title = title.replace(/(^\s*New\s+|\s+Properties\s*$)/i, '');
				title = (id) ? title + ' Properties' : 'New ' + title;
				header.text(title);
			}

		},

		// Update focus for current or newly added fields
		setFocus: function(obj, blr) {
			blr = blr || false;
			var selectors = '[contentEditable=true], input, textarea'; 
			if (blr) {
				$(selectors).trigger('blur') ;
			}
			if ($(obj).length && !$(obj).hasClass('slideshow')) {
				$(obj).find(selectors).first().trigger('focus') ;
			}
			
		},
		
		setId: function(node, id) {
			
			var nodename, nodeId;

			node = $(node);
			if (node.length) {
				// configure id based on existing node
				nodename = node.attr('data-nodename') || node.get(0).nodeName;
				nodename = nodename.toLowerCase();
				if (nodename.match(new RegExp(Boutique.Editor.nodeTypes))) {
					nodeId = node.attr('id') || '';
					if (!nodeId || (nodeId && id)) {
						id = id || nodename + '_' + Boutique.Editor.uid();
						id = trim(id).replace(/^#/, '');
						if ($('#' + id).length === 0) {
							node.attr('id', id);
						}
					}
				}
				return node.get(0).outerHTML;
			}
			return false;			
			
		},

		setModalScroll: function() {

			if ($('.modal.in').length) {
				$('body').addClass('modal-open');
			}
			else {
				$('body').removeClass('modal-open');
			}

		},
		
		// append primary action to secondary toolbar
		setPrimaryAction: function(settings) {
			
			var BU = Boutique.Utilities;
			var OS = Boutique.Settings;

			var action = '';
			var content = '';
			var title, icon;

			if ($.isPlainObject(settings)) { 

				title = settings.title || '';
				icon = settings.icon || 'plus-circle';
				if (settings.content) {
					content = settings.content;
				}
				else {
					content = '<i class="icon icon-' + icon + ' tt" title="' + OS.t(title) + '"></i>';
				}
				action += '<span class="primary-action">';
				action += content;
				action += '</span>';
				$('.menu-secondary span.primary-action').remove();
				$('.menu-secondary').removeClass('full').append(action);
				BU.initTooltips($('.menu-secondary'));
				if (typeof (settings.callback || undefined) === 'function') {
					$('.menu-secondary span.primary-action').off('click').on('click', function() {
						
						// first arg of .call is the function object itself, so any arguments required
						// need to be passed as the second or later argument
						settings.callback.call(undefined, this);
					
					});	
				}
			}
		},

		setStylesheet: function(o) {
			o = $(o);
			if (o.length) {
				
				o.attr('disabled', true);
				
				var BU = Boutique.Utilities;
				
				var ssid = 'ocms_colors_header_css';
				var ss = $('#' + ssid);
				var sscolor = $('#account_design_colors').val().replace(/#/g, '');
				var ssconvert = $('#account_design_convert').val();
				if (sscolor && (sscolor != DESIGN_COLOR || ssconvert != DESIGN_CONVERT)) {
					$('html').removeClass('invert contrast');
					var url = BASE_PATH + '/css/ocms_colors_app.php?color=' + sscolor + '&convert=' + ssconvert;
					if (document.all && !window.opera) {
						ss.onload = function() { BU.setStylesheetPostLoad(o, ssid) };
						ss.href = url;
					}
					else {
						var h = document.getElementsByTagName('head')[0];
						var s = document.createElement('link');
						s.type = 'text/css';
						s.href = url;
						s.id = ssid;
						s.rel = 'stylesheet';
						s.onload = function() { BU.setStylesheetPostLoad(o, ssid) };
						h.insertBefore(s, ss.nextSibling);
					}
				}
			}
		},

		setStylesheetPostLoad: function(o, ssid) {
			o = $(o);
			if (o.length && ssid) {
				$('#' + ssid + ':first').remove();
				o.attr('disabled', false);
			}
		},

		toggleBackgroundStyles: function(o) {
			var val, flds;
			/* In this case, o is the dialog object itself. This allows us to obtain the required prefix. */
			if (o) {
				// 20210409 - This was originally built for background images specifically. But as the functionality of this field expands, 
				// the selector may need to change to '.ocms-select-media-path' to make it more generic. 
				val = $(o.prefix + '_background_image').val();
				flds = o.dialog.find('.background-config');
				if (val === '') {
					flds.hide();
					/* reset other fields to default values */
					$(o.prefix + '_background_attachment').val('');
					$(o.prefix + '_background_position').val('');
					$(o.prefix + '_background_repeat').val('');
					$(o.prefix + '_background_size').val('');
					this.initSelectPicker(o.dialog);
				}
				else {
					flds.show();					
				}
			}		
		},
		
		toggleBorderStyles: function(o) {
			var val, flds;
			/* In this case, o is the dialog object itself. This allows us to obtain the required prefix. */
			if (o) {
				val = $(o.prefix + '_border_width').val();
				flds = o.dialog.find('.border-config');
				if (val === 'ocms-bw-0') {
					flds.hide();
					/* reset other fields to default values */
					$(o.prefix + '_border_color').val('');
					$(o.prefix + '_border_radius').val('');
					$(o.prefix + '_border_style').val('');
					this.initSelectPicker(o.dialog);
				}
				else {
					flds.show();
				}
			}		
		},
		
		timeouts: [],
		
		uid: function() {
			return ('00000' + (Math.random()*Math.pow(36,5) << 0).toString(36)).slice(-5);
		},

		uuid: function() {
			var oUUID = new UUID();
			var sUUID = oUUID.createUUID();
			sUUID = sUUID.replace(/-/g,'');	
			return sUUID;
		},

		// basic email validation, ref: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
		veryBasicEmailValidation: function(email){
		
			var re = /\S+@\S+\.\S+/;
			return re.test(email);
			
		},
		
	};

})();


; (function() {

	'use strict';
			
	// Add client side translation as required or pull down from server side to avoid redundancy
    Boutique.Settings.Translations = {};
	
    Boutique.Settings.t = function(text) {
        
        return (this.Translations[text] == undefined ? text : this.Translations[text]);
        
    };
    
})();

; (function() {

    'use strict';
            
	// handles messaging
	Boutique.Messages = {
		
		icons: {
			danger:			'icon-angry', 
			info:			'icon-smiley', 
			progress:		'icon-spinner3 icon-spin',
			success: 		'icon-happy', 
			validation:		'icon-angry', 
			warning: 		'icon-shocked'
		},
		
		id: '#ocms_message',
		class: 'ocms-message-',
		loc: 'body',
		type: 'progress',
		text: Boutique.Settings.t('messageWorking'),
		titles: {
			danger:			'The following errors occurred:', 
			info:			'', 
			progress:		'',
			success: 		'The following actions were successful:', 
			validation:		'The following validation errors occurred:', 
			warning: 		'The following warnings occurred:'
		},
		
		tohide: null,
		
		types: [
			'validation', 
			'danger', 
			'warning',
			'info', 
			'success', 
			'progress',
		],
		
		// builds and returns a message
		build: function(text, type) {

			var OM = Boutique.Messages;
			var icon, t, msg = '';

			text = text || OM.text;
			text = (Array.isArray(text)) ? text : [text];
			type = type || OM.type;
			icon = OM.icons[type] || OM.icons.progress;
			msg += '<div id="' + OM.id.replace(/#/, '') + '" class="status block-status ' + OM.class + type + '">';
				if (text.length > 1) {
					msg += (OM.titles[type]) ? '<p>' + OM.titles[type] + '</p>' : '';				
					msg += '<ul>';
						for (t in text) {
							msg += '<li><span class="text">' + text[t] + '</span></li>';	
						}
					msg += '</ul>';
				}
				else {
					msg += '<p><i class="icon ' + icon + '"></i>&nbsp; ' + text[0] + '</p>';				
				}
			msg += '</div>';

			return msg;
		},

		// wrapper function for danger messages
		danger: function(text, loc) { 

			var OM = Boutique.Messages;

			return OM.show(text, 'danger', loc); 

		},
		
		gettype: function(messages) {

			var OM = Boutique.Messages;
			var t, type, mtype;

			for (t in OM.types) {
				type = OM.types[t];
				mtype = (messages && messages[type]) ? messages[type] : false;
				if (mtype && mtype.length) {
					return type;
				}
			}
			return OM.types.pop();
		},
		
		// hides the message
		hide: function(loc, delay, success, failure) {
			
			var OM = Boutique.Messages;
			
			loc = loc || OM.loc;
			delay = delay || 0;
			clearTimeout(OM.tohide);
			if ($(loc).length) {
				OM.tohide = setTimeout(
					function() { 
						$(loc).unblock();
						//$.clog('calling Messages unblock() with delay: ' + delay);
						if (typeof (success || undefined) === 'function') {
							success.call();
						}
						else if (typeof (failure || undefined) === 'function') {
							failure.call();
						}
					}
				, delay);
			}
		},

		// wrapper function for informational messages
		info: function(text, loc) { 

			var OM = Boutique.Messages;

			return OM.show(text, 'info', loc); 

		},
		
		// wrapper function for progress messages
		progress: function(text, loc) { 

			var OM = Boutique.Messages;

			return OM.show(text, 'progress', loc); 

		},
		
		// displays a message
		response: function(data, status, xhr, loc, success, failure) {

			var OM = Boutique.Messages;
			var OV = Boutique.Validator;
			
			var code = 200;
			var delay = 2000;
			var type = 'success';
			var messages = '';
			var code, json, frm, m, messages, msg, text, delay, validate, e, errors;
			
			loc = (loc) ? loc : OM.loc;
			frm = $(loc).find('form');
			
			// Check against async responses first
			if (xhr && xhr.getResponseHeader('OCMS-Messages')) {
				data = xhr.getResponseHeader('OCMS-Messages');
			}
			// Check for sync responses next 
			else if ($('[name="ocms:message"]').length) {
				data = $('[name="ocms:message"]').attr('content');
			}
			if (trim(data)) { 
				try {
					json = JSON.parse(data);
					if (json['messages']) {
						messages = json['messages'];
						type = OM.gettype(messages);
						text = [];
						validate = (type === 'validation' && frm.length);
						if (validate) {
							$(loc).unblock();
							OV.clearErrors(frm);
							OV.displayErrors(messages['validation'][0], frm);
							return type;
						}
						else {
							for (m in messages[type]) {
								msg = messages[type][m]['text'];
								code = Math.max(code, parseInt(messages[type][m]['code']));
								text.push(msg);
							}
							// Check for csrf expiration status
							if (code === 409) {
								text = Boutique.Settings.t('messageReloadRequired');
								failure = function() {
									location.reload();
									return false;
								}
							}
							OM.show(text, type, loc);
						}
						if (type === 'danger' || type === 'warning') {
							delay = 5000;
							success = null;
						}
					}
				}
				catch(e) {}
			}
			OM.hide(loc, delay, success, failure);
			return type;
		},
		
		// displays a message
		show: function(text, type, loc) {


			var OM = Boutique.Messages;
			var opts, msg;

			text = text || OM.text;
			type = type || OM.type;
			OM.loc = loc || OM.loc;
			msg = OM.build(text, type);
			if ($(OM.id).length) {
				$(OM.id).replaceWith(msg);
				$('.blockUI.blockMsg').center();
			}
			else {
				opts = { 
					message: msg
				};
				$(loc).block(opts);
			}
			return true;
		},
		
		// wrapper function for success messages
		success: function(text, loc) { 

			var OM = Boutique.Messages;

			return OM.show(text, 'success', loc); 

		},
		
		// wrapper function for warning messages
		warning: function(text, loc) { 

			var OM = Boutique.Messages;

			return OM.show(text, 'warning', loc); 

		},

	};

})();



; (function() {

    'use strict';
            
    Boutique.Storage = {

        /**
         * Decrement an item's value (must be an Integer type)
         *
         * @param   object      os          Storage object
         * @param   string      key         String name of key
         * @access  private     
         * @since   1.0
         */
        _dec: function(os, key) {

            var obj, item;

            if (os && (os === this.Local || os === this.Session)) {
                obj = os.get(key);
                if (typeof obj == 'object' && obj.value) {
                    item = obj.value
                    if (parseInt(item) == item && typeof item != 'object') {
                        item = parseInt(item);
                        return os.set(key, (item - 1));
                    }
                    else {
                        console.error('Error: Value to be decremented [' + item + '] is not of Integer type');
                        return false;
                    }
                }
            }

        }, 

        /**
         * Delete one or all items in the local storage cache
         *
         * @param   object      os          Storage object
         * @param   string      key         Optional name of the key to be deleted. If no key is specified, all items will be deleted.
         * @return  mixed                   Returns true/false if key is present, otherwise null.
         * @access  private     
         * @since   1.0
         */
        _del: function(os, key) {

            var pairs, pair, i, k;

            if (os && (os == this.Local || os == this.Session)) {

                // Delete all items
                if (typeof key === 'undefined') {
                    if (!os.supported) {
                        try {
                            pairs = document.cookie.split(';');
                            for (i = 0; i < pairs.length; i++) {
                                pair = pairs[i].split('=');
                                k = pair[0];
                                $.cookie(k, null);
                            }
                        }
                        catch(e) {
                            return null;
                        }
                    }
                    else {
                        os.cache.clear();
                    }
                }
                // Delete a specific item
                else {
                    if (!os.supported) {
                        try {
                            $.cookie(key, null);
                            return true;
                        }
                        catch(e) {
                            return false;
                        }
                    }
                    os.cache.removeItem(key);
                    return true;
                }
            }
        }, 

        /**
         * Get one or all items in the local storage cache
         *
         * @param   object      os          Storage object
         * @param   string      key         Optional name of the key whose value will be retrieved. If no key is specified, all keys will be returned.
         * @return  mixed                   Returns the value of a specific item or an array of all items.
         * @access  private     
         * @since   1.0
         */
        _get: function(os, key) {

            var items = [];
            var item, pairs, pair, i, j, k;

            if (os && (os === this.Local || os === this.Session)) {
                // Get all items
                if (typeof key === 'undefined') {
                    if (!os.supported) {
                        try {
                            pairs = document.cookie.split(';');
                            for (i = 0; i < pairs.length; i++) {
                                pair = pairs[i].split('=');
                                k = pair[0];
                                items.push({k:k, value:os.rtn($.cookie(k))});
                            }
                        }
                        catch(e) {
                            return null;
                        }
                    }
                    else {
                        for (j in os.cache) {
                            if (j.length) {
                                items.push({k:j, value:os.rtn(os.cache.getItem(j))});
                            }
                        }
                    }
                    return items;
                }
                // Get specific item
                else {
                    if (!os.supported) {
                        try {
                            return os.rtn($.cookie(key));
                        }
                        catch(e) {
                            return null;
                        }
                    }
                    item = os.cache.getItem(key);
                    return os.rtn(item);
                }
            }
        }, 

        /**
         * Retrieve data from either local/session storage or hidden UI element based on name provided
         *
         *
         * @param   object      os          Storage object
         * @param   string      key         Name of the object to be located in storage or the page elements
         * @return  object                  Returns a data object
         * @access  private     
         * @since   1.0
         */
        _getData: function(os, key) {

            var BU = Boutique.Utilities;
            var exp, obj, val = '';

            if (os && (os === this.Local || os === this.Session)) {
                if (key && key != '') {
                    if (os.cache) {
                        obj = os.get(key);
                        if (obj && obj.hasOwnProperty('value') && obj.hasOwnProperty('expires')) {
                            // 20230430 - Check if value is JSON object (stringified) and convert to object if so. Return other types directly.
                            val = (BU.isJSON(obj.value)) ? os.rtn(obj.value) : obj.value;
                            exp = obj.expires;
                        }
                    }
                    else {
                        obj = $('#' + key);
                        if (obj.length && obj.not(':empty')) {
                            val = os.rtn(obj.text());
                            exp = obj.attr('data-expires');
                        }
                    }
                    if (exp && parseInt(exp) < Date.now()) {
                        val = '';
                    }
                }
            }

            return val;

        },
    
        /**
         * Increment an item's value (*must be an integer type)
         *
         * @param   object      os          Storage object
         * @param   string      key         String name of key
         * @access  private     
         * @since   1.0
         */
        _inc: function(os, key) {

            var obj, item;

            if (os && (os === this.Local || os === this.Session)) {
                obj = os.get(key);
                if (obj && obj.hasOwnProperty('value')) {
                    item = obj.value
                    if (parseInt(item) == item && typeof item != 'object') {
                        item = parseInt(item);
                        return os.set(key, (item + 1));
                    }
                    else {
                        console.error('Error: Value to be incremented [' + item + '] is not of Integer type');
                        return false;
                    }
                }
            }
        },

        /**
         * Initialize this object
         *
         * @param   object      os          Storage object
         * @access  private     
         * @since   1.0
         */
        _init: function(os) {

            if (os) {
                if (os === this.Local && this._supported(os)) {
                    os.cache = window.localStorage;
                }
                else if (os === this.Session && this._supported(os)) {
                    os.cache = window.sessionStorage;
                }
            }
        },

        /**
         * Prepare value for storage
         *
         * @param   object      os          Storage object
         * @param   mixed 	    val         Data to be stored
         * @return  string                  Returns a data object
         * @access  private     
         * @since   1.0
         */
        _prepIn: function(os, val) {

            if (os && (os === this.Local || os === this.Session)) {
                // Convert to String
                while (typeof val !== 'string') {
                    val = JSON.stringify(val);
                }
            }

            return val;

        },
    
        /**
         * Prepare value for retrieval
         *
         * @param   object      os          Storage object
         * @param   string      val         Data to be retrieved
         * @return  object                  Returns a data object
         * @access  private     
         * @since   1.0
         */
        _prepOut: function(os, val) {

            if (os && (os === this.Local || os === this.Session)) {
                // Convert to object
                while (typeof val !== 'object') {
                    val = JSON.parse(val);
                }
            }

            return val;

        },
    
        /**
         * Parse value and return the appropriate datatype/value
         *
         * @param   object      os          Storage object
         * @param   string      val     	String results to be parsed
         * @return  mixed                   Returns the resulting value after parsing
         * @access  private     
         * @since   1.0
         */
        _rtn: function(os, val) {

            var valOrig = val;

            if (os && (os === this.Local || os === this.Session)) {
                try {
                    val = os.prepOut(val);
                    if (typeof val == 'undefined') {
                        val = valOrig;
                    }
                    if (val == 'true') {
                        val = true;
                    }
                    if (val == 'false') {
                        val = false;
                    }
                    if (parseFloat(val) == val && typeof val != 'object') {
                        val = parseFloat(val);
                    }
                }
                catch(e) {
                    val = valOrig;
                }
            }
            return val;
        },

        /**
         * Set a value on a specific key
         *
         * @param   object      os          Storage object
         * @param   string      key         String name of key
         * @param   string      val         String value to be assigned
         * @param   int         ttl         Time to live in minutes
         * @return  mixed                   Returns the resulting value after assignment
         * @access  private     
         * @since   1.0
         */
        _set: function(os, key, val, ttl) {
            if (os && (os === this.Local || os === this.Session)) {
                if (!os.supported) {
                    try {
                        $.cookie(key, val, { path: '/', expires: ttl });
                        return val;
                    }
                    catch(e) {
                        console.error(OM.t('messageLocalStorageNotSupported') + ' Error: ' + e);
                    }
                }
                // Store value with expiration
                os.cache.setItem(key, os.prepIn({ created: new Date().toLocaleString(), expires: ttl.getTime(), value: val }));
                // Return only the value (stringified)
                return os.rtn(os.prepIn(val));
            }
        },

        /**
         * Save data to either local/session storage or hidden UI element based on name provided
         *
         *
         * @param   object      os          Storage object
         * @param   string      key         Name of the object to be located in storage or the page elements
         * @param   string      val         Data to be stored
         * @param   int         ttl         Time to live in minutes
         * @return  object                  Returns a data object
         * @access  private     
         * @since   1.0
         */
        _setData: function(os, key, val, ttl) {

            if (os && (os === this.Local || os === this.Session)) {
                if (key && key != '') {
                    // Convert ttl to a valid Date object
                    ttl = os.setExpire(ttl);
                    // If local storage supported, there is no need to Stringify as it's done when calling Set
                    if (os.cache) {
                        val = os.set(key, val, ttl);
                    }
                    // If local storage not supported then we need to Stringify prior to placing in DOM and passing to Rtn
                    else {
                        val = os.prepIn(val);
                        $('footer').append('<div id="' + key + '" data-expires="' + ttl.getTime() + '" class="hidden">' + val + '</div>');
                        val = os.rtn(val);
                    }
                }
                else {
                    console.error('Boutique.Storage.setData() failed because key was missing or invalid!');
                }
            }

            return val;

        },
    
        /**
         * Convert ttl integer value into Date object and set expiration
         *
         * @param   object      os          Storage object
         * @param   int         ttl         Time to live in minutes
         * @return  object                  Returns a date object
         * @access  private     
         * @since   1.0
         */
         _setExpire: function(os, ttl) {

            var expires = new Date();

            if (os && (os === this.Local || os === this.Session)) {
                
                ttl = parseInt(ttl);
                ttl = (ttl > 0) ? ttl : 525600; // One year in minutes - default expiration value
                ttl *= 60 * 1000; // convert to milliseconds
                expires.setTime(expires.getTime() + ttl);

                return expires;
            }

            return null;

        },
    
        /**
         * Determine if various storage types are supported
         *
         * @url     https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
         *
         * @param   object      os          Storage object
         * @return  mixed                   Returns true if supported or a DOMException object if not
         * @access  private     
         * @since   1.0
         */
        _supported: function(os) {
            var x, type, storage;
            if (os) {
                type = (os === this.Local) ? 'localStorage' : ((os === this.Session) ? 'sessionStorage' : null);
                try {
                    x = '__storage_test__';
                    storage = window[type];
                    storage.setItem(x, x);
                    storage.removeItem(x);
                    // Additional check for JSON support before signing off
                    if (typeof window.JSON == 'undefined') {
                        os.supported = false;
                    }
                    else if (os._enabled) {
                        os.supported = true;
                    }
                    return os.supported;
                }
                catch(e) {
                    return e instanceof DOMException && os._enabled && (
                        // Everything except Firefox
                        e.code === 22 || 
                        // Firefox
                        e.code === 1014 || 
                        // Test name field too, because code might not be present (all but Firefox)
                        e.name === 'QuotaExceededError' || 
                        // Firefox
                        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && 
                        // Acknowledge QuotaExceededError only if there's something already stored
                        storage.length !== 0
                    ;
                }
            }
        },

        /**
         * Local Storage Object
         *
         * @return  object                  Returns an Boutique.Storage.Local object and methods
         * @access  public     
         * @since   1.0
         */
        Local: {

            /**
             * Enabled - Used to forcibly disable local or session storage so only DOM storage is used.
             *
             * @var     boolean
             * @access  private     
             * @since   1.0
             */
            _enabled: true,

            /**
             * Cache - Holds data for future additions/modifications/retrieval.
             *
             * @var     mixed
             * @access  public     
             * @since   1.0
             */
            cache: null,

            /**
             * Supported - Dynamically determined based on support criteria provided by the client.
             *
             * @var     boolean
             * @access  public     
             * @since   1.0
             */
            supported: false,

            dec: 		function(key) 		        { return Boutique.Storage._dec(this, key); },
            del: 		function(key) 		        { return Boutique.Storage._del(this, key); },
            get: 		function(key) 		        { return Boutique.Storage._get(this, key); },
            getData: 	function(key) 		        { return Boutique.Storage._getData(this, key); },
            inc: 		function(key) 		        { return Boutique.Storage._inc(this, key); },
            init: 		function() 			        { return Boutique.Storage._init(this); },
            prepIn: 	function(val, ttl) 	        { return Boutique.Storage._prepIn(this, val, ttl); },
            prepOut: 	function(val) 		        { return Boutique.Storage._prepOut(this, val); },
            rtn: 		function(res) 		        { return Boutique.Storage._rtn(this, res); },
            set: 		function(key, val, ttl) 	{ return Boutique.Storage._set(this, key, val, ttl); },
            setData: 	function(key, val, ttl) 	{ return Boutique.Storage._setData(this, key, val, ttl); },
            setExpire:  function(ttl) 		        { return Boutique.Storage._setExpire(this, ttl); },

        },

        /**
         * Session Storage Object
         *
         * @return  object                  Returns an Boutique.Storage.Session object and methods
         * @access  public     
         * @since   1.0
         */
        Session: {

            /**
             * Enabled - Used to forcibly disable local or session storage so only DOM storage is used.
             *
             * @var     boolean
             * @access  private     
             * @since   1.0
             */
            _enabled: true,

            /**
             * Cache - Holds data for future additions/modifications/retrieval.
             *
             * @var     mixed
             * @access  public     
             * @since   1.0
             */
            cache: null,

            /**
             * Supported - Dynamically determined based on support criteria provided by the client.
             *
             * @var     boolean
             * @access  public     
             * @since   1.0
             */
            supported: false,

            dec: 		function(key) 		        { return Boutique.Storage._dec(this, key); },
            del: 		function(key) 		        { return Boutique.Storage._del(this, key); },
            get: 		function(key) 		        { return Boutique.Storage._get(this, key); },
            getData: 	function(key) 		        { return Boutique.Storage._getData(this, key); },
            inc: 		function(key) 		        { return Boutique.Storage._inc(this, key); },
            init: 		function() 			        { return Boutique.Storage._init(this); },
            prepIn: 	function(val, ttl)	        { return Boutique.Storage._prepIn(this, val, ttl); },
            prepOut: 	function(val) 		        { return Boutique.Storage._prepOut(this, val); },
            rtn: 		function(res) 		        { return Boutique.Storage._rtn(this, res); },
            set: 		function(key, val, ttl)	    { return Boutique.Storage._set(this, key, val, ttl); },
            setData: 	function(key, val, ttl) 	{ return Boutique.Storage._setData(this, key, val, ttl); },
            setExpire:  function(ttl) 		        { return Boutique.Storage._setExpire(this, ttl); },
            
        },

    };

    $(function(){
        Boutique.Storage.Local.init();
        Boutique.Storage.Session.init();
    });

})();



; (function() {

    'use strict';
            
	/**
	 * Form field validator
	 *
	 * @package		Boutique
	 * @author		Jeff Todnem
	 * @since 		5.0  
	 */ 
	Boutique.Validator = {

		_arguments 			: {},
		_data 				: null,
		_errors 			: {},
		_errorsToMessage 	: true,
		_fields 			: {},
		_filters 			: {},
		_form				: null,
		_functions 			: {},
		_icons: {
			danger			: 'icon-angry', 
			info			: 'icon-smiley', 
			progress		: 'icon-spinner3 icon-spin',
			success			: 'icon-happy', 
			validation		: 'icon-angry', 
			warning			: 'icon-shocked'
		},
		_ifSet	  			: false,
		_ifNotSet  			: false,
		_messages 			: {},
		_objectName			: 'Boutique.Validator',
		_rules 				: {},
		_validData 			: {},
		
		/**
		 * Parses a form for any data-validate attributes and auto-magically creates
		 * validation rules based on JSON values if present.
		 *
		 * @uses	phpjs.custom.js - is_bool()
		 * @uses	phpjs.custom.js - is_string()
		 *
		 * @param 	object			ov						An object of this type
		 * @return 	object									Returns an object of this type
		 * @since 	5.0
		 */
		_auto: function(ov) {
			ov = ov || this;
			var flds, cnt;
			if (this._form) {
				cnt = 0;
				flds = this._form.find('[data-validate]');
				flds.each(function() {
					var label, rules;
					var fld = $(this);
					var name = fld.attr('name');
					var rules, r, args;
					/* Check for inline field data-label attr first, then default to form-group label */
					if (fld.data('label')) {
						label = fld.data('label');
					}
					else {
						label = fld.closest('.form-group, .form-group-inline').find('label').text();
					}
					if (name) { // Only process elements with a name attribute
						rules = JSON.parse(fld.attr('data-validate'));
						for (r in rules) {
							if (typeof (ov[r] || undefined) === 'function') {
								args = rules[r];
								args = (is_bool(args)) ? [] : ((Array.isArray(args)) ? args : ((is_string(args) || is_numeric(args)) ? [args] : null));
								ov[r].apply(ov, args);
							}
							else {
								$.clog(ov._objectName + ' encountered an invalid rule declaration: [' + r + ']', 'danger'); 	
							}
						}
						ov.validate(name, label);
						cnt++;
					}
				});
				$.clog(this._objectName + ' set up rules for [' + cnt + '] items successfully.');
				this.displayErrors();
			}
			return this;
		},

		/**
		 * Recursively apply filters to a value
		 *
		 * @param 	mixed 				val 				Reference
		 * @return 	void
		 * @since 	5.0
		 */
		_applyFilter: function(val) {
			if ($.isPlainObject(val) || Array.isArray(val)) {
				for (v in val) {
					this._applyFilter(val[v]);
				}
			}
			else {
				for (f in this._filters) {
					val = filters[f](val);
				}
			}
		},

		/**
		 * Applies filters based on a data key
		 *
		 * @param 	string 				key
		 * @return 	void
		 * @since 	5.0
		 */
		_applyFilters: function(key) {
			this._applyFilter(this._data[key]);
		},

		/**
		 * Get a default date formatting string if no other format is requested
		 *
		 * @return 	string
		 * @since 	5.0
		 */
		_getDefaultDateFormat: function() {
			return DATETIME_FORMAT_YMDHIS;
		},

		/**
		 * Get default error message.
		 *
		 * @uses	phpjs.custom.js - sprintf
		 *
		 * @param 	string 				rule
		 * @param 	array 				args
		 * @return 	string
		 * @since 	5.0
		 */
		_getDefaultMessage: function(rule, args) {
			args = args || null;
			
			var OS = Boutique.Settings;
			var message = '';
			
			switch(rule) {
				
				case 'lengthBetween':
					message = sprintf(this._getTranslation(rule), '%s', args[0], args[1], (args[2] || this._getTranslation('symbols')));
					break;

				case 'matchesField':
				case 'matchesNotField':
					message = sprintf(this._getTranslation(rule), '%s', args[1]);
					break;

				case 'numBetween':
					message = sprintf(this._getTranslation(rule), '%s', args[0], args[1], ((args[2] === false) ? ' ' + this._getTranslation('withoutLimits') : ''));
					break;

				case 'numMax':
				case 'numMin':
					message = sprintf(this._getTranslation(rule), '%s', ((args[1]) ? ' ' + this._getTranslation('orEqualTo') : ''), args[0]);
					break;

				case 'fieldIn':
					message = sprintf(this._getTranslation(rule), '%s', args[0].toString().split(/\s*,\s*/));
					break;

				case 'length':
				case 'lengthMax':
				case 'lengthMin':
					message = sprintf(this._getTranslation(rule), '%s', args[0], (args[1] || this._getTranslation('symbols')));
					break;

				case 'dateFormat':
				case 'dateMax':
				case 'dateMin':
				case 'endsWith':
				case 'endsNotWith':
				case 'equals':
				case 'equalsNot':
				case 'matchesRegExp':
				case 'startsWith':
				case 'startsNotWith':
					message = sprintf(this._getTranslation(rule), '%s', args[0]);
					break;

				case 'alphaNum':
				case 'ccNum':
				case 'date':
				case 'digits':
				case 'email':
				case 'float':
				case 'integer':
				case 'ip':
				case 'required':
				case 'url':
					message = this._getTranslation(rule);
					break;

				default:
					message = this._getTranslation('default');
					break;
			}
			return message;
		},

		/**
		 * Get translated error message.
		 *
		 * @param 	string 				rule
		 * @return 	string
		 * @since 	5.0
		 */
		_getTranslation: function(rule) {
			var OS = Boutique.Settings;
			return OS.t('validate' + ucfirst(rule));
		},
		
		/**
		 * Retrieve values from numeric and associative multi-dimensional arrays.
		 *
		 * @param 	string 				key
		 * @return 	mixed
		 * @since 	5.0
		 */
		_getVal: function(key) {
			// handle multi-dimensional arrays
			if (key.indexOf('.') > -1) {
				arrData = null;
				keys = key.split('.');
				keyLen = keys.length;
				for (i = 0; i < keyLen; ++i) {
					if (trim(keys[i]) == '') {
						return false;
					}
					else {
						if (arrData === null) {
							if (!$.isset(this._data[keys[i]])) {
								return false;
							}
							arrData = this._data[keys[i]];
						}
						else {
							if (!$.isset(arrData[keys[i]])) {
								return false;
							}
							arrData = arrData[keys[i]];
						}
					}
				}
				return arrData;
			}
			else {
				return ($.isset(this._data[key])) ? this._data[key] : false;
			}
		},

		/**
		 * Register error.
		 *
		 * @uses	phpjs.custom.js - sprintf()
		 *
		 * @param 	string 				rule
		 * @param 	string 				key
		 * @param 	string 				message			Validation results message
		 * @return 	void
		 * @since 	5.0
		 */
		_registerError: function(rule, key, message) {
			rule = rule || 'default';
			message = message || null;
			if (!message) {
				message = this._messages[rule];
			}
			message = sprintf(message, this._fields[key]);
			this._errors[key] = message;
		},

		/**
		 * Reset rules and filters
		 *
		 * @return 	void
		 * @since 	5.0
		 */
		_reset: function() {
			this._ifSet = false;
			this._ifNotSet = false;
			this._rules = {};
			this._filters = {};
		},

		/**
		 * Add or remove a name attribute to one or more fields based on a selector.
		 *
		 * Allows field names and values to be captured for validation purposes only.
		 * For obvious security reasons, all name attributes must be removed prior to 
		 * any form submissions since the only reason they are absent to begin with is
		 * to prevent the data in those fields from transmitting over an unsecure
		 * network.
		 * 
		 * @param 	boolean				add					Whether to add (true) or remove (false) the name attribute
		 * @param 	string				nameAttr			The attribute selector whose value will be used to assign a name to each selected :input fields. 
		 * @return 	void
		 * @since 	5.0
		 */
		_setName: function(add, nameAttr) {
			add = add || false;
			nameAttr = nameAttr || false;
			if (this._form && nameAttr) {
				this._form.find(':input[' + nameAttr + ']').each(function() {
					$(this).removeAttr('name');
					if (add) {
						$(this).attr('name', $(this).attr(nameAttr))
						;
					}
				});
			}
		},

		/**
		 * Recursively validates a value
		 *
		 * @param 	string 				key
		 * @param 	mixed 				val
		 * @return 	bool
		 * @since 	5.0
		 */
		_validate: function(key, val, recursive) {
			recursive = recursive || false;
			var v, r, fnc, args, valid;
			if (recursive && ($.isPlainObject(val) || Array.isArray(val))) {
				// run validations on each element of the array
				for (v in val) {
					if (!this._validate(key, val[v], recursive)) {
						// halt validation for this value.
						return false;
					}
				}
				return true;
			}
			else {
				// try each rule function
				for (r in this._rules) {
					if (this._rules[r]) {
						fnc = this._functions[r];
						args = this._arguments[r]; // Arguments of rule
						valid = (!args) ? fnc(key, val) : fnc(key, val, args);
						if (valid === false) {
							this._registerError(r, key);
							this._reset();
							return false;
						}
					}
				}
				this._validData[key] = val;
				return true;
			}
		},

		/**
		 * Field must contain only letters and numbers
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this type
		 * @since 	5.0
		 */
		alphaNum: function(message) {
			message = message || null;
			this.setRule('alphaNum', function(key, val) {
				return (!val.toString().match(/[^a-z0-9]/i));
			}, message);
			return this;
		},

		/**
		 * Constructor
		 * 
		 * Define values to validate.
		 *
		 * @param 	object|string		frm					jQuery form object or selector string for a form
		 * @return 	object									Returns an object of this type
		 * @since 	5.0
		 */
		build: function(frm, auto) {
			frm = $(frm).closest('form');
			auto = $.isset(auto) || true;
			var data;
			var msg = this._objectName + ' object created ';
			if (frm.length) {
				this._form = frm;
				data = this._form.cerealizeArray();
				this.setData(data);
				if (auto) {
					this._auto(this);
					msg += 'and auto-validated ';
				}
			}
			//$.clog(msg + 'successfully!', 'success');
			return this;
		},

		/**
		 * Callback method
		 *
		 * @uses 	phpjs.custom.js - array_merge
		 *
		 * @param   string  			name
		 * @param   mixed   			function
		 * @param   mixed   			params
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		callback: function(callback, message, params) {
			message = message || '';
			params = params || [];
			
			var OU = Boutique.Utilities;
			
			if (typeof (callback || undefined) === 'function') {
				// needs a unique name to avoid collisions in the rules array
				name = 'callback_' + BU.uid();
				this.setRule(
					name, 
					function(key, value) { 
						// Creates merged arguments array with validation target as first argument
						args = array_merge([value], ((Array.isArray(params)) ? params : [params]));
						return callback.call(this, args);
					}, 
					message, 
					params
				);

			}
			else {
				$.clog(callback + ' is not callable!', 'danger');
			}

			return this;
		},

		/**
		 * Field has to be a valid credit card number format.
		 *
		 * @param 	string 				message			Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		ccNum: function(message) { 
			message = message || null;
			this.setRule('ccNum', function(key, val) {
				
				var length, sum, weight, i, digit, mod;
				
				val = val.toString();
				val = val.replace(/\s+/g, '');
				length = val.length;

				if (length < 13 || length > 19) {
					return false;
				}

				sum = 0;
				weight = 2;

				for (i = length - 2; i >= 0; i--) {
					digit = weight * val[i];
					sum += Math.floor(digit / 10) + digit % 10;
					weight = weight % 2 + 1;
				}

				mod = (10 - sum % 10) % 10;

				return (mod == val[length - 1]);
			}, message);
			return this;
		},

		/**
		 * Clear all validation error messages
		 *
		 * @param 	object|string		frm					jQuery form object or selector string for a form (optional)
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		clearErrors: function(frm) { 
			frm = frm || this._form;
			frm = $(frm).closest('form');
			if (frm.length) {
				frm.find('.segmented-control button[data-navigate]').removeClass('has-error-ocms');
				frm.find('.form-control-feedback-block').remove();
			}
			this._reset();
			return this;
		},

		/**
		 * Field has to be a valid date.
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		date: function(message) { 
			message = message || null;
			this.setRule('date', function(key, val) {
				var OV = Boutique.Validator;
				return OV.isDate(val);
			}, message);
			return this;
		},

		/**
		 * Field has to have a value that matches the specified datetime string format.
		 *
		 * @param 	string 				format				Date-compatible formatting string
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		dateFormat: function(format, message) { 
			format = format || this._getDefaultDateFormat();
			message = message || null;
			this.setRule('dateFormat', function(key, val) {
				var df = new DateFormatter();
				return df.formatDate(val, format);
			}, message, [format]);
			return this;
		},

		/**
		 * Field has to be a date earlier than or equal to X.
		 *
		 * @param 	string|int	 		date 				Date used for limit comparison
		 * @param 	string 				format				Date-compatible formatting string
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		dateMax: function(date, format, message) { 
			date = date || null;
			format = format || this._getDefaultDateFormat();
			message = message || null;
			date = new Date(date);
			var df = new DateFormatter();
			date = df.formatDate(date, format);
			this.setRule('dateMax', function(key, val, args) {
				var maxDate, currDate;
				var OV = Boutique.Validator;
				if (OV.isDate(val)) {
					currDate = new Date(val);
					maxDate = new Date(args[0]);
					return (maxDate >= currDate);
				}
				return false;
			}, message, [date, format]);			
			return this;
		},

		/**
		 * Field has to be a date later than or equal to X.
		 *
		 * @param 	string|int	 		date 				Date used for limit comparison
		 * @param 	string 				format				Date-compatible formatting string
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		dateMin: function(date, format, message) { 
			date = date || null;
			format = format || this._getDefaultDateFormat();
			message = message || null;
			date = new Date(date);
			var df = new DateFormatter();
			date = df.formatDate(date, format);
			this.setRule('dateMin', function(key, val, args) {
				var minDate, currDate;
				var OV = Boutique.Validator;
				if (OV.isDate(val)) {
					currDate = new Date(val);
					minDate = new Date(args[0]);
					return (minDate <= currDate);
				}
				return false;
			}, message, [date, format]);			
			return this;
		},

		/**
		 * Every character in field, if completed, must be a digit.
		 * This is just like integer(), except there is no upper limit.
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		digits: function(message) { 
			message = message || null;
			this.setRule('digits', function(key, val) {
				val = val.toString();
				return (val.length === 0 || val.match(/^[0-9]+$/));
			}, message);
			return this;
		},

		/**
		 * Display validation error messages (an alternative to displayFeedback)
		 *
		 * @uses	phpjs.custom.js - in_array()
		 *
		 * @param 	object				errors				jQuery form object or selector string for a form (optional)
		 * @param 	object|string		frm					jQuery form object or selector string for a form (optional)
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		displayErrors: function(errors, frm) { 
			errors = errors || this.getAllErrors();
			frm = frm || this._form;
			frm = $(frm).closest('form');
			var err, e, errors, fld, frmgrp, msg, s, seg, segId, segBtn;
			var errsegs = [];
			var errorsLen = this.getObjectSize(errors);
			if (frm.length) {
				frm.find('.segmented-control button[data-navigate]').removeClass('has-error-ocms');
				frm.find('.form-control-feedback-block').remove();
				if (errorsLen) {
					$.clog('Validation encountered errors with the following fields:', 'warning');
					for (e in errors) {
						fld = frm.find('[name="' + e + '"]');
						if (fld.length === 0) {
							fld = frm.find('[data-name="' + e + '"]');
						}
						if (fld.length) {
							$.clog('    * ' + e, 'warning');
							seg = fld.parents('.segment');
							frmgrp = fld.closest('.form-group, .form-group-inline');
							msg = '';
							msg += '<div class="form-control-feedback-block status ocms-message-danger">';
							msg += '<a data-focus="' + e + '">' + errors[e] + '</a>';
							msg += '</div>';
							frmgrp.children('div[class*="col-"]').append(msg);
							if (fld.parents('.segment').parents(frm).length) {
								segId = fld.parents('.segment').attr('id');
								if (!in_array(segId, errsegs)) {
									errsegs.push(segId);
								}
							}
						}
					}
					frm.find('.form-control-feedback-block a').each(function() {
						$(this).off('click').on('click', function() {
							$(this).closest('form').find('[name="' + $(this).attr('data-focus') +'"]').trigger('focus') ;
						});
					});
					/* Check for segment presence and switch to first segment with error */
					for (s in errsegs) {
						frm.find('.segmented-control button[data-navigate="' + errsegs[s] + '"]').addClass('has-error-ocms');
					}
					frm.find('.segmented-control button[data-navigate="' + errsegs[0] + '"]').trigger('click');
					frm.find('.form-control-feedback-block').animate({height:'show', opacity:1});
				}
			}
			return this;
		},

		/**
		 * Display validation feedback messages
		 *
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		displayFeedback: function() { 
			var err, errors;
			if (this._form) {
				this._form.find('.form-control-feedback, .form-control-feedback-block').remove();
				this._form.find('.has-error').removeClass('has-error has-feedback');
				errors = this.getAllErrors();
				for (e in errors) {
					fld = this._form.find(':input[name="' + e +'"]');
					frmgrp = fld.closest('.form-group');
					frmgrp.addClass('has-error has-feedback');
					fld.closest('div').append('<div class="form-control-feedback-block">' + errors[e] + '</div>');
					fld.closest('div').append('<i class="form-control-feedback icon ' + this._icons.danger + '"></i>');
				}
			}
			return this;
		},

		/**
		 * Field, if completed, has to be a valid email address.
		 *
		 * @uses	phpjs.custom.js - strrpos
		 *
		 * @param 	string 				message			Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		email: function(message) { 
			message = message || null;
			this.setRule('email', function(key, val) {
				var isValid, atIndex, domain, local, localLen, domainLen;
				val = trim(val);
				if (val.length == 0) {
					return true;
				}
				isValid = true;
				atIndex = strrpos(val, '@');
				if (atIndex === false) {
					isValid = false;
				}
				else {
					domain = val.substr(atIndex+1);
					local = val.substr(0, atIndex);
					localLen = local.length;
					domainLen = domain.length;
					if (localLen < 1 || localLen > 64) {
						isValid = false;
					}
					else if (domainLen < 1 || domainLen > 255) {
						// domain part length exceeded
						isValid = false;
					}
					else if (local[0] == '.' || local[localLen-1] == '.') {
						// local part starts or ends with '.'
						isValid = false;
					}
					else if (local.match(/\.\./)) {
						// local part has two consecutive dots
						isValid = false;
					}
					else if (!domain.match(/^[A-Za-z0-9\-\.]+/)) {
						// character not valid in domain part
						isValid = false;
					}
					else if (domain.match(/\.\./)) {
						// domain part has two consecutive dots
						isValid = false;
					}
					else if (!local.replace(/\\/g, '').match(/^(\\.|[A-Za-z0-9!#%&`_=\/\'*+?^{}|~.-])+/)) {
						// character not valid in local part unless
						// local part is quoted
						if (!local.replace(/\\\\/g, '').match(/^"(\\\\"|[^"])+"/)) {
							isValid = false;
						}
					}
				}
				return isValid;
			}, message);
			return this;
		},

		/**
		 * Field must not end with a specific substring.
		 *
		 * @param 	string 				subst
		 * @param 	string 				message			Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		endsNotWith: function(subst, message) { 
			message = message || null;
			this.setRule('endsNotWith', function(key, val, args) {
				val = trim(val);
				subst = args[0];
				return (val.length === 0 || val.substr(-subst.length) !== subst);
			}, message, [subst]);
			return this;
		},

		/**
		 * Field must end with a specific substring.
		 *
		 * @param 	string 				subst
		 * @param 	string 				message			Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		endsWith: function(subst, message) { 
			message = message || null;
			this.setRule('endsWith', function(key, val, args) {
				val = trim(val);
				subst = args[0];
				return (val.length === 0 || val.substr(-subst.length) === subst);
			}, message, [subst]);
			return this;
		},

		/**
		 * Field value matches the pre-assigned value in the rule
		 *
		 * @param 	string 				value
		 * @param 	string 				label
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		equals: function(value, label, message) { 
			label = label || '';
			message = message || null;
			this.setRule('equals', function(key, val, args) {
				val = trim(val);
				return (args[0].toString() === val);
			}, message, [value, label]);
			return this;
		},

		/**
		 * Field value does not match the pre-assigned value in the rule
		 *
		 * @param 	string 				value
		 * @param 	string 				label
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		equalsNot: function(value, label, message) {
			label = label || '';
			message = message || null;
			this.setRule('equalsNot', function(key, val, args) {
				val = trim(val);
				return (args[0].toString() !== val);
			}, message, [value, label]);
			return this;
		},

		/**
		 * Field has to be one of the allowed ones.
		 *
		 * @uses	phpjs.custom.js - in_array
		 * @uses	phpjs.custom.js - is_string
		 *
		 * @param 	string|array 		allowed 			Allowed values.
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		fieldIn: function(allowed, message) { 
			message = message || null;
			if (is_string(allowed)) {
				allowed = allowed.split(/\s*,\s*/);
			}
			this.setRule('fieldIn', function(key, val, args) {
				return in_array(val, args[0]);
			}, message, [allowed]);
			return this;
		},

		/**
		 * Add a filter callback for the data
		 *
		 * @param 	mixed 				callback
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		filter: function(callback) {
			if (typeof (callback || undefined) === 'function') {
				this._filters.push(callback);
			}
			return this;
		},

		/**
		 * Field must contain a valid float value.
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		float: function(message) { 
			message = message || null;
			this.setRule('float', function(key, val) {
				var OV = Boutique.Validator;
				return OV.isFloat(val);
			}, message);
			return this;
		},

		/**
		 * Get all errors.
		 *
		 * @uses	phpjs.custom.js - array_values
		 *
		 * @return 	array
		 * @since 	5.0
		 */
		getAllErrors: function(keys) {
			keys = $.isset(keys) || true;
			return (keys == true) ? this._errors : array_values(this._errors);
		},

		/**
		 * Get specific error.
		 *
		 * @param 	string 				field
		 * @return 	string
		 * @since 	5.0
		 */
		getError: function(field) {
			return this._errors[field];
		},

		/**
		 * Gets the length of an associative array or object with properties
		 *
		 * @return 	int
		 * @since 	5.0
		 */
		getObjectSize: function(obj) {
			var size = 0, key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					size++;
				}
			}
			return size;
		},

		/**
		 * Get valid data
		 *
		 * @return 	array
		 * @since 	5.0
		 */
		getValidData: function() {
			return this._validData;
		},

		/**
		 * Whether errors have been found.
		 *
		 * @return 	bool
		 * @since 	5.0
		 */
		hasErrors: function() {
			return (this.getObjectSize(this._errors) > 0);
		},

		/**
		 * Enable validation only if a value is not present in one or more fields
		 * 
		 * @uses	phpjs.custom.js - is_string()
		 *
		 * @param 	array|string 		flds
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		ifNotSet: function(flds) {
			this._ifNotSet = (Array.isArray(flds)) ? flds : ((is_string(flds)) ? flds.split(/\s*,\s*/) : true);
			return this;
		},

		/**
		 * Enable validation only if a value is present in one or more fields
		 * 
		 * @uses	phpjs.custom.js - is_string()
		 *
		 * @param 	array|string 		flds
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		ifSet: function(flds) {
			this._ifSet = (Array.isArray(flds)) ? flds : ((is_string(flds)) ? flds.split(/\s*,\s*/) : true);
			return this;
		},

		/**
		 * Field must contain a valid integer value.
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		integer: function(message) { 
			message = message || null;
			this.setRule('integer', function(key, val) {
				var OV = Boutique.Validator;
				return OV.isInteger(val);
			}, message);
			return this;
		},

		/**
		 * Field has to be valid IP address.
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		ip: function(message) { 
			message = message || null;
			this.setRule('ip', function(key, val) {
				if (trim(val).length === 0) {
					return true;
				}
				else if (trim(val).match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
					segs = trim(val).split('.');
					for (s in segs) {
						if (segs[s] < 0 || segs[s] > 255) {
							return false;
						}
					}
					return true;
				}
				return false;
			}, message);
			return this;
		},

		/**
		 * Check date values to ensure they are valid
		 *
		 * @param 	string 				val
		 * @return 	boolean
		 * @since 	5.0
		 */
		isDate: function(val) {
			var msgInvalid = 'Value passed to ' + this._objectName + '.isDate() is not a valid date format';
			var dt, results;
			if (trim(val).length === 0) {
				return true;
			}
			try {
				dt = new Date(val);
				return dt instanceof Date && !isNaN(dt.valueOf());
			} 
			catch(e) {
				$.clog(msgInvalid, 'danger');
				return false;
			}
		},

		/**
		 * Check to ensure value is of type float
		 *
		 * @param 	float 				val
		 * @return 	boolean
		 * @since 	5.0
		 */
		isFloat: function(val) {
			var valString = trim(val);
			var valFloat = parseFloat(val);
			return (valString === valFloat.toString() && valFloat === +valFloat && valFloat !== (valFloat|0));	
		},

		/**
		 * Check to ensure value is of type integer
		 *
		 * @param 	int 				val
		 * @return 	boolean
		 * @since 	5.0
		 */
		isInteger: function(val) {
			var valString = trim(val);
			var valInt = parseInt(val);
			return (valString === valInt.toString() && valInt === +valInt && valInt === (valInt|0));	
		},

		/**
		 * Field has to be X symbols long.
		 *
		 * @param 	int 				len
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		length: function(len, message) { 
			message = message || null;
			this.setRule('length', function(key, val, args) {
				return (trim(val).length == args[0]);
			}, message, [len]);
			return this;
		},

		/**
		 * Field has to be between minlength and maxlength symbols long.
		 *
		 * @param   int 				minlength
		 * @param   int 				maxlength
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		lengthBetween: function(minlength, maxlength, message) { 
			message = message || null;
			message = (!message) ? this._getDefaultMessage('lengthBetween', [minlength, maxlength]) : null;
			this.lengthMin(minlength, message).lengthMax(maxlength, message);
			return this;
		},

		/**
		 * Field has to be less than or equal to X symbols long.
		 *
		 * @param 	int 				len
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		lengthMax: function(len, message) { 
			message = message || null;
			this.setRule('lengthMax', function(key, val, args) {
				return !(trim(val).length > args[0]);
			}, message, [len]);
			return this;
		},

		/**
		 * Field has to be greater than or equal to X symbols long.
		 *
		 * @param 	int 				len
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		lengthMin: function(len, message) { 
			message = message || null;
			this.setRule('lengthMin', function(key, val, args) {
				return !(trim(val).length < args[0]);
			}, message, [len]);
			return this;
		},

		/**
		 * Field value is the same as another one (password comparison etc).
		 *
		 * @param 	string 				field
		 * @param 	string 				label
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		matchesField: function(field, label, message) {
			label = label || '';
			message = message || null;
			this.setRule('matchesField', function(key, val, args) {
				val = trim(val);
				return (args[0].toString() === val);
			}, message, [this._getVal(field), label]);
			return this;
		},

		/**
		 * Field value is not the same as another one (avoid duplicated values).
		 *
		 * @param 	string 				field
		 * @param 	string 				label
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		matchesNotField: function(field, label, message) {
			label = label || '';
			message = message || null;
			this.setRule('matchesNotField', function(key, val, args) {
				val = trim(val);
				return (args[0].toString() !== val);
			}, message, [this._getVal(field), label]);
			return this;
		},

		/**
		 * Field value matches a pre-assigned regular expression
		 *
		 * @param 	string 				regexp
		 * @param 	string 				label
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		matchesRegExp: function(regexp, label, message) {
			label = label || '';
			message = message || null;
			this.setRule('matchesRegExp', function(key, val, args) {
				var globs = 'g';
				var regex = args[0].toString();
				// Format in JS is a bit different so let's make it compatible...
				if (regex.match(new RegExp("i$"))) {
					globs += 'i';
					regex = regex.slice(0, -1);
				}
				// Strip separators
				regex = regex.slice(1, -1);
				console.log('... Validator is now matching against the following regular expression string: "' + val + '".match(new RegExp("' + regex + '", "' + globs + '"))');
				val = trim(val);
				return (val.match(new RegExp(regex, globs)) !== null);
			}, message, [regexp, label]);
			return this;
		},

		/**
		 * Field must be a number between X and Y.
		 *
		 * @param 	numeric 			min
		 * @param 	numeric 			max
		 * @param 	bool 				include 			Whether to include limit value.
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		numBetween: function(min, max, include, message) {
			include = $.isset(include) || true;
			message = message || null;
			message = this._getDefaultMessage('numBetween', [min, max, include]);
			this.numMin(min, include, message).numMax(max, include, message);
			return this;
		},

		/**
		 * Field must be a number greater than [or equal to] X.
		 *
		 * @param 	numeric 			limit
		 * @param 	bool 				include 			Whether to include limit value.
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		numMax: function(limit, include, message) {
			include = $.isset(include) || true; 
			message = message || null;
			this.setRule('numMax', function(key, val, args) {
				var inc;
				if (val.length === 0) {
					return true;
				}
				val = parseFloat(val);
				limit = parseFloat(args[0]);
				inc = Boolean(args[1]);
				return (val < limit || (inc === true && val === limit));
			}, message, [limit, include]);
			return this;
		},

		/**
		 * Field must be a number greater than [or equal to] X.
		 *
		 * @param numeric limit
		 * @param 	bool 				include 			Whether to include limit value.
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		numMin: function(limit, include, message) { 
			include = $.isset(include) || true; 
			message = message || null;
			this.setRule('numMin', function(key, val, args) {
				var inc;
				if (val.length === 0) {
					return true;
				}
				val = parseFloat(val);
				limit = parseFloat(args[0]);
				inc = Boolean(args[1]);
				return (val > limit || (inc === true && val === limit));
			}, message, [limit, include]);
			return this;
		},

		/**
		 * Field must be filled in.
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		required: function(message) { 
			message = message || null;
			this.setRule('required', function(key, val) {
				if (typeof val === 'string') {
					val = trim(val);
				}
				return ($.isset(val) && val !== false && val !== '');
			}, message);
			return this;
		},

		/**
		 * Set the data to be validated
		 *
		 * @param 	mixed 				data
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		setData: function(data) {
			this._data = data;
			this._errors = {};
			return this;
		},

		/**
		 * Set rule.
		 *
		 * @uses	phpjs.custom.js - is_string()
		 *
		 * @param 	string 				rule
		 * @param 	closure 			fnc
		 * @param 	string 				message				Validation results message
		 * @param 	array 				args
		 * @return 	void
		 * @since 	5.0
		 */
		setRule: function(rule, fnc, message, args) {
			message = message || '';
			args = args || [];
			if (!$.isset(this._rules[rule])) {
				this._rules[rule] = true;
				if (!$.isset(this._functions[rule])) {
					if (!typeof (fnc || undefined) === 'function') {
						$.clog('Invalid function for rule: ' + rule, 'danger');
					}
					this._functions[rule] = fnc;
				}
				this._arguments[rule] = args; // Specific arguments for rule
				this._messages[rule] = (is_string(message) && trim(message) != '') ? message : this._getDefaultMessage(rule, args);
			}
		},

		/**
		 * Field must NOT start with a specific substring.
		 *
		 * @param 	string 				subst
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		startsNotWith: function(subst, message) { 
			message = message || null;
			this.setRule('startsNotWith', function(key, val, args) {
				val = trim(val);
				subst = args[0];
				return (val.length === 0 || val.substr(0, subst.length) !== subst);
			}, message, [subst]);
			return this;
		},

		/**
		 * Field must start with a specific substring.
		 *
		 * @param 	string 				subst
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		startsWith: function(subst, message) { 
			message = message || null;
			this.setRule('startsWith', function(key, val, args) {
				val = trim(val);
				subst = args[0];
				return (val.length === 0 || val.substr(0, subst.length) === subst);
			}, message, [subst]);
			return this;
		},

		/**
		 * Field has to be valid internet address.
		 *
		 * @param 	string 				message				Validation results message
		 * @return 	object									Returns an object of this class type
		 * @since 	5.0
		 */
		url: function(message) { 
			message = message || null;
			this.setRule('url', function(key, val) {
				val = trim(val);
				return (val.length === 0 || 
					val.match(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i)
				);
			}, message);
			return this;
		},

		/**
		 * Validate
		 *
		 * @uses	phpjs.custom.js - empty()
		 *
		 * @param 	string 				key
		 * @param 	string 				label
		 * @param	boolean				recursive
		 * @return 	bool
		 * @since 	5.0
		 */
		validate: function(key, label, recursive) {
			label = label || '';
			recursive = recursive || false;
			var validate = true;
			var f, flds, val;
			if (this._ifSet !== false) {
				validate = false;
				flds = (Array.isArray(this._ifSet)) ? this._ifSet : [key];
				for (f in flds) {
					if (!empty(this._data[flds[f]])) {
						validate = true;
					}
				}
			}
			if (this._ifNotSet !== false) {
				flds = (Array.isArray(this._ifNotSet)) ? this._ifNotSet : [key];
				for (f in flds) {
					if (!empty(this._data[flds[f]])) {
						validate = false;
					}
				}
			}
			if (validate) {
				// set up field name for error message
				this._fields[key] = (!label) ? 'The field named "' + key + '"' : label;

				// apply filters to the data
				this._applyFilters(key);
		
				val = this._getVal(key);
		
				// validate the piece of data
				this._validate(key, val, recursive);
			}
			// reset rules
			this._reset();
			return val;
		},

		/**
		 * Validate if a value is not present in one or more fields
		 *
		 * @param 	string 				key
		 * @param 	string 				label
		 * @param	boolean				recursive
		 * @return 	bool
		 * @since 	5.0
		 */
		validateIfNotSet: function(key, label, recursive) {
			return this.ifNotSet().validate(key, label, recursive);
		},
		
		/**
		 * Validate if a value is present in one or more fields
		 *
		 * @param 	string 				key
		 * @param 	string 				label
		 * @param	boolean				recursive
		 * @return 	bool
		 * @since 	5.0
		 */
		validateIfSet: function(key, label, recursive) {
			return this.ifSet().validate(key, label, recursive);
		},
		
	};

})();



; (function() {

    'use strict';
	
	Boutique.Controllers.Product = {
		
		block: null,
		formList: null,
		formWrite: null,
		ov: null,
		prefix: '#product',
		
		bindEvents: function() {

			var BCP = Boutique.Controllers.Product;
			
			$(BCP.prefix + '-list').off('click').on('click', function(e) {

				BCP.show(e);

			});
			
			BCP.formList.find('.remove-element').off('click').on('click', function() {
				
				BCP.remove(this);
				
			});

			$(BCP.prefix + '_add').off('click').on('click', function() {
				
				BCP.save(this);
				
			});

			$(BCP.prefix + '_upd').off('click').on('click', function() {
				
				BCP.save(this);
				
			});

			$(BCP.prefix + '_del').off('click').on('click', function() {
				
				BCP.remove(this);
				
			});

		},
		
		delete: function(id) {

			var BCP = Boutique.Controllers.Product;
			var BU = Boutique.Utilities;
			var BM = Boutique.Messages;
			var BS = Boutique.Settings;
			
			if (id) {
			
				$.ajax({
					type: 'post',
					// Note: Due to a bug in jQuery, do not include trailing slashes on ajax PBST requests
					// Doing so will prevent the default data and other attributes in globals.js.php from
					// being included and therefore 401 errors will occurr due to missing CSRF token.
					url: API_PATH + '/products/delete/' + id,
					data: BCP.formList.cerealize(),
					beforeSend: function() {
						BM.progress(BS.t('messageDeleting'), BCP.block);
					},
					success: function(data, status, xhr) {
						BCP.set(data, status, xhr);
					}
				});
				return false;
			}
			
		},
		
		duplicate: function() {
			
			var BCP = Boutique.Controllers.Product;
						
			BCP.itemId = null;
			$(BCP.prefix + '_id').val('');
			
		},
		
		edit: function(callback) {
			
			var BCP = Boutique.Controllers.Product;
			var BU = Boutique.Utilities;
			var BM = Boutique.Messages;
			var BS = Boutique.Settings;

			if (BCP.itemId) {

				BCP.reset();	
				
				$.ajax({
					type: 'get',
					url: API_PATH + '/products/edit/' + BCP.itemId + '/',
					beforeSend: function() {
						BM.progress(BS.t('messageLoading'), BCP.block);
					},
					success: function(data, status, xhr) {
						BCP.formWrite.decerealize(data);
						BU.initPscroll(BCP.dialog);
						BM.hide(BCP.block);
						
						BCP.lastId = BCP.itemId;
						
						if (typeof (callback || undefined) === 'function') {
							callback.call();
						}

					}
				});
			}
			
		},
		
		hide: function() {
			
			var BCP = Boutique.Controllers.Product;
			
			BCP.dialog.modal('hide');
		
		},

		index: function() {
			
			var BCP = Boutique.Controllers.Product;
			var BU = Boutique.Utilities;
			var BM = Boutique.Messages;
			var BS = Boutique.Settings;

			BCP.block = $('body');
					
			$.ajax({
				type: 'get',
				url: API_PATH + '/products/',
				data: BCP.formList.cerealize(),
				beforeSend: function() {
					BM.progress(BS.t('messageLoading'), BCP.block);
				},
				success: function(data, status, xhr) {
					BCP.formList.find('.content-ajaxload').html(data);		
					BCP.bindEvents();
					BU.initSelectPicker(BCP.form);
					BU.initPscroll(BCP.form);								
					BU.initTooltips(BCP.formList);							
					BM.hide(BCP.block);
				}
			});
			
		},

		init: function() {

			var BCP = Boutique.Controllers.Product;
			var BU = Boutique.Utilities;
			
			BCP.dialog = $(BCP.prefix + '_dialog');
			BCP.formList = $(BCP.prefix + '_form_list');
			BCP.formWrite = $(BCP.prefix + '_form_write');
			
			BCP.hide();
			BCP.bindEvents();
			
		},

		remove: function(o) {

			var BCP = Boutique.Controllers.Product;
			var BU = Boutique.Utilities;
			var BM = Boutique.Messages;
			var BS = Boutique.Settings;
			
			var id = (BCP.itemId) ? BCP.itemId : $(o).closest('[data-id]').data('id');
			
			if (id) {
			
				BCP.block = ($(BCP.prefix + '_dialog:visible').length) ? BCP.dialog.find('.modal-content') : $('body');
				
				bootbox.confirm({
					title: 'Confirm',
					message: '<p class="center">' + BS.t('messageConfirmDelete') + '</p>',
					callback: function(ok) {
						if (ok) {
							BCP.delete(id);
						}
					}
				});
				return false;
			}
			
		},
		
		reset: function() {

			var BCP = Boutique.Controllers.Product;
			var OV = Boutique.Validator;
			
			/* Reset all visible fields */
			if (BCP.formWrite.length) {
				BCP.formWrite.get(0).reset();
				OV.clearErrors(BCP.formWrite);
			}
			
			/* Reset hidden id field manually since reset doesn't clear hidden fields */
			$(BCP.prefix + '_id').val('');
				
		},
		
		// saves a new item back to the database
		save: function() {
			
			var BCP = Boutique.Controllers.Product;
			var BU = Boutique.Utilities;
			var BM = Boutique.Messages;
			var BS = Boutique.Settings;
			var OV = Boutique.Validator;

			var id = (BCP.itemId) ? BCP.itemId + '/' : '';
			BCP.ov = OV.build(BCP.formWrite);
			
			if (BCP.ov.hasErrors()) {
				return false;
			}
		
			OV.clearErrors(BCP.formWrite);

			$.ajax({
				type: 'post',
				url: API_PATH + '/products/save/' + id,
				data: BCP.formWrite.cerealize(),
				beforeSend: function() {
					BM.progress(BS.t('messageSaving'), BCP.block);
				},
				success: function(data, status, xhr) {
					BCP.set(data, status, xhr);
				}
			});

		},
		
		set: function(data, status, xhr) {
			
			var BCP = Boutique.Controllers.Product;
			var BM = Boutique.Messages;

			//BM.response(data, status, xhr, BCP.block, BCP.hide);
			BM.response(data, status, xhr, BCP.block, BCP.init);
				
		},
			
		show: function(e) { 
		
			const BCP = Boutique.Controllers.Product;
			const BU = Boutique.Utilities;
			
			if (e) {

				BCP.block = BCP.dialog.find('.modal-content');
				BCP.itemId = (e.target && e.target.dataset['id']) ? e.target.dataset['id'] : false;
				
				if (BCP.itemId) {
					$(BCP.prefix + '_add').hide();	
					$(BCP.prefix + '_del, ' + BCP.prefix + '_upd').show();	
				}
				else {
					$(BCP.prefix + '_add').show();	
					$(BCP.prefix + '_del, ' + BCP.prefix + '_upd').hide();	
					BCP.reset();	
				}
				
				//BU.setDialogTitle(BCP.dialog, BCP.itemId);

				BCP.dialog.modal('show');
				BCP.dialog.off('shown.bs.modal').on('shown.bs.modal', function() {
					
					// Load item record if valid id is passed
					if (BCP.itemId) {
						//BCP.edit();
					}
					
				});		
					
			}

		},

	};

	$(function() {
		Boutique.Controllers.Product.init();
	});       

})();

