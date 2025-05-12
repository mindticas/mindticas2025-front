import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { BusinessInfo } from '@/context/BusinessContext';
import { updateUserProfile } from '@/services/userProfileService';
import { BusinessContext } from '@/context/BusinessContext';
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

const mockBusinessInfo: BusinessInfo = {
    name: 'Mi Negocio',
    address: 'Calle Principal 123',
    phone: '123456789',
    instagram: '@minegocio',
};

const mockSetBusinessInfo = jest.fn();

const renderWithContext = (isLoading = false) => {
    return render(
        <BusinessContext.Provider
            value={{
                businessInfo: mockBusinessInfo,
                setBusinessInfo: mockSetBusinessInfo,
                isLoading,
            }}
        >
            <BusinessForm isSmallScreen={false} />
        </BusinessContext.Provider>,
    );
};
describe('BusinessForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('must match the snapshot when loading', () => {
        const { asFragment } = renderWithContext(true);
        expect(asFragment()).toMatchSnapshot();
    });

    describe('Interactions', () => {
        it('should update the form fields', async () => {
            renderWithContext();

            const nameInput = screen.getByDisplayValue('Mi Negocio');
            fireEvent.change(nameInput, { target: { value: 'Nuevo Nombre' } });
            expect(nameInput).toHaveValue('Nuevo Nombre');
        });

        it('must call handleSave when the button is clicked', async () => {
            renderWithContext();

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
                error: 'Error de validación',
            });

            renderWithContext();
            fireEvent.click(screen.getByText('Guardar cambios'));

            await waitFor(() => {
                expect(
                    showBusinessNotification.validationError,
                ).toHaveBeenCalledWith('Error de validación');
            });
        });
    });
});
