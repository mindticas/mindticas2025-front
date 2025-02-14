import { screen } from '@testing-library/dom';
import { render } from '../../utils/render-test';
import HomePage from '@/pages/index';

test('Should render home page', () => {
    render(<HomePage />);
    const headingElement = screen.getByText(/Elegansters barber appointment/i);
    expect(headingElement).toBeInTheDocument();
});
