import Calendar from '@/components/Calendar';
import { render } from '@/utils/render-test';
import { screen } from '@testing-library/react';

describe('Calendar', () => {
    it('renders the calendar with the current day', () => {
        render(<Calendar />);
        const today = new Date().getDate().toString();
        expect(screen.getByText(today)).toBeInTheDocument();
    });
});
