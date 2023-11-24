import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { VendorService } from '../service/vendor.service';
import { Vendor } from 'src/app/modal/vendor';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss'],
  providers: [MessageService]
})
export class VendorListComponent implements OnInit{
contactPerson: any;

  constructor(private vendorService: VendorService,private messageService: MessageService ) { }

  vendor !: Vendor[];

  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [{label: 'Vendor'}];
    this.getAllVendors();

  }
  getAllVendors() {
    this.vendorService.getVendor().subscribe(
      (res: Vendor[]) => {
        this.vendor = res;
      }
    );
  }
  deleteVendorById(id: Number) {
   
    this.vendorService.deleteVendorById(id).subscribe((res) => {
  
      this.messageService.add({ severity: 'Delete Successfully', summary: 'Delete Successfully', detail: 'vendor has been deleted' });  

      this.getAllVendors();
    },
    (error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Delete Error',
        detail: error.error ? error.error : 'An error occurred while processing your request.'
      });
    });
}
}
