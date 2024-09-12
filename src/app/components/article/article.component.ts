import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Article } from '../../interfaces/article';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent{


  private fb = inject(FormBuilder)
 
  @Output() entity = new EventEmitter<Article>();
  @Input() isEditing!: boolean;
  @Input() editArticle!:Article;
  @Output() deleteArticle = new EventEmitter<boolean>();

  articleForm: FormGroup;
  articleId!:number;


  constructor() {
    this.articleForm = this.fb.group({
      articleId:[{value:null, disabled:true},[Validators.required,]],
      description: ['', [Validators.required,]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      quantity: [null, [Validators.required, Validators.min(1)]],

    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editArticle'] && this.editArticle) {
    
      this.articleForm.patchValue(this.editArticle);
    }
  }

  onDeleting(){
    this.deleteArticle.emit(true);
  }

  onSubmit() {
   
    if (this.articleForm.valid) {
      const article = this.articleForm.value;
      const subtotal = article.price * article.quantity;
      article.subtotal = subtotal;
  
      this.entity.emit(article);
     
      this.articleForm.reset();
    }
  }

}
