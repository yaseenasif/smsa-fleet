import { Vendor } from "./vendor"

export interface ProjectVehicle {
  id: Number | null | undefined
  projectName: String | null | undefined
  date: Date | null | undefined | String
  projectVehicleValuesList: ProjectVehicleValues[]
  }
export interface ProjectVehicleValues {
  id: Number | null | undefined
  plateNumber: String | null | undefined
  leaseCost: Number | null | undefined
  rentalLease: String | null | undefined 
  vendor: Vendor
}
