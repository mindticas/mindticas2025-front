import { Box, Text } from '@chakra-ui/react';
import {
    BarChart,
    ResponsiveContainer,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from 'recharts';
import { useTreatments } from '@/hooks/useTreatments';
import { useEffect, useState } from 'react';
import { getAppointments } from '@/services/AppointmentService';
import { Appointment } from '@/interfaces/appointment/Appointment';
import { splitDateTimeFromISO } from '@/utils/dateUtils';
import {
    TotalEarningsProps,
    TreatmentStats,
} from '@/interfaces/statistics/TotalEarnings';
import parseTreatmentPrice from '@/utils/priceUtils';

export default function TotalEarnings({
    statistics,
    dateRange,
    selectedTreatmentId,
}: TotalEarningsProps) {
    const { treatments } = useTreatments();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredStats, setFilteredStats] = useState<TreatmentStats[]>([]);

    // Load appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointments();
                setAppointments(data);
            } catch (error) {
                console.error('Error al cargar citas:', error);
            }
        };
        fetchAppointments();
    }, [statistics]);

    useEffect(() => {
        if (!appointments.length || !treatments.length) {
            setFilteredStats([]);
            return;
        }
        // Selected date range
        const { date: startISO } = splitDateTimeFromISO(
            dateRange?.startDate || '',
        );
        const { date: endISO } = splitDateTimeFromISO(dateRange?.endDate || '');

        // Initialize map to count all treatments
        const statsMap = treatments.reduce(
            (acc, treatment) => ({
                ...acc,
                [treatment.name.toString()]: {
                    name: treatment.name,
                    count: 0,
                    totalEarnings: 0,
                },
            }),
            {} as Record<string, TreatmentStats>,
        );

        // Process appointments
        appointments.forEach((appointment) => {
            if (appointment.status !== 'completed') return;

            const { date: appDate } = splitDateTimeFromISO(
                appointment.scheduled_start,
            );

            // Filtered by dates
            if (dateRange && (appDate < startISO || appDate > endISO)) return;

            // Unique treatments are counted per appointment
            const uniqueTreatments = new Map<string, number>();
            appointment.treatments?.forEach((treatment) => {
                const id = treatment.name.toString();
                if (!uniqueTreatments.has(id)) {
                    uniqueTreatments.set(
                        id,
                        parseTreatmentPrice(treatment.price),
                    );
                }
            });

            // 4. Update statsMap
            uniqueTreatments.forEach((price, id) => {
                // If there is a treatment selected, only count that one
                if (!selectedTreatmentId || id === selectedTreatmentId) {
                    statsMap[id].count += 1;
                    statsMap[id].totalEarnings += price;
                }
            });
        });

        let result = Object.values(statsMap);
        // Filter according to the selected treatment
        result = result.filter((stat) => stat.count > 0);
        setFilteredStats(result);
    }, [appointments, treatments, dateRange, selectedTreatmentId]);

    if (!dateRange?.startDate) {
        return (
            <Box
                mx={['4', '8', '12', '16']}
                mt={['8', '16']}
                mb={['8', '16']}
                borderRadius='md'
                p='4'
                shadow='sm'
                textAlign='center'
            >
                <Text fontSize='xl' color='gray.500'>
                    Selecciona un rango de fechas para ver las ganancias por
                    tratamiento
                </Text>
            </Box>
        );
    }
    {
        filteredStats.length > 0;
        return (
            <Box
                mx={['4', '8', '12', '16']}
                mt={['8', '16']}
                mb={['8', '16']}
                borderRadius='md'
                p='4'
                shadow='sm'
            >
                <Text textAlign='center' fontSize='2xl' m='6' fontWeight='bold'>
                    Ganancias por tratamiento
                </Text>

                {filteredStats.length === 0 ? (
                    <Text textAlign='center' color='gray.500' py={10}>
                        {appointments.length === 0
                            ? 'Cargando datos...'
                            : 'No hay datos para mostrar en el período seleccionado'}
                    </Text>
                ) : (
                    <Box height='500px'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart
                                data={filteredStats}
                                layout='horizontal'
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 40,
                                    bottom: 80,
                                }}
                            >
                                <XAxis
                                    dataKey='name'
                                    textAnchor='end'
                                    height={80}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    yAxisId='left'
                                    allowDecimals={false}
                                    tickFormatter={(value) =>
                                        Math.floor(value).toString()
                                    }
                                />
                                <YAxis
                                    yAxisId='right'
                                    orientation='right'
                                    tickFormatter={(value) =>
                                        `$${Math.floor(value).toLocaleString()}`
                                    }
                                />
                                <Tooltip
                                    formatter={(value, name) => [
                                        name === 'Realizaciones'
                                            ? `${Math.floor(Number(value))}`
                                            : `$${Math.floor(
                                                  Number(value),
                                              ).toLocaleString()}`,
                                        name,
                                    ]}
                                    contentStyle={{
                                        borderRadius: '8px',
                                        boxShadow:
                                            '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    }}
                                />
                                <Legend />
                                <Bar
                                    yAxisId='left'
                                    dataKey='count'
                                    name='Realizaciones'
                                    fill='#3182CE'
                                    radius={[4, 4, 0, 0]}
                                    animationDuration={1000}
                                />
                                <Bar
                                    yAxisId='right'
                                    dataKey='totalEarnings'
                                    name='Ganancias (MXN)'
                                    fill='#38A169'
                                    radius={[4, 4, 0, 0]}
                                    animationDuration={1000}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </Box>
        );
    }
}
