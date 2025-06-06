export interface AppointmentUpdate {
    customer_name?: string;
    scheduled_start?: string;
    status?: string;
    treatments_id?: number[];
    tipAmount?: number;
    products?: number[];
}

export interface FormDataType {
    name: string;
    treatment: string;
    date: string;
    time: string;
    tipAmount?: number;
    products?: number[];
}
