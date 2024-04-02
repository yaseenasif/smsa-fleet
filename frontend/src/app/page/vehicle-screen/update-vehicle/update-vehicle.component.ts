import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleService } from '../service/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Vendor } from 'src/app/modal/vendor';
import { ProductField } from 'src/app/modal/ProductField';
import { ProductFieldServiceService } from '../../product-field/service/product-field-service.service';
import { Region } from 'src/app/modal/Region';
import { RegionService } from '../../region/service/region.service';
import { VehicleAssignmentService } from '../../Assignment/vehicle-assignment.service';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';
import { FinalReturnRequest } from 'src/app/modal/finalReturnRequest';
import { BackenCommonErrorThrow } from 'src/app/modal/BackendCommonErrorThrow';
import { ErrorService } from 'src/app/CommonServices/Error/error.service';
import { DashboardRedirectServiceService } from 'src/app/CommonServices/dashboard-redirect-service.service';

@Component({
  selector: 'app-update-vehicle',
  templateUrl: './update-vehicle.component.html',
  styleUrls: ['./update-vehicle.component.scss'],
  providers: [MessageService]
})
export class UpdateVehicleComponent implements OnInit {
  items: MenuItem[] | undefined;
  cities: any[] = [];
  assignment!: VehicleAssignment;

  region !: Region[];
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
    country: undefined,
    location: undefined,
    category: undefined,
    vendor: {
      id: undefined,
      vendorName: undefined,
      officeLocation: undefined,
      attachments: undefined
    },
    vehicleReplacement: undefined,
    vehicleStatus: undefined,
    replacementVehicleStatus: undefined,
    registrationStatus: undefined,
    insuranceStatus: undefined,
    replacementDate: undefined,
    replacementReason:  undefined,
    replacementRemarks:  undefined,
    replacementVehicle:  undefined
  };

  dummyData: any = [
    { id: 1, locationName: 2015 },
    { id: 1, locationName: 2016 },
    { id: 2, locationName: 2017 },
    { id: 3, locationName: 2018 },
    { id: 3, locationName: 2019 }
  ]

  vehicleId!: Number;
  vendors!: Vendor[];
  visible!: boolean;
  assignmentDialogVisible!: boolean;
  usageTypes: ProductField | null | undefined;
  categories: ProductField | null | undefined;
  replacementVehicle!: Vehicle

  finalReturnRequest: FinalReturnRequest = {
    replacementVehicle: undefined,
    changedAssignment: undefined
  }

  replacementCheck: boolean = false;
  finalReturn: boolean = false;

  vehicleMake: ProductField | null | undefined;
  vehicleModel: ProductField | null | undefined;
  vehicleYear: ProductField | null | undefined;
  vehicleDesign: ProductField | null | undefined;
  vehicleType: ProductField | null | undefined;
  vehicleCapicity: ProductField | null | undefined;
  vehiclePower: ProductField | null | undefined;
  vehicleFuelType: ProductField | null | undefined;

  constructor(private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private regionService: RegionService,
    private productFieldService: ProductFieldServiceService,
    private vehicleAssignmentService: VehicleAssignmentService,
    private errorHandleService: ErrorService,
    private dashboardRedirectService: DashboardRedirectServiceService
  ) { }


  name!: string;
  size = 100000
  uploadedFiles: any[] = [];

  onUpload(event: any) {

  }

  onUpload1(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  ngOnInit(): void {
    this.items = [{ label: 'Vehicle', routerLink: '/vehicle' }, { label: 'Edit Vehicle' }];
    this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.getVehicleById(this.vehicleId)
    this.getAllVendor();
    this.getUsageType();
    this.getCategory();
    this.getRegion();

    this.findReplacementVehicle();
    this.findAssignmentByVehicleId();

    this.getMakeList("Make");
    this.getModelList("Model");
    this.getYearList("Year");
    this.getDesignList("Design");
    this.getTypeList("Type");
    this.getCapicityList("Capicity");
    this.getPowerList("Power");
    this.getFuelTypeList("Fuel Type");
    this.dashboardRedirectService.setDashboardValue('Vehicle');

  }

  getVehicleById(id: Number) {
    this.vehicleService.getVehicleById(id).subscribe((res: Vehicle) => {
      this.vehicle = res;
      this.convertStringToDate(this.vehicle);
    });
  }

  private convertStringToDate(vehicle: Vehicle) {
    if (typeof vehicle.leaseStartDate === 'string') {
      vehicle.leaseStartDate = new Date(vehicle.leaseStartDate);
    }
    if (typeof vehicle.leaseExpiryDate === 'string') {
      vehicle.leaseExpiryDate = new Date(vehicle.leaseExpiryDate);
    }
    if (typeof vehicle.insuranceExpiry === 'string') {
      vehicle.insuranceExpiry = new Date(vehicle.insuranceExpiry);
    }
    if (typeof vehicle.registrationExpiry === 'string') {
      vehicle.registrationExpiry = new Date(vehicle.registrationExpiry);
    }
  }




  updateVehicle(vehicle: Vehicle) {

    this.vehicleService.updateVehicle(this.vehicleId!, vehicle).subscribe((res) => {
      this.vehicle = res;
      this.messageService.add({ severity: 'success', summary: 'Update Successfully', detail: 'Message Content' });

      setTimeout(() => {
        this.router.navigate(['/vehicle'])
      }, 1000)

    })

  }


  onSubmit() {
    this.updateVehicle(this.vehicle);
  }

  getAllVendor() {
    this.vehicleService.getAllVendor().subscribe((res: Vendor[]) => {
      this.vendors = res;
    })
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {

    this.visible = false;
    if (this.assignment) {
      this.assignmentDialogVisible = true;
    } else {
      this.finalReturnVehicle();
    }
  }

  closeAssignmentDialog() {
    this.assignmentDialogVisible = false;
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

  findReplacementVehicle() {
    this.vehicleService.findReplacementVehicle(this.vehicleId).subscribe((res) => {
      this.replacementVehicle = res;
    })
  }

  findAssignmentByVehicleId() {
    this.vehicleAssignmentService.getAssignmentByVehicleId(this.vehicleId).subscribe((res) => {
      this.assignment = res;
    })
  }

  finalReturnVehicle() {

    this.finalReturnRequest.changedAssignment = null
    this.finalReturnRequest.replacementVehicle = null
    this.vehicleService.finalReturnVehicleById(this.vehicleId, this.finalReturnRequest).subscribe((res) => {
      this.messageService.add({ severity: 'Success', summary: 'Final Returned', detail: 'Vehicle Final Returned Successfully' });
      setTimeout(() => {
        this.router.navigate(['/vehicle'])
      })
    })
  }

  navigateToAddVehicle() {
    this.finalReturn = true
    this.router.navigate(['/add-vehicle/finalReturn/vId'], {
      queryParams: {
        finalReturn: this.finalReturn, vId: this.vehicleId
      }
    });
  }

  private getMakeList(fieldName: string) {
    this.productFieldService.getProductFieldByName(fieldName).subscribe(
      (res: ProductField) => {
        this.vehicleMake = res;
      }, (err: BackenCommonErrorThrow) => {
        this.errorHandleService.showError(err.error!);
      });
  }

  private getModelList(fieldName: string) {
    this.productFieldService.getProductFieldByName(fieldName).subscribe(
      (res: ProductField) => {
        this.vehicleModel = res;
      }, (err: BackenCommonErrorThrow) => {
        this.errorHandleService.showError(err.error!);
      });
  }

  private getYearList(fieldName: string) {
    this.productFieldService.getProductFieldByName(fieldName).subscribe(
      (res: ProductField) => {
        this.vehicleYear = res;
      }, (err: BackenCommonErrorThrow) => {
        this.errorHandleService.showError(err.error!);
      });
  }

  private getDesignList(fieldName: string) {
    this.productFieldService.getProductFieldByName(fieldName).subscribe(
      (res: ProductField) => {
        this.vehicleDesign = res;
      }, (err: BackenCommonErrorThrow) => {
        this.errorHandleService.showError(err.error!);
      });
  }

  private getTypeList(fieldName: string) {
    this.productFieldService.getProductFieldByName(fieldName).subscribe(
      (res: ProductField) => {
        this.vehicleType = res;
      }, (err: BackenCommonErrorThrow) => {
        this.errorHandleService.showError(err.error!);
      });
  }

  private getCapicityList(fieldName: string) {
    this.productFieldService.getProductFieldByName(fieldName).subscribe(
      (res: ProductField) => {
        this.vehicleCapicity = res;
      }, (err: BackenCommonErrorThrow) => {
        this.errorHandleService.showError(err.error!);
      });
  }

  private getPowerList(fieldName: string) {
    this.productFieldService.getProductFieldByName(fieldName).subscribe(
      (res: ProductField) => {
        this.vehiclePower = res;
      }, (err: BackenCommonErrorThrow) => {
        this.errorHandleService.showError(err.error!);
      });
  }

  private getFuelTypeList(fieldName: string) {
    this.productFieldService.getProductFieldByName(fieldName).subscribe(
      (res: ProductField) => {
        this.vehicleFuelType = res;
      }, (err: BackenCommonErrorThrow) => {
        this.errorHandleService.showError(err.error!);
      });
  }
}
