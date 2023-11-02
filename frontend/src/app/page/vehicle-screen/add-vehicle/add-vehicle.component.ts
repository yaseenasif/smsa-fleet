import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleService } from '../service/vehicle.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss'],
  providers: [MessageService]
})
export class AddVehicleComponent implements OnInit{
  items: MenuItem[] | undefined;
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
    vendor: undefined,
    insuranceExpiry: undefined,
    leaseCost: undefined,
    leaseStartDate: undefined,
    leaseExpiryDate: undefined,
    usageType: undefined,
    attachments: undefined
  };

  dummyData: any = [
    { id: 1, locationName: 123 },
    { id: 2, years: 2022 },
    { id: 3, locationName: 123 }
  ]

  selectedEmployee!:Vehicle;
  
  constructor( 
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private router: Router
    ) { }
  
  name!:string;


   onUpload(event: any) {
    
  }

   
  
  ngOnInit(): void {
    this.items = [{ label: 'Vehicle',routerLink:'/vehicle'},{ label: 'Add Vehicle'}];

  }

  onSubmit() {
    this.vehicleService.addVehicle(this.vehicle).subscribe((res) => {

      this.messageService.add({ severity: 'Add Successfully', summary: 'Add Successfully', detail: 'Message Content' });  

      setTimeout(() => {
        this.router.navigate(['/vehicle'])
      },8000)

    });
  
  }
}

