import React, {useState} from 'react';
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
    Alert
} from '@mui/material';
import {Add, Edit, Delete} from '@mui/icons-material';
import {useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory} from '../../hooks/useCategories';

const CategoryList = () => {
    const {data: categories, isLoading, isError, error} = useCategories();
    const createCategoryMutation = useCreateCategory();
    const updateCategoryMutation = useUpdateCategory();
    const deleteCategoryMutation = useDeleteCategory();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({name: '', description: ''});
    const [selectedId, setSelectedId] = useState(null);

    const handleOpenDrawer = (category = null) => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description
            });
            setSelectedId(category.id);
            setEditMode(true);
        } else {
            setFormData({name: '', description: ''});
            setEditMode(false);
            setSelectedId(null);
        }
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    const handleChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = () => {
        if (editMode) {
            updateCategoryMutation.mutate({id: selectedId, data: formData}, {onSuccess: handleCloseDrawer});
        } else {
            createCategoryMutation.mutate(formData, {onSuccess: handleCloseDrawer});
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить?')) {
            deleteCategoryMutation.mutate(id);
        }
    };

    return (
        <Box sx={{p: 4}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography variant="h4">Категории</Typography>
                <Button variant="contained" startIcon={<Add/>} onClick={() => handleOpenDrawer()}>
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
                                <TableCell>Описание</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories?.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.id}</TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell
                                        sx={{
                                            wordWrap: 'break-word', // Для переноса длинных слов
                                            maxWidth: 250, // Ограничиваем ширину
                                            whiteSpace: 'normal' // Убираем эффект одного ряда
                                        }}
                                    >
                                        {category.description}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            startIcon={<Edit />}
                                            onClick={() => handleOpenDrawer(category)}
                                        >
                                            Изменить
                                        </Button>
                                        <Button
                                            size="small"
                                            startIcon={<Delete />}
                                            onClick={() => handleDelete(category.id)}
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
                <Box sx={{width: 400, p: 3}}>
                    <Typography variant="h6" mb={2}>
                        {editMode ? 'Редактировать категорию' : 'Добавить новую категорию'}
                    </Typography>
                    <TextField
                        label="Название"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        sx={{mb: 2}}
                    />
                    <TextField
                        label="Описание"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4} // Количество строк для поля ввода
                        sx={{mb: 2}}
                    />

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

export default CategoryList;
