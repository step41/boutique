$.fn.cerealizeArray=function(a){a=a||'';var b=$(this).closest('form');var c=[];var d,checked,key;var e=(a)?$(':input').filter(a):$(':input');$(this).find(e).each(function(){var n,mv,v;if($(this).attr('name')){n=$(this).attr('name');mv=(n.match(/\[\]$/));if(c[n]&&!mv){$.clog('CEREALIZE WARNING!!! The field ['+n+'] exists more than once in form ['+$(this).closest('form').attr('id')+']. Skipping further assignments for this field.','warning');return}v=$(this).val();if($(this).is(':radio')||$(this).is(':checkbox')){if($(this).is(':checked')||$(this).hasClass('boolean')){c[n]=(c[n])?c[n]+','+v:v}}else{c[n]=(c[n])?c[n]+','+v:v}}});return c};