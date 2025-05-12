import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { BusinessInfo } from '@/context/BusinessContext';
import { updateUserProfile } from '@/services/userProfileService';
import {
    validateBusinessFields,
    showBusinessNotification,
} from '@/utils/userProfile/userProfileValidation';
import { render } from '@/utils/render-test';
import BusinessForm from '@/pages/admin/settings/components/BusinessForm';

// More complete mock of the dependencies
jest.mock('@/services/userProfileService', () => ({
    updateUserProfile: jest.fn().mockResolvedValue({
        name: 'Nuevo Nombre',
        contactDetails: { address: 'Nueva Dirección', phone: '987654321' },
        socialLinks: { instagram: '@nuevoinstagram' },
    }),
}));

jest.mock('@/utils/userProfile/userProfileValidation', () => ({
    validateBusinessFields: jest
        .fn()
        .mockReturnValue({ isValid: true, error: null }),
    hasBusinessFormChanges: jest.fn().mockReturnValue(true),
    showBusinessNotification: {
        validationError: jest.fn(),
        noChanges: jest.fn(),
        saveSuccess: jest.fn(),
        saveError: jest.fn(),
    },
}));

describe('BusinessForm', () => {
    const mockBusinessInfo: BusinessInfo = {
        name: 'Mi Negocio',
        address: 'Calle Principal 123',
        phone: '123456789',
        instagram: '@minegocio',
    };

    const mockSetBusinessInfo = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Tests de snapshot (se mantienen igual)
    it('must match the snapshot when loading', () => {
        const { asFragment } = render(
            <BusinessForm
                businessInfo={mockBusinessInfo}
                setBusinessInfo={mockSetBusinessInfo}
                isSmallScreen={false}
                isLoading={true}
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    describe('Interactions', () => {
        it('You must update the form fields', async () => {
            render(
                <BusinessForm
                    businessInfo={mockBusinessInfo}
                    setBusinessInfo={mockSetBusinessInfo}
                    isSmallScreen={false}
                    isLoading={false}
                />,
            );

            const nameInput = screen.getByDisplayValue('Mi Negocio');
            fireEvent.change(nameInput, { target: { value: 'Nuevo Nombre' } });
            expect(nameInput).toHaveValue('Nuevo Nombre');
        });

        it('must call handleSave when the button is clicked', async () => {
            render(
                <BusinessForm
                    businessInfo={mockBusinessInfo}
                    setBusinessInfo={mockSetBusinessInfo}
                    isSmallScreen={false}
                    isLoading={false}
                />,
            );

            const saveButton = screen.getByText('Guardar cambios');
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(validateBusinessFields).toHaveBeenCalled();
                expect(updateUserProfile).toHaveBeenCalled();
            });
        });

        it('should display error when validation fails', async () => {
            (validateBusinessFields as jest.Mock).mockReturnValueOnce({
                isValid: false,
                error: 'Validation error',
            });

            render(
                <BusinessForm
                    businessInfo={mockBusinessInfo}
                    setBusinessInfo={mockSetBusinessInfo}
                    isSmallScreen={false}
                    isLoading={false}
                />,
            );

            fireEvent.click(screen.getByText('Guardar cambios'));

            await waitFor(() => {
                expect(
                    showBusinessNotification.validationError,
                ).toHaveBeenCalledWith('Error de validación');
            });
        });
    });
});
