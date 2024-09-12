import { Observable } from 'rxjs';
import {Component,inject,OnInit} from '@angular/core';
import { Layaway } from '../../interfaces/layaway';
import {CommonModule,DatePipe,DecimalPipe} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../interfaces/customer';
import { ReactiveFormsModule} from '@angular/forms';
import { LayawayService } from '../../services/layaway.service';
import { PaginatedResponse } from '../../interfaces/paginatedResponse';
import { LayawayParams } from '../../interfaces/layawayParams';
import { LoadingComponent } from '../loading/loading.component';
import { TransactionComponent } from '../transaction/transaction.component';
import { DropmenuComponent } from '../dropmenu/dropmenu.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    NgbHighlight,
    NgbPaginationModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    DropmenuComponent,
    LoadingComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [DecimalPipe, DatePipe],
})
export class ProfileComponent implements OnInit {

  private modalService = inject(NgbModal);
  private datePipe = inject(DatePipe);
  private route = inject(ActivatedRoute);
  private service = inject(CustomerService);
  private serviceLayaway = inject(LayawayService);
  private router = inject(Router);

  columnNames: string[] = ['#', 'Opening', 'Closing', 'State', 'Total', ''];
  paginatedResponse$!: Observable<PaginatedResponse<Layaway>>;
  layawayIdSelected: number = 0;
  layaways: Layaway[] = [];
  customerId!: number;
  customer!: Customer;
  articleId!: number;
  isEditing = false;
  isloading: boolean = true;
  filter: string = '';
  pageSize = 5;
  page = 1;


  constructor() {}

  ngOnInit(): void {
    this.customerId = +this.route.snapshot.params['id'];

    this.loadCustomer();
    this.loadLayaways();
  }


  loadLayaways() {
    let params: LayawayParams = {
      pageNumber: this.page,
      pageSize: this.pageSize,
      filter: this.filter,
      customerId: this.customerId
    }

    console.log("params ", params)

    this.paginatedResponse$ = this.serviceLayaway.getLayawaysByCustomerId(params);

    this.paginatedResponse$.subscribe((response) => {
      console.log("Response load ", response)
    })
    this.isloading = false;
  }

  onPageChange(newPage: number) {
    console.log("new page ", newPage)
    this.page = newPage;

    this.loadLayaways();
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

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }

  redirectToDetailPage(layaway: Layaway) {
    console.log("layaway redirect", layaway)
    this.router.navigate([`customer/${this.customerId}/${layaway.layawayId}`]);
  }

  redirectToAccountPage(layaway: Layaway) {
    console.log("layaway redirect", layaway)
    this.router.navigate([`/account/${layaway.customerId}/${layaway.layawayId}`]);
  }

  openModalTransaction(parameter: any) {
    const modalRef = this.modalService.open(TransactionComponent, {
      centered: true,
      size: 'md',
    });

    modalRef.componentInstance.layaway = parameter as Layaway;
    modalRef.componentInstance.customer = this.customer;

  }

  do(layaway: Layaway) {
    return [
      { 
        label: 'View Detail', 
        action: () => this.redirectToDetailPage(layaway) 
      },
      { 
        label: 'View Transactions', 
        action: () => this.redirectToAccountPage(layaway) 
      },
      { 
        label: 'New Payment', 
        action: () => this.openModalTransaction(layaway) 
      }, 
    ];
  }
}
