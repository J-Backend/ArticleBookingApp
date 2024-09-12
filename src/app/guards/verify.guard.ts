import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';


export const verifyGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService)
  const router = inject(Router)
  const toastr = inject(ToastrService)

  const isLogged = authService.isLogged();
  console.log("Is Logged in verify ", isLogged)

  if(!isLogged){
    toastr.error('You shall not pass', 'Unauthorize')
    setTimeout(() => {
      router.navigate(['/login']);
    }, 1500);
    
  }

  return isLogged
};
