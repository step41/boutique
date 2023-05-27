/*!
 * Nestable jQuery Plugin - Copyright (c) 2012 David Bushell - http://dbushell.com/
 * Dual-licensed under the BSD or MIT licenses
 * Modified by Step41 to support click events on drag handles - 20150126
 */
;(function($, window, document, undefined)
{
    var hasTouch = 'ontouchstart' in window;
	var holdStarter = null;
	var holdActive = false;
    var nestableCopy;

    /**
     * Detect CSS pointer-events property
     * events are normally disabled on the dragging element to avoid conflicts
     * https://github.com/ausi/Feature-detection-technique-for-pointer-events/blob/master/modernizr-pointerevents.js
     */
    var hasPointerEvents = (function()
    {
        var el    = document.createElement('div'),
            docEl = document.documentElement;
        if (!('pointerEvents' in el.style)) {
            return false;
        }
        el.style.pointerEvents = 'auto';
        el.style.pointerEvents = 'x';
        docEl.appendChild(el);
        var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
        docEl.removeChild(el);
        return !!supports;
    })();

	var eStart  = hasTouch ? 'touchstart'  : 'mousedown',
		 eMove   = hasTouch ? 'touchmove'   : 'mousemove',
	  	 eEnd    = hasTouch ? 'touchend'    : 'mouseup',
	  	 eCancel = hasTouch ? 'touchcancel' : 'mouseup';
		  
	var defaults = {
		listNodeName    : 'ol',
		itemNodeName    : 'li',
		rootClass       : 'dd',
		listClass       : 'dd-list',
		itemClass       : 'dd-item',
		dragClass       : 'dd-dragel',
		handleClass     : 'dd-handle',
		collapsedClass  : 'dd-collapsed',
		placeClass      : 'dd-placeholder',
		noDragClass     : 'dd-nodrag',
		noChildrenClass : 'dd-nochildren',
		emptyClass      : 'dd-empty',
		expandBtnHTML   : '<button data-action="expand" type="button">Expand</button>',
		collapseBtnHTML : '<button data-action="collapse" type="button">Collapse</button>',
		group           : 0,
		maxDepth        : 5,
		threshold       : 20,
		reject          : [],
		// Added delay option ahd holdStarter, holdActive variable options to allow a click
		// event to be registered and recognized on the same handle object used for dragging.
		delay			: 200,
		//method for call when an item has been successfully dropped
		//method has 1 argument in which sends an object containing all
		//necessary details
		expandCallback    : null,
		collapseCallback    : null,
		dropCallback    : null,
      // When a node is dragged it is moved to its new location.
      // You can set the next option to true to create a copy of the node  that is dragged.
      cloneNodeOnDrag   : false,
      // When the node is dragged and released outside its list delete it.
      dragOutsideToDelete : false
	};

    function Plugin(element, options)
    {
        this.w = $(document);
        this.el = $(element);
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype = {

        init: function() {
            var list = this;

            list.reset();

            list.el.data('nestable-group', this.options.group);

            list.placeEl = $('<div class="' + list.options.placeClass + '"/>');

            $.each(this.el.find(list.options.itemNodeName), function(k, el) {
                list.setParent($(el));
            });

            list.el.on('click', 'button', function(e) {
                if (list.dragEl || (!hasTouch && e.button !== 0)) {
                    return;
                }
                var target = $(e.currentTarget),
                    action = target.data('action'),
                    item   = target.parent(list.options.itemNodeName);
                if (action === 'collapse') {
                    list.collapseItem(item);
                }
                if (action === 'expand') {
                    list.expandItem(item);
                }
            });

			var pauseEvent = function(e) {
				if (e.stopPropagation) {
					e.stopPropagation();
				}
				if (e.preventDefault) {
					e.preventDefault();
				}
				e.cancelBubble = true;
				e.returnValue = false;
				return false;
			};
			
			var onStartEvent = function(e) {
				holdActive = true;
				// Do not take any immediate action - just set the holdStarter
				//  to wait for the predetermined delay, and then begin a hold
				holdStarter = setTimeout(function() {
					if (holdActive) {
						holdStarter = null;
						// begin hold-only operation here, if desired
					
						var handle = $(e.target);
		
						list.nestableCopy = handle.closest('.'+list.options.rootClass).clone(true);
		
						if (!handle.hasClass(list.options.handleClass)) {
							if (handle.closest('.' + list.options.noDragClass).length) {
								return;
							}
							handle = handle.closest('.' + list.options.handleClass);
						}
						if (!handle.length || list.dragEl || (!hasTouch && e.which !== 1) || (hasTouch && e.touches.length !== 1)) {
							return;
						}
						e.preventDefault();
						list.dragStart(hasTouch ? e.touches[0] : e);
						//$.clog('nestable status: starting drag...');
					}
				}, list.options.delay);
				e.preventDefault();
            };

            var onMoveEvent = function(e) {
                if (holdActive && list.dragEl) {
                    e.preventDefault();
                    list.dragMove(hasTouch ? e.touches[0] : e);
					//$.clog('nestable status: dragging...');
                }
            };

            var onEndEvent = function(e) {
				clearTimeout(holdStarter);
				holdActive = false;
				if (list.dragEl) {
					e.preventDefault();
					list.dragStop(hasTouch ? e.touches[0] : e);
				}
				//$.clog('nestable status: ending drag...');
            };

            if (hasTouch) {
                list.el[0].addEventListener(eStart, onStartEvent, false);
                window.addEventListener(eMove, onMoveEvent, false);
                window.addEventListener(eEnd, onEndEvent, false);
                window.addEventListener(eCancel, onEndEvent, false);
            } 
			else {
                list.el.on(eStart, onStartEvent);
                list.w.on(eMove, onMoveEvent);
                list.w.on(eEnd, onEndEvent);
            }

            var destroyNestable = function() {
                if (hasTouch) {
                    list.el[0].removeEventListener(eStart, onStartEvent, false);
                    window.removeEventListener(eMove, onMoveEvent, false);
                    window.removeEventListener(eEnd, onEndEvent, false);
                    window.removeEventListener(eCancel, onEndEvent, false);
                } 
				else {
                    list.el.off(eStart, onStartEvent);
                    list.w.off(eMove, onMoveEvent);
                    list.w.off(eEnd, onEndEvent);
                }

                list.el.off('click');
                list.el.unbind('destroy-nestable');

                list.el.data("nestable", null);

                var buttons = list.el[0].getElementsByTagName('button');

                $(buttons).remove();
            };

            list.el.bind('destroy-nestable', destroyNestable);
        },

        destroy: function () {
            this.expandAll();
            this.el.trigger('destroy-nestable');
        },

        serialize: function() {
            var data,
                depth = 0,
                list  = this;
                step  = function(level, depth) {
                    var array = [ ],
                        items = level.children(list.options.itemNodeName);
                    items.each(function() {
                        var li   = $(this),
                            item = $.extend({}, li.data()),
                            sub  = li.children(list.options.listNodeName);
                        if (sub.length) {
                            item.children = step(sub, depth + 1);
                        }
                        array.push(item);
                    });
                    return array;
                };
            data = step(list.el.find(list.options.listNodeName).first(), depth);
            return data;
        },
		
		/**
		 * This function now fully supports ordering via drag and drop since the 
		 * internal structures are now surrounded by an array in order to preserve
		 * the original place within their respective parent list. Find output of 
		 * the basic data structure should end up looking something like this:
				[
					{
						"57": [
							{
								"58": {}
							}
						]
					},
					{
						"55": {}
					},
					{
						"68": {}
					},
					{
						"71": {}
					},
					{
						"119": [
							{
								"133": {}
							}
						]
					},
					{
						"62": [
							{
								"63": {}
							},
							{
								"64": {}
							}
						]
					},
					{
						"65": [
							{
								"66": {}
							}
						]
					},
					{
						"49": {}
					},
					{
						"130": [
							{
								"131": [
									{
										"132": {}
									}
								]
							}
						]
					},
				]		 
		 */
     	serialids: function() {
            var data;
            var depth = 0;
            var list  = this;
            var step  = function(level, depth) {
				var arr = [];
				var items = level.children(list.options.itemNodeName);
				items.each(function(i) {
					var obj = {};
					var li = $(this);
					var sub  = li.children(list.options.listNodeName);
					if (sub.length) {
						obj[li.attr('data-id')] = step(sub, depth + 1);
					}
					else {
						obj[li.attr('data-id')] = [{}];					
					}
					arr.push(obj);
				});
				return arr;
            };
            data = step(list.el.find(list.options.listNodeName).first(), depth);
            return data;
        },
		
     	serialidsOldVersionNoPreserveOrder: function() {
            var data;
            var depth = 0;
            var list  = this;
            var step  = function(level, depth) {
				var obj = {};
				var items = level.children(list.options.itemNodeName);
				items.each(function() {
					var li = $(this);
					var sub  = li.children(list.options.listNodeName);
					if (sub.length) {
						obj[li.data('id')] = step(sub, depth + 1);
					}
					else {
						obj[li.data('id')] = {};					
					}
				});
				return obj;
            };
            data = step(list.el.find(list.options.listNodeName).first(), depth);
            return data;
        },
		
        serialise: function() {
            return this.serialize();
        },

        reset: function() {
            this.mouse = {
                offsetX   : 0,
                offsetY   : 0,
                startX    : 0,
                startY    : 0,
                lastX     : 0,
                lastY     : 0,
                nowX      : 0,
                nowY      : 0,
                distX     : 0,
                distY     : 0,
                dirAx     : 0,
                dirX      : 0,
                dirY      : 0,
                lastDirX  : 0,
                lastDirY  : 0,
                distAxX   : 0,
                distAxY   : 0
            };
            this.moving     = false;
            this.dragEl     = null;
            this.dragRootEl = null;
            this.dragDepth  = 0;
            this.dragItem   = null;
            this.hasNewRoot = false;
            this.pointEl    = null;
            this.sourceRoot = null;
            this.isOutsideRoot = false;
        },

        expandItem: function(li, nocallback) {
			nocallback = nocallback || false;
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action="expand"]').hide();
            li.children('[data-action="collapse"]').show();
            li.children(this.options.listNodeName).show();
            this.el.trigger('expand', [li]);
            li.trigger('expand');
			if(nocallback === false && $.isFunction(this.options.expandCallback)) {
				this.options.expandCallback.call();
			}
        },

        collapseItem: function(li, nocallback) {
			nocallback = nocallback || false;
            var lists = li.children(this.options.listNodeName);
            if (lists.length) {
                li.addClass(this.options.collapsedClass);
                li.children('[data-action="collapse"]').hide();
                li.children('[data-action="expand"]').show();
                li.children(this.options.listNodeName).hide();
            }
            this.el.trigger('collapse', [li]);
            li.trigger('collapse');
			if(nocallback === false && $.isFunction(this.options.collapseCallback)) {
				this.options.collapseCallback.call();
			}
        },

        expandAll: function() {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function() {
                list.expandItem($(this), true);
            });
 			if($.isFunction(this.options.expandCallback)) {
				this.options.expandCallback.call();
			}
       },

        collapseAll: function() {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function() {
                list.collapseItem($(this), true);
            });
			if($.isFunction(this.options.collapseCallback)) {
				this.options.collapseCallback.call();
			}
        },

        setParent: function(li) {
            if (li.children(this.options.listNodeName).length) {
                li.prepend($(this.options.expandBtnHTML));
                li.prepend($(this.options.collapseBtnHTML));
            }
            if( (' ' + li[0].className + ' ').indexOf(' ' + this.options.collapsedClass + ' ') > -1 )
            {
                li.children('[data-action="collapse"]').hide();
            } else {
                li.children('[data-action="expand"]').hide();
            }
        },

        unsetParent: function(li) {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action]').remove();
            li.children(this.options.listNodeName).remove();
        },

        dragStart: function(e) {
            var dragItemWidth,
				dragItemHeight,
				handleWidth,
				mouse    = this.mouse,
                target   = $(e.target),
				handleItem = target.closest('.' + this.options.handleClass);
                dragItem = handleItem.closest(this.options.itemNodeName);

            this.sourceRoot = target.closest('.' + this.options.rootClass);

            this.dragItem = dragItem;
			dragItemWidth = dragItem.width();
			dragItemHeight = dragItem.height();
			handleItemWidth = handleItem.width();

            this.placeEl.css('height', dragItemHeight);

            mouse.offsetX = e.offsetX !== undefined ? e.offsetX : e.pageX - target.offset().left;
            mouse.offsetY = e.offsetY !== undefined ? e.offsetY : e.pageY - target.offset().top;
            mouse.startX = mouse.lastX = e.pageX;
            mouse.startY = mouse.lastY = e.pageY;

            this.dragRootEl = this.el;

            this.dragEl = $(document.createElement(this.options.listNodeName)).addClass(this.options.listClass + ' ' + this.options.dragClass);
            this.dragEl.css('width', dragItemWidth);

            // fix for zepto.js
            //dragItem.after(this.placeEl).detach().appendTo(this.dragEl);
            if(this.options.cloneNodeOnDrag) {
                dragItem.after(dragItem.clone());
            } else {
                dragItem.after(this.placeEl);
            }
            dragItem[0].parentNode.removeChild(dragItem[0]);
            dragItem.appendTo(this.dragEl);

            $(document.body).append(this.dragEl);
            this.dragEl.css({
                'left' : e.pageX - mouse.offsetX - dragItemWidth + handleItemWidth,
                'top'  : e.pageY - mouse.offsetY
            });
           // total depth of dragging item
            var i, depth,
                items = this.dragEl.find(this.options.itemNodeName);
            for (i = 0; i < items.length; i++) {
                depth = $(items[i]).parents(this.options.listNodeName).length;
                if (depth > this.dragDepth) {
                    this.dragDepth = depth;
                }
            }
        },

        dragStop: function(e) {
            // fix for zepto.js
            //this.placeEl.replaceWith(this.dragEl.children(this.options.itemNodeName + ':first').detach());
            var el = this.dragEl.children(this.options.itemNodeName).first();
            el[0].parentNode.removeChild(el[0]);

            if (this.isOutsideRoot && this.options.dragOutsideToDelete)
				{
                var parent = this.placeEl.parent();
                this.placeEl.remove();
                if (!parent.children().length) {
                    this.unsetParent(parent.parent());
                }
                // If all nodes where deleted, create a placeholder element.
                if (!this.dragRootEl.find(this.options.itemNodeName).length)
					 {
                    this.dragRootEl.append('<div class="' + this.options.emptyClass + '"/>');
                }
            } 
			else {
                this.placeEl.replaceWith(el);
            }

            if (!this.moving) {
                $(this.dragItem).trigger('click');
            }

            var i;
            var isRejected = false;
            for (i in this.options.reject) {
                var reject = this.options.reject[i];
                if (reject.rule.apply(this.dragRootEl)) {
                    var nestableDragEl = el.clone(true);
                    this.dragRootEl.html(this.nestableCopy.children().clone(true));
                    if (reject.action) {
                        reject.action.apply(this.dragRootEl, [nestableDragEl]);
                    }

                    isRejected = true;
                    break;
                }
            }

            if (!isRejected) {
                this.dragEl.remove();
                this.el.trigger('change');

                //Let's find out new parent id
                var parentItem = el.parent().parent();
                var parentId = null;
                if(parentItem !== null && !parentItem.is('.' + this.options.rootClass))
                    parentId = parentItem.data('id');

                if($.isFunction(this.options.dropCallback)) {
                    var details = {
                        sourceId   : el.data('id'),
                        destId     : parentId,
                        sourceEl   : el,
                        destParent : parentItem,
                        destRoot   : el.closest('.' + this.options.rootClass),
                        sourceRoot : this.sourceRoot
                  };
                  this.options.dropCallback.call(this, details);
                }

                if (this.hasNewRoot) {
                    this.dragRootEl.trigger('change');
                }

                this.reset();
            }
        },

        dragMove: function(e) {
            var list, parent, prev, next, depth,
                opt   = this.options,
                mouse = this.mouse;
				
			var dragElWidth = this.dragEl.width();
			var handleItem = this.dragEl.find('.' + this.options.handleClass);
			var handleItemWidth = handleItem.width();
			//$.clog('handleItem: ' + handleItem + ' -- handleItemWidth: ' + handleItemWidth);

            this.dragEl.css({
                'left' : e.pageX - mouse.offsetX - dragElWidth + handleItemWidth,
                'top'  : e.pageY - mouse.offsetY
            });

            // mouse position last events
            mouse.lastX = mouse.nowX;
            mouse.lastY = mouse.nowY;
            // mouse position this events
            mouse.nowX  = e.pageX;
            mouse.nowY  = e.pageY;
            // distance mouse moved between events
            mouse.distX = mouse.nowX - mouse.lastX;
            mouse.distY = mouse.nowY - mouse.lastY;
            // direction mouse was moving
            mouse.lastDirX = mouse.dirX;
            mouse.lastDirY = mouse.dirY;
            // direction mouse is now moving (on both axis)
            mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
            mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
            // axis mouse is now moving on
            var newAx   = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

            // do nothing on first move
            if (!this.moving) {
                mouse.dirAx  = newAx;
                this.moving = true;
                return;
            }

            // calc distance moved on this axis (and direction)
            if (mouse.dirAx !== newAx) {
                mouse.distAxX = 0;
                mouse.distAxY = 0;
            } else {
                mouse.distAxX += Math.abs(mouse.distX);
                if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
                    mouse.distAxX = 0;
                }
                mouse.distAxY += Math.abs(mouse.distY);
                if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
                    mouse.distAxY = 0;
                }
            }
            mouse.dirAx = newAx;

            /**
             * move horizontal
             */
            if (mouse.dirAx && mouse.distAxX >= opt.threshold) {
                // reset move distance on x-axis for new phase
                mouse.distAxX = 0;
                prev = this.placeEl.prev(opt.itemNodeName);
                // increase horizontal level if previous sibling exists and is not collapsed
                if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass) && !prev.hasClass(opt.noChildrenClass)) {
                    // cannot increase level when item above is collapsed
                    list = prev.find(opt.listNodeName).last();
                    // check if depth limit has reached
                    depth = this.placeEl.parents(opt.listNodeName).length;
                    if (depth + this.dragDepth <= opt.maxDepth) {
                        // create new sub-level if one doesn't exist
                        if (!list.length) {
                            list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);
                            list.append(this.placeEl);
                            prev.append(list);
                            this.setParent(prev);
                        } else {
                            // else append to next level up
                            list = prev.children(opt.listNodeName).last();
                            list.append(this.placeEl);
                        }
                    }
                }
                // decrease horizontal level
                if (mouse.distX < 0) {
                    // we can't decrease a level if an item preceeds the current one
                    next = this.placeEl.next(opt.itemNodeName);
                    if (!next.length) {
                        parent = this.placeEl.parent();
                        this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
                        if (!parent.children().length) {
                            this.unsetParent(parent.parent());
                        }
                    }
                }
            }

            var isEmpty = false;

            // find list item under cursor
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'hidden';
            }
				
            this.pointEl = $(document.elementFromPoint(e.pageX - document.documentElement.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));

            // Check if the node is dragged outside of its list.
            if(this.dragRootEl.has(this.pointEl).length) {
                this.isOutsideRoot = false;
                this.dragEl[0].style.opacity = 1;
            } else {
                this.isOutsideRoot = true;
                this.dragEl[0].style.opacity = 0.5;
            }

            // find parent list of item under cursor
            var pointElRoot = this.pointEl.closest('.' + opt.rootClass),
                isNewRoot   = this.dragRootEl.data('nestable-id') !== pointElRoot.data('nestable-id');

            this.isOutsideRoot = !pointElRoot.length;

            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'visible';
            }
            if (this.pointEl.hasClass(opt.handleClass)) {
                this.pointEl = this.pointEl.closest( opt.itemNodeName );
            }
            if (this.pointEl.hasClass(opt.emptyClass)) {
                isEmpty = true;
            }
            else if (!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {
                return;
            }

            /**
             * move vertical
             */
            if (!mouse.dirAx || isNewRoot || isEmpty) {
                // check if groups match if dragging over new root
                if (isNewRoot && opt.group !== pointElRoot.data('nestable-group')) {
                    return;
                }
                // check depth limit
                depth = this.dragDepth - 1 + this.pointEl.parents(opt.listNodeName).length;
                if (depth > opt.maxDepth) {
                    return;
                }
                var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);
                    parent = this.placeEl.parent();
                // if empty create new list to replace empty placeholder
                if (isEmpty) {
                    list = $(document.createElement(opt.listNodeName)).addClass(opt.listClass);
                    list.append(this.placeEl);
                    this.pointEl.replaceWith(list);
                }
                else if (before) {
                    this.pointEl.before(this.placeEl);
                }
                else {
                    this.pointEl.after(this.placeEl);
                }
                if (!parent.children().length) {
                    this.unsetParent(parent.parent());
                }
                if (!this.dragRootEl.find(opt.itemNodeName).length) {
                    this.dragRootEl.append('<div class="' + opt.emptyClass + '"/>');
                }
                // parent root list has changed
                this.dragRootEl = pointElRoot;
                if (isNewRoot) {
                    this.hasNewRoot = this.el[0] !== this.dragRootEl[0];
                }
            }
        }

    };

    $.fn.nestable = function(params) {
        var lists  = this,
            retval = this;

        var generateUid = function (separator) {
            var delim = separator || "-";

            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }

            return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
        };

        lists.each(function() {
            var plugin = $(this).data('nestable');

            if (!plugin) {
                $(this).data('nestable', new Plugin(this, params));
                $(this).data('nestable-id', generateUid());
            } 
			else {
                if (typeof params === 'string' && typeof plugin[params] === 'function') {
                    retval = plugin[params]();
                }
            }
        });

        return retval || lists;
    };

})(window.jQuery || window.Zepto, window, document);
