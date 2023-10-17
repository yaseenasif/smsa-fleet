import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-update-vehicle-type',
  templateUrl: './update-vehicle-type.component.html',
  styleUrls: ['./update-vehicle-type.component.scss']
})
export class UpdateVehicleTypeComponent implements OnInit {

  items: MenuItem[] | undefined;
  employee!:Employee[];
  selectedEmployee!:Employee;
  constructor() { }
  name!:string;
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
    this.items = [{ label: 'Vehicle',routerLink:'/vehicle-type'},{ label: 'Edit Vehicle'}];
    this.employee=[
      {
        employeeName:"karachi",
        id:1
      },
      {
        employeeName:"kaAAi",
        id:2
      },
      {
        employeeName:"Alld",
        id:3
      },
      {
        employeeName:"islamabad",
        id:4
      },
      {
        employeeName:"lahore",
        id:5
      },
    ]
  }
}

interface Employee{
  employeeName:string,
  id:number
}