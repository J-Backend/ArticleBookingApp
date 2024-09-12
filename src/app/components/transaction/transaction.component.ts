import { Component, inject, Input, OnInit } from '@angular/core';
import { Customer } from '../../interfaces/customer';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Layaway } from '../../interfaces/layaway';
import { TransactionService } from '../../services/transaction.service';
import { TransactionNew } from '../../interfaces/transactionNew';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit {

  private activeModal = inject(NgbActiveModal);
  private fb = inject(FormBuilder);
  private service = inject(TransactionService);
  private router = inject(Router);


  @Input() customer!: Customer;
  @Input() layaway!: Layaway;

  transactionForm: FormGroup;

  constructor() {
    this.transactionForm = this.fb.group({
      payment: [null, [Validators.required, Validators.min(0.01)]],
      customer:[{value:null, disabled:true},[Validators.required,]],
      layawayId:[{value:null, disabled:true},[Validators.required, ]],
    });
  }

  ngOnInit(): void {
    this.transactionForm.patchValue({
      customer:this.customer.name+" "+this.customer.surname,
      layawayId:"# "+this.layaway.layawayId
    });

    console.log("customer received ",this.customer)
    console.log("layaway received ",this.layaway)
  }

  onSubmit(): void {

    if (this.transactionForm.valid) {
      
      const form = this.transactionForm.value;
      
      const newTransaction : TransactionNew ={
        payment:form.payment,
        layawayId:this.layaway.layawayId
      } 
      console.log("newTransaction ",newTransaction)

      this.service.createTransaction(newTransaction).subscribe({
        next: (result) => {
          console.log('transaction created successfully', result);

          this.activeModal.close('Transaction created');

          this.router.navigate([`account/${this.customer.customerId}/${this.layaway.layawayId}`])
          this.transactionForm.reset();

        },
        error: (error) => {
          console.error('Error creating transaction', error);
        }
      });
    }
  }
}
