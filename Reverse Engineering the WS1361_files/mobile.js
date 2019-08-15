//// mobile.js submenu nav - all below
Weebly = Weebly || {};

Weebly.mobile_navigation = (function($) {

  var isOpen = false,
      isMoving = false,
      supportsTouch = false,
      pendingResizeData = null,
      isiOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false),
      supports3D = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()),
      supportsTouch = false,
      menuOffsetY = 0,
      $menuWrapper, $menu, $body, supports3D;


  /**
   * Add a css transition
   *
   * @param jquery $o object to animate
   * @param string property a css transitionable property
   * @param number speed the ms speed of animation
   * @param function cb callback function after animation completes
   * @return undefined
   */

  var addTransition = function($o, property, speed, cb) {
      if (!speed) {
        speed = 500;
      }

      $o.css({
        webkitTransitionDuration: speed + 'ms',
        webkitTransitionProperty: property,
        webkitTransitionTimingFunction: 'linear'
      });

      var onTransistionEnd = function(e) {
          $o.off('webkitTransitionEnd', onTransistionEnd);

          $o.css({
            webkitTransitionDuration: '',
            webkitTransitionProperty: '',
            webkitTransitionTimingFunction: ''
          });

          cb();
          }



      $o.on('webkitTransitionEnd', onTransistionEnd);
      };

  /**
   * Utility animate function for css transitions
   *
   * @param jquery $o object to animate
   * @param object from css properties to animate from
   * @param object to css properties to animate to
   * @param number speed the ms speed of animation
   * @param function cb callback function after animation completes
   * @return undefined
   */
  var animate = function($o, from, to, speed, cb) {
      if (!speed) {
        speed = 500;
      }
      if (supports3D) {

        $o.css({
          webkitTransitionDuration: '0ms'
        });
        $o.css(from);

        setTimeout(function() {
          addTransition($o, 'all', speed, cb);

          var props = {};
          for (property in to) {
            if (!to.hasOwnProperty(property)) {
              continue;
            }
            props[property] = to[property];
          }
          $o.css(props);
        }, 0);
      } else {
        //jquery.animate isn't working too well here, disable for now
        to.avoidCSSTransitions = true;
        $o.animate(to, {
          duration: speed,
          complete: cb
        });
      }
      };

  /**
   * Controls the menu effect when a menu button is tapped
   *
   * @param event e event handler
   * @return undefined
   */
  var menuTap = function(e) {
      var menuHeight = '100%',
          effectStart, effectEnd, fromCSS, toCSS;

      if (isMoving) {
        return;
      }

      isOpen = !isOpen;

      isMoving = true;

      if (isOpen) {
        $body.addClass('menu-open');
      }

      var cb = function() {
          isMoving = false;

          if (!isOpen) {
            $body.removeClass('menu-open');
          }
      };
  };

  /**
   * Tweens the menu left or right
   *
   * @param jquery $oldSlide the current slide being moved out
   * @param jquery $newSlide the new slide being moved in
   * @param bool rightToLeft move to the right if true, left if false
   * @return undefined
   */
  var tweenMenu = function($oldSlide, $newSlide, rightToLeft) {
      var $animContainer = $('.wsite-animation-wrap', $menu),
          sign = (rightToLeft) ? 1 : -1;

      if (isMoving) {
        return;
      }

      isMoving = true;

      var menuWidth = $menu.width();

      var toX = -sign * menuWidth + 'px';

      var fromCSS = {
        '-webkit-transform': 'translate3d( 0, 0px, 0)'
      };

      var toCSS = {
        '-webkit-transform': 'translate3d(' + toX + ', 0px, 0)'
      };

      if (supports3D) {
        $newSlide.css({
          '-webkit-transform': 'translate3d(' + (sign * menuWidth) + 'px, 0px, 0)'
        });
      } else {
        $newSlide.css({
          'left': (sign * menuWidth) + 'px'
        });

        fromCSS = {
          left: 0
        };
        toCSS = {
          left: toX
        };
      }

      $newSlide.show();

      var cb = function() {
          $oldSlide.hide();
          $animContainer.css(fromCSS);
          $newSlide.css(fromCSS);

          isMoving = false;
          };

      animate($animContainer, fromCSS, toCSS, 300, cb);
      };

  /**
   * Adds a an active state css class so that button presses
   * can be styled
   *
   * @param jquery $element element(s) to add state to
   * @param string tagName selector to filter dom elemenets
   * @return undefined
   */
  var addActiveState = function($element, tagName) {
      $element.on('touchstart', tagName, function(ev) {
        $(this).addClass('active');
      });
      $element.on('touchend', tagName, function(ev) {
        $(this).removeClass('active');
      });
      };


  /**
   * Measures the size of the content area to try and place footer
   * fixed at the bottom of the screen if the screen space is larger
   *
   * @return undefined
   */
  var resizeContentWindow = function() {};


  /**
   * Resizes the vertical height of the mobile menu
   *
   * @return undefined
   */
  var resizeMenu = function() {
      if (!$menu) {
        return;
      }
      var menuHeight = $menu.find('.wsite-menu-slide:visible').outerHeight();
      if (menuHeight > 0) {
        $menu.css({
          height: '100%',
          'overflow-y': 'auto',
          '-webkit-overflow-scrolling': 'touch'
        });
      }

      };

  /**
   * Inits the body to detect touch support
   *
   * @return undefined
   */
  var initBody = function() {
      $body = $('body');

      if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        $body.removeClass('no-touch');
        $body.addClass('touch');
        supportsTouch = true;
      }
      };


      /**
       * Inits the mobile menu structure
       *
       * @return undefined
       */

  var initMenu = function() {
    var $sideMenus = $('#nav .wsite-menu-wrap'),
  		$headerUl, $sliderContainer;

      $headerUl = $('#nav .wsite-menu-default');

      $headerUl.wrap('<div class="wsite-mobile-menu" />');
      $menu = $headerUl.up('.wsite-mobile-menu');
      $menuWrapper = $headerUl.up('#wrapper');
      $menuWrapper = ($menuWrapper.length > 0) ? $menuWrapper : $menu;

      isOpen = false;
      isMoving = false;

      var slideCSS = {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%'
      };

      // something to select on
      $headerUl.addClass('wsite-menu-slide').css(slideCSS);
      $sideMenus.addClass('wsite-menu-slide').css(slideCSS);

      // new css settings can cause jarring while animations render,
      // set the settings here even though they don't really 'do anything'
      $headerUl.css({
        'left': '0'
      });
      if (supports3D) {
        $headerUl.css({
          '-webkit-transform': 'translate3d( 0, 0px, 0)'
        });
      }

      $menu.append('<div class="wsite-animation-wrap"></div>');
      $sliderContainer = $('.wsite-animation-wrap', $menu);
      $sliderContainer.css({
        position: 'relative',
        height: '100%'
      });
      if (supports3D) {
        $sliderContainer.css({
          '-webkit-backface-visibility': 'hidden'
        });
      }
      $sliderContainer.append($headerUl);

      $sideMenus.each(function() {
        var $sideMenu = $(this),
            $parentAnchor = $sideMenu.prev(),
            $ul = $sideMenu.children('ul'),
            $previousMenu = $sideMenu.parents('.wsite-menu-slide');

        var $backLink = $('<li class="wsite-menu-back-item">' + '<a><span class="wsite-menu-mobile-arrow"></span><span class="wsite-menu-back">Back</span></a>' + '</li>');
        $backLink.unbind("click");
        $backLink.on('click', function(ev) {
          tweenMenu($sideMenu, $previousMenu, false);
          return false;
        });

        if ($parentAnchor.attr("href")) {
          var $sideMenuRoot = $parentAnchor.clone(true, true);
          var $rootLink = $('<li class="wsite-menu-master-item"></li>').html($sideMenuRoot);          
        }
        
        $ul.prepend($rootLink);
        $ul.prepend($backLink);

        $parentAnchor.unbind( "click" );
        $parentAnchor.append('<span class="wsite-menu-mobile-arrow"></span>');
        $parentAnchor.on('click', function(ev) {
          tweenMenu($previousMenu, $sideMenu, true);
          return false;
        });

        $sideMenu.css({
          'left': '0'
        });
        if (supports3D) {
          $sideMenu.css({
            '-webkit-transform': 'translate3d( 0, 0px, 0)'
          });
        }

        $sliderContainer.append($sideMenu);
      });

      $menu.css({
        'display': 'block'
      });
      $menuWrapper.css({
        'display': 'block'
      });
      resizeMenu();

      // prefer active state classes over html active
      if (supportsTouch) {
        addActiveState($('.wsite-home-link'));
        addActiveState($menu, 'a');
      }
      };

  /**
   * Close the menu
   *
   * @return undefined
   */
  var closeMenu = function() {
      if (isOpen) {
        menuTap(null);
      }
      };

  var isMenuOpen = function() {
      return isOpen;
      };

  var init = function() {
      $body = $('#icontent');
      $body = ($body.length > 0) ? $body : $('body');

      // May be able to dump this flag in the future,
      // but fixing 3d transition flickering issues was in theme css
      if (!$body.hasClass('wsite-render3d')) {
        supports3D = false;
      }

      initMenu();
      };

  if (!Weebly.mobile) {
    // reset iframe content sizes
    $(window).on("message", function(event) {
      if (!event.origin || event.origin.indexOf('weebly.com') === -1) {
        return;
      }

      pendingResizeData = event.data;
    });
  }

  // dom ready
  $(function() {

    setTimeout(function(){
      initBody();
      init();
    }, 1000);

    if (window.FastClick) {
      FastClick.attach($('.wsite-mobile-menu')[0]);
    }

  });

  return {
    init: init,
    closeMenu: closeMenu,
    resizeScreen: resizeContentWindow,
    resizeMenu: resizeMenu,
    menuTap: menuTap,
    isMenuOpen: isMenuOpen
  };

}(Weebly.jQuery));
