import { DoCheck, NgModule, Directive, ElementRef, Renderer2, OnDestroy, Input, Output, OnInit, OnChanges, EventEmitter, HostListener, KeyValueDiffers } from '@angular/core';
import { CarouselInterface } from './carousel';
import { CarouselResponsive } from './carousel-responsive';

@Directive({
	selector: '[umf-carousel]',
	exportAs: 'umf-carousel',
	outputs: ['sendNext', 'sendPrev']
})
export class EvcCarouselDirective implements OnInit, DoCheck {

	private childrenArr: Array<Element> = [];
	@Input() config: CarouselInterface;
	private widthWindow: number;
	private differ: any;
	private ele: any;
	private index: number;
	private responsive: CarouselResponsive;
	private checkBreakpoint: boolean;
	private dragoffset: { x: number };
	private translateX: number;
	private offsetX: number;
	allowDrag: boolean = false;

	@Output() sendNext: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() sendPrev: EventEmitter<boolean> = new EventEmitter<boolean>();

	@Output() sendArrows: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() sendDots: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() dots: EventEmitter<object> = new EventEmitter<object>();
	@Output() draggedNext: EventEmitter<object> = new EventEmitter<object>();
	@Output() draggedPrev: EventEmitter<object> = new EventEmitter<object>();

	constructor(
		private el: ElementRef,
		private renderer: Renderer2,
		private differs: KeyValueDiffers
	) {
		//Nos permite detectar cambios en los elementos de nuestro carousel
		this.differ = differs.find({}).create();
	}

	ngOnInit(): void {
		//we indicate the index in which we start our carousel, by default is 0
		this.index = 0;
		//we calculate the width of the window at startup in order to be able to perform the responsive check
		//Initialize the state of the arrows
		this.sendNext.emit(false);
		this.sendPrev.emit(true);
		//We initialize the variable that indicates us if we are inside one of the cut points configured in the configuration to false, then we will perform the check.
		this.checkBreakpoint = false;
		//add the carousel transition according to configuration
		this.el.nativeElement.style.transition = `all ${this.config.speed}ms ease`;
		//
		this.responsive = {
			breakpoint: 0,
			dots: false,
			slidesToScroll: 0,
			slidesToShow: 0
		};
		this.allowDrag = false;
		this.dragoffset = {
			x: 0
		};
		this.translateX = 0;
		this.offsetX = 0;
	}

	ngAfterViewInit() {
		//After starting the component and the directive, we check which cutting point we are at.
		this.reziseTo(this.getWidthWindow());
	}

	/**
	 * @description Function that allows us to inject the configuration.
	 * @param value
	 */
	ngConfig(value: CarouselInterface) {
		this.config = value;
	}


	ngDoCheck() {
		this.childrenArr = this.el.nativeElement.children || [];
		//If we have changes of childrens...
		this.ele = this.el.nativeElement;
		let changes = this.differ.diff(this.childrenArr);

		if (changes) {
			let childrenCount = this.ele.childElementCount;
			if (childrenCount > 0) this.itemShow(childrenCount);
		}
	}

	/**
	 * @description We will calculate the items that we are going to show according to the configuration and the cut-off point.
	 * @param children
	 */
	itemShow(children: number) {
		let slidesToShow;
		let slidesToScroll;
		let limit;

		/**
		 * check if we are inside our cut-off point to take one or another configuration.
		 * this.responsive contains the cut-off point configuration.
		 * this.config contains the general configuration.
		 */
		if (this.checkBreakpoint) {
			slidesToShow = this.responsive.slidesToShow;
			slidesToScroll = this.responsive.slidesToScroll;
		} else {
			slidesToShow = this.config.slidesToShow;
			slidesToScroll = this.config.slidesToScroll;
		}

		/**
		 * We calculate the width of our elements according to the elements to be displayed.
		 */
		let width = this.ele.parentNode.offsetWidth;
		let childrens: Array<any> = this.ele.children;
		for (let i = 0; i < childrens.length; i++) {
			childrens[i].style.width = `calc(${width}px / ${slidesToShow})`;
		}

		/**
		 * we will move the element according to the indicated index, this will allow us not to lose the focus when changing the view and the elements to show change.
		 */
		limit = children - slidesToScroll;
		this.translate(width, slidesToScroll, slidesToShow, limit, true, false);
		this.configResponsive();
	}

	/**
	 * @description function that allows us to advance the items of our carousel according to the indicated displacement.
	 */
	nextItem() {
		let slidesToShow;
		let slidesToScroll;
		let children = this.ele.childElementCount;
		let width = this.ele.parentNode.offsetWidth;
		let limit;
		//if we've entered a cut-off point
		if (this.checkBreakpoint) {
			slidesToShow = this.responsive.slidesToShow;
			slidesToScroll = this.responsive.slidesToScroll;
		} else {
			slidesToShow = this.config.slidesToShow;
			slidesToScroll = this.config.slidesToScroll;
		}
		limit = children - slidesToScroll;
		//check whether displacement is allowed
		if ((this.index < limit && this.index >= 0) || this.config.infinite) {
			//we call the scroll function
			this.translate(width, slidesToScroll, slidesToShow, limit, true, true);
			if (this.index === limit) {
				//add class disabled
				this.sendNext.emit(true);
				//remove class disabled
				this.sendPrev.emit(false);
			} else {
				//remove class disabled
				this.sendNext.emit(false);
				if (this.index !== 0) {
					//remove class disabled
					this.sendPrev.emit(false);
				}
			}
		}
	}

	/**
	 * @description function that allows us to back up the items of our carousel according to the indicated displacement.
	 */
	prevItem() {
		let slidesToShow;
		let slidesToScroll;
		let children = this.ele.childElementCount;
		let width = this.ele.parentNode.offsetWidth;
		let limit;
		//if we've entered a cut-off point
		if (this.checkBreakpoint) {
			slidesToShow = this.responsive.slidesToShow;
			slidesToScroll = this.responsive.slidesToScroll;
		} else {
			slidesToShow = this.config.slidesToShow;
			slidesToScroll = this.config.slidesToScroll;
		}

		limit = children - slidesToScroll;
		//
		if ((this.index > 0 && this.index <= limit) || this.config.infinite) {
			this.translate(width, slidesToScroll, slidesToShow, limit, false, true);
			if (this.index === limit) {
				//remove class disabled
				this.sendPrev.emit(false);
				//add class disabled
				this.sendNext.emit(true);
			} else {
				//add class disabled
				if (this.index === 0) {
					this.sendPrev.emit(true);
				}
				if (this.index !== limit) {
					//remove class disabled
					this.sendNext.emit(false);
				}
			}
		} else if (this.index > limit) {
			if (this.checkBreakpoint) {
				slidesToScroll = this.responsive.slidesToScroll;
			} else {
				slidesToScroll = this.config.slidesToScroll;
			}
			this.index = limit - slidesToScroll;
		}
	}

	@HostListener('mousedown', ['$event'])
	@HostListener('touchstart', ['$event'])
	onMouseDown(event: any) {
		let e: any = event;
		let x: number
		this.allowDrag = true;
		this.renderer.addClass(this.ele, 'umf-carousel__list--dragging');
		x = (e.pageX ? e.pageX : e.touches[0].pageX) || (e.clientX ? e.clientX : e.touches[0].clientX) + this.el.nativeElement.scrollLeft;
		this.dragoffset.x = x;
		this.el.nativeElement.style.transition = `all 0s`;
	}

	@HostListener('document:mouseup')
	@HostListener('document:touchend')
	onMouseUp() {
		this.allowDrag = false;
		this.renderer.removeClass(this.ele, 'umf-carousel__list--dragging');
		this.el.nativeElement.style.transition = `all ${this.config.speed}ms ease`;
		if (this.offsetX < 0) {
			if (this.offsetX < (-this.ele.parentNode.offsetWidth / 4)) {
				this.draggedNext.emit({ 'click': 'click' });
			} else {
				this.ele.style.transform = `translateX(-${this.translateX}px)`;
			}
		} else if (this.offsetX > 0) {
			if (this.offsetX > (this.ele.parentNode.offsetWidth / 4)) {
				this.draggedPrev.emit({ 'click': 'click' });
			} else {
				this.ele.style.transform = `translateX(-${this.translateX}px)`;
			}
		}
		this.offsetX = 0;
	}

	@HostListener('document:mousemove', ['$event'])
	@HostListener('document:touchmove', ['$event'])
	onMouseMove(event: any) {
		if (this.allowDrag) {
			this.move(event);
		}
	}
	/**
	 * @description Function triggered when dragg a caraousel element that moves carousel forward or backward .
	 *  @param event
	 */
	move(event: Event) {

		let e: any = event;
		let offsetX: number;
		let x: number
		let pageX = (e.pageX !== undefined ? e.pageX : e.touches[0].pageX);
		let clientX = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX);
		x = (e.pageX !== undefined ? e.pageX : e.touches[0].pageX) || (e.clientX !== undefined ? e.clientX : e.touches[0].clientX) + this.el.nativeElement.scrollLeft;
		offsetX = x - this.dragoffset.x;
		this.offsetX = offsetX;
		let movement = this.translateX - offsetX;
		let slidesToShow;
		let slidesToScroll;
		let children = this.ele.childElementCount;
		let width = this.ele.parentNode.offsetWidth;
		let limit;

		//if we've entered a cut-off point
		if (this.checkBreakpoint) {
			slidesToShow = this.responsive.slidesToShow;
			slidesToScroll = this.responsive.slidesToScroll;
		} else {
			slidesToShow = this.config.slidesToShow;
			slidesToScroll = this.config.slidesToScroll;
		}
		limit = children - slidesToScroll;
		if (Math.abs(offsetX) <= (this.ele.children[0].offsetWidth * slidesToShow)) {
			if (movement < 0) {
				if (this.config.infinite) {
					movement = Math.abs(movement);
					this.ele.style.transform = `translateX(${movement}px)`;
				}
			} else {
				if (movement < this.translateX || this.index < limit || this.config.infinite) {
					this.ele.style.transform = `translateX(-${movement}px)`;
				}
			}
		} else {
			if ((movement < this.translateX && movement > 0) || this.index < limit || this.config.infinite) {
				if (offsetX >= 0) {
					this.ele.style.transform = `translateX(-${this.translateX - (this.ele.children[0].offsetWidth * slidesToShow)}px)`;
				} else {
					this.ele.style.transform = `translateX(-${this.translateX + (this.ele.children[0].offsetWidth * slidesToShow)}px)`;
				}
			}
		}

	}


	/**
	 * @description function that allows us to move our items to both sides.
	 * @param index
	 * @param slidesToScroll
	 * @param slidestoShow
	 * @param direction
	 */
	translate(width?: number, slidesToScroll?: number, slidesToShow?: number, limit?: number, direction?: boolean, move?: boolean) {
		if (move) {
			if (direction) {
				if ((this.index + slidesToScroll) > limit) {
					if (this.config.infinite && this.index === limit) {
						// this.el.nativeElement.style.transition = `all 0s`;
						// this.el.nativeElement.style.opacity = 0;
						// this.el.nativeElement.style.animation = 'fadeInRtl 0.5s ease-in-out both';
						// this.el.nativeElement.style.opacity = 1;
						this.index = 0;
					} else {
						this.el.nativeElement.style.animation = '';
						this.el.nativeElement.style.transition = `all ${this.config.speed}ms ease`;
						this.index = limit;
					}
				} else {
					this.el.nativeElement.style.animation = '';
					this.el.nativeElement.style.transition = `all ${this.config.speed}ms ease`;
					this.index = this.index + slidesToScroll;
				}
			} else if (!direction) {
				if ((this.index - slidesToScroll) < 0) {
					if (this.config.infinite && this.index === 0) {
						this.index = limit;
						this.el.nativeElement.style.transition = `all 0s`;
						this.el.nativeElement.style.opacity = 0;
						this.el.nativeElement.style.animation = 'fadeInLtr 0.5s ease-in-out both';
						this.el.nativeElement.style.opacity = 1;
					} else {
						this.el.nativeElement.style.animation = '';
						this.el.nativeElement.style.transition = `all ${this.config.speed}ms ease`;
						this.index = 0;
					}
				} else {
					this.el.nativeElement.style.animation = '';
					this.el.nativeElement.style.transition = `all ${this.config.speed}ms ease`;
					this.index = this.index - slidesToScroll;
				}
			}
		} else {
			if (this.index > limit) {
				this.index = limit;
			}
		}
		this.showSlides(slidesToShow);
		let translate = (width / slidesToShow) * this.index;
		this.translateX = translate;
		this.ele.style.transform = `translateX(-${translate}px)`;
	}

	showSlides(nSlides: number) {
		let currentIndex = this.index;
		let itemsShowing = this.ele.querySelectorAll('.umf-carousel__item-container--show');
		let nItemsShowing = this.ele.querySelectorAll('.umf-carousel__item-container--show').length;
		for (let i = 0; i < nItemsShowing; i++) {
			this.renderer.removeClass(itemsShowing[i], 'umf-carousel__item-container--show');
		}
		for (let i = 0; i < nSlides && currentIndex < this.ele.children.length; i++) {
			this.renderer.addClass(this.ele.children[currentIndex++].querySelector('.umf-carousel__item-container'), 'umf-carousel__item-container--show');
		}
	}

	/**
	 * @description allows us to move through our carousel, this function will be used through the dots.
	 * @param value
	 */
	moveTo(value: number) {
		this.index = value;

		let slidesToShow;
		//if we've entered a cut-off point
		if (this.checkBreakpoint) {
			slidesToShow = this.responsive.slidesToShow;
		} else {
			slidesToShow = this.config.slidesToShow;
		}
		//We calculate the width of our elements according to the show
		let width = this.ele.parentNode.offsetWidth;

		let translate = (width / slidesToShow) * this.index;
		this.showSlides(slidesToShow);
		this.ele.style.transform = `translateX(-${translate}px)`;
		if (this.index === 0) {
			this.sendNext.emit(false);
			this.sendPrev.emit(true);
		}
	}

	/**
	 *
	 * @param width
	 */
	reziseTo(width: number) {
		// viewChild is updated after the view has been checked
		let slidesToShow;
		let slidesToScroll;
		if (this.checkBreakpoint) {
			slidesToShow = this.responsive.slidesToShow;
			slidesToScroll = this.responsive.slidesToScroll;
		} else {
			slidesToShow = this.config.slidesToShow;
			slidesToScroll = this.config.slidesToScroll;
		}
		let childrenCount = this.ele.childElementCount;
		//
		if (this.intoBreakpoint(width)) {
			if (childrenCount > 0) {
				this.itemShow(childrenCount);
			}
		} else {
			if (childrenCount > 0) this.itemShow(childrenCount);
		}
		this.getDots();
	}

	/**
	 *
	 * @param value
	 */
	intoBreakpoint(value: number): boolean {
		this.checkBreakpoint = false;
		let breakp: Array<number> = new Array<number>();
		let responsive: Array<CarouselResponsive> = new Array<CarouselResponsive>();
		responsive = this.config.responsive;
		responsive.forEach(element => {
			breakp.push(element.breakpoint);
		});

		let punto = breakp.sort((a, b): number => {
			if (a < b) return -1;
			if (a > b) return 1;
			return 0;
		});

		let iconfig: number;
		let vconfig: number;
		punto.forEach((element, index) => {
			if (value < element) {
				this.checkBreakpoint = true;
				iconfig = index;
				vconfig = element;
				//
				if ((typeof this.responsive !== 'undefined')) {
					if ((typeof this.responsive.breakpoint !== 'undefined') && (value >= this.responsive.breakpoint)) {
						this.breakpoint(iconfig, vconfig);
					} else if ((typeof this.responsive.breakpoint !== 'undefined') && (element < this.responsive.breakpoint)) {
						this.breakpoint(iconfig, vconfig);
					} else if (typeof this.responsive.breakpoint === 'undefined') {
						this.breakpoint(iconfig, vconfig);
					}
				}
			}
		})

		return this.checkBreakpoint;
	}

	/**
	 *
	 * @param iconfig
	 * @param vconfig
	 */
	breakpoint(iconfig: number, vconfig: number) {
		let responsive: CarouselResponsive;
		let responsives: Array<CarouselResponsive> = new Array<CarouselResponsive>();
		responsives = this.config.responsive;

		for (let i = 0; i < responsives.length; i++) {
			if (vconfig === responsives[i].breakpoint) {
				if (typeof this.responsive.breakpoint !== 'undefined') {
					if ((typeof this.responsive.breakpoint !== 'undefined') && this.responsive.breakpoint >= responsives[i].breakpoint) {
						responsive = responsives[i];
					} else if ((typeof this.responsive.breakpoint !== 'undefined') && this.responsive.breakpoint <= responsives[i].breakpoint) {
						responsive = responsives[i];
					} else if ((typeof this.responsive.breakpoint === 'undefined') && (typeof responsive.breakpoint === 'undefined')) {
						responsive = responsives[i];
					}
				} else {
					responsive = responsives[i];
				}
			}
		}
		this.responsive = responsive;
		let childrenCount = this.ele.childElementCount;
		if (childrenCount > 0) this.itemShow(childrenCount);
	}
	/**
	 * @description Adjust responsive with given breakpoints.
	 *
	 */
	configResponsive() {
		if (this.checkBreakpoint) {
			this.sendDots.emit(this.responsive.dots);
		} else {
			this.sendDots.emit(this.config.dots);
		}
	}
	/**
	 * @description calculates dots after resize.
	 *
	 */
	getDots() {
		let dots: object = {
			dots: [],
			index: 0
		};
		let childrenCount = this.ele.childElementCount;
		let slidesToScroll;
		if (this.checkBreakpoint) {
			slidesToScroll = this.responsive.slidesToScroll;
		} else {
			slidesToScroll = this.config.slidesToScroll;
		}
		let i: number = childrenCount / slidesToScroll;
		let h: number = Math.ceil(i);
		for (let p = 0; p < h; p++) {
			dots['dots'].push(p * slidesToScroll);
		}
		dots['index'] = this.index;
		this.dots.emit(dots);
	}
	/**
	 *
	 * @returns actual window size.
	 */
	getWidthWindow(): number {
		this.widthWindow = window.innerWidth;
		return this.widthWindow;
	}

	resetTranslate() {
		this.translate(0);
	}
}
