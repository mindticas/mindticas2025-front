import { Appointment } from "../appointment/Appointment";

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    appoointments: Appointment[];
}