import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { VendorService } from '../service/vendor.service';
import { Vendor } from 'src/app/modal/vendor';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/modal/employee';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss'],
  providers: [MessageService]
})
export class EditVendorComponent implements OnInit {
  items: MenuItem[] = [];
  vendorId: number | undefined;
  vendor: Vendor = {
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
      },
      {
        id: undefined,
        name: undefined,
        email: undefined,
        phoneNumber: undefined
      }
    ]
  };
  selectedEmployee!: Employee;
  name!: string;

  size = 100000;
  uploadedFiles: any[] = [];

  constructor(
    private vendorService: VendorService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  

  onUpload1(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  ngOnInit(): void {
    this.items = [{ label: 'Vendor', routerLink: '/vendor' }, { label: 'Edit Vendor' }];
    this.vendorId = +this.route.snapshot.paramMap.get('id')!;
    this.getVendorById(this.vendorId);
  }

  getVendorById(id: number) {
    this.vendorService.getVendorbyId(id).subscribe((res: Vendor) => {
      this.vendor = res;
    });
  }

  updateVendor(vendor: Vendor) {
    this.vendorService.updateVendor(this.vendorId!, vendor).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Edit Successfully',
          detail: 'Vendor has been edited'
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Edit Error',
          detail: error.error ? error.error : 'An error occurred while processing your request.'
        });
      }
    );
  }

  addContactPerson() {
    const newContactPerson = {
      id: undefined,
      name: '',
      email: '',
      phoneNumber: ''
    };
    this.vendor.contactPersonList.push(newContactPerson);
  }

  removeContactPerson(index: number) {
    if (this.vendor.contactPersonList.length > 2) {
      this.vendor.contactPersonList.splice(index, 1);
    }
  }

  onSubmit() {
    this.updateVendor(this.vendor);
  }
}
