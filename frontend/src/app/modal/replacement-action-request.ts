import { Employee } from "./employee";
import { Vehicle } from "./vehicle";

export interface ReplacementActionRequest {

    changedAssignedEmployee: Employee | null | undefined
    permanentVehicle: Vehicle | null | undefined
    action: String | null | undefined

}
  