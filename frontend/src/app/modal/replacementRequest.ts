import { Employee } from "./employee";
import { Vehicle } from "./vehicle";

export interface ReplacementRequest {

    replacementVehicle: Vehicle | null | undefined
    changeAssignedEmployee: Employee | null | undefined

}
  