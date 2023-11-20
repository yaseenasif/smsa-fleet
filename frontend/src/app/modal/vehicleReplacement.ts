import { Vehicle } from "./vehicle";

export interface VehicleReplacement{
     id:number|null|undefined;
     reason:string|null|undefined;
     vehicle:Vehicle|null|undefined;
}