import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';
import { VehicleService } from '../../vehicle-screen/service/vehicle.service';
import { Vehicle } from 'src/app/modal/vehicle';
import { Employee } from 'src/app/modal/employee';
import { EmployeeService } from '../../employee-screen/service/employee.service';
import { VehicleAssignmentService } from '../vehicle-assignment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DriverService } from '../../driver/driver.service';
import { Driver } from 'src/app/modal/driver';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.scss'],
  providers: [MessageService]
})
export class AddAssignmentComponent {

  isUpdateMode: boolean = false;

  assignedEmployeeNumber !: Number | null | undefined
  assignedEmployeeName !: String | null | undefined

  vehiclePlateNumber !: String | undefined | null

  employeeId !: Number

  unAssignedEmployeeId !: Number
  unassignedDriverId!: Number

  vehicleId !: number

  selecteUnAssigneddEmployee !: Employee
  selectedUnassignedDriver!: Driver

  vehicle !: Vehicle[]

  selectedVehicle !: Vehicle

  employee !: Employee[]

  unAssignedEmployee !: Employee[]
  unAssignedDriver !: Driver[]
  
  vehicleAssignmentId: Number | undefined | null
  
  vehicleAssignment: VehicleAssignment = {
    id: undefined,
    design: undefined,
    make: undefined,
    assignToEmpName: undefined,
    model: undefined,
    year: undefined,
    leaseExpiry: undefined,
    leaseCost: undefined,
    plateNumber: undefined,
    attachments: undefined,
    assignToEmpId: {
      id:  undefined,
      empName:  undefined,
      employeeNumber:  undefined,
      budgetRef:  undefined,
      gender:  undefined,
      maritalStatus:  undefined,
      dateOfBirth:  undefined,
      joiningDate:  undefined,
      jobTitle:  undefined,
      status:  undefined,
      region:  undefined,
      location:  undefined,
      organization:  undefined,
      division:  undefined,
      deptCode:  undefined,
      department:  undefined,
      contactNumber:  undefined,
      section:  undefined,
      nationalIdNumber:  undefined,
      svEmployeeNumber:  undefined,
      svEmployeeName:  undefined,
      city:  undefined,
      age:  undefined,
      nationality:  undefined,
      companyEmailAddress:  undefined,
      grade:  undefined,
      licenseNumber:  undefined,      
      vehicleBudget:  undefined,
      costCentre:  undefined,
  
    },
    vehicle: {
      id: undefined,
      processOrderNumber: undefined,
      plateNumber: undefined,
      make: undefined,
      year: undefined,
      design: undefined,
      model: undefined,
      type: undefined,
      capacity: undefined,
      power: undefined,
      registrationExpiry: undefined,
      fuelType: undefined,
      vendor: {
        id: undefined,
        vendorName: undefined,
        officeLocation: undefined,
        attachments: undefined
      },
      insuranceExpiry: undefined,
      leaseCost: undefined,
      leaseStartDate: undefined,
      leaseExpiryDate: undefined,
      usageType: undefined,
      category: undefined
    }
  }

  items: MenuItem[] | undefined;
  
    size=100000
  uploadedFiles: any[] = [];

   onUpload(event: any) {

  }

   onUpload1(event:any) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  }

  constructor( private vehicleService: VehicleService, private employeeService: EmployeeService,
     private vehicleAssignmentService: VehicleAssignmentService, private driverService: DriverService,
     private route: ActivatedRoute,
     private router: Router,
     private messageService: MessageService) { }


  name!:string;
  contactNumber!:string;
  referenceNumber!:string;
  ngOnInit(): void {
    this.items = [{ label: 'Vehicle Assignment',routerLink:'/assignment'},{ label: 'Add Vehicle Assignment'}];
    
    this.getAllVehicles();

    // this.getAllEmployee();

    // this.getAllUnAssignedEmployees();

    this.getAllUnAssignedDrivers();

  }

  getVehicleAssignmentById(id: Number) {
    this.vehicleAssignmentService.getVehicleAssignmentById(id).subscribe((res: VehicleAssignment) => {
      this.vehicleAssignment = res;
    })
  }

  getAllVehicles() {
    this.vehicleService.getAllVehicles().subscribe((res : Vehicle[]) => {
      console.log(res);
      
      this.vehicle = res;

    })
  }

  getAllEmployee() {
    this.employeeService.getAllEmployees().subscribe((res: Employee[]) => {
      this.employee = res;
    })
  }

  getVehicleData() {

    this.vehicleAssignment.vehicle = this.selectedVehicle;
    this.vehicleAssignment.make = this.selectedVehicle.make;
    this.vehicleAssignment.design = this.selectedVehicle.design;
    this.vehicleAssignment.model = this.selectedVehicle.model;
    this.vehicleAssignment.year = this.selectedVehicle.year;
    this.vehicleAssignment.leaseExpiry = this.selectedVehicle.leaseExpiryDate;
    this.vehicleAssignment.leaseCost = this.selectedVehicle.leaseCost;
    // this.vehicleAssignment.plateNumber = this.selectedVehicle.plateNumber;
    this.vehiclePlateNumber = this.selectedVehicle.plateNumber;
    
    this.assignedEmployeeNumber = null
    this.assignedEmployeeName = null

    this.vehicleAssignmentService.getAllVehicleAssignmentByPlateNumber(this.vehiclePlateNumber!).subscribe((res) => {
      
      this.assignedEmployeeNumber = res.assignToEmpId.employeeNumber
      this.assignedEmployeeName = res.assignToEmpId.empName;
      this.vehicleAssignmentId = res.id
      console.log(res);
      

    })
  }

  onSubmit() {

    if(!this.assignedEmployeeNumber) {

      this.vehicleAssignmentService.addVehicleAssignment(this.vehicleAssignment).subscribe((res) => {

        this.messageService.add({ severity: 'success', summary: 'Vehicle Assigned Successfully' });

        setTimeout(() => {
          this.router.navigate(['/assignment'])
        },3000)
        
      })

    }

    else {
      
      this.vehicleAssignmentService.updateVehicleAssignment(this.vehicleAssignmentId!, this.vehicleAssignment).subscribe((res) => {
      
        this.messageService.add({ severity: 'success', summary: 'Update Successfully' });

        setTimeout(() => {
          this.router.navigate(['/assignment'])
        },3000)

      })
    }

    
  }

  getAllUnAssignedEmployees() {
    this.employeeService.getAllUnAssignedEmployees().subscribe((res: Employee[]) => {
      this.unAssignedEmployee = res;
    })
  }

  getUnAssignedEmployeeData() {
    this.selecteUnAssigneddEmployee = (this.unAssignedEmployee.find((el) => {return el.id == this.unAssignedEmployeeId}))!
    this.vehicleAssignment.assignToEmpName = this.selecteUnAssigneddEmployee.empName
    this.vehicleAssignment.assignToEmpId = this.selecteUnAssigneddEmployee
  }

  getAllUnAssignedDrivers() {
    this.driverService.getUnasignedDrivers().subscribe((res: Driver[]) => {
      this.unAssignedDriver = res;
    })
  }

  getUnAssignedDriverData() {
    this.selectedUnassignedDriver = (this.unAssignedDriver.find((el) => {return el.id == this.unassignedDriverId}))!
    this.vehicleAssignment.assignToEmpName = this.selectedUnassignedDriver.empId.empName
    this.vehicleAssignment.assignToEmpId = this.selectedUnassignedDriver.empId
  }
}

