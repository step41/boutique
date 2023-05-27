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

