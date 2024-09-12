import { Component, inject,Input, OnInit} from '@angular/core';
import { Customer } from '../../interfaces/customer';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payable.component.html',
  styleUrl: './payable.component.css'
})
export class PayableComponent implements OnInit {

  private serviceAccount = inject(AccountService)

  @Input() customer!: Customer;

  payable!:number;

  constructor () {}

  ngOnInit(): void {
    this.serviceAccount.getAccountByCustomerId(this.customer.customerId).subscribe({
      next:(response)=>{
        console.log("response ", response)
        this.payable = response.data;

      },
      error:(error)=>{
        console.log("Error: ",error);
      }
    })
  }


}
