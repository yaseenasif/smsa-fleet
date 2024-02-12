// import { Component, OnInit } from '@angular/core';
// import { MenuItem, MessageService } from 'primeng/api';
// import { DriverService } from '../driver.service';
// import { Driver } from 'src/app/modal/driver';
// import { EmployeeService } from '../../employee-screen/service/employee.service';
// import { Employee } from 'src/app/modal/employee';
// import { Router } from '@angular/router';
// import { GradeService } from '../../grade/grade.service';
// import { Grade } from 'src/app/modal/grade';
// import { VehicleService } from '../../vehicle-screen/service/vehicle.service';
// import { Vehicle } from 'src/app/modal/vehicle';

// @Component({
//   selector: 'app-add-driver',
//   templateUrl: './add-driver.component.html',
//   styleUrls: ['./add-driver.component.scss'],
//   providers: [MessageService],
// })
// export class AddDriverComponent implements OnInit {
//   items: MenuItem[] | undefined;
//   existingDrivers: Driver[] = [];
//   driver: Driver = {
//     id: undefined,
//     empId: {
//       id: undefined,
//       empName: undefined,
//       employeeNumber: undefined,
//       budgetRef: undefined,
//       gender: undefined,
//       maritalStatus: undefined,
//       dateOfBirth: undefined,
//       joiningDate: undefined,
//       jobTitle: undefined,
//       status: undefined,
//       region: undefined,
//       location: undefined,
//       organization: undefined,
//       division: undefined,
//       deptCode: undefined,
//       department: undefined,
//       contactNumber: undefined,
//       section: undefined,
//       nationalIdNumber: undefined,
//       svEmployeeNumber: undefined,
//       svEmployeeName: undefined,
//       city: undefined,
//       age: undefined,
//       nationality: undefined,
//       companyEmailAddress: undefined,
//       grade: undefined,
//       licenseNumber: undefined,
//       vehicleBudget: undefined,
//       costCentre: undefined,
//     },
//     assignedVehicle: undefined,
//   };

//   employee!: Employee[];

//   selectedEmployee!: Employee;
//   unassignedVehicles!: Vehicle[];

//   constructor(
//     private driverService: DriverService,
//     private employeeService: EmployeeService,
//     private messageService: MessageService,
//     private vehicleService: VehicleService,
//     private router: Router
//   ) {}

//   name!: string;
//   contactNumber!: string;
//   referenceNumber!: string;
//   size = 100000;
//   uploadedFiles: any[] = [];

//   onUpload(event: any) {}

//   onUpload1(event: any) {
//     for (let file of event.files) {
//       this.uploadedFiles.push(file);
//     }
//   }
//   ngOnInit(): void {
//     this.items = [
//       { label: 'Driver List', routerLink: '/driver' },
//       { label: 'Add Driver' },
//     ];
 
//     this.getEmployeesNotDriver();
//   }

//   getEmployeeData() {
//     this.driver.empId.id = this.selectedEmployee.id;
//     this.driver.empId.empName = this.selectedEmployee.empName;
//     this.driver.empId.jobTitle = this.selectedEmployee.jobTitle;
//     this.driver.empId.joiningDate = new Date(this.selectedEmployee.joiningDate!);
//     this.driver.empId.department = this.selectedEmployee.department;
//     this.driver.empId.section = this.selectedEmployee.section;
//     this.driver.empId.region = this.selectedEmployee.region;
//     this.driver.empId.city = this.selectedEmployee.city;
//     this.driver.empId.nationality = this.selectedEmployee.nationality;
//     this.driver.empId.contactNumber = this.selectedEmployee.contactNumber;
//     this.driver.empId.companyEmailAddress =
//       this.selectedEmployee.companyEmailAddress;
//     this.driver.empId.grade = this.selectedEmployee.grade;
//     this.driver.empId.licenseNumber = this.selectedEmployee.licenseNumber;
//     this.driver.empId.vehicleBudget = this.selectedEmployee.vehicleBudget;
//     this.driver.empId.costCentre = this.selectedEmployee.costCentre;
//   }

//   onSubmit() {
//     this.driverService.addDriver(this.driver).subscribe(
//       (res) => {
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Add Successfully',
//           detail: 'Message Content',
//         });

//         setTimeout(() => {
//           this.router.navigate(['/driver']);
//         }, 5000);
//       },
//       (error) => {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Upload Error',
//           detail: error.error,
//         });
//       }
//     );
//   }

//   getUnassignedvehicles(vehicleBudget: Number){
//     this.vehicleService
//       .getVehicleBudget(vehicleBudget)
//       .subscribe((res: Vehicle[]) => {
//         this.unassignedVehicles = res;
//       });
//   }

//   onFocusOutEvent(value: any) {
//     if (value.value != '') {
//       this.getUnassignedvehicles(value.value);
//     } else if (value.value === '') {
//       this.unassignedVehicles = [];
//     }
//   }
//   onKeyPress(event: any) {
//     const isNumber = /[0-9]/.test(event.key);
//     if (!isNumber) {
//       event.preventDefault();
//     }
//   }

//   getEmployeesNotDriver() {
//     this.employeeService.getEmployeesNotDriver().subscribe((res) => {
//       this.employee = res;
//     });
//   }
// }
