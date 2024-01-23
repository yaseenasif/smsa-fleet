import { VehicleAssignment } from "./vehicle-assignment";
import { VehicleReplacement } from "./vehicleReplacement";

export interface ReplacementRequest {

    replacement: VehicleReplacement | null | undefined
    assignment: VehicleAssignment | null | undefined

}
  