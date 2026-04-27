import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '@products/components/product-card.component/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { map } from 'rxjs';
import { Pagination } from 'swiper/modules';
import { PaginationService } from '../../../shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent,PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  productService = inject(ProductsService)
  route = inject(ActivatedRoute);
  paginationService = inject(PaginationService)

  gender = toSignal(this.route.params.pipe(map(({gender})=> gender)))

  productsResource = rxResource({
    params: () => ({page:this.paginationService.currentPage() - 1,
      gender : this.gender()}),
    stream: ({params}) => {
      return this.productService.getProducts({gender:params.gender,
        offset: params.page * 9
      })
    }
  })
}
