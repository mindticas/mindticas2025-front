import React from 'react';
import { screen } from '@testing-library/react';
import Settings from '@/pages/admin/settings';
import { useBusiness } from '@/context/BusinessContext';
import { Toaster } from '@/components/ui/toaster';
import BusinessForm from '@/pages/admin/settings/components/BusinessForm';
import { render } from '@/utils/render-test';

jest.mock('@/context/BusinessContext');
jest.mock('@/components/ui/toaster');
jest.mock('@/pages/admin/settings/components/BusinessForm');
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
        // Common mock configuration
        mockUseBusiness.mockReturnValue({
            businessInfo: mockBusinessInfo,
            setBusinessInfo: jest.fn(),
            isLoading: false,
        });

        mockUseBreakpointValue.mockImplementation(() => false);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render correctly on large screens', () => {
        const { asFragment } = render(<Settings />);

        expect(asFragment()).toMatchSnapshot();
        expect(screen.getByText('Información del negocio')).toBeInTheDocument();
        expect(BusinessForm).toHaveBeenCalledWith(
            expect.objectContaining({
                businessInfo: mockBusinessInfo,
                isSmallScreen: false,
                isLoading: false,
            }),
            expect.anything(),
        );
    });

    it('should render correctly on mobile', () => {
        mockUseBreakpointValue.mockImplementation(() => true);
        const { asFragment } = render(<Settings />);

        expect(asFragment()).toMatchSnapshot();
        expect(BusinessForm).toHaveBeenCalledWith(
            expect.objectContaining({
                isSmallScreen: true,
            }),
            expect.anything(),
        );
    });

    it('should show the charging status', () => {
        mockUseBusiness.mockReturnValue({
            businessInfo: mockBusinessInfo,
            setBusinessInfo: jest.fn(),
            isLoading: true,
        });

        render(<Settings />);
        expect(BusinessForm).toHaveBeenCalledWith(
            expect.objectContaining({
                isLoading: true,
            }),
            expect.anything(),
        );
    });

    it('must include the Toaster component', () => {
        render(<Settings />);
        expect(Toaster).toHaveBeenCalled();
    });
});
