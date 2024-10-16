import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Invoice } from 'src/app/modal/Invoice';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoice-supplier',
  templateUrl: './invoice-supplier.component.html',
  styleUrls: ['./invoice-supplier.component.scss']
})
export class InvoiceSupplierComponent {

  invoices: Invoice[] = [];

  constructor(private invoiceService: InvoiceService,private messageService: MessageService){}
  
  ngOnInit(){

    this.getWaitingForApprovalInvoices();
  }

  getWaitingForApprovalInvoices(){
    this.invoiceService.getWaitingForApprovalInvoices().subscribe((res)=>{
      this.invoices = res
    })
  }
  
}
