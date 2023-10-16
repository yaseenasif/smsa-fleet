import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.scss']
})
export class AddAssignmentComponent {
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
    this.items = [{ label: 'Assignment',routerLink:'/assignment'},{ label: 'Add Assignment'}];
  }
}
