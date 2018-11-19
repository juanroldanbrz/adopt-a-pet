import { CarouselResponsive } from './carousel-responsive';

/**
 * Interface that will allow us to configure the properties of the carousels
 */

export interface CarouselInterface {
    infinite: boolean;
    slidesToShow: number;
    slidesToScroll: number;
    autoplay: boolean;
    interval: number,
    speed: string;
    dots: boolean;
    dotActive: string;
    dotInactive: string;
    nextArrow: string;
    prevArrow: string;
    responsive: Array<CarouselResponsive>;
}
