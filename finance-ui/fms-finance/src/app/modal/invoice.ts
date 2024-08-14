
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
    VATAmount: number | null | undefined;
    amountAfterVAT: number | null | undefined;
    lineNumber: number | null | undefined; 
    plateNumber: string | null | undefined;
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
  