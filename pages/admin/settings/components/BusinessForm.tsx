import {
    Box,
    VStack,
    Text,
    Flex,
    Button,
    Spinner,
    Input,
    Center,
    Skeleton,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { updateUserProfile } from '@/services/userProfileService';
import {
    BusinessFormData,
    hasBusinessFormChanges,
    showBusinessNotification,
    validateBusinessFields,
} from '@/utils/userProfile/userProfileValidation';
import { useBusiness } from '@/context/BusinessContext';

interface BusinessFormProps {
    isSmallScreen: boolean;
}

export default function BusinessForm({ isSmallScreen }: BusinessFormProps) {
    const { businessInfo, setBusinessInfo, isLoading } = useBusiness();
    const [formData, setFormData] = useState<BusinessFormData>({
        name: '',
        contactDetails: {
            address: '',
            phone: '',
        },
        socialLinks: {
            instagram: '',
        },
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setFormData({
            name: businessInfo.name,
            contactDetails: {
                address: businessInfo.address,
                phone: businessInfo.phone,
            },
            socialLinks: {
                instagram: businessInfo.instagram || '',
            },
        });
    }, [businessInfo]);

    const handleChange = (field: keyof BusinessFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleNestedChange = (
        group: 'contactDetails' | 'socialLinks',
        key: string,
        value: string,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [group]: {
                ...prev[group],
                [key]: value,
            },
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const trimmedData: BusinessFormData = {
            name: formData.name.trim(),
            contactDetails: {
                address: formData.contactDetails.address.trim(),
                phone: formData.contactDetails.phone.trim(),
            },
            socialLinks: {
                instagram: formData.socialLinks.instagram.trim(),
            },
        };
        // Validation: empty fields
        const validation = validateBusinessFields(trimmedData);
        if (!validation.isValid) {
            setIsSaving(false);
            return showBusinessNotification.validationError(validation.error!);
        }
        // Check for changes in inputs
        if (!hasBusinessFormChanges(businessInfo, trimmedData)) {
            setIsSaving(false);
            return showBusinessNotification.noChanges();
        }
        // If validations pass, save
        try {
            const updated = await updateUserProfile(trimmedData);
            setBusinessInfo({
                name: updated.name || '',
                address: updated.contactDetails?.address || '',
                phone: updated.contactDetails?.phone || '',
                instagram: updated.socialLinks?.instagram || '',
            });
            showBusinessNotification.saveSuccess();
        } catch (error) {
            console.log(error);
            showBusinessNotification.saveError();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Box
            width={isSmallScreen ? '100%' : '70%'}
            p={6}
            bg='white'
            borderRadius='lg'
            borderWidth='1px'
            borderColor='gray.200'
            shadow='md'
        >
            {isLoading ? (
                <VStack gap={6} align='stretch'>
                    <Skeleton height='50px' />
                    <Skeleton height='50px' />
                    <Skeleton height='50px' />
                    <Skeleton height='50px' />
                    <Center mt={4}>
                        <Spinner size='xl' color='#1C4ED8' />
                    </Center>
                </VStack>
            ) : (
                <VStack gap={4} align='stretch'>
                    <Box>
                        <Text fontWeight='semibold' mb={2} color='gray.700'>
                            Nombre del negocio
                        </Text>
                        <Input
                            value={formData.name}
                            onChange={(e) =>
                                handleChange('name', e.target.value)
                            }
                            p={3}
                            borderRadius='md'
                            borderColor='gray.300'
                        />
                    </Box>

                    <Box>
                        <Text fontWeight='semibold' mb={2} color='gray.700'>
                            Dirección
                        </Text>
                        <Input
                            value={formData.contactDetails.address}
                            onChange={(e) =>
                                handleNestedChange(
                                    'contactDetails',
                                    'address',
                                    e.target.value,
                                )
                            }
                            p={3}
                            borderRadius='md'
                            borderColor='gray.300'
                        />
                    </Box>

                    <Box>
                        <Text fontWeight='semibold' mb={2} color='gray.700'>
                            Teléfono
                        </Text>
                        <Input
                            value={formData.contactDetails.phone}
                            onChange={(e) =>
                                handleNestedChange(
                                    'contactDetails',
                                    'phone',
                                    e.target.value,
                                )
                            }
                            type='number'
                            p={3}
                            borderRadius='md'
                            borderColor='gray.300'
                        />
                    </Box>

                    <Box>
                        <Text fontWeight='semibold' mb={2} color='gray.700'>
                            Instagram
                        </Text>
                        <Input
                            value={formData.socialLinks.instagram}
                            onChange={(e) =>
                                handleNestedChange(
                                    'socialLinks',
                                    'instagram',
                                    e.target.value,
                                )
                            }
                            p={3}
                            borderRadius='md'
                            borderColor='gray.300'
                        />
                    </Box>

                    <Flex justify='center' mt={6}>
                        <Button
                            bgColor='#1C4ED8'
                            color='white'
                            size='md'
                            px={8}
                            py={4}
                            fontWeight='medium'
                            borderRadius='md'
                            onClick={handleSave}
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'md',
                            }}
                            transition='all 0.2s'
                            loading={isSaving}
                        >
                            {isSaving ? (
                                <Flex align='center'>
                                    <Spinner size='sm' color='white' mr={2} />
                                    <Text>Guardando...</Text>
                                </Flex>
                            ) : (
                                'Guardar cambios'
                            )}
                        </Button>
                    </Flex>
                </VStack>
            )}
        </Box>
    );
}
