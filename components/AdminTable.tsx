'use client';

import { Table, Box, Spinner } from '@chakra-ui/react';
import { ReactNode } from 'react';

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
}

export function AdminTable<T>({
    data,
    columns,
    isLoading = false,
    emptyMessage = 'No hay datos disponibles',
}: AdminTableProps<T>) {
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
                    {columns.map((column) => (
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
                {data.length === 0 ? (
                    <Table.Row>
                        <Table.Cell
                            p={3}
                            colSpan={columns.length}
                            textAlign='center'
                        >
                            {emptyMessage}
                        </Table.Cell>
                    </Table.Row>
                ) : (
                    data.map((item, index) => (
                        <Table.Row
                            className='tr-table'
                            key={index}
                            borderBottomWidth={1}
                        >
                            {columns.map((column) => (
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
        <Table.ScrollArea borderWidth='1px' borderRadius='lg'>
            {TableContent}
        </Table.ScrollArea>
    );
}
