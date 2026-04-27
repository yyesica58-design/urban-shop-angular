import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTableComponent } from "@products/components/product-table/product-table.component";
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent,RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  productService = inject(ProductsService)
  paginationService = inject(PaginationService)

  productsPerpage = signal(10)


  productsResource = rxResource({
    params: () => ({page:this.paginationService.currentPage() - 1,limit:this.productsPerpage()}),
    stream: ({params}) => {
      return this.productService.getProducts({
        offset: params.page * params.limit,
        limit: params.limit
      })
    }
  })
}
