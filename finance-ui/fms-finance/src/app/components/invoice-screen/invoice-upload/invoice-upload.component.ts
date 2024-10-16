import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import saveAs from 'file-saver';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Invoice } from '../../../modal/invoice';
import { InvoiceFile } from '../../../modal/InvoiceFile';
import { InvoiceUploadRequest } from '../../../modal/InvoiceUploadRequest';
import { InvoiceFileService } from '../invoice-file.service';
import { InvoiceService } from '../invoice.service';


interface InvoiceType {
  name: string;
}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
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
  date: Date | undefined;

  invoiceUploadRequest : InvoiceUploadRequest ={
    invoiceType: undefined,
    invoiceMonth: undefined
  };

  fileSelected: boolean = false;
  uploadedFiles : any[] = [];

  invoiceFileList !: Array<InvoiceFile>;
  value !: string;
  formattedDate !: string;

  invoiceMonthSearch !: Date | null;
  invoiceTypeSearch !: InvoiceType | null;

  constructor(private messageService: MessageService, private invoiceFileService: InvoiceFileService,
    private invoiceService: InvoiceService) {}


  ngOnInit(): void {
    this.invoiceType = [
      { name: 'Lease'},
      { name: 'Unleased'},
      { name: 'Inprogress'}
    ];

    this.searchInvoiceFile();
  }

  onUpload() {
    this.invoiceUploadRequest.invoiceType = this.selectedInvoiceType.name
    this.invoiceUploadRequest.invoiceMonth = this.formatDate(this.date!);

    this.invoiceService.saveFile(this.uploadedFiles[0], this.invoiceUploadRequest).subscribe((response: HttpResponse<Blob>)=>{
      const contentType = response.headers.get('Content-Type');

      if (contentType && contentType.includes('application/json')) {
        // Handle JSON response (list of messages)
        const reader = new FileReader();
        reader.onload = () => {
          const messages: string[] = JSON.parse(reader.result as string);
          messages.forEach(message => {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
          });
        };
        reader.readAsText(response.body!);
      } else if (contentType && contentType.includes('application/octet-stream')) {
        // Handle file download response
        const blob = new Blob([response.body!], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoice-errors.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      }

      this.searchInvoiceFile();
    },
    (error) => {
      if (error.error instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const errorMessage = reader.result as string;
          this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: errorMessage });
        };
        reader.readAsText(error.error);
      } else {
        // Handle other types of errors
        this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.message || 'Unknown error' });
      }    }
  )
  }

  onDateSelect(selectedDate: Date) {
    this.formattedDate = this.formatDate(selectedDate);
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

    // getAll(){
    //   this.invoiceFileService.getAll().subscribe((res)=>{
    //     this.invoiceFileList = res
    //   })
    // }

    searchInvoiceFile(){
      this.invoiceFileService.searchAllVehicles(this.invoiceTypeSearch?.name,this.formatDate(this.invoiceMonthSearch!)).subscribe((res)=>{
        this.invoiceFileList = res
      })
    }

    downloadSampleFile() {
      this.invoiceFileService.downloadFile("Invoice File Sample.xlsx").subscribe(
        blob => saveAs(blob, "Invoice File Sample.xlsx"))
    }


    downloadInvoiceFile(fileName: string){
      this.invoiceFileService.downloadFile(fileName).subscribe(blob => saveAs(blob, fileName))
    }


}
