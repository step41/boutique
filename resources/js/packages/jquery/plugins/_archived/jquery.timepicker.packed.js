(function($){$.ui.timepicker=$.ui.timepicker||{};if($.ui.timepicker.version){return}$.extend($.ui,{timepicker:{version:"1.0.3"}});function Timepicker(){this.regional=[];this.regional['']={currentText:'Now',closeText:'Done',ampm:false,amNames:['AM','A'],pmNames:['PM','P'],timeFormat:'hh:mm tt',timeSuffix:'',timeOnlyTitle:'Choose Time',timeText:'Time',hourText:'Hour',minuteText:'Minute',secondText:'Second',millisecText:'Millisecond',timezoneText:'Time Zone'};this._defaults={showButtonPanel:true,timeOnly:false,showHour:true,showMinute:true,showSecond:false,showMillisec:false,showTimezone:false,showTime:true,stepHour:1,stepMinute:1,stepSecond:1,stepMillisec:1,hour:0,minute:0,second:0,millisec:0,timezone:null,useLocalTimezone:false,defaultTimezone:"+0000",hourMin:0,minuteMin:0,secondMin:0,millisecMin:0,hourMax:23,minuteMax:59,secondMax:59,millisecMax:999,minDateTime:null,maxDateTime:null,onSelect:null,hourGrid:0,minuteGrid:0,secondGrid:0,millisecGrid:0,alwaysSetTime:true,separator:' ',altFieldTimeOnly:true,altSeparator:null,altTimeSuffix:null,showTimepicker:true,timezoneIso8601:false,timezoneList:null,addSliderAccess:false,sliderAccessArgs:null,defaultValue:null};$.extend(this._defaults,this.regional[''])}$.extend(Timepicker.prototype,{$input:null,$altInput:null,$timeObj:null,inst:null,hour_slider:null,minute_slider:null,second_slider:null,millisec_slider:null,timezone_select:null,hour:0,minute:0,second:0,millisec:0,timezone:null,defaultTimezone:"+0000",hourMinOriginal:null,minuteMinOriginal:null,secondMinOriginal:null,millisecMinOriginal:null,hourMaxOriginal:null,minuteMaxOriginal:null,secondMaxOriginal:null,millisecMaxOriginal:null,ampm:'',formattedDate:'',formattedTime:'',formattedDateTime:'',timezoneList:null,units:['hour','minute','second','millisec'],setDefaults:function(a){extendRemove(this._defaults,a||{});return this},_newInst:function(d,o){var e=new Timepicker(),inlineSettings={};for(var f in this._defaults){if(this._defaults.hasOwnProperty(f)){var g=d.attr('time:'+f);if(g){try{inlineSettings[f]=eval(g)}catch(err){inlineSettings[f]=g}}}}e._defaults=$.extend({},this._defaults,inlineSettings,o,{beforeShow:function(a,b){if($.isFunction(o.beforeShow)){return o.beforeShow(a,b,e)}},onChangeMonthYear:function(a,b,c){e._updateDateTime(c);if($.isFunction(o.onChangeMonthYear)){o.onChangeMonthYear.call(d[0],a,b,c,e)}},onClose:function(a,b){if(e.timeDefined===true&&d.val()!==''){e._updateDateTime(b)}if($.isFunction(o.onClose)){o.onClose.call(d[0],a,b,e)}},timepicker:e});e.amNames=$.map(e._defaults.amNames,function(a){return a.toUpperCase()});e.pmNames=$.map(e._defaults.pmNames,function(a){return a.toUpperCase()});if(e._defaults.timezoneList===null){var h=['-1200','-1100','-1000','-0930','-0900','-0800','-0700','-0600','-0500','-0430','-0400','-0330','-0300','-0200','-0100','+0000','+0100','+0200','+0300','+0330','+0400','+0430','+0500','+0530','+0545','+0600','+0630','+0700','+0800','+0845','+0900','+0930','+1000','+1030','+1100','+1130','+1200','+1245','+1300','+1400'];if(e._defaults.timezoneIso8601){h=$.map(h,function(a){return a=='+0000'?'Z':(a.substring(0,3)+':'+a.substring(3))})}e._defaults.timezoneList=h}e.timezone=e._defaults.timezone;e.hour=e._defaults.hour;e.minute=e._defaults.minute;e.second=e._defaults.second;e.millisec=e._defaults.millisec;e.ampm='';e.$input=d;if(o.altField){e.$altInput=$(o.altField).css({cursor:'pointer'}).focus(function(){d.trigger("focus")})}if(e._defaults.minDate===0||e._defaults.minDateTime===0){e._defaults.minDate=new Date()}if(e._defaults.maxDate===0||e._defaults.maxDateTime===0){e._defaults.maxDate=new Date()}if(e._defaults.minDate!==undefined&&e._defaults.minDate instanceof Date){e._defaults.minDateTime=new Date(e._defaults.minDate.getTime())}if(e._defaults.minDateTime!==undefined&&e._defaults.minDateTime instanceof Date){e._defaults.minDate=new Date(e._defaults.minDateTime.getTime())}if(e._defaults.maxDate!==undefined&&e._defaults.maxDate instanceof Date){e._defaults.maxDateTime=new Date(e._defaults.maxDate.getTime())}if(e._defaults.maxDateTime!==undefined&&e._defaults.maxDateTime instanceof Date){e._defaults.maxDate=new Date(e._defaults.maxDateTime.getTime())}e.$input.bind('focus',function(){e._onFocus()});return e},_addTimePicker:function(a){var b=(this.$altInput&&this._defaults.altFieldTimeOnly)?this.$input.val()+' '+this.$altInput.val():this.$input.val();this.timeDefined=this._parseTime(b);this._limitMinMaxDateTime(a,false);this._injectTimePicker()},_parseTime:function(a,b){if(!this.inst){this.inst=$.datepicker._getInst(this.$input[0])}if(b||!this._defaults.timeOnly){var c=$.datepicker._get(this.inst,'dateFormat');try{var d=u(c,this._defaults.timeFormat,a,$.datepicker._getFormatConfig(this.inst),this._defaults);if(!d.timeObj){return false}$.extend(this,d.timeObj)}catch(err){return false}return true}else{var e=$.datepicker.parseTime(this._defaults.timeFormat,a,this._defaults);if(!e){return false}$.extend(this,e);return true}},_injectTimePicker:function(){var c=this.inst.dpDiv,o=this.inst.settings,tp_inst=this,litem='',uitem='',max={},gridSize={},size=null;if(c.find("div.ui-timepicker-div").length===0&&o.showTimepicker){var d=' style="display:none;"',html='<div class="ui-timepicker-div"><dl>'+'<dt class="ui_tpicker_time_label"'+((o.showTime)?'':d)+'>'+o.timeText+'</dt>'+'<dd class="ui_tpicker_time"'+((o.showTime)?'':d)+'></dd>';for(var i=0,l=this.units.length;i<l;i++){litem=this.units[i];uitem=litem.substr(0,1).toUpperCase()+litem.substr(1);max[litem]=parseInt((o[litem+'Max']-((o[litem+'Max']-o[litem+'Min'])%o['step'+uitem])),10);gridSize[litem]=0;html+='<dt class="ui_tpicker_'+litem+'_label"'+((o['show'+uitem])?'':d)+'>'+o[litem+'Text']+'</dt>'+'<dd class="ui_tpicker_'+litem+'"><div class="ui_tpicker_'+litem+'_slider"'+((o['show'+uitem])?'':d)+'></div>';if(o['show'+uitem]&&o[litem+'Grid']>0){html+='<div style="padding-left: 1px"><table class="ui-tpicker-grid-label"><tr>';if(litem=='hour'){for(var h=o[litem+'Min'];h<=max[litem];h+=parseInt(o[litem+'Grid'],10)){gridSize[litem]++;var g=(o.ampm&&h>12)?h-12:h;if(g<10){g='0'+g}if(o.ampm){if(h===0){g=12+'a'}else{if(h<12){g+='a'}else{g+='p'}}}html+='<td data-for="'+litem+'">'+g+'</td>'}}else{for(var m=o[litem+'Min'];m<=max[litem];m+=parseInt(o[litem+'Grid'],10)){gridSize[litem]++;html+='<td data-for="'+litem+'">'+((m<10)?'0':'')+m+'</td>'}}html+='</tr></table></div>'}html+='</dd>'}html+='<dt class="ui_tpicker_timezone_label"'+((o.showTimezone)?'':d)+'>'+o.timezoneText+'</dt>';html+='<dd class="ui_tpicker_timezone" '+((o.showTimezone)?'':d)+'></dd>';html+='</dl></div>';var j=$(html);if(o.timeOnly===true){j.prepend('<div class="ui-widget-header ui-helper-clearfix ui-corner-all">'+'<div class="ui-datepicker-title">'+o.timeOnlyTitle+'</div>'+'</div>');c.find('.ui-datepicker-header, .ui-datepicker-calendar').hide()}this.hour_slider=j.find('.ui_tpicker_hour_slider').prop('slide',null).slider({orientation:"horizontal",value:this.hour,min:o.hourMin,max:max.hour,step:o.stepHour,slide:function(a,b){tp_inst.hour_slider.slider("option","value",b.value);tp_inst._onTimeChange()},stop:function(a,b){tp_inst._onSelectHandler()}});this.minute_slider=j.find('.ui_tpicker_minute_slider').prop('slide',null).slider({orientation:"horizontal",value:this.minute,min:o.minuteMin,max:max.minute,step:o.stepMinute,slide:function(a,b){tp_inst.minute_slider.slider("option","value",b.value);tp_inst._onTimeChange()},stop:function(a,b){tp_inst._onSelectHandler()}});this.second_slider=j.find('.ui_tpicker_second_slider').prop('slide',null).slider({orientation:"horizontal",value:this.second,min:o.secondMin,max:max.second,step:o.stepSecond,slide:function(a,b){tp_inst.second_slider.slider("option","value",b.value);tp_inst._onTimeChange()},stop:function(a,b){tp_inst._onSelectHandler()}});this.millisec_slider=j.find('.ui_tpicker_millisec_slider').prop('slide',null).slider({orientation:"horizontal",value:this.millisec,min:o.millisecMin,max:max.millisec,step:o.stepMillisec,slide:function(a,b){tp_inst.millisec_slider.slider("option","value",b.value);tp_inst._onTimeChange()},stop:function(a,b){tp_inst._onSelectHandler()}});for(var i=0,l=tp_inst.units.length;i<l;i++){litem=tp_inst.units[i];uitem=litem.substr(0,1).toUpperCase()+litem.substr(1);if(o['show'+uitem]&&o[litem+'Grid']>0){size=100*gridSize[litem]*o[litem+'Grid']/(max[litem]-o[litem+'Min']);j.find('.ui_tpicker_'+litem+' table').css({width:size+"%",marginLeft:(size/(-2*gridSize[litem]))+"%",borderCollapse:'collapse'}).find("td").click(function(e){var a=$(this),h=a.html(),f=a.data('for');if(f=='hour'&&o.ampm){var b=h.substring(2).toLowerCase(),aph=parseInt(h.substring(0,2),10);if(b=='a'){if(aph==12){h=0}else{h=aph}}else if(aph==12){h=12}else{h=aph+12}}tp_inst[f+'_slider'].slider("option","value",parseInt(h,10));tp_inst._onTimeChange();tp_inst._onSelectHandler()}).css({cursor:'pointer',width:(100/gridSize[litem])+'%',textAlign:'center',overflow:'hidden'})}}this.timezone_select=j.find('.ui_tpicker_timezone').append('<select></select>').find("select");$.fn.append.apply(this.timezone_select,$.map(o.timezoneList,function(a,b){return $("<option />").val(typeof a=="object"?a.value:a).text(typeof a=="object"?a.label:a)}));if(typeof(this.timezone)!="undefined"&&this.timezone!==null&&this.timezone!==""){var k=new Date(this.inst.selectedYear,this.inst.selectedMonth,this.inst.selectedDay,12);var n=$.timepicker.timeZoneOffsetString(k);if(n==this.timezone){v(tp_inst)}else{this.timezone_select.val(this.timezone)}}else{if(typeof(this.hour)!="undefined"&&this.hour!==null&&this.hour!==""){this.timezone_select.val(o.defaultTimezone)}else{v(tp_inst)}}this.timezone_select.change(function(){tp_inst._defaults.useLocalTimezone=false;tp_inst._onTimeChange()});var p=c.find('.ui-datepicker-buttonpane');if(p.length){p.before(j)}else{c.append(j)}this.$timeObj=j.find('.ui_tpicker_time');if(this.inst!==null){var q=this.timeDefined;this._onTimeChange();this.timeDefined=q}if(this._defaults.addSliderAccess){var r=this._defaults.sliderAccessArgs;setTimeout(function(){if(j.find('.ui-slider-access').length===0){j.find('.ui-slider:visible').sliderAccess(r);var b=j.find('.ui-slider-access:eq(0)').outerWidth(true);if(b){j.find('table:visible').each(function(){var a=$(this),oldWidth=a.outerWidth(),oldMarginLeft=a.css('marginLeft').toString().replace('%',''),newWidth=oldWidth-b,newMarginLeft=((oldMarginLeft*newWidth)/oldWidth)+'%';a.css({width:newWidth,marginLeft:newMarginLeft})})}}},10)}}},_limitMinMaxDateTime:function(a,b){var o=this._defaults,dp_date=new Date(a.selectedYear,a.selectedMonth,a.selectedDay);if(!this._defaults.showTimepicker){return}if($.datepicker._get(a,'minDateTime')!==null&&$.datepicker._get(a,'minDateTime')!==undefined&&dp_date){var c=$.datepicker._get(a,'minDateTime'),minDateTimeDate=new Date(c.getFullYear(),c.getMonth(),c.getDate(),0,0,0,0);if(this.hourMinOriginal===null||this.minuteMinOriginal===null||this.secondMinOriginal===null||this.millisecMinOriginal===null){this.hourMinOriginal=o.hourMin;this.minuteMinOriginal=o.minuteMin;this.secondMinOriginal=o.secondMin;this.millisecMinOriginal=o.millisecMin}if(a.settings.timeOnly||minDateTimeDate.getTime()==dp_date.getTime()){this._defaults.hourMin=c.getHours();if(this.hour<=this._defaults.hourMin){this.hour=this._defaults.hourMin;this._defaults.minuteMin=c.getMinutes();if(this.minute<=this._defaults.minuteMin){this.minute=this._defaults.minuteMin;this._defaults.secondMin=c.getSeconds();if(this.second<=this._defaults.secondMin){this.second=this._defaults.secondMin;this._defaults.millisecMin=c.getMilliseconds()}else{if(this.millisec<this._defaults.millisecMin){this.millisec=this._defaults.millisecMin}this._defaults.millisecMin=this.millisecMinOriginal}}else{this._defaults.secondMin=this.secondMinOriginal;this._defaults.millisecMin=this.millisecMinOriginal}}else{this._defaults.minuteMin=this.minuteMinOriginal;this._defaults.secondMin=this.secondMinOriginal;this._defaults.millisecMin=this.millisecMinOriginal}}else{this._defaults.hourMin=this.hourMinOriginal;this._defaults.minuteMin=this.minuteMinOriginal;this._defaults.secondMin=this.secondMinOriginal;this._defaults.millisecMin=this.millisecMinOriginal}}if($.datepicker._get(a,'maxDateTime')!==null&&$.datepicker._get(a,'maxDateTime')!==undefined&&dp_date){var d=$.datepicker._get(a,'maxDateTime'),maxDateTimeDate=new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0,0);if(this.hourMaxOriginal===null||this.minuteMaxOriginal===null||this.secondMaxOriginal===null){this.hourMaxOriginal=o.hourMax;this.minuteMaxOriginal=o.minuteMax;this.secondMaxOriginal=o.secondMax;this.millisecMaxOriginal=o.millisecMax}if(a.settings.timeOnly||maxDateTimeDate.getTime()==dp_date.getTime()){this._defaults.hourMax=d.getHours();if(this.hour>=this._defaults.hourMax){this.hour=this._defaults.hourMax;this._defaults.minuteMax=d.getMinutes();if(this.minute>=this._defaults.minuteMax){this.minute=this._defaults.minuteMax;this._defaults.secondMax=d.getSeconds()}else if(this.second>=this._defaults.secondMax){this.second=this._defaults.secondMax;this._defaults.millisecMax=d.getMilliseconds()}else{if(this.millisec>this._defaults.millisecMax){this.millisec=this._defaults.millisecMax}this._defaults.millisecMax=this.millisecMaxOriginal}}else{this._defaults.minuteMax=this.minuteMaxOriginal;this._defaults.secondMax=this.secondMaxOriginal;this._defaults.millisecMax=this.millisecMaxOriginal}}else{this._defaults.hourMax=this.hourMaxOriginal;this._defaults.minuteMax=this.minuteMaxOriginal;this._defaults.secondMax=this.secondMaxOriginal;this._defaults.millisecMax=this.millisecMaxOriginal}}if(b!==undefined&&b===true){var e=parseInt((this._defaults.hourMax-((this._defaults.hourMax-this._defaults.hourMin)%this._defaults.stepHour)),10),minMax=parseInt((this._defaults.minuteMax-((this._defaults.minuteMax-this._defaults.minuteMin)%this._defaults.stepMinute)),10),secMax=parseInt((this._defaults.secondMax-((this._defaults.secondMax-this._defaults.secondMin)%this._defaults.stepSecond)),10),millisecMax=parseInt((this._defaults.millisecMax-((this._defaults.millisecMax-this._defaults.millisecMin)%this._defaults.stepMillisec)),10);if(this.hour_slider){this.hour_slider.slider("option",{min:this._defaults.hourMin,max:e}).slider('value',this.hour)}if(this.minute_slider){this.minute_slider.slider("option",{min:this._defaults.minuteMin,max:minMax}).slider('value',this.minute)}if(this.second_slider){this.second_slider.slider("option",{min:this._defaults.secondMin,max:secMax}).slider('value',this.second)}if(this.millisec_slider){this.millisec_slider.slider("option",{min:this._defaults.millisecMin,max:millisecMax}).slider('value',this.millisec)}}},_onTimeChange:function(){var a=(this.hour_slider)?this.hour_slider.slider('value'):false,minute=(this.minute_slider)?this.minute_slider.slider('value'):false,second=(this.second_slider)?this.second_slider.slider('value'):false,millisec=(this.millisec_slider)?this.millisec_slider.slider('value'):false,timezone=(this.timezone_select)?this.timezone_select.val():false,o=this._defaults;if(typeof(a)=='object'){a=false}if(typeof(minute)=='object'){minute=false}if(typeof(second)=='object'){second=false}if(typeof(millisec)=='object'){millisec=false}if(typeof(timezone)=='object'){timezone=false}if(a!==false){a=parseInt(a,10)}if(minute!==false){minute=parseInt(minute,10)}if(second!==false){second=parseInt(second,10)}if(millisec!==false){millisec=parseInt(millisec,10)}var b=o[a<12?'amNames':'pmNames'][0];var c=(a!=this.hour||minute!=this.minute||second!=this.second||millisec!=this.millisec||(this.ampm.length>0&&(a<12)!=($.inArray(this.ampm.toUpperCase(),this.amNames)!==-1))||((this.timezone===null&&timezone!=this.defaultTimezone)||(this.timezone!==null&&timezone!=this.timezone)));if(c){if(a!==false){this.hour=a}if(minute!==false){this.minute=minute}if(second!==false){this.second=second}if(millisec!==false){this.millisec=millisec}if(timezone!==false){this.timezone=timezone}if(!this.inst){this.inst=$.datepicker._getInst(this.$input[0])}this._limitMinMaxDateTime(this.inst,true)}if(o.ampm){this.ampm=b}this.formattedTime=$.datepicker.formatTime(this._defaults.timeFormat,this,this._defaults);if(this.$timeObj){this.$timeObj.text(this.formattedTime+o.timeSuffix)}this.timeDefined=true;if(c){this._updateDateTime()}},_onSelectHandler:function(){var a=this._defaults.onSelect||this.inst.settings.onSelect;var b=this.$input?this.$input[0]:null;if(a&&b){a.apply(b,[this.formattedDateTime,this])}},_formatTime:function(a,b){a=a||{hour:this.hour,minute:this.minute,second:this.second,millisec:this.millisec,ampm:this.ampm,timezone:this.timezone};var c=(b||this._defaults.timeFormat).toString();c=$.datepicker.formatTime(c,a,this._defaults);if(arguments.length){return c}else{this.formattedTime=c}},_updateDateTime:function(a){a=this.inst||a;var b=$.datepicker._daylightSavingAdjust(new Date(a.selectedYear,a.selectedMonth,a.selectedDay)),dateFmt=$.datepicker._get(a,'dateFormat'),formatCfg=$.datepicker._getFormatConfig(a),timeAvailable=b!==null&&this.timeDefined;this.formattedDate=$.datepicker.formatDate(dateFmt,(b===null?new Date():b),formatCfg);var c=this.formattedDate;if(this._defaults.timeOnly===true){c=this.formattedTime}else if(this._defaults.timeOnly!==true&&(this._defaults.alwaysSetTime||timeAvailable)){c+=this._defaults.separator+this.formattedTime+this._defaults.timeSuffix}this.formattedDateTime=c;if(!this._defaults.showTimepicker){this.$input.val(this.formattedDate)}else if(this.$altInput&&this._defaults.altFieldTimeOnly===true){this.$altInput.val(this.formattedTime);this.$input.val(this.formattedDate)}else if(this.$altInput){this.$input.val(c);var d='',altSeparator=this._defaults.altSeparator?this._defaults.altSeparator:this._defaults.separator,altTimeSuffix=this._defaults.altTimeSuffix?this._defaults.altTimeSuffix:this._defaults.timeSuffix;if(this._defaults.altFormat)d=$.datepicker.formatDate(this._defaults.altFormat,(b===null?new Date():b),formatCfg);else d=this.formattedDate;if(d)d+=altSeparator;if(this._defaults.altTimeFormat)d+=$.datepicker.formatTime(this._defaults.altTimeFormat,this,this._defaults)+altTimeSuffix;else d+=this.formattedTime+altTimeSuffix;this.$altInput.val(d)}else{this.$input.val(c)}this.$input.trigger("change")},_onFocus:function(){if(!this.$input.val()&&this._defaults.defaultValue){this.$input.val(this._defaults.defaultValue);var a=$.datepicker._getInst(this.$input.get(0)),tp_inst=$.datepicker._get(a,'timepicker');if(tp_inst){if(tp_inst._defaults.timeOnly&&(a.input.val()!=a.lastVal)){try{$.datepicker._updateDatepicker(a)}catch(err){$.datepicker.log(err)}}}}}});$.fn.extend({timepicker:function(o){o=o||{};var a=Array.prototype.slice.call(arguments);if(typeof o=='object'){a[0]=$.extend(o,{timeOnly:true})}return $(this).each(function(){$.fn.datetimepicker.apply($(this),a)})},datetimepicker:function(o){o=o||{};var b=arguments;if(typeof(o)=='string'){if(o=='getDate'){return $.fn.datepicker.apply($(this[0]),b)}else{return this.each(function(){var a=$(this);a.datepicker.apply(a,b)})}}else{return this.each(function(){var a=$(this);a.datepicker($.timepicker._newInst(a,o)._defaults)})}}});$.datepicker.parseDateTime=function(a,b,c,d,e){var f=u(a,b,c,d,e);if(f.timeObj){var t=f.timeObj;f.date.setHours(t.hour,t.minute,t.second,t.millisec)}return f.date};$.datepicker.parseTime=function(e,f,g){var h=function(b,c){var d=[];if(b){$.merge(d,b)}if(c){$.merge(d,c)}d=$.map(d,function(a){return a.replace(/[.*+?|()\[\]{}\\]/g,'\\$&')});return'('+d.join('|')+')?'};var j=function(a){var b=a.toLowerCase().match(/(h{1,2}|m{1,2}|s{1,2}|l{1}|t{1,2}|z)/g),orders={h:-1,m:-1,s:-1,l:-1,t:-1,z:-1};if(b){for(var i=0;i<b.length;i++){if(orders[b[i].toString().charAt(0)]==-1){orders[b[i].toString().charAt(0)]=i+1}}}return orders};var o=extendRemove(extendRemove({},$.timepicker._defaults),g||{});var k='^'+e.toString().replace(/h{1,2}/ig,'(\\d?\\d)').replace(/m{1,2}/ig,'(\\d?\\d)').replace(/s{1,2}/ig,'(\\d?\\d)').replace(/l{1}/ig,'(\\d?\\d?\\d)').replace(/t{1,2}/ig,h(o.amNames,o.pmNames)).replace(/z{1}/ig,'(z|[-+]\\d\\d:?\\d\\d|\\S+)?').replace(/\s/g,'\\s?')+o.timeSuffix+'$',order=j(e),ampm='',treg;treg=f.match(new RegExp(k,'i'));var l={hour:0,minute:0,second:0,millisec:0};if(treg){if(order.t!==-1){if(treg[order.t]===undefined||treg[order.t].length===0){ampm='';l.ampm=''}else{ampm=$.inArray(treg[order.t].toUpperCase(),o.amNames)!==-1?'AM':'PM';l.ampm=o[ampm=='AM'?'amNames':'pmNames'][0]}}if(order.h!==-1){if(ampm=='AM'&&treg[order.h]=='12'){l.hour=0}else{if(ampm=='PM'&&treg[order.h]!='12'){l.hour=parseInt(treg[order.h],10)+12}else{l.hour=Number(treg[order.h])}}}if(order.m!==-1){l.minute=Number(treg[order.m])}if(order.s!==-1){l.second=Number(treg[order.s])}if(order.l!==-1){l.millisec=Number(treg[order.l])}if(order.z!==-1&&treg[order.z]!==undefined){var m=treg[order.z].toUpperCase();switch(m.length){case 1:m=o.timezoneIso8601?'Z':'+0000';break;case 5:if(o.timezoneIso8601){m=m.substring(1)=='0000'?'Z':m.substring(0,3)+':'+m.substring(3)}break;case 6:if(!o.timezoneIso8601){m=m=='Z'||m.substring(1)=='00:00'?'+0000':m.replace(/:/,'')}else{if(m.substring(1)=='00:00'){m='Z'}}break}l.timezone=m}return l}return false};$.datepicker.formatTime=function(b,c,d){d=d||{};d=$.extend({},$.timepicker._defaults,d);c=$.extend({hour:0,minute:0,second:0,millisec:0,timezone:'+0000'},c);var e=b;var f=d.amNames[0];var g=parseInt(c.hour,10);if(d.ampm){if(g>11){f=d.pmNames[0];if(g>12){g=g%12}}if(g===0){g=12}}e=e.replace(/(?:hh?|mm?|ss?|[tT]{1,2}|[lz]|('.*?'|".*?"))/g,function(a){switch(a.toLowerCase()){case'hh':return('0'+g).slice(-2);case'h':return g;case'mm':return('0'+c.minute).slice(-2);case'm':return c.minute;case'ss':return('0'+c.second).slice(-2);case's':return c.second;case'l':return('00'+c.millisec).slice(-3);case'z':return c.timezone;case't':case'tt':if(d.ampm){if(a.length==1){f=f.charAt(0)}return a.charAt(0)==='T'?f.toUpperCase():f.toLowerCase()}return'';default:return a.replace(/\'/g,"")||"'"}});e=$.trim(e);return e};$.datepicker._base_selectDate=$.datepicker._selectDate;$.datepicker._selectDate=function(a,b){var c=this._getInst($(a)[0]),tp_inst=this._get(c,'timepicker');if(tp_inst){tp_inst._limitMinMaxDateTime(c,true);c.inline=c.stay_open=true;this._base_selectDate(a,b);c.inline=c.stay_open=false;this._notifyChange(c);this._updateDatepicker(c)}else{this._base_selectDate(a,b)}};$.datepicker._base_updateDatepicker=$.datepicker._updateDatepicker;$.datepicker._updateDatepicker=function(a){var b=a.input[0];if($.datepicker._curInst&&$.datepicker._curInst!=a&&$.datepicker._datepickerShowing&&$.datepicker._lastInput!=b){return}if(typeof(a.stay_open)!=='boolean'||a.stay_open===false){this._base_updateDatepicker(a);var c=this._get(a,'timepicker');if(c){c._addTimePicker(a);if(c._defaults.useLocalTimezone){var d=new Date(a.selectedYear,a.selectedMonth,a.selectedDay,12);v(c,d);c._onTimeChange()}}}};$.datepicker._base_doKeyPress=$.datepicker._doKeyPress;$.datepicker._doKeyPress=function(a){var b=$.datepicker._getInst(a.target),tp_inst=$.datepicker._get(b,'timepicker');if(tp_inst){if($.datepicker._get(b,'constrainInput')){var c=tp_inst._defaults.ampm,dateChars=$.datepicker._possibleChars($.datepicker._get(b,'dateFormat')),datetimeChars=tp_inst._defaults.timeFormat.toString().replace(/[hms]/g,'').replace(/TT/g,c?'APM':'').replace(/Tt/g,c?'AaPpMm':'').replace(/tT/g,c?'AaPpMm':'').replace(/T/g,c?'AP':'').replace(/tt/g,c?'apm':'').replace(/t/g,c?'ap':'')+" "+tp_inst._defaults.separator+tp_inst._defaults.timeSuffix+(tp_inst._defaults.showTimezone?tp_inst._defaults.timezoneList.join(''):'')+(tp_inst._defaults.amNames.join(''))+(tp_inst._defaults.pmNames.join(''))+dateChars,chr=String.fromCharCode(a.charCode===undefined?a.keyCode:a.charCode);return a.ctrlKey||(chr<' '||!dateChars||datetimeChars.indexOf(chr)>-1)}}return $.datepicker._base_doKeyPress(a)};$.datepicker._base_doKeyUp=$.datepicker._doKeyUp;$.datepicker._doKeyUp=function(a){var b=$.datepicker._getInst(a.target),tp_inst=$.datepicker._get(b,'timepicker');if(tp_inst){if(tp_inst._defaults.timeOnly&&(b.input.val()!=b.lastVal)){try{$.datepicker._updateDatepicker(b)}catch(err){$.datepicker.log(err)}}}return $.datepicker._base_doKeyUp(a)};$.datepicker._base_gotoToday=$.datepicker._gotoToday;$.datepicker._gotoToday=function(a){var b=this._getInst($(a)[0]),$dp=b.dpDiv;this._base_gotoToday(a);var c=this._get(b,'timepicker');v(c);var d=new Date();this._setTime(b,d);$('.ui-datepicker-today',$dp).click()};$.datepicker._disableTimepickerDatepicker=function(a){var b=this._getInst(a);if(!b){return}var c=this._get(b,'timepicker');$(a).datepicker('getDate');if(c){c._defaults.showTimepicker=false;c._updateDateTime(b)}};$.datepicker._enableTimepickerDatepicker=function(a){var b=this._getInst(a);if(!b){return}var c=this._get(b,'timepicker');$(a).datepicker('getDate');if(c){c._defaults.showTimepicker=true;c._addTimePicker(b);c._updateDateTime(b)}};$.datepicker._setTime=function(a,b){var c=this._get(a,'timepicker');if(c){var d=c._defaults,hour=b?b.getHours():d.hour,minute=b?b.getMinutes():d.minute,second=b?b.getSeconds():d.second,millisec=b?b.getMilliseconds():d.millisec;var e=hour===d.hourMin,minuteEq=minute===d.minuteMin,secondEq=second===d.secondMin;var f=false;if(hour<d.hourMin||hour>d.hourMax)f=true;else if((minute<d.minuteMin||minute>d.minuteMax)&&e)f=true;else if((second<d.secondMin||second>d.secondMax)&&e&&minuteEq)f=true;else if((millisec<d.millisecMin||millisec>d.millisecMax)&&e&&minuteEq&&secondEq)f=true;if(f){hour=d.hourMin;minute=d.minuteMin;second=d.secondMin;millisec=d.millisecMin}c.hour=hour;c.minute=minute;c.second=second;c.millisec=millisec;if(c.hour_slider)c.hour_slider.slider('value',hour);if(c.minute_slider)c.minute_slider.slider('value',minute);if(c.second_slider)c.second_slider.slider('value',second);if(c.millisec_slider)c.millisec_slider.slider('value',millisec);c._onTimeChange();c._updateDateTime(a)}};$.datepicker._setTimeDatepicker=function(a,b,c){var d=this._getInst(a);if(!d){return}var e=this._get(d,'timepicker');if(e){this._setDateFromField(d);var f;if(b){if(typeof b=="string"){e._parseTime(b,c);f=new Date();f.setHours(e.hour,e.minute,e.second,e.millisec)}else{f=new Date(b.getTime())}if(f.toString()=='Invalid Date'){f=undefined}this._setTime(d,f)}}};$.datepicker._base_setDateDatepicker=$.datepicker._setDateDatepicker;$.datepicker._setDateDatepicker=function(a,b){var c=this._getInst(a);if(!c){return}var d=(b instanceof Date)?new Date(b.getTime()):b;this._updateDatepicker(c);this._base_setDateDatepicker.apply(this,arguments);this._setTimeDatepicker(a,d,true)};$.datepicker._base_getDateDatepicker=$.datepicker._getDateDatepicker;$.datepicker._getDateDatepicker=function(a,b){var c=this._getInst(a);if(!c){return}var d=this._get(c,'timepicker');if(d){var e=this._getDate(c);if(e&&d._parseTime($(a).val(),d.timeOnly)){e.setHours(d.hour,d.minute,d.second,d.millisec)}return e}return this._base_getDateDatepicker(a,b)};$.datepicker._base_parseDate=$.datepicker.parseDate;$.datepicker.parseDate=function(a,b,c){var d=s(a,b,c);return $.datepicker._base_parseDate(a,d[0],c)};$.datepicker._base_formatDate=$.datepicker._formatDate;$.datepicker._formatDate=function(a,b,c,d){var e=this._get(a,'timepicker');if(e){e._updateDateTime(a);return e.$input.val()}return this._base_formatDate(a)};$.datepicker._base_optionDatepicker=$.datepicker._optionDatepicker;$.datepicker._optionDatepicker=function(a,b,c){var d=this._getInst(a);if(!d){return null}var e=this._get(d,'timepicker');if(e){var f=null,max=null,onselect=null;if(typeof b=='string'){if(b==='minDate'||b==='minDateTime'){f=c}else{if(b==='maxDate'||b==='maxDateTime'){max=c}else{if(b==='onSelect'){onselect=c}}}}else{if(typeof b=='object'){if(b.minDate){f=b.minDate}else{if(b.minDateTime){f=b.minDateTime}else{if(b.maxDate){max=b.maxDate}else{if(b.maxDateTime){max=b.maxDateTime}}}}}}if(f){if(f===0){f=new Date()}else{f=new Date(f)}e._defaults.minDate=f;e._defaults.minDateTime=f}else if(max){if(max===0){max=new Date()}else{max=new Date(max)}e._defaults.maxDate=max;e._defaults.maxDateTime=max}else if(onselect){e._defaults.onSelect=onselect}}if(c===undefined){return this._base_optionDatepicker(a,b)}return this._base_optionDatepicker(a,b,c)};function extendRemove(a,b){$.extend(a,b);for(var c in b){if(b[c]===null||b[c]===undefined){a[c]=b[c]}}return a}var s=function(a,b,c,d){try{var e=d&&d.separator?d.separator:$.timepicker._defaults.separator,format=d&&d.timeFormat?d.timeFormat:$.timepicker._defaults.timeFormat,ampm=d&&d.ampm?d.ampm:$.timepicker._defaults.ampm,timeParts=format.split(e),timePartsLen=timeParts.length,allParts=b.split(e),allPartsLen=allParts.length;if(!ampm){timeParts=$.trim(format.replace(/t/gi,'')).split(e);timePartsLen=timeParts.length}if(allPartsLen>0){return[allParts.splice(0,allPartsLen-timePartsLen).join(e),allParts.splice(timePartsLen*-1).join(e)]}}catch(err){if(err.indexOf(":")>=0){var f=b.length-(err.length-err.indexOf(':')-2),timeString=b.substring(f);return[$.trim(b.substring(0,f)),$.trim(b.substring(f))]}else{throw err;}}return[b,'']};var u=function(a,b,c,d,e){var f;var g=s(a,c,d,e);f=$.datepicker._base_parseDate(a,g[0],d);if(g[1]!==''){var h=g[1],parsedTime=$.datepicker.parseTime(b,h,e);if(parsedTime===null){throw'Wrong time format';}return{date:f,timeObj:parsedTime}}else{return{date:f}}};var v=function(a,b){if(a&&a.timezone_select){a._defaults.useLocalTimezone=true;var c=typeof b!=='undefined'?b:new Date();var d=$.timepicker.timeZoneOffsetString(c);if(a._defaults.timezoneIso8601){d=d.substring(0,3)+':'+d.substring(3)}a.timezone_select.val(d)}};$.timepicker=new Timepicker();$.timepicker.timeZoneOffsetString=function(a){var b=a.getTimezoneOffset()*-1,minutes=b%60,hours=(b-minutes)/60;return(b>=0?'+':'-')+('0'+(hours*101).toString()).substr(-2)+('0'+(minutes*101).toString()).substr(-2)};$.timepicker.timeRange=function(a,b,c){return $.timepicker.handleRange('timepicker',a,b,c)};$.timepicker.dateTimeRange=function(a,b,c){$.timepicker.dateRange(a,b,c,'datetimepicker')};$.timepicker.dateRange=function(a,b,c,d){d=d||'datepicker';$.timepicker.handleRange(d,a,b,c)};$.timepicker.handleRange=function(e,f,g,h){$.fn[e].call(f,$.extend({onClose:function(a,b){checkDates(this,g,a)},onSelect:function(a){selected(this,g,'minDate')}},h,h.start));$.fn[e].call(g,$.extend({onClose:function(a,b){checkDates(this,f,a)},onSelect:function(a){selected(this,f,'maxDate')}},h,h.end));if(e!='timepicker'&&h.reformat){$([f,g]).each(function(){var a=$(this)[e].call($(this),'option','dateFormat'),date=new Date($(this).val());if($(this).val()&&date){$(this).val($.datepicker.formatDate(a,date))}})}checkDates(f,g,f.val());function checkDates(a,b,c){if(b.val()&&(new Date(f.val())>new Date(g.val()))){b.val(c)}}selected(f,g,'minDate');selected(g,f,'maxDate');function selected(a,b,c){if(!$(a).val()){return}var d=$(a)[e].call($(a),'getDate');if(d.getTime){$(b)[e].call($(b),'option',c,d)}}return $([f.get(0),g.get(0)])};$.timepicker.version="1.0.3"})(jQuery);