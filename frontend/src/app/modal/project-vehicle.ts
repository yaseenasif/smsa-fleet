import { Vendor } from "./vendor"

export interface ProjectVehicle {
  id: Number | null | undefined
  projectName: String | null | undefined
  startDate: Date | null | undefined
  projectVehicleValues: ProjectVehicleValues[]
  }
export interface ProjectVehicleValues {
  id: Number | null | undefined
  plateNumber: String | null | undefined
  cost: Number | null | undefined
  rentalLease: String | null | undefined 
  vendor: Vendor
}
