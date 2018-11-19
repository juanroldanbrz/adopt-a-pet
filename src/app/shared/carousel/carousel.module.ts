import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvcCarouselComponent } from './carousel.component';
import { EvcCarouselDirective } from './carousel.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    EvcCarouselComponent, EvcCarouselDirective
  ],
  declarations: [
    EvcCarouselComponent,
    EvcCarouselDirective
  ]
})
export class EvcCarouselModule { }
