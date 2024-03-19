import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { LoginCredential } from '../modal/LoginCredential';
import { LoginResponse } from '../modal/LoginResponse';




const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  url: string = environment.baseurl;

  constructor(private httpClient: HttpClient) { }


  login(credentials: LoginCredential): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(this.url.concat("/login"), credentials, httpOptions);
  }

}
