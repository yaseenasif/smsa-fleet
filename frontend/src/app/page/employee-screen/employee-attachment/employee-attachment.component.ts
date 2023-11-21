import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { FileUploadErrorEvent, FileUploadEvent } from 'primeng/fileupload';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-attachment',
  templateUrl: './employee-attachment.component.html',
  styleUrls: ['./employee-attachment.component.scss'],
  providers:[MessageService]
})
export class EmployeeAttachmentComponent {
  items: MenuItem[] | undefined;

  constructor(
    private messageService: MessageService,
    private route:ActivatedRoute,
  ) { }
  
  size=environment.fileSize;
  url=environment.baseurl.concat('/add-attachments/',this.route.snapshot.paramMap.get('id')!)
  uploadedFiles!:any[];

  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
  });

  onUpload(event:FileUploadEvent,name:string){
   this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: name.concat(' file is uploaded')});
  }
 

  onError(event:FileUploadErrorEvent){
    this.messageService.add({severity: 'error', summary: 'File Uploaded', detail: event.error?.error.body});
  }
  ngOnInit(): void {  
    this.items = [{ label: 'Employee',routerLink:'/employee'},{ label: 'Employee Attachments'}];
  }
}
