import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import {  Observable, take,  } from "rxjs";
import { inject,  } from "@angular/core";



export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const authService = inject(AuthService)

    authService.currentUser$.pipe(take(1)).subscribe((currentUser)=>{
      console.log("current User in interceptor ", currentUser)
      req = currentUser ? req.clone({ setHeaders: { Authorization: `Bearer ${currentUser.accessToken}` } }) : req;
      
    })

    console.log("Req out ", req)
    return next(req);
  };






