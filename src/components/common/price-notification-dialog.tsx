import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  IconButton,
} from '@mui/material';
import { Close, NotificationsActive, NotificationsOff } from '@mui/icons-material';

interface PriceNotificationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (price: number) => Promise<{ success: boolean; message: string }>;
  onClear: () => void;
  currentPrice: number | null;
  targetPrice: number | null;
  isMonitoring: boolean;
  hasNotified: boolean;
}

const PriceNotificationDialog = ({
  open,
  onClose,
  onConfirm,
  onClear,
  currentPrice,
  targetPrice,
  isMonitoring,
  hasNotified,
}: PriceNotificationDialogProps) => {
  const [priceInput, setPriceInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && targetPrice) {
      setPriceInput(targetPrice.toFixed(2));
    } else if (open) {
      setPriceInput('');
    }
    setError(null);
  }, [open, targetPrice]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setPriceInput(value);
      setError(null);
    }
  };

  const handleConfirm = async () => {
    const price = parseFloat(priceInput);

    if (isNaN(price) || price <= 0) {
      setError('请输入有效的价格');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onConfirm(price);
      if (result.success) {
        onClose();
      } else {
        setError(result.message);
      }
    } catch {
      setError('设置失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    onClear();
    setPriceInput('');
    setError(null);
    onClose();
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      keepMounted={false}
      PaperProps={{
        sx: { borderRadius: '0.75rem' },
      }}
      TransitionProps={{
        onEntered: () => {
          const input = document.querySelector('input[name="price-input"]') as HTMLInputElement;
          if (input) {
            input.focus();
          }
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMonitoring && !hasNotified ? (
            <NotificationsActive sx={{ color: 'primary.main' }} />
          ) : hasNotified ? (
            <NotificationsOff sx={{ color: 'text.secondary' }} />
          ) : (
            <NotificationsActive sx={{ color: 'text.secondary' }} />
          )}
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            价格提醒设置
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {currentPrice && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            当前金价：¥{currentPrice.toFixed(2)}/克
          </Typography>
        )}

        {isMonitoring && !hasNotified && targetPrice && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: '0.5rem' }}>
            <Typography variant="body2">
              正在监控：当金价低于 ¥{targetPrice.toFixed(2)}/克 时将通知您
            </Typography>
          </Alert>
        )}

        {hasNotified && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: '0.5rem' }}>
            <Typography variant="body2">
              已触发通知，监控已停止
            </Typography>
          </Alert>
        )}

        <TextField
          margin="dense"
          label="目标价格（元/克）"
          type="text"
          fullWidth
          variant="outlined"
          name="price-input"
          value={priceInput}
          onChange={handlePriceChange}
          error={!!error}
          helperText={error || '当金价低于此价格时将收到通知'}
          disabled={isSubmitting}
          InputProps={{ inputProps: { inputMode: 'decimal' } }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.5rem' }, }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        {isMonitoring && (
          <Button
            onClick={handleClear}
            color="error"
            variant="outlined"
            sx={{ borderRadius: '0.5rem', textTransform: 'none' }}
          >
            取消监控
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button
          onClick={handleClose}
          color="inherit"
          sx={{ borderRadius: '0.5rem', textTransform: 'none' }}
        >
          取消
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isSubmitting || !priceInput}
          sx={{
            borderRadius: '0.5rem',
            textTransform: 'none',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            },
            '&:disabled': {
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              opacity: 0.7,
            },
          }}
        >
          {isSubmitting ? '设置中...' : '确认'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PriceNotificationDialog;