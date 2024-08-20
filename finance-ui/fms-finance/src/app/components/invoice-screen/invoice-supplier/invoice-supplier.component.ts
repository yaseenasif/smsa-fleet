import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Vendor } from '../../../modal/vendor';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoice-supplier',
  templateUrl: './invoice-supplier.component.html',
  styleUrl: './invoice-supplier.component.scss'
})
export class InvoiceSupplierComponent {


  invoiceFileId !: number;
  supplierNames : string[] = [];
  vendors : Vendor[] = [];
  vendorCount !: number;

  constructor(private messageService: MessageService, private route: ActivatedRoute,private router: Router,
    private invoiceService: InvoiceService) {}


  ngOnInit(): void {
    // First, try to get the `invoiceFileId` from the route parameters
    this.invoiceFileId = +this.route.snapshot.paramMap.get('id')!;

    // If it comes from query parameters instead
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.invoiceFileId = +params['id'];
      }
    });

    this.getInvoicesSuppliersByFileId(this.invoiceFileId);
  }

  getInvoicesSuppliersByFileId(fileId: number){
    this.invoiceService.getInvoicesSuppliersByFileId(fileId).subscribe((res)=>{
      this.vendors = res
      this.vendorCount = this.vendors.length
    })
  }

  redirectToInvoiceUpload(){
    this.router.navigate(['/invoice-upload'])
  }
}
