import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { IndividualFileListService } from '../individual-file-list.service';
import { FileMetaData } from 'src/app/modal/file-meta-data';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-individual-file-list',
  templateUrl: './individual-file-list.component.html',
  styleUrls: ['./individual-file-list.component.scss'],
  providers: [MessageService],
})
export class IndividualFileListComponent implements OnInit {
  id = this.route.snapshot.paramMap.get('id')!;
  callType = this.route.snapshot.paramMap.get('call-type')!;
  fileMetaData!: FileMetaData[];
  items!: MenuItem[];
  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private individualFileListService: IndividualFileListService,private router: Router
  ) {}

  ngOnInit() {
    if (this.callType === 'employee') {
      this.items = [
        { label: 'Employee', routerLink: '/employee' },
        { label: 'View Attachment' },
      ];
      this.individualFileListService
        .getIndividualFileList('/file-meta-data-by-employee/'.concat(this.id))
        .subscribe(
          (res: FileMetaData[]) => {
            this.fileMetaData = res;
          },
          (error) => {}
        );
    } else if (this.callType === 'vehicle') {
      this.items = [
        { label: 'Vehicle', routerLink: '/vehicle' },
        { label: 'View Attachment' },
      ];
      this.individualFileListService
        .getIndividualFileList('/file-meta-data-by-vehicle/'.concat(this.id))
        .subscribe(
          (res: FileMetaData[]) => {
            this.fileMetaData = res;
          },
          (error) => {}
        );
    } else if (this.callType === 'vehicle-assignment') {
      this.items = [
        { label: 'Assignment', routerLink: '/assignment' },
        { label: 'View Attachment' },
      ];
      this.individualFileListService
        .getIndividualFileList(
          '/file-meta-data-by-vehicle-assignment/'.concat(this.id)
        )
        .subscribe(
          (res: FileMetaData[]) => {
            this.fileMetaData = res;
          },
          (error) => {}
        );
    } else {
    }
  }
  downloadAttachment(url: string, fileName: string) {
    this.individualFileListService
      .downloadAttachments(fileName)
      .subscribe((blob) => saveAs(blob, fileName));
  }

  navigateBack(): void {
    if (this.callType === 'employee') {
      this.router.navigate(['/employee']);
    } else if (this.callType === 'vehicle-assignment') {
      this.router.navigate(['/assignment']);
    } else if (this.callType === 'vehicle') {
      this.router.navigate(['/vehicle']);
    }
  }
}
