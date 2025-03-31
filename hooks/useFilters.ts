
import { useState, useCallback } from 'react';

export interface FilterOptions {
    name: string;
    treatments?: string;
    date?: string;
    status?: string;
    [key: string]: string | undefined; // Allow additional properties
  }

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
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    filters,
    handleFilterChange,
    handleStatusChange,
    resetFilters,
    setFilters,
  };
};