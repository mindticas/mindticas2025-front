import React from 'react';
import { screen } from '@testing-library/react';
import Settings from '@/pages/admin/settings';
import { useBusiness } from '@/context/BusinessContext';
import { Toaster } from '@/components/ui/toaster';
import BusinessForm from '@/pages/admin/settings/components/BusinessForm';
import { render } from '@/utils/render-test';

jest.mock('@/context/BusinessContext');
jest.mock('@/components/ui/toaster');
jest.mock('@/pages/admin/settings/components/BusinessForm', () =>
    jest.fn(() => <div>Mocked BusinessForm</div>),
);
jest.mock('@chakra-ui/react', () => ({
    ...jest.requireActual('@chakra-ui/react'),
    useBreakpointValue: jest.fn(),
}));

const mockUseBusiness = useBusiness as jest.MockedFunction<typeof useBusiness>;
const mockUseBreakpointValue =
    jest.requireMock('@chakra-ui/react').useBreakpointValue;

describe('Settings Page', () => {
    const mockBusinessInfo = {
        name: 'Mi Negocio',
        address: 'Calle Principal 123',
        phone: '123456789',
        instagram: '@minegocio',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseBusiness.mockReturnValue({
            businessInfo: mockBusinessInfo,
            setBusinessInfo: jest.fn(),
            isLoading: false,
        });
        mockUseBreakpointValue.mockImplementation(() => false);
    });

    it('should render correctly on large screens', () => {
        const { asFragment } = render(<Settings />);

        expect(asFragment()).toMatchSnapshot();
        expect(screen.getByText('Información del negocio')).toBeInTheDocument();

        const callArgs = (BusinessForm as jest.Mock).mock.calls[0][0];
        expect(callArgs.isSmallScreen).toBe(false);
    });

    it('should render correctly on mobile', () => {
        mockUseBreakpointValue.mockImplementation(() => true);
        render(<Settings />);

        const callArgs = (BusinessForm as jest.Mock).mock.calls[0][0];
        expect(callArgs.isSmallScreen).toBe(true);
    });

    it('must include the Toaster component', () => {
        render(<Settings />);
        expect(Toaster).toHaveBeenCalled();
    });
});
