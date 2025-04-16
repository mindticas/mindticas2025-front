import { Appointment } from "../appointment/Appointment";

export interface Customer {
    id: number;
    name: string;
    phone: string;
    appointments: Appointment[];
}
