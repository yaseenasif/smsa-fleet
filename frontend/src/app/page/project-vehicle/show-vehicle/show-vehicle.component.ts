import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ProjectVehicle, ProjectVehicleValues } from 'src/app/modal/project-vehicle';
import { PrjectVehicleService } from '../service/prject-vehicle.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-show-vehicle',
  templateUrl: './show-vehicle.component.html',
  styleUrls: ['./show-vehicle.component.scss']
})
export class ShowVehicleComponent {
  constructor(private projectVehicleService: PrjectVehicleService,
    private messageService: MessageService
  ) { }
  selectedVehicleType: string = '';
  showOriginDestination: boolean = true;
  showLease: boolean = true;
  vehicleTypes: SelectItem[] = [
    { label: 'Rental', value: 'Rental' },
    { label: 'Leased', value: 'Leased' },
    { label: 'All', value: 'All' },
  ];
  projectVehicles: ProjectVehicle[] = [];
  projectVehicleValues: ProjectVehicleValues[] = [];
  projectVehicleId: number | undefined;
  items: MenuItem[] | undefined;
  duration:number[]=[];
  minDueDate: Date | null | undefined;
  ngOnInit(): void {
    this.items = [{ label: 'Show Vehicle', routerLink: '/project-vehicle' }, { label: 'Show Project Vehicle' }];
    this.getAllProjectVehicle()
    
  }
  getAllProjectVehicle(value? : string) {
    this.projectVehicleService.getAllProjectVehicle().subscribe((projectVehicle: ProjectVehicle[]) => {
      this.projectVehicles = projectVehicle;
      if(!value){
        debugger
      for (let index = 0; index < projectVehicle.length; index++) {
       this.convertInDate(projectVehicle[index])        
      for (let i = 0; i < projectVehicle[index].projectVehicleValuesList.length; i++) {
      debugger
      console.log(this.updateDuration);
      this.updateDuration(i) 
      console.log(this.updateDuration);
      }
    }
  }

   if(value){
      this.onTypeChange(value);
    }   
      console.log(projectVehicle);
    })
  }
  
  onTypeChange(value: string) {
      this.projectVehicles.forEach((element: ProjectVehicle) => {
        element.projectVehicleValuesList = element.projectVehicleValuesList.filter((item : ProjectVehicleValues) => item.type?.toUpperCase() === value.toUpperCase())
      });
debugger
      if (value === 'Leased') {
        this.showLease = true
        this.showOriginDestination = false;
      }
      else if (value == 'All'){
        this.getAllProjectVehicle()
        this.showOriginDestination = true;
        this.showLease = true
      }else if(value === 'Rental'){
        this.showLease = false
        this.showOriginDestination =true;
      }
  }
  updateDuration(i: number) {
    debugger
    if (this.projectVehicles[0].projectVehicleValuesList[i].startLease) {
        this.minDueDate = new Date(this.projectVehicles[0].projectVehicleValuesList[i].startLease!);
    } else {
        this.minDueDate = null;
    }
    debugger;
    if (this.projectVehicles[0].projectVehicleValuesList[i].startLease && this.projectVehicles[0].projectVehicleValuesList[i].expiryLease) {
        debugger;
        const startLeaseTime = this.projectVehicles[0].projectVehicleValuesList[i].startLease!.getTime();
        const expiryLeaseTime = this.projectVehicles[0].projectVehicleValuesList[i].expiryLease!.getTime();
  
        if (expiryLeaseTime < startLeaseTime) {
            this.duration[i] = Number(null); // Convert null to number type
            console.error('Expiry date is before start date.');
        } else {
            const timeDifference = expiryLeaseTime - startLeaseTime;
            const durationInDays = timeDifference / (1000 * 60 * 60 * 24);
  
            this.duration[i] = durationInDays;
            console.log('Duration:', this.duration);
        }
    } 
  }
  private convertInDate(obj: ProjectVehicle) {
    if (typeof obj.date === 'string') {
        obj.date = new Date(obj.date);
    }
    debugger
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
}
