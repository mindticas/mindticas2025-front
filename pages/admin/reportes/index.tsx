import TotalEarnings from './components/TotalEarnings';
import KeyMetrics from './components/KeyMetrics';
import NumberServices from './components/NumberServices';
import DateInputs from './components/DateInputs';
import { StatisticsDataResponse } from '@/interfaces/statistics/StatisticsDataResponse';
import { useState } from 'react';

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

    return (
        <>
            <DateInputs
                onStatisticsFetched={setStatistics}
                onDateChange={(dates) =>
                    setDateRange({
                        startDate: dates.startDate, // Adjust property names as needed
                        endDate: dates.endDate, // Adjust property names as needed
                    })
                }
                onTreatmentSelect={(id) => {
                    setSelectedTreatment(id);
                }}
            />
            <KeyMetrics statistics={statistics} />
            <TotalEarnings
                selectedTreatmentId={selectedTreatment}
                dateRange={dateRange}
                statistics={statistics || undefined}
            />
            {/* <NumberServices /> */}
        </>
    );
}
