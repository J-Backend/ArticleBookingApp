import { CommonModule} from '@angular/common';
import { Component, inject} from '@angular/core';
import {  Observable } from 'rxjs';
import { Customer } from '../../interfaces/customer';
import { FormsModule } from '@angular/forms';
import {NgbHighlight,NgbModal,NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { DropmenuComponent } from '../../components/dropmenu/dropmenu.component';
import { FormCustomerComponent } from '../../components/form-customer/form-customer.component';
import { PaginatedResponse } from '../../interfaces/paginatedResponse';
import { PaginationParams } from '../../interfaces/paginationParams';
import { LoadingComponent } from '../../components/loading/loading.component';
import { PayableComponent } from '../../components/payable/payable.component';


@Component({
	selector: 'app-customer',
	standalone: true,
	imports: [
		FormsModule,
		NgbHighlight,
		NgbPaginationModule,
		CommonModule,
		RouterModule,
		DropmenuComponent,
		LoadingComponent
	],
	templateUrl: './customer.component.html',
	styleUrl: './customer.component.css',
	providers: [],
})
export class CustomerComponent {

	
	private modalService = inject(NgbModal);
	private service = inject(CustomerService);
	private router = inject(Router);

	paginatedResponse$!: Observable<PaginatedResponse<Customer>>;
	columnNames: string[] = ['#', 'Name', 'Surname', 'Email', ''];
	isloading: boolean = true;
	public isEditing: boolean = false;
	filter: string = '';
	pageSize = 5;
	page = 1;
	
	constructor() { }

	ngOnInit() {

		this.loadCustomers();

	}

	loadCustomers() {
		let params: PaginationParams = {
			pageNumber: this.page,
			pageSize: this.pageSize,
			filter: this.filter
		}

		console.log("params ", params)
		this.paginatedResponse$ = this.service.getCustomers(params);

		this.paginatedResponse$.subscribe((response) => {
			console.log("Response load ", response)
			this.isloading = false;
		})
		
	}

	onPageChange(newPage: number) {
		console.log("new page ", newPage)
		this.page = newPage;

		this.loadCustomers();
	}

	openModalCustomer(parameter: any) {
		if (JSON.stringify(parameter) !== '{}') {
			this.isEditing = true;
		} else {
			this.isEditing = false;
		}
		const modalRef = this.modalService.open(FormCustomerComponent, {
			centered: true,
			size: 'sm',
		});
		modalRef.componentInstance.customer = parameter as Customer;
		modalRef.componentInstance.isEditing = this.isEditing;
		modalRef.componentInstance.actionCompleted.subscribe(() => {
			this.loadCustomers();
		});
	}

	openModalPayable(parameter: any) {
	
		const modalRef = this.modalService.open(PayableComponent, {
			centered: true,
			size: 'sm',
		});
		modalRef.componentInstance.customer = parameter as Customer;
	}


	redirectToCustomerLayawaysPage(id: number) {
		this.router.navigate([`customer/${id}`]);
	}

	redirectToNewLayawayPage(id: number) {
		console.log("CustomerId in customer ", id)
		this.router.navigate([`new/${id}`]);
	}

	do(customer: Customer) {
		return [
			{ 
				label: 'Edit customer', 
				action: () => this.openModalCustomer(customer) 
			},
			{
				label: 'View Layaways',
				action: () => this.redirectToCustomerLayawaysPage(customer.customerId),
			},
			{
				label: 'New layaway',
				action: () => this.redirectToNewLayawayPage(customer.customerId),
			},
			{
				label: 'View payable',
				action: () => this.openModalPayable(customer),
			},
		];
	}
}
