import { Component, inject, OnInit } from '@angular/core';
import { ArticleComponent } from '../../components/article/article.component';
import { Article } from '../../interfaces/article';
import { Customer } from '../../interfaces/customer';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-article',
  standalone: true,
  imports: [ArticleComponent, CommonModule],
  templateUrl: './edit-article.component.html',
  styleUrl: './edit-article.component.css'
})
export class EditArticleComponent implements OnInit {
 
  private toastr = inject(ToastrService)
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private serviceCustomer = inject(CustomerService);
  private serviceArticle = inject(ArticleService);

  article!:Article;
  total:number =0;
  customerId!:number;
  layawayId!:number;
  articleId!:number;
  customer!:Customer;

  constructor () {}
  
  ngOnInit(): void {
    this.customerId = +this.route.snapshot.params['customerId'];
    console.log("CustomerId in edit article params ", this.customerId)
    this.layawayId = +this.route.snapshot.params['layawayId'];
    this.articleId = +this.route.snapshot.params['articleId'];

    this.loadCustomer();
    this.loadArticle();

  }
  loadArticle(){
    this.serviceArticle.getArticleById(this.articleId).subscribe({
      next:(article)=>{
        this.article=article;
        console.log('Article :', this.article);
      },
      error:(error)=>{
        console.error('Error al obtener article por id', error);
      }
    })
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
	}

  
  redirectToCustomerPage() {
    this.router.navigate([`customer/${this.customerId}/${this.layawayId}`]);
	}
  onUpdateArticle(article:Article): void {
 
    article.layawayId = this.layawayId;
    article.articleId = this.articleId;
    console.log('Artículo por actualizar :', article);
    this.serviceArticle.updateArticle(article).subscribe({
      next: (article) => {
        
        this.toastr.success('Article updated')
        console.log('Artículo actualizado:', article);
        this.redirectToCustomerPage();
 
      },
      error: (error) => {
        this.toastr.error('Update operation failed')
        console.error('Error al actualizar el artículo:', error);
      }
    });
  }

  onDeleteArticle(isdeleted:boolean): void {
    if (isdeleted) {
      this.serviceArticle.deleteArticle(this.articleId).subscribe({
        next: () => {
          this.toastr.success('Article deleted')
          console.log('Artículo eliminado:', this.article);
          this.redirectToCustomerPage();
        },
        error: (error) => {
          this.toastr.error('Delete operation failed')
          console.error('Error al eliminar el artículo:', error);
        }
      });
    }
   
  }
}
