import TreatmentModal from '@/pages/admin/treatments/components/TreatmentModal';
import { Treatment } from '@/interfaces/treatment/Treatment';
import { render } from '@/utils/render-test';
// Treatment mockup for testing
const mockTreatment: Treatment = {
    id: 1,
    name: 'Corte de pelo',
    description: 'Corte básico',
    price: 150,
    duration: 30,
};

describe('TreatmentModal Snapshot Tests', () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn();

    it('should match create mode snapshot', () => {
        const { asFragment } = render(
            <TreatmentModal
                isOpen={true}
                onClose={mockOnClose}
                mode='create'
                onSubmit={mockOnSubmit}
                isSubmitting={false}
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should match edit mode snapshot', () => {
        const { asFragment } = render(
            <TreatmentModal
                isOpen={true}
                onClose={mockOnClose}
                mode='edit'
                selectedTreatment={mockTreatment}
                onSubmit={mockOnSubmit}
                isSubmitting={false}
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should match delete mode snapshot', () => {
        const { asFragment } = render(
            <TreatmentModal
                isOpen={true}
                onClose={mockOnClose}
                mode='delete'
                selectedTreatment={mockTreatment}
                onSubmit={mockOnSubmit}
                isSubmitting={false}
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with errors', () => {
        // Mock validateTreatmentFields to force errors
        jest.mock('@/utils/treatments/treatmentValidation', () => ({
            validateTreatmentFields: () => ({
                name: 'Nombre requerido',
                price: 'Precio inválido',
            }),
        }));

        const { asFragment } = render(
            <TreatmentModal
                isOpen={true}
                onClose={mockOnClose}
                mode='create'
                onSubmit={mockOnSubmit}
                isSubmitting={false}
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when submitting', () => {
        const { asFragment } = render(
            <TreatmentModal
                isOpen={true}
                onClose={mockOnClose}
                mode='edit'
                selectedTreatment={mockTreatment}
                onSubmit={mockOnSubmit}
                isSubmitting={true}
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should match closed modal snapshot', () => {
        const { asFragment } = render(
            <TreatmentModal
                isOpen={false}
                onClose={mockOnClose}
                mode='create'
                onSubmit={mockOnSubmit}
                isSubmitting={false}
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
