/**!
 * Плагин для реализации адаптивных табов, превращающихся в селект
 * @link https://github.com/pafnuty/tabsToSelect (Old)
 * @link https://github.com/TeraMoune/tabsToSelect (Update)
 * @date 15.04.2019
 * @version 1.0.3
 * 
 */
(function($) {

jQuery.fn.extend({
    tabsToSelect: function(options) {
	var previousResizeWidth = 0,
		prevTabs = 0;
	
    var defaults = {
		selectCalss: '',
		selectWrapperCalss: '',
		selectAppendTo: '',
		mainWrapperClass: '',
		ObjbgColor: '',
		selectEnable: false,
		topBorderTabsColor: true,
		autoOpen: true,
		lazyAttr: 'data-src',
		titleClass: 'open',
		onInit: function () {},
		beforeTabSwich: function (event) {
				return true;
		},
		afterTabSwich: function (event) {},
		onResized: function () {}
    };

    var o = $.extend(defaults, options);

    function init(obj)
    {

		$.each(obj, function () {

			var options_attr = $(this).data('params');
			var object = eval("(" + options_attr + ")");
			var o = $.extend({}, defaults, object);

			var $tabBlock = $(this),
				$select = $('<select class="tts-tabs-select ' + o.selectCalss + '" />'),
				$tabSwitchers = $tabBlock.find('.tts-tabs-switcher'),
				$selectInner = [];		
			
			if(o.lazyAttr) {	
			$.each($tabBlock.find('.tts-tabs-item'), function (i, tabItem) {
				var $tabItem = $(tabItem);

				$tabItem.find('img').removeAttr('src');
                $tabItem.html( $tabItem.html().split(o.lazyAttr+"=").join("src=") );
				
			});				
			}	
			
			if(o.selectEnable) {
			
			$.each($tabSwitchers, function (i, tabSwitcher) {
				var $tabSwitcher = $(tabSwitcher),
					selected = ($tabSwitcher.hasClass('active')) ? 'selected' : '', 
					option = '<option value="' + i + '" ' + selected + '>' + $tabSwitcher.text() + '</option>'; 

				$selectInner.push(option);
			});

			
			
			$select
					
			.html($selectInner.join(''))

			.on('change', function (e) {

					if (!e.flag) {
						var tab = $(this).val() * 1;

						$(this).trigger({
							type: 'tabSwitch',
							tab: tab
						});
					}
			});

			
			
				if (o.selectAppendTo) {
					var $selectAppendTo = $tabBlock.find(o.selectAppendTo);
					if ($selectAppendTo.length) {
						$select.appendTo($selectAppendTo);
					} else {
						$tabBlock.prepend($select);
					}
				} else {
					$tabBlock.prepend($select);
				}

			}
			
			$tabBlock

			.on('click', '.tts-tabs-switcher:not(.active)', function () {
					var tab = $(this).index();
					var tab_o = ( $(this).index() + 1 );
					var color = $(this).attr('data-color');
	
					if( prevTabs ) {
						
						var or_l = ( tab_o < prevTabs );
						var or_r = ( tab_o > prevTabs );
						console.log(or_l+' - '+or_r);
						prevTabs = tab_o;
					} else prevTabs = tab_o;
					
					$(this).trigger({
						type: 'tabSwitch',
						tab: tab,
						color: color
					});
			})
		
			.on('tabSwitch', function (e) {
				
					var beforeTabSwich = o.beforeTabSwich.call($thisTab, e);

					if (beforeTabSwich) {
						var $thisTab = $($tabSwitchers[e.tab]),
							$tabContent = $thisTab.closest($tabBlock).find('.tts-tabs-item'),
							$thisTabContent = $tabContent.eq($thisTab.index());
							
						$select.val(e.tab).trigger({
							type: 'change',
							flag: true 
						});

						$thisTab
							.addClass('active')
							.siblings().removeClass('active').removeAttr('style');
							

						$tabContent.removeClass('active').removeAttr('style');
						$thisTabContent.addClass('active');
						
						if( o.titleClass ) {
							
							$tabContent.find('.tts-tabs-title').removeClass(o.titleClass).removeAttr('style');
							
							setTimeout(function(){	
							
								$thisTabContent.find('.tts-tabs-title').addClass(o.titleClass);
								setTimeout(function(){
									$thisTabContent.find('.tts-tabs-title').css({'border-color':'#656565'});
								},600);
							},16);
						
						}
						
						if(	e.color ) {
							if( o.ObjbgColor ) {

								$( o.ObjbgColor ).css({'background':e.color});	
							
							} else if( o.mainWrapperClass ) {
							setTimeout(function(){
								if( o.topBorderTabsColor ) {
									$thisTab.css({'border-top-color':e.color});
								} else {
									$thisTab.css({'background':e.color,'border-bottom':'solid 1px '+e.color});
									$thisTabContent.css({'background':e.color});			
								}
							},16);
							}else {
								if( o.topBorderTabsColor ) {
									$thisTab.css({'border-top-color':e.color});
								} else {
									$thisTab.css({'background':e.color,'border-bottom':'solid 1px '+e.color});
									$thisTabContent.css({'background':e.color});			
								}								
							}
							
						}						

						$thisTab.trigger({
							type: 'tabClick',
							tab: $thisTabContent
						});
					}

				o.afterTabSwich.call($tabBlock, e);
			});
											
			$select.wrap('<div class="tts-tabs-select-wrapper ' + o.selectWrapperCalss + '"></div>');
			
			if( o.mainWrapperClass ) $tabBlock.addClass(o.mainWrapperClass);

			if( o.autoOpen ) {

				if( $tabBlock.find('.tts-tabs-switcher.active').html() ) {
					
					var tab = $tabBlock.find('.tts-tabs-switcher.active').index();
					var color = $tabBlock.find('.tts-tabs-switcher.active').attr('data-color');
					
				} else {

					var tab = $tabBlock.find('.tts-tabs-switcher:eq(0)').index();
					var color = $tabBlock.find('.tts-tabs-switcher:eq(0)').attr('data-color');
					
				}

				prevTabs = tab;
				
				$(this).trigger({
					type: 'tabSwitch',
					tab: tab,
					color: color
				});
			
			}
	
		});
			
		$(window).on('resize orientationchange', function (event) {
			winResize(event);
		});
			
		o.onInit.call(obj);
    }
	
	// Animate Tab Height
	function animateTabHeight() {

		// Update Tab Height
		tabHeight = $('.tts-tabs-item.active').height();

		// Animate Height
		$('.tabs-content').stop().css({
			height: tabHeight + 'px'
		});
	}	

	function winResize(event) {
		if (event && (event.type === 'resize' || event.type === 'orientationchange')) {
			var windowWidth = $(window).width();

			if (windowWidth === previousResizeWidth) {
				return;
			}

			o.onResized();

			previousResizeWidth = windowWidth;
		}
	}	
	  
    this.each(function(){

		var me = $(this);
		init(me);

    });

    return this;
    }
});

jQuery.fn.extend({
	tabsToSelect: jQuery.fn.tabsToSelect
});

})(jQuery);
