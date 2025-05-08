'use client';

import { Table, Box, Spinner } from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';
import Pagination from './Pagination';
import adminTableMessages from '@/constants/Admin/adminMessages';

interface ColumnDef<T> {
    key: string;
    header: string;
    render: (item: T) => ReactNode;
    align?: 'left' | 'center' | 'right';
    width?: string | number;
}

interface AdminTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    isLoading?: boolean;
    emptyMessage?: string;
    scrollable?: boolean;
    itemsPerPage?: number;
}

/**
 * A generic table component for displaying data in an admin interface.
 *
 * @template T - The type of the data items to be displayed in the table.
 *
 * @param {Object} props - The properties for the AdminTable component.
 * @param {T[]} props.data - The array of data items to be displayed in the table.
 * @param {Array<{ key: string; header: string; align?: 'left' | 'center' | 'right'; width?: string; render: (item: T) => React.ReactNode }>} props.columns -
 * An array of column definitions, where each column specifies a key, header text, optional alignment, optional width, and a render function for the cell content.
 * @param {boolean} [props.isLoading=false] - A flag indicating whether the table is in a loading state. If true, a loading spinner is displayed.
 * @param {string} [props.emptyMessage='No hay datos disponibles'] - The message to display when there is no data available.
 *
 * @returns {JSX.Element} The rendered table component, including a loading spinner, table content, or an empty message as appropriate.
 */
export default function AdminTable<T>({
    data = [],
    columns,
    isLoading = false,
    emptyMessage = adminTableMessages.emptyData.es,
    itemsPerPage = 10,
}: AdminTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = data?.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedData = data.slice(startIndex, endIndex);

    // Reset the current page to 1 when the data changes
    useEffect(() => {
        if (currentPage !== 1) setCurrentPage(1);
    }, [data?.length]);

    // Adjust the current page if it exceeds the total number of pages
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [totalPages]);

    if (isLoading) {
        return (
            <Box
                display='flex'
                alignItems='center'
                justifyContent='center'
                height='300px'
            >
                <Spinner size='xl' />
            </Box>
        );
    }

    const TableContent = (
        <Table.Root size='sm' variant='outline' showColumnBorder>
            <Table.Header>
                <Table.Row bg='#F3F4F6'>
                    {columns &&
                        columns.map((column) => (
                            <Table.ColumnHeader
                                key={column.key}
                                textAlign={column.align || 'center'}
                                width={column.width}
                                py={2}
                                fontWeight='bold'
                            >
                                {column.header}
                            </Table.ColumnHeader>
                        ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {paginatedData && paginatedData?.length === 0 ? (
                    <Table.Row>
                        <Table.Cell
                            p={3}
                            colSpan={columns?.length}
                            textAlign='center'
                        >
                            {emptyMessage}
                        </Table.Cell>
                    </Table.Row>
                ) : (
                    paginatedData &&
                    paginatedData.map((item, index) => (
                        <Table.Row
                            className='tr-table'
                            key={index}
                            borderBottomWidth={1}
                        >
                            {columns &&
                                columns.map((column) => (
                                    <Table.Cell
                                        key={`${column.key}-${index}`}
                                        textAlign={column.align || 'center'}
                                        px={2}
                                        width='fit-content'
                                    >
                                        {column.render(item)}
                                    </Table.Cell>
                                ))}
                        </Table.Row>
                    ))
                )}
            </Table.Body>
        </Table.Root>
    );

    return (
        <Box>
            <Table.ScrollArea borderWidth='1px' borderRadius='lg'>
                {TableContent}
            </Table.ScrollArea>
            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />
        </Box>
    );
}
