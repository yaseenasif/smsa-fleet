import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Driver } from 'src/app/modal/driver';
import { DriverService } from '../driver.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Form } from '@angular/forms';
import { VehicleService } from '../../vehicle-screen/service/vehicle.service';
import { Vehicle } from 'src/app/modal/vehicle';
import { EmployeeService } from '../../employee-screen/service/employee.service';

@Component({
  selector: 'app-update-driver',
  templateUrl: './update-driver.component.html',
  styleUrls: ['./update-driver.component.scss'],
  providers: [MessageService]
})
export class UpdateDriverComponent implements OnInit {

  items: MenuItem[] | undefined;

  driver: Driver = {
    id: undefined,
    empId: {
      id:  undefined,
      empName: undefined,
      employeeNumber:  undefined,
      budgetRef: undefined,
      gender: undefined,
      maritalStatus: undefined,
      dateOfBirth: undefined,
      joiningDate:undefined,
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
      nationalIdNumber:  undefined,
      svEmployeeNumber: undefined,
      svEmployeeName: undefined,
      city: undefined,
      age:  undefined,
      nationality: undefined,
      companyEmailAddress: undefined,
      grade: undefined,
      licenseNumber: undefined,  
      vehicleBudget:  undefined,
      costCentre: undefined,
    },
    vehicleBudget: undefined,
    licenseNumber: undefined,
    costCentre: undefined,
    assignedVehicle: undefined
  }

  driverId: Number | undefined;
  unassignedVehicles!: Vehicle[];
  assignEmployeeCheck!: boolean;
  plateNumber!: String;

  constructor( private driverService: DriverService,
                private router: Router,
              private route: ActivatedRoute,
              private vehicleService: VehicleService,
              private messageService: MessageService,
              private employeeService: EmployeeService

    ) { }


  // name!:string;
  // contactNumber!:string;
  // referenceNumber!:string;
  // size=100000
  // uploadedFiles: any[] = [];

  //  onUpload(event: any) {

  // }

  //  onUpload1(event:any) {
  //   for(let file of event.files) {
  //       this.uploadedFiles.push(file);
  //   }
  // }

  ngOnInit(): void {
    this.items = [{ label: 'Driver List',routerLink:'/driver'},{ label: 'Edit Driver'}];

    this.driverId = +this.route.snapshot.paramMap.get('id')!;

    this.getDriverById(this.driverId)
    // this.getUnassignedvehicles(this.driver.empId.vehicleBudget!);
  }

  getDriverById(id: Number) {
    this.driverService.getDriverById(id).subscribe((res: Driver) => {
      res.empId.joiningDate = res.empId.joiningDate ? new Date(res.empId.joiningDate) : new Date();
      this.driver = res;

      console.log(this.driver);

    })
  }

  updateDriver(driver: Driver) {
    this.driverService.updateDriver(this.driverId!,this.plateNumber, driver).subscribe((res) => {

      this.messageService.add({ severity: 'Update Successfully', summary: 'Update Successfully', detail: 'Message Content' });

      setTimeout(() => {
        this.router.navigate(['/driver'])
      },5000)

    })

  }

  onSubmit() {
    this.updateDriver(this.driver)
  }

  getUnassignedvehicles(vehicleBudget: Number){
    this.vehicleService.getVehicleBudget(vehicleBudget).subscribe((res)=>{
      this.unassignedVehicles = res;
    })
  }

  checkAssignedEmployee(id: Number){
    this.employeeService.checkAssignedEmployee(id).subscribe((res)=>{
      this.assignEmployeeCheck = res.check
    })
  }

  onFocusOutEvent(value: any) {
    if(value.value != ""){
      this.getUnassignedvehicles(value.value)
    }
    else if(value.value === ""){
      this.unassignedVehicles = [];
    }
  }
  onKeyPress(event: any) {
    const isNumber = /[0-9]/.test(event.key);
    if (!isNumber) {
      event.preventDefault();
    }
  }
}
