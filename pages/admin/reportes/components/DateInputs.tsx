import { useTreatments } from '@/hooks/useTreatments';
import { StatisticsData } from '@/interfaces/statistics/StatisticsData';
import { StatisticsDataResponse } from '@/interfaces/statistics/StatisticsDataResponse';
import { getStatistics } from '@/services/StatisticsService';
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
} from '@chakra-ui/react';

import { createListCollection } from '@chakra-ui/react';
import { SelectLabel, SelectContent, SelectItem } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface DateInputsProps {
    onDateChange: (dates: StatisticsData) => void;
    onStatisticsFetched: (data: StatisticsDataResponse) => void;
    onTreatmentSelect: (treatmentId: string) => void;
}

export default function DateInputs({
    onStatisticsFetched,
    onDateChange,
    onTreatmentSelect,
}: DateInputsProps) {
    const { treatments, error } = useTreatments();
    const [formData, setFormData] = useState<StatisticsData>({
        startDate: '',
        endDate: '',
        treatment: '',
    });

    // Colocar un estado para mostrar el nombre del servicio seleccionado
    const [selectTreatment, setSelectTreatment] = useState('');
    const [statistics, setStatistics] = useState<StatisticsDataResponse | null>(
        null,
    );
    const [statisticsLoading, setStatisticsLoading] = useState(false);
    const [statisticsError, setStatisticsError] = useState<string | null>(null);

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

    // when dates or treatment change, launch the request
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            onDateChange?.({
                startDate: formData.startDate,
                endDate: formData.endDate,
            });
            fetchStatistics();
        }
    }, [formData]);

    const fetchStatistics = async () => {
        // Verificar que se hayan seleccionado las fechas
        if (!formData.startDate || !formData.endDate) {
            setStatisticsError('Selecciona fechas de inicio y fin');
            return;
        }
        setStatisticsLoading(true);
        setStatisticsError(null);
        try {
            const data = await getStatistics(formData);
            // send data to index
            onStatisticsFetched(data);
        } catch (error) {
            setStatisticsError('Error al cargar las estadisticas');
        } finally {
            setStatisticsLoading(false);
        }
    };

    return (
        <>
            <Flex
                mx={['4', '8', '12', '14']}
                p='4'
                mt='10'
                gap={['4', '6', '0', '0']}
                justifyContent='space-between'
                direction={['column', 'colum', 'row', 'row']}
                alignItems='center'
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
                            onChange={handleInputChange}
                        />
                    </Box>
                    <Box>
                        <SelectRoot
                            collection={createListCollection({
                                items: treatments,
                            })}
                            size='md'
                            onValueChange={(e) =>
                                handleSelectChange(e.value.toString())
                            }
                            name='treatment'
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
                                            {treatments.map(({ id, name }) => (
                                                <SelectItem
                                                    cursor='pointer'
                                                    borderBlockEnd='1px solid'
                                                    borderBlockEndColor='gray.200'
                                                    key={id}
                                                    item={name}
                                                    onChange={handleInputChange}
                                                >
                                                    {name}
                                                    <SelectItemIndicator />
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Box>
                                </SelectPositioner>
                            </Portal>
                        </SelectRoot>
                    </Box>
                </Flex>
            </Flex>
            <Box textAlign='center' mx={['4', '8', '12', '14']} mt='6'>
                {error && <Text color='red.500'>{error}</Text>}
            </Box>
        </>
    );
}
