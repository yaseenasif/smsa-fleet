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
      this.searchWithLease = true;
    }
    else if (value == 'All') {
      this.searchType = null;
      this.searchDates.startLease = null;
      this.searchDates.expiryLease = null;
      this.searchDates.rentalDate = null;
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
    if (this.searchDates.rentalDate instanceof Date) {
      const isoString = this.searchDates.rentalDate.toISOString();
      this.searchDates.rentalDate = isoString;
    }
    this.showOriginDestination = true;
    this.selectedVehicleType = '';
    this.showLease = false
    this.projectVehicleService.getAllProjectVehicleValuesBySearchSpecification(this.projectVehicleId!, this.searchDates).subscribe(
      (res: ProjectVehicleValues[]) => {
        if (this.projectVehicle?.projectVehicleValuesList) {
          this.projectVehicle.projectVehicleValuesList = res;
        }
        this.searchDates.rentalDate = new Date(this.searchDates.rentalDate!);
      }, (error: any) => {
        this.errorHandleService.showError(error.error.error);
      });
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

// searchByRentalDate(value: Date) { }

// searchByRentalDate(value?: Date) {
//
//   if (value && this.projectVehicle && this.projectVehicle.projectVehicleValuesList) {
//     this.projectVehicle.projectVehicleValuesList = this.projectVehicle.projectVehicleValuesList.filter((item: ProjectVehicleValues) => {
//       // Assuming item.rentalDate is of type Date
//       return item.rentalDate?.getTime() === value.getTime(); // Compare the timestamps
//     });
//     this.showLease = false
//     this.showOriginDestination = true;
//   }
// if (value) {
//   // const rentalDateString = this.formatDateForSearch(value); // Convert frontend date format to match backend format
//   this.projectVehicleService.getProjectVehicleByRentalDate(value)
//     .subscribe((res: ProjectVehicleValues[]) => {
//
//      this.projectVehicle = undefined
//       this.projectVehicleValues = res;
//       this.convertDateOfSearching(this.projectVehicleValues)
//       // this.searchByNumberList = res;
//     }, error => {
//       this.errorHandleService.showError(error.error);
//     });
// }

//
//   searchByLeaseDate(startLease?: Date, expiryLease?: Date) {
//     ;
//     if (startLease && expiryLease && this.projectVehicle && this.projectVehicle.projectVehicleValuesList) {
//         this.projectVehicle.projectVehicleValuesList = this.projectVehicle.projectVehicleValuesList.filter((item: ProjectVehicleValues) => {
//             if (item.startLease && item.expiryLease) {
//
//                 return (
//                     item.startLease >= this.searchDates.startLease! && // Lease start date should be after or equal to startLease
//                     item.expiryLease <= this.searchDates.expiryLease! // Lease expiry date should be before or equal to expiryLease
//                 );
//             }
//             return false; // If startLease or expiryLease is null for the item, exclude it
//         });
//     };
//     this.showLease = true;
//     this.showOriginDestination = false;
// }
// getAllProjectVehicle(value? : string) {
//   this.projectVehicleService.getAllProjectVehicle().subscribe((projectVehicle: ProjectVehicle[]) => {
//     this.projectVehicles = projectVehicle;

//     for (let index = 0; index < projectVehicle.length; index++) {
//      this.convertInDate(projectVehicle[index])
//     for (let i = 0; i < projectVehicle[index].projectVehicleValuesList.length; i++) {
//     console.log(this.updateDuration);
//     this.updateDuration(i)
//     console.log(this.updateDuration);
//     }
// }

//  if(value){
//     this.onTypeChange(value);
//   }
//     console.log(projectVehicle);
//   })
// }
