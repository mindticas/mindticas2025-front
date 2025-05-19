export default function formatPhone(phone: string): string {
    // Remove everything that is not digits
    const digits = phone.replace(/\D/g, '');
    // Applies format only if it has 10 digits
    if (digits.length === 10) {
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phone; // Returns the original if it doesn't match
}
