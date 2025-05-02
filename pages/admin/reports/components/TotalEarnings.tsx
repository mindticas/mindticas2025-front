import { Box, Text, useBreakpointValue } from '@chakra-ui/react';
import {
    BarChart,
    ResponsiveContainer,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from 'recharts';
import { useEffect, useState } from 'react';
import { getAppointments } from '@/services/AppointmentService';
import { Appointment } from '@/interfaces/appointment/Appointment';
import { isDateInRange } from '@/utils/dateUtils';
import {
    TotalEarningsProps,
    TreatmentStats,
} from '@/interfaces/statistics/TotalEarnings';
import parseTreatmentPrice from '@/utils/priceUtils';

export default function TotalEarnings({
    statistics,
    dateRange,
    selectedTreatmentId,
    treatments = [],
}: TotalEarningsProps) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredStats, setFilteredStats] = useState<TreatmentStats[]>([]);
    const isMobile = useBreakpointValue({
        base: true,
        sm: true,
        md: true,
        lg: false,
    });
    const startDate = dateRange?.startDate;
    const endDate = dateRange?.endDate;

    const formatTreatmentName = (name: string) => {
        if (!name) return '';
        if (!isMobile) {
            return name;
        }
        // If the name has spaces, use initials
        const words = name.split(' ');
        if (words.length > 1) {
            return words.map((word) => word.charAt(0)).join('');
        }
        return name.length > 6 ? name.substring(0, 5) + '.' : name;
    };

    // Load appointments
    useEffect(() => {
        let isMounted = true;
        const fetchAppointments = async () => {
            try {
                const data = await getAppointments();
                if (isMounted) setAppointments(data);
            } catch (error) {
                console.error('Error al cargar citas:', error);
            }
        };
        fetchAppointments();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (
            !appointments.length ||
            !treatments.length ||
            !startDate ||
            !endDate
        ) {
            setFilteredStats([]);
            return;
        }

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

            // the isDateInRange helper function is used to check only the date
            // without considering the time or time zones.
            const isInRange = isDateInRange(
                appointment.scheduled_start,
                startDate,
                endDate,
            );

            if (!isInRange) return;

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

            // Update statsMap
            uniqueTreatments.forEach((price, id) => {
                // If there is a treatment selected, only count that one
                if (!selectedTreatmentId || id === selectedTreatmentId) {
                    if (statsMap[id]) {
                        statsMap[id].count += 1;
                        statsMap[id].totalEarnings += price;
                    }
                }
            });
        });

        let result = Object.values(statsMap);
        // Filter according to the selected treatment
        result = result.filter((stat) => stat.count > 0);
        setFilteredStats(result);
    }, [appointments, treatments, startDate, endDate, selectedTreatmentId]);

    if (!startDate) {
        return (
            <Box
                mx={isMobile ? '2' : '4'}
                mt={['8', '16']}
                mb={['8', '16']}
                borderRadius='md'
                p={isMobile ? '2' : '4'}
                shadow='sm'
                textAlign='center'
            >
                <Text fontSize='xl' color='gray.500' m={isMobile ? '3' : '4'}>
                    Selecciona un rango de fechas para ver las ganancias por
                    tratamiento
                </Text>
            </Box>
        );
    }
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
                    {startDate || endDate
                        ? 'No hay datos para mostrar en el período seleccionado'
                        : appointments.length === 0
                        ? 'Cargando datos...'
                        : 'No hay datos para mostrar en el período seleccionado'}
                </Text>
            ) : (
                <Box height={isMobile ? '400px' : '500px'} width='100%' px={0}>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart
                            data={filteredStats}
                            layout='horizontal'
                            margin={{
                                top: 20,
                                right: isMobile ? 5 : 10,
                                left: isMobile ? 5 : 10,
                                bottom: isMobile ? 50 : 60,
                            }}
                            barGap={isMobile ? 1 : 4}
                        >
                            <XAxis
                                dataKey='name'
                                height={isMobile ? 50 : 80}
                                tickFormatter={(value) =>
                                    formatTreatmentName(value) || ''
                                }
                                tick={{ fontSize: isMobile ? 10 : 12 }}
                                angle={isMobile ? -35 : 0}
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
                            <Tooltip />
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
