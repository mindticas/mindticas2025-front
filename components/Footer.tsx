import React from 'react';
import { Box, Flex, Text, Container, Icon } from '@chakra-ui/react';
import { MapPin, Phone } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';
import formatPhone from '@/utils/formatPhone';
import Link from 'next/link';

export default function Footer() {
    const { businessInfo } = useBusiness();
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
                            <Flex align='center' mb={2}>
                                <img
                                    src='/logo.png'
                                    width={30}
                                    height={90}
                                    alt='Dynamic Image'
                                />
                                <Text fontSize='xl' fontWeight='bold' ml={2}>
                                    Elegangster
                                </Text>
                                <Box ml={2}>
                                    <Link
                                        target='_blank'
                                        href={`${businessInfo.instagram}`}
                                        passHref
                                    >
                                        <img
                                            src='/instagram.png'
                                            width={30}
                                            height={90}
                                            alt='Instagram'
                                        />
                                    </Link>
                                </Box>
                            </Flex>

                            <Flex align='center'>
                                <Icon as={MapPin} h={4} w={4} />
                                <Text fontSize='sm' ml={2}>
                                    {businessInfo.address}
                                </Text>
                            </Flex>

                            <Flex align='center' mt={1}>
                                <Icon as={Phone} h={4} w={4} />
                                <Text fontSize='sm' ml={2}>
                                    {formatPhone(businessInfo.phone)}
                                </Text>
                            </Flex>
                        </Flex>

                        <Box textAlign={{ base: 'center', md: 'right' }}>
                            <Text>
                                &copy; {currentYear} {businessInfo.name}. Todos
                                los derechos reservados.
                            </Text>
                        </Box>
                    </Flex>
                </Container>
            </Box>
        </footer>
    );
}
