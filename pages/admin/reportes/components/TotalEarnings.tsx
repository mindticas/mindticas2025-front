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
import { StatisticsDataResponse } from '@/interfaces/statistics/StatisticsDataResponse';
import { splitDateTimeFromISO } from '@/utils/dateUtils';

interface TotalEarningsProps {
    statistics?: StatisticsDataResponse;
    dateRange?: {
        startDate: string;
        endDate: string;
    };
    selectedTreatmentId?: string;
}
interface TreatmentStats {
    name: string;
    count: number;
    totalEarnings: number;
}

export default function TotalEarnings({
    statistics,
    dateRange,
    selectedTreatmentId,
}: TotalEarningsProps) {
    const { treatments, error } = useTreatments();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredStats, setFilteredStats] = useState<TreatmentStats[]>([]);

    // Cargar citas una sola vez
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
    }, []);

    // Función auxiliar para parsear precios
    const parseTreatmentPrice = (price: unknown): number => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
            const numericValue = parseFloat(price.replace(/[^0-9.-]/g, ''));
            return isNaN(numericValue) ? 0 : numericValue;
        }
        return 0;
    };

    useEffect(() => {
        if (!appointments.length || !treatments.length) {
            setFilteredStats([]);
            return;
        }

        const { date: startISO } = splitDateTimeFromISO(
            dateRange?.startDate || '',
        );
        const { date: endISO } = splitDateTimeFromISO(dateRange?.endDate || '');

        // 1. Inicializamos mapa para contar TODOS los tratamientos
        const statsMap = treatments.reduce(
            (acc, treatment) => ({
                ...acc,
                [treatment.id.toString()]: {
                    name: treatment.name,
                    count: 0,
                    totalEarnings: 0,
                },
            }),
            {} as Record<string, TreatmentStats>,
        );

        // 2. Procesamos cada cita
        appointments.forEach((appointment) => {
            if (appointment.status !== 'completed') return;

            const { date: appDate } = splitDateTimeFromISO(
                appointment.scheduled_start,
            );

            // Filtro por fechas
            if (dateRange && (appDate < startISO || appDate > endISO)) return;

            // 3. Contamos tratamientos únicos por cita
            const uniqueTreatments = new Map<string, number>();
            appointment.treatments?.forEach((treatment) => {
                const id = treatment.id.toString();
                if (!uniqueTreatments.has(id)) {
                    uniqueTreatments.set(
                        id,
                        parseTreatmentPrice(treatment.price),
                    );
                }
            });

            // 4. Actualizamos statsMap
            uniqueTreatments.forEach((price, id) => {
                // Si hay tratamiento seleccionado, solo contamos ese
                if (!selectedTreatmentId || id === selectedTreatmentId) {
                    statsMap[id].count += 1;
                    statsMap[id].totalEarnings += price;
                }
            });
        });
        // 5. Preparamos resultado final
        let result = Object.values(statsMap);
        // Filtramos según selección
        result = selectedTreatmentId
            ? result.filter(
                  (stat) =>
                      stat.count > 0 &&
                      stat.name ===
                          treatments.find(
                              (t) => t.id.toString() === selectedTreatmentId,
                          )?.name,
              )
            : result.filter((stat) => stat.count > 0);
        // Ordenamos
        result.sort((a, b) => b.count - a.count);
        console.log('Resultado final:', {
            selectedTreatmentId,
            totalCitas: result.reduce((sum, stat) => sum + stat.count, 0),
            stats: result,
        });
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
                    {dateRange?.startDate &&
                        ` (${dateRange.startDate} al ${dateRange.endDate})`}
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
                                    angle={-45}
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
                                            ? `${Math.floor(
                                                  Number(value),
                                              )} veces`
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
