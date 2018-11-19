export const settingsCarousel: Object = {
  infinite: false,
  slidesToShow: 2,
  slidesToScroll: 2,
  autoplay: false,
  interval: 2400,
  speed: '500',
  dots: true,
  dotActive: '',
  dotInactive: '',
  arrows: false,
  nextArrow: 'fa fa-chevron-right',
  prevArrow: 'fa fa-chevron-left',
  responsive: [
    {
      breakpoint: 980,
      arrows: true,
      dots: true,
      slidesToScroll: 3,
      slidesToShow: 3,
    },
    {
      breakpoint: 780,
      arrows: true,
      dots: true,
      slidesToScroll: 2,
      slidesToShow: 2,
    },
    {
      breakpoint: 480,
      arrows: true,
      dots: true,
      slidesToScroll: 1,
      slidesToShow: 1,
    },

    {
      breakpoint: 320,
      arrows: true,
      dots: true,
      slidesToScroll: 1,
      slidesToShow: 1,
    },

  ]
}