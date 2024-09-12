import { inject, Injectable } from '@angular/core';
import { Customer } from '../interfaces/customer';
import { CustomerNew } from '../interfaces/customerNew';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Request } from '../interfaces/request';
import { PaginatedResponse } from '../interfaces/paginatedResponse';
import { PaginationParams } from '../interfaces/paginationParams';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private http = inject(HttpClient)

  private baseUrl: string = environment.baseUrl;
  private apiUrl: string = `${this.baseUrl}/api`


  constructor() {}

  getCustomers(params: PaginationParams): Observable<PaginatedResponse<Customer>> {

    const queryParams = new HttpParams()
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString())
      .set('filter', params.filter || '');

    return this.http.get<PaginatedResponse<Customer>>(`${this.apiUrl}/Customer`, { params: queryParams });
  }


  getCustomerById(customerId: number): Observable<Customer> {
    const url = `${this.apiUrl}/Customer/${customerId}`;
    return this.http.get<Customer>(url);
  }


  deleteCustomer(customerId: number): Observable<Customer> {
    const url = `${this.apiUrl}/Customer/${customerId}`;
    return this.http.delete<Customer>(url);
  }


  updateCustomer(customer: Customer): Observable<Customer> {

    console.log("Customer service ", customer)
    const url = `${this.apiUrl}/Customer`;

    const request: Request<Customer> = {
      data: customer
    };
    return this.http.put<Customer>(url, request);
  }
  createCustomer(customer: CustomerNew): Observable<CustomerNew> {
    const url = `${this.apiUrl}/Customer`;

    const request: Request<CustomerNew> = {
      data: customer
    };

    return this.http.post<CustomerNew>(url, request);
  }
}
