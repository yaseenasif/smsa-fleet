import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ProjectVehicle, ProjectVehicleValues } from 'src/app/modal/project-vehicle';
import { PrjectVehicleService } from '../service/prject-vehicle.service';
import { SelectItem } from 'primeng/api';
import { ErrorService } from 'src/app/CommonServices/Error/error.service';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from 'src/app/modal/pageEvent';

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
    rentalDateTo: undefined,
    plateNumber: undefined,
    destination: undefined,
    expiryLease: undefined,
    rentalDate: undefined,
    startLease: undefined,
    leaseCost: undefined,
    duration: undefined,
    origin: undefined,
    type: undefined,
    id: undefined,
  };
  projectVehicleId: number | undefined;
  minDueDate: Date | null | undefined;
  items: MenuItem[] | undefined;
  searchType: string | null | undefined;

  constructor(
    private projectVehicleService: PrjectVehicleService,
    private errorHandleService: ErrorService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.items = [{ label: 'Show Vehicle', routerLink: '/project-vehicle' }, { label: 'Show Project Vehicle' }];
    this.projectVehicleId = +this.route.snapshot.paramMap.get('id')!;
    if (this.projectVehicleId) {
      this.getProjectVehicleById(this.projectVehicleId);
    }
  }

  getProjectVehicleById(id: number, value?: string, date?: Date) {
    this.projectVehicleService.getProjectVehicleById(id).subscribe((res: ProjectVehicle) => {
      debugger
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
}


// if (this.searchDates.rentalDate instanceof Date) {
//   const isoString = this.searchDates.rentalDate.toISOString();
//   this.searchDates.rentalDate = isoString;
// }
