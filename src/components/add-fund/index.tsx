import { useState, useEffect, useCallback } from 'react';
import SearchFund from '@/components/search-fund';
import { Add, Close, CheckCircle, Refresh, Warning } from '@mui/icons-material';
import { AddFundProps, FundSearchResult } from '@/types/fund';
import useFundStore from '@/stores/fundStore';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Stack
} from '@mui/material';

/**
 * 添加基金对话框组件
 * 提供搜索基金、添加基金和刷新基金列表的功能
 */
const AddFund = ({ isOpen, onClose, onAddFund }: AddFundProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    allFunds,
    allFundsLoading,
    allFundsError,
    preloadAllFunds,
    searchFundsFromLocal,
    clearAllFundsCache
  } = useFundStore();

  useEffect(() => {
    if (isOpen) {
      preloadAllFunds();
    }
  }, [isOpen, preloadAllFunds]);

  const handleRetry = useCallback(() => {
    clearAllFundsCache();
    preloadAllFunds();
  }, [clearAllFundsCache, preloadAllFunds]);

  const handleSelectFund = async (fund: FundSearchResult) => {
    setIsAdding(true);
    try {
      await onAddFund(fund.code);
      setSuccessMessage(`成功添加基金: ${fund.name}`);
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 1500);
    } catch (error) {
      console.error('添加基金失败:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSearch = useCallback((keyword: string): Promise<FundSearchResult[]> => {
    return Promise.resolve(searchFundsFromLocal(keyword));
  }, [searchFundsFromLocal]);

  const handleClose = useCallback(() => {
    onClose();
    setSuccessMessage('');
  }, [onClose]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="add-fund-dialog-title"
      aria-describedby="add-fund-dialog-description"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '1rem',
          maxHeight: '90vh',
          minHeight: '542px',
        },
      }}
    >
      <DialogTitle id="add-fund-dialog-title" sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1, borderRadius: '0.5rem', display: 'flex' }}>
              <Add sx={{ width: 20, height: 20, color: 'primary.main' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              添加基金
            </Typography>
          </Stack>
          <IconButton
            edge="end"
            onClick={handleClose}
            aria-label="close"
            sx={{ color: 'text.secondary' }}
          >
            <Close sx={{ width: 20, height: 20 }} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent id="add-fund-dialog-description" sx={{ p: 3, pt: 0 }}>
        {successMessage ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4, textAlign: 'center' }}>
            <Box sx={{ bgcolor: 'success.light', p: 2, borderRadius: '50%', mb: 2 }}>
              <CheckCircle sx={{ width: 48, height: 48, color: 'success.main' }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'success.main' }}>
              {successMessage}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 400 }}>
            <Box sx={{ mb: 2, flexShrink: 0 }}>
              <Typography variant="body2" sx={{ color: 'info.main', fontSize: '0.875rem' }}>
                输入基金代码或名称搜索并添加 (例如: 000001 或 华夏成长混合)
              </Typography>
            </Box>

            {allFundsLoading && (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  正在加载基金数据...
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  首次加载需要获取全量基金列表，请稍候
                </Typography>
              </Box>
            )}

            {allFundsError && !allFundsLoading && (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ bgcolor: 'error.light', p: 2, borderRadius: '50%', mb: 2 }}>
                  <Warning sx={{ width: 48, height: 48, color: 'error.main' }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'error.main', mb: 1 }}>
                  加载失败
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  {allFundsError}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={handleRetry}
                  sx={{
                    borderRadius: '0.75rem',
                    textTransform: 'none',
                  }}
                >
                  重新加载
                </Button>
              </Box>
            )}

            {!allFundsLoading && !allFundsError && !!allFunds.length && (
              <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
                <SearchFund
                  onSearch={handleSearch}
                  onSelect={handleSelectFund}
                  isLoading={isAdding}
                  totalFunds={allFunds.length}
                />
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddFund;