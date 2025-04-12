import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
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
    Checkbox,
} from '@mui/material';
import { Print } from '@mui/icons-material';
import QRCode from 'qrcode'; // Импортируем QRCode из библиотеки 'qrcode'
import { useResources } from '../../hooks/useResources';
import { useCategories } from '../../hooks/useCategories';
import { useSubstances } from '../../hooks/useSubstances';
import { useMeasurements } from '../../hooks/useMeasurements';

const statusOptions = [
    { value: 'open', label: 'Открыт' },
    { value: 'closed', label: 'Закрыт' },
    { value: 'finish', label: 'Закончен' },
];

const PrintPage = () => {
    const [filters, setFilters] = useState({ name: '', status: '', category_id: '', substance_id: '' });
    const [selectedResources, setSelectedResources] = useState([]); // Состояние для выбранных ресурсов
    const { data: resources, isLoading } = useResources(filters);
    const { data: categories } = useCategories();
    const { data: substances } = useSubstances();
    const { data: measurements } = useMeasurements();

    const handleSelectResource = (id) => {
        setSelectedResources((prevState) =>
            prevState.includes(id)
                ? prevState.filter((resourceId) => resourceId !== id)
                : [...prevState, id]
        );
    };

    const printSelectedResources = async () => {
        const domain = window.location.origin;  // Получаем текущий домен
        const qrCodeWindow = window.open('', '_blank');

        // Создаем строку с HTML-кодом для печати
        let qrCodeHTML = `
            <html>
                <head><title>QR Codes</title></head>
                <body>
                    <h3>QR Codes for Resources</h3>
                    <div style="text-align: center;">
        `;

        // Используем async/await для генерации QR-кодов
        const qrCodePromises = resources
            .filter((res) => selectedResources.includes(res.id))
            .map(async (res) => {
                const resourceUrl = `${domain}/resources/${res.id}`; // Используем домен для построения URL

                // Генерируем QR-код в формате SVG
                const qrCodeSvg = await QRCode.toString(resourceUrl, { type: 'svg', width: 256 });

                return `<div style="margin-bottom: 20px;">
                            <h4>${res.name}</h4>
                            ${qrCodeSvg}
                        </div>`;
            });

        // Ожидаем завершения всех промисов
        const qrCodeResults = await Promise.all(qrCodePromises);

        // Добавляем сгенерированные QR-коды в HTML
        qrCodeHTML += qrCodeResults.join('');

        // Закрываем HTML
        qrCodeHTML += `
                    </div>
                    <script>
                        window.onload = function() {
                            window.print();
                        }
                    </script>
                </body>
            </html>
        `;

        // Печатаем
        qrCodeWindow.document.write(qrCodeHTML);
        qrCodeWindow.document.close();
    };

    const getMeasurementById = (measurementId) => {
        return measurements?.find((m) => m.id === measurementId);
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
                <Button variant="contained" onClick={printSelectedResources} startIcon={<Print />}>
                    Печать выбранных ресурсов
                </Button>
            </Box>

            {isLoading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Выбрать</TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell>Количество</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Категория</TableCell>
                                <TableCell>Вещество</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {resources.map((res) => {
                                const substance = substances?.find(s => s.id === res.substance_id);
                                const measurement = substance ? getMeasurementById(substance.measurement_id) : null;

                                return (
                                    <TableRow key={res.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedResources.includes(res.id)}
                                                onChange={() => handleSelectResource(res.id)}
                                            />
                                        </TableCell>
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
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default PrintPage;
