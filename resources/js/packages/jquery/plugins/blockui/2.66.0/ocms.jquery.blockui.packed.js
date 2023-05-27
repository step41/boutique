;(function(){"use strict";function setup($){$.fn._fadeIn=$.fn.fadeIn;var A=$.noop||function(){};var B=/MSIE/.test(navigator.userAgent);var C=/MSIE 6.0/.test(navigator.userAgent)&&!/MSIE 8.0/.test(navigator.userAgent);var D=document.documentMode||0;var E=$.isFunction(document.createElement('div').style.setExpression);$.blockUI=function(a){install(window,a)};$.unblockUI=function(a){remove(window,a)};$.growlUI=function(b,c,d,e){var f=$('<div class="growlUI"></div>');if(b)f.append('<h1>'+b+'</h1>');if(c)f.append('<h2>'+c+'</h2>');if(d===undefined)d=3000;var g=function(a){a=a||{};$.blockUI({message:f,fadeIn:typeof a.fadeIn!=='undefined'?a.fadeIn:700,fadeOut:typeof a.fadeOut!=='undefined'?a.fadeOut:1000,timeout:typeof a.timeout!=='undefined'?a.timeout:d,centerY:false,showOverlay:false,onUnblock:e,css:$.blockUI.defaults.growlCSS})};g();var h=f.css('opacity');f.mouseover(function(){g({fadeIn:0,timeout:30000});var a=$('.blockMsg');a.stop();a.fadeTo(300,1)}).mouseout(function(){$('.blockMsg').fadeOut(1000)})};$.fn.block=function(b){if(this[0]===window){$.blockUI(b);return this}var c=$.extend({},$.blockUI.defaults,b||{});this.each(function(){var a=$(this);if(c.ignoreIfBlocked&&a.data('blockUI.isBlocked'))return;a.unblock({fadeOut:0})});return this.each(function(){if($.css(this,'position')=='static'){this.style.position='relative';$(this).data('blockUI.static',true)}this.style.zoom=1;install(this,b)})};$.fn.unblock=function(a){if(this[0]===window){$.unblockUI(a);return this}return this.each(function(){remove(this,a)})};$.blockUI.version=2.66;$.blockUI.defaults={message:'<h1>Please wait...</h1>',title:null,draggable:true,theme:false,css:{},themedCSS:{width:'30%',top:'40%',left:'35%'},overlayCSS:{cursor:'wait'},cursorReset:'default',growlCSS:{width:'350px',top:'10px',left:'',right:'10px',border:'none',padding:'5px',opacity:0.6,cursor:'default',color:'#fff',backgroundColor:'#000','-webkit-border-radius':'10px','-moz-border-radius':'10px','border-radius':'10px'},iframeSrc:/^https/i.test(window.location.href||'')?'javascript:false':'about:blank',forceIframe:false,baseZ:1000,centerX:true,centerY:true,allowBodyStretch:true,bindEvents:true,constrainTabKey:true,fadeIn:200,fadeOut:400,timeout:0,showOverlay:true,focusInput:true,focusableElements:':input:enabled:visible',onBlock:null,onUnblock:null,onOverlayClick:null,quirksmodeOffsetHack:4,blockMsgClass:'blockMsg',ignoreIfBlocked:false};var F=null;var G=[];function install(c,d){var e,themedCSS;var f=(c==window);var g=(d&&d.message!==undefined?d.message:undefined);d=$.extend({},$.blockUI.defaults,d||{});if(d.ignoreIfBlocked&&$(c).data('blockUI.isBlocked'))return;d.overlayCSS=$.extend({},$.blockUI.defaults.overlayCSS,d.overlayCSS||{});e=$.extend({},$.blockUI.defaults.css,d.css||{});if(d.onOverlayClick)d.overlayCSS.cursor='pointer';themedCSS=$.extend({},$.blockUI.defaults.themedCSS,d.themedCSS||{});g=g===undefined?d.message:g;if(f&&F)remove(window,{fadeOut:0});if(g&&typeof g!='string'&&(g.parentNode||g.jquery)){var h=g.jquery?g[0]:g;var j={};$(c).data('blockUI.history',j);j.el=h;j.parent=h.parentNode;j.display=h.style.display;j.position=h.style.position;if(j.parent)j.parent.removeChild(h)}$(c).data('blockUI.onUnblock',d.onUnblock);var z=d.baseZ;var k,lyr2,lyr3,s;if(B||d.forceIframe)k=$('<iframe class="blockUI" style="z-index:'+(z++)+';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+d.iframeSrc+'"></iframe>');else k=$('<div class="blockUI" style="display:none"></div>');if(d.theme)lyr2=$('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+(z++)+';display:none"></div>');else lyr2=$('<div class="blockUI blockOverlay" style="z-index:'+(z++)+';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');if(d.theme&&f){s='<div class="blockUI '+d.blockMsgClass+' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:fixed">';if(d.title){s+='<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(d.title||'&nbsp;')+'</div>'}s+='<div class="ui-widget-content ui-dialog-content"></div>';s+='</div>'}else if(d.theme){s='<div class="blockUI '+d.blockMsgClass+' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:absolute">';if(d.title){s+='<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(d.title||'&nbsp;')+'</div>'}s+='<div class="ui-widget-content ui-dialog-content"></div>';s+='</div>'}else if(f){s='<div class="blockUI '+d.blockMsgClass+' blockPage" style="z-index:'+(z+10)+';display:none;position:fixed"></div>'}else{s='<div class="blockUI '+d.blockMsgClass+' blockElement" style="z-index:'+(z+10)+';display:none;position:absolute"></div>'}lyr3=$(s);if(g){if(d.theme){lyr3.css(themedCSS);lyr3.addClass('ui-widget-content')}else lyr3.css(e)}if(!d.theme)lyr2.css(d.overlayCSS);lyr2.css('position',f?'fixed':'absolute');if(B||d.forceIframe)k.css('opacity',0.0);var m=[k,lyr2,lyr3],$par=f?$('body'):$(c);$.each(m,function(){this.appendTo($par)});if(d.theme&&d.draggable&&$.fn.draggable){lyr3.draggable({handle:'.ui-dialog-titlebar',cancel:'li'})}var n=E&&(!$.support.boxModel||$('object,embed',f?null:c).length>0);if(C||n){if(f&&d.allowBodyStretch&&$.support.boxModel)$('html,body').css('height','100%');if((C||!$.support.boxModel)&&!f){var t=sz(c,'borderTopWidth'),l=sz(c,'borderLeftWidth');var p=t?'(0 - '+t+')':0;var q=l?'(0 - '+l+')':0}$.each(m,function(i,o){var s=o[0].style;s.position='absolute';if(i<2){if(f)s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:'+d.quirksmodeOffsetHack+') + "px"');else s.setExpression('height','this.parentNode.offsetHeight + "px"');if(f)s.setExpression('width','jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');else s.setExpression('width','this.parentNode.offsetWidth + "px"');if(q)s.setExpression('left',q);if(p)s.setExpression('top',p)}else if(d.centerY){if(f)s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');s.marginTop=0}else if(!d.centerY&&f){var a=(d.css&&d.css.top)?parseInt(d.css.top,10):0;var b='((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+a+') + "px"';s.setExpression('top',b)}})}if(g){if(d.theme)lyr3.find('.ui-widget-content').append(g);else lyr3.append(g);if(g.jquery||g.nodeType)$(g).show()}if((B||d.forceIframe)&&d.showOverlay)k.show();if(d.fadeIn){var r=d.onBlock?d.onBlock:A;var u=(d.showOverlay&&!g)?r:A;var v=g?r:A;if(d.showOverlay)lyr2._fadeIn(d.fadeIn,u);if(g)lyr3._fadeIn(d.fadeIn,v)}else{if(d.showOverlay)lyr2.show();if(g)lyr3.show();if(d.onBlock)d.onBlock()}bind(1,c,d);if(f){F=lyr3[0];G=$(d.focusableElements,F);if(d.focusInput)setTimeout(focus,20)}else center(lyr3[0],d.centerX,d.centerY);if(d.timeout){var w=setTimeout(function(){if(f)$.unblockUI(d);else $(c).unblock(d)},d.timeout);$(c).data('blockUI.timeout',w)}}function remove(a,b){var c;var d=(a==window);var e=$(a);var f=e.data('blockUI.history');var g=e.data('blockUI.timeout');if(g){clearTimeout(g);e.removeData('blockUI.timeout')}b=$.extend({},$.blockUI.defaults,b||{});bind(0,a,b);if(b.onUnblock===null){b.onUnblock=e.data('blockUI.onUnblock');e.removeData('blockUI.onUnblock')}var h;if(d)h=$('body').children().filter('.blockUI').add('body > .blockUI');else h=e.find('>.blockUI');if(b.cursorReset){if(h.length>1)h[1].style.cursor=b.cursorReset;if(h.length>2)h[2].style.cursor=b.cursorReset}if(d)F=G=null;if(b.fadeOut){c=h.length;h.stop().fadeOut(b.fadeOut,function(){if(--c===0)reset(h,f,b,a)})}else reset(h,f,b,a)}function reset(a,b,c,d){var e=$(d);if(e.data('blockUI.isBlocked'))return;a.each(function(i,o){if(this.parentNode)this.parentNode.removeChild(this)});if(b&&b.el){b.el.style.display=b.display;b.el.style.position=b.position;if(b.parent)b.parent.appendChild(b.el);e.removeData('blockUI.history')}if(e.data('blockUI.static')){e.css('position','static')}if(typeof c.onUnblock=='function')c.onUnblock(d,c);var f=$(document.body),w=f.width(),cssW=f[0].style.width;f.width(w-1).width(w);f[0].style.width=cssW}function bind(b,a,c){var d=a==window,$el=$(a);if(!b&&(d&&!F||!d&&!$el.data('blockUI.isBlocked')))return;$el.data('blockUI.isBlocked',b);if(!d||!c.bindEvents||(b&&!c.showOverlay))return;var e='mousedown mouseup keydown keypress keyup touchstart touchend touchmove';if(b)$(document).bind(e,c,handler);else $(document).unbind(e,handler)}function handler(e){if(e.type==='keydown'&&e.keyCode&&e.keyCode==9){if(F&&e.data.constrainTabKey){var a=G;var b=!e.shiftKey&&e.target===a[a.length-1];var c=e.shiftKey&&e.target===a[0];if(b||c){setTimeout(function(){focus(c)},10);return false}}}var d=e.data;var f=$(e.target);if(f.hasClass('blockOverlay')&&d.onOverlayClick)d.onOverlayClick(e);if(f.parents('div.'+d.blockMsgClass).length>0)return true;return f.parents().children().filter('div.blockUI').length===0}function focus(a){if(!G)return;var e=G[a===true?G.length-1:0];if(e)e.focus()}function center(a,x,y){var p=a.parentNode,s=a.style;var l=((p.offsetWidth-a.offsetWidth)/2)-sz(p,'borderLeftWidth');var t=((p.offsetHeight-a.offsetHeight)/2)-sz(p,'borderTopWidth');if(x)s.left=l>0?(l+'px'):'0';if(y)s.top=t>0?(t+'px'):'0'}function sz(a,p){return parseInt($.css(a,p),10)||0}}if(typeof define==='function'&&define.amd&&define.amd.jQuery){define(['jquery'],setup)}else{setup(jQuery)}})();
