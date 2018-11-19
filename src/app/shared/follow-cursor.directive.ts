import { Directive, Renderer2, OnInit, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFollowCursor]'
})
export class FollowCursorDirective implements OnInit {

  _x: number = 0;
  _y: number = 0;
  x: number = 0;
  y: number = 0;

  counter = 0;
  updateRate = 3;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.setOrigin(this.el.nativeElement);
  }

  updatePosition(event) {
    var e = event || window.event;
    this.x = e.clientX - this._x;
    this.y = (e.clientY - this._y) * -1;
  }

  setOrigin(e) {
    this._x = e.offsetLeft + Math.floor(e.offsetWidth / 4);
    this._y = e.offsetTop + Math.floor(e.offsetHeight / 4);
  }

  show() {
    return "(" + this.x + ", " + this.y + ")";
  }


  //-----------------------------------------

  isTimeToUpdate() {
    return this.counter++ % this.updateRate === 0;
  };

  //-----------------------------------------
  @HostListener('mouseenter')
  onMouseEnterHandler(event) {
    this.update(event);
  };

  @HostListener('mouseleave')
  onMouseLeaveHandler() {
    this.el.nativeElement.removeAttribute('style');
  };

  @HostListener('mousemove')
  onMouseMoveHandler(event) {

    if (this.isTimeToUpdate()) {
      this.update(event);
    }
  };

  //-----------------------------------------

  update(event) {
    this.updatePosition(event);
    this.updateTransformStyle(
      (this.y / this.el.nativeElement.offsetHeight / 2).toFixed(2),
      (this.x / this.el.nativeElement.offsetWidth / 2).toFixed(2)
    );
  };

  updateTransformStyle(x, y) {
    var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
    this.el.nativeElement.setAttribute('style', 'transform:' + style);
  };

}
