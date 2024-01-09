import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FileUploadErrorEvent, FileUploadEvent } from 'primeng/fileupload';
import { environment } from 'src/environments/environment';
import { IndividualFileListService } from '../../individual-file-list/individual-file-list.service';
import { FileMetaData } from 'src/app/modal/file-meta-data';

@Component({
  selector: 'app-vehicle-attachment',
  templateUrl: './vehicle-attachment.component.html',
  styleUrls: ['./vehicle-attachment.component.scss'],
  providers:[MessageService,ConfirmationService]
})
export class VehicleAttachmentComponent {
  items: MenuItem[] | undefined;

  constructor(
    private messageService: MessageService,
    private route:ActivatedRoute,
    private individualFileListService:IndividualFileListService,
    private confirmationService:ConfirmationService
  ) { }
  
  size=environment.fileSize;
  id=this.route.snapshot.paramMap.get('id')!
  url=environment.baseurl.concat('/add-vehicle-attachments/',this.route.snapshot.paramMap.get('id')!)
  uploadedFiles!:any[];

  fileMetaDataForIstemara!: FileMetaData[];
  fileMetaDataForInspectionForms!: FileMetaData[];
  fileMetaDataForApprovedPO!:FileMetaData[];
  fileMetaDataForInsurance!:FileMetaData[];
  fileMetaDataForOtherDocument!: FileMetaData[];

  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
  });

  onUpload(event:FileUploadEvent,name:string){
   this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: name.concat(' file is uploaded')});
   this.getFileMetaData()
  }
 

  onError(event:FileUploadErrorEvent){
    this.messageService.add({severity: 'error', summary: 'File Uploaded', detail: event.error?.error});
  }
  ngOnInit(): void {  
    this.items = [{ label: 'Vehicle',routerLink:'/vehicle'},{ label: 'Vehicle Attachments'}];
    this.getFileMetaData();
  }

  getFileMetaData(){
    this.fileMetaDataForIstemara=[]
    this.fileMetaDataForInsurance=[]
    this.fileMetaDataForApprovedPO=[]
    this.fileMetaDataForInspectionForms=[]
    this.fileMetaDataForOtherDocument=[]

    this.individualFileListService.getIndividualFileList('/file-meta-data-by-vehicle/'.concat(this.id)).subscribe((res:FileMetaData[])=>{     
      this.fileMetaDataForIstemara=res.filter(el=>{return el.attachmentType ==='Istemara'});
      this.fileMetaDataForInsurance=res.filter(el=>{return el.attachmentType ==='Insurance'});
      this.fileMetaDataForApprovedPO=res.filter(el=>{return el.attachmentType ==='Approved PO'});
      this.fileMetaDataForInspectionForms=res.filter(el=>{return el.attachmentType ==='Inspection forms'});
      this.fileMetaDataForOtherDocument=res.filter(el=>{return el.attachmentType ==='Other Documents'});
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
