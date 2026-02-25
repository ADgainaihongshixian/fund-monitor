import React, { useState } from 'react';
import PreciousMetalList from '@/components/precious-metal-list';
import { usePreciousMetalData } from '@/hooks/usePreciousMetalData';
import { usePreciousMetalAutoRefresh } from '@/hooks/usePreciousMetalAutoRefresh';
import usePreciousMetalStore from '@/stores/preciousMetalStore';
import {
  Diamond,
  Refresh,
  Settings,
  Schedule,
  ErrorOutline,
  Close,
  Info,
} from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Container,
  Modal,
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Switch,
  CircularProgress,
} from '@mui/material';

const PreciousMetalPage: React.FC = () => {
  const { metals, isLoading, lastUpdate, error, refreshMetals } = usePreciousMetalData();
  const { isAutoRefreshEnabled } = usePreciousMetalAutoRefresh();
  const { autoRefresh, refreshInterval, setAutoRefresh, setRefreshInterval } = usePreciousMetalStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleRefreshIntervalChange = (interval: number) => {
    setRefreshInterval(interval * 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar position="sticky" color="default" elevation={2} sx={{ zIndex: 1400 }}>
        <Toolbar>
          <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: { xs: 2, sm: 3, md: 4 } }}>
            <div className="flex items-center">
              <div className="flex bg-gradient-to-r from-amber-500 to-amber-600 p-2 rounded-lg mr-3">
                <Diamond className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <Typography variant="h6" component="h1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                贵金属行情监控
              </Typography>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              <Button
                variant="contained"
                color="primary"
                onClick={refreshMetals}
                disabled={isLoading}
                sx={{
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                  fontWeight: 500,
                  px: { xs: 2.5, sm: 3 },
                  py: { xs: 1.25, sm: 1.5 },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    opacity: 0.7,
                  },
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-white/20">
                    {isLoading ? (
                      <CircularProgress size={14} sx={{ color: 'white' }} />
                    ) : (
                      <Refresh className="h-3.5 w-3.5" />
                    )}
                  </div>
                  {isLoading ? '刷新中...' : '刷新'}
                </div>
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsSettingsOpen(true)}
                sx={{
                  borderRadius: '0.75rem',
                  borderWidth: '1.5px',
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                  color: 'text.primary',
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                  fontWeight: 500,
                  px: { xs: 2.5, sm: 3 },
                  py: { xs: 1.25, sm: 1.5 },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(245, 158, 11, 0.04)',
                    borderWidth: '1.5px',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-gray-100">
                    <Settings className="h-3.5 w-3.5 text-gray-600" />
                  </div>
                  设置
                </div>
              </Button>
            </div>
          </Container>
        </Toolbar>
      </AppBar>

      <main className="container mx-auto px-3 sm:px-4 pt-24 sm:pt-28 pb-12 sm:pb-16">
        <Card variant="outlined" sx={{ mb: { xs: 4, sm: 5 }, p: { xs: 2, sm: 2.5 }, borderRadius: '0.75rem', borderColor: 'divider' }}>
          <CardContent sx={{ p: 0 }}>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isAutoRefreshEnabled ? 'bg-success' : 'bg-info'}`}></div>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>自动刷新: </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isAutoRefreshEnabled ? 'success.main' : 'info.main' }}>
                    {isAutoRefreshEnabled ? '开启' : '关闭'}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <Schedule className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-info" />
                  <Typography variant="body2" sx={{ color: 'info.main' }}>
                    最后更新: {lastUpdate || '未更新'}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Typography variant="body2" sx={{ color: 'info.main' }}>品种数量: </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{metals.length}</Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert
            severity="error"
            icon={<ErrorOutline className="h-4 sm:h-5 w-4 sm:w-5 text-danger mt-0.5 flex-shrink-0" />}
            sx={{ mb: { xs: 4, sm: 5 }, borderRadius: '0.75rem', animation: 'slideUp 0.3s ease-out' }}
          >
            <div>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'error.main', mb: 0.5 }}>操作失败</Typography>
              <Typography variant="body2" sx={{ color: 'error.main', opacity: 0.8 }}>{error}</Typography>
            </div>
          </Alert>
        )}

        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: { xs: '1rem', sm: '1.125rem' } }}>
              贵金属行情
            </Typography>
            <Typography variant="body2" sx={{ color: 'info.main' }}>
              数据来源：新浪财经
            </Typography>
          </div>
          <PreciousMetalList metals={metals} />
        </div>
      </main>

      <Modal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        aria-labelledby="settings-modal-title"
        aria-describedby="settings-modal-description"
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
          maxWidth: { xs: '100%', sm: '90%', md: '600px' },
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div className="p-6 border-b border-divider flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/10 p-2 rounded-lg">
                <Settings className="h-5 w-5 text-amber-500" />
              </div>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                设置
              </Typography>
            </div>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setIsSettingsOpen(false)}
              aria-label="close"
              sx={{ color: 'text.secondary' }}
            >
              <Close className="h-5 w-5" />
            </IconButton>
          </div>
          <div className="p-6">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5 }}>
                    自动刷新
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'info.main' }}>
                    开启后，系统将自动刷新贵金属行情数据
                  </Typography>
                </div>
                <Switch
                  checked={autoRefresh}
                  onChange={handleAutoRefreshToggle}
                  color="primary"
                  size="small"
                />
              </div>
            </div>

            <div className="mb-6">
              <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'text.primary', mb: 2 }}>
                刷新间隔
              </Typography>
              <div className="flex flex-wrap items-center gap-3">
                {[30, 60, 120, 300].map((seconds) => (
                  <Button
                    key={seconds}
                    variant={refreshInterval === seconds * 1000 ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => handleRefreshIntervalChange(seconds)}
                    disabled={!autoRefresh}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    {seconds}秒
                  </Button>
                ))}
              </div>
              <Typography variant="body2" sx={{ color: 'info.main', mt: 1.5 }}>
                设置自动刷新的时间间隔
              </Typography>
            </div>

            <div className="pt-6 border-t border-divider">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-info" />
                <Typography variant="body2" sx={{ color: 'info.main' }}>
                  提示: 频繁刷新可能会导致API调用受限
                </Typography>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default PreciousMetalPage;
