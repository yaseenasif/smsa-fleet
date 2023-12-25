import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FileUploadErrorEvent, FileUploadEvent } from 'primeng/fileupload';
import { environment } from 'src/environments/environment';
import { IndividualFileListService } from '../../individual-file-list/individual-file-list.service';
import { FileMetaData } from 'src/app/modal/file-meta-data';

@Component({
  selector: 'app-driver-attachment',
  templateUrl: './driver-attachment.component.html',
  styleUrls: ['./driver-attachment.component.scss'],
  providers:[MessageService,ConfirmationService]
})
export class DriverAttachmentComponent {
  items: MenuItem[] | undefined;
  fileMetaDataForIDCopy!: FileMetaData[];
  fileMetaDataForDrivingLicense!: FileMetaData[];

  constructor(
    private messageService: MessageService,
    private route:ActivatedRoute,
    private individualFileListService:IndividualFileListService,
    private confirmationService:ConfirmationService
  ) { }
  
  size=environment.fileSize;
  id=this.route.snapshot.paramMap.get('id')!
  url=environment.baseurl.concat('/add-driver-attachments/',this.id)
  uploadedFiles!:any[];

  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
  });

  onUpload(event:FileUploadEvent,name:string){
   this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: name.concat(' file is uploaded')});
   this.getFileMetaData();
  }
 

  onError(event:FileUploadErrorEvent){
    this.messageService.add({severity: 'error', summary: 'File Uploaded', detail: event.error?.error});
  }
  ngOnInit(): void {  
    this.items = [{ label: 'Driver',routerLink:'/driver'},{ label: 'Driver Attachments'}];
    this.getFileMetaData();
  }

  getFileMetaData(){
    this.fileMetaDataForIDCopy=[]
    this.fileMetaDataForDrivingLicense=[]
    this.individualFileListService.getIndividualFileList('/file-meta-data-by-driver/'.concat(this.id)).subscribe((res:FileMetaData[])=>{

     
      this.fileMetaDataForIDCopy=res.filter(el=>{return el.attachmentType ==='ID Copy'});
      this.fileMetaDataForDrivingLicense=res.filter(el=>{return el.attachmentType ==='Driving License'});
     
      
    },error=>{})
  }

  deleteAttachmentById(id:number){
    
    this.individualFileListService.deleteAttachmentById(id).subscribe(res=>{
      this.messageService.add({ severity: 'success', summary: 'success', detail: 'file is deleted' });
     this.getFileMetaData();  
    },error=>{
      this.messageService.add({ severity: 'error', summary: 'error', detail: 'file is not deleted' });
    })
  }

  confirm1(fileName:string,id:number) {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to delete '.concat(fileName,"?"),
        header: 'Confirmation',
        icon: 'bi bi-exclamation-triangle',
        accept: () => {
            this.deleteAttachmentById(id)
        }
    });
  }
}
