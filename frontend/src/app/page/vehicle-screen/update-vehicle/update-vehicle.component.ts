import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleService } from '../service/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Vendor } from 'src/app/modal/vendor';

@Component({
  selector: 'app-update-vehicle',
  templateUrl: './update-vehicle.component.html',
  styleUrls: ['./update-vehicle.component.scss'],
  providers: [MessageService]
})
export class UpdateVehicleComponent implements OnInit{
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
    attachments: undefined,
    vendor: {
      id: undefined,
      vendorName: undefined,
      officeLocation: undefined,
      attachments: undefined
    },
    vehicleReplacement: undefined
  };

  dummyData: any = [
    { id: 1, locationName: 2015},
    { id: 1, locationName: 2016},
    { id: 2, locationName: 2017 },
    { id: 3, locationName: 2018 },
    { id: 3, locationName: 2019 }
  ]
    vehicleId!: Number;
  vendors!: Vendor[];
  visible!: boolean;

  constructor(private vehicleService: VehicleService,
              private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService
    
    ) { }


  name!:string;
  size=100000
  uploadedFiles: any[] = [];

  onUpload(event: any) {
    
  }

   onUpload1(event:any) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  }
  
  ngOnInit(): void {
    this.items = [{ label: 'Vehicle',routerLink:'/vehicle'},{ label: 'Edit Vehicle'}];
    this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.getVehicleById(this.vehicleId)
    this.getAllVendor();
  }

  getVehicleById(id: Number) {
    this.vehicleService.getVehicleById(id).subscribe((res: Vehicle) => {
      this.vehicle = res;
      console.log(this.vehicle);
      
    })
  }

  updateVehicle(vehicle: Vehicle) {

    this.vehicleService.updateVehicle(this.vehicleId!, vehicle).subscribe((res) => {
      this.vehicle=res;
      this.messageService.add({ severity: 'success', summary: 'Update Successfully', detail: 'Message Content' });  

      setTimeout(() => {
        this.router.navigate(['/vehicle'])
      },2000)
      
    })

  }
  

  onSubmit() {
    this.updateVehicle(this.vehicle);
  }

  getAllVendor(){
    this.vehicleService.getAllVendor().subscribe((res:Vendor[])=>{
      this.vendors=res;
    })
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  deleteVehicle() {
    this.vehicleService.deleteVehicle(this.vehicleId).subscribe((res) => {
      this.vehicle=res;      
      this.messageService.add({ severity: 'error', summary: 'Delete Successfully', detail: 'Vehicle has been deleted' });
      setTimeout(() => {
        this.router.navigate(['/vehicle'])
      }, 1000)
    })  
  }
}

