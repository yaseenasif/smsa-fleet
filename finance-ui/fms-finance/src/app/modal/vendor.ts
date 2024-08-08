export interface Vendor {
    id:number|null|undefined,
    vendorName:string|null|undefined,
    officeLocation:string|null|undefined,
    contactPersonList: Array<
          {
          id:number|null|undefined,
          name:string|null|undefined,
          email:string|null|undefined,
          phoneNumber:string|null|undefined
          }>
       
    
    attachments:string|null|undefined,
}