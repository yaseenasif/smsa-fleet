import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-update-driver',
  templateUrl: './update-driver.component.html',
  styleUrls: ['./update-driver.component.scss']
})
export class UpdateDriverComponent implements OnInit {

  items: MenuItem[] | undefined;

  employee!:Employee[];
  selectedEmployee!:Employee;
  constructor() { }
  name!:string;
  contactNumber!:string;
  referenceNumber!:string;
  ngOnInit(): void {
    this.items = [{ label: 'Driver List',routerLink:'/driver'},{ label: 'Edit Driver'}];
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