import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Invoice } from '../../../modal/invoice';
import { InvoiceService } from '../invoice.service';


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

  // invoiceRecord !: InvoiceRecord[];

  fileSelected: boolean = false;
  uploadedFiles : any[] = [];

  invoiceList !: Array<Invoice>;
  value !: string;


  constructor(private messageService: MessageService, private invoiceService: InvoiceService) {}


  ngOnInit(): void {
    this.invoiceType = [
      { name: 'Leased'},
      { name: 'Unleased'},
      { name: 'Inprogress'}
    ];

    this.getAll();
  }

  onUpload() {
    this.invoiceService.saveFile(this.uploadedFiles[0]).subscribe((res)=>{
      this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
      this.getAll()
    },(error) => {
              this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
    })
  }



    onFileSelect(event:UploadEvent) {
      this.fileSelected = true;
      for(let file of event.files) {
        this.uploadedFiles.push(file);
    }

   }

    onCancel() {
      // Handle cancel logic her
      this.fileSelected = false;

      // this.uploadedFiles.clear();

    }

    getAll(){
      this.invoiceService.getAll().subscribe((res)=>{
        this.invoiceList = res
        console.log(this.invoiceList);

      })
    }

    OnSelectChange() {

    }

    downloadSampleData() {
      
    }
}
