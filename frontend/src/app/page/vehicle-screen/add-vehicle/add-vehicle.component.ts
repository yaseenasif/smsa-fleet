import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Vehicle } from 'src/app/modal/vehicle';
import { VehicleService } from '../service/vehicle.service';
import { Router } from '@angular/router';
import { Vendor } from 'src/app/modal/vendor';
import { ProductFieldServiceService } from '../../product-field/service/product-field-service.service';
import { ProductField } from 'src/app/modal/ProductField';


@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss'],
  providers: [MessageService]
})
export class AddVehicleComponent implements OnInit{
  vendors!:Vendor[];

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
    category: undefined,
    vendor: {
      id: undefined,
      vendorName: undefined,
      officeLocation: undefined,
      attachments: undefined,
    },
    vehicleReplacement: undefined
  };

  // dummyData: any = [
  //   { id: 1, locationName: 123 },
  //   { id: 2, years: 2015 },
  //   { id: 2, years: 2016 },
  //   { id: 2, years: 2017 },
  //   { id: 2, years: 2018 },
  //   { id: 2, years: 2019 },
  //   { id: 3, locationName: 124 },
  //   { id: 4, locationName: 125 },
  //   {id: 1, vendorName: 'Hanco'},
  //   {id: 2, vendorName: 'Al jazirah'},
  //   {id: 3, vendorName: 'Best'}
  // ]


  selectedEmployee!:Vehicle;
  usageTypes: ProductField | null | undefined;
  categories: ProductField | null | undefined;
  
  constructor( 
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private router: Router,
    private productFieldService: ProductFieldServiceService
    ) { }
  
  name!:string;


   onUpload(event: any) {
    
  }

   
  
  ngOnInit(): void {
    this.items = [{ label: 'Vehicle',routerLink:'/vehicle'},{ label: 'Add Vehicle'}];
    this.getAllVendor();
    this.getUsageType();
    this.getCategory();
  }

  onSubmit() {
    this.vehicleService.addVehicle(this.vehicle).subscribe((res) => {

      this.messageService.add({ severity: 'Add Successfully', summary: 'Add Successfully', detail: 'Message Content' });  

      setTimeout(() => {
        this.router.navigate(['/vehicle'])
      },5000)

    });
  
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
}

