import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  authService = inject(AuthService)
  fb = inject(FormBuilder)
  hasError = signal(false)
  isPosting = signal(false)
  router = inject(Router)

  registerForm = this.fb.group({
    username:['',[Validators.required,Validators.minLength(2),// Exactamente dos palabras, ni más ni menos
    Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)]],
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.minLength(6)]]
  })

  onSubmit(){
    if(this.registerForm.invalid){
      this.hasError.set(true)
      setTimeout(()=>{
        this.hasError.set(false)
      },2000)
      return
    }
    const {username = '', email = '', password = ''} =this.registerForm.value

    this.authService.register(username!,email!,password!).subscribe(
      (isRegistered)=>{
        if(isRegistered){
          this.router.navigateByUrl('/')
          return
        }
        this.hasError.set(true)
        setTimeout(()=>{
        this.hasError.set(false)
      },2000)
      }
    )
  }

}

