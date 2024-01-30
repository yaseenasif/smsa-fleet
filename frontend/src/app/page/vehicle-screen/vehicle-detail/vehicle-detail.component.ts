import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { VehicleService } from '../service/vehicle.service';
import { Vehicle } from 'src/app/modal/vehicle'
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss']
})
export class VehicleDetailComponent implements OnInit {

  constructor(
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    ) { }

  vId!:number

  items: MenuItem[] | undefined;
  vehicle : Vehicle = {
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
      attachments: undefined
    },
    vehicleReplacement: undefined,
    vehicleStatus: undefined,
    replacementVehicleStatus: undefined,
    registrationStatus: undefined,
    insuranceStatus: undefined,
    replacementDate: undefined
  };
  vehicleId: Number | undefined;




  ngOnInit() {
    this.items = [{ label: 'Vehicle', routerLink:'/vehicle'}, { label: 'Vehicle Detail'}];
    this.getAllVehicles();
    this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.getVehicleById(this.vehicleId);
  }

  getAllVehicles() {

    this.vehicleService.getAllVehicles().subscribe((res: Vehicle[]) => {


    })

  }

  getVehicledetailById(vehicle: Vehicle) {

    this.vehicleService.updateVehicle(this.vehicleId!, vehicle).subscribe((res) => {
    })

  }

  getVehicleById(id: Number) {
    this.vehicleService.getVehicleById(id).subscribe((res: Vehicle) => {
      this.vehicle = res;
    });
  }
  onSubmit(){
      this.getAllVehicles();
      this.getVehicledetailById(this.vehicle);
  }
}
