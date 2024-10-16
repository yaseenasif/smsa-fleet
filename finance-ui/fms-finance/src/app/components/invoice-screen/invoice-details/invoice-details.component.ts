import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { VehicleService } from '../../../common-service/vehicle.service';
import { EmailApprovalRequest } from '../../../modal/EmailApprovalRequest';
import { Invoice } from '../../../modal/invoice';
import { ValidatedInvoices } from '../../../modal/ValidatedInvoices';
import { VehicleAssignment } from '../../../modal/VehicleAssignment';
import { InvoiceService } from '../invoice.service';


interface InvoiceType {
  name: string;
}

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss'
})
export class InvoiceDetailsComponent implements OnInit{

  value !: string;
  invoiceType !: InvoiceType[];

  invoiceId!: number;
  invoiceFileId !: number;
  supplierName !: string;
  
  invoice: Invoice[] = [];
  validatedInvoices : ValidatedInvoices[] = [];

  invoiceValidationCheck: boolean = false;
  emailApprovalRequest : EmailApprovalRequest = {
    supplier: undefined,
    invoiceMonth: undefined,
    invoiceType: undefined,
  }
 
  constructor(private messageService: MessageService, private route: ActivatedRoute,private router: Router, 
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
      const hasNonNullInvoice = Object.values(this.validatedInvoices).some(invoice => invoice === null);
      if (!hasNonNullInvoice){
        this.invoiceValidationCheck = true;
      }
    })
  }


  getAssignToEmpName(invoiceId: number, fieldName:string): any {
    const assignment = this.validatedInvoices[invoiceId] as unknown as VehicleAssignment;
    if(fieldName === 'EmpName'){
    return assignment?.assignToEmpName;
    }else if(fieldName === 'EmpNum'){
      return assignment?.assignToEmpId.employeeNumber;
    }else if(fieldName === 'department'){
      return assignment?.assignToEmpId.department;
    }else if(fieldName === 'EmpName'){
      return assignment?.assignToEmpName;
    }
  }
  
  isHighlighted(invoiceId: number): boolean {
    return this.validatedInvoices[invoiceId] === null;
  }

  sendForApproval(){
      this.emailApprovalRequest.supplier = this.invoice[0].supplier.vendorName;
      this.emailApprovalRequest.invoiceMonth = this.invoice[0].invoiceMonth;
      this.emailApprovalRequest.invoiceType = this.invoice[0].invoiceCategory;
      this.invoiceService.sendForApproval(this.emailApprovalRequest).subscribe((res) => {
       this.messageService.add({ severity: 'success', summary: 'Sent', detail: res.message! });
      });
  }

}
