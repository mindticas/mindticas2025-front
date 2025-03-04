import { AppointmentCreate } from "./AppointmentCreate";

export interface Appointment extends AppointmentCreate {
    id: number;         
    created_at: string;  
    updated_at: string;  
  }