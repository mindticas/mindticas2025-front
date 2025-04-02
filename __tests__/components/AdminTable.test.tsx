import { AdminTable } from '@/pages/admin/AdminTable';
import { render } from '@/utils/render-test';

// Mock data for testing
const testData = [
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 },
];

const testColumns = [
    {
        key: 'name',
        header: 'Name',
        render: (item: any) => item.name,
        align: 'left' as const,
    },
    {
        key: 'value',
        header: 'Value',
        render: (item: any) => `$${item.value}`,
        align: 'right' as const,
    },
];

describe('AdminTable', () => {
    it('should render loading state correctly', () => {
        const { container } = render(
            <AdminTable data={[]} columns={testColumns} isLoading={true} />,
        );
        expect(container).toMatchSnapshot();
    });

    it('should render empty state correctly', () => {
        const { container } = render(
            <AdminTable
                data={[]}
                columns={testColumns}
                isLoading={false}
                emptyMessage='No items found'
            />,
        );
        expect(container).toMatchSnapshot();
    });

    it('should render with data correctly', () => {
        const { container } = render(
            <AdminTable
                data={testData}
                columns={testColumns}
                isLoading={false}
            />,
        );
        expect(container).toMatchSnapshot();
    });

    it('should render with custom empty message', () => {
        const { container } = render(
            <AdminTable
                data={[]}
                columns={testColumns}
                isLoading={false}
                emptyMessage='Custom empty message'
            />,
        );
        expect(container).toMatchSnapshot();
    });
});
