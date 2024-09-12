import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayawayService } from '../../services/layaway.service';
import { CommonModule } from '@angular/common';
import { Article } from '../../interfaces/article';
import { LayawayNew } from '../../interfaces/layawayNew';
import { ArticleComponent } from '../../components/article/article.component';
import { Customer } from '../../interfaces/customer';
import { CustomerService } from '../../services/customer.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-new-layaway',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ArticleComponent, NgbPaginationModule, LoadingComponent],
  templateUrl: './new-layaway.component.html',
  styleUrl: './new-layaway.component.css'
})
export class NewLayawayComponent implements OnInit {


  private toastr = inject(ToastrService)
  private router = inject(Router)
  private fb = inject(FormBuilder)
  private service = inject(LayawayService)
  private serviceCustomer = inject(CustomerService)
  private route = inject(ActivatedRoute)

  layawayForm: FormGroup;
  isEditing!: boolean;
  customerId!:number;
  customer!:Customer;
  articles: Article[] = [];
  total:number=0;

  isloading:boolean =true;

  page= 1; 
  pageSize=5; 
	totalRecords!:number;
	filter:string='';
  articlesPaginated: Article[] = [];

  constructor() {
    this.layawayForm = this.fb.group({
      description: ['', [Validators.required,]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      quantity: [null, [Validators.required, Validators.min(1)]],

    });
  }

  ngOnInit():void{
     this.customerId = +this.route.snapshot.params['customerId'];
     console.log("Customer id in new layaway ", this.customerId);
    this.loadCustomer();
  }

  loadCustomer() {
		this.serviceCustomer.getCustomerById(this.customerId).subscribe({
			next: (customer) => {
        this.customer = customer;
				console.log('Cliente :', this.customer);
			},
			error: (error) => {
				console.error('Error al obtener cliente por id', error);
			},
		});
    this.isloading=false;
	}

  onPageChange(newPage: number) {
		console.log("new page ",newPage)
		this.page = newPage; 

    this.getLayawaysPaginated();
		
	}

  getLayawaysPaginated(){
    this.articlesPaginated= this.articles.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  createLayaway(): void {
    console.log(this.articles)

    if ( this.articles.length > 0) {

      console.log("En el if valid");
      const newLayaway: LayawayNew = {
        customerId:this.customerId,
        articles: this.articles
      };
      console.log("valid  layaway ", newLayaway);

      this.service.createLayawayByCustomer(newLayaway).subscribe({
        next: (result) => {
          this.toastr.success('Layaway created')
          console.log('Layaway created successfully', result);
          this.redirectToCustomerPage(this.customerId);
        },
        error: (error) => {
          this.toastr.error('Create operation failed')
          console.error('Error creating customer', error);
        }
      });
    }

  }
  
  redirectToCustomerPage(id: number) {
		this.router.navigate([`customer/${id}`]);
	}
  onReceiveArticle(article: Article): void {
    this.total += article.quantity*article.price;
    this.articles.push(article);
    this.totalRecords = this.articles.length;
    this.getLayawaysPaginated();
  }



  remove(article: Article) {
    console.log("articles before removal: ", this.articles);
    

    const index = this.articles.findIndex(
      x => x.description === article.description &&
           x.price === article.price &&
           x.quantity === article.quantity
    );
  
    if (index !== -1) {

      this.articles.splice(index, 1);
      
    
      this.totalRecords = this.articles.length;
 
      this.getLayawaysPaginated();
    }
  
    console.log("articles after removal: ", this.articles);
    console.log("articlesPaginated after removal: ", this.articlesPaginated);
  }
  

}
