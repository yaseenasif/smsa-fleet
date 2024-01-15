import { Vendor } from "./vendor"

export interface ProjectVehicle {
  id: Number | null | undefined
  projectName: String | null | undefined
  plateNumber: String | null | undefined
  vendor: Vendor;
}
