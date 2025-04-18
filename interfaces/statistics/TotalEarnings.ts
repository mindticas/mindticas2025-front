import { StatisticsDataResponse } from './StatisticsDataResponse';

export interface TotalEarningsProps {
    statistics?: StatisticsDataResponse;
    dateRange?: {
        startDate: string;
        endDate: string;
    };
    selectedTreatmentId?: string;
}
export interface TreatmentStats {
    name: string;
    count: number;
    totalEarnings: number;
}
