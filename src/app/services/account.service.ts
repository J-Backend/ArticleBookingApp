import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Response } from '../interfaces/response';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  private http = inject(HttpClient)

  private baseUrl: string = environment.baseUrl;
  private apiUrl: string = `${this.baseUrl}/api`

  constructor() {}

  getAccountByCustomerId(customerId: number): Observable<Response<number>> {
    console.log("customerId in service account ", customerId)
    const url = `${this.apiUrl}/Account/${customerId}`;
    return this.http.get<Response<number>>(url);
  }
}
