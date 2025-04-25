import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  Portal, 
  Box, 
  Field, 
  Input, 
  Button, 
  Spinner, 
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger
} from '@chakra-ui/react';
import { CloseButton } from '@/components/ui/close-button';
import { Eye, EyeOff } from 'lucide-react';
import { getRoles } from '@/services/RoleService';
import { createUser } from '@/services/UserService';
import { toaster } from '@/components/ui/toaster';
import { createListCollection } from '@chakra-ui/react';
import { User } from '@/interfaces/user/User';
import { Role } from '@/interfaces/role/Role';

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: (user: User) => void;
}

export default function CreateUserModal({ isOpen, onClose, onUserCreated }: CreateUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: '',
    });

    useEffect(() => {
        if (!isOpen) return;
        
        const loadRoles = async () => {
            try {
                const rolesData = await getRoles();
                setRoles(rolesData);
            } catch (error) {
                setError('Error al cargar los roles');
            } 
        };

        loadRoles();
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const createdUser = await createUser({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role_id: parseInt(formData.role),
            });
            
            onUserCreated(createdUser);
            toaster.create({ 
                type: 'success', 
                duration: 5000, 
                title: 'Empleado creado correctamente' 
            });
            onClose();
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                role: '',
            });
        } catch (error) {
            toaster.create({
                type: 'error',
                duration: 5000,
                title: 'Error al crear el empleado, revisa que el empleado no exista o intenta más tarde',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} placement='center'>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content p={5} backgroundColor='white'>
                        <Dialog.Header mb={4} display='flex' justifyContent='space-between' alignItems='center'>
                            <Dialog.Title>Crear Empleado</Dialog.Title>
                            <Dialog.CloseTrigger asChild onClick={onClose}>
                                <CloseButton color='black' size='sm' />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>

                        <Dialog.Body>
                        <form onSubmit={handleSubmit}>
                                    <Box mb={4}>
                                        <Field.Root>
                                            <Field.Label fontWeight='semibold'>
                                                Nombre
                                            </Field.Label>
                                            <Input
                                                p={2}
                                                name='name'
                                                placeholder='Nombre del empleado'
                                                onChange={handleInputChange}
                                                value={formData.name}
                                                required
                                            />
                                        </Field.Root>
                                    </Box>

                                    <Box mb={4}>
                                        <div>
                                            {error && (
                                                <p
                                                    style={{
                                                        color: 'red',
                                                        textAlign: 'center',
                                                        padding: '10px',
                                                    }}
                                                >
                                                    {error}
                                                </p>
                                            )}
                                        </div>

                                        {roles && (
                                            <SelectRoot
                                                name='treatment'
                                                collection={createListCollection(
                                                    {
                                                        items: roles,
                                                    },
                                                )}
                                                onValueChange={(e) => {
                                                    const selectedRole =
                                                        roles.find(
                                                            (role) =>
                                                                role.name ===
                                                                e.value.toString(),
                                                        );
                                                    setFormData({
                                                        ...formData,
                                                        role: selectedRole
                                                            ? selectedRole.id.toString()
                                                            : '',
                                                    });
                                                }}
                                                required
                                            >
                                                <SelectLabel fontWeight='semibold'>
                                                    Rol del empleado
                                                </SelectLabel>
                                                <SelectTrigger>
                                                    {(roles &&
                                                        roles.find(
                                                            (t) =>
                                                                t.id.toString() ===
                                                                formData.role,
                                                        )?.name) ||
                                                        'Seleccionar servicio'}
                                                </SelectTrigger>
                                                <SelectContent backgroundColor='white'>
                                                    {roles &&
                                                        roles.map(
                                                            ({ id, name }) => (
                                                                <SelectItem
                                                                    cursor='pointer'
                                                                    _hover={{
                                                                        backgroundColor:
                                                                            'gray.100',
                                                                    }}
                                                                    backgroundColor='white'
                                                                    item={name}
                                                                    key={id}
                                                                    p={2}
                                                                    data-state={
                                                                        id ===
                                                                        id
                                                                            ? 'checked'
                                                                            : 'unchecked'
                                                                    }
                                                                >
                                                                    {name}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                </SelectContent>
                                            </SelectRoot>
                                        )}
                                    </Box>

                                    <Box mb={4}>
                                        <Field.Root>
                                            <Field.Label fontWeight='semibold'>
                                                Email
                                            </Field.Label>
                                            <Input
                                                p={2}
                                                type='email'
                                                name='email'
                                                onChange={handleInputChange}
                                                value={formData.email}
                                                required
                                            />
                                        </Field.Root>
                                    </Box>

                                    <Box mb={4}>
                                        <Field.Root>
                                            <Field.Label fontWeight='semibold'>
                                                Teléfono
                                            </Field.Label>
                                            <Input
                                                p={2}
                                                type='text'
                                                name='phone'
                                                onChange={handleInputChange}
                                                value={formData.phone}
                                                required
                                            />
                                        </Field.Root>
                                    </Box>
                                    <Box mb={4}>
                                        <Field.Root>
                                            <Field.Label fontWeight='semibold'>
                                                Contraseña
                                            </Field.Label>
                                            <Input
                                                p={2}
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                name='password'
                                                onChange={handleInputChange}
                                                value={formData.password}
                                                required
                                            />
                                            <Button
                                                position='absolute'
                                                right='2'
                                                top='7'
                                                size='sm'
                                                variant='ghost'
                                                color='black'
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                aria-label={
                                                    showPassword
                                                        ? 'Ocultar contraseña'
                                                        : 'Mostrar contraseña'
                                                }
                                            >
                                                {showPassword ? (
                                                    <Eye size={18} />
                                                ) : (
                                                    <EyeOff size={18} />
                                                )}
                                            </Button>
                                        </Field.Root>
                                    </Box>
                                </form>

                        </Dialog.Body>
                        <Dialog.Footer p={4}>
                                <Button
                                width={'100%'}
                                    colorPalette='blue'
                                    ml={3}
                                    onClick={handleSubmit}
                                    p={3}
                                    backgroundColor='#1C4ED8'
                                    color='white'
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Spinner size='sm' mr={2} />
                                    ) : (
                                        'Guardar'
                                    )}
                                </Button>
                            </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}