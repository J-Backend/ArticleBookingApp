import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Layaway } from '../interfaces/layaway';
import { LayawayNew } from '../interfaces/layawayNew';
import { Request } from '../interfaces/request';
import { PaginatedResponse } from '../interfaces/paginatedResponse';

import { LayawayParams } from '../interfaces/layawayParams';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LayawayService {

  private http = inject(HttpClient)

  private baseUrl: string = environment.baseUrl;
  private apiUrl: string = `${this.baseUrl}/api`

  constructor() { }


  getLayawaysByCustomerId(params: LayawayParams): Observable<PaginatedResponse<Layaway>> {

    const queryParams = new HttpParams()
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString())
      .set('filter', params.filter || '')
      .set('customerId', params.customerId.toString());


    const url = `${this.apiUrl}/Layaway/`;
    return this.http.get<PaginatedResponse<Layaway>>(url, { params: queryParams });
  }



  createLayawayByCustomer(layaway: LayawayNew): Observable<LayawayNew> {
    const url = `${this.apiUrl}/Layaway`;

    const request: Request<LayawayNew> = {
      data: layaway
    };

    return this.http.post<LayawayNew>(url, request);
  }

  updateLayawayByCustomer(layaway: Layaway): Observable<Layaway> {
    const url = `${this.apiUrl}/Layaway`;

    const request: Request<Layaway> = {
      data: layaway
    };

    return this.http.put<Layaway>(url, request);
  }

  deleteLayawayByCustomer(customerId: number): Observable<Layaway> {
    const url = `${this.apiUrl}/Layaway/${customerId}`;
    return this.http.delete<Layaway>(url);
  }
}
