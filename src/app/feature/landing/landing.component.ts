import { Component, OnInit, HostListener, AfterViewInit, ViewChild, AfterViewChecked, AfterContentInit } from '@angular/core';
import * as  THREE from 'three';
import { TweenLite } from 'gsap';
import { tabAbout } from './../../data/tabAbout';
import { settingsCarousel } from './../../data/settingsCarousel';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit, AfterViewInit {
  parent: any;
  mat: any;
  dataCarousel: Object;
  settingsCarousel: Object;
  isAnimating: any = false;
  sliderImages: any[] = [];
  slideActive: number = 0;
  tabAboutData: any[] = [];
  tabAboutIndex: number = 0;
  sectionIndex: number = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    var elements = Array.from(document.querySelectorAll('section'));
    for (let index = 0; index < elements.length; index++) {
      if (this.isInViewPort(elements[index])) {
        this.sectionIndex = index;
      }
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    var elements = Array.from(document.querySelectorAll('section'));
    for (let index = 0; index < elements.length; index++) {
      if (this.isInViewPort(elements[index])) {
        this.sectionIndex = index;
      }
    }
  }

  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   //fix in ie
  //   if (event.key === 'ArrowDown') {
  //     this.changeSlide(this.slideActive === this.sliderImages.length - 1 ? 0 : this.slideActive + 1);
  //   } else if (event.key === 'ArrowUp') {
  //     this.changeSlide(this.slideActive === 0 ? this.sliderImages.length - 1 : this.slideActive - 1);
  //   }
  // }

  constructor() { }

  ngOnInit() {
    this.tabAboutData = tabAbout;
    this.dataCarousel = [{}, {}, {}, {}, {}]
    this.settingsCarousel = settingsCarousel;
  }

  ngAfterViewInit(): void {
    this.parent = document.getElementById('slider');
    const imgs = ['assets/images/sample.jpg', 'assets/images/sample1.jpg', 'assets/images/sample2.jpg', 'assets/images/sample1.jpg'];

    new this.displacementSlider({
      parent: this.parent,
      images: imgs,
      context: this
    });

  }


  displacementSlider(opts) {

    let vertex = `
    varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
  `;

    let fragment = `
      
      varying vec2 vUv;
      uniform sampler2D currentImage;
      uniform sampler2D nextImage;
      uniform float dispFactor;

      void main() {
          vec2 uv = vUv;
          vec4 _currentImage;
          vec4 _nextImage;
          float intensity = 0.3;

          vec4 orig1 = texture2D(currentImage, uv);
          vec4 orig2 = texture2D(nextImage, uv);
          
          _currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));

          _nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));

          vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);

          gl_FragColor = finalTexture;

      }
  `;

    let images = opts.images, image;

    // let canvasWidth = images[0].clientWidth;
    let canvasWidth = 1100;
    // let canvasHeight = images[0].clientHeight;
    let canvasHeight = 1200;
    let parent = opts.parent;
    let renderWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let renderHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    let renderW, renderH;

    if (renderWidth > canvasWidth) {
      renderW = renderWidth;
    } else {
      renderW = canvasWidth;
    }

    renderH = canvasHeight;

    let renderer = new THREE.WebGLRenderer({
      antialias: false,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x080D10, 1.0);
    renderer.setSize(renderW, renderH);
    parent.appendChild(renderer.domElement);
    console.log(parent.querySelectorAll('canvas'));
    parent.querySelectorAll('canvas')[0].setAttribute('class', 'umf-slider__canvas')
    let loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    images.forEach((img) => {
      image = loader.load(img + '?v=' + Date.now());
      image.magFilter = image.minFilter = THREE.LinearFilter;
      image.anisotropy = renderer.capabilities.getMaxAnisotropy();
      opts.context.sliderImages.push(image);
    });

    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080D10);
    let camera = new THREE.OrthographicCamera(
      renderWidth / -2,
      renderWidth / 2,
      renderHeight / 2,
      renderHeight / -2,
      1,
      1000
    );

    camera.position.z = 1;

    opts.context.mat = new THREE.ShaderMaterial({
      uniforms: {
        dispFactor: { type: "f", value: 0.0 },
        currentImage: { type: "t", value: opts.context.sliderImages[0] },
        nextImage: { type: "t", value: opts.context.sliderImages[1] },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      opacity: 1.0
    });

    let geometry = new THREE.PlaneBufferGeometry(
      parent.offsetWidth,
      parent.offsetHeight,
      1
    );
    let object = new THREE.Mesh(geometry, opts.context.mat);
    object.position.set(0, 0, 0);
    scene.add(object);

    let animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  };

  changeSlide(slideId) {

    if (!this.isAnimating) {

      this.isAnimating = true;
      this.slideActive = slideId;

      this.mat.uniforms.nextImage.value = this.sliderImages[slideId];
      this.mat.uniforms.nextImage.needsUpdate = true;
      var self = this;
      TweenLite.to(this.mat.uniforms.dispFactor, 1, {
        value: 1,
        ease: 'Expo.easeInOut',
        onComplete: function () {
          self.mat.uniforms.currentImage.value = self.sliderImages[slideId];
          self.mat.uniforms.currentImage.needsUpdate = true;
          self.mat.uniforms.dispFactor.value = 0.0;
          self.isAnimating = false;
        }
      });
    }
  }

  setTabIndexAbout(event, index) {
    event.preventDefault();
    this.tabAboutIndex = index;
  }

  isInViewPort(element) {
    var elementTop = element.offsetTop;
    return (Math.round(window.scrollY) >= elementTop - 80) ? true : false;
  }
}