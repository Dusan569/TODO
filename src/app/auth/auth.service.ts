import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
  }

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User | null>(null);

    constructor(private http: HttpClient, private router: Router){}

    signUp(email: string | undefined | null, password: string | undefined | null){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCiEh4qHtEE95j0UCGiGcKW10fVLhrbUl0',{
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(response => {
            this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
        }));
    }

    login(email: string | undefined | null, password: string | undefined | null){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCiEh4qHtEE95j0UCGiGcKW10fVLhrbUl0',{
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(response => {
            this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
        }));
    }

    logOut(){
        this.user.next(null);
        localStorage.removeItem('user');
        this.router.navigate(['/auth']);
    }

    autoLogin(){
        let userData = localStorage.getItem('user');

        if(!userData){
            return;
        }

        let parsedData: {
            email:string,
            id: string,
            _token: string,
            _tokenExpirationDate: Date
        } = JSON.parse(userData);

        let loadedUser = new User(parsedData.email, parsedData.id, parsedData._token, parsedData._tokenExpirationDate);

        this.user.next(loadedUser);
    }


    private handleError(errorResponse: HttpErrorResponse){
        let errorMessage = 'Unknow error';
        if(!errorResponse.error || !errorResponse.error.error){
            return throwError(errorMessage);
        }
        console.log(errorResponse);
        switch(errorResponse.error.error.message){
            case 'EMAIL_EXISTS':
                errorMessage = 'This email already exists';
                break;
              case 'EMAIL_NOT_FOUND':
                  errorMessage = 'This email does not exist';
                  break;
              case 'INVALID_PASSWORD':
                  errorMessage = 'This password is not correct';
                  break;
        }
        return throwError(errorMessage);
      }
    
    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
        let expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

        const user = new User(email,userId,token,expirationDate);

        this.user.next(user);

        this.router.navigate(['/todo']);

        localStorage.setItem('user', JSON.stringify(user));
    }
}