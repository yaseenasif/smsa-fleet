import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ProjectVehicle, ProjectVehicleValues } from 'src/app/modal/project-vehicle';
import { PrjectVehicleService } from '../service/prject-vehicle.service';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from 'src/app/modal/pageEvent';
import { PaginatedResponse } from 'src/app/modal/paginatedResponse';
import { ErrorService } from 'src/app/CommonServices/Error/error.service';

@Component({
  selector: 'app-show-vehicle',
  templateUrl: './show-vehicle.component.html',
  styleUrls: ['./show-vehicle.component.scss']
})
export class ShowVehicleComponent {
  constructor(private projectVehicleService: PrjectVehicleService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private errorHandleService: ErrorService,

  ) { }
  selectedVehicleType: string = '';
  showOriginDestination: boolean = true;
  showLease: boolean = true;
  vehicleTypes: SelectItem[] = [
    { label: 'Rental', value: 'Rental' },
    { label: 'Leased', value: 'Leased' },
    { label: 'All', value: 'All' },
  ];
  query: PageEvent = {
    page: 0,
    size: 10,
  };
  projectRentalDate !: ProjectVehicle[]
  searchByNumberList: ProjectVehicle[] = [];
  totalRecords: number = 0;
  rentalDate: boolean = false;
  searchDates: ProjectVehicleValues = {
    id: undefined,
    plateNumber: undefined,
    leaseCost: undefined,
    type: undefined,
    origin: undefined,
    destination: undefined,
    rentalDate: undefined,
    startLease: undefined,
    expiryLease: undefined,
    vendor: {
      id: undefined,
      vendorName: undefined,
      officeLocation: undefined,
      contactPersonList: [],
      attachments: undefined,
    },
    duration: undefined
  };
  projectVehicles: ProjectVehicle[] = [];
  projectVehicle: ProjectVehicle | undefined | null;
  projectVehicleValues: ProjectVehicleValues[] = [];
  projectVehicleId: number | undefined;
  items: MenuItem[] | undefined;
  // duration:number[]=[];
  minDueDate: Date | null | undefined;
  ngOnInit(): void {
    this.items = [{ label: 'Show Vehicle', routerLink: '/project-vehicle' }, { label: 'Show Project Vehicle' }];
    // this.getAllProjectVehicle()
    this.projectVehicleId = +this.route.snapshot.paramMap.get('id')!;
    if (this.projectVehicleId) {
      this.getProjectVehicleById(this.projectVehicleId);
    }
  }
  getProjectVehicleById(id: number, value?: string, date?: Date) {
    this.projectVehicleService.getProjectVehicleById(id).subscribe((res: ProjectVehicle) => {
      this.projectVehicle = res;
      this.convertInDate(this.projectVehicle)
      this.projectVehicle.projectVehicleValuesList.forEach((el: ProjectVehicleValues, index: number) => {
        this.updateDuration(index)
      })
      if (value) {
        this.onTypeChange(value)
      }
      debugger
      this.searchByRentalDate(date)
    })
  }
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

  onTypeChange(value: string) {
    if (this.projectVehicle?.projectVehicleValuesList) {

      this.projectVehicle.projectVehicleValuesList =
        (this.projectVehicle?.projectVehicleValuesList ?? []).filter((item: ProjectVehicleValues | undefined) => item?.type?.toUpperCase() === value.toUpperCase());
    }
    if (value === 'Leased') {
      this.showLease = true
      this.showOriginDestination = false;
    }
    else if (value == 'All') {
      this.getProjectVehicleById(this.projectVehicleId!)
      this.showOriginDestination = true;
      this.showLease = true
    } else if (value === 'Rental') {
      this.showLease = false
      this.showOriginDestination = true;
    }
  }
  updateDuration(i: number) {

    if (this.projectVehicle?.projectVehicleValuesList[i].startLease) {
      this.minDueDate = new Date(this.projectVehicle?.projectVehicleValuesList[i].startLease!);
    } else {
      this.minDueDate = null;
    }
    ;
    if (this.projectVehicle?.projectVehicleValuesList[i].startLease && this.projectVehicle?.projectVehicleValuesList[i].expiryLease) {
      ;
      const startLeaseTime = this.projectVehicle?.projectVehicleValuesList[i].startLease!.getTime();
      const expiryLeaseTime = this.projectVehicle?.projectVehicleValuesList[i].expiryLease!.getTime();

      if (expiryLeaseTime < startLeaseTime) {
        this.projectVehicle.projectVehicleValuesList[i].duration = Number(null);
        console.error('Expiry date is before start date.');
      } else {
        const timeDifference = expiryLeaseTime - startLeaseTime;
        const durationInDays = timeDifference / (1000 * 60 * 60 * 24);

        this.projectVehicle.projectVehicleValuesList[i].duration = durationInDays;
        console.log('Duration:', this.projectVehicle.projectVehicleValuesList[i].duration);
      }
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
  private convertDateOfSearching(obj: ProjectVehicleValues[]) {
    obj.forEach((value) => {
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

  // searchByRentalDate(value: Date) { }

  searchByRentalDate(value?: Date) {
    debugger
    if (value && this.projectVehicle && this.projectVehicle.projectVehicleValuesList) {
      this.projectVehicle.projectVehicleValuesList = this.projectVehicle.projectVehicleValuesList.filter((item: ProjectVehicleValues) => {
        // Assuming item.rentalDate is of type Date
        return item.rentalDate?.getTime() === value.getTime(); // Compare the timestamps
      });
      this.showLease = false
      this.showOriginDestination = true;
    }
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
  }
  // formatDateForSearch(date: Date): string {
  //   date.setHours(19, 0, 0, 0); // Set time to 19:00:00
  //   const isoString = date.toISOString(); // Convert to ISO string
  //   const formattedDate = isoString.substring(0, 10) + "T19:00:00.000Z"; // Set time to 19:00:00
  //   return formattedDate;
  // }
  searchByLeaseDate(startLease?: Date, expiryLease?: Date) {
    debugger;
    if (startLease && expiryLease && this.projectVehicle && this.projectVehicle.projectVehicleValuesList) {
        this.projectVehicle.projectVehicleValuesList = this.projectVehicle.projectVehicleValuesList.filter((item: ProjectVehicleValues) => {
            if (item.startLease && item.expiryLease) {
                debugger
                return (
                    item.startLease >= this.searchDates.startLease! && // Lease start date should be after or equal to startLease
                    item.expiryLease <= this.searchDates.expiryLease! // Lease expiry date should be before or equal to expiryLease
                );
            }
            return false; // If startLease or expiryLease is null for the item, exclude it
        });
    };
    this.showLease = true;
    this.showOriginDestination = false;
}

}
