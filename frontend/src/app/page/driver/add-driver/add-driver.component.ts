import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { DriverService } from '../driver.service';
import { Driver } from 'src/app/modal/driver';
import { EmployeeService } from '../../employee-screen/service/employee.service';
import { Employee } from 'src/app/modal/employee';
import { Router } from '@angular/router';
import { GradeService } from '../../grade/grade.service';
import { Grade } from 'src/app/modal/grade';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss'],
  providers: [MessageService]
})
export class AddDriverComponent implements OnInit {
  items: MenuItem[] | undefined;

  driver: Driver = {
    id: undefined,
    empId: {
      id: undefined,
      employeeNumber:  undefined,
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
      contactNumber: undefined,
      section: undefined,
      iqamaNumber: undefined,
      svEmployeeNumber: undefined,
      svEmployeeName: undefined,
      city: undefined,
      age:  undefined,
      portOfDestination: undefined,
      nationality: undefined,
      companyEmailAddress: undefined,
      grade: undefined,
      licenseNumber: undefined,  
      vehicleBudget: undefined
    },
    licenseNumber: undefined,
    vehicleBudget: undefined
    
  }

  employee!: Employee[];

  selectedEmployee!: Employee

  constructor(private driverService: DriverService,
              private employeeService: EmployeeService,
              private messageService: MessageService,
              private router: Router,
              ) { }
  
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
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe((res) => {
      res.map((el) => {
      el.joiningDate = el.joiningDate ? new Date(el.joiningDate) : null

      })
      this.employee = res;
      
    })
  }

  getEmployeeData() {
    this.driver.empId.id = this.selectedEmployee.id
    this.driver.empId.empName = this.selectedEmployee.empName
    this.driver.empId.jobTitle = this.selectedEmployee.jobTitle
    this.driver.empId.joiningDate = this.selectedEmployee.joiningDate
    this.driver.empId.department = this.selectedEmployee.department
    this.driver.empId.section = this.selectedEmployee.section
    this.driver.empId.region = this.selectedEmployee.region
    this.driver.empId.city = this.selectedEmployee.city
    this.driver.empId.nationality = this.selectedEmployee.nationality
    this.driver.empId.contactNumber = this.selectedEmployee.contactNumber
    this.driver.empId.companyEmailAddress = this.selectedEmployee.companyEmailAddress
    this.driver.empId.grade = this.selectedEmployee.grade
    // this.driver.licenseNumber = this.selectedEmployee.licenseNumber
    // this.driver.vehicleBudget
    
  }
    
  onSubmit() {
    this.driverService.addDriver(this.driver).subscribe((res) => {
      this.messageService.add({ severity: 'success', summary: 'Add Successfully', detail: 'Message Content' });  

      setTimeout(() => {
        this.router.navigate(['/driver'])
      },5000)
    },
    (error) => {
      this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: error.error });
    })
  }
  
 

}
