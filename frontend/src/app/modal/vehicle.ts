
export interface Vehicle {
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
    fuelType: String | null | undefined
    costCenter: String | null | undefined
     vendor:
     {
        id: Number| null | undefined
        vendorName: String| null | undefined
        officeLocation: String | null | undefined
        attachments: String | null | undefined

    }
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
