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

    this.invoiceService.saveFile(this.uploadedFiles[0], this.invoiceUploadRequest).subscribe((res)=>{
      this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
      this.searchInvoiceFile()
    },(error) => {
              this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
    })
  }

  onDateSelect(selectedDate: Date) {
    this.formattedDate = this.formatDate(selectedDate);
    console.log('Formatted Date:', this.formattedDate);    // Additional logic if needed
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
