import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Permission } from 'src/app/modal/Permission';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  url = environment.baseurl;

  constructor(private http: HttpClient) { }

  addPermission(permission: Permission): Observable<Permission> {
    return this.http.post<Permission>(`${this.url}/permission`, permission)
  }

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.url}/permission`);
  }

  updatePermission(id: number, updatePermission: Permission): Observable<Permission> {
    const updateUrl = `${this.url}/permission/${id}`;
    return this.http.patch<Permission>(updateUrl, updatePermission);
  }

  getPermissionbyId(id: number): Observable<Permission> {
    return this.http.get<Permission>(`${this.url}/permission/${id}`);

  }

  deletePermissionById(id: number): Observable<Permission> {
    return this.http.delete<Permission>(`${this.url}/permission/${id}`)
  }

}
