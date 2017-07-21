$(function() {
	var App = {
		isMobile: function() {
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		},

		init: function() {
			App.events();
			App.firstScreenParallax();
			App.tabs();
			App.sliders();
			App.animation();
			App.mobileMenu();
		},

		events: function() {
			$(window).on('scroll', function() {
				App.animation();
			});
		},

		animation: function() {
			var flag = true;
			$('.animated').on('mouseover', function(e) {
				if (flag) {
					flag = false;

					$this = $(this);
					$this.addClass($this.attr('data-animate'));

					setTimeout(function() {
						$this.removeClass($this.attr('data-animate'));
						flag = true;
					}, 1200);
				}
			});
		},

		firstScreenParallax: function() {
			if (!App.isMobile()) {
				var block = $('.app-description');
				var centerX = block.width() / 2;
				var centerY = block.height() / 2;

				block.on('mousemove', function(e) {
					var scaleX = (e.clientX - centerX) / 500;

					$('.app-img img').css({
						"transform": "translateX(" + scaleX + "%)"
					});

					block.css({
						"background-position": 50 + scaleX + '% ' + "50%"
					});

				});
			}
		},

		tabs: function() {
			var tabN;
			var flag = true;

			$('.tab-content').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
				if($(this).hasClass('hide-tab')) {
			    	$(this).removeClass('active hide-tab');
			    	changeTab(tabN);
				} else {
					flag = true;
				}
			});


			function changeTab(number) {
			    $( $('.tab-content-wrapper .tab-content')[number] ).addClass('show-tab active');
			}

			$('.tabs-nav a').click(function(e) {
				e.preventDefault();

				if (flag && !$(this).hasClass('active')) {
					flag = false;
					tabN = $(this).attr('data-index');

					var $this = $(this);

					function changeActiveLink() {
						var activeA = $('.tabs-nav a').index($this);

						$('.tabs-nav a').removeClass('active');
						$this.addClass('active');
						$('.tabs-nav .current').css('top', $this.outerHeight() * $('.tabs-nav a').index($this));
					}

					changeActiveLink();
					$('.tab-content.active').removeClass('show-tab').addClass('hide-tab');
				}
			});
		},

		sliders: function() {
			if($.fn.slick()) {

				$('.slider').slick({
					slidesToShow: 3,
					slidesToScroll: 3,
					responsive: [
					    {
					      breakpoint: 1279,
					      settings: {
					        slidesToShow: 2,
					        slidesToScroll: 2
					      }
					    },
					    {
					      breakpoint: 767,
					      settings: {
					        slidesToShow: 1,
					        slidesToScroll: 1
					      }
					    }
					]
				});

				$('.reviews-slider').slick({
					dots: true,
					arrows: false
				});
			}
		},

		animation: function() {
			var winScroll = $(window).scrollTop();
			var winHeight = $(window).height();

			$('.animate').each(function(i, el) {
				var elPos = $(el).offset().top;
				
				if (elPos < winScroll + (winHeight / 1.5)  && !$(el).hasClass('animated')) {
					$(el).addClass('animated');
				}
			});
		},

		mobileMenu: function() {

			$('.menu-toggle').click(function(e) {
				e.preventDefault();

				if (!$('.menu-overlay').length) {
					$('body').append('<div class="menu-overlay"></div>');
					$('.menu-overlay').click(function() {
						$('#header').removeClass('menu-opened');
						$(this).css({
							'visibility': 'hidden',
							'opacity': 0
						});
					});
				} else {
					$('.menu-overlay').css({
							'visibility': 'visible',
							'opacity': 1
					});
				}

				$('#header').toggleClass('menu-opened');
			});
		},
	}

	App.init();
});