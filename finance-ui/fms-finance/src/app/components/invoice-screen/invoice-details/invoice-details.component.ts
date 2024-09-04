import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../../common-service/vehicle.service';
import { Invoice } from '../../../modal/invoice';
import { ValidatedInvoices } from '../../../modal/ValidatedInvoices';
import { VehicleAssignment } from '../../../modal/VehicleAssignment';
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
  validatedInvoices : ValidatedInvoices[] = [];

  validatedInvoicess = {
    1: {
      id: 1,
      assignToEmpName: 'John Doe',
      assignToEmpId: {
        id: 100,
        employeeNumber: 12345,
        empName: 'John Doe',
        // other properties
      },
      vehicle: {
        id: 1,
        plateNumber: 'ABC123',
        // other properties
      }
    }
  };
  
 
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

  validateInvoices(){
    this.invoiceService.getValidatedInvoices(this.invoice).subscribe((res:ValidatedInvoices[])=>{
      this.validatedInvoices = res
      console.log(this.validatedInvoices[3])
      const assignment = this.validatedInvoices[3] as unknown as VehicleAssignment;
      const assignToEmpName = assignment?.assignToEmpName;
      console.log(assignToEmpName);
    })
  }


  getAssignToEmpName(invoiceId: number): String | null | undefined {
    const assignment = this.validatedInvoices[invoiceId] as unknown as VehicleAssignment;
    return assignment?.assignToEmpName;
  }
  
  isHighlighted(invoiceId: number): boolean {
    return this.validatedInvoices[invoiceId] === null;
  }
}
