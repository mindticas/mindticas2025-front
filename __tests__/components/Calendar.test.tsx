import Calendar from '@/components/Calendar';
import { render } from '@/utils/render-test';

describe('Calendar Snapshot', () => {
    it('should match the snapshot', () => {
        // Mock de la función onSelectDateTime
        const mockOnSelectDateTime = jest.fn();

        // Renderizar el componente con la prop requerida
        const { asFragment } = render(
            <Calendar onSelectDateTime={mockOnSelectDateTime} />,
        );

        // Verificar que el snapshot coincida
        expect(asFragment()).toMatchSnapshot();
    });
});
