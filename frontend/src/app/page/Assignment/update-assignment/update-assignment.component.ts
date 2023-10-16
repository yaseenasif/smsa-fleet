import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-update-assignment',
  templateUrl: './update-assignment.component.html',
  styleUrls: ['./update-assignment.component.scss']
})
export class UpdateAssignmentComponent {
  items: MenuItem[] | undefined;
    size=100000
  uploadedFiles: any[] = [];

   onUpload(event: any) {
    
  }

   onUpload1(event:any) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  }

  constructor() { }
  name!:string;
  contactNumber!:string;
  referenceNumber!:string;
  ngOnInit(): void {
    this.items = [{ label: 'Assignment',routerLink:'/assignment'},{ label: 'Edit Assignment'}];
  }
}
