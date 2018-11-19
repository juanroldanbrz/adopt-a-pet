import { Component, OnInit, Input, Output, ViewChild, ElementRef, ViewChildren, QueryList, ContentChildren, HostListener, EventEmitter, ContentChild, TemplateRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Animation } from '@angular/animations/browser/src/dsl/animation';
import { EvcCarouselDirective } from './carousel.directive';
import { CarouselInterface } from './carousel';
import { CarouselResponsive } from './carousel-responsive';


@Component({
	selector: 'umf-carousel',
	templateUrl: './carousel.component.html',
	styleUrls: ['./carousel.component.scss']
})
export class EvcCarouselComponent implements OnInit, AfterViewInit {


	@Input() data: any;
	@Input() settings: CarouselInterface;
	@Output() onNext: EventEmitter<object> = new EventEmitter();
	@Output() onPrev: EventEmitter<object> = new EventEmitter();
	@Output() onChange: EventEmitter<object> = new EventEmitter();
	next: boolean = false;
	prev: boolean = false;
	arrows: boolean;
	dots: boolean;
	index: number;
	@Input() arrayDots: any;
	@ViewChild('nav', { read: EvcCarouselDirective }) carouselDirective: EvcCarouselDirective;
	@ContentChild('item') itemTmpl: TemplateRef<any>;

	ngOnInit() {
		this.arrayDots = [];
		this.carouselDirective.ngConfig(this.settings);
		this.index = 0;

	}
	constructor(private changeDetectorRef: ChangeDetectorRef) { }
	ngAfterViewInit(): void {
		if (this.settings.autoplay) {
			setInterval(() => {
				if (!this.carouselDirective.allowDrag) {
					this.nextItem()
				}
			}, this.settings.interval);
		}
	}

	/**
	 * @description captures directive values to apply disabled class in arrow if necessary.
	 * @param e
	 */
	setNext(e) {
		this.next = e;
	}

	/**
	 * @description captures directive values to apply disabled class in arrow if necessary.
	 * @param e
	 */
	setPrev(e) {
		this.prev = e;
	}

	/**
	 * @description we move our carousel X forward, where X is the value indicated in its configuration.
	 * @param e
	 */


	nextItem(e?) {
		if (typeof e !== 'undefined' && e.click !== 'click') {
			e.preventDefault();
		}
		this.index = this.index + 1;
		if (this.index === this.arrayDots.length) {
			if (this.settings.infinite) {
				this.index = 0;
			} else {
				this.index = this.arrayDots.length - 1;
			}
		}
		this.carouselDirective.nextItem();
		if (typeof e !== 'undefined') {
			e.index = this.index;
			this.onNext.emit(e);
			this.onChange.emit(e);
		} else {
			this.onNext.emit({ index: this.index });
			this.onChange.emit({ index: this.index });
		}
	}

	/**
	 * @description we move our carousel X backwards, where X is the value indicated in its configuration.
	 * @param e
	 */
	prevItem(e?) {
		if (typeof e !== 'undefined' && e.click !== 'click') {
			e.preventDefault();
		}
		if (this.index != 0) {
			this.index = this.index - 1;
		} else if (this.settings.infinite) {
			this.index = this.arrayDots.length - 1;
		}
		this.carouselDirective.prevItem();
		e.index = this.index;
		this.onPrev.emit(e);
		this.onChange.emit(e);
	}

	/**
	 * @description we control the event resize our component to change the configuration.
	 * @param event
	 */
	onResize(event) {
		const w = event.target.innerWidth;
		this.carouselDirective.reziseTo(w);
	}

	/**
	 * @description control whether or not we display navigation arrows.
	 * @param e
	 */
	setArrows(e) {
		this.arrows = e;
	}

	/**
	 * @description control whether or not we show the navigation dots.
	 * @param e
	 */
	setDots(e) {
		this.dots = e;
	}

	/**
	 * @description we collect the number of dots that we must show according to the displacement we have in each view.
	 * @param e
	 */
	setArrayDots(e) {
		this.arrayDots = e['dots'];
		this.changeDetectorRef.detectChanges();
		let indexed = false;
		let i = 0;
		//compare actual carousel index with number of dots for get the actual dot
		while (!indexed) {
			if (e['dots'][i] === e['index']) {
				this.index = i;
				indexed = true;
			} else if (e['dots'][(i + 1)] > e['index']) {
				this.index = i;
				indexed = true;
			} else if (e['dots'][(i + 1)] == e['index']) {
				this.index = i + 1;
				indexed = true;
			}
			i++;
		}
		if (this.arrayDots.length < 2) {
			this.next = true;
		}
	}

	/**
	 * @description we move our carousel through the dots.
	 * @param value
	 */
	moveTo(e, value: number, index: number) {
		e.preventDefault();
		this.index = index;
		this.carouselDirective.moveTo(value);
		this.onChange.emit(e);
	}
}
