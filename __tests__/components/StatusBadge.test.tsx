import StatusBadge from '@/pages/admin/appointments/components/ui/StatusBadge';
import { render } from '@/utils/render-test';

describe('StatusBadge Component', () => {
    it('should render with "Confirmed" status', () => {
        const { asFragment } = render(<StatusBadge statusValue='confirmed' />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render with "Pending" status', () => {
        const { asFragment } = render(<StatusBadge statusValue='pending' />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render with "Canceled" status', () => {
        const { asFragment } = render(<StatusBadge statusValue='canceled' />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render with "Completed" status', () => {
        const { asFragment } = render(<StatusBadge statusValue='completed' />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render with default styling when status is undefined', () => {
        const { asFragment } = render(<StatusBadge />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render with default styling when status is invalid', () => {
        const { asFragment } = render(
            <StatusBadge statusValue='invalid-status' />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
