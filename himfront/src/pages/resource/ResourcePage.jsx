import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Drawer,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
    useResources,
    useCreateResource,
    useUpdateResource,
    useDeleteResource,
} from '../../hooks/useResources';
import { useCategories } from '../../hooks/useCategories';
import { useSubstances } from '../../hooks/useSubstances';
import { useMeasurements } from '../../hooks/useMeasurements';
import {useAuth} from "../../hooks/useAuth.js";

const statusOptions = [
    { value: 'open', label: 'Открыт' },
    { value: 'closed', label: 'Закрыт' },
    { value: 'finish', label: 'Закончен' },
];

const ResourcePage = () => {
    const navigate = useNavigate();
    const {isManager, isAdmin} = useAuth()
    const [filters, setFilters] = useState({ name: '', status: '', category_id: '', substance_id: '' });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        product_date: '',
        expire_date: '',
        quantity: '',
        description: '',
        status: '',
        category_id: '',
        substance_id: '',
    });

    const { data: resources, isLoading } = useResources(filters);
    const { data: categories } = useCategories();
    const { data: substances } = useSubstances();
    const { data: measurements } = useMeasurements();

    const createResource = useCreateResource();
    const updateResource = useUpdateResource();
    const deleteResource = useDeleteResource();

    const handleOpenDrawer = (res = null) => {
        if (res) {
            setEditMode(true);
            setSelectedId(res.id);
            setFormData(res);
        } else {
            setEditMode(false);
            setSelectedId(null);
            setFormData({
                name: '',
                product_date: '',
                expire_date: '',
                quantity: '',
                description: '',
                status: '',
                category_id: '',
                substance_id: '',
            });
        }
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => setDrawerOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const payload = {
            ...formData,
            quantity: parseFloat(formData.quantity),
        };
        editMode
            ? updateResource.mutate({ id: selectedId, data: payload }, { onSuccess: handleCloseDrawer })
            : createResource.mutate(payload, { onSuccess: handleCloseDrawer });
    };

    const handleDelete = (id) => {
        if (window.confirm('Удалить ресурс?')) {
            deleteResource.mutate(id);
        }
    };


    const getMeasurementById = (measurementId) => {
        return measurements?.find((m) => m.id === measurementId);
    };

    const handleRowClick = (id) => {
        navigate(`/resources/${id}`);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Ресурсы
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                    label="Поиск по названию"
                    name="name"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
                <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel>Статус</InputLabel>
                    <Select
                        name="status"
                        value={filters.status}
                        label="Статус"
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <MenuItem value="">
                            <em>Все</em>
                        </MenuItem>
                        {statusOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel>Категория</InputLabel>
                    <Select
                        name="category_id"
                        value={filters.category_id}
                        label="Категория"
                        onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
                    >
                        <MenuItem value="">
                            <em>Все</em>
                        </MenuItem>
                        {categories?.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Вещество</InputLabel>
                    <Select
                        name="substance_id"
                        value={filters.substance_id}
                        label="Вещество"
                        onChange={(e) => setFilters({ ...filters, substance_id: e.target.value })}
                    >
                        <MenuItem value="">
                            <em>Все</em>
                        </MenuItem>
                        {substances?.map((s) => {
                            const measurement = measurements?.find(m => m.id === s.measurement_id);
                            return (
                                <MenuItem key={s.id} value={s.id}>
                                    {s.formula ? `${s.name} (${s.formula})` : s.name}
                                    {measurement && ` - ${measurement.short_name}`}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                {(isManager || isAdmin ) &&<Button variant="contained" onClick={() => handleOpenDrawer()} startIcon={<Add />}>Добавить</Button>}
            </Box>

            {isLoading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell>Количество</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Категория</TableCell>
                                <TableCell>Вещество</TableCell>
                                {(isManager || isAdmin ) && <TableCell>Действия</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {resources.map((res) => {
                                const substance = substances?.find(s => s.id === res.substance_id);
                                const measurement = substance ? getMeasurementById(substance.measurement_id) : null;

                                return (
                                    <TableRow
                                        key={res.id}
                                        hover
                                        onClick={() => handleRowClick(res.id)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{res.id}</TableCell>
                                        <TableCell>{res.name}</TableCell>
                                        <TableCell>
                                            {res.quantity} {measurement ? measurement.short_name : ''}
                                        </TableCell>
                                        <TableCell>
                                            {statusOptions.find((s) => s.value === res.status)?.label || res.status}
                                        </TableCell>
                                        <TableCell>
                                            {categories?.find((c) => c.id === res.category_id)?.name || ''}
                                        </TableCell>
                                        <TableCell>
                                            {substance ? (substance.formula ? `${substance.name} (${substance.formula})` : substance.name) : ''}
                                        </TableCell>
                                        {(isManager || isAdmin ) &&
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Button size="small" onClick={(e) => { e.stopPropagation(); handleOpenDrawer(res); }} startIcon={<Edit />}>
                                                Изменить
                                            </Button>
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(res.id);
                                                }}
                                                startIcon={<Delete />}
                                            >
                                                Удалить
                                            </Button>
                                        </TableCell>}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
                <Box sx={{ width: 400, p: 3 }}>
                    <Typography variant="h6" mb={2}>
                        {editMode ? 'Редактировать ресурс' : 'Создать ресурс'}
                    </Typography>
                    <TextField label="Название" name="name" value={formData.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField
                        label="Дата производства"
                        type="date"
                        name="product_date"
                        value={formData.product_date}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Дата истечения срока"
                        type="date"
                        name="expire_date"
                        value={formData.expire_date}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />
                    <TextField label="Количество" name="quantity" value={formData.quantity} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField
                        label="Описание"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Статус</InputLabel>
                        <Select name="status" value={formData.status} label="Статус" onChange={handleChange}>
                            {statusOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Категория</InputLabel>
                        <Select name="category_id" value={formData.category_id} label="Категория" onChange={handleChange}>
                            {categories?.map((c) => (
                                <MenuItem key={c.id} value={c.id}>
                                    {c.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Вещество</InputLabel>
                        <Select name="substance_id" value={formData.substance_id} label="Вещество" onChange={handleChange}>
                            {substances?.map((s) => {
                                const measurement = measurements?.data?.find(m => m.id === s.measurement_id);
                                return (
                                    <MenuItem key={s.id} value={s.id}>
                                        {s.formula ? `${s.name} (${s.formula})` : s.name}
                                        {measurement && ` - ${measurement.short_name}`}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <Button fullWidth variant="contained" onClick={handleSubmit}>
                        {editMode ? 'Сохранить изменения' : 'Создать'}
                    </Button>
                </Box>
            </Drawer>
        </Box>
    );
};

export default ResourcePage;
