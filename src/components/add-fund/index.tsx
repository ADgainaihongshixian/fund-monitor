import React, { useState } from 'react';
import SearchFund from '@/components/search-fund';
import { FundSearchResult } from '@/types';
import { Add, Close, CheckCircle } from '@mui/icons-material';
import {
  Modal,
  Box,
  Typography,
  IconButton
} from '@mui/material';

interface AddFundProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFund: (code: string) => Promise<void>;
  searchFunds: (keyword: string) => Promise<FundSearchResult[]>;
}

const AddFund: React.FC<AddFundProps> = ({ isOpen, onClose, onAddFund, searchFunds }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) {
    return null;
  }

  // 处理选择基金
  const handleSelectFund = async (fund: FundSearchResult) => {
    setIsAdding(true);
    try {
      await onAddFund(fund.code);
      setSuccessMessage(`成功添加基金: ${fund.name}`);
      // 3秒后关闭模态框
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



  return (
    <Modal
      open={isOpen}
      onClose={() => {
        onClose();
        setSuccessMessage('');
      }}
      aria-labelledby="add-fund-modal-title"
      aria-describedby="add-fund-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 }
      }}
    >
      <Box sx={{
        position: 'relative',
        bgcolor: 'background.paper',
        borderRadius: '1rem',
        boxShadow: 24,
        maxWidth: { xs: '100%', sm: '90%', md: '500px' },
        maxHeight: '90vh',
        overflow: 'auto',
        animation: 'fadeIn 0.3s ease-in-out'
      }}>
        <div className="p-6 border-b border-divider flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Add className="h-5 w-5 text-primary" />
            </div>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              添加基金
            </Typography>
          </div>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => {
              onClose();
              setSuccessMessage('');
            }}
            aria-label="close"
            sx={{ color: 'text.secondary' }}
          >
            <Close className="h-5 w-5" />
          </IconButton>
        </div>

        {successMessage ? (
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-center animate-bounce-in">
              <div className="bg-success/10 p-4 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'success.main' }}>
                {successMessage}
              </Typography>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6">
              <Typography variant="body2" sx={{ color: 'info.main', mb: 0.5 }}>
                输入基金代码或名称搜索并添加
              </Typography>
              <Typography variant="body2" sx={{ color: 'info.main', fontSize: '0.875rem' }}>
                例如: 000001 或 华夏成长混合
              </Typography>
            </div>
            <SearchFund
              onSearch={searchFunds}
              onSelect={handleSelectFund}
              isLoading={isAdding}
            />
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default AddFund;