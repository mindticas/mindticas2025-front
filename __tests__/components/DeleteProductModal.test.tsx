import { DeleteProductModal } from '@/pages/admin/products/components/DeleteProductModal';
import { render } from '@/utils/render-test';
import React from 'react';

describe('DeleteProductModal', () => {
    it('should match snapshot with product name', () => {
        const props = {
            isOpen: true,
            onClose: jest.fn(),
            onConfirm: jest.fn(),
            productName: 'Test Product',
            isLoading: false,
        };

        const { container } = render(<DeleteProductModal {...props} />);
        expect(container).toMatchSnapshot();
    });

    it('should match snapshot without product name', () => {
        const props = {
            isOpen: true,
            onClose: jest.fn(),
            onConfirm: jest.fn(),
            isLoading: false,
        };

        const { container } = render(<DeleteProductModal {...props} />);
        expect(container).toMatchSnapshot();
    });

    it('should match snapshot when loading', () => {
        const props = {
            isOpen: true,
            onClose: jest.fn(),
            onConfirm: jest.fn(),
            productName: 'Test Product',
            isLoading: true,
        };

        const { container } = render(<DeleteProductModal {...props} />);
        expect(container).toMatchSnapshot();
    });
});
