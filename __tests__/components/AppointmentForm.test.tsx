import { render } from '../../utils/render-test';
import AppointmentForm from '@/components/AppointmentForm';

describe('AppointmentForm Snapshot', () => {
    it('should match the snapshot', () => {
        const mockOnSuccess = jest.fn();
        const mockOnError = jest.fn();
        const { asFragment } = render(
            <AppointmentForm onSuccess={mockOnSuccess} onError={mockOnError} />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
