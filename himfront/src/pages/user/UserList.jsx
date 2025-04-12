import React, { useState } from 'react';
import {
    Box,
    Button,
    Drawer,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

import {
    useUsers,
    useUpdateUserStatus,
    useUpdateUserRole,
} from '../../hooks/useProfiles';

const UserList = () => {
    const { data, isLoading } = useUsers();
    const updateStatusMutation = useUpdateUserStatus();
    const updateRoleMutation = useUpdateUserRole();



    const handleChangeStatus = (id, status) => {
        updateStatusMutation.mutate({ id, status });
    };

    const handleChangeRole = (id, role) => {
        updateRoleMutation.mutate({ id, role });
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Пользователи</Typography>

            </Box>

            {isLoading ? (
                <Typography>Загрузка...</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Имя</TableCell>
                                <TableCell>Электронная почта</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Роль</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.last_name} {user.first_name} {user.middle_name} </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={user.status}
                                            onChange={(e) => handleChangeStatus(user.id, e.target.value)}
                                        >
                                            <MenuItem value="active">Активный</MenuItem>
                                            <MenuItem value="banned">Заблокирован</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={user.role}
                                            onChange={(e) => handleChangeRole(user.id, e.target.value)}
                                        >
                                            <MenuItem value="admin">Администратор</MenuItem>
                                            <MenuItem value="manager">Менеджер</MenuItem>
                                            <MenuItem value="employee">Сотрудник</MenuItem>
                                        </Select>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

        </Box>
    );
};

export default UserList;
