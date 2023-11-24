import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Vendor } from 'src/app/modal/vendor';
import { VendorService } from '../service/vendor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss'],
  providers: [MessageService]

})
export class AddVendorComponent implements OnInit {

  items: MenuItem[] = [];
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
      }, {
        id: undefined,
        name: undefined,
        email: undefined,
        phoneNumber: undefined
      }
    ]
  };

  constructor(private vendorService: VendorService,
    private router: Router ,private messageService: MessageService) { }

  ngOnInit(): void {
    this.items = [{ label: 'Vendor', routerLink: '/vendor' }, { label: 'Add Vendor' }];
  }

  onSubmit() {
    this.vendorService.addVendor(this.vendor).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Added Successfully',
          detail: 'Vendor has been added',
        });
        setTimeout(() => {
          this.router.navigate(['/vendor']);
        }, 5000);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Add Error',
          detail: error.error ? error.error : 'An error occurred while processing your request.',
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
}
