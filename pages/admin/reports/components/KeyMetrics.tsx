import { Flex } from '@chakra-ui/react';
import StatsCard from './StatsCard';
import {
    CheckCircle,
    DollarSign,
    XCircle,
    Scissors,
    HandCoins,
    Store,
} from 'lucide-react';
import { StatisticsDataResponse } from '@/interfaces/statistics/StatisticsDataResponse';
interface KeyMetricsProps {
    statistics: StatisticsDataResponse | null;
    isLoading?: boolean;
}

export default function KeyMetrics({
    statistics,
    isLoading = false,
}: KeyMetricsProps) {
    const statsItems = [
        {
            title: 'Ganancias en servicios',
            value: statistics?.totalEarnings ?? 0,
            icon: DollarSign,
            color: 'green.500',
        },
        {
            title: 'Servicios',
            value: statistics?.totalServices ?? 0,
            icon: Scissors,
            color: 'blue.500',
        },
        {
            title: 'Citas completadas',
            value: statistics?.totalCompletedAppointments ?? 0,
            icon: CheckCircle,
            color: 'green.500',
        },
        {
            title: 'Citas canceladas',
            value: statistics?.totalCanceledAppointments ?? 0,
            icon: XCircle,
            color: 'red.500',
        },
        {
            title: 'Ventas de productos',
            value: statistics?.totalSalesAmount ?? 0,
            icon: Store,
            color: 'green.500',
        },
        {
            title: 'Propinas',
            value: statistics?.totalTips ?? 0,
            icon: HandCoins,
            color: 'yellow.500',
        },
    ];

    return (
        <>
            <Flex
                gap={['4', '6', '10']}
                mx={['4', '6', '8', '12']}
                p='4'
                mt={['6', '14']}
                direction={['column', 'column', 'column', 'row']}
            >
                {statsItems.map((item, index) => (
                    <StatsCard
                        key={index}
                        title={item.title}
                        value={item.value}
                        icon={item.icon}
                        color={item.color}
                        isLoading={isLoading}
                    />
                ))}
            </Flex>
        </>
    );
}
