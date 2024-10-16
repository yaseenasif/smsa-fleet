import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from 'src/app/modal/Invoice';
import { InvoiceActionPayload } from 'src/app/modal/InvoiceActionPayload';
import { ResponsePayload } from 'src/app/modal/ResponsePayload';
import { ValidatedInvoices } from 'src/app/modal/ValidatedInvoices';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }
  baseurl = environment.baseurl;


  getWaitingForApprovalInvoices(): Observable<Invoice[]>{
    return this.http.get<Invoice[]>(`${this.baseurl}/get-waiting-invoices`)
  }

  getInvoicesBySupplierAndFileId(fileId: number, supplierName: string): Observable<Invoice[]>{
    return this.http.get<Invoice[]>(`${this.baseurl}/get-invoices-by-supplier-and-file/${fileId}/${supplierName}`);
  }

  getValidatedInvoices(invoices: Invoice[]): Observable<ValidatedInvoices[]>{
    return this.http.post<ValidatedInvoices[]>(`${this.baseurl}/get-validated-invoices`,invoices);
  }
  
  actionOnInvoice(invoiceActionayoad: InvoiceActionPayload): Observable<ResponsePayload>{
    return this.http.post<ResponsePayload>(`${this.baseurl}/send-invoice-action`,invoiceActionayoad);
  }

}
