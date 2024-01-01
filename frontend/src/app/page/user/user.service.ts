import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/modal/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.baseurl;

  constructor(private http: HttpClient) { }



  getActiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/active-user`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.url.concat('/user'), user);
  }

  getUserById(id: number) {
    return this.http.get<User>(`${this.url}/user/${id}`);
  }

  updateUser(id: number, updatedUser: User): Observable<User> {
    return this.http.patch<User>(`${this.url}/update-user/${id}`, updatedUser);
  }

  deleteUserById(id: number): Observable<User> {
    return this.http.delete<User>(`${this.url}/delete-user/${id}`)
  }

}
