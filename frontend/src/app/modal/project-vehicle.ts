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
  leaseCost: number | null | undefined
  type: String | null | undefined
  origin: String | null | undefined
  destination: String | null | undefined
  rentalDate: Date | null | undefined|string
  startLease:  Date | null | undefined
  expiryLease: Date | null | undefined
  vendor: Vendor
  duration : number | null | undefined
}
