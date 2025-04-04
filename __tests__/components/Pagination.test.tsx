import { Pagination } from '@/pages/admin/Pagination';
import { render } from '@/utils/render-test';

describe('Pagination Snapshot', () => {
    it('renders correctly', () => {
        const { container } = render(
            <Pagination
                currentPage={2}
                totalItems={50}
                itemsPerPage={10}
                onPageChange={() => {}}
            />,
        );
        expect(container).toMatchSnapshot();
    });

    it('matches first page snapshot', () => {
        const { container } = render(
            <Pagination
                currentPage={1}
                totalItems={30}
                itemsPerPage={10}
                onPageChange={() => {}}
            />,
        );
        expect(container).toMatchSnapshot();
    });

    it('matches last page snapshot', () => {
        const { container } = render(
            <Pagination
                currentPage={3}
                totalItems={30}
                itemsPerPage={10}
                onPageChange={() => {}}
            />,
        );
        expect(container).toMatchSnapshot();
    });
});
