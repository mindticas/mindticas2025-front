import { StatisticsData } from '@/interfaces/statistics/StatisticsData';
import { StatisticsDataResponse } from '@/interfaces/statistics/StatisticsDataResponse';
import { Treatment } from '@/interfaces/treatment/Treatment';
import {
    getStatistics,
    exportStatisticsToExcel,
} from '@/services/StatisticsService';
import {
    Text,
    Box,
    Flex,
    Input,
    SelectRoot,
    SelectTrigger,
    SelectHiddenSelect,
    SelectControl,
    SelectIndicator,
    SelectIndicatorGroup,
    Portal,
    SelectPositioner,
    SelectValueText,
    SelectItemIndicator,
    useBreakpointValue,
} from '@chakra-ui/react';
import { createListCollection } from '@chakra-ui/react';
import { SelectLabel, SelectContent, SelectItem } from '@chakra-ui/react';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DateInputsProps {
    onDateChange: (dates: StatisticsData) => void;
    onStatisticsFetched: (data: StatisticsDataResponse | null) => void;
    onTreatmentSelect: (treatmentId: string) => void;
    onLoadingChange: (isLoading: boolean) => void;
    treatments: Treatment[];
    treatmentsError: string | null;
}

export default function DateInputs({
    onStatisticsFetched,
    onDateChange,
    onTreatmentSelect,
    onLoadingChange,
    treatments,
    treatmentsError,
}: DateInputsProps) {
    const [formData, setFormData] = useState<StatisticsData>({
        startDate: '',
        endDate: '',
        treatment: '',
    });
    const [selectTreatment, setSelectTreatment] = useState('');
    const [statisticsLoading, setStatisticsLoading] = useState(false);
    const [statisticsError, setStatisticsError] = useState<string | null>(null);
    const isMobile = useBreakpointValue({
        base: true,
        sm: true,
        md: false,
        lg: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (value: string) => {
        setSelectTreatment(value.toString());
        setFormData((prev) => ({
            ...prev,
            treatment: value.toString(),
        }));
        onTreatmentSelect(value);
    };

    useEffect(() => {
        if (!formData.startDate || !formData.endDate) {
            onDateChange({ startDate: '', endDate: '' });
            onStatisticsFetched(null);
            return;
        }
        onDateChange({
            startDate: formData.startDate,
            endDate: formData.endDate,
        });
        fetchStatistics();
    }, [formData]);

    useEffect(() => {
        if (!formData.startDate || !formData.endDate) {
        }
    });

    useEffect(() => {
        onLoadingChange(statisticsLoading);
    }, [statisticsLoading, onLoadingChange]);

    const fetchStatistics = async () => {
        // Verify that the dates have been selected
        if (!formData.startDate || !formData.endDate) {
            setStatisticsError('Selecciona fechas de inicio y fin');
            return;
        }
        setStatisticsLoading(true);
        setStatisticsError(null);
        try {
            const data = await getStatistics(formData);
            // Send data to index
            onStatisticsFetched(data);
        } catch (error) {
            setStatisticsError('Error al cargar las estadisticas');
        } finally {
            setStatisticsLoading(false);
        }
    };

    const handleClearTreatment = () => {
        setSelectTreatment('');
        setFormData((prev) => ({ ...prev, treatment: '' }));
        onTreatmentSelect('');
    };

    const handleDownloadExcel = async () => {
        if (!formData.startDate || !formData.endDate) {
            setStatisticsError('Selecciona fechas de inicio y fin');
            return;
        }
        if (formData.treatment) {
            setStatisticsError(
                'La exportación solo está disponible con fechas. Intente nuevamente sin seleccionar un servicio',
            );
            return;
        }
        try {
            setStatisticsLoading(true);
            await exportStatisticsToExcel(formData);
        } catch (error) {
            setStatisticsError('Error al descargar el archivo');
        } finally {
            setStatisticsLoading(false);
        }
    };

    return (
        <Box px={{ base: 4, sm: 6, md: 8, lg: 10 }} py={6}>
            <Flex
                mt='10'
                gap={{ base: '4', md: '0' }}
                justifyContent='space-between'
                direction={{ base: 'column', md: 'row' }}
                align={{ base: 'flex-start', md: 'center' }}
            >
                <Text fontSize='3xl' fontWeight='bold'>
                    Reportes
                </Text>

                <Flex
                    gap={['2', '4']}
                    direction={['column', 'column', 'row', 'row']}
                    width={['full', 'full', 'auto', 'auto']}
                >
                    <Box>
                        <Text fontSize='md' fontWeight='semibold'>
                            Fecha inicial
                        </Text>
                        <Input
                            p={2}
                            type='date'
                            name='startDate'
                            size='lg'
                            _dark={{
                                '&::-webkit-calendar-picker-indicator': {
                                    filter: 'invert(1)',
                                },
                            }}
                            value={formData.startDate}
                            onChange={handleInputChange}
                        />
                    </Box>
                    <Box>
                        <Text fontSize='md' fontWeight='semibold'>
                            Fecha final
                        </Text>
                        <Input
                            p={2}
                            size='lg'
                            type='date'
                            name='endDate'
                            _dark={{
                                '&::-webkit-calendar-picker-indicator': {
                                    filter: 'invert(1)',
                                },
                            }}
                            value={formData.endDate}
                            onChange={handleInputChange}
                        />
                    </Box>
                    <Box>
                        <SelectRoot
                            collection={createListCollection({
                                items: Array.isArray(treatments)
                                    ? treatments
                                    : [],
                            })}
                            size='md'
                            onValueChange={(e) => {
                                handleSelectChange(e.value.toString());
                            }}
                            name='treatment'
                            value={[selectTreatment]}
                        >
                            <SelectHiddenSelect />
                            <SelectLabel>
                                <Text fontWeight='semibold' fontSize='md'>
                                    Selecciona un servicio
                                </Text>
                            </SelectLabel>
                            <SelectControl bg='white'>
                                <SelectTrigger>
                                    {selectTreatment || 'Seleccionar servicio'}
                                    <SelectValueText />
                                </SelectTrigger>
                                <SelectIndicatorGroup>
                                    <SelectIndicator />
                                </SelectIndicatorGroup>
                            </SelectControl>
                            <Portal>
                                <SelectPositioner>
                                    <Box>
                                        <SelectContent
                                            className='select-content-service'
                                            bg='white'
                                            boxShadow='sm'
                                        >
                                            <SelectItem
                                                key='none'
                                                item=''
                                                onClick={() =>
                                                    handleClearTreatment()
                                                }
                                                borderBlockEnd='1px solid'
                                                borderBlockEndColor='gray.200'
                                            >
                                                Sin servicio
                                            </SelectItem>
                                            {treatments &&
                                                treatments.map(
                                                    ({ id, name }) => (
                                                        <SelectItem
                                                            cursor='pointer'
                                                            borderBlockEnd='1px solid'
                                                            borderBlockEndColor='gray.200'
                                                            key={id}
                                                            item={name}
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                        >
                                                            {name}
                                                            <SelectItemIndicator />
                                                        </SelectItem>
                                                    ),
                                                )}
                                        </SelectContent>
                                    </Box>
                                </SelectPositioner>
                            </Portal>
                        </SelectRoot>
                    </Box>
                    {isMobile ? (
                        <Flex
                            gap={2}
                            mt={2}
                            border='1px solid'
                            p='2'
                            borderRadius='sm'
                            justifyContent='space-between'
                            cursor='pointer'
                            fontSize='md'
                            onClick={handleDownloadExcel}
                        >
                            <Text>Descargar excel</Text>
                            <Download />
                        </Flex>
                    ) : (
                        <Box position='relative' p={2} mt='6'>
                            <Download
                                cursor='pointer'
                                onClick={handleDownloadExcel}
                            />
                        </Box>
                    )}
                </Flex>
            </Flex>
            <Box textAlign='center' mx={['4', '8', '12', '14']} mt='6'>
                {treatmentsError && (
                    <Text color='red.500'>{treatmentsError}</Text>
                )}
                {statisticsError && (
                    <Text color='red.500' mt={treatmentsError ? 2 : 0}>
                        {statisticsError}
                    </Text>
                )}
            </Box>
        </Box>
    );
}
