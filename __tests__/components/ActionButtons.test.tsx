import AppointmentActions from '@/pages/admin/appointments/components/ActionButtons';
import { render } from '@/utils/render-test';
import { screen, fireEvent } from '@testing-library/react';

describe('AppointmentActions', () => {
    const mockHandlers = {
        onEdit: jest.fn(),
        onCancel: jest.fn(),
        onComplete: jest.fn(),
    };

    it('renderiza las acciones básicas correctamente', () => {
        render(
            <AppointmentActions
                appointmentId={1}
                status='pending'
                {...mockHandlers}
            />,
        );

        // Verificar que los tres botones básicos estén presentes
        expect(screen.getByLabelText('Editar cita')).toBeInTheDocument();
        expect(screen.getByLabelText('Cancelar cita')).toBeInTheDocument();
        expect(screen.getByLabelText('Completar cita')).toBeInTheDocument();
    });

    it('deshabilita acciones según el estado', () => {
        const { rerender } = render(
            <AppointmentActions
                appointmentId={1}
                status='canceled'
                {...mockHandlers}
            />,
        );

        expect(screen.getByLabelText('Cancelar cita')).toBeDisabled();

        rerender(
            <AppointmentActions
                appointmentId={1}
                status='completed'
                {...mockHandlers}
            />,
        );

        expect(screen.getByLabelText('Completar cita')).toBeDisabled();
    });

    it('ejecuta los handlers correspondientes', () => {
        render(
            <AppointmentActions
                appointmentId={1}
                status='pending'
                {...mockHandlers}
            />,
        );

        fireEvent.click(screen.getByLabelText('Editar cita'));
        expect(mockHandlers.onEdit).toHaveBeenCalledWith(1);

        fireEvent.click(screen.getByLabelText('Cancelar cita'));
        expect(mockHandlers.onCancel).toHaveBeenCalledWith(1);

        fireEvent.click(screen.getByLabelText('Completar cita'));
        expect(mockHandlers.onComplete).toHaveBeenCalledWith(1);
    });

    it('renderiza acciones personalizadas', () => {
        const customAction = {
            icon: <div data-testid='custom-icon'>★</div>,
            color: 'purple',
            tooltip: 'Acción personalizada',
            action: jest.fn(),
        };

        render(
            <AppointmentActions
                appointmentId={1}
                status='pending'
                {...mockHandlers}
                customActions={[customAction]}
            />,
        );

        expect(
            screen.getByLabelText('Acción personalizada'),
        ).toBeInTheDocument();
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
});
