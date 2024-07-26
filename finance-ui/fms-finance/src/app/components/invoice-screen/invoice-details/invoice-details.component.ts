import { Component, OnInit } from '@angular/core';

interface InvoiceDetails {
  supplierNumber: number | undefined;
}

interface InvoiceRecord {
  date: string;
  invoiceNumber: string | undefined,
  progress: string | undefined,
  fileName: string,
  budget: string | undefined
}

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss'
})
export class InvoiceDetailsComponent implements OnInit{

  invoiceDetails !: InvoiceDetails[];
  selectedInvoiceDetail !: InvoiceDetails;
  value !: string;

  invoiceRecord !: InvoiceRecord[];


  ngOnInit(): void {
    this.invoiceDetails = [
      {supplierNumber: 123456},
      {supplierNumber: 123456},
      {supplierNumber: 123456}
    ]
  }

}
