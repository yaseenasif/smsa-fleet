import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ProjectVehicle, ProjectVehicleValues } from 'src/app/modal/project-vehicle';
import { Vendor } from 'src/app/modal/vendor';
import { PrjectVehicleService } from '../service/prject-vehicle.service';
import { Router } from '@angular/router';
import { VendorService } from '../../vendor-screen/service/vendor.service';
import { ProductFieldServiceService } from '../../product-field/service/product-field-service.service';
import { ProductField } from 'src/app/modal/ProductField';
import { DashboardRedirectServiceService } from 'src/app/CommonServices/dashboard-redirect-service.service';
import { BackenCommonErrorThrow } from 'src/app/modal/BackendCommonErrorThrow';
import { ErrorService } from 'src/app/CommonServices/Error/error.service';
import { ɵNullViewportScroller } from '@angular/common';

@Component({
  selector: 'app-add-project-vehicle',
  templateUrl: './add-project-vehicle.component.html',
  styleUrls: ['./add-project-vehicle.component.scss'],
  providers: [MessageService]
})
export class AddProjectVehicleComponent implements OnInit {
  items: MenuItem[] | undefined;
  vendors!: Vendor[];
  projectNames: ProductField | null | undefined;
  types: ProductField | null | undefined;
  replacementCheck: boolean | undefined;


  vehicleTypes: SelectItem[] = [
    { label: 'Rental', value: 'Rental' },
    { label: 'Leased', value: 'Leased' },
  ];
  minDueDate: Date | null | undefined;
  projectVehicle: ProjectVehicle = {
    id: null,
    projectName: null,
    date: null,
    projectVehicleValuesList: [{
      id: null,
      plateNumber: null,
      leaseCost: null,
      type: null,
      origin: null,
      destination: null,
      rentalDateTo: null,
      rentalDate: null,
      startLease: null,
      expiryLease: null,
      duration: null,
      costCenter: null,
      vendor: {
        id: null,
        vendorName: null,
        officeLocation: null,
        contactPersonList: [],
        attachments: null
      },
      dateForMonth: new Date,
      month: null,
      vehicleType: undefined,
      referenceNo: undefined
    }]
  };
  month: string | null | undefined;
  tabIndex: number = 0;
  vehicleTypeList: ProductField | undefined | null;
  constructor(
    private dashboardRedirectService: DashboardRedirectServiceService,
    private productFieldService: ProductFieldServiceService,
    private projectVehicleService: PrjectVehicleService,
    private errorHandleService: ErrorService,
    private messageService: MessageService,
    private vendorService: VendorService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.updateMonthForFieldValue();
    console.log(this.projectVehicle.projectVehicleValuesList);
    this.items = [{ label: 'Project Vehicle', routerLink: '/project-vehicle' }, { label: 'Add Project Vehicle' }];
    this.getAllVendors();
    this.getProjectName();
    this.dashboardRedirectService.setDashboardValue('ProjectVehicle');
    this.getTypeList('Vehicle Type');
  }

  addMoreFieldValue(event: Event) {
    event.stopPropagation();
    const newFieldValue: ProjectVehicleValues = {
      id: null,
      dateForMonth: new Date,
      month: this.month,
      plateNumber: null,
      leaseCost: null,
      type: null,
      origin: null,
      destination: null,
      rentalDateTo: null,
      rentalDate: null,
      startLease: null,
      expiryLease: null,
      duration: null,
      costCenter: null,
      vendor: {
        id: null,
        vendorName: null,
        officeLocation: null,
        contactPersonList: [],
        attachments: null
      },
      vehicleType: undefined,
      referenceNo: undefined
    };
    this.projectVehicle.projectVehicleValuesList.push(newFieldValue);
    console.log(this.projectVehicle.projectVehicleValuesList);
  }


  removeFieldValue(index: number) {
    if (this.projectVehicle.projectVehicleValuesList.length > 1) {
      this.projectVehicle.projectVehicleValuesList.splice(index, 1);
    }
  }

  private getAllVendors() {
    this.vendorService.getVendor().subscribe((res: Vendor[]) => {
      this.vendors = res;
    });
  }
  onSubmit() {
    this.projectVehicleService.addProjectVehicle(this.projectVehicle).subscribe(
      (res: ProjectVehicle) => {
        this.messageService.add({ severity: 'success', summary: 'Project Vehicle Added Successfully', detail: 'Project Vehicle has been added' });
        setTimeout(() => {
          this.router.navigate(['/project-vehicle']);
        }, 1000);
      },
      (error) => {
      }
    );
  }
  private getProjectName() {
    this.productFieldService.getProductFieldByName('Project Name').subscribe((res: ProductField) => {
      this.projectNames = res;
      console.log(res);

    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
    })
  }

  updateDuration(i: number) {
    if (this.projectVehicle.projectVehicleValuesList[i].startLease) {
      this.minDueDate = new Date(this.projectVehicle.projectVehicleValuesList[i].startLease!);
    } else {
      this.minDueDate = null;
    }

    if (this.projectVehicle.projectVehicleValuesList[i].startLease && this.projectVehicle.projectVehicleValuesList[i].expiryLease) {

      const startLeaseTime = this.projectVehicle.projectVehicleValuesList[i].startLease!.getTime();
      const expiryLeaseTime = this.projectVehicle.projectVehicleValuesList[i].expiryLease!.getTime();

      if (expiryLeaseTime < startLeaseTime) {
        this.projectVehicle.projectVehicleValuesList[i].duration = null;
        this.projectVehicle.projectVehicleValuesList[i].startLease = null;
      } else {
        const timeDifference = expiryLeaseTime - startLeaseTime;
        const durationInDays = timeDifference / (1000 * 60 * 60 * 24);

        this.projectVehicle.projectVehicleValuesList[i].duration = durationInDays;
      }
    } else {
      this.projectVehicle.projectVehicleValuesList[i].duration = null;
    }
  }
  private updateMonthForFieldValue(): void {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const monthIndex = this.projectVehicle.projectVehicleValuesList[0].dateForMonth!.getMonth();
    const monthName = monthNames[monthIndex];
    this.projectVehicle.projectVehicleValuesList[0].month = monthName;
    this.month = monthName;
  }

  private getTypeList(fieldName: string): void {
    this.productFieldService.getProductFieldByName(fieldName).subscribe(
      (res: ProductField) => {
        this.vehicleTypeList = res;
      }, (err: BackenCommonErrorThrow) => {
        this.errorHandleService.showError(err.error!);
      });
  }
}
