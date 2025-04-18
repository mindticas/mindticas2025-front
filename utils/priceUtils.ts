const parseTreatmentPrice = (price: unknown): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
        const numericValue = parseFloat(price.replace(/[^0-9.-]/g, ''));
        return isNaN(numericValue) ? 0 : numericValue;
    }
    return 0;
};

export default parseTreatmentPrice;
