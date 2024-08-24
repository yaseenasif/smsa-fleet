import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { LoginCredential } from '../../modal/loginCredentials';
import { LoginResponse } from '../../modal/loginResponse';
import { Observable } from 'rxjs';
import { User } from '../../modal/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  _url = environment.URL;

  constructor( private http: HttpClient) { }

  login(credentials: LoginCredential): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this._url.concat("/login"), credentials);
  }

  getUserByEmpId(id: string) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this._url}/get-by-empId/${id}`, {headers});
  }

}
