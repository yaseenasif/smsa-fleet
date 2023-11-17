import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Employee } from 'src/app/modal/employee';
import { EmployeeService } from '../service/employee.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
  providers: [MessageService]
})
export class AddEmployeeComponent implements OnInit{
  
  items: MenuItem[] | undefined;
  employee: Employee = {
    id: undefined,
    employeeNumber: undefined,
    budgetRef: undefined,
    empName: undefined,
    gender: undefined,
    maritalStatus: undefined,
    dateOfBirth: undefined,
    joiningDate: undefined,
    jobTitle: undefined,
    status: undefined,
    region: undefined,
    location: undefined,
    organization: undefined,
    division: undefined,
    deptCode: undefined,
    department: undefined,
    section: undefined,
    iqamaNumber: undefined,
    svEmployeeNumber: undefined,
    svEmployeeName: undefined,
    city: undefined,
    age: undefined,
    portOfDestination: undefined,
    nationality: undefined,
    companyEmailAddress: undefined,
    grade: undefined,
    licenseNumber: undefined,
    vehicleBudget: undefined,
    contactNumber: undefined
  };

  dummyData: any = [
    { id: 1, name: 'National Manager - Hub  Linehaul' }
  ]

  dummyDepartment: any = [
    { id: 1, name: 'STN'},
  ]

  dummySection: any = [
    { id: 1, name: 'Station Management'}
  ]

  dummyCity: any = [
    { id: 1, name: 'Riyadh'},
    { id: 1, name: 'Jeddah'},
    { id: 1, name: 'Mecca'},
  ]

  employeeStatus: any = [
    {id: 1, statusName: 'Active'},
    {id: 2, statusName: 'Resigned'},
    {id: 3, statusName: 'Terminated'},
    {id: 4, statusName: 'Deceased'}

,   
  ]

  

  name!:string;
  
  size=100000
  uploadedFiles: any[] = [];
  
  

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private messageService: MessageService) { }



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
   
    console.log('Form submitted:', this.employee);
    

    this.employeeService.addEmployee(this.employee).subscribe((res) => {
      this.messageService.add({ severity: 'success', summary: 'Employee Added Successfully' });  

  
      setTimeout(() => {
        this.router.navigate(['/employee'])
      },5000)
      
    },
    (error) => {
      console.error('Error while saving the file:', error);

      this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
      // Handle error
    }) 
      
    }

  }