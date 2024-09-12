import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  baseUrl: string = environment.baseUrl
  
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;
  
  private loggedInSubject: BehaviorSubject<boolean>;
  public isLogged$: Observable<boolean>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
   
     const isLoggedIn = this.currentUserSubject.value && Object.keys(this.currentUserSubject.value).length > 0 && this.currentUserSubject.value.accessToken;
     this.loggedInSubject = new BehaviorSubject<boolean>(isLoggedIn);
     this.isLogged$ = this.loggedInSubject.asObservable();
    // this.loggedInSubject = new BehaviorSubject<boolean>(isLoggedIn);
    // this.isLogged$ = this.loggedInSubject.asObservable();

  }

  login(user: User) {
    return this.http
      .post<any>(`${this.baseUrl}/login`, user)
      .pipe(
        map((response) => {

          console.log("response ", response)

          if (response) {

            localStorage.setItem('currentUser', JSON.stringify(response));
            this.currentUserSubject.next(response);
          }
          this.loggedInSubject.next(true);
          return response;
        }),
        catchError((error) => {
          console.error("Error durante el registro: ", error);
          return throwError(() => new Error("LogIn operation failed. Try again."));
        })

      );
  }

  register(user: User) {

    console.log("User in register ", user)
    return this.http
      .post<any>(`${this.baseUrl}/register`, user)
      .pipe(
        map((response) => {

          console.log("response in register", response)
          if (response.status === 200 || response.status === 201) {
          console.log('Registro exitoso');
          }
          return true;
        }),
        catchError((error) => {
          console.error("Error durante el registro: ", error);
          return throwError(() => new Error("Register operation failed. Try again."));
        })
      );
  }

  logout() {

    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.loggedInSubject.next(false);
  }

  isLogged(): boolean {
    const user = this.currentUserSubject.value;
    console.log("user ", user)
    if (user && Object.keys(user).length > 0 && user.accessToken) {
      console.log("IsLogged: ", user);
      return true;
    }
    console.log("IsLogged: false");
    return false;
  }

  
}
