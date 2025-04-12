import React, { useState, useEffect } from 'react';
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
    CircularProgress,
    Alert,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useSubstances, useCreateSubstance, useUpdateSubstance, useDeleteSubstance } from '../../hooks/useSubstances';
import { useMeasurements } from '../../hooks/useMeasurements';

const SubstanceList = () => {
    const { data: substances, isLoading } = useSubstances();
    const { data: measurements } = useMeasurements(); // Получаем список измерений
    const createSubstanceMutation = useCreateSubstance();
    const updateSubstanceMutation = useUpdateSubstance();
    const deleteSubstanceMutation = useDeleteSubstance();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', formula: '', measurement_id: '' });
    const [selectedId, setSelectedId] = useState(null);

    const handleOpenDrawer = (substance = null) => {
        if (substance) {
            setFormData({
                name: substance.name,
                formula: substance.formula,
                measurement_id: substance.measurement_id
            });
            setSelectedId(substance.id);
            setEditMode(true);
        } else {
            setFormData({ name: '', formula: '', measurement_id: '' });
            setEditMode(false);
            setSelectedId(null);
        }
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        if (editMode) {
            updateSubstanceMutation.mutate({ id: selectedId, data: formData }, { onSuccess: handleCloseDrawer });
        } else {
            createSubstanceMutation.mutate(formData, { onSuccess: handleCloseDrawer });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить?')) {
            deleteSubstanceMutation.mutate(id);
        }
    };

    // Функция для получения short_name измерения по его ID
    const getMeasurementShortName = (measurementId) => {
        const measurement = measurements?.find(m => m.id === measurementId);
        return measurement ? measurement.short_name : 'Не найдено';
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Вещества</Typography>
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
                                <TableCell>Формула</TableCell>
                                <TableCell>Измерение</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {substances?.map((substance) => (
                                <TableRow key={substance.id}>
                                    <TableCell>{substance.id}</TableCell>
                                    <TableCell>{substance.name}</TableCell>
                                    <TableCell
                                        sx={{
                                            wordWrap: 'break-word', // Для переноса длинных слов
                                            maxWidth: 250, // Ограничиваем ширину
                                            whiteSpace: 'normal' // Убираем эффект одного ряда
                                        }}
                                    >
                                        {substance.formula}
                                    </TableCell>
                                    <TableCell>
                                        {getMeasurementShortName(substance.measurement_id)} {/* Выводим short_name измерения */}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            startIcon={<Edit />}
                                            onClick={() => handleOpenDrawer(substance)}
                                        >
                                            Изменить
                                        </Button>
                                        <Button
                                            size="small"
                                            startIcon={<Delete />}
                                            onClick={() => handleDelete(substance.id)}
                                            color="error" // Для красной кнопки
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
                        {editMode ? 'Редактировать вещество' : 'Добавить новое вещество'}
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
                        label="Формула"
                        name="formula"
                        value={formData.formula}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4} // Количество строк для поля ввода
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="measurement-label">Измерение</InputLabel>
                        <Select
                            labelId="measurement-label"
                            id="measurement_id"
                            name="measurement_id"
                            value={formData.measurement_id}
                            onChange={handleChange}
                            label="Измерение"
                        >
                            {measurements?.map((measurement) => (
                                <MenuItem key={measurement.id} value={measurement.id}>
                                    {measurement.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        fullWidth
                    >
                        {editMode ? 'Сохранить изменения' : 'Создать'}
                    </Button>
                </Box>
            </Drawer>
        </Box>
    );
};

export default SubstanceList;
