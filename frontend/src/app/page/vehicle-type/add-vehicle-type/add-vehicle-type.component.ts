import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-add-vehicle-type',
  templateUrl: './add-vehicle-type.component.html',
  styleUrls: ['./add-vehicle-type.component.scss']
})
export class AddVehicleTypeComponent implements OnInit {

  items: MenuItem[] | undefined;
  employee!:Employee[];
  selectedEmployee!:Employee;
  constructor() { }
  name!:string;
  
  ngOnInit(): void {
    this.items = [{ label: 'Vehicle',routerLink:'/vehicle-type'},{ label: 'Add Vehicle'}];
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