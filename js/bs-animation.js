$(document).ready(function(){
  AOS.init({ disable: 'mobile' });
	$('[data-bs-hover-animate]')
		.mouseenter( function(){ var elem = $(this); elem.addClass('infront animated ' + elem.attr('data-bs-hover-animate')) })
    .mouseleave( function(){ var elem = $(this); elem.removeClass('infront animated ' + elem.attr('data-bs-hover-animate')) });

  // Avoiding glitch in carousel slide transition due to undefined height
  const height = $('.carousel-inner').css("height");
  const width = $('.carousel-inner').css("width");
  $('.carousel .img-div').css("width", width);
  $('.carousel .img-div').css("height", height);
});