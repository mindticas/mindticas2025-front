import React from 'react';
import { Box, Flex, Text, Container, Icon, Spinner } from '@chakra-ui/react';
import { MapPin, Phone } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';
import formatPhone from '@/utils/formatPhone';
import Link from 'next/link';

export default function Footer() {
    const { businessInfo, isLoading } = useBusiness();
    const getDate = new Date();
    const currentYear = getDate.getFullYear();
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
                            <Flex
                                align='center'
                                mb={2}
                                w='100%'
                                justifyContent='space-between'
                            >
                                <Flex>
                                    <img
                                        src='/logo.png'
                                        width={30}
                                        height={90}
                                        alt='Dynamic Image'
                                    />
                                    <Text fontSize='xl' fontWeight='bold'>
                                        Elegangster
                                    </Text>
                                </Flex>
                            </Flex>

                            <Flex align='center'>
                                <Icon as={MapPin} h={4} w={4} />
                                {isLoading ? (
                                    <Spinner
                                        size='xs'
                                        color='gray.300'
                                        ml={2}
                                    />
                                ) : (
                                    <Text fontSize='sm' ml={2}>
                                        {businessInfo.address}
                                    </Text>
                                )}
                            </Flex>

                            <Flex align='center' mt={1}>
                                <Icon as={Phone} h={4} w={4} />
                                {isLoading ? (
                                    <Spinner
                                        size='xs'
                                        color='gray.300'
                                        ml={2}
                                    />
                                ) : (
                                    <Text fontSize='sm' ml={2}>
                                        {formatPhone(businessInfo.phone)}
                                    </Text>
                                )}
                            </Flex>
                        </Flex>
                        <Flex direction='column' gap={4}>
                            {!isLoading && businessInfo.instagram && (
                                <Flex align='center' gap={4}>
                                    <Text>Redes sociales: </Text>
                                    <Link
                                        target='_blank'
                                        href={businessInfo.instagram}
                                        passHref
                                    >
                                        <img
                                            src='/instagram-w.png'
                                            width={25}
                                            height={85}
                                            alt='Instagram'
                                        />
                                    </Link>
                                </Flex>
                            )}
                            <Box textAlign={{ base: 'center', md: 'right' }}>
                                <Text>
                                    &copy; {currentYear}{' '}
                                    {isLoading ? (
                                        <Spinner
                                            size='xs'
                                            color='gray.300'
                                            ml={2}
                                        />
                                    ) : (
                                        businessInfo.name
                                    )}
                                    . Todos los derechos reservados.
                                </Text>
                            </Box>
                        </Flex>
                    </Flex>
                </Container>
            </Box>
        </footer>
    );
}
