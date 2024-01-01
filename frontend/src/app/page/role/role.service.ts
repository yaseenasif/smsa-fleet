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

  addRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${this.url}/roles`, role)
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.url}/roles`);
  }

  updateRole(id: number, updateRole: Role): Observable<Role> {
    const updateUrl = `${this.url}/role/${id}`;
    return this.http.patch<Role>(updateUrl, updateRole);
  }

  getRolebyId(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.url}/roles/${id}`);

  }

  deleteRoleById(id: number): Observable<Role> {
    return this.http.delete<Role>(`${this.url}/roles/${id}`)
  }
}
