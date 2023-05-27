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


