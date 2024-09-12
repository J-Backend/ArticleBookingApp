import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UrlService {




  constructor(private route: ActivatedRoute,private router: Router) { }


  checkRegister():boolean {
    const path = this.router.url;

    const segments = path.split('/');
   
    console.log("route ", segments[1])
    return segments[1]==='register'
  }
}
