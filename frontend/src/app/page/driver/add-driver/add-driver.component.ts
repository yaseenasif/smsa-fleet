import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DriverService } from '../driver.service';
import { Driver } from 'src/app/modal/driver';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss']
})
export class AddDriverComponent implements OnInit {
  items: MenuItem[] | undefined;

  driver: Driver = {
    id: undefined,
    name: undefined,
    title: undefined,
    department: undefined,
    section: undefined,
    region: undefined,
    city: undefined,
    nationality: undefined,
    contactNumber: undefined,
    emailAddress: undefined,
    licenseNumber: undefined,
    vehicleBudget: undefined,
    grade: undefined
  }

  constructor(private driverService: DriverService) { }
  
  name!:string;
  contactNumber!:string;
  referenceNumber!:string;
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
    this.items = [{ label: 'Driver List',routerLink:'/driver'},{ label: 'Add Driver'}];
    
  }

}
