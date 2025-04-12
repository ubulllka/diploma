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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

import {
    useMeasurements,
    useCreateMeasurement,
    useUpdateMeasurement,
    useDeleteMeasurement,
} from '../../hooks/useMeasurements';

const MeasurementList = () => {
    const { data, isLoading } = useMeasurements();
    const createMutation = useCreateMeasurement();
    const updateMutation = useUpdateMeasurement();
    const deleteMutation = useDeleteMeasurement();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', short_name: '' });
    const [selectedId, setSelectedId] = useState(null);

    const handleOpenDrawer = (measurement = null) => {
        if (measurement) {
            setFormData({
                name: measurement.name,
                short_name: measurement.short_name,
            });
            setSelectedId(measurement.id);
            setEditMode(true);
        } else {
            setFormData({ name: '', short_name: '' });
            setEditMode(false);
            setSelectedId(null);
        }
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        if (editMode) {
            updateMutation.mutate({ id: selectedId, data: formData }, { onSuccess: handleCloseDrawer });
        } else {
            createMutation.mutate(formData, { onSuccess: handleCloseDrawer });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Единицы измерения</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDrawer()}>
                    Добавить
                </Button>
            </Box>

            {isLoading ? (
                <Typography>Загрузка...</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell>Краткое название</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell>{m.id}</TableCell>
                                    <TableCell>{m.name}</TableCell>
                                    <TableCell>{m.short_name}</TableCell>
                                    <TableCell>
                                        <Button size="small" startIcon={<Edit />} onClick={() => handleOpenDrawer(m)}>
                                            Изменить
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<Delete />}
                                            onClick={() => handleDelete(m.id)}
                                        >
                                            Удалить
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
                <Box sx={{ width: 400, p: 3 }}>
                    <Typography variant="h6" mb={2}>
                        {editMode ? 'Редактировать измерение' : 'Добавить новое измерение'}
                    </Typography>
                    <TextField
                        label="Название"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Краткое название"
                        name="short_name"
                        value={formData.short_name}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    <Button variant="contained" onClick={handleSubmit} fullWidth>
                        {editMode ? 'Сохранить изменения' : 'Создать'}
                    </Button>
                </Box>
            </Drawer>
        </Box>
    );
};

export default MeasurementList;
