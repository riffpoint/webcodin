$(function() {
	// first screen height
	function setHeightFirst() {
		$('.first-screen').css('height', $(window).height());
	}
	$(window).on('resize', setHeightFirst);
	setHeightFirst();

	// slider init
	$('.slider').slick({
		slidesToShow: 4,
		slidesToScroll: 4,
		arrows: false,
		dots: true,
		autoplay: true,
		autoplaySpeed: 8000,
		responsive: [
		    {
		      breakpoint: 767,
		      settings: {
				slidesToShow: 1,
				slidesToScroll: 1
		      }
		    }
		  ]
	});

	$('.slider-2').slick({
		slidesToShow: 5,
		slidesToScroll: 5,
		arrows: false,
		dots: true,
		autoplay: true,
		autoplaySpeed: 8000,
		responsive: [
		    {
		      breakpoint: 767,
		      settings: {
				slidesToShow: 2,
				slidesToScroll: 2
		      }
		    }
		  ]
	});

	$('.slider-3').slick({
		arrows: false,
		dots: true,
		autoplay: true,
		autoplaySpeed: 8000
	});

	// navigation
	$('.h-nav ul a').on('click', function(e) {
		e.preventDefault();
		var targetBlock = $(this).attr('href');
		$('html, body').animate({
			scrollTop: $(targetBlock).offset().top
		}, 1000);
	});

	// scroll to top

	$('.to-top').on('click', function(e){
		e.preventDefault();
		$('html, body').animate({
			scrollTop: 0
		}, 1000);
	});

	function toTopBtnStyle() {
		var btn = $('.to-top');
		if ($(window).scrollTop() < 1) {
			btn.css('display', 'none');
		} else {
			btn.css('display', 'flex');
		}
	}

	toTopBtnStyle();
	$(window).on('scroll', toTopBtnStyle);

	// mobile-menu
	$('.menu-toggle').on('click', function(e) {
		e.preventDefault();

		$('.h-nav ul').slideToggle();
	});
});