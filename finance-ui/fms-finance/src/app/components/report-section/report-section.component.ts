import { Component, OnInit } from '@angular/core';
import { InvoiceFileService } from '../invoice-screen/invoice-file.service';
import { InvoiceService } from '../invoice-screen/invoice.service';
import { PageEvent } from '../../modal/PageEvent';
import { PaginatedResponse } from '../../modal/paginatedResponse';
import { Invoice } from '../../modal/invoice';
import { MessageService } from 'primeng/api';

interface InvoiceType {
  name: string;
}

interface InvoiceOption {
  name: String;
}

@Component({
  selector: 'app-report-section',
  templateUrl: './report-section.component.html',
  styleUrl: './report-section.component.scss',
  providers: [MessageService]
})
export class ReportSectionComponent implements OnInit{

  invoice!: Invoice[];

  invoiceType !: InvoiceType[];
  selectedInvoiceType !: InvoiceType;
  invoiceTypeSearch !: InvoiceType | null;
  formattedDate !: string;
  value !: String;
  totalRecords: number = 0;

  invoiceSearchOption !: InvoiceOption[];
  selectedSearchOption !: InvoiceOption;
  invoiceMonthSearch !: Date | null;
  invoiceCategory !: string;
  invoiceNumber !: string;
  supplierName !: string;
  date: Date | undefined;


  query: PageEvent = {
    page: 0,
    size: 7,
  };



  constructor( private invoiceService: InvoiceService, private messageService: MessageService ) {}

  ngOnInit(): void {

    this.invoiceType = [
      { name: 'Lease'},
      { name: 'Unleased'},
      { name: 'Inprogress'}
    ];
    this.getAllInvoices();
  }


  checkDropdownSelection() {
    if (!this.selectedSearchOption) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Please select a search option first!'});
    }
  }

  onPageChange(event?: any) {
    this.query.page = event.page;
    this.query.size = event.rows;
    this.getAllInvoices();
  }

  getAllInvoices() {
    this.invoiceService.getAll().subscribe((res: Invoice[]) => {
      this.invoice = res;
    })
  }

  formatDate(date: Date): string {
    // Format the date as MM/YYYY
    if(date != null){
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month < 10 ? '0' + month : month}-${year}`;
    }else{
      return "";
    }
  }
  searchInvoice(){
    this.invoiceService.searchAllInvoices(
      this.invoiceTypeSearch?.name,
      this.invoiceCategory,
      this.invoiceNumber,
      this.supplierName,
      this.formatDate(this.invoiceMonthSearch!)).subscribe((res)=>{
      this.invoice = res;
      console.log("working");

    })
  }

  onDateSelect(selectedDate: Date) {
    this.formattedDate = this.formatDate(selectedDate);
    console.log('Formatted Date:', this.formattedDate);    // Additional logic if needed
  }

}
