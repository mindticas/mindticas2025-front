'use client';

import { Flex, Text, Button } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    maxVisibleButtons?: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    maxVisibleButtons = 5,
}: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const handlePrevious = () => onPageChange(Math.max(1, currentPage - 1));
    const handleNext = () =>
        onPageChange(Math.min(totalPages, currentPage + 1));

    if (totalItems <= itemsPerPage) return null;

    // Render page numbers dynamically, ensuring a maximum number of visible buttons
    // and handling edge cases for the first and last pages.
    // This function generates the page number buttons based on the current page and total pages.
    const renderPageNumbers = () => {
        const pages = [];
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisibleButtons - 1);

        if (end - start < maxVisibleButtons - 1) {
            start = Math.max(1, end - maxVisibleButtons + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <Button
                    key={i}
                    size='sm'
                    variant={currentPage === i ? 'subtle' : 'outline'}
                    onClick={() => onPageChange(i)}
                    minW='8'
                >
                    {i}
                </Button>,
            );
        }

        return pages;
    };

    return (
        <Flex justifyContent='space-between' alignItems='center' mt={4} px={4}>
            <Text fontSize='sm' color='gray.600'>
                Página
                <Text m={1} as='span' fontWeight='bold'>
                    {currentPage}
                </Text>
                de
                <Text m={1} as='span' fontWeight='bold'>
                    {totalPages}
                </Text>
            </Text>

            <Flex gap={2} alignItems='center'>
                <Button
                    size='sm'
                    variant='outline'
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                >
                    <ChevronLeftIcon />
                </Button>

                <Flex gap={1}>{renderPageNumbers()}</Flex>

                <Button
                    size='sm'
                    variant='outline'
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                >
                    <ChevronRightIcon />
                </Button>
            </Flex>
        </Flex>
    );
};
