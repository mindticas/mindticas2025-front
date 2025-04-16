import TotalEarnings from './components/TotalEarnings';
import KeyMetrics from './components/KeyMetrics';
import DateInputs from './components/DateInputs';
import { StatisticsDataResponse } from '@/interfaces/statistics/StatisticsDataResponse';
import { useState } from 'react';
import { StatisticsData } from '@/interfaces/statistics/StatisticsData';

export default function Reports() {
    const [selectedTreatment, setSelectedTreatment] = useState<string>('');
    // State save the data coming from DateInputs
    const [statistics, setStatistics] = useState<StatisticsDataResponse | null>(
        null,
    );
    const [dateRange, setDateRange] = useState<{
        startDate: string;
        endDate: string;
    }>({ startDate: '', endDate: '' });
    const [isLoadingStatistics, setIsLoadingStatistics] = useState(false);
    const handleDateChange = (dates: StatisticsData) => {
        setDateRange({
            startDate: dates.startDate,
            endDate: dates.endDate,
        });
    };
    const handleTreatmentSelect = (treatmentId: string) => {
        setSelectedTreatment(treatmentId);
    };
    const handleLoadingChange = (isLoading: boolean) => {
        setIsLoadingStatistics(isLoading);
    };

    return (
        <>
            <DateInputs
                onStatisticsFetched={setStatistics}
                onDateChange={handleDateChange}
                onTreatmentSelect={handleTreatmentSelect}
                onLoadingChange={handleLoadingChange}
            />
            <KeyMetrics
                statistics={statistics}
                isLoading={isLoadingStatistics}
            />
            <TotalEarnings
                selectedTreatmentId={selectedTreatment}
                dateRange={dateRange}
                statistics={statistics || undefined}
            />
        </>
    );
}
