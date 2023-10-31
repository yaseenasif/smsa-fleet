import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Employee } from 'src/app/modal/employee';
import { EmployeeService } from '../service/employee.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit{
  
  items: MenuItem[] | undefined;
  employee: Employee = {
    id: undefined,
    empName: undefined,
    jobTitle: undefined,
    joiningDate: undefined,
    department: undefined,
    section: undefined,
    region: undefined,
    city: undefined,
    nationality: undefined,
    contactNumber: undefined,
    companyEmailAddress: undefined,
    grade: undefined,
    licenseNumber: undefined,
    vehicleBudget: undefined
  };

  dummyData: any = [
    { id: 1, locationName: 'Demo' },
    { id: 2, locationName: 'Demo' },
    { id: 3, locationName: 'Demo' }
  ]

  name!:string;
  
  size=100000
  uploadedFiles: any[] = [];
  
  

  constructor(
    private employeeService: EmployeeService,
    private router: Router) { }



   onUpload(event: any) {
    
  }

   onUpload1(event:any) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  }
  
  ngOnInit(): void {
    this.items = [{ label: 'Employee',routerLink:'/employee'},{ label: 'Add Employee'}];
  }

  onSubmit() {
    
    this.employeeService.addEmployee(this.employee).subscribe((res) => {
      console.log(res);
      
    }) 
      
    }

  }