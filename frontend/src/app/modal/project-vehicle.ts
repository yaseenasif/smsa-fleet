import { Vendor } from "./vendor"

export interface ProjectVehicle {
  id: Number | null | undefined
  projectName: String | null | undefined
  date: Date | null | undefined | String
  monthList?: (string | null | undefined)[]
  projectVehicleValuesList: ProjectVehicleValues[]
  monthWiseList?: { month: string; values: ProjectVehicleValues[] }[];
}
export interface ProjectVehicleValues {
  id: Number | null | undefined;
  dateForMonth?: Date | null | undefined;
  month: string | null | undefined;
  plateNumber: String | null | undefined;
  leaseCost: number | null | undefined;
  type: String | null | undefined;
  vehicleType: string | null | undefined;
  referenceNo: number | null | undefined;
  origin: String | null | undefined;
  destination: String | null | undefined;
  rentalDate: Date | null | undefined;
  rentalDateTo: Date | null | undefined;
  startLease: Date | null | undefined;
  expiryLease: Date | null | undefined;
  vendor: Vendor;
  duration: number | null | undefined;
}
