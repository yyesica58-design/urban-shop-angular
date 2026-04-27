import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCardComponent } from "@products/components/product-card.component/product-card.component";
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCardComponent, ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  productService = inject(ProductsService)
  activatedRoute = inject(ActivatedRoute)

  productIdSlug:string = this.activatedRoute.snapshot.params['idSlug']

  productResource = rxResource({
    params: () => ({idSlug: this.productIdSlug}),
    stream: ({params}) => {
      return this.productService.getProductByIdSlug(params.idSlug)
    }
  })
}
