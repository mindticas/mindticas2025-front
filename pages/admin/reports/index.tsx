import TotalEarnings from './components/TotalEarnings';
import KeyMetrics from './components/KeyMetrics';
import DateInputs from './components/DateInputs';
import { StatisticsDataResponse } from '@/interfaces/statistics/StatisticsDataResponse';
import { useState } from 'react';
import { StatisticsData } from '@/interfaces/statistics/StatisticsData';
import { useTreatments } from '@/hooks/useTreatments';

export default function Reports() {
    const { treatments, error: treatmentsError } = useTreatments();
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
    const handleStatisticsFetched = (data: StatisticsDataResponse | null) => {
        setStatistics(data);
    };

    return (
        <>
            <DateInputs
                onStatisticsFetched={handleStatisticsFetched}
                onDateChange={handleDateChange}
                onTreatmentSelect={handleTreatmentSelect}
                onLoadingChange={handleLoadingChange}
                treatments={treatments}
                treatmentsError={treatmentsError}
            />
            <KeyMetrics
                statistics={statistics}
                isLoading={isLoadingStatistics}
            />
            <TotalEarnings
                selectedTreatmentId={selectedTreatment}
                dateRange={dateRange}
                statistics={statistics || undefined}
                treatments={treatments}
            />
        </>
    );
}
