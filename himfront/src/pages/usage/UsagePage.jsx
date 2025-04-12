import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ScienceIcon from '@mui/icons-material/Science';
import { useTakings } from '../../hooks/useTakings';
import {useResources, useSubResources} from '../../hooks/useResources';
import { useMeasurements } from "../../hooks/useMeasurements";
import { useCreateUsage, useDeleteUsage } from '../../hooks/useUsages';
import { useSubstances } from "../../hooks/useSubstances";
import { useUpdateTaking } from '../../hooks/useTakings';
import UsageHistory from './UsageHistory';

const CartPage = () => {
    const { data: takings, isLoading } = useTakings();
    const { data: resources } = useResources();
    const { data: substances } = useSubstances();
    const { data: measurements } = useMeasurements();
    const useCreateUsageMutation = useCreateUsage();
    const useDeleteUsageMutation = useDeleteUsage();
    const useUpdateTakingMutation = useUpdateTaking();
    const useSubResourcesMutation = useSubResources()

    const [searchQuery, setSearchQuery] = useState('');
    const [quantities, setQuantities] = useState({});
    const [description, setDescription] = useState({});
    const [confirmations, setConfirmations] = useState({});
    const [usagesCache, setUsagesCache] = useState({});

    if (isLoading || !resources || !takings) {
        return <Typography>Загрузка...</Typography>;
    }

    const filteredTakings = takings.filter(taking =>
        resources.some(resource => resource.id === taking.resource_id) &&
        resources.find(resource => resource.id === taking.resource_id)?.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const handleQuantityChange = (id, value) => {
        setQuantities(prev => ({ ...prev, [id]: value }));
    };

    const handleDescriptionChange = (id, value) => {
        setDescription(prev => ({ ...prev, [id]: value }));
    };

    const handleTakeReagent = (tId, quantity) => {
        const amount = parseFloat(quantity);
        if (!amount || amount <= 0) return;

        useCreateUsageMutation.mutate({ tId: tId, data: { quantity: amount } });
        setQuantities(prev => ({ ...prev, [tId]: '' }));
    };

    const handleDeleteUsage = (tId, usageId) => {
        useDeleteUsageMutation.mutate({ tId: tId, id: usageId });
    };

    const handleCheckboxChange = (id) => {
        setConfirmations(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleFinishTaking = (id,resId) => {
        const usages = usagesCache[id] || [];
        const quantities = usages.map(u => u.quantity);

        useUpdateTakingMutation.mutate({
            id,
            data: {
                status: 'pass',
                description: description[id],
            },
        });

        useSubResourcesMutation.mutate({
            id: resId,
            data: quantities,
        })
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Все взятия реагентов
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Поиск по реагентам..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                />
            </Paper>

            <List>
                {filteredTakings.map(taking => {
                    const resource = resources.find(r => r.id === taking.resource_id);
                    const substance = substances.find(s => s.id === resource?.substance_id);
                    const measurement = measurements.find(m => m.id === substance?.measurement_id);

                    return (
                        <Paper key={taking.id} sx={{ mb: 3 }}>
                            <ListItem>
                                <ListItemIcon>
                                    <ScienceIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${resource?.name} (${substance?.formula || 'Без формулы'})`}
                                    secondary={`Количество: ${resource.quantity} ${measurement?.short_name}`}
                                />
                            </ListItem>

                            <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    История использования:
                                </Typography>
                                <UsageHistory
                                    takingId={taking.id}
                                    measurement={measurement}
                                    setUsages={setUsagesCache}
                                    onDelete={usageId => handleDeleteUsage(taking.id, usageId)}
                                />
                            </Box>

                            <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <TextField
                                        label="Количество"
                                        variant="outlined"
                                        value={quantities[taking.id] || ''}
                                        onChange={(e) => handleQuantityChange(taking.id, e.target.value)}
                                        type="number"
                                    />
                                    <Typography variant="body1">{measurement?.short_name}</Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            handleTakeReagent(taking.id, quantities[taking.id])
                                        }
                                    >
                                        Взять
                                    </Button>
                                </Stack>
                            </Box>

                            <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Описание взятия:
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={description[taking.id] || taking.description}
                                    onChange={(e) => handleDescriptionChange(taking.id, e.target.value)}
                                    variant="outlined"
                                    placeholder="Введите описание взятия"
                                />
                            </Box>

                            <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={confirmations[taking.id] || false}
                                            onChange={() => handleCheckboxChange(taking.id)}
                                        />
                                    }
                                    label="Подтвердить"
                                />
                                <Button
                                    variant="outlined"
                                    color="success"
                                    disabled={!confirmations[taking.id]}
                                    onClick={() => handleFinishTaking(taking.id, taking.resource_id)}
                                >
                                    Завершить
                                </Button>
                            </Box>
                        </Paper>
                    );
                })}
            </List>
        </Box>
    );
};

export default CartPage;
