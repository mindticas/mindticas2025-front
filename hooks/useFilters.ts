
import { useState, useCallback } from 'react';

export interface FilterOptions {
    name: string;
    treatments?: string;
    date?: string;
    status?: string;
    [key: string]: string | undefined; // Allow additional properties
  }

/**
 * Custom hook to manage filter options.
 *
 * @param initialFilters - The initial filter options to set up the state.
 * @returns An object containing:
 * - `filters`: The current filter options.
 * - `handleFilterChange`: A function to handle changes to filter inputs.
 * - `handleStatusChange`: A function to update the `status` filter.
 * - `resetFilters`: A function to reset filters to their initial state.
 * - `setFilters`: A function to manually update the filters state.
 */
export const useFilters = (initialFilters: FilterOptions) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleStatusChange = useCallback((status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(() => ({ ...initialFilters })); 
  }, [initialFilters]);


  return {
    filters,
    handleFilterChange,
    handleStatusChange,
    resetFilters,
    setFilters,
  };
};