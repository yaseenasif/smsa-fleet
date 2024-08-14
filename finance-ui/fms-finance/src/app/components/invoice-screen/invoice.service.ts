import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Invoice } from '../../modal/invoice';
import { InvoiceUploadRequest } from '../../modal/InvoiceUploadRequest';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  url =environment.URL

  constructor(private http: HttpClient) { }



  saveFile(file: File, invoiceUploadRequest: InvoiceUploadRequest): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const formData = new FormData();
    const invoiceRequestJson = JSON.stringify(invoiceUploadRequest);

    formData.append('file', file);
    formData.append('invoiceUploadRequest', invoiceRequestJson);

    return this.http.post<any>(`${this.url}/save-invoice-excel`, formData, {headers});
  }

  getAll(): Observable<Invoice[]>{
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Invoice[]>(`${this.url}/get-all-invoices`, {headers});
  }

  getById(id: number): Observable<Invoice>{
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Invoice>(`${this.url}/get-invoice/${id}`, {headers});
  }
}
