import { screen } from '@testing-library/dom';
import { render } from '../../utils/render-test';
import HomePage from '@/pages/index';
import Calendar from '@/components/Calendar';

test('Should render home page', () => {
    render(<HomePage />);
    const headingElement = screen.getByText(/Elegansters barber appointment/i);
    expect(headingElement).toBeInTheDocument();
});

test('Should render Calendar', () => {
    render(<Calendar />);
    const headingElement = screen.getByText(/calendario/i);
    expect(headingElement).toBeInTheDocument();
});

test('should render container calendar', () => {
    render(<Calendar />);
    const calendarContainer = screen.getByTestId('full-calendar');
    expect(calendarContainer).toBeInTheDocument();
});
