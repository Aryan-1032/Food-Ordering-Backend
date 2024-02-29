import { CustomerPayload } from "./Customer.dto";
import { ValidatePayload } from "./Vandor.dto";


export type AuthPayload = ValidatePayload | CustomerPayload;