import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbHighlight, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { catchError, Observable, of, tap } from 'rxjs';
import { PaginatedResponse } from '../../interfaces/paginatedResponse';
import { Account } from '../../interfaces/account';
import { LoadingComponent } from '../../components/loading/loading.component';

import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { TransactionParams } from '../../interfaces/transactionParams';
import { Transaction } from '../../interfaces/transaction';
import { Customer } from '../../interfaces/customer';
import { CustomerService } from '../../services/customer.service';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, NgbPaginationModule, NgbHighlight, CommonModule, LoadingComponent, NgbAlertModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {

  paginatedResponse$!: Observable<PaginatedResponse<Transaction>>;
  account!:Account;
  payable:number=1000;

  page= 1; 
  pageSize=5; 
	isloading:boolean=true;
  isSuccess:boolean=false;

	filter:string ='';

	columnNames: string[] = ['#', 'Date', 'Payment', 'Balance'];

  customerId!: number;
  layawayId!: number;

  customer!:Customer;


	private datePipe = inject(DatePipe);
  private route = inject(ActivatedRoute);
  private serviceTransaction = inject(TransactionService);
  private service = inject(CustomerService);


  constructor () {
    this.customerId = +this.route.snapshot.params['customerId'];
    this.layawayId = +this.route.snapshot.params['layawayId'];

   
  }
  ngOnInit(): void {
  
    this.loadTransactions();
  }

   isEmptyObject(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
  }
  
  loadTransactions() {
		let params : TransactionParams ={
			pageNumber:this.page,
			pageSize:this.pageSize,
			filter:this.filter,
      LayawayId:this.layawayId

		}

    this.paginatedResponse$ = this.serviceTransaction.getTransactionsByLayawayId(params, this.customerId).pipe(
        tap((response) => {
            console.log("Response ", response);
            if (response.data.length === 0 || this.isEmptyObject(response.data)) {

              console.log('No transactions found for this layaway.');
              this.isSuccess = false;
            } else {

                console.log('transactions ', response.data);
                this.isSuccess = true;
            }
        }),
        catchError((error) => {
            console.error('Error loading transactions', error);
            this.isSuccess = false;
            return of({ data: [], totalRecords: 0 } as PaginatedResponse<Transaction>); 
        })
    );

    this.paginatedResponse$.subscribe({
        next: () => {
            if (this.isSuccess) {
                this.loadCustomer();
                console.log("Customer loaded");
            }
            this.isloading = false;
            console.log("isloading set to false");
        },
        error: (err) => {
            console.error('Error in subscription', err);
            this.isloading = false;
        }
    });
   

	}

  private loadCustomer() {
    this.service.getCustomerById(this.customerId).subscribe({
      next: (customer) => {

        this.customer = customer;
        console.log('customer result ', customer);
      },
      error: (error) => {
        console.error('Error loading customer', error);
      },
    });
  }
	
	onPageChange(newPage: number) {
		console.log("new page ",newPage)
		this.page = newPage; 
		this.loadTransactions();

	}

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }

}
