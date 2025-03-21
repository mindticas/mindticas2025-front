import React from 'react';

import { Box, Flex, Text, Container } from '@chakra-ui/react';

export default function Navbar() {
    return (
        <nav>
            <Box as='nav' bg='black' color='white'>
                <Container px={6} py={3}>
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        justify='space-between'
                        align='center'
                    >
                        <img
                            src='/logo.png'
                            width={80}
                            height={80}
                            alt='Dynamic Image'
                        />
                        <Text fontSize='xl' fontWeight='bold' ml={2}>
                            Eleganster
                        </Text>
                    </Flex>
                </Container>
            </Box>
        </nav>
    );
}
