import { VehicleReplacement } from "./vehicleReplacement"

export interface Vehicle {
    id: Number | null | undefined,
    processOrderNumber: Number | null | undefined
    plateNumber: String | null | undefined
    make: String | null | undefined
    year: String | null | undefined
    design: String | null | undefined
    model: String | null | undefined
    type: String | null | undefined
    capacity: String | null | undefined
    power: String | null | undefined
    registrationExpiry: String | null | undefined
    fuelType: String | null | undefined
     vendor:
     {
        id: Number| null | undefined
        vendorName: String| null | undefined
        officeLocation: String | null | undefined
        attachments: String | null | undefined
       
    }
    insuranceExpiry: String | null | undefined
    leaseCost: Number | null | undefined
    replaceLeaseCost: Number | null | undefined
    leaseStartDate: String | null | undefined
    leaseExpiryDate: String | null | undefined
    usageType: String | null | undefined
    category: String | null | undefined
    vehicleReplacement:VehicleReplacement|null|undefined
}