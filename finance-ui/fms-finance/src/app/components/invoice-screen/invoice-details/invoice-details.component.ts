import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../../common-service/vehicle.service';
import { Invoice } from '../../../modal/invoice';
import { InvoiceService } from '../invoice.service';


interface InvoiceType {
  name: string;
}

interface InvoiceRecord {
  date: string;
  invoiceNumber: string | undefined,
  progress: string | undefined,
  fileName: string,
  budget: string | undefined
}

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss'
})
export class InvoiceDetailsComponent implements OnInit{

  value !: string;
  invoiceType !: InvoiceType[];

  invoiceRecord !: InvoiceRecord[];
  invoiceId!: number;
  invoiceFileId !: number;
  supplierName !: string;
  
  invoice: Invoice[] = [];
 
  constructor(private route: ActivatedRoute,private router: Router, 
    private invoiceService: InvoiceService, private vehicleService: VehicleService){
  }

  ngOnInit(): void {
    this.invoiceType = [
      { name: 'Lease'},
      { name: 'Unleased'},
      { name: 'Inprogress'}
    ];

    this.invoiceFileId = +this.route.snapshot.paramMap.get('id')!;
    this.supplierName = this.route.snapshot.paramMap.get('supplierName')!;
    this.getInvoicesBySupplierAndFileId();
  }


  getInvoicesBySupplierAndFileId(){
    this.invoiceService.getInvoicesBySupplierAndFileId(this.invoiceFileId,this.supplierName).subscribe((res)=>{
      this.invoice = res
    })
  }

  redirectToSupplier(){
    this.router.navigate(['/invoice-supplier/id'], {
      queryParams: {
        id: this.invoiceFileId
      }
    });
  }
}
