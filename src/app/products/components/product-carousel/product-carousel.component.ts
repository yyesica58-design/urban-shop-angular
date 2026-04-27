import { AfterViewInit, Component, effect, ElementRef, Input, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import Swiper from 'swiper';
import {Navigation,Pagination} from 'swiper/modules'


@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styles:`
  .swiper{
    width: 100%;
    height: 500px;
  }
  `
})
export class ProductCarouselComponent  implements AfterViewInit{
  images = input.required<string[]>()
  // @Input() images: string[] = []
  swiperDiv = viewChild.required<ElementRef>('swiperDiv')
  swiper : Swiper | undefined = undefined


  ngOnChanges(changes: SimpleChanges): void {
    if(changes['images'].firstChange){
      return
    }

    if(!this.swiper)return

    const paginationEl = this.swiperDiv().nativeElement?.querySelector('.swiper-pagination')

    this.swiper.destroy(true,true)
    this.swiperInit()

    paginationEl.innerHTML = ''

    setTimeout(() => {
      this.swiperInit()
    }, 100);
  }

  ngAfterViewInit(): void {
    this.swiperInit()
  }


  swiperInit(){
      const element = this.swiperDiv().nativeElement
      if(!element) return

      this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      // loop: true,
      rewind: true,

      modules:[
        Navigation, Pagination
      ],

      // effect: 'fade', // Efecto que agregue al revisar la documentacion
      // fadeEffect: {
      //   crossFade: true,
      // },

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });

      }

}
