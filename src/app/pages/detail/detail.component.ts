import { Component, inject, OnInit } from '@angular/core';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Article } from '../../interfaces/article';
import { CommonModule } from '@angular/common';
import { Customer } from '../../interfaces/customer';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleParams } from '../../interfaces/articleParams';
import { PaginatedResponse } from '../../interfaces/paginatedResponse';
import { Observable } from 'rxjs';
import { ArticleService } from '../../services/article.service';
import { LoadingComponent } from '../../components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgbPaginationModule, NgbHighlight, CommonModule, LoadingComponent, FormsModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private serviceArticle = inject(ArticleService);
  private service= inject(CustomerService);

  columnNames: string[] = ['#', 'Description', 'Price', 'Quantity', 'Subtotal', ''];
  paginatedResponse$!: Observable<PaginatedResponse<Article>>;
  
  articles: Article[] = [];
  customerId!: number;
  layawayId!: number;
  customer!:Customer;
  isloading:boolean = true;
  filter:string='';
  pageSize=5; 
  page= 1; 

  constructor () {
    this.customerId = +this.route.snapshot.params['customerId'];
    this.layawayId = +this.route.snapshot.params['layawayId'];
  }

  ngOnInit(): void {
    setTimeout(() => {
  
      this.loadArticles();
      this.loadCustomer();
		  }, 2000);
  }

  loadArticles() {

    let params: ArticleParams = {
      pageNumber: this.page,
      pageSize: this.pageSize,
      filter: this.filter,
      layawayId: this.layawayId
    }

    console.log("params ", params)

    this.paginatedResponse$ = this.serviceArticle.getArticlesByLayawayId(params);

    this.paginatedResponse$.subscribe((response) => {
      console.log("Response load Articles detail ", response)
    })
    this.isloading = false;
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

    this.loadArticles();
		
	}
  
  redirectToArticlePage(id: number) {
    console.log('customerId event', this.customerId);
    console.log('layawayId event ', this.layawayId);
    this.router.navigate([
       `customer/${this.customerId}/${this.layawayId}/${id}`,
    ]);

 }
}
