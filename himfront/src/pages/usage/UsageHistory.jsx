// UsageHistory.jsx
import React, { useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUsages } from '../../hooks/useUsages';

const UsageHistory = ({ takingId, measurement, onDelete, setUsages }) => {
    const { data: usages, isLoading } = useUsages(takingId);

    useEffect(() => {
        if (!isLoading && usages && setUsages) {
            setUsages(prev => ({ ...prev, [takingId]: usages }));
        }
    }, [usages, isLoading, takingId, setUsages]);

    if (isLoading) {
        return <Typography variant="body2">Загрузка...</Typography>;
    }

    if (!usages || usages.length === 0) {
        return <Typography variant="body2" color="textSecondary">Нет использований</Typography>;
    }

    return usages.map(usage => (
        <Box key={usage.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2">
                {new Date(usage.issue_time).toLocaleString()} — {usage.quantity} {measurement?.short_name}
            </Typography>
            <IconButton color="error" onClick={() => onDelete(usage.id)}>
                <DeleteIcon />
            </IconButton>
        </Box>
    ));
};

export default UsageHistory;
