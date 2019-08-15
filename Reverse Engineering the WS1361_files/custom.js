/**
 * 1.1 version of theme custom js
 * Support for Navpane plugin
 */

 jQuery(function($) {
	$('body').addClass('postload');

	$(document).ready(function() {

   // Delay for iframe editor
    setTimeout(function() {
      if ($("#desktop-nav:visible").length) {
        $('body:not(.wsite-native-mobile-editor, .wsite-checkout-page) #desktop-nav').waypoint('sticky');
      }
      else {
        $('body:not(.wsite-native-mobile-editor, .wsite-checkout-page) #header').waypoint('sticky');
      }
      $(".w-navpane").css({ "padding-top" : $("#header").outerHeight() + "px"});
    }, 800);

    $('.wsite-mobile-menu').css({'padding-bottom' : $('.sticky-wrapper').height() +'px'});

    // Define Theme specific functions
    var Theme = {
      swipeGallery: function() {
        setTimeout(function() {
          var touchGallery = document.getElementsByClassName("fancybox-wrap")[0];
          var mc = new Hammer(touchGallery);
          mc.on("panleft panright", function(ev) {
            if (ev.type == "panleft") {
              $("a.fancybox-next").trigger("click");
            } else if (ev.type == "panright") {
              $("a.fancybox-prev").trigger("click");
            }
            Theme.swipeGallery();
          });
        }, 500);
      },
      swipeInit: function() {
        if ('ontouchstart' in window) {
          $("body").on("click", "a.w-fancybox", function() {
            Theme.swipeGallery();
          });
        }
      },
      interval: function(condition, action, duration, limit) {
        var counter = 0;
        var looper = setInterval(function(){
          if (counter >= limit || Theme.checkElement(condition)) {
            clearInterval(looper);
          } else {
            action();
            counter++;
          }
        }, duration);
      },
      checkElement: function(selector) {
        return $(selector).length;
      },
      moveFlyout: function() {
        var move = $("#wsite-menus").detach();
        $(".w-navlist").append(move);
      },
      cloneLogin: function() {
        var login = $("#desktop-nav #member-login").clone(true);
        $("#nav .wsite-menu-default li:last-child").after(login);
      }
    }

    // Clone login for mobile nav
    Theme.interval("#nav #member-login", Theme.cloneLogin, 800, 5);

    // Theme.interval(".w-navlist #wsite-menus", Theme.moveFlyout, 800, 5);

    // Old Superset Scripts

		// Reveal search field
    if (!('ontouchstart' in window)) {
      $('#search .wsite-search-button').click(function(){
        $("#search").toggleClass("showsearch");
        if ($("#search").hasClass("showsearch")) {
            $("#search .wsite-search-input").focus();
        }
        return false;
      });
    }

    // Store category list click
    $('.wsite-com-sidebar').click(function() {
      if (!$(this).hasClass('sidebar-expanded')) {
        $(this).addClass('sidebar-expanded');
        if ($('#close').length === 0) {
          $("#wsite-com-hierarchy").prepend('<a id="close" href="#">CLOSE</a>');
          $('#close').click(function(e) {
            e.preventDefault();
            setTimeout(function() {
              $('.wsite-com-sidebar').removeClass('sidebar-expanded');
            }, 50);
          });
        }
      }
    });


	});
});
