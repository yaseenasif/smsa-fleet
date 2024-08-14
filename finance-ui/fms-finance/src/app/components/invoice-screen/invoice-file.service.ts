import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { InvoiceFile } from '../../modal/InvoiceFile';

@Injectable({
  providedIn: 'root'
})
export class InvoiceFileService {

  url =environment.URL

  constructor(private http: HttpClient) { }

  getAll(): Observable<InvoiceFile[]>{
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<InvoiceFile[]>(`${this.url}/get-all-invoice-files`, {headers});
  }

  searchAllVehicles(invoiceType?: string | null, invoiceMonth?: string | null): Observable<InvoiceFile[]> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<InvoiceFile[]>(`${this.url}/search-invoice-files?invoiceType=${invoiceType ? invoiceType : ''}&invoiceMonth=${invoiceMonth ? invoiceMonth : ''}`, {headers});
  }

  downloadFile(fileName: string): Observable<Blob> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/invoice-download/${fileName}`, {
      headers: headers,
      responseType: 'blob'
    });
  }
}
