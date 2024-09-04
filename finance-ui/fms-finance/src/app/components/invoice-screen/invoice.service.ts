import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Invoice } from '../../modal/invoice';
import { InvoiceUploadRequest } from '../../modal/InvoiceUploadRequest';
import { Vendor } from '../../modal/vendor';
import { PaginatedResponse } from '../../modal/paginatedResponse';
import { ValidatedInvoices } from '../../modal/ValidatedInvoices';
import { UploadDataFileResponse } from '../../modal/UploadDataFileResponse';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  url =environment.URL

  constructor(private http: HttpClient) { }



  saveFile(file: File, invoiceUploadRequest: InvoiceUploadRequest): Observable<any> {
    
    const formData = new FormData();
    const invoiceRequestJson = JSON.stringify(invoiceUploadRequest);
  
    formData.append('file', file);
    formData.append('invoiceUploadRequest', invoiceRequestJson);
  
    // Use 'blob' responseType to handle file downloads
    return this.http.post(`${this.url}/save-invoice-excel`, formData, { responseType: 'blob', observe: 'response' });
  
  }

  getAll(): Observable<Invoice[]>{
    return this.http.get<Invoice[]>(`${this.url}/get-all-invoices`);
  }

  getById(id: number): Observable<Invoice>{
    return this.http.get<Invoice>(`${this.url}/get-invoice/${id}`);
  }

  getInvoicesBySupplierAndFileId(fileId: number, supplierName: string): Observable<Invoice[]>{
    return this.http.get<Invoice[]>(`${this.url}/get-invoices-by-supplier-and-file/${fileId}/${supplierName}`);
  }

  getInvoicesSuppliersByFileId(fileId: number): Observable<Vendor[]>{
    return this.http.get<Vendor[]>(`${this.url}/get-invoices-suppliers-by-file/${fileId}`);
  }

  searchAllInvoices(invoiceType?: string | null,
      invoiceCategory?: string | null,
      invoiceNumber?: string | null,
      supplierName?: string | null,
      invoiceMonth?: string | null): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.url}/search-invoice?
      invoiceType=${invoiceType ? invoiceType : ''}
      &invoiceMonth=${invoiceMonth ? invoiceMonth : ''}
      &invoiceCategory=${invoiceCategory ? invoiceCategory : ''}
      &invoiceNumber=${invoiceNumber ? invoiceNumber : ''}
      &supplierName=${supplierName ? supplierName : ''}`
    );
  }

  getValidatedInvoices(invoices: Invoice[]): Observable<ValidatedInvoices[]>{
    return this.http.post<ValidatedInvoices[]>(`${this.url}/get-validated-invoices`,invoices);
  }

}
