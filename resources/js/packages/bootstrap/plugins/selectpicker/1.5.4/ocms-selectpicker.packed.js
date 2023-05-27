!function($){'use strict';$.expr[':'].icontains=function(a,b,c){return $(a).text().toUpperCase().indexOf(c[3].toUpperCase())>=0};var k=function(a,b,e){if(e){e.stopPropagation();e.preventDefault()}this.$element=$(a);this.$newElement=null;this.$button=null;this.$menu=null;this.$lis=null;this.options=$.extend({},$.fn.selectpicker.defaults,this.$element.data(),typeof b=='object'&&b);if(this.options.title===null){this.options.title=this.$element.attr('title')}this.val=k.prototype.val;this.render=k.prototype.render;this.refresh=k.prototype.refresh;this.setStyle=k.prototype.setStyle;this.selectAll=k.prototype.selectAll;this.deselectAll=k.prototype.deselectAll;this.init()};k.prototype={constructor:k,init:function(){var a=this,id=this.$element.attr('id');this.$element.hide();this.multiple=this.$element.prop('multiple');this.autofocus=this.$element.prop('autofocus');this.$newElement=this.createView();this.$element.after(this.$newElement);this.$menu=this.$newElement.find('> .dropdown-menu');this.$button=this.$newElement.find('> button');this.$searchbox=this.$newElement.find('input');if(id!==undefined){this.$button.attr('data-id',id);$('label[for="'+id+'"]').click(function(e){e.preventDefault();a.$button.focus()})}this.checkDisabled();this.clickListener();if(this.options.liveSearch)this.liveSearchListener();this.render();this.liHeight();this.setStyle();this.setWidth();if(this.options.container)this.selectPosition();this.$menu.data('this',this);this.$newElement.data('this',this)},createDropdown:function(){var a=this.multiple?' show-tick':'';var b=this.$element.parent().hasClass('input-group')?' input-group-btn':'';var c=this.autofocus?' autofocus':'';var d=this.options.header?'<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>'+this.options.header+'</div>':'';var e=this.options.liveSearch?'<div class="bootstrap-select-searchbox"><input type="text" class="input-block-level form-control" autocomplete="off" /></div>':'';var f=this.options.actionsBox?'<div class="bs-actionsbox">'+'<div class="btn-group btn-block">'+'<button class="actions-btn bs-select-all btn btn-sm btn-default">'+'Select All'+'</button>'+'<button class="actions-btn bs-deselect-all btn btn-sm btn-default">'+'Deselect All'+'</button>'+'</div>'+'</div>':'';var g='<div class="btn-group bootstrap-select'+a+b+'">'+'<button type="button" class="btn dropdown-toggle selectpicker" data-toggle="dropdown"'+c+'>'+'<span class="filter-option pull-left"></span>&nbsp;'+'<span class="caret"></span>'+'</button>'+'<div class="dropdown-menu open">'+d+e+f+'<ul class="dropdown-menu inner selectpicker pscroll" role="menu">'+'</ul>'+'</div>'+'</div>';return $(g)},createView:function(){var a=this.createDropdown();var b=this.createLi();a.find('ul').prepend(b);return a},reloadLi:function(){this.destroyLi();var a=this.createLi();this.$menu.find('ul').prepend(a)},destroyLi:function(){this.$menu.find('li').remove()},createLi:function(){var j=this,_liA=[],_liHtml='';this.$element.find('option').each(function(){var a=$(this);var b=a.attr('class')||'';var c=a.attr('style')||'';var d=a.data('content')?a.data('content'):a.html();var e=a.data('subtext')!==undefined?'<small class="muted text-muted">'+a.data('subtext')+'</small>':'';var f=a.data('icon')!==undefined?'<i class="'+j.options.iconBase+' '+a.data('icon')+'"></i> ':'';if(f!==''&&(a.is(':disabled')||a.parent().is(':disabled'))){f='<span>'+f+'</span>'}if(!a.data('content')){d=f+'<span class="text">'+d+e+'</span>'}if(j.options.hideDisabled&&(a.is(':disabled')||a.parent().is(':disabled'))){_liA.push('<a style="min-height: 0; padding: 0"></a>')}else if(a.parent().is('optgroup')&&a.data('divider')!==true){if(a.index()===0){var g=a.parent().attr('label');var h=a.parent().data('subtext')!==undefined?'<small class="muted text-muted">'+a.parent().data('subtext')+'</small>':'';var i=a.parent().data('icon')?'<i class="'+a.parent().data('icon')+'"></i> ':'';g=i+'<span class="text">'+g+h+'</span>';if(a[0].index!==0){_liA.push('<div class="div-contain"><div class="divider"></div></div>'+'<dt>'+g+'</dt>'+j.createA(d,'opt '+b,c))}else{_liA.push('<dt>'+g+'</dt>'+j.createA(d,'opt '+b,c))}}else{_liA.push(j.createA(d,'opt '+b,c))}}else if(a.data('divider')===true){_liA.push('<div class="div-contain"><div class="divider"></div></div>')}else if($(this).data('hidden')===true){_liA.push('<a></a>')}else{_liA.push(j.createA(d,b,c))}});$.each(_liA,function(i,a){var b=a==='<a></a>'?'class="hide is-hidden"':'';_liHtml+='<li rel="'+i+'"'+b+'>'+a+'</li>'});if(!this.multiple&&this.$element.find('option:selected').length===0&&!this.options.title){this.$element.find('option').eq(0).prop('selected',true).attr('selected','selected')}return $(_liHtml)},createA:function(a,b,c){return'<a tabindex="0" class="'+b+'" style="'+c+'">'+a+'<i class="'+this.options.iconBase+' '+this.options.tickIcon+' icon-check check-mark"></i>'+'</a>'},render:function(d){var e=this;if(d!==false){this.$element.find('option').each(function(a){e.setDisabled(a,$(this).is(':disabled')||$(this).parent().is(':disabled'));e.setSelected(a,$(this).is(':selected'))})}this.tabIndex();var f=this.$element.find('option:selected').map(function(){var a=$(this);var b=a.data('icon')&&e.options.showIcon?'<i class="'+e.options.iconBase+' '+a.data('icon')+'"></i> ':'';var c;if(e.options.showSubtext&&a.attr('data-subtext')&&!e.multiple){c=' <small class="muted text-muted">'+a.data('subtext')+'</small>'}else{c=''}if(a.data('content')&&e.options.showContent){return a.data('content')}else if(a.attr('title')!==undefined){return a.attr('title')}else{return b+a.html()+c}}).toArray();var g=!this.multiple?f[0]:f.join(this.options.multipleSeparator);if(this.multiple&&this.options.selectedTextFormat.indexOf('count')>-1){var h=this.options.selectedTextFormat.split('>');var i=this.options.hideDisabled?':not([disabled])':'';if((h.length>1&&f.length>h[1])||(h.length==1&&f.length>=2)){g=this.options.countSelectedText.replace('{0}',f.length).replace('{1}',this.$element.find('option:not([data-divider="true"]):not([data-hidden="true"])'+i).length)}}this.options.title=this.$element.attr('title');if(!g){g=this.options.title!==undefined?this.options.title:this.options.noneSelectedText}this.$button.attr('title',$.trim($("<div/>").html(g).text()).replace(/\s\s+/g,' '));this.$newElement.find('.filter-option').html(g.replace(/(&nbsp;)+?/g,''))},setStyle:function(a,b){if(this.$element.attr('class')){this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device|validate\[.*\]/gi,''))}var c=a?a:this.options.style;if(b=='add'){this.$button.addClass(c)}else if(b=='remove'){this.$button.removeClass(c)}else{this.$button.removeClass(this.options.style);this.$button.addClass(c)}},liHeight:function(){if(this.options.size===false)return;var a=this.$menu.parent().clone().find('> .dropdown-toggle').prop('autofocus',false).end().appendTo('body'),$menuClone=a.addClass('open').find('> .dropdown-menu'),liHeight=$menuClone.find('li > a').outerHeight(),headerHeight=this.options.header?$menuClone.find('.popover-title').outerHeight():0,searchHeight=this.options.liveSearch?$menuClone.find('.bootstrap-select-searchbox').outerHeight():0,actionsHeight=this.options.actionsBox?$menuClone.find('.bs-actionsbox').outerHeight():0;a.remove();this.$newElement.data('liHeight',liHeight).data('headerHeight',headerHeight).data('searchHeight',searchHeight).data('actionsHeight',actionsHeight)},setSize:function(){var b=this,menu=this.$menu,menuInner=menu.find('.inner'),selectHeight=this.$newElement.outerHeight(),liHeight=this.$newElement.data('liHeight'),headerHeight=this.$newElement.data('headerHeight'),searchHeight=this.$newElement.data('searchHeight'),actionsHeight=this.$newElement.data('actionsHeight'),divHeight=menu.find('li .divider').outerHeight(true),menuPadding=parseInt(menu.css('padding-top'))+parseInt(menu.css('padding-bottom'))+parseInt(menu.css('border-top-width'))+parseInt(menu.css('border-bottom-width')),notDisabled=this.options.hideDisabled?':not(.disabled)':'',$window=$(window),menuExtras=menuPadding+parseInt(menu.css('margin-top'))+parseInt(menu.css('margin-bottom'))+2,menuHeight,selectOffsetTop,selectOffsetBot,posVert=function(){selectOffsetTop=b.$newElement.offset().top-$window.scrollTop();selectOffsetBot=$window.height()-selectOffsetTop-selectHeight};posVert();if(this.options.header)menu.css('padding-top',0);if(this.options.size=='auto'){var c=function(){var a,lisVis=b.$lis.not('.hide');posVert();menuHeight=selectOffsetBot-menuExtras;if(b.options.dropupAuto){b.$newElement.toggleClass('dropup',(selectOffsetTop>selectOffsetBot)&&((menuHeight-menuExtras)<menu.height()))}if(b.$newElement.hasClass('dropup')){menuHeight=selectOffsetTop-menuExtras}if((lisVis.length+lisVis.find('dt').length)>3){a=liHeight*3+menuExtras-2}else{a=0}menu.css({'max-height':menuHeight+'px','overflow':'hidden','min-height':a+headerHeight+searchHeight+actionsHeight+'px'});menuInner.css({'max-height':menuHeight-headerHeight-searchHeight-actionsHeight-menuPadding+'px','overflow-y':'auto','min-height':Math.max(a-menuPadding,0)+'px'})};c();this.$searchbox.off('input.getSize propertychange.getSize').on('input.getSize propertychange.getSize',c);$(window).off('resize.getSize').on('resize.getSize',c);$(window).off('scroll.getSize').on('scroll.getSize',c)}else if(this.options.size&&this.options.size!='auto'&&menu.find('li'+notDisabled).length>this.options.size){var d=menu.find('li'+notDisabled+' > *').filter(':not(.div-contain)').slice(0,this.options.size).last().parent().index();var e=menu.find('li').slice(0,d+1).find('.div-contain').length;menuHeight=liHeight*this.options.size+e*divHeight+menuPadding;if(b.options.dropupAuto){this.$newElement.toggleClass('dropup',(selectOffsetTop>selectOffsetBot)&&(menuHeight<menu.height()))}menu.css({'max-height':menuHeight+headerHeight+searchHeight+actionsHeight+'px','overflow':'hidden'});menuInner.css({'max-height':menuHeight-menuPadding+'px','overflow-y':'auto'})}},setWidth:function(){if(this.options.width=='auto'){this.$menu.css('min-width','0');var a=this.$newElement.clone().appendTo('body');var b=a.find('> .dropdown-menu').css('width');var c=a.css('width','auto').find('> button').css('width');a.remove();this.$newElement.css('width',Math.max(parseInt(b),parseInt(c))+'px')}else if(this.options.width=='fit'){this.$menu.css('min-width','');this.$newElement.css('width','').addClass('fit-width')}else if(this.options.width){this.$menu.css('min-width','');this.$newElement.css('width',this.options.width)}else{this.$menu.css('min-width','');this.$newElement.css('width','')}if(this.$newElement.hasClass('fit-width')&&this.options.width!=='fit'){this.$newElement.removeClass('fit-width')}},selectPosition:function(){var b=this,drop='<div />',$drop=$(drop),pos,actualHeight,getPlacement=function(a){$drop.addClass(a.attr('class').replace(/form-control/gi,'')).toggleClass('dropup',a.hasClass('dropup'));pos=a.offset();actualHeight=a.hasClass('dropup')?0:a[0].offsetHeight;$drop.css({'top':pos.top+actualHeight,'left':pos.left,'width':a[0].offsetWidth,'position':'absolute'})};this.$newElement.on('click',function(){if(b.isDisabled()){return}getPlacement($(this));$drop.appendTo(b.options.container);$drop.toggleClass('open',!$(this).hasClass('open'));$drop.append(b.$menu)});$(window).resize(function(){getPlacement(b.$newElement)});$(window).on('scroll',function(){getPlacement(b.$newElement)});$('html').on('click',function(e){if($(e.target).closest(b.$newElement).length<1){$drop.removeClass('open')}})},mobile:function(){this.$element.addClass('mobile-device').appendTo(this.$newElement);if(this.options.container)this.$menu.hide()},refresh:function(){this.$lis=null;this.reloadLi();this.render();this.setWidth();this.setStyle();this.checkDisabled();this.liHeight()},update:function(){this.reloadLi();this.setWidth();this.setStyle();this.checkDisabled();this.liHeight()},setSelected:function(a,b){if(this.$lis==null)this.$lis=this.$menu.find('li');$(this.$lis[a]).toggleClass('selected',b)},setDisabled:function(a,b){if(this.$lis==null)this.$lis=this.$menu.find('li');if(b){$(this.$lis[a]).addClass('disabled').find('a').attr('href','#').attr('tabindex',-1)}else{$(this.$lis[a]).removeClass('disabled').find('a').removeAttr('href').attr('tabindex',0)}},isDisabled:function(){return this.$element.is(':disabled')},checkDisabled:function(){var a=this;if(this.isDisabled()){this.$button.addClass('disabled').attr('tabindex',-1)}else{if(this.$button.hasClass('disabled')){this.$button.removeClass('disabled')}if(this.$button.attr('tabindex')==-1){if(!this.$element.data('tabindex'))this.$button.removeAttr('tabindex')}}this.$button.click(function(){return!a.isDisabled()})},tabIndex:function(){if(this.$element.is('[tabindex]')){this.$element.data('tabindex',this.$element.attr('tabindex'));this.$button.attr('tabindex',this.$element.data('tabindex'))}},clickListener:function(){var d=this;$('body').on('touchstart.dropdown','.dropdown-menu',function(e){e.stopPropagation()});this.$newElement.on('click',function(){d.setSize();if(!d.options.liveSearch&&!d.multiple){setTimeout(function(){d.$menu.find('.selected a').focus()},10)}});this.$menu.on('click','li a',function(e){var a=$(this).parent().index(),prevValue=d.$element.val(),prevIndex=d.$element.prop('selectedIndex');if(d.multiple){e.stopPropagation()}e.preventDefault();if(!d.isDisabled()&&!$(this).parent().hasClass('disabled')){var b=d.$element.find('option'),$option=b.eq(a),state=$option.prop('selected'),$optgroup=$option.parent('optgroup'),maxOptions=d.options.maxOptions,maxOptionsGrp=$optgroup.data('maxOptions')||false;if(!d.multiple){b.prop('selected',false);$option.prop('selected',true);d.$menu.find('.selected').removeClass('selected');d.setSelected(a,true)}else{$option.prop('selected',!state);d.setSelected(a,!state);if((maxOptions!==false)||(maxOptionsGrp!==false)){var c=maxOptions<b.filter(':selected').length,maxReachedGrp=maxOptionsGrp<$optgroup.find('option:selected').length,maxOptionsArr=d.options.maxOptionsText,maxTxt=maxOptionsArr[0].replace('{n}',maxOptions),maxTxtGrp=maxOptionsArr[1].replace('{n}',maxOptionsGrp),$notify=$('<div class="notify"></div>');if((maxOptions&&c)||(maxOptionsGrp&&maxReachedGrp)){if(maxOptionsArr[2]){maxTxt=maxTxt.replace('{var}',maxOptionsArr[2][maxOptions>1?0:1]);maxTxtGrp=maxTxtGrp.replace('{var}',maxOptionsArr[2][maxOptionsGrp>1?0:1])}$option.prop('selected',false);d.$menu.append($notify);if(maxOptions&&c){$notify.append($('<div>'+maxTxt+'</div>'));d.$element.trigger('maxReached.bs.select')}if(maxOptionsGrp&&maxReachedGrp){$notify.append($('<div>'+maxTxtGrp+'</div>'));d.$element.trigger('maxReachedGrp.bs.select')}setTimeout(function(){d.setSelected(a,false)},10);$notify.delay(750).fadeOut(300,function(){$(this).remove()})}}}if(!d.multiple){d.$button.focus()}else if(d.options.liveSearch){d.$searchbox.focus()}if((prevValue!=d.$element.val()&&d.multiple)||(prevIndex!=d.$element.prop('selectedIndex')&&!d.multiple)){d.$element.change()}}});this.$menu.on('click','li.disabled a, li dt, li .div-contain, .popover-title, .popover-title :not(.close)',function(e){if(e.target==this){e.preventDefault();e.stopPropagation();if(!d.options.liveSearch){d.$button.focus()}else{d.$searchbox.focus()}}});this.$menu.on('click','.popover-title .close',function(){d.$button.focus()});this.$searchbox.on('click',function(e){e.stopPropagation()});this.$menu.on('click','.actions-btn',function(e){if(d.options.liveSearch){d.$searchbox.focus()}else{d.$button.focus()}e.preventDefault();e.stopPropagation();if($(this).is('.bs-select-all')){d.selectAll()}else{d.deselectAll()}d.$element.change()});this.$element.change(function(){d.render(false)})},liveSearchListener:function(){var a=this,no_results=$('<li class="no-results"></li>');this.$newElement.on('click.dropdown.data-api',function(){a.$menu.find('.active').removeClass('active');if(!!a.$searchbox.val()){a.$searchbox.val('');a.$lis.not('.is-hidden').removeClass('hide');if(!!no_results.parent().length)no_results.remove()}if(!a.multiple)a.$menu.find('.selected').addClass('active');setTimeout(function(){a.$searchbox.focus()},10)});this.$searchbox.on('input propertychange',function(){if(a.$searchbox.val()){a.$lis.not('.is-hidden').removeClass('hide').find('a').not(':icontains('+a.$searchbox.val()+')').parent().addClass('hide');if(!a.$menu.find('li').filter(':visible:not(.no-results)').length){if(!!no_results.parent().length)no_results.remove();no_results.html(a.options.noneResultsText+' "'+a.$searchbox.val()+'"').show();a.$menu.find('li').last().after(no_results)}else if(!!no_results.parent().length){no_results.remove()}}else{a.$lis.not('.is-hidden').removeClass('hide');if(!!no_results.parent().length)no_results.remove()}a.$menu.find('li.active').removeClass('active');a.$menu.find('li').filter(':visible:not(.divider)').eq(0).addClass('active').find('a').focus();$(this).focus()});this.$menu.on('mouseenter','a',function(e){a.$menu.find('.active').removeClass('active');$(e.currentTarget).parent().not('.disabled').addClass('active')});this.$menu.on('mouseleave','a',function(){a.$menu.find('.active').removeClass('active')})},val:function(a){if(a!==undefined){this.$element.val(a);this.$element.change();this.render();return this.$element}else{return this.$element.val()}},selectAll:function(){if(this.$lis==null)this.$lis=this.$menu.find('li');this.$element.find('option:enabled').prop('selected',true);$(this.$lis).filter(':not(.disabled)').addClass('selected');this.render(false)},deselectAll:function(){if(this.$lis==null)this.$lis=this.$menu.find('li');this.$element.find('option:enabled').prop('selected',false);$(this.$lis).filter(':not(.disabled)').removeClass('selected');this.render(false)},keydown:function(e){var a,$items,$parent,index,next,first,last,prev,nextPrev,that,prevIndex,isActive,keyCodeMap={32:' ',48:'0',49:'1',50:'2',51:'3',52:'4',53:'5',54:'6',55:'7',56:'8',57:'9',59:';',65:'a',66:'b',67:'c',68:'d',69:'e',70:'f',71:'g',72:'h',73:'i',74:'j',75:'k',76:'l',77:'m',78:'n',79:'o',80:'p',81:'q',82:'r',83:'s',84:'t',85:'u',86:'v',87:'w',88:'x',89:'y',90:'z',96:'0',97:'1',98:'2',99:'3',100:'4',101:'5',102:'6',103:'7',104:'8',105:'9'};a=$(this);$parent=a.parent();if(a.is('input'))$parent=a.parent().parent();that=$parent.data('this');if(that.options.liveSearch)$parent=a.parent().parent();if(that.options.container)$parent=that.$menu;$items=$('[role=menu] li:not(.divider) a',$parent);isActive=that.$menu.parent().hasClass('open');if(!isActive&&/([0-9]|[A-z])/.test(String.fromCharCode(e.keyCode))){if(!that.options.container){that.setSize();that.$menu.parent().addClass('open');isActive=that.$menu.parent().hasClass('open')}else{that.$newElement.trigger('click')}that.$searchbox.focus()}if(that.options.liveSearch){if(/(^9$|27)/.test(e.keyCode)&&isActive&&that.$menu.find('.active').length===0){e.preventDefault();that.$menu.parent().removeClass('open');that.$button.focus()}$items=$('[role=menu] li:not(.divider):visible',$parent);if(!a.val()&&!/(38|40)/.test(e.keyCode)){if($items.filter('.active').length===0){$items=that.$newElement.find('li').filter(':icontains('+keyCodeMap[e.keyCode]+')')}}}if(!$items.length)return;if(/(38|40)/.test(e.keyCode)){index=$items.index($items.filter(':focus'));first=$items.parent(':not(.disabled):visible').first().index();last=$items.parent(':not(.disabled):visible').last().index();next=$items.eq(index).parent().nextAll(':not(.disabled):visible').eq(0).index();prev=$items.eq(index).parent().prevAll(':not(.disabled):visible').eq(0).index();nextPrev=$items.eq(next).parent().prevAll(':not(.disabled):visible').eq(0).index();if(that.options.liveSearch){$items.each(function(i){if($(this).is(':not(.disabled)')){$(this).data('index',i)}});index=$items.index($items.filter('.active'));first=$items.filter(':not(.disabled):visible').first().data('index');last=$items.filter(':not(.disabled):visible').last().data('index');next=$items.eq(index).nextAll(':not(.disabled):visible').eq(0).data('index');prev=$items.eq(index).prevAll(':not(.disabled):visible').eq(0).data('index');nextPrev=$items.eq(next).prevAll(':not(.disabled):visible').eq(0).data('index')}prevIndex=a.data('prevIndex');if(e.keyCode==38){if(that.options.liveSearch)index-=1;if(index!=nextPrev&&index>prev)index=prev;if(index<first)index=first;if(index==prevIndex)index=last}if(e.keyCode==40){if(that.options.liveSearch)index+=1;if(index==-1)index=0;if(index!=nextPrev&&index<next)index=next;if(index>last)index=last;if(index==prevIndex)index=first}a.data('prevIndex',index);if(!that.options.liveSearch){$items.eq(index).focus()}else{e.preventDefault();if(!a.is('.dropdown-toggle')){$items.removeClass('active');$items.eq(index).addClass('active').find('a').focus();a.focus()}}}else if(!a.is('input')){var b=[],count,prevKey;$items.each(function(){if($(this).parent().is(':not(.disabled)')){if($.trim($(this).text().toLowerCase()).substring(0,1)==keyCodeMap[e.keyCode]){b.push($(this).parent().index())}}});count=$(document).data('keycount');count++;$(document).data('keycount',count);prevKey=$.trim($(':focus').text().toLowerCase()).substring(0,1);if(prevKey!=keyCodeMap[e.keyCode]){count=1;$(document).data('keycount',count)}else if(count>=b.length){$(document).data('keycount',0);if(count>b.length)count=1}$items.eq(b[count-1]).focus()}if(/(13|32|^9$)/.test(e.keyCode)&&isActive){if(!/(32)/.test(e.keyCode))e.preventDefault();if(!that.options.liveSearch){$(':focus').click()}else if(!/(32)/.test(e.keyCode)){that.$menu.find('.active a').click();a.focus()}$(document).data('keycount',0)}if((/(^9$|27)/.test(e.keyCode)&&isActive&&(that.multiple||that.options.liveSearch))||(/(27)/.test(e.keyCode)&&!isActive)){that.$menu.parent().removeClass('open');that.$button.focus()}},hide:function(){this.$newElement.hide()},show:function(){this.$newElement.show()},destroy:function(){this.$newElement.remove();this.$element.remove()}};$.fn.selectpicker=function(c,d){var e=arguments;var f;var g=this.each(function(){if($(this).is('select')){var a=$(this),data=a.data('selectpicker'),options=typeof c=='object'&&c;if(!data){a.data('selectpicker',(data=new k(this,options,d)))}else if(options){for(var i in options){data.options[i]=options[i]}}if(typeof c=='string'){var b=c;if(data[b]instanceof Function){[].shift.apply(e);f=data[b].apply(data,e)}else{f=data.options[b]}}}});if(f!==undefined){return f}else{return g}};$.fn.selectpicker.defaults={style:'btn-default',size:'auto',title:null,selectedTextFormat:'values',noneSelectedText:'Nothing selected',noneResultsText:'No results match',countSelectedText:'{0} of {1} selected',maxOptionsText:['Limit reached ({n} {var} max)','Group limit reached ({n} {var} max)',['items','item']],width:false,container:false,hideDisabled:false,showSubtext:false,showIcon:true,showContent:true,dropupAuto:true,header:false,liveSearch:false,actionsBox:false,multipleSeparator:', ',iconBase:'icon',tickIcon:'icon-ok',maxOptions:false};$(document).data('keycount',0).on('keydown','.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role=menu], .bootstrap-select-searchbox input',k.prototype.keydown).on('focusin.modal','.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role=menu], .bootstrap-select-searchbox input',function(e){e.stopPropagation()})}(window.jQuery);
