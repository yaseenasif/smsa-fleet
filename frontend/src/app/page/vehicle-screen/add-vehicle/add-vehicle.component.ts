import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleService } from '../service/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Vendor } from 'src/app/modal/vendor';
import { ProductFieldServiceService } from '../../product-field/service/product-field-service.service';
import { ProductField } from 'src/app/modal/ProductField';
// import { VehicleReplacement } from 'src/app/modal/vehicleReplacement';
import { RegionService } from '../../region/service/region.service';
import { Region } from 'src/app/modal/Region';
import { VehicleAssignmentService } from '../../Assignment/vehicle-assignment.service';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';
import { EmployeeService } from '../../employee-screen/service/employee.service';
import { Employee } from 'src/app/modal/employee';
import { ReplacementRequest } from 'src/app/modal/replacementRequest';
import { FinalReturnRequest } from 'src/app/modal/finalReturnRequest';
import { ReplacementActionRequest } from 'src/app/modal/replacement-action-request';
import { ErrorService } from 'src/app/CommonServices/Error/error.service';
import { BackenCommonErrorThrow } from 'src/app/modal/BackendCommonErrorThrow';
import { DashboardRedirectServiceService } from 'src/app/CommonServices/dashboard-redirect-service.service';


@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss'],
  providers: [MessageService]
})
export class AddVehicleComponent implements OnInit {
  vendors!: Vendor[];

  replacementCheck: boolean | undefined;

  vehicleAssignment!: VehicleAssignment
  cities: any[] = [];
  items: MenuItem[] | undefined;

  finalReturnRequest: FinalReturnRequest = {
    replacementVehicle: undefined,
    changedAssignment: {
      id: undefined,
      assignToEmpName: undefined,
      assignToEmpId: {
          id: undefined,
      empName: undefined,
      employeeNumber: undefined,
      budgetRef: undefined,
      gender: undefined,
      maritalStatus: undefined,
      dateOfBirth: undefined,
      joiningDate: undefined,
      jobTitle: undefined,
      status: undefined,
      region: undefined,
      organization: undefined,
      division: undefined,
      deptCode: undefined,
      department: undefined,
      contactNumber: undefined,
      section: undefined,
      nationalIdNumber: undefined,
      svEmployeeNumber: undefined,
      svEmployeeName: undefined,
      location: undefined,
      country: undefined,
      nationality: undefined,
      companyEmailAddress: undefined,
      grade: undefined,
      licenseNumber: undefined,
      vehicleBudget: undefined,
      costCentre: undefined,
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
        // registrationExpiry: undefined,
        fuelType: undefined,
        vendor: {
          id: undefined,
          vendorName: undefined,
          officeLocation: undefined,
          attachments: undefined,
        },
        // insuranceExpiry: undefined,
        leaseCost: undefined,
        leaseStartDate: undefined,
        leaseExpiryDate: undefined,
        usageType: undefined,
        category: undefined,
        replacementDate: undefined,
        replaceLeaseCost: undefined,
        vehicleStatus: undefined
      }
    }
  }
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
    // registrationExpiry: undefined,
    fuelType: undefined,
    // insuranceExpiry: undefined,
    leaseCost: undefined,
    replaceLeaseCost: undefined,
    leaseStartDate: undefined,
    leaseExpiryDate: undefined,
    usageType: undefined,
    region: undefined,
    country: undefined,
    location: undefined,
    category: undefined,
    costCenter: undefined,
    vendor: {
      id: undefined,
      vendorName: undefined,
      officeLocation: undefined,
      attachments: undefined,
    },
    vehicleStatus: undefined,
    replacementVehicleStatus: undefined,
    registrationStatus: undefined,
    insuranceStatus: undefined,
    replacementDate: undefined,
    replacementReason:  undefined,
    replacementRemarks:  undefined,
    replacementVehicle:  undefined
  };

  usageTypes: ProductField | null | undefined;
  categories: ProductField | null | undefined;
  vId!: number;

  reasons: any[] = [
    { full: "Original Vehicle Under Maintenance", short: "Under Maintenance" },
    { full: "Original Vehicle Under TBA", short: "TBA" },
    { full: "Original Vehicle is Total lost", short: "Total Lost" }
  ];

  replacementRequest: ReplacementRequest = {
    replacementVehicle: {
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
      region: undefined,
      country: undefined,
      location: undefined,
      // registrationExpiry: undefined,
      fuelType: undefined,
      costCenter: undefined,
       vendor:
       {
          id: undefined,
          vendorName: undefined,
          officeLocation: undefined,
          attachments: undefined
      },
      // insuranceExpiry: undefined,
      leaseCost: undefined,
      replaceLeaseCost: undefined,
      leaseStartDate: undefined,
      leaseExpiryDate: undefined,
      usageType: undefined,
      category: undefined,
      vehicleStatus: undefined,
      replacementVehicleStatus: undefined,
      registrationStatus: undefined,
      insuranceStatus: undefined,
      replacementDate: undefined,
      replacementReason: undefined,
      replacementRemarks: undefined,
      replacementVehicle: undefined
      },
      changeAssignedEmployee: {
        id: undefined,
        employeeNumber: undefined,
        empName: undefined,
        svEmployeeNumber: undefined,
        svEmployeeName: undefined,
        nationalIdNumber: undefined,
        jobTitle: undefined,
        joiningDate: undefined,
        dateOfBirth: undefined,
        department: undefined,
        deptCode: undefined,
        division: undefined,
        fleetClassification: undefined,
        vehicleEligible: undefined,
        organization: undefined,
        section: undefined,
        gender: undefined,
        maritalStatus: undefined,
        region: undefined,
        location: undefined,
        country: undefined,
        nationality: undefined,
        contactNumber: undefined,
        companyEmailAddress: undefined,
        grade: undefined,
        licenseNumber: undefined,
        vehicleBudget: undefined,
        costCentre: undefined,
        budgetRef: undefined,
        status: undefined

      }
  }

  visible: boolean = false;
  empName: string | null | undefined;
  previousVehicle!: Vehicle;
  finalReturn!: boolean;
  temporaryReplacementVehicle!: Vehicle;
  actionCheck!: boolean;

  replacementActionRequest: ReplacementActionRequest = {
    changedAssignedEmployee: undefined,
    permanentVehicle: undefined,
    action: undefined
  };
  plateNumberValidate: boolean = false;
  screenType: string | undefined | null;

  vehicleMake: ProductField | null | undefined;
  vehicleModel: ProductField | null | undefined;
  vehicleYear: ProductField | null | undefined;
  vehicleDesign: ProductField | null | undefined;
  vehicleType: ProductField | null | undefined;
  vehicleCapicity: ProductField | null | undefined;
  vehiclePower: ProductField | null | undefined;
  vehicleFuelType: ProductField | null | undefined;

  country!: Region[];
  cityData!: Region[];
  region !: Region[];

  constructor(
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private router: Router,
    private productFieldService: ProductFieldServiceService,
    private regionService: RegionService,
    private route: ActivatedRoute,
    private vehicleAssignmentService: VehicleAssignmentService,
    private employeeService: EmployeeService,
    private errorHandleService: ErrorService,
    private dashboardRedirectService: DashboardRedirectServiceService
  ) { }

  name!: string;

  ngOnInit(): void {
    
    this.getAllVendor();
    this.getUsageType();
    this.getCategory();
    this.getCountry();
    this.getMakeList("Make");
    this.getModelList("Model");
    this.getYearList("Year");
    this.getDesignList("Design");
    this.getTypeList("Vehicle Type");
    this.getCapicityList("Capacity");
    this.getPowerList("Power");
    this.getFuelTypeList("Fuel Type");

    this.route.queryParams.subscribe(params => {
      this.replacementCheck = params['replacementCheck'] === 'true';
      this.screenType = params['screenType'];
      this.vId = params['vId'];
    });

    this.route.queryParams.subscribe(params => {
      this.finalReturn = params['finalReturn'] === 'true';
      this.vId = params['vId'];
    });

    this.route.queryParams.subscribe(params => {
      this.actionCheck = params['actionCheck'] === 'true';
      this.vId = params['vId'];
    })

    if (this.vId) {
      this.findReplacementVehicle(this.vId);
      this.getVehicleById(this.vId);
      this.getAssignmentbyVehicleId(this.vId);
    }

    this.getUnassignedEmployee();
    this.dashboardRedirectService.setDashboardValue('Vehicle');

    if(this.screenType === 'assignment'){
    this.items = [{ label: 'Assignment', routerLink: '/assignment' }, { label: 'Add Vehicle' }];
    }else {
    this.items = [{ label: 'Vehicle', routerLink: '/vehicle' }, { label: 'Add Vehicle' }];
    }
  }


  onSubmit() {

    if (this.replacementCheck) {
      this.replacementRequest.replacementVehicle = this.vehicle
      this.vehicleService.replaceVehicle(this.vId, this.replacementRequest).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Vehicle Replaced', detail: 'Vehicle is successfully replaced' });
        this.router.navigate(['/vehicle'])
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
      })
    }
    else if (this.finalReturn) {
      this.finalReturnRequest.changedAssignment = null
      this.finalReturnRequest.replacementVehicle = this.vehicle
      this.vehicleService.finalReturnVehicleById(this.vId, this.finalReturnRequest).subscribe((res) => {
        this.messageService.add({ severity: 'success', summary: 'Final Returned', detail: 'Vehicle has been Final Returned' });
        this.router.navigate(['/vehicle'])
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
      })
    }
    else if (!this.replacementCheck && !this.finalReturn) {
      this.vehicleService.addVehicle(this.vehicle).subscribe((res) => {
        this.messageService.add({ severity: 'success', summary: 'Add Successfully', detail: 'Message Content' });
        this.router.navigate(['/vehicle'])

      }, error => {
        this.messageService.add({ severity: 'error', detail: error.error });
      })
    } else if (this.screenType === "assignment") {
      this.vehicleService.addVehicle(this.vehicle).subscribe(
        (res: Vehicle) => {
          this.messageService.add({ severity: 'success', summary: 'Replace Vehicle Successfully', detail: 'Message Content' });
          this.router.navigate(['/assignment'])
        }, error => {
          this.messageService.add({ severity: 'error', detail: error.error });
        })
    }
  }


  getAllVendor() {
    this.vehicleService.getAllVendor().subscribe((res: Vendor[]) => {
      this.vendors = res;
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

  getAssignmentbyVehicleId(id: Number) {
    this.vehicleAssignmentService.getAssignmentByVehicleId(id).subscribe((res) => {
      this.vehicleAssignment = res;
    })
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  replaceVehicle() {
    if (this.vehicleAssignment) {
      this.showDialog();
    } else {
      this.onSubmit()
    }
  }

  getUnassignedEmployee() {
    this.employeeService.getAllUnAssignedEmployees().subscribe((res) => {
      this.unassignedEmployees = res;
    })
  }

  showEmpName() {
    this.empName = this.selectedUnassignedEmployee.empName
  }

  replaceVehicleWithAssignment() {
    if (this.replacementCheck) {
      this.replacementRequest.changeAssignedEmployee = this.selectedUnassignedEmployee
      this.replacementRequest.replacementVehicle = this.vehicle

      this.vehicleService.replaceVehicle(this.vId, this.replacementRequest).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Vehicle Replaced', detail: 'Vehicle is successfully replaced' });
        if(this.screenType === 'assignment'){
          this.router.navigate(['/assignment'])
         }else{
          this.router.navigate(['/vehicle'])
         }
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
      })
    } else if (this.finalReturn) {
      this.finalReturnRequest.changedAssignment!.assignToEmpId = this.selectedUnassignedEmployee
      this.finalReturnRequest.changedAssignment!.assignToEmpName = this.empName
      this.finalReturnRequest.changedAssignment!.vehicle = this.vehicle
      this.finalReturnRequest.replacementVehicle = this.vehicle

      this.vehicleService.finalReturnVehicleById(this.vId, this.finalReturnRequest).subscribe((res) => {
        this.messageService.add({ severity: 'success', summary: 'Final Returned', detail: 'Vehicle has been final returned' });
        if(this.screenType === 'assignment'){
          this.router.navigate(['/assignment'])
         }else{
          this.router.navigate(['/vehicle'])
         }
              }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
      })
    } else if (this.actionCheck) {
      this.replacementActionRequest.action = 'Replace'
      this.replacementActionRequest.changedAssignedEmployee = this.selectedUnassignedEmployee
      this.replacementActionRequest.permanentVehicle = this.vehicle
      this.vehicleService.replacementVehicleAction(this.vId, this.replacementActionRequest).subscribe((res) => {
        this.messageService.add({ severity: 'success', summary: 'Permanent Vehicle', detail: 'Permenant Vehicle has been added' });
        this.router.navigate(['/assignment'])
      }, error => {
        this.messageService.add({ severity: 'error', detail: error.error });
      });

    }
  }

  replaceVehicleWithoutAssignment() {

    if (this.replacementCheck) {
      this.replacementRequest.changeAssignedEmployee = null
      this.replacementRequest.replacementVehicle = this.vehicle

      this.vehicleService.replaceVehicle(this.vId, this.replacementRequest).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Vehicle Replaced', detail: 'Vehicle is successfully replaced' });
       if(this.screenType === 'assignment'){
        this.router.navigate(['/assignment'])
       }else{
        this.router.navigate(['/vehicle'])
       }

      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
      })
    } else if (this.finalReturn) {
      this.finalReturnRequest.changedAssignment = null
      this.finalReturnRequest.replacementVehicle = this.vehicle

      this.vehicleService.finalReturnVehicleById(this.vId, this.finalReturnRequest).subscribe((res) => {
        this.messageService.add({ severity: 'success', summary: 'Final Returned', detail: 'Vehicle has been final returned' });
        if(this.screenType === 'assignment'){
          this.router.navigate(['/assignment'])
         }else{
          this.router.navigate(['/vehicle'])
         }
       }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
      })
    } else if (this.actionCheck) {
      this.replacementActionRequest.action = 'Replace'
      this.replacementActionRequest.changedAssignedEmployee = null
      this.replacementActionRequest.permanentVehicle = this.vehicle
      this.vehicleService.replacementVehicleAction(this.vId, this.replacementActionRequest).subscribe((res) => {
        this.messageService.add({ severity: 'success', summary: 'Permanent Vehicle', detail: 'Permenant Vehicle has been added' });
        this.router.navigate(['/assignment'])
      })
    }
  }

  getVehicleById(id: Number) {
    this.vehicleService.getVehicleById(id).subscribe((res) => {

      this.previousVehicle = res;

      if (this.replacementCheck) {
        this.vehicle.vendor = this.previousVehicle.vendor;
        this.vehicle.region = this.previousVehicle.region
        this.vehicle.usageType = this.previousVehicle.usageType
      }

    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
    })
  }

  findReplacementVehicle(id: Number) {
    this.vehicleService.findReplacementVehicle(id).subscribe((res) => {
      this.temporaryReplacementVehicle = res;

      if (this.temporaryReplacementVehicle) {
        this.getAssignmentbyVehicleId(this.temporaryReplacementVehicle.id!)
      }
    })
  }

  plateNoFormat(value: string): void {
    this.plateNumberValidate = false;
    // Format: 1234 Abc
    const regex = /^\d{4}\s[A-Z]{3}$/;
    if (!/^\d/.test(value)) {
      this.plateNumberValidate = false;
    } else if (value.length > 4) {
      if (!regex.test(value)) {
        this.plateNumberValidate = false;
      } else {
        this.plateNumberValidate = true;
      }
    }
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
        debugger
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


  getCountry(): Region[] {
    this.regionService.getRegion().subscribe(
      (res: Region[]) => {
        const uniqueCountries = this.getUniqueCountries(res, 'country');
        this.country = uniqueCountries;
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error });
      }
    );
    return this.country;
  }

  getUniqueCountries(regions: Region[], propertyName: string): Region[] {
    const uniqueCountries: Region[] = [];
    const uniqueCountryNames: Set<string> = new Set();

    for (const region of regions) {
      const countryName = region[propertyName];

      if (!uniqueCountryNames.has(countryName)) {
        uniqueCountryNames.add(countryName);
        uniqueCountries.push(region);
      }
    }
    return uniqueCountries;
  }

  getRegions(country: string): Region[] {
    this.regionService.getRegionByCountry(country).subscribe((res: Region[]) => {
      this.region = [];
      this.vehicle.region = null;
      this.region = res;
    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error });
    });
    return this.region;
  }

  getAllCity(region: string): Region[] {
    this.regionService.getCitiesByRegion(region).subscribe(
      (res: Region) => {
        this.vehicle.location = null;
        const getCities = typeof res.cities === 'string' ? JSON.parse(res.cities) : res.cities;
        this.cityData = getCities.map((city: Region, index: number) => ({
          cities: city,
          id: index + 1,
        }));
      }, err => {
        this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: err.error });
      });
    return this.cityData;
  }
}
