import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionParams } from '../interfaces/transactionParams';
import { catchError, Observable, of, throwError } from 'rxjs';
import { PaginatedResponse } from '../interfaces/paginatedResponse';
import { Transaction } from '../interfaces/transaction';
import { Router } from '@angular/router';
import { TransactionNew } from '../interfaces/transactionNew';
import { Request } from '../interfaces/request';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private baseUrl: string = environment.baseUrl;
  private apiUrl: string = `${this.baseUrl}/api`

  constructor(private http: HttpClient, private router: Router) { }

  getTransactionsByLayawayId(params: TransactionParams, customerId: number): Observable<PaginatedResponse<Transaction>> {

    const queryParams = new HttpParams()
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString())
      .set('filter', params.filter || '')
      .set('layawayId', params.LayawayId.toString());

    const url = `${this.apiUrl}/Transaction`;

    return this.http.get<PaginatedResponse<Transaction>>(url, { params: queryParams }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
        
          this.router.navigate([`customer/${customerId}`])

   
          return of({ data: {}, totalRecords: 0 } as PaginatedResponse<Transaction>);
        }
   
        return throwError(() => new Error('Unexpected error occurred'));
      })
    );
  }



  createTransaction(transaction: TransactionNew) {
    const url = `${this.apiUrl}/Transaction`;

    const request: Request<TransactionNew> = {
      data: transaction
    };

    return this.http.post<TransactionNew>(url, request);
  }
}
