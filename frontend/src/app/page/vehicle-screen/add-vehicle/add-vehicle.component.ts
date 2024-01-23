import { Component, Input, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleService } from '../service/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Vendor } from 'src/app/modal/vendor';
import { ProductFieldServiceService } from '../../product-field/service/product-field-service.service';
import { ProductField } from 'src/app/modal/ProductField';
import { VehicleReplacement } from 'src/app/modal/vehicleReplacement';
import { RegionService } from '../../region/service/region.service';
import { Region } from 'src/app/modal/Region';
import { VehicleAssignmentService } from '../../Assignment/vehicle-assignment.service';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';
import { EmployeeService } from '../../employee-screen/service/employee.service';
import { Employee } from 'src/app/modal/employee';
import { ReplacementRequest } from 'src/app/modal/replacementRequest';


@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss'],
  providers: [MessageService]
})
export class AddVehicleComponent implements OnInit{
  vendors!:Vendor[];

  replacementCheck: boolean | undefined;

  vehicleAssignment!: VehicleAssignment
  cities: any[] = [];
  region !: Region[];
  items: MenuItem[] | undefined;

  // changedAssignment!: VehicleAssignment;
  unassignedEmployees!: Employee[];
  selectedUnassignedEmployee!: Employee;

  vehicle: Vehicle = {
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
    insuranceExpiry: undefined,
    leaseCost: undefined,
    replaceLeaseCost: undefined,
    leaseStartDate: undefined,
    leaseExpiryDate: undefined,
    usageType: undefined,
    region: undefined,
    category: undefined,
    vendor: {
      id: undefined,
      vendorName: undefined,
      officeLocation: undefined,
      attachments: undefined,
    },
    vehicleReplacement: undefined,
    employeeStatus: undefined,
    registrationStatus: undefined,
    insuranceStatus: undefined,
    replacementDate: undefined
  };

  usageTypes: ProductField | null | undefined;
  categories: ProductField | null | undefined;
  vId!: number;

  // vehicleReplacement: VehicleReplacement = {
  //   id:undefined,
  //   reason:undefined,
  //   vehicle:undefined
  // }

  replacementRequest: ReplacementRequest = {
    replacement: {
          id:undefined,
          reason:undefined,
          vehicle:undefined
      },
    assignment: {
      id: undefined,
    design:  undefined,
    make:  undefined,
    assignToEmpName:  undefined,
    model:  undefined,
    year:  undefined,
    leaseExpiry:  undefined,
    leaseCost: undefined,
    plateNumber:  undefined,
    attachments:  undefined,
    assignToEmpId: {
        id:undefined,
    empName: undefined,
    employeeNumber:undefined,
    budgetRef: undefined,
    gender: undefined,
    maritalStatus: undefined,
    dateOfBirth:undefined,
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
    nationalIdNumber:undefined,
    svEmployeeNumber: undefined,
    svEmployeeName: undefined,
    city: undefined,
    age:undefined,
    nationality: undefined,
    companyEmailAddress: undefined,
    grade: undefined,
    licenseNumber:  undefined,
    vehicleBudget: undefined,
    costCentre: undefined,
                },
    vehicle: {
        id: undefined,
        processOrderNumber: undefined,
        plateNumber:  undefined,
        make:  undefined,
        year:  undefined,
        design:  undefined,
        model:  undefined,
        type:  undefined,
        capacity:  undefined,
        power:  undefined,
        registrationExpiry:  undefined,
        fuelType:  undefined,
        vendor: {
            id:  undefined,
            vendorName: undefined,
            officeLocation:  undefined,
            attachments:  undefined,
            },
        insuranceExpiry:  undefined,
        leaseCost: undefined,
        leaseStartDate:  undefined,
        leaseExpiryDate:  undefined,
        usageType:  undefined,
        category:  undefined
    }
    }
  }

  visible: boolean= false;
  empName: string | null | undefined;
  previousVehicle!: Vehicle;

  constructor(
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private router: Router,
    private productFieldService: ProductFieldServiceService,
    private regionService:RegionService,
    private route: ActivatedRoute,
    private vehicleAssignmentService: VehicleAssignmentService,
    private employeeService: EmployeeService
    ) {
      console.log(this.replacementRequest);
      
     }

  name!:string;


   onUpload(event: any) {

  }



  ngOnInit(): void {
    this.items = [{ label: 'Vehicle',routerLink:'/vehicle'},{ label: 'Add Vehicle'}];
    this.getAllVendor();
    this.getUsageType();
    this.getCategory();
    this.getRegion();


    this.route.queryParams.subscribe(params => {
      this.replacementCheck = params['replacementCheck'] === 'true';
      this.vId = params['vId'];
    });

    if(this.vId){
    this.getAssignmentbyVehicleId(this.vId);    
    this.getVehicleById(this.vId);
    }
    this.getUnassignedEmployee();
    
  }

  onSubmit() {

    if(this.replacementCheck){
      this.replacementRequest.replacement!.vehicle = this.vehicle 
     this.vehicleService.replaceVehicle(this.vId,this.replacementRequest).subscribe(res=>{
      this.messageService.add({ severity: 'success', summary: 'Vehicle Replaced', detail: 'Vehicle is successfully replaced'});
      this.router.navigate(['/vehicle'])
    },error=>{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
    })
  }
  else if(!this.replacementCheck){
      this.vehicleService.addVehicle(this.vehicle).subscribe((res) => {
      this.messageService.add({ severity: 'Add Successfully', summary: 'Add Successfully', detail: 'Message Content' });
      this.router.navigate(['/vehicle'])

  })
 }
}


  getAllVendor(){
    this.vehicleService.getAllVendor().subscribe((res:Vendor[])=>{
      this.vendors=res;
    })
  }

  getUsageType() {
    this.productFieldService.getProductFieldByName('Usage Type').subscribe((res: ProductField) => {
      this.usageTypes = res;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
    })
  }

  getCategory() {
    this.productFieldService.getProductFieldByName('Category').subscribe((res: ProductField) => {
      this.categories = res;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
    })
  }
  getRegion() {
    this.regionService.getRegion().subscribe((regions: Region[]) => {
      this.region = regions;
      this.region.forEach((region: any) => {
        this.cities.push(JSON.parse(region.cities))
      })

    });
  }

  getAssignmentbyVehicleId(vehicleId: Number){
    this.vehicleAssignmentService.getAssignmentByVehicleId(vehicleId).subscribe((res)=>{
      this.vehicleAssignment = res;      
    })
  }

  showDialog(){
    this.visible = true;
  }

  closeDialog(){
    this.visible = false;
  }

 replaceVehicle(){
   if(this.vehicleAssignment){
     this.showDialog();
   }else{
    this.onSubmit() 
   }
 }
   
 getUnassignedEmployee(){
   this.employeeService.getAllUnAssignedEmployees().subscribe((res)=>{
     this.unassignedEmployees = res;
   })
 }

showEmpName() {
  this.empName = this.selectedUnassignedEmployee.empName 
}

 replaceVehicleWithAssignment(){
   debugger
   this.replacementRequest.assignment!.assignToEmpId = this.selectedUnassignedEmployee
   this.replacementRequest.assignment!.assignToEmpName = this.empName
   this.replacementRequest.assignment!.vehicle = this.vehicle
   this.replacementRequest.replacement!.vehicle = this.vehicle 

   this.vehicleService.replaceVehicle(this.vId,this.replacementRequest).subscribe(res=>{
    this.messageService.add({ severity: 'success', summary: 'Vehicle Replaced', detail: 'Vehicle is successfully replaced'});
    this.router.navigate(['/vehicle'])
  },error=>{
    console.log(error.error);
    
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
  })

 }

 replaceVehicleWithoutAssignment(){
   debugger
   this.replacementRequest.assignment = null
   this.replacementRequest.replacement!.vehicle = this.vehicle 

   this.vehicleService.replaceVehicle(this.vId,this.replacementRequest).subscribe(res=>{
    this.messageService.add({ severity: 'success', summary: 'Vehicle Replaced', detail: 'Vehicle is successfully replaced'});
    this.router.navigate(['/vehicle'])
  },error=>{    
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
  })

 }

 getVehicleById(id: Number){
   this.vehicleService.getVehicleById(id).subscribe((res)=>{
    
     this.previousVehicle = res;

     console.log(this.previousVehicle.vendor.vendorName);

     this.vehicle.vendor = this.previousVehicle.vendor;
    this.vehicle.region = this.previousVehicle.region 
    this.vehicle.usageType = this.previousVehicle.usageType 

   },error=>{    
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
  })
 }

}

