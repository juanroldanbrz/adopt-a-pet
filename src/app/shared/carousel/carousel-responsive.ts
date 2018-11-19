/**
 * interface that will allow us to specify the configuration according to the cutting points indicated.
 */

export interface CarouselResponsive {
    breakpoint: number;
    slidesToShow: number;
    slidesToScroll: number;
    dots: boolean;
}
