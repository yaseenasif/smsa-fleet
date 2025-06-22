import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { VendorService } from '../service/vendor.service';
import { Vendor } from 'src/app/modal/vendor';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.scss'],
})
export class VendorDetailComponent implements OnInit {

  constructor(
    private vendorService: VendorService,
    private route: ActivatedRoute
  ) {}

  items: MenuItem[] | undefined;
  vendorId: number | undefined;
  vendor : Vendor = {
    id: undefined,
    vendorName: undefined,
    officeLocation: undefined,
    attachments: undefined,
    contactPersonList: [
      {
        id: undefined,
        name: undefined,
        email: undefined,
        phoneNumber: undefined
      }, {
        id: undefined,
        name: undefined,
        email: undefined,
        phoneNumber: undefined
      }
    ]
  };
  ngOnInit(): void {
    this.items = [{ label: 'Vendor',routerLink:'/vendor'},{ label: 'Vendor Detail'}];
    this.vendorId = +this.route.snapshot.paramMap.get('id')!;
    this.getVendorbyId(this.vendorId);
  }

  getVendorbyId(id: number) {
    this.vendorService.getVendorbyId(id).subscribe((res: Vendor) => {
      this.vendor = res;     
    });
  }

  getVendorDetailById(vendor: Vendor) {
    this.vendorService.updateVendor(this.vendorId!, vendor).subscribe((res) => {
    });
  }

  onSubmit() {
    this.getVendorDetailById(this.vendor);
  }
}
