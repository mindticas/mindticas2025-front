import { Treatment } from '@/interfaces/treatment/Treatment';
import AppointmentModal from '@/pages/admin/appointments/components/ui/AppointmentModal';
import { render } from '@/utils/render-test';

const mockTreatments: Treatment[] = [
    {
        id: 1,
        name: 'Limpieza dental',
        price: 100,
        duration: 30,
        description: 'Limpieza profesional',
    },
    {
        id: 2,
        name: 'Blanqueamiento',
        price: 200,
        duration: 60,
        description: 'Blanqueamiento dental',
    },
];

describe('AppointmentModal - Snapshot', () => {
    const baseProps = {
        isOpen: true,
        onClose: () => {},
        treatments: mockTreatments,
        onConfirm: async () => {},
        initialData: {
            name: 'Test User',
            treatment: '1',
            date: '2023-01-01',
            time: '10:00',
        },
    };

    it('should match snapshot in create mode', () => {
        const { asFragment } = render(
            <AppointmentModal {...baseProps} mode='create' />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot in edit mode', () => {
        const { asFragment } = render(
            <AppointmentModal {...baseProps} mode='edit' />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot in cancel mode', () => {
        const { asFragment } = render(
            <AppointmentModal
                {...baseProps}
                mode='cancel'
                initialData={{ ...baseProps.initialData, id: 1 }}
                onCancel={async () => {}}
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
