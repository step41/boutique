; (function() {

    'use strict';
            
	Boutique.Utilities = {

		initialized: [],

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
		
		initDropups: function() {
			
			Boutique.Utilities.resizeDropups();
			
		},
		
		initHelpBlocks: function(o) {

			function helpify(o) {
				$(o).each(
					function() {
						let hb = $(this).find('.help-block');
						let bh = $(this).find('.btn-help');
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

		initMultiModal: function() {
			/* 
			UPDATE! Since Bootstrap 3.2.2, multi-modals are now fully supported in the base code. Leaving this function for posterity reasons only.

			UPDATE#2: Apparently there are still some circumstances where default multi-modal behavior is broken (nested modals). So I'm re-implementing the following function.
			*/

			let indexBase = 1060;
			let marginBase = 30;

			// Allow for multiple simultaneous modals
			$(document).on('show.bs.modal', '.modal', function (e) {
				
				let self = $(this);
				let count = $('.modal:visible').length;
				let index = indexBase + (10 * count);
				let margin = ((count + 1) * marginBase) + 'px';


				// Ensure there is at least one visible modal present and that it is not nested within another modal (eg; Search modal within Media modal)
				//if (count > 0 && self.parents('.modal').length === 0) {
					self.css('z-index', index);
					self.css('margin-top', margin);
					$($('.modal-backdrop.show').not('.modal-stack')[count - 1]).css('z-index', (index - 1)).addClass('modal-stack');
				//}

				console.log('Showing modal #' + count + ' CSS { zIndex:' + index + ', marginTop:' + margin + ' }');
			});	

			// Multi-modal scrolling fix - Re-establishes scrolling on underlying modal when closing top-most modal 
			$(document).on('hidden.bs.modal', '.modal', function() {

				let self = $(this);
				console.log('Hiding modal #' + self.attr('id') + ' CSS { zIndex:' + indexBase + ', marginTop:' + marginBase + ' }');
				self.css('z-index', indexBase);
				self.css('margin-top', marginBase + 'px');
				$('.modal-backdrop.modal-stack').css('z-index', (indexBase - 1)).removeClass('modal-stack');
				
				if ($('.modal.show').length) {
					$('body').addClass('modal-open');
				}
				else {
					$('body').removeClass('modal-open');
				}

			});

		},

		initSegmentSelect: function(dialog, callback) {
			
			const BU = Boutique.Utilities;
			let seg, controls, segments;
			
			dialog = $(dialog);
			if (dialog.length) {

				controls = dialog.find('.segmented-control button');
				segments = dialog.find('.segment');
				
				controls.off('click').on('click', function() {
					let self = this;
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

		initSelectPicker: function(o, opts) {
			
			const BU = Boutique.Utilities;
			let sa = 'selectpicker-active';
			
			o = o || $('body');
			$(o).find('select.selectpicker').each(function() {
				let self = $(this);
				let defaults = {
					'delay': 0,
					'style': '',
					'iconBase': 'icon',
					'tickIcon': 'icon-check',
					// 20200628 - Commenting liveSearch out for now because it bugs and then no search is available at all
					//'liveSearch': (self.children('option').length > 10) ? true : false,
					'size': 10
				};
				let options = (opts && $.isPlainObject(opts)) ? BU.mergeObjects(defaults, opts) : defaults;
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
		
		initTooltips: function(o) {
			if (!Modernizr.touch) { 
				let $tb, $tl, $tr, $tt;
				let tbs = ''; // Tooltip Bottom Selectors - Displays below the item
				let tls = ''; // Tooltip Left Selectors - Displays to the left of the item
				let trs = ''; // Tooltip Right Selectors - Displays to the right of the item
				let tts = ''; // Tooltip Top Selectors - Displays above the item

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
			let isJSON = true;
			let json;
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
		
		mergeObjects: function(obj1, obj2, mutate) {
			// Merge options object into settings object
			// let settings = { validate: false, limit: 5, name: "foo" };
			// let options  = { validate: true, name: "bar" };
			// jQuery.extend(obj1, obj2);

			// Now the content of settings object is the following:
			// { validate: true, limit: 5, name: "bar" }
			// The above code will mutate the object named settings.

			// If you want to create a new object without modifying either argument, use this:

			// let defaults = { validate: false, limit: 5, name: "foo" };
			// let options = { validate: true, name: "bar" };

			// Merge defaults and options, without modifying defaults 
			// let settings = $.extend({}, defaults, options);

			// The content of settings variable is now the following:
			// {validate: true, limit: 5, name: "bar"}
			// The 'defaults' and 'options' variables remained the same.
			
			mutate = mutate || false;
			
			if (obj1 && obj2) {

				let newObj = {};

				if (mutate) {
					newObj = jQuery.extend(obj1, obj2);
				}
				else {
					newObj = $.extend({}, obj1, obj2);
				}

			}

			return newObj;

		},

		setDialogTitle: function(dialog, id) {

			/* 
				TODO - For full language compatibility, we need to first translate the 
				words below, then run replace and append. But we're not sure that the replace
				enclosers will not conflict with alt characters types from other languages
				so for now we're only calling this function on the English terms.
			*/ 

			if (dialog) {
				let header = dialog.find('.modal-header h3');
				let title = trim(header.text());
				title = title.replace(/(^\s*New\s+|\s+Properties\s*$)/i, '');
				title = (id) ? title + ' Properties' : 'New ' + title;
				header.text(title);
			}

		},

		setModalScroll: function() {

			if ($('.modal.show').length) {
				$('body').addClass('modal-open');
			}
			else {
				$('body').removeClass('modal-open');
			}

		},
		
		timeouts: [],
		
		uid: function() {
			return ('00000' + (Math.random()*Math.pow(36,5) << 0).toString(36)).slice(-5);
		},

		uuid: function() {
			let oUUID = new UUID();
			let sUUID = oUUID.createUUID();
			sUUID = sUUID.replace(/-/g,'');	
			return sUUID;
		},

	};

	Boutique.Utilities.initMultiModal();

})();

