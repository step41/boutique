;(function($){if(!x||typeof(x)!="function"){var x=function(a){var o={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"H+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),"w":"0123456".indexOf(this.getDay()),"S":this.getMilliseconds()};if(/(y+)/.test(a)){a=a.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))}for(var k in o){if(new RegExp("("+k+")").test(a))a=a.replace(RegExp.$1,RegExp.$1.length==1?o[k]:("00"+o[k]).substr((""+o[k]).length))}return a}}if(!z||typeof(A)!="function"){var z=function(a,b,c){b=parseInt(b);var d;if(typeof(c)=="string"){d=c.split(/\D/);eval("var date = new Date("+d.join(",")+")")}if(typeof(c)=="object"){d=new Date(c.toString())}switch(a){case"y":d.setFullYear(d.getFullYear()+b);break;case"m":d.setMonth(d.getMonth()+b);break;case"d":d.setDate(d.getDate()+b);break;case"w":d.setDate(d.getDate()+7*b);break;case"h":d.setHours(d.getHours()+b);break;case"n":d.setMinutes(d.getMinutes()+b);break;case"s":d.setSeconds(d.getSeconds()+b);break;case"l":d.setMilliseconds(d.getMilliseconds()+b);break}return d}}if(!A||typeof(A)!="function"){var A=function(a,b,c){switch(a){case"d":case"w":b=new Date(b.getFullYear(),b.getMonth(),b.getDate());c=new Date(c.getFullYear(),c.getMonth(),c.getDate());break;case"h":b=new Date(b.getFullYear(),b.getMonth(),b.getDate(),b.getHours());c=new Date(c.getFullYear(),c.getMonth(),c.getDate(),c.getHours());break;case"n":b=new Date(b.getFullYear(),b.getMonth(),b.getDate(),b.getHours(),b.getMinutes());c=new Date(c.getFullYear(),c.getMonth(),c.getDate(),c.getHours(),c.getMinutes());break;case"s":b=new Date(b.getFullYear(),b.getMonth(),b.getDate(),b.getHours(),b.getMinutes(),b.getSeconds());c=new Date(c.getFullYear(),c.getMonth(),c.getDate(),c.getHours(),c.getMinutes(),c.getSeconds());break}var d=b.getTime(),t2=c.getTime();var e=NaN;switch(a){case"y":e=c.getFullYear()-b.getFullYear();break;case"m":e=(c.getFullYear()-b.getFullYear())*12+c.getMonth()-b.getMonth();break;case"d":e=Math.floor(t2/86400000)-Math.floor(d/86400000);break;case"w":e=Math.floor((t2+345600000)/(604800000))-Math.floor((d+345600000)/(604800000));break;case"h":e=Math.floor(t2/3600000)-Math.floor(d/3600000);break;case"n":e=Math.floor(t2/60000)-Math.floor(d/60000);break;case"s":e=Math.floor(t2/1000)-Math.floor(d/1000);break;case"l":e=t2-d;break}return e}}var B=window.navigator.userAgent.toLowerCase();$.browser.msie8=$.browser.msie&&/msie 8\.0/i.test(B);$.browser.msie7=$.browser.msie&&/msie 7\.0/i.test(B);$.browser.msie6=!$.browser.msie8&&!$.browser.msie7&&$.browser.msie&&/msie 6\.0/i.test(B);if($.fn.noSelect==undefined){$.fn.noSelect=function(p){if(p==null)prevent=true;else prevent=p;if(prevent){return this.each(function(){if($.browser.msie||$.browser.safari)$(this).bind('selectstart',function(){return false});else if($.browser.mozilla){$(this).css('MozUserSelect','none');$('body').trigger('focus')}else if($.browser.opera)$(this).bind('mousedown',function(){return false});else $(this).attr('unselectable','on')})}else{return this.each(function(){if($.browser.msie||$.browser.safari)$(this).unbind('selectstart');else if($.browser.mozilla)$(this).css('MozUserSelect','inherit');else if($.browser.opera)$(this).unbind('mousedown');else $(this).removeAttr('unselectable','on')})}}};$.fn.wddatepicker=function(o){var q={weekStart:0,weekName:[i18n.datepicker.dateformat.sun,i18n.datepicker.dateformat.mon,i18n.datepicker.dateformat.tue,i18n.datepicker.dateformat.wed,i18n.datepicker.dateformat.thu,i18n.datepicker.dateformat.fri,i18n.datepicker.dateformat.sat],monthName:[i18n.datepicker.dateformat.jan,i18n.datepicker.dateformat.feb,i18n.datepicker.dateformat.mar,i18n.datepicker.dateformat.apr,i18n.datepicker.dateformat.may,i18n.datepicker.dateformat.jun,i18n.datepicker.dateformat.jul,i18n.datepicker.dateformat.aug,i18n.datepicker.dateformat.sep,i18n.datepicker.dateformat.oct,i18n.datepicker.dateformat.nov,i18n.datepicker.dateformat.dec],monthp:i18n.datepicker.dateformat.postfix,Year:new Date().getFullYear(),Month:new Date().getMonth()+1,Day:new Date().getDate(),today:new Date(),btnOk:i18n.datepicker.ok,btnCancel:i18n.datepicker.cancel,btnToday:i18n.datepicker.today,inputDate:null,onReturn:false,version:"1.1",applyrule:false,showtarget:null,picker:""};$.extend(q,o);var r=$("#BBIT_DP_CONTAINER");if(r.length==0){var u=[];u.push("<div id='BBIT_DP_CONTAINER' class='bbit-dp' style='width:175px;z-index:1;'>");if($.browser.msie6){u.push('<iframe style="position:absolute;z-index:-1;width:100%;height:205px;top:0;left:0;scrolling:no;" frameborder="0" src="about:blank"></iframe>')}u.push("<table class='dp-maintable' cellspacing='0' cellpadding='0' style='width:175px;'><tbody><tr><td>");u.push("<table class='bbit-dp-top' cellspacing='0'><tr><td class='bbit-dp-top-left'> <a id='BBIT_DP_LEFTBTN' href='javascript:void(0);' title='",i18n.datepicker.prev_month_title,"'>&nbsp;</a></td><td class='bbit-dp-top-center' align='center'><em><button id='BBIT_DP_YMBTN'></button></em></td><td class='bbit-dp-top-right'><a id='BBIT_DP_RIGHTBTN' href='javascript:void(0);' title='",i18n.datepicker.next_month_title,"'>&nbsp;</a></td></tr></table>");u.push("</td></tr>");u.push("<tr><td>");u.push("<table id='BBIT_DP_INNER' class='bbit-dp-inner' cellspacing='0'><thead><tr>");for(var i=q.weekStart,j=0;j<7;j++){u.push("<th><span>",q.weekName[i],"</span></th>");if(i==6){i=0}else{i++}}u.push("</tr></thead>");u.push("<tbody></tbody></table>");u.push("</td></tr>");u.push("<tr><td class='bbit-dp-bottom' align='center'><button id='BBIT-DP-TODAY'>",q.btnToday,"</button></td></tr>");u.push("</tbody></table>");u.push("<div id='BBIT-DP-MP' class='bbit-dp-mp'  style='z-index:auto;'><table id='BBIT-DP-T' style='width: 175px; height: 193px' border='0' cellspacing='0'><tbody>");u.push("<tr>");u.push("<td class='bbit-dp-mp-month' xmonth='0'><a href='javascript:void(0);'>",q.monthName[0],"</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='6'><a href='javascript:void(0);'>",q.monthName[6],"</a></td><td class='bbit-dp-mp-ybtn' align='middle'><a id='BBIT-DP-MP-PREV' class='bbit-dp-mp-prev'></a></td><td class='bbit-dp-mp-ybtn' align='middle'><a id='BBIT-DP-MP-NEXT' class='bbit-dp-mp-next'></a></td>");u.push("</tr>");u.push("<tr>");u.push("<td class='bbit-dp-mp-month' xmonth='1'><a href='javascript:void(0);'>",q.monthName[1],"</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='7'><a href='javascript:void(0);'>",q.monthName[7],"</a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td>");u.push("</tr>");u.push("<tr>");u.push("<td class='bbit-dp-mp-month' xmonth='2'><a href='javascript:void(0);'>",q.monthName[2],"</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='8'><a href='javascript:void(0);'>",q.monthName[8],"</a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td>");u.push("</tr>");u.push("<tr>");u.push("<td class='bbit-dp-mp-month' xmonth='3'><a href='javascript:void(0);'>",q.monthName[3],"</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='9'><a href='javascript:void(0);'>",q.monthName[9],"</a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td>");u.push("</tr>");u.push("<tr>");u.push("<td class='bbit-dp-mp-month' xmonth='4'><a href='javascript:void(0);'>",q.monthName[4],"</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='10'><a href='javascript:void(0);'>",q.monthName[10],"</a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td>");u.push("</tr>");u.push("<tr>");u.push("<td class='bbit-dp-mp-month' xmonth='5'><a href='javascript:void(0);'>",q.monthName[5],"</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='11'><a href='javascript:void(0);'>",q.monthName[11],"</a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td>");u.push("</tr>");u.push("<tr class='bbit-dp-mp-btns'>");u.push("<td colspan='4'><button id='BBIT-DP-MP-OKBTN' class='bbit-dp-mp-ok'>",q.btnOk,"</button><button id='BBIT-DP-MP-CANCELBTN' class='bbit-dp-mp-cancel'>",q.btnCancel,"</button></td>");u.push("</tr>");u.push("</tbody></table>");u.push("</div>");u.push("</div>");var s=u.join("");$(document.body).append(s);r=$("#BBIT_DP_CONTAINER");initevents()}function initevents(){$("#BBIT-DP-TODAY").click(returntoday);r.click(returnfalse);$("#BBIT_DP_INNER tbody").click(tbhandler);$("#BBIT_DP_LEFTBTN").click(prevm);$("#BBIT_DP_RIGHTBTN").click(nextm);$("#BBIT_DP_YMBTN").click(showym);$("#BBIT-DP-MP").click(mpclick).dblclick(mpdblclick);$("#BBIT-DP-MP-PREV").click(mpprevy);$("#BBIT-DP-MP-NEXT").click(mpnexty);$("#BBIT-DP-MP-OKBTN").click(mpok);$("#BBIT-DP-MP-CANCELBTN").click(mpcancel)}function mpcancel(){$("#BBIT-DP-MP").animate({top:-193},{duration:200,complete:function(){$("#BBIT-DP-MP").hide()}});return false}function mpok(){q.Year=q.cy;q.Month=q.cm+1;q.Day=1;$("#BBIT-DP-MP").animate({top:-193},{duration:200,complete:function(){$("#BBIT-DP-MP").hide()}});writecb();return false}function mpprevy(){var y=q.ty-10;q.ty=y;rryear(y);return false}function mpnexty(){var y=q.ty+10;q.ty=y;rryear(y);return false}function rryear(y){var s=y-4;var a=[];for(var i=0;i<5;i++){a.push(s+i);a.push(s+i+5)}$("#BBIT-DP-MP td.bbit-dp-mp-year").each(function(i){if(q.Year==a[i]){$(this).addClass("bbit-dp-mp-sel")}else{$(this).removeClass("bbit-dp-mp-sel")}$(this).html("<a href='javascript:void(0);'>"+a[i]+"</a>").attr("xyear",a[i])})}function mpdblclick(e){var a=e.target||e.srcElement;var b=getTd(a);if(b==null){return false}if($(b).hasClass("bbit-dp-mp-month")||$(b).hasClass("bbit-dp-mp-year")){mpok(e)}return false}function mpclick(e){var a=$(this);var b=e.target||e.srcElement;var c=getTd(b);if(c==null){return false}if($(c).hasClass("bbit-dp-mp-month")){if(!$(c).hasClass("bbit-dp-mp-sel")){var d=a.find("td.bbit-dp-mp-month.bbit-dp-mp-sel");if(d.length>0){d.removeClass("bbit-dp-mp-sel")}$(c).addClass("bbit-dp-mp-sel");q.cm=parseInt($(c).attr("xmonth"))}}if($(c).hasClass("bbit-dp-mp-year")){if(!$(c).hasClass("bbit-dp-mp-sel")){var d=a.find("td.bbit-dp-mp-year.bbit-dp-mp-sel");if(d.length>0){d.removeClass("bbit-dp-mp-sel")}$(c).addClass("bbit-dp-mp-sel");q.cy=parseInt($(c).attr("xyear"))}}return false}function showym(){var a=$("#BBIT-DP-MP");var y=q.Year;q.cy=q.ty=y;var m=q.Month-1;q.cm=m;var b=$("#BBIT-DP-MP td.bbit-dp-mp-month");for(var i=b.length-1;i>=0;i--){var c=$(b[i]).attr("xmonth");if(c==m){$(b[i]).addClass("bbit-dp-mp-sel")}else{$(b[i]).removeClass("bbit-dp-mp-sel")}}rryear(y);a.css("top",-193).show().animate({top:0},{duration:200})}function getTd(a){if(a.tagName.toUpperCase()=="TD"){return a}else if(a.tagName.toUpperCase()=="BODY"){return null}else{var p=$(a).parent();if(p.length>0){if(p[0].tagName.toUpperCase()!="TD"){return getTd(p[0])}else{return p[0]}}}return null}function tbhandler(e){var a=e.target||e.srcElement;var b=getTd(a);if(b==null){return false}var c=$(b);if(!$(b).hasClass("bbit-dp-disabled")){var s=c.attr("xdate");r.data("indata",stringtodate(s));returndate()}return false}function returnfalse(){return false}function stringtodate(a){try{var b=a.split(i18n.datepicker.dateformat.separator);var c=parseInt(b[i18n.datepicker.dateformat.year_index]);var d=parseInt(b[i18n.datepicker.dateformat.month_index])-1;var f=parseInt(b[i18n.datepicker.dateformat.day_index]);return new Date(c,d,f)}catch(e){return null}}function prevm(){if(q.Month==1){q.Year--;q.Month=12}else{q.Month--}writecb();return false}function nextm(){if(q.Month==12){q.Year++;q.Month=1}else{q.Month++}writecb();return false}function returntoday(){r.data("indata",new Date());returndate()}function returndate(){var a=r.data("ctarget");var b=r.data("cpk");var c=r.data("onReturn");var d=r.data("indata");var e=r.data("ads");var f=r.data("ade");var g=false;if(e&&d<e){g=true}if(f&&d>f){g=true}if(g){return}if(c&&jQuery.isFunction(c)){c.call(a[0],r.data("indata"))}else{a.val(x.call(r.data("indata"),i18n.datepicker.dateformat.fulldayvalue))}b.attr("isshow","0");r.removeData("ctarget").removeData("cpk").removeData("indata").removeData("onReturn").removeData("ads").removeData("ade");r.css("visibility","hidden");a=b=null}function writecb(){var a=$("#BBIT_DP_INNER tbody");$("#BBIT_DP_YMBTN").html(q.monthName[q.Month-1]+q.monthp+" "+q.Year);var b=new Date(q.Year,q.Month-1,1);var c=q.weekStart-b.getDay();var d=q.Month-1;if(c>0){c-=7}var e=z("d",c,b);var f=z("d",42,e);var g=r.data("ads");var h=r.data("ade");var j=[];var k=x.call(q.today,i18n.datepicker.dateformat.fulldayvalue);var l=r.data("indata");var m=l!=null?x.call(l,i18n.datepicker.dateformat.fulldayvalue):"";for(var i=1;i<=42;i++){if(i%7==1){j.push("<tr>")}var n=z("d",i-1,e);var o=[];var p=false;if(g&&n<g){p=true}if(h&&n>h){p=true}if(n.getMonth()<d){o.push("bbit-dp-prevday")}else if(n.getMonth()>d){o.push("bbit-dp-nextday")}if(p){o.push("bbit-dp-disabled")}else{o.push("bbit-dp-active")}var s=x.call(n,i18n.datepicker.dateformat.fulldayvalue);if(s==k){o.push("bbit-dp-today")}if(s==m){o.push("bbit-dp-selected")}j.push("<td class='",o.join(" "),"' title='",x.call(n,i18n.datepicker.dateformat.fulldayvalue),"' xdate='",x.call(n,i18n.datepicker.dateformat.fulldayvalue),"'><a href='javascript:void(0);'><em><span>",n.getDate(),"</span></em></a></td>");if(i%7==0){j.push("</tr>")}}a.html(j.join(""))}return $(this).each(function(){var k=$(this).addClass("bbit-dp-input");var l=$(q.picker);q.showtarget==null&&k.after(l);l.click(function(e){var a=$(this).attr("isshow");var b=$(this);if(r.css("visibility")=="visible"){r.css(" visibility","hidden")}if(a=="1"){b.attr("isshow","0");r.removeData("ctarget").removeData("cpk").removeData("indata").removeData("onReturn");return false}var v=k.val();if(v!=""){v=stringtodate(v)}if(v==null||v==""){q.Year=new Date().getFullYear();q.Month=new Date().getMonth()+1;q.Day=new Date().getDate();q.inputDate=null}else{q.Year=v.getFullYear();q.Month=v.getMonth()+1;q.Day=v.getDate();q.inputDate=v}r.data("ctarget",k).data("cpk",b).data("indata",q.inputDate).data("onReturn",q.onReturn);if(q.applyrule&&$.isFunction(q.applyrule)){var c=q.applyrule.call(k,k[0].id);if(c){if(c.startdate){r.data("ads",c.startdate)}else{r.removeData("ads")}if(c.enddate){r.data("ade",c.enddate)}else{r.removeData("ade")}}}else{r.removeData("ads").removeData("ade")}writecb();$("#BBIT-DP-T").height(r.height());var t=q.showtarget||k;var d=t.offset();var f=t.outerHeight();var g={left:d.left,top:d.top+f};var w=r.width();var h=r.height();var i=document.documentElement.clientWidth;var j=document.documentElement.clientHeight;if((g.left+w)>=i){g.left=i-w-2}if((g.top+h)>=j){g.top=d.top-h-2}if(g.left<0){g.left=10}if(g.top<0){g.top=10}$("#BBIT-DP-MP").hide();g.visibility="visible";r.css(g);$(this).attr("isshow","1");$(document).one("click",function(e){b.attr("isshow","0");r.removeData("ctarget").removeData("cpk").removeData("indata");r.css("visibility","hidden")});return false})})}})(jQuery);