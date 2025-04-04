'use client';

import { Grid, Input } from '@chakra-ui/react';
import { SelectRoot, createListCollection } from '@chakra-ui/react';
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import { CalendarCheck, CircleCheckBig, CircleX, Clock } from 'lucide-react';

export interface AppointmentsFilters {
    name: string;
    treatments?: string;
    date?: string;
    status?: string;
}

interface SearchFiltersProps {
    filters: AppointmentsFilters;
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onStatusChange?: (status: string) => void;
    showStatusFilter?: boolean;
    showDateFilter?: boolean;
    showTreatmentFilter?: boolean;
}

export const statusOptions = [
    {
        value: 'confirmed',
        label: 'Confirmado',
        color: 'blue',
        icon: <CalendarCheck size={16} />,
    },
    {
        value: 'pending',
        label: 'Pendiente',
        color: 'yellow',
        icon: <Clock size={16} strokeWidth={3} />,
    },
    {
        value: 'canceled',
        label: 'Cancelado',
        color: 'red',
        icon: <CircleX size={16} strokeWidth={3} />,
    },
    {
        value: 'completed',
        label: 'Completado',
        color: 'green',
        icon: <CircleCheckBig size={16} strokeWidth={3} />,
    },
    { value: '', label: 'Todos los estatus', color: 'gray' },
];
/**
 * A functional component that renders a set of search filters for filtering data.
 * The component supports filters for name, treatments, date, and status, with
 * optional visibility for each filter type.
 *
 * @param {SearchFiltersProps} props - The props for the `SearchFilters` component.
 * @param {Object} props.filters - The current filter values.
 * @param {string} props.filters.name - The filter value for the name input.
 * @param {string} [props.filters.treatments] - The filter value for the treatments input.
 * @param {string} [props.filters.date] - The filter value for the date input.
 * @param {string} [props.filters.status] - The filter value for the status dropdown.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onFilterChange - Callback function triggered when a filter input value changes.
 * @param {(value: string) => void} [props.onStatusChange] - Callback function triggered when the status filter value changes.
 * @param {boolean} [props.showStatusFilter=false] - Whether to show the status filter dropdown.
 * @param {boolean} [props.showDateFilter=false] - Whether to show the date filter input.
 * @param {boolean} [props.showTreatmentFilter=false] - Whether to show the treatments filter input.
 *
 * @returns {JSX.Element} The rendered search filters component.
 */
export function SearchFilters({
    filters,
    onFilterChange,
    onStatusChange,
    showStatusFilter = false,
    showDateFilter = false,
    showTreatmentFilter = false,
}: SearchFiltersProps) {
    return (
        <Grid
            templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
            gap={4}
            mb={4}
        >
            <Input
                p={2}
                name='name'
                placeholder='Filtrar por nombre'
                fontSize='md'
                value={filters.name}
                onChange={onFilterChange}
            />

            {showTreatmentFilter && (
                <Input
                    p={2}
                    fontSize='md'
                    name='treatments'
                    placeholder='Filtrar por servicio'
                    value={filters.treatments || ''}
                    onChange={onFilterChange}
                />
            )}

            {showDateFilter && (
                <Input
                    p={2}
                    type='date'
                    _dark={{
                        '&::-webkit-calendar-picker-indicator': {
                            filter: 'invert(1)',
                        },
                    }}
                    name='date'
                    fontSize='md'
                    placeholder='Filtrar por fecha'
                    value={filters.date || ''}
                    onChange={onFilterChange}
                />
            )}

            {showStatusFilter && onStatusChange && (
                <SelectRoot
                    name='status'
                    collection={createListCollection({
                        items: statusOptions,
                    })}
                    onValueChange={(e) => onStatusChange(e.value.toString())}
                >
                    <SelectTrigger>
                        {filters.status
                            ? statusOptions.find(
                                  (opt) => opt.value === filters.status,
                              )?.label
                            : 'Filtrar por estado'}
                    </SelectTrigger>
                    <SelectContent backgroundColor='white'>
                        {statusOptions.map(({ value, label }) => (
                            <SelectItem
                                cursor='pointer'
                                _hover={{ backgroundColor: 'gray.100' }}
                                backgroundColor='white'
                                item={value}
                                key={value}
                                p={2}
                            >
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </SelectRoot>
            )}
        </Grid>
    );
}
