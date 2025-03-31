import { SearchFilters, statusOptions } from '@/components/SearchFilters';
import { render } from '@/utils/render-test';

describe('SearchFilters', () => {
    const mockFilters = {
        name: '',
        treatments: '',
        date: '',
        status: '',
    };

    const mockOnFilterChange = jest.fn();
    const mockOnStatusChange = jest.fn();

    it('should render basic filters correctly', () => {
        const { container } = render(
            <SearchFilters
                filters={mockFilters}
                onFilterChange={mockOnFilterChange}
            />,
        );
        expect(container).toMatchSnapshot();
    });

    it('should render with all filters enabled', () => {
        const { container } = render(
            <SearchFilters
                filters={mockFilters}
                onFilterChange={mockOnFilterChange}
                onStatusChange={mockOnStatusChange}
                showStatusFilter={true}
                showDateFilter={true}
                showTreatmentFilter={true}
            />,
        );
        expect(container).toMatchSnapshot();
    });

    it('should render with status filter only', () => {
        const { container } = render(
            <SearchFilters
                filters={{ ...mockFilters, status: 'confirmed' }}
                onFilterChange={mockOnFilterChange}
                onStatusChange={mockOnStatusChange}
                showStatusFilter={true}
            />,
        );
        expect(container).toMatchSnapshot();
    });

    it('should render with date filter only', () => {
        const { container } = render(
            <SearchFilters
                filters={{ ...mockFilters, date: '2023-01-01' }}
                onFilterChange={mockOnFilterChange}
                showDateFilter={true}
            />,
        );
        expect(container).toMatchSnapshot();
    });

    it('should render with treatment filter only', () => {
        const { container } = render(
            <SearchFilters
                filters={{ ...mockFilters, treatments: 'Haircut' }}
                onFilterChange={mockOnFilterChange}
                showTreatmentFilter={true}
            />,
        );
        expect(container).toMatchSnapshot();
    });

    it('should render with name filter filled', () => {
        const { container } = render(
            <SearchFilters
                filters={{ ...mockFilters, name: 'John Doe' }}
                onFilterChange={mockOnFilterChange}
            />,
        );
        expect(container).toMatchSnapshot();
    });

    it('should render status options correctly', () => {
        // Test that all status options are properly exported
        expect(statusOptions).toMatchSnapshot();
    });
});
