import React from 'react';
import { Box, Flex, Text, Container, Icon } from '@chakra-ui/react';
import { MapPin, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer>
            <Box as='footer' bg='black' color='white' py={8} mt={6}>
                <Container maxW='container.2xl' px={4}>
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        justify='space-between'
                        align='center'
                        gap={5}
                        px={4}
                    >
                        <Flex
                            direction='column'
                            align={{ base: 'center', md: 'flex-start' }}
                            mb={{ base: 4, md: 0 }}
                        >
                            <Flex align='center' mb={2}>
                                <img
                                    src='/logo.png'
                                    width={30}
                                    height={90}
                                    alt='Dynamic Image'
                                />
                                <Text fontSize='xl' fontWeight='bold' ml={2}>
                                    Eleganster
                                </Text>
                            </Flex>

                            <Flex align='center'>
                                <Icon as={MapPin} h={4} w={4} />
                                <Text fontSize='sm' ml={2}>
                                    Av. Real Bugambilias 286, Lomas de la
                                    Higuera
                                </Text>
                            </Flex>

                            <Flex align='center' mt={1}>
                                <Icon as={Phone} h={4} w={4} />
                                <Text fontSize='sm' ml={2}>
                                    (312) 291-3365
                                </Text>
                            </Flex>
                        </Flex>

                        <Box textAlign={{ base: 'center', md: 'right' }}>
                            <Text>
                                &copy; 2025 Eleganster Barbershop. Todos los
                                derechos reservados.
                            </Text>
                        </Box>
                    </Flex>
                </Container>
            </Box>
        </footer>
    );
}
