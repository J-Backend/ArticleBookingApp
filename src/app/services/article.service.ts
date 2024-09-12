import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../interfaces/article';
import { Request } from '../interfaces/request';
import { ArticleParams } from '../interfaces/articleParams';
import { PaginatedResponse } from '../interfaces/paginatedResponse';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private http = inject(HttpClient)
  
  private baseUrl : string = environment.baseUrl; 
  private apiUrl : string = `${this.baseUrl}/api`

  constructor() {}

  getArticlesByLayawayId(params: ArticleParams): Observable<PaginatedResponse<Article>> {

    const queryParams = new HttpParams()
        .set('pageNumber', params.pageNumber.toString())
        .set('pageSize', params.pageSize.toString())
        .set('filter', params.filter || '')
        .set('layawayId',params.layawayId.toString());

    const url = `${this.apiUrl}/Article/`;
    return this.http.get<PaginatedResponse<Article>>(url,{params:queryParams});
  }

  getArticleById(articleId: number): Observable<Article> {
    const url = `${this.apiUrl}/Article/${articleId}`;
    return this.http.get<Article>(url);
  }

  updateArticle(article: Article): Observable<Article> {

    console.log("Article service ", article)
    const url = `${this.apiUrl}/Article`; 
    const request: Request<Article> = {
      data: article
    };
    return this.http.put<Article>(url, request);
  }

  deleteArticle(articleId: number): Observable<Article> {
    const url = `${this.apiUrl}/Article/${articleId}`;
    return this.http.delete<Article>(url);
  }
}
