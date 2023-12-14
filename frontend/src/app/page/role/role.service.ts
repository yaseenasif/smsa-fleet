import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from 'src/app/modal/role';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  url = environment.baseurl;

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.url}/roles`);
  }
  
}
