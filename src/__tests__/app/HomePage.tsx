import {render, screen} from '@testing-library/react'
import HomePage from '@/pages/index'

// First test
it('Should render home page', () => {
    render(<HomePage />)
    expect(screen.getByText(/Get started by/i)).toBeInTheDocument()
});