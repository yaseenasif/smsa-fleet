import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
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

}
