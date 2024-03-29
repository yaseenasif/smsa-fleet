import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';
import { ResponsePayload } from 'src/app/modal/ResponsePayload';
import { User } from 'src/app/modal/user';
import { environment } from 'src/environments/environment';
import { PasswordChange } from './user-list/user-list.component';

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

  getUserByEmpId(id: string) {
    return this.http.get<User>(`${this.url}/get-by-empId/${id}`);
  }

  updatePassword(passwords: PasswordChange): Observable<User> {
    const body = new HttpParams()
      .set('newPassword', passwords.newPassword!);
    return this.http.patch<User>(`${this.url}/update-password/${passwords.id}`, body);
  }

  searchUser(value?: string | null, query?: { page: number, size: number }): Observable<PaginatedResponse<User>> {
    if (value) {
      query = { page: 0, size: 10 };
    }
    return this.http.get<PaginatedResponse<User>>(`${this.url}/search-all-user?value=${value ? value : ''}&page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);
  }
}
