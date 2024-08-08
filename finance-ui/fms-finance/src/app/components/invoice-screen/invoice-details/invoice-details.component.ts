import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../../common-service/vehicle.service';
import { Invoice } from '../../../modal/invoice';
import { Vehicle } from '../../../modal/vehicle';
import { InvoiceService } from '../invoice.service';

interface InvoiceDetails {
  supplierNumber: number | undefined;
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

  invoiceDetails !: InvoiceDetails[];
  selectedInvoiceDetail !: InvoiceDetails;
  value !: string;

  invoiceRecord !: InvoiceRecord[];
  invoiceId!: number;
  
  invoice: Invoice = {
    id: undefined, 
    businessUnit:  undefined,
    invoiceNumber:  undefined,
    invoiceDate: undefined, 
    invoiceMonth:  undefined, 
    invoiceType:  undefined,
    invoiceCategory:  undefined,
    invoiceFrom:  undefined,
    invoiceTo:  undefined,
    amountBeforeTax: undefined, 
    taxableAmount: undefined,
    taxPercent: undefined,
    VATAmount: undefined,
    amountAfterVAT: undefined,
    lineNumber: undefined, 
    plateNumber:  undefined,
    agreementNumber:  undefined,
    monthlyRate: undefined, 
    supplierControlNumber: undefined, 
    vendorAmount: undefined, 
    dateFrom: undefined, 
    dateTo: undefined, 
    vendorVehicleRefNumber: undefined, 
    lineAmountWithoutTax: undefined,
    lineTaxRate: undefined,
    lineTaxAmount: undefined,
    lineAmountWithTax: undefined,
    uuid:  undefined,
    fileName:  undefined,
    createdAt: undefined, 
    updatedAt: undefined, 
    supplier: {
      id: undefined,
      vendorName: undefined,
      officeLocation: undefined,
      attachments: undefined
    }
  };

  vehicle : Vehicle = {
    id: undefined,
    processOrderNumber: undefined,
    plateNumber: undefined,
    make: undefined,
    year: undefined,
    design: undefined,
    model: undefined,
    type: undefined,
    capacity: undefined,
    power: undefined,
    region: undefined,
    country: undefined,
    location: undefined,
    registrationExpiry: undefined,
    fuelType: undefined,
    vendor: {
      id: undefined,
      vendorName: undefined,
      officeLocation: undefined,
      attachments: undefined
    },
    insuranceExpiry: undefined,
    leaseCost: undefined,
    replaceLeaseCost: undefined,
    leaseStartDate: undefined,
    leaseExpiryDate: undefined,
    usageType: undefined,
    category: undefined,
    vehicleStatus: undefined,
    replacementVehicleStatus: undefined,
    registrationStatus: undefined,
    insuranceStatus: undefined,
    replacementDate: undefined,
    replacementReason: undefined,
    replacementRemarks: undefined,
    replacementVehicle: undefined
  };

  constructor(private route: ActivatedRoute,private invoiceService: InvoiceService, private vehicleService: VehicleService){
  }

  ngOnInit(): void {

    this.invoiceId = +this.route.snapshot.paramMap.get('id')!;
    this.getById();    
  }


  getById(){
    this.invoiceService.getById(this.invoiceId).subscribe((res)=>{
      this.invoice = res
      console.log(this.invoice);
      this.getVehicleBtPlateNumber(res.plateNumber!);
    })
  }

  getVehicleBtPlateNumber(plateNumber: string){
    this.vehicleService.searchVehicleByPlateNumber(plateNumber).subscribe((res)=>{
      this.vehicle = res
      console.log(this.vehicle);
      
    })
  }
}
