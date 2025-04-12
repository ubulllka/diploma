import React, { useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    CircularProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ScienceIcon from '@mui/icons-material/Science';
import HistoryIcon from '@mui/icons-material/History';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { useResource, useResources } from '../../hooks/useResources';
import { useCreateTaking, useTakings } from '../../hooks/useTakings';
import {useCategories} from "../../hooks/useCategories.js";
import {useSubstances} from "../../hooks/useSubstances.js";
import {useMeasurements} from "../../hooks/useMeasurements.js";

const statusOptions = [
    { value: 'open', label: 'Открыт' },
    { value: 'closed', label: 'Закрыт' },
    { value: 'finish', label: 'Закончен' },
];

const ResourceDetailPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const { data: resource, isLoading, error } = useResource(id);
    const { data: categories } = useCategories();
    const { data: substances } = useSubstances();
    const { data: measurements } = useMeasurements();
    const { data: sameResources } = useResources({
        name: '',
        substance_id: '',
        status: '',
        category_id: resource?.category_id || '',
    });

    const { data: allTakings } = useTakings();
    const { mutate: takeResource, isLoading: isTaking, isSuccess: isTaken } = useCreateTaking();

    const inUse = useMemo(() => {
        if (!allTakings || !id) return false;
        return allTakings.some(
            t => String(t.resource_id) === String(id) &&
                t.status === 'take'
        );
    }, [allTakings, id]);

    const handleTakeResource = () => {
        if (!resource || inUse) return;

        takeResource({
            resource_id: +id,
            description: '',
            status: 'take',
        });
    };

    useEffect(() => {
        if (isTaken) {
            alert(`${resource?.name} успешно взят`);
            navigate(-1);
        }
    }, [isTaken]);

    const formatDate = (date) => {
        const parsedDate = new Date(date);
        return isNaN(parsedDate) ? 'Неверная дата' : parsedDate.toLocaleDateString();
    };

    const handleResourceClick = (resourceId) => {
        navigate(`/resources/${resourceId}`);
    };

    if (isLoading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography color="error">Ошибка загрузки данных</Typography>;
    if (!resource) return <Typography>Ресурс не найден</Typography>;


    const getMeasurementById = (measurementId) => {
        return measurements?.find((m) => m.id === measurementId);
    };


    const substance = substances?.find(s => s.id === resource.substance_id);
    const measurement = substance ? getMeasurementById(substance.measurement_id) : null;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">
                    <ScienceIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {resource.name} ({formatDate(resource.product_date)})
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
                    Назад к списку
                </Button>
            </Box>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box sx={{ flex: 1, minWidth: 300 }}>
                        <Typography variant="h6" gutterBottom>Основные свойства</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <List dense>
                            <ListItem><ListItemText primary="Название" secondary={resource.name || ''} /></ListItem>
                            <ListItem><ListItemText primary="Описание" secondary={resource.description || ''} /></ListItem>
                            <ListItem><ListItemText primary="Статус" secondary={
                                statusOptions.find((s) => s.value === resource.status)?.label || resource.status

                            } /></ListItem>
                            <ListItem><ListItemText primary="Количество" secondary={ measurement ? `${resource.quantity} ${measurement.short_name}` : resource.quantity } /></ListItem>
                            <ListItem><ListItemText primary="Срок годности" secondary={formatDate(resource.expire_date)} /></ListItem>
                        </List>
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 300 }}>
                        <Typography variant="h6" gutterBottom>Дополнительная информация</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <List dense>
                            <ListItem><ListItemText primary="Дата производства" secondary={formatDate(resource.product_date)} /></ListItem>
                            <ListItem><ListItemText primary="Категория" secondary={
                                categories?.find((c) => c.id === resource.category_id)?.name || 'Не указано'
                            } /></ListItem>
                            <ListItem><ListItemText primary="Вещество" secondary={
                                substance ? (substance.formula ? `${substance.name} (${substance.formula})` : substance.name) : 'Не указано'
                            } /></ListItem>
                        </List>
                    </Box>
                </Box>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        color={inUse ? 'error' : 'primary'}
                        onClick={handleTakeResource}
                        disabled={inUse || isTaking || resource.status === 'finish'}
                        sx={{ width: 200 }}
                        startIcon={isTaking ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {inUse ? 'Уже в использовании' : isTaking ? 'Взятие...' : 'Взять'}
                    </Button>
                </Box>
            </Paper>

            {resource.history?.length > 0 && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        <HistoryIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                        История использования
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Дата</TableCell>
                                    <TableCell>Пользователь</TableCell>
                                    <TableCell align="right">Количество</TableCell>
                                    <TableCell>Цель использования</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {resource.history.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.user}</TableCell>
                                        <TableCell align="right">{item.amount}</TableCell>
                                        <TableCell>{item.purpose}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {sameResources?.length > 0 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        <LocalOfferIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Аналогичные ресурсы
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List dense>
                        {sameResources
                            .filter(item => String(item.id) !== String(id))
                            .map((item, index) => (
                                <ListItem
                                    key={index}
                                    component="div"
                                    onClick={() => handleResourceClick(item.id)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 24, height: 24 }}>
                                        <ScienceIcon fontSize="small" />
                                    </Avatar>
                                    <ListItemText primary={item.name || 'Без названия'} />
                                </ListItem>
                            ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default ResourceDetailPage;
