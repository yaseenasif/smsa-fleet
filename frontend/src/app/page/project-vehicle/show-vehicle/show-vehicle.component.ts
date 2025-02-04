import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ProjectVehicle, ProjectVehicleValues } from 'src/app/modal/project-vehicle';
import { PrjectVehicleService } from '../service/prject-vehicle.service';
import { SelectItem } from 'primeng/api';
import { ErrorService } from 'src/app/CommonServices/Error/error.service';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from 'src/app/modal/pageEvent';
import { DashboardRedirectServiceService } from 'src/app/CommonServices/dashboard-redirect-service.service';
import { VehicleService } from '../../vehicle-screen/service/vehicle.service';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-show-vehicle',
  templateUrl: './show-vehicle.component.html',
  styleUrls: ['./show-vehicle.component.scss']
})
export class ShowVehicleComponent {
  projectVehicle: ProjectVehicle | undefined | null;
  vehicleTypes: SelectItem[] = [
    { label: 'Rental', value: 'Rental' },
    { label: 'Leased', value: 'Leased' },
    { label: 'All', value: 'All' },
  ];
  showOriginDestination: boolean = true;
  selectedVehicleType: string = '';
  showLease: boolean = true;
  searchWithLease: boolean | undefined | null;
  searchDates: ProjectVehicleValues = {
    vendor: {
      officeLocation: undefined,
      vendorName: undefined,
      id: undefined,
      contactPersonList: [{
        phoneNumber: undefined,
        email: undefined,
        name: undefined,
        id: undefined,
      }],
      attachments: undefined,
    },
    costCenter: undefined,
    rentalDateTo: undefined,
    plateNumber: undefined,
    referenceNo: undefined,
    vehicleType: undefined,
    destination: undefined,
    expiryLease: undefined,
    rentalDate: undefined,
    startLease: undefined,
    leaseCost: undefined,
    duration: undefined,
    origin: undefined,
    month: undefined,
    type: undefined,
    id: undefined,
  };
  projectVehicleId: number | undefined;
  minDueDate: Date | null | undefined;
  items: MenuItem[] | undefined;
  searchType: string | null | undefined;
  selectedMonths: string[] = [];
  monthList: { name: string }[] = [
    { name: "January" }, { name: "February" },
    { name: "March" }, { name: "April" },
    { name: "May" }, { name: "June" },
    { name: "July" }, { name: "August" },
    { name: "September" }, { name: "October" },
    { name: "November" }, { name: "December" }
  ];


  constructor(
    private projectVehicleService: PrjectVehicleService,
    private errorHandleService: ErrorService,
    private route: ActivatedRoute, private dashboardRedirectService: DashboardRedirectServiceService,
  ) { }

  ngOnInit(): void {
    this.items = [{ label: 'Show Vehicle', routerLink: '/project-vehicle' }, { label: 'Show Project Vehicle' }];
    this.projectVehicleId = +this.route.snapshot.paramMap.get('id')!;
    if (this.projectVehicleId) {
      this.getProjectVehicleById(this.projectVehicleId);
    }
    this.dashboardRedirectService.setDashboardValue('ProjectVehicle');
  }

  getProjectVehicleById(id: number, value?: string, date?: Date) {
    this.projectVehicleService.getProjectVehicleById(id).subscribe((res: ProjectVehicle) => {
      this.projectVehicle = res;
      this.convertInDate(this.projectVehicle)
      if (value) {
        this.onTypeChange(value)
      }
    })
  }

  private onTypeChange(value: string) {
    if (this.projectVehicle?.projectVehicleValuesList) {
      this.projectVehicle.projectVehicleValuesList =
        (this.projectVehicle?.projectVehicleValuesList ?? []).filter((item: ProjectVehicleValues | undefined) => item?.type?.toUpperCase() === value.toUpperCase());
    }
    if (value === 'Leased') {
      this.searchType = "For" + value;
      this.showLease = true
      this.showOriginDestination = false;
      this.searchDates.expiryLease = null;
      this.searchDates.startLease = null;
      this.searchDates.rentalDate = null;
      this.searchDates.rentalDateTo = null;
      this.searchWithLease = true;
    }
    else if (value == 'All') {
      this.searchType = null;
      this.searchDates.startLease = null;
      this.searchDates.expiryLease = null;
      this.searchDates.rentalDate = null;
      this.searchDates.rentalDateTo = null;
      this.searchWithLease = null;
      this.getProjectVehicleById(this.projectVehicleId!)
      this.showOriginDestination = true;
      this.showLease = true
    } else if (value === 'Rental') {
      this.searchType = "For " + value;
      this.showOriginDestination = true;
      this.searchDates.startLease = null;
      this.searchDates.expiryLease = null;
      this.searchDates.rentalDate = null;
      this.searchDates.rentalDateTo = null;
      this.searchWithLease = false;
      this.showLease = false
    }
  }

  private convertInDate(obj: ProjectVehicle) {
    if (typeof obj.date === 'string') {
      obj.date = new Date(obj.date);
    }
    obj.projectVehicleValuesList.forEach((value) => {
      if (typeof value.rentalDate === 'string') {
        value.rentalDate = new Date(value.rentalDate);
      }
      if (typeof value.startLease === 'string') {
        value.startLease = new Date(value.startLease);
      }
      if (typeof value.expiryLease === 'string') {
        value.expiryLease = new Date(value.expiryLease);
      }
    });
  }

  searchByRentalDate() {
    this.searchWithLease = false;
    if (this.searchDates.rentalDate && this.searchDates.rentalDateTo) {
      this.showOriginDestination = true;
      this.selectedVehicleType = '';
      this.showLease = false
      this.projectVehicleService.getAllProjectVehicleValuesBySearchSpecification(this.projectVehicleId!, this.searchDates).subscribe(
        (res: ProjectVehicleValues[]) => {
          if (this.projectVehicle?.projectVehicleValuesList) {
            this.projectVehicle.projectVehicleValuesList = res;
          }
        }, (error: any) => {
          this.errorHandleService.showError(error.error.error);
        });
    }
  }

  searchByLeaseDates() {
    this.searchWithLease = true;
    if (this.searchDates.startLease && this.searchDates.expiryLease) {
      this.showOriginDestination = false;
      this.selectedVehicleType = '';
      this.showLease = true
      this.projectVehicleService.getAllProjectVehicleValuesBySearchSpecification(this.projectVehicleId!, this.searchDates).subscribe(
        (res: ProjectVehicleValues[]) => {
          if (this.projectVehicle?.projectVehicleValuesList) {
            this.projectVehicle.projectVehicleValuesList = res;
          }
        }, (error: any) => {
          this.errorHandleService.showError(error.error.error);
        });
    }
  }
  clear() {
    this.searchWithLease = undefined;
    this.searchDates = {
      vendor: {
        officeLocation: undefined,
        vendorName: undefined,
        id: undefined,
        contactPersonList: [{
          phoneNumber: undefined,
          email: undefined,
          name: undefined,
          id: undefined,
        }],
        attachments: undefined,
      },
      costCenter: undefined,
      rentalDateTo: undefined,
      plateNumber: undefined,
      destination: undefined,
      vehicleType: undefined,
      referenceNo: undefined,
      expiryLease: undefined,
      rentalDate: undefined,
      startLease: undefined,
      leaseCost: undefined,
      duration: undefined,
      origin: undefined,
      type: undefined,
      month: undefined,
      id: undefined,
    };
    this.selectedVehicleType = '';
    this.selectedMonths = [];
    this.getProjectVehicleById(this.projectVehicleId!);
  }

  stringifyMonths(monthList: string[]): void {
    this.searchDates.month = JSON.stringify(monthList);
    this.searchByMonth(this.searchDates);
  }

  searchByMonth(searchDates: ProjectVehicleValues): void {
    this.selectedVehicleType = '';
    this.projectVehicleService.getAllProjectVehicleValuesBySearchSpecification(this.projectVehicleId!,searchDates)
      .subscribe((res: ProjectVehicleValues[]) => {
        if (this.projectVehicle?.projectVehicleValuesList) {
          this.projectVehicle.projectVehicleValuesList = res;
        }
      });
  }

  downloadExcelData() {
    if (this.projectVehicle && this.projectVehicle.projectVehicleValuesList) {
      this.projectVehicleService.downloadExcelData(this.projectVehicle.projectVehicleValuesList)
        .subscribe(blob => saveAs(blob, "Report Data.xlsx"));
    }
  }
}


// if (this.searchDates.rentalDate instanceof Date) {
//   const isoString = this.searchDates.rentalDate.toISOString();
//   this.searchDates.rentalDate = isoString;
// }
