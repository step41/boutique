/**
 * jQuery DateTimePicker plugin v2.3.5
 */
(function( $ ) {
	'use strict';
	var default_options  = {
		i18n:{
			ar: { // Arabic
				months: [
					"كانون الثاني", "شباط", "آذار", "نيسان", "مايو", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"
				],
				dayOfWeek: [
					"ن", "ث", "ع", "خ", "ج", "س", "ح"
				]
			},
			ro: { // Romanian
				months: [
					"ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"
				],
				dayOfWeek: [
					"l", "ma", "mi", "j", "v", "s", "d"
				]
			},
			id: { // Indonesian
				months: [
					"Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
				],
				dayOfWeek: [
					"Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"
				]
			},
			bg:{ // Bulgarian
				months:[
					"Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"
				],
				dayOfWeek:[
					"Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"
				]
			},
			fa:{ // Persian/Farsi
				months:[
					'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
				],
				dayOfWeek:[
					'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'
				]
			},
			ru:{ // Russian
				months:[
					'Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'
				],
				dayOfWeek:[
					"Вск", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"
				]
			},
			uk:{ // Ukrainian
				months:[
					'Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'
				],
				dayOfWeek:[
					"Ндл", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Сбт"
				]
			},
			en:{ // English
				months: [
					"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
				],
				dayOfWeek: [
					"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
				]
			},
			el:{ // Ελληνικά
				months: [
					"Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"
				],
				dayOfWeek: [
					"Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"
				]
			},
			de:{ // German
				months:[
					'Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'
				],
				dayOfWeek:[
					"So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"
				]
			},
			nl:{ // Dutch
				months:[
					"januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"
				],
				dayOfWeek:[
					"zo", "ma", "di", "wo", "do", "vr", "za"
				]
			},
			tr:{ // Turkish
				months:[
					"Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
				],
				dayOfWeek:[
					"Paz", "Pts", "Sal", "Çar", "Per", "Cum", "Cts"
				]
			},
			fr:{ //French
				months:[
			    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
				],
				dayOfWeek:[
					"Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"
				]
			},
			es:{ // Spanish
				months: [
					"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
				],
				dayOfWeek: [
					"Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"
				]
			},
			th:{ // Thai
				months:[
					'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'
				],
				dayOfWeek:[
					'อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'
				]
			},
			pl:{ // Polish
				months: [
					"styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"
				],
				dayOfWeek: [
					"nd", "pn", "wt", "śr", "cz", "pt", "sb"
				]
			},
			pt:{ // Portuguese
				months: [
					"Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
				],
				dayOfWeek: [
					"Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"
				]
			},
			ch:{ // Simplified Chinese
				months: [
					"一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"
				],
				dayOfWeek: [
					"日", "一","二","三","四","五","六"
				]
			},
			se:{ // Swedish
				months: [
					"Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September","Oktober", "November", "December"
				],
				dayOfWeek: [
					"Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"
				]
			},
			kr:{ // Korean
				months: [
					"1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
				],
				dayOfWeek: [
					"일", "월", "화", "수", "목", "금", "토"
				]
			},
			it:{ // Italian
				months: [
					"Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
				],
				dayOfWeek: [
					"Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"
				]
			},
			da:{ // Dansk
				months: [
					"January", "Februar", "Marts", "April", "Maj", "Juni", "July", "August", "September", "Oktober", "November", "December"
				],
				dayOfWeek: [
					"Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"
				]
			},
			no:{ // Norwegian
				months: [
					"Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"
				],
				dayOfWeek: [
					"Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"
				]
			},
			ja:{ // Japanese
				months: [
					"1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"
				],
				dayOfWeek: [
					"日", "月", "火", "水", "木", "金", "土"
				]
			},
			vi:{ // Vietnamese
				months: [
					"Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
				],
				dayOfWeek: [
					"CN", "T2", "T3", "T4", "T5", "T6", "T7"
				]
			},
			sl:{ // Slovenščina
				months: [
					"Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"
				],
				dayOfWeek: [
					"Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"
				]
			},
			cs:{ // Čeština
				months: [
					"Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
				],
				dayOfWeek: [
					"Ne", "Po", "Út", "St", "Čt", "Pá", "So"
				]
			},
			hu:{ // Hungarian
			    months: [
					"Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"
			    ],
			    dayOfWeek: [
					"Va", "Hé", "Ke", "Sze", "Cs", "Pé", "Szo"
			    ]
			}
		},
		value:'',
		lang:'en',
		
		format:	'Y-m-d H:i:s',
		formatTime:	'H:i:s',
		formatDate:	'Y-m-d',
		
		startDate:	false, // new Date(), '1986/12/08', '-1970/01/05','-1970/01/05', 
		
		step:60,
		monthChangeSpinner:true,
		closeOnDateSelect:false,
		closeOnWithoutClick:true,
		closeOnInputClick: true,
		
		timepicker:true,
		datepicker:true,
		weeks:false,
		
		defaultTime:false,		// use formatTime format (ex. '10:00' for formatTime:	'H:i')
		defaultDate:false, 		// use formatDate format (ex new Date() or '1986/12/08' or '-1970/01/05' or '-1970/01/05')
		
		minDate:false,
		maxDate:false,
		minTime:false,
		maxTime:false,
		
		allowTimes:[],
		opened:false,
		initTime:true,
		inline:false,
		
		theme:'',
		
		onSelectDate:function() {},
		onSelectTime:function() {},
		onChangeMonth:function() {},
		onChangeYear:function() {},
		onChangeDateTime:function() {},
		onShow:function() {},
		onClose:function() {},
		onGenerate:function() {},
		
		withoutCopyright:true,
		
		inverseButton:false,
		hours12:false,
		next:	'ocms_dtp_next',
		prev : 'ocms_dtp_prev',
		dayOfWeekStart:0,

		parentID: 'body',
		
		timeHeightInTimePicker:25,
		timepickerScrollbar:true,
		
		todayButton:true, // 2.1.0
		defaultSelect:true, // 2.1.0
		
		scrollMonth:true,
		scrollTime:true,
		scrollInput:true,
		
		lazyInit:false,
		
		mask:false,
		validateOnBlur:true,
		allowBlank:true,
		
		yearStart:1950,
		yearEnd:2050,
		
		style:'',
		id:'',
		
		fixed: false,
		
		roundTime:'round', // ceil, floor
		className:'',
		
		weekends	: 	[],
		yearOffset:0,
		beforeShowDay: null
	};
	
	// fix for ie8
	if ( !Array.prototype.indexOf ) {
		Array.prototype.indexOf = function(obj, start) {
			 for (var i = (start || 0), j = this.length; i < j; i++) {
				 if (this[i] === obj) { return i; }
			 }
			 return -1;
		}
	}
	
	Date.prototype.countDaysInMonth = function(){
		return new Date(this.getFullYear(), this.getMonth()+1, 0).getDate();
	};
	
	$.fn.ocms_dtpScroller = function( _percent ) {
		return this.each(function() {
			var timeboxparent = $(this);
			if( !$(this).hasClass('ocms_dtp_scroller_box') ) {
				var pointerEventToXY = function( e ) {
						var out = {x:0, y:0};
						if( e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel' ) {
							var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
							out.x = touch.pageX;
							out.y = touch.pageY;
						}else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
							out.x = e.pageX;
							out.y = e.pageY;
						}
						return out;
					},
					move = 0,
					timebox = timeboxparent.children().eq(0),
					parentHeight = timeboxparent[0].clientHeight,
					height = timebox[0].offsetHeight,
					scrollbar = $('<div class="ocms_dtp_scrollbar"></div>'),
					scroller = $('<div class="ocms_dtp_scroller"></div>'),
					maximumOffset = 100,
					start = false;

				scrollbar.append(scroller);

				timeboxparent.addClass('ocms_dtp_scroller_box').append(scrollbar);
				scroller.on('mousedown.ocms_dtp_scroller',function ( event ) {
					if( !parentHeight )
						timeboxparent.trigger('resize_scroll.ocms_dtp_scroller',[_percent]);
					var pageY = event.pageY,
						top = parseInt(scroller.css('margin-top')),
						h1 = scrollbar[0].offsetHeight;
					$(document.body).addClass('ocms_dtp_noselect');
					$([document.body,window]).on('mouseup.ocms_dtp_scroller',function arguments_callee() {
						$([document.body,window]).off('mouseup.ocms_dtp_scroller',arguments_callee)
							.off('mousemove.ocms_dtp_scroller',move)
							.removeClass('ocms_dtp_noselect');
					});
					$(document.body).on('mousemove.ocms_dtp_scroller',move = function(event) {
						var offset = event.pageY-pageY+top;
						if( offset<0 )
							offset = 0;
						if( offset+scroller[0].offsetHeight>h1 )
							offset = h1-scroller[0].offsetHeight;
						timeboxparent.trigger('scroll_element.ocms_dtp_scroller',[maximumOffset?offset/maximumOffset:0]);
					});
				});

				timeboxparent
					.on('scroll_element.ocms_dtp_scroller',function( event,percent ) {
						if( !parentHeight )
							timeboxparent.trigger('resize_scroll.ocms_dtp_scroller',[percent,true]);
						percent = percent>1?1:(percent<0||isNaN(percent))?0:percent;
						scroller.css('margin-top',maximumOffset*percent);
						setTimeout(function(){
							timebox.css('marginTop',-parseInt((timebox[0].offsetHeight-parentHeight)*percent))
						},10);						
					})
					.on('resize_scroll.ocms_dtp_scroller',function( event,_percent,noTriggerScroll ) {
						parentHeight = timeboxparent[0].clientHeight;
						height = timebox[0].offsetHeight;
						var percent = parentHeight/height,
							sh = percent*scrollbar[0].offsetHeight;
						if( percent>1 )
							scroller.hide();
						else{
							scroller.show();
							scroller.css('height',parseInt(sh>10?sh:10));
							maximumOffset = scrollbar[0].offsetHeight-scroller[0].offsetHeight;
							if( noTriggerScroll!==true )
								timeboxparent.trigger('scroll_element.ocms_dtp_scroller',[_percent?_percent:Math.abs(parseInt(timebox.css('marginTop')))/(height-parentHeight)]);
						}
					});
				timeboxparent.mousewheel&&timeboxparent.mousewheel(function(event, delta, deltaX, deltaY) {
					var top = Math.abs(parseInt(timebox.css('marginTop')));
					timeboxparent.trigger('scroll_element.ocms_dtp_scroller',[(top-delta*20)/(height-parentHeight)]);
					event.stopPropagation();
					return false;
				});
				timeboxparent.on('touchstart',function( event ) {
					start = pointerEventToXY(event);
				});
				timeboxparent.on('touchmove',function( event ) {
					if( start ) {
						var coord = pointerEventToXY(event), top = Math.abs(parseInt(timebox.css('marginTop')));
						timeboxparent.trigger('scroll_element.ocms_dtp_scroller',[(top-(coord.y-start.y))/(height-parentHeight)]);
						event.stopPropagation();
						event.preventDefault();
						start = pointerEventToXY(event);
					}
				});
				timeboxparent.on('touchend touchcancel',function( event ) {
					start = false;
				});
			}
			timeboxparent.trigger('resize_scroll.ocms_dtp_scroller',[_percent]);
		});
	};
	$.fn.datetimepicker = function( opt ) {
		var KEY0 = 48,
			KEY9 = 57,
			_KEY0 = 96,
			_KEY9 = 105,
			CTRLKEY = 17,
			DEL = 46,
			ENTER = 13,
			ESC = 27,
			BACKSPACE = 8,
			ARROWLEFT = 37,
			ARROWUP = 38,
			ARROWRIGHT = 39,
			ARROWDOWN = 40,
			TAB = 9,
			F5 = 116,
			AKEY = 65,
			CKEY = 67,
			VKEY = 86,
			ZKEY = 90,
			YKEY = 89,
			ctrlDown	=	false,
			options = ($.isPlainObject(opt)||!opt)?$.extend(true,{},default_options,opt):$.extend(true,{},default_options),

			lazyInitTimer = 0,

			lazyInit = function( input ){
				input
					.on('open.ocms_dtp focusin.ocms_dtp mousedown.ocms_dtp',function initOnActionCallback(event) {
						if( input.is(':disabled')||input.is(':hidden')||!input.is(':visible')||input.data( 'ocms_dtp_datetimepicker') )
							return;
				
						clearTimeout(lazyInitTimer);
						
						lazyInitTimer = setTimeout(function() {

							if( !input.data( 'ocms_dtp_datetimepicker') )
								createDateTimePicker(input);
								
							input
								.off('open.ocms_dtp focusin.ocms_dtp mousedown.ocms_dtp',initOnActionCallback)
								.trigger('open.ocms_dtp');
						},100);
						
					});
			},
			
			createDateTimePicker = function( input ) {
				
				var datetimepicker = $('<div '+(options.id?'id="'+options.id+'"':'')+' '+(options.style?'style="'+options.style+'"':'')+' class="ocms_dtp_datetimepicker ocms_dtp_'+options.theme+' ocms_dtp_noselect '+(options.weeks?' ocms_dtp_showweeks':'')+options.className+'"></div>'),
					datepicker = $('<div class="ocms_dtp_datepicker active"></div>'),
					month_picker = $('<div class="ocms_dtp_monthpicker"><button type="button" class="ocms_dtp_prev"></button><button type="button" class="ocms_dtp_today_button"></button>'+
						'<div class="ocms_dtp_label ocms_dtp_month"><span></span><i></i></div>'+
						'<div class="ocms_dtp_label ocms_dtp_year"><span></span><i></i></div>'+
						'<button type="button" class="ocms_dtp_next"></button></div>'),
					calendar = $('<div class="ocms_dtp_calendar"></div>'),
					timepicker = $('<div class="ocms_dtp_timepicker active"><button type="button" class="ocms_dtp_prev"></button><div class="ocms_dtp_time_box"></div><button type="button" class="ocms_dtp_next"></button></div>'),
					timeboxparent = timepicker.find('.ocms_dtp_time_box').eq(0),
					timebox = $('<div class="ocms_dtp_time_variant"></div>'),
					scrollbar = $('<div class="ocms_dtp_scrollbar"></div>'),
					scroller = $('<div class="ocms_dtp_scroller"></div>'),
					monthselect =$('<div class="ocms_dtp_select ocms_dtp_monthselect"><div></div></div>'),
					yearselect =$('<div class="ocms_dtp_select ocms_dtp_yearselect"><div></div></div>');

				//constructor lego
				month_picker
					.find('.ocms_dtp_month span')
						.after(monthselect);
				month_picker
					.find('.ocms_dtp_year span')
						.after(yearselect);

				month_picker
					.find('.ocms_dtp_month,.ocms_dtp_year')
						.on('mousedown.ocms_dtp',function(event) {
							var select = $(this).find('.ocms_dtp_select').eq(0),
								val = 0,
								top = 0,
								visible = select.is(':visible');
							
							
							month_picker
								.find('.ocms_dtp_select')
									.hide();
									
						

							if( _ocms_dtp_datetime.currentTime )
								val = _ocms_dtp_datetime.currentTime[$(this).hasClass('ocms_dtp_month')?'getMonth':'getFullYear']();

							select[visible?'hide':'show']();
							
							for(var items = select.find('div.ocms_dtp_option'),i = 0;i<items.length;i++) {
								if( items.eq(i).data('value')==val ) {
									break;
								}else top+=items[0].offsetHeight;
							}

							select.ocms_dtpScroller(top/(select.children()[0].offsetHeight-(select[0].clientHeight)));
							event.stopPropagation();
							
							return false;
						});

				month_picker
					.find('.ocms_dtp_select')
						.ocms_dtpScroller()
						.on('mousedown.ocms_dtp',function( event ) {
							event.stopPropagation();
							event.preventDefault();
						})
						.on('mousedown.ocms_dtp','.ocms_dtp_option',function( event ) {
							var year = _ocms_dtp_datetime.currentTime.getFullYear();
							if( _ocms_dtp_datetime&&_ocms_dtp_datetime.currentTime )
								_ocms_dtp_datetime.currentTime[$(this).parent().parent().hasClass('ocms_dtp_monthselect')?'setMonth':'setFullYear']($(this).data('value'));
							
							$(this).parent().parent().hide();
							
							datetimepicker.trigger('xchange.ocms_dtp');
							options.onChangeMonth&&options.onChangeMonth.call&&options.onChangeMonth.call(datetimepicker,_ocms_dtp_datetime.currentTime,datetimepicker.data('input'));
							
							if( year!=_ocms_dtp_datetime.currentTime.getFullYear() && $.isFunction(options.onChangeYear) ){
								options.onChangeYear.call(datetimepicker,_ocms_dtp_datetime.currentTime,datetimepicker.data('input'));
							}
						});


				// set options
				datetimepicker.setOptions = function( _options ) {
					options = $.extend(true,{},options,_options);
					
					if( _options.allowTimes && Array.isArray(_options.allowTimes) && _options.allowTimes.length ){
						options['allowTimes'] = $.extend(true,[],_options.allowTimes);
					}
					
					if( _options.weekends && Array.isArray(_options.weekends) && _options.weekends.length ){
						options['weekends'] = $.extend(true,[],_options.weekends);
					}
					
					if( (options.open||options.opened)&&(!options.inline) ) {
						input.trigger('open.ocms_dtp');
					}

					if( options.inline ) {
						triggerAfterOpen = true;
						datetimepicker.addClass('ocms_dtp_inline');
						input.after(datetimepicker).hide();
					}

					if( options.inverseButton ) {
						options.next = 'ocms_dtp_prev';
						options.prev = 'ocms_dtp_next';
					}

					if( options.datepicker )
						datepicker.addClass('active');
					else
						datepicker.removeClass('active');

					if( options.timepicker )
						timepicker.addClass('active');
					else
						timepicker.removeClass('active');

					if( options.value ){
						input&&input.val&&input.val(options.value);
						_ocms_dtp_datetime.setCurrentTime(options.value);
					}

					if( isNaN(options.dayOfWeekStart) )
						options.dayOfWeekStart = 0;
					else
						options.dayOfWeekStart = parseInt(options.dayOfWeekStart)%7;

					if( !options.timepickerScrollbar )
						scrollbar.hide();
					
					if( options.minDate && /^-(.*)$/.test(options.minDate) ){
						options.minDate = _ocms_dtp_datetime.strToDateTime(options.minDate).dateFormat( options.formatDate );
					}
					
					if( options.maxDate &&  /^\+(.*)$/.test(options.maxDate) ) {
						options.maxDate = _ocms_dtp_datetime.strToDateTime(options.maxDate).dateFormat( options.formatDate );
					}
					
					month_picker
						.find('.ocms_dtp_today_button')
							.css('visibility',!options.todayButton?'hidden':'visible');

					if( options.mask ) {
						var e,
							getCaretPos = function ( input ) {
								try{
									if ( document.selection && document.selection.createRange ) {
										var range = document.selection.createRange();
										return range.getBookmark().charCodeAt(2) - 2;
									}else
										if ( input.setSelectionRange )
											return input.selectionStart;
								}catch(e) {
									return 0;
								}
							},
							setCaretPos = function ( node,pos ) {
								node = (typeof node == "string" || node instanceof String) ? document.getElementById(node) : node;
								if(!node) {
									return false;
								}else if(node.createTextRange) {
									var textRange = node.createTextRange();
									textRange.collapse(true);
									textRange.moveEnd(pos);
									textRange.moveStart(pos);
									textRange.select();
									return true;
								}else if(node.setSelectionRange) {
									node.setSelectionRange(pos,pos);
									return true;
								}
								return false;
							},
							isValidValue = function ( mask,value ) {
								var reg = mask
									.replace(/([\[\]\/\{\}\(\)\-\.\+]{1})/g,'\\$1')
									.replace(/_/g,'{digit+}')
									.replace(/([0-9]{1})/g,'{digit$1}')
									.replace(/\{digit([0-9]{1})\}/g,'[0-$1_]{1}')
									.replace(/\{digit[\+]\}/g,'[0-9_]{1}');
								return RegExp(reg).test(value);
							};
						input.off('keydown.ocms_dtp');
						switch(true) {
							case ( options.mask===true ):
							
								options.mask = options.format
									.replace(/Y/g,'9999')
									.replace(/F/g,'9999')
									.replace(/m/g,'19')
									.replace(/d/g,'39')
									.replace(/H/g,'29')
									.replace(/i/g,'59')
									.replace(/s/g,'59');
									
							case (typeof (options.mask || undefined) == 'string' ):
							
								if( !isValidValue( options.mask,input.val() ) )
									input.val(options.mask.replace(/[0-9]/g,'_'));

								input.on('keydown.ocms_dtp',function( event ) {
									var val = this.value,
										key = event.which;
										
									switch(true) {
										case (( key>=KEY0&&key<=KEY9 )||( key>=_KEY0&&key<=_KEY9 ))||(key==BACKSPACE||key==DEL):
											var pos = getCaretPos(this),
												digit = ( key!=BACKSPACE&&key!=DEL )?String.fromCharCode((_KEY0 <= key && key <= _KEY9)? key-KEY0 : key):'_';
											
											if( (key==BACKSPACE||key==DEL)&&pos ) {
												pos--;
												digit='_';
											}
											
											while( /[^0-9_]/.test(options.mask.substr(pos,1))&&pos<options.mask.length&&pos>0 )
												pos+=( key==BACKSPACE||key==DEL )?-1:1;

											val = val.substr(0,pos)+digit+val.substr(pos+1);
											if( $.trim(val)=='' ){
												val = options.mask.replace(/[0-9]/g,'_');
											}else{
												if( pos==options.mask.length )
													break;
											}
											
											pos+=(key==BACKSPACE||key==DEL)?0:1;
											while( /[^0-9_]/.test(options.mask.substr(pos,1))&&pos<options.mask.length&&pos>0 )
												pos+=(key==BACKSPACE||key==DEL)?-1:1;
												
											if( isValidValue( options.mask,val ) ) {
												this.value = val;
												setCaretPos(this,pos);
											}else if( $.trim(val)=='' )
												this.value = options.mask.replace(/[0-9]/g,'_');
											else{
												input.trigger('error_input.ocms_dtp');
											}
										break;
										case ( !!~([AKEY,CKEY,VKEY,ZKEY,YKEY].indexOf(key))&&ctrlDown ):
										 case !!~([ESC,ARROWUP,ARROWDOWN,ARROWLEFT,ARROWRIGHT,F5,CTRLKEY,TAB,ENTER].indexOf(key)):
										return true;
									}
									event.preventDefault();
									return false;
								});
							break;
						}
					}
					if( options.validateOnBlur ) {
						input
							.off('blur.ocms_dtp')
							.on('blur.ocms_dtp', function() {
								if( options.allowBlank && !$.trim($(this).val()).length ) {
									$(this).val(null);
									datetimepicker.data('ocms_dtp_datetime').empty();
								}else if( !Date.parseDate( $(this).val(), options.format ) ) {
									$(this).val((_ocms_dtp_datetime.now()).dateFormat( options.format ));
									datetimepicker.data('ocms_dtp_datetime').setCurrentTime($(this).val());
								}
								else{
									datetimepicker.data('ocms_dtp_datetime').setCurrentTime($(this).val());
 								}
								datetimepicker.trigger('changedatetime.ocms_dtp');
							});
					}
					options.dayOfWeekStartPrev = (options.dayOfWeekStart==0)?6:options.dayOfWeekStart-1;
					
					datetimepicker
						.trigger('xchange.ocms_dtp')
						.trigger('afterOpen.ocms_dtp')
				};

				datetimepicker
					.data('options',options)
					.on('mousedown.ocms_dtp',function( event ) {
						event.stopPropagation();
						event.preventDefault();
						yearselect.hide();
						monthselect.hide();
						return false;
					});

				var scroll_element = timepicker.find('.ocms_dtp_time_box');
				scroll_element.append(timebox);
				scroll_element.ocms_dtpScroller();
				
				datetimepicker.on('afterOpen.ocms_dtp',function() {
					scroll_element.ocms_dtpScroller();
				});

				datetimepicker
					.append(datepicker)
					.append(timepicker);

				if( options.withoutCopyright!==true )
					datetimepicker
						.append(ocms_dtp_copyright);

				datepicker
					.append(month_picker)
					.append(calendar);

				$(options.parentID)
					.append(datetimepicker);

				var _ocms_dtp_datetime = new function() {
					var _this = this;
					_this.now = function( norecursion ) {
						var d = new Date();
						
						if( !norecursion && options.defaultDate  ){
							var date = _this.strToDate(options.defaultDate);
							d.setFullYear( date.getFullYear() );
							d.setMonth( date.getMonth() );
							d.setDate( date.getDate() );
						}
						
						if( options.yearOffset  ){
							d.setFullYear(d.getFullYear()+options.yearOffset);
						}
						
						if( !norecursion && options.defaultTime ){
							var time = _this.strtotime(options.defaultTime);
							d.setHours( time.getHours() );
							d.setMinutes( time.getMinutes() );
						}
							
						return d;
					};

					
					_this.isValidDate = function (d) {
						if ( Object.prototype.toString.call(d) !== "[object Date]" )
							return false;
						return !isNaN(d.getTime());
					};

					_this.setCurrentTime = function( dTime ) {
						_this.currentTime = (typeof dTime == 'string')? _this.strToDateTime(dTime) : _this.isValidDate(dTime) ? dTime: _this.now();
						datetimepicker.trigger('xchange.ocms_dtp');
					};

					_this.empty = function() {
						_this.currentTime = null;
					};

					_this.getCurrentTime = function( dTime) {
						return _this.currentTime;
					};

					_this.nextMonth = function() {
						var month = _this.currentTime.getMonth()+1;
						if( month==12 ) {
							_this.currentTime.setFullYear(_this.currentTime.getFullYear()+1);
							month = 0;
						}
						var year = _this.currentTime.getFullYear();
						
						_this.currentTime.setDate(
							Math.min(
								// Day 0 is the last day in the previous month, but we want to know the number of days in the current month, so we need to evaluate the subsequent month (month+1)
								new Date(_this.currentTime.getFullYear(), month+1, 0).getDate(),
								_this.currentTime.getDate()
							)
						);
						_this.currentTime.setMonth(month);
						options.onChangeMonth&&options.onChangeMonth.call&&options.onChangeMonth.call(datetimepicker,_ocms_dtp_datetime.currentTime,datetimepicker.data('input'));
						
						if( year!=_this.currentTime.getFullYear() && $.isFunction(options.onChangeYear) ){
							options.onChangeYear.call(datetimepicker,_ocms_dtp_datetime.currentTime,datetimepicker.data('input'));
						}
						
						datetimepicker.trigger('xchange.ocms_dtp');
						return month;
					};

					_this.prevMonth = function() {
						var month = _this.currentTime.getMonth()-1;
						if( month==-1 ) {
							_this.currentTime.setFullYear(_this.currentTime.getFullYear()-1);
							month = 11;
						}
						_this.currentTime.setDate(
							Math.min(
								// Day 0 is the last day in the previous month, but we want to know the number of days in the current month, so we need to evaluate the subsequent month (month+1)
								new Date(_this.currentTime.getFullYear(), month+1, 0).getDate(),
								_this.currentTime.getDate()
							)
						);
						_this.currentTime.setMonth(month);
						options.onChangeMonth&&options.onChangeMonth.call&&options.onChangeMonth.call(datetimepicker,_ocms_dtp_datetime.currentTime,datetimepicker.data('input'));
						datetimepicker.trigger('xchange.ocms_dtp');
						return month;
					};
					
					_this.getWeekOfYear = function( datetime ) {
						var onejan = new Date( datetime.getFullYear(),0,1 );
						return Math.ceil((((datetime - onejan) / 86400000) + onejan.getDay()+1)/7);
					};
					
					_this.strToDateTime = function( sDateTime ) {
						if( sDateTime && sDateTime instanceof Date && _this.isValidDate(sDateTime) )
							return sDateTime;
						
						var tmpDate = [],timeOffset,currentTime;
					
						if( ( tmpDate = /^(\+|\-)(.*)$/.exec(sDateTime) )  && ( tmpDate[2]=Date.parseDate(tmpDate[2], options.formatDate) ) ) {
							timeOffset = tmpDate[2].getTime()-(tmpDate[2].getTimezoneOffset())*60000;
							currentTime = new Date((_ocms_dtp_datetime.now()).getTime()+parseInt(tmpDate[1]+'1')*timeOffset);
						}else
							currentTime = sDateTime?Date.parseDate(sDateTime, options.format):_this.now();
							
						if( !_this.isValidDate(currentTime) )
							currentTime = _this.now();
							
						return currentTime;
					};

					_this.strToDate = function( sDate ) {
						if( sDate && sDate instanceof Date && _this.isValidDate(sDate) )
							return sDate;
						
						var currentTime = sDate?Date.parseDate(sDate, options.formatDate):_this.now(true);
						if( !_this.isValidDate(currentTime) )
							currentTime = _this.now(true);
							
						return currentTime;
					};

					_this.strtotime = function( sTime ) {
						if( sTime && sTime instanceof Date && _this.isValidDate(sTime) )
							return sTime;
							
						var currentTime = sTime?Date.parseDate(sTime, options.formatTime):_this.now(true);
						if( !_this.isValidDate(currentTime) )
							currentTime = _this.now(true);
							
						return currentTime;
					};

					_this.str = function() {
						return _this.currentTime.dateFormat(options.format);
					};
					
					_this.currentTime = this.now();
				};
				month_picker
					.find('.ocms_dtp_today_button')
						.on('mousedown.ocms_dtp',function() {
							datetimepicker.data('changed',true);
							_ocms_dtp_datetime.setCurrentTime(0);
							datetimepicker.trigger('afterOpen.ocms_dtp');
						}).on('dblclick.ocms_dtp',function(){
							input.val( _ocms_dtp_datetime.str() );
							datetimepicker.trigger('close.ocms_dtp');
						});
				month_picker
					.find('.ocms_dtp_prev,.ocms_dtp_next')
						.on('mousedown.ocms_dtp',function() {
							var $this = $(this),
								timer = 0,
								stop = false;

							(function arguments_callee1(v) {
								var month =  _ocms_dtp_datetime.currentTime.getMonth();
								if( $this.hasClass( options.next ) ) {
									_ocms_dtp_datetime.nextMonth();
								}else if( $this.hasClass( options.prev ) ) {
									_ocms_dtp_datetime.prevMonth();
								}
								if (options.monthChangeSpinner) {
									!stop&&(timer = setTimeout(arguments_callee1,v?v:100));
								}
							})(500);

							$([document.body,window]).on('mouseup.ocms_dtp',function arguments_callee2() {
								clearTimeout(timer);
								stop = true;
								$([document.body,window]).off('mouseup.ocms_dtp',arguments_callee2);
							});
						});

				timepicker
					.find('.ocms_dtp_prev,.ocms_dtp_next')
						.on('mousedown.ocms_dtp',function() {
							var $this = $(this),
								timer = 0,
								stop = false,
								period = 110;
							(function arguments_callee4(v) {
								var pheight = timeboxparent[0].clientHeight,
									height = timebox[0].offsetHeight,
									top = Math.abs(parseInt(timebox.css('marginTop')));
								if( $this.hasClass(options.next) && (height-pheight)- options.timeHeightInTimePicker>=top ) {
									timebox.css('marginTop','-'+(top+options.timeHeightInTimePicker)+'px')
								}else if( $this.hasClass(options.prev) && top-options.timeHeightInTimePicker>=0  ) {
									timebox.css('marginTop','-'+(top-options.timeHeightInTimePicker)+'px')
								}
								timeboxparent.trigger('scroll_element.ocms_dtp_scroller',[Math.abs(parseInt(timebox.css('marginTop'))/(height-pheight))]);
								period= ( period>10 )?10:period-10;
								!stop&&(timer = setTimeout(arguments_callee4,v?v:period));
							})(500);
							$([document.body,window]).on('mouseup.ocms_dtp',function arguments_callee5() {
								clearTimeout(timer);
								stop = true;
								$([document.body,window])
									.off('mouseup.ocms_dtp',arguments_callee5);
							});
						});

				var xchangeTimer = 0;
				// base handler - generating a calendar and timepicker
				datetimepicker
					.on('xchange.ocms_dtp',function( event ) {
						clearTimeout(xchangeTimer);
						xchangeTimer = setTimeout(function(){
							var table 	=	'',
									start	= new Date(_ocms_dtp_datetime.currentTime.getFullYear(),_ocms_dtp_datetime.currentTime.getMonth(),1, 12, 0, 0),
									i = 0,
									today = _ocms_dtp_datetime.now();
								
								while( start.getDay()!=options.dayOfWeekStart )
									start.setDate(start.getDate()-1);

								//generate calendar
								table+='<table><thead><tr>';

								if(options.weeks) {
									table+='<th></th>';
								}

								// days
								for(var j = 0; j<7; j++) {
									table+='<th>'+options.i18n[options.lang].dayOfWeek[(j+options.dayOfWeekStart)%7]+'</th>';
								}

								table+='</tr></thead>';
								table+='<tbody>';
								var maxDate = false, minDate = false;
								
								if( options.maxDate!==false ) {
									maxDate = _ocms_dtp_datetime.strToDate(options.maxDate);
									maxDate = new Date(maxDate.getFullYear(),maxDate.getMonth(),maxDate.getDate(),23,59,59,999);
								}
								
								if( options.minDate!==false ) {
									minDate = _ocms_dtp_datetime.strToDate(options.minDate);
									minDate = new Date(minDate.getFullYear(),minDate.getMonth(),minDate.getDate());
								}
								
								var d,y,m,w,classes = [],customDateSettings,newRow=true;
								
								while( i<_ocms_dtp_datetime.currentTime.countDaysInMonth()||start.getDay()!=options.dayOfWeekStart||_ocms_dtp_datetime.currentTime.getMonth()==start.getMonth() ) {
									classes = [];
									i++;

									d = start.getDate(); 
									y = start.getFullYear(); 
									m = start.getMonth(); 
									w = _ocms_dtp_datetime.getWeekOfYear(start);

									classes.push('ocms_dtp_date');

									if ( options.beforeShowDay && options.beforeShowDay.call ) {
										customDateSettings = options.beforeShowDay.call(datetimepicker, start);
									} else {
										customDateSettings = null;
									}

									if( ( maxDate!==false && start > maxDate )||(  minDate!==false && start < minDate )||(customDateSettings && customDateSettings[0] === false) ){
										classes.push('ocms_dtp_disabled');
									}

									if ( customDateSettings && customDateSettings[1] != "" ) {
										classes.push(customDateSettings[1]);
									}

									if( _ocms_dtp_datetime.currentTime.getMonth()!=m ) classes.push('ocms_dtp_other_month');

									if( (options.defaultSelect||datetimepicker.data('changed')) && _ocms_dtp_datetime.currentTime.dateFormat( options.formatDate )==start.dateFormat( options.formatDate ) ) {
										classes.push('ocms_dtp_current');
									}

									if( today.dateFormat( options.formatDate )==start.dateFormat( options.formatDate ) ) {
										classes.push('ocms_dtp_today');
									}

									if( start.getDay()==0||start.getDay()==6||~options.weekends.indexOf(start.dateFormat( options.formatDate )) ) {
										classes.push('ocms_dtp_weekend');
									}

									if(options.beforeShowDay && typeof options.beforeShowDay == 'function') {
										classes.push(options.beforeShowDay(start))
									}

									if( newRow ) {
										table+='<tr>';
										newRow = false;
										
										if(options.weeks) {
											table+='<th>'+w+'</th>';
										}
									}

									table+='<td data-date="'+d+'" data-month="'+m+'" data-year="'+y+'"'+' class="ocms_dtp_date ocms_dtp_day_of_week'+start.getDay()+' '+ classes.join(' ')+'">'+
												'<div>'+d+'</div>'+
											'</td>';

									if( start.getDay()==options.dayOfWeekStartPrev ) {
										table+='</tr>';
										newRow = true;
									}

									start.setDate(d+1);
								}
								table+='</tbody></table>';

								calendar.html(table);

								month_picker.find('.ocms_dtp_label span').eq(0).text(options.i18n[options.lang].months[_ocms_dtp_datetime.currentTime.getMonth()]);
								month_picker.find('.ocms_dtp_label span').eq(1).text(_ocms_dtp_datetime.currentTime.getFullYear());

								// generate timebox
								var time = '',
									h = '',
									m ='',
									line_time = function line_time( h,m ) {
										var now = _ocms_dtp_datetime.now();
										now.setHours(h);
										h = parseInt(now.getHours());
										now.setMinutes(m);
										m = parseInt(now.getMinutes());

										classes = [];
										if( (options.maxTime!==false&&_ocms_dtp_datetime.strtotime(options.maxTime).getTime()<now.getTime())||(options.minTime!==false&&_ocms_dtp_datetime.strtotime(options.minTime).getTime()>now.getTime()))
											classes.push('ocms_dtp_disabled');
										if( (options.initTime||options.defaultSelect||datetimepicker.data('changed')) && parseInt(_ocms_dtp_datetime.currentTime.getHours())==parseInt(h)&&(options.step>59||Math[options.roundTime](_ocms_dtp_datetime.currentTime.getMinutes()/options.step)*options.step==parseInt(m))) {
											if( options.defaultSelect||datetimepicker.data('changed')) {
												classes.push('ocms_dtp_current');
											} else if( options.initTime ) {
												classes.push('ocms_dtp_init_time');
											}
										}
										if( parseInt(today.getHours())==parseInt(h)&&parseInt(today.getMinutes())==parseInt(m))
											classes.push('ocms_dtp_today');
										time+= '<div class="ocms_dtp_time '+classes.join(' ')+'" data-hour="'+h+'" data-minute="'+m+'">'+now.dateFormat(options.formatTime)+'</div>';
									};

								if( !options.allowTimes || !Array.isArray(options.allowTimes) || !options.allowTimes.length ) {
									for( var i=0,j=0;i<(options.hours12?12:24);i++ ) {
										for( j=0;j<60;j+=options.step ) {
											h = (i<10?'0':'')+i;
											m = (j<10?'0':'')+j;
											line_time( h,m );
										}
									}
								}else{
									for( var i=0;i<options.allowTimes.length;i++ ) {
										h = _ocms_dtp_datetime.strtotime(options.allowTimes[i]).getHours();
										m = _ocms_dtp_datetime.strtotime(options.allowTimes[i]).getMinutes();
										line_time( h,m );
									}
								}

								timebox.html(time);

								var opt = '',
									i = 0;

								for( i = parseInt(options.yearStart,10)+options.yearOffset;i<= parseInt(options.yearEnd,10)+options.yearOffset;i++ ) {
									opt+='<div class="ocms_dtp_option '+(_ocms_dtp_datetime.currentTime.getFullYear()==i?'ocms_dtp_current':'')+'" data-value="'+i+'">'+i+'</div>';
								}
								yearselect.children().eq(0)
														.html(opt);

								for( i = 0,opt = '';i<= 11;i++ ) {
									opt+='<div class="ocms_dtp_option '+(_ocms_dtp_datetime.currentTime.getMonth()==i?'ocms_dtp_current':'')+'" data-value="'+i+'">'+options.i18n[options.lang].months[i]+'</div>';
								}
								monthselect.children().eq(0).html(opt);
								$(datetimepicker)
									.trigger('generate.ocms_dtp');
						},10);
						event.stopPropagation();
					})
					.on('afterOpen.ocms_dtp',function() {
						if( options.timepicker ) {
							var classType;
							if( timebox.find('.ocms_dtp_current').length ) {
								classType = '.ocms_dtp_current';
							} else if( timebox.find('.ocms_dtp_init_time').length ) {
								classType = '.ocms_dtp_init_time';
							}
							
							if( classType ) {
								var pheight = timeboxparent[0].clientHeight,
									height = timebox[0].offsetHeight,
									top = timebox.find(classType).index()*options.timeHeightInTimePicker+1;
								if( (height-pheight)<top )
									top = height-pheight;
								timeboxparent.trigger('scroll_element.ocms_dtp_scroller',[parseInt(top)/(height-pheight)]);
							}else{
								timeboxparent.trigger('scroll_element.ocms_dtp_scroller',[0]);
							}
						}
					});
				
				var timerclick = 0;
				
				calendar
					.on('click.ocms_dtp', 'td', function (xdevent) {
					  xdevent.stopPropagation();  // Prevents closing of Pop-ups, Modals and Flyouts in Bootstrap
						timerclick++;
						var $this = $(this),
							currentTime = _ocms_dtp_datetime.currentTime;
						
						if( currentTime===undefined||currentTime===null ){
                            _ocms_dtp_datetime.currentTime = _ocms_dtp_datetime.now();
                            currentTime = _ocms_dtp_datetime.currentTime;
                        }
						
						if( $this.hasClass('ocms_dtp_disabled') )
							return false;

						currentTime.setDate( 1 );
						currentTime.setFullYear( $this.data('year') );
						currentTime.setMonth( $this.data('month') );
						currentTime.setDate( $this.data('date') );
						
						datetimepicker.trigger('select.ocms_dtp',[currentTime]);

						input.val( _ocms_dtp_datetime.str() );
						if( (timerclick>1||(options.closeOnDateSelect===true||( options.closeOnDateSelect===0&&!options.timepicker )))&&!options.inline ) {
							datetimepicker.trigger('close.ocms_dtp');
						}

						if( options.onSelectDate &&	options.onSelectDate.call ) {
							options.onSelectDate.call(datetimepicker,_ocms_dtp_datetime.currentTime,datetimepicker.data('input'));
						}

						datetimepicker.data('changed',true);
						datetimepicker.trigger('xchange.ocms_dtp');
						datetimepicker.trigger('changedatetime.ocms_dtp');
						setTimeout(function(){
							timerclick = 0;
						},200);
					});

				timebox
					.on('click.ocms_dtp', 'div', function (xdevent) {
					    xdevent.stopPropagation(); // NAJ: Prevents closing of Pop-ups, Modals and Flyouts
						var $this = $(this),
							currentTime = _ocms_dtp_datetime.currentTime;
						
						if( currentTime===undefined||currentTime===null ){
                            _ocms_dtp_datetime.currentTime = _ocms_dtp_datetime.now();
                            currentTime = _ocms_dtp_datetime.currentTime;
                        }
						
						if( $this.hasClass('ocms_dtp_disabled') )
							return false;
						currentTime.setHours($this.data('hour'));
						currentTime.setMinutes($this.data('minute'));
						datetimepicker.trigger('select.ocms_dtp',[currentTime]);

						datetimepicker.data('input').val( _ocms_dtp_datetime.str() );

						!options.inline&&datetimepicker.trigger('close.ocms_dtp');

						if( options.onSelectTime&&options.onSelectTime.call ) {
							options.onSelectTime.call(datetimepicker,_ocms_dtp_datetime.currentTime,datetimepicker.data('input'));
						}
						datetimepicker.data('changed',true);
						datetimepicker.trigger('xchange.ocms_dtp');
						datetimepicker.trigger('changedatetime.ocms_dtp');
					});

				datetimepicker.mousewheel&&datepicker.mousewheel(function(event, delta, deltaX, deltaY) {
					if( !options.scrollMonth )
						return true;
					if( delta<0 )
						_ocms_dtp_datetime.nextMonth();
					else
						_ocms_dtp_datetime.prevMonth();
					return false;
				});

				datetimepicker.mousewheel&&timeboxparent.unmousewheel().mousewheel(function(event, delta, deltaX, deltaY) {
					if( !options.scrollTime )
						return true;
					var pheight = timeboxparent[0].clientHeight,
						height = timebox[0].offsetHeight,
						top = Math.abs(parseInt(timebox.css('marginTop'))),
						fl = true;
					if( delta<0 && (height-pheight)-options.timeHeightInTimePicker>=top ) {
						timebox.css('marginTop','-'+(top+options.timeHeightInTimePicker)+'px');
						fl = false;
					}else if( delta>0&&top-options.timeHeightInTimePicker>=0 ) {
						timebox.css('marginTop','-'+(top-options.timeHeightInTimePicker)+'px');
						fl = false;
					}
					timeboxparent.trigger('scroll_element.ocms_dtp_scroller',[Math.abs(parseInt(timebox.css('marginTop'))/(height-pheight))]);
					event.stopPropagation();
					return fl;
				});
				
				var triggerAfterOpen = false;
				datetimepicker
					.on('changedatetime.ocms_dtp',function() {
						if( options.onChangeDateTime&&options.onChangeDateTime.call ) {
							var $input = datetimepicker.data('input');
							options.onChangeDateTime.call(datetimepicker, _ocms_dtp_datetime.currentTime, $input);
							delete options.value;
							$input.trigger('change');
						}
					})
					.on('generate.ocms_dtp',function() {
						if( options.onGenerate&&options.onGenerate.call )
							options.onGenerate.call(datetimepicker,_ocms_dtp_datetime.currentTime,datetimepicker.data('input'));
						if( triggerAfterOpen ){
							datetimepicker.trigger('afterOpen.ocms_dtp');
							triggerAfterOpen = false;
						}
					})
					.on( 'click.ocms_dtp', function( xdevent ) {
						xdevent.stopPropagation();  // Prevents closing of Pop-ups, Modals and Flyouts in Bootstrap
					});

				var current_time_index = 0;
				input.mousewheel&&input.mousewheel(function( event, delta, deltaX, deltaY ) {
					if( !options.scrollInput )
						return true;
					if( !options.datepicker && options.timepicker ) {
						current_time_index = timebox.find('.ocms_dtp_current').length?timebox.find('.ocms_dtp_current').eq(0).index():0;
						if( current_time_index+delta>=0&&current_time_index+delta<timebox.children().length )
							current_time_index+=delta;
						timebox.children().eq(current_time_index).length&&timebox.children().eq(current_time_index).trigger('mousedown');
						return false;
					}else if( options.datepicker && !options.timepicker ) {
						datepicker.trigger( event, [delta, deltaX, deltaY]);
						input.val&&input.val( _ocms_dtp_datetime.str() );
						datetimepicker.trigger('changedatetime.ocms_dtp');
						return false;
					}
				});
				var setPos = function() {
					var offset = datetimepicker.data('input').offset(), top = offset.top+datetimepicker.data('input')[0].offsetHeight-1, left = offset.left, position = "absolute";
					if (options.fixed) {
						top -= $(window).scrollTop();
						left -= $(window).scrollLeft();
						position = "fixed";
					}else {
						if( top+datetimepicker[0].offsetHeight>$(window).height()+$(window).scrollTop() )
							top = offset.top-datetimepicker[0].offsetHeight+1;
							if (top < 0)
								top = 0;
						if( left+datetimepicker[0].offsetWidth>$(window).width() )
							left = $(window).width()-datetimepicker[0].offsetWidth;
					}
					datetimepicker.css({
						left:left,
						top:top,
						position: position
					});
				};
				datetimepicker
					.on('open.ocms_dtp', function() {
						var onShow = true;
						if( options.onShow&&options.onShow.call) {
							onShow = options.onShow.call(datetimepicker,_ocms_dtp_datetime.currentTime,datetimepicker.data('input'));
						}
						if( onShow!==false ) {
							datetimepicker.show();
							setPos();
							$(window)
								.off('resize.ocms_dtp',setPos)
								.on('resize.ocms_dtp',setPos);

							if( options.closeOnWithoutClick ) {
								$([document.body,window]).on('mousedown.ocms_dtp',function arguments_callee6() {
									datetimepicker.trigger('close.ocms_dtp');
									$([document.body,window]).off('mousedown.ocms_dtp',arguments_callee6);
								});
							}
						}
					})
					.on('close.ocms_dtp', function( event ) {
						var onClose = true;
						
						month_picker
							.find('.ocms_dtp_month,.ocms_dtp_year')
								.find('.ocms_dtp_select')
									.hide();
						
						if( options.onClose&&options.onClose.call ) {
							onClose=options.onClose.call(datetimepicker,_ocms_dtp_datetime.currentTime,datetimepicker.data('input'));
						}
						if( onClose!==false&&!options.opened&&!options.inline ) {
							datetimepicker.hide();
						}
						event.stopPropagation();
					})
					.data('input',input);

				var timer = 0,
					timer1 = 0;

				datetimepicker.data('ocms_dtp_datetime',_ocms_dtp_datetime);
				datetimepicker.setOptions(options);
				
				function getCurrentValue(){

					var ct = false;

                    if ( options.startDate ) {
                        ct = _ocms_dtp_datetime.strToDate(options.startDate);
                    } else {
                        ct = options.value?options.value:(input&&input.val&&input.val())?input.val():'';
						if( ct ) {
							ct = _ocms_dtp_datetime.strToDateTime(ct);
						} else if ( options.defaultDate ) {
							ct = _ocms_dtp_datetime.strToDate(options.defaultDate);
							if( options.defaultTime ){
								var time = _ocms_dtp_datetime.strtotime(options.defaultTime);
								ct.setHours( time.getHours() );
								ct.setMinutes( time.getMinutes() );
							}
						}
                    }

					if ( ct && _ocms_dtp_datetime.isValidDate(ct) ) {
						datetimepicker.data('changed',true);
					} else {
                        ct = '';
                    }
					
					return ct?ct:0;
				}
				//debugger
				_ocms_dtp_datetime.setCurrentTime( getCurrentValue() );

				input
					.data( 'ocms_dtp_datetimepicker',datetimepicker )
					.on('open.ocms_dtp focusin.ocms_dtp mousedown.ocms_dtp',function(event) {
						if( input.is(':disabled')||input.is(':hidden')||!input.is(':visible')||(input.data('ocms_dtp_datetimepicker').is(':visible') && options.closeOnInputClick) )
							return;
						clearTimeout(timer);
						timer = setTimeout(function() {
							if( input.is(':disabled')||input.is(':hidden')||!input.is(':visible') )
								return;
								
							triggerAfterOpen = true;
							_ocms_dtp_datetime.setCurrentTime(getCurrentValue());
							
							datetimepicker.trigger('open.ocms_dtp');
						},100);
					})
					.on('keydown.ocms_dtp',function( event ) {
						var val = this.value,
							key = event.which;
						switch(true) {
							case !!~([ENTER].indexOf(key)):
								var elementSelector = $("input:visible,textarea:visible");
								datetimepicker.trigger('close.ocms_dtp');
								elementSelector.eq(elementSelector.index(this) + 1).focus();
							return false;
							case !!~[TAB].indexOf(key):
								datetimepicker.trigger('close.ocms_dtp');
							return true;
						}
					});
			},
			destroyDateTimePicker = function( input ) {
				var datetimepicker = input.data('ocms_dtp_datetimepicker');
				if( datetimepicker ) {
					datetimepicker.data('ocms_dtp_datetime',null);
					datetimepicker.remove();
					input
						.data( 'ocms_dtp_datetimepicker',null )
						.off( 'open.ocms_dtp focusin.ocms_dtp focusout.ocms_dtp mousedown.ocms_dtp blur.ocms_dtp keydown.ocms_dtp' );
					$(window).off('resize.ocms_dtp');
					$([window,document.body]).off('mousedown.ocms_dtp');
					input.unmousewheel&&input.unmousewheel();
				}
			};
		$(document)
			.off('keydown.ocms_dtpctrl keyup.ocms_dtpctrl')
			.on('keydown.ocms_dtpctrl',function(e) {
				if ( e.keyCode == CTRLKEY )
					ctrlDown = true;
			})
			.on('keyup.ocms_dtpctrl',function(e) {
				if ( e.keyCode == CTRLKEY )
					ctrlDown = false;
			});
		return this.each(function() {
			var datetimepicker;
			if( datetimepicker = $(this).data('ocms_dtp_datetimepicker') ) {
				if(typeof (opt || undefined) === 'string' ) {
					switch(opt) {
						case 'show':
							$(this).select().focus();
							datetimepicker.trigger( 'open.ocms_dtp' );
						break;
						case 'hide':
							datetimepicker.trigger('close.ocms_dtp');
						break;
						case 'destroy':
							destroyDateTimePicker($(this));
						break;
						case 'reset':
							this.value = this.defaultValue;
							if(!this.value || !datetimepicker.data('ocms_dtp_datetime').isValidDate(Date.parseDate(this.value, options.format)))
								datetimepicker.data('changed',false);
							datetimepicker.data('ocms_dtp_datetime').setCurrentTime(this.value);
						break;
					}
				}else{
					datetimepicker
						.setOptions(opt);
				}
				return 0;
			}else
				if( (typeof (opt || undefined) !== 'string') ){
					if( !options.lazyInit||options.open||options.inline ){
						createDateTimePicker($(this));
					}else
						lazyInit($(this));
				}
		});
	};
	$.fn.datetimepicker.defaults = default_options;
})( jQuery );

/*
 * Copyright (c) 2013 Brandon Aaron (http://brandonaaron.net)
 *
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
(function(factory) {if(typeof define==='function'&&define.amd) {define(['jquery'],factory)}else if(typeof exports==='object') {module.exports=factory}else{factory(jQuery)}}(function($) {var toFix=['wheel','mousewheel','DOMMouseScroll','MozMousePixelScroll'];var toBind='onwheel'in document||document.documentMode>=9?['wheel']:['mousewheel','DomMouseScroll','MozMousePixelScroll'];var lowestDelta,lowestDeltaXY;if($.event.fixHooks) {for(var i=toFix.length;i;) {$.event.fixHooks[toFix[--i]]=$.event.mouseHooks}}$.event.special.mousewheel={setup:function() {if(this.addEventListener) {for(var i=toBind.length;i;) {this.addEventListener(toBind[--i],handler,false)}}else{this.onmousewheel=handler}},teardown:function() {if(this.removeEventListener) {for(var i=toBind.length;i;) {this.removeEventListener(toBind[--i],handler,false)}}else{this.onmousewheel=null}}};$.fn.extend({mousewheel:function(fn) {return fn?this.on("mousewheel",fn):this.trigger("mousewheel")},unmousewheel:function(fn) {return this.off("mousewheel",fn)}});function handler(event) {var orgEvent=event||window.event,args=[].slice.call(arguments,1),delta=0,deltaX=0,deltaY=0,absDelta=0,absDeltaXY=0,fn;event=$.event.fix(orgEvent);event.type="mousewheel";if(orgEvent.wheelDelta) {delta=orgEvent.wheelDelta}if(orgEvent.detail) {delta=orgEvent.detail*-1}if(orgEvent.deltaY) {deltaY=orgEvent.deltaY*-1;delta=deltaY}if(orgEvent.deltaX) {deltaX=orgEvent.deltaX;delta=deltaX*-1}if(orgEvent.wheelDeltaY!==undefined) {deltaY=orgEvent.wheelDeltaY}if(orgEvent.wheelDeltaX!==undefined) {deltaX=orgEvent.wheelDeltaX*-1}absDelta=Math.abs(delta);if(!lowestDelta||absDelta<lowestDelta) {lowestDelta=absDelta}absDeltaXY=Math.max(Math.abs(deltaY),Math.abs(deltaX));if(!lowestDeltaXY||absDeltaXY<lowestDeltaXY) {lowestDeltaXY=absDeltaXY}fn=delta>0?'floor':'ceil';delta=Math[fn](delta/lowestDelta);deltaX=Math[fn](deltaX/lowestDeltaXY);deltaY=Math[fn](deltaY/lowestDeltaXY);args.unshift(event,delta,deltaX,deltaY);return($.event.dispatch||$.event.handle).apply(this,args)}}));


// Parse and Format Library
//http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/
/*
 * Copyright (C) 2004 Baron Schwartz <baron at sequent dot org>
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by the
 * Free Software Foundation, version 2.1.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
 * details.
 */
Date.parseFunctions={count:0};Date.parseRegexes=[];Date.formatFunctions={count:0};Date.prototype.dateFormat=function(b){if(b=="unixtime"){return parseInt(this.getTime()/1000);}if(Date.formatFunctions[b]==null){Date.createNewFormat(b);}var a=Date.formatFunctions[b];return this[a]();};Date.createNewFormat=function(format){var funcName="format"+Date.formatFunctions.count++;Date.formatFunctions[format]=funcName;var code="Date.prototype."+funcName+" = function() {return ";var special=false;var ch="";for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true;}else{if(special){special=false;code+="'"+String.escape(ch)+"' + ";}else{code+=Date.getFormatCode(ch);}}}eval(code.substring(0,code.length-3)+";}");};Date.getFormatCode=function(a){switch(a){case"d":return"String.leftPad(this.getDate(), 2, '0') + ";case"D":return"Date.dayNames[this.getDay()].substring(0, 3) + ";case"j":return"this.getDate() + ";case"l":return"Date.dayNames[this.getDay()] + ";case"S":return"this.getSuffix() + ";case"w":return"this.getDay() + ";case"z":return"this.getDayOfYear() + ";case"W":return"this.getWeekOfYear() + ";case"F":return"Date.monthNames[this.getMonth()] + ";case"m":return"String.leftPad(this.getMonth() + 1, 2, '0') + ";case"M":return"Date.monthNames[this.getMonth()].substring(0, 3) + ";case"n":return"(this.getMonth() + 1) + ";case"t":return"this.getDaysInMonth() + ";case"L":return"(this.isLeapYear() ? 1 : 0) + ";case"Y":return"this.getFullYear() + ";case"y":return"('' + this.getFullYear()).substring(2, 4) + ";case"a":return"(this.getHours() < 12 ? 'am' : 'pm') + ";case"A":return"(this.getHours() < 12 ? 'AM' : 'PM') + ";case"g":return"((this.getHours() %12) ? this.getHours() % 12 : 12) + ";case"G":return"this.getHours() + ";case"h":return"String.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";case"H":return"String.leftPad(this.getHours(), 2, '0') + ";case"i":return"String.leftPad(this.getMinutes(), 2, '0') + ";case"s":return"String.leftPad(this.getSeconds(), 2, '0') + ";case"O":return"this.getGMTOffset() + ";case"T":return"this.getTimezone() + ";case"Z":return"(this.getTimezoneOffset() * -60) + ";default:return"'"+String.escape(a)+"' + ";}};Date.parseDate=function(a,c){if(c=="unixtime"){return new Date(!isNaN(parseInt(a))?parseInt(a)*1000:0);}if(Date.parseFunctions[c]==null){Date.createParser(c);}var b=Date.parseFunctions[c];return Date[b](a);};Date.createParser=function(format){var funcName="parse"+Date.parseFunctions.count++;var regexNum=Date.parseRegexes.length;var currentGroup=1;Date.parseFunctions[format]=funcName;var code="Date."+funcName+" = function(input) {\nvar y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, z = -1;\nvar d = new Date();\ny = d.getFullYear();\nm = d.getMonth();\nd = d.getDate();\nvar results = input.match(Date.parseRegexes["+regexNum+"]);\nif (results && results.length > 0) {";var regex="";var special=false;var ch="";for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true;}else{if(special){special=false;regex+=String.escape(ch);}else{obj=Date.formatCodeToRegex(ch,currentGroup);currentGroup+=obj.g;regex+=obj.s;if(obj.g&&obj.c){code+=obj.c;}}}}code+="if (y > 0 && z > 0){\nvar doyDate = new Date(y,0);\ndoyDate.setDate(z);\nm = doyDate.getMonth();\nd = doyDate.getDate();\n}";code+="if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n{return new Date(y, m, d, h, i, s);}\nelse if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n{return new Date(y, m, d, h, i);}\nelse if (y > 0 && m >= 0 && d > 0 && h >= 0)\n{return new Date(y, m, d, h);}\nelse if (y > 0 && m >= 0 && d > 0)\n{return new Date(y, m, d);}\nelse if (y > 0 && m >= 0)\n{return new Date(y, m);}\nelse if (y > 0)\n{return new Date(y);}\n}return null;}";Date.parseRegexes[regexNum]=new RegExp("^"+regex+"$");eval(code);};Date.formatCodeToRegex=function(b,a){switch(b){case"D":return{g:0,c:null,s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};case"j":case"d":return{g:1,c:"d = parseInt(results["+a+"], 10);\n",s:"(\\d{1,2})"};case"l":return{g:0,c:null,s:"(?:"+Date.dayNames.join("|")+")"};case"S":return{g:0,c:null,s:"(?:st|nd|rd|th)"};case"w":return{g:0,c:null,s:"\\d"};case"z":return{g:1,c:"z = parseInt(results["+a+"], 10);\n",s:"(\\d{1,3})"};case"W":return{g:0,c:null,s:"(?:\\d{2})"};case"F":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+a+"].substring(0, 3)], 10);\n",s:"("+Date.monthNames.join("|")+")"};case"M":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+a+"]], 10);\n",s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};case"n":case"m":return{g:1,c:"m = parseInt(results["+a+"], 10) - 1;\n",s:"(\\d{1,2})"};case"t":return{g:0,c:null,s:"\\d{1,2}"};case"L":return{g:0,c:null,s:"(?:1|0)"};case"Y":return{g:1,c:"y = parseInt(results["+a+"], 10);\n",s:"(\\d{4})"};case"y":return{g:1,c:"var ty = parseInt(results["+a+"], 10);\ny = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",s:"(\\d{1,2})"};case"a":return{g:1,c:"if (results["+a+"] == 'am') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",s:"(am|pm)"};case"A":return{g:1,c:"if (results["+a+"] == 'AM') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",s:"(AM|PM)"};case"g":case"G":case"h":case"H":return{g:1,c:"h = parseInt(results["+a+"], 10);\n",s:"(\\d{1,2})"};case"i":return{g:1,c:"i = parseInt(results["+a+"], 10);\n",s:"(\\d{2})"};case"s":return{g:1,c:"s = parseInt(results["+a+"], 10);\n",s:"(\\d{2})"};case"O":return{g:0,c:null,s:"[+-]\\d{4}"};case"T":return{g:0,c:null,s:"[A-Z]{3}"};case"Z":return{g:0,c:null,s:"[+-]\\d{1,5}"};default:return{g:0,c:null,s:String.escape(b)};}};Date.prototype.getTimezone=function(){return this.toString().replace(/^.*? ([A-Z]{3}) [0-9]{4}.*$/,"$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/,"$1$2$3");};Date.prototype.getGMTOffset=function(){return(this.getTimezoneOffset()>0?"-":"+")+String.leftPad(Math.floor(Math.abs(this.getTimezoneOffset())/60),2,"0")+String.leftPad(Math.abs(this.getTimezoneOffset())%60,2,"0");};Date.prototype.getDayOfYear=function(){var a=0;Date.daysInMonth[1]=this.isLeapYear()?29:28;for(var b=0;b<this.getMonth();++b){a+=Date.daysInMonth[b];}return a+this.getDate();};Date.prototype.getWeekOfYear=function(){var b=this.getDayOfYear()+(4-this.getDay());var a=new Date(this.getFullYear(),0,1);var c=(7-a.getDay()+4);return String.leftPad(Math.ceil((b-c)/7)+1,2,"0");};Date.prototype.isLeapYear=function(){var a=this.getFullYear();return((a&3)==0&&(a%100||(a%400==0&&a)));};Date.prototype.getFirstDayOfMonth=function(){var a=(this.getDay()-(this.getDate()-1))%7;return(a<0)?(a+7):a;};Date.prototype.getLastDayOfMonth=function(){var a=(this.getDay()+(Date.daysInMonth[this.getMonth()]-this.getDate()))%7;return(a<0)?(a+7):a;};Date.prototype.getDaysInMonth=function(){Date.daysInMonth[1]=this.isLeapYear()?29:28;return Date.daysInMonth[this.getMonth()];};Date.prototype.getSuffix=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};String.escape=function(a){return a.replace(/('|\\)/g,"\\$1");};String.leftPad=function(d,b,c){var a=new String(d);if(c==null){c=" ";}while(a.length<b){a=c+a;}return a;};Date.daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];Date.monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];Date.dayNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];Date.y2kYear=50;Date.monthNumbers={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};Date.patterns={ISO8601LongPattern:"Y-m-d H:i:s",ISO8601ShortPattern:"Y-m-d",ShortDatePattern:"n/j/Y",LongDatePattern:"l, F d, Y",FullDateTimePattern:"l, F d, Y g:i:s A",MonthDayPattern:"F d",ShortTimePattern:"g:i A",LongTimePattern:"g:i:s A",SortableDateTimePattern:"Y-m-d\\TH:i:s",UniversalSortableDateTimePattern:"Y-m-d H:i:sO",YearMonthPattern:"F, Y"};