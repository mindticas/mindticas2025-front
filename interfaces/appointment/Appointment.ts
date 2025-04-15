import { Customer } from '../customer/Customer';
import { Treatment } from '../treatment/Treatment';
import { User } from '../user/User';
import { AppointmentCreate } from './AppointmentCreate';


export interface Appointment extends AppointmentCreate {
    id: number;
    duration: number;
    status: string;
    customer: Customer;
    user: User;
    treatments: Treatment[];
    created_at: string;
    updated_at: string;
}
