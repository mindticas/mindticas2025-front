import {
    Box,
    Flex,
    Link as ChakraLink,
    Button,
    Text,
    Image,
} from '@chakra-ui/react';
import { LogOut, Scissors } from 'lucide-react';
import React from 'react';
import NextLink from 'next/link';
import { AdminNavbarDesktopProps } from '@/interfaces/navItems/navItems';
import { handleRefresh } from '@/services/RefreshToken';
import CalendarImg from '@/public/google-calendar.png';
import { handleLogout } from '@/services/authService';

export default function DesktopViewAdmin({
    navItems,
    pathname,
}: AdminNavbarDesktopProps) {
    return (
        <Box bg='gray.800' color='white' shadow='lg'>
            <Flex
                maxW='7xl'
                mx='auto'
                px={{ base: 4, md: 6, lg: 8 }}
                h='16'
                align='center'
                justify='space-between'
            >
                {/* Logo and links */}
                <Flex align='center'>
                    <ChakraLink
                        display='flex'
                        alignItems='center'
                        _hover={{ textDecoration: 'none' }}
                        color='white'
                    >
                        <Scissors size={32} />
                        <Text ml='2' fontSize='xl' fontWeight='bold'>
                            Elegangster Admin
                        </Text>
                    </ChakraLink>
                    <Flex ml='10' align='center' gap='4'>
                        {navItems &&
                            navItems.map((item) => {
                                const Icon = item.icon;
                                const active = pathname === item.href;
                                const hasName = !!item.name;
                                return (
                                    <ChakraLink
                                        key={item.name}
                                        as={NextLink}
                                        px='3'
                                        py='2'
                                        href={item.href}
                                        rounded='md'
                                        fontSize='md'
                                        fontWeight='medium'
                                        bg={active ? 'gray.900' : 'transparent'}
                                        _hover={{
                                            bg: 'gray.700',
                                            textDecoration: 'none',
                                        }}
                                        display='flex'
                                        alignItems='center'
                                        color='white'
                                    >
                                        <Icon
                                            width={24}
                                            height={24}
                                            style={{
                                                marginRight: hasName
                                                    ? '8px'
                                                    : '0px',
                                            }}
                                        />
                                        {item.name}
                                    </ChakraLink>
                                );
                            })}
                    </Flex>
                </Flex>
                <Flex align='center' gap='4'>
                    {/* Logout button section for desktop */}
                    <Button
                        py='2'
                        px='3'
                        color='white'
                        bg='red.600'
                        _hover={{ bg: 'red.700' }}
                        fontWeight='bold'
                        display='flex'
                        alignItems='center'
                        gap='2'
                        onClick={handleLogout}
                    >
                        <LogOut size={32} />
                        Salir
                    </Button>
                    {/* Google calendar button section for desktop */}
                    <Image
                        boxSize='40px'
                        rounded='md'
                        cursor='pointer'
                        onClick={handleRefresh}
                        src={CalendarImg.src}
                        alt='Imagen de google calendar'
                    />
                </Flex>
            </Flex>
        </Box>
    );
}
