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

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.url.concat('/get-all-employee'));
  }

  getEmployeeById(id: Number) {
    return this.http.get<Employee>(`${this.url}/employee/${id}`);
  }

  updateEmployee(id: Number, updatedEmployee: Employee): Observable<Employee> {
    return this.http.patch<Employee>(`${this.url}/update-employee/${id}`, updatedEmployee);
  }

  deleteEmployee(id: Number) {
    return this.http.delete<any>(`${this.url}/delete-employee/${id}`)
  }

}
