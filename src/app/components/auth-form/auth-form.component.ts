import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
// import { UrlService } from '../../services/url.service';
import { User } from '../../interfaces/user';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private serviceAuth = inject(AuthService);
  // private serviceURL = inject(UrlService);
  private toastr = inject(ToastrService)

  public isRegister: boolean = false;
  authForm: FormGroup;

  constructor() {
    this.authForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  ngOnInit(): void {

    this.isRegister = this.checkRegister() ? true : false;
    this.authForm?.get('name')?.setValidators(this.isRegister ? [Validators.required] : []);
    this.authForm?.get('name')?.updateValueAndValidity();

  }

  onSubmit(): void {

    if (this.authForm.valid) {

      console.log("Form auth", this.authForm.value);

      const user: User = {
        email: this.authForm.value.email,
        password: this.authForm.value.password
      }
      console.log("user ", user)
      if (this.isRegister) {
        this.register(user)
      } else {
        this.logIng(user)
      }

      this.authForm.reset();
    }
  }

  logIng(user:User) {
  
   
    this.serviceAuth.login(user).subscribe({
      next: (response) => {

        console.log("Login response: ", response)
        if (response) {
          this.router.navigate(['home']);
        }
      },
      error: (error) => {
        this.toastr.error("Access denied", "Unauthorize")
        console.log("Login error: ", error)
      }
    });
  }
  register(user:User) {
    // this.serviceAuth.register(user).subscribe({
    //   next: (response) => {

    //     console.log("Register response: ", response)
    //     if (response) {
    //       this.router.navigate(['login']);
    //     }
    //   },
    //   error: (error) => {
    //     this.toastr.error("Register failed", "Try again")
    //     console.log("register error: ", error)
    //   }
    // });

    const isSuccess = this.serviceAuth.register(user);
     if(isSuccess) {

      this.toastr.success("Now login please", "Success register")
      this.router.navigate(['login']) 
     } else{
      this.toastr.error("Register failed", "Try again")
     }
  
     
  }

  checkRegister(): boolean {
    const path = this.router.url;

    const segments = path.split('/');

    console.log("route ", segments[1])
    return segments[1] === 'register'
  }
}