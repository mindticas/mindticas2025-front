import { Treatment } from '../treatment/Treatment';
import { StatisticsDataResponse } from './StatisticsDataResponse';

export interface TotalEarningsProps {
    statistics?: StatisticsDataResponse;
    dateRange?: {
        startDate: string;
        endDate: string;
    };
    selectedTreatmentId?: string;
    treatments: Treatment[]
}
export interface TreatmentStats {
    name: string;
    count: number;
    totalEarnings: number;
}
