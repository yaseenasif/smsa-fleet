import { Vehicle } from "./vehicle";

export interface Invoice {
    id: number | null | undefined; 
    businessUnit: string | null | undefined;
    invoiceNumber: string | null | undefined;
    invoiceDate: Date | null | undefined; 
    invoiceMonth: string | null | undefined; 
    invoiceType: string | null | undefined;
    invoiceCategory: string | null | undefined;
    invoiceFrom: string | null | undefined;
    invoiceTo: string | null | undefined;
    amountBeforeTax: number | null | undefined; 
    taxableAmount: number | null | undefined;
    taxPercent: number | null | undefined;
    vatAmount: number | null | undefined;
    amountAfterVAT: number | null | undefined;
    lineNumber: number | null | undefined; 
    vehicle: {
        id: Number | null | undefined,
        processOrderNumber: Number | null | undefined
        plateNumber: string | null | undefined;
        make: String | null | undefined
        year: String | null | undefined
        design: String | null | undefined
        model: String | null | undefined
        type: String | null | undefined
        capacity: String | null | undefined
        power: String | null | undefined
        region: String | null | undefined
        country: String | null | undefined
        location: String | null | undefined
        registrationExpiry: String | Date | null | undefined
        fuelType: String | null | undefined
         vendor:
         {
            id: Number| null | undefined
            vendorName: String| null | undefined
            officeLocation: String | null | undefined
            attachments: String | null | undefined
      
        }
        insuranceExpiry: String | Date | null | undefined
        leaseCost: Number | null | undefined
        replaceLeaseCost: Number | null | undefined
        leaseStartDate: String | Date | null | undefined
        leaseExpiryDate: String | Date | null | undefined
        usageType: String | null | undefined
        category: String | null | undefined
        vehicleStatus: String | null | undefined
        replacementVehicleStatus: String | null | undefined
        registrationStatus: Boolean | null | undefined
        insuranceStatus: Boolean | null | undefined
        replacementDate: Date | null | undefined
        replacementReason: String | null | undefined
        replacementRemarks: String | null | undefined
        replacementVehicle: Vehicle | null | undefined
    }
    agreementNumber: string | null | undefined;
    monthlyRate: number | null | undefined; 
    supplierControlNumber: number | null | undefined; 
    vendorAmount: number | null | undefined; 
    dateFrom: Date | null | undefined; 
    dateTo: Date | null | undefined; 
    vendorVehicleRefNumber: number | null | undefined; 
    lineAmountWithoutTax: number | null | undefined;
    lineTaxRate: number | null | undefined;
    lineTaxAmount: number | null | undefined;
    lineAmountWithTax: number | null | undefined;
    invoiceFile: {
        id: number | null | undefined
    filename: string | null | undefined
    invoiceType: string | null | undefined
    invoiceMonth: Date | null | undefined
    createdAt: Date | null | undefined
    }
    uuid: string | null | undefined;
    fileName: string | null | undefined;
    createdAt: Date | null | undefined; 
    updatedAt: Date | null | undefined; 
    supplier: {
        id: Number| null | undefined
        vendorName: String| null | undefined
        officeLocation: String | null | undefined
        attachments: String | null | undefined
    }
  }
  