import { Text, TextProps } from '@chakra-ui/react';
import React, { JSX } from 'react';

interface ErrorMessageProps extends TextProps {
    message?: string;
}

const ErrorMessage = ({
    message,
    ...props
}: ErrorMessageProps): JSX.Element | null => (
    <>
        {message && (
            <Text color='red.500' fontSize='sm' mt={1} {...props}>
                {message}
            </Text>
        )}
    </>
);

export default ErrorMessage;
