import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { JobTitle } from 'src/app/modal/job-title';
import { JobTitleService } from '../job-title.service';

@Component({
  selector: 'app-job-title-list',
  templateUrl: './job-title-list.component.html',
  styleUrls: ['./job-title-list.component.scss'],
  providers: [MessageService]
})
export class JobTitleListComponent implements OnInit{

  items: MenuItem[] | undefined;
  jobTitle !: JobTitle[];

  @ViewChild('fileUpload', { static: false })
  fileUpload!: FileUpload;
  fileSelected: boolean = false;

  constructor( private jobTitleService: JobTitleService, private messageService: MessageService ) {}

  ngOnInit(): void {
    this.getAllJobTitles();
  }

  getAllJobTitles() {
    this.jobTitleService.getJobTitle().subscribe((res) => {
      this.jobTitle = res;
    })
  }

  deleteJobTitle( id: Number ) {
    this.jobTitleService.deleteJobTitle(id).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Delete Successfully',
        detail: 'Job Title has been deleted',
      });

      this.getAllJobTitles();
    })
  }

  onUpload(event: any) {
    const uploadedFile = event.files[0];

    if (uploadedFile) {
      this.jobTitleService.addBulkJobTitle(uploadedFile).subscribe(
        (response) => {

          if (Array.isArray(response.message)) {

            response.message.forEach((message: any) => {
              this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: message });
            });

          } else if (response.message) {
            this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: response.message });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: 'File uploaded successfully.' });
          }

          this.getAllJobTitles();
        },
        (error) => {
          console.error('Error while saving the file:', error);

          this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
        }
      );
    }
  }

  
  onCancel() {
    // Handle cancel logic here
    this.fileSelected = false;

    this.fileUpload.clear();

  }

  onFileSelect() {
    this.fileSelected = true;
  }

}
