import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/modal/employee';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  url = environment.baseurl;

  constructor(private http: HttpClient) { }


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

  deleteEmployee(id: Number, updatedEmployee: Employee): Observable<Employee> {
    return this.http.patch<Employee>(`${this.url}/delete-employee/${id}`, updatedEmployee)
  }

  saveFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.url}/add-bulk-employee`, formData);
  }

  getAllUnAssignedEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.url.concat('/get-all-unassigned-employee'));
  }

  searchEmployee(value?: number | null, query?: { page: number, size: number }): Observable<PaginatedResponse<Employee>> {
    if (value) {
      query = { page: 0, size: 10 };
    }
    return this.http.get<PaginatedResponse<Employee>>(`${this.url}/search-employee?value=${value ? value : ''}&page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);
  }

  checkAssignedEmployee(empId: Number): Observable<any> {
    return this.http.get<any>(`${this.url}/check-assigned-employee/${empId}`);
  }

  downloadAttachments(empSample: string): Observable<Blob> {
    return this.http.get(`${this.url}/download/${empSample}`, {
      responseType: 'blob'
    });
  }
  searchInactiveEmployee(value?: string | null, query?: { page: number, size: number }): Observable<PaginatedResponse<Employee>> {
    debugger
    if (value) {
      query = { page: 0, size: 10 };
    }
    return this.http.get<PaginatedResponse<Employee>>(`${this.url}/search-employee-inactive?value=${(value ? value : '')}&page=${query?.page ? query.page : ''}&size=${query?.size ? query.size : ''}`);
  }
  activateEmployee(id: Number): Observable<Employee> {
    return this.http.patch<Employee>(`${this.url}/employee-active/${id}`, {})
  }

  getLastAssignedEmployeeByVehicleId(id: Number): Observable<Employee> {
    return this.http.get<Employee>(`${this.url}/get-last-assignment/${id}`);
  }
}
