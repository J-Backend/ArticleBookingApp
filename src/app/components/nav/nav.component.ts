import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LoadingComponent } from '../loading/loading.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, CommonModule, LoadingComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit{


  private authService = inject(AuthService)
  private router = inject(Router)

  // isLogged:boolean = false;
  isLogged$!: Observable<boolean>;

  constructor() {}

  ngOnInit(): void {

    // this.isLogged = this.authService.isLogged();
    // console.log("IsLogged in nav ",this.isLogged)
    this.isLogged$= this.authService.isLogged$;
  }

  logout() {
    // this.isLogged = false;
    this.authService.logout();
    this.router.navigate(['login']);

  }

}
