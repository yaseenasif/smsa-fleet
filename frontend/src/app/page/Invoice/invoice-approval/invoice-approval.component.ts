import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Invoice } from 'src/app/modal/Invoice';
import { InvoiceActionPayload } from 'src/app/modal/InvoiceActionPayload';
import { ValidatedInvoices } from 'src/app/modal/ValidatedInvoices';
import { VehicleAssignment } from 'src/app/modal/vehicle-assignment';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoice-approval',
  templateUrl: './invoice-approval.component.html',
  styleUrls: ['./invoice-approval.component.scss']
})
export class InvoiceApprovalComponent {

  invoiceFileId!: number;
  supplierName!: string;

  invoices: Invoice[] = [];

  validatedInvoices: ValidatedInvoices[] = [];
  dialogVisible: boolean = false;
  remarks !: string;
  status!: string;
  invoiceActionPayload: InvoiceActionPayload = {
    status: undefined,
    supplierName: undefined,
    invoiceMonth: undefined,
    invoiceType: undefined,
    remarks: undefined
  }

  constructor(private invoiceService: InvoiceService, private route: ActivatedRoute,private messageService: MessageService,
    private router: Router){}

  ngOnInit(){

    this.invoiceFileId = +this.route.snapshot.paramMap.get('id')!;
    this.supplierName = this.route.snapshot.paramMap.get('supplierName')!;
    this.getInvoicesBySupplierAndFileId();

  }

  getInvoicesBySupplierAndFileId(){
    this.invoiceService.getInvoicesBySupplierAndFileId(this.invoiceFileId,this.supplierName).subscribe((res)=>{
      this.invoices = res
      this.validateInvoices() 
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
    }
  }
  
  validateInvoices(){
    this.invoiceService.getValidatedInvoices(this.invoices).subscribe((res:ValidatedInvoices[])=>{
      this.validatedInvoices = res
    })
  }

  showDialog(status: string) {
    this.status = status
    this.dialogVisible = true;
  }
  
  closeDialog() {
    this.dialogVisible = false;
  }

  onSubmit(){
    this.invoiceActionPayload.status = this.status
    this.invoiceActionPayload.supplierName = this.invoices[0].supplier.vendorName
    this.invoiceActionPayload.invoiceType = this.invoices[0].invoiceCategory
    this.invoiceActionPayload.invoiceMonth = this.invoices[0].invoiceMonth
    this.invoiceActionPayload.remarks = this.remarks

    this.invoiceService.actionOnInvoice(this.invoiceActionPayload).subscribe((res)=>{
      this.messageService.add({
        severity: 'success',
        summary: 'Added Successfully',
        detail: res.message!
      });
      this.router.navigate(['/invoice-supplier'])
    })
  }
}
