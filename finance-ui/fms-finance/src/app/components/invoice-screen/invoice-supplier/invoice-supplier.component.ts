import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Invoice } from '../../../modal/invoice';
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
  // vendors : Vendor[] = [];
  vendorCount !: number;
  invoices: Invoice[] = [];
  dialogVisible: boolean = false;
  remarks!:string;

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
      this.invoices = res
      this.vendorCount = this.invoices.length
    })
  }

  redirectToInvoiceUpload(){
    this.router.navigate(['/invoice-upload'])
  }

  closeDialog(){
    this.dialogVisible = false
  }

  showDialog(remarks: string){
    this.remarks = remarks
    this.dialogVisible = true
  }
}
