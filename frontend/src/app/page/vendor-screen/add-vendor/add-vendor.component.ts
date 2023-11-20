import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Vendor } from 'src/app/modal/vendor';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit{
  items: MenuItem[] | undefined;
  employee!:Vendor[];
  selectedEmployee!:Vendor;
  constructor() { }
  name!:string;

  contactPersons: any[] = [
    {name: '', phone: '', email: '',}
  ]

  size=100000
  uploadedFiles: any[] = [];

   onUpload(event: any) {
    
  }

   onUpload1(event:any) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  }
  
  ngOnInit(): void {
    this.items = [{ label: 'Vendor',routerLink:'/vendor'},{ label: 'Add Vendor'}];
   
  }

  addContactPerson() {
    const newContactPerson = { name: '', phone: '', email: '' };
  this.contactPersons.push(newContactPerson);
  }

  removeContactPerson(index: number) {
    this.contactPersons.splice(index, 1);
  }
}

