import { Component, Input, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleService } from '../service/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Vendor } from 'src/app/modal/vendor';
import { ProductFieldServiceService } from '../../product-field/service/product-field-service.service';
import { ProductField } from 'src/app/modal/ProductField';
import { VehicleReplacement } from 'src/app/modal/vehicleReplacement';
import { RegionService } from '../../region/service/region.service';
import { Region } from 'src/app/modal/Region';


@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss'],
  providers: [MessageService]
})
export class AddVehicleComponent implements OnInit{
  vendors!:Vendor[];

  replacementCheck: boolean | undefined;

  cities: any[] = [];
  region !: Region[];
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
    insuranceExpiry: undefined,
    leaseCost: undefined,
    replaceLeaseCost: undefined,
    leaseStartDate: undefined,
    leaseExpiryDate: undefined,
    usageType: undefined,
    region: {
      id: undefined,
      name: undefined,
      country: undefined,
      cities: undefined,
      status: undefined,
    },
    category: undefined,
    vendor: {
      id: undefined,
      vendorName: undefined,
      officeLocation: undefined,
      attachments: undefined,
    },
    vehicleReplacement: undefined,
    employeeStatus: undefined,
    registrationStatus: undefined,
    insuranceStatus: undefined
  };

  selectedEmployee!:Vehicle;
  usageTypes: ProductField | null | undefined;
  categories: ProductField | null | undefined;
  vId!: number;
  vehicleReplacement: VehicleReplacement = {
    id:undefined,
    reason:undefined,
    vehicle:undefined
  }

  constructor(
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private router: Router,
    private productFieldService: ProductFieldServiceService,
    private regionService:RegionService,
    private route: ActivatedRoute
    ) { }

  name!:string;


   onUpload(event: any) {

  }



  ngOnInit(): void {
    this.items = [{ label: 'Vehicle',routerLink:'/vehicle'},{ label: 'Add Vehicle'}];
    this.getAllVendor();
    this.getUsageType();
    this.getCategory();
    this.getRegion();


    this.route.queryParams.subscribe(params => {
      this.replacementCheck = params['replacementCheck'] === 'true';
      this.vId = params['vId'];
    });
  }

  onSubmit() {

    if(this.replacementCheck){
      this.vehicleReplacement.vehicle = this.vehicle;
     this.vehicleService.replaceVehicle(this.vId,this.vehicleReplacement).subscribe(res=>{
      this.messageService.add({ severity: 'success', summary: 'Vehicle Replaced', detail: 'Vehicle is successfully replaced'});
      this.router.navigate(['/vehicle'])
    },error=>{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
    })
  }
  else if(!this.replacementCheck){
      this.vehicleService.addVehicle(this.vehicle).subscribe((res) => {
      this.messageService.add({ severity: 'Add Successfully', summary: 'Add Successfully', detail: 'Message Content' });
      this.router.navigate(['/vehicle'])

  })
 }
}


  getAllVendor(){
    this.vehicleService.getAllVendor().subscribe((res:Vendor[])=>{
      this.vendors=res;
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
  getRegion() {
    this.regionService.getRegion().subscribe((regions: Region[]) => {
      this.region = regions;
      this.region.forEach((region: any) => {
        this.cities.push(JSON.parse(region.cities))
      })

    });
  }
}

