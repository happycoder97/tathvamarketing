$(document).ready(function(){
  AOS.init({ disable: 'mobile' });

  // Avoiding glitch in carousel slide transition due to undefined height
  const height = $('.carousel-inner').css("height");
  const width = $('.carousel-inner').css("width");
  $('.carousel .img-div').css("width", width);
  $('.carousel .img-div').css("height", height);
});