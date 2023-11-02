import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DriverService } from '../driver.service';
import { Driver } from 'src/app/modal/driver';
import { EmployeeService } from '../../employee-screen/service/employee.service';
import { Employee } from 'src/app/modal/employee';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss']
})
export class AddDriverComponent implements OnInit {
  items: MenuItem[] | undefined;

  driver: Driver = {
    id: undefined,
    empId: {
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
    },
    licenseNumber: undefined,
    vehicleBudget: undefined
    
  }

  employee!: Employee[];

  selectedEmployee!: Employee

  constructor(private driverService: DriverService,
              private employeeService: EmployeeService) { }
  
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
    debugger
    this.driverService.addDriver(this.driver).subscribe((res) => {
      debugger
      console.log(res);
      
    })
  }
  

}
