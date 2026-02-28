import { useState } from 'react';
import FundList from '@/components/fund-list';
import AddFund from '@/components/add-fund';
import Chart from '@/components/chart';
import SecondaryCard from '@/components/common/secondary-card';
import ErrorAlert from '@/components/common/error-alert';
import SettingDialog from '@/components/common/setting-dialog';
import BodyCom from '@/components/common/body-com';
import { useFundData } from '@/hooks/useFundData';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { FundData } from '@/types/fund';
import useFundStore from '@/stores/fundStore';
import {
  AccountBalance,
  Refresh,
  Add,
  Settings,
  Close,
} from '@mui/icons-material';
import {
  Button,
  IconButton,
  Container,
  Modal,
  Box,
  Typography,
  Badge,
  CircularProgress,
  Stack,
} from '@mui/material';

const FundPage = () => {
  const { funds, isLoading, lastUpdate, error, refreshFunds, removeFund, addFund } = useFundData();
  const { isAutoRefreshEnabled } = useAutoRefresh();
  const { autoRefresh, refreshInterval, setAutoRefresh, setRefreshInterval } = useFundStore();
  const [isAddFundOpen, setIsAddFundOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<FundData | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleAddFund = async (code: string) => {
    await addFund(code);
  };

  const handleFundClick = (fund: FundData) => {
    setSelectedFund(fund);
  };

  const handleCloseDetail = () => {
    setSelectedFund(null);
  };

  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleRefreshIntervalChange = (interval: number) => {
    setRefreshInterval(interval * 1000);
  };

  return (
    <BodyCom
      otherChildren={<>
        <AddFund
          isOpen={isAddFundOpen}
          onClose={() => setIsAddFundOpen(false)}
          onAddFund={handleAddFund}
        />
        <Modal
          open={!!selectedFund}
          onClose={handleCloseDetail}
          aria-labelledby="fund-detail-modal-title"
          aria-describedby="fund-detail-modal-description"
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
            maxWidth: { xs: '100%', sm: '90%', md: '80%', lg: '70%' },
            maxHeight: '90vh',
            overflow: 'auto',
            animation: 'fadeIn 0.3s ease-in-out'
          }}>
            <div className="p-6 border-b border-divider flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <AccountBalance className="h-5 w-5 text-primary" />
                </div>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {selectedFund?.name} 详情
                </Typography>
                <Badge variant="standard" color="primary" sx={{ fontSize: '0.75rem', border: '1px solid', borderColor: 'primary.main', backgroundColor: 'background.paper', color: 'primary.main', '& .MuiBadge-badge': { border: '1px solid', borderColor: 'primary.main', backgroundColor: 'background.paper', color: 'primary.main' } }}>
                  {selectedFund?.code}
                </Badge>
              </div>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleCloseDetail}
                aria-label="close"
                sx={{ color: 'text.secondary' }}
              >
                <Close className="h-5 w-5" />
              </IconButton>
            </div>
            <div className="p-6">
              {selectedFund && (
                <Chart fundCode={selectedFund.code} fundName={selectedFund.name} />
              )}
            </div>
          </Box>
        </Modal>
        <SettingDialog
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          autoRefresh={autoRefresh}
          handleAutoRefreshToggle={handleAutoRefreshToggle}
          refreshInterval={refreshInterval}
          handleRefreshIntervalChange={handleRefreshIntervalChange}
          tips="开启后，系统将自动刷新基金估值数据"
        />
      </>}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 0, md: 0 } }}>
        <Stack direction="row" justifyContent="end" alignItems="center" spacing={3} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={refreshFunds}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : <Refresh />}
              sx={{
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                textTransform: 'none',
                fontSize: '0.9375rem',
                fontWeight: 500,
                px: 2,
                py: 1.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  opacity: 0.7,
                },
              }}
            >
              {isLoading ? '刷新中...' : '刷新'}
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsAddFundOpen(true)}
              startIcon={<Add />}
              sx={{
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                textTransform: 'none',
                fontSize: '0.9375rem',
                fontWeight: 500,
                px: 2,
                py: 1.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              添加基金
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsSettingsOpen(true)}
              startIcon={<Settings />}
              sx={{
                borderRadius: '0.75rem',
                borderWidth: '1.5px',
                borderColor: 'rgba(0, 0, 0, 0.12)',
                color: 'text.primary',
                textTransform: 'none',
                fontSize: '0.9375rem',
                fontWeight: 500,
                px: 2,
                py: 1.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(59, 130, 246, 0.04)',
                  borderWidth: '1.5px',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              设置
            </Button>
          </Stack>
        </Stack>

        <SecondaryCard isAutoRefreshEnabled={isAutoRefreshEnabled} lastUpdate={lastUpdate} length={funds.length} />
        <ErrorAlert error={error} />

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              我的基金
            </Typography>
            {!!funds.length && (
              <Typography variant="body2" sx={{ color: 'info.main' }}>
                点击卡片查看详情
              </Typography>
            )}
          </div>
          <FundList
            funds={funds}
            onRemoveFund={removeFund}
            onFundClick={handleFundClick}
          />
        </div>
      </Container>
    </BodyCom>
  );
};

export default FundPage;