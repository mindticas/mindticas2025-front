import { Text, TextProps } from '@chakra-ui/react';
import React from 'react';

interface ErrorMessageProps extends TextProps {
    message?: string;
}

export default function ErrorMessage({ message, ...props }: ErrorMessageProps) {
    if (!message) return null;
    return (
        <Text color='red.500' fontSize='sm' mt={1} {...props}>
            {message}
        </Text>
    );
}
