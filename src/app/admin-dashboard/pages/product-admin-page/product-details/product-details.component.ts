import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '../../../../products/interfaces/product.interface';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabelComponent } from "@shared/components/form-error-label/form-error-label.component";
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit{
  product = input.required<Product>()

  productService = inject(ProductsService)
  fb = inject(FormBuilder)
  router = inject(Router)
  wasSaved = signal(false)

  imageFileList : FileList | undefined = undefined
  tempImages = signal<string[]>([])

  productForm = this.fb.group({
    title:['',Validators.required],
    description: ['',Validators.required],
    slug: ['',[Validators.required,Validators.pattern(FormUtils.slugPattern)]],
    price:['',[Validators.required,Validators.min(0)]],
    stock:['',[Validators.required,Validators.min(0)]],
    sizes:[['']],
    images:[[]],
    tags:[''],
    gender:['men',[Validators.required,Validators.pattern(/men|women|kid|unisex/)]]
  })

  sizes = ['XS','S','M','L','XL','XXL']

  ngOnInit(): void {
    this.setFormValue(this.product())
  }

  setFormValue(formLike: Partial<Product>){
    // this.productForm.patchValue(formLike as any)
    this.productForm.reset(this.product() as any)
    this.productForm.patchValue({tags: formLike.tags?.join(',')})
  }


  onSizeClicked(size:string){
    const currentSizes = this.productForm.value.sizes ?? []

    if(currentSizes.includes(size)){
      currentSizes.splice(currentSizes.indexOf(size),1)
    }else{
      currentSizes.push(size)
    }

    this.productForm.patchValue({sizes: currentSizes})
  }

  async onSubmit(){
    const isValid = this.productForm.valid
    this.productForm.markAllAsTouched()

    if(!isValid) return
    const formValue = this.productForm.value

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
        ?.toLowerCase()
        .split(',')
        .map((tag)=> tag.trim() ?? [])
    }

    if(this.product().id === 'new'){
      const product = await firstValueFrom(
        this.productService.createProduct(productLike,this.imageFileList)

      )
      this.router.navigate(['/admin/products', product.id])
    } else {

      await firstValueFrom(
        this.productService.updateProduct(this.product().id,productLike,this.imageFileList)

      )

    }

    this.wasSaved.set(true)
    setTimeout(()=> {
      this.wasSaved.set(false)
    },2000)
  }

  //Images

  imagesToCarrusel = computed(()=>{
      const currentProductImages = [
        ...this.product().images,
        ...this.tempImages()
      ]
      return currentProductImages
  })

  onFilesChanged(event:Event){
    const filesList = (event.target as HTMLInputElement).files

    this.imageFileList = filesList ?? undefined


    const imageUrls = Array.from(filesList ?? []).map((file)=>
      URL.createObjectURL(file))

    this.tempImages.set(imageUrls)


  }
}
