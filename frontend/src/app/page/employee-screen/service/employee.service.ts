import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/modal/employee';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  url = environment.baseurl;

  constructor(private http: HttpClient) {   }


  addEmployee(employee: Employee): Observable<Employee> {
      return this.http.post<Employee>(this.url.concat('/add-employee'), employee);
  }

}
