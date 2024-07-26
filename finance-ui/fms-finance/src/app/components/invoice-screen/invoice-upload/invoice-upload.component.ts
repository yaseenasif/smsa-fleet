import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';


interface InvoiceType {
  name: string;
}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

interface InvoiceRecord {
  date: string;
  invoiceNumber: string | undefined,
  progress: string | undefined,
  fileName: string,
  budget: string | undefined
}

@Component({
  selector: 'app-invoice-upload',
  templateUrl: './invoice-upload.component.html',
  styleUrl: './invoice-upload.component.scss',
  providers: [MessageService]
})
export class InvoiceUploadComponent implements OnInit{

  invoiceType !: InvoiceType[];
  selectedInvoiceType !: InvoiceType;
  date: Date[] | undefined;

  invoiceRecord !: InvoiceRecord[];

  constructor(private messageService: MessageService) {}


  ngOnInit(): void {
    this.invoiceType = [
      { name: 'Leased'},
      { name: 'Unleased'},
      { name: 'Inprogress'}
    ];

    this.invoiceRecord = [
      {
        date: "02-24",
        invoiceNumber: "INV-001",
        progress: "Completed",
        fileName: "invoice_july_2024.pdf",
        budget: "5000"
      },
    ]
  }

  onUpload() {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
    }

}
