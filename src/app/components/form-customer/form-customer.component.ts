import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Customer } from '../../interfaces/customer';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-customer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-customer.component.html',
  styleUrl: './form-customer.component.css',
  providers:[]
})
export class FormCustomerComponent implements OnInit {

  private toastr = inject(ToastrService)
  private fb = inject(FormBuilder)
  private service = inject(CustomerService)
  activeModal = inject(NgbActiveModal);

  customerForm: FormGroup;

  @Input() customer!: Customer;
  @Input() isEditing!: boolean;
  @Output() actionCompleted = new EventEmitter<void>();

  constructor () {

    this.customerForm = this.fb.group({
      name: ['', [Validators.required,]],
      surname: ['', [Validators.required,]],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  ngOnInit(): void {
    this.customerForm.patchValue(this.customer);
  }


  createCustomer(): void {
    if (this.customerForm.valid) {
      
      const newCustomer = this.customerForm.value;
      this.customerForm.reset();

      this.service.createCustomer(newCustomer).subscribe({
        next: (result) => {
          console.log('Customer created successfully', result);
          this.toastr.success('Customer created')
          this.activeModal.close('Customer created');
          this.actionCompleted.emit(); 
        },
        error: (error) => {
          this.toastr.error('Create operation failed')
          console.error('Error creating customer', error);
        }
      });
    }
  }

  updateCustomer(): void {
    if (this.customerForm.valid) {
      const updatedCustomer = { ...this.customer, ...this.customerForm.value };
     
      this.service.updateCustomer(updatedCustomer).subscribe({
        next: (result) => {
          console.log('Customer updated successfully', result);
          this.toastr.success('Customer updated')
          this.activeModal.close('Customer updated');
          this.actionCompleted.emit(); 
        },
        error: (error) => {
          this.toastr.error('Update operation failed')
          console.error('Error updating customer', error);
        }
      });
    }
  }

  deleteCustomer(): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.service.deleteCustomer(this.customer.customerId).subscribe({
        next: () => {
          console.log('Customer deleted successfully');
          this.toastr.success('Customer deleted')
          this.activeModal.close('Customer deleted');
          this.actionCompleted.emit(); 
        },
        error: (error) => {
          this.toastr.error('Delete operation failed')
          console.error('Error deleting customer', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.updateCustomer();
    } else {
      this.createCustomer();
    }
  }

 
}
