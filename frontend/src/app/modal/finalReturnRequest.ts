import { Vehicle } from "./vehicle";
import { VehicleAssignment } from "./vehicle-assignment";

export interface FinalReturnRequest {

    replacementVehicle: Vehicle | null | undefined
    changedAssignment: VehicleAssignment | null | undefined

}
  